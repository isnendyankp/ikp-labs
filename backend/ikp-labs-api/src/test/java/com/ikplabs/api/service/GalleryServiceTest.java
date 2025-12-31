package com.ikplabs.api.service;

import com.ikplabs.api.entity.GalleryPhoto;
import com.ikplabs.api.entity.User;
import com.ikplabs.api.exception.GalleryException;
import com.ikplabs.api.exception.GalleryNotFoundException;
import com.ikplabs.api.exception.UnauthorizedGalleryAccessException;
import com.ikplabs.api.repository.GalleryPhotoRepository;
import com.ikplabs.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit Test untuk GalleryService
 *
 * TESTING STRATEGY:
 * =================
 * GalleryService adalah business logic layer yang:
 * 1. Orchestrates antara FileStorageService dan GalleryPhotoRepository
 * 2. Enforces authorization rules (owner-only untuk write ops)
 * 3. Enforces privacy rules (public vs private photos)
 *
 * MENGGUNAKAN MOCKITO:
 * ====================
 * - @Mock = Create mock objects (repository, fileStorageService)
 * - @InjectMocks = Create GalleryService dengan mocks di-inject
 * - when().thenReturn() = Define mock behavior
 * - verify() = Verify mock interactions
 *
 * YANG DI-TEST:
 * =============
 * 1. Upload Operations (GST-001 to GST-003)
 *    - Happy path upload
 *    - Upload with user not found
 *    - File validation failure
 *
 * 2. Retrieval Operations (GST-004 to GST-009)
 *    - Get my photos (owner view)
 *    - Get public photos (all users)
 *    - Get user's public photos
 *    - Count operations
 *
 * 3. Authorization & Privacy (GST-010 to GST-014)
 *    - Get public photo (anyone can view)
 *    - Get private photo by owner (authorized)
 *    - Get private photo by non-owner (unauthorized)
 *    - Photo not found error
 *
 * 4. Update Operations (GST-015 to GST-016)
 *    - Update by owner (authorized)
 *    - Update by non-owner (unauthorized)
 *
 * 5. Delete Operations (GST-017 to GST-018)
 *    - Delete by owner (authorized)
 *    - Delete by non-owner (unauthorized)
 *
 * TOTAL TEST CASES: 18
 *
 * @author Claude Code
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("GalleryService Business Logic Tests")
public class GalleryServiceTest {

    @Mock
    private GalleryPhotoRepository galleryPhotoRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private GalleryService galleryService;

    // Test data
    private User testUser;
    private GalleryPhoto testPhoto;
    private MockMultipartFile testFile;

    private static final Long TEST_USER_ID = 1L;
    private static final Long TEST_PHOTO_ID = 100L;
    private static final Long OTHER_USER_ID = 2L;

    /**
     * Setup test data before each test
     */
    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setId(TEST_USER_ID);
        testUser.setEmail("testuser@example.com");
        testUser.setFullName("Test User");

        // Create test photo (public)
        testPhoto = new GalleryPhoto(testUser, "gallery/user-1/photo-100-123.jpg");
        testPhoto.setId(TEST_PHOTO_ID);
        testPhoto.setTitle("Test Photo");
        testPhoto.setDescription("Test Description");
        testPhoto.setIsPublic(true);

