package com.smartration.controller;

import com.smartration.dto.AdminDashboardDTO;
import com.smartration.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getAdminDashboardStats() {
        return ResponseEntity.ok(adminService.getAdminDashboardStats());
    }
}
