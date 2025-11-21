package com.registrationform.api.api;

import com.registrationform.api.model.User;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * API Tests untuk AuthController endpoints.
 *
 * Test dengan REAL database PostgreSQL dan REAL HTTP server.
 *
 * PERSIAPAN SEBELUM RUN TEST:
 * 1. Pastikan PostgreSQL database sudah running
 * 2. Jalankan server: mvn spring-boot:run
 * 3. Server harus berjalan di http://localhost:8080
 * 4. Run test dengan: mvn test -Dtest=AuthControllerAPITest
 *
 * CATATAN:
 * - Test users menggunakan email: apitest-auth*@test.com
 * - Setiap test akan cleanup data di @AfterEach
 * - Test memverifikasi data persistence di real database
 */
@DisplayName("API Tests - AuthController")
public class AuthControllerAPITest extends AbstractAPITest {

    private static final String AUTH_ENDPOINT = "/auth";
    private static final String TEST_EMAIL = "apitest-auth@test.com";
    private static final String TEST_FULL_NAME = "API Test Auth User";
    private static final String TEST_PASSWORD = "Test@1234";

    /**
     * Cleanup test data setelah setiap test.
     * Menghapus semua user dengan email "apitest-auth*".
     */
    @AfterEach
    void cleanup() {
        cleanupUserByEmail(TEST_EMAIL);
        cleanupUserByEmail("apitest-auth-login@test.com");
        cleanupUserByEmail("apitest-auth-logout@test.com");
    }

    /**
     * Test: POST /api/auth/register - Success case
     *
     * Skenario:
     * 1. User register dengan data valid
     * 2. Server response 201 Created
     * 3. Response berisi success=true, email, fullName, token
     * 4. User tersimpan di database dengan data yang benar
     * 5. Password ter-hash (tidak plain text)
     */
    @Test
    @DisplayName("POST /auth/register - Should register user successfully")
    void testRegisterUser_Success() {
        // Arrange: Siapkan request body
        Map<String, String> request = new HashMap<>();
        request.put("email", TEST_EMAIL);
        request.put("fullName", TEST_FULL_NAME);
        request.put("password", TEST_PASSWORD);

        // Act & Assert: Kirim request dan verify response
        given()
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post(AUTH_ENDPOINT + "/register")
        .then()
                .statusCode(201)
                .body("success", equalTo(true))
                .body("message", equalTo("User registered successfully"))
                .body("email", equalTo(TEST_EMAIL))
                .body("fullName", equalTo(TEST_FULL_NAME))
                .body("token", notNullValue())
                .body("token", not(emptyString()));

        // Verify: Cek data di database
        assertTrue(userExistsInDatabase(TEST_EMAIL), "User should exist in database");

        User savedUser = getUserFromDatabase(TEST_EMAIL);
        assertNotNull(savedUser, "Saved user should not be null");
        assertEquals(TEST_EMAIL, savedUser.getEmail());
        assertEquals(TEST_FULL_NAME, savedUser.getFullName());
        assertNotEquals(TEST_PASSWORD, savedUser.getPassword(), "Password should be hashed");
        assertTrue(savedUser.getPassword().startsWith("$2a$"), "Password should be BCrypt hashed");
        assertFalse(savedUser.isEmailVerified(), "Email should not be verified initially");
    }

    /**
     * Test: POST /api/auth/register - Missing required fields
     *
     * Skenario:
     * 1. User register tanpa email (required field)
     * 2. Server response 400 Bad Request
     * 3. Response berisi success=false
     */
    @Test
    @DisplayName("POST /auth/register - Should fail when email is missing")
    void testRegisterUser_MissingEmail() {
        Map<String, String> request = new HashMap<>();
        request.put("fullName", TEST_FULL_NAME);
        request.put("password", TEST_PASSWORD);

        given()
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post(AUTH_ENDPOINT + "/register")
        .then()
                .statusCode(400)
                .body("success", equalTo(false));
    }

    /**
     * Test: POST /api/auth/register - Invalid email format
     *
     * Skenario:
     * 1. User register dengan email format salah
     * 2. Server response 400 Bad Request
     */
    @Test
    @DisplayName("POST /auth/register - Should fail when email format is invalid")
    void testRegisterUser_InvalidEmailFormat() {
        Map<String, String> request = new HashMap<>();
        request.put("email", "not-an-email");
        request.put("fullName", TEST_FULL_NAME);
        request.put("password", TEST_PASSWORD);

        given()
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post(AUTH_ENDPOINT + "/register")
        .then()
                .statusCode(400)
                .body("success", equalTo(false));
    }

