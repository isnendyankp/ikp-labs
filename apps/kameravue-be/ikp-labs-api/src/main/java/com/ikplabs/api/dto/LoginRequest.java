package com.ikplabs.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * LoginRequest - DTO untuk data login
 *
 * ANALOGI SEDERHANA:
 * ==================
 * LoginRequest seperti "Form Pengajuan Masuk Bioskop":
 *
 * Bayangkan customer mau masuk bioskop dan harus isi form:
 * - Email: sebagai ID member
 * - Password: sebagai verifikasi identitas
 *
 * Customer Service (Controller) terima form ini,
 * terus kasih ke Manager (AuthService) untuk diproses.
 *
 * KAPAN DIPAKAI:
 * ==============
 * - User submit login form di frontend
 * - Data dikirim ke endpoint POST /api/auth/login
 * - DTO ini validasi data sebelum masuk ke business logic
 *
 * MENGAPA PERLU DTO:
 * ==================
 * 1. Validation: Pastikan email dan password tidak kosong
 * 2. Security: Tidak expose entity User langsung
 * 3. Clean: Hanya ambil field yang dibutuhkan untuk login
 * 4. Maintainable: Mudah ubah struktur request tanpa ubah entity
 */
public class LoginRequest {

    /**
     * Email user - sebagai identifier untuk login
     * Validasi:
     * - @NotBlank: tidak boleh null, empty, atau whitespace
     * - @Email: harus format email yang valid
     *
     * Analogi: Nomor member di kartu bioskop
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    /**
     * Password user - untuk verifikasi identitas
     * Validasi:
     * - @NotBlank: tidak boleh null, empty, atau whitespace
     *
     * Analogi: PIN atau signature untuk verifikasi
     */
    @NotBlank(message = "Password is required")
    private String password;

    /**
     * Default constructor - diperlukan untuk JSON deserialization
     * Spring Boot otomatis convert JSON request ke object ini
     */
    public LoginRequest() {
    }

    /**
     * Parameterized constructor - untuk convenience saat testing
     *
     * @param email Email user
     * @param password Password user
     */
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    /**
     * Getter email
     * @return Email user
     */
    public String getEmail() {
        return email;
    }

    /**
     * Setter email
     * @param email Email user
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * Getter password
     * @return Password user
     */
    public String getPassword() {
        return password;
    }

    /**
     * Setter password
     * @param password Password user
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * toString method - untuk debugging dan logging
     * CATATAN: Tidak include password untuk security
     */
    @Override
    public String toString() {
        return "LoginRequest{" +
                "email='" + email + '\'' +
                ", password='[PROTECTED]'" +  // Tidak expose password
                '}';
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. DTO vs Entity:
     *    - DTO: Data Transfer Object, untuk komunikasi antar layer
     *    - Entity: Representasi table database
     *
     * 2. Validation Annotations:
     *    - @NotBlank: Field tidak boleh kosong
     *    - @Email: Field harus format email valid
     *    - Validation otomatis jalan kalau controller pakai @Valid
     *
     * 3. Security Best Practices:
     *    - Jangan log password dalam plain text
     *    - Gunakan [PROTECTED] atau mask password di logs
     *
     * 4. JSON Mapping:
     *    Request JSON:
     *    {
     *      "email": "user@example.com",
     *      "password": "mypassword"
     *    }
     *
     *    Otomatis di-convert jadi LoginRequest object
     */
}