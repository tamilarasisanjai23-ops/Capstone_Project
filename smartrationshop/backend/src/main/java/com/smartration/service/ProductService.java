package com.smartration.service;

import com.smartration.entity.Product;
import com.smartration.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product details) {
        Product existing = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setProductName(details.getProductName());
        existing.setStockQuantity(details.getStockQuantity());
        existing.setMonthlyQuota(details.getMonthlyQuota());
        existing.setUnit(details.getUnit());
        existing.setUnitPrice(details.getUnitPrice());
        existing.setStatus(details.getStockQuantity() < 300 ? "Limited Stock" : "In Stock");
        return productRepository.save(existing);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
