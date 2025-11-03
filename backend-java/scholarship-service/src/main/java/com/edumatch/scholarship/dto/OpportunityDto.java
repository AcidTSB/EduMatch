package com.edumatch.scholarship.dto;

import com.edumatch.scholarship.model.Opportunity;
import com.edumatch.scholarship.model.Skill;
import com.edumatch.scholarship.model.Tag;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
public class OpportunityDto {
    private Long id;
    private String title;
    private String description;
    private Long organizationId;
    private Long creatorUserId;
    private LocalDate applicationDeadline;
    private BigDecimal minGpa;
    private List<String> tags;
    private List<String> requiredSkills;
    private String minExperienceLevel;
    private String position;
    private Integer viewsCnt;

    // Hàm helper để chuyển từ Entity (Database) -> DTO (API)
    public static OpportunityDto fromEntity(Opportunity opp) {
        return OpportunityDto.builder()
                .id(opp.getId())
                .title(opp.getTitle())
                .description(opp.getFullDescription())
                .organizationId(opp.getOrganizationId())
                .creatorUserId(opp.getCreatorUserId())
                .applicationDeadline(opp.getApplicationDeadline())
                .minGpa(opp.getMinGpa())
                // Chuyển Set<Tag> (Object) thành List<String> (Tên)
                .tags(opp.getTags().stream()
                        .map(Tag::getName)
                        .collect(Collectors.toList()))
                // Chuyển Set<Skill> (Object) thành List<String> (Tên)
                .requiredSkills(opp.getRequiredSkills().stream()
                        .map(Skill::getName)
                        .collect(Collectors.toList()))
                .minExperienceLevel(opp.getMinExperienceLevel())
                .position(opp.getPosition())
                .viewsCnt(opp.getViewsCnt())
                .build();
    }
}
