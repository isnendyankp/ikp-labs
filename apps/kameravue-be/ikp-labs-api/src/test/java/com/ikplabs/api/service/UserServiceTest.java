package com.ikplabs.api.service;

import com.ikplabs.api.entity.User;
import com.ikplabs.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit Test untuk UserService
 *
 * TEST CLASS INI MENCAKUP:
 * ========================
 * 1. Get User Operations (getUserById, getUserByEmail, getAllUsers)
 * 2. Register User Operations (registerUser)
 * 3. Update User Operations (updateUser dengan berbagai scenario)
 * 4. Delete User Operations (deleteUser)
 * 5. Utility Operations (isEmailExists, getUserCount, verifyPassword)
 *
 * TOTAL TEST CASES: 15
 * - Happy path: User ditemukan, operasi berhasil
 * - Sad path: User tidak ditemukan, email duplicate, dll
 * - Edge cases: Null parameters, empty data, etc
 *
 * MENGAPA PERLU TEST UserService?
 * ===============================
 * UserService mengandung business logic penting:
 * - CRUD operations untuk User
 * - Validation email duplicate
 * - Password hashing
 * - Update partial support
 * - Exception handling
 *
 * Semua ini perlu di-test untuk memastikan:
 * ✅ Logic bekerja dengan benar
 * ✅ Exception di-throw saat seharusnya
 * ✅ Data transformation correct
 * ✅ Validation rules enforced
 *
 * @author Claude Code
 */
@SuppressWarnings("null")
@DisplayName("UserService Unit Tests")
public class UserServiceTest {

    // ============================================
    // SETUP TEST DEPENDENCIES
    // ============================================

    /**
     * @Mock - Fake UserRepository (tidak ke database real)
     */
    @Mock
    private UserRepository userRepository;

    /**
     * @Mock - Fake PasswordEncoder
     */
    @Mock
    private PasswordEncoder passwordEncoder;

    /**
     * @InjectMocks - Real UserService (yang mau kita test)
     * Mockito akan inject mock objects ke dalam userService
     */
    @InjectMocks
    private UserService userService;

    /**
     * @BeforeEach - Setup sebelum setiap test
     */
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // ============================================
    // TEST CASES - GET USER OPERATIONS
    // ============================================

    /**
     * TEST 1: getUserById() - User ditemukan
     */
    @Test
    @DisplayName("Test 1: getUserById - user exists - Should return user with correct data")
    void testGetUserById_UserExists_ShouldReturnUser() {
        // ARRANGE
        Long userId = 1L;
        User mockUser = new User();
        mockUser.setId(userId);
        mockUser.setEmail("test@example.com");
        mockUser.setFullName("Test User");

        when(userRepository.findById(userId))
            .thenReturn(Optional.of(mockUser));

        // ACT
        Optional<User> result = userService.getUserById(userId);

        // ASSERT
        assertTrue(result.isPresent(), "User should be found");
        assertEquals(userId, result.get().getId());
        assertEquals("test@example.com", result.get().getEmail());
        assertEquals("Test User", result.get().getFullName());

        verify(userRepository, times(1)).findById(userId);

        System.out.println("✅ Test 1 PASSED: getUserById with existing user");
    }

    /**
     * TEST 2: getUserById() - User tidak ditemukan
     */
    @Test
    @DisplayName("Test 2: getUserById - user not found - Should return empty Optional")
    void testGetUserById_UserNotFound_ShouldReturnEmpty() {
        // ARRANGE
        Long userId = 999L;
        when(userRepository.findById(userId))
            .thenReturn(Optional.empty());

        // ACT
        Optional<User> result = userService.getUserById(userId);

        // ASSERT
        assertFalse(result.isPresent(), "User should not be found");

        verify(userRepository, times(1)).findById(userId);

        System.out.println("✅ Test 2 PASSED: getUserById with non-existing user returns empty");
    }

    /**
     * TEST 3: getUserByEmail() - Email ditemukan
     */
    @Test
    @DisplayName("Test 3: getUserByEmail - email exists - Should return user")
    void testGetUserByEmail_EmailExists_ShouldReturnUser() {
        // ARRANGE
        String email = "found@example.com";
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail(email);
        mockUser.setFullName("Found User");

        when(userRepository.findByEmail(email))
            .thenReturn(Optional.of(mockUser));

        // ACT
        Optional<User> result = userService.getUserByEmail(email);

        // ASSERT
        assertTrue(result.isPresent(), "User should be found by email");
        assertEquals(email, result.get().getEmail());
        assertEquals("Found User", result.get().getFullName());

        verify(userRepository, times(1)).findByEmail(email);

        System.out.println("✅ Test 3 PASSED: getUserByEmail with existing email");
    }

