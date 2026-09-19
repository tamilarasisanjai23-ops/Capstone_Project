package com.disaster.backend.repository;

import com.disaster.backend.entity.EmergencyRadioMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyRadioMessageRepository
        extends JpaRepository<EmergencyRadioMessage, Long> {

    List<EmergencyRadioMessage> findTop20ByChannelNameOrderByCreatedAtDesc(
            String channelName
    );
}