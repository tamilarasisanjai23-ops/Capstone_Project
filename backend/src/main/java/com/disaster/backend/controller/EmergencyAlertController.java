package com.disaster.backend.controller;

import com.disaster.backend.entity.EmergencyAlert;
import com.disaster.backend.entity.User;
import com.disaster.backend.repository.EmergencyAlertRepository;
import com.disaster.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/emergency-alerts")
@CrossOrigin(origins = "*")
public class EmergencyAlertController {

    @Autowired
    private EmergencyAlertRepository emergencyAlertRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<EmergencyAlert> getAllAlerts() {
        return emergencyAlertRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<?> createAlert(
            @RequestParam String createdByEmail,
            @RequestBody EmergencyAlert alert) {

        Optional<User> existingUser =
                userRepository.findByEmail(createdByEmail);

        if (existingUser.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("Admin user not found");
        }

        User adminUser = existingUser.get();

        alert.setCreatedBy(adminUser);

        EmergencyAlert saved =
                emergencyAlertRepository.save(alert);

        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(
            @PathVariable Long id) {

        if (!emergencyAlertRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        emergencyAlertRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}