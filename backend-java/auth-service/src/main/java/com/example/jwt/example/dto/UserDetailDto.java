package com.example.jwt.example.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDetailDto {
    private Long id;
    private String username;
    private Long organizationId;
}