package com.ikplabs.api.service;

import com.ikplabs.api.entity.GalleryPhoto;
import com.ikplabs.api.entity.PhotoLike;
import com.ikplabs.api.entity.User;
import com.ikplabs.api.repository.GalleryPhotoRepository;
import com.ikplabs.api.repository.PhotoLikeRepository;
import com.ikplabs.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * PhotoLikeService - Business logic for photo like/unlike operations
 *
 * ANALOGI SEDERHANA:
 * ==================
 * PhotoLikeService seperti "Petugas Like Instagram":
 *
 * Tanggung Jawab:
 * 1. CEK apakah foto bisa di-like (public, bukan foto sendiri)
 * 2. CEK apakah sudah like atau belum (prevent duplicate)
 * 3. TAMBAH like ke database (save)
 * 4. HAPUS like dari database (unlike)
 * 5. HITUNG jumlah like
 * 6. CARI foto-foto yang di-like user
 *
 * Business Rules:
 * - Cannot like private photos (only public)
 * - Cannot like your own photos
 * - Cannot like same photo twice (duplicate prevention)
 * - Unlike requires existing like
 *
 * @Service = Spring otomatis buat instance (singleton)
 */
@Service
public class PhotoLikeService {

    @Autowired
    private PhotoLikeRepository photoLikeRepository;

    @Autowired
    private GalleryPhotoRepository galleryPhotoRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Like a photo
     *
     * FLOW PROSES:
     * 1. Validate photo exists
     * 2. Validate photo is public (cannot like private)
     * 3. Validate user is NOT the owner (cannot like own photo)
     * 4. Check if already liked (prevent duplicate)
     * 5. Get user from database
     * 6. Create PhotoLike entity
     * 7. Save to database
     *
     * Example:
     * - User A (id=456) likes Photo X (id=123)
     * - Photo X is public ✅
     * - User A is not owner ✅
     * - User A hasn't liked before ✅
     * - Create: PhotoLike(photo=123, user=456, created_at=NOW)
     * - Save to photo_likes table
     * - Result: Like count increases by 1
     *
     * @param photoId ID of photo to like
     * @param userId ID of user liking the photo
     * @throws IllegalArgumentException if:
     *         - Photo not found
     *         - Photo is private
     *         - User is photo owner
     *         - User not found
     * @throws IllegalStateException if already liked
     */
    @Transactional
    public void likePhoto(Long photoId, Long userId) {
        // STEP 1: Validate photo exists
        GalleryPhoto photo = galleryPhotoRepository.findById(photoId)
                .orElseThrow(() -> new IllegalArgumentException("Photo not found with id: " + photoId));

        // STEP 2: Validate photo is public
        if (!photo.getIsPublic()) {
            throw new IllegalArgumentException("Cannot like private photos. Photo must be public.");
        }

        // STEP 3: Validate user is not the photo owner
        if (photo.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Cannot like your own photo");
        }

        // STEP 4: Check if already liked (duplicate prevention)
        if (photoLikeRepository.existsByPhotoIdAndUserId(photoId, userId)) {
            throw new IllegalStateException("You have already liked this photo");
        }

        // STEP 5: Get user from database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // STEP 6: Create PhotoLike entity
        PhotoLike photoLike = new PhotoLike();
        photoLike.setPhoto(photo);
        photoLike.setUser(user);
        // createdAt will be set automatically via @PrePersist

        // STEP 7: Save to database
        photoLikeRepository.save(photoLike);

        System.out.println("✅ Photo liked: photoId=" + photoId + ", userId=" + userId);
    }

    /**
     * Unlike a photo
     *
     * FLOW PROSES:
     * 1. Validate photo exists
     * 2. Check if liked (must exist to unlike)
     * 3. Delete the like from database
     *
     * Example:
     * - User A (id=456) unlikes Photo X (id=123)
     * - Photo X exists ✅
     * - User A has liked before ✅
     * - Delete: photo_likes WHERE photo_id=123 AND user_id=456
     * - Result: Like count decreases by 1
     *
     * @param photoId ID of photo to unlike
     * @param userId ID of user unliking the photo
     * @throws IllegalArgumentException if:
     *         - Photo not found
     *         - Photo not liked by user
     */
    @Transactional
    public void unlikePhoto(Long photoId, Long userId) {
        // STEP 1: Validate photo exists
        if (!galleryPhotoRepository.existsById(photoId)) {
            throw new IllegalArgumentException("Photo not found with id: " + photoId);
        }

        // STEP 2: Check if liked
        if (!photoLikeRepository.existsByPhotoIdAndUserId(photoId, userId)) {
            throw new IllegalArgumentException("You have not liked this photo");
        }

        // STEP 3: Delete like from database
        photoLikeRepository.deleteByPhotoIdAndUserId(photoId, userId);

        System.out.println("✅ Photo unliked: photoId=" + photoId + ", userId=" + userId);
    }

