package com.ikplabs.api.service;

import com.ikplabs.api.entity.GalleryPhoto;
import com.ikplabs.api.entity.PhotoFavorite;
import com.ikplabs.api.entity.User;
import com.ikplabs.api.repository.GalleryPhotoRepository;
import com.ikplabs.api.repository.PhotoFavoriteRepository;
import com.ikplabs.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * PhotoFavoriteService - Business logic for photo favorite/unfavorite operations
 *
 * ANALOGI SEDERHANA:
 * ==================
 * PhotoFavoriteService seperti "Petugas Bookmark Pribadi":
 *
 * Tanggung Jawab:
 * 1. CEK apakah foto bisa di-favorite (public ATAU foto sendiri)
 * 2. CEK apakah sudah favorite atau belum (prevent duplicate)
 * 3. TAMBAH favorite ke database (save) - PRIVATE collection
 * 4. HAPUS favorite dari database (unfavorite)
 * 5. CARI foto-foto yang di-favorite user (PRIVATE - only for that user)
 *
 * PERBEDAAN dengan PhotoLikeService:
 * ===================================
 * PhotoLikeService (PUBLIC appreciation):
 * - ❌ Cannot like own photos
 * - ✅ Photo must be public
 * - ✅ Has getLikeCount() - public counter
 * - Purpose: Social engagement
 *
 * PhotoFavoriteService (PRIVATE bookmarks):
 * - ✅ CAN favorite own photos ← KEY DIFFERENCE!
 * - ✅ Can favorite public photos
 * - ✅ Can favorite own private photos
 * - ❌ Cannot favorite other users' private photos
 * - ❌ NO getLikeCount() - no public counter
 * - Purpose: Personal organization
 *
 * Business Rules:
 * - Can favorite public photos (any user)
 * - Can favorite own photos (public or private)
 * - Cannot favorite other users' private photos
 * - Cannot favorite same photo twice (duplicate prevention)
 * - Unfavorite requires existing favorite
 * - Favorites are 100% private (only user can see their own)
 *
 * @Service = Spring otomatis buat instance (singleton)
 */
@Service
public class PhotoFavoriteService {

    @Autowired
    private PhotoFavoriteRepository photoFavoriteRepository;

    @Autowired
    private GalleryPhotoRepository galleryPhotoRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Favorite a photo
     *
     * FLOW PROSES:
     * 1. Validate photo exists
     * 2. Privacy check: Photo must be public OR user is owner
     * 3. Check if already favorited (prevent duplicate)
     * 4. Get user from database
     * 5. Create PhotoFavorite entity
     * 6. Save to database
     *
     * KEY DIFFERENCE from likePhoto:
     * - ✅ User CAN favorite their own photos
     * - ✅ User can favorite own private photos
     * - ❌ User CANNOT favorite other users' private photos
     *
     * Example 1 (favorite public photo):
     * - User A (id=456) favorites Photo X (id=123, public)
     * - Photo X owner: User B (id=789)
     * - Photo X is public ✅
     * - Create: PhotoFavorite(photo=123, user=456, created_at=NOW)
     * - Save to photo_favorites table
     * - Result: Photo added to User A's private collection
     *
     * Example 2 (favorite own photo):
     * - User A (id=456) favorites Photo Y (id=789)
     * - Photo Y owner: User A (id=456) ✅ ALLOWED!
     * - Photo Y is private ✅ ALLOWED (own photo!)
     * - Create: PhotoFavorite(photo=789, user=456, created_at=NOW)
     * - Save to photo_favorites table
     * - Result: Own photo added to collection (portfolio organization)
     *
     * @param photoId ID of photo to favorite
     * @param userId ID of user favoriting the photo
     * @throws IllegalArgumentException if:
     *         - Photo not found
     *         - Photo is private AND user is not owner
     *         - User not found
     * @throws IllegalStateException if already favorited
     */
    @Transactional
    public void favoritePhoto(Long photoId, Long userId) {
        // STEP 1: Validate photo exists
        GalleryPhoto photo = galleryPhotoRepository.findById(photoId)
                .orElseThrow(() -> new IllegalArgumentException("Photo not found with id: " + photoId));

        // STEP 2: Privacy check (DIFFERENT from likes!)
        // Allow if: (photo is public) OR (user is owner)
        boolean isPublic = photo.getIsPublic();
        boolean isOwner = photo.getUser().getId().equals(userId);

        if (!isPublic && !isOwner) {
            // Photo is private AND user is not owner → FORBIDDEN
            throw new IllegalArgumentException("Cannot favorite private photos of other users");
        }

        // STEP 3: Check if already favorited (duplicate prevention)
        if (photoFavoriteRepository.existsByPhotoIdAndUserId(photoId, userId)) {
            throw new IllegalStateException("You have already favorited this photo");
        }

        // STEP 4: Get user from database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // STEP 5: Create PhotoFavorite entity
        PhotoFavorite photoFavorite = new PhotoFavorite();
        photoFavorite.setPhoto(photo);
        photoFavorite.setUser(user);
        // createdAt will be set automatically via @PrePersist

        // STEP 6: Save to database
        photoFavoriteRepository.save(photoFavorite);

        System.out.println("✅ Photo favorited: photoId=" + photoId + ", userId=" + userId +
                           (isOwner ? " (own photo)" : " (public photo)"));
    }

