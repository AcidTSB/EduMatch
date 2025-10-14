package com.edumatch.user.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateApplicantProfileRequest {

    @Size(max = 400, message = "Headline must not exceed 400 characters")
    private String headline;

    @Size(max = 100, message = "Degree level must not exceed 100 characters")
    private String degreeLevel;

    @DecimalMin(value = "0.0", message = "GPA must be non-negative")
    @DecimalMax(value = "4.0", message = "GPA cannot exceed 4.0")
    private BigDecimal gpa;

    @Size(max = 255, message = "Institution name must not exceed 255 characters")
    private String institution;

    @Size(max = 100, message = "Country name must not exceed 100 characters")
    private String country;

    private String researchInterests;
}