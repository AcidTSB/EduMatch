package com.edumatch.user.controller;

import com.edumatch.user.dto.ApplicantProfileDto;
import com.edumatch.user.dto.UpdateApplicantProfileRequest;
import com.edumatch.user.model.User;
import com.edumatch.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
public class UserProfileController {

    private final UserService userService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ApplicantProfileDto> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(userService.getApplicantProfile(user.getId()));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<ApplicantProfileDto> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateApplicantProfileRequest request) {
        return ResponseEntity.ok(userService.updateApplicantProfile(userDetails.getUsername(), request));
    }

    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()") // Bất kỳ ai đã đăng nhập đều có thể xem
    public ResponseEntity<ApplicantProfileDto> getApplicantProfileById(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getApplicantProfile(userId));
    }
}