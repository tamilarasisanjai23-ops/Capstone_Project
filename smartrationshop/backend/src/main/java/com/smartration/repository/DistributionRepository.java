package com.smartration.repository;

import com.smartration.entity.Distribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DistributionRepository extends JpaRepository<Distribution, Long> {
    List<Distribution> findByRationCardNumber(String rationCardNumber);
    long countByStatus(String status);
}
