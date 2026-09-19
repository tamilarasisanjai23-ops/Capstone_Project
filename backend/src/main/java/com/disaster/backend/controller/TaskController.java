package com.disaster.backend.controller;

import com.disaster.backend.entity.Notification;
import com.disaster.backend.entity.Task;
import com.disaster.backend.entity.User;
import com.disaster.backend.entity.Volunteer;

import com.disaster.backend.repository.TaskRepository;
import com.disaster.backend.repository.UserRepository;
import com.disaster.backend.repository.VolunteerRepository;

import com.disaster.backend.service.NotificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private NotificationService notificationService;


    // =========================================================
    // GET ALL TASKS
    // =========================================================

    @GetMapping
    public List<Task> getAllTasks() {

        return taskRepository.findAll();
    }


    // =========================================================
    // CREATE AND ASSIGN TASK
    // =========================================================

    @PostMapping
    public ResponseEntity<?> createTask(
            @RequestParam String volunteerEmail,
            @RequestBody Task task) {

        Optional<User> existingUser =
                userRepository.findByEmail(volunteerEmail);

        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Volunteer user not found");
        }


        User user =
                existingUser.get();


        // Check user role
        if (user.getRole() == null ||
                !user.getRole()
                        .equalsIgnoreCase("VOLUNTEER")) {

            return ResponseEntity
                    .badRequest()
                    .body("Selected user is not a volunteer");
        }


        // Find volunteer record
        Optional<Volunteer> existingVolunteer =
                volunteerRepository
                        .findByUser_UserId(
                                user.getUserId()
                        );


        if (existingVolunteer.isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Volunteer profile not found for this user"
                    );
        }


        Volunteer volunteer =
                existingVolunteer.get();


        // Assign volunteer to task
        task.setVolunteer(
                volunteer
        );


        // Default status
        if (task.getStatus() == null ||
                task.getStatus().isBlank()) {

            task.setStatus("Pending");
        }


        // Save task
        Task savedTask =
                taskRepository.save(task);


        // =====================================================
        // NOTIFY VOLUNTEER
        // =====================================================

        Notification notification =
                new Notification();

        notification.setUser(
                user
        );

        notification.setTitle(
                "📋 New Task Assigned"
        );

        notification.setMessage(
                "You have been assigned the task: " +
                savedTask.getTaskName() +
                " at " +
                savedTask.getLocation()
        );

        notification.setType(
                "TASK"
        );

        notification.setReadStatus(
                false
        );


        notificationService.saveNotification(
                notification
        );


        return ResponseEntity.ok(
                savedTask
        );
    }


    // =========================================================
    // UPDATE TASK STATUS
    // =========================================================

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return taskRepository.findById(id)
                .map(task -> {

                    task.setStatus(status);

                    Task updatedTask =
                            taskRepository.save(task);


                    // Notify assigned volunteer
                    if (updatedTask.getVolunteer() != null &&
                            updatedTask.getVolunteer().getUser() != null) {

                        Notification notification =
                                new Notification();

                        notification.setUser(
                                updatedTask
                                        .getVolunteer()
                                        .getUser()
                        );

                        notification.setTitle(
                                "📋 Task Status Updated"
                        );

                        notification.setMessage(
                                "Task \"" +
                                updatedTask.getTaskName() +
                                "\" status is now: " +
                                status
                        );

                        notification.setType(
                                "TASK_STATUS"
                        );

                        notification.setReadStatus(
                                false
                        );


                        notificationService.saveNotification(
                                notification
                        );
                    }


                    return ResponseEntity.ok(
                            updatedTask
                    );

                })
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // =========================================================
    // DELETE TASK
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable Long id) {

        if (!taskRepository.existsById(id)) {

            return ResponseEntity
                    .notFound()
                    .build();
        }


        taskRepository.deleteById(id);


        return ResponseEntity
                .noContent()
                .build();
    }
}