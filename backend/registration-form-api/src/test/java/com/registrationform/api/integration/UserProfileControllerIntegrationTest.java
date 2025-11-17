package com.registrationform.api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.registrationform.api.dto.UserRegistrationRequest;
import com.registrationform.api.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration Tests untuk UserProfileController.
 *
 * Controller ini test protected endpoints yang membutuhkan JWT authentication.
 * Critical untuk verify JWT authentication filter berfungsi dengan benar.
 *
 * Test Coverage:
 * 1. GET /api/user/profile - Protected endpoint untuk user profile
 * 2. GET /api/user/dashboard - Protected endpoint untuk dashboard
 * 3. GET /api/user/settings - Protected endpoint untuk settings
 * 4. Authentication failures (no token, invalid token)
 * 5. JWT token extraction dan validation
 *
 * Test Strategy:
 * - Register user → Get JWT token → Use token for protected endpoints
 * - Test both success scenarios (with valid token) dan error scenarios (no token/invalid token)
 * - Verify JWT authentication filter integration dengan Spring Security
 *
 * @author Registration Form Team
 */
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserProfileControllerIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    /**
     * Clean database sebelum setiap test.
     */
    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    /**
     * Helper method: Register user dan return JWT token.
     * Reusable untuk semua tests yang butuh authenticated user.
     */
    private String registerUserAndGetToken(String email, String fullName) throws Exception {
        // Register user
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
     * 1. Register → Get token
     * 2. Use token → Access protected endpoint
     * 3. JWT filter validates token
     * 4. Controller receives authenticated user
     * 5. Response contains correct user data
     */
    @Test
    @Order(11)
    @DisplayName("JWT Authentication Flow - Should work end-to-end")
    void testJwtAuthenticationFlow_EndToEnd() throws Exception {
        // STEP 1: Register user
        UserRegistrationRequest regRequest = new UserRegistrationRequest();
        regRequest.setFullName("E2E Test User");
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
                .andExpect(jsonPath("$.dashboard.welcomeMessage", containsString("E2E Test User")));

        // STEP 4: Use same token untuk access settings
        mockMvc.perform(get("/api/user/settings")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.settings.email").value("e2e@test.com"));
    }

    /**
     * NOTES UNTUK PEMAHAMAN:
     * ======================
     *
     * 1. Protected Endpoints Testing:
     *    - Require valid JWT token in Authorization header
     *    - Format: "Authorization: Bearer {token}"
     *    - Without token: 403 Forbidden (Spring Security blocks)
     *    - Invalid token: 403 Forbidden (JWT validation fails)
     *
     * 2. JWT Authentication Flow:
     *    Request → JWT Filter → Validate Token → Extract User → SecurityContext
     *    → Controller receives @AuthenticationPrincipal
     *
     * 3. Integration Test Value:
     *    - Test real JWT authentication filter
     *    - Test Spring Security integration
     *    - Test token validation
     *    - Test user extraction dari token
     *    - End-to-end authentication flow
     *
     * 4. Why 403 instead of 401?
     *    - 401: Authentication failed (wrong credentials)
     *    - 403: Authorization failed (no access permission)
     *    - Spring Security returns 403 untuk missing/invalid token
     *
     * 5. Test Isolation:
     *    - @BeforeEach clean database
     *    - Each test registers own user
     *    - Tests independent dan bisa run solo
     *
     * 6. Helper Method Benefits:
     *    - registerUserAndGetToken() reusable
     *    - Reduce code duplication
     *    - Make tests cleaner dan easier to read
     */
}
