package com.smartration.service;

import com.smartration.entity.Complaint;
import com.smartration.repository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    public List<Complaint> getComplaintsByCard(String cardNo) {
        return complaintRepository.findByRationCardNumber(cardNo);
    }

    public Complaint submitComplaint(Complaint complaint) {
        if (complaint.getComplaintNumber() == null || complaint.getComplaintNumber().isEmpty()) {
            complaint.setComplaintNumber("CMP-" + (1000 + (long) (Math.random() * 9000)));
        }
        if (complaint.getDateFiled() == null) {
            complaint.setDateFiled(LocalDate.now());
        }
        complaint.setStatus("Pending");
        return complaintRepository.save(complaint);
    }

    public Complaint updateComplaintStatus(Long id, String status) {
        Complaint complaint = complaintRepository.findById(id).orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }
}
