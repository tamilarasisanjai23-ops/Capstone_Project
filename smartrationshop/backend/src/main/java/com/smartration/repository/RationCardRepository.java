package com.smartration.repository;

import com.smartration.entity.RationCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RationCardRepository extends JpaRepository<RationCard, Long> {
    Optional<RationCard> findByCardNumber(String cardNumber);
    Optional<RationCard> findByUserId(Long userId);
    Optional<RationCard> findByUserEmail(String email);
    boolean existsByCardNumber(String cardNumber);
}
