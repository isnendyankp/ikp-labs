package com.registrationform.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;

/**
 * FileStorageService - Service untuk handle file upload operations
 *
 * ANALOGI SEDERHANA:
 * ==================
 * FileStorageService seperti "Petugas Gudang Foto":
 *
 * 1. TERIMA FOTO dari customer (user upload)
 * 2. CEK FOTO valid tidak (size, type, format)
 * 3. SIMPAN FOTO di rak gudang (uploads/profiles/)
 * 4. BERI LABEL foto dengan nomor customer (user-{userId}.jpg)
 * 5. KASIH TAU customer: "Foto kamu di rak nomor X"
 *
 * Tanggung Jawab Service Ini:
 * 1. Validasi file (size, type, extension)
 * 2. Generate safe filename (prevent security issues)
 * 3. Save file ke disk (uploads/profiles/)
 * 4. Delete old file jika user upload baru
 * 5. Return file path untuk disimpan di database
 *
 * @Service = Spring otomatis buat instance class ini (singleton)
 */
@Service
public class FileStorageService {

    /**
     * Upload directory - dari application.properties
     * Default: "uploads/profiles/"
     */
    @Value("${file.upload.directory:uploads/profiles/}")
    private String uploadDirectory;

    /**
     * Base URL untuk serve files - dari application.properties
     * Default: "/uploads/profiles/"
     */
    @Value("${file.upload.base-url:/uploads/profiles/}")
    private String baseUrl;

    /**
     * Path object untuk upload directory
     * Diinisialisasi di init() method
     */
    private Path uploadPath;

