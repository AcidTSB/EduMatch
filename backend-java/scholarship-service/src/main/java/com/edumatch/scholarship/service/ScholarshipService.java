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

import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
        Set<Tag> tags = new HashSet<>(request.getTags()).stream()
                .map(name -> tagRepository.findByName(name)
                        .orElseGet(() -> tagRepository.save(new Tag(null, name, null))))
                .collect(Collectors.toSet());
        Set<Skill> skills = new HashSet<>(request.getRequiredSkills()).stream()
                .map(name -> skillRepository.findByName(name)
                        .orElseGet(() -> skillRepository.save(new Skill(null, name, null))))
                .collect(Collectors.toSet());

        Opportunity opportunity = Opportunity.builder()
                .title(request.getTitle())
                .fullDescription(request.getFullDescription())
                .creatorUserId(user.getId())
                .organizationId(user.getOrganizationId()) // Đã được đảm bảo không null
                .applicationDeadline(request.getApplicationDeadline())
                .minGpa(request.getMinGpa())
                .tags(tags)
                .requiredSkills(skills)
                .minExperienceLevel(request.getMinExperienceLevel())
                .position(request.getPosition())
                .viewsCnt(0)
                .build();
        Opportunity savedOpp = opportunityRepository.save(opportunity);
        log.info("Đã tạo Opportunity mới với ID: {}", savedOpp.getId());

        OpportunityDto dtoToSend = OpportunityDto.fromEntity(savedOpp);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "scholarship.created", dtoToSend);
        log.info("Đã gửi sự kiện 'scholarship.created' cho ID: {}", savedOpp.getId());

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
        opp.setMinGpa(request.getMinGpa());
        opp.setMinExperienceLevel(request.getMinExperienceLevel());
        opp.setPosition(request.getPosition());

        Set<Tag> tags = new HashSet<>(request.getTags()).stream()
                .map(name -> tagRepository.findByName(name)
                        .orElseGet(() -> tagRepository.save(new Tag(null, name, null))))
                .collect(Collectors.toSet());
        opp.setTags(tags);

        Set<Skill> skills = new HashSet<>(request.getRequiredSkills()).stream()
                .map(name -> skillRepository.findByName(name)
                        .orElseGet(() -> skillRepository.save(new Skill(null, name, null))))
                .collect(Collectors.toSet());
        opp.setRequiredSkills(skills);

        Opportunity updatedOpp = opportunityRepository.save(opp);

        OpportunityDto dto = OpportunityDto.fromEntity(updatedOpp);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "scholarship.updated", dto);
        log.info("Đã gửi sự kiện 'scholarship.updated' cho ID: {}", updatedOpp.getId());

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

//    /*
//     * Tìm kiếm/Lọc cơ hội (phân trang)
//     */
//    public Page<OpportunityDto> searchOpportunities(Pageable pageable) {
//        // TODO: Xử lý logic lọc (ví dụ: ?q=, ?gpa=)
//
//        // (Tạm thời trả về tất cả để test)
//        return opportunityRepository.findAll(pageable)
//                .map(OpportunityDto::fromEntity);
//    }
//
//    /*
//     * Lấy chi tiết 1 cơ hội
//     */
//    public OpportunityDetailDto getOpportunityDetails(Long opportunityId, UserDetails userDetails) {
//        // 1. Lấy cơ hội
//        Opportunity opp = opportunityRepository.findById(opportunityId)
//                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ hội với ID: " + opportunityId));
//
//        OpportunityDto oppDto = OpportunityDto.fromEntity(opp);
//        OpportunityDetailDto detailDto = new OpportunityDetailDto(oppDto);
//
//        // 2. Nếu user đã đăng nhập -> Gọi MatchingService
//        if (userDetails != null) {
//            log.info("User đã đăng nhập, gọi MatchingService để lấy điểm...");
//            try {
//                // Lấy thông tin user (dùng lại hàm helper)
//                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//                String token = (String) authentication.getCredentials();
//                UserDetailDto user = getUserDetailsFromAuthService(userDetails.getUsername(), token);
//
//                // Gọi MatchingService
//                Float score = getMatchingScore(user.getId(), opportunityId);
//                detailDto.setMatchScore(score);
//
//            } catch (Exception e) {
//                log.warn("Không thể lấy match score cho user {}: {}", userDetails.getUsername(), e.getMessage());
//                detailDto.setMatchScore(null); // Không sao, vẫn trả về thông tin
//            }
//        }
//
//        return detailDto;
//    }
//
//    /*
//     * Gọi Matching-Service để lấy điểm
//     */
//    private Float getMatchingScore(Long applicantId, Long opportunityId) {
//        // (MatchingService dùng String ID)
//        ScoreRequest request = new ScoreRequest(
//                applicantId.toString(),
//                opportunityId.toString()
//        );
//
//        String url = matchingServiceUrl + "/api/v1/match/score";
//
//        try {
//            ScoreResponse response = restTemplate.postForObject(url, request, ScoreResponse.class);
//            if (response != null) {
//                return response.getOverallScore();
//            }
//        } catch (Exception e) {
//            log.error("Lỗi khi gọi MatchingService (match/score): {}", e.getMessage());
//            // (Nếu MatchingService sập, không làm sập ScholarshipService)
//        }
//        return null;
//    }
}