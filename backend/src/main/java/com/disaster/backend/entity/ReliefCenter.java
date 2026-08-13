package com.disaster.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "relief_centers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReliefCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "center_id")
    private Long centerId;

    @Column(nullable = false, length = 150)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false)
    @Builder.Default
    private Integer capacity = 0;

    @Column(length = 100)
    private String contact;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, FULL, STANDBY, INACTIVE

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
