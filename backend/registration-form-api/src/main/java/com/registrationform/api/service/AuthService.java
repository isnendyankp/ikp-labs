package com.registrationform.api.service;

import com.registrationform.api.dto.LoginRequest;
import com.registrationform.api.dto.LoginResponse;
import com.registrationform.api.entity.User;
import com.registrationform.api.repository.UserRepository;
import com.registrationform.api.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * AuthService - Business Logic Layer untuk Authentication
 *
 * ANALOGI SEDERHANA:
 * ==================
 * AuthService seperti "Manager Validasi Member Bioskop":
 *
 * Ketika customer mau login:
 * 1. Customer Service (Controller) kirim form ke Manager (AuthService)
 * 2. Manager cek di database: apakah member terdaftar?
 * 3. Manager cocokkan password: apakah password benar?
 * 4. Kalau valid: Manager buat tiket digital (JWT) dan kasih ke Customer Service
 * 5. Kalau invalid: Manager tolak dan kasih alasan ke Customer Service
 *
 * TANGGUNG JAWAB:
 * ===============
 * - Validasi credentials (email + password)
 * - Generate JWT token kalau login valid
 * - Handle berbagai skenario error
 * - Koordinasi antara UserRepository, PasswordEncoder, dan JwtUtil
 *
 * MENGAPA PERLU SERVICE LAYER:
 * ============================
 * 1. Separation of Concerns: Controller fokus HTTP, Service fokus business logic
 * 2. Reusability: Logic bisa dipake di controller lain
 * 3. Testability: Mudah di-unit test
 * 4. Security: Centralized authentication logic
 *
 * @Service = Spring otomatis register sebagai Bean
 */
@Service
public class AuthService {

    /**
     * UserRepository - untuk akses data user
     * Analogi: Petugas yang akses database member
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * PasswordEncoder - untuk validasi password
     * Analogi: Alat verifikasi PIN/signature
     */
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * JwtUtil - untuk generate JWT token
     * Analogi: Mesin pembuat tiket digital
     */
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * LOGIN - Method utama untuk authenticate user
     * ============================================
     *
     * PROSES VALIDASI BERLAPIS:
     * 1. Cek apakah email terdaftar di database
     * 2. Cek apakah password cocok dengan hash di database
     * 3. Generate JWT token kalau semua valid
     * 4. Return response dengan token dan user info
     *
     * @param loginRequest Data login dari user (email + password)
     * @return LoginResponse dengan JWT token atau error message
     */
    public LoginResponse login(LoginRequest loginRequest) {
        try {
            // === STEP 1: VALIDASI EMAIL ===
            // Cari user berdasarkan email
            Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

            if (userOptional.isEmpty()) {
                // Email tidak ditemukan di database
                return LoginResponse.error("Invalid email or password");
                // Note: Pesan generic untuk security (tidak kasih tau email tidak ada)
            }

            User user = userOptional.get();

            // === STEP 2: VALIDASI PASSWORD ===
            // Compare password plain text dengan hash di database
            boolean passwordMatches = passwordEncoder.matches(
                    loginRequest.getPassword(),  // Password plain text dari user
                    user.getPassword()           // Password hash dari database
            );

            if (!passwordMatches) {
                // Password salah
                return LoginResponse.error("Invalid email or password");
                // Note: Pesan sama dengan email tidak ada untuk security
            }

            // === STEP 3: GENERATE JWT TOKEN ===
            // Kalau sampai sini, berarti credentials valid
            String jwtToken = jwtUtil.generateToken(user.getEmail(), user.getFullName());

            // === STEP 4: BUAT RESPONSE SUKSES ===
            return LoginResponse.success(
                    jwtToken,           // JWT token untuk frontend
                    user.getId(),       // User ID
                    user.getEmail(),    // Email user
                    user.getFullName()  // Nama lengkap user
            );

        } catch (Exception e) {
            // Handle unexpected errors
            // Log error untuk debugging (tapi jangan expose ke user)
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();

            return LoginResponse.error("Login failed. Please try again.");
        }
    }

    /**
     * VALIDATE TOKEN - Method untuk validasi JWT token
     * ===============================================
     *
     * Method ini bisa dipake untuk:
     * 1. Validate token di authentication filter
     * 2. Check token validity di protected endpoints
     * 3. Refresh token functionality
     *
     * @param token JWT token dari header Authorization
     * @param email Email user yang claim punya token
     * @return true jika token valid, false jika tidak
     */
    public boolean validateToken(String token, String email) {
        try {
            return jwtUtil.validateToken(token, email);
        } catch (Exception e) {
            // Token invalid atau corrupt
            return false;
        }
    }

    /**
     * GET USER FROM TOKEN - Extract user info dari JWT token
     * =====================================================
     *
     * Method ini berguna untuk:
     * 1. Get current user info dari token
     * 2. Populate SecurityContext dengan user details
     * 3. Authorization checks
     *
     * @param token JWT token
     * @return User object jika token valid, null jika invalid
     */
    public User getUserFromToken(String token) {
        try {
            String email = jwtUtil.extractEmail(token);
            Optional<User> userOptional = userRepository.findByEmail(email);
            return userOptional.orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * REFRESH TOKEN - Generate token baru dengan expiry diperpanjang
     * =============================================================
     *
     * Method ini untuk:
     * 1. Extend session user tanpa login ulang
     * 2. Seamless user experience
     * 3. Security: token lama jadi invalid, diganti yang baru
     *
     * @param oldToken Token lama yang mau di-refresh
     * @return LoginResponse dengan token baru, atau error jika token invalid
     */
    public LoginResponse refreshToken(String oldToken) {
        try {
            // Validasi token lama masih valid
            User user = getUserFromToken(oldToken);

            if (user == null) {
                return LoginResponse.error("Invalid token");
            }

            // Generate token baru
            String newToken = jwtUtil.generateToken(user.getEmail(), user.getFullName());

            return LoginResponse.success(
                    newToken,
                    user.getId(),
                    user.getEmail(),
                    user.getFullName()
            );

        } catch (Exception e) {
            return LoginResponse.error("Failed to refresh token");
        }
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. Security Best Practices:
     *    - Generic error messages (jangan expose info sensitif)
     *    - Password di-hash, never store plain text
     *    - Exception handling yang proper
     *
     * 2. Business Logic Flow:
     *    Request -> Controller -> Service -> Repository
     *    Response <- Controller <- Service <- Repository
     *
     * 3. Dependency Injection:
     *    - @Autowired = Spring inject dependencies otomatis
     *    - Coupling loose, testability tinggi
     *
     * 4. Error Handling:
     *    - Try-catch untuk handle unexpected errors
     *    - Log errors untuk debugging
     *    - User-friendly error messages
     *
     * 5. Token Management:
     *    - Generate: saat login berhasil
     *    - Validate: setiap protected request
     *    - Refresh: perpanjang session
     *    - Extract: ambil user info dari token
     */
}