package com.registrationform.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/**
 * UserUpdateRequest - DTO untuk menerima data update user dari frontend
 *
 * Bedanya dengan UserRegistrationRequest:
 * 1. Field tidak wajib (tidak ada @NotBlank) - karena update bisa partial
 * 2. Ada logic untuk handle field yang null (tidak diupdate)
 */
public class UserUpdateRequest {

    /**
     * Full Name - optional untuk update
     * Kalau null, berarti tidak diupdate
     */
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    /**
     * Email - optional untuk update
     * Kalau null, berarti tidak diupdate
     */
    @Email(message = "Please provide a valid email address")
    private String email;

    /**
     * Password - optional untuk update
     * Kalau null, berarti tidak diupdate
     */
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;

    /**
     * Default Constructor
     */
    public UserUpdateRequest() {
    }

    /**
     * Constructor dengan parameter
     */
    public UserUpdateRequest(String fullName, String email, String password) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    // Getter dan Setter methods

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
     * Utility methods untuk check apakah field mau diupdate
     * Ini berguna di Service layer untuk conditional update
     */
    public boolean hasFullName() {
        return fullName != null && !fullName.trim().isEmpty();
    }

    public boolean hasEmail() {
        return email != null && !email.trim().isEmpty();
    }

    public boolean hasPassword() {
        return password != null && !password.trim().isEmpty();
    }

    /**
     * toString method - untuk debugging
     * Password tidak di-include untuk security
     */
    @Override
    public String toString() {
        return "UserUpdateRequest{" +
                "fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + (password != null ? "[PROTECTED]" : "null") + '\'' +
                '}';
    }
}