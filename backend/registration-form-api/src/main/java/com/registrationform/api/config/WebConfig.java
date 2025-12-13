package com.registrationform.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * WebConfig - Spring MVC Configuration untuk static resources
 *
 * ANALOGI SEDERHANA:
 * ==================
 * WebConfig seperti "Peta/Directory Mall":
 *
 * Customer (Frontend) tanya: "Mana foto di /uploads/profiles/user-83.jpg?"
 * Peta (WebConfig) jawab: "Oh, itu ada di folder uploads/profiles/ di disk server"
 * Customer bisa akses foto via URL
 *
 * Tanpa WebConfig:
 * - Frontend request: http://localhost:8081/uploads/profiles/user-83.jpg
 * - Server: 404 Not Found (tidak tahu dimana filenya)
 *
 * Dengan WebConfig:
 * - Frontend request: http://localhost:8081/uploads/profiles/user-83.jpg
 * - Server: "OK, saya serve dari folder uploads/profiles/"
 * - File terkirim ke browser
 *
 * MENGAPA PERLU STATIC RESOURCE HANDLER?
 * =======================================
 *
 * 1. Serve Uploaded Files:
 *    - File di folder uploads/ perlu bisa diakses via HTTP
 *    - Tanpa handler, file tidak bisa diakses
 *    - Handler mapping URL ke folder di disk
 *
 * 2. Separate dari API:
 *    - API endpoint: /api/profile/upload-picture (controller handle)
 *    - Static file: /uploads/profiles/user-83.jpg (resource handler serve)
 *    - Clear separation of concerns
 *
 * 3. Performance:
 *    - Static file serving optimized by Spring
 *    - No controller overhead
 *    - Direct file streaming
 *
 * 4. Security:
 *    - Can add authentication check (via SecurityConfig)
 *    - Can add CORS rules
 *    - Control access to uploaded files
 *
 * BAGAIMANA CARA KERJANYA?
 * =========================
 *
 * Mapping Configuration:
 * ----------------------
 * URL Pattern: /uploads/**
 * ↓ maps to ↓
 * Disk Location: file:uploads/
 *
 * Example:
 * Request: http://localhost:8081/uploads/profiles/user-83.jpg
 * ↓
 * Handler check: Does URL match /uploads/**? YES!
 * ↓
 * Look for file at: uploads/profiles/user-83.jpg (relative to app root)
 * ↓
 * File found? → Stream file to browser
 * File not found? → 404 Not Found
 *
 * KONFIGURASI:
 * ============
 *
 * addResourceHandler("/uploads/**")
 * - URL pattern yang akan di-handle
 * - /** means any path after /uploads/
 * - Examples: /uploads/profiles/user-1.jpg, /uploads/profiles/user-83.png
 *
 * addResourceLocations("file:uploads/")
 * - Lokasi folder di disk
 * - "file:" prefix indicates filesystem location (not classpath)
 * - Relative to application root directory
 * - Trailing slash important!
 *
 * @Configuration = Spring configuration class
 * WebMvcConfigurer = Interface untuk customize Spring MVC
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * Upload directory from application.properties
     * Default: "uploads/profiles/"
     *
     * Note: For resource handler, we need parent directory
     * So we use "uploads/" not "uploads/profiles/"
     */
    @Value("${file.upload.directory:uploads/profiles/}")
    private String uploadDirectory;

    /**
     * Configure Resource Handlers
     *
     * Method ini dipanggil otomatis oleh Spring saat startup.
     * Kita override untuk add custom resource handler.
     *
     * FLOW KONFIGURASI:
     * 1. Spring boot startup
     * 2. Scan @Configuration classes
     * 3. Find WebMvcConfigurer implementations
     * 4. Call addResourceHandlers() method
     * 5. Register our custom handlers
     * 6. Static files now accessible via HTTP
     *
     * @param registry ResourceHandlerRegistry untuk register handlers
     */
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // STATIC RESOURCE HANDLER FOR UPLOADED FILES
        // ==========================================

        // Add resource handler untuk /uploads/** URLs
        registry.addResourceHandler("/uploads/**")
                // Map ke folder uploads/ di disk
                .addResourceLocations("file:uploads/")
                // Enable caching (browser cache files for performance)
                .setCachePeriod(3600); // 1 hour = 3600 seconds

        System.out.println("✅ Static resource handler configured:");
        System.out.println("   URL pattern: /uploads/**");
        System.out.println("   File location: file:uploads/");
        System.out.println("   Cache period: 3600 seconds (1 hour)");

        // NOTES:
        // ------
        // 1. URL pattern /uploads/** will match:
        //    - /uploads/profiles/user-1.jpg ✅
        //    - /uploads/profiles/user-83.png ✅
        //    - /uploads/documents/doc.pdf ✅ (future)
        //    - /uploads/any/nested/path/file.jpg ✅
        //
        // 2. File location "file:uploads/" means:
        //    - Look in "uploads/" folder relative to application root
        //    - "file:" prefix = filesystem (not classpath)
        //    - Trailing slash important!
        //
        // 3. Cache period 3600 seconds:
        //    - Browser cache file for 1 hour
        //    - Reduce server load (no re-download for 1 hour)
        //    - Good for profile pictures (not changed frequently)
        //    - Can be adjusted based on needs
        //
        // 4. Security consideration:
        //    - Public access by default (anyone can access if they know URL)
        //    - For authenticated-only access, configure in SecurityConfig
        //    - Example: .requestMatchers("/uploads/**").authenticated()
        //
        // 5. Alternative for production:
        //    - Can use CDN (CloudFront, CloudFlare)
        //    - Can use object storage (S3, Google Cloud Storage)
        //    - Just change addResourceLocations to CDN URL
        //    - No code change needed in controllers!
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. Kenapa "file:uploads/" bukan "classpath:uploads/"?
     *    - "classpath:" = Files di JAR (resources folder)
     *    - "file:" = Files di filesystem (outside JAR)
     *    - Uploaded files ada di filesystem, bukan dalam JAR
     *    - Jadi pakai "file:" prefix
     *
     * 2. Kenapa "uploads/" bukan "uploads/profiles/"?
     *    - Lebih flexible untuk future use
     *    - Bisa serve files dari uploads/profiles/, uploads/documents/, etc
     *    - Single handler untuk semua subdirectories
     *
     * 3. Relative vs Absolute Path:
     *    - "file:uploads/" = Relative to application root
     *    - "file:/absolute/path/uploads/" = Absolute path
     *    - Relative path more portable (works on any machine)
     *
     * 4. URL Path vs File Path:
     *    - URL: /uploads/profiles/user-83.jpg (with forward slash)
     *    - File: uploads/profiles/user-83.jpg (relative path)
     *    - Handler maps URL path to file path automatically
     *
     * 5. Cache Control:
     *    - setCachePeriod(3600) = Cache for 1 hour
     *    - Browser won't re-request file for 1 hour
     *    - Good for static content (profile pictures)
     *    - Bad for frequently changing content
     *
     * 6. Access Control:
     *    - By default: Public access (anyone with URL can access)
     *    - For restricted access: Configure in SecurityConfig
     *    - Example:
     *      .requestMatchers("/uploads/**").authenticated()
     *      → Only logged-in users can access
     *
     * 7. CORS:
     *    - Frontend (localhost:3002) can access backend (localhost:8081)
     *    - Already configured in CorsConfig.java
     *    - Static files follow same CORS rules
     *
     * 8. Error Handling:
     *    - File not found → 404 Not Found
     *    - Permission denied → 403 Forbidden
     *    - Server error → 500 Internal Server Error
     *    - Automatic by Spring Boot
     *
     * 9. Production Considerations:
     *    - CDN recommended for scalability
     *    - Object storage (S3) for reliability
     *    - Multiple servers = shared storage needed
     *    - This config works for single-server deployment
     *
     * 10. Testing:
     *     - Upload file via POST /api/profile/upload-picture
     *     - Response: {"pictureUrl": "/uploads/profiles/user-83.jpg"}
     *     - Test access: http://localhost:8081/uploads/profiles/user-83.jpg
     *     - Should display image in browser
     *
     * 11. Frontend Usage:
     *     ```javascript
     *     // After upload success
     *     const imageUrl = `${baseUrl}${response.pictureUrl}`;
     *     // imageUrl = "http://localhost:8081/uploads/profiles/user-83.jpg"
     *
     *     // Display in img tag
     *     <img src={imageUrl} alt="Profile" />
     *     ```
     *
     * 12. Migration to Cloud Storage:
     *     Current (Local):
     *     .addResourceLocations("file:uploads/")
     *
     *     Future (S3):
     *     - No change in WebConfig (remove handler)
     *     - Change database paths to S3 URLs
     *     - FileStorageService upload to S3 instead of local
     *     - pictureUrl = "https://bucket.s3.amazonaws.com/user-83.jpg"
     */
}
