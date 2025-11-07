package com.registrationform.api.controller;

import com.registrationform.api.dto.UserRegistrationRequest;
import com.registrationform.api.dto.UserResponse;
import com.registrationform.api.dto.UserUpdateRequest;
import com.registrationform.api.entity.User;
import com.registrationform.api.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * UserControllerTest - Unit Tests untuk UserController REST API
 *
 * Controller Layer Testing Focus:
 * 1. HTTP Status Codes (200 OK, 201 Created, 404 Not Found, 400 Bad Request)
 * 2. Request/Response mapping (DTO transformations)
 * 3. Exception handling
 * 4. Path variable & request body processing
 *
 * Teknologi:
 * - JUnit 5 untuk testing framework
 * - Mockito untuk mock UserService
 * - Spring ResponseEntity untuk HTTP responses
 * - DTOs untuk data transfer (tidak pakai Entity langsung)
 *
 * Catatan:
 * - Kita TIDAK test HTTP layer asli (tanpa @WebMvcTest)
 * - Kita test controller logic saja (unit test murni)
 * - UserService di-mock karena logic ada di Service layer
 * - Focus: apakah controller mapping request/response dengan benar?
 *
 * Expected Coverage: ~90%
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("UserController REST API Unit Tests")
public class UserControllerTest {

    /**
     * Mock UserService - kita tidak test service logic di sini
     * Service sudah di-test di UserServiceTest.java
     */
    @Mock
    private UserService userService;

    /**
     * Controller yang akan di-test
     * Mockito inject mock UserService ke controller ini
     */
    @InjectMocks
    private UserController userController;

    // Test data dummy
    private User testUser;
    private UserRegistrationRequest registrationRequest;
    private UserUpdateRequest updateRequest;

    /**
     * Setup test data sebelum setiap test
     * Dipanggil otomatis oleh JUnit sebelum @Test method
     */
    @BeforeEach
    void setUp() {
        // Setup test user entity
        testUser = new User();
        testUser.setId(1L);
        testUser.setFullName("John Doe");
        testUser.setEmail("john@example.com");
        testUser.setPassword("hashedPassword123");
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());

        // Setup registration request DTO
        registrationRequest = new UserRegistrationRequest();
        registrationRequest.setFullName("John Doe");
        registrationRequest.setEmail("john@example.com");
        registrationRequest.setPassword("password123");
        registrationRequest.setConfirmPassword("password123");

