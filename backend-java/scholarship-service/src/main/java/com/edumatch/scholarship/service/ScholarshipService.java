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

        // --- TẠM THỜI VÔ HIỆU HÓA ĐỂ TEST ---
        // log.info("Gọi Auth-Service để lấy thông tin cho user: {}", userDetails.getUsername());
        // String username = userDetails.getUsername();
        // UserDetailDto user = getUserDetailsFromAuthService(username);
        // --- --------------------------------- ---

        // --- DỮ LIỆU GIẢ MẠO (MOCK DATA) ĐỂ TEST ---
        // Giả sử user đăng nhập là user ID=1 và thuộc tổ chức ID=1
        log.warn("--- CHÚ Ý: ĐANG CHẠY VỚI DỮ LIỆU USER MOCK (GIẢ MẠO) ---");
        UserDetailDto user = new UserDetailDto();
        user.setId(1L); // ID của user (giả)
        user.setOrganizationId(1L); // ID của tổ chức (giã)
        // --- HẾT PHẦN GIẢ MẠO ---


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
    private UserDetailDto getUserDetailsFromAuthService(String username) {
        // QUAN TRỌNG:
        // Endpoint này ('/api/internal/user/{username}') PHẢI TỒN TẠI
        // bên Auth-Service và trả về UserDetailDto.
        // Bạn sẽ cần phải thêm API này vào Auth-Service.
        String url = authServiceUrl + "/api/internal/user/" + username;

        try {
            UserDetailDto user = restTemplate.getForObject(url, UserDetailDto.class);
            if (user == null || user.getId() == null || user.getOrganizationId() == null) {
                throw new ResourceNotFoundException("Không thể lấy thông tin user hoặc user không thuộc tổ chức nào.");
            }
            return user;
        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResourceNotFoundException("Không tìm thấy User với username: " + username + " bên Auth-Service.");
        } catch (Exception ex) {
            log.error("Lỗi khi gọi Auth-Service: {}", ex.getMessage());
            throw new IllegalStateException("Không thể kết nối tới Auth-Service.");
        }
    }
}