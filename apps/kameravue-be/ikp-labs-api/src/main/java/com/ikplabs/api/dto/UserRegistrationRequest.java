package com.ikplabs.api.dto;

import com.ikplabs.api.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * UserRegistrationRequest - DTO untuk menerima data registrasi user dari frontend
 *
 * DTO (Data Transfer Object) adalah object yang digunakan untuk transfer data
 * antara layer yang berbeda (misalnya frontend ke controller).
 *
 * Kenapa butuh DTO?
 * 1. Security: Tidak expose semua field Entity ke frontend
 * 2. Validation: Bisa add validation rules specific untuk request
 * 3. Flexibility: Frontend bisa send data format yang berbeda dari Entity
 * 4. API Contract: Clear contract untuk frontend developer
 */
public class UserRegistrationRequest {

    /**
     * Full Name - nama lengkap user
     *
     * Enhanced Validation:
     * @NotBlank = tidak boleh null, empty, atau hanya whitespace
     * @Size = minimal 2 karakter, maksimal 100 karakter
     * @Pattern = hanya boleh huruf, spasi, dan beberapa karakter khusus
     */
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Pattern(
        regexp = "^[a-zA-Z\\s'-\\.]+$",
        message = "Full name can only contain letters, spaces, apostrophes, hyphens, and dots"
    )
    private String fullName;

    /**
     * Email - alamat email user
     *
     * Enhanced Validation:
     * @NotBlank = wajib diisi
     * @Email = harus format email yang valid
     * @Size = maksimal 255 karakter (sesuai database schema)
     * @Pattern = additional email format validation
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        message = "Email format is invalid"
    )
    private String email;

    /**
     * Password - password user (plain text dari frontend)
     *
     * Enhanced Validation:
     * @NotBlank = wajib diisi
     * @Size = minimal 8 karakter, maksimal 255 untuk security
     * @ValidPassword = custom validation untuk complexity (huruf besar/kecil, angka, special char)
     */
    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
    @ValidPassword  // Custom validation annotation yang kita buat
    private String password;

    /**
     * Default Constructor - wajib ada untuk JSON deserialization
     * Spring Boot akan menggunakan ini untuk convert JSON dari frontend
     */
    public UserRegistrationRequest() {
    }

    /**
     * Constructor dengan parameter - untuk memudahkan pembuatan object
     */
    public UserRegistrationRequest(String fullName, String email, String password) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    // Getter methods - Spring Boot butuh ini untuk JSON serialization/deserialization

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * toString method - untuk debugging dan logging
     * PENTING: Password tidak di-include untuk security
     */
    @Override
    public String toString() {
        return "UserRegistrationRequest{" +
                "fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", password='[PROTECTED]'" +
                '}';
    }
}