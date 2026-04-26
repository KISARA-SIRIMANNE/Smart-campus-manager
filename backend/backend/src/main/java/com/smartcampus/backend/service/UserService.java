package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by ID
    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    // Update user role
    public User updateUserRole(String id, String newRole) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            if ("ADMIN".equals(newRole) || "TECHNICIAN".equals(newRole) || "USER".equals(newRole)) {
                user.setRole(newRole);
                return userRepository.save(user);
            }
        }
        return null;
    }

    // Delete user
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    // Get user statistics
    public Map<String, Long> getUserStats() {
        Map<String, Long> stats = new HashMap<>();
        long total = userRepository.count();
        long adminCount = userRepository.countByRole("ADMIN");
        long technicianCount = userRepository.countByRole("TECHNICIAN");
        long userCount = userRepository.countByRole("USER");

        stats.put("TOTAL", total);
        stats.put("ADMIN", adminCount);
        stats.put("TECHNICIAN", technicianCount);
        stats.put("USER", userCount);

        return stats;
    }
}
