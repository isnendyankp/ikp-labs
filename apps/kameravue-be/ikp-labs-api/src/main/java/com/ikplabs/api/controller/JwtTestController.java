package com.ikplabs.api.controller;

import com.ikplabs.api.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * JwtTestController - Temporary controller untuk test JWT functionality
 *
 * ANALOGI SEDERHANA:
 * ==================
 * Controller ini seperti "Demo Booth" di exhibition:
 * - Visitor datang untuk test JWT
 * - Demo person (controller) kasih contoh cara kerja JWT
 * - Visitor bisa coba generate token dan validate
 *
 * Temporary controller ini akan dihapus setelah AuthController dibuat
 */
@RestController
@RequestMapping("/api/jwt-test")
public class JwtTestController {

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * Test Generate JWT Token
     * Seperti demo "bikin tiket bioskop"
     */
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateTestToken(
            @RequestParam Long userId,
            @RequestParam String email,
            @RequestParam String fullName) {

        try {
            // Generate JWT token
            String token = jwtUtil.generateToken(userId, email, fullName);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "JWT token generated successfully");
            response.put("token", token);
            response.put("email", email);
            response.put("fullName", fullName);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to generate JWT token");
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Test Validate JWT Token
     * Seperti demo "cek tiket valid atau tidak"
     */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateTestToken(
            @RequestParam String token,
            @RequestParam String email) {

        try {
            // Validate JWT token
            Boolean isValid = jwtUtil.validateToken(token, email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("isValid", isValid);
            response.put("message", isValid ? "Token is valid" : "Token is invalid");

            if (isValid) {
                // Extract info from token if valid
                String extractedEmail = jwtUtil.extractEmail(token);
                String fullName = jwtUtil.getFullNameFromToken(token);

                response.put("extractedEmail", extractedEmail);
                response.put("extractedFullName", fullName);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("isValid", false);
            errorResponse.put("message", "Error validating token");
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    /**
     * Test Extract Token Info
     * Seperti demo "baca isi tiket"
     */
    @PostMapping("/extract")
    public ResponseEntity<Map<String, Object>> extractTokenInfo(@RequestParam String token) {

        try {
            // Extract all info from token
            String email = jwtUtil.extractEmail(token);
            String fullName = jwtUtil.getFullNameFromToken(token);
            Boolean isExpired = jwtUtil.isTokenExpired(token);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("email", email);
            response.put("fullName", fullName);
            response.put("isExpired", isExpired);
            response.put("message", "Token info extracted successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to extract token info");
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}