package com.edumatch.user.service;

import com.edumatch.user.config.JwtUtil;
import com.edumatch.user.dtos.*;
import com.edumatch.user.entity.User;
import com.edumatch.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = User.builder()
                .email(dto.getEmail())
                .passwordHash(passwordEncoder.encode(dto.getPassword()))
                .role(dto.getRole())
                .status("ACTIVE")
                .build();
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        return new AuthResponse(token, null, "Registration successful");
    }

    public AuthResponse login(LoginDto dto) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getId(), user.getRole());
        return new AuthResponse(token, null, "Login successful");
    }
}
