package com.edumatch.user.controller;

import com.edumatch.user.dto.UserCreationRequest;
import com.edumatch.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.edumatch.user.dto.UserDetailDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * Controller xử lý các tác vụ liên quan đến đối tượng User gốc,
 * chủ yếu là các hoạt động nội bộ hoặc do Admin thực hiện.
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * API NỘI BỘ: Tạo hồ sơ người dùng mới sau khi đăng ký thành công.
     *
     * Endpoint này chỉ dành cho Auth-Service gọi để đồng bộ hóa dữ liệu.
     * Cần được bảo vệ ở tầng API Gateway.
     *
     * @param request Dữ liệu người dùng mới từ Auth-Service.
     * @return Thông báo tạo thành công.
     */
    @PostMapping("/internal/create")
    public ResponseEntity<String> createUserInternal(@Valid @RequestBody UserCreationRequest request) {
        userService.createUser(request);
        return new ResponseEntity<>("User profile created successfully for ID: " + request.getId(), HttpStatus.CREATED);
    }
    @GetMapping("/details/by-email/{email}")
    public ResponseEntity<UserDetailDto> getUserDetailsByEmail(@PathVariable String email) {
        UserDetailDto userDetails = userService.findUserDetailByEmail(email);
        return ResponseEntity.ok(userDetails);
    }
}