    /**
     * Unfavorite a photo
     *
     * FLOW PROSES:
     * 1. Validate photo exists
     * 2. Check if favorited (must exist to unfavorite)
     * 3. Delete the favorite from database
     *
     * Example:
     * - User A (id=456) unfavorites Photo X (id=123)
     * - Photo X exists ✅
     * - User A has favorited before ✅
     * - Delete: photo_favorites WHERE photo_id=123 AND user_id=456
     * - Result: Photo removed from User A's private collection
     *
     * @param photoId ID of photo to unfavorite
     * @param userId ID of user unfavoriting the photo
     * @throws IllegalArgumentException if:
     *         - Photo not found
     *         - Photo not favorited by user
     */
    @Transactional
    public void unfavoritePhoto(Long photoId, Long userId) {
        // STEP 1: Validate photo exists
        if (!galleryPhotoRepository.existsById(photoId)) {
            throw new IllegalArgumentException("Photo not found with id: " + photoId);
        }

        // STEP 2: Check if favorited
        if (!photoFavoriteRepository.existsByPhotoIdAndUserId(photoId, userId)) {
            throw new IllegalArgumentException("You have not favorited this photo");
        }

        // STEP 3: Delete favorite from database
        photoFavoriteRepository.deleteByPhotoIdAndUserId(photoId, userId);

        System.out.println("✅ Photo unfavorited: photoId=" + photoId + ", userId=" + userId);
    }

    /**
     * Get all photos favorited by a user
     *
     * Returns paginated list of GalleryPhoto objects.
     * Photos ordered by most recently favorited first (created_at DESC).
     *
     * OPTIMIZED: Uses single query with JOINs to get like/favorite counts.
     * Solves N+1 problem for favorited photos page.
     *
     * PRIVACY ENFORCEMENT:
     * - Only returns THIS user's favorites
     * - Other users cannot see this list
     * - Controller must extract userId from JWT (never from request body!)
     *
     * Use case: "Favorited Photos" page
     * - User navigates to /favorited-photos
     * - Frontend calls GET /api/gallery/favorited-photos?page=0&size=12
     * - Backend returns first 12 photos user has favorited
     *
     * Example:
     * - User A has favorited 50 photos (own photos + others' public photos)
     * - Request: getFavoritedPhotos(456, PageRequest.of(0, 12))
     * - Returns: Page with 12 photos + metadata (totalPages=5, hasNext=true)
     * - Only User A can see this list (100% private)
     *
     * @param userId ID of user (MUST be from JWT token!)
     * @param sortBy Sort order (newest, oldest, mostLiked, mostFavorited)
     * @param pageable Pagination parameters (page, size, sort)
     * @return Page<GalleryPhoto> with photos and pagination metadata
     */
    @Transactional(readOnly = true)
    public Page<GalleryPhoto> getFavoritedPhotos(Long userId, String sortBy, Pageable pageable) {
        // Use optimized query with JOINs for like/favorite counts
        return photoFavoriteRepository.findFavoritedPhotosByUserIdWithCounts(userId, sortBy, pageable);
    }