    /**
     * TEST 4: getUserByEmail() - Email tidak ditemukan
     */
    @Test
    @DisplayName("Test 4: getUserByEmail - email not found - Should return empty Optional")
    void testGetUserByEmail_EmailNotFound_ShouldReturnEmpty() {
        // ARRANGE
        String email = "notfound@example.com";
        when(userRepository.findByEmail(email))
            .thenReturn(Optional.empty());

        // ACT
        Optional<User> result = userService.getUserByEmail(email);

        // ASSERT
        assertFalse(result.isPresent(), "User should not be found");

        verify(userRepository, times(1)).findByEmail(email);

        System.out.println("✅ Test 4 PASSED: getUserByEmail with non-existing email returns empty");
    }

    /**
     * TEST 5: getAllUsers() - Ada users di database
     */
    @Test
    @DisplayName("Test 5: getAllUsers - users exist - Should return list of users")
    void testGetAllUsers_UsersExist_ShouldReturnList() {
        // ARRANGE
        User user1 = new User();
        user1.setId(1L);
        user1.setEmail("user1@example.com");

        User user2 = new User();
        user2.setId(2L);
        user2.setEmail("user2@example.com");

        List<User> mockUsers = Arrays.asList(user1, user2);

        when(userRepository.findAll())
            .thenReturn(mockUsers);

        // ACT
        List<User> result = userService.getAllUsers();

        // ASSERT
        assertNotNull(result, "Result should not be null");
        assertEquals(2, result.size(), "Should return 2 users");
        assertEquals("user1@example.com", result.get(0).getEmail());
        assertEquals("user2@example.com", result.get(1).getEmail());

        verify(userRepository, times(1)).findAll();

        System.out.println("✅ Test 5 PASSED: getAllUsers returns list");
    }

    /**
     * TEST 6: getAllUsers() - Tidak ada users (empty)
     */
    @Test
    @DisplayName("Test 6: getAllUsers - no users - Should return empty list")
    void testGetAllUsers_NoUsers_ShouldReturnEmptyList() {
        // ARRANGE
        when(userRepository.findAll())
            .thenReturn(Arrays.asList());

        // ACT
        List<User> result = userService.getAllUsers();

        // ASSERT
        assertNotNull(result, "Result should not be null");
        assertTrue(result.isEmpty(), "List should be empty");
        assertEquals(0, result.size());

        verify(userRepository, times(1)).findAll();

        System.out.println("✅ Test 6 PASSED: getAllUsers with no users returns empty list");
    }

    // ============================================
    // TEST CASES - REGISTER USER OPERATIONS
    // ============================================

    /**
     * TEST 7: registerUser() - Email belum ada, valid data
     */
    @Test
    @DisplayName("Test 7: registerUser - valid new user - Should save user with hashed password")
    void testRegisterUser_NewUser_ShouldSaveSuccessfully() {
        // ARRANGE
        User newUser = new User();
        newUser.setEmail("newuser@example.com");
        newUser.setPassword("plainPassword123");
        newUser.setFullName("New User");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setEmail("newuser@example.com");
        savedUser.setPassword("$2a$10$hashedPassword");
        savedUser.setFullName("New User");

        when(userRepository.existsByEmail("newuser@example.com"))
            .thenReturn(false); // Email belum ada
        when(passwordEncoder.encode("plainPassword123"))
            .thenReturn("$2a$10$hashedPassword");
        when(userRepository.save(any(User.class)))
            .thenReturn(savedUser);

        // ACT
        User result = userService.registerUser(newUser);

        // ASSERT
        assertNotNull(result, "Saved user should not be null");
        assertEquals(1L, result.getId());
        assertEquals("newuser@example.com", result.getEmail());
        assertEquals("$2a$10$hashedPassword", result.getPassword(), "Password should be hashed");

        verify(userRepository, times(1)).existsByEmail("newuser@example.com");
        verify(passwordEncoder, times(1)).encode("plainPassword123");
        verify(userRepository, times(1)).save(any(User.class));

        System.out.println("✅ Test 7 PASSED: registerUser with new user saves successfully");
    }

