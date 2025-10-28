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

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. Kenapa pakai MultipartFile?
     *    - Spring Boot type untuk handle file upload
     *    - Sudah include metadata (size, type, name)
     *    - Easy to use dengan built-in validation
     *
     * 2. Kenapa filename: user-{userId}.{extension}?
     *    - Unique per user (tidak akan collision)
     *    - Predictable (mudah find/delete)
     *    - Security: tidak pakai user input filename (prevent path traversal)
     *    - Simple: satu user = satu foto
     *
     * 3. Kenapa delete old file?
     *    - User upload baru, foto lama tidak perlu
     *    - Save disk space
     *    - Avoid confusion (cuma ada satu foto per user)
     *
     * 4. Kenapa validasi ketat?
     *    - Security: prevent malicious files
     *    - Performance: prevent huge files
     *    - User experience: catch errors early
     *
     * 5. Path Traversal Prevention:
     *    - TIDAK pakai user input filename
     *    - Generate sendiri: user-{userId}.{extension}
     *    - Tidak mungkin user upload ke parent directory
     *
     * 6. Error Handling Strategy:
     *    - Validation errors: IllegalArgumentException
     *    - IO errors: IOException
     *    - Controller akan catch dan return proper HTTP response
     */
}
