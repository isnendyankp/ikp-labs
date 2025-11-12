package com.registrationform.api.dto;

import jakarta.validation.constraints.Size;

/**
 * GalleryPhotoRequest - DTO for photo upload/update requests
 *
 * ANALOGI SEDERHANA:
 * ==================
 * Request DTO seperti "Formulir Pesanan":
 *
 * Customer (Frontend) isi formulir:
 * - Judul foto: "Sunset at Beach"
 * - Deskripsi: "Beautiful sunset during vacation"
 * - Privacy: Public atau Private?
 *
 * Backend terima formulir ini dan process request.
 *
 * Kenapa pakai DTO?
 * - Validasi input (size limits, format)
 * - Decouple API contract dari database entity
 * - Flexible - bisa beda dengan entity structure
 *
 * Use Case:
 * - Upload photo: POST /api/gallery/upload
 * - Update photo: PUT /api/gallery/photo/{id}
 */
public class GalleryPhotoRequest {

    /**
     * Photo title (optional)
     *
     * Max length: 100 characters
     * Example: "Sunset at Beach", "Family Vacation 2025"
     *
     * Validation:
     * - Not required (nullable)
     * - If provided, max 100 chars
     */
    @Size(max = 100, message = "Title cannot exceed 100 characters")
    private String title;

    /**
     * Photo description (optional)
     *
     * Max length: 5000 characters
     * Example: "This photo was taken during our family vacation to Bali..."
     *
     * Validation:
     * - Not required (nullable)
     * - If provided, max 5000 chars
     */
    @Size(max = 5000, message = "Description cannot exceed 5000 characters")
    private String description;

    /**
     * Privacy setting (optional)
     *
     * - true = Public (visible to everyone)
     * - false = Private (visible to owner only)
     * - null = Use default (false - private)
     *
     * Default: false (privacy-first approach)
     */
    private Boolean isPublic;

    /**
     * Default constructor - required by Spring for deserialization
     */
    public GalleryPhotoRequest() {
    }

    /**
     * Constructor with all fields
     */
    public GalleryPhotoRequest(String title, String description, Boolean isPublic) {
        this.title = title;
        this.description = description;
        this.isPublic = isPublic;
    }

    // Getters and Setters

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

    /**
     * toString for debugging
     */
    @Override
    public String toString() {
        return "GalleryPhotoRequest{" +
                "title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", isPublic=" + isPublic +
                '}';
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. Kenapa semua fields optional (nullable)?
     *    - Upload: User bisa upload tanpa title/description
     *    - Update: Partial update (update title saja, description tetap)
     *    - Flexibility untuk frontend
     *
     * 2. Kenapa pakai Boolean (not boolean)?
     *    - Boolean (wrapper) dapat null
     *    - boolean (primitive) always true/false
     *    - null = use default (false for privacy)
     *
     * 3. Validation Annotations:
     *    - @Size: Limit string length
     *    - Spring automatically validates before method call
     *    - If validation fails, return 400 Bad Request
     *
     * 4. Privacy Default:
     *    - null isPublic → Service sets to false (private)
     *    - Privacy-first approach (safe default)
     *    - User must explicitly set to true for public
     *
     * 5. Example Request (JSON):
     *    {
     *      "title": "Sunset at Beach",
     *      "description": "Beautiful sunset",
     *      "isPublic": true
     *    }
     *
     * 6. Example Partial Update (JSON):
     *    {
     *      "title": "New Title"
     *      // description and isPublic = null (not changed)
     *    }
     */
}
