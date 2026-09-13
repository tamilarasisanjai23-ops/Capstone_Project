package com.disaster.backend.controller;

import com.disaster.backend.entity.SosAlert;
import com.disaster.backend.repository.SosAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sos-alerts")
@CrossOrigin(origins = "*")
public class SosAlertController {

    @Autowired
    private SosAlertRepository sosAlertRepository;

    @GetMapping
    public List<SosAlert> getAllSosAlerts() {
        return sosAlertRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public ResponseEntity<SosAlert> createSosAlert(@RequestBody SosAlert sosAlert) {
        if (sosAlert.getStatus() == null) {
            sosAlert.setStatus("ACTIVE");
        }
        SosAlert saved = sosAlertRepository.save(sosAlert);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SosAlert> updateSosStatus(@PathVariable Long id, @RequestParam String status) {
        return sosAlertRepository.findById(id).map(alert -> {
            alert.setStatus(status);
            return ResponseEntity.ok(sosAlertRepository.save(alert));
        }).orElse(ResponseEntity.notFound().build());
    }
}
