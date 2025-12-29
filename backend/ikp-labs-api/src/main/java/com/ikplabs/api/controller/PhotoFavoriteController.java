package com.ikplabs.api.controller;

import com.ikplabs.api.dto.GalleryListResponse;
import com.ikplabs.api.dto.GalleryPhotoResponse;
import com.ikplabs.api.entity.GalleryPhoto;
import com.ikplabs.api.security.UserPrincipal;
import com.ikplabs.api.service.PhotoFavoriteService;
import com.ikplabs.api.service.PhotoLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * PhotoFavoriteController - REST API endpoints for photo favorite/unfavorite feature
 *
 * ANALOGI SEDERHANA:
 * ==================
 * PhotoFavoriteController seperti "Petugas Bookmark Browser":
 *
 * Bayangkan petugas yang handle:
 * - User tekan ☆ → "OK, bookmark disimpan! Sekarang ⭐"
 * - User tekan ⭐ lagi → "OK, bookmark dihapus! Sekarang ☆"
 * - User mau lihat favorited photos → "Ini semua foto yang kamu bookmark (PRIVATE)"
 *
 * REST API ENDPOINTS (3 total):
 * ==============================
 * 1. POST   /api/gallery/photo/{photoId}/favorite     → Favorite a photo
 * 2. DELETE /api/gallery/photo/{photoId}/favorite     → Unfavorite a photo
 * 3. GET    /api/gallery/favorited-photos             → Get all favorited photos
 *
 * PERBEDAAN dengan PhotoLikeController:
 * ======================================
 * PhotoLikeController (PUBLIC appreciation):
 * - Endpoint: /like
 * - Icon: Heart ❤️
 * - Cannot like own photos
 * - Public like counter
 *
 * PhotoFavoriteController (PRIVATE bookmarks):
 * - Endpoint: /favorite
 * - Icon: Star ⭐
 * - CAN favorite own photos ← KEY DIFFERENCE!
 * - No public counter (100% private)
 * - Privacy enforced (only user sees their favorites)
 *
 * All endpoints require authentication (JWT token).
 * Spring Security automatically validates JWT and provides UserPrincipal.
 *
 * HTTP STATUS CODES:
 * ==================
 * 201 Created      → Favorite added successfully
 * 204 No Content   → Favorite removed successfully
 * 200 OK           → Favorited photos retrieved
 * 400 Bad Request  → Invalid request (private photo of others, not favorited)
 * 401 Unauthorized → Missing or invalid JWT token
 * 404 Not Found    → Photo not found
 * 409 Conflict     → Already favorited (duplicate)
 *
 * @RestController = Controller untuk REST API
 * @RequestMapping = Base URL untuk semua endpoints ("/api/gallery")
 * @CrossOrigin = Allow requests from frontend (CORS)
 */
@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = {"http://localhost:3002", "http://localhost:3005"})
public class PhotoFavoriteController {

    @Autowired
    private PhotoFavoriteService photoFavoriteService;

    @Autowired
    private PhotoLikeService photoLikeService;

