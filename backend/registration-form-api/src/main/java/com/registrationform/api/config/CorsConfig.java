package com.registrationform.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * CorsConfig - Cross-Origin Resource Sharing Configuration
 *
 * ANALOGI SEDERHANA:
 * ==================
 * CORS seperti "Aturan Keamanan Kantor untuk Tamu":
 *
 * Bayangkan kantor backend di gedung A (localhost:8081)
 * dan kantor frontend di gedung B (localhost:3002 - custom port IKP-Labs).
 *
 * Tanpa CORS: "Maaf, tidak bisa terima panggilan dari gedung lain"
 * Dengan CORS: "Oke, gedung B boleh hubungi gedung A untuk keperluan tertentu"
 *
 * MENGAPA PERLU CORS:
 * ===================
 * Browser punya security policy "Same-Origin Policy":
 * - Frontend di http://localhost:3002
 * - Backend di http://localhost:8081
 * - Ini "different origin" → blocked by browser
 *
 * CORS Configuration mengizinkan "cross-origin requests"
 *
 * KONFIGURASI UNTUK STEP 5.1:
 * ============================
 * - Allow frontend port 3001
 * - Allow common HTTP methods (GET, POST, PUT, DELETE)
 * - Allow headers yang dibutuhkan (Authorization, Content-Type)
 * - Support preflight requests (OPTIONS)
 */
@Configuration
public class CorsConfig {

    /**
     * CORS Configuration Source - Aturan komunikasi antar domain
     * ============================================================
     *
     * Konfigurasi ini memungkinkan frontend React (port 3001)
     * berkomunikasi dengan backend Spring Boot (port 8081)
     *
     * @return CorsConfigurationSource dengan aturan CORS
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // === ALLOWED ORIGINS ===
        // Frontend yang diizinkan akses ke backend
        // Step 5.1: Configure untuk frontend port 3001, 3000, 3003, 3004, dan 3005
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3002",     // Frontend development server (IKP-Labs custom port)
            "http://127.0.0.1:3001",     // Alternative localhost format
            "http://localhost:3000",     // Standard React port (for other projects)
            "http://localhost:3003",     // Auto-assigned port by Next.js (current)
            "http://localhost:3004",     // Auto-assigned port by Next.js
            "http://localhost:3005"      // Auto-assigned port by Next.js
        ));

        // === ALLOWED METHODS ===
        // HTTP methods yang diizinkan dari frontend
        configuration.setAllowedMethods(Arrays.asList(
            "GET",          // Read data
            "POST",         // Create data (registration, login)
            "PUT",          // Update data (profile update)
            "DELETE",       // Delete data (future features)
            "OPTIONS"       // Preflight requests
        ));

        // === ALLOWED HEADERS ===
        // Headers yang boleh dikirim frontend ke backend
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",        // JWT Bearer token
            "Content-Type",         // application/json
            "Accept",              // Response format
            "Origin",              // Request origin
            "Access-Control-Request-Method",    // Preflight
            "Access-Control-Request-Headers",   // Preflight
            "X-Requested-With"     // AJAX identifier
        ));

        // === EXPOSED HEADERS ===
        // Headers yang frontend boleh baca dari response
        configuration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials",
            "Authorization"
        ));

        // === CREDENTIALS ===
        // Allow cookies dan authentication headers
        // Penting untuk JWT authentication
        configuration.setAllowCredentials(true);

        // === MAX AGE ===
        // Berapa lama browser cache preflight response (seconds)
        // 3600 = 1 hour
        configuration.setMaxAge(3600L);

        // === APPLY TO ALL PATHS ===
        // Register configuration untuk semua endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. Preflight Requests:
     *    Browser kirim OPTIONS request dulu sebelum actual request
     *    untuk cek apakah cross-origin request diizinkan
     *
     * 2. Credentials = true:
     *    Diperlukan untuk kirim Authorization header dengan JWT token
     *    Tanpa ini, frontend tidak bisa kirim Bearer token
     *
     * 3. Wildcard vs Specific Origins:
     *    - "*" = Allow semua domain (tidak aman untuk production)
     *    - Specific URLs = Aman, hanya domain tertentu yang diizinkan
     *
     * 4. Development vs Production:
     *    - Development: localhost ports
     *    - Production: actual domain names
     *
     * 5. Common CORS Errors:
     *    - "blocked by CORS policy": Origin tidak di-allow
     *    - "preflight failed": OPTIONS request gagal
     *    - "credentials not allowed": setAllowCredentials(false)
     *
     * 6. Testing CORS:
     *    - Browser DevTools → Network tab
     *    - Check for preflight OPTIONS requests
     *    - Check response headers: Access-Control-Allow-*
     *
     * 7. Integration dengan Security:
     *    - CORS filter berjalan sebelum Security filter
     *    - SecurityConfig.java akan auto-detect CorsConfigurationSource
     *    - Tidak perlu modifikasi SecurityConfig tambahan
     *
     * 8. Frontend Integration (Step 5.2):
     *    - Fetch API: mode: 'cors', credentials: 'include'
     *    - Axios: withCredentials: true
     *    - Headers: Authorization: 'Bearer ' + token
     */
}