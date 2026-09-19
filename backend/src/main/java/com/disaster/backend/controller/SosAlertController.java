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


    // =========================================================
    // GET ALL SOS ALERTS
    // =========================================================

    @GetMapping
    public List<SosAlert> getAllSosAlerts() {

        return sosAlertRepository
                .findAllByOrderByCreatedAtDesc();
    }


    // =========================================================
    // CREATE SOS ALERT
    // =========================================================

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


        // Only volunteers can send SOS
        if (user.getRole() == null ||
                !user.getRole()
                        .equalsIgnoreCase("VOLUNTEER")) {

            return ResponseEntity
                    .badRequest()
                    .body("User is not a volunteer");
        }


        // =====================================================
        // FIND OR CREATE VOLUNTEER RECORD
        // =====================================================

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


        // =====================================================
        // DEFAULT SOS STATUS
        // =====================================================

        if (sosAlert.getStatus() == null ||
                sosAlert.getStatus().isBlank()) {

            sosAlert.setStatus("ACTIVE");
        }


        // =====================================================
        // SAVE SOS
        // =====================================================

        SosAlert saved =
                sosAlertRepository.save(
                        sosAlert
                );


        // =====================================================
        // AUTOMATIC ADMIN NOTIFICATION
        // =====================================================

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


                notificationService.saveNotification(
                        notification
                );
            }
        }


        return ResponseEntity.ok(
                saved
        );
    }


    // =========================================================
    // UPDATE SOS STATUS
    // =========================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateSosStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return sosAlertRepository.findById(id)
                .map(alert -> {

                    // Update SOS status
                    alert.setStatus(status);


                    // Save updated SOS
                    SosAlert savedAlert =
                            sosAlertRepository.save(
                                    alert
                            );


                    // =================================================
                    // NOTIFY VOLUNTEER ABOUT STATUS CHANGE
                    // =================================================

                    if (savedAlert.getVolunteer() != null &&
                            savedAlert.getVolunteer().getUser() != null) {

                        User volunteerUser =
                                savedAlert
                                        .getVolunteer()
                                        .getUser();


                        Notification notification =
                                new Notification();


                        notification.setUser(
                                volunteerUser
                        );


                        String title;

                        String message;


                        // ---------------------------------------------
                        // ACTIVE -> RESPONDING
                        // ---------------------------------------------

                        if (status.equalsIgnoreCase(
                                "RESPONDING")) {

                            title =
                                    "🆘 SOS Response Started";

                            message =
                                    "Admin has started responding to your SOS alert.";

                        }


                        // ---------------------------------------------
                        // RESPONDING -> RESOLVED
                        // ---------------------------------------------

                        else if (status.equalsIgnoreCase(
                                "RESOLVED")) {

                            title =
                                    "✅ SOS Alert Resolved";

                            message =
                                    "Your SOS alert has been marked as resolved by the admin.";

                        }


                        // ---------------------------------------------
                        // OTHER STATUS
                        // ---------------------------------------------

                        else {

                            title =
                                    "🆘 SOS Status Updated";

                            message =
                                    "Your SOS alert status is now: " +
                                    status;
                        }


                        notification.setTitle(
                                title
                        );

                        notification.setMessage(
                                message
                        );

                        notification.setType(
                                "SOS_STATUS"
                        );

                        notification.setReadStatus(
                                false
                        );


                        // Save notification
                        notificationService.saveNotification(
                                notification
                        );
                    }


                    return ResponseEntity.ok(
                            savedAlert
                    );

                })
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }
}