        // Create test file
        testFile = new MockMultipartFile(
            "file",
            "test-photo.jpg",
            "image/jpeg",
            "test image content".getBytes()
        );
    }

    // ============================================================================
    // UPLOAD OPERATIONS TESTS (GST-001 to GST-003)
    // ============================================================================

    /**
     * GST-001: uploadPhoto() - Happy path
     * Scenario: User uploads valid photo with all metadata
     * Expected: Photo saved to database and file saved to disk
     */
    @Test
    @DisplayName("GST-001: uploadPhoto - valid upload - Should save photo successfully")
    void testUploadPhoto_ValidUpload_ShouldSaveSuccessfully() throws IOException {
        // ARRANGE
        String title = "My Vacation";
        String description = "Beach photo from summer 2024";
        Boolean isPublic = true;

        // Mock user repository
        when(userRepository.findById(TEST_USER_ID)).thenReturn(Optional.of(testUser));

        // Mock repository saves (simulate ID generation)
        GalleryPhoto photoWithoutPath = new GalleryPhoto(testUser, "");
        photoWithoutPath.setTitle(title);
        photoWithoutPath.setDescription(description);
        photoWithoutPath.setIsPublic(isPublic);

        GalleryPhoto photoWithId = new GalleryPhoto(testUser, "");
        photoWithId.setId(TEST_PHOTO_ID);
        photoWithId.setTitle(title);
        photoWithId.setDescription(description);
        photoWithId.setIsPublic(isPublic);

        GalleryPhoto photoWithPath = new GalleryPhoto(testUser, "gallery/user-1/photo-100-123.jpg");
        photoWithPath.setId(TEST_PHOTO_ID);
        photoWithPath.setTitle(title);
        photoWithPath.setDescription(description);
        photoWithPath.setIsPublic(isPublic);

        when(galleryPhotoRepository.save(any(GalleryPhoto.class)))
            .thenReturn(photoWithId)    // First save (get ID)
            .thenReturn(photoWithPath); // Second save (with file path)

        // Mock file storage
        when(fileStorageService.saveGalleryPhoto(testFile, TEST_USER_ID, TEST_PHOTO_ID))
            .thenReturn("gallery/user-1/photo-100-123.jpg");

        // ACT
        GalleryPhoto result = galleryService.uploadPhoto(testFile, TEST_USER_ID, title, description, isPublic);

        // ASSERT
        assertNotNull(result, "Result should not be null");
        assertEquals(TEST_PHOTO_ID, result.getId(), "Photo ID should match");
        assertEquals(title, result.getTitle(), "Title should match");
        assertEquals(description, result.getDescription(), "Description should match");
        assertEquals(isPublic, result.getIsPublic(), "Privacy setting should match");
        assertEquals("gallery/user-1/photo-100-123.jpg", result.getFilePath(), "File path should be set");

        // Verify interactions
        verify(userRepository, times(1)).findById(TEST_USER_ID);
        verify(fileStorageService, times(1)).validateGalleryPhoto(testFile);
        verify(fileStorageService, times(1)).saveGalleryPhoto(testFile, TEST_USER_ID, TEST_PHOTO_ID);
        verify(galleryPhotoRepository, times(2)).save(any(GalleryPhoto.class)); // Save twice

        System.out.println("✅ GST-001 PASSED: Photo uploaded successfully");
    }

    /**
     * GST-002: uploadPhoto() - User not found
     * Scenario: Upload photo for non-existent user
     * Expected: GalleryException thrown
     */
    @Test
    @DisplayName("GST-002: uploadPhoto - user not found - Should throw GalleryException")
    void testUploadPhoto_UserNotFound_ShouldThrowException() throws IOException {
        // ARRANGE
        when(userRepository.findById(TEST_USER_ID)).thenReturn(Optional.empty());

        // ACT & ASSERT
        GalleryException exception = assertThrows(
            GalleryException.class,
            () -> galleryService.uploadPhoto(testFile, TEST_USER_ID, "Title", "Desc", true),
            "Should throw GalleryException when user not found"
        );

        assertTrue(exception.getMessage().contains("User not found"),
                   "Exception message should mention user not found");

        // Verify file validation happened but file was not saved
        verify(fileStorageService, times(1)).validateGalleryPhoto(testFile);
        verify(fileStorageService, never()).saveGalleryPhoto(any(), any(), any());
        verify(galleryPhotoRepository, never()).save(any());

        System.out.println("✅ GST-002 PASSED: User not found exception thrown correctly");
    }

    /**
     * GST-003: uploadPhoto() - File validation fails
     * Scenario: Upload invalid file (e.g., too large, wrong type)
     * Expected: IllegalArgumentException thrown (from FileStorageService)
     */
    @Test
    @DisplayName("GST-003: uploadPhoto - invalid file - Should throw IllegalArgumentException")
    void testUploadPhoto_InvalidFile_ShouldThrowException() {
        // ARRANGE
        doThrow(new IllegalArgumentException("File size exceeds maximum limit"))
            .when(fileStorageService).validateGalleryPhoto(testFile);

        // ACT & ASSERT
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> galleryService.uploadPhoto(testFile, TEST_USER_ID, "Title", "Desc", true),
            "Should throw IllegalArgumentException for invalid file"
        );

        assertTrue(exception.getMessage().contains("File size exceeds"),
                   "Exception message should mention file size");

        // Verify no database operations happened
        verify(userRepository, never()).findById(any());
        verify(galleryPhotoRepository, never()).save(any());

        System.out.println("✅ GST-003 PASSED: Invalid file rejected correctly");
    }

    // ============================================================================
    // RETRIEVAL OPERATIONS TESTS (GST-004 to GST-009)
    // ============================================================================

    /**
     * GST-004: getMyPhotos() - Owner view
     * Scenario: User retrieves all their photos (public + private)
     * Expected: All photos returned (no privacy filtering for owner)
     */
    @Test
    @DisplayName("GST-004: getMyPhotos - owner view - Should return all photos")
    void testGetMyPhotos_OwnerView_ShouldReturnAllPhotos() {
        // ARRANGE
        GalleryPhoto publicPhoto = new GalleryPhoto(testUser, "path1.jpg");
        publicPhoto.setIsPublic(true);

        GalleryPhoto privatePhoto = new GalleryPhoto(testUser, "path2.jpg");
        privatePhoto.setIsPublic(false);

        List<GalleryPhoto> allPhotos = Arrays.asList(publicPhoto, privatePhoto);
        Pageable pageable = PageRequest.of(0, 20);

        when(galleryPhotoRepository.findByUserIdWithCounts(TEST_USER_ID, "newest", pageable)).thenReturn(allPhotos);

        // ACT
        List<GalleryPhoto> result = galleryService.getMyPhotos(TEST_USER_ID, "newest", pageable);

        // ASSERT
        assertNotNull(result, "Result should not be null");
        assertEquals(2, result.size(), "Should return both public and private photos");
        verify(galleryPhotoRepository, times(1)).findByUserIdWithCounts(TEST_USER_ID, "newest", pageable);

        System.out.println("✅ GST-004 PASSED: Owner can see all their photos");
    }

    /**
     * GST-004b: getMyPhotos() - Sorting by mostLiked
     * Scenario: User retrieves photos sorted by most liked
     * Expected: Repository called with mostLiked sort parameter
     */
    @Test
    @DisplayName("GST-004b: getMyPhotos - sort by mostLiked - Should call repository with correct sortBy")
    void testGetMyPhotos_SortByMostLiked_ShouldCallRepository() {
        // ARRANGE
        List<GalleryPhoto> photos = Arrays.asList(testPhoto);
        Pageable pageable = PageRequest.of(0, 12);

        when(galleryPhotoRepository.findByUserIdWithCounts(TEST_USER_ID, "mostLiked", pageable))
            .thenReturn(photos);

        // ACT
        List<GalleryPhoto> result = galleryService.getMyPhotos(TEST_USER_ID, "mostLiked", pageable);

        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(galleryPhotoRepository, times(1)).findByUserIdWithCounts(TEST_USER_ID, "mostLiked", pageable);

        System.out.println("✅ GST-004b PASSED: getMyPhotos with mostLiked sorting");
    }

    /**
     * GST-004c: getMyPhotos() - Sorting by oldest
     * Scenario: User retrieves photos sorted by oldest first
     * Expected: Repository called with oldest sort parameter
     */
    @Test
    @DisplayName("GST-004c: getMyPhotos - sort by oldest - Should call repository with correct sortBy")
    void testGetMyPhotos_SortByOldest_ShouldCallRepository() {
        // ARRANGE
        List<GalleryPhoto> photos = Arrays.asList(testPhoto);
        Pageable pageable = PageRequest.of(0, 12);

        when(galleryPhotoRepository.findByUserIdWithCounts(TEST_USER_ID, "oldest", pageable))
            .thenReturn(photos);

        // ACT
        List<GalleryPhoto> result = galleryService.getMyPhotos(TEST_USER_ID, "oldest", pageable);

        // ASSERT
        assertNotNull(result);
        verify(galleryPhotoRepository, times(1)).findByUserIdWithCounts(TEST_USER_ID, "oldest", pageable);

        System.out.println("✅ GST-004c PASSED: getMyPhotos with oldest sorting");
    }

    /**
     * GST-005: countMyPhotos() - Count user's total photos
     * Scenario: Count all photos for a user
     * Expected: Correct count returned
     */
    @Test
    @DisplayName("GST-005: countMyPhotos - Should return correct count")
    void testCountMyPhotos_ShouldReturnCorrectCount() {
        // ARRANGE
        when(galleryPhotoRepository.countByUserId(TEST_USER_ID)).thenReturn(15L);

        // ACT
        Long count = galleryService.countMyPhotos(TEST_USER_ID);

        // ASSERT
        assertEquals(15L, count, "Count should match repository result");
        verify(galleryPhotoRepository, times(1)).countByUserId(TEST_USER_ID);

        System.out.println("✅ GST-005 PASSED: Photo count returned correctly");
    }

    /**
     * GST-006: getPublicPhotos() - All public photos from all users
     * Scenario: Anonymous user views public gallery
     * Expected: Only public photos returned
     */
    @Test
    @DisplayName("GST-006: getPublicPhotos - Should return only public photos")
    void testGetPublicPhotos_ShouldReturnOnlyPublicPhotos() {
        // ARRANGE
        GalleryPhoto photo1 = new GalleryPhoto(testUser, "path1.jpg");
        photo1.setIsPublic(true);

        GalleryPhoto photo2 = new GalleryPhoto(testUser, "path2.jpg");
        photo2.setIsPublic(true);

        List<GalleryPhoto> publicPhotos = Arrays.asList(photo1, photo2);
        Pageable pageable = PageRequest.of(0, 20);

        when(galleryPhotoRepository.findPublicPhotosWithCounts("newest", pageable)).thenReturn(publicPhotos);

        // ACT
        List<GalleryPhoto> result = galleryService.getPublicPhotos("newest", pageable);

        // ASSERT
        assertEquals(2, result.size(), "Should return public photos");
        verify(galleryPhotoRepository, times(1)).findPublicPhotosWithCounts("newest", pageable);

        System.out.println("✅ GST-006 PASSED: Public photos returned correctly");
    }

    /**
     * GST-006b: getPublicPhotos() - Sorting by mostFavorited
     * Scenario: Get public photos sorted by most favorited
     * Expected: Repository called with mostFavorited sort parameter
     */
    @Test
    @DisplayName("GST-006b: getPublicPhotos - sort by mostFavorited - Should call repository")
    void testGetPublicPhotos_SortByMostFavorited_ShouldCallRepository() {
        // ARRANGE
        List<GalleryPhoto> photos = Arrays.asList(testPhoto);
        Pageable pageable = PageRequest.of(0, 12);

        when(galleryPhotoRepository.findPublicPhotosWithCounts("mostFavorited", pageable))
            .thenReturn(photos);

        // ACT
        List<GalleryPhoto> result = galleryService.getPublicPhotos("mostFavorited", pageable);

        // ASSERT
        assertNotNull(result);
        verify(galleryPhotoRepository, times(1)).findPublicPhotosWithCounts("mostFavorited", pageable);

        System.out.println("✅ GST-006b PASSED: getPublicPhotos with mostFavorited sorting");
    }

    /**
     * GST-007: countPublicPhotos() - Count all public photos
     * Scenario: Count total public photos for pagination
     * Expected: Correct count returned
     */
    @Test
    @DisplayName("GST-007: countPublicPhotos - Should return correct count")
    void testCountPublicPhotos_ShouldReturnCorrectCount() {
        // ARRANGE
        when(galleryPhotoRepository.countByIsPublicTrue()).thenReturn(42L);

        // ACT
        Long count = galleryService.countPublicPhotos();

        // ASSERT
        assertEquals(42L, count, "Public photo count should match");
        verify(galleryPhotoRepository, times(1)).countByIsPublicTrue();

        System.out.println("✅ GST-007 PASSED: Public photo count returned correctly");
    }

    /**
     * GST-008: getUserPublicPhotos() - Specific user's public photos
     * Scenario: View another user's public gallery
     * Expected: Only that user's public photos returned
     */
    @Test
    @DisplayName("GST-008: getUserPublicPhotos - Should return user's public photos only")
    void testGetUserPublicPhotos_ShouldReturnUserPublicPhotosOnly() {
        // ARRANGE
        GalleryPhoto photo = new GalleryPhoto(testUser, "path.jpg");
        photo.setIsPublic(true);

        List<GalleryPhoto> userPublicPhotos = Arrays.asList(photo);
        Pageable pageable = PageRequest.of(0, 20);

        when(galleryPhotoRepository.findByUserIdAndIsPublicTrue(TEST_USER_ID, pageable))
            .thenReturn(userPublicPhotos);

        // ACT
        List<GalleryPhoto> result = galleryService.getUserPublicPhotos(TEST_USER_ID, pageable);

        // ASSERT
        assertEquals(1, result.size(), "Should return user's public photos");
        verify(galleryPhotoRepository, times(1)).findByUserIdAndIsPublicTrue(TEST_USER_ID, pageable);

        System.out.println("✅ GST-008 PASSED: User's public photos returned correctly");
    }

    /**
     * GST-009: countUserPublicPhotos() - Count user's public photos
     * Scenario: Count specific user's public photos
     * Expected: Correct count returned
     */
    @Test
    @DisplayName("GST-009: countUserPublicPhotos - Should return correct count")
    void testCountUserPublicPhotos_ShouldReturnCorrectCount() {
        // ARRANGE
        when(galleryPhotoRepository.countByUserIdAndIsPublicTrue(TEST_USER_ID)).thenReturn(8L);

        // ACT
        Long count = galleryService.countUserPublicPhotos(TEST_USER_ID);

        // ASSERT
        assertEquals(8L, count, "User's public photo count should match");
        verify(galleryPhotoRepository, times(1)).countByUserIdAndIsPublicTrue(TEST_USER_ID);

        System.out.println("✅ GST-009 PASSED: User's public photo count returned correctly");
    }

    // ============================================================================
    // AUTHORIZATION & PRIVACY TESTS (GST-010 to GST-014)
    // ============================================================================

    /**
     * GST-010: getPhotoById() - Public photo (anyone can view)
     * Scenario: Anonymous user views public photo
     * Expected: Photo returned without authorization check
     */
    @Test
    @DisplayName("GST-010: getPhotoById - public photo - Should return without auth check")
    void testGetPhotoById_PublicPhoto_ShouldReturnWithoutAuthCheck() {
        // ARRANGE
        testPhoto.setIsPublic(true);
        when(galleryPhotoRepository.findById(TEST_PHOTO_ID)).thenReturn(Optional.of(testPhoto));

        // ACT
        GalleryPhoto result = galleryService.getPhotoById(TEST_PHOTO_ID, null); // null = anonymous

        // ASSERT
        assertNotNull(result, "Public photo should be returned");
        assertEquals(TEST_PHOTO_ID, result.getId(), "Photo ID should match");
        verify(galleryPhotoRepository, times(1)).findById(TEST_PHOTO_ID);

        System.out.println("✅ GST-010 PASSED: Public photo accessible by anyone");
    }

    /**
     * GST-011: getPhotoById() - Private photo by owner (authorized)
     * Scenario: Owner views their private photo
     * Expected: Photo returned (owner authorized)
     */
    @Test
    @DisplayName("GST-011: getPhotoById - private photo by owner - Should return (authorized)")
    void testGetPhotoById_PrivatePhotoByOwner_ShouldReturnAuthorized() {
        // ARRANGE
        testPhoto.setIsPublic(false); // Private photo
        when(galleryPhotoRepository.findById(TEST_PHOTO_ID)).thenReturn(Optional.of(testPhoto));

        // ACT
        GalleryPhoto result = galleryService.getPhotoById(TEST_PHOTO_ID, TEST_USER_ID); // Owner

        // ASSERT
        assertNotNull(result, "Owner should be able to view private photo");
        assertEquals(TEST_PHOTO_ID, result.getId(), "Photo ID should match");

        System.out.println("✅ GST-011 PASSED: Owner can view private photo");
    }

    /**
     * GST-012: getPhotoById() - Private photo by non-owner (unauthorized)
     * Scenario: Non-owner tries to view private photo
     * Expected: UnauthorizedGalleryAccessException thrown
     */
    @Test
    @DisplayName("GST-012: getPhotoById - private photo by non-owner - Should throw UnauthorizedGalleryAccessException")
    void testGetPhotoById_PrivatePhotoByNonOwner_ShouldThrowUnauthorizedException() {
        // ARRANGE
        testPhoto.setIsPublic(false); // Private photo
        when(galleryPhotoRepository.findById(TEST_PHOTO_ID)).thenReturn(Optional.of(testPhoto));

        // ACT & ASSERT
        UnauthorizedGalleryAccessException exception = assertThrows(
            UnauthorizedGalleryAccessException.class,
            () -> galleryService.getPhotoById(TEST_PHOTO_ID, OTHER_USER_ID), // Different user
            "Should throw UnauthorizedGalleryAccessException for private photo"
        );

        assertTrue(exception.getMessage().contains("not authorized to view this private photo"),
                   "Exception message should mention authorization");

        System.out.println("✅ GST-012 PASSED: Non-owner cannot view private photo");
    }

    /**
     * GST-013: getPhotoById() - Private photo by anonymous (unauthorized)
     * Scenario: Anonymous user tries to view private photo
     * Expected: UnauthorizedGalleryAccessException thrown
     */
    @Test
    @DisplayName("GST-013: getPhotoById - private photo by anonymous - Should throw UnauthorizedGalleryAccessException")
    void testGetPhotoById_PrivatePhotoByAnonymous_ShouldThrowUnauthorizedException() {
        // ARRANGE
        testPhoto.setIsPublic(false);
        when(galleryPhotoRepository.findById(TEST_PHOTO_ID)).thenReturn(Optional.of(testPhoto));

        // ACT & ASSERT
        UnauthorizedGalleryAccessException exception = assertThrows(
            UnauthorizedGalleryAccessException.class,
            () -> galleryService.getPhotoById(TEST_PHOTO_ID, null), // null = anonymous
            "Should throw exception for anonymous user viewing private photo"
        );

        assertTrue(exception.getMessage().contains("not authorized"),
                   "Exception message should mention authorization");

        System.out.println("✅ GST-013 PASSED: Anonymous user cannot view private photo");
    }

    /**
     * GST-014: getPhotoById() - Photo not found
     * Scenario: Request photo with non-existent ID
     * Expected: GalleryNotFoundException thrown
     */
    @Test
    @DisplayName("GST-014: getPhotoById - photo not found - Should throw GalleryNotFoundException")
    void testGetPhotoById_PhotoNotFound_ShouldThrowNotFoundException() {
        // ARRANGE
        when(galleryPhotoRepository.findById(TEST_PHOTO_ID)).thenReturn(Optional.empty());

        // ACT & ASSERT
        GalleryNotFoundException exception = assertThrows(
            GalleryNotFoundException.class,
            () -> galleryService.getPhotoById(TEST_PHOTO_ID, TEST_USER_ID),
            "Should throw GalleryNotFoundException when photo not found"
        );

        assertTrue(exception.getMessage().contains("Photo not found"),
                   "Exception message should mention photo not found");

        System.out.println("✅ GST-014 PASSED: Photo not found exception thrown correctly");
    }

    // ============================================================================
    // UPDATE OPERATIONS TESTS (GST-015 to GST-016)
    // ============================================================================

    /**
     * GST-015: updatePhoto() - Update by owner (authorized)
     * Scenario: Owner updates their photo metadata
     * Expected: Photo updated successfully
     */
    @Test
    @DisplayName("GST-015: updatePhoto - by owner - Should update successfully")
    void testUpdatePhoto_ByOwner_ShouldUpdateSuccessfully() {
        // ARRANGE
        String newTitle = "Updated Title";
        String newDescription = "Updated Description";
        Boolean newPrivacy = false;

        when(galleryPhotoRepository.findById(TEST_PHOTO_ID)).thenReturn(Optional.of(testPhoto));
        when(galleryPhotoRepository.save(any(GalleryPhoto.class))).thenReturn(testPhoto);

        // ACT
        GalleryPhoto result = galleryService.updatePhoto(TEST_PHOTO_ID, TEST_USER_ID, newTitle, newDescription, newPrivacy);

        // ASSERT
        assertNotNull(result, "Updated photo should be returned");
        assertEquals(newTitle, testPhoto.getTitle(), "Title should be updated");
        assertEquals(newDescription, testPhoto.getDescription(), "Description should be updated");
        assertEquals(newPrivacy, testPhoto.getIsPublic(), "Privacy should be updated");

        verify(galleryPhotoRepository, times(1)).findById(TEST_PHOTO_ID);
        verify(galleryPhotoRepository, times(1)).save(testPhoto);

        System.out.println("✅ GST-015 PASSED: Owner can update photo successfully");
    }

    /**
     * GST-016: updatePhoto() - Update by non-owner (unauthorized)
     * Scenario: Non-owner tries to update photo
     * Expected: UnauthorizedGalleryAccessException thrown
     */
    @Test
    @DisplayName("GST-016: updatePhoto - by non-owner - Should throw UnauthorizedGalleryAccessException")
    void testUpdatePhoto_ByNonOwner_ShouldThrowUnauthorizedException() {
        // ARRANGE
        when(galleryPhotoRepository.findById(TEST_PHOTO_ID)).thenReturn(Optional.of(testPhoto));

        // ACT & ASSERT
        UnauthorizedGalleryAccessException exception = assertThrows(
            UnauthorizedGalleryAccessException.class,
            () -> galleryService.updatePhoto(TEST_PHOTO_ID, OTHER_USER_ID, "New Title", null, null),
            "Should throw exception when non-owner tries to update"
        );

        assertTrue(exception.getMessage().contains("not authorized to update"),
                   "Exception message should mention update authorization");

        verify(galleryPhotoRepository, never()).save(any());

        System.out.println("✅ GST-016 PASSED: Non-owner cannot update photo");
    }

    // ============================================================================
    // DELETE OPERATIONS TESTS (GST-017 to GST-018)
    // ============================================================================

    /**
     * GST-017: deletePhoto() - Delete by owner (authorized)
     * Scenario: Owner deletes their photo
     * Expected: File deleted from disk and database
     */
    @Test
    @DisplayName("GST-017: deletePhoto - by owner - Should delete successfully")
    void testDeletePhoto_ByOwner_ShouldDeleteSuccessfully() throws IOException {
        // ARRANGE
        when(galleryPhotoRepository.findById(TEST_PHOTO_ID)).thenReturn(Optional.of(testPhoto));
        doNothing().when(fileStorageService).deleteGalleryPhoto(TEST_USER_ID, TEST_PHOTO_ID, "jpg");
        doNothing().when(galleryPhotoRepository).delete(testPhoto);

        // ACT
        galleryService.deletePhoto(TEST_PHOTO_ID, TEST_USER_ID);

        // ASSERT
        verify(galleryPhotoRepository, times(1)).findById(TEST_PHOTO_ID);
        verify(fileStorageService, times(1)).deleteGalleryPhoto(TEST_USER_ID, TEST_PHOTO_ID, "jpg");
        verify(galleryPhotoRepository, times(1)).delete(testPhoto);

        System.out.println("✅ GST-017 PASSED: Owner can delete photo successfully");
    }

    /**
     * GST-018: deletePhoto() - Delete by non-owner (unauthorized)
     * Scenario: Non-owner tries to delete photo
     * Expected: UnauthorizedGalleryAccessException thrown
     */
    @Test
    @DisplayName("GST-018: deletePhoto - by non-owner - Should throw UnauthorizedGalleryAccessException")
    void testDeletePhoto_ByNonOwner_ShouldThrowUnauthorizedException() throws IOException {
        // ARRANGE
        when(galleryPhotoRepository.findById(TEST_PHOTO_ID)).thenReturn(Optional.of(testPhoto));

        // ACT & ASSERT
        UnauthorizedGalleryAccessException exception = assertThrows(
            UnauthorizedGalleryAccessException.class,
            () -> galleryService.deletePhoto(TEST_PHOTO_ID, OTHER_USER_ID),
            "Should throw exception when non-owner tries to delete"
        );

        assertTrue(exception.getMessage().contains("not authorized to delete"),
                   "Exception message should mention delete authorization");

        verify(fileStorageService, never()).deleteGalleryPhoto(anyLong(), anyLong(), anyString());
        verify(galleryPhotoRepository, never()).delete(any());

        System.out.println("✅ GST-018 PASSED: Non-owner cannot delete photo");
    }
}

