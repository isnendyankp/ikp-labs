package com.ikplabs.api.dto;

import com.ikplabs.api.entity.GalleryPhoto;

import java.time.LocalDateTime;

/**
 * GalleryPhotoDetailResponse - DTO for detailed single photo response
 *
 * ANALOGI SEDERHANA:
 * ==================
 * GalleryPhotoDetailResponse seperti "Kartu Detail Foto Lengkap":
 *
 * Bedanya dengan GalleryPhotoResponse:
 * - GalleryPhotoResponse: Basic info untuk list/grid (minimalist)
 * - GalleryPhotoDetailResponse: Full info untuk detail view (lengkap)
 *
 * Example use case:
 * - List view: Use GalleryPhotoResponse (hanya butuh id, title, thumbnail)
 * - Detail view: Use GalleryPhotoDetailResponse (butuh full info + metadata)
 *
 * ┌──────────────────────────────────────────┐
 * │  📷 DETAIL FOTO                          │
 * ├──────────────────────────────────────────┤
 * │  [===== Large Photo Display =====]       │
 * │                                          │
 * │  Sunset at Beach                         │
 * │  Beautiful sunset during vacation to     │
 * │  Bali in summer 2025...                  │
 * │                                          │
 * │  👤 Uploaded by: John Doe                │
 * │  📅 Upload: 2025-11-12 14:30:00          │
 * │  🔄 Updated: 2025-11-12 15:00:00         │
 * │  🔒 Privacy: Private                     │
 * │  📊 Order: 5                             │
 * │                                          │
 * │  [Edit] [Delete] [Toggle Privacy]        │
 * └──────────────────────────────────────────┘
 *
 * WHEN TO USE WHICH DTO?
 * ======================
 *
 * GalleryPhotoResponse (Basic):
 * - Photo list/grid endpoints
 * - Minimal data for performance
 * - Example: GET /api/gallery/my-photos (returns 12 photos)
 *
 * GalleryPhotoDetailResponse (Full):
 * - Single photo detail endpoint
 * - Complete metadata
 * - Example: GET /api/gallery/photo/123 (returns 1 photo with full info)
 *
 * Currently: SAME STRUCTURE (but can extend later!)
 * Future additions to DetailResponse only:
 * - Photo dimensions (width, height)
 * - File size in bytes
 * - View count
 * - Like count
 * - Comment count
 * - EXIF data (camera model, location, etc.)
 */
public class GalleryPhotoDetailResponse {

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
     * Owner email
     *
     * Email user yang upload.
     * Bisa digunakan untuk contact owner (if public photo)
     *
     * FUTURE: Consider privacy - maybe only show if photo is public
     */
    private String ownerEmail;

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
     *
     * Detail view dapat tampilkan full description (panjang).
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
     *
     * Detail view dapat show toggle button untuk change privacy.
     */
    private Boolean isPublic;

    /**
     * Upload order
     *
     * User-defined order untuk manual sorting.
     * Default: 0 (sort by createdAt instead)
     *
     * Detail view dapat show/edit this for manual arrangement.
     * FUTURE: Implement drag-and-drop reordering in gallery.
     */
    private Integer uploadOrder;

    /**
     * Created timestamp
     *
     * Kapan foto ini pertama kali diupload.
     * Format: ISO-8601 (e.g., "2025-11-12T14:30:00")
     *
     * Detail view can display: "Uploaded on Nov 12, 2025 at 2:30 PM"
     */
    private LocalDateTime createdAt;

    /**
     * Last update timestamp
     *
     * Kapan foto ini terakhir diupdate (title, description, or privacy).
     * Format: ISO-8601
     *
     * Detail view can display: "Last updated 5 minutes ago"
     */
    private LocalDateTime updatedAt;

    /**
     * Like count
     *
     * Jumlah total likes yang diterima foto ini.
     * Digunakan untuk tampilkan "❤️ 42" di UI detail page.
     */
    private Long likeCount;

    /**
     * Is liked by current user
     *
     * Boolean flag apakah user yang sedang login sudah like foto ini.
     * Digunakan untuk tampilkan heart icon state di detail page.
     */
    private Boolean isLikedByUser;

    /**
     * Default constructor - required by Spring for serialization
     */
    public GalleryPhotoDetailResponse() {
    }

