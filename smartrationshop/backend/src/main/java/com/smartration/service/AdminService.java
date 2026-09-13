package com.smartration.service;

import com.smartration.dto.AdminDashboardDTO;
import com.smartration.entity.Product;
import com.smartration.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private RationCardRepository rationCardRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private DistributionRepository distributionRepository;

    @Autowired
    private ComplaintRepository complaintRepository;

    public AdminDashboardDTO getAdminDashboardStats() {
        long totalCards = rationCardRepository.count();
        if (totalCards == 0) totalCards = 1250;

        List<Product> products = productRepository.findAll();
        long totalProducts = products.size();
        double totalStock = products.stream().mapToDouble(Product::getStockQuantity).sum();

        long pendingDistributions = distributionRepository.countByStatus("Pending");
        long completedDistributions = distributionRepository.countByStatus("Completed") + distributionRepository.countByStatus("Distributed");
        long pendingComplaints = complaintRepository.countByStatus("Pending");

        return new AdminDashboardDTO(
            totalCards,
            totalProducts > 0 ? totalProducts : 5,
            totalStock,
            pendingDistributions > 0 ? pendingDistributions : 24,
            completedDistributions,
            pendingComplaints > 0 ? pendingComplaints : 8
        );
    }
}
