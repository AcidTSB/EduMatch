package com.example.jwt.example.controller;

import com.example.jwt.example.dto.response.ApiResponse;
import com.example.jwt.example.dto.UserProfile;
import com.example.jwt.example.dto.UserSummary;
import com.example.jwt.example.model.User;
import com.example.jwt.example.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.example.jwt.example.dto.UserDetailDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/user/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        // Return full user details for frontend
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("firstName", user.getFirstName());
        response.put("lastName", user.getLastName());
        response.put("enabled", user.isEnabled());
        
        // Extract role names
        java.util.List<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(java.util.stream.Collectors.toList());
        response.put("roles", roles);

        return ResponseEntity.ok(response);
    }
    /**
     * API nội bộ, dùng cho các service khác (như Scholarship-Service)
     * gọi đến để lấy thông tin chi tiết của user.
     */
    @GetMapping("/internal/user/{username}")
    // Cho phép bất kỳ ai đã xác thực (USER, EMPLOYER, ADMIN) gọi
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDetailDto> getUserDetailsForInternal(@PathVariable String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        UserDetailDto dto = UserDetailDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .organizationId(user.getOrganizationId()) // Trả về organizationId
                .build();

        return ResponseEntity.ok(dto);
    }
}