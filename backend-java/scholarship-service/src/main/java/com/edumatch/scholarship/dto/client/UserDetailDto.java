package com.edumatch.scholarship.dto.client;

import lombok.Data;

// DTO này mô tả dữ liệu mà mong đợi nhận được từ User-Service
@Data
public class UserDetailDto {
    private Long id;
    private String email;
    private String fullName;
    private Long organizationId;
}