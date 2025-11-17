package com.registrationform.api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.registrationform.api.dto.UserRegistrationRequest;
import com.registrationform.api.dto.UserUpdateRequest;
import com.registrationform.api.entity.User;
import com.registrationform.api.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration Tests untuk UserController.
 *
 * Test Coverage:
 * 1. POST /api/users - Create user
 * 2. GET /api/users - Get all users
 * 3. GET /api/users/{id} - Get user by ID
 * 4. PUT /api/users/{id} - Update user
 * 5. DELETE /api/users/{id} - Delete user
 * 6. GET /api/users/email/{email} - Get user by email
 * 7. GET /api/users/check-email/{email} - Check email exists
 * 8. GET /api/users/count - Get user count
 *
 * Menggunakan:
 * - Real PostgreSQL via Testcontainers
 * - MockMvc untuk simulate HTTP requests
 * - @BeforeEach untuk clean database (test isolation)
 *
 * @author Registration Form Team
 */
@AutoConfigureMockMvc(addFilters = false)  // Disable security filters for simpler testing
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Clean database sebelum setiap test untuk isolasi.
     */
    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    // ========================================================================
    // CREATE USER TESTS (POST /api/users)
    // ========================================================================

    /**
     * Test: Create user dengan valid data harus return 201 Created.
     */
    @Test
    @Order(1)
    @DisplayName("POST /api/users - Should create user with valid data")
    void testCreateUser_WithValidData_ShouldReturn201() throws Exception {
        // ARRANGE
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setFullName("New User");
        request.setEmail("newuser@test.com");
        request.setPassword("Test@1234");

        // ACT & ASSERT
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.email").value("newuser@test.com"))
                .andExpect(jsonPath("$.fullName").value("New User"))
                .andExpect(jsonPath("$.password").doesNotExist()); // Password tidak boleh di-return
    }

    /**
     * Test: Create user dengan duplicate email harus return 400.
     */
    @Test
    @Order(2)
    @DisplayName("POST /api/users - Should reject duplicate email")
    void testCreateUser_WithDuplicateEmail_ShouldReturn400() throws Exception {
        // ARRANGE: Create user pertama
        User existingUser = new User("Existing User", "duplicate@test.com", passwordEncoder.encode("Pass@123"));
        userRepository.save(existingUser);

        // ACT: Try create dengan email yang sama
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setFullName("Another User");
        request.setEmail("duplicate@test.com"); // Same email!
        request.setPassword("Test@1234");

        // ASSERT
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    // ========================================================================
    // GET ALL USERS TESTS (GET /api/users)
    // ========================================================================

    /**
     * Test: Get all users harus return list users.
     */
    @Test
    @Order(3)
    @DisplayName("GET /api/users - Should return list of all users")
    void testGetAllUsers_ShouldReturnList() throws Exception {
        // ARRANGE: Create multiple users
        User user1 = new User("User One", "user1@test.com", passwordEncoder.encode("Pass@123"));
        User user2 = new User("User Two", "user2@test.com", passwordEncoder.encode("Pass@123"));
        userRepository.save(user1);
        userRepository.save(user2);

        // ACT & ASSERT
        mockMvc.perform(get("/api/users"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].email").value("user1@test.com"))
                .andExpect(jsonPath("$[1].email").value("user2@test.com"));
    }

    /**
     * Test: Get all users dengan empty database harus return empty list.
     */
    @Test
    @Order(4)
    @DisplayName("GET /api/users - Should return empty list when no users")
    void testGetAllUsers_WhenEmpty_ShouldReturnEmptyList() throws Exception {
        // Database already cleaned by @BeforeEach
        mockMvc.perform(get("/api/users"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    // ========================================================================
    // GET USER BY ID TESTS (GET /api/users/{id})
    // ========================================================================

    /**
     * Test: Get user by valid ID harus return user data.
     */
    @Test
    @Order(5)
    @DisplayName("GET /api/users/{id} - Should return user with valid ID")
    void testGetUserById_WithValidId_ShouldReturnUser() throws Exception {
        // ARRANGE: Create user
        User user = new User("Test User", "testuser@test.com", passwordEncoder.encode("Pass@123"));
        User savedUser = userRepository.save(user);

        // Generate JWT token untuk authentication
        String token = generateBearerToken(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName());

        // ACT & ASSERT
        mockMvc.perform(get("/api/users/" + savedUser.getId())
                .header("Authorization", token))  // Add JWT token
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedUser.getId()))
                .andExpect(jsonPath("$.email").value("testuser@test.com"))
                .andExpect(jsonPath("$.fullName").value("Test User"));
    }

    /**
     * Test: Get user by non-existent ID harus return 404.
     */
    @Test
    @Order(6)
    @DisplayName("GET /api/users/{id} - Should return 404 for non-existent ID")
    void testGetUserById_WithNonExistentId_ShouldReturn404() throws Exception {
        // ACT & ASSERT
        String dummyToken = generateBearerToken(1L, "dummy@test.com", "Dummy User");
        mockMvc.perform(get("/api/users/999999")
                .header("Authorization", dummyToken))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    // ========================================================================
    // UPDATE USER TESTS (PUT /api/users/{id})
    // ========================================================================

    /**
     * Test: Update user dengan valid data harus return updated user.
     */
    @Test
    @Order(7)
    @DisplayName("PUT /api/users/{id} - Should update user with valid data")
    void testUpdateUser_WithValidData_ShouldReturnUpdatedUser() throws Exception {
        // ARRANGE: Create user
        User user = new User("Original Name", "original@test.com", passwordEncoder.encode("Pass@123"));
        User savedUser = userRepository.save(user);

        // Prepare update request
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setFullName("Updated Name");
        updateRequest.setEmail("updated@test.com");

        // ACT & ASSERT
        String token = generateBearerToken(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName());
        mockMvc.perform(put("/api/users/" + savedUser.getId())
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedUser.getId()))
                .andExpect(jsonPath("$.fullName").value("Updated Name"))
                .andExpect(jsonPath("$.email").value("updated@test.com"));
    }

    /**
     * Test: Update dengan non-existent ID harus return 400.
     */
    @Test
    @Order(8)
    @DisplayName("PUT /api/users/{id} - Should return 400 for non-existent ID")
    void testUpdateUser_WithNonExistentId_ShouldReturn400() throws Exception {
        // ARRANGE
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setFullName("Test Name");

        // ACT & ASSERT
        String dummyToken = generateBearerToken(1L, "dummy@test.com", "Dummy User");
        mockMvc.perform(put("/api/users/999999")
                .header("Authorization", dummyToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    /**
     * Test: Update dengan duplicate email harus return 400.
     */
    @Test
    @Order(9)
    @DisplayName("PUT /api/users/{id} - Should reject duplicate email on update")
    void testUpdateUser_WithDuplicateEmail_ShouldReturn400() throws Exception {
        // ARRANGE: Create two users
        User user1 = new User("User 1", "user1@test.com", passwordEncoder.encode("Pass@123"));
        User user2 = new User("User 2", "user2@test.com", passwordEncoder.encode("Pass@123"));
        userRepository.save(user1);
        User savedUser2 = userRepository.save(user2);

        // Try update user2's email to user1's email
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setEmail("user1@test.com"); // Duplicate!

        // ACT & ASSERT
        String token = generateBearerToken(savedUser2.getId(), savedUser2.getEmail(), savedUser2.getFullName());
        mockMvc.perform(put("/api/users/" + savedUser2.getId())
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    // ========================================================================
    // DELETE USER TESTS (DELETE /api/users/{id})
    // ========================================================================

    /**
     * Test: Delete user dengan valid ID harus return 200 OK.
     */
    @Test
    @Order(10)
    @DisplayName("DELETE /api/users/{id} - Should delete user with valid ID")
    void testDeleteUser_WithValidId_ShouldReturn200() throws Exception {
        // ARRANGE: Create user
        User user = new User("Delete Me", "delete@test.com", passwordEncoder.encode("Pass@123"));
        User savedUser = userRepository.save(user);

        // ACT & ASSERT: Delete user
        String token = generateBearerToken(savedUser.getId(), savedUser.getEmail(), savedUser.getFullName());
        mockMvc.perform(delete("/api/users/" + savedUser.getId())
                .header("Authorization", token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("berhasil dihapus")));

        // Verify user deleted dari database
        mockMvc.perform(get("/api/users/" + savedUser.getId())
                .header("Authorization", token))
                .andExpect(status().isNotFound());
    }

    /**
     * Test: Delete dengan non-existent ID harus return 404.
     */
    @Test
    @Order(11)
    @DisplayName("DELETE /api/users/{id} - Should return 404 for non-existent ID")
    void testDeleteUser_WithNonExistentId_ShouldReturn404() throws Exception {
        // ACT & ASSERT
        String dummyToken = generateBearerToken(1L, "dummy@test.com", "Dummy User");
        mockMvc.perform(delete("/api/users/999999")
                .header("Authorization", dummyToken))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andExpect(content().string(containsString("tidak ditemukan")));
    }

    // ========================================================================
    // GET USER BY EMAIL TESTS (GET /api/users/email/{email})
    // ========================================================================

    /**
     * Test: Get user by valid email harus return user data.
     */
    @Test
    @Order(12)
    @DisplayName("GET /api/users/email/{email} - Should return user with valid email")
    void testGetUserByEmail_WithValidEmail_ShouldReturnUser() throws Exception {
        // ARRANGE
        User user = new User("Email Test", "emailtest@test.com", passwordEncoder.encode("Pass@123"));
        userRepository.save(user);

        // ACT & ASSERT
        String token = generateBearerToken(user.getId(), user.getEmail(), user.getFullName());
        mockMvc.perform(get("/api/users/email/emailtest@test.com")
                .header("Authorization", token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("emailtest@test.com"))
                .andExpect(jsonPath("$.fullName").value("Email Test"));
    }

    /**
     * Test: Get user by non-existent email harus return 404.
     */
    @Test
    @Order(13)
    @DisplayName("GET /api/users/email/{email} - Should return 404 for non-existent email")
    void testGetUserByEmail_WithNonExistentEmail_ShouldReturn404() throws Exception {
        // ACT & ASSERT
        String dummyToken = generateBearerToken(1L, "dummy@test.com", "Dummy User");
        mockMvc.perform(get("/api/users/email/nonexistent@test.com")
                .header("Authorization", dummyToken))
                .andDo(print())
                .andExpect(status().isNotFound());
    }

    // ========================================================================
    // CHECK EMAIL EXISTS TESTS (GET /api/users/check-email/{email})
    // ========================================================================

    /**
     * Test: Check email dengan existing email harus return true.
     */
    @Test
    @Order(14)
    @DisplayName("GET /api/users/check-email/{email} - Should return true for existing email")
    void testCheckEmailExists_WithExistingEmail_ShouldReturnTrue() throws Exception {
        // ARRANGE
        User user = new User("Check Email", "check@test.com", passwordEncoder.encode("Pass@123"));
        userRepository.save(user);

        // ACT & ASSERT
        String token = generateBearerToken(user.getId(), user.getEmail(), user.getFullName());
        mockMvc.perform(get("/api/users/check-email/check@test.com")
                .header("Authorization", token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }

    /**
     * Test: Check email dengan non-existent email harus return false.
     */
    @Test
    @Order(15)
    @DisplayName("GET /api/users/check-email/{email} - Should return false for non-existent email")
    void testCheckEmailExists_WithNonExistentEmail_ShouldReturnFalse() throws Exception {
        // ACT & ASSERT
        String dummyToken = generateBearerToken(1L, "dummy@test.com", "Dummy User");
        mockMvc.perform(get("/api/users/check-email/notexist@test.com")
                .header("Authorization", dummyToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("false"));
    }

    // ========================================================================
    // GET USER COUNT TESTS (GET /api/users/count)
    // ========================================================================

    /**
     * Test: Get user count harus return correct count.
     */
    @Test
    @Order(16)
    @DisplayName("GET /api/users/count - Should return correct user count")
    void testGetUserCount_ShouldReturnCorrectCount() throws Exception {
        // ARRANGE: Create 3 users
        userRepository.save(new User("Count 1", "count1@test.com", passwordEncoder.encode("Pass@123")));
        userRepository.save(new User("Count 2", "count2@test.com", passwordEncoder.encode("Pass@123")));
        userRepository.save(new User("Count 3", "count3@test.com", passwordEncoder.encode("Pass@123")));

        // ACT & ASSERT
        String dummyToken = generateBearerToken(1L, "dummy@test.com", "Dummy User");
        mockMvc.perform(get("/api/users/count")
                .header("Authorization", dummyToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("3"));
    }

    /**
     * Test: Get user count dengan empty database harus return 0.
     */
    @Test
    @Order(17)
    @DisplayName("GET /api/users/count - Should return 0 when no users")
    void testGetUserCount_WhenEmpty_ShouldReturnZero() throws Exception {
        // Database already clean
        String dummyToken = generateBearerToken(1L, "dummy@test.com", "Dummy User");
        mockMvc.perform(get("/api/users/count")
                .header("Authorization", dummyToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("0"));
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. Test Organization:
     *    - Grouped by endpoint untuk readability
     *    - Ordered tests untuk logical flow
     *    - Comprehensive coverage semua scenarios
     *
     * 2. Test Data Management:
     *    - @BeforeEach clean database (isolation)
     *    - PasswordEncoder untuk hash password
     *    - Save test users via repository
     *
     * 3. Assertions:
     *    - Status codes (200, 201, 400, 404)
     *    - Response JSON structure
     *    - Response content values
     *    - Database state verification
     *
     * 4. Best Practices:
     *    - AAA pattern (Arrange-Act-Assert)
     *    - Descriptive test names
     *    - Independent tests
     *    - Real database via Testcontainers
     */
}
