package com.disaster.backend.service;

import com.disaster.backend.entity.Notification;
import com.disaster.backend.entity.User;
import com.disaster.backend.repository.NotificationRepository;
import com.disaster.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;


    // =========================================================
    // SAVE EXISTING NOTIFICATION
    // =========================================================

    public Notification saveNotification(
            Notification notification) {

        return notificationRepository.save(
                notification
        );
    }


    // =========================================================
    // CREATE NOTIFICATION FOR ONE USER
    // =========================================================

    public Notification createNotificationForUser(
            Long userId,
            String title,
            String message,
            String type) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        Notification notification =
                new Notification();

        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReadStatus(false);

        return notificationRepository.save(
                notification
        );
    }


    // =========================================================
    // CREATE NOTIFICATION USING EMAIL
    // =========================================================

    public Notification createNotificationForEmail(
            String email,
            String title,
            String message,
            String type) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        Notification notification =
                new Notification();

        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setReadStatus(false);

        return notificationRepository.save(
                notification
        );
    }


    // =========================================================
    // NOTIFY ALL VOLUNTEERS
    // =========================================================

    public void notifyAllVolunteers(
            String title,
            String message,
            String type) {

        List<User> volunteers =
                userRepository
                        .findAll()
                        .stream()
                        .filter(user ->
                                user.getRole() != null &&
                                user.getRole()
                                        .equalsIgnoreCase(
                                                "VOLUNTEER"
                                        ))
                        .toList();

        for (User volunteer : volunteers) {

            Notification notification =
                    new Notification();

            notification.setUser(volunteer);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setType(type);
            notification.setReadStatus(false);

            notificationRepository.save(
                    notification
            );
        }
    }


    // =========================================================
    // NOTIFY ALL ADMINS
    // =========================================================

    public void notifyAllAdmins(
            String title,
            String message,
            String type) {

        List<User> admins =
                userRepository
                        .findAll()
                        .stream()
                        .filter(user ->
                                user.getRole() != null &&
                                user.getRole()
                                        .equalsIgnoreCase(
                                                "ADMIN"
                                        ))
                        .toList();

        for (User admin : admins) {

            Notification notification =
                    new Notification();

            notification.setUser(admin);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setType(type);
            notification.setReadStatus(false);

            notificationRepository.save(
                    notification
            );
        }
    }
}