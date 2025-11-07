package com.example.jwt.example.controller;

import com.example.jwt.example.dto.request.RejectScholarshipRequest;
import com.example.jwt.example.dto.request.SignUpRequest;
import com.example.jwt.example.dto.response.ApiResponse;
import com.example.jwt.example.dto.response.ScholarshipResponse;
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
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
    // lấy tất cả user
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean enabled,
            @RequestParam(required = false) String keyword
    ) {
        Page<User> pageUsers = userService.getAllUsers(role, enabled, keyword, page, size);
        List<UserResponse> responseList = userService.toUserResponseList(pageUsers.getContent());
        return ResponseEntity.ok(responseList);
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

