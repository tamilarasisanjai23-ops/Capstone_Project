package com.disaster.backend.repository;

import com.disaster.backend.entity.EmergencyRadioChannel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmergencyRadioChannelRepository extends JpaRepository<EmergencyRadioChannel, Long> {
    Optional<EmergencyRadioChannel> findByChannelName(String channelName);
}
