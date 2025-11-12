package com.registrationform.api.dto;

import com.registrationform.api.entity.GalleryPhoto;

import java.time.LocalDateTime;

/**
 * GalleryPhotoResponse - DTO for single photo response
 *
 * ANALOGI SEDERHANA:
 * ==================
 * Response DTO seperti "Slip Bukti Upload":
 *
 * Backend kasih slip ini ke frontend setelah upload/update berhasil:
 * - ID foto: #123
 * - Owner: John Doe (user-83)
 * - Judul: "Sunset at Beach"
 * - Deskripsi: "Beautiful sunset..."
 * - File path: "/uploads/gallery/user-83/photo-123-1731238845123.jpg"
 * - Privacy: Public atau Private
 * - Uploaded: 2025-11-12 14:30:00
 *
 * Frontend terima slip ini dan tampilkan info ke user.
 *
 * Kenapa pakai DTO untuk Response?
 * - Hide internal entity details (e.g., lazy-loaded User entity)
 * - Control what data to expose to frontend
 * - Different format from database entity
 * - Prevent circular references (entity → user → photos → user...)
 *
 * Use Case:
 * - Response dari upload: POST /api/gallery/upload
 * - Response dari update: PUT /api/gallery/photo/{id}
 * - Response dari get single photo: GET /api/gallery/photo/{id}
 */
public class GalleryPhotoResponse {

    /**
     * Photo ID
     *
     * Primary key dari database.
     * Digunakan untuk identify photo untuk update/delete/view.
     */
    private Long id;

    /**
     * Owner user ID
     *
     * ID user yang upload foto ini.
     * Digunakan untuk authorization check dan menampilkan owner info.
     */
    private Long userId;

    /**
     * Owner full name
     *
     * Nama lengkap user yang upload.
     * Berguna untuk display "Uploaded by: John Doe"
     */
    private String ownerName;

    /**
     * Photo title (optional)
     *
     * Title foto yang user berikan.
     * Null jika user tidak set title.
     */
    private String title;

    /**
     * Photo description (optional)
     *
     * Deskripsi foto yang user berikan.
     * Null jika user tidak set description.
     */
    private String description;

    /**
     * File path
     *
     * Relative path ke file di server.
     * Example: "gallery/user-83/photo-123-1731238845123.jpg"
     *
     * Frontend tambahkan base URL untuk tampilkan:
     * Full URL: "http://localhost:8081/uploads/gallery/user-83/photo-123-1731238845123.jpg"
     */
    private String filePath;

    /**
     * Privacy setting
     *
     * - true = Public (visible to everyone)
     * - false = Private (visible to owner only)
     */
    private Boolean isPublic;

    /**
     * Created timestamp
     *
     * Kapan foto ini pertama kali diupload.
     * Format: ISO-8601 (e.g., "2025-11-12T14:30:00")
     */
    private LocalDateTime createdAt;

    /**
     * Last update timestamp
     *
     * Kapan foto ini terakhir diupdate (title, description, or privacy).
     * Format: ISO-8601
     */
    private LocalDateTime updatedAt;

    /**
     * Default constructor - required by Spring for serialization
     */
    public GalleryPhotoResponse() {
    }

    /**
     * Constructor with all fields
     *
     * Untuk manual creation (jarang dipakai).
     */
    public GalleryPhotoResponse(Long id, Long userId, String ownerName, String title,
                                String description, String filePath, Boolean isPublic,
                                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.ownerName = ownerName;
        this.title = title;
        this.description = description;
        this.filePath = filePath;
        this.isPublic = isPublic;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Static factory method - Convert Entity to DTO
     *
     * RECOMMENDED WAY untuk create response dari entity.
     * Lebih clean dan readable daripada new GalleryPhotoResponse(...).
     *
     * Use case:
     * - Service return entity dari database
     * - Controller convert ke DTO sebelum return ke frontend
     *
     * Example:
     * ```
     * GalleryPhoto photo = galleryService.uploadPhoto(...);
     * GalleryPhotoResponse response = GalleryPhotoResponse.fromEntity(photo);
     * return ResponseEntity.ok(response);
     * ```
     *
     * @param photo GalleryPhoto entity from database
     * @return GalleryPhotoResponse DTO for API response
     */
    public static GalleryPhotoResponse fromEntity(GalleryPhoto photo) {
        GalleryPhotoResponse response = new GalleryPhotoResponse();
        response.setId(photo.getId());
        response.setUserId(photo.getUser().getId());
        response.setOwnerName(photo.getUser().getFullName());
        response.setTitle(photo.getTitle());
        response.setDescription(photo.getDescription());
        response.setFilePath(photo.getFilePath());
        response.setIsPublic(photo.getIsPublic());
        response.setCreatedAt(photo.getCreatedAt());
        response.setUpdatedAt(photo.getUpdatedAt());
        return response;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * toString for debugging
     */
    @Override
    public String toString() {
        return "GalleryPhotoResponse{" +
                "id=" + id +
                ", userId=" + userId +
                ", ownerName='" + ownerName + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", filePath='" + filePath + '\'' +
                ", isPublic=" + isPublic +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. WHY SEPARATE RESPONSE DTO?
     *    ============================
     *    - Entity punya @ManyToOne User (lazy-loaded) → can cause LazyInitializationException
     *    - DTO hanya expose data yang frontend butuhkan
     *    - Prevent circular references (entity → user → photos → user...)
     *    - Control what data to expose (security)
     *
     * 2. WHY INCLUDE ownerName?
     *    =======================
     *    - Frontend butuh tampilkan "Uploaded by: John Doe"
     *    - Avoid additional API call untuk get user detail
     *    - Denormalization for performance (trade-off: more data in response)
     *
     * 3. FACTORY METHOD PATTERN (fromEntity):
     *    ======================================
     *    - Static factory method lebih clean daripada constructor panjang
     *    - Self-documenting: fromEntity() jelas maksudnya convert dari entity
     *    - Single responsibility: method ini hanya untuk convert
     *    - Easy to test dan maintain
     *
     * 4. FILE PATH FORMAT:
     *    ==================
     *    Database store: "gallery/user-83/photo-123-1731238845123.jpg"
     *    Frontend construct full URL: "http://localhost:8081/uploads/" + filePath
     *    Result: "http://localhost:8081/uploads/gallery/user-83/photo-123-1731238845123.jpg"
     *
     * 5. TIMESTAMP FORMAT:
     *    ==================
     *    - LocalDateTime automatically serialized to ISO-8601 by Spring
     *    - Frontend receive: "2025-11-12T14:30:00"
     *    - Frontend parse with Date() atau library (moment.js, date-fns)
     *
     * 6. EXAMPLE API RESPONSE (JSON):
     *    =============================
     *    {
     *      "id": 123,
     *      "userId": 83,
     *      "ownerName": "John Doe",
     *      "title": "Sunset at Beach",
     *      "description": "Beautiful sunset during vacation",
     *      "filePath": "gallery/user-83/photo-123-1731238845123.jpg",
     *      "isPublic": false,
     *      "createdAt": "2025-11-12T14:30:00",
     *      "updatedAt": "2025-11-12T14:30:00"
     *    }
     *
     * 7. TYPICAL USAGE IN CONTROLLER:
     *    =============================
     *    @PostMapping("/upload")
     *    public ResponseEntity<GalleryPhotoResponse> uploadPhoto(...) {
     *        GalleryPhoto photo = galleryService.uploadPhoto(...);
     *        GalleryPhotoResponse response = GalleryPhotoResponse.fromEntity(photo);
     *        return ResponseEntity.status(HttpStatus.CREATED).body(response);
     *    }
     */
}
