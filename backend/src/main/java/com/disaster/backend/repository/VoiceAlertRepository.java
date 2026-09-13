package com.disaster.backend.repository;

import com.disaster.backend.entity.VoiceAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoiceAlertRepository extends JpaRepository<VoiceAlert, Long> {
    List<VoiceAlert> findAllByOrderByCreatedAtDesc();
}
