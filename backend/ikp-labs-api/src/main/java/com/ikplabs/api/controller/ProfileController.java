package com.ikplabs.api.controller;

import com.ikplabs.api.dto.ProfilePictureResponse;
import com.ikplabs.api.entity.User;
import com.ikplabs.api.exception.FileUploadException;
import com.ikplabs.api.repository.UserRepository;
import com.ikplabs.api.security.UserPrincipal;
import com.ikplabs.api.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * ProfileController - REST Controller untuk profile picture operations
 *
 * ANALOGI SEDERHANA:
 * ==================
 * ProfileController seperti "Front Desk Foto Studio":
 *
 * Customer (Frontend) datang dengan permintaan:
 * 1. "Saya mau upload foto" → POST /api/profile/upload-picture
 * 2. "Hapus foto saya" → DELETE /api/profile/picture
 * 3. "Lihat foto saya" → GET /api/profile/picture
 *
 * Front Desk (Controller) terima request:
 * 1. Validasi: Apakah customer punya akses? (Authentication)
 * 2. Process: Kirim ke petugas gudang (FileStorageService)
 * 3. Response: Kasih receipt ke customer (ProfilePictureResponse)
 *
 * TANGGUNG JAWAB CONTROLLER:
 * ===========================
 * 1. Handle HTTP requests (GET, POST, DELETE)
 * 2. Extract data dari request (file, user info)
 * 3. Validate authentication (user sudah login?)
 * 4. Call service layer (FileStorageService)
 * 5. Handle errors (try-catch)
 * 6. Return HTTP response (success/error)
 *
 * ENDPOINTS:
 * ==========
 * 1. POST   /api/profile/upload-picture - Upload profile picture
 * 2. DELETE /api/profile/picture        - Delete profile picture
 * 3. GET    /api/profile/picture        - Get current user's picture info
 * 4. GET    /api/profile/picture/{userId} - Get specific user's picture (for display)
 *
 * @RestController = @Controller + @ResponseBody
 * @RequestMapping = Base URL untuk semua endpoints
 */
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    /**
     * FileStorageService - Service untuk handle file operations
     * Autowired = Spring inject dependency otomatis
     */
    @Autowired
    private FileStorageService fileStorageService;

    /**
     * UserRepository - Untuk akses database users
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * UPLOAD PROFILE PICTURE ENDPOINT
     * ================================
     *
     * Endpoint: POST /api/profile/upload-picture
     * Purpose: Upload atau replace profile picture
     * Auth: Required (must be logged in)
     *
     * FLOW PROSES:
     * 1. User kirim file via multipart/form-data
     * 2. Controller extract authenticated user dari JWT token
     * 3. Validate file via FileStorageService
     * 4. Save file ke disk (uploads/profiles/)
     * 5. Update database (user.profilePicture = path)
     * 6. Return success response dengan picture URL
     *
     * REQUEST:
     * --------
     * POST /api/profile/upload-picture
     * Content-Type: multipart/form-data
     * Authorization: Bearer {jwt-token}
     *
     * Form Data:
     * - file: (binary file) - The image file to upload
     *
     * SUCCESS RESPONSE (HTTP 200):
     * ---------------------------
     * {
     *   "success": true,
     *   "message": "Profile picture uploaded successfully",
     *   "pictureUrl": "/uploads/profiles/user-83.jpg",
     *   "userId": 83,
     *   "userEmail": "demo@example.com",
     *   "userName": "Demo User",
     *   "timestamp": "2025-10-27T15:30:00"
     * }
     *
     * ERROR RESPONSE (HTTP 400):
     * -------------------------
     * {
     *   "message": "File size exceeds maximum limit of 5 MB",
     *   "errorCode": "FILE_UPLOAD_ERROR",
     *   "timestamp": "2025-10-27T15:30:00"
     * }
     *
     * @param file Uploaded file dari frontend
     * @param authentication Spring Security authentication object (auto-injected)
     * @return ResponseEntity dengan ProfilePictureResponse
     */
    @PostMapping("/upload-picture")
    public ResponseEntity<ProfilePictureResponse> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        try {
            // STEP 1: GET AUTHENTICATED USER
            // Extract user principal dari JWT token
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            Long userId = userPrincipal.getId();

            // Get user dari database
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // STEP 2: SAVE FILE VIA SERVICE
            // FileStorageService will:
            // - Validate file (size, type, extension)
            // - Delete old picture if exists
            // - Save new file to disk
            // - Return file path
            String filePath = fileStorageService.saveProfilePicture(file, userId);

            // STEP 3: UPDATE DATABASE
            // Save file path to user.profilePicture column
            user.setProfilePicture(filePath);
            userRepository.save(user);

            System.out.println("✅ Profile picture uploaded for user " + userId + ": " + filePath);

            // STEP 4: RETURN SUCCESS RESPONSE
            ProfilePictureResponse response = ProfilePictureResponse.uploadSuccess(
                filePath,
                user.getId(),
                user.getEmail(),
                user.getFullName()
            );

            return ResponseEntity.ok(response);

        } catch (FileUploadException e) {
            // File validation errors (size, type, extension)
            System.err.println("❌ File upload validation error: " + e.getMessage());

            // FileUploadException will be caught by GlobalExceptionHandler
            // and converted to proper HTTP 400 response
            throw e;

        } catch (IOException e) {
            // File system errors (disk full, permission denied, etc)
            System.err.println("❌ File save error: " + e.getMessage());
            e.printStackTrace();

            throw new FileUploadException("Could not save file. Please try again.", e);

        } catch (Exception e) {
            // Unexpected errors
            System.err.println("❌ Unexpected error during upload: " + e.getMessage());
            e.printStackTrace();

            throw new RuntimeException("Failed to upload profile picture", e);
        }
    }

    /**
     * DELETE PROFILE PICTURE ENDPOINT
     * ================================
     *
     * Endpoint: DELETE /api/profile/picture
     * Purpose: Delete user's current profile picture
     * Auth: Required (must be logged in)
     *
     * FLOW PROSES:
     * 1. Extract authenticated user dari JWT token
     * 2. Delete file dari disk (via FileStorageService)
     * 3. Update database (set profilePicture = null)
     * 4. Return success response
     *
     * REQUEST:
     * --------
     * DELETE /api/profile/picture
     * Authorization: Bearer {jwt-token}
     *
     * SUCCESS RESPONSE (HTTP 200):
     * ---------------------------
     * {
     *   "success": true,
     *   "message": "Profile picture deleted successfully",
     *   "pictureUrl": null,
     *   "userId": 83,
     *   "userEmail": "demo@example.com",
     *   "userName": "Demo User",
     *   "timestamp": "2025-10-27T15:30:00"
     * }
     *
     * @param authentication Spring Security authentication object
     * @return ResponseEntity dengan ProfilePictureResponse
     */
    @DeleteMapping("/picture")
    public ResponseEntity<ProfilePictureResponse> deleteProfilePicture(
            Authentication authentication) {

        try {
            // STEP 1: GET AUTHENTICATED USER
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            Long userId = userPrincipal.getId();

            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // STEP 2: DELETE FILE FROM DISK
            fileStorageService.deleteProfilePicture(userId);

            // STEP 3: UPDATE DATABASE
            user.setProfilePicture(null);
            userRepository.save(user);

            System.out.println("✅ Profile picture deleted for user " + userId);

            // STEP 4: RETURN SUCCESS RESPONSE
            ProfilePictureResponse response = ProfilePictureResponse.deleteSuccess(
                user.getId(),
                user.getEmail(),
                user.getFullName()
            );

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            System.err.println("❌ Error deleting file: " + e.getMessage());
            throw new FileUploadException("Could not delete profile picture", e);

        } catch (Exception e) {
            System.err.println("❌ Unexpected error during delete: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete profile picture", e);
        }
    }

    /**
     * GET CURRENT USER'S PICTURE INFO
     * ================================
     *
     * Endpoint: GET /api/profile/picture
     * Purpose: Get authenticated user's current profile picture info
     * Auth: Required (must be logged in)
     *
     * REQUEST:
     * --------
     * GET /api/profile/picture
     * Authorization: Bearer {jwt-token}
     *
     * SUCCESS RESPONSE (HTTP 200):
     * ---------------------------
     * {
     *   "success": true,
     *   "message": "User has profile picture",
     *   "pictureUrl": "/uploads/profiles/user-83.jpg",
     *   "userId": 83,
     *   "userEmail": "demo@example.com",
     *   "userName": "Demo User",
     *   "timestamp": "2025-10-27T15:30:00"
     * }
     *
     * OR (if no picture):
     * {
     *   "success": true,
     *   "message": "User has no profile picture",
     *   "pictureUrl": null,
     *   ...
     * }
     *
     * @param authentication Spring Security authentication object
     * @return ResponseEntity dengan ProfilePictureResponse
     */
    @GetMapping("/picture")
    public ResponseEntity<ProfilePictureResponse> getCurrentUserPicture(
            Authentication authentication) {

        try {
            // GET AUTHENTICATED USER
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            Long userId = userPrincipal.getId();

            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

            // RETURN PICTURE INFO
            ProfilePictureResponse response = ProfilePictureResponse.info(
                user.getProfilePicture(),
                user.getId(),
                user.getEmail(),
                user.getFullName()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error getting picture info: " + e.getMessage());
            throw new RuntimeException("Failed to get profile picture info", e);
        }
    }

    /**
     * GET SPECIFIC USER'S PICTURE INFO
     * =================================
     *
     * Endpoint: GET /api/profile/picture/{userId}
     * Purpose: Get any user's profile picture URL (for display in UI)
     * Auth: Required (must be logged in)
     *
     * Use case: Display other users' profile pictures in comments, posts, etc.
     *
     * REQUEST:
     * --------
     * GET /api/profile/picture/83
     * Authorization: Bearer {jwt-token}
     *
     * SUCCESS RESPONSE (HTTP 200):
     * ---------------------------
     * {
     *   "success": true,
     *   "message": "User has profile picture",
     *   "pictureUrl": "/uploads/profiles/user-83.jpg",
     *   "userId": 83,
     *   "userEmail": "demo@example.com",
     *   "userName": "Demo User",
     *   "timestamp": "2025-10-27T15:30:00"
     * }
     *
     * @param userId User ID to get picture for
     * @return ResponseEntity dengan ProfilePictureResponse
     */
    @GetMapping("/picture/{userId}")
    public ResponseEntity<ProfilePictureResponse> getUserPicture(
            @PathVariable Long userId) {

        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

            ProfilePictureResponse response = ProfilePictureResponse.info(
                user.getProfilePicture(),
                user.getId(),
                user.getEmail(),
                user.getFullName()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("❌ Error getting user picture: " + e.getMessage());
            throw new RuntimeException("Failed to get user profile picture", e);
        }
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. Authentication Parameter:
     *    - Spring Security auto-inject Authentication object
     *    - Berisi info user yang sedang login
     *    - Extract via: (UserPrincipal) authentication.getPrincipal()
     *
     * 2. @RequestParam("file"):
     *    - Extract file dari multipart/form-data
     *    - Frontend kirim dengan FormData.append("file", fileObject)
     *    - Type: MultipartFile (Spring Boot type untuk uploaded files)
     *
     * 3. Error Handling Strategy:
     *    - FileUploadException: Validation errors (catch di GlobalExceptionHandler)
     *    - IOException: File system errors (wrap dalam FileUploadException)
     *    - RuntimeException: Business logic errors
     *    - Semua return proper HTTP status via GlobalExceptionHandler
     *
     * 4. Transaction Flow:
     *    - Save file FIRST (dapat path)
     *    - Update database SECOND (simpan path)
     *    - Kalau database gagal, file tetap ada (acceptable)
     *    - Alternative: Use @Transactional for rollback (more complex)
     *
     * 5. Security:
     *    - All endpoints require authentication (JWT token)
     *    - User can only upload/delete their own picture
     *    - User can view any user's picture (public info)
     *    - File validation in service layer
     *
     * 6. Response Format:
     *    - Always use ProfilePictureResponse DTO
     *    - Consistent format untuk semua operations
     *    - Include user context (no additional requests needed)
     *
     * 7. Logging:
     *    - Success operations: System.out.println with ✅
     *    - Errors: System.err.println with ❌
     *    - Include relevant info (userId, filePath, error message)
     *
     * 8. Frontend Integration:
     *    - Upload: Send file via FormData with "file" key
     *    - Delete: Simple DELETE request with JWT token
     *    - Get: GET request to get picture URL
     *    - Display: Combine base URL + pictureUrl from response
     */
}
