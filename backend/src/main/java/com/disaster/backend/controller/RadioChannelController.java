package com.disaster.backend.controller;

import com.disaster.backend.entity.EmergencyRadioChannel;
import com.disaster.backend.repository.EmergencyRadioChannelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/radio-channels")
@CrossOrigin(origins = "*")
public class RadioChannelController {

    @Autowired
    private EmergencyRadioChannelRepository channelRepository;

    @GetMapping
    public List<EmergencyRadioChannel> getAllChannels() {
        return channelRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<EmergencyRadioChannel> createChannel(@RequestBody EmergencyRadioChannel channel) {
        EmergencyRadioChannel saved = channelRepository.save(channel);
        return ResponseEntity.ok(saved);
    }
}
