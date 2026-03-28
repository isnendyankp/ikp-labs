package com.ikplabs.api.service;

import com.ikplabs.api.dto.LoginRequest;
import com.ikplabs.api.dto.LoginResponse;
import com.ikplabs.api.dto.UserRegistrationRequest;
import com.ikplabs.api.entity.User;
import com.ikplabs.api.repository.UserRepository;
import com.ikplabs.api.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit Tests untuk AuthService menggunakan Mock Data.
 *
 * ====================================================================
 * APA ITU UNIT TEST?
 * ====================================================================
 * Unit test adalah test untuk menguji "satu unit kecil" dari code Anda
 * secara TERISOLASI (independent, tidak bergantung pada bagian lain).
 *
 * Analogi:
 * - Unit test = Test mesin mobil SAJA (tidak perlu ban, AC, dll)
 * - Integration test = Test mobil lengkap di workshop
 * - E2E test = Test mobil di jalan raya
 *
 * ====================================================================
 * MENGAPA PERLU MOCK DATA?
 * ====================================================================
 * Mock = Fake object (objek palsu) untuk testing.
 *
 * Analogi:
 * Anda mau test mesin mobil. Anda TIDAK perlu:
 * - Ban asli (pakai ban dummy)
 * - AC asli (pakai AC dummy)
 * - Database asli (pakai database dummy/mock)
 *
 * Di test ini:
 * - AuthService = REAL (yang mau kita test) ✅
 * - UserRepository = MOCK (fake database) ❌ Tidak perlu database real
 * - PasswordEncoder = MOCK (fake password checker) ❌
 * - JwtUtil = MOCK (fake token generator) ❌
 *
 * Benefits Mock Data:
 * 1. CEPAT - Tidak perlu koneksi database real (unit test < 1 detik)
 * 2. PREDICTABLE - Mock return data yang kita kontrol
 * 3. ISOLATED - Test tidak bergantung database, network, dll
 * 4. FOKUS - Test business logic saja, bukan infrastruktur
 *
 * ====================================================================
 * TESTING FRAMEWORK:
 * ====================================================================
 * - JUnit 5 - Framework untuk menulis dan menjalankan tests
 * - Mockito - Framework untuk membuat mock objects
 * - @ExtendWith(MockitoExtension.class) - Enable Mockito di JUnit 5
 *
 * ====================================================================
 * AAA PATTERN:
 * ====================================================================
 * Setiap test mengikuti pattern AAA:
 * 1. ARRANGE (Setup) - Siapkan data dan kondisi test
 * 2. ACT (Execute) - Jalankan method yang mau di-test
 * 3. ASSERT (Verify) - Cek hasilnya benar atau salah
 *
 * ====================================================================
 * MOCKITO ANNOTATIONS:
 * ====================================================================
 * @Mock - Buat fake/mock object (dependencies)
 * @InjectMocks - Inject semua @Mock ke dalam object yang di-test
 * @ExtendWith - Enable MockitoExtension untuk JUnit 5
 *
 * ====================================================================
 * TEST COVERAGE: 11 TESTS
 * ====================================================================
 * Login Tests (3):
 * 1. Login dengan valid credentials → Success
 * 2. Login dengan non-existent email → Error
 * 3. Login dengan wrong password → Error
 *
 * Register Tests (2):
 * 4. Register dengan valid data → Success
 * 5. Register dengan duplicate email → Error
 *
 * Validate Token Tests (2):
 * 6. Validate valid token → True
 * 7. Validate invalid token → False
 *
 * Get User From Token Tests (2):
 * 8. Get user with valid token → User object
 * 9. Get user with invalid token → Null
 *
 * Refresh Token Tests (2):
 * 10. Refresh valid token → New token
 * 11. Refresh invalid token → Error
 *
 * @author Registration Form Team
 */
@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests - Using Mock Data")
public class AuthServiceTest {

    // ====================================================================
    // MOCK DEPENDENCIES
    // ====================================================================

    /**
     * @Mock - Fake UserRepository (tidak pakai database real).
     * Kita kontrol return value sesuai kebutuhan test.
     */
    @Mock
    private UserRepository userRepository;

