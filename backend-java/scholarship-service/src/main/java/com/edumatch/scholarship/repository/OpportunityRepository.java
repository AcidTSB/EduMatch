package com.edumatch.scholarship.repository;

import com.edumatch.scholarship.model.Opportunity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

@Repository

public interface OpportunityRepository extends JpaRepository<Opportunity, Long>, JpaSpecificationExecutor<Opportunity> {

     List<Opportunity> findByCreatorUserId(Long creatorUserId);
     List<Opportunity> findByOrganizationId(Long organizationId);
     Page<Opportunity> findByModerationStatus(String status, Pageable pageable);
}