    /**
     * Check if user has favorited a photo
     *
     * Returns boolean to indicate favorite status.
     * Used for UI state (filled star vs outline star).
     *
     * PRIVACY NOTE:
     * - Only checks for CURRENT user
     * - Cannot check if OTHER users favorited
     * - Privacy by design
     *
     * Example:
     * - Frontend needs to show star icon state
     * - isFavorited(123, 456) → true (show filled star ⭐)
     * - isFavorited(123, 456) → false (show outline star ☆)
     *
     * @param photoId ID of photo
     * @param userId ID of user
     * @return true if user has favorited photo, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean isFavoritedByUser(Long photoId, Long userId) {
        return photoFavoriteRepository.existsByPhotoIdAndUserId(photoId, userId);
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. KEY DIFFERENCES from PhotoLikeService:
     *
     *    PhotoLikeService:
     *    ✅ Has getLikeCount(photoId) → Public counter
     *    ❌ Cannot like own photos
     *    ✅ Photo must be public
     *
     *    PhotoFavoriteService:
     *    ❌ NO getLikeCount() ← Privacy! No public counter
     *    ✅ CAN favorite own photos ← Key difference!
     *    ✅ Photo can be public OR own private photo
     *
     * 2. Privacy Check Logic:
     *
     *    Likes:
     *    if (!photo.getIsPublic()) → reject
     *    if (photo.getUser().getId().equals(userId)) → reject
     *
     *    Favorites:
     *    if (!isPublic && !isOwner) → reject
     *    Means: Allow if public OR allow if owner
     *
     * 3. Use Cases Comparison:
     *
     *    Likes:
     *    - "I appreciate this photo" (public)
     *    - Show engagement metrics
     *    - Cannot like own work (conflict of interest)
     *
     *    Favorites:
     *    - "Save for later" (private)
     *    - Personal collection/portfolio
     *    - CAN favorite own work (organization/featured)
     *
     * 4. Coexistence:
     *    - Same photo can be BOTH liked AND favorited
     *    - Independent operations
     *    - Different tables (photo_likes vs photo_favorites)
     *    - Different UI (heart ❤️ vs star ⭐)
     *
     * 5. Typical Favorite Flows:
     *
     *    FAVORITE PUBLIC PHOTO:
     *    1. User A views User B's public photo
     *    2. Clicks star icon
     *    3. favoritePhoto(photoId=123, userId=A)
     *    4. Check: isPublic=true ✅ OR isOwner=false
     *    5. Save to photo_favorites
     *    6. Star icon turns filled (yellow/gold)
     *    7. Photo appears in User A's Favorited Photos page
     *
     *    FAVORITE OWN PHOTO:
     *    1. User A views own photo (public or private)
     *    2. Clicks star icon
     *    3. favoritePhoto(photoId=789, userId=A)
     *    4. Check: isPublic=? ✅ OR isOwner=true ✅
     *    5. Save to photo_favorites
     *    6. Star icon turns filled
     *    7. Use case: Feature in portfolio / organize best work
     *
     *    CANNOT FAVORITE:
     *    1. User A tries to favorite User B's private photo
     *    2. favoritePhoto(photoId=999, userId=A)
     *    3. Check: isPublic=false AND isOwner=false
     *    4. Throw: "Cannot favorite private photos of other users"
     *    5. Frontend shows error toast
     *
     * 6. Security Considerations:
     *    - userId MUST come from JWT token (never request body)
     *    - Controller extracts userId from @RequestHeader("Authorization")
     *    - Privacy enforced at service layer
     *    - Repository queries filter by userId
     *    - No cross-user data leakage
     *
     * 7. Transaction Management:
     *    - @Transactional on write methods (favorite/unfavorite)
     *    - @Transactional(readOnly=true) on read methods
     *    - Ensures atomicity and consistency
     *    - Auto-rollback on exception
     *
     * 8. Error Handling:
     *    - IllegalArgumentException: Photo not found, privacy violation
     *    - IllegalStateException: Already favorited (duplicate)
     *    - DataIntegrityViolationException: DB constraint violation (caught by Spring)
     *    - Controller converts exceptions to proper HTTP status codes
     *
     * 9. Performance:
     *    - existsByPhotoIdAndUserId: Fast boolean check (no object load)
     *    - Indexes on (photo_id, user_id) make queries fast
     *    - Pagination prevents loading all favorites at once
     *    - Lazy loading (@ManyToOne LAZY) avoids N+1 queries
     *
     * 10. Testing Strategy:
     *     - Test can favorite public photo
     *     - Test can favorite own photo (public and private)
     *     - Test cannot favorite other's private photo
     *     - Test cannot favorite twice (duplicate prevention)
     *     - Test unfavorite removes from collection
     *     - Test getFavoritedPhotos returns only user's favorites
     *     - Test pagination works correctly
     */
}
