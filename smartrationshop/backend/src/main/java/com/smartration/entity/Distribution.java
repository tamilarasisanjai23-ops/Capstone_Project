package com.smartration.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "distributions")
public class Distribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String rationCardNumber;

    private Long productId;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private String quantity;

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private LocalDate distributionDate = LocalDate.now();

    @Column(nullable = false)
    private String status = "Pending";

    public Distribution() {}

    public Distribution(String rationCardNumber, Long productId, String productName, String quantity, Double totalAmount, LocalDate distributionDate, String status) {
        this.rationCardNumber = rationCardNumber;
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.totalAmount = totalAmount;
        this.distributionDate = distributionDate;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRationCardNumber() { return rationCardNumber; }
    public void setRationCardNumber(String rationCardNumber) { this.rationCardNumber = rationCardNumber; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getQuantity() { return quantity; }
    public void setQuantity(String quantity) { this.quantity = quantity; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDate getDistributionDate() { return distributionDate; }
    public void setDistributionDate(LocalDate distributionDate) { this.distributionDate = distributionDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
