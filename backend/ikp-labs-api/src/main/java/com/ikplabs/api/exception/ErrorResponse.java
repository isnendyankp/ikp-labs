package com.ikplabs.api.exception;

import java.time.LocalDateTime;

/**
 * ErrorResponse - Response object untuk general errors (non-validation)
 *
 * Digunakan untuk business logic errors atau unexpected errors.
 * Seperti surat pemberitahuan dari bank kalau ada masalah dengan account.
 *
 * Example response JSON:
 * {
 *   "message": "Email sudah terdaftar: john@email.com",
 *   "errorCode": "BUSINESS_LOGIC_ERROR",
 *   "timestamp": "2024-09-24T15:30:00"
 * }
 */
public class ErrorResponse {

    /**
     * Error message yang descriptive
     */
    private String message;

    /**
     * Error code untuk kategorisasi error
     */
    private String errorCode;

    /**
     * Timestamp kapan error terjadi
     */
    private LocalDateTime timestamp;

    /**
     * Default Constructor
     */
    public ErrorResponse() {
    }

    /**
     * Constructor dengan parameter
     */
    public ErrorResponse(String message, String errorCode, LocalDateTime timestamp) {
        this.message = message;
        this.errorCode = errorCode;
        this.timestamp = timestamp;
    }

    // Getter dan Setter methods

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

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "ErrorResponse{" +
                "message='" + message + '\'' +
                ", errorCode='" + errorCode + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}