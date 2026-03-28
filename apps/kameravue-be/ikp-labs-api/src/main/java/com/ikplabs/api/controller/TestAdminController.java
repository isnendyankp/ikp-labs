package com.ikplabs.api.controller;

import com.ikplabs.api.dto.UserResponse;
import com.ikplabs.api.entity.User;
import com.ikplabs.api.repository.GalleryPhotoRepository;
import com.ikplabs.api.repository.PhotoLikeRepository;
import com.ikplabs.api.repository.PhotoFavoriteRepository;
import com.ikplabs.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * TestAdminController - REST API Controller khusus untuk Test Automation
 *
 * ⚠️ PENTING: Controller ini HANYA untuk keperluan automated testing!
 *
 * Tujuan:
 * 1. Cleanup test data setelah automated testing selesai
 * 2. Smart deletion: hapus hanya jika test PASS, simpan jika test FAIL untuk debugging
 * 3. Memudahkan Test Plan Checklist system
 *
 * Keamanan:
 * - ⚠️ Sebaiknya di-disable di production environment
 * - Hanya digunakan untuk test environment (localhost, test server)
 * - Tidak untuk manual testing atau production data
 *
 * Pattern Email untuk Auto-cleanup:
 * - autotest-* : User dari automated test (contoh: autotest-reg-001@example.com)
 * - qa-* : User dari QA automation (contoh: qa-login-test@example.com)
 * - testuser-* : User dari integration test (contoh: testuser-api-001@example.com)
 *
 * Pattern Email yang TIDAK akan di-cleanup:
 * - manual-* : User untuk manual testing
 * - demo-* : User untuk demo
 * - Email tanpa prefix khusus: Regular users
 *
 * @RestController = Kombinasi @Controller + @ResponseBody
 * @RequestMapping = Base path: /api/test-admin
 */
@RestController
@RequestMapping("/api/test-admin")
public class TestAdminController {

    /**
     * Dependency injection UserService
     * Controller → Service → Repository → Database
     */
    @Autowired
    private UserService userService;

    @Autowired
    private GalleryPhotoRepository galleryPhotoRepository;

    @Autowired
    private PhotoLikeRepository photoLikeRepository;

    @Autowired
    private PhotoFavoriteRepository photoFavoriteRepository;

