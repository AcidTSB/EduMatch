package com.edumatch.user.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employer {

    @Id
    @Column(length = 36)
    private String id;

    @Column(name = "owner_user_id", length = 36)
    private String ownerUserId;

    private String name;
    private String officialEmail;
    private String website;
    private String country;
    private String description;
    private Boolean verified;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