/**
 * SUMMARY TEST COVERAGE:
 * ======================
 *
 * Total Test Cases: 18
 *
 * Upload Operations (3 tests):
 * - GST-001: Happy path upload ✅
 * - GST-002: User not found error ✅
 * - GST-003: Invalid file validation ✅
 *
 * Retrieval Operations (6 tests):
 * - GST-004: Get my photos (owner view) ✅
 * - GST-005: Count my photos ✅
 * - GST-006: Get public photos ✅
 * - GST-007: Count public photos ✅
 * - GST-008: Get user's public photos ✅
 * - GST-009: Count user's public photos ✅
 *
 * Authorization & Privacy (5 tests):
 * - GST-010: Public photo accessible by anyone ✅
 * - GST-011: Private photo by owner (authorized) ✅
 * - GST-012: Private photo by non-owner (unauthorized) ✅
 * - GST-013: Private photo by anonymous (unauthorized) ✅
 * - GST-014: Photo not found error ✅
 *
 * Update Operations (2 tests):
 * - GST-015: Update by owner (authorized) ✅
 * - GST-016: Update by non-owner (unauthorized) ✅
 *
 * Delete Operations (2 tests):
 * - GST-017: Delete by owner (authorized) ✅
 * - GST-018: Delete by non-owner (unauthorized) ✅
 *
 * BUSINESS LOGIC COVERAGE:
 * =========================
 * ✅ File validation
 * ✅ User existence check
 * ✅ Authorization (owner-only for write ops)
 * ✅ Privacy filtering (public vs private)
 * ✅ Pagination support
 * ✅ File and database operations orchestration
 * ✅ Error handling (not found, unauthorized, validation)
 *
 * MOCKITO PATTERNS USED:
 * ======================
 * - when().thenReturn() for stubbing
 * - doThrow() for exception stubbing
 * - doNothing() for void methods
 * - verify() for interaction verification
 * - times() for call count verification
 * - never() for ensuring methods not called
 * - any() for flexible argument matching
 */
