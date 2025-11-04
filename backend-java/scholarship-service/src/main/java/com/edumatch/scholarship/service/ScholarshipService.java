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


import java.util.HashSet;
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

        // --- LẤY TOKEN TỪ SECURITY CONTEXT ---
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String token = (String) authentication.getCredentials();
        // --- ------------------------------- ---

        log.info("Gọi Auth-Service để lấy thông tin cho user: {}", userDetails.getUsername());
        String username = userDetails.getUsername();

        // --- TRUYỀN TOKEN VÀO HÀM HELPER ---
        UserDetailDto user = getUserDetailsFromAuthService(username, token);
        // --- --------------------------------- ---

        // 2. XỬ LÝ TAGS VÀ SKILLS
        log.info("Xử lý Tags và Skills...");
        Set<Tag> tags = new HashSet<>(request.getTags()).stream()
                // ... (code còn lại giữ nguyên)
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
        // Chuyển đổi sang DTO trước khi gửi đi
        OpportunityDto dtoToSend = OpportunityDto.fromEntity(savedOpp);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "scholarship.created", dtoToSend);
        log.info("Đã gửi sự kiện 'scholarship.created' cho ID: {}", savedOpp.getId());

        // 5. Trả về DTO cho client
        return dtoToSend;
    }

    /**
     * Hàm helper gọi sang Auth-Service để lấy thông tin User
     */
    private UserDetailDto getUserDetailsFromAuthService(String username, String token) {
        String url = authServiceUrl + "/api/internal/user/" + username;

        // --- TẠO HEADER VÀ GẮN TOKEN ---
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token); // Gắn token vào header
        HttpEntity<Void> entity = new HttpEntity<>(headers); // Tạo entity chỉ chứa header
        // --- --------------------------- ---

        try {
            // --- SỬ DỤNG .exchange() ĐỂ GỬI REQUEST VỚI HEADER ---
            ResponseEntity<UserDetailDto> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    UserDetailDto.class
            );
            UserDetailDto user = response.getBody();
            // --- ----------------------------------------------- ---

            if (user == null || user.getId() == null || user.getOrganizationId() == null) {
                throw new ResourceNotFoundException("Không thể lấy thông tin user hoặc user không thuộc tổ chức nào.");
            }
            return user;
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("Không tìm thấy User với username: " + username + " bên Auth-Service.");
        } catch (HttpClientErrorException.Unauthorized ex) {
            // (Catch lỗi 401 nếu token bị hết hạn giữa chừng)
            log.error("Token bị từ chối bởi Auth-Service: {}", ex.getMessage());
            throw new IllegalStateException("Token không hợp lệ khi gọi Auth-Service.");
        } catch (Exception ex) {
            log.error("Lỗi khi gọi Auth-Service: {}", ex.getMessage());
            throw new IllegalStateException("Không thể kết nối tới Auth-Service.");
        }
    }
}