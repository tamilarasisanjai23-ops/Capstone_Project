package com.smartration.dto;

public class AdminDashboardDTO {

    private long totalCardHolders;
    private long totalProducts;
    private double totalStock;
    private long pendingDistributions;
    private long completedDistributions;
    private long pendingComplaints;

    public AdminDashboardDTO() {}

    public AdminDashboardDTO(long totalCardHolders, long totalProducts, double totalStock, long pendingDistributions, long completedDistributions, long pendingComplaints) {
        this.totalCardHolders = totalCardHolders;
        this.totalProducts = totalProducts;
        this.totalStock = totalStock;
        this.pendingDistributions = pendingDistributions;
        this.completedDistributions = completedDistributions;
        this.pendingComplaints = pendingComplaints;
    }

    public long getTotalCardHolders() { return totalCardHolders; }
    public void setTotalCardHolders(long totalCardHolders) { this.totalCardHolders = totalCardHolders; }

    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }

    public double getTotalStock() { return totalStock; }
    public void setTotalStock(double totalStock) { this.totalStock = totalStock; }

    public long getPendingDistributions() { return pendingDistributions; }
    public void setPendingDistributions(long pendingDistributions) { this.pendingDistributions = pendingDistributions; }

    public long getCompletedDistributions() { return completedDistributions; }
    public void setCompletedDistributions(long completedDistributions) { this.completedDistributions = completedDistributions; }

    public long getPendingComplaints() { return pendingComplaints; }
    public void setPendingComplaints(long pendingComplaints) { this.pendingComplaints = pendingComplaints; }
}