    /**
     * Allowed image extensions
     * Hanya format gambar yang umum dan aman
     */
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
        "jpg", "jpeg", "png", "gif", "webp"
    );

    /**
     * Maximum file size in bytes (5MB)
     * Sesuai dengan config di application.properties
     */
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    /**
     * Initialize upload directory on service creation
     *
     * @PostConstruct = Method ini dipanggil otomatis setelah Spring buat instance
     * Seperti constructor, tapi jalan setelah @Value di-inject
     *
     * @throws RuntimeException jika gagal create directory
     */
    @PostConstruct
    public void init() {
        try {
            // Convert string path ke Path object
            uploadPath = Paths.get(uploadDirectory);

            // Create directory kalau belum ada
            // mkdirs = create parent directories juga kalau perlu
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("✅ Upload directory created: " + uploadPath.toAbsolutePath());
            } else {
                System.out.println("✅ Upload directory exists: " + uploadPath.toAbsolutePath());
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory: " + uploadDirectory, e);
        }
    }

    /**
     * Save profile picture untuk user
     *
     * FLOW PROSES:
     * 1. Validasi file (null check, size, type, extension)
     * 2. Generate safe filename: user-{userId}.{extension}
     * 3. Delete old file jika ada
     * 4. Save new file ke disk
     * 5. Return path untuk disimpan di database
     *
     * @param file File yang diupload dari frontend
     * @param userId ID user (untuk generate filename)
     * @return File path untuk disimpan di database (e.g., "/uploads/profiles/user-83.jpg")
     * @throws IOException jika gagal save file
     * @throws IllegalArgumentException jika validasi gagal
     */
    public String saveProfilePicture(MultipartFile file, Long userId) throws IOException {
        // STEP 1: VALIDASI FILE
        validateFile(file);

        // STEP 2: GENERATE SAFE FILENAME
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String safeFilename = "user-" + userId + "." + fileExtension;

        // STEP 3: DELETE OLD FILE (jika ada)
        deleteOldProfilePicture(userId);

        // STEP 4: SAVE NEW FILE
        Path destinationPath = uploadPath.resolve(safeFilename);
        Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("✅ Profile picture saved: " + safeFilename + " for user " + userId);

        // STEP 5: RETURN PATH (untuk disimpan di database)
        return baseUrl + safeFilename;
    }

    /**
     * Delete profile picture untuk user
     *
     * Digunakan saat:
     * 1. User delete foto sendiri
     * 2. User upload foto baru (hapus foto lama)
     *
     * @param userId ID user
     * @throws IOException jika gagal delete file
     */
    public void deleteProfilePicture(Long userId) throws IOException {
        deleteOldProfilePicture(userId);
        System.out.println("✅ Profile picture deleted for user " + userId);
    }

    /**
     * Delete old profile picture files untuk user
     *
     * Cek semua possible extensions dan delete jika ada.
     * Karena user bisa upload jpg terus diganti png, kita harus cek semua.
     *
     * @param userId ID user
     * @throws IOException jika gagal delete file
     */
    private void deleteOldProfilePicture(Long userId) throws IOException {
        // Check dan delete untuk setiap possible extension
        for (String extension : ALLOWED_EXTENSIONS) {
            String filename = "user-" + userId + "." + extension;
            Path filePath = uploadPath.resolve(filename);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                System.out.println("🗑️  Deleted old profile picture: " + filename);
            }
        }
    }

    /**
     * Validasi uploaded file
     *
     * Checks:
     * 1. File tidak null
     * 2. File tidak empty
     * 3. File size tidak melebihi limit (5MB)
     * 4. File type adalah image
     * 5. File extension valid
     *
     * @param file File yang akan divalidasi
     * @throws IllegalArgumentException jika validasi gagal
     */
    private void validateFile(MultipartFile file) {
        // Check 1: File null atau empty
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        // Check 2: File size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                String.format("File size exceeds maximum limit of %d MB",
                    MAX_FILE_SIZE / (1024 * 1024))
            );
        }

        // Check 3: Content type (MIME type)
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Check 4: File extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) {
            throw new IllegalArgumentException("Invalid filename");
        }

        String extension = getFileExtension(originalFilename);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException(
                "Invalid file extension. Allowed: " + String.join(", ", ALLOWED_EXTENSIONS)
            );
        }
    }

    /**
     * Extract file extension dari filename
     *
     * Example:
     * - "photo.jpg" → "jpg"
     * - "myimage.PNG" → "png" (lowercase)
     * - "file.with.dots.jpeg" → "jpeg"
     *
     * @param filename Original filename dari upload
     * @return File extension (lowercase)
     * @throws IllegalArgumentException jika tidak ada extension
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            throw new IllegalArgumentException("Filename cannot be empty");
        }

        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == filename.length() - 1) {
            throw new IllegalArgumentException("File has no extension");
        }

        return filename.substring(lastDotIndex + 1).toLowerCase();
    }

    /**
     * Get full file path untuk user
     *
     * Utility method untuk get path jika perlu.
     * Saat ini tidak dipakai, tapi berguna untuk debugging.
     *
     * @param userId ID user
     * @param extension File extension
     * @return Full file path
     */
    public Path getFilePath(Long userId, String extension) {
        String filename = "user-" + userId + "." + extension;
        return uploadPath.resolve(filename);
    }

    // ============================================================
    // GALLERY PHOTO METHODS (NEW - for multi-photo gallery)
    // ============================================================

    /**
     * Save gallery photo untuk user
     *
     * PERBEDAAN dengan saveProfilePicture:
     * - Profile picture: 1 foto per user (user-{userId}.jpg)
     * - Gallery photo: banyak foto per user (photo-{photoId}-{timestamp}.jpg)
     * - Directory: uploads/gallery/user-{userId}/ (user subdirectory)
     * - Filename: includes photoId and timestamp for uniqueness
     *
     * FLOW PROSES:
     * 1. Validasi file (same as profile picture)
     * 2. Create user subdirectory if not exists
     * 3. Generate unique filename: photo-{photoId}-{timestamp}.{extension}
     * 4. Save file to: uploads/gallery/user-{userId}/
     * 5. Return relative path for database
     *
     * @param file File yang diupload dari frontend
     * @param userId ID user (untuk subdirectory)
     * @param photoId ID photo dari database (untuk filename)
     * @return Relative path untuk disimpan di database (e.g., "gallery/user-83/photo-156-1731238845123.jpg")
     * @throws IOException jika gagal save file
     * @throws IllegalArgumentException jika validasi gagal
     */
    public String saveGalleryPhoto(MultipartFile file, Long userId, Long photoId) throws IOException {
        // STEP 1: VALIDASI FILE (reuse existing validation)
        validateFile(file);

        // STEP 2: CREATE USER SUBDIRECTORY
        Path galleryBasePath = Paths.get("uploads/gallery");
        Path userGalleryPath = galleryBasePath.resolve("user-" + userId);

        // Create directories if not exist
        if (!Files.exists(userGalleryPath)) {
            Files.createDirectories(userGalleryPath);
            System.out.println("✅ Created user gallery directory: " + userGalleryPath.toAbsolutePath());
        }

        // STEP 3: GENERATE UNIQUE FILENAME
        String fileExtension = getFileExtension(file.getOriginalFilename());
        long timestamp = System.currentTimeMillis();
        String safeFilename = String.format("photo-%d-%d.%s", photoId, timestamp, fileExtension);

        // STEP 4: SAVE FILE
        Path destinationPath = userGalleryPath.resolve(safeFilename);
        Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);

        System.out.println("✅ Gallery photo saved: " + safeFilename + " for user " + userId);

        // STEP 5: RETURN RELATIVE PATH (for database storage)
        // Format: gallery/user-{userId}/photo-{photoId}-{timestamp}.{ext}
        return String.format("gallery/user-%d/%s", userId, safeFilename);
    }

    /**
     * Delete gallery photo untuk user
     *
     * Delete file dari disk berdasarkan userId, photoId, dan extension.
     *
     * Use case:
     * - User deletes photo dari gallery
     * - Photo cascade deleted when user deleted
     *
     * @param userId ID user (untuk locate subdirectory)
     * @param photoId ID photo (untuk locate specific file)
     * @param extension File extension (jpg, png, etc.)
     * @throws IOException jika gagal delete file
     */
    public void deleteGalleryPhoto(Long userId, Long photoId, String extension) throws IOException {
        // Build path to user's gallery directory
        Path userGalleryPath = Paths.get("uploads/gallery/user-" + userId);

        // Pattern: photo-{photoId}-*.{extension}
        // Example: photo-156-1731238845123.jpg
        // We need to find file that starts with photo-{photoId}- and ends with .{extension}

        if (Files.exists(userGalleryPath)) {
            // List all files in user's gallery directory
            Files.list(userGalleryPath)
                .filter(path -> {
                    String filename = path.getFileName().toString();
                    // Match: photo-{photoId}-{anything}.{extension}
                    String pattern = String.format("photo-%d-.*\\.%s", photoId, extension);
                    return filename.matches(pattern);
                })
                .forEach(path -> {
                    try {
                        Files.delete(path);
                        System.out.println("🗑️  Deleted gallery photo: " + path.getFileName());
                    } catch (IOException e) {
                        System.err.println("❌ Failed to delete file: " + path.getFileName());
                    }
                });
        }
    }

    /**
     * Validate gallery photo
     *
     * Same validation as profile picture.
     * Extracted as public method untuk bisa dipanggil dari GalleryService.
     *
     * Validation checks:
     * 1. File not null/empty
     * 2. File size ≤ 5MB
     * 3. Content type is image/*
     * 4. Extension is allowed (jpg, jpeg, png, gif, webp)
     *
     * @param file File to validate
     * @throws IllegalArgumentException if validation fails
     */
    public void validateGalleryPhoto(MultipartFile file) {
        // Reuse existing validation method
        validateFile(file);
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * PROFILE PICTURE vs GALLERY PHOTO:
     * ===================================
     *
     * Profile Picture (existing):
     * - Directory: uploads/profiles/
     * - Filename: user-{userId}.jpg
     * - One per user (replace old when upload new)
     * - Simple, predictable
     *
     * Gallery Photo (new):
     * - Directory: uploads/gallery/user-{userId}/
     * - Filename: photo-{photoId}-{timestamp}.jpg
     * - Multiple per user (no replacement)
     * - User subdirectories for organization
     *
     * WHY USER SUBDIRECTORIES?
     * ========================
     * 1. Organization: Easy to find all photos for a user
     * 2. Cleanup: Delete entire directory when user deleted
     * 3. Scalability: Avoid one huge directory with thousands of files
     * 4. Security: Isolate users' files
     *
     * WHY PHOTO ID + TIMESTAMP IN FILENAME?
     * ======================================
     * 1. Uniqueness: photoId might repeat across users, timestamp ensures uniqueness
     * 2. Traceability: Can trace back to database record via photoId
     * 3. Sortable: Timestamp allows chronological sorting
     * 4. Debugging: Easy to identify which photo in filesystem
     *
     * FILE DELETION STRATEGY:
     * =======================
     * - Profile picture: Delete all possible extensions (jpg, png, gif, etc.)
     * - Gallery photo: Delete specific file matching photoId + extension
     * - Why different? Profile has predictable name, gallery has timestamp
     *
     * ERROR HANDLING:
     * ===============
     * - Validation errors: IllegalArgumentException (client error)
     * - IO errors: IOException (server error)
     * - Controller catches and returns appropriate HTTP status
     *
     * SECURITY CONSIDERATIONS:
     * ========================
     * 1. No user input in filename (prevent path traversal)
     * 2. Subdirectories by userId (can't access other users' photos)
     * 3. File validation (prevent malicious uploads)
     * 4. Extension whitelist (only safe image formats)
     */
}
