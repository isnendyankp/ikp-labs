package com.registrationform.api.controller;

import com.registrationform.api.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * UserProfileController - Test Controller untuk Protected Endpoints
 *
 * ANALOGI SEDERHANA:
 * ==================
 * Controller ini seperti "VIP Lounge Hotel yang Perlu Key Card":
 *
 * Bayangkan VIP lounge di hotel yang hanya bisa diakses dengan key card valid:
 * 1. Tamu datang ke pintu VIP lounge
 * 2. Security guard (JWT filter) cek key card
 * 3. Kalau valid: buka pintu, tamu masuk lounge
 * 4. Staff lounge (controller) sambut tamu dengan info personal
 * 5. Kalau tidak ada key card: ditolak di pintu, tidak sampai ke controller
 *
 * TUJUAN CONTROLLER INI:
 * ======================
 * 1. Testing JWT Authentication Filter
 * 2. Demo protected endpoint yang perlu authentication
 * 3. Show cara akses current user info
 * 4. Contoh authorization berdasarkan user role
 *
 * @RestController = Controller untuk REST API
 * @RequestMapping = Base URL untuk semua endpoints
 */
@RestController
@RequestMapping("/api/user")
public class UserProfileController {

    /**
     * GET CURRENT USER PROFILE - Endpoint yang perlu authentication
     * ============================================================
     *
     * ANALOGI: "VIP Lounge Reception yang Sambut Tamu"
     *
     * Flow:
     * 1. Client kirim request dengan JWT token di header
     * 2. JWT Filter cek token, extract user info, set SecurityContext
     * 3. Controller otomatis dapat current user dari @AuthenticationPrincipal
     * 4. Return user profile info
     *
     * Request yang dibutuhkan:
     * GET /api/user/profile
     * Header: Authorization: Bearer <jwt-token>
     *
     * @param currentUser Current user yang sedang login (dari JWT token)
     * @return User profile information
     */
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getCurrentUserProfile(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Kalau currentUser null, berarti JWT filter gagal authenticate
        if (currentUser == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "User not authenticated");
            return ResponseEntity.status(401).body(errorResponse);
        }

        // Build response dengan info user
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User profile retrieved successfully");

        // User info dari JWT token
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", currentUser.getId());
        userInfo.put("email", currentUser.getEmail());
        userInfo.put("fullName", currentUser.getFullName());
        userInfo.put("username", currentUser.getUsername());
        userInfo.put("authorities", currentUser.getAuthorities());

        response.put("user", userInfo);
        response.put("timestamp", java.time.LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    /**
     * GET USER DASHBOARD - Endpoint dengan role-based access
     * =====================================================
     *
     * ANALOGI: "Executive Lounge yang Cek Level Membership"
     *
     * @param currentUser Current user yang sedang login
     * @return Dashboard info berdasarkan user role
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getUserDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Authentication required");
            return ResponseEntity.status(401).body(errorResponse);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Welcome to your dashboard, " + currentUser.getFullName());

        // Dashboard info berdasarkan role
        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("userId", currentUser.getId());
        dashboardData.put("welcomeMessage", "Hello, " + currentUser.getFullName() + "!");
        dashboardData.put("lastLogin", java.time.LocalDateTime.now());

        // Info berdasarkan authorities/roles
        boolean isAdmin = currentUser.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            dashboardData.put("adminPanel", true);
            dashboardData.put("userCount", "Admin access granted");
        } else {
            dashboardData.put("adminPanel", false);
            dashboardData.put("userLevel", "Regular User");
        }

        response.put("dashboard", dashboardData);

        return ResponseEntity.ok(response);
    }

    /**
     * UPDATE USER SETTINGS - Test endpoint untuk modify operations
     * ===========================================================
     *
     * @param currentUser Current user yang sedang login
     * @return Update confirmation
     */
    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getUserSettings(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User settings for " + currentUser.getEmail());

        Map<String, Object> settings = new HashMap<>();
        settings.put("userId", currentUser.getId());
        settings.put("email", currentUser.getEmail());
        settings.put("fullName", currentUser.getFullName());
        settings.put("accountStatus", "Active");
        settings.put("lastModified", java.time.LocalDateTime.now());

        response.put("settings", settings);

        return ResponseEntity.ok(response);
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. @AuthenticationPrincipal:
     *    - Annotation untuk inject current user otomatis
     *    - Spring Security ambil dari SecurityContext
     *    - Null kalau user tidak authenticated
     *
     * 2. Protected Endpoint Flow:
     *    Request → JWT Filter → SecurityContext → Controller → @AuthenticationPrincipal
     *
     * 3. Authorization Levels:
     *    - Authentication: User punya valid JWT token
     *    - Authorization: User punya role/permission yang tepat
     *
     * 4. Error Handling:
     *    - 401 Unauthorized: No valid token
     *    - 403 Forbidden: Valid token but insufficient permissions
     *    - 200 OK: Authenticated and authorized
     *
     * 5. Security Best Practices:
     *    - Always check currentUser != null
     *    - Return minimal info in error responses
     *    - Log access attempts untuk audit
     *
     * 6. Testing Strategy:
     *    - Test with valid JWT token
     *    - Test with expired JWT token
     *    - Test with no Authorization header
     *    - Test with malformed token
     */
}