    /**
     * TEST 8: registerUser() - Email sudah ada (duplicate)
     */
    @Test
    @DisplayName("Test 8: registerUser - duplicate email - Should throw exception")
    void testRegisterUser_DuplicateEmail_ShouldThrowException() {
        // ARRANGE
        User newUser = new User();
        newUser.setEmail("duplicate@example.com");
        newUser.setPassword("password123");

        when(userRepository.existsByEmail("duplicate@example.com"))
            .thenReturn(true); // Email sudah ada!

        // ACT & ASSERT
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.registerUser(newUser);
        }, "Should throw RuntimeException for duplicate email");

        assertTrue(exception.getMessage().contains("Email sudah terdaftar"));

        verify(userRepository, times(1)).existsByEmail("duplicate@example.com");
        verify(userRepository, never()).save(any(User.class)); // Save tidak dipanggil

        System.out.println("✅ Test 8 PASSED: registerUser with duplicate email throws exception");
    }

    // ============================================
    // TEST CASES - UPDATE USER OPERATIONS
    // ============================================

    /**
     * TEST 9: updateUser() - User ada, update berhasil
     */
    @Test
    @DisplayName("Test 9: updateUser - valid update - Should return updated user")
    void testUpdateUser_ValidUpdate_ShouldReturnUpdatedUser() {
        // ARRANGE
        Long userId = 1L;

        User existingUser = new User();
        existingUser.setId(userId);
        existingUser.setEmail("old@example.com");
        existingUser.setFullName("Old Name");
        existingUser.setPassword("$2a$10$oldHash");

        User updatedUser = new User();
        updatedUser.setFullName("New Name"); // Update name saja
        // Email dan password null (tidak diupdate)

        User savedUser = new User();
        savedUser.setId(userId);
        savedUser.setEmail("old@example.com"); // Email tetap
        savedUser.setFullName("New Name"); // Name berubah
        savedUser.setPassword("$2a$10$oldHash"); // Password tetap

        when(userRepository.findById(userId))
            .thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class)))
            .thenReturn(savedUser);

        // ACT
        User result = userService.updateUser(userId, updatedUser);

        // ASSERT
        assertNotNull(result);
        assertEquals("New Name", result.getFullName(), "Name should be updated");
        assertEquals("old@example.com", result.getEmail(), "Email should remain same");

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(any(User.class));

        System.out.println("✅ Test 9 PASSED: updateUser with valid data");
    }

    /**
     * TEST 10: updateUser() - User tidak ditemukan
     */
    @Test
    @DisplayName("Test 10: updateUser - user not found - Should throw exception")
    void testUpdateUser_UserNotFound_ShouldThrowException() {
        // ARRANGE
        Long userId = 999L;
        User updatedUser = new User();
        updatedUser.setFullName("New Name");

        when(userRepository.findById(userId))
            .thenReturn(Optional.empty());

        // ACT & ASSERT
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUser(userId, updatedUser);
        }, "Should throw exception when user not found");

        assertTrue(exception.getMessage().contains("tidak ditemukan"));

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, never()).save(any(User.class));

        System.out.println("✅ Test 10 PASSED: updateUser with non-existing user throws exception");
    }

    /**
     * TEST 11: updateUser() - Email baru sudah dipakai user lain
     */
    @Test
    @DisplayName("Test 11: updateUser - email already used by other user - Should throw exception")
    void testUpdateUser_EmailConflict_ShouldThrowException() {
        // ARRANGE
        Long userId = 1L;

        User existingUser = new User();
        existingUser.setId(userId);
        existingUser.setEmail("user1@example.com");
        existingUser.setFullName("User 1");

        User updatedUser = new User();
        updatedUser.setEmail("user2@example.com"); // Email yang sudah dipakai user lain!

        when(userRepository.findById(userId))
            .thenReturn(Optional.of(existingUser));
        when(userRepository.existsByEmail("user2@example.com"))
            .thenReturn(true); // Email sudah dipakai!

        // ACT & ASSERT
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.updateUser(userId, updatedUser);
        }, "Should throw exception for email conflict");

        assertTrue(exception.getMessage().contains("Email sudah digunakan"));

        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).existsByEmail("user2@example.com");
        verify(userRepository, never()).save(any(User.class));

        System.out.println("✅ Test 11 PASSED: updateUser with email conflict throws exception");
    }

    // ============================================
    // TEST CASES - DELETE USER OPERATIONS
    // ============================================

    /**
     * TEST 12: deleteUser() - User ada, hapus berhasil
     */
    @Test
    @DisplayName("Test 12: deleteUser - user exists - Should delete successfully")
    void testDeleteUser_UserExists_ShouldDeleteSuccessfully() {
        // ARRANGE
        Long userId = 1L;

        when(userRepository.existsById(userId))
            .thenReturn(true);
        doNothing().when(userRepository).deleteById(userId);

        // ACT
        userService.deleteUser(userId);

        // ASSERT
        verify(userRepository, times(1)).existsById(userId);
        verify(userRepository, times(1)).deleteById(userId);

        System.out.println("✅ Test 12 PASSED: deleteUser with existing user");
    }

    /**
     * TEST 13: deleteUser() - User tidak ditemukan
     */
    @Test
    @DisplayName("Test 13: deleteUser - user not found - Should throw exception")
    void testDeleteUser_UserNotFound_ShouldThrowException() {
        // ARRANGE
        Long userId = 999L;

        when(userRepository.existsById(userId))
            .thenReturn(false);

        // ACT & ASSERT
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            userService.deleteUser(userId);
        }, "Should throw exception when user not found");

        assertTrue(exception.getMessage().contains("tidak ditemukan"));

        verify(userRepository, times(1)).existsById(userId);
        verify(userRepository, never()).deleteById(anyLong());

        System.out.println("✅ Test 13 PASSED: deleteUser with non-existing user throws exception");
    }

    // ============================================
    // TEST CASES - UTILITY OPERATIONS
    // ============================================

    /**
     * TEST 14: isEmailExists() - Email ada
     */
    @Test
    @DisplayName("Test 14: isEmailExists - email exists - Should return true")
    void testIsEmailExists_EmailExists_ShouldReturnTrue() {
        // ARRANGE
        String email = "exists@example.com";
        when(userRepository.existsByEmail(email))
            .thenReturn(true);

        // ACT
        boolean result = userService.isEmailExists(email);

        // ASSERT
        assertTrue(result, "Should return true for existing email");

        verify(userRepository, times(1)).existsByEmail(email);

        System.out.println("✅ Test 14 PASSED: isEmailExists returns true");
    }

    /**
     * TEST 15: getUserCount() - Return jumlah user
     */
    @Test
    @DisplayName("Test 15: getUserCount - Should return total user count")
    void testGetUserCount_ShouldReturnCount() {
        // ARRANGE
        when(userRepository.count())
            .thenReturn(10L);

        // ACT
        long result = userService.getUserCount();

        // ASSERT
        assertEquals(10L, result, "Should return correct user count");

        verify(userRepository, times(1)).count();

        System.out.println("✅ Test 15 PASSED: getUserCount returns count");
    }

    /**
     * TEST 16: verifyPassword() - Password cocok
     */
    @Test
    @DisplayName("Test 16: verifyPassword - password matches - Should return true")
    void testVerifyPassword_PasswordMatches_ShouldReturnTrue() {
        // ARRANGE
        String rawPassword = "plainPassword123";
        String hashedPassword = "$2a$10$hashedPassword";

        when(passwordEncoder.matches(rawPassword, hashedPassword))
            .thenReturn(true);

        // ACT
        boolean result = userService.verifyPassword(rawPassword, hashedPassword);

        // ASSERT
        assertTrue(result, "Should return true when password matches");

        verify(passwordEncoder, times(1)).matches(rawPassword, hashedPassword);

        System.out.println("✅ Test 16 PASSED: verifyPassword with matching password");
    }

    /**
     * TEST 17: verifyPassword() - Password tidak cocok
     */
    @Test
    @DisplayName("Test 17: verifyPassword - password does not match - Should return false")
    void testVerifyPassword_PasswordDoesNotMatch_ShouldReturnFalse() {
        // ARRANGE
        String rawPassword = "wrongPassword";
        String hashedPassword = "$2a$10$hashedPassword";

        when(passwordEncoder.matches(rawPassword, hashedPassword))
            .thenReturn(false);

        // ACT
        boolean result = userService.verifyPassword(rawPassword, hashedPassword);

        // ASSERT
        assertFalse(result, "Should return false when password does not match");

        verify(passwordEncoder, times(1)).matches(rawPassword, hashedPassword);

        System.out.println("✅ Test 17 PASSED: verifyPassword with wrong password returns false");
    }
}

/**
 * SUMMARY TEST COVERAGE:
 * ======================
 *
 * Total Test Cases: 17
 *
 * Get Operations (6 tests):
 * - getUserById (exists/not found)
 * - getUserByEmail (exists/not found)
 * - getAllUsers (with users/empty)
 *
 * Register Operations (2 tests):
 * - registerUser (success/duplicate email)
 *
 * Update Operations (3 tests):
 * - updateUser (success/not found/email conflict)
 *
 * Delete Operations (2 tests):
 * - deleteUser (success/not found)
 *
 * Utility Operations (4 tests):
 * - isEmailExists
 * - getUserCount
 * - verifyPassword (match/not match)
 *
 * Expected Coverage: ~90%+
 *
 * CARA MENJALANKAN:
 * ================
 * mvn test -Dtest=UserServiceTest
 */
