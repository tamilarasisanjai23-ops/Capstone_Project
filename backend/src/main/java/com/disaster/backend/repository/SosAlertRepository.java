package com.disaster.backend.repository;

import com.disaster.backend.entity.SosAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosAlertRepository extends JpaRepository<SosAlert, Long> {
    List<SosAlert> findAllByOrderByCreatedAtDesc();
    List<SosAlert> findByStatus(String status);
}