    /**
     * Endpoint: DELETE /api/test-admin/users/{email}
     * Purpose: Hapus user berdasarkan email (untuk cleanup setelah test)
     *
     * Use case:
     * - Test PASSED → Hapus user test dari database
     * - Test FAILED → Tetap simpan user untuk debugging (tidak panggil endpoint ini)
     *
     * @PathVariable email = Email user yang akan dihapus
     * @return ResponseEntity dengan message dan status
     *
     * Example:
     * DELETE /api/test-admin/users/autotest-reg-001@example.com
     * Response: {"success": true, "message": "User autotest-reg-001@example.com deleted", "email": "autotest-reg-001@example.com"}
     */
    @DeleteMapping("/users/{email}")
    @Transactional
    public ResponseEntity<Map<String, Object>> deleteUserByEmail(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Cari user berdasarkan email
            Optional<User> userOpt = userService.getUserByEmail(email);

            if (userOpt.isEmpty()) {
                // User tidak ditemukan
                response.put("success", false);
                response.put("message", "User not found");
                response.put("email", email);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            User user = userOpt.get();
            Long userId = user.getId();

            // CASCADE DELETE: Hapus dalam urutan yang benar
            // 1. Hapus photo_likes untuk semua foto milik user ini
            photoLikeRepository.deleteByPhotoUserId(userId);

            // 2. Hapus photo_favorites untuk semua foto milik user ini
            photoFavoriteRepository.deleteByPhotoUserId(userId);

            // 3. Hapus gallery_photos milik user ini
            galleryPhotoRepository.deleteByUserId(userId);

            // 4. Hapus user
            userService.deleteUser(userId);

            // Success response
            response.put("success", true);
            response.put("message", "User " + email + " deleted with cascade");
            response.put("email", email);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // Error saat delete
            response.put("success", false);
            response.put("message", "Failed to delete user: " + e.getMessage());
            response.put("email", email);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint: DELETE /api/test-admin/cleanup/automated
     * Purpose: Hapus SEMUA user dengan pattern automated testing
     *
     * Pattern yang akan dihapus:
     * - Email starts with "autotest-"
     * - Email starts with "qa-"
     * - Email starts with "testuser-"
     *
     * Pattern yang TIDAK akan dihapus:
     * - Email starts with "manual-" (untuk manual testing)
     * - Email starts with "demo-" (untuk demo)
     * - Regular email tanpa prefix
     *
     * Use case:
     * - Cleanup massal setelah test suite selesai
     * - Reset test environment ke clean state
     *
     * @return ResponseEntity dengan jumlah users yang dihapus
     *
     * Example:
     * DELETE /api/test-admin/cleanup/automated
     * Response: {
     *   "success": true,
     *   "message": "Cleanup completed",
     *   "deletedCount": 15,
     *   "deletedUsers": ["autotest-1@example.com", "qa-login@example.com", ...]
     * }
     */
    @DeleteMapping("/cleanup/automated")
    public ResponseEntity<Map<String, Object>> cleanupAutomatedTestUsers() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Get semua users
            List<User> allUsers = userService.getAllUsers();

            // Filter users dengan automated test pattern
            List<User> testUsers = allUsers.stream()
                    .filter(user -> isAutomatedTestUser(user.getEmail()))
                    .collect(Collectors.toList());

            // Collect deleted user emails untuk response
            List<String> deletedEmails = testUsers.stream()
                    .map(User::getEmail)
                    .collect(Collectors.toList());

            // Delete semua test users
            for (User user : testUsers) {
                userService.deleteUser(user.getId());
            }

            // Success response
            response.put("success", true);
            response.put("message", "Cleanup completed");
            response.put("deletedCount", testUsers.size());
            response.put("deletedUsers", deletedEmails);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // Error saat cleanup
            response.put("success", false);
            response.put("message", "Cleanup failed: " + e.getMessage());
            response.put("deletedCount", 0);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Endpoint: GET /api/test-admin/users
     * Purpose: Get semua test users (untuk monitoring dan debugging)
     *
     * Filter:
     * - ?automated=true : Get only automated test users
     * - ?automated=false : Get only manual/demo users
     * - No param : Get ALL users
     *
     * @RequestParam automated = Filter automated test users (optional)
     * @return ResponseEntity dengan list user responses
     *
     * Example:
     * GET /api/test-admin/users?automated=true
     * Response: {
     *   "success": true,
     *   "totalCount": 15,
     *   "users": [
     *     {"id": 1, "fullName": "Auto Test 1", "email": "autotest-1@example.com", ...},
     *     {"id": 2, "fullName": "QA Test", "email": "qa-login@example.com", ...}
     *   ]
     * }
     */
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getTestUsers(
            @RequestParam(required = false) Boolean automated) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Get semua users
            List<User> allUsers = userService.getAllUsers();

            // Filter berdasarkan parameter
            List<User> filteredUsers;
            if (automated != null) {
                if (automated) {
                    // Get only automated test users
                    filteredUsers = allUsers.stream()
                            .filter(user -> isAutomatedTestUser(user.getEmail()))
                            .collect(Collectors.toList());
                } else {
                    // Get only manual/demo users
                    filteredUsers = allUsers.stream()
                            .filter(user -> !isAutomatedTestUser(user.getEmail()))
                            .collect(Collectors.toList());
                }
            } else {
                // Get ALL users
                filteredUsers = allUsers;
            }

            // Convert ke UserResponse DTOs
            List<UserResponse> userResponses = filteredUsers.stream()
                    .map(UserResponse::fromEntity)
                    .collect(Collectors.toList());

            // Success response
            response.put("success", true);
            response.put("totalCount", userResponses.size());
            response.put("users", userResponses);
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // Error
            response.put("success", false);
            response.put("message", "Failed to get users: " + e.getMessage());
            response.put("totalCount", 0);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * Helper method: Check apakah email termasuk automated test pattern
     *
     * Pattern automated testing:
     * - autotest-* : Automated test framework
     * - qa-* : QA automation
     * - testuser-* : Integration test
     *
     * @param email = Email yang akan dicek
     * @return true jika email match automated test pattern
     */
    private boolean isAutomatedTestUser(String email) {
        if (email == null) {
            return false;
        }

        String lowerEmail = email.toLowerCase();
        return lowerEmail.startsWith("autotest-") ||
               lowerEmail.startsWith("qa-") ||
               lowerEmail.startsWith("testuser-");
    }
}
