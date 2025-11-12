package com.registrationform.api.exception;

/**
 * UnauthorizedGalleryAccessException - Exception when user lacks permission to access photo
 *
 * ANALOGI SEDERHANA:
 * ==================
 * UnauthorizedGalleryAccessException seperti "Tidak Punya Akses ke Foto Orang Lain":
 *
 * Bayangkan album foto pribadi:
 * - User A punya foto private (ID 123)
 * - User B coba akses foto itu: GET /api/gallery/photo/123
 * - Backend: Check... foto ada (✅), tapi private dan bukan milik User B (❌)
 * - Backend: throw UnauthorizedGalleryAccessException
 * - Frontend: Show "You don't have permission (403)"
 *
 * Exception Hierarchy:
 * RuntimeException (Java built-in)
 *   └── GalleryException (base - general errors)
 *         └── UnauthorizedGalleryAccessException (specific - no permission)
 *
 * HTTP Status Code: 403 Forbidden
 * - Different from 404 Not Found (resource doesn't exist)
 * - Different from 400 Bad Request (general error)
 * - Specific: Resource exists but user can't access it
 *
 * Authorization Rules:
 * - Public photo → Everyone can view (no exception)
 * - Private photo → Only owner can view (others get 403)
 * - Any photo → Only owner can edit/delete (others get 403)
 *
 * Use Cases:
 * - User B tries to view User A's private photo → 403
 * - User B tries to edit User A's photo → 403
 * - User B tries to delete User A's photo → 403
 * - User B tries to toggle privacy of User A's photo → 403
 */
public class UnauthorizedGalleryAccessException extends GalleryException {

    /**
     * Constructor with error message
     *
     * Use case: User trying to access photo without permission
     * Example: throw new UnauthorizedGalleryAccessException("You don't have permission to access this photo");
     *
     * @param message Error message describing why access was denied
     */
    public UnauthorizedGalleryAccessException(String message) {
        super(message);
    }

