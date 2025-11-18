package com.example.jwt.example.controller;

import com.example.jwt.example.dto.response.ApiResponse;
import com.example.jwt.example.dto.UserProfile;
import com.example.jwt.example.dto.UserSummary;
import com.example.jwt.example.dto.request.UpdateProfileRequest;
import com.example.jwt.example.model.User;
import com.example.jwt.example.repository.UserRepository;
import com.example.jwt.example.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.jwt.example.dto.UserDetailDto;
import jakarta.validation.Valid;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @GetMapping("/user/me")
    @PreAuthorize("hasAnyRole('USER', 'EMPLOYER')")
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
        response.put("sex", user.getSex());
        response.put("phone", user.getPhone());
        response.put("dateOfBirth", user.getDateOfBirth());
        response.put("bio", user.getBio());
        response.put("avatarUrl", user.getAvatarUrl());
        response.put("organizationId", user.getOrganizationId());
        response.put("enabled", user.isEnabled());
        response.put("status", user.getStatus());
        response.put("subscriptionType", user.getSubscriptionType());
        response.put("createdAt", user.getCreatedAt());
        response.put("updatedAt", user.getUpdatedAt());
        
        // Extract role names
        java.util.List<String> roles = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(java.util.stream.Collectors.toList());
        response.put("roles", roles);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/user/me")
    @PreAuthorize("hasAnyRole('USER', 'EMPLOYER')")
    public ResponseEntity<?> updateCurrentUser(@Valid @RequestBody UpdateProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        // Update allowed fields
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName());
        }
        if (request.getSex() != null) {
            user.setSex(request.getSex());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        User updatedUser = userRepository.save(user);

        // Return updated user details
        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("id", updatedUser.getId());
        response.put("username", updatedUser.getUsername());
        response.put("email", updatedUser.getEmail());
        response.put("firstName", updatedUser.getFirstName());
        response.put("lastName", updatedUser.getLastName());
        response.put("sex", updatedUser.getSex());
        response.put("phone", updatedUser.getPhone());
        response.put("dateOfBirth", updatedUser.getDateOfBirth());
        response.put("bio", updatedUser.getBio());
        response.put("avatarUrl", updatedUser.getAvatarUrl());
        response.put("organizationId", updatedUser.getOrganizationId());
        response.put("enabled", updatedUser.isEnabled());
        response.put("status", updatedUser.getStatus());
        response.put("subscriptionType", updatedUser.getSubscriptionType());
        response.put("createdAt", updatedUser.getCreatedAt());
        response.put("updatedAt", updatedUser.getUpdatedAt());
        
        // Extract role names
        java.util.List<String> roles = updatedUser.getRoles().stream()
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

    /**
     * Upload avatar image
     * POST /api/users/avatar
     */
    @PostMapping(value = "/users/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('USER', 'EMPLOYER')")
    public ResponseEntity<?> uploadAvatar(@RequestParam("avatar") MultipartFile file) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

            // Delete old avatar if exists
            if (user.getAvatarUrl() != null && !user.getAvatarUrl().isEmpty()) {
                fileStorageService.deleteAvatar(user.getAvatarUrl());
            }

            // Upload new avatar
            String avatarUrl = fileStorageService.uploadAvatar(file, user.getId());

            // Update user avatar URL
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("avatarUrl", avatarUrl);
            response.put("message", "Avatar uploaded successfully");

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(500)
                    .body(new ApiResponse(false, "Failed to upload avatar: " + e.getMessage()));
        }
    }
}