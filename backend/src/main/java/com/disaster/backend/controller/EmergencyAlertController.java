package com.disaster.backend.controller;

import com.disaster.backend.entity.EmergencyAlert;
import com.disaster.backend.repository.EmergencyAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-alerts")
@CrossOrigin(origins = "*")
public class EmergencyAlertController {

    @Autowired
    private EmergencyAlertRepository emergencyAlertRepository;

    @GetMapping
    public List<EmergencyAlert> getAllAlerts() {
        return emergencyAlertRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<EmergencyAlert> createAlert(@RequestBody EmergencyAlert alert) {
        EmergencyAlert saved = emergencyAlertRepository.save(alert);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        emergencyAlertRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}