package com.example.jwt.example.controller;

import com.example.jwt.example.dto.request.SignUpRequest;
import com.example.jwt.example.dto.response.ApiResponse;
import com.example.jwt.example.dto.response.UserResponse;
import com.example.jwt.example.model.Role;
import com.example.jwt.example.model.User;
import com.example.jwt.example.repository.RoleRepository;
import com.example.jwt.example.repository.UserRepository;
import com.example.jwt.example.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;
import java.util.stream.Collectors;
import java.util.List;
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminUserService adminUserService;

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
    // lấy tất cả user
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(required = false) String keyword
    ) {
        // Lấy Page<User>
        Page<User> pageUsers = adminUserService.getAllUsers(role, enabled, keyword, page, size);

        // Chuyển sang List<UserResponse>
        List<UserResponse> responseList = pageUsers.getContent().stream()
                .map(user -> {
                    UserResponse response = new UserResponse();
                    response.setId(user.getId());
                    response.setUsername(user.getUsername());
                    response.setEmail(user.getEmail());
                    response.setFirstName(user.getFirstName());
                    response.setLastName(user.getLastName());
                    response.setRoles(
                            user.getRoles().stream()
                                    .map(roleObj -> roleObj.getName())
                                    .collect(Collectors.toSet())
                    );
                    return response;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseList);
    }
    // lấy 1 user cụ thể
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    UserResponse response = new UserResponse();
                    response.setId(user.getId());
                    response.setUsername(user.getUsername());
                    response.setEmail(user.getEmail());
                    response.setFirstName(user.getFirstName());
                    response.setLastName(user.getLastName());
                    response.setRoles(
                            user.getRoles().stream()
                                    .map(Role::getName)
                                    .collect(Collectors.toSet())
                    );
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> ResponseEntity.notFound().build()); // trả 404 nếu không tìm thấy
    }
    // xóa 1 user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user); // Xóa user khỏi DB
                    return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully"));
                })
                .orElseGet(() -> ResponseEntity
                        .badRequest()
                        .body(new ApiResponse(false, "User not found with id: " + id))
                );
    }
    // thay đổi trạng thái user khóa hoạc mở
    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse> toggleUserStatus(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setEnabled(!user.getEnabled()); // Đảo trạng thái
                    userRepository.save(user); // Lưu thay đổi
                    String status = user.getEnabled() ? "unlocked" : "locked";
                    return ResponseEntity.ok(new ApiResponse(true, "User account " + status + " successfully"));
                })
                .orElseGet(() -> ResponseEntity
                        .badRequest()
                        .body(new ApiResponse(false, "User not found with id: " + id))
                );
    }
}

