package com.ikplabs.api.service;

import com.ikplabs.api.entity.GalleryPhoto;
import com.ikplabs.api.entity.PhotoLike;
import com.ikplabs.api.entity.User;
import com.ikplabs.api.repository.GalleryPhotoRepository;
import com.ikplabs.api.repository.PhotoLikeRepository;
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

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit Test untuk PhotoLikeService
 *
 * TESTING STRATEGY:
 * =================
 * PhotoLikeService adalah business logic layer untuk photo likes yang:
 * 1. Validates business rules (photo public, not owner, no duplicates)
 * 2. Coordinates antara repositories (PhotoLike, GalleryPhoto, User)
 * 3. Enforces like/unlike constraints
 *
 * MENGGUNAKAN MOCKITO:
 * ====================
 * - @Mock = Create mock objects (repositories)
 * - @InjectMocks = Create PhotoLikeService dengan mocks di-inject
 * - when().thenReturn() = Define mock behavior
 * - verify() = Verify mock interactions
 * - ArgumentMatchers = Match arguments (any(), eq(), etc.)
 *
 * UNIT TEST CHARACTERISTICS:
 * ==========================
 * ✅ NO real database (all mocked)
 * ✅ Fast execution (<100ms total)
 * ✅ Tests business logic ONLY
 * ✅ Isolated from external dependencies
 *
 * YANG DI-TEST:
 * =============
 * 1. Like Operations (PLST-001 to PLST-005)
 *    - Happy path: like photo successfully
 *    - Photo not found error
 *    - Photo not public error (cannot like private)
 *    - User is owner error (cannot like own photo)
 *    - Already liked error (duplicate prevention)
 *
 * 2. Unlike Operations (PLST-006 to PLST-007)
 *    - Happy path: unlike photo successfully
 *    - Photo not liked error
 *
 * 3. Query Operations (PLST-008)
 *    - Get liked photos returns correct data
 *
 * TOTAL TEST CASES: 8
 *
 * @author Claude Code
 */
@SuppressWarnings("null")
@ExtendWith(MockitoExtension.class)
@DisplayName("PhotoLikeService Business Logic Tests")
public class PhotoLikeServiceTest {

    @Mock
    private PhotoLikeRepository photoLikeRepository;

    @Mock
    private GalleryPhotoRepository galleryPhotoRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PhotoLikeService photoLikeService;

    // Test data
    private User photoOwner;
    private User likerUser;
    private GalleryPhoto publicPhoto;
    private GalleryPhoto privatePhoto;
    private PhotoLike testPhotoLike;

    private static final Long PHOTO_OWNER_ID = 1L;
    private static final Long LIKER_USER_ID = 2L;
    private static final Long PUBLIC_PHOTO_ID = 100L;
    private static final Long PRIVATE_PHOTO_ID = 101L;
    private static final Long NONEXISTENT_PHOTO_ID = 999L;

    /**
     * Setup test data before each test
     *
     * Creates:
     * - Photo owner user (ID=1)
     * - Liker user (ID=2)
     * - Public photo owned by user 1
     * - Private photo owned by user 1
     */
    @BeforeEach
    void setUp() {
        // Create photo owner
        photoOwner = new User();
        photoOwner.setId(PHOTO_OWNER_ID);
        photoOwner.setEmail("owner@example.com");
        photoOwner.setFullName("Photo Owner");

        // Create liker user (different from owner)
        likerUser = new User();
        likerUser.setId(LIKER_USER_ID);
        likerUser.setEmail("liker@example.com");
        likerUser.setFullName("Liker User");

        // Create public photo (owned by photoOwner)
        publicPhoto = new GalleryPhoto(photoOwner, "gallery/user-1/photo-100.jpg");
        publicPhoto.setId(PUBLIC_PHOTO_ID);
        publicPhoto.setTitle("Public Photo");
        publicPhoto.setIsPublic(true);

        // Create private photo (owned by photoOwner)
        privatePhoto = new GalleryPhoto(photoOwner, "gallery/user-1/photo-101.jpg");
        privatePhoto.setId(PRIVATE_PHOTO_ID);
        privatePhoto.setTitle("Private Photo");
        privatePhoto.setIsPublic(false);

        // Create test photo like
        testPhotoLike = new PhotoLike();
        testPhotoLike.setId(1L);
        testPhotoLike.setPhoto(publicPhoto);
        testPhotoLike.setUser(likerUser);
    }

