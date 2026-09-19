package com.disaster.backend.controller;

import com.disaster.backend.entity.User;
import com.disaster.backend.entity.Volunteer;
import com.disaster.backend.repository.UserRepository;
import com.disaster.backend.repository.VolunteerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;


    // =========================================================
    // REGISTER USER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(
            @RequestBody User user) {

        User savedUser =
                userRepository.save(user);


        // Create Volunteer record automatically
        // for volunteer users
        if (savedUser.getRole() != null &&
                savedUser.getRole()
                        .equalsIgnoreCase("VOLUNTEER")) {

            Optional<Volunteer> existingVolunteer =
                    volunteerRepository
                            .findByUser_UserId(
                                    savedUser.getUserId()
                            );


            if (existingVolunteer.isEmpty()) {

                Volunteer volunteer =
                        new Volunteer();

                volunteer.setUser(savedUser);
                volunteer.setSkills("Not Specified");
                volunteer.setAvailability("Available");
                volunteer.setStatus("AVAILABLE");

                volunteerRepository.save(
                        volunteer
                );
            }
        }


        return ResponseEntity.ok(
                savedUser
        );
    }


    // =========================================================
    // LOGIN USER
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(
                        user.getEmail()
                );


        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .status(401)
                    .body(
                            "Invalid email or password"
                    );
        }


        User foundUser =
                existingUser.get();


        if (!foundUser.getPassword()
                .equals(user.getPassword())) {

            return ResponseEntity
                    .status(401)
                    .body(
                            "Invalid email or password"
                    );
        }


        return ResponseEntity.ok(
                foundUser
        );
    }


    // =========================================================
    // GET ALL VOLUNTEERS
    // =========================================================

    @GetMapping("/volunteers")
    public ResponseEntity<?> getAllVolunteers() {

        List<User> users =
                userRepository.findAll();


        List<Map<String, Object>> volunteers =
                new ArrayList<>();


        for (User user : users) {

            // Only volunteer users
            if (user.getRole() == null ||
                    !user.getRole()
                            .equalsIgnoreCase(
                                    "VOLUNTEER"
                            )) {

                continue;
            }


            // Find volunteer record
            Optional<Volunteer> volunteerRecord =
                    volunteerRepository
                            .findByUser_UserId(
                                    user.getUserId()
                            );


            Volunteer record;


            // If volunteer record is missing,
            // create it automatically
            if (volunteerRecord.isEmpty()) {

                record =
                        new Volunteer();

                record.setUser(user);
                record.setSkills("Not Specified");
                record.setAvailability("Available");
                record.setStatus("AVAILABLE");

                record =
                        volunteerRepository.save(
                                record
                        );

            } else {

                record =
                        volunteerRecord.get();
            }


            // Prepare safe response
            Map<String, Object> volunteer =
                    new HashMap<>();


            volunteer.put(
                    "userId",
                    user.getUserId()
            );


            volunteer.put(
                    "name",
                    user.getName()
            );


            volunteer.put(
                    "email",
                    user.getEmail()
            );


            volunteer.put(
                    "volunteerId",
                    record.getVolunteerId()
            );


            volunteer.put(
                    "skills",
                    record.getSkills()
            );


            volunteer.put(
                    "availability",
                    record.getAvailability()
            );


            volunteer.put(
                    "status",
                    record.getStatus()
            );


            volunteers.add(
                    volunteer
            );
        }


        return ResponseEntity.ok(
                volunteers
        );
    }
}