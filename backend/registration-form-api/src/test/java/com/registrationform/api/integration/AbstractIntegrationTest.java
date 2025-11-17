package com.registrationform.api.integration;

import com.registrationform.api.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Abstract Integration Test - SINGLETON CONTAINER PATTERN
 *
 * PROBLEM YANG DISELESAIKAN:
 * ==========================
 * Ketika multiple test classes running, Spring Boot Test CACHE context jika konfigurasi sama.
 * Tapi Testcontainers create NEW container untuk setiap class, sehingga:
 * - Test Class 1: Container port 50001 → Spring context created with datasource port 50001
 * - Test Class 2: Container port 50002 → Spring REUSE context (cached) → tries to connect to port 50001 → CONNECTION REFUSED!
 *
 * SOLUTION: SINGLETON CONTAINER
 * ==============================
 * Container dibuat SEKALI sebagai static field, di-share oleh SEMUA test classes.
 * Spring Boot Test cache context dengan container yang SAMA, port yang SAMA.
 *
 * IMPORTANT: Semua integration test classes MUST extend class ini!
 *
 * @author Registration Form Team
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("integration")
public abstract class AbstractIntegrationTest {

    /**
     * SINGLETON PostgreSQL Container.
     *
     * Static container dibuat SEKALI untuk SEMUA test classes.
     * Tidak menggunakan @Testcontainers dan @Container annotation untuk avoid auto-lifecycle.
     * Manual lifecycle management untuk ensure SINGLETON pattern.
     */
    private static final PostgreSQLContainer<?> POSTGRES_CONTAINER;

    // Static initializer - container created ONCE when class is loaded
    static {
        // Suppress resource leak warning - container lifecycle is managed by singleton pattern
        @SuppressWarnings("resource")
        PostgreSQLContainer<?> container = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass")
            .withReuse(true);

        // Start container ONCE
        container.start();

        POSTGRES_CONTAINER = container;

        // Log container info
        System.out.println("=".repeat(70));
        System.out.println("🐳 SINGLETON PostgreSQL Testcontainer Started");
        System.out.println("   JDBC URL: " + POSTGRES_CONTAINER.getJdbcUrl());
        System.out.println("   Database: " + POSTGRES_CONTAINER.getDatabaseName());
        System.out.println("   Username: " + POSTGRES_CONTAINER.getUsername());
        System.out.println("   Port: " + POSTGRES_CONTAINER.getMappedPort(PostgreSQLContainer.POSTGRESQL_PORT));
        System.out.println("=".repeat(70));

        // Shutdown hook untuk cleanup (optional, karena withReuse(true) akan keep container)
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("Stopping PostgreSQL container...");
            if (POSTGRES_CONTAINER.isRunning()) {
                POSTGRES_CONTAINER.stop();
            }
        }));
    }

    /**
     * Dynamic property configuration untuk Spring.
     *
     * Method ini dipanggil oleh Spring sebelum context di-load.
     * Override datasource properties dengan connection details dari SINGLETON container.
     *
     * CRITICAL: Container port FIXED karena container SINGLETON!
     */
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES_CONTAINER::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES_CONTAINER::getUsername);
        registry.add("spring.datasource.password", POSTGRES_CONTAINER::getPassword);
    }

    /**
     * JwtUtil - untuk generate JWT tokens dalam integration tests
     */
    @Autowired
    protected JwtUtil jwtUtil;

    /**
     * Helper method untuk generate JWT token untuk testing.
     */
    protected String generateTestToken(Long userId, String email, String fullName) {
        return jwtUtil.generateToken(userId, email, fullName);
    }

    /**
     * Helper method untuk generate Bearer token header value.
     */
    protected String generateBearerToken(Long userId, String email, String fullName) {
        return "Bearer " + generateTestToken(userId, email, fullName);
    }

    /**
     * Get singleton container (for advanced use cases)
     */
    protected static PostgreSQLContainer<?> getPostgresContainer() {
        return POSTGRES_CONTAINER;
    }
}
