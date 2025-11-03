package com.edumatch.scholarship.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "opportunities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Opportunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Khóa chính kiểu Long

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "full_description", columnDefinition = "TEXT")
    private String fullDescription;

    // --- Tham chiếu logic tới Auth-Service ---
    // Đây là ID của User (vai trò EMPLOYER) đã tạo ra opportunity này
    @Column(name = "creator_user_id", nullable = false)
    private Long creatorUserId; // BẮT BUỘC là Long

    // Giả định Organization cũng được quản lý bởi Auth-Service
    // chỉ lưu ID
    @Column(name = "organization_id", nullable = false)
    private Long organizationId; // BẮT BUỘC là Long
    // --- --------------------------------- ---

    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    @Column(name = "min_gpa", precision = 3, scale = 2)
    private BigDecimal minGpa;

    @Column(name = "min_experience_level", length = 100)
    private String minExperienceLevel;

    @Column(name = "position", length = 255)
    private String position;

    @Column(name = "views_cnt")
    private Integer viewsCnt = 0;

    // --- Mối quan hệ Nhiều-Nhiều (Owner) ---
    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "opportunity_to_tags",
            joinColumns = @JoinColumn(name = "opportunity_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags;

    @ManyToMany(fetch = FetchType.LAZY, cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(
            name = "opportunity_required_skills",
            joinColumns = @JoinColumn(name = "opportunity_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> requiredSkills;
    // --- --------------------------------- ---

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}