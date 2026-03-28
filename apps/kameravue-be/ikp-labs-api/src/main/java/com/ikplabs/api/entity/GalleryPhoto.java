package com.ikplabs.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * GalleryPhoto Entity - represents 'gallery_photos' table in database
 *
 * ANALOGI SEDERHANA:
 * ==================
 * GalleryPhoto seperti "Kartu Foto di Album":
 *
 * Setiap kartu berisi:
 * - Foto itu sendiri (file_path)
 * - Judul foto (title)
 * - Deskripsi foto (description)
 * - Label Public/Private (is_public)
 * - Siapa pemiliknya (user_id)
 * - Kapan difoto/upload (created_at)
 *
 * Perbedaan dengan Profile Picture:
 * - Profile Picture: 1 foto per user (di table users)
 * - Gallery Photo: banyak foto per user (di table gallery_photos)
 *
 * Privacy Control:
 * - Public: Semua orang bisa lihat
 * - Private: Hanya pemilik yang bisa lihat
 *
 * @Entity = Marks this class as JPA entity
 * @Table = Configure table name in database
 */
@Entity
@Table(name = "gallery_photos")
public class GalleryPhoto {

    /**
     * Primary Key - Unique ID for each photo
     *
     * @Id = Marks field as primary key
     * @GeneratedValue = Auto-generate ID value
     * @Column = Configure column in database
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * User ID - Foreign key to users table
     *
     * @ManyToOne = Many photos belong to one user
     * @JoinColumn = Configure foreign key column
     *
     * Relationship: User (1) --< (many) GalleryPhoto
     * Example: User with id=83 can have 10 gallery photos
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * File Path - Path to photo file on disk
     *
     * NOT binary data, just the path string
     * Example: "gallery/user-83/photo-156-1731238845123.jpg"
     *
     * Why store path instead of binary:
     * - Database optimized for text/numbers, not large binary files
     * - Faster queries (no need to transfer large blobs)
     * - Easier to serve files via HTTP (static file handler)
     * - Can use CDN or cloud storage in future (just change path to URL)
     */
    @Column(name = "file_path", nullable = false, length = 255)
    private String filePath;

    /**
     * Title - Optional photo title set by user
     *
     * Example: "Sunset at Beach", "Family Vacation 2025"
     * Nullable because user might not want to set title
     */
    @Column(name = "title", length = 100)
    private String title;

    /**
     * Description - Optional photo description
     *
     * Example: "Beautiful sunset during our vacation to Bali"
     * TEXT type allows longer descriptions
     */
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    /**
     * Privacy Flag - Public or Private
     *
     * true = Public (visible to all users)
     * false = Private (only owner can see)
     *
     * Default: false (privacy-first approach)
     * User must explicitly set to public if they want to share
     */
    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = false;

    /**
     * Upload Order - User-defined order for sorting
     *
     * Allows user to manually arrange photos in their gallery
     * Default: 0 (photos sorted by created_at instead)
     *
     * Use case: User wants specific photo to appear first
     */
    @Column(name = "upload_order")
    private Integer uploadOrder = 0;

    /**
     * Created At - Timestamp when photo was uploaded
     *
     * updatable = false means this value cannot be changed after creation
     * Set automatically via @PrePersist
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Updated At - Timestamp when photo metadata was last updated
     *
     * Updates when user changes title, description, or privacy setting
     * Set automatically via @PreUpdate
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Default Constructor - Required by JPA
     */
    public GalleryPhoto() {
    }

    /**
     * Constructor with essential parameters
     *
     * @param user User who owns this photo
     * @param filePath Path to photo file
     */
    public GalleryPhoto(User user, String filePath) {
        this.user = user;
        this.filePath = filePath;
        this.isPublic = false; // Default to private
        this.uploadOrder = 0;
    }

    /**
     * Full Constructor with all parameters
     */
    public GalleryPhoto(User user, String filePath, String title, String description, Boolean isPublic) {
        this.user = user;
        this.filePath = filePath;
        this.title = title;
        this.description = description;
        this.isPublic = isPublic != null ? isPublic : false;
        this.uploadOrder = 0;
    }

    /**
     * Method called before data is saved to database
     *
     * @PrePersist = JPA lifecycle callback
     * Sets created_at and updated_at to current time
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Method called before data is updated in database
     *
     * @PreUpdate = JPA lifecycle callback
     * Updates updated_at to current time
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getter and Setter methods - Required by JPA

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
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

    /**
     * Convenience method to check if photo is private
     */
    public boolean isPrivate() {
        return !this.isPublic;
    }

    /**
     * Convenience method to toggle privacy
     */
    public void togglePrivacy() {
        this.isPublic = !this.isPublic;
    }

    /**
     * toString method - For debugging and logging
     *
     * Note: Does NOT include user object to avoid circular reference
     */
    @Override
    public String toString() {
        return "GalleryPhoto{" +
                "id=" + id +
                ", userId=" + (user != null ? user.getId() : null) +
                ", filePath='" + filePath + '\'' +
                ", title='" + title + '\'' +
                ", isPublic=" + isPublic +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    /**
     * NOTES FOR UNDERSTANDING:
     * ========================
     *
     * 1. Why @ManyToOne relationship?
     *    - One User can have many GalleryPhoto
     *    - Each GalleryPhoto belongs to one User
     *    - JPA will automatically handle foreign key
     *
     * 2. Why LAZY fetch?
     *    - Don't load User data unless explicitly needed
     *    - Better performance (avoid N+1 queries)
     *    - Only fetch user when you call photo.getUser()
     *
     * 3. Why default isPublic = false?
     *    - Privacy-first approach
     *    - User must explicitly choose to make photo public
     *    - Safer default for sensitive photos
     *
     * 4. Why separate title and description?
     *    - Title: short (max 100 chars), used in thumbnails
     *    - Description: long (TEXT type), used in detail view
     *    - Better UX: quick scan via titles, details when needed
     *
     * 5. Why uploadOrder field?
     *    - Allows user to manually arrange photos
     *    - Future feature: drag-and-drop reordering
     *    - Currently: default 0, sort by created_at instead
     *
     * 6. Privacy Control Implementation:
     *    - Repository queries must filter by isPublic
     *    - Service layer enforces authorization
     *    - Public gallery: only show is_public = true
     *    - My gallery: show all photos for owner
     *
     * 7. File Path Format:
     *    - Profile picture: "profiles/user-{userId}.jpg"
     *    - Gallery photo: "gallery/user-{userId}/photo-{photoId}-{timestamp}.jpg"
     *    - Different directories prevent conflicts
     *    - photoId + timestamp ensures uniqueness
     */
}
