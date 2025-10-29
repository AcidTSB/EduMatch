package com.edumatch.scholarship.service;

import com.edumatch.scholarship.dto.CreateOpportunityRequest;
import com.edumatch.scholarship.dto.OpportunityDto;
import com.edumatch.scholarship.dto.client.UserDetailDto;
import com.edumatch.scholarship.model.Opportunity;
import com.edumatch.scholarship.model.Skill;
import com.edumatch.scholarship.model.Tag;
import com.edumatch.scholarship.repository.OpportunityRepository;
import com.edumatch.scholarship.repository.SkillRepository;
import com.edumatch.scholarship.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class ScholarshipService {
    private final OpportunityRepository opportunityRepository;
    private final TagRepository tagRepository;
    private final SkillRepository skillRepository;
    private final RestTemplate restTemplate;

    @Transactional
    public OpportunityDto createOpportunity(CreateOpportunityRequest request, String userEmail) {
        // 1. Gọi sang User-Service để lấy thông tin người dùng
        String url = "http://localhost:8081/api/v1/users/details/by-email/" + userEmail;
        UserDetailDto user = restTemplate.getForObject(url, UserDetailDto.class);

        if (user == null || user.getOrganizationId() == null) {
            throw new IllegalStateException("User must belong to an organization to create an opportunity.");
        }

        // 2. Xử lý Tags và Skills: tìm hoặc tạo mới nếu chưa có
        Set<Tag> tags = new HashSet<>(request.getTags()).stream()
                .map(name -> tagRepository.findByName(name).orElseGet(() -> tagRepository.save(new Tag(null, name, null))))
                .collect(Collectors.toSet());

        Set<Skill> skills = new HashSet<>(request.getRequiredSkills()).stream()
                .map(name -> skillRepository.findByName(name).orElseGet(() -> skillRepository.save(new Skill(null, name, null))))
                .collect(Collectors.toSet());

        // 3. Tạo và lưu Opportunity
        Opportunity opportunity = Opportunity.builder()
                .title(request.getTitle())
                .fullDescription(request.getFullDescription())
                .creatorUserId(user.getId())
                .organizationId(user.getOrganizationId())
                .applicationDeadline(request.getApplicationDeadline())
                .minGpa(request.getMinGpa())
                .tags(tags)
                .requiredSkills(skills)
                .minExperienceLevel(request.getMinExperienceLevel())
                .position(request.getPosition())
                .viewsCnt(0) // Luôn đặt là 0 khi mới tạo
                .build();

        Opportunity savedOpp = opportunityRepository.save(opportunity);
        return OpportunityDto.fromEntity(savedOpp);
    }
}