    /**
     * ENDPOINT 1: FAVORITE A PHOTO
     * =============================
     * POST /api/gallery/photo/{photoId}/favorite
     *
     * Favorite a photo (private bookmark). User must be authenticated.
     * Can favorite public photos OR own photos (private or public).
     * Cannot favorite other users' private photos.
     * Cannot favorite same photo twice.
     *
     * KEY DIFFERENCE from likePhoto:
     * - ✅ CAN favorite own photos (for portfolio organization)
     * - ✅ Can favorite own private photos
     * - ❌ Cannot favorite other users' private photos
     *
     * Example request:
     * ```
     * POST /api/gallery/photo/123/favorite
     * Authorization: Bearer <jwt-token>
     * ```
     *
     * Response (201 Created):
     * ```
     * (Empty body - just HTTP 201 status)
     * ```
     *
     * Error responses:
     * - 400 Bad Request: Photo is private and user is not owner
     * - 404 Not Found: Photo doesn't exist
     * - 409 Conflict: User already favorited this photo
     * - 401 Unauthorized: No JWT token or invalid token
     *
     * FLOW PROSES:
     * 1. Spring Security validates JWT token
     * 2. Extract user ID from UserPrincipal
     * 3. Service validates business rules (privacy check different from likes!)
     * 4. Create PhotoFavorite and save to database
     * 5. Return 201 Created
     * 6. Frontend updates UI (☆ → ⭐)
     * 7. Photo appears in user's Favorited Photos page (private!)
     *
     * @param photoId ID of photo to favorite (from URL path)
     * @param currentUser Current logged-in user (from JWT, injected by Spring Security)
     * @return ResponseEntity with 201 Created status (empty body)
     * @throws IllegalArgumentException if photo not found or privacy violation
     * @throws IllegalStateException if already favorited
     */
    @PostMapping("/photo/{photoId}/favorite")
    public ResponseEntity<Void> favoritePhoto(
            @PathVariable Long photoId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Extract user ID from authenticated user
        Long userId = currentUser.getId();

        // Call service to favorite photo (validation happens in service)
        photoFavoriteService.favoritePhoto(photoId, userId);

        // Return 201 Created (no body needed)
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * ENDPOINT 2: UNFAVORITE A PHOTO
     * ===============================
     * DELETE /api/gallery/photo/{photoId}/favorite
     *
     * Unfavorite a photo. User must be authenticated.
     * Can only unfavorite a photo that was previously favorited.
     *
     * Example request:
     * ```
     * DELETE /api/gallery/photo/123/favorite
     * Authorization: Bearer <jwt-token>
     * ```
     *
     * Response (204 No Content):
     * ```
     * (Empty body - just HTTP 204 status)
     * ```
     *
     * Error responses:
     * - 400 Bad Request: User hasn't favorited this photo
     * - 404 Not Found: Photo doesn't exist
     * - 401 Unauthorized: No JWT token or invalid token
     *
     * FLOW PROSES:
     * 1. Spring Security validates JWT token
     * 2. Extract user ID from UserPrincipal
     * 3. Service validates photo exists and is favorited
     * 4. Delete PhotoFavorite from database
     * 5. Return 204 No Content
     * 6. Frontend updates UI (⭐ → ☆)
     * 7. Photo removed from user's Favorited Photos page
     *
     * @param photoId ID of photo to unfavorite (from URL path)
     * @param currentUser Current logged-in user (from JWT, injected by Spring Security)
     * @return ResponseEntity with 204 No Content status (empty body)
     * @throws IllegalArgumentException if photo not found or not favorited
     */
    @DeleteMapping("/photo/{photoId}/favorite")
    public ResponseEntity<Void> unfavoritePhoto(
            @PathVariable Long photoId,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Extract user ID from authenticated user
        Long userId = currentUser.getId();

        // Call service to unfavorite photo (validation happens in service)
        photoFavoriteService.unfavoritePhoto(photoId, userId);

        // Return 204 No Content (no body needed)
        return ResponseEntity.noContent().build();
    }

    /**
     * ENDPOINT 3: GET FAVORITED PHOTOS
     * =================================
     * GET /api/gallery/favorited-photos
     *
     * Get paginated list of photos favorited by current user.
     * Photos ordered by most recently favorited first by default.
     *
     * PRIVACY ENFORCEMENT:
     * - Only returns CURRENT user's favorites (from JWT)
     * - Other users CANNOT see this list
     * - 100% private collection
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
     * GET /api/gallery/favorited-photos?page=0&size=12&sortBy=mostFavorited
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
     * Empty state (no favorited photos):
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
     * 4. Service fetches favorited photos from database (JOIN query)
     * 5. Convert entities to DTOs
     * 6. Build GalleryListResponse with pagination metadata
     * 7. Return 200 OK with JSON response
     * 8. Frontend displays photos in grid layout (private collection!)
     *
     * @param page Page number (0-indexed, default 0)
     * @param size Photos per page (default 12)
     * @param sortBy Sort order (default "newest")
     * @param currentUser Current logged-in user (from JWT, injected by Spring Security)
     * @return ResponseEntity with GalleryListResponse (photos + pagination metadata)
     */
    @GetMapping("/favorited-photos")
    public ResponseEntity<GalleryListResponse> getFavoritedPhotos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "newest") String sortBy,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Validate sortBy parameter (whitelist approach)
        if (!isValidSortBy(sortBy)) {
            throw new IllegalArgumentException(
                "Invalid sortBy parameter. Allowed values: newest, oldest, mostLiked, mostFavorited"
            );
        }

        // Extract user ID from authenticated user
        Long userId = currentUser.getId();

        // Create Pageable for pagination
        Pageable pageable = PageRequest.of(page, size);

        // Fetch favorited photos from service (only THIS user's favorites!)
        Page<GalleryPhoto> favoritedPhotosPage = photoFavoriteService.getFavoritedPhotos(userId, sortBy, pageable);

