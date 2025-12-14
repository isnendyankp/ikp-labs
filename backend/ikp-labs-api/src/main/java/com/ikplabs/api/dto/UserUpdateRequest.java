package com.ikplabs.api.dto;

import com.ikplabs.api.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
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
     *
     * Enhanced Validation (hanya jika diisi):
     * @Size = minimal 2 karakter, maksimal 100 karakter
     * @Pattern = hanya boleh huruf, spasi, dan karakter khusus tertentu
     */
    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    @Pattern(
        regexp = "^[a-zA-Z\\s'-\\.]+$",
        message = "Full name can only contain letters, spaces, apostrophes, hyphens, and dots"
    )
    private String fullName;

    /**
     * Email - optional untuk update
     * Kalau null, berarti tidak diupdate
     *
     * Enhanced Validation (hanya jika diisi):
     * @Email = harus format email yang valid
     * @Size = maksimal 255 karakter
     * @Pattern = additional email format validation
     */
    @Email(message = "Please provide a valid email address")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Pattern(
        regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        message = "Email format is invalid"
    )
    private String email;

    /**
     * Password - optional untuk update
     * Kalau null, berarti tidak diupdate
     *
     * Enhanced Validation (hanya jika diisi):
     * @Size = minimal 8 karakter, maksimal 255
     * @ValidPassword = custom validation untuk complexity
     */
    @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
    @ValidPassword  // Custom validation annotation
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