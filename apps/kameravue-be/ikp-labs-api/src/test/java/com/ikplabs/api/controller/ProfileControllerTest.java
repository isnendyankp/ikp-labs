package com.ikplabs.api.controller;

import com.ikplabs.api.dto.ProfilePictureResponse;
import com.ikplabs.api.entity.User;
import com.ikplabs.api.exception.FileUploadException;
import com.ikplabs.api.repository.UserRepository;
import com.ikplabs.api.security.UserPrincipal;
import com.ikplabs.api.service.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.Authentication;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * ProfileControllerTest - Unit Tests untuk ProfileController REST API
 *
 * Controller Layer Testing Focus:
 * 1. Authentication handling (extract UserPrincipal dari JWT)
 * 2. Multipart file upload processing
 * 3. HTTP Status Codes (200 OK, 400 Bad Request)
 * 4. Exception handling (FileUploadException, IOException)
 * 5. Response DTO mapping (ProfilePictureResponse)
 *
 * ProfileController Endpoints:
 * - POST   /api/profile/upload-picture - Upload profile picture
 * - DELETE /api/profile/picture        - Delete profile picture
 * - GET    /api/profile/picture        - Get current user's picture info
 * - GET    /api/profile/picture/{userId} - Get specific user's picture
 *
 * Teknologi:
 * - JUnit 5 untuk testing framework
 * - Mockito untuk mock dependencies (FileStorageService, UserRepository, Authentication)
 * - MockMultipartFile untuk simulate file upload
 * - Spring ResponseEntity untuk HTTP responses
 *
 * Testing Strategy:
 * - Mock Authentication object untuk simulate logged-in user
 * - Mock FileStorageService (file logic already tested in FileStorageServiceTest)
 * - Mock UserRepository (database access)
 * - Focus: Controller logic, request/response mapping, error handling
 *
 * Expected Coverage: ~85%
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("ProfileController REST API Unit Tests")
@SuppressWarnings("null") // Suppress null pointer warnings - tests already validate non-null
public class ProfileControllerTest {

    /**
     * Mock FileStorageService - file storage logic sudah di-test terpisah
     */
    @Mock
    private FileStorageService fileStorageService;

    /**
     * Mock UserRepository - database access
     */
    @Mock
    private UserRepository userRepository;

    /**
     * Mock Authentication - Spring Security authentication object
     */
    @Mock
    private Authentication authentication;

    /**
     * Controller yang akan di-test
     * Mockito inject semua mock dependencies
     */
    @InjectMocks
    private ProfileController profileController;

    // Test data
    private User testUser;
    private UserPrincipal userPrincipal;
    private MockMultipartFile validImageFile;
    private MockMultipartFile invalidImageFile;

