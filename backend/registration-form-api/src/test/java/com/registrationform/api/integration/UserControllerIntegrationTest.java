package com.registrationform.api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.registrationform.api.dto.UserRegistrationRequest;
import com.registrationform.api.dto.UserUpdateRequest;
import com.registrationform.api.entity.User;
import com.registrationform.api.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration Tests untuk UserController.
 *
 * DEFINISI INTEGRATION TEST (Per Senior's Definition):
 * =====================================================
 * Integration test = Test INTERAKSI antar component dalam Spring Container SAJA
 * - Test bagaimana Controller, Service, dan Repository components berinteraksi
 * - TIDAK test database (database = external system)
 * - Mock external dependencies (UserRepository)
 * - Focus pada component wiring dan communication
 *
 * Test ini menggunakan:
 * - @SpringBootTest - Load full Spring context dengan semua beans
 * - @AutoConfigureMockMvc - Configure MockMvc untuk simulate HTTP requests
 * - @MockBean UserRepository - Mock database layer (external system)
 * - MockMvc - Simulate HTTP tanpa real server
 * - Mockito verify() - Verify component interactions
 *
 * YANG DIHAPUS (Karena bukan Integration Test):
 * - Testcontainers (database testing → pindah ke API test)
 * - AbstractIntegrationTest dependency
 * - Database operations (deleteAll, save, etc.)
 * - Database verifications
 *
 * YANG DITAMBAH:
 * - @MockBean untuk UserRepository
 * - Mock setup untuk repository behavior
 * - verify() untuk validasi interactions
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
 * @author Registration Form Team
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)  // Disable security filters for simpler testing
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.registrationform.api.security.JwtUtil jwtUtil;

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
     * Reset mock state sebelum setiap test untuk isolasi.
     */
    @BeforeEach
    void setUp() {
        reset(userRepository);
    }

    // ========================================================================
    // CREATE USER TESTS (POST /api/users)
    // ========================================================================

    /**
     * Test: Create user dengan valid data harus return 201 Created.
     *
     * INTEGRATION TEST FOCUS:
     * - Test Controller → Service → Repository interaction
     * - Mock repository.save() behavior
     * - Verify repository method dipanggil
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

        // Mock: Email tidak exist (UserService uses existsByEmail!)
        when(userRepository.existsByEmail("newuser@test.com")).thenReturn(false);

        // Mock: Save berhasil
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

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

        // VERIFY: Repository interactions
        verify(userRepository).existsByEmail("newuser@test.com");
        verify(userRepository).save(any(User.class));
    }

    /**
     * Test: Create user dengan duplicate email harus return 400.
     *
     * INTEGRATION TEST FOCUS:
     * - Test duplicate email validation
     * - Mock existsByEmail returns true
     * - Verify save() TIDAK dipanggil
     */
    @Test
    @Order(2)
    @DisplayName("POST /api/users - Should reject duplicate email")
    void testCreateUser_WithDuplicateEmail_ShouldReturn400() throws Exception {
        // ARRANGE: Mock email already exists (UserService uses existsByEmail!)
        when(userRepository.existsByEmail("duplicate@test.com")).thenReturn(true);

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

        // VERIFY: existsByEmail called, save NOT called
        verify(userRepository).existsByEmail("duplicate@test.com");
        verify(userRepository, never()).save(any(User.class));
    }

    // ========================================================================
    // GET ALL USERS TESTS (GET /api/users)
    // ========================================================================

    /**
     * Test: Get all users harus return list users.
     *
     * INTEGRATION TEST FOCUS:
     * - Test Controller → Service → Repository.findAll()
     * - Mock repository returns list of users
     */
    @Test
    @Order(3)
    @DisplayName("GET /api/users - Should return list of all users")
    void testGetAllUsers_ShouldReturnList() throws Exception {
        // ARRANGE: Mock multiple users
        User user1 = new User("User One", "user1@test.com", passwordEncoder.encode("Pass@123"));
        user1.setId(1L);
        User user2 = new User("User Two", "user2@test.com", passwordEncoder.encode("Pass@123"));
        user2.setId(2L);

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        // ACT & ASSERT
        mockMvc.perform(get("/api/users"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].email").value("user1@test.com"))
                .andExpect(jsonPath("$[1].email").value("user2@test.com"));

        // VERIFY: Repository interaction
        verify(userRepository).findAll();
    }

    /**
     * Test: Get all users dengan empty database harus return empty list.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock findAll returns empty list
     */
    @Test
    @Order(4)
    @DisplayName("GET /api/users - Should return empty list when no users")
    void testGetAllUsers_WhenEmpty_ShouldReturnEmptyList() throws Exception {
        // ARRANGE: Mock empty list
        when(userRepository.findAll()).thenReturn(Collections.emptyList());

        // ACT & ASSERT
        mockMvc.perform(get("/api/users"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));

        // VERIFY
        verify(userRepository).findAll();
    }

    // ========================================================================
    // GET USER BY ID TESTS (GET /api/users/{id})
    // ========================================================================

    /**
     * Test: Get user by valid ID harus return user data.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock repository.findById() returns user
     */
    @Test
    @Order(5)
    @DisplayName("GET /api/users/{id} - Should return user with valid ID")
    void testGetUserById_WithValidId_ShouldReturnUser() throws Exception {
        // ARRANGE: Mock user
        User mockUser = new User("Test User", "testuser@test.com", passwordEncoder.encode("Pass@123"));
        mockUser.setId(1L);

        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        // Generate JWT token untuk authentication
        String token = generateBearerToken(1L, "testuser@test.com", "Test User");

        // ACT & ASSERT
        mockMvc.perform(get("/api/users/1")
                .header("Authorization", token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("testuser@test.com"))
                .andExpect(jsonPath("$.fullName").value("Test User"));

        // VERIFY
        verify(userRepository).findById(1L);
    }

    /**
     * Test: Get user by non-existent ID harus return 404.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock findById returns empty
     */
    @Test
    @Order(6)
    @DisplayName("GET /api/users/{id} - Should return 404 for non-existent ID")
    void testGetUserById_WithNonExistentId_ShouldReturn404() throws Exception {
        // ARRANGE: Mock user not found
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // ACT & ASSERT
        String dummyToken = generateBearerToken(1L, "dummy@test.com", "Dummy User");
        mockMvc.perform(get("/api/users/999")
                .header("Authorization", dummyToken))
                .andDo(print())
                .andExpect(status().isNotFound());

        // VERIFY
        verify(userRepository).findById(999L);
    }

    // ========================================================================
    // UPDATE USER TESTS (PUT /api/users/{id})
    // ========================================================================

    /**
     * Test: Update user dengan valid data harus return updated user.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock findById returns existing user
     * - Mock existsByEmail returns false (email available)
     * - Mock save returns updated user
     * - Verify all repository interactions
     */
    @Test
    @Order(7)
    @DisplayName("PUT /api/users/{id} - Should update user with valid data")
    void testUpdateUser_WithValidData_ShouldReturnUpdatedUser() throws Exception {
        // ARRANGE: Mock existing user
        User existingUser = new User("Original Name", "original@test.com", passwordEncoder.encode("Pass@123"));
        existingUser.setId(1L);

        // Mock: findById returns existing user
        when(userRepository.findById(1L)).thenReturn(Optional.of(existingUser));

        // Mock: existsByEmail for new email (email available)
        when(userRepository.existsByEmail("updated@test.com")).thenReturn(false);

        // Mock: save returns updated user
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            // Update dilakukan di service, save returns the user
            return user;
        });

        // Prepare update request
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setFullName("Updated Name");
        updateRequest.setEmail("updated@test.com");

        // ACT & ASSERT
        String token = generateBearerToken(1L, "original@test.com", "Original Name");
        mockMvc.perform(put("/api/users/1")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.fullName").value("Updated Name"))
                .andExpect(jsonPath("$.email").value("updated@test.com"));

        // VERIFY: Repository interactions
        verify(userRepository).findById(1L);
        verify(userRepository).existsByEmail("updated@test.com");
        verify(userRepository).save(any(User.class));
    }

    /**
     * Test: Update dengan non-existent ID harus return 400.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock findById returns empty
     * - Verify save NOT called
     */
    @Test
    @Order(8)
    @DisplayName("PUT /api/users/{id} - Should return 400 for non-existent ID")
    void testUpdateUser_WithNonExistentId_ShouldReturn400() throws Exception {
        // ARRANGE: Mock user not found
        when(userRepository.findById(999999L)).thenReturn(Optional.empty());

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

        // VERIFY: findById called, save NOT called
        verify(userRepository).findById(999999L);
        verify(userRepository, never()).save(any(User.class));
    }

    /**
     * Test: Update dengan duplicate email harus return 400.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock findById returns user
     * - Mock existsByEmail returns true (email already taken)
     * - Verify save NOT called
     */
    @Test
    @Order(9)
    @DisplayName("PUT /api/users/{id} - Should reject duplicate email on update")
    void testUpdateUser_WithDuplicateEmail_ShouldReturn400() throws Exception {
        // ARRANGE: Mock existing user2
        User user2 = new User("User 2", "user2@test.com", passwordEncoder.encode("Pass@123"));
        user2.setId(2L);

        // Mock: User 2 exists
        when(userRepository.findById(2L)).thenReturn(Optional.of(user2));

        // Mock: user1@test.com already exists (taken by another user)
        when(userRepository.existsByEmail("user1@test.com")).thenReturn(true);

        // Try update user2's email to user1's email
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setEmail("user1@test.com"); // Duplicate!

        // ACT & ASSERT
        String token = generateBearerToken(2L, "user2@test.com", "User 2");
        mockMvc.perform(put("/api/users/2")
                .header("Authorization", token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andDo(print())
                .andExpect(status().isBadRequest());

        // VERIFY: findById and existsByEmail called, save NOT called
        verify(userRepository).findById(2L);
        verify(userRepository).existsByEmail("user1@test.com");
        verify(userRepository, never()).save(any(User.class));
    }

    // ========================================================================
    // DELETE USER TESTS (DELETE /api/users/{id})
    // ========================================================================

    /**
     * Test: Delete user dengan valid ID harus return 200 OK.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock existsById returns true
     * - Mock deleteById (void method)
     * - Verify repository interactions
     */
    @Test
    @Order(10)
    @DisplayName("DELETE /api/users/{id} - Should delete user with valid ID")
    void testDeleteUser_WithValidId_ShouldReturn200() throws Exception {
        // ARRANGE: Mock user exists (UserService uses existsById!)
        when(userRepository.existsById(1L)).thenReturn(true);

        // Mock: deleteById (void method - no return value needed)
        doNothing().when(userRepository).deleteById(1L);

        // ACT & ASSERT: Delete user
        String token = generateBearerToken(1L, "delete@test.com", "Delete Me");
        mockMvc.perform(delete("/api/users/1")
                .header("Authorization", token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("berhasil dihapus")));

        // VERIFY: Repository interactions
        verify(userRepository).existsById(1L);
        verify(userRepository).deleteById(1L);
    }

    /**
     * Test: Delete dengan non-existent ID harus return 404.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock existsById returns false
     * - Verify deleteById NOT called
     */
    @Test
    @Order(11)
    @DisplayName("DELETE /api/users/{id} - Should return 404 for non-existent ID")
    void testDeleteUser_WithNonExistentId_ShouldReturn404() throws Exception {
        // ARRANGE: Mock user not found (UserService uses existsById!)
        when(userRepository.existsById(999999L)).thenReturn(false);

        // ACT & ASSERT
        String dummyToken = generateBearerToken(1L, "dummy@test.com", "Dummy User");
        mockMvc.perform(delete("/api/users/999999")
                .header("Authorization", dummyToken))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andExpect(content().string(containsString("tidak ditemukan")));

        // VERIFY: existsById called, deleteById NOT called
        verify(userRepository).existsById(999999L);
        verify(userRepository, never()).deleteById(999999L);
    }

    // ========================================================================
    // GET USER BY EMAIL TESTS (GET /api/users/email/{email})
    // ========================================================================

    /**
     * Test: Get user by valid email harus return user data.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock findByEmail returns user
     * - Verify repository interaction
     */
    @Test
    @Order(12)
    @DisplayName("GET /api/users/email/{email} - Should return user with valid email")
    void testGetUserByEmail_WithValidEmail_ShouldReturnUser() throws Exception {
        // ARRANGE: Mock user
        User user = new User("Email Test", "emailtest@test.com", passwordEncoder.encode("Pass@123"));
        user.setId(1L);

        // Mock: findByEmail returns user
        when(userRepository.findByEmail("emailtest@test.com")).thenReturn(Optional.of(user));

        // ACT & ASSERT
        String token = generateBearerToken(1L, "emailtest@test.com", "Email Test");
        mockMvc.perform(get("/api/users/email/emailtest@test.com")
                .header("Authorization", token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("emailtest@test.com"))
                .andExpect(jsonPath("$.fullName").value("Email Test"));

        // VERIFY: Repository interaction
        verify(userRepository).findByEmail("emailtest@test.com");
    }

    /**
     * Test: Get user by non-existent email harus return 404.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock findByEmail returns empty
     */
    @Test
    @Order(13)
    @DisplayName("GET /api/users/email/{email} - Should return 404 for non-existent email")
    void testGetUserByEmail_WithNonExistentEmail_ShouldReturn404() throws Exception {
        // ARRANGE: Mock email not found
        when(userRepository.findByEmail("nonexistent@test.com")).thenReturn(Optional.empty());

        // ACT & ASSERT
        String dummyToken = generateBearerToken(1L, "dummy@test.com", "Dummy User");
        mockMvc.perform(get("/api/users/email/nonexistent@test.com")
                .header("Authorization", dummyToken))
                .andDo(print())
                .andExpect(status().isNotFound());

        // VERIFY: Repository interaction
        verify(userRepository).findByEmail("nonexistent@test.com");
    }

    // ========================================================================
    // CHECK EMAIL EXISTS TESTS (GET /api/users/check-email/{email})
    // ========================================================================

    /**
     * Test: Check email dengan existing email harus return true.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock existsByEmail returns true
     * - Verify repository interaction
     */
    @Test
    @Order(14)
    @DisplayName("GET /api/users/check-email/{email} - Should return true for existing email")
    void testCheckEmailExists_WithExistingEmail_ShouldReturnTrue() throws Exception {
        // ARRANGE: Mock email exists
        when(userRepository.existsByEmail("check@test.com")).thenReturn(true);

        // ACT & ASSERT
        String token = generateBearerToken(1L, "check@test.com", "Check Email");
        mockMvc.perform(get("/api/users/check-email/check@test.com")
                .header("Authorization", token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("true"));

        // VERIFY: Repository interaction
        verify(userRepository).existsByEmail("check@test.com");
    }

    /**
     * Test: Check email dengan non-existent email harus return false.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock existsByEmail returns false
     * - Verify repository interaction
     */
    @Test
    @Order(15)
    @DisplayName("GET /api/users/check-email/{email} - Should return false for non-existent email")
    void testCheckEmailExists_WithNonExistentEmail_ShouldReturnFalse() throws Exception {
        // ARRANGE: Mock email not exists
        when(userRepository.existsByEmail("notexist@test.com")).thenReturn(false);

        // ACT & ASSERT
        String dummyToken = generateBearerToken(1L, "dummy@test.com", "Dummy User");
        mockMvc.perform(get("/api/users/check-email/notexist@test.com")
                .header("Authorization", dummyToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("false"));

        // VERIFY: Repository interaction
        verify(userRepository).existsByEmail("notexist@test.com");
    }

    // ========================================================================
    // GET USER COUNT TESTS (GET /api/users/count)
    // ========================================================================

    /**
     * Test: Get user count harus return correct count.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock count returns 3
     * - Verify repository interaction
     */
    @Test
    @Order(16)
    @DisplayName("GET /api/users/count - Should return correct user count")
    void testGetUserCount_ShouldReturnCorrectCount() throws Exception {
        // ARRANGE: Mock count = 3
        when(userRepository.count()).thenReturn(3L);

        // ACT & ASSERT
        String dummyToken = generateBearerToken(1L, "dummy@test.com", "Dummy User");
        mockMvc.perform(get("/api/users/count")
                .header("Authorization", dummyToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("3"));

        // VERIFY: Repository interaction
        verify(userRepository).count();
    }

    /**
     * Test: Get user count dengan empty database harus return 0.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock count returns 0
     * - Verify repository interaction
     */
    @Test
    @Order(17)
    @DisplayName("GET /api/users/count - Should return 0 when no users")
    void testGetUserCount_WhenEmpty_ShouldReturnZero() throws Exception {
        // ARRANGE: Mock count = 0
        when(userRepository.count()).thenReturn(0L);

        // ACT & ASSERT
        String dummyToken = generateBearerToken(1L, "dummy@test.com", "Dummy User");
        mockMvc.perform(get("/api/users/count")
                .header("Authorization", dummyToken))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string("0"));

        // VERIFY: Repository interaction
        verify(userRepository).count();
    }

    /**
     * NOTES UNTUK PEMAHAMAN (PEMULA):
     * ================================
     *
     * 1. INTEGRATION TEST VS DATABASE TEST:
     *    - Integration Test = Test INTERAKSI antar components (Controller → Service → Repository)
     *    - Database Test = Test dengan real database (pindah ke API test layer)
     *    - Integration test TIDAK butuh database real/Testcontainers
     *    - Focus: Verify component wiring works correctly
     *
     * 2. MOCK vs REAL DATABASE:
     *    - @MockBean = Mock object yang simulate repository behavior
     *    - when().thenReturn() = Setup mock behavior
     *    - verify() = Verify repository method dipanggil dengan benar
     *    - Benefit: Fast, isolated, no database dependency
     *
     * 3. TEST ORGANIZATION:
     *    - Grouped by endpoint (CREATE, GET ALL, GET BY ID, UPDATE, DELETE, etc.)
     *    - @Order untuk run tests dalam urutan logis
     *    - @DisplayName untuk descriptive test names
     *    - AAA pattern: Arrange (setup mocks) → Act (HTTP call) → Assert (verify response + interactions)
     *
     * 4. MOCK SETUP PATTERNS:
     *    a. Mock returns data:
     *       when(userRepository.findById(1L)).thenReturn(Optional.of(user));
     *
     *    b. Mock returns empty:
     *       when(userRepository.findById(999L)).thenReturn(Optional.empty());
     *
     *    c. Mock save with ID assignment:
     *       when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
     *           User user = invocation.getArgument(0);
     *           user.setId(1L);
     *           return user;
     *       });
     *
     *    d. Mock void method:
     *       doNothing().when(userRepository).deleteById(1L);
     *
     * 5. VERIFICATION PATTERNS:
     *    a. Verify method called:
     *       verify(userRepository).findById(1L);
     *
     *    b. Verify method NOT called:
     *       verify(userRepository, never()).save(any(User.class));
     *
     *    c. Verify multiple interactions:
     *       verify(userRepository).findById(1L);
     *       verify(userRepository).save(any(User.class));
     *
     * 6. TESTING CHECKLIST PER TEST:
     *    ✓ Setup mocks dengan when()
     *    ✓ Perform HTTP request dengan MockMvc
     *    ✓ Assert HTTP status code
     *    ✓ Assert response body (JSON structure & values)
     *    ✓ Verify repository interactions dengan verify()
     *
     * 7. ISOLATION:
     *    - @BeforeEach reset(userRepository) → Reset mock state setiap test
     *    - Setiap test independent → Bisa run solo tanpa depend on other tests
     *    - No database cleanup needed → Karena pakai mock!
     *
     * 8. KENAPA PATTERN INI BAGUS:
     *    - Fast execution (no real database)
     *    - Predictable results (no database state issues)
     *    - Focus on component interaction
     *    - Easy to test edge cases (mock any scenario)
     *    - No Testcontainers overhead (no Docker needed)
     *
     * 9. DATABASE TESTING MOVED TO:
     *    - API Test Layer (Day 8 - akan dibuat nanti)
     *    - API tests akan test dengan real database (PostgreSQL)
     *    - API tests verify data persistence, constraints, transactions
     *
     * 10. TOOLS USED:
     *     - @SpringBootTest → Load full Spring context
     *     - @AutoConfigureMockMvc → Enable MockMvc
     *     - @MockBean → Mock external dependencies
     *     - MockMvc → Simulate HTTP requests
     *     - Mockito when() → Setup mock behavior
     *     - Mockito verify() → Verify interactions
     */
}
