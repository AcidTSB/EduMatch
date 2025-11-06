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
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    //API để Provider lấy danh sách các cơ hội HỌ ĐÃ TẠO.
    @GetMapping("/my")
    @PreAuthorize("hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<List<OpportunityDto>> getMyOpportunities(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<OpportunityDto> myOpps = scholarshipService.getMyOpportunities(userDetails);
        return ResponseEntity.ok(myOpps);
    }

    //API để Provider cập nhật
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<OpportunityDto> updateOpportunity(
            @PathVariable Long id,
            @Valid @RequestBody CreateOpportunityRequest request, // Dùng lại DTO tạo
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        OpportunityDto updatedOpp = scholarshipService.updateOpportunity(id, request, userDetails);
        return ResponseEntity.ok(updatedOpp);
    }

    //API để Provider xóa
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<Void> deleteOpportunity(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        scholarshipService.deleteOpportunity(id, userDetails);
        return ResponseEntity.noContent().build(); // Trả về 204 No Content
    }


}