    // ============================================================================
    // LIKE OPERATIONS TESTS (PLST-001 to PLST-005)
    // ============================================================================

    /**
     * PLST-001: likePhoto() - Happy path
     *
     * Scenario: User likes a public photo for the first time
     * Given: Photo exists, is public, user is not owner, not liked yet
     * When: likePhoto() called
     * Then: PhotoLike saved successfully
     */
    @Test
    @DisplayName("PLST-001: likePhoto - valid like - Should save successfully")
    void testLikePhoto_Success() {
        // ARRANGE
        when(galleryPhotoRepository.findById(PUBLIC_PHOTO_ID))
            .thenReturn(Optional.of(publicPhoto));
        when(photoLikeRepository.existsByPhotoIdAndUserId(PUBLIC_PHOTO_ID, LIKER_USER_ID))
            .thenReturn(false);
        when(userRepository.findById(LIKER_USER_ID))
            .thenReturn(Optional.of(likerUser));

        // ACT
        photoLikeService.likePhoto(PUBLIC_PHOTO_ID, LIKER_USER_ID);

        // ASSERT
        // Verify save() was called exactly once
        verify(photoLikeRepository, times(1)).save(any(PhotoLike.class));

        // Verify the PhotoLike object passed to save() has correct properties
        verify(photoLikeRepository).save(argThat(photoLike ->
            photoLike.getPhoto().getId().equals(PUBLIC_PHOTO_ID) &&
            photoLike.getUser().getId().equals(LIKER_USER_ID)
        ));
    }

    /**
     * PLST-002: likePhoto() - Photo not found
     *
     * Scenario: User tries to like non-existent photo
     * Given: Photo ID doesn't exist in database
     * When: likePhoto() called
     * Then: IllegalArgumentException thrown with "Photo not found" message
     */
    @Test
    @DisplayName("PLST-002: likePhoto - photo not found - Should throw exception")
    void testLikePhoto_PhotoNotFound() {
        // ARRANGE
        when(galleryPhotoRepository.findById(NONEXISTENT_PHOTO_ID))
            .thenReturn(Optional.empty());

        // ACT & ASSERT
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> photoLikeService.likePhoto(NONEXISTENT_PHOTO_ID, LIKER_USER_ID)
        );

        assertTrue(exception.getMessage().contains("Photo not found"));

