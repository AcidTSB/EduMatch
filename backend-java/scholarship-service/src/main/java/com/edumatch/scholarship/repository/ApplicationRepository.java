package com.edumatch.scholarship.repository;

import com.edumatch.scholarship.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    // Lấy các đơn đã nộp của một sinh viên
    List<Application> findByApplicantUserId(Long applicantUserId);

    // Lấy tất cả đơn nộp cho một cơ hội
    List<Application> findByOpportunityId(Long opportunityId);
}