    /**
     * Constructor with error message and cause
     *
     * Use case: Wrap security exception
     * Example:
     * ```
     * try {
     *     checkPermission(user, photo);
     * } catch (SecurityException e) {
     *     throw new UnauthorizedGalleryAccessException("Access denied", e);
     * }
     * ```
     *
     * @param message Error message describing why access was denied
     * @param cause The underlying exception that caused this error
     */
    public UnauthorizedGalleryAccessException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. WHY SEPARATE EXCEPTION FOR UNAUTHORIZED?
     *    =========================================
     *    Different HTTP Status Codes:
     *    - GalleryException → 400 Bad Request (general error)
     *    - GalleryNotFoundException → 404 Not Found (doesn't exist)
     *    - UnauthorizedGalleryAccessException → 403 Forbidden (no access)
     *
     *    Better Frontend Handling:
     *    - 403: Hide edit/delete buttons, show "View only" mode
     *    - 404: Redirect to gallery, show "Photo deleted" message
     *    - 400: Show error message, retry button
     *
     * 2. 403 FORBIDDEN vs 401 UNAUTHORIZED:
     *    ===================================
     *    401 Unauthorized:
     *    - User not logged in (no JWT token)
     *    - Invalid or expired token
     *    - Handled by Spring Security filter
     *    - Response: "Please login to continue"
     *
     *    403 Forbidden:
     *    - User IS logged in (valid token)
     *    - But lacks permission for THIS resource
     *    - Handled by our custom exception handler
     *    - Response: "You don't have permission to access this photo"
     *
     *    In our app:
     *    - Spring Security handles 401 (authentication)
     *    - UnauthorizedGalleryAccessException handles 403 (authorization)
     *
     * 3. AUTHORIZATION RULES:
     *    ====================
     *    View Photo (GET):
     *    - Public photo → ✅ Anyone can view
     *    - Private photo + Owner → ✅ Owner can view
     *    - Private photo + Not owner → ❌ 403 Forbidden
     *
     *    Edit Photo (PUT):
     *    - Public photo + Owner → ✅ Owner can edit
     *    - Public photo + Not owner → ❌ 403 Forbidden
     *    - Private photo + Owner → ✅ Owner can edit
     *    - Private photo + Not owner → ❌ 403 Forbidden
     *
     *    Delete Photo (DELETE):
     *    - Any photo + Owner → ✅ Owner can delete
     *    - Any photo + Not owner → ❌ 403 Forbidden
     *
     *    Toggle Privacy (PUT):
     *    - Any photo + Owner → ✅ Owner can toggle
     *    - Any photo + Not owner → ❌ 403 Forbidden
     *
     * 4. WHEN TO USE THIS EXCEPTION?
     *    ===========================
     *    Use when user IS authenticated but lacks permission:
     *    - Viewing private photo (not owner)
     *    - Editing photo (not owner)
     *    - Deleting photo (not owner)
     *    - Toggling privacy (not owner)
     *
     *    DON'T use for:
     *    - User not logged in → 401 (handled by Spring Security)
     *    - Photo not found → GalleryNotFoundException (404)
     *    - File upload error → GalleryException (400)
     *
     * 5. GLOBAL EXCEPTION HANDLER:
     *    =========================
     *    In GlobalExceptionHandler.java:
     *    ```
     *    @ExceptionHandler(UnauthorizedGalleryAccessException.class)
     *    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedGalleryAccessException e) {
     *        ErrorResponse error = new ErrorResponse(
     *            LocalDateTime.now(),
     *            HttpStatus.FORBIDDEN.value(),
     *            HttpStatus.FORBIDDEN.getReasonPhrase(),
     *            e.getMessage()
     *        );
     *        return ResponseEntity
     *            .status(HttpStatus.FORBIDDEN)
     *            .body(error);
     *    }
     *    ```
     *
     * 6. USAGE EXAMPLES IN SERVICE:
     *    ===========================
     *    View Photo:
     *    ```
     *    public GalleryPhoto getPhotoById(Long photoId, Long requestingUserId) {
     *        GalleryPhoto photo = repository.findById(photoId)
     *            .orElseThrow(() -> new GalleryNotFoundException(...));
     *
     *        // Check authorization
     *        boolean isOwner = photo.getUser().getId().equals(requestingUserId);
     *        boolean isPublic = photo.getIsPublic();
     *
     *        if (!isPublic && !isOwner) {
     *            throw new UnauthorizedGalleryAccessException(
     *                "You don't have permission to view this private photo"
     *            );
     *        }
     *
     *        return photo;
     *    }
     *    ```
     *
     *    Edit Photo:
     *    ```
     *    public GalleryPhoto updatePhoto(Long photoId, Long userId, GalleryPhotoRequest request) {
     *        GalleryPhoto photo = repository.findById(photoId)
     *            .orElseThrow(() -> new GalleryNotFoundException(...));
     *
     *        // Only owner can edit
     *        if (!photo.getUser().getId().equals(userId)) {
     *            throw new UnauthorizedGalleryAccessException(
     *                "You don't have permission to edit this photo. Only the owner can edit."
     *            );
     *        }
     *
     *        // Update fields
     *        if (request.getTitle() != null) photo.setTitle(request.getTitle());
     *        if (request.getDescription() != null) photo.setDescription(request.getDescription());
     *        if (request.getIsPublic() != null) photo.setIsPublic(request.getIsPublic());
     *
     *        return repository.save(photo);
     *    }
     *    ```
     *
     *    Delete Photo:
     *    ```
     *    public void deletePhoto(Long photoId, Long userId) {
     *        GalleryPhoto photo = repository.findById(photoId)
     *            .orElseThrow(() -> new GalleryNotFoundException(...));
     *
     *        // Only owner can delete
     *        if (!photo.getUser().getId().equals(userId)) {
     *            throw new UnauthorizedGalleryAccessException(
     *                "You don't have permission to delete this photo. Only the owner can delete."
     *            );
     *        }
     *
     *        fileStorageService.deleteGalleryPhoto(...);
     *        repository.delete(photo);
     *    }
     *    ```
     *
     * 7. FRONTEND ERROR HANDLING:
     *    ========================
     *    Frontend receives 403 response:
     *    ```javascript
     *    async function viewPhoto(photoId) {
     *        try {
     *            const response = await fetch(`/api/gallery/photo/${photoId}`, {
     *                headers: { 'Authorization': `Bearer ${token}` }
     *            });
     *
     *            if (response.status === 403) {
     *                // No permission - hide edit/delete buttons
     *                showToast('This is a private photo. You can only view your own photos.');
     *                hideEditButtons();
     *            } else if (response.status === 404) {
     *                // Photo not found
     *                showToast('Photo not found. It may have been deleted.');
     *                navigateTo('/gallery');
     *            } else if (response.status === 401) {
     *                // Not logged in
     *                showToast('Please login to view photos.');
     *                navigateTo('/login');
     *            } else if (response.ok) {
     *                const photo = await response.json();
     *                displayPhoto(photo);
     *                showEditButtons(); // User is owner
     *            }
     *        } catch (error) {
     *            showToast('Network error. Please try again.');
     *        }
     *    }
     *    ```
     *
     * 8. ERROR RESPONSE FORMAT:
     *    =======================
     *    GET /api/gallery/photo/123 (private photo, not owner)
     *
     *    Response: 403 Forbidden
     *    {
     *      "timestamp": "2025-11-12T14:30:00",
     *      "status": 403,
     *      "error": "Forbidden",
     *      "message": "You don't have permission to view this private photo",
     *      "path": "/api/gallery/photo/123"
     *    }
     *
     * 9. SECURITY BEST PRACTICES:
     *    ========================
     *    ✅ DO:
     *    - Check existence BEFORE authorization (404 before 403)
     *    - Return clear error messages (explain why denied)
     *    - Log unauthorized access attempts (security audit)
     *    - Use consistent authorization logic across all endpoints
     *
     *    ❌ DON'T:
     *    - Return 403 for non-existent resources (use 404 instead)
     *    - Expose sensitive info in error message ("Photo belongs to user@email.com")
     *    - Allow different users to modify same photo (race conditions)
     *    - Bypass authorization checks for "admin" users (unless implemented)
     *
     * 10. SEQUENCE: 404 vs 403:
     *     =====================
     *     CORRECT ORDER:
     *     1. Check if photo exists → 404 if not found
     *     2. Check if user has permission → 403 if not authorized
     *     3. Perform operation → 200/201 if success
     *
     *     Why this order?
     *     - 404: "Photo doesn't exist" (public information)
     *     - 403: "Photo exists but you can't access it" (reveals existence)
     *     - If we return 403 for non-existent photos, attackers can discover private photo IDs
     *
     *     Example:
     *     ```
     *     // CORRECT
     *     GalleryPhoto photo = repository.findById(photoId)
     *         .orElseThrow(() -> new GalleryNotFoundException(...)); // 404 first
     *
     *     if (!canAccess(photo, userId)) {
     *         throw new UnauthorizedGalleryAccessException(...); // 403 second
     *     }
     *
     *     // WRONG
     *     if (!canAccess(photoId, userId)) { // Check permission before existence
     *         throw new UnauthorizedGalleryAccessException(...); // Might reveal photo exists
     *     }
     *     GalleryPhoto photo = repository.findById(photoId)...
     *     ```
     *
     * 11. TESTING:
     *     ========
     *     Unit test for service:
     *     ```
     *     @Test
     *     void getPhotoById_whenPrivatePhotoAndNotOwner_throwsUnauthorized() {
     *         // Given
     *         GalleryPhoto photo = createPrivatePhoto(ownerId: 1L);
     *         when(repository.findById(1L)).thenReturn(Optional.of(photo));
     *
     *         // When & Then
     *         assertThrows(UnauthorizedGalleryAccessException.class, () -> {
     *             galleryService.getPhotoById(1L, requestingUserId: 2L);
     *         });
     *     }
     *     ```
     *
     *     Integration test for controller:
     *     ```
     *     @Test
     *     void getPhotoById_whenNotOwner_returns403() throws Exception {
     *         mockMvc.perform(get("/api/gallery/photo/1")
     *                 .header("Authorization", "Bearer " + userBToken))
     *             .andExpect(status().isForbidden())
     *             .andExpect(jsonPath("$.message").value("You don't have permission"));
     *     }
     *     ```
     */
}
