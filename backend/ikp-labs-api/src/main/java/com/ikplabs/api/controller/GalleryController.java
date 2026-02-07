package com.ikplabs.api.controller;

import com.ikplabs.api.dto.GalleryListResponse;
import com.ikplabs.api.dto.GalleryPhotoDetailResponse;
import com.ikplabs.api.dto.GalleryPhotoRequest;
import com.ikplabs.api.dto.GalleryPhotoResponse;
import com.ikplabs.api.entity.GalleryPhoto;
import com.ikplabs.api.security.UserPrincipal;
import com.ikplabs.api.service.GalleryService;
import com.ikplabs.api.service.PhotoLikeService;
import com.ikplabs.api.service.PhotoFavoriteService;
import com.ikplabs.api.util.PaginationUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

/**
 * GalleryController - REST API endpoints for photo gallery feature
 *
 * ANALOGI SEDERHANA:
 * ==================
 * GalleryController seperti "Petugas di Galeri Foto":
 *
 * Bayangkan galeri foto dengan petugas yang melayani:
 * - Upload foto → "Mau upload foto baru? Isi form ini dulu!"
 * - Lihat foto saya → "Ini semua foto Anda (termasuk private)"
 * - Lihat foto public → "Ini foto-foto yang dibuka untuk umum"
 * - Detail foto → "Ini detail lengkap foto ID 123"
 * - Edit foto → "Mau edit judul/deskripsi? Silakan!"
 * - Hapus foto → "Yakin mau hapus? OK, dihapus!"
 * - Toggle privacy → "Mau ubah jadi public/private? OK!"
 *
 * REST API ENDPOINTS (8 total):
 * ==============================
 * 1. POST   /api/gallery/upload           → Upload new photo
 * 2. GET    /api/gallery/my-photos        → Get my photos (all, including private)
 * 3. GET    /api/gallery/public           → Get all public photos
 * 4. GET    /api/gallery/user/{userId}/public → Get user's public photos
 * 5. GET    /api/gallery/photo/{photoId}  → Get single photo detail
 * 6. PUT    /api/gallery/photo/{photoId}  → Update photo metadata
 * 7. DELETE /api/gallery/photo/{photoId}  → Delete photo
 * 8. PUT    /api/gallery/photo/{photoId}/toggle-privacy → Toggle public/private
 *
 * All endpoints require authentication (JWT token in header).
 *
 * @RestController = Controller untuk REST API
 * @RequestMapping = Base URL untuk semua endpoints ("/api/gallery")
 */
