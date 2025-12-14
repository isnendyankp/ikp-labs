package com.ikplabs.api.dto;

import com.ikplabs.api.entity.User;
import java.time.LocalDateTime;

/**
 * UserResponse - DTO untuk mengirim data user ke frontend
 *
 * Kenapa butuh Response DTO?
 * 1. Security: Tidak return password ke frontend
 * 2. Control: Bisa pilih field mana yang mau di-expose
 * 3. Format: Bisa format data sesuai kebutuhan frontend
 * 4. Stability: Perubahan Entity tidak affect API response
 */
public class UserResponse {

    /**
     * Fields yang akan dikirim ke frontend
     * Notice: Password TIDAK ADA disini untuk security
     */
    private Long id;
    private String fullName;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Default Constructor - wajib ada
     */
    public UserResponse() {
    }

    /**
     * Constructor dengan parameter
     */
    public UserResponse(Long id, String fullName, String email, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Static factory method - cara mudah untuk convert User Entity ke UserResponse
     *
     * Ini adalah pattern yang bagus untuk conversion:
     * User entity = userRepository.findById(1);
     * UserResponse response = UserResponse.fromEntity(entity);
     */
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    // Getter dan Setter methods

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * toString method - untuk debugging dan logging
     * Password memang tidak ada disini, jadi aman untuk di-log
     */
    @Override
    public String toString() {
        return "UserResponse{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}