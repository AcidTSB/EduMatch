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
import java.util.Map;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Tự động inject các repository
@Slf4j
public class ScholarshipService {

    // Inject các Repositories
    private final OpportunityRepository opportunityRepository;
    private final TagRepository tagRepository;
    private final SkillRepository skillRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationDocumentRepository applicationDocumentRepository;
    private final BookmarkRepository bookmarkRepository;

    // Inject các Bean giao tiếp
    private final RestTemplate restTemplate;
    private final RabbitTemplate rabbitTemplate;

    // Lấy URL của Auth-Service từ application.properties
    @Value("${app.services.auth-service.url}")
    private String authServiceUrl;

    /**
     * Chức năng tạo mới một cơ hội (học bổng)
     */
    @Transactional
    public OpportunityDto createOpportunity(CreateOpportunityRequest request, UserDetails userDetails) {

        // 1. GỌI AUTH-SERVICE (SYNC)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = (String) authentication.getCredentials();

        log.info("Gọi Auth-Service để lấy thông tin cho user: {}", userDetails.getUsername());
        String username = userDetails.getUsername();
        UserDetailDto user = getUserDetailsFromAuthService(username, token);

        // 2. XỬ LÝ TAGS VÀ SKILLS
        log.info("Xử lý Tags và Skills...");
        Set<Tag> tags = new HashSet<>(request.getTags()).stream()
                .map(name -> tagRepository.findByName(name)
                        .orElseGet(() -> tagRepository.save(new Tag(null, name, null))))
                .collect(Collectors.toSet());

        Set<Skill> skills = new HashSet<>(request.getRequiredSkills()).stream()
                .map(name -> skillRepository.findByName(name)
                        .orElseGet(() -> skillRepository.save(new Skill(null, name, null))))
                .collect(Collectors.toSet());

        // 3. TẠO VÀ LƯU OPPORTUNITY (DATABASE)
        Opportunity opportunity = Opportunity.builder()
                .title(request.getTitle())
                .fullDescription(request.getFullDescription())
                .creatorUserId(user.getId()) // Gán ID user từ Auth-Service
                .organizationId(user.getOrganizationId()) // Gán ID tổ chức
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

        // 4. GỬI SỰ KIỆN TỚI RABBITMQ (ASYNC)
        OpportunityDto dtoToSend = OpportunityDto.fromEntity(savedOpp);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "scholarship.created", dtoToSend);
        log.info("Đã gửi sự kiện 'scholarship.created' cho ID: {}", savedOpp.getId());

        // 5. Trả về DTO cho client
        return dtoToSend;
    }
    /**
     * Lấy cơ hội do tôi tạo (GET /my)
     */
    public List<OpportunityDto> getMyOpportunities(UserDetails userDetails) {
        // 1. Lấy thông tin user (để lấy ID)
        UserDetailDto user = getUserDetailsFromAuthService(userDetails.getUsername(),
                (String) SecurityContextHolder.getContext().getAuthentication().getCredentials());

        // 2. Lấy
        List<Opportunity> opps = opportunityRepository.findByCreatorUserId(user.getId());

        // 3. Chuyển sang DTO
        return opps.stream()
                .map(OpportunityDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Cập nhật cơ hội (PUT /{id})
     */
    @Transactional
    public OpportunityDto updateOpportunity(Long id, CreateOpportunityRequest request, UserDetails userDetails) {
        // 1. Lấy thông tin user (để kiểm tra quyền)
        UserDetailDto user = getUserDetailsFromAuthService(userDetails.getUsername(),
                (String) SecurityContextHolder.getContext().getAuthentication().getCredentials());

        // 2. Tìm cơ hội
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ hội với ID: " + id));

        // 3. KIỂM TRA QUYỀN SỞ HỮU
        if (!opp.getCreatorUserId().equals(user.getId())) {
            throw new AccessDeniedException("Bạn không có quyền cập nhật cơ hội này.");
        }

        // 4. Cập nhật các trường
        opp.setTitle(request.getTitle());
        opp.setFullDescription(request.getFullDescription());
        opp.setApplicationDeadline(request.getApplicationDeadline());
        opp.setMinGpa(request.getMinGpa());
        opp.setMinExperienceLevel(request.getMinExperienceLevel());
        opp.setPosition(request.getPosition());

        // 5. Cập nhật Tags và Skills
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

        // 6. Lưu vào DB
        Opportunity updatedOpp = opportunityRepository.save(opp);

        // 7. GỬI SỰ KIỆN "UPDATED"
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
        // 1. Lấy thông tin user (để kiểm tra quyền)
        UserDetailDto user = getUserDetailsFromAuthService(userDetails.getUsername(),
                (String) SecurityContextHolder.getContext().getAuthentication().getCredentials());

        // 2. Tìm cơ hội
        Opportunity opp = opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ hội với ID: " + id));

        // 3. KIỂM TRA QUYỀN SỞ HỮU
        if (!opp.getCreatorUserId().equals(user.getId())) {
            throw new AccessDeniedException("Bạn không có quyền xóa cơ hội này.");
        }

        // 4. XÓA DÂY CHUYỀN (Xử lý các bảng con)

        // 4.1. Xóa Bookmarks
        bookmarkRepository.deleteAllByOpportunityId(id);

        // 4.2. Xóa Applications và Documents
        List<Application> applications = applicationRepository.findByOpportunityId(id);
        if (applications != null && !applications.isEmpty()) {
            List<Long> appIds = applications.stream()
                    .map(Application::getId)
                    .collect(Collectors.toList());

            applicationDocumentRepository.deleteAllByApplicationIdIn(appIds);
            applicationRepository.deleteAll(applications);
        }

        // 4.3. Xóa liên kết Many-to-Many (Tags, Skills)
        opp.getTags().clear();
        opp.getRequiredSkills().clear();

        // 4.4. Xóa Opportunity
        opportunityRepository.delete(opp);

        // 5. GỬI SỰ KIỆN DELETED
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_NAME,
                "scholarship.deleted",
                Map.of("opportunityId", id)
        );
        log.info("Đã gửi sự kiện 'scholarship.deleted' cho ID: {}", id);
    }

    /**
     * Hàm helper gọi sang Auth-Service để lấy thông tin User
     */
    private UserDetailDto getUserDetailsFromAuthService(String username, String token) {
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

            if (user == null || user.getId() == null || user.getOrganizationId() == null) {
                throw new ResourceNotFoundException("Không thể lấy thông tin user hoặc user không thuộc tổ chức nào.");
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
}