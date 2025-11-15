package com.registrationform.api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JwtUtil - JWT (JSON Web Token) Utility Class
 *
 * ANALOGI SEDERHANA:
 * ==================
 * Bayangkan JWT seperti "Tiket Bioskop Digital":
 *
 * 1. PEMBUATAN TIKET (generateToken):
 *    - Manager bioskop (JwtUtil) membuat tiket digital
 *    - Tiket berisi info: nama customer, email, waktu berlaku
 *    - Tiket ditandatangani dengan cap rahasia manager (secret key)
 *    - Customer dapat tiket dan bisa masuk bioskop
 *
 * 2. VALIDASI TIKET (validateToken):
 *    - Security bioskop (JwtUtil) cek tiket customer
 *    - Periksa: apakah cap masih asli? apakah belum kadaluarsa?
 *    - Jika valid: customer boleh masuk
 *    - Jika invalid: customer ditolak
 *
 * 3. BACA INFO TIKET (extractClaims):
 *    - Security bisa baca info di tiket: siapa pemiliknya
 *    - Tanpa perlu tanya manager lagi
 *
 * KOMPONEN JWT:
 * =============
 * - Header: jenis tiket (JWT)
 * - Payload: info customer (email, name, exp time)
 * - Signature: cap rahasia manager (untuk validasi)
 *
 * @Component = Spring otomatis buat instance class ini
 */
@Component
public class JwtUtil {

    /**
     * Secret Key - Kunci Rahasia untuk signing JWT
     * Seperti cap rahasia manager bioskop
     *
     * @Value = Ambil nilai dari application.properties
     * Jika tidak ada, pakai default value
     */
    @Value("${jwt.secret:registrationFormSecretKeyThatIsVeryLongAndSecure123456789}")
    private String jwtSecret;

    /**
     * JWT Expiration Time - Berapa lama tiket berlaku
     * Default: 24 jam (86400000 ms)
     * Seperti tiket bioskop berlaku 1 hari
     */
    @Value("${jwt.expiration:86400000}")
    private long jwtExpirationMs;

    /**
     * Get Secret Key untuk signing/validasi JWT
     * Seperti manager ambil cap rahasia dari brankas
     *
     * @return SecretKey untuk JWT operations
     */
    private SecretKey getSigningKey() {
        // Convert string secret ke SecretKey yang aman
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * GENERATE TOKEN - Buat tiket digital baru
     * =======================================
     * Seperti manager bioskop buat tiket untuk customer
     *
     * Proses:
     * 1. Manager (JwtUtil) terima info customer (email, name, userId)
     * 2. Buat tiket dengan info tersebut + waktu kadaluarsa
     * 3. Tandatangani dengan cap rahasia
     * 4. Kasih tiket ke customer
     *
     * @param userId - User ID (for authorization checks)
     * @param email - Email customer (identifier utama)
     * @param fullName - Nama lengkap customer
     * @return String JWT token yang bisa dipakai customer
     */
    public String generateToken(Long userId, String email, String fullName) {
        // Info yang akan dimasukkan ke tiket
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);      // User ID untuk authorization
        claims.put("fullName", fullName);  // Nama customer
        claims.put("email", email);        // Email customer

        // Kapan tiket dibuat dan kapan kadaluarsa
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        // PROSES PEMBUATAN TIKET:
        return Jwts.builder()
                .claims(claims)                 // Info customer
                .subject(email)                 // Subject utama (email)
                .issuedAt(now)                 // Kapan tiket dibuat
                .expiration(expiryDate)        // Kapan tiket kadaluarsa
                .signWith(getSigningKey())     // Tandatangani dengan cap rahasia
                .compact();                    // Jadikan string yang bisa dikirim
    }

