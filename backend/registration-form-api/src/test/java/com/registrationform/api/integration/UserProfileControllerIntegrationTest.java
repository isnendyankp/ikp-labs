package com.registrationform.api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.registrationform.api.dto.UserRegistrationRequest;
import com.registrationform.api.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration Tests untuk UserProfileController.
 *
 * DEFINISI INTEGRATION TEST (Per Senior's Definition):
 * =====================================================
 * Integration test = Test INTERAKSI antar component dalam Spring Container SAJA
 * - Test bagaimana Controller, Service, dan Repository components berinteraksi
 * - TIDAK test database (database = external system)
 * - Mock external dependencies (UserRepository)
 * - Focus pada JWT authentication filter integration dengan Spring Security
 *
 * Test ini menggunakan:
 * - @SpringBootTest - Load full Spring context dengan semua beans
 * - @AutoConfigureMockMvc - Enable security filters untuk test JWT authentication
 * - @MockBean UserRepository - Mock database layer
 * - MockMvc - Simulate HTTP requests
 * - Real JWT authentication filter - Verify integration dengan Spring Security
 *
 * YANG DIHAPUS (Karena bukan Integration Test):
 * - extends AbstractIntegrationTest (Testcontainers dependency)
 * - Database operations (deleteAll, save)
 * - Database verifications
 *
 * YANG DITAMBAH:
 * - @SpringBootTest and @MockBean
 * - Mock setup untuk repository behavior
 * - verify() untuk validasi interactions
 *
 * Test Coverage:
 * 1. GET /api/user/profile - Protected endpoint untuk user profile
 * 2. GET /api/user/dashboard - Protected endpoint untuk dashboard
 * 3. GET /api/user/settings - Protected endpoint untuk settings
 * 4. Authentication failures (no token, invalid token)
 * 5. JWT token extraction dan validation
 *
 * Test Strategy:
 * - Mock user registration → Generate JWT token → Use token for protected endpoints
 * - Test both success scenarios (with valid token) dan error scenarios (no token/invalid token)
 * - Verify JWT authentication filter integration dengan Spring Security
 *
 * @author Registration Form Team
 */
@SpringBootTest
@AutoConfigureMockMvc  // Enable security filters to test JWT authentication
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserProfileControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserRepository userRepository;

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

    /**
     * Helper method: Mock user registration dan return JWT token.
     * Reusable untuk semua tests yang butuh authenticated user.
     *
     * INTEGRATION TEST APPROACH:
     * - Mock repository behavior (findByEmail, save)
     * - Perform real HTTP request through MockMvc
     * - Extract JWT token from response
     *
     * NOTE: AuthService uses findByEmail(), not existsByEmail()!
     */
    private String registerUserAndGetToken(String email, String fullName) throws Exception {
        // ARRANGE: Mock repository untuk registration
        // Mock: Email belum exist (AuthService uses findByEmail!)
        when(userRepository.findByEmail(email))
                .thenReturn(java.util.Optional.empty())  // First call during registration
                .thenAnswer(invocation -> {
                    // Subsequent calls dari JWT filter - return saved user
                    com.registrationform.api.entity.User savedUser = new com.registrationform.api.entity.User(fullName, email, "$2a$10$encodedPassword");
                    savedUser.setId(1L);
                    return java.util.Optional.of(savedUser);
                });

        // Mock: Save user berhasil
        when(userRepository.save(any())).thenAnswer(invocation -> {
            com.registrationform.api.entity.User user = invocation.getArgument(0);
            if (user != null) {
                user.setId(1L);
            }
            return user;
        });

        // ACT: Register user via HTTP request
        UserRegistrationRequest regRequest = new UserRegistrationRequest();
        regRequest.setFullName(fullName);
        regRequest.setEmail(email);
        regRequest.setPassword("Test@1234");

        String responseJson = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract token dari response
        return objectMapper.readTree(responseJson).get("token").asText();
    }

    // ========================================================================
    // GET /api/user/profile TESTS
    // ========================================================================

    /**
     * Test: Access protected endpoint dengan valid JWT token harus succeed.
     *
     * Scenario:
     * 1. Register user dan dapat JWT token
     * 2. Use token untuk access /api/user/profile
     * 3. Verify response contains user info dari token
     */
    @Test
    @Order(1)
    @DisplayName("GET /api/user/profile - Should return profile with valid JWT token")
    void testGetProfile_WithValidToken_ShouldReturn200() throws Exception {
        // ARRANGE: Register user dan dapat token
        String token = registerUserAndGetToken("profile@test.com", "Profile Test User");

        // ACT & ASSERT: Access protected endpoint dengan token
        mockMvc.perform(get("/api/user/profile")
                .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message", containsString("retrieved successfully")))
                .andExpect(jsonPath("$.user").exists())
                .andExpect(jsonPath("$.user.id").exists())
                .andExpect(jsonPath("$.user.email").value("profile@test.com"))
                .andExpect(jsonPath("$.user.fullName").value("Profile Test User"))
                .andExpect(jsonPath("$.user.username").exists())
                .andExpect(jsonPath("$.timestamp").exists());
    }

    /**
     * Test: Access protected endpoint tanpa token harus return 403 Forbidden.
     *
     * Spring Security akan block request sebelum sampai controller.
     */
    @Test
    @Order(2)
    @DisplayName("GET /api/user/profile - Should return 403 without token")
    void testGetProfile_WithoutToken_ShouldReturn403() throws Exception {
        // ACT & ASSERT: Access tanpa Authorization header
        mockMvc.perform(get("/api/user/profile"))
                .andDo(print())
                .andExpect(status().isForbidden()); // Spring Security blocks
    }

    /**
     * Test: Access dengan invalid/malformed token harus return 403.
     */
    @Test
    @Order(3)
    @DisplayName("GET /api/user/profile - Should return 403 with invalid token")
    void testGetProfile_WithInvalidToken_ShouldReturn403() throws Exception {
        // ACT & ASSERT: Access dengan invalid token
        mockMvc.perform(get("/api/user/profile")
                .header("Authorization", "Bearer invalid.token.here"))
                .andDo(print())
                .andExpect(status().isForbidden()); // JWT validation fails
    }

    /**
     * Test: Access dengan Bearer keyword missing harus return 403.
     */
    @Test
    @Order(4)
    @DisplayName("GET /api/user/profile - Should return 403 without Bearer prefix")
    void testGetProfile_WithoutBearerPrefix_ShouldReturn403() throws Exception {
        // ARRANGE: Get valid token tapi tidak pakai "Bearer " prefix
        String token = registerUserAndGetToken("bearer@test.com", "Bearer Test User");

        // ACT & ASSERT: Authorization header tanpa "Bearer " prefix
        mockMvc.perform(get("/api/user/profile")
                .header("Authorization", token)) // Missing "Bearer " prefix!
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    // ========================================================================
    // GET /api/user/dashboard TESTS
    // ========================================================================

    /**
     * Test: Access dashboard dengan valid token harus return dashboard data.
     *
     * Scenario:
     * 1. Register user dan dapat token
     * 2. Access dashboard endpoint
     * 3. Verify response contains personalized dashboard
     */
    @Test
    @Order(5)
    @DisplayName("GET /api/user/dashboard - Should return dashboard with valid token")
    void testGetDashboard_WithValidToken_ShouldReturn200() throws Exception {
        // ARRANGE
        String token = registerUserAndGetToken("dashboard@test.com", "Dashboard User");

        // ACT & ASSERT
        mockMvc.perform(get("/api/user/dashboard")
                .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message", containsString("Welcome to your dashboard")))
                .andExpect(jsonPath("$.message", containsString("Dashboard User")))
                .andExpect(jsonPath("$.dashboard").exists())
                .andExpect(jsonPath("$.dashboard.userId").exists())
                .andExpect(jsonPath("$.dashboard.welcomeMessage", containsString("Dashboard User")))
                .andExpect(jsonPath("$.dashboard.lastLogin").exists())
                .andExpect(jsonPath("$.dashboard.adminPanel").exists());
    }

    /**
     * Test: Access dashboard tanpa token harus return 403.
     */
    @Test
    @Order(6)
    @DisplayName("GET /api/user/dashboard - Should return 403 without token")
    void testGetDashboard_WithoutToken_ShouldReturn403() throws Exception {
        // ACT & ASSERT
        mockMvc.perform(get("/api/user/dashboard"))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    /**
     * Test: Dashboard harus reflect user role (admin panel visibility).
     *
     * Regular user: adminPanel = false
     */
    @Test
    @Order(7)
    @DisplayName("GET /api/user/dashboard - Should show regular user dashboard")
    void testGetDashboard_RegularUser_ShouldShowUserDashboard() throws Exception {
        // ARRANGE: Register regular user
        String token = registerUserAndGetToken("regular@test.com", "Regular User");

        // ACT & ASSERT: Regular user tidak punya admin panel
        mockMvc.perform(get("/api/user/dashboard")
                .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dashboard.adminPanel").value(false))
                .andExpect(jsonPath("$.dashboard.userLevel").exists());
    }

    // ========================================================================
    // GET /api/user/settings TESTS
    // ========================================================================

    /**
     * Test: Access settings dengan valid token harus return settings.
     */
    @Test
    @Order(8)
    @DisplayName("GET /api/user/settings - Should return settings with valid token")
    void testGetSettings_WithValidToken_ShouldReturn200() throws Exception {
        // ARRANGE
        String token = registerUserAndGetToken("settings@test.com", "Settings User");

        // ACT & ASSERT
        mockMvc.perform(get("/api/user/settings")
                .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.settings").exists())
                .andExpect(jsonPath("$.settings.userId").exists())
                .andExpect(jsonPath("$.settings.email").value("settings@test.com"))
                .andExpect(jsonPath("$.settings.fullName").value("Settings User"))
                .andExpect(jsonPath("$.settings.accountStatus").value("Active"))
                .andExpect(jsonPath("$.settings.lastModified").exists());
    }

    /**
     * Test: Access settings tanpa token harus return 403.
     */
    @Test
    @Order(9)
    @DisplayName("GET /api/user/settings - Should return 403 without token")
    void testGetSettings_WithoutToken_ShouldReturn403() throws Exception {
        // ACT & ASSERT
        mockMvc.perform(get("/api/user/settings"))
                .andDo(print())
                .andExpect(status().isForbidden());
    }

    // ========================================================================
    // JWT TOKEN VALIDATION TESTS
    // ========================================================================

    /**
     * Test: Token dari different user tidak boleh cross-access.
     *
     * Scenario:
     * 1. Register user A dan user B
     * 2. Get token untuk user A
     * 3. Use token A untuk access profile
     * 4. Verify response contains user A info (not user B)
     */
    @Test
    @Order(10)
    @DisplayName("JWT Token - Should contain correct user info")
    void testJwtToken_ShouldContainCorrectUserInfo() throws Exception {
        // ARRANGE: Register user A
        String tokenA = registerUserAndGetToken("usera@test.com", "User A");

        // Register user B (untuk verify tidak ada cross-access)
        registerUserAndGetToken("userb@test.com", "User B");

        // ACT & ASSERT: Token A hanya bisa access user A's data
        mockMvc.perform(get("/api/user/profile")
                .header("Authorization", "Bearer " + tokenA))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("usera@test.com"))
                .andExpect(jsonPath("$.user.fullName").value("User A"));
    }

    /**
     * Test: Verify JWT authentication flow end-to-end.
     *
     * Full authentication flow:
     * 1. Register → Get token (mocked repository)
     * 2. Use token → Access protected endpoint
     * 3. JWT filter validates token
     * 4. Controller receives authenticated user
     * 5. Response contains correct user data
     *
     * INTEGRATION TEST FOCUS:
     * - Mock repository untuk registration
     * - Real JWT token generation
     * - Real JWT authentication filter
     * - Real Spring Security integration
     */
    @Test
    @Order(11)
    @DisplayName("JWT Authentication Flow - Should work end-to-end")
    void testJwtAuthenticationFlow_EndToEnd() throws Exception {
        // STEP 1: Mock repository dan register user
        // Mock: Email belum exist (AuthService uses findByEmail!)
        when(userRepository.findByEmail("e2e@test.com"))
                .thenReturn(java.util.Optional.empty())  // First call during registration
                .thenAnswer(invocation -> {
                    // Subsequent calls dari JWT filter - return saved user
                    com.registrationform.api.entity.User savedUser = new com.registrationform.api.entity.User("EndToEnd Test User", "e2e@test.com", "$2a$10$encodedPassword");
                    savedUser.setId(1L);
                    return java.util.Optional.of(savedUser);
                });

        // Mock: Save user berhasil
        when(userRepository.save(any())).thenAnswer(invocation -> {
            com.registrationform.api.entity.User user = invocation.getArgument(0);
            if (user != null) {
                user.setId(1L);
            }
            return user;
        });

        UserRegistrationRequest regRequest = new UserRegistrationRequest();
        regRequest.setFullName("EndToEnd Test User");  // Changed from "E2E" to avoid digits in name validation
        regRequest.setEmail("e2e@test.com");
        regRequest.setPassword("Test@1234");

        String regResponse = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = objectMapper.readTree(regResponse).get("token").asText();

        // STEP 2: Use token untuk access profile
        mockMvc.perform(get("/api/user/profile")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.email").value("e2e@test.com"));

        // STEP 3: Use same token untuk access dashboard
        mockMvc.perform(get("/api/user/dashboard")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.dashboard.welcomeMessage", containsString("EndToEnd Test User")));

        // STEP 4: Use same token untuk access settings
        mockMvc.perform(get("/api/user/settings")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.settings.email").value("e2e@test.com"));

        // VERIFY: Repository interactions
        verify(userRepository, atLeastOnce()).findByEmail("e2e@test.com");
        verify(userRepository).save(any());
    }

    /**
     * NOTES UNTUK PEMAHAMAN (PEMULA):
     * ================================
     *
     * 1. INTEGRATION TEST VS DATABASE TEST:
     *    - Integration Test = Test JWT authentication filter integration dengan Spring Security
     *    - Database layer = Mocked (pakai @MockBean)
     *    - Focus: JWT token generation, validation, dan Spring Security integration
     *
     * 2. PROTECTED ENDPOINTS TESTING:
     *    - Require valid JWT token in Authorization header
     *    - Format: "Authorization: Bearer {token}"
     *    - Without token: 403 Forbidden (Spring Security blocks)
     *    - Invalid token: 403 Forbidden (JWT validation fails)
     *
     * 3. JWT AUTHENTICATION FLOW:
     *    HTTP Request → JWT Filter → Validate Token → Extract User Info → SecurityContext
     *    → Controller receives authenticated user (@AuthenticationPrincipal)
     *    → Response contains user-specific data
     *
     * 4. MOCK STRATEGY:
     *    - Mock UserRepository.existsByEmail() - Untuk registration
     *    - Mock UserRepository.save() - Untuk save user
     *    - Real JWT token generation - Test actual JWT implementation
     *    - Real JWT authentication filter - Test Spring Security integration
     *
     * 5. WHY 403 INSTEAD OF 401?
     *    - 401 Unauthorized: Authentication failed (wrong credentials)
     *    - 403 Forbidden: Authorization failed (no access permission)
     *    - Spring Security returns 403 untuk missing/invalid token
     *    - This is correct behavior!
     *
     * 6. TEST ISOLATION:
     *    - @BeforeEach reset(userRepository) - Reset mock state
     *    - Each test registers own user via mocked repository
     *    - Tests independent dan bisa run solo
     *    - No database cleanup needed (pakai mock!)
     *
     * 7. HELPER METHOD BENEFITS:
     *    - registerUserAndGetToken() reusable
     *    - Reduce code duplication
     *    - Make tests cleaner dan easier to read
     *    - Centralized mock setup untuk registration
     *
     * 8. INTEGRATION TEST VALUE:
     *    - Test real JWT authentication filter (not mocked)
     *    - Test Spring Security integration (real)
     *    - Test token validation (real JwtUtil)
     *    - Test user extraction dari token (real)
     *    - End-to-end authentication flow
     *    - Verify component wiring works correctly
     *
     * 9. KENAPA PATTERN INI BAGUS:
     *    - Fast execution (no database overhead)
     *    - Focus on JWT & Security testing
     *    - Verify Spring Security integration
     *    - Test authentication flow end-to-end
     *    - No Testcontainers needed
     *
     * 10. DATABASE TESTING MOVED TO:
     *     - API Test Layer (Day 8 - akan dibuat nanti)
     *     - API tests akan test dengan real database
     */
}
