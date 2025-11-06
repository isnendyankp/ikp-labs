package com.registrationform.api.service;

import com.registrationform.api.dto.LoginRequest;
import com.registrationform.api.dto.LoginResponse;
import com.registrationform.api.dto.UserRegistrationRequest;
import com.registrationform.api.entity.User;
import com.registrationform.api.repository.UserRepository;
import com.registrationform.api.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit Test untuk AuthService
 *
 * APA ITU UNIT TEST?
 * ==================
 * Unit test adalah test kecil-kecilan untuk setiap "unit" (bagian kecil) dari code Anda.
 * Seperti test matematika:
 * - Test: 2 + 2 = 4 ✅
 * - Test: 5 - 3 = 2 ✅
 * - Test: 10 / 0 = Error ❌
 *
 * MENGAPA PERLU UNIT TEST?
 * ========================
 * 1. DETEKSI BUG LEBIH CEPAT - Tahu langsung kalau ada yang rusak
 * 2. DOKUMENTASI HIDUP - Test menjelaskan bagaimana code seharusnya bekerja
 * 3. REFACTORING AMAN - Ubah code tanpa takut rusak
 * 4. CONFIDENCE - Yakin code Anda bekerja dengan benar
 *
 * ANATOMI UNIT TEST:
 * ==================
 * 1. ARRANGE (Setup) - Siapkan data dan kondisi
 * 2. ACT (Execute) - Jalankan method yang mau di-test
 * 3. ASSERT (Verify) - Cek hasilnya benar atau tidak
 *
 * TOOLS YANG DIPAKAI:
 * ===================
 * - JUnit 5: Framework untuk menulis dan menjalankan test
 * - Mockito: Framework untuk membuat "fake objects" (mock)
 *
 * MOCK vs REAL OBJECT:
 * ====================
 * MOCK = Objek palsu untuk testing
 *
 * Analogi: Test mesin mobil
 * - Anda mau test mesin (AuthService)
 * - Tapi tidak perlu ban asli, AC asli, dll
 * - Cukup pakai "ban dummy", "AC dummy" (Mock)
 * - Fokus test mesin saja!
 *
 * Di test ini:
 * - AuthService = Real object (yang mau kita test)
 * - UserRepository = Mock (dummy database)
 * - PasswordEncoder = Mock (dummy password checker)
 * - JwtUtil = Mock (dummy token generator)
 *
 * @Mock = Buat fake object
 * @InjectMocks = Inject fake objects ke real object
 */
@DisplayName("AuthService Unit Tests")
public class AuthServiceTest {

    // ============================================
    // SETUP TEST DEPENDENCIES
    // ============================================

    /**
     * @Mock - Membuat "fake object" untuk testing
     * Tidak perlu koneksi database real, cukup dummy!
     */
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    /**
     * @InjectMocks - Object yang mau kita test (REAL object)
     * Mockito akan inject semua @Mock ke dalam object ini
     */
    @InjectMocks
    private AuthService authService;

    /**
     * @BeforeEach - Dijalankan SEBELUM setiap test
     * Seperti "reset" sebelum mulai test baru
     */
    @BeforeEach
    void setUp() {
        // Initialize Mockito annotations
        MockitoAnnotations.openMocks(this);
    }

    // ============================================
    // TEST CASES - LOGIN FEATURE
    // ============================================

    /**
     * TEST CASE 1: Login dengan credentials yang benar
     *
     * SKENARIO:
     * - User dengan email "test@example.com" sudah terdaftar
     * - Password yang dimasukkan benar
     * - Harapan: Login berhasil, dapat JWT token
     *
     * AAA Pattern:
     * - ARRANGE: Setup mock data (user exists, password match)
     * - ACT: Call authService.login()
     * - ASSERT: Check response success dan ada token
     */
    @Test
    @DisplayName("Test 1: Login dengan valid credentials - Should return success with token")
    void testLogin_ValidCredentials_ShouldReturnSuccessWithToken() {
        // ============================================
        // ARRANGE (Setup)
        // ============================================

        // 1. Buat fake LoginRequest
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        // 2. Buat fake User dari database
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("$2a$10$hashedPassword"); // Hashed password
        mockUser.setFullName("Test User");

        // 3. Setup mock behavior - "Kalau dipanggil, return apa"
        // When userRepository.findByEmail("test@example.com") dipanggil
        // Then return mockUser
        when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.of(mockUser));

