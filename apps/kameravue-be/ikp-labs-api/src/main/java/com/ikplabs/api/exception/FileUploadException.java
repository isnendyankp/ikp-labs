package com.ikplabs.api.exception;

/**
 * FileUploadException - Custom exception untuk file upload errors
 *
 * ANALOGI SEDERHANA:
 * ==================
 * FileUploadException seperti "Alarm Peringatan di Gudang Foto":
 *
 * Saat petugas gudang (FileStorageService) menemukan masalah:
 * - File terlalu besar → ALARM! "File size exceeds limit!"
 * - Format tidak valid → ALARM! "Invalid file type!"
 * - Gagal save file → ALARM! "Could not save file!"
 *
 * Exception ini membuat error handling lebih jelas dan terorganisir.
 *
 * MENGAPA PERLU CUSTOM EXCEPTION?
 * ================================
 *
 * 1. Clarity (Kejelasan):
 *    - Exception name menjelaskan masalah: "FileUploadException"
 *    - Bukan generic "RuntimeException" atau "Exception"
 *    - Developer langsung tahu error dari file upload
 *
 * 2. Specific Handling (Penanganan Spesifik):
 *    - GlobalExceptionHandler bisa catch FileUploadException
 *    - Return HTTP 400 Bad Request untuk file upload errors
 *    - Different handling untuk different exception types
 *
 * 3. Error Messages (Pesan Error):
 *    - Custom message untuk setiap error scenario
 *    - User-friendly error messages
 *    - Easy debugging untuk developer
 *
 * 4. Best Practice:
 *    - Separate business errors dari system errors
 *    - Follow Spring Boot exception handling pattern
 *    - Professional error handling architecture
 *
 * KAPAN EXCEPTION INI DILEMPAR?
 * ==============================
 *
 * Scenario 1: File Size Too Large
 * --------------------------------
 * throw new FileUploadException("File size exceeds maximum limit of 5 MB");
 *
 * Scenario 2: Invalid File Type
 * ------------------------------
 * throw new FileUploadException("Only image files are allowed");
 *
 * Scenario 3: Invalid Extension
 * ------------------------------
 * throw new FileUploadException("Invalid file extension. Allowed: jpg, png, gif, webp");
 *
 * Scenario 4: File Save Failed
 * ----------------------------
 * throw new FileUploadException("Could not save file. Please try again.");
 *
 * Scenario 5: File Not Found
 * ---------------------------
 * throw new FileUploadException("Profile picture not found");
 *
 * BAGAIMANA EXCEPTION INI DI-HANDLE?
 * ===================================
 *
 * GlobalExceptionHandler (sudah ada) akan catch exception ini:
 *
 * @ExceptionHandler(FileUploadException.class)
 * public ResponseEntity<ErrorResponse> handleFileUploadException(FileUploadException ex) {
 *     ErrorResponse error = new ErrorResponse(
 *         "FILE_UPLOAD_ERROR",
 *         ex.getMessage()
 *     );
 *     return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
 * }
 *
 * Response ke frontend:
 * {
 *   "errorCode": "FILE_UPLOAD_ERROR",
 *   "message": "File size exceeds maximum limit of 5 MB",
 *   "timestamp": "2025-10-27T14:30:00"
 * }
 *
 * @RuntimeException = Unchecked exception (tidak wajib try-catch)
 */
public class FileUploadException extends RuntimeException {

    /**
     * Constructor dengan message
     *
     * Contoh usage:
     * throw new FileUploadException("File too large");
     *
     * @param message Error message yang akan ditampilkan
     */
    public FileUploadException(String message) {
        super(message);
    }

    /**
     * Constructor dengan message dan cause
     *
     * Digunakan saat ada underlying exception (e.g., IOException)
     *
     * Contoh usage:
     * try {
     *     Files.copy(source, destination);
     * } catch (IOException e) {
     *     throw new FileUploadException("Could not save file", e);
     * }
     *
     * Benefit: Error chain preserved (bisa trace root cause)
     *
     * @param message Error message
     * @param cause Original exception yang menyebabkan error
     */
    public FileUploadException(String message, Throwable cause) {
        super(message, cause);
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. Extends RuntimeException vs Exception:
     *    - RuntimeException = Unchecked (tidak wajib declare/catch)
     *    - Exception = Checked (wajib declare dengan throws atau try-catch)
     *    - Kita pakai RuntimeException karena file upload error adalah business error,
     *      bukan system error yang HARUS di-handle
     *
     * 2. super(message):
     *    - Panggil constructor parent class (RuntimeException)
     *    - Pass message ke parent untuk error message handling
     *
     * 3. super(message, cause):
     *    - Pass message DAN original exception ke parent
     *    - Preserves error chain untuk debugging
     *    - Stack trace tetap lengkap
     *
     * 4. Kapan pakai constructor mana?
     *    - FileUploadException(message):
     *      * Validation errors (size, type, extension)
     *      * Business logic errors
     *      * User-facing errors
     *
     *    - FileUploadException(message, cause):
     *      * Wrapping IOException
     *      * System errors (disk full, permission denied)
     *      * Technical errors
     *
     * 5. Error Handling Flow:
     *
     *    FileStorageService
     *         ↓ (throw FileUploadException)
     *    Controller catch or let it propagate
     *         ↓
     *    GlobalExceptionHandler
     *         ↓ (convert to ErrorResponse)
     *    HTTP Response
     *         ↓
     *    Frontend receives error JSON
     *
     * 6. Example Usage Comparison:
     *
     *    ❌ Without Custom Exception:
     *    throw new RuntimeException("File too large");
     *    → Generic error, tidak jelas
     *    → Hard to handle specifically
     *
     *    ✅ With Custom Exception:
     *    throw new FileUploadException("File size exceeds 5 MB");
     *    → Clear error type
     *    → Easy to handle in GlobalExceptionHandler
     *    → Better user experience
     *
     * 7. Benefits Recap:
     *    ✅ Type-safe error handling
     *    ✅ Clear error semantics
     *    ✅ Easy to catch and handle specifically
     *    ✅ Professional error architecture
     *    ✅ User-friendly error messages
     *    ✅ Easy debugging with error chain
     */
}
