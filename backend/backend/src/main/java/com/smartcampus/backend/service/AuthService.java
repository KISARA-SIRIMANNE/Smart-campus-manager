package com.smartcampus.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private static final String GOOGLE_CLIENT_ID = "813807187417-bn4s4dscnfabeshdvfoem0kl1ddb7bac.apps.googleusercontent.com";

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new RuntimeException("Please use Google login for this account");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return buildLoginResponse("Login successful", user);
    }

    public Map<String, Object> googleLogin(String credential) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            )
                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(credential);

            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();

            String email = payload.getEmail();
            String name = (String) payload.get("name");

            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                user = User.builder()
                        .name(name)
                        .email(email)
                        .password(passwordEncoder.encode("GOOGLE_LOGIN_USER"))
                        .role("USER")
                        .build();

                user = userRepository.save(user);
            }

            return buildLoginResponse("Google login successful", user);

        } catch (Exception e) {
            throw new RuntimeException("Google login failed");
        }
    }

    private Map<String, Object> buildLoginResponse(String message, User user) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
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