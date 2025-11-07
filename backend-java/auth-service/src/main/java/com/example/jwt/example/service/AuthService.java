package com.example.jwt.example.service;

import com.example.jwt.example.dto.TokenRefreshRequest;
import com.example.jwt.example.dto.request.LoginRequest;
import com.example.jwt.example.dto.request.SignUpRequest;
import com.example.jwt.example.dto.response.JwtAuthenticationResponse;
import com.example.jwt.example.exception.BadRequestException;
import com.example.jwt.example.exception.ResourceNotFoundException;
import com.example.jwt.example.model.RefreshToken;
import com.example.jwt.example.model.Role;
import com.example.jwt.example.model.User;
import com.example.jwt.example.repository.RoleRepository;
import com.example.jwt.example.repository.UserRepository;
import com.example.jwt.example.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Service class for handling authentication operations
 * Contains business logic for login, registration, and token refresh
 */
@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final AuditLogService auditLogService;
    private final RabbitTemplate rabbitTemplate;

    /**
     * Authenticate user with username and password
     * 
     * @param loginRequest Contains username and password
     * @return JwtAuthenticationResponse with access token and refresh token
     */
    public JwtAuthenticationResponse authenticateUser(LoginRequest loginRequest) {
        log.info("Authenticating user: {}", loginRequest.getUsername());
        
        // Authenticate with Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = (User) authentication.getPrincipal();

        // Generate JWT token
        String jwt = tokenProvider.generateToken(authentication);
        
        // Create refresh token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        // Log successful login
        auditLogService.logAction(
                user.getId(),
                user.getUsername(),
                "LOGIN",
                "User",
                "Đăng nhập thành công vào hệ thống"
        );

        log.info("User {} authenticated successfully", loginRequest.getUsername());
        return new JwtAuthenticationResponse(jwt, refreshToken.getToken());
    }

    /**
     * Register new user with ROLE_USER
     * 
     * @param signUpRequest Contains user registration information
     * @return Registered user entity
     * @throws BadRequestException if username or email already exists
     */
    public User registerUser(SignUpRequest signUpRequest) {
        log.info("Registering new user: {}", signUpRequest.getUsername());
        
        // Validate username uniqueness
        validateUsernameNotExists(signUpRequest.getUsername());
        
        // Validate email uniqueness
        validateEmailNotExists(signUpRequest.getEmail());

        // Build user entity
        User user = buildUserFromSignUpRequest(signUpRequest);

        // Assign ROLE_USER
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "ROLE_USER"));

        user.setRoles(Collections.singleton(userRole));

        // Save user to database
        User savedUser = userRepository.save(user);

        // Log registration
        auditLogService.logAction(
                savedUser.getId(),
                savedUser.getUsername(),
                "REGISTER",
                "User",
                "Đăng ký tài khoản mới"
        );

        // Publish event to RabbitMQ for Matching Service
        publishUserProfileUpdatedEvent(savedUser);

        log.info("User {} registered successfully with ID: {}", savedUser.getUsername(), savedUser.getId());
        return savedUser;
    }

    /**
     * Refresh JWT access token using refresh token
     * 
     * @param request Contains refresh token
     * @return JwtAuthenticationResponse with new access token
     * @throws ResourceNotFoundException if refresh token is invalid or expired
     */
    public JwtAuthenticationResponse refreshAccessToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        log.info("Refreshing access token");

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String newToken = tokenProvider.generateTokenFromUsername(user.getUsername());
                    log.info("Access token refreshed for user: {}", user.getUsername());
                    return new JwtAuthenticationResponse(newToken, requestRefreshToken);
                })
                .orElseThrow(() -> {
                    log.error("Invalid refresh token: {}", requestRefreshToken);
                    return new ResourceNotFoundException("RefreshToken", "token", requestRefreshToken);
                });
    }

    /**
     * Validate that username does not exist
     * 
     * @param username Username to check
     * @throws BadRequestException if username already exists
     */
    private void validateUsernameNotExists(String username) {
        if (userRepository.existsByUsername(username)) {
            log.error("Username already exists: {}", username);
            throw new BadRequestException("Username is already taken!");
        }
    }

    /**
     * Validate that email does not exist
     * 
     * @param email Email to check
     * @throws BadRequestException if email already exists
     */
    private void validateEmailNotExists(String email) {
        if (userRepository.existsByEmail(email)) {
            log.error("Email already exists: {}", email);
            throw new BadRequestException("Email is already in use!");
        }
    }

    /**
     * Build User entity from SignUpRequest
     * 
     * @param request SignUpRequest containing user data
     * @return User entity with encoded password
     */
    private User buildUserFromSignUpRequest(SignUpRequest request) {
        return User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .enabled(true)
                .build();
    }

    /**
     * Publish user.profile.updated event to RabbitMQ
     * Matching Service will consume this event to create applicant features
     * 
     * @param user User entity that was registered
     */
    private void publishUserProfileUpdatedEvent(User user) {
        try {
            Map<String, Object> eventPayload = Map.of(
                    "userId", user.getId().toString(),
                    "email", user.getEmail(),
                    "skills", List.of(),  // Empty skills initially
                    "gpa", 0.0            // Default GPA
            );

            rabbitTemplate.convertAndSend(
                    "events_exchange",
                    "user.profile.updated",
                    eventPayload
            );

            log.info("Published user.profile.updated event for user ID: {} to RabbitMQ", user.getId());
        } catch (Exception e) {
            log.error("Failed to publish user.profile.updated event for user ID: {}", user.getId(), e);
            // Don't throw exception - event publishing failure shouldn't block registration
        }
    }
}
