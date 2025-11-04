package com.edumatch.scholarship.repository;

import com.edumatch.scholarship.model.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {

     // Lấy các cơ hội theo ID của người tạo (Provider)
     List<Opportunity> findByCreatorUserId(Long creatorUserId);

     // Lấy các cơ hội theo ID của tổ chức
     List<Opportunity> findByOrganizationId(Long organizationId);
}