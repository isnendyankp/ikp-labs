package com.registrationform.api.exception;

/**
 * GalleryException - Base exception for gallery-related errors
 *
 * ANALOGI SEDERHANA:
 * ==================
 * GalleryException seperti "Error Umum di Galeri Foto":
 *
 * Bayangkan toko foto (gallery):
 * - Foto tidak ketemu → GalleryNotFoundException (specific)
 * - Tidak punya akses → UnauthorizedGalleryAccessException (specific)
 * - File corrupt → GalleryException (general)
 * - Storage penuh → GalleryException (general)
 *
 * Exception Hierarchy:
 * RuntimeException (Java built-in)
 *   └── GalleryException (base - general errors)
 *         ├── GalleryNotFoundException (specific - photo not found)
 *         └── UnauthorizedGalleryAccessException (specific - no access)
 *
 * Kenapa pakai Custom Exception?
 * - Clear error messages untuk frontend
 * - Proper HTTP status codes (404, 403, 400, etc.)
 * - Easy to catch specific errors
 * - Better debugging dengan stack trace
 *
 * Use Cases:
 * - File upload failed (disk full, IO error)
 * - File format invalid (not an image)
 * - File too large (exceeds limit)
 * - File corrupted (cannot read)
 * - Database error (save failed)
 * - General gallery operation errors
 */
public class GalleryException extends RuntimeException {

    /**
     * Constructor with error message
     *
     * Use case: Simple error message
     * Example: throw new GalleryException("Failed to upload photo");
     *
     * @param message Error message describing what went wrong
     */
    public GalleryException(String message) {
        super(message);
    }

    /**
     * Constructor with error message and cause
     *
     * Use case: Wrap another exception with context
     * Example:
     * ```
     * try {
     *     Files.copy(source, destination);
     * } catch (IOException e) {
     *     throw new GalleryException("Failed to save photo file", e);
     * }
     * ```
     *
     * @param message Error message describing what went wrong
     * @param cause The underlying exception that caused this error
     */
    public GalleryException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. WHY EXTEND RuntimeException?
     *    =============================
     *    RuntimeException (unchecked):
     *    - Don't need to declare "throws" in method signature
     *    - Can be caught by @ExceptionHandler in controller
     *    - Modern Spring best practice
     *
     *    vs Exception (checked):
     *    - Must declare "throws Exception" everywhere
     *    - Clutters method signatures
     *    - Old-school Java style
     *
     * 2. WHEN TO USE GalleryException?
     *    ==============================
     *    Use for GENERAL gallery errors:
     *    - File upload failed (disk full, IO error)
     *    - File validation failed (not an image, too large)
     *    - File processing failed (corrupt, cannot read)
     *    - Database operation failed
     *
     *    DON'T use for SPECIFIC errors (use subclasses instead):
     *    - Photo not found → GalleryNotFoundException
     *    - Unauthorized access → UnauthorizedGalleryAccessException
     *
     * 3. EXCEPTION HIERARCHY:
     *    ====================
     *    RuntimeException (Java built-in)
     *      └── GalleryException (base exception)
     *            ├── GalleryNotFoundException (specific)
     *            └── UnauthorizedGalleryAccessException (specific)
     *
     *    Benefits:
     *    - Can catch all gallery errors: catch (GalleryException e)
     *    - Can catch specific errors: catch (GalleryNotFoundException e)
     *    - Can differentiate errors for different HTTP status codes
     *
     * 4. GLOBAL EXCEPTION HANDLER:
     *    =========================
     *    In GlobalExceptionHandler.java:
     *    ```
     *    @ExceptionHandler(GalleryException.class)
     *    public ResponseEntity<ErrorResponse> handleGalleryException(GalleryException e) {
     *        return ResponseEntity
     *            .status(HttpStatus.BAD_REQUEST)
     *            .body(new ErrorResponse(e.getMessage()));
     *    }
     *
     *    @ExceptionHandler(GalleryNotFoundException.class)
     *    public ResponseEntity<ErrorResponse> handleNotFound(GalleryNotFoundException e) {
     *        return ResponseEntity
     *            .status(HttpStatus.NOT_FOUND)
     *            .body(new ErrorResponse(e.getMessage()));
     *    }
     *
     *    @ExceptionHandler(UnauthorizedGalleryAccessException.class)
     *    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedGalleryAccessException e) {
     *        return ResponseEntity
     *            .status(HttpStatus.FORBIDDEN)
     *            .body(new ErrorResponse(e.getMessage()));
     *    }
     *    ```
     *
     * 5. USAGE EXAMPLES:
     *    ===============
     *    In GalleryService.java:
     *
     *    // File upload error
     *    try {
     *        fileStorageService.saveGalleryPhoto(file, userId, photoId);
     *    } catch (IOException e) {
     *        throw new GalleryException("Failed to save photo file: " + e.getMessage(), e);
     *    }
     *
     *    // File validation error
     *    if (!isValidImageFile(file)) {
     *        throw new GalleryException("Invalid image file format");
     *    }
     *
     *    // File size error
     *    if (file.getSize() > MAX_FILE_SIZE) {
     *        throw new GalleryException("File size exceeds maximum limit of 5MB");
     *    }
     *
     *    // Photo not found (use specific exception)
     *    GalleryPhoto photo = repository.findById(photoId)
     *        .orElseThrow(() -> new GalleryNotFoundException("Photo not found with ID: " + photoId));
     *
     *    // Unauthorized access (use specific exception)
     *    if (!photo.getUser().getId().equals(userId)) {
     *        throw new UnauthorizedGalleryAccessException("You don't have permission to access this photo");
     *    }
     *
     * 6. HTTP STATUS CODE MAPPING:
     *    ==========================
     *    GalleryException → 400 Bad Request
     *    - General errors (file upload failed, validation failed)
     *
     *    GalleryNotFoundException → 404 Not Found
     *    - Photo not found in database
     *
     *    UnauthorizedGalleryAccessException → 403 Forbidden
     *    - User trying to access/modify someone else's private photo
     *
     * 7. ERROR RESPONSE FORMAT:
     *    =======================
     *    Frontend receives:
     *    {
     *      "timestamp": "2025-11-12T14:30:00",
     *      "status": 400,
     *      "error": "Bad Request",
     *      "message": "Failed to upload photo: File size exceeds 5MB",
     *      "path": "/api/gallery/upload"
     *    }
     *
     * 8. BEST PRACTICES:
     *    ===============
     *    ✅ DO:
     *    - Use specific exception classes when possible
     *    - Include clear, user-friendly error messages
     *    - Include original exception as cause (for debugging)
     *    - Handle in GlobalExceptionHandler with proper HTTP status
     *
     *    ❌ DON'T:
     *    - Return stack trace to frontend (security risk)
     *    - Use generic "Error occurred" messages (not helpful)
     *    - Swallow exceptions without logging
     *    - Use checked exceptions (adds boilerplate)
     */
}
