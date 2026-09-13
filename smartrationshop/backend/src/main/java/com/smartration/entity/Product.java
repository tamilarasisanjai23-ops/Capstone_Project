package com.smartration.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private Double stockQuantity;

    @Column(nullable = false)
    private Double monthlyQuota;

    @Column(nullable = false)
    private String unit;

    @Column(nullable = false)
    private Double unitPrice;

    @Column(nullable = false)
    private String status = "In Stock";

    public Product() {}

    public Product(String productName, Double stockQuantity, Double monthlyQuota, String unit, Double unitPrice, String status) {
        this.productName = productName;
        this.stockQuantity = stockQuantity;
        this.monthlyQuota = monthlyQuota;
        this.unit = unit;
        this.unitPrice = unitPrice;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public Double getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Double stockQuantity) { this.stockQuantity = stockQuantity; }

    public Double getMonthlyQuota() { return monthlyQuota; }
    public void setMonthlyQuota(Double monthlyQuota) { this.monthlyQuota = monthlyQuota; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(Double unitPrice) { this.unitPrice = unitPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
