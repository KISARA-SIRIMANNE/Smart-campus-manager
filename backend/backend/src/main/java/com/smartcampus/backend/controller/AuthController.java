package com.smartcampus.backend.controller;

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

    @PostMapping("/google/login")
    public Map<String, Object> googleLogin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String name = request.get("name");
        return authService.googleLogin(email, name);
    }

    @GetMapping("/google/success")
    public void googleLoginSuccess(@AuthenticationPrincipal OAuth2User oauth2User, HttpServletResponse response) throws IOException {
        Map<String, Object> authResponse = authService.loginWithGoogle(oauth2User);

        // Redirect to frontend with token
        String token = (String) authResponse.get("token");
        response.sendRedirect("http://localhost:5173/login?token=" + token);
    }

    @GetMapping("/google")
    public void googleLogin(HttpServletResponse response) throws IOException {
        // This will be handled by Spring Security OAuth2
        response.sendRedirect("/oauth2/authorization/google");
    }
}