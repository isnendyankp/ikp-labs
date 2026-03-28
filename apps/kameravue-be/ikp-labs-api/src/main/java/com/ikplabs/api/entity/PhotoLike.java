package com.ikplabs.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * PhotoLike Entity - represents 'photo_likes' table in database
 *
 * ANALOGI SEDERHANA:
 * ==================
 * PhotoLike seperti "Stiker Love/Heart di Instagram":
 *
 * Setiap stiker mencatat:
 * - Foto mana yang di-like (photo_id)
 * - Siapa yang nge-like (user_id)
 * - Kapan di-like (created_at)
 *
 * Aturan penting:
 * - 1 user hanya bisa like 1 foto sekali
 * - Kalau like lagi = unlike (remove)
 * - Database constraint: UNIQUE(photo_id, user_id)
 *
 * Contoh:
 * - User A like Photo 1 → Create record (photo_id=1, user_id=A)
 * - User A like Photo 1 lagi → Delete record (unlike)
 * - User B like Photo 1 → Create record (photo_id=1, user_id=B)
 * - Result: Photo 1 has 1 like (from User B)
 *
 * Many-to-Many Relationship:
 * - Many users can like many photos
 * - photo_likes is the "join table"
 *
 * @Entity = Marks this class as JPA entity
 * @Table = Configure table name and constraints
 */
@Entity
@Table(name = "photo_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"photo_id", "user_id"})
})
public class PhotoLike {

    /**
     * Primary Key - Unique ID for each like
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
     * @ManyToOne = Many likes can point to one photo
     * @JoinColumn = Configure foreign key column
     *
     * Relationship: GalleryPhoto (1) --< (many) PhotoLike
     * Example: Photo 1 can have 100 likes from different users
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
     * @ManyToOne = Many likes can be from one user
     * @JoinColumn = Configure foreign key column
     *
     * Relationship: User (1) --< (many) PhotoLike
     * Example: User A can like 50 different photos
     *
     * FetchType.LAZY = Don't load user data unless needed
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Created At - Timestamp when like was created
     *
     * Used for:
     * - Ordering liked photos (most recent first)
     * - Analytics (like patterns over time)
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
    public PhotoLike() {
    }

    /**
     * Constructor with essential parameters
     *
     * @param photo Photo being liked
     * @param user User who is liking
     */
    public PhotoLike(GalleryPhoto photo, User user) {
        this.photo = photo;
        this.user = user;
    }

    /**
     * Full Constructor with all parameters
     *
     * @param id Like ID
     * @param photo Photo being liked
     * @param user User who is liking
     * @param createdAt Timestamp when liked
     */
    public PhotoLike(Long id, GalleryPhoto photo, User user, LocalDateTime createdAt) {
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
     * 1. User clicks like button
     * 2. Service creates PhotoLike object
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
        return "PhotoLike{" +
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
     * 1. Why @UniqueConstraint(photo_id, user_id)?
     *    - Prevents duplicate likes
     *    - Database-level enforcement (safer than app-level)
     *    - If user tries to like twice, database throws error
     *    - Service layer catches error and returns proper response
     *
     * 2. Why two @ManyToOne relationships?
     *    - Many likes can point to ONE photo
     *    - Many likes can come from ONE user
     *    - This creates "Many-to-Many" between User and Photo
     *    - PhotoLike is the "join table" or "association table"
     *
     * 3. Why LAZY fetch?
     *    - Don't load related data unless explicitly needed
     *    - Better performance (avoid N+1 queries)
     *    - Example: When counting likes, we don't need photo/user data
     *    - Only fetch when you call photoLike.getPhoto() or photoLike.getUser()
     *
     * 4. Why ON DELETE CASCADE in database?
     *    - If photo is deleted → All likes are deleted automatically
     *    - If user is deleted → All their likes are deleted automatically
     *    - Maintains referential integrity
     *    - No orphaned records
     *
     * 5. Unique Constraint Logic:
     *    - Attempt to like same photo twice → Database rejects
     *    - Service catches SQLException/DataIntegrityViolationException
     *    - Returns 409 Conflict to frontend
     *    - Frontend shows "Already liked" message
     *
     * 6. Typical Usage Flow:
     *
     *    LIKE:
     *    1. Frontend: User clicks heart icon
     *    2. API: POST /api/gallery/photo/123/like
     *    3. Controller: Extract userId from JWT
     *    4. Service: Check if already liked
     *    5. Service: Create PhotoLike(photo=123, user=userId)
     *    6. Repository: save() → JPA calls onCreate() → INSERT
     *    7. Response: 201 Created with updated like count
     *    8. Frontend: Heart icon turns red
     *
     *    UNLIKE:
     *    1. Frontend: User clicks filled heart icon
     *    2. API: DELETE /api/gallery/photo/123/like
     *    3. Controller: Extract userId from JWT
     *    4. Service: Find existing like
     *    5. Repository: deleteByPhotoIdAndUserId()
     *    6. Response: 204 No Content
     *    7. Frontend: Heart icon turns outline
     *
     * 7. Query Examples:
     *
     *    Count likes for photo:
     *    SELECT COUNT(*) FROM photo_likes WHERE photo_id = 123
     *
     *    Check if user liked photo:
     *    SELECT * FROM photo_likes WHERE photo_id = 123 AND user_id = 456
     *
     *    Get user's liked photos:
     *    SELECT p.* FROM gallery_photos p
     *    JOIN photo_likes pl ON p.id = pl.photo_id
     *    WHERE pl.user_id = 456
     *    ORDER BY pl.created_at DESC
     *
     * 8. Why created_at field?
     *    - Order liked photos by recency
     *    - Show "recently liked" first
     *    - Analytics: like patterns over time
     *    - Future: "You liked this 2 days ago"
     */
}
