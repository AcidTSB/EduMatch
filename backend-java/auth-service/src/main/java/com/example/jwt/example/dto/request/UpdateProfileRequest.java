package com.example.jwt.example.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateProfileRequest {
    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @Size(max = 10)
    private String sex; // MALE, FEMALE, OTHER

    @Size(max = 20)
    private String phone;

    private LocalDate dateOfBirth;

    @Size(max = 2000)
    private String bio;

    @Size(max = 500)
    private String avatarUrl;
}

