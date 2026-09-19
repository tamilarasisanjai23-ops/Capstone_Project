package com.disaster.backend.controller;

import com.disaster.backend.entity.Notification;
import com.disaster.backend.entity.SosAlert;
import com.disaster.backend.entity.User;
import com.disaster.backend.entity.Volunteer;

import com.disaster.backend.repository.SosAlertRepository;
import com.disaster.backend.repository.UserRepository;
import com.disaster.backend.repository.VolunteerRepository;

import com.disaster.backend.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sos-alerts")
@CrossOrigin(origins = "*")
public class SosAlertController {

    @Autowired
    private SosAlertRepository sosAlertRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private NotificationService notificationService;


    @GetMapping
    public List<SosAlert> getAllSosAlerts() {

        return sosAlertRepository
                .findAllByOrderByCreatedAtDesc();
    }


    @PostMapping
    public ResponseEntity<?> createSosAlert(
            @RequestParam String volunteerEmail,
            @RequestBody SosAlert sosAlert) {

        Optional<User> existingUser =
                userRepository.findByEmail(volunteerEmail);

        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        User user =
                existingUser.get();


        if (user.getRole() == null ||
                !user.getRole()
                        .equalsIgnoreCase("VOLUNTEER")) {

            return ResponseEntity
                    .badRequest()
                    .body("User is not a volunteer");
        }


        /*
         * Find existing volunteer record.
         * If it does not exist, create one automatically.
         */

        Optional<Volunteer> existingVolunteer =
                volunteerRepository
                        .findByUser_UserId(
                                user.getUserId()
                        );


        Volunteer volunteer;


        if (existingVolunteer.isPresent()) {

            volunteer =
                    existingVolunteer.get();

        } else {

            volunteer =
                    new Volunteer();

            volunteer.setUser(user);
            volunteer.setSkills("Not Specified");
            volunteer.setAvailability("Available");
            volunteer.setStatus("AVAILABLE");

            volunteer =
                    volunteerRepository.save(
                            volunteer
                    );
        }


        sosAlert.setVolunteer(
                volunteer
        );


        if (sosAlert.getStatus() == null ||
                sosAlert.getStatus().isBlank()) {

            sosAlert.setStatus(
                    "ACTIVE"
            );
        }


        SosAlert saved =
                sosAlertRepository.save(
                        sosAlert
                );


        /*
         * ==========================================
         * AUTOMATIC ADMIN NOTIFICATION
         * ==========================================
         */

        List<User> allUsers =
                userRepository.findAll();


        for (User adminUser : allUsers) {

            if (adminUser.getRole() != null &&
                    adminUser.getRole()
                            .equalsIgnoreCase("ADMIN")) {

                Notification notification =
                        new Notification();

                notification.setUser(
                        adminUser
                );

                notification.setTitle(
                        "🆘 New SOS Alert"
                );

                notification.setMessage(
                        "Volunteer " +
                        volunteerEmail +
                        " needs emergency assistance."
                );

                notification.setType(
                        "SOS"
                );

                notification.setReadStatus(
                        false
                );


                /*
                 * Save notification directly
                 * for each admin.
                 */
                notificationService
                        .saveNotification(
                                notification
                        );
            }
        }


        return ResponseEntity.ok(
                saved
        );
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateSosStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return sosAlertRepository.findById(id)
                .map(alert -> {

                    alert.setStatus(
                            status
                    );

                    return ResponseEntity.ok(
                            sosAlertRepository.save(
                                    alert
                            )
                    );

                })
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }
}