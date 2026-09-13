package com.smartration.service;

import com.smartration.dto.LoginRequest;
import com.smartration.dto.LoginResponse;
import com.smartration.entity.RationCard;
import com.smartration.entity.User;
import com.smartration.repository.RationCardRepository;
import com.smartration.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RationCardRepository rationCardRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(Map<String, Object> req) {
        String email = req.get("email") != null ? req.get("email").toString().trim() : "";
        String cardNo = req.get("cardNo") != null ? req.get("cardNo").toString().trim() : "";
        String rawPassword = req.get("password") != null ? req.get("password").toString() : "";
        String fullName = req.get("fullName") != null ? req.get("fullName").toString().trim() : "";
        String mobile = req.get("mobile") != null ? req.get("mobile").toString().trim() : "";
        String address = req.get("address") != null ? req.get("address").toString().trim() : "";
        int familyMembers = req.containsKey("familyMembers") ? Integer.parseInt(req.get("familyMembers").toString()) : 4;
        String cardType = req.containsKey("cardType") ? req.get("cardType").toString() : "PHH (Priority Household)";

        if (email.isEmpty()) {
            throw new RuntimeException("Email address is required.");
        }

        String hashedPassword = !rawPassword.isEmpty() ? passwordEncoder.encode(rawPassword) : "";

        Optional<User> existingUserOpt = userRepository.findByEmailIgnoreCase(email);
        User user;
        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
            if (!fullName.isEmpty()) user.setFullName(fullName);
            if (!mobile.isEmpty()) user.setMobile(mobile);
            if (!address.isEmpty()) user.setAddress(address);
            if (!hashedPassword.isEmpty()) user.setPassword(hashedPassword);
        } else {
            user = new User(
                fullName,
                email,
                mobile,
                address,
                hashedPassword,
                "customer"
            );
        }
        User savedUser = userRepository.save(user);

        Optional<RationCard> existingCardOpt = rationCardRepository.findByUserId(savedUser.getId());
        RationCard rationCard;
        if (existingCardOpt.isPresent()) {
            rationCard = existingCardOpt.get();
            if (!cardNo.isEmpty()) rationCard.setCardNumber(cardNo);
            rationCard.setCardType(cardType);
            rationCard.setFamilyMembers(familyMembers);
            if (!savedUser.getAddress().isEmpty()) rationCard.setAddress(savedUser.getAddress());
        } else {
            String finalCardNo = cardNo.isEmpty() ? "RC-" + savedUser.getId() : cardNo;
            rationCard = new RationCard(
                finalCardNo,
                cardType,
                familyMembers,
                savedUser.getAddress(),
                "Active",
                savedUser
            );
        }
        rationCardRepository.save(rationCard);

        return savedUser;
    }

    public LoginResponse loginUser(LoginRequest loginRequest) {
        String credential = loginRequest.getEmail() != null ? loginRequest.getEmail().trim() : "";
        String password = loginRequest.getPassword() != null ? loginRequest.getPassword() : "";

        // Check if admin login
        if ("admin@gmail.com".equalsIgnoreCase(credential) && ("admin123".equals(password) || passwordEncoder.matches(password, "$2a$10$xyzAdminPlaceholder"))) {
            return new LoginResponse(99L, "Administrator", "admin@gmail.com", "9999988888", "PDS HQ", "ADMIN-001", "Admin", 0, "admin");
        }

        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(credential);
        if (userOpt.isEmpty()) {
            // Check by card number
            Optional<RationCard> cardOpt = rationCardRepository.findByCardNumber(credential);
            if (cardOpt.isEmpty()) {
                cardOpt = rationCardRepository.findByUserEmail(credential);
            }
            if (cardOpt.isPresent()) {
                userOpt = Optional.ofNullable(cardOpt.get().getUser());
            }
        }

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword()) || user.getPassword().equals(password)) {
                Optional<RationCard> cardOpt = rationCardRepository.findByUserId(user.getId());

                String cardNo = cardOpt.map(RationCard::getCardNumber).orElse("RC-" + user.getId());
                String cardType = cardOpt.map(RationCard::getCardType).orElse("PHH (Priority Household)");
                Integer members = cardOpt.map(RationCard::getFamilyMembers).orElse(4);

                return new LoginResponse(
                    user.getId(),
                    user.getFullName(),
                    user.getEmail(),
                    user.getMobile(),
                    user.getAddress(),
                    cardNo,
                    cardType,
                    members,
                    user.getRole()
                );
            }
        }

        throw new RuntimeException("Invalid username/email or password.");
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }
}
