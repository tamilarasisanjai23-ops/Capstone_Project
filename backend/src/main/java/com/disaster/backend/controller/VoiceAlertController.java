package com.disaster.backend.controller;

import com.disaster.backend.entity.User;
import com.disaster.backend.entity.VoiceAlert;
import com.disaster.backend.repository.UserRepository;
import com.disaster.backend.repository.VoiceAlertRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/voice-alerts")
@CrossOrigin(origins = "*")
public class VoiceAlertController {

    @Autowired
    private VoiceAlertRepository voiceAlertRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<VoiceAlert> getAllVoiceAlerts() {
        return voiceAlertRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<?> createVoiceAlert(
            @RequestParam String createdByEmail,
            @RequestBody VoiceAlert voiceAlert) {

        Optional<User> existingUser =
                userRepository.findByEmail(createdByEmail);

        if (existingUser.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Creator user not found");
        }

        User creator = existingUser.get();

        if (creator.getRole() == null ||
                !creator.getRole().equalsIgnoreCase("ADMIN")) {
            return ResponseEntity
                    .badRequest()
                    .body("Only admin users can create voice alerts");
        }

        voiceAlert.setCreatedBy(creator);

        VoiceAlert saved =
                voiceAlertRepository.save(voiceAlert);

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoiceAlert(
            @PathVariable Long id) {

        if (!voiceAlertRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        voiceAlertRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}