package com.smartration.controller;

import com.smartration.entity.RationCard;
import com.smartration.repository.RationCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ration-cards")
@CrossOrigin(origins = "*")
public class RationCardController {

    @Autowired
    private RationCardRepository rationCardRepository;

    @GetMapping("/{cardNo}")
    public ResponseEntity<?> getCardByNumber(@PathVariable String cardNo) {
        Optional<RationCard> cardOpt = rationCardRepository.findByCardNumber(cardNo);
        if (cardOpt.isEmpty()) {
            cardOpt = rationCardRepository.findByUserEmail(cardNo);
        }
        if (cardOpt.isEmpty()) {
            try {
                Long userId = Long.parseLong(cardNo);
                cardOpt = rationCardRepository.findByUserId(userId);
            } catch (NumberFormatException ignored) {}
        }

        if (cardOpt.isPresent()) {
            RationCard card = cardOpt.get();
            Map<String, Object> resp = new HashMap<>();
            resp.put("id", card.getId());
            resp.put("cardNumber", card.getCardNumber());
            resp.put("cardType", card.getCardType());
            resp.put("familyMembers", card.getFamilyMembers());
            resp.put("address", card.getAddress());
            resp.put("status", card.getStatus());
            if (card.getUser() != null) {
                resp.put("userName", card.getUser().getFullName());
                resp.put("userEmail", card.getUser().getEmail());
                resp.put("userMobile", card.getUser().getMobile());
            } else {
                resp.put("userName", "");
            }
            return ResponseEntity.ok(resp);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<?> getCardByUserEmail(@PathVariable String email) {
        Optional<RationCard> cardOpt = rationCardRepository.findByUserEmail(email);
        if (cardOpt.isPresent()) {
            RationCard card = cardOpt.get();
            Map<String, Object> resp = new HashMap<>();
            resp.put("id", card.getId());
            resp.put("cardNumber", card.getCardNumber());
            resp.put("cardType", card.getCardType());
            resp.put("familyMembers", card.getFamilyMembers());
            resp.put("address", card.getAddress());
            resp.put("status", card.getStatus());
            if (card.getUser() != null) {
                resp.put("userName", card.getUser().getFullName());
                resp.put("userEmail", card.getUser().getEmail());
                resp.put("userMobile", card.getUser().getMobile());
            } else {
                resp.put("userName", "");
            }
            return ResponseEntity.ok(resp);
        }
        return ResponseEntity.notFound().build();
    }
}
