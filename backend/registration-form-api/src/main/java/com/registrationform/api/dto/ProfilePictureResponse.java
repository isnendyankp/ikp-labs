package com.registrationform.api.dto;

import java.time.LocalDateTime;

/**
 * ProfilePictureResponse - DTO untuk response profile picture operations
 *
 * ANALOGI SEDERHANA:
 * ==================
 * ProfilePictureResponse seperti "Struk/Receipt" yang diberikan petugas gudang
 * setelah customer upload/delete foto:
 *
 * Struk berisi:
 * - ✅ Berhasil atau gagal?
 * - 📝 Pesan: "Foto berhasil diupload!"
 * - 🖼️ URL foto: "http://localhost:8081/uploads/profiles/user-83.jpg"
 * - 👤 User info: ID, email, nama
 * - 🕐 Kapan diproses: timestamp
 *
 * DTO (Data Transfer Object) = Object untuk transfer data antar layers
 * Bukan entity (tidak save ke database), hanya untuk komunikasi API
 *
 * KAPAN RESPONSE INI DIGUNAKAN?
 * ==============================
 *
 * 1. Upload Success:
 *    POST /api/profile/upload-picture
 *    Response: ProfilePictureResponse dengan success=true, pictureUrl filled
 *
 * 2. Upload Failed:
 *    POST /api/profile/upload-picture (file too large)
 *    Response: ProfilePictureResponse dengan success=false, error message
 *
 * 3. Delete Success:
 *    DELETE /api/profile/picture
 *    Response: ProfilePictureResponse dengan success=true, pictureUrl=null
 *
 * 4. Get Picture Info:
 *    GET /api/profile/picture/{userId}
 *    Response: ProfilePictureResponse dengan picture URL
 *
 * STRUKTUR RESPONSE:
 * ==================
 *
 * Success Response (Upload):
 * {
 *   "success": true,
 *   "message": "Profile picture uploaded successfully",
 *   "pictureUrl": "/uploads/profiles/user-83.jpg",
 *   "userId": 83,
 *   "userEmail": "demo@example.com",
 *   "userName": "Demo User",
 *   "timestamp": "2025-10-27T14:30:00"
 * }
 *
 * Error Response (Upload Failed):
 * {
 *   "success": false,
 *   "message": "File size exceeds maximum limit of 5 MB",
 *   "pictureUrl": null,
 *   "userId": 83,
 *   "userEmail": "demo@example.com",
 *   "userName": "Demo User",
 *   "timestamp": "2025-10-27T14:30:00"
 * }
 *
 * Success Response (Delete):
 * {
 *   "success": true,
 *   "message": "Profile picture deleted successfully",
 *   "pictureUrl": null,
 *   "userId": 83,
 *   "userEmail": "demo@example.com",
 *   "userName": "Demo User",
 *   "timestamp": "2025-10-27T14:30:00"
 * }
 */
public class ProfilePictureResponse {

    /**
     * Success flag - apakah operation berhasil
     */
    private boolean success;

    /**
     * Message - pesan untuk user
     * Example: "Profile picture uploaded successfully"
     */
    private String message;

    /**
     * Picture URL - relative path ke uploaded file
     * Example: "/uploads/profiles/user-83.jpg"
     * Null jika tidak ada foto atau setelah delete
     */
    private String pictureUrl;

    /**
     * User ID - untuk tracking
     */
    private Long userId;

    /**
     * User Email - untuk informasi
     */
    private String userEmail;

    /**
     * User Name - untuk display
     */
    private String userName;

    /**
     * Timestamp - kapan operation dilakukan
     */
    private LocalDateTime timestamp;

    /**
     * Default Constructor - untuk Jackson JSON serialization
     */
    public ProfilePictureResponse() {
        this.timestamp = LocalDateTime.now();
    }

    /**
     * Full Constructor - untuk manual object creation
     */
    public ProfilePictureResponse(boolean success, String message, String pictureUrl,
                                   Long userId, String userEmail, String userName) {
        this.success = success;
        this.message = message;
        this.pictureUrl = pictureUrl;
        this.userId = userId;
        this.userEmail = userEmail;
        this.userName = userName;
        this.timestamp = LocalDateTime.now();
    }

