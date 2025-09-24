package com.registrationform.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
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
     * @NotBlank = tidak boleh null, empty, atau hanya whitespace
     * @Size = minimal 2 karakter, maksimal 100 karakter
     */
    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    /**
     * Email - alamat email user
     *
     * @NotBlank = wajib diisi
     * @Email = harus format email yang valid
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    /**
     * Password - password user (plain text dari frontend)
     *
     * @NotBlank = wajib diisi
     * @Size = minimal 8 karakter untuk security
     */
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
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