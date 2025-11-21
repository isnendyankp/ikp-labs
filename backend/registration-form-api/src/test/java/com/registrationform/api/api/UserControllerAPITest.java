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
 * API Tests untuk UserController endpoints.
 *
 * Test CRUD operations dengan REAL database PostgreSQL dan REAL HTTP server.
 *
 * PERSIAPAN SEBELUM RUN TEST:
 * 1. Pastikan PostgreSQL database sudah running
 * 2. Jalankan server: mvn spring-boot:run
 * 3. Server harus berjalan di http://localhost:8080
 * 4. Run test dengan: mvn test -Dtest=UserControllerAPITest
 *
 * CATATAN:
 * - Test users menggunakan email: apitest-user*@test.com
 * - Endpoints membutuhkan JWT authentication
 * - Setiap test akan cleanup data di @AfterEach
 * - Test memverifikasi data persistence di real database
 */
@DisplayName("API Tests - UserController")
public class UserControllerAPITest extends AbstractAPITest {

    private static final String USER_ENDPOINT = "/users";
    private static final String TEST_EMAIL = "apitest-user@test.com";
    private static final String TEST_FULL_NAME = "API Test User";
    private static final String TEST_PASSWORD = "Test@1234";

    private String authToken;
    private Long testUserId;

    /**
     * Setup test user dan JWT token sebelum setiap test.
     * User ini digunakan untuk authenticate dan test operations.
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
        cleanupUserByEmail("apitest-user-new@test.com");
        cleanupUserByEmail("apitest-user-update@test.com");
        cleanupTestUsers(); // Cleanup semua user dengan pattern "apitest*"
    }

    /**
     * Test: GET /api/users - Get all users
     *
     * Skenario:
     * 1. Request all users dengan JWT token
     * 2. Server response 200 OK
     * 3. Response berisi array of users
     * 4. Test user ada di dalam list
     */
    @Test
    @DisplayName("GET /users - Should get all users successfully")
    void testGetAllUsers_Success() {
        given()
                .header("Authorization", "Bearer " + authToken)
        .when()
                .get(USER_ENDPOINT)
        .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("data", notNullValue())
                .body("data", isA(java.util.List.class))
                .body("data.size()", greaterThan(0))
                .body("data.email", hasItem(TEST_EMAIL));
    }

    /**
     * Test: GET /api/users - Unauthorized access
     *
     * Skenario:
     * 1. Request tanpa JWT token
     * 2. Server response 401 Unauthorized
     */
    @Test
    @DisplayName("GET /users - Should fail without authentication token")
    void testGetAllUsers_Unauthorized() {
        given()
                // No Authorization header
        .when()
                .get(USER_ENDPOINT)
        .then()
                .statusCode(401);
    }

    /**
     * Test: GET /api/users/{id} - Get user by ID
     *
     * Skenario:
     * 1. Request user by ID dengan JWT token
     * 2. Server response 200 OK
     * 3. Response berisi user data yang benar
     */
    @Test
    @DisplayName("GET /users/{id} - Should get user by ID successfully")
    void testGetUserById_Success() {
        given()
                .header("Authorization", "Bearer " + authToken)
        .when()
                .get(USER_ENDPOINT + "/" + testUserId)
        .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("data.id", equalTo(testUserId.intValue()))
                .body("data.email", equalTo(TEST_EMAIL))
                .body("data.fullName", equalTo(TEST_FULL_NAME))
                .body("data.password", nullValue()); // Password tidak boleh di-expose
    }

    /**
     * Test: GET /api/users/{id} - Non-existent user
     *
     * Skenario:
     * 1. Request user dengan ID yang tidak ada
     * 2. Server response 404 Not Found
     */
    @Test
    @DisplayName("GET /users/{id} - Should return 404 for non-existent user")
    void testGetUserById_NotFound() {
        Long nonExistentId = 999999L;

        given()
                .header("Authorization", "Bearer " + authToken)
        .when()
                .get(USER_ENDPOINT + "/" + nonExistentId)
        .then()
                .statusCode(404)
                .body("success", equalTo(false))
                .body("message", containsString("not found"));
    }

    /**
     * Test: POST /api/users - Create new user
     *
     * Skenario:
     * 1. Create user baru dengan JWT token
     * 2. Server response 201 Created
     * 3. User tersimpan di database
     */
    @Test
    @DisplayName("POST /users - Should create new user successfully")
    void testCreateUser_Success() {
        String newEmail = "apitest-user-new@test.com";

        Map<String, String> request = new HashMap<>();
        request.put("email", newEmail);
        request.put("fullName", "New Test User");
        request.put("password", "NewTest@1234");

        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post(USER_ENDPOINT)
        .then()
                .statusCode(201)
                .body("success", equalTo(true))
                .body("message", equalTo("User created successfully"))
                .body("data.email", equalTo(newEmail))
                .body("data.fullName", equalTo("New Test User"))
                .body("data.id", notNullValue());

        // Verify di database
        assertTrue(userExistsInDatabase(newEmail));
        User newUser = getUserFromDatabase(newEmail);
        assertEquals("New Test User", newUser.getFullName());
    }

    /**
     * Test: POST /api/users - Create user tanpa authentication
     *
     * Skenario:
     * 1. Create user tanpa JWT token
     * 2. Server response 401 Unauthorized
     */
    @Test
    @DisplayName("POST /users - Should fail without authentication")
    void testCreateUser_Unauthorized() {
        Map<String, String> request = new HashMap<>();
        request.put("email", "test@test.com");
        request.put("fullName", "Test User");
        request.put("password", "Test@1234");

        given()
                // No Authorization header
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post(USER_ENDPOINT)
        .then()
                .statusCode(401);
    }

