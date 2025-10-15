package com.edumatch.scholarship.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "skills")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    // Quan hệ ngược lại với Opportunity (không bắt buộc nhưng nên có)
    @ManyToMany(mappedBy = "requiredSkills")
    private Set<Opportunity> opportunities;
}