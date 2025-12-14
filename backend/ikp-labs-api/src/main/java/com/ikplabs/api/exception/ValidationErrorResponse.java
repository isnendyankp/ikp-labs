package com.ikplabs.api.exception;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * ValidationErrorResponse - Response object untuk validation errors
 *
 * Ketika user kirim data tidak valid, kita return response yang structured
 * dan user-friendly. Seperti formulir yang di-return ke customer dengan
 * catatan merah di bagian yang salah.
 *
 * Example response JSON:
 * {
 *   "message": "Validation failed",
 *   "errorCode": "INPUT_VALIDATION_ERROR",
 *   "fieldErrors": {
 *     "email": "Please provide a valid email address",
 *     "password": "Password must be at least 8 characters"
 *   },
 *   "timestamp": "2024-09-24T15:30:00"
 * }
 */
public class ValidationErrorResponse {

    /**
     * Message umum untuk validation error
     */
    private String message;

    /**
     * Error code yang bisa di-recognize frontend untuk handling khusus
     */
    private String errorCode;

    /**
     * Map berisi field-specific errors
     * Key = nama field (fullName, email, password)
     * Value = error message untuk field tersebut
     */
    private Map<String, String> fieldErrors;

    /**
     * Timestamp kapan error terjadi
     */
    private LocalDateTime timestamp;

    /**
     * Default Constructor - diperlukan untuk JSON serialization
     */
    public ValidationErrorResponse() {
    }

    /**
     * Constructor dengan semua parameter
     */
    public ValidationErrorResponse(String message, String errorCode, Map<String, String> fieldErrors, LocalDateTime timestamp) {
        this.message = message;
        this.errorCode = errorCode;
        this.fieldErrors = fieldErrors;
        this.timestamp = timestamp;
    }

    // Getter dan Setter methods untuk JSON serialization

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public Map<String, String> getFieldErrors() {
        return fieldErrors;
    }

    public void setFieldErrors(Map<String, String> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "ValidationErrorResponse{" +
                "message='" + message + '\'' +
                ", errorCode='" + errorCode + '\'' +
                ", fieldErrors=" + fieldErrors +
                ", timestamp=" + timestamp +
                '}';
    }
}