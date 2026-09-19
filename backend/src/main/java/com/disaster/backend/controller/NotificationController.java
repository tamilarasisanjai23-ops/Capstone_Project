package com.disaster.backend.controller;

import com.disaster.backend.entity.Notification;
import com.disaster.backend.repository.NotificationRepository;
import com.disaster.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/user/{userId}")
    public List<Notification> getUserNotifications(
            @PathVariable Long userId) {

        return notificationRepository
                .findByUser_UserIdOrderByCreatedAtDesc(userId);
    }

    @GetMapping("/user/{userId}/unread")
    public List<Notification> getUnreadNotifications(
            @PathVariable Long userId) {

        return notificationRepository
                .findByUser_UserIdAndReadStatusFalseOrderByCreatedAtDesc(userId);
    }

    @PostMapping
    public ResponseEntity<?> createNotification(
            @RequestParam Long userId,
            @RequestBody Notification notification) {

        Optional<com.disaster.backend.entity.User> existingUser =
                userRepository.findById(userId);

        if (existingUser.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        notification.setUser(existingUser.get());

        Notification saved =
                notificationRepository.save(notification);

        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id) {

        return notificationRepository.findById(id)
                .map(notification -> {

                    notification.setReadStatus(true);

                    return ResponseEntity.ok(
                            notificationRepository.save(notification)
                    );
                })
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id) {

        if (!notificationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        notificationRepository.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}