        // Convert GalleryPhoto entities to DTOs with like data AND favorite data
        // All photos in this list are favorited by current user (isFavoritedByUser = true)
        List<GalleryPhotoResponse> photoResponses = favoritedPhotosPage.getContent()
                .stream()
                .map(photo -> {
                    // Get like data for this photo
                    long likeCount = photoLikeService.getLikeCount(photo.getId());
                    boolean isLikedByUser = photoLikeService.isLikedByUser(photo.getId(), userId);

                    // Create response with like data
                    GalleryPhotoResponse response = GalleryPhotoResponse.fromEntityWithLikes(
                        photo, userId, likeCount, isLikedByUser
                    );

                    // Set isFavoritedByUser = true (all photos in favorited list are favorited!)
                    response.setIsFavoritedByUser(true);

                    return response;
                })
                .collect(Collectors.toList());

        // Build response with pagination metadata using static factory method
        GalleryListResponse response = GalleryListResponse.fromPage(
                photoResponses,
                favoritedPhotosPage.getNumber(),
                favoritedPhotosPage.getTotalPages(),
                favoritedPhotosPage.getTotalElements(),
                favoritedPhotosPage.getSize(),
                favoritedPhotosPage.hasNext(),
                favoritedPhotosPage.hasPrevious()
        );

        // Return 200 OK with JSON response
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
     * 1. URL Pattern Differences:
     *
     *    Likes:
     *    POST   /api/gallery/photo/{id}/like
     *    DELETE /api/gallery/photo/{id}/like
     *    GET    /api/gallery/liked-photos
     *
     *    Favorites:
     *    POST   /api/gallery/photo/{id}/favorite
     *    DELETE /api/gallery/photo/{id}/favorite
     *    GET    /api/gallery/favorited-photos
     *
     * 2. Authentication:
     *    - @AuthenticationPrincipal UserPrincipal currentUser
     *    - Spring Security automatically injects logged-in user
     *    - userId extracted from JWT token (secure!)
     *    - NEVER accept userId from request body (security vulnerability!)
     *
     * 3. Business Logic Delegation:
     *    - Controller only handles HTTP concerns
     *    - All validation happens in Service layer
     *    - Service throws exceptions → Controller catches → HTTP status codes
     *    - Separation of concerns (Controller ≠ Business Logic)
     *
     * 4. Error Handling:
     *    - IllegalArgumentException → 400 Bad Request or 404 Not Found
     *    - IllegalStateException → 409 Conflict
     *    - Spring's @ControllerAdvice can handle these globally
     *    - Returns proper HTTP status codes automatically
     *
     * 5. Response Formats:
     *    - POST favorite: 201 Created (empty body)
     *    - DELETE favorite: 204 No Content (empty body)
     *    - GET favorites: 200 OK (JSON body with photos + pagination)
     *    - RESTful conventions followed
     *
     * 6. CORS Configuration:
     *    - @CrossOrigin(origins = {"http://localhost:3002", "http://localhost:3005"})
     *    - Allows frontend to call API from different port
     *    - Required for development (frontend port 3002/3005, backend port 8081)
     *    - Production: Update to actual frontend domain
     *
     * 7. Privacy Enforcement:
     *    - userId always from UserPrincipal (JWT)
     *    - Service filters by userId (WHERE user_id = ?)
     *    - No cross-user data leakage
     *    - Frontend cannot manipulate userId
     *
     * 8. Pagination:
     *    - @RequestParam(defaultValue = "0") int page
     *    - @RequestParam(defaultValue = "12") int size
     *    - Default: page 0, 12 photos per page
     *    - Frontend can override: ?page=1&size=24
     *
     * 9. Coexistence with Likes:
     *    - Both controllers independent
     *    - Both can run simultaneously
     *    - Same photo can be liked AND favorited
     *    - Different endpoints, different tables
     *
     * 10. Testing Endpoints:
     *     Manual test with cURL:
     *     ```bash
     *     # Favorite photo
     *     curl -X POST http://localhost:8081/api/gallery/photo/123/favorite \
     *       -H "Authorization: Bearer <jwt-token>"
     *
     *     # Unfavorite photo
     *     curl -X DELETE http://localhost:8081/api/gallery/photo/123/favorite \
     *       -H "Authorization: Bearer <jwt-token>"
     *
     *     # Get favorited photos
     *     curl http://localhost:8081/api/gallery/favorited-photos?page=0&size=12 \
     *       -H "Authorization: Bearer <jwt-token>"
     *     ```
     */
}
