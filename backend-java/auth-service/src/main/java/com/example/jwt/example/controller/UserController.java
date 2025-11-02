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

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/user/me")
    @PreAuthorize("hasRole('USER')")
    public UserSummary getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        return UserSummary.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getFirstName() + " " + user.getLastName())
                .build();
    }

    @GetMapping("/users/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable(value = "username") String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        UserProfile userProfile = UserProfile.builder()
                .id(user.getId())
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .build();

        return ResponseEntity.ok(userProfile);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable(value = "username") String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        userRepository.delete(user);

        return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully"));
    }
}