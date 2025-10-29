package com.edumatch.user.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "skills") // Trỏ đến bảng 'skills' trong CSDL
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Giả sử ID là Long, nếu là CHAR(36) đổi thành String và @GeneratedValue(strategy = GenerationType.UUID)

    @Column(unique = true, nullable = false, length = 100)
    private String name;

    @OneToMany(mappedBy = "skill")
    private Set<ApplicantSkill> applicantSkills;
}