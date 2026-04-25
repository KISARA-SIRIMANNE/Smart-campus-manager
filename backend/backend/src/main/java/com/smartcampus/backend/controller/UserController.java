package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable String id) {
        return userService.getUserById(id);
    }

    // Update user role
    @PutMapping("/{id}/role")
    public User updateUserRole(@PathVariable String id, @RequestBody Map<String, String> request) {
        String newRole = request.get("role");
        return userService.updateUserRole(id, newRole);
    }

    // Get user statistics
    @GetMapping("/stats/count")
    public Map<String, Long> getUserStats() {
        return userService.getUserStats();
    }

    // Delete user (admin only)
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
    }
}
