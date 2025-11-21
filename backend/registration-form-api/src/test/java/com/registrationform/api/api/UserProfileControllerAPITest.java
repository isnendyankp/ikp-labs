package com.registrationform.api.api;

import com.registrationform.api.model.User;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.HashMap;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * API Tests untuk UserProfileController endpoints.
 *
 * Test profile operations dengan REAL database PostgreSQL dan REAL HTTP server.
 * Focus pada JWT-protected endpoints untuk user profile management.
 *
 * PERSIAPAN SEBELUM RUN TEST:
 * 1. Pastikan PostgreSQL database sudah running
 * 2. Jalankan server: mvn spring-boot:run
 * 3. Server harus berjalan di http://localhost:8080
 * 4. Run test dengan: mvn test -Dtest=UserProfileControllerAPITest
 *
 * CATATAN:
 * - Test users menggunakan email: apitest-profile*@test.com
 * - Semua endpoints membutuhkan JWT authentication
 * - Test verify bahwa user hanya bisa akses profile sendiri
 * - Setiap test akan cleanup data di @AfterEach
 */
@DisplayName("API Tests - UserProfileController")
public class UserProfileControllerAPITest extends AbstractAPITest {

    private static final String PROFILE_ENDPOINT = "/profile";
    private static final String TEST_EMAIL = "apitest-profile@test.com";
    private static final String TEST_FULL_NAME = "API Test Profile User";
    private static final String TEST_PASSWORD = "Test@1234";

    private String authToken;
    private Long testUserId;

    /**
     * Setup test user dan JWT token sebelum setiap test.
     */
    @BeforeEach
    void setUp() {
        // Register test user
        Map<String, String> registerRequest = new HashMap<>();
        registerRequest.put("email", TEST_EMAIL);
        registerRequest.put("fullName", TEST_FULL_NAME);
        registerRequest.put("password", TEST_PASSWORD);

        given()
                .contentType(ContentType.JSON)
                .body(registerRequest)
        .when()
                .post("/auth/register")
        .then()
                .statusCode(201);

        // Get auth token
        authToken = getAuthToken(TEST_EMAIL, TEST_PASSWORD);

        // Get user ID dari database
        User testUser = getUserFromDatabase(TEST_EMAIL);
        testUserId = testUser.getId();
    }

    /**
     * Cleanup test data setelah setiap test.
     */
    @AfterEach
    void cleanup() {
        cleanupUserByEmail(TEST_EMAIL);
        cleanupUserByEmail("apitest-profile-other@test.com");
        cleanupTestUsers();
    }

    /**
     * Test: GET /api/profile - Get current user profile
     *
     * Skenario:
     * 1. Request profile dengan JWT token
     * 2. Server response 200 OK
     * 3. Response berisi data user yang sesuai dengan token
     * 4. Password TIDAK di-expose
     */
    @Test
    @DisplayName("GET /profile - Should get current user profile successfully")
    void testGetProfile_Success() {
        given()
                .header("Authorization", "Bearer " + authToken)
        .when()
                .get(PROFILE_ENDPOINT)
        .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("data.id", equalTo(testUserId.intValue()))
                .body("data.email", equalTo(TEST_EMAIL))
                .body("data.fullName", equalTo(TEST_FULL_NAME))
                .body("data.emailVerified", equalTo(false))
                .body("data.password", nullValue()) // Security: password tidak boleh di-expose
                .body("data.createdAt", notNullValue())
                .body("data.updatedAt", notNullValue());
    }

    /**
     * Test: GET /api/profile - Unauthorized access
     *
     * Skenario:
     * 1. Request profile tanpa JWT token
     * 2. Server response 401 Unauthorized
     */
    @Test
    @DisplayName("GET /profile - Should fail without authentication token")
    void testGetProfile_Unauthorized() {
        given()
                // No Authorization header
        .when()
                .get(PROFILE_ENDPOINT)
        .then()
                .statusCode(401);
    }

    /**
     * Test: GET /api/profile - Invalid JWT token
     *
     * Skenario:
     * 1. Request profile dengan JWT token yang invalid
     * 2. Server response 401 Unauthorized
     */
    @Test
    @DisplayName("GET /profile - Should fail with invalid JWT token")
    void testGetProfile_InvalidToken() {
        given()
                .header("Authorization", "Bearer invalid-token-here")
        .when()
                .get(PROFILE_ENDPOINT)
        .then()
                .statusCode(401);
    }

