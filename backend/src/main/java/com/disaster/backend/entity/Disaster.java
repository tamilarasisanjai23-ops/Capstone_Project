package com.disaster.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "disasters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Disaster {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "disaster_id")
    private Long disasterId;

    @Column(nullable = false, length = 100)
    private String type; // Flood, Cyclone, Earthquake, Landslide

    @Column(nullable = false, length = 50)
    private String severity; // LOW, MODERATE, HIGH, CRITICAL

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, MONITORING, RESOLVED

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

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