    /**
     * Static Factory Method - Success response untuk upload
     *
     * Usage:
     * return ProfilePictureResponse.uploadSuccess(pictureUrl, user);
     *
     * @param pictureUrl URL foto yang di-upload
     * @param userId ID user
     * @param userEmail Email user
     * @param userName Nama user
     * @return ProfilePictureResponse dengan success=true
     */
    public static ProfilePictureResponse uploadSuccess(String pictureUrl, Long userId,
                                                        String userEmail, String userName) {
        return new ProfilePictureResponse(
            true,
            "Profile picture uploaded successfully",
            pictureUrl,
            userId,
            userEmail,
            userName
        );
    }

    /**
     * Static Factory Method - Error response untuk upload
     *
     * Usage:
     * return ProfilePictureResponse.uploadError("File too large", user);
     *
     * @param errorMessage Error message untuk user
     * @param userId ID user
     * @param userEmail Email user
     * @param userName Nama user
     * @return ProfilePictureResponse dengan success=false
     */
    public static ProfilePictureResponse uploadError(String errorMessage, Long userId,
                                                      String userEmail, String userName) {
        return new ProfilePictureResponse(
            false,
            errorMessage,
            null,  // No picture URL on error
            userId,
            userEmail,
            userName
        );
    }

    /**
     * Static Factory Method - Success response untuk delete
     *
     * Usage:
     * return ProfilePictureResponse.deleteSuccess(user);
     *
     * @param userId ID user
     * @param userEmail Email user
     * @param userName Nama user
     * @return ProfilePictureResponse dengan success=true, pictureUrl=null
     */
    public static ProfilePictureResponse deleteSuccess(Long userId, String userEmail, String userName) {
        return new ProfilePictureResponse(
            true,
            "Profile picture deleted successfully",
            null,  // No picture URL after delete
            userId,
            userEmail,
            userName
        );
    }

    /**
     * Static Factory Method - Info response (get current picture)
     *
     * Usage:
     * return ProfilePictureResponse.info(pictureUrl, user);
     *
     * @param pictureUrl URL foto saat ini (or null if no picture)
     * @param userId ID user
     * @param userEmail Email user
     * @param userName Nama user
     * @return ProfilePictureResponse dengan picture info
     */
    public static ProfilePictureResponse info(String pictureUrl, Long userId,
                                               String userEmail, String userName) {
        String message = pictureUrl != null
            ? "User has profile picture"
            : "User has no profile picture";

        return new ProfilePictureResponse(
            true,
            message,
            pictureUrl,
            userId,
            userEmail,
            userName
        );
    }

    // ==================== GETTERS & SETTERS ====================

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getPictureUrl() {
        return pictureUrl;
    }

    public void setPictureUrl(String pictureUrl) {
        this.pictureUrl = pictureUrl;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. Mengapa Perlu DTO?
     *    - Separate concerns: Entity untuk database, DTO untuk API
     *    - Control response format (tidak expose semua field Entity)
     *    - Flexibility: bisa ubah response tanpa ubah Entity
     *    - Security: tidak expose sensitive data (password, etc)
     *
     * 2. Static Factory Methods (Pattern Best Practice):
     *    - uploadSuccess(), uploadError(), deleteSuccess(), info()
     *    - Lebih readable: ProfilePictureResponse.uploadSuccess(...)
     *    - Dibanding: new ProfilePictureResponse(true, "Success", ...)
     *    - Clear intent: langsung tahu create response untuk apa
     *    - Consistent: semua response punya format sama
     *
     * 3. Timestamp Otomatis:
     *    - Constructor set LocalDateTime.now() otomatis
     *    - Frontend dapat timestamp untuk display/sorting
     *    - Useful untuk debugging (kapan operation terjadi)
     *
     * 4. Success Flag:
     *    - Frontend bisa check: if (response.success) { ... }
     *    - Alternative: check HTTP status code
     *    - Tapi success flag lebih explicit di response body
     *
     * 5. Picture URL Format:
     *    - Relative path: "/uploads/profiles/user-83.jpg"
     *    - Frontend combine dengan base URL: "http://localhost:8081" + pictureUrl
     *    - Result: "http://localhost:8081/uploads/profiles/user-83.jpg"
     *    - Benefit: easy migration ke CDN (ganti base URL saja)
     *
     * 6. User Info Included:
     *    - userId, userEmail, userName untuk context
     *    - Frontend bisa update UI tanpa additional request
     *    - Useful untuk confirmation messages
     *
     * 7. Null Picture URL:
     *    - null = user tidak punya foto
     *    - null setelah delete
     *    - Frontend handle: tampilkan default avatar
     *
     * 8. Error Handling:
     *    - uploadError() untuk business errors (validation)
     *    - FileUploadException untuk system errors
     *    - Clear separation of concerns
     */
}
