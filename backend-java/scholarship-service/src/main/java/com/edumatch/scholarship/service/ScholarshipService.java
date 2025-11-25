package com.edumatch.scholarship.service;

import com.edumatch.scholarship.config.RabbitMQConfig;
import com.edumatch.scholarship.dto.CreateOpportunityRequest;
import com.edumatch.scholarship.dto.OpportunityDto;
import com.edumatch.scholarship.dto.client.UserDetailDto;
import com.edumatch.scholarship.exception.ResourceNotFoundException;
import com.edumatch.scholarship.model.Opportunity;
import com.edumatch.scholarship.model.Skill;
import com.edumatch.scholarship.model.Tag;
import com.edumatch.scholarship.repository.OpportunityRepository;
import com.edumatch.scholarship.repository.SkillRepository;
import com.edumatch.scholarship.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import com.edumatch.scholarship.repository.ApplicationRepository;
import com.edumatch.scholarship.repository.ApplicationDocumentRepository;
import com.edumatch.scholarship.repository.BookmarkRepository;
import com.edumatch.scholarship.model.Application;
import com.edumatch.scholarship.dto.client.ScoreRequest; 
import com.edumatch.scholarship.dto.client.ScoreResponse; 
import com.edumatch.scholarship.dto.OpportunityDetailDto; 
import org.springframework.data.domain.Page; 
import org.springframework.data.domain.Pageable; 
import java.util.Map;
import com.edumatch.scholarship.repository.specification.OpportunitySpecification;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.time.LocalDate;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScholarshipService {

    // (Injects đã có)
    private final OpportunityRepository opportunityRepository;
    private final TagRepository tagRepository;
    private final SkillRepository skillRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationDocumentRepository applicationDocumentRepository;
    private final BookmarkRepository bookmarkRepository;
    private final RestTemplate restTemplate;
    private final RabbitTemplate rabbitTemplate;

    @Value("${app.services.matching-service.url}")
    private String matchingServiceUrl;

    @Value("${app.services.auth-service.url}")
    private String authServiceUrl;

    /**
     * Hàm helper CÔNG KHAI (public) gọi sang Auth-Service.
     * Chỉ kiểm tra ID, dùng cho BẤT KỲ user nào (Applicant, Provider).
     * ApplicationService sẽ gọi hàm này.
     */
    public UserDetailDto getUserDetailsFromAuthService(String username, String token) {
        String url = authServiceUrl + "/api/internal/user/" + username;
        
        log.info("E2E-Sync-2: Calling Auth-Service to get user details for: {}", username);
        log.debug("Auth-Service URL: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<UserDetailDto> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    UserDetailDto.class
            );
            UserDetailDto user = response.getBody();

            //Chỉ kiểm tra ID, không kiểm tra organizationId
            if (user == null || user.getId() == null) {
                throw new ResourceNotFoundException("Không thể lấy thông tin (ID) user từ Auth-Service.");
            }
            
            log.info("E2E-Sync-2: Successfully received user details from Auth-Service, userId={}", user.getId());
            return user;

        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("Không tìm thấy User với username: " + username + " bên Auth-Service.");
        } catch (HttpClientErrorException.Unauthorized ex) {
            log.error("Token bị từ chối bởi Auth-Service: {}", ex.getMessage());
            throw new IllegalStateException("Token không hợp lệ khi gọi Auth-Service.");
        } catch (Exception ex) {
            log.error("Lỗi khi gọi Auth-Service: {}", ex.getMessage());
            throw new IllegalStateException("Không thể kết nối tới Auth-Service.");
        }
    }

    /**
     * Hàm helper RIÊNG TƯ (private) cho các nghiệp vụ của Provider.
     * Đảm bảo user lấy về PHẢI CÓ organizationId.
     */
    private UserDetailDto getProviderDetails(String username, String token) {
        // 1. Gọi hàm helper chung (đã sửa ở trên)
        UserDetailDto user = getUserDetailsFromAuthService(username, token);

        // 2. Thêm kiểm tra
        if (user.getOrganizationId() == null) {
            log.error("Provider {} không có organizationId.", username);
            throw new AccessDeniedException("Tài khoản Provider phải thuộc về một tổ chức.");
        }
        return user;
    }
    /**
     * Chức năng tạo mới một cơ hội (học bổng)
     */
    @Transactional
    public OpportunityDto createOpportunity(CreateOpportunityRequest request, UserDetails userDetails) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = (String) authentication.getCredentials();
        String username = userDetails.getUsername();

        UserDetailDto user = getProviderDetails(username, token);

        log.info("Xử lý Tags và Skills...");
        Set<Tag> tags = request.getTags() != null && !request.getTags().isEmpty()
                ? request.getTags().stream()
                    .map(name -> tagRepository.findByName(name)
                            .orElseGet(() -> tagRepository.save(new Tag(null, name, null))))
                    .collect(Collectors.toSet())
                : new HashSet<>();
        Set<Skill> skills = request.getRequiredSkills() != null && !request.getRequiredSkills().isEmpty()
                ? request.getRequiredSkills().stream()
                    .map(name -> skillRepository.findByName(name)
                            .orElseGet(() -> skillRepository.save(new Skill(null, name, null))))
                    .collect(Collectors.toSet())
                : new HashSet<>();

        Opportunity opportunity = Opportunity.builder()
                .title(request.getTitle())
                .fullDescription(request.getFullDescription())
                .creatorUserId(user.getId())
                .organizationId(user.getOrganizationId())
                .applicationDeadline(request.getApplicationDeadline())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .scholarshipAmount(request.getScholarshipAmount())
                .minGpa(request.getMinGpa())
                .studyMode(request.getStudyMode())
                .level(request.getLevel())
                .isPublic(request.getIsPublic())
                .contactEmail(request.getContactEmail())
                .website(request.getWebsite())
                .moderationStatus("PENDING")
                .tags(tags)
                .requiredSkills(skills)
                .viewsCnt(0)
                .build();
        Opportunity savedOpp = opportunityRepository.save(opportunity);
        log.info("Đã tạo Opportunity mới với ID: {}", savedOpp.getId());

        OpportunityDto dtoToSend = OpportunityDto.fromEntity(savedOpp);
        
        // Publish event to RabbitMQ (non-critical, continue even if fails)
        try {
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "scholarship.created", dtoToSend);
            log.info("Đã gửi sự kiện 'scholarship.created' cho ID: {}", savedOpp.getId());
        } catch (Exception e) {
            log.warn("Failed to publish scholarship.created event for ID {}: {}", savedOpp.getId(), e.getMessage());
        }

        // Gửi notification cho Admin về học bổng mới cần duyệt
        try {
            java.util.Map<String, Object> adminNotificationEvent = new java.util.HashMap<>();
            adminNotificationEvent.put("recipientId", -1L); // -1 = Admin notifications
            adminNotificationEvent.put("title", "🎓 Học bổng mới cần duyệt");
            adminNotificationEvent.put("body", String.format("Nhà tuyển dụng đã tạo học bổng mới \"%s\" cần được duyệt", savedOpp.getTitle()));
            adminNotificationEvent.put("type", "NEW_SCHOLARSHIP_ADMIN");
            adminNotificationEvent.put("referenceId", savedOpp.getId().toString());
            adminNotificationEvent.put("opportunityId", savedOpp.getId().toString());
            adminNotificationEvent.put("opportunityTitle", savedOpp.getTitle());
            adminNotificationEvent.put("creatorUserId", savedOpp.getCreatorUserId());

            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "notification.application.status", adminNotificationEvent);
            log.info("✅ [NEW_SCHOLARSHIP_ADMIN] Đã gửi notification cho Admin về học bổng mới");
            log.info("   - Opportunity ID: {}", savedOpp.getId());
            log.info("   - Title: {}", savedOpp.getTitle());
            log.info("   - Creator ID: {}", savedOpp.getCreatorUserId());
            log.info("   - Routing key: notification.application.status");
        } catch (Exception e) {
            log.error("❌ [NEW_SCHOLARSHIP_ADMIN] Không thể gửi notification cho Admin: {}", e.getMessage(), e);
        }

        return dtoToSend;
    }

    /**
     * Lấy cơ hội do tôi tạo (GET /my)
     */
    public List<OpportunityDto> getMyOpportunities(UserDetails userDetails) {
        UserDetailDto user = getProviderDetails(userDetails.getUsername(),
                (String) SecurityContextHolder.getContext().getAuthentication().getCredentials());

        List<Opportunity> opps = opportunityRepository.findByCreatorUserId(user.getId());
        return opps.stream()
                .map(OpportunityDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật cơ hội (PUT /{id})
     */
    @Transactional
    public OpportunityDto updateOpportunity(Long id, CreateOpportunityRequest request, UserDetails userDetails) {
        UserDetailDto user = getProviderDetails(userDetails.getUsername(),
                (String) SecurityContextHolder.getContext().getAuthentication().getCredentials());

        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ hội với ID: " + id));

        if (!opp.getCreatorUserId().equals(user.getId())) {
            throw new AccessDeniedException("Bạn không có quyền cập nhật cơ hội này.");
        }

        opp.setTitle(request.getTitle());
        opp.setFullDescription(request.getFullDescription());
        opp.setApplicationDeadline(request.getApplicationDeadline());
        opp.setStartDate(request.getStartDate());
        opp.setEndDate(request.getEndDate());
        opp.setScholarshipAmount(request.getScholarshipAmount());
        opp.setStudyMode(request.getStudyMode());
        opp.setLevel(request.getLevel());
        opp.setIsPublic(request.getIsPublic());
        opp.setContactEmail(request.getContactEmail());
        opp.setWebsite(request.getWebsite());
        opp.setMinGpa(request.getMinGpa());

        Set<Tag> tags = request.getTags() != null && !request.getTags().isEmpty()
                ? request.getTags().stream()
                    .map(name -> tagRepository.findByName(name)
                            .orElseGet(() -> tagRepository.save(new Tag(null, name, null))))
                    .collect(Collectors.toSet())
                : new HashSet<>();
        opp.setTags(tags);

        Set<Skill> skills = request.getRequiredSkills() != null && !request.getRequiredSkills().isEmpty()
                ? request.getRequiredSkills().stream()
                    .map(name -> skillRepository.findByName(name)
                            .orElseGet(() -> skillRepository.save(new Skill(null, name, null))))
                    .collect(Collectors.toSet())
                : new HashSet<>();
        opp.setRequiredSkills(skills);

        Opportunity updatedOpp = opportunityRepository.save(opp);

        OpportunityDto dto = OpportunityDto.fromEntity(updatedOpp);
        
        // Publish event to RabbitMQ (non-critical, continue even if fails)
        try {
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "scholarship.updated", dto);
            log.info("Đã gửi sự kiện 'scholarship.updated' cho ID: {}", updatedOpp.getId());
        } catch (Exception e) {
            log.warn("Failed to publish scholarship.updated event for ID {}: {}", updatedOpp.getId(), e.getMessage());
        }

        return dto;
    }

    /**
     * Xóa cơ hội (DELETE /{id})
     */
    @Transactional
    public void deleteOpportunity(Long id, UserDetails userDetails) {
        UserDetailDto user = getProviderDetails(userDetails.getUsername(),
                (String) SecurityContextHolder.getContext().getAuthentication().getCredentials());

        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ hội với ID: " + id));

        if (!opp.getCreatorUserId().equals(user.getId())) {
            throw new AccessDeniedException("Bạn không có quyền xóa cơ hội này.");
        }

        bookmarkRepository.deleteAllByOpportunityId(id);
        List<Application> applications = applicationRepository.findByOpportunityId(id);
        if (applications != null && !applications.isEmpty()) {
            List<Long> appIds = applications.stream()
                    .map(Application::getId)
                    .collect(Collectors.toList());
            applicationDocumentRepository.deleteAllByApplicationIdIn(appIds);
            applicationRepository.deleteAll(applications);
        }
        opp.getTags().clear();
        opp.getRequiredSkills().clear();
        opportunityRepository.delete(opp);

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME,
                "scholarship.deleted",
                Map.of("opportunityId", id)
        );
        log.info("Đã gửi sự kiện 'scholarship.deleted' cho ID: {}", id);
    }

    /**
     * Tìm kiếm/Lọc cơ hội (phân trang)
     * (Đã cập nhật để dùng Specification)
     */
    public Page<OpportunityDto> searchOpportunities(
            // THÊM CÁC THAM SỐ NÀY VÀO
            String keyword, BigDecimal gpa, String studyMode,
            String level,
            Boolean isPublic,
            LocalDate currentDate, Pageable pageable
    ) {
        // 1. Tạo Specification từ các tham số
        Specification<Opportunity> spec = OpportunitySpecification.filterBy(
                keyword, gpa, studyMode, level, isPublic, currentDate
        );

        // 2. Thực thi Specification (Đúng rồi)
        Page<Opportunity> page = opportunityRepository.findAll(spec, pageable);

        // 3. Chuyển đổi và trả về
        return page.map(OpportunityDto::fromEntity);
    }

    /**
     * Lấy chi tiết 1 cơ hội
     * (Đã cập nhật - Kiểm tra trạng thái duyệt)
     */
    public OpportunityDetailDto getOpportunityDetails(Long opportunityId, UserDetails userDetails) {
        Opportunity opp = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ hội với ID: " + opportunityId));

        // KIỂM TRA BẢO MẬT: Chỉ cho phép xem nếu đã được duyệt
        // (Hoặc sau này: nếu user là chủ bài đăng)
        if (!"APPROVED".equals(opp.getModerationStatus())) {
            // (Tạm thời chúng ta log, nhưng sau này nên ném lỗi 403)
            log.warn("Đang truy cập cơ hội (ID: {}) chưa được duyệt.", opportunityId);
            // throw new AccessDeniedException("Cơ hội này chưa được duyệt hoặc không tồn tại.");
        }

        OpportunityDto oppDto = OpportunityDto.fromEntity(opp);
        OpportunityDetailDto detailDto = new OpportunityDetailDto(oppDto);

        if (userDetails != null) {
            log.info("User đã đăng nhập, gọi MatchingService để lấy điểm...");
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String token = (String) authentication.getCredentials();
                UserDetailDto user = getUserDetailsFromAuthService(userDetails.getUsername(), token);

                Float score = getMatchingScore(user.getId(), opportunityId);
                detailDto.setMatchScore(score);
            } catch (Exception e) {
                log.warn("Không thể lấy match score cho user {}: {}", userDetails.getUsername(), e.getMessage());
                detailDto.setMatchScore(null);
            }
        }
        return detailDto;
    }

    /*
     * Gọi Matching-Service để lấy điểm
     */
    private Float getMatchingScore(Long applicantId, Long opportunityId) {
        // (MatchingService dùng String ID)
        ScoreRequest request = new ScoreRequest(
                applicantId.toString(),
                opportunityId.toString()
        );

        String url = matchingServiceUrl + "/api/v1/match/score";

        try {
            ScoreResponse response = restTemplate.postForObject(url, request, ScoreResponse.class);
            if (response != null) {
                return response.getOverallScore();
            }
        } catch (Exception e) {
            log.error("Lỗi khi gọi MatchingService (match/score): {}", e.getMessage());
            // (Nếu MatchingService sập, không làm sập ScholarshipService)
        }
        return null;
    }
    /**
     * Lấy TẤT CẢ cơ hội (bao gồm cả PENDING) cho Admin với filter
     */
    public Page<OpportunityDto> getAllOpportunitiesForAdmin(String status, String keyword, Pageable pageable) {
        Specification<Opportunity> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Lọc theo status nếu có
            if (status != null && !status.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("moderationStatus"), status));
            }
            
            // Lọc theo keyword nếu có
            if (keyword != null && !keyword.isEmpty()) {
                String keywordLike = "%" + keyword.toLowerCase() + "%";
                predicates.add(
                        criteriaBuilder.or(
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), keywordLike),
                                criteriaBuilder.like(criteriaBuilder.lower(root.get("fullDescription")), keywordLike)
                        )
                );
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        
        Page<Opportunity> page = opportunityRepository.findAll(spec, pageable);
        return page.map(OpportunityDto::fromEntity);
    }

    /**
     * Admin cập nhật trạng thái kiểm duyệt (Duyệt/Từ chối)
     */
    @Transactional
    public OpportunityDto moderateOpportunity(Long opportunityId, String newStatus) {
        // 1. Tìm cơ hội
        Opportunity opp = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ hội với ID: " + opportunityId));

        // 2. Cập nhật trạng thái
        opp.setModerationStatus(newStatus); // Ví dụ: "APPROVED" hoặc "REJECTED"
        Opportunity savedOpp = opportunityRepository.save(opp);

        // 3. (QUAN TRỌNG) Gửi sự kiện 'updated'
        // Khi Admin duyệt bài (APPROVED), chúng ta phải báo cho MatchingService
        // biết rằng bài này "sẵn sàng" để được xử lý và hiển thị.
        if ("APPROVED".equals(newStatus)) {
            // Gửi event cho Matching Service
            OpportunityDto dto = OpportunityDto.fromEntity(savedOpp);
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "scholarship.updated", dto);
            log.info("Đã gửi sự kiện 'scholarship.updated' (Admin Approved) cho ID: {}", savedOpp.getId());
            
            // Gửi notification cho người tạo học bổng
            java.util.Map<String, Object> notificationEvent = new java.util.HashMap<>();
            notificationEvent.put("recipientId", savedOpp.getCreatorUserId()); // Gửi cho người tạo
            notificationEvent.put("creatorUserId", savedOpp.getCreatorUserId());
            notificationEvent.put("title", "Học bổng của bạn đã được duyệt!");
            notificationEvent.put("body", "Học bổng \"" + savedOpp.getTitle() + "\" đã được công khai.");
            notificationEvent.put("type", "SCHOLARSHIP_APPROVED");
            notificationEvent.put("referenceId", savedOpp.getId().toString());
            notificationEvent.put("opportunityId", savedOpp.getId().toString());
            
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "scholarship.updated", notificationEvent);
            log.info("Đã gửi notification event cho creator ID: {}", savedOpp.getCreatorUserId());
        } else if ("REJECTED".equals(newStatus)) {
            // Gửi notification cho người tạo khi bị từ chối
            java.util.Map<String, Object> notificationEvent = new java.util.HashMap<>();
            notificationEvent.put("recipientId", savedOpp.getCreatorUserId());
            notificationEvent.put("creatorUserId", savedOpp.getCreatorUserId());
            notificationEvent.put("title", "Học bổng của bạn bị từ chối");
            notificationEvent.put("body", "Học bổng \"" + savedOpp.getTitle() + "\" không được duyệt.");
            notificationEvent.put("type", "SCHOLARSHIP_REJECTED");
            notificationEvent.put("referenceId", savedOpp.getId().toString());
            notificationEvent.put("opportunityId", savedOpp.getId().toString());
            
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "scholarship.updated", notificationEvent);
            log.info("Đã gửi rejection notification cho creator ID: {}", savedOpp.getCreatorUserId());
        }

        return OpportunityDto.fromEntity(savedOpp);
    }

    /**
     * Admin lấy chi tiết một cơ hội (cho phép xem cả PENDING)
     */
    public OpportunityDetailDto getOpportunityDetailsForAdmin(Long opportunityId) {
        Opportunity opp = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ hội với ID: " + opportunityId));

        OpportunityDto oppDto = OpportunityDto.fromEntity(opp);
        OpportunityDetailDto detailDto = new OpportunityDetailDto(oppDto);
        
        // Admin không cần match score
        detailDto.setMatchScore(null);
        
        return detailDto;
    }

    /**
     * Admin xóa một cơ hội (không cần kiểm tra quyền sở hữu)
     */
    @Transactional
    public void deleteOpportunityByAdmin(Long id) {
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ hội với ID: " + id));

        // Xóa các liên kết
        bookmarkRepository.deleteAllByOpportunityId(id);
        List<Application> applications = applicationRepository.findByOpportunityId(id);
        if (applications != null && !applications.isEmpty()) {
            List<Long> appIds = applications.stream()
                    .map(Application::getId)
                    .collect(Collectors.toList());
            applicationDocumentRepository.deleteAllByApplicationIdIn(appIds);
            applicationRepository.deleteAll(applications);
        }
        opp.getTags().clear();
        opp.getRequiredSkills().clear();
        opportunityRepository.delete(opp);

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME,
                "scholarship.deleted",
                Map.of("opportunityId", id)
        );
        log.info("Admin đã xóa cơ hội với ID: {}", id);
    }

    /**
     * Lấy thống kê tổng quan cho admin dashboard
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new java.util.HashMap<>();
        
        // Thống kê scholarships (opportunities)
        long totalScholarships = opportunityRepository.count();
        long activeScholarships = opportunityRepository.findAll().stream()
                .filter(opp -> "APPROVED".equals(opp.getModerationStatus()))
                .count();
        long pendingScholarships = opportunityRepository.findAll().stream()
                .filter(opp -> "PENDING".equals(opp.getModerationStatus()))
                .count();
        
        // Thống kê applications
        long totalApplications = applicationRepository.count();
        long pendingApplications = applicationRepository.findAll().stream()
                .filter(app -> "PENDING".equals(app.getStatus()) || 
                              "SUBMITTED".equals(app.getStatus()) || 
                              "UNDER_REVIEW".equals(app.getStatus()))
                .count();
        long acceptedApplications = applicationRepository.findAll().stream()
                .filter(app -> "ACCEPTED".equals(app.getStatus()))
                .count();
        long rejectedApplications = applicationRepository.findAll().stream()
                .filter(app -> "REJECTED".equals(app.getStatus()))
                .count();
        
        stats.put("totalScholarships", totalScholarships);
        stats.put("activeScholarships", activeScholarships);
        stats.put("pendingScholarships", pendingScholarships);
        stats.put("totalApplications", totalApplications);
        stats.put("pendingApplications", pendingApplications);
        stats.put("acceptedApplications", acceptedApplications);
        stats.put("rejectedApplications", rejectedApplications);
        
        return stats;
    }

    /**
     * Increment view count for a scholarship
     */
    @Transactional
    public void incrementViewCount(Long opportunityId) {
        Opportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found with id: " + opportunityId));
        
        Integer currentViews = opportunity.getViewsCnt();
        opportunity.setViewsCnt(currentViews != null ? currentViews + 1 : 1);
        opportunityRepository.save(opportunity);
        
        log.debug("Incremented view count for opportunity {} to {}", opportunityId, opportunity.getViewsCnt());
    }
}