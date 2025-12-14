package com.ikplabs.api.service;

import com.ikplabs.api.entity.GalleryPhoto;
import com.ikplabs.api.entity.User;
import com.ikplabs.api.exception.GalleryException;
import com.ikplabs.api.exception.GalleryNotFoundException;
import com.ikplabs.api.exception.UnauthorizedGalleryAccessException;
import com.ikplabs.api.repository.GalleryPhotoRepository;
import com.ikplabs.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * GalleryService - Business logic for photo gallery operations
 *
 * ANALOGI SEDERHANA:
 * ==================
 * GalleryService seperti "Manager Galeri Foto":
 *
 * Tanggung Jawab:
 * 1. TERIMA request dari customer (Controller)
 * 2. CEK apakah customer boleh akses foto (Authorization)
 * 3. DELEGASI ke petugas gudang (FileStorageService) untuk file operations
 * 4. DELEGASI ke petugas arsip (Repository) untuk database operations
 * 5. RETURN hasil ke customer
 *
 * Privacy Control:
 * - Public photos: Semua orang bisa lihat
 * - Private photos: Hanya owner yang bisa lihat/edit/delete
 *
 * @Service = Spring otomatis buat instance (singleton)
 */
@Service
public class GalleryService {

    @Autowired
    private GalleryPhotoRepository galleryPhotoRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Upload new photo to gallery
     *
     * FLOW PROSES:
     * 1. Validate file via FileStorageService
     * 2. Get user from database
     * 3. Create GalleryPhoto entity (without file path yet)
     * 4. Save to database to get auto-generated ID
     * 5. Save file to disk using the ID
     * 6. Update entity with file path
     * 7. Save again to persist file path
     * 8. Return the photo entity
     *
     * Why save twice?
     * - Need photo ID for filename generation
     * - First save gets ID, second save persists file path
     *
     * @param file Uploaded file
     * @param userId ID of user uploading
     * @param title Optional photo title
     * @param description Optional photo description
     * @param isPublic Privacy setting (true = public, false = private)
     * @return Saved GalleryPhoto entity
     * @throws IOException if file save fails
     * @throws IllegalArgumentException if validation fails
     * @throws RuntimeException if user not found
     */
    public GalleryPhoto uploadPhoto(
            MultipartFile file,
            Long userId,
            String title,
            String description,
            Boolean isPublic) throws IOException {

        // STEP 1: Validate file
        fileStorageService.validateGalleryPhoto(file);

        // STEP 2: Get user from database
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new GalleryException("User not found with id: " + userId));

        // STEP 3: Create photo entity (file path empty for now)
        GalleryPhoto photo = new GalleryPhoto(user, "");
        photo.setTitle(title);
        photo.setDescription(description);
        photo.setIsPublic(isPublic != null ? isPublic : false); // Default to private

        // STEP 4: Save to database (get auto-generated ID)
        photo = galleryPhotoRepository.save(photo);

        // STEP 5: Save file to disk (using photo ID)
        String filePath = fileStorageService.saveGalleryPhoto(file, userId, photo.getId());

        // STEP 6: Update entity with file path
        photo.setFilePath(filePath);

        // STEP 7: Save again to persist file path
        photo = galleryPhotoRepository.save(photo);

        System.out.println("✅ Photo uploaded successfully: " + photo.getId() + " for user " + userId);

