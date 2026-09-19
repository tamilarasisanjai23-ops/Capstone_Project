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
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(
            @RequestBody User user) {

        User savedUser =
                userRepository.save(user);


        // Create Volunteer record for volunteer users
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
    // LOGIN
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

            if (user.getRole() != null &&
                    user.getRole()
                            .equalsIgnoreCase(
                                    "VOLUNTEER"
                            )) {

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


                Optional<Volunteer> volunteerRecord =
                        volunteerRepository
                                .findByUser_UserId(
                                        user.getUserId()
                                );


                if (volunteerRecord.isPresent()) {

                    Volunteer record =
                            volunteerRecord.get();


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

                }
                else {

                    volunteer.put(
                            "volunteerId",
                            null
                    );


                    volunteer.put(
                            "skills",
                            "Not Specified"
                    );


                    volunteer.put(
                            "availability",
                            "Available"
                    );


                    volunteer.put(
                            "status",
                            "AVAILABLE"
                    );

                }


                volunteers.add(
                        volunteer
                );
            }
        }


        return ResponseEntity.ok(
                volunteers
        );
    }
}