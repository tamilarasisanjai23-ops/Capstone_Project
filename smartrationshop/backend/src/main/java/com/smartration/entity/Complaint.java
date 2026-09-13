package com.smartration.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String complaintNumber;

    @Column(nullable = false)
    private String rationCardNumber;

    @Column(nullable = false)
    private String complaintType;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private LocalDate dateFiled = LocalDate.now();

    @Column(nullable = false)
    private String status = "Pending";

    public Complaint() {}

    public Complaint(String complaintNumber, String rationCardNumber, String complaintType, String description, LocalDate dateFiled, String status) {
        this.complaintNumber = complaintNumber;
        this.rationCardNumber = rationCardNumber;
        this.complaintType = complaintType;
        this.description = description;
        this.dateFiled = dateFiled;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getComplaintNumber() { return complaintNumber; }
    public void setComplaintNumber(String complaintNumber) { this.complaintNumber = complaintNumber; }

    public String getRationCardNumber() { return rationCardNumber; }
    public void setRationCardNumber(String rationCardNumber) { this.rationCardNumber = rationCardNumber; }

    public String getComplaintType() { return complaintType; }
    public void setComplaintType(String complaintType) { this.complaintType = complaintType; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDateFiled() { return dateFiled; }
    public void setDateFiled(LocalDate dateFiled) { this.dateFiled = dateFiled; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
