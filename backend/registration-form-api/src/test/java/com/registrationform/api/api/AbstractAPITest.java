package com.registrationform.api.api;

import com.registrationform.api.model.User;
import com.registrationform.api.repository.UserRepository;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.List;
import java.util.stream.Collectors;

import static io.restassured.RestAssured.given;

/**
 * Base class untuk semua API tests.
 *
 * Fitur:
 * - Menjalankan server Spring Boot pada port random
 * - Konfigurasi REST Assured base URL otomatis
 * - Helper methods untuk cleanup test data
 * - Akses ke repositories untuk verifikasi database
 *
 * PENTING:
 * - API test menggunakan REAL database PostgreSQL (bukan in-memory)
 * - Server harus di-run manual dengan: mvn spring-boot:run
 * - Test users menggunakan pattern: apitest*@test.com
 * - Setiap test harus cleanup data di @AfterEach
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
public abstract class AbstractAPITest {

    /**
     * Base URL untuk semua API endpoints.
     * Server harus berjalan di port 8080.
     */
    protected static final String BASE_URL = "http://localhost:8080/api";

    /**
     * Repository untuk akses database dan verifikasi data.
     */
    @Autowired
    protected UserRepository userRepository;

    /**
     * Setup REST Assured sebelum setiap test.
     * Mengkonfigurasi base URI dan default content type.
     */
    @BeforeEach
    public void setUpRestAssured() {
        RestAssured.baseURI = BASE_URL;
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    }

    /**
     * Helper method untuk cleanup semua test users.
     * Menghapus semua user dengan email yang dimulai dengan "apitest".
     *
     * GUNAKAN INI DI @AfterEach untuk membersihkan data test!
     */
    protected void cleanupTestUsers() {
        List<User> testUsers = userRepository.findAll().stream()
                .filter(user -> user.getEmail().startsWith("apitest"))
                .collect(Collectors.toList());

        if (!testUsers.isEmpty()) {
            userRepository.deleteAll(testUsers);
        }
    }

    /**
     * Helper method untuk cleanup user berdasarkan email tertentu.
     *
     * @param email Email user yang akan dihapus
     */
    protected void cleanupUserByEmail(String email) {
        userRepository.findByEmail(email).ifPresent(userRepository::delete);
    }

    /**
     * Helper method untuk verify bahwa user ada di database.
     *
     * @param email Email user yang dicek
     * @return true jika user exists, false jika tidak
     */
    protected boolean userExistsInDatabase(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    /**
     * Helper method untuk get user dari database.
     *
     * @param email Email user yang dicari
     * @return User object atau null jika tidak ditemukan
     */
    protected User getUserFromDatabase(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    /**
     * Helper method untuk create JWT token dengan login.
     * Berguna untuk test endpoints yang membutuhkan authentication.
     *
     * @param email Email user
     * @param password Password user
     * @return JWT token string
     */
    protected String getAuthToken(String email, String password) {
        return given()
                .contentType(ContentType.JSON)
                .body(String.format("{\"email\":\"%s\",\"password\":\"%s\"}", email, password))
        .when()
                .post("/auth/login")
        .then()
                .statusCode(200)
                .extract()
                .path("token");
    }
}
