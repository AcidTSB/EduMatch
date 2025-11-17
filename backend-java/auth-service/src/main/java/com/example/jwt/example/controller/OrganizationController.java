package com.example.jwt.example.controller;

import com.example.jwt.example.dto.request.OrganizationRequest;
import com.example.jwt.example.dto.response.ApiResponse;
import com.example.jwt.example.dto.response.OrganizationResponse;
import com.example.jwt.example.exception.ResourceNotFoundException;
import com.example.jwt.example.model.Organization;
import com.example.jwt.example.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    /**
     * Tạo organization mới (chỉ admin)
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrganizationResponse> createOrganization(@Valid @RequestBody OrganizationRequest request) {
        Organization organization = organizationService.createOrganization(request);
        return ResponseEntity.ok(organizationService.toOrganizationResponse(organization));
    }

    /**
     * Lấy danh sách organizations với filter và pagination
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllOrganizations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean isVerified
    ) {
        Page<Organization> pageOrganizations = organizationService.getAllOrganizations(
                keyword, isActive, isVerified, page, size);
        
        Map<String, Object> response = new HashMap<>();
        response.put("organizations", organizationService.toOrganizationResponseList(pageOrganizations.getContent()));
        response.put("currentPage", pageOrganizations.getNumber());
        response.put("totalItems", pageOrganizations.getTotalElements());
        response.put("totalPages", pageOrganizations.getTotalPages());
        response.put("pageSize", pageOrganizations.getSize());
        
        return ResponseEntity.ok(response);
    }

    /**
     * Lấy organization theo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrganizationResponse> getOrganizationById(@PathVariable Long id) {
        try {
            Organization organization = organizationService.getOrganizationById(id);
            return ResponseEntity.ok(organizationService.toOrganizationResponse(organization));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Cập nhật organization (chỉ admin)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrganizationResponse> updateOrganization(
            @PathVariable Long id,
            @Valid @RequestBody OrganizationRequest request
    ) {
        try {
            Organization organization = organizationService.updateOrganization(id, request);
            return ResponseEntity.ok(organizationService.toOrganizationResponse(organization));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Xóa organization (soft delete, chỉ admin)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteOrganization(@PathVariable Long id) {
        try {
            organizationService.deleteOrganization(id);
            return ResponseEntity.ok(new ApiResponse(true, "Organization deleted successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Verify/Unverify organization (chỉ admin)
     */
    @PatchMapping("/{id}/toggle-verification")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrganizationResponse> toggleVerification(@PathVariable Long id) {
        try {
            Organization organization = organizationService.toggleVerification(id);
            return ResponseEntity.ok(organizationService.toOrganizationResponse(organization));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

