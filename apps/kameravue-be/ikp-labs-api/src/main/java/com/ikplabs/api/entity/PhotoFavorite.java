package com.ikplabs.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * PhotoFavorite Entity - represents 'photo_favorites' table in database
 *
 * ANALOGI SEDERHANA:
 * ==================
 * PhotoFavorite seperti "Bookmark/Save di Browser":
 *
 * Setiap bookmark mencatat:
 * - Foto mana yang di-favorite (photo_id)
 * - Siapa yang nge-favorite (user_id)
 * - Kapan di-favorite (created_at)
 *
 * PERBEDAAN dengan PhotoLike (PENTING!):
 * ========================================
 * PhotoLike = PUBLIC appreciation (seperti Instagram heart)
 * - Visible to everyone (like count shown)
 * - Cannot like own photos
 * - Social engagement feature
 *
 * PhotoFavorite = PRIVATE bookmarks (seperti browser bookmark)
 * - Only visible to YOU (100% private)
 * - CAN favorite own photos (for portfolio/organization)
 * - Personal collection feature
 *
 * Aturan penting:
 * - 1 user hanya bisa favorite 1 foto sekali
 * - Kalau favorite lagi = unfavorite (remove)
 * - Database constraint: UNIQUE(photo_id, user_id)
 * - PRIVATE: No one else can see your favorites
 *
 * Contoh:
 * - User A favorite Photo 1 → Create record (photo_id=1, user_id=A)
 * - User A favorite Photo 1 lagi → Delete record (unfavorite)
 * - User B favorite Photo 1 → Create record (photo_id=1, user_id=B)
 * - Result: Both users have private favorites (not visible to each other)
 *
 * Many-to-Many Relationship:
 * - Many users can favorite many photos
 * - photo_favorites is the "join table"
 *
 * @Entity = Marks this class as JPA entity
 * @Table = Configure table name and constraints
 */
@Entity
@Table(name = "photo_favorites", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"photo_id", "user_id"})
})
public class PhotoFavorite {

    /**
     * Primary Key - Unique ID for each favorite
     *
     * @Id = Marks field as primary key
     * @GeneratedValue = Auto-generate ID value
     * @Column = Configure column in database
     *
     * Example: id=1, id=2, id=3, ...
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * Photo ID - Foreign key to gallery_photos table
     *
     * @ManyToOne = Many favorites can point to one photo
     * @JoinColumn = Configure foreign key column
     *
     * Relationship: GalleryPhoto (1) --< (many) PhotoFavorite
     * Example: Photo 1 can be favorited by 100 different users (all private)
     *
     * FetchType.LAZY = Don't load photo data unless needed
     * - Performance optimization
     * - Avoid N+1 query problem
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id", nullable = false)
    private GalleryPhoto photo;

    /**
     * User ID - Foreign key to users table
     *
     * @ManyToOne = Many favorites can belong to one user
     * @JoinColumn = Configure foreign key column
     *
     * Relationship: User (1) --< (many) PhotoFavorite
     * Example: User A can favorite 50 different photos (private collection)
     *
     * FetchType.LAZY = Don't load user data unless needed
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Created At - Timestamp when favorite was created
     *
     * Used for:
     * - Ordering favorited photos (most recent first)
     * - "Recently Favorited" section
     * - Personal organization
     *
     * updatable = false means value cannot be changed after creation
     * Set automatically via @PrePersist
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Default Constructor - Required by JPA
     *
     * JPA needs this to create instances when loading from database
     */
    public PhotoFavorite() {
    }

    /**
     * Constructor with essential parameters
     *
     * @param photo Photo being favorited
     * @param user User who is favoriting
     */
    public PhotoFavorite(GalleryPhoto photo, User user) {
        this.photo = photo;
        this.user = user;
    }

    /**
     * Full Constructor with all parameters
     *
     * @param id Favorite ID
     * @param photo Photo being favorited
     * @param user User who is favoriting
     * @param createdAt Timestamp when favorited
     */
    public PhotoFavorite(Long id, GalleryPhoto photo, User user, LocalDateTime createdAt) {
        this.id = id;
        this.photo = photo;
        this.user = user;
        this.createdAt = createdAt;
    }

