package com.ikplabs.api.config;

import com.ikplabs.api.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import jakarta.servlet.http.HttpServletResponse;

/**
 * SecurityConfig - Spring Security Configuration
 *
 * Class ini bertugas untuk:
 * 1. Configure password encoder (BCrypt)
 * 2. Setup security components yang dibutuhkan
 * 3. Menyediakan beans untuk dependency injection
 *
 * @Configuration = Menandai class ini sebagai configuration class
 * Spring akan scan dan load configuration ini saat startup
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * JWT Authentication Filter - Security guard untuk cek token
     * Analogi: Security guard yang cek key card di lift hotel
     */
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * CORS Configuration Source - Aturan komunikasi antar domain
     * Injected dari CorsConfig.java untuk frontend integration
     */
    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    /**
     * Password Encoder Bean - BCrypt
     *
     * BCrypt adalah algoritma hashing password yang sangat aman:
     * - One-way hashing (tidak bisa di-reverse)
     * - Salt otomatis (setiap hash unik meskipun password sama)
     * - Computational expensive (sulit untuk brute force)
     *
     * Contoh:
     * Password: "123456"
     * Hash: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
     *
     * @Bean = Spring akan register method ini sebagai Bean
     * Bean ini bisa di-inject ke class lain dengan @Autowired
     *
     * @return PasswordEncoder instance untuk hash/verify password
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCryptPasswordEncoder dengan strength 12
        // Strength 12 = 2^12 = 4096 rounds (balance antara security vs performance)
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Security Filter Chain - Configure JWT-based authentication
     * =========================================================
     *
     * ANALOGI: "Aturan Keamanan Hotel dengan Key Card System"
     *
     * Setup security seperti hotel dengan key card:
     * 1. Public areas (lobby, restaurant) → semua boleh masuk
     * 2. Private areas (kamar, VIP lounge) → perlu key card
     * 3. Security guard cek key card di setiap lift
     * 4. No session cookie (stateless) → semua info di key card
     *
     * @param http HttpSecurity object untuk konfigurasi
     * @return SecurityFilterChain yang sudah dikonfigurasi
     * @throws Exception jika ada error dalam konfigurasi
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // === DISABLE CSRF ===
            // CSRF protection tidak perlu untuk API dengan JWT
            .csrf(csrf -> csrf.disable())

            // === ENABLE CORS ===
            // Enable CORS dengan configuration dari CorsConfig.java
            // Allows frontend (port 3001) to communicate with backend (port 8081)
            .cors(cors -> cors.configurationSource(corsConfigurationSource))

            // === SESSION MANAGEMENT ===
            // STATELESS: Tidak pakai session cookie, semua info di JWT token
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // === AUTHORIZATION RULES ===
            // Tentukan endpoint mana yang public vs protected
            .authorizeHttpRequests(auth -> auth
                // PUBLIC ENDPOINTS - Lobby hotel (semua boleh masuk)
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/api/auth/register").permitAll()
                .requestMatchers("/api/auth/refresh").permitAll()   // Token refresh (token in query param)
                .requestMatchers("/api/auth/validate").permitAll()  // Token validation (token in query param)
                .requestMatchers("/api/auth/health").permitAll()
                .requestMatchers("/api/jwt-test/**").permitAll()    // JWT test endpoints
                .requestMatchers("/api/test-admin/**").permitAll()  // Test cleanup endpoints (for E2E tests)

                // UPLOADED FILES - Public access untuk profile pictures
                // Semua orang bisa lihat foto profile (untuk display di UI)
                .requestMatchers("/uploads/**").permitAll()         // Static files (profile pictures)

                // PROFILE ENDPOINTS - Protected (perlu login)
                .requestMatchers("/api/profile/**").authenticated() // Upload/delete own picture

                // GALLERY PUBLIC ENDPOINTS - Public access (tanpa login)
                .requestMatchers("/api/gallery/public").permitAll()           // View all public photos
                .requestMatchers("/api/gallery/user/*/public").permitAll()    // View user's public photos
                .requestMatchers("/api/gallery/photo/*").permitAll()          // View photo detail

                // GALLERY PROTECTED ENDPOINTS - Protected (perlu login)
                .requestMatchers("/api/gallery/**").authenticated()           // Upload, my-photos, update, delete

                // PROTECTED ENDPOINTS - Area hotel (perlu key card)
                .requestMatchers("/api/user/**").authenticated()    // User profile endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")  // Admin only areas

                // ALL OTHER REQUESTS - Default protected
                .anyRequest().authenticated()
            )

            // === EXCEPTION HANDLING ===
            // Return 401 Unauthorized (not 403 Forbidden) for unauthenticated requests
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write(
                        "{\"success\":false,\"message\":\"Unauthorized - JWT token required\"}"
                    );
                })
            )

            // === ADD JWT FILTER ===
            // Pasang security guard (JWT filter) sebelum standard auth filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * NOTES untuk Development:
     *
     * 1. BCrypt Strength Levels:
     *    - 10 = Default (fast, good untuk development)
     *    - 12 = Recommended (balance security vs performance)
     *    - 15 = Very secure (slow, untuk high-security apps)
     *
     * 2. Cara Kerja BCrypt:
     *    - encode("123456") → "$2a$12$abc123..."
     *    - matches("123456", "$2a$12$abc123...") → true/false
     *
     * 3. Usage di Service:
     *    @Autowired PasswordEncoder passwordEncoder;
     *    String hashedPassword = passwordEncoder.encode(rawPassword);
     *    boolean isValid = passwordEncoder.matches(rawPassword, hashedPassword);
     *
     * 4. Security Configuration:
     *    - Saat ini semua endpoint open untuk testing
     *    - Akan dikonfigurasi proper dengan JWT di step selanjutnya
     */
}