        // Setup update request DTO
        updateRequest = new UserUpdateRequest();
        updateRequest.setFullName("John Updated");
        updateRequest.setEmail("johnupdated@example.com");
    }

    // ==================== CREATE USER TESTS ====================

    /**
     * Test 1: POST /api/users - Success
     * Happy Path: Register user baru berhasil
     */
    @Test
    @DisplayName("Should create new user successfully and return 201 CREATED")
    void shouldCreateUserSuccessfully() {
        // Arrange
        when(userService.registerUser(any(User.class))).thenReturn(testUser);

        // Act
        ResponseEntity<UserResponse> response = userController.createUser(registrationRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("John Doe", response.getBody().getFullName());
        assertEquals("john@example.com", response.getBody().getEmail());
        assertNull(response.getBody().getPassword()); // Password tidak boleh di-return

        // Verify service dipanggil 1 kali
        verify(userService, times(1)).registerUser(any(User.class));
    }

    /**
     * Test 2: POST /api/users - Email Already Exists
     * Sad Path: Email sudah terdaftar
     */
    @Test
    @DisplayName("Should return 400 BAD_REQUEST when email already exists")
    void shouldReturn400WhenEmailExists() {
        // Arrange
        when(userService.registerUser(any(User.class)))
                .thenThrow(new RuntimeException("Email sudah terdaftar"));

        // Act
        ResponseEntity<UserResponse> response = userController.createUser(registrationRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        verify(userService, times(1)).registerUser(any(User.class));
    }

    // ==================== GET USER BY ID TESTS ====================

    /**
     * Test 3: GET /api/users/{id} - Success
     * Happy Path: User ditemukan
     */
    @Test
    @DisplayName("Should get user by ID successfully and return 200 OK")
    void shouldGetUserByIdSuccessfully() {
        // Arrange
        when(userService.getUserById(1L)).thenReturn(Optional.of(testUser));

        // Act
        ResponseEntity<UserResponse> response = userController.getUserById(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("John Doe", response.getBody().getFullName());
        assertEquals("john@example.com", response.getBody().getEmail());

        verify(userService, times(1)).getUserById(1L);
    }

    /**
     * Test 4: GET /api/users/{id} - Not Found
     * Sad Path: User tidak ditemukan
     */
    @Test
    @DisplayName("Should return 404 NOT_FOUND when user ID does not exist")
    void shouldReturn404WhenUserIdNotFound() {
        // Arrange
        when(userService.getUserById(999L)).thenReturn(Optional.empty());

        // Act
        ResponseEntity<UserResponse> response = userController.getUserById(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());

        verify(userService, times(1)).getUserById(999L);
    }

    // ==================== GET ALL USERS TESTS ====================

    /**
     * Test 5: GET /api/users - Success with Multiple Users
     * Happy Path: Ambil semua users
     */
    @Test
    @DisplayName("Should get all users successfully and return 200 OK")
    void shouldGetAllUsersSuccessfully() {
        // Arrange
        User user2 = new User();
        user2.setId(2L);
        user2.setFullName("Jane Doe");
        user2.setEmail("jane@example.com");
        user2.setPassword("hashedPassword456");
        user2.setCreatedAt(LocalDateTime.now());
        user2.setUpdatedAt(LocalDateTime.now());

        List<User> users = Arrays.asList(testUser, user2);
        when(userService.getAllUsers()).thenReturn(users);

        // Act
        ResponseEntity<List<UserResponse>> response = userController.getAllUsers();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertEquals("John Doe", response.getBody().get(0).getFullName());
        assertEquals("Jane Doe", response.getBody().get(1).getFullName());

        verify(userService, times(1)).getAllUsers();
    }

    /**
     * Test 6: GET /api/users - Empty List
     * Edge Case: Tidak ada users
     */
    @Test
    @DisplayName("Should return empty list when no users exist")
    void shouldReturnEmptyListWhenNoUsers() {
        // Arrange
        when(userService.getAllUsers()).thenReturn(Arrays.asList());

        // Act
        ResponseEntity<List<UserResponse>> response = userController.getAllUsers();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());

        verify(userService, times(1)).getAllUsers();
    }

    // ==================== UPDATE USER TESTS ====================

    /**
     * Test 7: PUT /api/users/{id} - Success
     * Happy Path: Update user berhasil
     */
    @Test
    @DisplayName("Should update user successfully and return 200 OK")
    void shouldUpdateUserSuccessfully() {
        // Arrange
        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setFullName("John Updated");
        updatedUser.setEmail("johnupdated@example.com");
        updatedUser.setPassword("hashedPassword123");
        updatedUser.setCreatedAt(testUser.getCreatedAt());
        updatedUser.setUpdatedAt(LocalDateTime.now());

        when(userService.updateUser(eq(1L), any(User.class))).thenReturn(updatedUser);

        // Act
        ResponseEntity<UserResponse> response = userController.updateUser(1L, updateRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("John Updated", response.getBody().getFullName());
        assertEquals("johnupdated@example.com", response.getBody().getEmail());

        verify(userService, times(1)).updateUser(eq(1L), any(User.class));
    }

    /**
     * Test 8: PUT /api/users/{id} - User Not Found
     * Sad Path: User tidak ditemukan untuk update
     */
    @Test
    @DisplayName("Should return 400 BAD_REQUEST when updating non-existing user")
    void shouldReturn400WhenUpdateUserNotFound() {
        // Arrange
        when(userService.updateUser(eq(999L), any(User.class)))
                .thenThrow(new RuntimeException("User tidak ditemukan"));

        // Act
        ResponseEntity<UserResponse> response = userController.updateUser(999L, updateRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        verify(userService, times(1)).updateUser(eq(999L), any(User.class));
    }

    /**
     * Test 9: PUT /api/users/{id} - Partial Update (Only Full Name)
     * Edge Case: Update hanya nama, email dan password tidak berubah
     */
    @Test
    @DisplayName("Should update only full name when other fields are null")
    void shouldUpdateOnlyFullName() {
        // Arrange
        UserUpdateRequest partialUpdate = new UserUpdateRequest();
        partialUpdate.setFullName("John Partial Update");
        // email dan password = null

        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setFullName("John Partial Update");
        updatedUser.setEmail(testUser.getEmail()); // Email tidak berubah
        updatedUser.setPassword(testUser.getPassword());
        updatedUser.setCreatedAt(testUser.getCreatedAt());
        updatedUser.setUpdatedAt(LocalDateTime.now());

        when(userService.updateUser(eq(1L), any(User.class))).thenReturn(updatedUser);

        // Act
        ResponseEntity<UserResponse> response = userController.updateUser(1L, partialUpdate);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("John Partial Update", response.getBody().getFullName());
        assertEquals(testUser.getEmail(), response.getBody().getEmail()); // Email tetap sama

        verify(userService, times(1)).updateUser(eq(1L), any(User.class));
    }

    // ==================== DELETE USER TESTS ====================

    /**
     * Test 10: DELETE /api/users/{id} - Success
     * Happy Path: Delete user berhasil
     */
    @Test
    @DisplayName("Should delete user successfully and return 200 OK")
    void shouldDeleteUserSuccessfully() {
        // Arrange
        doNothing().when(userService).deleteUser(1L);

        // Act
        ResponseEntity<String> response = userController.deleteUser(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User berhasil dihapus", response.getBody());

        verify(userService, times(1)).deleteUser(1L);
    }

    /**
     * Test 11: DELETE /api/users/{id} - Not Found
     * Sad Path: User tidak ditemukan untuk delete
     */
    @Test
    @DisplayName("Should return 404 NOT_FOUND when deleting non-existing user")
    void shouldReturn404WhenDeleteUserNotFound() {
        // Arrange
        doThrow(new RuntimeException("User tidak ditemukan"))
                .when(userService).deleteUser(999L);

        // Act
        ResponseEntity<String> response = userController.deleteUser(999L);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("User tidak ditemukan", response.getBody());

        verify(userService, times(1)).deleteUser(999L);
    }

    // ==================== GET USER BY EMAIL TESTS ====================

    /**
     * Test 12: GET /api/users/email/{email} - Success
     * Happy Path: User ditemukan by email
     */
    @Test
    @DisplayName("Should get user by email successfully and return 200 OK")
    void shouldGetUserByEmailSuccessfully() {
        // Arrange
        when(userService.getUserByEmail("john@example.com")).thenReturn(Optional.of(testUser));

        // Act
        ResponseEntity<UserResponse> response = userController.getUserByEmail("john@example.com");

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("John Doe", response.getBody().getFullName());
        assertEquals("john@example.com", response.getBody().getEmail());

        verify(userService, times(1)).getUserByEmail("john@example.com");
    }

    /**
     * Test 13: GET /api/users/email/{email} - Not Found
     * Sad Path: Email tidak ditemukan
     */
    @Test
    @DisplayName("Should return 404 NOT_FOUND when email does not exist")
    void shouldReturn404WhenEmailNotFound() {
        // Arrange
        when(userService.getUserByEmail("notfound@example.com")).thenReturn(Optional.empty());

        // Act
        ResponseEntity<UserResponse> response = userController.getUserByEmail("notfound@example.com");

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());

        verify(userService, times(1)).getUserByEmail("notfound@example.com");
    }

    // ==================== GET USER COUNT TESTS ====================

    /**
     * Test 14: GET /api/users/count - Success with Multiple Users
     * Happy Path: Count users
     */
    @Test
    @DisplayName("Should get user count successfully and return 200 OK")
    void shouldGetUserCountSuccessfully() {
        // Arrange
        when(userService.getUserCount()).thenReturn(5L);

        // Act
        ResponseEntity<Long> response = userController.getUserCount();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(5L, response.getBody());

        verify(userService, times(1)).getUserCount();
    }

    /**
     * Test 15: GET /api/users/count - Zero Users
     * Edge Case: Tidak ada users di database
     */
    @Test
    @DisplayName("Should return zero count when no users exist")
    void shouldReturnZeroCount() {
        // Arrange
        when(userService.getUserCount()).thenReturn(0L);

        // Act
        ResponseEntity<Long> response = userController.getUserCount();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(0L, response.getBody());

        verify(userService, times(1)).getUserCount();
    }

    // ==================== CHECK EMAIL EXISTS TESTS ====================

    /**
     * Test 16: GET /api/users/check-email/{email} - Email Exists
     * Happy Path: Email sudah terdaftar
     */
    @Test
    @DisplayName("Should return true when email exists")
    void shouldReturnTrueWhenEmailExists() {
        // Arrange
        when(userService.isEmailExists("john@example.com")).thenReturn(true);

        // Act
        ResponseEntity<Boolean> response = userController.checkEmailExists("john@example.com");

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody());

        verify(userService, times(1)).isEmailExists("john@example.com");
    }

    /**
     * Test 17: GET /api/users/check-email/{email} - Email Not Exists
     * Happy Path: Email belum terdaftar
     */
    @Test
    @DisplayName("Should return false when email does not exist")
    void shouldReturnFalseWhenEmailNotExists() {
        // Arrange
        when(userService.isEmailExists("newuser@example.com")).thenReturn(false);

        // Act
        ResponseEntity<Boolean> response = userController.checkEmailExists("newuser@example.com");

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody());

        verify(userService, times(1)).isEmailExists("newuser@example.com");
    }

    // ==================== ADDITIONAL EDGE CASE TESTS ====================

    /**
     * Test 18: POST /api/users - Validation Error (Service throws exception)
     * Edge Case: Service throw generic RuntimeException
     */
    @Test
    @DisplayName("Should handle service exceptions gracefully")
    void shouldHandleServiceExceptions() {
        // Arrange
        when(userService.registerUser(any(User.class)))
                .thenThrow(new RuntimeException("Database connection error"));

        // Act
        ResponseEntity<UserResponse> response = userController.createUser(registrationRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNull(response.getBody());

        verify(userService, times(1)).registerUser(any(User.class));
    }

    /**
     * Test 19: GET /api/users/{id} - Test with Different IDs
     * Edge Case: Test dengan berbagai ID (positive, large number)
     */
    @Test
    @DisplayName("Should handle different user ID formats correctly")
    void shouldHandleDifferentUserIds() {
        // Test ID 1 (small number)
        when(userService.getUserById(1L)).thenReturn(Optional.of(testUser));
        ResponseEntity<UserResponse> response1 = userController.getUserById(1L);
        assertEquals(HttpStatus.OK, response1.getStatusCode());

        // Test ID 1000000 (large number)
        when(userService.getUserById(1000000L)).thenReturn(Optional.empty());
        ResponseEntity<UserResponse> response2 = userController.getUserById(1000000L);
        assertEquals(HttpStatus.NOT_FOUND, response2.getStatusCode());

        verify(userService, times(1)).getUserById(1L);
        verify(userService, times(1)).getUserById(1000000L);
    }

    /**
     * Test 20: GET /api/users/email/{email} - Test with Different Email Formats
     * Edge Case: Email dengan format berbeda
     */
    @Test
    @DisplayName("Should handle different email formats correctly")
    void shouldHandleDifferentEmailFormats() {
        // Email dengan subdomain
        String email1 = "user@subdomain.example.com";
        when(userService.getUserByEmail(email1)).thenReturn(Optional.empty());
        ResponseEntity<UserResponse> response1 = userController.getUserByEmail(email1);
        assertEquals(HttpStatus.NOT_FOUND, response1.getStatusCode());

        // Email dengan plus addressing
        String email2 = "user+tag@example.com";
        when(userService.getUserByEmail(email2)).thenReturn(Optional.empty());
        ResponseEntity<UserResponse> response2 = userController.getUserByEmail(email2);
        assertEquals(HttpStatus.NOT_FOUND, response2.getStatusCode());

        verify(userService, times(1)).getUserByEmail(email1);
        verify(userService, times(1)).getUserByEmail(email2);
    }
}
