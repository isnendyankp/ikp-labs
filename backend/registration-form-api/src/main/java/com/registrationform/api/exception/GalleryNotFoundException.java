package com.registrationform.api.exception;

/**
 * GalleryNotFoundException - Exception when photo is not found
 *
 * ANALOGI SEDERHANA:
 * ==================
 * GalleryNotFoundException seperti "Foto Tidak Ditemukan di Album":
 *
 * Bayangkan cari foto di album:
 * - User request: "Cari foto ID 123"
 * - Database: Check... foto ID 123 tidak ada
 * - Backend: throw GalleryNotFoundException
 * - Frontend: Tampilkan "Photo not found (404)"
 *
 * Exception Hierarchy:
 * RuntimeException (Java built-in)
 *   └── GalleryException (base - general errors)
 *         └── GalleryNotFoundException (specific - photo not found)
 *
 * HTTP Status Code: 404 Not Found
 * - Different from 400 Bad Request (general error)
 * - Different from 403 Forbidden (unauthorized)
 * - Specific: Resource not found in database
 *
 * Use Cases:
 * - GET /api/gallery/photo/999 → Photo ID 999 doesn't exist
 * - PUT /api/gallery/photo/999 → Cannot update non-existent photo
 * - DELETE /api/gallery/photo/999 → Cannot delete non-existent photo
 * - User deleted photo but frontend still has old reference
 */
public class GalleryNotFoundException extends GalleryException {

    /**
     * Constructor with error message
     *
     * Use case: Photo not found by ID
     * Example: throw new GalleryNotFoundException("Photo not found with ID: 123");
     *
     * @param message Error message describing which photo was not found
     */
    public GalleryNotFoundException(String message) {
        super(message);
    }

