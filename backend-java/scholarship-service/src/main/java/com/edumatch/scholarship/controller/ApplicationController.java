package com.edumatch.scholarship.controller;

import com.edumatch.scholarship.dto.ApplicationDto;
import com.edumatch.scholarship.dto.CreateApplicationRequest;
import com.edumatch.scholarship.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applications") // Đường dẫn gốc cho các API Application
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    /**
     * API để Applicant (Sinh viên) nộp đơn ứng tuyển.
     * Endpoint: POST /api/applications
     */
    @PostMapping
    @PreAuthorize("hasRole('USER')") // Chỉ ROLE_USER mới được nộp đơn
    public ResponseEntity<ApplicationDto> createApplication(
            @Valid @RequestBody CreateApplicationRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        ApplicationDto createdDto = applicationService.createApplication(request, userDetails);
        return new ResponseEntity<>(createdDto, HttpStatus.CREATED);
    }
}