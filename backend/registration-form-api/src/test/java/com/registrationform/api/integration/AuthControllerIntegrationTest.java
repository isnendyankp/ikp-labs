package com.registrationform.api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.registrationform.api.dto.LoginRequest;
import com.registrationform.api.dto.UserRegistrationRequest;
import com.registrationform.api.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration Tests untuk AuthController.
 *
 * Test ini menggunakan:
 * - Real PostgreSQL database via Testcontainers
 * - Real Spring Boot context (semua beans di-load)
 * - MockMvc untuk simulate HTTP requests
 * - @AutoConfigureMockMvc(addFilters = false)  // Disable security filters for simpler testing untuk auto-configure MockMvc
 *
 * Extends BaseIntegrationTest untuk:
 * - Automatic Testcontainers setup
 * - PostgreSQL container management
 * - Dynamic datasource configuration
 *
 * Test Coverage:
 * 1. POST /api/auth/register - Registration flow
 * 2. POST /api/auth/login - Login flow
 * 3. POST /api/auth/refresh - Token refresh
 * 4. POST /api/auth/validate - Token validation
 * 5. GET /api/auth/health - Health check
 *
 * @author Registration Form Team
 */
@AutoConfigureMockMvc(addFilters = false)  // Disable security filters for simpler testing
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    /**
     * Setup yang dijalankan sebelum SETIAP test method.
     * Clean database untuk isolasi test.
     */
    @BeforeEach
    void setUp() {
        // Clean database sebelum setiap test
        // Untuk isolasi: setiap test punya clean slate
        userRepository.deleteAll();
    }

    // ========================================================================
    // REGISTRATION TESTS
    // ========================================================================

    /**
     * Test: Registration dengan valid data harus return 201 Created.
     *
     * Scenario:
     * 1. User kirim POST /api/auth/register dengan data valid
     * 2. Backend validate input
     * 3. Backend save user ke database
     * 4. Backend generate JWT token
     * 5. Return 201 Created dengan token
     */
    @Test
    @Order(1)
    @DisplayName("POST /api/auth/register - Should register successfully with valid data")
    void testRegister_WithValidData_ShouldReturn201() throws Exception {
        // ARRANGE: Prepare test data
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setFullName("Integration Test User");
        request.setEmail("integration@test.com");
        request.setPassword("Test@1234");

        // ACT & ASSERT: Send request dan verify response
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andDo(print()) // Print request/response untuk debugging
                .andExpect(status().isCreated()) // Expect HTTP 201
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful")) // AuthService returns "Login successful" for both login and register
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value("integration@test.com"))
                .andExpect(jsonPath("$.fullName").value("Integration Test User"))
                .andExpect(jsonPath("$.userId").exists());
    }

    /**
     * Test: Registration dengan duplicate email harus return 400 Bad Request.
     */
    @Test
    @Order(2)
    @DisplayName("POST /api/auth/register - Should reject duplicate email")
    void testRegister_WithDuplicateEmail_ShouldReturn400() throws Exception {
        // ARRANGE: Register user pertama kali
        UserRegistrationRequest firstRequest = new UserRegistrationRequest();
        firstRequest.setFullName("First User");
        firstRequest.setEmail("duplicate@test.com");
        firstRequest.setPassword("Test@1234");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(firstRequest)))
                .andExpect(status().isCreated());

        // ACT: Try register dengan email yang sama
        UserRegistrationRequest duplicateRequest = new UserRegistrationRequest();
        duplicateRequest.setFullName("Second User");
        duplicateRequest.setEmail("duplicate@test.com"); // Same email!
        duplicateRequest.setPassword("Test@5678");

        // ASSERT: Harus ditolak
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andDo(print())
                .andExpect(status().isBadRequest()) // Expect HTTP 400
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message", containsString("already exists")));
    }

    /**
     * Test: Registration dengan invalid email format harus return 400.
     */
    @Test
    @Order(3)
    @DisplayName("POST /api/auth/register - Should reject invalid email format")
    void testRegister_WithInvalidEmail_ShouldReturn400() throws Exception {
        // ARRANGE: Request dengan email invalid
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setFullName("Test User");
        request.setEmail("invalid-email"); // No @ symbol
        request.setPassword("Test@1234");

        // ACT & ASSERT: Validation harus reject
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest()); // Bean Validation error
    }

    /**
     * Test: Registration dengan missing required fields harus return 400.
     */
    @Test
    @Order(4)
    @DisplayName("POST /api/auth/register - Should reject missing required fields")
    void testRegister_WithMissingFields_ShouldReturn400() throws Exception {
        // ARRANGE: Request dengan missing fields (no password)
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setFullName("Test User");
        request.setEmail("test@example.com");
        // password is null

        // ACT & ASSERT: Validation harus reject
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    // ========================================================================
    // LOGIN TESTS
    // ========================================================================

    /**
     * Test: Login dengan valid credentials harus return 200 OK dengan token.
     *
     * Scenario:
     * 1. Register user dulu
     * 2. Login dengan credentials yang sama
     * 3. Verify token di-generate
     */
    @Test
    @Order(5)
    @DisplayName("POST /api/auth/login - Should login successfully with valid credentials")
    void testLogin_WithValidCredentials_ShouldReturn200() throws Exception {
        // ARRANGE: Register user terlebih dahulu
        UserRegistrationRequest regRequest = new UserRegistrationRequest();
        regRequest.setFullName("Login Test User");
        regRequest.setEmail("login@test.com");
        regRequest.setPassword("Test@1234");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isCreated());

        // ACT: Login dengan credentials yang sama
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("login@test.com");
        loginRequest.setPassword("Test@1234");

        // ASSERT: Login should succeed
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(print())
                .andExpect(status().isOk()) // Expect HTTP 200
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value("login@test.com"))
                .andExpect(jsonPath("$.fullName").value("Login Test User"));
    }

    /**
     * Test: Login dengan wrong password harus return 401 Unauthorized.
     */
    @Test
    @Order(6)
    @DisplayName("POST /api/auth/login - Should reject wrong password")
    void testLogin_WithWrongPassword_ShouldReturn401() throws Exception {
        // ARRANGE: Register user
        UserRegistrationRequest regRequest = new UserRegistrationRequest();
        regRequest.setFullName("Auth Test User");
        regRequest.setEmail("auth@test.com");
        regRequest.setPassword("Test@1234");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isCreated());

        // ACT: Login dengan wrong password
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("auth@test.com");
        loginRequest.setPassword("WrongPassword@123"); // Wrong!

        // ASSERT: Login should fail
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(print())
                .andExpect(status().isUnauthorized()) // Expect HTTP 401
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message", containsString("Invalid")));
    }

    /**
     * Test: Login dengan non-existent email harus return 401.
     */
    @Test
    @Order(7)
    @DisplayName("POST /api/auth/login - Should reject non-existent email")
    void testLogin_WithNonExistentEmail_ShouldReturn401() throws Exception {
        // ARRANGE: Login request untuk user yang tidak ada
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@test.com");
        loginRequest.setPassword("Test@1234");

        // ACT & ASSERT: Login should fail
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(print())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    // ========================================================================
    // TOKEN REFRESH TESTS
    // ========================================================================

    /**
     * Test: Refresh token dengan valid token harus return new token.
     */
    @Test
    @Order(8)
    @DisplayName("POST /api/auth/refresh - Should refresh valid token")
    void testRefreshToken_WithValidToken_ShouldReturnNewToken() throws Exception {
        // ARRANGE: Register & login untuk dapat token
        UserRegistrationRequest regRequest = new UserRegistrationRequest();
        regRequest.setFullName("Refresh Test User");
        regRequest.setEmail("refresh@test.com");
        regRequest.setPassword("Test@1234");

        String responseJson = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract token dari response
        String token = objectMapper.readTree(responseJson).get("token").asText();

        // ACT: Refresh token
        mockMvc.perform(post("/api/auth/refresh")
                .param("token", token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    /**
     * Test: Refresh dengan invalid token harus return 401.
     */
    @Test
    @Order(9)
    @DisplayName("POST /api/auth/refresh - Should reject invalid token")
    void testRefreshToken_WithInvalidToken_ShouldReturn401() throws Exception {
        // ACT & ASSERT: Refresh dengan token invalid
        mockMvc.perform(post("/api/auth/refresh")
                .param("token", "invalid.token.here"))
                .andDo(print())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    // ========================================================================
    // TOKEN VALIDATION TESTS
    // ========================================================================

    /**
     * Test: Validate token dengan valid token dan email harus return valid=true.
     */
    @Test
    @Order(10)
    @DisplayName("POST /api/auth/validate - Should validate correct token")
    void testValidateToken_WithValidToken_ShouldReturnTrue() throws Exception {
        // ARRANGE: Register user untuk dapat token
        UserRegistrationRequest regRequest = new UserRegistrationRequest();
        regRequest.setFullName("Validate Test User");
        regRequest.setEmail("validate@test.com");
        regRequest.setPassword("Test@1234");

        String responseJson = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = objectMapper.readTree(responseJson).get("token").asText();

        // ACT: Validate token
        mockMvc.perform(post("/api/auth/validate")
                .param("token", token)
                .param("email", "validate@test.com"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.valid").value(true))
                .andExpect(jsonPath("$.message").value("Token is valid"));
    }

    /**
     * Test: Validate dengan invalid token harus return valid=false.
     */
    @Test
    @Order(11)
    @DisplayName("POST /api/auth/validate - Should reject invalid token")
    void testValidateToken_WithInvalidToken_ShouldReturnFalse() throws Exception {
        // ACT & ASSERT: Validate invalid token
        mockMvc.perform(post("/api/auth/validate")
                .param("token", "invalid.token")
                .param("email", "any@test.com"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(false));
    }

    // ========================================================================
    // HEALTH CHECK TEST
    // ========================================================================

    /**
     * Test: Health check endpoint harus return 200 OK.
     */
    @Test
    @Order(12)
    @DisplayName("GET /api/auth/health - Should return health status")
    void testHealthCheck_ShouldReturn200() throws Exception {
        // ACT & ASSERT: Health check
        mockMvc.perform(get("/api/auth/health"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("AuthController"))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.timestamp").exists());
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. Kenapa pakai MockMvc?
     *    - Simulate HTTP requests tanpa start real HTTP server
     *    - Lebih cepat dari TestRestTemplate
     *    - Test full Spring MVC stack (validation, serialization, etc.)
     *
     * 2. Kenapa @BeforeEach clean database?
     *    - Test isolation: setiap test independent
     *    - Avoid test order dependencies
     *    - Clean slate untuk setiap test
     *
     * 3. Integration Test vs Unit Test:
     *    - Integration: Test dengan real database, real Spring context
     *    - Unit: Test dengan mocks, isolated components
     *    - Integration test lebih slow tapi lebih reliable
     *
     * 4. Testcontainers Benefits:
     *    - Real PostgreSQL (not H2)
     *    - Production-like environment
     *    - Detect PostgreSQL-specific issues
     *
     * 5. Test Order (@Order annotation):
     *    - Order untuk readability/organization
     *    - Tests harus tetap independent (bisa run solo)
     *    - @BeforeEach ensure isolation
     */
}
