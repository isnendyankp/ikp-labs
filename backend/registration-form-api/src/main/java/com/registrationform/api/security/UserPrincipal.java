package com.registrationform.api.security;

import com.registrationform.api.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Objects;

/**
 * UserPrincipal - Custom UserDetails Implementation
 *
 * ANALOGI SEDERHANA:
 * ==================
 * UserPrincipal seperti "Profile Card Tamu Hotel yang Lengkap":
 *
 * Bayangkan setiap tamu hotel punya profile card yang berisi:
 * - ID tamu (user ID)
 * - Nama lengkap (full name)
 * - Email (sebagai username)
 * - Status membership (authorities/roles)
 * - Status account (active/blocked/expired)
 *
 * Security Guard (Spring Security) pakai profile card ini untuk:
 * 1. Tahu siapa yang sedang login (authentication)
 * 2. Tahu tamu boleh akses apa (authorization)
 * 3. Cek status account masih valid atau tidak
 *
 * MENGAPA CUSTOM USERPRINCIPAL:
 * =============================
 * 1. Extended Info: Bisa tambah field custom (fullName, userId, etc)
 * 2. Clean Code: Encapsulate user data dalam satu object
 * 3. Security Integration: Compatible dengan Spring Security
 * 4. Flexibility: Mudah extend untuk role-based access control
 *
 * KAPAN DIPAKAI:
 * ===============
 * - Saat JWT filter set authentication
 * - Controller bisa get current user dengan @AuthenticationPrincipal
 * - Authorization checks berdasarkan user info
 * - Audit log siapa yang akses endpoint
 *
 * UserDetails = Contract Spring Security untuk user information
 */
public class UserPrincipal implements UserDetails {

    /**
     * User ID dari database
     * Analogi: Nomor ID tamu hotel
     */
    private Long id;

    /**
     * Email sebagai username
     * Analogi: Email untuk komunikasi
     */
    private String email;

    /**
     * Nama lengkap user
     * Analogi: Nama di ID card
     */
    private String fullName;

    /**
     * Password (biasanya kosong untuk JWT authentication)
     * Analogi: PIN tamu (tidak perlu disimpan di profile card)
     */
    private String password;

    /**
     * Authorities/Roles user
     * Analogi: Level membership (VIP, Regular, Staff, etc)
     */
    private Collection<? extends GrantedAuthority> authorities;

    /**
     * Constructor untuk create UserPrincipal dari User entity
     *
     * @param user User entity dari database
     */
    public UserPrincipal(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.password = user.getPassword();

        // Default role untuk semua user adalah "USER"
        // Bisa di-extend nanti untuk role-based system
        this.authorities = Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_USER")
        );
    }

    /**
     * Constructor untuk create UserPrincipal dari JWT token info
     *
     * @param id User ID
     * @param email Email user
     * @param fullName Nama lengkap user
     */
    public UserPrincipal(Long id, String email, String fullName) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.password = "";  // Empty untuk JWT auth

        this.authorities = Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_USER")
        );
    }

    /**
     * Factory method untuk create UserPrincipal dari User entity
     *
     * @param user User entity
     * @return UserPrincipal object
     */
    public static UserPrincipal create(User user) {
        return new UserPrincipal(user);
    }

    // === GETTER METHODS UNTUK ACCESS USER INFO ===

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    // === USERDETAILS INTERFACE IMPLEMENTATION ===

    /**
     * Username untuk Spring Security
     * Kita pakai email sebagai username
     */
    @Override
    public String getUsername() {
        return email;
    }

    /**
     * Password user
     * Untuk JWT auth, biasanya kosong karena sudah authenticated
     */
    @Override
    public String getPassword() {
        return password;
    }

    /**
     * Authorities/Roles yang dimiliki user
     * Dipakai untuk authorization (access control)
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    /**
     * Apakah account tidak expired
     * True = account masih berlaku
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;  // Untuk sekarang, semua account tidak expired
    }

    /**
     * Apakah account tidak locked
     * True = account tidak di-block
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;  // Untuk sekarang, semua account tidak locked
    }

    /**
     * Apakah credentials tidak expired
     * True = password masih berlaku
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // Untuk sekarang, credentials tidak expired
    }

    /**
     * Apakah account enabled/active
     * True = account aktif bisa login
     */
    @Override
    public boolean isEnabled() {
        return true;  // Untuk sekarang, semua account enabled
    }

    // === OBJECT METHODS ===

    /**
     * Equals method untuk compare UserPrincipal objects
     * Dianggap sama kalau ID sama
     */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserPrincipal that = (UserPrincipal) o;
        return Objects.equals(id, that.id);
    }

    /**
     * HashCode based on user ID
     */
    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    /**
     * String representation untuk debugging
     * Tidak include password untuk security
     */
    @Override
    public String toString() {
        return "UserPrincipal{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", fullName='" + fullName + '\'' +
                ", authorities=" + authorities +
                '}';
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. UserDetails Contract:
     *    - Interface yang Spring Security butuhkan
     *    - Berisi user info + account status
     *    - Dipakai untuk authentication & authorization
     *
     * 2. Authentication vs Authorization:
     *    - Authentication: UserPrincipal membuktikan siapa user
     *    - Authorization: getAuthorities() menentukan user boleh apa
     *
     * 3. Authorities/Roles:
     *    - ROLE_USER: Role default untuk regular user
     *    - ROLE_ADMIN: Role untuk admin (bisa ditambah nanti)
     *    - Format Spring: "ROLE_" + nama role
     *
     * 4. Account Status:
     *    - isEnabled(): Account aktif atau disabled
     *    - isAccountNonLocked(): Account tidak di-suspend
     *    - isAccountNonExpired(): Account belum expired
     *    - isCredentialsNonExpired(): Password belum expired
     *
     * 5. Usage dalam Controller:
     *    @GetMapping("/profile")
     *    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
     *        return ResponseEntity.ok(currentUser.getFullName());
     *    }
     *
     * 6. Security Context:
     *    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
     *    UserPrincipal user = (UserPrincipal) auth.getPrincipal();
     *
     * 7. Extensibility:
     *    - Bisa tambah field custom (department, lastLogin, etc)
     *    - Bisa implement role hierarchy
     *    - Bisa tambah permission-based authorization
     */
}