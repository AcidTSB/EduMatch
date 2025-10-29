package com.edumatch.scholarship.dto;

import com.edumatch.scholarship.model.Opportunity;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.stream.Collectors;
import java.util.List;

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

    public static OpportunityDto fromEntity(Opportunity opp) {
        return OpportunityDto.builder()
                .id(opp.getId())
                .title(opp.getTitle())
                .description(opp.getFullDescription())
                .organizationId(opp.getOrganizationId())
                .creatorUserId(opp.getCreatorUserId())
                .applicationDeadline(opp.getApplicationDeadline())
                .minGpa(opp.getMinGpa())
                .tags(opp.getTags().stream().map(tag -> tag.getName()).collect(Collectors.toList()))
                .requiredSkills(opp.getRequiredSkills().stream().map(skill -> skill.getName()).collect(Collectors.toList()))
                .minExperienceLevel(opp.getMinExperienceLevel())
                .position(opp.getPosition())
                .viewsCnt(opp.getViewsCnt())
                .build();
    }
}