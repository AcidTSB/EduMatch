package com.example.jwt.example.controller;

import com.example.jwt.example.dto.request.SignUpRequest;
import com.example.jwt.example.dto.response.ApiResponse;
import com.example.jwt.example.model.Role;
import com.example.jwt.example.model.User;
import com.example.jwt.example.repository.RoleRepository;
import com.example.jwt.example.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/create-employer")
    public ResponseEntity<?> createRecruiter(@RequestBody SignUpRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Username already exists"));
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Email already in use"));
        }

        // Lấy role nhà tuyển dụng (ROLE_EMPLOYER)
        Role employerRole = roleRepository.findByName("ROLE_EMPLOYER")
                .orElseThrow(() -> new RuntimeException("Employer role not found"));

        // Tạo user với role nhà tuyển dụng
        User recruiter = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .enabled(true)
                .roles(Collections.singleton(employerRole)) // dùng employerRole
                .build();

        userRepository.save(recruiter);

        return ResponseEntity.ok(new ApiResponse(true, "Recruiter created successfully"));
    }
    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody SignUpRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Username already exists"));
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Email already in use"));
        }

        // Lấy role ứng viên (ROLE_USER)
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("User role not found"));

        // Tạo user với role ứng viên
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .enabled(true)
                .roles(Collections.singleton(userRole)) // dùng userRole
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse(true, "User created successfully"));
    }
}

