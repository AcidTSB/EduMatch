package com.edumatch.scholarship.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Khóa chính kiểu Long

    // --- Tham chiếu logic ---
    // ID của User (vai trò USER) nộp đơn
    @Column(name = "applicant_user_id", nullable = false)
    private Long applicantUserId; // BẮT BUỘC là Long

    // ID của Opportunity mà họ nộp đơn
    @Column(name = "opportunity_id", nullable = false)
    private Long opportunityId; // BẮT BUỘC là Long
    // --- ----------------- ---

    // Trạng thái đơn: PENDING, APPROVED, REJECTED
    @Column(length = 50, nullable = false)
    private String status;

    @CreationTimestamp
    @Column(name = "submitted_at", updatable = false)
   private LocalDateTime submittedAt;

    // Ghi chú của nhà tuyển dụng (ví dụ: lý do từ chối)
    @Column(columnDefinition = "TEXT")
    private String notes;
}