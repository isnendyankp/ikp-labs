package com.ikplabs.api.security;

import com.ikplabs.api.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JwtAuthenticationFilter - Filter untuk Authentication setiap HTTP Request
 *
 * ANALOGI SEDERHANA:
 * ==================
 * JwtAuthenticationFilter seperti "Security Guard di Lift Hotel":
 *
 * Bayangkan hotel mewah dengan lift yang pergi ke berbagai lantai:
 * - Lantai 1: Lobby (public, semua boleh masuk)
 * - Lantai 2-10: Kamar tamu (perlu key card)
 * - Lantai 11: VIP Lounge (perlu key card premium)
 * - Lantai 12: Staff Area (perlu key card staff)
 *
 * Security Guard (JWT Filter) ada di depan lift dan:
 * 1. Cek setiap orang yang mau naik lift
 * 2. Minta lihat key card (JWT token)
 * 3. Scan key card: masih valid? belum expired?
 * 4. Cek access level: boleh ke lantai mana?
 * 5. Kalau valid: buka pintu lift, catat siapa yang masuk
 * 6. Kalau invalid: tolak, suruh ke front desk dulu
 *
 * KAPAN DIJALANKAN:
 * ==================
 * Filter ini jalan OTOMATIS pada SETIAP HTTP request ke server:
 * - GET /api/user/profile → Filter cek token
 * - POST /api/orders → Filter cek token
 * - GET /api/auth/login → Filter skip (public endpoint)
 *
 * MENGAPA PERLU FILTER:
 * =====================
 * 1. Automatic Security: Semua endpoint otomatis protected
 * 2. Stateless: Server tidak simpan session, semua info di token
 * 3. Scalable: Bisa handle banyak user concurrent
 * 4. Centralized: Logic authentication terpusat di satu tempat
 *
 * @Component = Spring register sebagai bean
 * OncePerRequestFilter = Garantee filter hanya jalan sekali per request
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    /**
     * JwtUtil - Mesin untuk validasi dan extract token
     * Analogi: Alat scanner key card
     */
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * UserRepository - Direct database access untuk get user details
     * Analogi: Database admin yang langsung akses data tamu
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * MAIN FILTER METHOD - Dijalankan pada setiap HTTP request
     * ========================================================
     *
     * FLOW SECURITY GUARD:
     * 1. Tamu datang ke lift (HTTP request masuk)
     * 2. Guard cek: bawa key card gak? (cek Authorization header)
     * 3. Kalau bawa: scan key card (validate JWT token)
     * 4. Kalau valid: catat siapa yang masuk (set SecurityContext)
     * 5. Buka pintu lift (continue request)
     * 6. Kalau gak bawa/invalid: tetap lanjut tapi tanpa akses khusus
     *
     * @param request HTTP request yang masuk
     * @param response HTTP response
     * @param filterChain Chain filter berikutnya
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {
            // === STEP 1: AMBIL JWT TOKEN DARI HEADER ===
            String jwt = extractJwtFromRequest(request);

            // === STEP 2: VALIDASI TOKEN ===
            if (jwt != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Extract email dari token
                String email = jwtUtil.extractEmail(jwt);

                // Validasi token masih valid
                if (email != null && jwtUtil.validateToken(jwt, email)) {

                    // === STEP 3: SET SECURITY CONTEXT ===
                    // Buat authentication object
                    UserDetails userDetails = createUserDetailsFromJwt(jwt);

                    UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,  // credentials (tidak perlu, sudah authenticated)
                            userDetails.getAuthorities()  // permissions/roles
                        );

                    // Set detail request (IP, session info, dll)
                    authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    // SET SECURITY CONTEXT - ini yang penting!
                    // SecurityContext = "Catatan siapa yang sedang login"
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    // Log untuk debugging
                    logger.debug("JWT Authentication successful for user: " + email);
                }
            }

        } catch (Exception e) {
            // Kalau ada error saat validasi token, log error tapi jangan stop request
            logger.error("Cannot set user authentication: " + e.getMessage());

            // Clear security context kalau ada error
            SecurityContextHolder.clearContext();
        }

        // === STEP 4: LANJUTKAN REQUEST ===
        // Penting! Harus panggil filterChain.doFilter untuk lanjut ke controller
        filterChain.doFilter(request, response);
    }

    /**
     * EXTRACT JWT TOKEN dari Authorization Header
     * ==========================================
     *
     * Format header yang diharapkan:
     * Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJ...
     *
     * @param request HTTP request
     * @return JWT token string, atau null kalau tidak ada
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        // Cek format: "Bearer <token>"
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            // Extract token part (remove "Bearer " prefix)
            return bearerToken.substring(7);
        }

        return null;
    }

    /**
     * CREATE USER DETAILS dari JWT Token
     * ==================================
     *
     * Method ini buat UserDetails object dari JWT token.
     * Pakai custom UserPrincipal untuk info user yang lebih lengkap.
     *
     * @param jwt JWT token yang sudah divalidasi
     * @return UserDetails object untuk Spring Security
     */
    private UserDetails createUserDetailsFromJwt(String jwt) {
        try {
            // Extract user info dari token
            String email = jwtUtil.extractEmail(jwt);
            String fullName = jwtUtil.getFullNameFromToken(jwt);

            // Get user dari database untuk ID
            var user = userRepository.findByEmail(email).orElse(null);
            Long userId = (user != null) ? user.getId() : null;

            // Buat UserPrincipal dengan info lengkap
            return new UserPrincipal(userId, email, fullName);

        } catch (Exception e) {
            logger.error("Error creating UserDetails from JWT: " + e.getMessage());

            // Return minimal UserPrincipal kalau error
            return new UserPrincipal(null, "anonymous", "Anonymous User");
        }
    }

    /**
     * SHOULD NOT FILTER - Tentukan endpoint mana yang skip filter
     * ===========================================================
     *
     * Method ini menentukan request mana yang TIDAK perlu di-filter.
     * Biasanya public endpoints seperti login, register, health check.
     *
     * @param request HTTP request
     * @return true kalau skip filter, false kalau perlu filter
     */
    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        String path = request.getRequestURI();

        // Skip filter untuk public endpoints
        return path.startsWith("/api/auth/login") ||
               path.startsWith("/api/auth/register") ||
               path.startsWith("/api/auth/refresh") ||   // Token refresh (token in query param)
               path.startsWith("/api/auth/validate") ||  // Token validation (token in query param)
               path.startsWith("/api/auth/health") ||
               path.startsWith("/api/jwt-test") ||       // JWT test endpoints
               path.startsWith("/h2-console") ||         // H2 database console (if used)
               path.startsWith("/actuator");             // Spring actuator endpoints
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. Filter Chain Order:
     *    HTTP Request → Security Filters → Controller → Service → Repository
     *    HTTP Response ← Security Filters ← Controller ← Service ← Repository
     *
     * 2. SecurityContext:
     *    - Global storage untuk current user info
     *    - Bisa diakses dari mana saja dengan SecurityContextHolder.getContext()
     *    - Automatically cleared setelah request selesai
     *
     * 3. Authentication vs Authorization:
     *    - Authentication: "Siapa kamu?" (login dengan token)
     *    - Authorization: "Kamu boleh akses apa?" (roles & permissions)
     *
     * 4. UserDetails:
     *    - Interface Spring Security untuk user info
     *    - Berisi username, password, authorities, account status
     *    - Dipakai untuk authorization decisions
     *
     * 5. Filter vs Interceptor:
     *    - Filter: Level servlet, jalan sebelum Spring MVC
     *    - Interceptor: Level Spring MVC, jalan setelah controller mapping
     *
     * 6. Error Handling:
     *    - Filter tidak boleh throw exception yang stop request
     *    - Log error, clear context, tapi tetap lanjut ke controller
     *    - Controller yang handle authentication error
     *
     * 7. Performance Considerations:
     *    - Filter jalan pada SETIAP request
     *    - Jangan lakukan database call heavy di filter
     *    - JWT validation itu fast, database lookup itu slow
     *
     * 8. Security Best Practices:
     *    - Selalu validate token signature
     *    - Check token expiration
     *    - Clear security context on error
     *    - Log authentication attempts untuk monitoring
     */
}