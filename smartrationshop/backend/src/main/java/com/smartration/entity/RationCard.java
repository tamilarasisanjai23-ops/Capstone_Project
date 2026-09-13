package com.smartration.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ration_cards")
public class RationCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String cardNumber;

    @Column(nullable = false)
    private String cardType;

    @Column(nullable = false)
    private Integer familyMembers;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String status = "Active";

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public RationCard() {}

    public RationCard(String cardNumber, String cardType, Integer familyMembers, String address, String status, User user) {
        this.cardNumber = cardNumber;
        this.cardType = cardType;
        this.familyMembers = familyMembers;
        this.address = address;
        this.status = status;
        this.user = user;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    public String getCardType() { return cardType; }
    public void setCardType(String cardType) { this.cardType = cardType; }

    public Integer getFamilyMembers() { return familyMembers; }
    public void setFamilyMembers(Integer familyMembers) { this.familyMembers = familyMembers; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