    /**
     * @Mock - Fake PasswordEncoder (tidak pakai BCrypt real).
     * Kita kontrol apakah password "match" atau tidak.
     */
    @Mock
    private PasswordEncoder passwordEncoder;

    /**
     * @Mock - Fake JwtUtil (tidak generate JWT token real).
     * Kita return fake token string saja.
     */
    @Mock
    private JwtUtil jwtUtil;

    /**
     * @InjectMocks - REAL AuthService object yang mau kita test.
     * Mockito akan inject semua @Mock di atas ke dalam AuthService.
     */
    @InjectMocks
    private AuthService authService;

    /**
     * Setup method yang dijalankan SEBELUM setiap test.
     * Tidak perlu isi karena @ExtendWith(MockitoExtension.class)
     * sudah otomatis initialize mocks.
     */
    @BeforeEach
    void setUp() {
        // Mocks already initialized by @ExtendWith(MockitoExtension.class)
        // This method kept for clarity and potential future setup
    }

    // ====================================================================
    // LOGIN TESTS (3 tests)
    // ====================================================================

    /**
     * TEST 1: Login dengan valid credentials harus return success dengan token.
     *
     * Scenario:
     * - User dengan email "test@example.com" sudah terdaftar (mock data)
     * - Password "Test@1234" cocok dengan hash di database (mock behavior)
     * - JwtUtil generate token "fake-jwt-token-12345" (mock behavior)
     * - Expected: LoginResponse success dengan token
     */
    @Test
    @DisplayName("1. Login with valid credentials - Should return success with JWT token")
    void testLogin_WithValidCredentials_ShouldReturnSuccess() {
        // ============================================
        // ARRANGE - Setup mock data dan behavior
        // ============================================

        // 1. Prepare LoginRequest (input)
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("Test@1234");

        // 2. Prepare mock User dari "database"
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("$2a$10$hashedPassword123");  // Fake hashed password
        mockUser.setFullName("Test User");

        // 3. Setup mock behaviors - "Ketika method X dipanggil, return Y"

        // When userRepository.findByEmail() dipanggil
        // Then return mockUser (email ditemukan)
        when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.of(mockUser));

        // When passwordEncoder.matches() dipanggil
        // Then return true (password cocok)
        when(passwordEncoder.matches("Test@1234", "$2a$10$hashedPassword123"))
            .thenReturn(true);

        // When jwtUtil.generateToken() dipanggil
        // Then return fake token
        when(jwtUtil.generateToken(1L, "test@example.com", "Test User"))
            .thenReturn("fake-jwt-token-12345");

        // ============================================
        // ACT - Execute method yang di-test
        // ============================================
        LoginResponse response = authService.login(loginRequest);

        // ============================================
        // ASSERT - Verify hasil sesuai expected
        // ============================================

        // Response tidak null
        assertNotNull(response, "Response should not be null");

        // Login success
        assertTrue(response.isSuccess(), "Login should be successful");
        assertEquals("Login successful", response.getMessage());

        // Token ada dan benar
        assertNotNull(response.getToken(), "Token should not be null");
        assertEquals("fake-jwt-token-12345", response.getToken());

        // User info benar
        assertEquals(1L, response.getUserId());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("Test User", response.getFullName());

