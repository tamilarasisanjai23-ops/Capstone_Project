package com.disaster.backend.controller;

import com.disaster.backend.entity.VolunteerLocation;
import com.disaster.backend.repository.VolunteerLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/volunteer-locations")
@CrossOrigin(origins = "*")
public class VolunteerLocationController {

    @Autowired
    private VolunteerLocationRepository volunteerLocationRepository;

    @GetMapping
    public List<VolunteerLocation> getAllLocations() {
        return volunteerLocationRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<VolunteerLocation> updateLocation(@RequestBody VolunteerLocation location) {
        if (location.getVolunteer() != null && location.getVolunteer().getVolunteerId() != null) {
            Long volId = location.getVolunteer().getVolunteerId();
            volunteerLocationRepository.findByVolunteer_VolunteerId(volId).ifPresent(existing -> {
                location.setLocationRecordId(existing.getLocationRecordId());
            });
        }
        VolunteerLocation saved = volunteerLocationRepository.save(location);
        return ResponseEntity.ok(saved);
    }
}
