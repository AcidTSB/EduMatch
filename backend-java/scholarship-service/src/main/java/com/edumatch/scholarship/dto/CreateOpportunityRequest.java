package com.edumatch.scholarship.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreateOpportunityRequest {
    @NotBlank(message = "Title is required")
    @Size(max = 255)
    private String title;

    @NotBlank(message = "Description is required")
    private String fullDescription;

    @NotNull(message = "Application deadline is required")
    @Future(message = "Application deadline must be in the future")
    private LocalDate applicationDeadline;

    private BigDecimal minGpa;

    private List<String> tags; // Người dùng sẽ gửi lên một danh sách tên các tag

    private List<String> requiredSkills; // Tương tự với skills

    private String minExperienceLevel;

    private String position;
}