        // When passwordEncoder.matches(raw, hashed) dipanggil
        // Then return true (password cocok)
        when(passwordEncoder.matches("password123", "$2a$10$hashedPassword"))
            .thenReturn(true);

        // When jwtUtil.generateToken(email) dipanggil
        // Then return fake token
        when(jwtUtil.generateToken("test@example.com"))
            .thenReturn("fake-jwt-token-12345");

        // ============================================
        // ACT (Execute)
        // ============================================
        LoginResponse response = authService.login(loginRequest);

        // ============================================
        // ASSERT (Verify)
        // ============================================

        // Check response tidak null
        assertNotNull(response, "Response should not be null");

        // Check token ada
        assertNotNull(response.getToken(), "Token should not be null");
        assertEquals("fake-jwt-token-12345", response.getToken(),
            "Token should match the generated token");

        // Check user info benar
        assertEquals("test@example.com", response.getEmail(),
            "Email should match");
        assertEquals("Test User", response.getFullName(),
            "Full name should match");

        // ============================================
        // VERIFY (Optional - Cek method dipanggil)
        // ============================================

        // Verify userRepository.findByEmail() dipanggil 1 kali
        verify(userRepository, times(1)).findByEmail("test@example.com");

        // Verify passwordEncoder.matches() dipanggil 1 kali
        verify(passwordEncoder, times(1))
            .matches("password123", "$2a$10$hashedPassword");

        // Verify jwtUtil.generateToken() dipanggil 1 kali
        verify(jwtUtil, times(1)).generateToken("test@example.com");

