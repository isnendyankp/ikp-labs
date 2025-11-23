package com.registrationform.api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.registrationform.api.dto.LoginRequest;
import com.registrationform.api.dto.UserRegistrationRequest;
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

import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration Tests untuk AuthController.
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
 *
 * YANG DITAMBAH:
 * - @MockBean untuk UserRepository
 * - Mock setup untuk repository behavior
 * - verify() untuk validasi interactions
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
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)  // Disable security filters for simpler testing
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * @MockBean UserRepository - Mock external dependency (database layer)
     *
     * Mengapa pakai @MockBean?
     * - Database = External system (bukan part of component interaction)
     * - Integration test focus pada component wiring, bukan database
     * - Database testing akan dilakukan di API test layer
     */
    @MockBean
    private UserRepository userRepository;

    /**
     * Setup yang dijalankan sebelum SETIAP test method.
     * Reset mock state untuk isolasi test.
     */
    @BeforeEach
    void setUp() {
        // Reset mock state (tidak perlu clean database karena pakai mock)
        reset(userRepository);
    }

    // ========================================================================
    // REGISTRATION TESTS
    // ========================================================================

    /**
     * Test: Registration dengan valid data harus return 201 Created.
     *
     * INTEGRATION TEST FOCUS:
     * - Test Controller → Service → Repository interaction
     * - Mock repository behavior (tidak test real database)
     * - Verify repository method dipanggil dengan correct parameters
     *
     * Scenario:
     * 1. Mock: Email tidak exist (existsByEmail = false)
     * 2. Mock: Save user berhasil (return saved user dengan ID)
     * 3. User kirim POST /api/auth/register dengan data valid
     * 4. Backend validate input
     * 5. Backend call repository.save()
     * 6. Backend generate JWT token
     * 7. Return 201 Created dengan token
     * 8. Verify: repository.existsByEmail() dan save() dipanggil
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

        // Mock: Email tidak exist (AuthService uses findByEmail, not existsByEmail)
        when(userRepository.findByEmail("integration@test.com")).thenReturn(Optional.empty());

        // Mock: Save user berhasil (simulate auto-generated ID)
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L); // Simulate database auto-increment ID
            return user;
        });

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

        // VERIFY: Repository interactions (Integration test goal!)
        verify(userRepository).findByEmail("integration@test.com");
        verify(userRepository).save(any(User.class));
    }

    /**
     * Test: Registration dengan duplicate email harus return 400 Bad Request.
     *
     * INTEGRATION TEST FOCUS:
     * - Test service validation logic (duplicate email check)
     * - Mock: existsByEmail returns true (email sudah ada)
     * - Verify: save() TIDAK dipanggil (karena validation failed)
     */
    @Test
    @Order(2)
    @DisplayName("POST /api/auth/register - Should reject duplicate email")
    void testRegister_WithDuplicateEmail_ShouldReturn400() throws Exception {
        // ARRANGE: Mock email sudah exist (findByEmail returns existing user)
        User existingUser = new User();
        existingUser.setId(99L);
        existingUser.setEmail("duplicate@test.com");
        existingUser.setFullName("Existing User");

        when(userRepository.findByEmail("duplicate@test.com")).thenReturn(Optional.of(existingUser));

        // ACT: Try register dengan email yang sudah exist
        UserRegistrationRequest duplicateRequest = new UserRegistrationRequest();
        duplicateRequest.setFullName("Second User");
        duplicateRequest.setEmail("duplicate@test.com"); // Email already exists!
        duplicateRequest.setPassword("Test@5678");

        // ASSERT: Harus ditolak
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andDo(print())
                .andExpect(status().isBadRequest()) // Expect HTTP 400
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message", containsString("already exists")));

        // VERIFY: findByEmail dipanggil, tapi save() TIDAK dipanggil
        verify(userRepository).findByEmail("duplicate@test.com");
        verify(userRepository, never()).save(any(User.class)); // Important: save tidak dipanggil!
    }

    /**
     * Test: Registration dengan invalid email format harus return 400.
     *
     * INTEGRATION TEST FOCUS:
     * - Test Bean Validation integration (Jakarta Validation)
     * - Request ditolak SEBELUM sampai service layer
     * - Repository method TIDAK dipanggil
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

        // VERIFY: Repository tidak dipanggil (karena validation failed di controller)
        verifyNoInteractions(userRepository);
    }

    /**
     * Test: Registration dengan missing required fields harus return 400.
     *
     * INTEGRATION TEST FOCUS:
     * - Test Bean Validation untuk @NotBlank fields
     * - Validation error sebelum service layer
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

        // VERIFY: Repository tidak dipanggil
        verifyNoInteractions(userRepository);
    }

    // ========================================================================
    // LOGIN TESTS
    // ========================================================================

    /**
     * Test: Login dengan valid credentials harus return 200 OK dengan token.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock user exist di database dengan hashed password
     * - Test password verification logic (PasswordEncoder)
     * - Verify findByEmail() dipanggil untuk authentication
     *
     * Scenario:
     * 1. Mock: User exist dengan email "login@test.com"
     * 2. Mock: Password di-hash dengan BCrypt
     * 3. Login dengan correct credentials
     * 4. Service verify password dengan PasswordEncoder
     * 5. Generate JWT token
     * 6. Return 200 OK
     */
    @Test
    @Order(5)
    @DisplayName("POST /api/auth/login - Should login successfully with valid credentials")
    void testLogin_WithValidCredentials_ShouldReturn200() throws Exception {
        // ARRANGE: Mock user exist dengan hashed password
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setFullName("Login Test User");
        mockUser.setEmail("login@test.com");
        mockUser.setPassword(passwordEncoder.encode("Test@1234")); // Hash password

        when(userRepository.findByEmail("login@test.com")).thenReturn(Optional.of(mockUser));

        // ACT: Login dengan valid credentials
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

        // VERIFY: Repository interaction
        verify(userRepository).findByEmail("login@test.com");
    }

    /**
     * Test: Login dengan wrong password harus return 401 Unauthorized.
     *
     * INTEGRATION TEST FOCUS:
     * - Test password mismatch detection
     * - PasswordEncoder.matches() returns false
     */
    @Test
    @Order(6)
    @DisplayName("POST /api/auth/login - Should reject wrong password")
    void testLogin_WithWrongPassword_ShouldReturn401() throws Exception {
        // ARRANGE: Mock user exist dengan correct password
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setFullName("Auth Test User");
        mockUser.setEmail("auth@test.com");
        mockUser.setPassword(passwordEncoder.encode("Test@1234")); // Correct password

        when(userRepository.findByEmail("auth@test.com")).thenReturn(Optional.of(mockUser));

        // ACT: Login dengan WRONG password
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

        // VERIFY: Repository dipanggil untuk get user
        verify(userRepository).findByEmail("auth@test.com");
    }

    /**
     * Test: Login dengan non-existent email harus return 401.
     *
     * INTEGRATION TEST FOCUS:
     * - Mock: findByEmail returns empty (user tidak exist)
     * - Test authentication failure handling
     */
    @Test
    @Order(7)
    @DisplayName("POST /api/auth/login - Should reject non-existent email")
    void testLogin_WithNonExistentEmail_ShouldReturn401() throws Exception {
        // ARRANGE: Mock user tidak exist
        when(userRepository.findByEmail("nonexistent@test.com")).thenReturn(Optional.empty());

        // ACT: Login request untuk user yang tidak ada
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@test.com");
        loginRequest.setPassword("Test@1234");

        // ASSERT: Login should fail
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(print())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));

        // VERIFY: Repository dipanggil
        verify(userRepository).findByEmail("nonexistent@test.com");
    }

    // ========================================================================
    // TOKEN REFRESH TESTS
    // ========================================================================

    /**
     * Test: Refresh token dengan valid token harus return new token.
     *
     * INTEGRATION TEST FOCUS:
     * - Test JWT token generation dan refresh logic
     * - No database interaction needed (token validation only)
     */
    @Test
    @Order(8)
    @DisplayName("POST /api/auth/refresh - Should refresh valid token")
    void testRefreshToken_WithValidToken_ShouldReturnNewToken() throws Exception {
        // ARRANGE: Create saved user untuk refresh
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setFullName("Refresh Test User");
        savedUser.setEmail("refresh@test.com");
        savedUser.setPassword(passwordEncoder.encode("Test@1234"));

        // Mock untuk registration
        when(userRepository.findByEmail("refresh@test.com"))
                .thenReturn(Optional.empty()) // First call during registration
                .thenReturn(Optional.of(savedUser)); // Second call during refresh

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        // Register untuk dapat token
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

        // ACT: Refresh token (calls getUserFromToken which uses findByEmail)
        mockMvc.perform(post("/api/auth/refresh")
                .param("token", token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.token").isNotEmpty());

        // VERIFY: findByEmail called twice (registration + refresh)
        verify(userRepository, times(2)).findByEmail("refresh@test.com");
        verify(userRepository).save(any(User.class));
    }

    /**
     * Test: Refresh dengan invalid token harus return 401.
     *
     * INTEGRATION TEST FOCUS:
     * - Test JWT validation error handling
     * - No repository interaction (token invalid sebelum any business logic)
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

        // VERIFY: No repository interaction
        verifyNoInteractions(userRepository);
    }

    // ========================================================================
    // TOKEN VALIDATION TESTS
    // ========================================================================

    /**
     * Test: Validate token dengan valid token dan email harus return valid=true.
     *
     * INTEGRATION TEST FOCUS:
     * - Test JWT validation logic
     * - Test token-email matching
     */
    @Test
    @Order(10)
    @DisplayName("POST /api/auth/validate - Should validate correct token")
    void testValidateToken_WithValidToken_ShouldReturnTrue() throws Exception {
        // ARRANGE: Mock untuk registration
        when(userRepository.findByEmail("validate@test.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });

        // Register user untuk dapat token
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

        // ACT: Validate token (pure token operation, no DB needed)
        mockMvc.perform(post("/api/auth/validate")
                .param("token", token)
                .param("email", "validate@test.com"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.valid").value(true))
                .andExpect(jsonPath("$.message").value("Token is valid"));

        // VERIFY: Only registration used repository
        verify(userRepository).findByEmail("validate@test.com");
        verify(userRepository).save(any(User.class));
    }

    /**
     * Test: Validate dengan invalid token harus return valid=false.
     *
     * INTEGRATION TEST FOCUS:
     * - Test JWT validation failure handling
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

        // VERIFY: No repository interaction
        verifyNoInteractions(userRepository);
    }

    // ========================================================================
    // HEALTH CHECK TEST
    // ========================================================================

    /**
     * Test: Health check endpoint harus return 200 OK.
     *
     * INTEGRATION TEST FOCUS:
     * - Test controller routing dan basic functionality
     * - No external dependencies needed
     */
    @Test
    @Order(12)
    @DisplayName("GET /api/auth/health - Should return health status")
    void testHealthCheck_ShouldReturn200() throws Exception {
        // ACT & ASSERT: Health check (no repository interaction)
        mockMvc.perform(get("/api/auth/health"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("AuthController"))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.timestamp").exists());

        // VERIFY: No repository interaction
        verifyNoInteractions(userRepository);
    }

    /**
     * NOTES UNTUK PEMAHAMAN - INTEGRATION TEST REFACTOR:
     * ===================================================
     *
     * 1. APA ITU INTEGRATION TEST? (Per Senior's Definition)
     *    - Test INTERAKSI antar component dalam Spring Container
     *    - Test bagaimana Controller, Service, Repository bekerja bersama
     *    - BUKAN test database (database = external system)
     *    - Focus: Component wiring, dependency injection, method calls
     *
     * 2. PERUBAHAN DARI VERSI SEBELUMNYA:
     *    BEFORE (Database Integration Test):
     *    - extends AbstractIntegrationTest
     *    - Uses Testcontainers PostgreSQL
     *    - Real database operations (save, deleteAll, etc.)
     *    - Database assertions
     *
     *    AFTER (Component Integration Test):
     *    - @SpringBootTest only
     *    - @MockBean UserRepository
     *    - Mock database behavior (when/thenReturn)
     *    - Verify repository method calls (verify())
     *
     * 3. KENAPA PAKAI @MockBean?
     *    - Database = External dependency (bukan part of component)
     *    - Integration test hanya test component interaction
     *    - Database testing dipindah ke API test layer (Day 8)
     *    - Focus pada: "Apakah service memanggil repository dengan benar?"
     *
     * 4. KENAPA PAKAI VERIFY()?
     *    - Verify() = Validate component interaction
     *    - Contoh: verify(userRepository).save(any(User.class))
     *    - Memastikan: Service memanggil repository method dengan parameter correct
     *    - Goal: Test component communication, NOT data persistence
     *
     * 5. KAPAN PAKAI verifyNoInteractions()?
     *    - Validation errors (email invalid, missing fields)
     *    - Request ditolak sebelum sampai service layer
     *    - Repository method TIDAK boleh dipanggil
     *    - Contoh: Invalid email → verifyNoInteractions(userRepository)
     *
     * 6. MOCK SETUP PATTERNS:
     *    a) Email check: when(userRepository.existsByEmail(...)).thenReturn(false)
     *    b) Save user: when(userRepository.save(...)).thenAnswer(invocation → ...)
     *    c) Find user: when(userRepository.findByEmail(...)).thenReturn(Optional.of(mockUser))
     *    d) User not exist: when(userRepository.findByEmail(...)).thenReturn(Optional.empty())
     *
     * 7. INTEGRATION TEST VS API TEST:
     *    Integration Test (This file):
     *    - MockMvc (simulated HTTP)
     *    - @MockBean repositories
     *    - No real database
     *    - Fast execution
     *    - Test: Component interaction
     *
     *    API Test (Coming in Day 8):
     *    - REST Assured (real HTTP)
     *    - Real PostgreSQL
     *    - Server running (mvn spring-boot:run)
     *    - Slower execution
     *    - Test: Full stack + database
     *
     * 8. TEST ISOLATION:
     *    - @BeforeEach reset(userRepository) - Reset mock state
     *    - Each test independent (bisa run solo)
     *    - No database cleanup needed (karena pakai mock)
     *
     * 9. PASSWORD ENCODER PATTERN:
     *    - @Autowired PasswordEncoder (real bean, not mocked)
     *    - Digunakan untuk hash password: passwordEncoder.encode("Test@1234")
     *    - Service akan verify dengan: passwordEncoder.matches(raw, hashed)
     *    - Integration test verify password hashing integration
     *
     * 10. KAPAN DATABASE TESTING DILAKUKAN?
     *     - Repository test: Test database operations (CRUD)
     *     - API test: Test full flow dengan real database
     *     - Integration test: TIDAK test database (mock saja)
     *
     * TEST COVERAGE SUMMARY:
     * =====================
     * ✅ Registration flow (valid, duplicate, invalid email)
     * ✅ Login flow (valid, wrong password, non-existent user)
     * ✅ Token refresh (valid, invalid token)
     * ✅ Token validation (valid, invalid token)
     * ✅ Health check endpoint
     * ✅ Bean validation integration (@Valid, @Email)
     * ✅ Password encoding integration (BCryptPasswordEncoder)
     * ✅ Repository interaction verification (all 12 tests)
     *
     * Total: 12 tests - All test component interaction WITHOUT database
     */
}
