package com.ikplabs.api.dto;

import java.time.LocalDateTime;

/**
 * LoginResponse - DTO untuk response login yang berhasil
 *
 * ANALOGI SEDERHANA:
 * ==================
 * LoginResponse seperti "Paket Tiket Bioskop + Info Member":
 *
 * Setelah Manager bioskop (AuthService) validasi member,
 * dia kasih paket lengkap ke Customer Service (Controller):
 * - Tiket digital (JWT token)
 * - Info member (user data)
 * - Status sukses
 * - Waktu tiket dibuat
 *
 * Customer Service kasih paket ini ke customer sebagai bukti login berhasil.
 *
 * KAPAN DIPAKAI:
 * ==============
 * - Setelah login berhasil
 * - Response dari endpoint POST /api/auth/login
 * - Frontend terima response ini dan simpan JWT token
 *
 * MENGAPA PERLU DTO:
 * ==================
 * 1. Security: Tidak expose password atau data sensitif
 * 2. Structured: Response rapi dan konsisten
 * 3. Frontend-friendly: Data yang dibutuhkan frontend semua ada
 * 4. Extensible: Mudah tambah field baru tanpa ubah entity
 */
public class LoginResponse {

    /**
     * Status sukses login
     * Analogi: Stempel "APPROVED" di tiket
     */
    private boolean success;

    /**
     * Pesan untuk user
     * Analogi: Ucapan "Selamat datang kembali!"
     */
    private String message;

    /**
     * JWT Token - tiket digital untuk akses API
     * Analogi: QR code di tiket bioskop
     */
    private String token;

    /**
     * Type token (selalu "Bearer" untuk JWT)
     * Analogi: Jenis tiket (VIP, Regular, dll)
     */
    private String tokenType = "Bearer";

    /**
     * ID user yang login
     * Analogi: Nomor member
     */
    private Long userId;

    /**
     * Email user yang login
     * Analogi: Email member terdaftar
     */
    private String email;

    /**
     * Nama lengkap user
     * Analogi: Nama member
     */
    private String fullName;

    /**
     * Waktu login berhasil
     * Analogi: Waktu cap tiket
     */
    private LocalDateTime loginTime;

    /**
     * Default constructor
     */
    public LoginResponse() {
        this.loginTime = LocalDateTime.now();
    }

    /**
     * Constructor untuk login berhasil
     *
     * @param token JWT token
     * @param userId ID user
     * @param email Email user
     * @param fullName Nama lengkap user
     */
    public LoginResponse(String token, Long userId, String email, String fullName) {
        this.success = true;
        this.message = "Login successful";
        this.token = token;
        this.tokenType = "Bearer";
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.loginTime = LocalDateTime.now();
    }

    /**
     * Static method untuk create response sukses
     * Design pattern: Factory method untuk kemudahan
     *
     * @param token JWT token
     * @param userId ID user
     * @param email Email user
     * @param fullName Nama lengkap user
     * @return LoginResponse object
     */
    public static LoginResponse success(String token, Long userId, String email, String fullName) {
        return new LoginResponse(token, userId, email, fullName);
    }

    /**
     * Static method untuk create response error
     * Design pattern: Factory method untuk kemudahan
     *
     * @param message Error message
     * @return LoginResponse object dengan status error
     */
    public static LoginResponse error(String message) {
        LoginResponse response = new LoginResponse();
        response.success = false;
        response.message = message;
        return response;
    }

    // === GETTERS AND SETTERS ===

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public LocalDateTime getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(LocalDateTime loginTime) {
        this.loginTime = loginTime;
    }

    /**
     * toString method - untuk debugging
     * CATATAN: Tidak include token untuk security
     */
    @Override
    public String toString() {
        return "LoginResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", token='[PROTECTED]'" +  // Tidak expose token
                ", tokenType='" + tokenType + '\'' +
                ", userId=" + userId +
                ", email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", loginTime=" + loginTime +
                '}';
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. Factory Pattern:
     *    - LoginResponse.success() untuk login berhasil
     *    - LoginResponse.error() untuk login gagal
     *    - Lebih readable dan mudah digunakan
     *
     * 2. Bearer Token:
     *    - Frontend harus kirim token dengan format:
     *    - Authorization: Bearer <jwt-token>
     *    - Standard untuk JWT authentication
     *
     * 3. Security Considerations:
     *    - Tidak include password di response
     *    - Token di-mask di logging
     *    - Hanya data yang dibutuhkan frontend
     *
     * 4. Example JSON Response:
     *    {
     *      "success": true,
     *      "message": "Login successful",
     *      "token": "eyJhbGciOiJIUzUxMiJ9...",
     *      "tokenType": "Bearer",
     *      "userId": 1,
     *      "email": "user@example.com",
     *      "fullName": "John Doe",
     *      "loginTime": "2024-01-15T10:30:00"
     *    }
     *
     * 5. Frontend Usage:
     *    - Simpan token di localStorage atau sessionStorage
     *    - Include token di header untuk API calls berikutnya
     *    - Display user info (fullName, email) di UI
     */
}