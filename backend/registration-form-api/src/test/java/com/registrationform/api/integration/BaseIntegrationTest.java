package com.registrationform.api.integration;

import com.registrationform.api.security.JwtUtil;
import org.junit.jupiter.api.BeforeAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/**
 * Base class untuk semua Integration Tests.
 *
 * Menggunakan Testcontainers untuk start PostgreSQL di Docker container.
 * Semua integration test class harus extend class ini.
 *
 * Fitur:
 * - Start PostgreSQL 15 container otomatis
 * - Container dibuat sekali, di-share untuk semua tests (singleton pattern)
 * - Container cleanup otomatis setelah semua tests selesai
 * - Spring Boot context di-load dengan profile "integration"
 * - Database connection di-configure otomatis
 *
 * Contoh penggunaan:
 * <pre>
 * {@code
 * @SpringBootTest
 * public class AuthControllerIntegrationTest extends BaseIntegrationTest {
 *     // Test methods here...
 * }
 * }
 * </pre>
 *
 * @author Registration Form Team
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("integration")
@Testcontainers
public abstract class BaseIntegrationTest {

    /**
     * PostgreSQL container instance - SINGLETON PATTERN.
     *
     * Menggunakan @Container annotation dari Testcontainers JUnit 5:
     * - Lifecycle management otomatis (start/stop)
     * - static = container dibuat sekali, shared untuk semua tests
     * - withReuse(true) = container persists across test runs
     *
     * PostgreSQL 15 dipilih karena:
     * - Production environment menggunakan PostgreSQL 15
     * - Stability & performance yang baik
     * - Kompatibilitas dengan Spring Boot 3.x
     *
     * SINGLETON PATTERN:
     * Container dibuat sekali dan di-reuse untuk SEMUA test classes.
     * Spring Boot Test akan CACHE context karena @SpringBootTest config SAMA.
     * Ini mencegah connection pool issues.
     *
     * Note: "Resource leak" warning adalah FALSE POSITIVE.
     * Container lifecycle di-manage otomatis oleh Testcontainers framework (@Container annotation),
     * jadi kita tidak perlu manual close(). Testcontainers akan cleanup otomatis.
     */
    @Container
    @SuppressWarnings({"resource", "unused"}) // Container lifecycle managed by Testcontainers
    protected static final PostgreSQLContainer<?> postgresContainer;

    // Static initializer untuk ensure single container instance
    static {
        @SuppressWarnings("resource")
        PostgreSQLContainer<?> container = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass")
            .withReuse(true);

        // Start container ONCE here
        if (!container.isRunning()) {
            container.start();
        }

        postgresContainer = container;
    }

    /**
     * Setup yang dijalankan SEKALI sebelum semua tests di class ini.
     *
     * Memastikan container sudah running sebelum Spring context di-load.
     * Testcontainers akan otomatis start container, jadi method ini
     * hanya untuk logging/verification (optional).
     */
    @BeforeAll
    static void beforeAll() {
        // Container will be started automatically by Testcontainers
        // This is just for verification/logging
        System.out.println("=".repeat(70));
        System.out.println("🐳 PostgreSQL Testcontainer Started");
        System.out.println("   JDBC URL: " + postgresContainer.getJdbcUrl());
        System.out.println("   Database: " + postgresContainer.getDatabaseName());
        System.out.println("   Username: " + postgresContainer.getUsername());
        System.out.println("=".repeat(70));
    }

    /**
     * Dynamic property configuration untuk Spring.
     *
     * Method ini dipanggil oleh Spring sebelum context di-load.
     * Kita override datasource properties dengan connection details
     * dari Testcontainers PostgreSQL container.
     *
     * Kenapa dynamic?
     * - Container port adalah RANDOM (untuk avoid conflicts)
     * - Kita tidak tahu port sampai container start
     * - @DynamicPropertySource memungkinkan set properties runtime
     *
     * Properties yang di-override:
     * 1. spring.datasource.url = JDBC URL dengan port random dari container
     * 2. spring.datasource.username = username dari container
     * 3. spring.datasource.password = password dari container
     *
     * Spring akan menggunakan properties ini untuk create DataSource bean.
     *
     * @param registry Spring's dynamic property registry
     */
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // Override datasource URL dengan connection dari Testcontainers
        registry.add("spring.datasource.url", postgresContainer::getJdbcUrl);
        registry.add("spring.datasource.username", postgresContainer::getUsername);
        registry.add("spring.datasource.password", postgresContainer::getPassword);
    }

    /**
     * JwtUtil - untuk generate JWT tokens dalam integration tests
     * Autowired dari Spring context
     */
    @Autowired
    protected JwtUtil jwtUtil;

    /**
     * Helper method untuk generate JWT token untuk testing.
     *
     * Digunakan untuk test endpoints yang di-protect oleh Spring Security.
     * Token ini akan dimasukkan ke Authorization header dalam MockMvc requests.
     *
     * @param userId User ID untuk embed dalam token
     * @param email User email untuk embed dalam token
     * @param fullName User full name untuk embed dalam token
     * @return JWT token string yang bisa digunakan dalam Authorization header
     */
    protected String generateTestToken(Long userId, String email, String fullName) {
        return jwtUtil.generateToken(userId, email, fullName);
    }

    /**
     * Helper method untuk generate Bearer token header value.
     *
     * Shortcut untuk format "Bearer {token}" yang dibutuhkan Spring Security.
     *
     * @param userId User ID
     * @param email User email
     * @param fullName User full name
     * @return String dalam format "Bearer {jwt-token}"
     */
    protected String generateBearerToken(Long userId, String email, String fullName) {
        return "Bearer " + generateTestToken(userId, email, fullName);
    }
}