        // ============================================
        // VERIFY - Pastikan mock methods dipanggil
        // ============================================
        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, times(1)).matches("Test@1234", "$2a$10$hashedPassword123");
        verify(jwtUtil, times(1)).generateToken(1L, "test@example.com", "Test User");
    }

    /**
     * TEST 2: Login dengan non-existent email harus return error.
     *
     * Scenario:
     * - Email "notfound@example.com" tidak ada di database
     * - Expected: LoginResponse error dengan message "Invalid email or password"
     */
    @Test
    @DisplayName("2. Login with non-existent email - Should return error")
    void testLogin_WithNonExistentEmail_ShouldReturnError() {
        // ============================================
        // ARRANGE
        // ============================================
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("notfound@example.com");
        loginRequest.setPassword("Test@1234");

        // Setup: Email tidak ditemukan (return empty Optional)
        when(userRepository.findByEmail("notfound@example.com"))
            .thenReturn(Optional.empty());

        // ============================================
        // ACT
        // ============================================
        LoginResponse response = authService.login(loginRequest);

        // ============================================
        // ASSERT
        // ============================================
        assertNotNull(response);
        assertFalse(response.isSuccess(), "Login should fail");
        assertEquals("Invalid email or password", response.getMessage());
        assertNull(response.getToken(), "Token should be null on failure");

        // ============================================
        // VERIFY - passwordEncoder TIDAK dipanggil
        // (karena user tidak ada, tidak perlu check password)
        // ============================================
        verify(userRepository, times(1)).findByEmail("notfound@example.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generateToken(anyLong(), anyString(), anyString());
    }

    /**
     * TEST 3: Login dengan wrong password harus return error.
     *
     * Scenario:
     * - Email ada di database
     * - Tapi password tidak cocok
     * - Expected: LoginResponse error
     */
    @Test
    @DisplayName("3. Login with wrong password - Should return error")
    void testLogin_WithWrongPassword_ShouldReturnError() {
        // ============================================
        // ARRANGE
        // ============================================
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("WrongPassword@123");

        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("$2a$10$hashedPassword123");

        // Setup: User ditemukan
        when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.of(mockUser));

        // Setup: Password TIDAK cocok
        when(passwordEncoder.matches("WrongPassword@123", "$2a$10$hashedPassword123"))
            .thenReturn(false);

        // ============================================
        // ACT
        // ============================================
        LoginResponse response = authService.login(loginRequest);

        // ============================================
        // ASSERT
        // ============================================
        assertNotNull(response);
        assertFalse(response.isSuccess(), "Login should fail with wrong password");
        assertEquals("Invalid email or password", response.getMessage());
        assertNull(response.getToken());

        // ============================================
        // VERIFY - jwtUtil TIDAK dipanggil
        // (karena password salah, tidak perlu generate token)
        // ============================================
        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, times(1)).matches("WrongPassword@123", "$2a$10$hashedPassword123");
        verify(jwtUtil, never()).generateToken(anyLong(), anyString(), anyString());
    }

    // ====================================================================
    // REGISTER TESTS (2 tests)
    // ====================================================================

    /**
     * TEST 4: Register dengan valid data harus return success.
     *
     * Scenario:
     * - Email "newuser@example.com" belum terdaftar
     * - Data lengkap dan valid
     * - Expected: User tersimpan, return LoginResponse dengan token
     */
    @Test
    @DisplayName("4. Register with valid data - Should return success with token")
    void testRegister_WithValidData_ShouldReturnSuccess() {
        // ============================================
        // ARRANGE
        // ============================================
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setFullName("New User");
        request.setEmail("newuser@example.com");
        request.setPassword("NewPass@1234");

        // Setup: Email belum ada di database
        when(userRepository.findByEmail("newuser@example.com"))
            .thenReturn(Optional.empty());

        // Setup: PasswordEncoder hash password
        when(passwordEncoder.encode("NewPass@1234"))
            .thenReturn("$2a$10$hashedNewPassword");

        // Setup: Save user return saved user dengan ID
        User savedUser = new User();
        savedUser.setId(2L);
        savedUser.setEmail("newuser@example.com");
        savedUser.setFullName("New User");
        savedUser.setPassword("$2a$10$hashedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Setup: Generate token untuk user baru
        when(jwtUtil.generateToken(2L, "newuser@example.com", "New User"))
            .thenReturn("fake-token-for-new-user");

        // ============================================
        // ACT
        // ============================================
        LoginResponse response = authService.register(request);

        // ============================================
        // ASSERT
        // ============================================
        assertNotNull(response);
        assertTrue(response.isSuccess(), "Registration should be successful");
        assertEquals("Login successful", response.getMessage());  // AuthService returns "Login successful" for both login and register
        assertEquals("fake-token-for-new-user", response.getToken());
        assertEquals(2L, response.getUserId());
        assertEquals("newuser@example.com", response.getEmail());
        assertEquals("New User", response.getFullName());

        // ============================================
        // VERIFY
        // ============================================
        verify(userRepository, times(1)).findByEmail("newuser@example.com");
        verify(passwordEncoder, times(1)).encode("NewPass@1234");
        verify(userRepository, times(1)).save(any(User.class));
        verify(jwtUtil, times(1)).generateToken(2L, "newuser@example.com", "New User");
    }

    /**
     * TEST 5: Register dengan duplicate email harus return error.
     *
     * Scenario:
     * - Email "existing@example.com" sudah ada di database
     * - Expected: LoginResponse error, user TIDAK disimpan
     */
    @Test
    @DisplayName("5. Register with duplicate email - Should return error")
    void testRegister_WithDuplicateEmail_ShouldReturnError() {
        // ============================================
        // ARRANGE
        // ============================================
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setEmail("existing@example.com");
        request.setPassword("Test@1234");
        request.setFullName("Another User");

        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setEmail("existing@example.com");

        // Setup: Email sudah ada
        when(userRepository.findByEmail("existing@example.com"))
            .thenReturn(Optional.of(existingUser));

        // ============================================
        // ACT
        // ============================================
        LoginResponse response = authService.register(request);

        // ============================================
        // ASSERT
        // ============================================
        assertNotNull(response);
        assertFalse(response.isSuccess(), "Registration should fail with duplicate email");
        assertEquals("Email already exists", response.getMessage());
        assertNull(response.getToken());

        // ============================================
        // VERIFY - save() TIDAK dipanggil
        // (karena email duplicate, tidak perlu save)
        // ============================================
        verify(userRepository, times(1)).findByEmail("existing@example.com");
        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
        verify(jwtUtil, never()).generateToken(anyLong(), anyString(), anyString());
    }

    // ====================================================================
    // VALIDATE TOKEN TESTS (2 tests)
    // ====================================================================

    /**
     * TEST 6: Validate token dengan valid token harus return true.
     */
    @Test
    @DisplayName("6. Validate token with valid token - Should return true")
    void testValidateToken_WithValidToken_ShouldReturnTrue() {
        // ============================================
        // ARRANGE
        // ============================================
        String validToken = "valid-jwt-token-12345";
        String email = "test@example.com";

        // Setup: JwtUtil validate token return true
        when(jwtUtil.validateToken(validToken, email))
            .thenReturn(true);

        // ============================================
        // ACT
        // ============================================
        boolean isValid = authService.validateToken(validToken, email);

        // ============================================
        // ASSERT
        // ============================================
        assertTrue(isValid, "Token should be valid");

        // ============================================
        // VERIFY
        // ============================================
        verify(jwtUtil, times(1)).validateToken(validToken, email);
    }

    /**
     * TEST 7: Validate token dengan invalid token harus return false.
     */
    @Test
    @DisplayName("7. Validate token with invalid token - Should return false")
    void testValidateToken_WithInvalidToken_ShouldReturnFalse() {
        // ============================================
        // ARRANGE
        // ============================================
        String invalidToken = "invalid-token";
        String email = "test@example.com";

        // Setup: JwtUtil throw exception (token invalid)
        when(jwtUtil.validateToken(invalidToken, email))
            .thenThrow(new RuntimeException("Invalid token"));

        // ============================================
        // ACT
        // ============================================
        boolean isValid = authService.validateToken(invalidToken, email);

        // ============================================
        // ASSERT
        // ============================================
        assertFalse(isValid, "Token should be invalid");

        // ============================================
        // VERIFY
        // ============================================
        verify(jwtUtil, times(1)).validateToken(invalidToken, email);
    }

    // ====================================================================
    // GET USER FROM TOKEN TESTS (2 tests)
    // ====================================================================

    /**
     * TEST 8: Get user from token dengan valid token harus return User object.
     */
    @Test
    @DisplayName("8. Get user from token with valid token - Should return User object")
    void testGetUserFromToken_WithValidToken_ShouldReturnUser() {
        // ============================================
        // ARRANGE
        // ============================================
        String validToken = "valid-jwt-token-12345";
        String email = "test@example.com";

        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail(email);
        mockUser.setFullName("Test User");

        // Setup: JwtUtil extract email dari token
        when(jwtUtil.extractEmail(validToken))
            .thenReturn(email);

        // Setup: UserRepository find user by email
        when(userRepository.findByEmail(email))
            .thenReturn(Optional.of(mockUser));

        // ============================================
        // ACT
        // ============================================
        User result = authService.getUserFromToken(validToken);

        // ============================================
        // ASSERT
        // ============================================
        assertNotNull(result, "User should not be null");
        assertEquals(1L, result.getId());
        assertEquals(email, result.getEmail());
        assertEquals("Test User", result.getFullName());

        // ============================================
        // VERIFY
        // ============================================
        verify(jwtUtil, times(1)).extractEmail(validToken);
        verify(userRepository, times(1)).findByEmail(email);
    }

    /**
     * TEST 9: Get user from token dengan invalid token harus return null.
     */
    @Test
    @DisplayName("9. Get user from token with invalid token - Should return null")
    void testGetUserFromToken_WithInvalidToken_ShouldReturnNull() {
        // ============================================
        // ARRANGE
        // ============================================
        String invalidToken = "invalid-token";

        // Setup: JwtUtil throw exception saat extract email
        when(jwtUtil.extractEmail(invalidToken))
            .thenThrow(new RuntimeException("Cannot extract email from token"));

        // ============================================
        // ACT
        // ============================================
        User result = authService.getUserFromToken(invalidToken);

        // ============================================
        // ASSERT
        // ============================================
        assertNull(result, "User should be null for invalid token");

        // ============================================
        // VERIFY
        // ============================================
        verify(jwtUtil, times(1)).extractEmail(invalidToken);
        verify(userRepository, never()).findByEmail(anyString());
    }

    // ====================================================================
    // REFRESH TOKEN TESTS (2 tests)
    // ====================================================================

    /**
     * TEST 10: Refresh token dengan valid token harus return new token.
     */
    @Test
    @DisplayName("10. Refresh token with valid token - Should return new token")
    void testRefreshToken_WithValidToken_ShouldReturnNewToken() {
        // ============================================
        // ARRANGE
        // ============================================
        String oldToken = "old-jwt-token-12345";
        String email = "test@example.com";

        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail(email);
        mockUser.setFullName("Test User");

        // Setup: Extract email dari old token
        when(jwtUtil.extractEmail(oldToken))
            .thenReturn(email);

        // Setup: Find user by email
        when(userRepository.findByEmail(email))
            .thenReturn(Optional.of(mockUser));

        // Setup: Generate new token
        when(jwtUtil.generateToken(1L, email, "Test User"))
            .thenReturn("new-jwt-token-67890");

        // ============================================
        // ACT
        // ============================================
        LoginResponse response = authService.refreshToken(oldToken);

        // ============================================
        // ASSERT
        // ============================================
        assertNotNull(response);
        assertTrue(response.isSuccess(), "Refresh should be successful");
        assertEquals("new-jwt-token-67890", response.getToken());
        assertEquals(1L, response.getUserId());
        assertEquals(email, response.getEmail());

        // ============================================
        // VERIFY
        // ============================================
        verify(jwtUtil, times(1)).extractEmail(oldToken);
        verify(userRepository, times(1)).findByEmail(email);
        verify(jwtUtil, times(1)).generateToken(1L, email, "Test User");
    }

    /**
     * TEST 11: Refresh token dengan invalid token harus return error.
     */
    @Test
    @DisplayName("11. Refresh token with invalid token - Should return error")
    void testRefreshToken_WithInvalidToken_ShouldReturnError() {
        // ============================================
        // ARRANGE
        // ============================================
        String invalidToken = "invalid-token";

        // Setup: JwtUtil throw exception saat extract email
        when(jwtUtil.extractEmail(invalidToken))
            .thenThrow(new RuntimeException("Invalid token"));

        // ============================================
        // ACT
        // ============================================
        LoginResponse response = authService.refreshToken(invalidToken);

        // ============================================
        // ASSERT
        // ============================================
        assertNotNull(response);
        assertFalse(response.isSuccess(), "Refresh should fail with invalid token");
        assertEquals("Invalid token", response.getMessage());  // AuthService returns "Invalid token" when getUserFromToken() fails
        assertNull(response.getToken());

        // ============================================
        // VERIFY
        // ============================================
        verify(jwtUtil, times(1)).extractEmail(invalidToken);
        verify(userRepository, never()).findByEmail(anyString());
        verify(jwtUtil, times(1)).extractEmail(invalidToken); // Only extract, no generate
    }

    /**
     * ====================================================================
     * CARA MENJALANKAN UNIT TESTS:
     * ====================================================================
     *
     * 1. Dari Terminal (semua tests):
     *    mvn test
     *
     * 2. Dari Terminal (hanya AuthServiceTest):
     *    mvn test -Dtest=AuthServiceTest
     *
     * 3. Dari Terminal (satu test method saja):
     *    mvn test -Dtest=AuthServiceTest#testLogin_WithValidCredentials_ShouldReturnSuccess
     *
     * 4. Dari IDE (IntelliJ/Eclipse):
     *    - Klik kanan pada file atau method
     *    - Pilih "Run Test" atau "Run AuthServiceTest"
     *
     * ====================================================================
     * CARA MEMBACA TEST RESULTS:
     * ====================================================================
     *
     * ✅ GREEN / PASSED = Test berhasil (code bekerja sesuai expected)
     * ❌ RED / FAILED = Test gagal (ada bug atau logic error)
     *
     * Example output:
     * [INFO] Tests run: 11, Failures: 0, Errors: 0, Skipped: 0
     *              ^^^^                ^^^^^^^^^^^
     *              Semua pass!         Tidak ada error!
     *
     * ====================================================================
     * BEST PRACTICES YANG DIPAKAI DI FILE INI:
     * ====================================================================
     *
     * 1. ✅ AAA Pattern (Arrange-Act-Assert)
     *    - Semua test terstruktur dengan jelas
     *
     * 2. ✅ Mock External Dependencies
     *    - UserRepository = Mock (tidak pakai database real)
     *    - PasswordEncoder = Mock (tidak pakai BCrypt real)
     *    - JwtUtil = Mock (tidak generate JWT real)
     *
     * 3. ✅ Descriptive Test Names
     *    - testLogin_WithValidCredentials_ShouldReturnSuccess
     *    - Langsung tahu apa yang di-test dan expected result
     *
     * 4. ✅ Independent Tests
     *    - Setiap test independent (tidak bergantung test lain)
     *    - Test bisa dijalankan solo atau semua sekaligus
     *
     * 5. ✅ Complete Coverage
     *    - Test happy path (success scenarios)
     *    - Test sad path (error scenarios)
     *    - 11 tests mencakup semua public methods di AuthService
     *
     * 6. ✅ Verify Mock Calls
     *    - verify() untuk pastikan methods dipanggil sesuai expected
     *    - verify(never()) untuk pastikan methods TIDAK dipanggil
     *
     * 7. ✅ Educational Comments
     *    - Javadoc lengkap untuk pemula
     *    - Explain "why" bukan hanya "what"
     *
     * ====================================================================
     * TIPS UNTUK PEMULA:
     * ====================================================================
     *
     * 1. Pahami AAA Pattern dulu:
     *    - ARRANGE = Setup test data
     *    - ACT = Call method yang di-test
     *    - ASSERT = Check hasil benar/salah
     *
     * 2. Mock itu "Fake Object":
     *    - when(mock.method()).thenReturn(value) = "Kalau method dipanggil, return value"
     *    - Kita kontrol return value sesuai kebutuhan test
     *
     * 3. Unit Test ≠ Integration Test:
     *    - Unit test = Mock semua dependencies (cepat, isolated)
     *    - Integration test = Real dependencies (lambat, realistic)
     *
     * 4. Test Name = Documentation:
     *    - Test name harus jelas apa yang di-test
     *    - Format: test[Method]_[Scenario]_[ExpectedResult]
     *
     * 5. Jangan Takut Test Gagal:
     *    - Red test = Bagian dari proses
     *    - Baca error message dengan teliti
     *    - Fix code atau fix test
     *
     * ====================================================================
     * SECURITY NOTES:
     * ====================================================================
     *
     * 1. Generic Error Messages:
     *    - "Invalid email or password" (tidak kasih tau email ada/tidak)
     *    - Prevent user enumeration attack
     *
     * 2. Password Hashing:
     *    - Password di-hash sebelum disimpan
     *    - Never store plain text password
     *
     * 3. JWT Token Security:
     *    - Token generated setelah authentication sukses
     *    - Token validated setiap protected request
     *    - Token refresh untuk extend session
     *
     * ====================================================================
     */
}
