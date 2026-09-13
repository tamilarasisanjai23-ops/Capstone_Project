package com.disaster.backend.controller;

import com.disaster.backend.entity.VoiceAlert;
import com.disaster.backend.repository.VoiceAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/voice-alerts")
@CrossOrigin(origins = "*")
public class VoiceAlertController {

    @Autowired
    private VoiceAlertRepository voiceAlertRepository;

    @GetMapping
    public List<VoiceAlert> getAllVoiceAlerts() {
        return voiceAlertRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<VoiceAlert> createVoiceAlert(@RequestBody VoiceAlert voiceAlert) {
        VoiceAlert saved = voiceAlertRepository.save(voiceAlert);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoiceAlert(@PathVariable Long id) {
        voiceAlertRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