        System.out.println("✅ Test 1 PASSED: Login dengan valid credentials berhasil!");
    }

    /**
     * TEST CASE 2: Login dengan email yang tidak terdaftar
     *
     * SKENARIO:
     * - Email "notfound@example.com" tidak ada di database
     * - Harapan: Login gagal, throw exception atau return error
     */
    @Test
    @DisplayName("Test 2: Login dengan email tidak terdaftar - Should throw exception")
    void testLogin_EmailNotFound_ShouldThrowException() {
        // ============================================
        // ARRANGE
        // ============================================
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("notfound@example.com");
        loginRequest.setPassword("password123");

        // Setup: Email tidak ditemukan di database
        when(userRepository.findByEmail("notfound@example.com"))
            .thenReturn(Optional.empty()); // Empty = tidak ada

        // ============================================
        // ACT & ASSERT
        // ============================================

        // Expect exception saat login dengan email tidak ada
        assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        }, "Should throw RuntimeException when email not found");

        // Verify: passwordEncoder TIDAK dipanggil (karena user tidak ada)
        verify(passwordEncoder, never()).matches(anyString(), anyString());

        System.out.println("✅ Test 2 PASSED: Login dengan email tidak ada throw exception!");
    }

    /**
     * TEST CASE 3: Login dengan password yang salah
     *
     * SKENARIO:
     * - Email ada di database
     * - Tapi password tidak cocok
     * - Harapan: Login gagal
     */
    @Test
    @DisplayName("Test 3: Login dengan wrong password - Should throw exception")
    void testLogin_WrongPassword_ShouldThrowException() {
        // ============================================
        // ARRANGE
        // ============================================
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("wrongpassword");

        User mockUser = new User();
        mockUser.setEmail("test@example.com");
        mockUser.setPassword("$2a$10$hashedPassword");

        // Setup: User ditemukan
        when(userRepository.findByEmail("test@example.com"))
            .thenReturn(Optional.of(mockUser));

        // Setup: Password TIDAK cocok
        when(passwordEncoder.matches("wrongpassword", "$2a$10$hashedPassword"))
            .thenReturn(false); // Password salah!

        // ============================================
        // ACT & ASSERT
        // ============================================
        assertThrows(RuntimeException.class, () -> {
            authService.login(loginRequest);
        }, "Should throw RuntimeException when password is wrong");

        // Verify: jwtUtil TIDAK dipanggil (karena password salah)
        verify(jwtUtil, never()).generateToken(anyString());

        System.out.println("✅ Test 3 PASSED: Login dengan password salah throw exception!");
    }

    // ============================================
    // TEST CASES - REGISTRATION FEATURE
    // ============================================

    /**
     * TEST CASE 4: Register user baru dengan data valid
     *
     * SKENARIO:
     * - Email belum terdaftar
     * - Data lengkap dan valid
     * - Harapan: Registrasi berhasil, user tersimpan
     */
    @Test
    @DisplayName("Test 4: Register user baru - Should save user successfully")
    void testRegister_NewUser_ShouldSaveSuccessfully() {
        // ============================================
        // ARRANGE
        // ============================================
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setEmail("newuser@example.com");
        request.setPassword("password123");
        request.setFullName("New User");

        // Setup: Email belum ada di database
        when(userRepository.findByEmail("newuser@example.com"))
            .thenReturn(Optional.empty());

        // Setup: Password encoder hash password
        when(passwordEncoder.encode("password123"))
            .thenReturn("$2a$10$hashedNewPassword");

        // Setup: Save user return saved user
        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setEmail("newuser@example.com");
        savedUser.setFullName("New User");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // ============================================
        // ACT
        // ============================================
        User result = authService.register(request);

        // ============================================
        // ASSERT
        // ============================================
        assertNotNull(result, "Saved user should not be null");
        assertEquals("newuser@example.com", result.getEmail());
        assertEquals("New User", result.getFullName());

        // Verify: save() dipanggil
        verify(userRepository, times(1)).save(any(User.class));

        System.out.println("✅ Test 4 PASSED: Register user baru berhasil!");
    }

    /**
     * TEST CASE 5: Register dengan email yang sudah terdaftar
     *
     * SKENARIO:
     * - Email sudah ada di database
     * - Harapan: Registrasi gagal, throw exception
     */
    @Test
    @DisplayName("Test 5: Register dengan email duplicate - Should throw exception")
    void testRegister_DuplicateEmail_ShouldThrowException() {
        // ============================================
        // ARRANGE
        // ============================================
        UserRegistrationRequest request = new UserRegistrationRequest();
        request.setEmail("existing@example.com");
        request.setPassword("password123");

        User existingUser = new User();
        existingUser.setEmail("existing@example.com");

        // Setup: Email sudah ada
        when(userRepository.findByEmail("existing@example.com"))
            .thenReturn(Optional.of(existingUser));

        // ============================================
        // ACT & ASSERT
        // ============================================
        assertThrows(RuntimeException.class, () -> {
            authService.register(request);
        }, "Should throw exception when email already exists");

        // Verify: save() TIDAK dipanggil
        verify(userRepository, never()).save(any(User.class));

        System.out.println("✅ Test 5 PASSED: Register dengan email duplicate gagal!");
    }
}

/**
 * CARA MENJALANKAN UNIT TEST:
 * ===========================
 *
 * 1. Dari Maven:
 *    mvn test
 *
 * 2. Dari Maven (specific test class):
 *    mvn test -Dtest=AuthServiceTest
 *
 * 3. Dari Maven (specific test method):
 *    mvn test -Dtest=AuthServiceTest#testLogin_ValidCredentials_ShouldReturnSuccessWithToken
 *
 * 4. Dari IDE (IntelliJ/Eclipse):
 *    - Right click pada test file/method
 *    - Klik "Run Test"
 *
 * CARA MEMBACA TEST RESULTS:
 * ==========================
 * ✅ GREEN = Test PASSED (bagus!)
 * ❌ RED = Test FAILED (ada bug!)
 *
 * Output:
 * Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
 * ^^^^^^^^^ Semua test passed!
 *
 * BEST PRACTICES:
 * ===============
 * 1. Test setiap public method
 * 2. Test happy path DAN error path
 * 3. Gunakan descriptive test names
 * 4. Satu assertion concept per test
 * 5. Keep tests independent (tidak bergantung satu sama lain)
 * 6. Mock external dependencies (database, API, dll)
 *
 * TIPS UNTUK PEMULA:
 * ==================
 * 1. Mulai dari test sederhana dulu
 * 2. Pahami AAA pattern (Arrange-Act-Assert)
 * 3. Baca error message dengan teliti
 * 4. Test = Dokumentasi (tulis test yang jelas)
 * 5. Jangan takut test gagal - itu bagian dari proses!
 */
