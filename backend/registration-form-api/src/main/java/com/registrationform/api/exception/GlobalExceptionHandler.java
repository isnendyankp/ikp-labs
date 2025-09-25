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
     * Handle Business Logic Errors (RuntimeException)
     *
     * Ketika terjadi error di Service layer (contoh: email sudah terdaftar),
     * Service throw RuntimeException. Method ini akan handle dan convert
     * jadi response yang rapi.
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