    /**
     * Constructor with all fields
     *
     * Untuk manual creation (jarang dipakai).
     */
    public GalleryPhotoDetailResponse(Long id, Long userId, String ownerName, String ownerEmail,
                                      String title, String description, String filePath,
                                      Boolean isPublic, Integer uploadOrder,
                                      LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.userId = userId;
        this.ownerName = ownerName;
        this.ownerEmail = ownerEmail;
        this.title = title;
        this.description = description;
        this.filePath = filePath;
        this.isPublic = isPublic;
        this.uploadOrder = uploadOrder;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Static factory method - Convert Entity to DTO (without like data)
     *
     * RECOMMENDED WAY untuk create detail response dari entity.
     * Includes more fields than GalleryPhotoResponse (e.g., ownerEmail, uploadOrder).
     *
     * Use case:
     * - Service return entity dari database
     * - Controller convert ke DetailDTO untuk detail view
     *
     * Example:
     * ```
     * GalleryPhoto photo = galleryService.getPhotoById(123, userId);
     * GalleryPhotoDetailResponse response = GalleryPhotoDetailResponse.fromEntity(photo);
     * return ResponseEntity.ok(response);
     * ```
     *
     * NOTE: This method does NOT populate likeCount and isLikedByUser.
     * Use fromEntityWithLikes() if you need like data.
     *
     * @param photo GalleryPhoto entity from database
     * @return GalleryPhotoDetailResponse DTO for API response
     */
    public static GalleryPhotoDetailResponse fromEntity(GalleryPhoto photo) {
        GalleryPhotoDetailResponse response = new GalleryPhotoDetailResponse();
        response.setId(photo.getId());
        response.setUserId(photo.getUser().getId());
        response.setOwnerName(photo.getUser().getFullName());
        response.setOwnerEmail(photo.getUser().getEmail());
        response.setTitle(photo.getTitle());
        response.setDescription(photo.getDescription());
        response.setFilePath(photo.getFilePath());
        response.setIsPublic(photo.getIsPublic());
        response.setUploadOrder(photo.getUploadOrder());
        response.setCreatedAt(photo.getCreatedAt());
        response.setUpdatedAt(photo.getUpdatedAt());
        response.setLikeCount(0L); // Default to 0
        response.setIsLikedByUser(false); // Default to false
        return response;
    }

    /**
     * Static factory method - Convert Entity to DTO (WITH like data)
     *
     * RECOMMENDED WAY untuk create detail response dengan like information.
     * Use this method when fetching single photo detail.
     *
     * Use case:
     * - GET /api/gallery/photo/{id} - Get single photo detail with like data
     *
     * Example:
     * ```
     * GalleryPhoto photo = galleryService.getPhotoById(123, userId);
     * long likeCount = photoLikeService.getLikeCount(photo.getId());
     * boolean isLikedByUser = photoLikeService.isLikedByUser(photo.getId(), userId);
     * GalleryPhotoDetailResponse response = GalleryPhotoDetailResponse.fromEntityWithLikes(
     *     photo, userId, likeCount, isLikedByUser
     * );
     * return ResponseEntity.ok(response);
     * ```
     *
     * @param photo GalleryPhoto entity from database
     * @param currentUserId ID of current logged-in user
     * @param likeCount Total number of likes for this photo
     * @param isLikedByUser Whether current user has liked this photo
     * @return GalleryPhotoDetailResponse DTO with complete like information
     */
    public static GalleryPhotoDetailResponse fromEntityWithLikes(
            GalleryPhoto photo,
            Long currentUserId,
            long likeCount,
            boolean isLikedByUser) {

        GalleryPhotoDetailResponse response = fromEntity(photo);
        response.setLikeCount(likeCount);
        response.setIsLikedByUser(isLikedByUser);
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

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
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

    public Integer getUploadOrder() {
        return uploadOrder;
    }

    public void setUploadOrder(Integer uploadOrder) {
        this.uploadOrder = uploadOrder;
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

    public Long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Long likeCount) {
        this.likeCount = likeCount;
    }

    public Boolean getIsLikedByUser() {
        return isLikedByUser;
    }

    public void setIsLikedByUser(Boolean isLikedByUser) {
        this.isLikedByUser = isLikedByUser;
    }

    /**
     * toString for debugging
     */
    @Override
    public String toString() {
        return "GalleryPhotoDetailResponse{" +
                "id=" + id +
                ", userId=" + userId +
                ", ownerName='" + ownerName + '\'' +
                ", ownerEmail='" + ownerEmail + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", filePath='" + filePath + '\'' +
                ", isPublic=" + isPublic +
                ", uploadOrder=" + uploadOrder +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", likeCount=" + likeCount +
                ", isLikedByUser=" + isLikedByUser +
                '}';
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. WHY SEPARATE DETAIL RESPONSE DTO?
     *    ==================================
     *    PERFORMANCE OPTIMIZATION:
     *    - List endpoint: Return 12 photos → minimize data per photo
     *    - Detail endpoint: Return 1 photo → include all available data
     *
     *    EXAMPLE:
     *    List response (GalleryPhotoResponse):
     *    - 12 photos × 300 bytes = 3.6 KB total
     *    - Fast to transfer and render
     *
     *    Detail response (GalleryPhotoDetailResponse):
     *    - 1 photo × 500 bytes = 0.5 KB total
     *    - More data but only for 1 photo (still fast)
     *
     * 2. ADDITIONAL FIELDS IN DETAIL:
     *    =============================
     *    Current additions:
     *    - ownerEmail (for contact owner)
     *    - uploadOrder (for manual arrangement)
     *
     *    Future additions (easy to add):
     *    - Photo dimensions (width, height)
     *    - File size in bytes
     *    - View count (how many times viewed)
     *    - Like count (if implement likes)
     *    - Comment count (if implement comments)
     *    - EXIF data (camera model, GPS location, etc.)
     *    - Previous/Next photo IDs (for navigation)
     *
     * 3. WHEN TO USE WHICH DTO?
     *    =======================
     *    GalleryPhotoResponse:
     *    - GET /api/gallery/my-photos (list)
     *    - GET /api/gallery/public (list)
     *    - GET /api/gallery/user/{userId}/public (list)
     *    - POST /api/gallery/upload (response after upload)
     *    - PUT /api/gallery/photo/{id} (response after update)
     *
     *    GalleryPhotoDetailResponse:
     *    - GET /api/gallery/photo/{id} (single photo detail)
     *    - More detailed metadata needed
     *    - User viewing photo in lightbox/modal
     *
     * 4. PRIVACY CONSIDERATION FOR ownerEmail:
     *    ======================================
     *    CURRENT: Always include ownerEmail
     *    FUTURE: Consider privacy rules:
     *    - Public photo → show owner email (for contact)
     *    - Private photo → only show to owner (hide from others)
     *    - User settings → allow user to hide email even for public photos
     *
     *    Implementation:
     *    ```
     *    if (!photo.getIsPublic() && !photo.getUser().getId().equals(requestingUserId)) {
     *        response.setOwnerEmail(null); // Hide email for private photos
     *    }
     *    ```
     *
     * 5. UPLOAD ORDER USAGE:
     *    ===================
     *    Current: Always 0 (default sort by createdAt)
     *    Future: Manual arrangement feature
     *
     *    Implementation:
     *    - User drags photo in gallery to reorder
     *    - Frontend sends new order: PUT /api/gallery/photo/{id}/order
     *    - Backend updates uploadOrder field
     *    - Query: ORDER BY uploadOrder ASC, createdAt DESC
     *    - Result: Manual order first, then by date
     *
     * 6. EXAMPLE API RESPONSE (JSON):
     *    =============================
     *    GET /api/gallery/photo/123
     *
     *    {
     *      "id": 123,
     *      "userId": 83,
     *      "ownerName": "John Doe",
     *      "ownerEmail": "john@example.com",
     *      "title": "Sunset at Beach",
     *      "description": "Beautiful sunset during our family vacation to Bali in summer 2025. The colors were absolutely stunning!",
     *      "filePath": "gallery/user-83/photo-123-1731238845123.jpg",
     *      "isPublic": false,
     *      "uploadOrder": 0,
     *      "createdAt": "2025-11-12T14:30:00",
     *      "updatedAt": "2025-11-12T15:00:00"
     *    }
     *
     * 7. TYPICAL USAGE IN CONTROLLER:
     *    =============================
     *    @GetMapping("/photo/{photoId}")
     *    public ResponseEntity<GalleryPhotoDetailResponse> getPhotoDetail(
     *        @PathVariable Long photoId,
     *        @AuthenticationPrincipal UserDetails userDetails
     *    ) {
     *        Long userId = extractUserIdFromUserDetails(userDetails);
     *        GalleryPhoto photo = galleryService.getPhotoById(photoId, userId);
     *        GalleryPhotoDetailResponse response = GalleryPhotoDetailResponse.fromEntity(photo);
     *        return ResponseEntity.ok(response);
     *    }
     *
     * 8. DIFFERENCE SUMMARY:
     *    ===================
     *    GalleryPhotoResponse (Basic):
     *    - For: List/grid views
     *    - Fields: id, userId, ownerName, title, description, filePath, isPublic, createdAt, updatedAt
     *    - Use: Performance optimization for multiple photos
     *
     *    GalleryPhotoDetailResponse (Full):
     *    - For: Detail view/modal
     *    - Fields: All of above + ownerEmail, uploadOrder
     *    - Use: Complete metadata for single photo
     *    - Future: Can add more fields (dimensions, fileSize, viewCount, etc.)
     */
}
