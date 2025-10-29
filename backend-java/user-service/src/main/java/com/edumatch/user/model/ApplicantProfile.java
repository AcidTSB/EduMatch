package com.edumatch.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "applicant_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicantProfile {

    @Id
    private Long id; // Khóa chính này cũng là khóa ngoại

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // Ánh xạ trường id này với id của User
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 400)
    private String headline;

    @Column(name = "degree_level", length = 100)
    private String degreeLevel;

    @Column(precision = 3, scale = 2) // Ví dụ: 3.75
    private BigDecimal gpa;

    @Column(length = 255)
    private String institution;

    @Column(length = 100)
    private String country;

    @Column(name = "research_interests", columnDefinition = "TEXT")
    private String researchInterests;

    @OneToMany(mappedBy = "applicantProfile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<ApplicantSkill> skills;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}