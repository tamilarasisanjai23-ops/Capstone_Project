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


    // Create notification for one user
    public Notification createNotificationForUser(
            Long userId,
            String title,
            String message,
            String type) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
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


    // Create notification using email
    public Notification createNotificationForEmail(
            String email,
            String title,
            String message,
            String type) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
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


    // Create notification for all volunteers
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
                                    .equalsIgnoreCase("VOLUNTEER"))
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
}