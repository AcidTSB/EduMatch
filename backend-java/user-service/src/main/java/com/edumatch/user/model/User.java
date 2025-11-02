package com.edumatch.user.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(length = 36)
    private String id;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(length = 255)
    private String fullName;

    @Column(name = "password_hash", length = 512)
    private String passwordHash;

    @Column(length = 255)
    private String role;

    private Boolean verified;

    @Column(length = 20)
    private String phone;

    @Column(length = 255)
    private String avatarUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
