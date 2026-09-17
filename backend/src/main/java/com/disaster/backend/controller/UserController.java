package com.disaster.backend.controller;

import com.disaster.backend.entity.User;
import com.disaster.backend.entity.Volunteer;
import com.disaster.backend.repository.UserRepository;
import com.disaster.backend.repository.VolunteerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {

        User savedUser = userRepository.save(user);

        // Create Volunteer record for volunteer users
        if (savedUser.getRole() != null &&
                savedUser.getRole().equalsIgnoreCase("VOLUNTEER")) {

            Optional<Volunteer> existingVolunteer =
                    volunteerRepository.findByUser_UserId(savedUser.getUserId());

            if (existingVolunteer.isEmpty()) {

                Volunteer volunteer = new Volunteer();

                volunteer.setUser(savedUser);
                volunteer.setSkills("Not Specified");
                volunteer.setAvailability("Available");
                volunteer.setStatus("AVAILABLE");

                volunteerRepository.save(volunteer);
            }
        }

        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        User foundUser = existingUser.get();

        if (!foundUser.getPassword().equals(user.getPassword())) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }

        return ResponseEntity.ok(foundUser);
    }
}