package com.example.jwt.example.controller;

import com.example.jwt.example.dto.request.RejectScholarshipRequest;
import com.example.jwt.example.dto.request.SignUpRequest;
import com.example.jwt.example.dto.response.ApiResponse;
import com.example.jwt.example.dto.response.ScholarshipResponse;
import com.example.jwt.example.dto.response.UserResponse;
import com.example.jwt.example.model.AuditLog;
import com.example.jwt.example.model.Role;
import com.example.jwt.example.model.User;
import com.example.jwt.example.repository.RoleRepository;
import com.example.jwt.example.repository.UserRepository;
import com.example.jwt.example.service.AdminUserService;
import com.example.jwt.example.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
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
    private final AuditLogService auditLogService;

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
                .organizationId(request.getOrganizationId()) // Lưu organizationId
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
    // dữ liệu giả chưa có scholarships thật nếu có rồi kết nối với scholarships-service và ở đây chỉ gọi lại
    private List<ScholarshipResponse> mockScholarships = List.of(
            new ScholarshipResponse(1L, "Học bổng VinFuture", "VinGroup", "PENDING", "Học bổng toàn phần cho sinh viên xuất sắc"),
            new ScholarshipResponse(2L, "Học bổng Chính phủ Nhật", "JICA", "APPROVED", "Toàn phần du học Nhật Bản"),
            new ScholarshipResponse(3L, "Học bổng Techcombank", "Techcombank", "REJECTED", "Dành cho sinh viên ngành tài chính"),
            new ScholarshipResponse(4L, "Học bổng ASEAN", "Singapore Gov", "APPROVED", "Học bổng ASEAN cho sinh viên Việt Nam")
    );
    // dữ liệu giả chưa có scholarships thật
    @GetMapping("/scholarships")
    public ResponseEntity<List<ScholarshipResponse>> getAllScholarships(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String provider
    ) {
        // Lọc danh sách học bổng theo tiêu chí
        List<ScholarshipResponse> filtered = mockScholarships.stream()
                .filter(s -> status == null || s.getStatus().equalsIgnoreCase(status))
                .filter(s -> provider == null || s.getProvider().toLowerCase().contains(provider.toLowerCase()))
                .filter(s -> keyword == null || s.getTitle().toLowerCase().contains(keyword.toLowerCase())
                        || s.getDescription().toLowerCase().contains(keyword.toLowerCase()))
                .toList();

        return ResponseEntity.ok(filtered);
    }
    // dữ liệu giả chưa có scholarships thật
    @GetMapping("/scholarships/{id}")
    public ResponseEntity<ScholarshipResponse> getScholarshipById(@PathVariable Long id) {
        return mockScholarships.stream()
                .filter(s -> s.getId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    // dữ liệu giả chưa có scholarships thật
    @PatchMapping("/scholarships/{id}/approve")
    public ResponseEntity<?> approveScholarship(@PathVariable Long id) {
        for (ScholarshipResponse s : mockScholarships) {
            if (s.getId().equals(id)) {
                if ("APPROVED".equalsIgnoreCase(s.getStatus())) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse(false, "Scholarship already approved"));
                }

                s.setStatus("APPROVED");
                return ResponseEntity.ok(
                        new ApiResponse(true, "Scholarship approved successfully (ID = " + id + ")")
                );
            }
        }

        return ResponseEntity
                .status(404)
                .body(new ApiResponse(false, "Scholarship not found with id: " + id));
    }
    // dữ liệu giả chưa có scholarships thật
    @PatchMapping("/scholarships/{id}/reject")
    public ResponseEntity<?> rejectScholarship(
            @PathVariable Long id,
            @RequestBody RejectScholarshipRequest request
    ) {
        for (ScholarshipResponse s : mockScholarships) {
            if (s.getId().equals(id)) {
                if ("REJECTED".equalsIgnoreCase(s.getStatus())) {
                    return ResponseEntity.badRequest()
                            .body(new ApiResponse(false, "Scholarship already rejected"));
                }

                s.setStatus("REJECTED");
                String reason = (request.getReason() != null && !request.getReason().isEmpty())
                        ? request.getReason()
                        : "No reason provided";

                // Bạn có thể log ra hoặc lưu lý do này trong DB (nếu có)
                System.out.println("Scholarship " + id + " rejected. Reason: " + reason);

                return ResponseEntity.ok(
                        new ApiResponse(true, "Scholarship rejected successfully with reason: " + reason)
                );
            }
        }

        return ResponseEntity
                .status(404)
                .body(new ApiResponse(false, "Scholarship not found with id: " + id));
    }
    @GetMapping("/audit/logs")
    public ResponseEntity<Map<String, Object>> getAuditLogs(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());
        Page<AuditLog> logs = auditLogService.getAuditLogs(username, action, startDate, endDate, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("logs", logs.getContent());
        response.put("currentPage", logs.getNumber());
        response.put("totalItems", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());

        return ResponseEntity.ok(response);
    }
    @GetMapping("/audit/users/{id}")
    public ResponseEntity<?> getLogsByUser(
            @PathVariable("id") Long userId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<AuditLog> logs = auditLogService.getLogsByUser(userId, action, from, to, page, size);

        Map<String, Object> response = new HashMap<>();
        response.put("totalItems", logs.getTotalElements());
        response.put("totalPages", logs.getTotalPages());
        response.put("currentPage", logs.getNumber());
        response.put("logs", logs.getContent());

        return ResponseEntity.ok(response);
    }

}

