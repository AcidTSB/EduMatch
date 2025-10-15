package com.edumatch.scholarship.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "tags")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Tag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    // Quan hệ ngược lại với Opportunity
    @ManyToMany(mappedBy = "tags")
    private Set<Opportunity> opportunities;
}