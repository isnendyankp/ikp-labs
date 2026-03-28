package com.ikplabs.api.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * User Entity - merepresentasikan table 'users' di database
 *
 * @Entity = Menandai class ini sebagai JPA entity
 * @Table = Konfigurasi nama table di database
 */
@Entity
@Table(name = "users")
public class User {

    /**
     * Primary Key - ID unik untuk setiap user
     *
     * @Id = Menandai field sebagai primary key
     * @GeneratedValue = Auto-generate nilai ID
     * @Column = Konfigurasi kolom di database
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /**
     * Full Name - nama lengkap user
     * nullable = false artinya wajib diisi (NOT NULL)
     * length = 100 artinya maksimal 100 karakter
     */
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    /**
     * Email - alamat email user (harus unique)
     * unique = true artinya tidak boleh duplikat
     */
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    /**
     * Password - password user (akan di-hash nantinya)
     */
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    /**
     * Created At - timestamp kapan user dibuat
     * updatable = false artinya sekali set tidak bisa diubah
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Updated At - timestamp kapan user terakhir diupdate
     */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Profile Picture - path to user's profile picture file
     *
     * Stores the relative path to uploaded profile picture, not the binary file itself.
     * Example: "/uploads/profiles/user-83.jpg"
     *
     * Why store path instead of binary:
     * - Database optimized for text/numbers, not large binary files
     * - Faster queries (no need to transfer large blobs)
     * - Easier to serve files via HTTP (static file handler)
     * - Can use CDN or cloud storage in future (just change path to URL)
     *
     * nullable = true because profile picture is optional
     */
    @Column(name = "profile_picture", length = 255)
    private String profilePicture;

    /**
     * Default Constructor - wajib ada untuk JPA
     */
    public User() {
    }

    /**
     * Constructor dengan parameter - untuk memudahkan pembuatan object
     */
    public User(String fullName, String email, String password) {
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Method yang dipanggil sebelum data disimpan ke database
     * @PrePersist = JPA lifecycle callback
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    /**
     * Method yang dipanggil sebelum data diupdate di database
     * @PreUpdate = JPA lifecycle callback
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getter dan Setter methods - wajib ada untuk JPA

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    /**
     * toString method - untuk debugging dan logging
     */
    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", profilePicture='" + profilePicture + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}