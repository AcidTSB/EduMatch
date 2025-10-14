package com.edumatch.user.dto;

import com.edumatch.user.model.ApplicantProfile;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ApplicantProfileDto {
    private Long userId;
    private String fullName;
    private String email;
    private String headline;
    private String degreeLevel;
    private BigDecimal gpa;
    private String institution;
    private String country;
    private String researchInterests;
    private LocalDateTime updatedAt;

    // Phương thức giúp chuyển đổi từ Entity sang DTO một cách tiện lợi
    public static ApplicantProfileDto fromEntity(ApplicantProfile profile) {
        return ApplicantProfileDto.builder()
                .userId(profile.getUser().getId())
                .fullName(profile.getUser().getFullName())
                .email(profile.getUser().getEmail())
                .headline(profile.getHeadline())
                .degreeLevel(profile.getDegreeLevel())
                .gpa(profile.getGpa())
                .institution(profile.getInstitution())
                .country(profile.getCountry())
                .researchInterests(profile.getResearchInterests())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}