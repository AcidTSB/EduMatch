package com.example.jwt.example.controller;

import com.example.jwt.example.dto.request.SignUpRequest;
import com.example.jwt.example.dto.response.ApiResponse;
import com.example.jwt.example.dto.response.UserResponse;
import com.example.jwt.example.exception.BadRequestException;
import com.example.jwt.example.exception.ResourceNotFoundException;
import com.example.jwt.example.model.AuditLog;
import com.example.jwt.example.model.User;
import com.example.jwt.example.service.UserService;
import com.example.jwt.example.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;
import org.springframework.beans.factory.annotation.Value;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final AuditLogService auditLogService;
    private final RestTemplate restTemplate;
    
    @Value("${app.services.scholarship-service.url:http://localhost:8082}")
    private String scholarshipServiceUrl;

    @PostMapping("/create-employer")
    public ResponseEntity<?> createRecruiter(@RequestBody SignUpRequest request) {
        try {
            userService.createEmployer(request);
            return ResponseEntity.ok(new ApiResponse(true, "Recruiter created successfully"));
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody SignUpRequest request) {
        try {
            userService.createUser(request);
            return ResponseEntity.ok(new ApiResponse(true, "User created successfully"));
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    // lấy tất cả user với pagination
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(required = false) String keyword
    ) {
        Page<User> pageUsers = userService.getAllUsers(role, enabled, keyword, page, size);
        List<UserResponse> responseList = userService.toUserResponseList(pageUsers.getContent());
        
        Map<String, Object> response = new HashMap<>();
        response.put("users", responseList);
        response.put("currentPage", pageUsers.getNumber());
        response.put("totalItems", pageUsers.getTotalElements());
        response.put("totalPages", pageUsers.getTotalPages());
        response.put("pageSize", pageUsers.getSize());
        
        return ResponseEntity.ok(response);
    }
    // lấy 1 user cụ thể
    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            UserResponse response = userService.toUserResponse(user);
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    // xóa 1 user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    // thay đổi trạng thái user khóa hoạc mở
    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse> toggleUserStatus(@PathVariable Long id) {
        try {
            User user = userService.toggleUserStatus(id);
            String status = user.getEnabled() ? "unlocked" : "locked";
            return ResponseEntity.ok(new ApiResponse(true, "User account " + status + " successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    // NOTE: Scholarship APIs đã được chuyển sang scholarship-service
    // Frontend sẽ gọi trực tiếp /api/opportunities/* từ scholarship-service
    // Các API sau đây đã được loại bỏ để tránh nhầm lẫn:
    // - GET /api/admin/scholarships -> Sử dụng GET /api/opportunities/all
    // - GET /api/admin/scholarships/{id} -> Sử dụng GET /api/opportunities/{id}
    // - PATCH /api/admin/scholarships/{id}/approve -> Sử dụng PUT /api/opportunities/{id}/moderate
    // - PATCH /api/admin/scholarships/{id}/reject -> Sử dụng PUT /api/opportunities/{id}/moderate
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

    /**
     * Lấy thống kê tổng quan cho admin dashboard
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats(HttpServletRequest request) {
        Map<String, Object> stats = new HashMap<>();
        
        // Thống kê users
        long totalUsers = userService.getAllUsers(null, null, null, 0, 1).getTotalElements();
        long totalStudents = userService.getAllUsers("ROLE_USER", null, null, 0, 1).getTotalElements();
        long totalEmployers = userService.getAllUsers("ROLE_EMPLOYER", null, null, 0, 1).getTotalElements();
        long totalAdmins = userService.getAllUsers("ROLE_ADMIN", null, null, 0, 1).getTotalElements();
        long activeUsers = userService.getAllUsers(null, true, null, 0, 1).getTotalElements();
        
        stats.put("totalUsers", totalUsers);
        stats.put("totalStudents", totalStudents);
        stats.put("totalEmployers", totalEmployers);
        stats.put("totalAdmins", totalAdmins);
        stats.put("activeUsers", activeUsers);
        stats.put("inactiveUsers", totalUsers - activeUsers);
        
        // Lấy thống kê scholarships và applications từ scholarship-service
        try {
            // Lấy JWT token từ request header
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                // Nếu không có token, set giá trị mặc định
                stats.put("totalScholarships", 0);
                stats.put("activeScholarships", 0);
                stats.put("pendingScholarships", 0);
                stats.put("totalApplications", 0);
                stats.put("pendingApplications", 0);
                stats.put("acceptedApplications", 0);
                stats.put("rejectedApplications", 0);
                return ResponseEntity.ok(stats);
            }
            
            // Gọi scholarship-service
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", authHeader);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            String url = scholarshipServiceUrl + "/api/opportunities/stats";
            ResponseEntity<Map> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );
            
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> scholarshipStats = response.getBody();
                stats.putAll(scholarshipStats);
            } else {
                // Nếu gọi không thành công, set giá trị mặc định
                stats.put("totalScholarships", 0);
                stats.put("activeScholarships", 0);
                stats.put("pendingScholarships", 0);
                stats.put("totalApplications", 0);
                stats.put("pendingApplications", 0);
                stats.put("acceptedApplications", 0);
                stats.put("rejectedApplications", 0);
            }
        } catch (RestClientException e) {
            // Nếu có lỗi khi gọi scholarship-service, log và set giá trị mặc định
            System.err.println("Error calling scholarship-service: " + e.getMessage());
            stats.put("totalScholarships", 0);
            stats.put("activeScholarships", 0);
            stats.put("pendingScholarships", 0);
            stats.put("totalApplications", 0);
            stats.put("pendingApplications", 0);
            stats.put("acceptedApplications", 0);
            stats.put("rejectedApplications", 0);
        }
        
        return ResponseEntity.ok(stats);
    }

}

