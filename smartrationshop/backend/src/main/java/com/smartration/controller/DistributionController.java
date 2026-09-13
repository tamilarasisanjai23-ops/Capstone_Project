package com.smartration.controller;

import com.smartration.entity.Distribution;
import com.smartration.service.DistributionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/distributions")
@CrossOrigin(origins = "*")
public class DistributionController {

    @Autowired
    private DistributionService distributionService;

    @GetMapping
    public ResponseEntity<List<Distribution>> getAllDistributions() {
        return ResponseEntity.ok(distributionService.getAllDistributions());
    }

    @GetMapping("/card/{cardNo}")
    public ResponseEntity<List<Distribution>> getDistributionsByCard(@PathVariable String cardNo) {
        return ResponseEntity.ok(distributionService.getDistributionsByCard(cardNo));
    }

    @PostMapping
    public ResponseEntity<?> createDistribution(@RequestBody Distribution dist) {
        try {
            Distribution created = distributionService.createDistribution(dist);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDistributionStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String status = body.getOrDefault("status", "Distributed");
            Distribution updated = distributionService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
