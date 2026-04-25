package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("userId", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        if (user.getProfilePicture() != null && !user.getProfilePicture().isEmpty()) {
            response.put("profilePicture", "data:image/png;base64," + user.getProfilePicture());
        }

        return response;
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Map<String, Object> getUserProfileWithPicture(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        if (user.getProfilePicture() != null && !user.getProfilePicture().isEmpty()) {
            response.put("profilePicture", "data:image/png;base64," + user.getProfilePicture());
        }

        return response;
    }

    public User updateUserProfile(String userId, User userData) {
        User user = getUserById(userId);
        if (userData.getName() != null && !userData.getName().isBlank()) {
            user.setName(userData.getName());
        }
        if (userData.getEmail() != null && !userData.getEmail().isBlank()) {
            user.setEmail(userData.getEmail());
        }
        return userRepository.save(user);
    }

    public User uploadProfilePicture(String userId, String pictureData) {
        User user = getUserById(userId);
        user.setProfilePicture(pictureData);
        return userRepository.save(user);
    }
}