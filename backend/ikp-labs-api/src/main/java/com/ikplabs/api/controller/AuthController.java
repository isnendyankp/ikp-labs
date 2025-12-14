package com.ikplabs.api.controller;

import com.ikplabs.api.dto.LoginRequest;
import com.ikplabs.api.dto.LoginResponse;
import com.ikplabs.api.dto.UserRegistrationRequest;
import com.ikplabs.api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * AuthController - REST Controller untuk Authentication endpoints
 *
 * ANALOGI SEDERHANA:
 * ==================
 * AuthController seperti "Customer Service Khusus Login di Bioskop":
 *
 * Bayangkan di bioskop ada meja khusus untuk login member:
 * 1. Customer datang dengan form login (email + password)
 * 2. Customer Service (Controller) terima form
 * 3. Customer Service kirim ke Manager (AuthService) untuk validasi
 * 4. Manager return hasil: sukses (dapat tiket) atau gagal (ditolak)
 * 5. Customer Service kasih hasil ke customer
 *
 * TANGGUNG JAWAB CONTROLLER:
 * ==========================
 * 1. Handle HTTP requests dan responses
 * 2. Validasi input data (format, required fields)
 * 3. Delegate business logic ke AuthService
 * 4. Return appropriate HTTP status codes
 * 5. Exception handling untuk HTTP layer
 *
 * MENGAPA PISAH CONTROLLER DAN SERVICE:
 * ====================================
 * - Controller: Handle HTTP stuff (request/response, status codes)
 * - Service: Handle business logic (validation, JWT generation)
 * - Clean separation, easier testing, better maintainability
 *
 * @RestController = @Controller + @ResponseBody
 * @RequestMapping = Base URL untuk semua endpoints di controller ini
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    /**
     * AuthService - Business logic untuk authentication
     * Analogi: Manager yang handle validasi member
     */
    @Autowired
    private AuthService authService;

    /**
     * REGISTER ENDPOINT - User registration dengan JWT token
     * =======================================================
     *
     * ENDPOINT: POST /api/auth/register
     * PURPOSE: Register user baru dan generate JWT token
     *
     * FLOW PROSES:
     * 1. User kirim POST request dengan JSON body berisi fullName, email, password
     * 2. Spring Boot convert JSON ke UserRegistrationRequest object
     * 3. @Valid trigger validation (email format, password strength, required fields)
     * 4. Controller pass request ke AuthService
     * 5. AuthService:
     *    - Check email duplicate
     *    - Hash password dengan BCrypt
     *    - Save user ke database
     *    - Generate JWT token
     * 6. Return LoginResponse dengan token (user langsung bisa login)
     *
     * @param registrationRequest DTO berisi fullName, email, dan password
     * @return ResponseEntity dengan LoginResponse (token) dan HTTP status
     */
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody UserRegistrationRequest registrationRequest) {
        try {
            // Delegate ke AuthService untuk business logic
            LoginResponse response = authService.register(registrationRequest);

            // Cek hasil dari AuthService
            if (response.isSuccess()) {
                // Registration berhasil: return 201 Created dengan token
                return ResponseEntity.status(201).body(response);
            } else {
                // Registration gagal: return 400 Bad Request dengan error message
                return ResponseEntity.status(400).body(response);
            }

        } catch (Exception e) {
            // Handle unexpected errors
            System.err.println("Register endpoint error: " + e.getMessage());
            e.printStackTrace();

            // Return 500 Internal Server Error
            LoginResponse errorResponse = LoginResponse.error("Internal server error");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * LOGIN ENDPOINT - Main endpoint untuk user authentication
     * ========================================================
     *
     * ENDPOINT: POST /api/auth/login
     * PURPOSE: Authenticate user dan generate JWT token
     *
     * FLOW PROSES:
     * 1. User kirim POST request dengan JSON body berisi email + password
     * 2. Spring Boot convert JSON ke LoginRequest object
     * 3. @Valid trigger validation (email format, required fields)
     * 4. Controller pass LoginRequest ke AuthService
     * 5. AuthService return LoginResponse (success + token, atau error)
     * 6. Controller convert response ke HTTP response dengan status code
     *
     * @param loginRequest DTO berisi email dan password
     * @return ResponseEntity dengan LoginResponse dan HTTP status
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Delegate ke AuthService untuk business logic
            LoginResponse response = authService.login(loginRequest);

            // Cek hasil dari AuthService
            if (response.isSuccess()) {
                // Login berhasil: return 200 OK dengan token
                return ResponseEntity.ok(response);
            } else {
                // Login gagal: return 401 Unauthorized dengan error message
                return ResponseEntity.status(401).body(response);
            }

        } catch (Exception e) {
            // Handle unexpected errors
            System.err.println("Login endpoint error: " + e.getMessage());
            e.printStackTrace();

            // Return 500 Internal Server Error
            LoginResponse errorResponse = LoginResponse.error("Internal server error");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * REFRESH TOKEN ENDPOINT - Perpanjang masa berlaku token
     * =====================================================
     *
     * ENDPOINT: POST /api/auth/refresh
     * PURPOSE: Generate token baru tanpa login ulang
     *
     * @param token Token lama yang mau di-refresh
     * @return ResponseEntity dengan token baru atau error
     */
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@RequestParam String token) {
        try {
            LoginResponse response = authService.refreshToken(token);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body(response);
            }

        } catch (Exception e) {
            System.err.println("Refresh token error: " + e.getMessage());
            LoginResponse errorResponse = LoginResponse.error("Failed to refresh token");
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * VALIDATE TOKEN ENDPOINT - Cek apakah token masih valid
     * =====================================================
     *
     * ENDPOINT: POST /api/auth/validate
     * PURPOSE: Frontend bisa cek token validity
     *
     * @param token JWT token yang mau divalidasi
     * @param email Email user yang claim punya token
     * @return ResponseEntity dengan status validasi
     */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(
            @RequestParam String token,
            @RequestParam String email) {
        try {
            boolean isValid = authService.validateToken(token, email);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("valid", isValid);
            response.put("message", isValid ? "Token is valid" : "Token is invalid");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("valid", false);
            errorResponse.put("message", "Error validating token");
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    /**
     * HEALTH CHECK ENDPOINT - Cek apakah auth service berjalan
     * =======================================================
     *
     * ENDPOINT: GET /api/auth/health
     * PURPOSE: Monitoring dan debugging
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "AuthController");
        response.put("message", "Authentication service is running");
        response.put("timestamp", java.time.LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. HTTP Status Codes:
     *    - 200 OK: Request berhasil
     *    - 401 Unauthorized: Credentials salah
     *    - 500 Internal Server Error: Server error
     *
     * 2. Annotations Explained:
     *    - @PostMapping: Handle HTTP POST requests
     *    - @Valid: Trigger validation pada DTO
     *    - @RequestBody: Convert JSON request ke Java object
     *    - @RequestParam: Ambil parameter dari URL atau form data
     *
     * 3. Request/Response Flow:
     *    HTTP Request -> Controller -> Service -> Repository
     *    HTTP Response <- Controller <- Service <- Repository
     *
     * 4. Error Handling Strategy:
     *    - Business logic errors: Handle di Service, return error response
     *    - HTTP errors: Handle di Controller, return appropriate status code
     *    - Unexpected errors: Log error, return generic error message
     *
     * 5. Security Considerations:
     *    - Validation input data
     *    - Generic error messages
     *    - Proper HTTP status codes
     *    - No sensitive data in logs
     *
     * 6. Example Usage:
     *
     *    LOGIN REQUEST:
     *    POST /api/auth/login
     *    Content-Type: application/json
     *    {
     *      "email": "user@example.com",
     *      "password": "mypassword"
     *    }
     *
     *    SUCCESS RESPONSE:
     *    HTTP 200 OK
     *    {
     *      "success": true,
     *      "message": "Login successful",
     *      "token": "eyJhbGciOiJIUzUxMiJ9...",
     *      "tokenType": "Bearer",
     *      "userId": 1,
     *      "email": "user@example.com",
     *      "fullName": "John Doe",
     *      "loginTime": "2024-01-15T10:30:00"
     *    }
     *
     *    ERROR RESPONSE:
     *    HTTP 401 Unauthorized
     *    {
     *      "success": false,
     *      "message": "Invalid email or password"
     *    }
     */
}