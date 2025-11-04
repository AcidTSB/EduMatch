package com.edumatch.scholarship.controller;

import com.edumatch.scholarship.dto.CreateOpportunityRequest;
import com.edumatch.scholarship.dto.OpportunityDto;
import com.edumatch.scholarship.service.ScholarshipService;
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
@RequestMapping("/api/opportunities") // Đường dẫn gốc cho các API Opportunity
@RequiredArgsConstructor
public class OpportunityController {

    private final ScholarshipService scholarshipService;

    /**
     * API để Provider (Employer) tạo một cơ hội/học bổng mới.
     * Endpoint: POST /api/opportunities
     */
    @PostMapping
    // Yêu cầu user phải có vai trò 'ROLE_EMPLOYER' (giống Auth-Service)
    @PreAuthorize("hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<OpportunityDto> createOpportunity(
            // @Valid: Kích hoạt validation cho DTO (check @NotBlank, @Future...)
            @Valid @RequestBody CreateOpportunityRequest request,

            // @AuthenticationPrincipal: Lấy thông tin user (đã được giải mã từ JWT)
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // 1. Gọi service layer để xử lý logic
        OpportunityDto createdOpportunity = scholarshipService.createOpportunity(request, userDetails);

        // 2. Trả về DTO với status 201 CREATED
        return new ResponseEntity<>(createdOpportunity, HttpStatus.CREATED);
    }

    // Sẽ thêm các API khác như GET, PUT, DELETE vào sau
}