    /**
     * EXTRACT EMAIL - Baca email dari tiket
     * ====================================
     * Seperti security baca nama di tiket bioskop
     *
     * @param token - Tiket JWT dari customer
     * @return Email customer yang ada di tiket
     */
    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * EXTRACT EXPIRATION - Baca tanggal kadaluarsa tiket
     * =================================================
     * Seperti security cek kapan tiket expire
     *
     * @param token - Tiket JWT dari customer
     * @return Tanggal kadaluarsa tiket
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * EXTRACT CLAIM - Baca info spesifik dari tiket
     * =============================================
     * Seperti security baca bagian tertentu dari tiket
     *
     * @param token - Tiket JWT
     * @param claimsResolver - Function untuk extract claim tertentu
     * @return Info yang diminta dari tiket
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * EXTRACT ALL CLAIMS - Baca semua info dari tiket
     * ===============================================
     * Seperti security baca seluruh isi tiket
     *
     * @param token - Tiket JWT
     * @return Semua info yang ada di tiket
     */
    private Claims extractAllClaims(String token) {
        try {
            // Parse dan validasi tiket dengan cap rahasia
            return Jwts.parser()
                    .verifyWith(getSigningKey())    // Verifikasi cap rahasia
                    .build()
                    .parseSignedClaims(token)       // Parse isi tiket
                    .getPayload();                  // Ambil info customer
        } catch (JwtException e) {
            // Tiket rusak atau palsu
            throw new RuntimeException("Invalid JWT token: " + e.getMessage());
        }
    }

    /**
     * IS TOKEN EXPIRED - Cek apakah tiket sudah kadaluarsa
     * ===================================================
     * Seperti security cek apakah tiket masih berlaku
     *
     * @param token - Tiket JWT
     * @return true jika kadaluarsa, false jika masih berlaku
     */
    public Boolean isTokenExpired(String token) {
        Date expiration = extractExpiration(token);
        return expiration.before(new Date());
    }

    /**
     * VALIDATE TOKEN - Validasi tiket customer
     * =======================================
     * Seperti security bioskop cek tiket sebelum izinkan masuk
     *
     * Proses validasi:
     * 1. Cek apakah cap masih asli (signature valid)
     * 2. Cek apakah tiket belum kadaluarsa
     * 3. Cek apakah email di tiket sama dengan yang claim
     *
     * @param token - Tiket JWT dari customer
     * @param userEmail - Email yang customer claim
     * @return true jika tiket valid, false jika tidak
     */
    public Boolean validateToken(String token, String userEmail) {
        try {
            // Extract email dari tiket
            final String tokenEmail = extractEmail(token);

            // VALIDASI TRIPLE CHECK:
            // 1. Email di tiket sama dengan yang di-claim customer
            // 2. Tiket belum kadaluarsa
            // 3. Signature masih valid (dicek otomatis di extractEmail)
            return (tokenEmail.equals(userEmail) && !isTokenExpired(token));

        } catch (Exception e) {
            // Jika ada error, berarti tiket tidak valid
            return false;
        }
    }

    /**
     * GET FULL NAME FROM TOKEN - Ambil nama lengkap dari tiket
     * =======================================================
     *
     * @param token - Tiket JWT
     * @return Nama lengkap customer
     */
    public String getFullNameFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("fullName", String.class);
    }

    /**
     * REFRESH TOKEN - Perpanjang masa berlaku tiket
     * =============================================
     * Seperti customer perpanjang tiket membership
     *
     * @param token - Tiket lama yang mau diperpanjang
     * @return Tiket baru dengan masa berlaku diperpanjang
     */
    public String refreshToken(String token) {
        final Claims claims = extractAllClaims(token);
        final Long userId = claims.get("userId", Long.class);
        final String email = claims.getSubject();
        final String fullName = claims.get("fullName", String.class);

        // Buat tiket baru dengan info sama tapi waktu berlaku baru
        return generateToken(userId, email, fullName);
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. JWT vs Session Cookie:
     *    - Session: Server nyimpen info user di memori/database
     *    - JWT: Info user disimpan di token yang dibawa client
     *
     * 2. Keamanan JWT:
     *    - Secret key harus dirahasiakan
     *    - Token punya expiration time
     *    - Signature memastikan token tidak diubah
     *
     * 3. Kapan Pakai JWT:
     *    - API stateless (server tidak nyimpan session)
     *    - Microservices architecture
     *    - Mobile apps authentication
     *
     * 4. Flow Penggunaan:
     *    - Login → Server buat JWT → Client simpan token
     *    - Request API → Client kirim token di header
     *    - Server validasi token → Jika valid, proses request
     */
}