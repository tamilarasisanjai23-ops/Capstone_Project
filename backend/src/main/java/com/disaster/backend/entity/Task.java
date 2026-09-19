package com.disaster.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long taskId;


    @Column(nullable = false, length = 150)
    private String taskName;


    @Column(nullable = false, length = 100)
    private String location;


    @Column(nullable = false, length = 50)
    private String priority;


    @Column(nullable = false, length = 50)
    private String status;


    // Assigned volunteer
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "volunteer_id")
    private Volunteer volunteer;


    public Task() {
    }


    public Long getTaskId() {
        return taskId;
    }


    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }


    public String getTaskName() {
        return taskName;
    }


    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }


    public String getLocation() {
        return location;
    }


    public void setLocation(String location) {
        this.location = location;
    }


    public String getPriority() {
        return priority;
    }


    public void setPriority(String priority) {
        this.priority = priority;
    }


    public String getStatus() {
        return status;
    }


    public void setStatus(String status) {
        this.status = status;
    }


    public Volunteer getVolunteer() {
        return volunteer;
    }


    public void setVolunteer(Volunteer volunteer) {
        this.volunteer = volunteer;
    }
}