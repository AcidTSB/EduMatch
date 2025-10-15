package com.edumatch.user.dto;

import com.edumatch.user.model.User;
import lombok.Builder;
import lombok.Data;

/**
 * DTO này chứa các thông tin chi tiết cơ bản của một User,
 * dùng để các service khác giao tiếp và lấy dữ liệu.
 */
@Data
@Builder
public class UserDetailDto {
    private Long id;
    private String email;
    private String fullName;
    private Long organizationId; // Scholarship-Service rất cần thông tin này

    /**
     * Phương thức tĩnh để chuyển đổi từ đối tượng User (Entity) sang DTO.
     * @param user Đối tượng User từ CSDL.
     * @return Một đối tượng UserDetailDto.
     */
    public static UserDetailDto fromEntity(User user) {
        return UserDetailDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                // Xử lý trường hợp user có thể không thuộc organization nào
                .organizationId(user.getOrganization() != null ? user.getOrganization().getId() : null)
                .build();
    }
}