    /**
     * Test: POST /api/users - Create user dengan duplicate email
     *
     * Skenario:
     * 1. Create user dengan email yang sudah ada
     * 2. Server response 409 Conflict
     */
    @Test
    @DisplayName("POST /users - Should fail with duplicate email")
    void testCreateUser_DuplicateEmail() {
        Map<String, String> request = new HashMap<>();
        request.put("email", TEST_EMAIL); // Email yang sudah ada
        request.put("fullName", "Duplicate User");
        request.put("password", "Test@1234");

        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post(USER_ENDPOINT)
        .then()
                .statusCode(409)
                .body("success", equalTo(false))
                .body("message", containsString("already exists"));
    }

    /**
     * Test: POST /api/users - Create user dengan invalid data
     *
     * Skenario:
     * 1. Create user dengan email format salah
     * 2. Server response 400 Bad Request
     */
    @Test
    @DisplayName("POST /users - Should fail with invalid email format")
    void testCreateUser_InvalidEmail() {
        Map<String, String> request = new HashMap<>();
        request.put("email", "invalid-email");
        request.put("fullName", "Test User");
        request.put("password", "Test@1234");

        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .post(USER_ENDPOINT)
        .then()
                .statusCode(400)
                .body("success", equalTo(false));
    }

    /**
     * Test: PUT /api/users/{id} - Update user
     *
     * Skenario:
     * 1. Update user data dengan JWT token
     * 2. Server response 200 OK
     * 3. Data ter-update di database
     */
    @Test
    @DisplayName("PUT /users/{id} - Should update user successfully")
    void testUpdateUser_Success() {
        String updatedName = "Updated Test User";

        Map<String, String> request = new HashMap<>();
        request.put("fullName", updatedName);
        request.put("email", TEST_EMAIL);

        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .put(USER_ENDPOINT + "/" + testUserId)
        .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("message", equalTo("User updated successfully"))
                .body("data.fullName", equalTo(updatedName));

        // Verify di database
        User updatedUser = getUserFromDatabase(TEST_EMAIL);
        assertEquals(updatedName, updatedUser.getFullName());
    }

    /**
     * Test: PUT /api/users/{id} - Update non-existent user
     *
     * Skenario:
     * 1. Update user dengan ID yang tidak ada
     * 2. Server response 404 Not Found
     */
    @Test
    @DisplayName("PUT /users/{id} - Should return 404 for non-existent user")
    void testUpdateUser_NotFound() {
        Long nonExistentId = 999999L;

        Map<String, String> request = new HashMap<>();
        request.put("fullName", "Updated Name");
        request.put("email", "test@test.com");

        given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .put(USER_ENDPOINT + "/" + nonExistentId)
        .then()
                .statusCode(404)
                .body("success", equalTo(false));
    }

    /**
     * Test: PUT /api/users/{id} - Update tanpa authentication
     *
     * Skenario:
     * 1. Update user tanpa JWT token
     * 2. Server response 401 Unauthorized
     */
    @Test
    @DisplayName("PUT /users/{id} - Should fail without authentication")
    void testUpdateUser_Unauthorized() {
        Map<String, String> request = new HashMap<>();
        request.put("fullName", "Updated Name");

        given()
                // No Authorization header
                .contentType(ContentType.JSON)
                .body(request)
        .when()
                .put(USER_ENDPOINT + "/" + testUserId)
        .then()
                .statusCode(401);
    }

    /**
     * Test: DELETE /api/users/{id} - Delete user
     *
     * Skenario:
     * 1. Delete user dengan JWT token
     * 2. Server response 200 OK
     * 3. User terhapus dari database
     */
    @Test
    @DisplayName("DELETE /users/{id} - Should delete user successfully")
    void testDeleteUser_Success() {
        // Create user baru untuk di-delete
        String emailToDelete = "apitest-user-delete@test.com";
        Map<String, String> createRequest = new HashMap<>();
        createRequest.put("email", emailToDelete);
        createRequest.put("fullName", "User to Delete");
        createRequest.put("password", "Test@1234");

        Long userIdToDelete = given()
                .header("Authorization", "Bearer " + authToken)
                .contentType(ContentType.JSON)
                .body(createRequest)
        .when()
                .post(USER_ENDPOINT)
        .then()
                .statusCode(201)
                .extract()
                .path("data.id");

        // Delete user
        given()
                .header("Authorization", "Bearer " + authToken)
        .when()
                .delete(USER_ENDPOINT + "/" + userIdToDelete)
        .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("message", equalTo("User deleted successfully"));

        // Verify user tidak ada di database
        assertFalse(userExistsInDatabase(emailToDelete));
    }

    /**
     * Test: DELETE /api/users/{id} - Delete non-existent user
     *
     * Skenario:
     * 1. Delete user dengan ID yang tidak ada
     * 2. Server response 404 Not Found
     */
    @Test
    @DisplayName("DELETE /users/{id} - Should return 404 for non-existent user")
    void testDeleteUser_NotFound() {
        Long nonExistentId = 999999L;

        given()
                .header("Authorization", "Bearer " + authToken)
        .when()
                .delete(USER_ENDPOINT + "/" + nonExistentId)
        .then()
                .statusCode(404)
                .body("success", equalTo(false));
    }

    /**
     * Test: DELETE /api/users/{id} - Delete tanpa authentication
     *
     * Skenario:
     * 1. Delete user tanpa JWT token
     * 2. Server response 401 Unauthorized
     */
    @Test
    @DisplayName("DELETE /users/{id} - Should fail without authentication")
    void testDeleteUser_Unauthorized() {
        given()
                // No Authorization header
        .when()
                .delete(USER_ENDPOINT + "/" + testUserId)
        .then()
                .statusCode(401);
    }
}
