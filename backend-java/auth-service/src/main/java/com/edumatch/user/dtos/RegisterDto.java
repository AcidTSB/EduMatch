package com.edumatch.user.dtos;

import lombok.Data;

@Data
public class RegisterDto {
    private String email;
    private String password;
    private String role; // ROLE_USER / ROLE_ADMIN
}
