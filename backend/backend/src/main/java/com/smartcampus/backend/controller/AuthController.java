package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.GoogleLoginRequest;
import com.smartcampus.backend.dto.LoginRequest;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public User register(@Valid @RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        return authService.login(request.getEmail(), request.getPassword());
    }

    @GetMapping("/profile/{userId}")
    public Map<String, Object> getUserProfile(@PathVariable String userId) {
        return authService.getUserProfileWithPicture(userId);
    }

    @PutMapping("/profile/{userId}")
    public User updateUserProfile(@PathVariable String userId, @RequestBody User userData) {
        return authService.updateUserProfile(userId, userData);
    }

    @PostMapping("/profile/{userId}/picture")
    public User uploadProfilePicture(@PathVariable String userId, @RequestBody Map<String, String> request) {
        String pictureData = request.get("picture");
        return authService.uploadProfilePicture(userId, pictureData);
    @PostMapping("/google")
    public Map<String, Object> googleLogin(@RequestBody GoogleLoginRequest request) {
        return authService.googleLogin(request.getCredential());
    }
}