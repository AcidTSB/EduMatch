package com.edumatch.scholarship.service;

import com.edumatch.scholarship.dto.ApplicationDto;
import com.edumatch.scholarship.dto.CreateApplicationRequest;
import com.edumatch.scholarship.dto.client.UserDetailDto;
import com.edumatch.scholarship.model.Application;
import com.edumatch.scholarship.model.ApplicationDocument;
import com.edumatch.scholarship.repository.ApplicationDocumentRepository;
import com.edumatch.scholarship.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.edumatch.scholarship.config.RabbitMQConfig;
import com.edumatch.scholarship.exception.ResourceNotFoundException;
import com.edumatch.scholarship.model.Opportunity;
import com.edumatch.scholarship.repository.OpportunityRepository;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.access.AccessDeniedException;
import java.util.stream.Collectors;
import java.util.Map;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationDocumentRepository applicationDocumentRepository;

    // Chúng ta cần ScholarshipService để dùng lại hàm getUserDetails
    private final ScholarshipService scholarshipService;
    private final OpportunityRepository opportunityRepository; //để check quyền sở hữu
    private final RabbitTemplate rabbitTemplate; // để gửi email

    /**
     * Chức năng: Applicant (Sinh viên) nộp đơn ứng tuyển
     */
    @Transactional
    public ApplicationDto createApplication(CreateApplicationRequest request, UserDetails userDetails) {

        // 1. Lấy thông tin sinh viên (người đang nộp đơn)
        // dùng lại hàm helper của ScholarshipService
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = (String) authentication.getCredentials();
        UserDetailDto user = scholarshipService.getUserDetailsFromAuthService(userDetails.getUsername(), token);

        // 2. Tạo đối tượng Application (Đơn ứng tuyển)
        Application app = new Application();
        app.setApplicantUserId(user.getId());
        app.setOpportunityId(request.getOpportunityId());
        app.setStatus("PENDING");
        // app.setNotes(null); // Ghi chú (nếu có)

        // 3. Lưu Application vào DB để lấy ID
        Application savedApp = applicationRepository.save(app);
        log.info("Đã tạo đơn ứng tuyển mới với ID: {}", savedApp.getId());

        List<ApplicationDocument> savedDocs = new ArrayList<>();

        // 4. Lưu các tài liệu đính kèm (nếu có)
        if (request.getDocuments() != null && !request.getDocuments().isEmpty()) {
            for (var docDto : request.getDocuments()) {
                ApplicationDocument doc = new ApplicationDocument();
                doc.setApplicationId(savedApp.getId()); // Gán ID của đơn vừa tạo
                doc.setDocumentName(docDto.getDocumentName());
                doc.setDocumentUrl(docDto.getDocumentUrl());

                // Lưu tài liệu vào DB
                savedDocs.add(applicationDocumentRepository.save(doc));
            }
            log.info("Đã lưu {} tài liệu cho đơn ID: {}", savedDocs.size(), savedApp.getId());
        }

        // 5. Trả về DTO hoàn chỉnh (bao gồm đơn và tài liệu)
        return ApplicationDto.fromEntity(savedApp, savedDocs);
    }
    /**
     * Kiểm tra xem Provider (user) có sở hữu Opportunity (opp) không
     */
    private void checkProviderOwnership(Long opportunityId, UserDetails userDetails) {
        // 1. Lấy thông tin Provider
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = (String) authentication.getCredentials();
        UserDetailDto user = scholarshipService.getUserDetailsFromAuthService(userDetails.getUsername(), token); // Dùng hàm public là đúng

        // 2. Lấy thông tin Opportunity
        Opportunity opp = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ hội với ID: " + opportunityId));

        // 3. So sánh ID người tạo và ID người đang gọi API
        if (!opp.getCreatorUserId().equals(user.getId())) {
            log.warn("User {} không có quyền truy cập cơ hội {} của user {}", user.getId(), opp.getId(), opp.getCreatorUserId());
            throw new AccessDeniedException("Bạn không có quyền xem đơn ứng tuyển của cơ hội này.");
        }
    }

    /**
     * Lấy danh sách ứng viên đã nộp vào một cơ hội
     */
    public List<ApplicationDto> getApplicationsForOpportunity(Long opportunityId, UserDetails userDetails) {
        // 1. Kiểm tra quyền sở hữu
        checkProviderOwnership(opportunityId, userDetails);

        // 2. Lấy các đơn ứng tuyển
        List<Application> applications = applicationRepository.findByOpportunityId(opportunityId);

        // 3. Chuyển đổi sang DTO (bao gồm cả tài liệu của từng đơn)
        return applications.stream()
                .map(app -> {
                    // Lấy tài liệu của đơn này [cite: 344]
                    List<ApplicationDocument> docs = applicationDocumentRepository.findByApplicationId(app.getId());
                    return ApplicationDto.fromEntity(app, docs);
                })
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật trạng thái (Duyệt/Từ chối) một đơn ứng tuyển
     */
    @Transactional
    public ApplicationDto updateApplicationStatus(Long applicationId, String newStatus, UserDetails userDetails) {
        // 1. Tìm đơn ứng tuyển
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn ứng tuyển với ID: " + applicationId));

        // 2. Kiểm tra quyền sở hữu (thông qua cơ hội) [cite: 788]
        checkProviderOwnership(app.getOpportunityId(), userDetails);

        // 3. Cập nhật trạng thái
        app.setStatus(newStatus); // Ví dụ: "APPROVED", "REJECTED"
        Application savedApp = applicationRepository.save(app);

        // 4. GỬI SỰ KIỆN EMAIL
        // (Gửi 1 Map đơn giản chứa ID người nhận, tiêu đề, nội dung)
        // (Notification-service sẽ xử lý việc tìm email từ applicantUserId)
        Map<String, Object> emailEvent = Map.of(
                "applicantUserId", savedApp.getApplicantUserId(),
                "subject", "Cập nhật trạng thái đơn ứng tuyển",
                "body", "Trạng thái đơn ứng tuyển của bạn đã được cập nhật thành: " + newStatus
        );

        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "notification.send.email", emailEvent);
        log.info("Đã gửi sự kiện 'notification.send.email' cho user ID: {}", savedApp.getApplicantUserId());

        // 5. Trả về DTO
        List<ApplicationDocument> docs = applicationDocumentRepository.findByApplicationId(savedApp.getId());
        return ApplicationDto.fromEntity(savedApp, docs);
    }
    /**
     * Lấy danh sách các đơn ứng tuyển của user đang đăng nhập
     */
    public List<ApplicationDto> getMyApplications(UserDetails userDetails) {
        // 1. Lấy thông tin user (dùng lại hàm helper)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = (String) authentication.getCredentials();
        UserDetailDto user = scholarshipService.getUserDetailsFromAuthService(userDetails.getUsername(), token);
        Long applicantId = user.getId();

        // 2. Lấy đơn (dùng hàm repo đã có)
        List<Application> applications = applicationRepository.findByApplicantUserId(applicantId);

        // 3. Chuyển đổi sang DTO (gồm cả tài liệu)
        return applications.stream()
                .map(app -> {
                    List<ApplicationDocument> docs = applicationDocumentRepository.findByApplicationId(app.getId());
                    return ApplicationDto.fromEntity(app, docs);
                })
                .collect(Collectors.toList());
    }
}