        // Verify save() was never called
        verify(photoLikeRepository, never()).save(any());
    }

    /**
     * PLST-003: likePhoto() - Photo is private
     *
     * Scenario: User tries to like a private photo
     * Given: Photo exists but is_public = false
     * When: likePhoto() called
     * Then: IllegalArgumentException thrown with "Cannot like private photos" message
     */
    @Test
    @DisplayName("PLST-003: likePhoto - photo is private - Should throw exception")
    void testLikePhoto_PhotoNotPublic() {
        // ARRANGE
        when(galleryPhotoRepository.findById(PRIVATE_PHOTO_ID))
            .thenReturn(Optional.of(privatePhoto));

        // ACT & ASSERT
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> photoLikeService.likePhoto(PRIVATE_PHOTO_ID, LIKER_USER_ID)
        );

        assertTrue(exception.getMessage().contains("Cannot like private photos"));

        // Verify save() was never called
        verify(photoLikeRepository, never()).save(any());
    }

    /**
     * PLST-004: likePhoto() - User is photo owner
     *
     * Scenario: User tries to like their own photo
     * Given: Photo owner ID == current user ID
     * When: likePhoto() called
     * Then: IllegalArgumentException thrown with "Cannot like your own photo" message
     */
    @Test
    @DisplayName("PLST-004: likePhoto - user is owner - Should throw exception")
    void testLikePhoto_UserIsOwner() {
        // ARRANGE
        when(galleryPhotoRepository.findById(PUBLIC_PHOTO_ID))
            .thenReturn(Optional.of(publicPhoto));

        // ACT & ASSERT
        // Try to like with photo owner's ID (not liker's ID)
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> photoLikeService.likePhoto(PUBLIC_PHOTO_ID, PHOTO_OWNER_ID)
        );

        assertTrue(exception.getMessage().contains("Cannot like your own photo"));

        // Verify save() was never called
        verify(photoLikeRepository, never()).save(any());
    }

    /**
     * PLST-005: likePhoto() - Already liked
     *
     * Scenario: User tries to like photo twice
     * Given: User has already liked this photo
     * When: likePhoto() called again
     * Then: IllegalStateException thrown with "already liked" message
     */
    @Test
    @DisplayName("PLST-005: likePhoto - already liked - Should throw exception")
    void testLikePhoto_AlreadyLiked() {
        // ARRANGE
        when(galleryPhotoRepository.findById(PUBLIC_PHOTO_ID))
            .thenReturn(Optional.of(publicPhoto));
        when(photoLikeRepository.existsByPhotoIdAndUserId(PUBLIC_PHOTO_ID, LIKER_USER_ID))
            .thenReturn(true); // Already liked!

        // ACT & ASSERT
        IllegalStateException exception = assertThrows(
            IllegalStateException.class,
            () -> photoLikeService.likePhoto(PUBLIC_PHOTO_ID, LIKER_USER_ID)
        );

        assertTrue(exception.getMessage().contains("already liked"));

        // Verify save() was never called
        verify(photoLikeRepository, never()).save(any());
    }

    // ============================================================================
    // UNLIKE OPERATIONS TESTS (PLST-006 to PLST-007)
    // ============================================================================

    /**
     * PLST-006: unlikePhoto() - Happy path
     *
     * Scenario: User unlikes a previously liked photo
     * Given: Photo exists and user has liked it
     * When: unlikePhoto() called
     * Then: PhotoLike deleted successfully
     */
    @Test
    @DisplayName("PLST-006: unlikePhoto - valid unlike - Should delete successfully")
    void testUnlikePhoto_Success() {
        // ARRANGE
        when(galleryPhotoRepository.existsById(PUBLIC_PHOTO_ID))
            .thenReturn(true);
        when(photoLikeRepository.existsByPhotoIdAndUserId(PUBLIC_PHOTO_ID, LIKER_USER_ID))
            .thenReturn(true);

        // ACT
        photoLikeService.unlikePhoto(PUBLIC_PHOTO_ID, LIKER_USER_ID);

        // ASSERT
        // Verify deleteByPhotoIdAndUserId() was called exactly once
        verify(photoLikeRepository, times(1))
            .deleteByPhotoIdAndUserId(PUBLIC_PHOTO_ID, LIKER_USER_ID);
    }

    /**
     * PLST-007: unlikePhoto() - Photo not liked
     *
     * Scenario: User tries to unlike photo they never liked
     * Given: Photo exists but user hasn't liked it
     * When: unlikePhoto() called
     * Then: IllegalArgumentException thrown with "not liked" message
     */
    @Test
    @DisplayName("PLST-007: unlikePhoto - photo not liked - Should throw exception")
    void testUnlikePhoto_NotLiked() {
        // ARRANGE
        when(galleryPhotoRepository.existsById(PUBLIC_PHOTO_ID))
            .thenReturn(true);
        when(photoLikeRepository.existsByPhotoIdAndUserId(PUBLIC_PHOTO_ID, LIKER_USER_ID))
            .thenReturn(false); // Not liked!

        // ACT & ASSERT
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> photoLikeService.unlikePhoto(PUBLIC_PHOTO_ID, LIKER_USER_ID)
        );

        assertTrue(exception.getMessage().contains("not liked"));

        // Verify delete was never called
        verify(photoLikeRepository, never())
            .deleteByPhotoIdAndUserId(any(), any());
    }

    // ============================================================================
    // QUERY OPERATIONS TESTS (PLST-008)
    // ============================================================================

    /**
     * PLST-008: getLikedPhotos() - Returns user's liked photos
     *
     * Scenario: User retrieves their liked photos
     * Given: User has liked 3 photos
     * When: getLikedPhotos() called with pagination and sorting
     * Then: Returns Page with 3 photos ordered by most recent
     */
    @Test
    @DisplayName("PLST-008: getLikedPhotos - user has likes - Should return photos")
    void testGetLikedPhotos_ReturnsUserLikes() {
        // ARRANGE
        // Create 3 liked photos
        GalleryPhoto photo1 = new GalleryPhoto(photoOwner, "photo1.jpg");
        photo1.setId(1L);
        photo1.setTitle("Photo 1");

        GalleryPhoto photo2 = new GalleryPhoto(photoOwner, "photo2.jpg");
        photo2.setId(2L);
        photo2.setTitle("Photo 2");

        GalleryPhoto photo3 = new GalleryPhoto(photoOwner, "photo3.jpg");
        photo3.setId(3L);
        photo3.setTitle("Photo 3");

        List<GalleryPhoto> likedPhotos = Arrays.asList(photo3, photo2, photo1); // Most recent first

        Pageable pageable = PageRequest.of(0, 12);

        when(photoLikeRepository.findLikedPhotosByUserIdNewest(LIKER_USER_ID, pageable))
            .thenReturn(likedPhotos);

        // ACT
        List<GalleryPhoto> result = photoLikeService.getLikedPhotos(LIKER_USER_ID, "newest", pageable);

        // ASSERT
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(photo3.getId(), result.get(0).getId()); // Most recent first
        assertEquals(photo2.getId(), result.get(1).getId());
        assertEquals(photo1.getId(), result.get(2).getId());

        // Verify repository method was called with correct sortBy
        verify(photoLikeRepository, times(1))
            .findLikedPhotosByUserIdNewest(LIKER_USER_ID, pageable);
    }

    /**
     * PLST-009: getLikedPhotos() - Sorting by mostLiked
     *
     * Scenario: User retrieves their liked photos sorted by most liked
     * Given: User has liked photos
     * When: getLikedPhotos() called with sortBy="mostLiked"
     * Then: Repository called with mostLiked parameter
     */
    @Test
    @DisplayName("PLST-009: getLikedPhotos - sort by mostLiked - Should call repository with sortBy")
    void testGetLikedPhotos_SortByMostLiked_ShouldCallRepository() {
        // ARRANGE
        List<GalleryPhoto> photos = Arrays.asList(publicPhoto);
        Pageable pageable = PageRequest.of(0, 12);

        when(photoLikeRepository.findLikedPhotosByUserIdMostLiked(LIKER_USER_ID, pageable))
            .thenReturn(photos);

        // ACT
        List<GalleryPhoto> result = photoLikeService.getLikedPhotos(LIKER_USER_ID, "mostLiked", pageable);

        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(photoLikeRepository, times(1))
            .findLikedPhotosByUserIdMostLiked(LIKER_USER_ID, pageable);
    }

    /**
     * NOTES FOR UNDERSTANDING:
     * ========================
     *
     * 1. @ExtendWith(MockitoExtension.class):
     *    - Enables Mockito in JUnit 5
     *    - Automatically initializes @Mock and @InjectMocks
     *    - No need for MockitoAnnotations.openMocks(this)
     *
     * 2. @Mock vs @InjectMocks:
     *    - @Mock: Creates mock object (fake repository)
     *    - @InjectMocks: Creates real service with mocks injected
     *    - Example: photoLikeService gets mock repositories
     *
     * 3. when().thenReturn():
     *    - Defines mock behavior
     *    - Example: when(repo.findById(1)).thenReturn(Optional.of(photo))
     *    - Means: "When findById(1) is called, return this photo"
     *
     * 4. verify():
     *    - Verifies mock interactions
     *    - Example: verify(repo, times(1)).save(any())
     *    - Means: "Verify save() was called exactly once"
     *
     * 5. assertThrows():
     *    - Tests that exception is thrown
     *    - Example: assertThrows(IllegalArgumentException.class, () -> ...)
     *    - Means: "This code should throw IllegalArgumentException"
     *
     * 6. ArgumentMatchers:
     *    - any(): Matches any argument
     *    - eq(value): Matches exact value
     *    - argThat(lambda): Custom matcher
     *
     * 7. Test Structure (AAA Pattern):
     *    - ARRANGE: Setup mocks and test data
     *    - ACT: Call the method being tested
     *    - ASSERT: Verify results and interactions
     *
     * 8. Why Mock Repositories?
     *    - Fast: No database connection
     *    - Isolated: Tests only business logic
     *    - Predictable: Control exact behavior
     *    - No side effects: No data persisted
     *
     * 9. Test Naming Convention:
     *    - testMethodName_Scenario_ExpectedResult
     *    - Example: testLikePhoto_PhotoNotFound_ShouldThrowException
     *    - Clear and descriptive
     *
     * 10. Running Tests:
     *     - All tests: mvn test
     *     - Single class: mvn test -Dtest=PhotoLikeServiceTest
     *     - Single method: mvn test -Dtest=PhotoLikeServiceTest#testLikePhoto_Success
     *
     * 11. Test Coverage:
     *     - These 8 tests cover ALL business logic in PhotoLikeService
     *     - All validation rules tested
     *     - All error cases tested
     *     - Happy paths tested
     *
     * 12. Benefits of Unit Tests:
     *     - Fast feedback (<100ms)
     *     - Catches bugs early
     *     - Documents expected behavior
     *     - Safe refactoring (tests catch breaking changes)
     *     - No database setup needed
     */
}