    /**
     * Test: POST /api/auth/register - Duplicate email
     *
     * Skenario:
     * 1. Register user pertama kali (success)
     * 2. Register lagi dengan email yang sama (should fail)
     * 3. Server response 409 Conflict
     */
    @Test
    @DisplayName("POST /auth/register - Should fail when email already exists")
    void testRegisterUser_DuplicateEmail() {
        // First registration
        Map<String, String> request = new HashMap<>();
        request.put("email", TEST_EMAIL);
        request.put("fullName", TEST_FULL_NAME);
        request.put("password", TEST_PASSWORD);

        given()
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post(AUTH_ENDPOINT + "/register")
        .then()
                .statusCode(201);

        // Second registration with same email
        given()
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post(AUTH_ENDPOINT + "/register")
        .then()
                .statusCode(409)
                .body("success", equalTo(false))
                .body("message", containsString("already exists"));
    }

    /**
     * Test: POST /api/auth/login - Success case
     *
     * Skenario:
     * 1. Register user baru
     * 2. Login dengan credentials yang benar
     * 3. Server response 200 OK
     * 4. Response berisi JWT token yang valid
     */
    @Test
    @DisplayName("POST /auth/login - Should login successfully with correct credentials")
    void testLogin_Success() {
        String email = "apitest-auth-login@test.com";

        // Arrange: Register user terlebih dahulu
        Map<String, String> registerRequest = new HashMap<>();
        registerRequest.put("email", email);
        registerRequest.put("fullName", "Login Test User");
        registerRequest.put("password", TEST_PASSWORD);

        given()
                .contentType(ContentType.JSON)
                .body(registerRequest)
        .when()
                .post(AUTH_ENDPOINT + "/register")
        .then()
                .statusCode(201);

        // Act & Assert: Login dengan credentials yang benar
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", email);
        loginRequest.put("password", TEST_PASSWORD);

        given()
                .contentType(ContentType.JSON)
                .body(loginRequest)
        .when()
                .post(AUTH_ENDPOINT + "/login")
        .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("message", equalTo("Login successful"))
                .body("token", notNullValue())
                .body("token", not(emptyString()))
                .body("email", equalTo(email))
                .body("fullName", equalTo("Login Test User"));
    }

    /**
     * Test: POST /api/auth/login - Wrong password
     *
     * Skenario:
     * 1. Register user baru
     * 2. Login dengan password yang salah
     * 3. Server response 401 Unauthorized
     */
    @Test
    @DisplayName("POST /auth/login - Should fail with wrong password")
    void testLogin_WrongPassword() {
        String email = "apitest-auth-login@test.com";

        // Arrange: Register user
        Map<String, String> registerRequest = new HashMap<>();
        registerRequest.put("email", email);
        registerRequest.put("fullName", "Login Test User");
        registerRequest.put("password", TEST_PASSWORD);

        given()
                .contentType(ContentType.JSON)
                .body(registerRequest)
        .when()
                .post(AUTH_ENDPOINT + "/register")
        .then()
                .statusCode(201);

        // Act & Assert: Login dengan password salah
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", email);
        loginRequest.put("password", "WrongPassword123!");

        given()
                .contentType(ContentType.JSON)
                .body(loginRequest)
        .when()
                .post(AUTH_ENDPOINT + "/login")
        .then()
                .statusCode(401)
                .body("success", equalTo(false))
                .body("message", containsString("Invalid"));
    }

    /**
     * Test: POST /api/auth/login - Non-existent user
     *
     * Skenario:
     * 1. Login dengan email yang tidak terdaftar
     * 2. Server response 401 Unauthorized
     */
    @Test
    @DisplayName("POST /auth/login - Should fail with non-existent email")
    void testLogin_NonExistentUser() {
        Map<String, String> loginRequest = new HashMap<>();
        loginRequest.put("email", "nonexistent@test.com");
        loginRequest.put("password", TEST_PASSWORD);

        given()
                .contentType(ContentType.JSON)
                .body(loginRequest)
        .when()
                .post(AUTH_ENDPOINT + "/login")
        .then()
                .statusCode(401)
                .body("success", equalTo(false));
    }

    /**
     * Test: POST /api/auth/logout - Success case
     *
     * Skenario:
     * 1. Register dan login user
     * 2. Logout dengan JWT token yang valid
     * 3. Server response 200 OK
     *
     * NOTE: Implementasi logout bisa bervariasi tergantung arsitektur.
     * Jika menggunakan stateless JWT, logout biasanya handled di client-side.
     */
    @Test
    @DisplayName("POST /auth/logout - Should logout successfully")
    void testLogout_Success() {
        String email = "apitest-auth-logout@test.com";

        // Arrange: Register dan login user
        Map<String, String> registerRequest = new HashMap<>();
        registerRequest.put("email", email);
        registerRequest.put("fullName", "Logout Test User");
        registerRequest.put("password", TEST_PASSWORD);

        given()
                .contentType(ContentType.JSON)
                .body(registerRequest)
        .when()
                .post(AUTH_ENDPOINT + "/register")
        .then()
                .statusCode(201);

        // Get JWT token
        String token = getAuthToken(email, TEST_PASSWORD);

        // Act & Assert: Logout
        given()
                .header("Authorization", "Bearer " + token)
        .when()
                .post(AUTH_ENDPOINT + "/logout")
        .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("message", equalTo("Logged out successfully"));
    }
}