    /**
     * Test: PUT /api/profile - Update current user profile
     *
     * Skenario:
     * 1. Update profile dengan data baru
     * 2. Server response 200 OK
     * 3. Data ter-update di database
     * 4. Email tidak bisa diubah (untuk security)
     */
    @Test
    @DisplayName("PUT /profile - Should update profile successfully")
    void testUpdateProfile_Success() {
        String updatedFullName = "Updated Profile Name";

        Map<String, String> updateRequest = new HashMap<>();
        updateRequest.put("fullName", updatedFullName);

        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(updateRequest)
        .when()
                .put(PROFILE_ENDPOINT)
        .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("message", equalTo("Profile updated successfully"))
                .body("data.fullName", equalTo(updatedFullName))
                .body("data.email", equalTo(TEST_EMAIL)); // Email tetap sama

        // Verify di database
        User updatedUser = getUserFromDatabase(TEST_EMAIL);
        assertEquals(updatedFullName, updatedUser.getFullName());
    }

    /**
     * Test: PUT /api/profile - Update tanpa authentication
     *
     * Skenario:
     * 1. Update profile tanpa JWT token
     * 2. Server response 401 Unauthorized
     */
    @Test
    @DisplayName("PUT /profile - Should fail without authentication")
    void testUpdateProfile_Unauthorized() {
        Map<String, String> updateRequest = new HashMap<>();
        updateRequest.put("fullName", "Updated Name");

        given()
                // No Authorization header
                .contentType(ContentType.JSON)
                .body(updateRequest)
        .when()
                .put(PROFILE_ENDPOINT)
        .then()
                .statusCode(401);
    }

    /**
     * Test: PUT /api/profile - Update dengan empty fullName
     *
     * Skenario:
     * 1. Update profile dengan fullName kosong
     * 2. Server response 400 Bad Request (validation error)
     */
    @Test
    @DisplayName("PUT /profile - Should fail with empty fullName")
    void testUpdateProfile_EmptyFullName() {
        Map<String, String> updateRequest = new HashMap<>();
        updateRequest.put("fullName", "");

        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(updateRequest)
        .when()
                .put(PROFILE_ENDPOINT)
        .then()
                .statusCode(400)
                .body("success", equalTo(false));
    }

    /**
     * Test: PUT /api/profile - Verify user cannot update other user's profile
     *
     * Skenario:
     * 1. Create user kedua
     * 2. Login sebagai user pertama
     * 3. Coba update profile menggunakan token user pertama
     * 4. Verify bahwa yang ter-update adalah profile user pertama (bukan user lain)
     *
     * NOTE: Endpoint /profile seharusnya SELALU update profile dari user
     * yang sesuai dengan JWT token, bukan berdasarkan parameter.
     */
    @Test
    @DisplayName("PUT /profile - Should only update current user's profile based on JWT")
    void testUpdateProfile_CannotUpdateOtherUser() {
        // Create user kedua
        String otherUserEmail = "apitest-profile-other@test.com";
        Map<String, String> registerOtherUser = new HashMap<>();
        registerOtherUser.put("email", otherUserEmail);
        registerOtherUser.put("fullName", "Other User");
        registerOtherUser.put("password", "Test@1234");

        given()
                .contentType(ContentType.JSON)
                .body(registerOtherUser)
        .when()
                .post("/auth/register")
        .then()
                .statusCode(201);

        // Login sebagai user pertama (authToken sudah ada dari setUp)
        // Update profile
        Map<String, String> updateRequest = new HashMap<>();
        updateRequest.put("fullName", "Hacker Trying to Update");

        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(updateRequest)
        .when()
                .put(PROFILE_ENDPOINT)
        .then()
                .statusCode(200)
                .body("data.email", equalTo(TEST_EMAIL)); // Verify email user pertama

        // Verify: User pertama ter-update, user kedua TIDAK ter-update
        User firstUser = getUserFromDatabase(TEST_EMAIL);
        assertEquals("Hacker Trying to Update", firstUser.getFullName());

        User secondUser = getUserFromDatabase(otherUserEmail);
        assertEquals("Other User", secondUser.getFullName()); // Tetap original
    }

    /**
     * Test: DELETE /api/profile - Delete current user account
     *
     * Skenario:
     * 1. Delete profile (user menghapus account sendiri)
     * 2. Server response 200 OK
     * 3. User terhapus dari database
     *
     * NOTE: Implementasi delete account bisa bervariasi:
     * - Hard delete (benar-benar hapus dari DB)
     * - Soft delete (tandai sebagai deleted)
     * Test ini assume hard delete.
     */
    @Test
    @DisplayName("DELETE /profile - Should delete current user account successfully")
    void testDeleteProfile_Success() {
        given()
                .header("Authorization", "Bearer " + authToken)
        .when()
                .delete(PROFILE_ENDPOINT)
        .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("message", equalTo("Account deleted successfully"));

        // Verify user terhapus dari database
        assertFalse(userExistsInDatabase(TEST_EMAIL));
    }
}