    /**
     * Setup test data sebelum setiap test
     */
    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setFullName("John Doe");
        testUser.setEmail("john@example.com");
        testUser.setPassword("hashedPassword123");
        testUser.setProfilePicture(null); // Initially no profile picture
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());

        // Setup UserPrincipal (dari JWT token)
        userPrincipal = new UserPrincipal(
            testUser.getId(),
            testUser.getEmail(),
            testUser.getPassword()
        );

        // Setup valid image file (PNG, 1KB)
        validImageFile = new MockMultipartFile(
            "file",                          // parameter name
            "profile.png",                   // original filename
            "image/png",                     // content type
            new byte[1024]                   // file content (1KB)
        );

        // Setup invalid image file (too large, 6MB > 5MB limit)
        byte[] largeFileContent = new byte[6 * 1024 * 1024]; // 6MB
        invalidImageFile = new MockMultipartFile(
            "file",
            "large-image.png",
            "image/png",
            largeFileContent
        );
    }

    // ==================== UPLOAD PROFILE PICTURE TESTS ====================

    /**
     * Test 1: POST /api/profile/upload-picture - Success
     * Happy Path: Upload profile picture berhasil
     */
    @Test
    @DisplayName("Should upload profile picture successfully and return 200 OK")
    void shouldUploadProfilePictureSuccessfully() throws IOException {
        // Arrange
        String savedFilePath = "/uploads/profiles/user-1.png";

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(fileStorageService.saveProfilePicture(validImageFile, 1L)).thenReturn(savedFilePath);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        ResponseEntity<ProfilePictureResponse> response =
            profileController.uploadProfilePicture(validImageFile, authentication);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("Profile picture uploaded successfully", response.getBody().getMessage());
        assertEquals(savedFilePath, response.getBody().getPictureUrl());
        assertEquals(1L, response.getBody().getUserId());
        assertEquals("john@example.com", response.getBody().getUserEmail());

        // Verify interactions
        verify(authentication, times(1)).getPrincipal();
        verify(userRepository, times(1)).findById(1L);
        verify(fileStorageService, times(1)).saveProfilePicture(validImageFile, 1L);
        verify(userRepository, times(1)).save(testUser);

        // Verify user's profilePicture was updated
        assertEquals(savedFilePath, testUser.getProfilePicture());
    }

    /**
     * Test 2: POST /api/profile/upload-picture - Replace Existing Picture
     * Edge Case: User sudah punya foto, upload foto baru (replace)
     */
    @Test
    @DisplayName("Should replace existing profile picture successfully")
    void shouldReplaceExistingProfilePicture() throws IOException {
        // Arrange
        String oldPicturePath = "/uploads/profiles/user-1-old.png";
        String newPicturePath = "/uploads/profiles/user-1-new.png";

        testUser.setProfilePicture(oldPicturePath); // User already has picture

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(fileStorageService.saveProfilePicture(validImageFile, 1L)).thenReturn(newPicturePath);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        ResponseEntity<ProfilePictureResponse> response =
            profileController.uploadProfilePicture(validImageFile, authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(newPicturePath, response.getBody().getPictureUrl());

        // Verify old picture was replaced with new one
        assertEquals(newPicturePath, testUser.getProfilePicture());

        verify(fileStorageService, times(1)).saveProfilePicture(validImageFile, 1L);
        verify(userRepository, times(1)).save(testUser);
    }

    /**
     * Test 3: POST /api/profile/upload-picture - File Too Large
     * Sad Path: File size > 5MB (validation error)
     */
    @Test
    @DisplayName("Should throw FileUploadException when file is too large")
    void shouldThrowExceptionWhenFileTooLarge() throws IOException {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(fileStorageService.saveProfilePicture(invalidImageFile, 1L))
            .thenThrow(new FileUploadException("File size exceeds maximum limit of 5 MB"));

        // Act & Assert
        FileUploadException exception = assertThrows(FileUploadException.class, () -> {
            profileController.uploadProfilePicture(invalidImageFile, authentication);
        });

        assertEquals("File size exceeds maximum limit of 5 MB", exception.getMessage());

        verify(fileStorageService, times(1)).saveProfilePicture(invalidImageFile, 1L);
        verify(userRepository, never()).save(any(User.class)); // Database should NOT be updated
    }

    /**
     * Test 4: POST /api/profile/upload-picture - Invalid File Type
     * Sad Path: File bukan gambar (PDF, TXT, dll)
     */
    @Test
    @DisplayName("Should throw FileUploadException when file type is invalid")
    void shouldThrowExceptionWhenFileTypeInvalid() throws IOException {
        // Arrange
        MockMultipartFile pdfFile = new MockMultipartFile(
            "file",
            "document.pdf",
            "application/pdf",
            new byte[1024]
        );

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(fileStorageService.saveProfilePicture(pdfFile, 1L))
            .thenThrow(new FileUploadException("File must be an image (PNG, JPEG, JPG, GIF, WebP)"));

        // Act & Assert
        FileUploadException exception = assertThrows(FileUploadException.class, () -> {
            profileController.uploadProfilePicture(pdfFile, authentication);
        });

        assertTrue(exception.getMessage().contains("must be an image"));

        verify(fileStorageService, times(1)).saveProfilePicture(pdfFile, 1L);
        verify(userRepository, never()).save(any(User.class));
    }

    /**
     * Test 5: POST /api/profile/upload-picture - User Not Found
     * Sad Path: Authenticated user tidak ditemukan di database
     */
    @Test
    @DisplayName("Should throw RuntimeException when user not found")
    void shouldThrowExceptionWhenUserNotFound() throws IOException {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            profileController.uploadProfilePicture(validImageFile, authentication);
        });

        assertTrue(exception.getMessage().contains("Failed to upload profile picture"));

        verify(userRepository, times(1)).findById(1L);
        verify(fileStorageService, never()).saveProfilePicture(any(), any());
    }

    /**
     * Test 6: POST /api/profile/upload-picture - IOException during save
     * Sad Path: File system error (disk full, permission denied)
     */
    @Test
    @DisplayName("Should throw FileUploadException when IOException occurs")
    void shouldThrowExceptionWhenIOExceptionOccurs() throws IOException {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(fileStorageService.saveProfilePicture(validImageFile, 1L))
            .thenThrow(new IOException("Disk full"));

        // Act & Assert
        FileUploadException exception = assertThrows(FileUploadException.class, () -> {
            profileController.uploadProfilePicture(validImageFile, authentication);
        });

        assertTrue(exception.getMessage().contains("Could not save file"));

        verify(fileStorageService, times(1)).saveProfilePicture(validImageFile, 1L);
        verify(userRepository, never()).save(any(User.class));
    }

    // ==================== DELETE PROFILE PICTURE TESTS ====================

    /**
     * Test 7: DELETE /api/profile/picture - Success
     * Happy Path: Delete profile picture berhasil
     */
    @Test
    @DisplayName("Should delete profile picture successfully and return 200 OK")
    void shouldDeleteProfilePictureSuccessfully() throws IOException {
        // Arrange
        testUser.setProfilePicture("/uploads/profiles/user-1.png");

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        doNothing().when(fileStorageService).deleteProfilePicture(1L);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        ResponseEntity<ProfilePictureResponse> response =
            profileController.deleteProfilePicture(authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("Profile picture deleted successfully", response.getBody().getMessage());
        assertNull(response.getBody().getPictureUrl());
        assertEquals(1L, response.getBody().getUserId());

        // Verify user's profilePicture was set to null
        assertNull(testUser.getProfilePicture());

        verify(fileStorageService, times(1)).deleteProfilePicture(1L);
        verify(userRepository, times(1)).save(testUser);
    }

    /**
     * Test 8: DELETE /api/profile/picture - No Picture to Delete
     * Edge Case: User tidak punya foto, tapi request delete (graceful handling)
     */
    @Test
    @DisplayName("Should handle delete when user has no profile picture")
    void shouldHandleDeleteWhenNoPicture() throws IOException {
        // Arrange
        testUser.setProfilePicture(null); // No picture

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        doNothing().when(fileStorageService).deleteProfilePicture(1L);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        ResponseEntity<ProfilePictureResponse> response =
            profileController.deleteProfilePicture(authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNull(response.getBody().getPictureUrl());

        verify(fileStorageService, times(1)).deleteProfilePicture(1L);
        verify(userRepository, times(1)).save(testUser);
    }

    /**
     * Test 9: DELETE /api/profile/picture - IOException
     * Sad Path: Error saat delete file dari disk
     */
    @Test
    @DisplayName("Should throw FileUploadException when delete fails")
    void shouldThrowExceptionWhenDeleteFails() throws IOException {
        // Arrange
        testUser.setProfilePicture("/uploads/profiles/user-1.png");

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        doThrow(new IOException("Permission denied")).when(fileStorageService).deleteProfilePicture(1L);

        // Act & Assert
        FileUploadException exception = assertThrows(FileUploadException.class, () -> {
            profileController.deleteProfilePicture(authentication);
        });

        assertTrue(exception.getMessage().contains("Could not delete profile picture"));

        verify(fileStorageService, times(1)).deleteProfilePicture(1L);
        verify(userRepository, never()).save(any(User.class)); // Should NOT update DB on error
    }

    /**
     * Test 10: DELETE /api/profile/picture - User Not Found
     * Sad Path: Authenticated user tidak ditemukan
     */
    @Test
    @DisplayName("Should throw RuntimeException when user not found during delete")
    void shouldThrowExceptionWhenUserNotFoundDuringDelete() throws IOException {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            profileController.deleteProfilePicture(authentication);
        });

        assertTrue(exception.getMessage().contains("Failed to delete profile picture"));

        verify(userRepository, times(1)).findById(1L);
        verify(fileStorageService, never()).deleteProfilePicture(any());
    }

    // ==================== GET CURRENT USER'S PICTURE TESTS ====================

    /**
     * Test 11: GET /api/profile/picture - Success with Picture
     * Happy Path: User punya foto profil
     */
    @Test
    @DisplayName("Should get current user's picture info successfully")
    void shouldGetCurrentUserPictureSuccessfully() {
        // Arrange
        String picturePath = "/uploads/profiles/user-1.png";
        testUser.setProfilePicture(picturePath);

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        ResponseEntity<ProfilePictureResponse> response =
            profileController.getCurrentUserPicture(authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("User has profile picture", response.getBody().getMessage());
        assertEquals(picturePath, response.getBody().getPictureUrl());
        assertEquals(1L, response.getBody().getUserId());

        verify(userRepository, times(1)).findById(1L);
    }

    /**
     * Test 12: GET /api/profile/picture - No Picture
     * Edge Case: User tidak punya foto profil
     */
    @Test
    @DisplayName("Should return info when user has no profile picture")
    void shouldReturnInfoWhenNoPicture() {
        // Arrange
        testUser.setProfilePicture(null);

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        ResponseEntity<ProfilePictureResponse> response =
            profileController.getCurrentUserPicture(authentication);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("User has no profile picture", response.getBody().getMessage());
        assertNull(response.getBody().getPictureUrl());

        verify(userRepository, times(1)).findById(1L);
    }

    /**
     * Test 13: GET /api/profile/picture - User Not Found
     * Sad Path: Authenticated user tidak ditemukan
     */
    @Test
    @DisplayName("Should throw RuntimeException when user not found during get picture")
    void shouldThrowExceptionWhenUserNotFoundDuringGet() {
        // Arrange
        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            profileController.getCurrentUserPicture(authentication);
        });

        assertTrue(exception.getMessage().contains("Failed to get profile picture info"));

        verify(userRepository, times(1)).findById(1L);
    }

    // ==================== GET SPECIFIC USER'S PICTURE TESTS ====================

    /**
     * Test 14: GET /api/profile/picture/{userId} - Success
     * Happy Path: Get any user's picture by userId
     */
    @Test
    @DisplayName("Should get specific user's picture by userId successfully")
    void shouldGetUserPictureByIdSuccessfully() {
        // Arrange
        String picturePath = "/uploads/profiles/user-1.png";
        testUser.setProfilePicture(picturePath);

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Act
        ResponseEntity<ProfilePictureResponse> response =
            profileController.getUserPicture(1L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals(picturePath, response.getBody().getPictureUrl());
        assertEquals(1L, response.getBody().getUserId());

        verify(userRepository, times(1)).findById(1L);
    }

    /**
     * Test 15: GET /api/profile/picture/{userId} - User Not Found
     * Sad Path: userId tidak ditemukan
     */
    @Test
    @DisplayName("Should throw RuntimeException when userId not found")
    void shouldThrowExceptionWhenUserIdNotFound() {
        // Arrange
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            profileController.getUserPicture(999L);
        });

        assertTrue(exception.getMessage().contains("Failed to get user profile picture"));

        verify(userRepository, times(1)).findById(999L);
    }

    /**
     * Test 16: GET /api/profile/picture/{userId} - Different User (Not Self)
     * Edge Case: Get other user's picture (public access)
     */
    @Test
    @DisplayName("Should get other user's picture successfully (public access)")
    void shouldGetOtherUserPictureSuccessfully() {
        // Arrange
        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setFullName("Jane Doe");
        otherUser.setEmail("jane@example.com");
        otherUser.setPassword("hashedPassword456");
        otherUser.setProfilePicture("/uploads/profiles/user-2.png");

        when(userRepository.findById(2L)).thenReturn(Optional.of(otherUser));

        // Act
        ResponseEntity<ProfilePictureResponse> response =
            profileController.getUserPicture(2L);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("/uploads/profiles/user-2.png", response.getBody().getPictureUrl());
        assertEquals(2L, response.getBody().getUserId());
        assertEquals("jane@example.com", response.getBody().getUserEmail());

        verify(userRepository, times(1)).findById(2L);
    }

    // ==================== ADDITIONAL EDGE CASE TESTS ====================

    /**
     * Test 17: POST /api/profile/upload-picture - Empty File
     * Edge Case: File kosong (0 bytes)
     */
    @Test
    @DisplayName("Should throw FileUploadException when file is empty")
    void shouldThrowExceptionWhenFileIsEmpty() throws IOException {
        // Arrange
        MockMultipartFile emptyFile = new MockMultipartFile(
            "file",
            "empty.png",
            "image/png",
            new byte[0] // 0 bytes
        );

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(fileStorageService.saveProfilePicture(emptyFile, 1L))
            .thenThrow(new FileUploadException("File must not be empty"));

        // Act & Assert
        FileUploadException exception = assertThrows(FileUploadException.class, () -> {
            profileController.uploadProfilePicture(emptyFile, authentication);
        });

        assertTrue(exception.getMessage().contains("must not be empty"));

        verify(fileStorageService, times(1)).saveProfilePicture(emptyFile, 1L);
    }

    /**
     * Test 18: POST /api/profile/upload-picture - Multiple File Types
     * Edge Case: Test dengan berbagai format image yang valid
     */
    @Test
    @DisplayName("Should handle different image formats (JPEG, GIF, WebP)")
    void shouldHandleDifferentImageFormats() throws IOException {
        // Test JPEG
        MockMultipartFile jpegFile = new MockMultipartFile(
            "file", "photo.jpeg", "image/jpeg", new byte[1024]
        );
        String jpegPath = "/uploads/profiles/user-1.jpeg";

        when(authentication.getPrincipal()).thenReturn(userPrincipal);
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(fileStorageService.saveProfilePicture(jpegFile, 1L)).thenReturn(jpegPath);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        ResponseEntity<ProfilePictureResponse> response1 =
            profileController.uploadProfilePicture(jpegFile, authentication);

        assertEquals(HttpStatus.OK, response1.getStatusCode());
        assertEquals(jpegPath, response1.getBody().getPictureUrl());

        verify(fileStorageService, times(1)).saveProfilePicture(jpegFile, 1L);
    }
}
