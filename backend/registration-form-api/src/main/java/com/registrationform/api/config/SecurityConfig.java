package com.registrationform.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * SecurityConfig - Spring Security Configuration
 *
 * Class ini bertugas untuk:
 * 1. Configure password encoder (BCrypt)
 * 2. Setup security components yang dibutuhkan
 * 3. Menyediakan beans untuk dependency injection
 *
 * @Configuration = Menandai class ini sebagai configuration class
 * Spring akan scan dan load configuration ini saat startup
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Password Encoder Bean - BCrypt
     *
     * BCrypt adalah algoritma hashing password yang sangat aman:
     * - One-way hashing (tidak bisa di-reverse)
     * - Salt otomatis (setiap hash unik meskipun password sama)
     * - Computational expensive (sulit untuk brute force)
     *
     * Contoh:
     * Password: "123456"
     * Hash: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
     *
     * @Bean = Spring akan register method ini sebagai Bean
     * Bean ini bisa di-inject ke class lain dengan @Autowired
     *
     * @return PasswordEncoder instance untuk hash/verify password
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCryptPasswordEncoder dengan strength 12
        // Strength 12 = 2^12 = 4096 rounds (balance antara security vs performance)
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Security Filter Chain - Temporarily disable security for testing
     * TODO: Akan dikonfigurasi proper di Step 4.7
     *
     * @param http HttpSecurity object untuk konfigurasi
     * @return SecurityFilterChain yang sudah dikonfigurasi
     * @throws Exception jika ada error dalam konfigurasi
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF untuk testing
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Allow semua request tanpa authentication
            );
        return http.build();
    }

    /**
     * NOTES untuk Development:
     *
     * 1. BCrypt Strength Levels:
     *    - 10 = Default (fast, good untuk development)
     *    - 12 = Recommended (balance security vs performance)
     *    - 15 = Very secure (slow, untuk high-security apps)
     *
     * 2. Cara Kerja BCrypt:
     *    - encode("123456") → "$2a$12$abc123..."
     *    - matches("123456", "$2a$12$abc123...") → true/false
     *
     * 3. Usage di Service:
     *    @Autowired PasswordEncoder passwordEncoder;
     *    String hashedPassword = passwordEncoder.encode(rawPassword);
     *    boolean isValid = passwordEncoder.matches(rawPassword, hashedPassword);
     *
     * 4. Security Configuration:
     *    - Saat ini semua endpoint open untuk testing
     *    - Akan dikonfigurasi proper dengan JWT di step selanjutnya
     */
}