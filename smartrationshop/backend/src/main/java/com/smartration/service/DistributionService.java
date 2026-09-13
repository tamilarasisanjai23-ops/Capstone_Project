package com.smartration.service;

import com.smartration.entity.Distribution;
import com.smartration.entity.Product;
import com.smartration.repository.DistributionRepository;
import com.smartration.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DistributionService {

    @Autowired
    private DistributionRepository distributionRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Distribution> getAllDistributions() {
        return distributionRepository.findAll();
    }

    public List<Distribution> getDistributionsByCard(String cardNo) {
        return distributionRepository.findByRationCardNumber(cardNo);
    }

    public Distribution createDistribution(Distribution dist) {
        if (dist.getDistributionDate() == null) {
            dist.setDistributionDate(LocalDate.now());
        }

        // Reduce available stock if productId is present or product match
        if (dist.getProductId() != null) {
            Optional<Product> prodOpt = productRepository.findById(dist.getProductId());
            if (prodOpt.isPresent()) {
                Product product = prodOpt.get();
                double requestedQty = parseQuantity(dist.getQuantity());
                if (product.getStockQuantity() < requestedQty) {
                    throw new RuntimeException("Insufficient stock available for " + product.getProductName());
                }
                product.setStockQuantity(product.getStockQuantity() - requestedQty);
                if (product.getStockQuantity() < 300) {
                    product.setStatus("Limited Stock");
                }
                productRepository.save(product);
            }
        }

        return distributionRepository.save(dist);
    }

    public Distribution updateStatus(Long id, String status) {
        Distribution dist = distributionRepository.findById(id).orElseThrow(() -> new RuntimeException("Distribution record not found"));
        dist.setStatus(status);
        return distributionRepository.save(dist);
    }

    private double parseQuantity(String qtyStr) {
        try {
            String numeric = qtyStr.replaceAll("[^0-9.]", "");
            return numeric.isEmpty() ? 1.0 : Double.parseDouble(numeric);
        } catch (Exception e) {
            return 1.0;
        }
    }
}