    /**
     * Method called before data is saved to database
     *
     * @PrePersist = JPA lifecycle callback
     * Automatically sets createdAt to current time
     *
     * Example flow:
     * 1. User clicks star icon (favorite button)
     * 2. Service creates PhotoFavorite object
     * 3. Repository calls save()
     * 4. JPA calls onCreate() before INSERT
     * 5. createdAt is set automatically
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getter and Setter methods - Required by JPA

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public GalleryPhoto getPhoto() {
        return photo;
    }

    public void setPhoto(GalleryPhoto photo) {
        this.photo = photo;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * toString method - For debugging and logging
     *
     * Note: Does NOT include photo/user objects to avoid circular reference
     * Only shows IDs to prevent lazy loading issues
     */
    @Override
    public String toString() {
        return "PhotoFavorite{" +
                "id=" + id +
                ", photoId=" + (photo != null ? photo.getId() : null) +
                ", userId=" + (user != null ? user.getId() : null) +
                ", createdAt=" + createdAt +
                '}';
    }

    /**
     * NOTES FOR UNDERSTANDING:
     * ========================
     *
     * 1. KEY DIFFERENCE: Favorites vs Likes
     *    PhotoLike:
     *    - ❤️ Public appreciation (visible to all)
     *    - Social engagement
     *    - Cannot like own photos
     *    - Has public counter
     *
     *    PhotoFavorite:
     *    - ⭐ Private bookmarks (only you see)
     *    - Personal organization
     *    - CAN favorite own photos ← IMPORTANT!
     *    - No public counter
     *
     * 2. Why CAN favorite own photos?
     *    - Use case: Organize portfolio
     *    - Use case: Highlight best work
     *    - Use case: Featured photos section
     *    - Different purpose than "liking"
     *
     * 3. Privacy Enforcement:
     *    - Service layer: getFavoritedPhotos(userId) only returns THAT user's favorites
     *    - Controller: userId from JWT (never from request body)
     *    - No public API to see other users' favorites
     *    - No aggregate count shown publicly
     *
     * 4. Why @UniqueConstraint(photo_id, user_id)?
     *    - Prevents duplicate favorites
     *    - Database-level enforcement (safer than app-level)
     *    - If user tries to favorite twice, database throws error
     *    - Service layer catches error and returns proper response
     *
     * 5. Why ON DELETE CASCADE in database?
     *    - If photo is deleted → All favorites are deleted automatically
     *    - If user is deleted → All their favorites are deleted automatically
     *    - Maintains referential integrity
     *    - No orphaned records
     *
     * 6. Typical Usage Flow:
     *
     *    FAVORITE:
     *    1. Frontend: User clicks star icon
     *    2. API: POST /api/gallery/photo/123/favorite
     *    3. Controller: Extract userId from JWT
     *    4. Service: Check if already favorited
     *    5. Service: Privacy check (public OR user is owner)
     *    6. Service: Create PhotoFavorite(photo=123, user=userId)
     *    7. Repository: save() → JPA calls onCreate() → INSERT
     *    8. Response: 201 Created
     *    9. Frontend: Star icon turns yellow/gold
     *
     *    UNFAVORITE:
     *    1. Frontend: User clicks filled star icon
     *    2. API: DELETE /api/gallery/photo/123/favorite
     *    3. Controller: Extract userId from JWT
     *    4. Service: Find existing favorite
     *    5. Repository: deleteByPhotoIdAndUserId()
     *    6. Response: 204 No Content
     *    7. Frontend: Star icon turns outline
     *
     * 7. Query Examples:
     *
     *    Check if user favorited photo:
     *    SELECT * FROM photo_favorites WHERE photo_id = 123 AND user_id = 456
     *
     *    Get user's favorited photos (PRIVATE - only their own):
     *    SELECT p.* FROM gallery_photos p
     *    JOIN photo_favorites pf ON p.id = pf.photo_id
     *    WHERE pf.user_id = 456
     *    ORDER BY pf.created_at DESC
     *
     *    NOTE: NO query for "count all favorites for a photo"
     *    - Favorites are private, no public counter!
     *
     * 8. Coexistence with Likes:
     *    - Same photo can be BOTH liked AND favorited
     *    - Independent features
     *    - PhotoResponse DTO includes both:
     *      {
     *        "isLikedByCurrentUser": true,     ← Heart ❤️
     *        "isFavoritedByCurrentUser": true  ← Star ⭐
     *      }
     *
     * 9. Business Rules (Different from Likes):
     *    Likes:
     *    - ❌ Cannot like own photos
     *    - ✅ Photo must be public
     *    - ✅ Like count is public
     *
     *    Favorites:
     *    - ✅ CAN favorite own photos ← KEY DIFFERENCE!
     *    - ✅ Can favorite public photos
     *    - ✅ Can favorite own private photos
     *    - ❌ Cannot favorite other users' private photos
     *    - ❌ No public counter (100% private)
     */
}