@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    @Autowired
    private GalleryService galleryService;

    @Autowired
    private PhotoLikeService photoLikeService;

    @Autowired
    private PhotoFavoriteService photoFavoriteService;

    /**
     * ENDPOINT 1: UPLOAD PHOTO
     * ========================
     * POST /api/gallery/upload
     *
     * Upload new photo dengan optional title, description, dan privacy setting.
     *
     * Request (multipart/form-data):
     * - file: MultipartFile (required) - photo file (JPEG, PNG, etc.)
     * - title: String (optional) - photo title (max 100 chars)
     * - description: String (optional) - photo description (max 5000 chars)
     * - isPublic: Boolean (optional) - privacy setting (default: false)
     *
     * Example request:
     * ```
     * POST /api/gallery/upload
     * Content-Type: multipart/form-data
     * Authorization: Bearer <jwt-token>
     *
     * Form data:
     * file: [binary photo file]
     * title: "Sunset at Beach"
     * description: "Beautiful sunset during vacation"
     * isPublic: false
     * ```
     *
     * Response (201 Created):
     * ```json
     * {
     *   "id": 123,
     *   "userId": 83,
     *   "ownerName": "John Doe",
     *   "title": "Sunset at Beach",
     *   "description": "Beautiful sunset during vacation",
     *   "filePath": "gallery/user-83/photo-123-1731238845123.jpg",
     *   "isPublic": false,
     *   "createdAt": "2025-11-12T14:30:00",
     *   "updatedAt": "2025-11-12T14:30:00"
     * }
     * ```
     *
     * @param file Photo file to upload
     * @param title Photo title (optional)
     * @param description Photo description (optional)
     * @param isPublic Privacy setting (optional, default false)
     * @param currentUser Current logged-in user (from JWT)
     * @return GalleryPhotoResponse with uploaded photo info
     */
    @PostMapping("/upload")
    public ResponseEntity<GalleryPhotoResponse> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "isPublic", required = false) Boolean isPublic,
            @AuthenticationPrincipal UserPrincipal currentUser) throws IOException {

        GalleryPhoto photo = galleryService.uploadPhoto(
                file,
                currentUser.getId(),
                title,
                description,
                isPublic
        );

        GalleryPhotoResponse response = GalleryPhotoResponse.fromEntity(photo);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * ENDPOINT 2: GET MY PHOTOS
     * =========================
     * GET /api/gallery/my-photos
     *
     * Get paginated list of current user's photos (including private photos).
     * Only owner can see their private photos.
     *
     * Query parameters:
     * - page: int (default 0) - page number (0-indexed)
     * - size: int (default 12) - photos per page
     * - sortBy: string (default "newest") - sort order
     *   * "newest": newest first (createdAt DESC)
     *   * "oldest": oldest first (createdAt ASC)
     *   * "mostLiked": most liked first (likeCount DESC)
     *   * "mostFavorited": most favorited first (favoriteCount DESC)
     *
     * Example request:
     * ```
     * GET /api/gallery/my-photos?page=0&size=12&sortBy=mostLiked
     * Authorization: Bearer <jwt-token>
     * ```
     *
     * Response (200 OK):
     * ```json
     * {
     *   "photos": [...12 photos...],
     *   "currentPage": 0,
     *   "totalPages": 4,
     *   "totalPhotos": 48,
     *   "pageSize": 12,
     *   "hasNext": true,
     *   "hasPrevious": false
     * }
     * ```
     *
     * @param page Page number (0-indexed, default 0)
     * @param size Photos per page (default 12)
     * @param sortBy Sort order (default "newest")
     * @param currentUser Current logged-in user (from JWT)
     * @return GalleryListResponse with paginated photos
     */
    @GetMapping("/my-photos")
    public ResponseEntity<GalleryListResponse> getMyPhotos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size,
            @RequestParam(value = "sortBy", defaultValue = "newest") String sortBy,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Validate sortBy parameter (whitelist approach)
        if (!isValidSortBy(sortBy)) {
            throw new IllegalArgumentException(
                "Invalid sortBy parameter. Allowed values: newest, oldest, mostLiked, mostFavorited"
            );
        }

        // Sorting handled by native SQL query, not by Pageable
        Pageable pageable = PageRequest.of(page, size);
        List<GalleryPhoto> photos = galleryService.getMyPhotos(currentUser.getId(), sortBy, pageable);

        Long currentUserId = currentUser.getId();

        List<GalleryPhotoResponse> photoResponses = photos.stream()
                .map(photo -> {
                    long likeCount = photoLikeService.getLikeCount(photo.getId());
                    boolean isLikedByUser = photoLikeService.isLikedByUser(photo.getId(), currentUserId);
                    boolean isFavoritedByUser = photoFavoriteService.isFavoritedByUser(photo.getId(), currentUserId);

                    GalleryPhotoResponse response = GalleryPhotoResponse.fromEntityWithLikes(photo, currentUserId, likeCount, isLikedByUser);
                    response.setIsFavoritedByUser(isFavoritedByUser);
                    return response;
                })
                .collect(Collectors.toList());

        long totalPhotos = galleryService.countMyPhotos(currentUser.getId());
        GalleryListResponse response = PaginationUtil.buildPaginatedResponse(
                photoResponses, page, totalPhotos, size
        );

        return ResponseEntity.ok(response);
    }

    /**
     * ENDPOINT 3: GET PUBLIC PHOTOS
     * =============================
     * GET /api/gallery/public
     *
     * Get paginated list of all public photos from all users.
     * Anyone (authenticated users) can see public photos.
     *
     * Query parameters:
     * - page: int (default 0) - page number (0-indexed)
     * - size: int (default 12) - photos per page
     * - sortBy: string (default "newest") - sort order
     *   * "newest": newest first (createdAt DESC)
     *   * "oldest": oldest first (createdAt ASC)
     *   * "mostLiked": most liked first (likeCount DESC)
     *   * "mostFavorited": most favorited first (favoriteCount DESC)
     *
     * Example request:
     * ```
     * GET /api/gallery/public?page=0&size=12&sortBy=mostLiked
     * Authorization: Bearer <jwt-token>
     * ```
     *
     * Response: Same as GET /my-photos (GalleryListResponse)
     *
     * @param page Page number (0-indexed, default 0)
     * @param size Photos per page (default 12)
     * @param sortBy Sort order (default "newest")
     * @return GalleryListResponse with paginated public photos
     */
    @GetMapping("/public")
    public ResponseEntity<GalleryListResponse> getPublicPhotos(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size,
            @RequestParam(value = "sortBy", defaultValue = "newest") String sortBy,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Validate sortBy parameter (whitelist approach)
        if (!isValidSortBy(sortBy)) {
            throw new IllegalArgumentException(
                "Invalid sortBy parameter. Allowed values: newest, oldest, mostLiked, mostFavorited"
            );
        }

        // Sorting handled by native SQL query, not by Pageable
        Pageable pageable = PageRequest.of(page, size);
        List<GalleryPhoto> photos = galleryService.getPublicPhotos(sortBy, pageable);

        Long currentUserId = currentUser.getId();

        List<GalleryPhotoResponse> photoResponses = photos.stream()
                .map(photo -> {
                    long likeCount = photoLikeService.getLikeCount(photo.getId());
                    boolean isLikedByUser = photoLikeService.isLikedByUser(photo.getId(), currentUserId);
                    boolean isFavoritedByUser = photoFavoriteService.isFavoritedByUser(photo.getId(), currentUserId);

                    GalleryPhotoResponse response = GalleryPhotoResponse.fromEntityWithLikes(photo, currentUserId, likeCount, isLikedByUser);
                    response.setIsFavoritedByUser(isFavoritedByUser);
                    return response;
                })
                .collect(Collectors.toList());

        long totalPhotos = galleryService.countPublicPhotos();
        GalleryListResponse response = PaginationUtil.buildPaginatedResponse(
                photoResponses, page, totalPhotos, size
        );

        return ResponseEntity.ok(response);
    }

    /**
     * ENDPOINT 4: GET USER'S PUBLIC PHOTOS
     * ====================================
     * GET /api/gallery/user/{userId}/public
     *
     * Get paginated list of specific user's public photos.
     * Anyone can see other user's public photos (but not private ones).
     *
     * Path variable:
     * - userId: Long - user ID to get photos from
     *
     * Query parameters:
     * - page: int (default 0) - page number (0-indexed)
     * - size: int (default 12) - photos per page
     *
     * Example request:
     * ```
     * GET /api/gallery/user/83/public?page=0&size=12
     * Authorization: Bearer <jwt-token>
     * ```
     *
     * Response: Same as GET /public (GalleryListResponse)
     *
     * @param userId User ID to get photos from
     * @param page Page number (0-indexed, default 0)
     * @param size Photos per page (default 12)
     * @return GalleryListResponse with paginated user's public photos
     */
    @GetMapping("/user/{userId}/public")
    public ResponseEntity<GalleryListResponse> getUserPublicPhotos(
            @PathVariable Long userId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "12") int size,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        List<GalleryPhoto> photos = galleryService.getUserPublicPhotos(userId, pageable);

        Long currentUserId = currentUser.getId();

        List<GalleryPhotoResponse> photoResponses = photos.stream()
                .map(photo -> {
                    long likeCount = photoLikeService.getLikeCount(photo.getId());
                    boolean isLikedByUser = photoLikeService.isLikedByUser(photo.getId(), currentUserId);
                    boolean isFavoritedByUser = photoFavoriteService.isFavoritedByUser(photo.getId(), currentUserId);

                    GalleryPhotoResponse response = GalleryPhotoResponse.fromEntityWithLikes(photo, currentUserId, likeCount, isLikedByUser);
                    response.setIsFavoritedByUser(isFavoritedByUser);
                    return response;
                })
                .collect(Collectors.toList());

        long totalPhotos = galleryService.countUserPublicPhotos(userId);
        GalleryListResponse response = PaginationUtil.buildPaginatedResponse(
                photoResponses, page, totalPhotos, size
        );

        return ResponseEntity.ok(response);
    }

    /**
     * ENDPOINT 5: GET PHOTO DETAIL
     * ============================
     * GET /api/gallery/photo/{photoId}
     *
     * Get detailed info for single photo.
     * Authorization rules:
     * - Public photo → Anyone can view
     * - Private photo → Only owner can view
     *
     * Path variable:
     * - photoId: Long - photo ID to get
     *
     * Example request:
     * ```
     * GET /api/gallery/photo/123
     * Authorization: Bearer <jwt-token>
     * ```
     *
     * Response (200 OK):
     * ```json
     * {
     *   "id": 123,
     *   "userId": 83,
     *   "ownerName": "John Doe",
     *   "ownerEmail": "john@example.com",
     *   "title": "Sunset at Beach",
     *   "description": "Beautiful sunset...",
     *   "filePath": "gallery/user-83/photo-123-1731238845123.jpg",
     *   "isPublic": false,
     *   "uploadOrder": 0,
     *   "createdAt": "2025-11-12T14:30:00",
     *   "updatedAt": "2025-11-12T14:30:00"
     * }
     * ```
     *
     * Error responses:
     * - 404 Not Found: Photo doesn't exist
     * - 403 Forbidden: Private photo, not owner
     *
     * @param photoId Photo ID to get
     * @param currentUser Current logged-in user (from JWT)
     * @return GalleryPhotoDetailResponse with full photo info
     */
    @GetMapping("/photo/{photoId}")
    public ResponseEntity<GalleryPhotoDetailResponse> getPhotoById(
            @PathVariable Long photoId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        GalleryPhoto photo = galleryService.getPhotoById(photoId, currentUser.getId());

        Long currentUserId = currentUser.getId();
        long likeCount = photoLikeService.getLikeCount(photo.getId());
        boolean isLikedByUser = photoLikeService.isLikedByUser(photo.getId(), currentUserId);
        boolean isFavoritedByUser = photoFavoriteService.isFavoritedByUser(photo.getId(), currentUserId);

        GalleryPhotoDetailResponse response = GalleryPhotoDetailResponse.fromEntityWithLikes(
                photo, currentUserId, likeCount, isLikedByUser
        );
        response.setIsFavoritedByUser(isFavoritedByUser);
        return ResponseEntity.ok(response);
    }

    /**
     * ENDPOINT 6: UPDATE PHOTO
     * ========================
     * PUT /api/gallery/photo/{photoId}
     *
     * Update photo metadata (title, description, privacy).
     * Only owner can update their photos.
     *
     * Path variable:
     * - photoId: Long - photo ID to update
     *
     * Request body (JSON):
     * ```json
     * {
     *   "title": "New Title",
     *   "description": "New description",
     *   "isPublic": true
     * }
     * ```
     * All fields are optional (partial update supported).
     *
     * Example request:
     * ```
     * PUT /api/gallery/photo/123
     * Authorization: Bearer <jwt-token>
     * Content-Type: application/json
     *
     * {
     *   "title": "Updated Sunset Photo"
     * }
     * ```
     *
     * Response (200 OK): Same as upload response (GalleryPhotoResponse)
     *
     * Error responses:
     * - 404 Not Found: Photo doesn't exist
     * - 403 Forbidden: Not owner (can't update other's photos)
     * - 400 Bad Request: Validation error (title too long, etc.)
     *
     * @param photoId Photo ID to update
     * @param request Update request with new metadata
     * @param currentUser Current logged-in user (from JWT)
     * @return GalleryPhotoResponse with updated photo info
     */
    @PutMapping("/photo/{photoId}")
    public ResponseEntity<GalleryPhotoResponse> updatePhoto(
            @PathVariable Long photoId,
            @Valid @RequestBody GalleryPhotoRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        GalleryPhoto photo = galleryService.updatePhoto(
                photoId,
                currentUser.getId(),
                request.getTitle(),
                request.getDescription(),
                request.getIsPublic()
        );
        GalleryPhotoResponse response = GalleryPhotoResponse.fromEntity(photo);
        return ResponseEntity.ok(response);
    }

    /**
     * ENDPOINT 7: DELETE PHOTO
     * ========================
     * DELETE /api/gallery/photo/{photoId}
     *
     * Delete photo and its file from storage.
     * Only owner can delete their photos.
     *
     * Path variable:
     * - photoId: Long - photo ID to delete
     *
     * Example request:
     * ```
     * DELETE /api/gallery/photo/123
     * Authorization: Bearer <jwt-token>
     * ```
     *
     * Response (204 No Content): Empty body, photo deleted successfully
     *
     * Error responses:
     * - 404 Not Found: Photo doesn't exist
     * - 403 Forbidden: Not owner (can't delete other's photos)
     *
     * @param photoId Photo ID to delete
     * @param currentUser Current logged-in user (from JWT)
     * @return 204 No Content on success
     */
    @DeleteMapping("/photo/{photoId}")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable Long photoId,
            @AuthenticationPrincipal UserPrincipal currentUser) throws IOException {

        galleryService.deletePhoto(photoId, currentUser.getId());
        return ResponseEntity.noContent().build();
    }

    /**
     * ENDPOINT 8: TOGGLE PRIVACY
     * ==========================
     * PUT /api/gallery/photo/{photoId}/toggle-privacy
     *
     * Toggle photo privacy between public and private.
     * Only owner can toggle privacy of their photos.
     *
     * Path variable:
     * - photoId: Long - photo ID to toggle privacy
     *
     * Example request:
     * ```
     * PUT /api/gallery/photo/123/toggle-privacy
     * Authorization: Bearer <jwt-token>
     * ```
     *
     * Response (200 OK):
     * ```json
     * {
     *   "id": 123,
     *   "isPublic": true,  // toggled from false to true
     *   ...other fields
     * }
     * ```
     *
     * Error responses:
     * - 404 Not Found: Photo doesn't exist
     * - 403 Forbidden: Not owner (can't toggle other's photo privacy)
     *
     * @param photoId Photo ID to toggle privacy
     * @param currentUser Current logged-in user (from JWT)
     * @return GalleryPhotoResponse with updated privacy setting
     */
    @PutMapping("/photo/{photoId}/toggle-privacy")
    public ResponseEntity<GalleryPhotoResponse> togglePrivacy(
            @PathVariable Long photoId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        GalleryPhoto photo = galleryService.togglePrivacy(photoId, currentUser.getId());
        GalleryPhotoResponse response = GalleryPhotoResponse.fromEntity(photo);
        return ResponseEntity.ok(response);
    }

    /**
     * HELPER METHOD: VALIDATE SORTBY PARAMETER
     * =========================================
     * Validates sortBy parameter using whitelist approach.
     * Only allows: newest, oldest, mostLiked, mostFavorited
     *
     * @param sortBy Sort parameter from request
     * @return true if valid, false if invalid
     */
    private boolean isValidSortBy(String sortBy) {
        return sortBy.equals("newest") ||
               sortBy.equals("oldest") ||
               sortBy.equals("mostLiked") ||
               sortBy.equals("mostFavorited");
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. AUTHENTICATION & AUTHORIZATION:
     *    ================================
     *    All endpoints require JWT authentication:
     *    - @AuthenticationPrincipal UserPrincipal currentUser
     *    - Spring Security auto-inject current user from JWT token
     *    - If no token or invalid → 401 Unauthorized (handled by filter)
     *
     *    Authorization rules (enforced in service layer):
     *    - View private photo → Owner only (403 if not owner)
     *    - Edit photo → Owner only (403 if not owner)
     *    - Delete photo → Owner only (403 if not owner)
     *    - Toggle privacy → Owner only (403 if not owner)
     *    - View public photo → Anyone authenticated (no 403)
     *
     * 2. PAGINATION:
     *    ===========
     *    List endpoints support pagination:
     *    - Default: page=0, size=12
     *    - Sort: createdAt descending (newest first)
     *    - Response includes metadata (totalPages, hasNext, etc.)
     *
     *    Frontend can implement:
     *    - Page numbers: [1] [2] [3] [4] [Next]
     *    - Infinite scroll: Load more on scroll
     *
     * 3. ERROR HANDLING:
     *    ===============
     *    Exceptions thrown by service are caught by GlobalExceptionHandler:
     *    - GalleryNotFoundException → 404 Not Found
     *    - UnauthorizedGalleryAccessException → 403 Forbidden
     *    - GalleryException → 400 Bad Request
     *    - IOException → 500 Internal Server Error
     *
     * 4. REQUEST/RESPONSE FORMATS:
     *    =========================
     *    Upload (multipart/form-data):
     *    - Use @RequestParam for form fields
     *    - Use @RequestParam("file") MultipartFile for file upload
     *
     *    Update (application/json):
     *    - Use @RequestBody for JSON payload
     *    - Use @Valid for validation
     *
     *    List responses:
     *    - Use GalleryListResponse for pagination metadata
     *
     *    Single photo responses:
     *    - Use GalleryPhotoResponse for basic info (upload, update)
     *    - Use GalleryPhotoDetailResponse for full info (get detail)
     *
     * 5. HTTP STATUS CODES:
     *    ===================
     *    201 Created: Upload new photo
     *    200 OK: Get, update, toggle privacy
     *    204 No Content: Delete photo
     *    400 Bad Request: Validation error, file upload error
     *    401 Unauthorized: No JWT token or invalid token
     *    403 Forbidden: No permission to access resource
     *    404 Not Found: Photo doesn't exist
     *    500 Internal Server Error: Unexpected error
     *
     * 6. TESTING ENDPOINTS WITH CURL:
     *    ============================
     *    # 1. Upload photo
     *    curl -X POST http://localhost:8081/api/gallery/upload \
     *      -H "Authorization: Bearer <jwt-token>" \
     *      -F "file=@/path/to/photo.jpg" \
     *      -F "title=Sunset at Beach" \
     *      -F "description=Beautiful sunset" \
     *      -F "isPublic=false"
     *
     *    # 2. Get my photos
     *    curl -X GET "http://localhost:8081/api/gallery/my-photos?page=0&size=12" \
     *      -H "Authorization: Bearer <jwt-token>"
     *
     *    # 3. Get public photos
     *    curl -X GET "http://localhost:8081/api/gallery/public?page=0&size=12" \
     *      -H "Authorization: Bearer <jwt-token>"
     *
     *    # 4. Get user's public photos
     *    curl -X GET "http://localhost:8081/api/gallery/user/83/public?page=0&size=12" \
     *      -H "Authorization: Bearer <jwt-token>"
     *
     *    # 5. Get photo detail
     *    curl -X GET http://localhost:8081/api/gallery/photo/123 \
     *      -H "Authorization: Bearer <jwt-token>"
     *
     *    # 6. Update photo
     *    curl -X PUT http://localhost:8081/api/gallery/photo/123 \
     *      -H "Authorization: Bearer <jwt-token>" \
     *      -H "Content-Type: application/json" \
     *      -d '{"title":"Updated Title","isPublic":true}'
     *
     *    # 7. Delete photo
     *    curl -X DELETE http://localhost:8081/api/gallery/photo/123 \
     *      -H "Authorization: Bearer <jwt-token>"
     *
     *    # 8. Toggle privacy
     *    curl -X PUT http://localhost:8081/api/gallery/photo/123/toggle-privacy \
     *      -H "Authorization: Bearer <jwt-token>"
     */
}
