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
}