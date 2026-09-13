package com.disaster.backend.repository;

import com.disaster.backend.entity.VolunteerLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VolunteerLocationRepository extends JpaRepository<VolunteerLocation, Long> {
    Optional<VolunteerLocation> findByVolunteer_VolunteerId(Long volunteerId);
}
