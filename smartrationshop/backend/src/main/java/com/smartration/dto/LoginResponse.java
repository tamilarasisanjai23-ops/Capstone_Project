package com.smartration.dto;

public class LoginResponse {

    private Long id;
    private String fullName;
    private String email;
    private String mobile;
    private String address;
    private String cardNo;
    private String cardType;
    private Integer familyMembers;
    private String role;

    public LoginResponse() {}

    public LoginResponse(Long id, String fullName, String email, String mobile, String address, String cardNo, String cardType, Integer familyMembers, String role) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.mobile = mobile;
        this.address = address;
        this.cardNo = cardNo;
        this.cardType = cardType;
        this.familyMembers = familyMembers;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCardNo() { return cardNo; }
    public void setCardNo(String cardNo) { this.cardNo = cardNo; }

    public String getCardType() { return cardType; }
    public void setCardType(String cardType) { this.cardType = cardType; }

    public Integer getFamilyMembers() { return familyMembers; }
    public void setFamilyMembers(Integer familyMembers) { this.familyMembers = familyMembers; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
