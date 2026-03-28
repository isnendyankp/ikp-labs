package com.ikplabs.api.controller;

import com.ikplabs.api.dto.GalleryListResponse;
import com.ikplabs.api.dto.GalleryPhotoResponse;
import com.ikplabs.api.entity.GalleryPhoto;
import com.ikplabs.api.enums.SortBy;
import com.ikplabs.api.security.UserPrincipal;
import com.ikplabs.api.service.PhotoLikeService;
import com.ikplabs.api.util.PaginationUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * PhotoLikeController - REST API endpoints for photo like/unlike feature
 *
 * ANALOGI SEDERHANA:
 * ==================
 * PhotoLikeController seperti "Petugas Tombol Like Instagram":
 *
 * Bayangkan petugas yang handle:
 * - User tekan ♡ → "OK, like disimpan! Sekarang ❤️"
 * - User tekan ❤️ lagi → "OK, like dihapus! Sekarang ♡"
 * - User mau lihat liked photos → "Ini semua foto yang kamu like"
 *
 * REST API ENDPOINTS (3 total):
 * ==============================
 * 1. POST   /api/gallery/photo/{photoId}/like     → Like a photo
 * 2. DELETE /api/gallery/photo/{photoId}/like     → Unlike a photo
 * 3. GET    /api/gallery/liked-photos              → Get all liked photos
 *
 * All endpoints require authentication (JWT token).
 * Spring Security automatically validates JWT and provides UserPrincipal.
 *
 * HTTP STATUS CODES:
 * ==================
 * 201 Created      → Like added successfully
 * 204 No Content   → Like removed successfully
 * 200 OK           → Liked photos retrieved
 * 400 Bad Request  → Invalid request (private photo, own photo, not liked)
 * 401 Unauthorized → Missing or invalid JWT token
 * 404 Not Found    → Photo not found
 * 409 Conflict     → Already liked (duplicate)
 *
 * @RestController = Controller untuk REST API
 * @RequestMapping = Base URL untuk semua endpoints ("/api/gallery")
 * @CrossOrigin = Allow requests from frontend (CORS)
 */
@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = {"http://localhost:3002", "http://localhost:3005"})
public class PhotoLikeController {

    @Autowired
    private PhotoLikeService photoLikeService;

