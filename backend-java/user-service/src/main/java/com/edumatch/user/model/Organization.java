package com.edumatch.user.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "organizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // owner_user_id trong CSDL là khóa ngoại trỏ đến bảng users.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_user_id", referencedColumnName = "id")
    private User owner;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "official_email", unique = true, length = 255)
    private String officialEmail;

    @Column(length = 255)
    private String website;

    @Column(length = 100)
    private String country;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    // Một tổ chức có thể có nhiều thành viên (ngoài owner)
    @OneToMany(mappedBy = "organization", fetch = FetchType.LAZY)
    private Set<User> members;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}