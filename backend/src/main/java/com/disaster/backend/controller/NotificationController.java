package com.disaster.backend.controller;

import com.disaster.backend.entity.Notification;
import com.disaster.backend.entity.User;
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


    // =========================================================
    // GET NOTIFICATIONS BY USER ID
    // =========================================================

    @GetMapping("/user/{userId}")
    public List<Notification> getUserNotifications(
            @PathVariable Long userId) {

        return notificationRepository
                .findByUser_UserIdOrderByCreatedAtDesc(userId);
    }


    // =========================================================
    // GET UNREAD NOTIFICATIONS BY USER ID
    // =========================================================

    @GetMapping("/user/{userId}/unread")
    public List<Notification> getUnreadNotifications(
            @PathVariable Long userId) {

        return notificationRepository
                .findByUser_UserIdAndReadStatusFalseOrderByCreatedAtDesc(
                        userId
                );
    }


    // =========================================================
    // GET NOTIFICATIONS BY EMAIL
    // =========================================================

    @GetMapping("/email")
    public ResponseEntity<?> getNotificationsByEmail(
            @RequestParam String email) {

        Optional<User> existingUser =
                userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        Long userId =
                existingUser.get().getUserId();

        List<Notification> notifications =
                notificationRepository
                        .findByUser_UserIdOrderByCreatedAtDesc(
                                userId
                        );

        return ResponseEntity.ok(
                notifications
        );
    }


    // =========================================================
    // GET UNREAD NOTIFICATIONS BY EMAIL
    // =========================================================

    @GetMapping("/email/unread")
    public ResponseEntity<?> getUnreadNotificationsByEmail(
            @RequestParam String email) {

        Optional<User> existingUser =
                userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        Long userId =
                existingUser.get().getUserId();

        List<Notification> notifications =
                notificationRepository
                        .findByUser_UserIdAndReadStatusFalseOrderByCreatedAtDesc(
                                userId
                        );

        return ResponseEntity.ok(
                notifications
        );
    }


    // =========================================================
    // CREATE NOTIFICATION BY USER ID
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createNotification(
            @RequestParam Long userId,
            @RequestBody Notification notification) {

        Optional<User> existingUser =
                userRepository.findById(userId);

        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        notification.setUser(
                existingUser.get()
        );

        Notification saved =
                notificationRepository.save(
                        notification
                );

        return ResponseEntity.ok(
                saved
        );
    }


    // =========================================================
    // CREATE NOTIFICATION BY EMAIL
    // =========================================================

    @PostMapping("/email")
    public ResponseEntity<?> createNotificationByEmail(
            @RequestParam String email,
            @RequestBody Notification notification) {

        Optional<User> existingUser =
                userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        notification.setUser(
                existingUser.get()
        );

        Notification saved =
                notificationRepository.save(
                        notification
                );

        return ResponseEntity.ok(
                saved
        );
    }


    // =========================================================
    // MARK AS READ
    // =========================================================

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long id) {

        return notificationRepository.findById(id)
                .map(notification -> {

                    notification.setReadStatus(
                            true
                    );

                    return ResponseEntity.ok(
                            notificationRepository.save(
                                    notification
                            )
                    );

                })
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =========================================================
    // DELETE NOTIFICATION
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id) {

        if (
                !notificationRepository
                        .existsById(id)
        ) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        notificationRepository.deleteById(
                id
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}