    /**
     * ENDPOINT 1: LIKE A PHOTO
     * =========================
     * POST /api/gallery/photo/{photoId}/like
     *
     * Like a photo. User must be authenticated.
     * Cannot like private photos or your own photos.
     * Cannot like same photo twice.
     *
     * Example request:
     * ```
     * POST /api/gallery/photo/123/like
     * Authorization: Bearer <jwt-token>
     * ```
     *
     * Response (201 Created):
     * ```
     * (Empty body - just HTTP 201 status)
     * ```
     *
     * Error responses:
     * - 400 Bad Request: Photo is private, or user is photo owner
     * - 404 Not Found: Photo doesn't exist
     * - 409 Conflict: User already liked this photo
     * - 401 Unauthorized: No JWT token or invalid token
     *
     * FLOW PROSES:
     * 1. Spring Security validates JWT token
     * 2. Extract user ID from UserPrincipal
     * 3. Service validates business rules
     * 4. Create PhotoLike and save to database
     * 5. Return 201 Created
     * 6. Frontend updates UI (♡ → ❤️, count +1)
     *
     * @param photoId ID of photo to like (from URL path)
     * @param currentUser Current logged-in user (from JWT, injected by Spring Security)
     * @return ResponseEntity with 201 Created status (empty body)
     * @throws IllegalArgumentException if photo not found, private, or user is owner
     * @throws IllegalStateException if already liked
     */
    @PostMapping("/photo/{photoId}/like")
    public ResponseEntity<Void> likePhoto(
            @PathVariable Long photoId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Extract user ID from authenticated user
        Long userId = currentUser.getId();

        // Call service to like photo (validation happens in service)
        photoLikeService.likePhoto(photoId, userId);

        // Return 201 Created (no body needed)
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * ENDPOINT 2: UNLIKE A PHOTO
     * ===========================
     * DELETE /api/gallery/photo/{photoId}/like
     *
     * Unlike a photo. User must be authenticated.
     * Can only unlike a photo that was previously liked.
     *
     * Example request:
     * ```
     * DELETE /api/gallery/photo/123/like
     * Authorization: Bearer <jwt-token>
     * ```
     *
     * Response (204 No Content):
     * ```
     * (Empty body - just HTTP 204 status)
     * ```
     *
     * Error responses:
     * - 400 Bad Request: User hasn't liked this photo
     * - 404 Not Found: Photo doesn't exist
     * - 401 Unauthorized: No JWT token or invalid token
     *
     * FLOW PROSES:
     * 1. Spring Security validates JWT token
     * 2. Extract user ID from UserPrincipal
     * 3. Service validates photo exists and is liked
     * 4. Delete PhotoLike from database
     * 5. Return 204 No Content
     * 6. Frontend updates UI (❤️ → ♡, count -1)
     *
     * @param photoId ID of photo to unlike (from URL path)
     * @param currentUser Current logged-in user (from JWT, injected by Spring Security)
     * @return ResponseEntity with 204 No Content status (empty body)
     * @throws IllegalArgumentException if photo not found or not liked
     */
    @DeleteMapping("/photo/{photoId}/like")
    public ResponseEntity<Void> unlikePhoto(
            @PathVariable Long photoId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Extract user ID from authenticated user
        Long userId = currentUser.getId();

        // Call service to unlike photo (validation happens in service)
        photoLikeService.unlikePhoto(photoId, userId);

        // Return 204 No Content (no body needed)
        return ResponseEntity.noContent().build();
    }

    /**
     * ENDPOINT 3: GET LIKED PHOTOS
     * =============================
     * GET /api/gallery/liked-photos
     *
     * Get paginated list of photos liked by current user.
     * Photos ordered by most recently liked first by default.
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
     * GET /api/gallery/liked-photos?page=0&size=12&sortBy=mostLiked
     * Authorization: Bearer <jwt-token>
     * ```
     *
     * Response (200 OK):
     * ```json
     * {
     *   "photos": [
     *     {
     *       "id": 123,
     *       "userId": 456,
     *       "ownerName": "John Doe",
     *       "title": "Sunset",
     *       "description": "Beautiful sunset",
     *       "filePath": "gallery/user-456/photo-123-1234567890.jpg",
     *       "isPublic": true,
     *       "createdAt": "2025-11-10T14:30:00",
     *       "updatedAt": "2025-11-10T14:30:00"
     *     },
     *     ...11 more photos
     *   ],
     *   "currentPage": 0,
     *   "totalPages": 4,
     *   "totalPhotos": 48,
     *   "pageSize": 12,
     *   "hasNext": true,
     *   "hasPrevious": false
     * }
     * ```
     *
     * Empty state (no liked photos):
     * ```json
     * {
     *   "photos": [],
     *   "currentPage": 0,
     *   "totalPages": 0,
     *   "totalPhotos": 0,
     *   "pageSize": 12,
     *   "hasNext": false,
     *   "hasPrevious": false
     * }
     * ```
     *
     * FLOW PROSES:
     * 1. Spring Security validates JWT token
     * 2. Extract user ID from UserPrincipal
     * 3. Create Pageable for pagination
     * 4. Service fetches liked photos from database (JOIN query)
     * 5. Convert entities to DTOs
     * 6. Build GalleryListResponse with pagination metadata
     * 7. Return 200 OK with JSON response
     * 8. Frontend displays photos in grid layout
     *
     * @param page Page number (0-indexed, default 0)
     * @param size Photos per page (default 12)
     * @param sortBy Sort order (default "newest")
     * @param currentUser Current logged-in user (from JWT, injected by Spring Security)
     * @return ResponseEntity with GalleryListResponse (photos + pagination metadata)
     */
    @GetMapping("/liked-photos")
    public ResponseEntity<GalleryListResponse> getLikedPhotos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sortBy,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Validate sortBy parameter using SortBy enum
        if (!SortBy.isValid(sortBy)) {
            throw new IllegalArgumentException(
                "Invalid sortBy parameter. Allowed values: " + SortBy.getAllowedValues()
            );
        }

        // Extract user ID from authenticated user
        Long userId = currentUser.getId();

        // Create Pageable for pagination (page, size, no sorting needed - handled by repository)
        Pageable pageable = PageRequest.of(page, size);

        // Get liked photos from service (returns List<GalleryPhoto>)
        List<GalleryPhoto> likedPhotos = photoLikeService.getLikedPhotos(userId, sortBy, pageable);

        // Convert entities to DTOs with like data
        // All photos in this list are liked by current user (isLikedByUser = true)
        List<GalleryPhotoResponse> photoResponses = likedPhotos.stream()
                .map(photo -> {
                    long likeCount = photoLikeService.getLikeCount(photo.getId());
                    // isLikedByUser is always true for liked photos list
                    return GalleryPhotoResponse.fromEntityWithLikes(photo, userId, likeCount, true);
                })
                .collect(Collectors.toList());

        // Manually build pagination metadata (same pattern as GalleryController)
        long totalPhotos = photoLikeService.countLikedPhotosByUserId(userId);
        GalleryListResponse response = PaginationUtil.buildPaginatedResponse(
                photoResponses, page, totalPhotos, size
        );

        // Return 200 OK with response body
        return ResponseEntity.ok(response);
    }

