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
@RequestMapping("/api/v1/opportunities")
@RequiredArgsConstructor
public class OpportunityController {

    private final ScholarshipService scholarshipService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_EMPLOYER')")
    public ResponseEntity<OpportunityDto> createOpportunity(
            @Valid @RequestBody CreateOpportunityRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        OpportunityDto createdOpportunity = scholarshipService.createOpportunity(request, userDetails.getUsername());
        return new ResponseEntity<>(createdOpportunity, HttpStatus.CREATED);
    }
}