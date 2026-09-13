package com.smartration.controller;

import com.smartration.entity.Complaint;
import com.smartration.service.ComplaintService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @GetMapping
    public ResponseEntity<List<Complaint>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/card/{cardNo}")
    public ResponseEntity<List<Complaint>> getComplaintsByCard(@PathVariable String cardNo) {
        return ResponseEntity.ok(complaintService.getComplaintsByCard(cardNo));
    }

    @PostMapping
    public ResponseEntity<?> submitComplaint(@RequestBody Complaint complaint) {
        try {
            Complaint created = complaintService.submitComplaint(complaint);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComplaintStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String status = body.getOrDefault("status", "Resolved");
            Complaint updated = complaintService.updateComplaintStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