    /**
     * NOTES FOR UNDERSTANDING:
     * ========================
     *
     * 1. AUTHENTICATION FLOW:
     *    ====================
     *    - Frontend sends: Authorization: Bearer <jwt-token>
     *    - Spring Security JWT filter intercepts request
     *    - Filter validates token and extracts user info
     *    - Filter creates UserPrincipal and sets in SecurityContext
     *    - Controller receives UserPrincipal via @AuthenticationPrincipal
     *    - No manual token parsing needed!
     *
     * 2. @PathVariable vs @RequestParam:
     *    ================================
     *    @PathVariable: Part of URL path
     *    - /photo/{photoId}/like → @PathVariable Long photoId
     *    - Example: /photo/123/like → photoId = 123
     *
     *    @RequestParam: Query string
     *    - /liked-photos?page=0&size=12
     *    - @RequestParam int page, @RequestParam int size
     *
     * 3. WHY EMPTY RESPONSE BODY FOR LIKE/UNLIKE?
     *    =========================================
     *    - Like/Unlike are actions, not data queries
     *    - HTTP status code is enough (201 Created, 204 No Content)
     *    - Reduces response size and network usage
     *    - Frontend already knows the result from status code
     *    - If frontend needs updated count, separate GET request
     *
     * 4. ERROR HANDLING:
     *    ================
     *    Service throws exceptions:
     *    - IllegalArgumentException → 400 Bad Request
     *    - IllegalStateException → 409 Conflict
     *    - Not found → 404 Not Found
     *
     *    Spring's @ControllerAdvice (GlobalExceptionHandler) catches
     *    these and returns proper HTTP status + error message.
     *
     * 5. CORS (CrossOrigin):
     *    ===================
     *    - Frontend runs on localhost:3005
     *    - Backend runs on localhost:8081
     *    - Different origins → CORS needed
     *    - @CrossOrigin allows frontend to make requests
     *    - Production: configure proper CORS policy
     *
     * 6. PAGINATION FLOW:
     *    =================
     *    User on page 1 (frontend):
     *    1. Frontend: GET /liked-photos?page=0&size=12
     *    2. Backend: PageRequest.of(0, 12)
     *    3. Service: findLikedPhotosByUserId(userId, pageable)
     *    4. Database: SELECT ... LIMIT 12 OFFSET 0
     *    5. Backend: Convert to DTOs + build GalleryListResponse
     *    6. Frontend: Render 12 photos + pagination UI
     *
     *    User clicks "Next":
     *    1. Frontend: GET /liked-photos?page=1&size=12
     *    2. Backend: PageRequest.of(1, 12)
     *    3. Database: SELECT ... LIMIT 12 OFFSET 12
     *    4. Frontend: Render next 12 photos
     *
     * 7. LIKE/UNLIKE UI FLOW:
     *    ====================
     *    LIKE:
     *    - User sees ♡ (outline heart)
     *    - Clicks it
     *    - Frontend: POST /photo/123/like
     *    - Optimistic update: Show ❤️ immediately
     *    - Backend: 201 Created
     *    - Success: Keep ❤️, update count
     *    - Error: Rollback to ♡, show error message
     *
     *    UNLIKE:
     *    - User sees ❤️ (filled heart)
     *    - Clicks it
     *    - Frontend: DELETE /photo/123/like
     *    - Optimistic update: Show ♡ immediately
     *    - Backend: 204 No Content
     *    - Success: Keep ♡, update count
     *    - Error: Rollback to ❤️, show error message
     *
     * 8. SECURITY CONSIDERATIONS:
     *    ========================
     *    - All endpoints require JWT authentication
     *    - UserPrincipal contains verified user ID
     *    - Cannot forge user ID (comes from validated JWT)
     *    - Service layer validates business rules (not owner, public, etc.)
     *    - Database constraint prevents duplicate likes (UNIQUE)
     *
     * 9. TESTING ENDPOINTS:
     *    ==================
     *    Can test with curl:
     *
     *    LIKE:
     *    curl -X POST http://localhost:8081/api/gallery/photo/123/like \
     *      -H "Authorization: Bearer <jwt-token>"
     *
     *    UNLIKE:
     *    curl -X DELETE http://localhost:8081/api/gallery/photo/123/like \
     *      -H "Authorization: Bearer <jwt-token>"
     *
     *    GET LIKED PHOTOS:
     *    curl http://localhost:8081/api/gallery/liked-photos?page=0&size=12 \
     *      -H "Authorization: Bearer <jwt-token>"
     *
     * 10. PERFORMANCE OPTIMIZATION:
     *     =========================
     *     - Pagination reduces memory usage (not all photos at once)
     *     - Database indexes on photo_id, user_id (fast lookups)
     *     - Empty body for like/unlike (minimal data transfer)
     *     - Service methods are transactional (atomic operations)
     *     - DTO conversion only for requested page (not all data)
     */
}
