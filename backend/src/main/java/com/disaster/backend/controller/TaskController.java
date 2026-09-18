package com.disaster.backend.controller;

import com.disaster.backend.entity.Task;
import com.disaster.backend.repository.TaskRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;


    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }


    @PostMapping
    public ResponseEntity<Task> createTask(
            @RequestBody Task task) {

        Task savedTask =
                taskRepository.save(task);

        return ResponseEntity.ok(savedTask);
    }


    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return taskRepository.findById(id)
                .map(task -> {

                    task.setStatus(status);

                    Task updatedTask =
                            taskRepository.save(task);

                    return ResponseEntity.ok(updatedTask);

                })
                .orElse(
                    ResponseEntity.notFound().build()
                );
    }


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