    /**
     * Get all photos liked by a user
     *
     * Returns list of GalleryPhoto objects (for pagination).
     * Photos ordered by most recently liked first (created_at DESC).
     *
     * OPTIMIZED: Uses single query with JOINs to get like/favorite counts.
     * Solves N+1 problem for liked photos page.
     *
     * Use case: "Liked Photos" page
     * - User navigates to /liked-photos
     * - Frontend calls GET /api/gallery/liked-photos?page=0&size=12
     * - Backend returns first 12 photos user has liked
     *
     * Example:
     * - User A has liked 50 photos
     * - Request: getLikedPhotos(456, PageRequest.of(0, 12))
     * - Returns: List with 12 photos (controller builds pagination metadata)
     *
     * @param userId ID of user
     * @param sortBy Sort order (newest, oldest, mostLiked, mostFavorited)
     * @param pageable Pagination parameters (page, size, sort)
     * @return List<GalleryPhoto> with photos (controller adds pagination)
     */
    @Transactional(readOnly = true)
    public List<GalleryPhoto> getLikedPhotos(Long userId, String sortBy, Pageable pageable) {
        // Use JPQL queries based on sortBy parameter to avoid entity mapping issues
        return switch (sortBy) {
            case "newest" -> photoLikeRepository.findLikedPhotosByUserIdNewest(userId, pageable);
            case "oldest" -> photoLikeRepository.findLikedPhotosByUserIdOldest(userId, pageable);
            case "mostLiked" -> photoLikeRepository.findLikedPhotosByUserIdMostLiked(userId, pageable);
            case "mostFavorited" -> photoLikeRepository.findLikedPhotosByUserIdMostFavorited(userId, pageable);
            default -> photoLikeRepository.findLikedPhotosByUserIdNewest(userId, pageable); // Default to newest
        };
    }

    /**
     * Get like count for a photo
     *
     * Returns total number of likes for a photo.
     * Used to display "❤️ 42" under photos.
     *
     * Example:
     * - Photo X has been liked by 5 users
     * - getLikeCount(123) → returns 5
     * - Frontend shows: "❤️ 5"
     *
     * Performance:
     * - Uses COUNT(*) query (fast)
     * - Indexed on photo_id (even faster)
     *
     * @param photoId ID of photo
     * @return Number of likes (0 if no likes)
     */
    @Transactional(readOnly = true)
    public long getLikeCount(Long photoId) {
        return photoLikeRepository.countByPhotoId(photoId);
    }

    /**
     * Count total liked photos by user
     *
     * Returns total number of photos liked by user.
     * Used for pagination metadata calculation.
     *
     * Example:
     * - User A has liked 50 photos
     * - countLikedPhotosByUserId(456) → returns 50
     * - Controller uses this to calculate: totalPages = ceil(50 / 12) = 5
     *
     * @param userId ID of user
     * @return Total number of photos liked by user
     */
    @Transactional(readOnly = true)
    public long countLikedPhotosByUserId(Long userId) {
        return photoLikeRepository.countLikedPhotosByUserId(userId);
    }

    /**
     * Check if user has liked a photo
     *
     * Returns boolean: true if liked, false if not.
     * Used to show heart icon state (filled vs outline).
     *
     * Example:
     * - User A viewing Photo X
     * - isLikedByUser(123, 456) → true
     * - Frontend shows: ❤️ (filled red heart)
     * - isLikedByUser(123, 456) → false
     * - Frontend shows: ♡ (outline heart)
     *
     * Performance:
     * - Uses EXISTS query (faster than SELECT)
     * - No need to load PhotoLike object
     *
     * @param photoId ID of photo
     * @param userId ID of user
     * @return true if user liked photo, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean isLikedByUser(Long photoId, Long userId) {
        return photoLikeRepository.existsByPhotoIdAndUserId(photoId, userId);
    }

    /**
     * NOTES FOR UNDERSTANDING:
     * ========================
     *
     * 1. @Transactional Annotation:
     *    - Ensures atomicity (all-or-nothing)
     *    - If error occurs, rollback entire operation
     *    - Read operations: @Transactional(readOnly = true) for optimization
     *    - Write operations: @Transactional (default)
     *
     * 2. Validation Order (Important!):
     *    - Photo exists → Photo public → Not owner → Not already liked
     *    - Stop early if any check fails
     *    - Clear error messages for each case
     *
     * 3. Why Multiple Validation Checks?
     *    - Security: Prevent unauthorized likes
     *    - Data Integrity: Prevent duplicate likes
     *    - User Experience: Clear error messages
     *
     * 4. Exception Types:
     *    - IllegalArgumentException: Invalid input (wrong data)
     *    - IllegalStateException: Invalid state (already liked)
     *    - Controller catches these and returns proper HTTP status
     *
     * 5. Performance Considerations:
     *    - existsByPhotoIdAndUserId: Faster than findBy (boolean only)
     *    - countByPhotoId: Indexed, very fast
     *    - readOnly transactions: Optimization for SELECT queries
     *
     * 6. Like/Unlike Flow Summary:
     *
     *    LIKE:
     *    User clicks ♡ → Frontend POST /like
     *    → Service validates (photo exists, public, not owner, not liked)
     *    → Create PhotoLike(photo, user)
     *    → Save to database
     *    → Response 201 Created
     *    → Frontend shows ❤️ and count+1
     *
     *    UNLIKE:
     *    User clicks ❤️ → Frontend DELETE /like
     *    → Service validates (photo exists, is liked)
     *    → Delete from database
     *    → Response 204 No Content
     *    → Frontend shows ♡ and count-1
     *
     * 7. Error Handling Examples:
     *    - Photo not found → 404 Not Found
     *    - Private photo → 400 Bad Request
     *    - Own photo → 400 Bad Request
     *    - Already liked → 409 Conflict
     *    - Not liked (unlike) → 400 Bad Request
     *
     * 8. Database CASCADE Behavior:
     *    - Photo deleted → All likes auto-deleted (ON DELETE CASCADE)
     *    - User deleted → All their likes auto-deleted (ON DELETE CASCADE)
     *    - No need for manual cleanup
     *
     * 9. Thread Safety:
     *    - @Transactional ensures thread-safe operations
     *    - Database UNIQUE constraint prevents race conditions
     *    - If 2 users try to like simultaneously, only 1 succeeds
     *
     * 10. Testing Strategy:
     *     - Unit tests: Mock repositories, test business logic
     *     - Integration tests: Real database, test full flow
     *     - Test cases: Valid like, duplicate like, own photo, private photo
     */
}
