package com.edumatch.user.dtos;

import lombok.Data;

@Data
public class LoginDto {
    private String email;
    private String password;
}