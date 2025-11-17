package com.example.jwt.example.service;

import com.example.jwt.example.dto.request.OrganizationRequest;
import com.example.jwt.example.dto.response.OrganizationResponse;
import com.example.jwt.example.exception.BadRequestException;
import com.example.jwt.example.exception.ResourceNotFoundException;
import com.example.jwt.example.model.Organization;
import com.example.jwt.example.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    /**
     * Tạo organization mới
     */
    public Organization createOrganization(OrganizationRequest request) {
        if (organizationRepository.existsByName(request.getName())) {
            throw new BadRequestException("Organization name already exists: " + request.getName());
        }

        Organization organization = Organization.builder()
                .name(request.getName())
                .description(request.getDescription())
                .organizationType(request.getOrganizationType())
                .website(request.getWebsite())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .country(request.getCountry())
                .city(request.getCity())
                .logoUrl(request.getLogoUrl())
                .isVerified(false)
                .isActive(true)
                .build();

        Organization saved = organizationRepository.save(organization);
        log.info("Created organization: {}", saved.getName());
        return saved;
    }

    /**
     * Lấy danh sách organizations với filter và phân trang
     */
    @Transactional(readOnly = true)
    public Page<Organization> getAllOrganizations(String keyword, Boolean isActive, Boolean isVerified, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return organizationRepository.searchOrganizations(keyword, isActive, isVerified, pageable);
    }

    /**
     * Lấy organization theo ID
     */
    @Transactional(readOnly = true)
    public Organization getOrganizationById(Long id) {
        return organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization", "id", id));
    }

    /**
     * Cập nhật organization
     */
    public Organization updateOrganization(Long id, OrganizationRequest request) {
        Organization organization = getOrganizationById(id);

        // Check if name is being changed and if new name already exists
        if (!organization.getName().equals(request.getName()) && 
            organizationRepository.existsByName(request.getName())) {
            throw new BadRequestException("Organization name already exists: " + request.getName());
        }

        organization.setName(request.getName());
        organization.setDescription(request.getDescription());
        organization.setOrganizationType(request.getOrganizationType());
        organization.setWebsite(request.getWebsite());
        organization.setEmail(request.getEmail());
        organization.setPhone(request.getPhone());
        organization.setAddress(request.getAddress());
        organization.setCountry(request.getCountry());
        organization.setCity(request.getCity());
        organization.setLogoUrl(request.getLogoUrl());

        Organization updated = organizationRepository.save(organization);
        log.info("Updated organization: {}", updated.getName());
        return updated;
    }

    /**
     * Xóa organization (soft delete)
     */
    public void deleteOrganization(Long id) {
        Organization organization = getOrganizationById(id);
        organization.setIsActive(false);
        organizationRepository.save(organization);
        log.info("Deactivated organization: {}", organization.getName());
    }

    /**
     * Verify/Unverify organization
     */
    public Organization toggleVerification(Long id) {
        Organization organization = getOrganizationById(id);
        organization.setIsVerified(!organization.getIsVerified());
        Organization updated = organizationRepository.save(organization);
        log.info("{} organization: {}", updated.getIsVerified() ? "Verified" : "Unverified", updated.getName());
        return updated;
    }

    /**
     * Convert Organization entity sang OrganizationResponse DTO
     */
    public OrganizationResponse toOrganizationResponse(Organization organization) {
        return OrganizationResponse.builder()
                .id(organization.getId())
                .name(organization.getName())
                .description(organization.getDescription())
                .organizationType(organization.getOrganizationType())
                .website(organization.getWebsite())
                .email(organization.getEmail())
                .phone(organization.getPhone())
                .address(organization.getAddress())
                .country(organization.getCountry())
                .city(organization.getCity())
                .logoUrl(organization.getLogoUrl())
                .isVerified(organization.getIsVerified())
                .isActive(organization.getIsActive())
                .createdAt(organization.getCreatedAt())
                .updatedAt(organization.getUpdatedAt())
                .build();
    }

    /**
     * Convert list Organization entities sang list OrganizationResponse DTOs
     */
    public List<OrganizationResponse> toOrganizationResponseList(List<Organization> organizations) {
        return organizations.stream()
                .map(this::toOrganizationResponse)
                .collect(Collectors.toList());
    }
}

