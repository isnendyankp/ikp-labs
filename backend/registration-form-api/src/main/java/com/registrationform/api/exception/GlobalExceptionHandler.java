package com.registrationform.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * GlobalExceptionHandler - Central exception handling untuk seluruh aplikasi
 *
 * @RestControllerAdvice = Annotation untuk menangani exception globally
 * Seperti "Security Guard" di lobby hotel yang menangani semua masalah
 * sebelum sampai ke reception desk (Controller)
 *
 * Analogi:
 * - Exception = Masalah/error yang terjadi
 * - GlobalExceptionHandler = Security Guard
 * - Response = Pesan yang rapi untuk customer (frontend)
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle Validation Errors dari @Valid annotation
     *
     * Ketika user kirim data tidak valid (contoh: email salah format),
     * Spring akan throw MethodArgumentNotValidException.
     * Method ini akan "tangkap" exception tsb dan convert jadi response yang rapi.
     *
     * @param ex Exception yang berisi detail error validation
     * @return ResponseEntity dengan error details yang user-friendly
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {

        // Map untuk menyimpan field errors (field name -> error message)
        Map<String, String> errors = new HashMap<>();

        // Loop semua validation errors dan masukkan ke map
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();     // Nama field (fullName, email, etc)
            String errorMessage = error.getDefaultMessage();        // Error message dari annotation
            errors.put(fieldName, errorMessage);
        });

        // Buat response object yang rapi
        ValidationErrorResponse errorResponse = new ValidationErrorResponse(
            "Validation failed",                    // Message utama
            "INPUT_VALIDATION_ERROR",              // Error code untuk frontend
            errors,                                // Detail errors per field
            LocalDateTime.now()                    // Timestamp kapan error terjadi
        );

        // Return HTTP 400 Bad Request dengan error details
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Handle File Upload Errors
     *
     * Ketika terjadi error saat upload file (contoh: file terlalu besar,
     * format tidak valid), FileStorageService throw FileUploadException.
     * Method ini akan handle dan convert jadi response yang user-friendly.
     *
     * @param ex FileUploadException dari file operations
     * @return ResponseEntity dengan error message
     */
    @ExceptionHandler(FileUploadException.class)
    public ResponseEntity<ErrorResponse> handleFileUploadException(FileUploadException ex) {

        // Buat response object untuk file upload error
        ErrorResponse errorResponse = new ErrorResponse(
            ex.getMessage(),                       // Error message (e.g., "File size exceeds 5 MB")
            "FILE_UPLOAD_ERROR",                  // Error code untuk frontend
            LocalDateTime.now()                   // Timestamp
        );

        // Return HTTP 400 Bad Request
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Handle Gallery Photo Not Found (404)
     *
     * Ketika user coba akses foto yang tidak ada di database,
     * GalleryService throw GalleryNotFoundException.
     * Method ini return 404 Not Found ke frontend.
     *
     * Example use case:
     * - GET /api/gallery/photo/999 → Photo ID 999 tidak ada
     * - PUT /api/gallery/photo/999 → Cannot update non-existent photo
     * - DELETE /api/gallery/photo/999 → Cannot delete non-existent photo
     *
     * @param ex GalleryNotFoundException dari service layer
     * @return ResponseEntity dengan 404 status dan error message
     */
    @ExceptionHandler(GalleryNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleGalleryNotFoundException(GalleryNotFoundException ex) {

        ErrorResponse errorResponse = new ErrorResponse(
            ex.getMessage(),                       // Error message (e.g., "Photo not found with ID: 123")
            "GALLERY_NOT_FOUND",                  // Error code untuk frontend
            LocalDateTime.now()                   // Timestamp
        );

        // Return HTTP 404 Not Found
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    /**
     * Handle Unauthorized Gallery Access (403)
     *
     * Ketika authenticated user coba akses foto yang tidak boleh
     * (contoh: private photo milik user lain, edit photo milik user lain),
     * GalleryService throw UnauthorizedGalleryAccessException.
     * Method ini return 403 Forbidden ke frontend.
     *
     * Example use cases:
     * - User B coba lihat private photo User A → 403
     * - User B coba edit photo User A → 403
     * - User B coba delete photo User A → 403
     * - User B coba toggle privacy photo User A → 403
     *
     * Note: 403 berbeda dengan 401
     * - 401 Unauthorized = Belum login (no JWT token) → handled by Spring Security
     * - 403 Forbidden = Sudah login tapi tidak punya permission → handled by this method
     *
     * @param ex UnauthorizedGalleryAccessException dari service layer
     * @return ResponseEntity dengan 403 status dan error message
     */
    @ExceptionHandler(UnauthorizedGalleryAccessException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorizedGalleryAccess(UnauthorizedGalleryAccessException ex) {

        ErrorResponse errorResponse = new ErrorResponse(
            ex.getMessage(),                       // Error message (e.g., "You don't have permission to access this photo")
            "GALLERY_UNAUTHORIZED",               // Error code untuk frontend
            LocalDateTime.now()                   // Timestamp
        );

        // Return HTTP 403 Forbidden
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
    }

    /**
     * Handle General Gallery Exceptions (400)
     *
     * Ketika terjadi error umum di gallery operations
     * (contoh: file upload failed, file too large, invalid format),
     * GalleryService throw GalleryException.
     * Method ini return 400 Bad Request ke frontend.
     *
     * Example use cases:
     * - File size exceeds 5MB → 400
     * - File format tidak valid (bukan image) → 400
     * - File upload failed (disk full, IO error) → 400
     * - File validation failed → 400
     *
     * Note: Handler ini harus SEBELUM RuntimeException handler
     * karena GalleryException extends RuntimeException.
     * Spring akan cek dari yang paling specific ke general.
     *
     * @param ex GalleryException dari service layer
     * @return ResponseEntity dengan 400 status dan error message
     */
    @ExceptionHandler(GalleryException.class)
    public ResponseEntity<ErrorResponse> handleGalleryException(GalleryException ex) {

        ErrorResponse errorResponse = new ErrorResponse(
            ex.getMessage(),                       // Error message (e.g., "File size exceeds 5MB")
            "GALLERY_ERROR",                      // Error code untuk frontend
            LocalDateTime.now()                   // Timestamp
        );

        // Return HTTP 400 Bad Request
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Handle Business Logic Errors (RuntimeException)
     *
     * Ketika terjadi error di Service layer (contoh: email sudah terdaftar),
     * Service throw RuntimeException. Method ini akan handle dan convert
     * jadi response yang rapi.
     *
     * IMPORTANT: Handler ini harus SETELAH specific exception handlers
     * (GalleryException, GalleryNotFoundException, UnauthorizedGalleryAccessException)
     * karena semua gallery exceptions extend RuntimeException.
     * Spring akan cek dari specific ke general (polymorphism!).
     *
     * @param ex RuntimeException dari business logic
     * @return ResponseEntity dengan error message
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {

        // Buat response object untuk business logic error
        ErrorResponse errorResponse = new ErrorResponse(
            ex.getMessage(),                       // Error message dari service
            "BUSINESS_LOGIC_ERROR",               // Error code
            LocalDateTime.now()                   // Timestamp
        );

        // Return HTTP 400 Bad Request
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Handle General Exceptions (fallback)
     *
     * Untuk semua error lain yang tidak di-handle khusus.
     * Seperti "catch-all" safety net.
     *
     * @param ex Exception apapun yang tidak di-handle method lain
     * @return ResponseEntity dengan generic error message
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {

        ErrorResponse errorResponse = new ErrorResponse(
            "An unexpected error occurred",        // Generic message (jangan expose detail internal)
            "INTERNAL_SERVER_ERROR",              // Error code
            LocalDateTime.now()                   // Timestamp
        );

        // Log error for debugging (tapi jangan expose ke frontend)
        System.err.println("Unexpected error: " + ex.getMessage());
        ex.printStackTrace();

        // Return HTTP 500 Internal Server Error
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}