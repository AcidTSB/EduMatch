//package com.edumatch.scholarship.controller;
//
//import com.edumatch.scholarship.dto.OpportunityDetailDto;
//import com.edumatch.scholarship.dto.OpportunityDto;
//import com.edumatch.scholarship.service.ScholarshipService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/scholarships") // Đường dẫn gốc
//@RequiredArgsConstructor
//public class ScholarshipPublicController {
//
//    private final ScholarshipService scholarshipService;
//
//    /**
//     * API để Public/Applicant tìm kiếm, lọc cơ hội
//     * Endpoint: GET /api/scholarships
//     */
//    @GetMapping
//    public ResponseEntity<Page<OpportunityDto>> searchOpportunities(Pageable pageable) {
//        Page<OpportunityDto> results = scholarshipService.searchOpportunities(pageable);
//        return ResponseEntity.ok(results);
//    }
//
//    /**
//     * API để Public/Applicant xem chi tiết 1 cơ hội
//     * Endpoint: GET /api/scholarships/{id}
//     */
//    @GetMapping("/{id}")
//    public ResponseEntity<OpportunityDetailDto> getOpportunityById(
//            @PathVariable Long id,
//            @AuthenticationPrincipal UserDetails userDetails
//    ) {
//        OpportunityDetailDto dto = scholarshipService.getOpportunityDetails(id, userDetails);
//        return ResponseEntity.ok(dto);
//    }
//}