    /**
     * Constructor with error message and cause
     *
     * Use case: Wrap database exception
     * Example:
     * ```
     * try {
     *     Photo photo = repository.findById(photoId).orElseThrow();
     * } catch (NoSuchElementException e) {
     *     throw new GalleryNotFoundException("Photo not found", e);
     * }
     * ```
     *
     * @param message Error message describing which photo was not found
     * @param cause The underlying exception that caused this error
     */
    public GalleryNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. WHY SEPARATE EXCEPTION FOR NOT FOUND?
     *    ======================================
     *    Different HTTP Status Codes:
     *    - GalleryException → 400 Bad Request (general error)
     *    - GalleryNotFoundException → 404 Not Found (specific)
     *    - UnauthorizedGalleryAccessException → 403 Forbidden (no access)
     *
     *    Better Frontend Handling:
     *    - 404: Show "Photo not found" message, redirect to gallery
     *    - 400: Show error message, keep on same page
     *    - 403: Show "No permission" message, hide edit buttons
     *
     * 2. WHEN TO USE THIS EXCEPTION?
     *    ===========================
     *    Use when photo doesn't exist in database:
     *    - GET photo by ID → not found
     *    - UPDATE photo by ID → not found
     *    - DELETE photo by ID → not found
     *    - TOGGLE privacy by ID → not found
     *
     *    DON'T use for:
     *    - File not found on disk → GalleryException (file system error)
     *    - User not found → UserNotFoundException (different domain)
     *    - Unauthorized access → UnauthorizedGalleryAccessException
     *
     * 3. GLOBAL EXCEPTION HANDLER:
     *    =========================
     *    In GlobalExceptionHandler.java:
     *    ```
     *    @ExceptionHandler(GalleryNotFoundException.class)
     *    public ResponseEntity<ErrorResponse> handleNotFound(GalleryNotFoundException e) {
     *        ErrorResponse error = new ErrorResponse(
     *            LocalDateTime.now(),
     *            HttpStatus.NOT_FOUND.value(),
     *            HttpStatus.NOT_FOUND.getReasonPhrase(),
     *            e.getMessage()
     *        );
     *        return ResponseEntity
     *            .status(HttpStatus.NOT_FOUND)
     *            .body(error);
     *    }
     *    ```
     *
     * 4. USAGE EXAMPLES IN SERVICE:
     *    ===========================
     *    Method 1: Using Optional.orElseThrow()
     *    ```
     *    public GalleryPhoto getPhotoById(Long photoId, Long requestingUserId) {
     *        GalleryPhoto photo = galleryPhotoRepository.findById(photoId)
     *            .orElseThrow(() -> new GalleryNotFoundException(
     *                "Photo not found with ID: " + photoId
     *            ));
     *
     *        // Then check authorization
     *        if (!canAccess(photo, requestingUserId)) {
     *            throw new UnauthorizedGalleryAccessException(...);
     *        }
     *
     *        return photo;
     *    }
     *    ```
     *
     *    Method 2: Manual check
     *    ```
     *    public void deletePhoto(Long photoId, Long userId) {
     *        GalleryPhoto photo = galleryPhotoRepository.findById(photoId)
     *            .orElse(null);
     *
     *        if (photo == null) {
     *            throw new GalleryNotFoundException(
     *                "Cannot delete photo: Photo not found with ID " + photoId
     *            );
     *        }
     *
     *        if (!photo.getUser().getId().equals(userId)) {
     *            throw new UnauthorizedGalleryAccessException(...);
     *        }
     *
     *        // Delete file and database record
     *        fileStorageService.deleteGalleryPhoto(...);
     *        galleryPhotoRepository.delete(photo);
     *    }
     *    ```
     *
     * 5. FRONTEND ERROR HANDLING:
     *    ========================
     *    Frontend receives 404 response:
     *    ```javascript
     *    try {
     *        const response = await fetch('/api/gallery/photo/123');
     *        if (response.status === 404) {
     *            // Photo not found
     *            showToast('Photo not found. It may have been deleted.');
     *            navigateTo('/gallery');
     *        } else if (response.status === 403) {
     *            // Unauthorized
     *            showToast('You don\'t have permission to view this photo.');
     *        } else if (response.ok) {
     *            const photo = await response.json();
     *            displayPhoto(photo);
     *        }
     *    } catch (error) {
     *        showToast('Network error. Please try again.');
     *    }
     *    ```
     *
     * 6. ERROR RESPONSE FORMAT:
     *    =======================
     *    GET /api/gallery/photo/999 (not exists)
     *
     *    Response: 404 Not Found
     *    {
     *      "timestamp": "2025-11-12T14:30:00",
     *      "status": 404,
     *      "error": "Not Found",
     *      "message": "Photo not found with ID: 999",
     *      "path": "/api/gallery/photo/999"
     *    }
     *
     * 7. BEST PRACTICES:
     *    ===============
     *    ✅ DO:
     *    - Use specific error messages: "Photo not found with ID: 123"
     *    - Check existence before authorization (404 before 403)
     *    - Return 404 consistently for all "not found" cases
     *    - Handle in frontend with user-friendly message
     *
     *    ❌ DON'T:
     *    - Use generic "Not found" (specify what's not found)
     *    - Return 404 for unauthorized access (use 403 instead)
     *    - Expose internal details in error message
     *    - Return different status codes for same error
     *
     * 8. SECURITY CONSIDERATION:
     *    =======================
     *    Photo Existence Check:
     *    - Public photo not found → 404 Not Found (OK to reveal)
     *    - Private photo not found → 404 Not Found (OK to reveal)
     *    - Private photo exists but no access → 403 Forbidden
     *
     *    Why not hide 404 with 403?
     *    - Sequential IDs: Attacker can guess IDs anyway
     *    - Better UX: User knows if photo was deleted vs no access
     *    - Industry standard: REST APIs return 404 for not found
     *
     *    If extreme security needed (hide existence):
     *    - Always return 404 (even for private photos)
     *    - Use UUIDs instead of sequential IDs
     *    - But this is usually overkill for photo galleries
     *
     * 9. TESTING:
     *    ========
     *    Unit test for service:
     *    ```
     *    @Test
     *    void getPhotoById_whenPhotoNotFound_throwsNotFoundException() {
     *        // Given
     *        when(repository.findById(999L)).thenReturn(Optional.empty());
     *
     *        // When & Then
     *        assertThrows(GalleryNotFoundException.class, () -> {
     *            galleryService.getPhotoById(999L, 1L);
     *        });
     *    }
     *    ```
     *
     *    Integration test for controller:
     *    ```
     *    @Test
     *    void getPhotoById_whenPhotoNotFound_returns404() throws Exception {
     *        mockMvc.perform(get("/api/gallery/photo/999"))
     *            .andExpect(status().isNotFound())
     *            .andExpect(jsonPath("$.message").value("Photo not found with ID: 999"));
     *    }
     *    ```
     */
}