        return photo;
    }

    /**
     * Get all photos for a user (owner view)
     *
     * Returns ALL photos (public + private) because this is for the owner.
     * Used in "My Gallery" page.
     *
     * @param userId ID of photo owner
     * @param pageable Pagination parameters
     * @return List of photos (paginated)
     */
    public List<GalleryPhoto> getMyPhotos(Long userId, Pageable pageable) {
        return galleryPhotoRepository.findByUserId(userId, pageable);
    }

    /**
     * Count total photos for a user
     *
     * Used for pagination metadata (total pages calculation).
     *
     * @param userId ID of photo owner
     * @return Total number of photos for user
     */
    public Long countMyPhotos(Long userId) {
        return galleryPhotoRepository.countByUserId(userId);
    }

    /**
     * Get all PUBLIC photos (from all users)
     *
     * Returns only photos where is_public = TRUE.
     * Used in "Public Gallery" page.
     * Accessible by anyone (authenticated or anonymous).
     *
     * @param pageable Pagination parameters
     * @return List of public photos (paginated)
     */
    public List<GalleryPhoto> getPublicPhotos(Pageable pageable) {
        return galleryPhotoRepository.findByIsPublicTrue(pageable);
    }

    /**
     * Count total PUBLIC photos
     *
     * Used for pagination metadata in Public Gallery.
     *
     * @return Total number of public photos
     */
    public Long countPublicPhotos() {
        return galleryPhotoRepository.countByIsPublicTrue();
    }

    /**
     * Get user's PUBLIC photos only
     *
     * Returns only public photos for a specific user.
     * Used when viewing another user's gallery.
     *
     * @param userId ID of photo owner
     * @param pageable Pagination parameters
     * @return List of user's public photos (paginated)
     */
    public List<GalleryPhoto> getUserPublicPhotos(Long userId, Pageable pageable) {
        return galleryPhotoRepository.findByUserIdAndIsPublicTrue(userId, pageable);
    }

    /**
     * Count user's PUBLIC photos
     *
     * @param userId ID of photo owner
     * @return Total number of user's public photos
     */
    public Long countUserPublicPhotos(Long userId) {
        return galleryPhotoRepository.countByUserIdAndIsPublicTrue(userId);
    }

    /**
     * Get photo by ID with privacy check
     *
     * Privacy rules:
     * - If photo is PUBLIC: Anyone can view
     * - If photo is PRIVATE: Only owner can view
     *
     * @param photoId ID of photo to retrieve
     * @param requestingUserId ID of user requesting (null if anonymous)
     * @return GalleryPhoto entity
     * @throws GalleryNotFoundException if photo not found
     * @throws UnauthorizedGalleryAccessException if unauthorized (private photo, not owner)
     */
    public GalleryPhoto getPhotoById(Long photoId, Long requestingUserId) {
        // Find photo or throw exception
        GalleryPhoto photo = galleryPhotoRepository.findById(photoId)
                .orElseThrow(() -> new GalleryNotFoundException("Photo not found with id: " + photoId));

        // Privacy check
        if (!photo.getIsPublic()) {
            // Photo is private - only owner can view
            if (requestingUserId == null || !photo.getUser().getId().equals(requestingUserId)) {
                throw new UnauthorizedGalleryAccessException("You are not authorized to view this private photo. Only the owner can access private photos.");
            }
        }

        // Photo is public OR user is owner
        return photo;
    }

    /**
     * Update photo metadata (title, description, privacy)
     *
     * Authorization: Only owner can update their photos.
     *
     * @param photoId ID of photo to update
     * @param userId ID of requesting user (must be owner)
     * @param title New title (optional)
     * @param description New description (optional)
     * @param isPublic New privacy setting (optional)
     * @return Updated GalleryPhoto entity
     * @throws GalleryNotFoundException if photo not found
     * @throws UnauthorizedGalleryAccessException if unauthorized (not owner)
     */
    public GalleryPhoto updatePhoto(
            Long photoId,
            Long userId,
            String title,
            String description,
            Boolean isPublic) {

        // Find photo or throw
        GalleryPhoto photo = galleryPhotoRepository.findById(photoId)
                .orElseThrow(() -> new GalleryNotFoundException("Photo not found with id: " + photoId));

        // Authorization check - must be owner
        if (!photo.getUser().getId().equals(userId)) {
            throw new UnauthorizedGalleryAccessException("You are not authorized to update this photo. Only the owner can edit their photos.");
        }

        // Update fields (only if provided)
        if (title != null) {
            photo.setTitle(title);
        }
        if (description != null) {
            photo.setDescription(description);
        }
        if (isPublic != null) {
            photo.setIsPublic(isPublic);
        }

        // Save and return
        photo = galleryPhotoRepository.save(photo);

        System.out.println("✅ Photo updated: " + photoId + " by user " + userId);

        return photo;
    }

    /**
     * Toggle photo privacy (public ↔ private)
     *
     * Convenience method to quickly toggle privacy setting.
     * Authorization: Only owner can toggle.
     *
     * @param photoId ID of photo to toggle
     * @param userId ID of requesting user (must be owner)
     * @return Updated GalleryPhoto entity
     * @throws GalleryNotFoundException if photo not found
     * @throws UnauthorizedGalleryAccessException if unauthorized (not owner)
     */
    public GalleryPhoto togglePrivacy(Long photoId, Long userId) {
        // Find photo or throw
        GalleryPhoto photo = galleryPhotoRepository.findById(photoId)
                .orElseThrow(() -> new GalleryNotFoundException("Photo not found with id: " + photoId));

        // Authorization check
        if (!photo.getUser().getId().equals(userId)) {
            throw new UnauthorizedGalleryAccessException("You are not authorized to modify this photo. Only the owner can change privacy settings.");
        }

        // Toggle privacy
        photo.togglePrivacy();

        // Save and return
        photo = galleryPhotoRepository.save(photo);

        System.out.println("✅ Privacy toggled for photo " + photoId + ": isPublic=" + photo.getIsPublic());

        return photo;
    }

    /**
     * Delete photo (with file cleanup)
     *
     * FLOW PROSES:
     * 1. Find photo in database
     * 2. Check authorization (must be owner)
     * 3. Delete file from disk
     * 4. Delete from database
     *
     * Authorization: Only owner can delete their photos.
     *
     * @param photoId ID of photo to delete
     * @param userId ID of requesting user (must be owner)
     * @throws GalleryNotFoundException if photo not found
     * @throws UnauthorizedGalleryAccessException if unauthorized (not owner)
     * @throws IOException if file deletion fails
     */
    public void deletePhoto(Long photoId, Long userId) throws IOException {
        // STEP 1: Find photo or throw
        GalleryPhoto photo = galleryPhotoRepository.findById(photoId)
                .orElseThrow(() -> new GalleryNotFoundException("Photo not found with id: " + photoId));

        // STEP 2: Authorization check
        if (!photo.getUser().getId().equals(userId)) {
            throw new UnauthorizedGalleryAccessException("You are not authorized to delete this photo. Only the owner can delete their photos.");
        }

        // STEP 3: Delete file from disk
        String extension = extractExtension(photo.getFilePath());
        fileStorageService.deleteGalleryPhoto(userId, photoId, extension);

        // STEP 4: Delete from database
        galleryPhotoRepository.delete(photo);

        System.out.println("✅ Photo deleted: " + photoId + " by user " + userId);
    }

    /**
     * Extract file extension from file path
     *
     * Example:
     * - "gallery/user-83/photo-156-123.jpg" → "jpg"
     * - "gallery/user-83/photo-157-456.png" → "png"
     *
     * @param filePath Full file path
     * @return File extension (lowercase)
     */
    private String extractExtension(String filePath) {
        int lastDotIndex = filePath.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < filePath.length() - 1) {
            return filePath.substring(lastDotIndex + 1).toLowerCase();
        }
        return "jpg"; // Default fallback
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * PRIVACY FILTERING:
     * ==================
     * - getMyPhotos(): Returns ALL (public + private) for owner
     * - getPublicPhotos(): Returns ONLY public for everyone
     * - getUserPublicPhotos(): Returns ONLY user's public for others
     * - getPhotoById(): Returns if (public OR owner)
     *
     * AUTHORIZATION STRATEGY:
     * =======================
     * Read Operations:
     * - Public photos: Anyone can view
     * - Private photos: Only owner can view
     *
     * Write Operations (update, delete, toggle):
     * - Only owner can modify their photos
     * - Check: photo.getUser().getId().equals(userId)
     * - Throw RuntimeException if not authorized
     *
     * ERROR HANDLING:
     * ===============
     * - Photo not found: RuntimeException with message
     * - Unauthorized: RuntimeException with message
     * - File errors: IOException (propagated to controller)
     * - Validation errors: IllegalArgumentException (from FileStorageService)
     *
     * WHY SAVE PHOTO TWICE IN UPLOAD?
     * ================================
     * 1. First save: Get auto-generated photo ID
     * 2. Use ID to generate filename: photo-{id}-{timestamp}.jpg
     * 3. Save file to disk with that filename
     * 4. Second save: Update photo entity with file path
     *
     * Alternative approach (not used):
     * - Save file first with temporary name
     * - Rename after getting ID
     * - More complex, more prone to errors
     *
     * PAGINATION:
     * ===========
     * - All "get" methods accept Pageable
     * - Pageable example: PageRequest.of(0, 20, Sort.by("createdAt").descending())
     * - Controller creates Pageable from request params (?page=0&size=20&sort=createdAt,desc)
     * - Service uses Pageable as-is
     * - Repository generates SQL with LIMIT and OFFSET
     *
     * TRANSACTION MANAGEMENT:
     * =======================
     * - No @Transactional annotation yet (can add later)
     * - Each method is atomic (single database operation)
     * - Upload has 2 saves but both are idempotent
     * - Delete has file + DB delete (file delete safe even if DB fails)
     *
     * SECURITY NOTES:
     * ===============
     * 1. Never trust userId from request - get from JWT authentication
     * 2. Always check authorization before write operations
     * 3. Privacy filtering happens at repository level (can't bypass)
     * 4. File validation happens before save (prevent malicious files)
     */
}
