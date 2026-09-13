package com.disaster.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "voice_alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VoiceAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "voice_id")
    private Long voiceId;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "audio_data", nullable = false, columnDefinition = "LONGTEXT")
    private String audioData;

    @Column(nullable = false)
    private Integer duration;

    @Column(name = "alert_level", nullable = false, length = 50)
    private String alertLevel; // LOW, MEDIUM, HIGH, CRITICAL

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getVoiceId() { return voiceId; }
    public void setVoiceId(Long voiceId) { this.voiceId = voiceId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAudioData() { return audioData; }
    public void setAudioData(String audioData) { this.audioData = audioData; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getAlertLevel() { return alertLevel; }
    public void setAlertLevel(String alertLevel) { this.alertLevel = alertLevel; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
