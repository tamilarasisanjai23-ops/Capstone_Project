package com.disaster.backend.controller;

import com.disaster.backend.entity.EmergencyRadioMessage;
import com.disaster.backend.repository.EmergencyRadioMessageRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/radio-messages")
@CrossOrigin(origins = "*")
public class EmergencyRadioMessageController {

    @Autowired
    private EmergencyRadioMessageRepository messageRepository;


    // Get recent messages for a channel
    @GetMapping
    public ResponseEntity<List<EmergencyRadioMessage>> getMessages(
            @RequestParam String channelName) {

        List<EmergencyRadioMessage> messages =
                messageRepository
                        .findTop20ByChannelNameOrderByCreatedAtDesc(
                                channelName
                        );

        return ResponseEntity.ok(messages);
    }


    // Send radio audio message
    @PostMapping
    public ResponseEntity<EmergencyRadioMessage> sendMessage(
            @RequestBody EmergencyRadioMessage message) {

        EmergencyRadioMessage savedMessage =
                messageRepository.save(message);

        return ResponseEntity.ok(savedMessage);
    }
}