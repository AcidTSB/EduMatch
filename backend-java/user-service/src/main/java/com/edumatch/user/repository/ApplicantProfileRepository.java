package com.edumatch.user.repository;

import com.edumatch.user.model.ApplicantProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicantProfileRepository extends JpaRepository<ApplicantProfile, Long> {
}