package com.registrationform.api.repository;

import com.registrationform.api.entity.GalleryPhoto;
import com.registrationform.api.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * GalleryPhotoRepositoryTest - Unit Tests for GalleryPhotoRepository
 *
 * TEST STRATEGY:
 * ==============
 * - Uses PostgreSQL Testcontainer (REAL database, production-like)
 * - Tests custom query methods for Gallery Photo feature
 * - Focus: Privacy filtering, pagination, user ownership
 * - AAA Pattern: Arrange-Act-Assert
 *
 * COVERAGE TARGET: >90% repository code
 *
 * ANALOGI:
 * ========
 * Repository seperti "Petugas Arsip di Perpustakaan":
 * - Simpan foto ke "rak" database
 * - Cari foto berdasarkan kriteria (user, public/private)
 * - Hitung berapa banyak foto (untuk pagination)
 * - Hapus foto dari "rak" database
 *
 * WHY TESTCONTAINERS (not H2)?
 * ============================
 * - REAL PostgreSQL: Same as production (no compatibility issues)
 * - SINGLETON PATTERN: Container shared across ALL tests (fast!)
 * - Isolated: Each test auto-rollback (clean state)
 * - Reliable: Test actual PostgreSQL-specific queries
 *
 * CUSTOM QUERY METHODS TO TEST:
 * ==============================
 * 1. findByUserId(Long userId, Pageable) → Get all user's photos (public + private)
 * 2. findByIsPublicTrue(Pageable) → Get all public photos from all users
 * 3. findByUserIdAndIsPublicTrue(Long userId, Pageable) → Get user's public photos only
 * 4. countByUserId(Long userId) → Count user's total photos
 * 5. countByIsPublicTrue() → Count total public photos
 * 6. countByUserIdAndIsPublicTrue(Long userId) → Count user's public photos
 *
 * PLUS standard JPA methods:
 * - save(), findById(), delete(), etc.
 *
 * TOTAL TESTS: 12 tests
 * - FindByUser tests (3 tests)
 * - FindPublic tests (2 tests)
 * - Privacy filter tests (3 tests)
 * - CRUD operation tests (4 tests)
 */
@DisplayName("GalleryPhotoRepository Unit Tests - PostgreSQL Testcontainer (Singleton)")
@org.springframework.transaction.annotation.Transactional
public class GalleryPhotoRepositoryTest extends com.registrationform.api.integration.AbstractIntegrationTest {

    /**
     * Repository yang akan di-test
     */
    @Autowired
    private GalleryPhotoRepository galleryPhotoRepository;

    /**
     * User repository untuk setup test data (foreign key constraint)
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * EntityManager untuk manage test data
     */
    @Autowired
    private jakarta.persistence.EntityManager entityManager;

    // Test data
    private User testUser1;
    private User testUser2;
    private GalleryPhoto publicPhoto1;
    private GalleryPhoto privatePhoto1;
    private GalleryPhoto publicPhoto2;

    /**
     * Setup test data sebelum SETIAP test
     */
    @BeforeEach
    void setUp() {
        // Clean database
        galleryPhotoRepository.deleteAll();
        userRepository.deleteAll();
        entityManager.flush();

        // Create test users
        testUser1 = new User();
        testUser1.setFullName("John Doe");
        testUser1.setEmail("john@test.com");
        testUser1.setPassword("$2a$10$hashedPassword123");
        testUser1.setCreatedAt(LocalDateTime.now());
        testUser1.setUpdatedAt(LocalDateTime.now());

        testUser2 = new User();
        testUser2.setFullName("Jane Smith");
        testUser2.setEmail("jane@test.com");
        testUser2.setPassword("$2a$10$hashedPassword456");
        testUser2.setCreatedAt(LocalDateTime.now());
        testUser2.setUpdatedAt(LocalDateTime.now());

        // Persist users (needed for foreign key)
        entityManager.persist(testUser1);
        entityManager.persist(testUser2);
        entityManager.flush();

        // Create test photos for User 1
        publicPhoto1 = new GalleryPhoto();
        publicPhoto1.setUser(testUser1);
        publicPhoto1.setTitle("Public Photo 1");
        publicPhoto1.setDescription("This is public");
        publicPhoto1.setFilePath("gallery/user-1/photo-1.jpg");
        publicPhoto1.setIsPublic(true);
        publicPhoto1.setUploadOrder(0);
        publicPhoto1.setCreatedAt(LocalDateTime.now().minusDays(2));
        publicPhoto1.setUpdatedAt(LocalDateTime.now().minusDays(2));

        privatePhoto1 = new GalleryPhoto();
        privatePhoto1.setUser(testUser1);
        privatePhoto1.setTitle("Private Photo 1");
        privatePhoto1.setDescription("This is private");
        privatePhoto1.setFilePath("gallery/user-1/photo-2.jpg");
        privatePhoto1.setIsPublic(false);
        privatePhoto1.setUploadOrder(1);
        privatePhoto1.setCreatedAt(LocalDateTime.now().minusDays(1));
        privatePhoto1.setUpdatedAt(LocalDateTime.now().minusDays(1));

        // Create test photo for User 2
        publicPhoto2 = new GalleryPhoto();
        publicPhoto2.setUser(testUser2);
        publicPhoto2.setTitle("Public Photo 2");
        publicPhoto2.setDescription("Another public photo");
        publicPhoto2.setFilePath("gallery/user-2/photo-1.jpg");
        publicPhoto2.setIsPublic(true);
        publicPhoto2.setUploadOrder(0);
        publicPhoto2.setCreatedAt(LocalDateTime.now());
        publicPhoto2.setUpdatedAt(LocalDateTime.now());
    }

    // ========================================
    // FIND BY USER TESTS (3 tests)
    // ========================================

    @Test
    @DisplayName("1. FindByUserId - Should return all photos for user (public + private)")
    void testFindByUserId_ShouldReturnAllUserPhotos() {
        // ARRANGE: Persist photos
        entityManager.persist(publicPhoto1);
        entityManager.persist(privatePhoto1);
        entityManager.persist(publicPhoto2);
        entityManager.flush();
        entityManager.clear();

        Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());

        // ACT: Find User 1's photos
        List<GalleryPhoto> photos = galleryPhotoRepository.findByUserId(testUser1.getId(), pageable);

        // ASSERT: Should return BOTH public and private photos for User 1
        assertNotNull(photos);
        assertEquals(2, photos.size(), "User 1 should have 2 photos (1 public + 1 private)");

        // Verify both photos belong to User 1
        assertTrue(photos.stream().allMatch(p -> p.getUser().getId().equals(testUser1.getId())));

        // Verify contains both public and private
        assertTrue(photos.stream().anyMatch(GalleryPhoto::getIsPublic), "Should contain public photo");
        assertTrue(photos.stream().anyMatch(p -> !p.getIsPublic()), "Should contain private photo");
    }

    @Test
    @DisplayName("2. FindByUserId - Should respect pagination")
    void testFindByUserId_ShouldRespectPagination() {
        // ARRANGE: Persist multiple photos for User 1
        entityManager.persist(publicPhoto1);
        entityManager.persist(privatePhoto1);
        entityManager.flush();
        entityManager.clear();

        // Request page size of 1
        Pageable pageable = PageRequest.of(0, 1, Sort.by("createdAt").descending());

        // ACT: Find with page size 1
        List<GalleryPhoto> photos = galleryPhotoRepository.findByUserId(testUser1.getId(), pageable);

        // ASSERT: Should return only 1 photo (most recent)
        assertNotNull(photos);
        assertEquals(1, photos.size(), "Should return only 1 photo per page");
        assertEquals("Private Photo 1", photos.get(0).getTitle(), "Should return most recent photo");
    }

    @Test
    @DisplayName("3. FindByUserId - Should return empty list when user has no photos")
    void testFindByUserId_WhenNoPhotos_ShouldReturnEmptyList() {
        // ARRANGE: User 1 has no photos (we don't persist any)
        Pageable pageable = PageRequest.of(0, 10);

        // ACT: Find User 1's photos
        List<GalleryPhoto> photos = galleryPhotoRepository.findByUserId(testUser1.getId(), pageable);

        // ASSERT: Should return empty list
        assertNotNull(photos);
        assertTrue(photos.isEmpty(), "Should return empty list for user with no photos");
    }

    // ========================================
    // FIND PUBLIC PHOTOS TESTS (2 tests)
    // ========================================

    @Test
    @DisplayName("4. FindByIsPublicTrue - Should return only public photos from all users")
    void testFindByIsPublicTrue_ShouldReturnOnlyPublicPhotos() {
        // ARRANGE: Persist photos (2 public, 1 private)
        entityManager.persist(publicPhoto1);  // User 1 public
        entityManager.persist(privatePhoto1); // User 1 private
        entityManager.persist(publicPhoto2);  // User 2 public
        entityManager.flush();
        entityManager.clear();

        Pageable pageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());

        // ACT: Find all public photos
        List<GalleryPhoto> photos = galleryPhotoRepository.findByIsPublicTrue(pageable);

        // ASSERT: Should return only 2 public photos (NOT private photo)
        assertNotNull(photos);
        assertEquals(2, photos.size(), "Should return only 2 public photos");

        // Verify all photos are public
        assertTrue(photos.stream().allMatch(GalleryPhoto::getIsPublic), "All photos should be public");

        // Verify contains photos from both users
        assertTrue(photos.stream().anyMatch(p -> p.getUser().getId().equals(testUser1.getId())));
        assertTrue(photos.stream().anyMatch(p -> p.getUser().getId().equals(testUser2.getId())));
    }

    @Test
    @DisplayName("5. FindByIsPublicTrue - Should return empty list when no public photos")
    void testFindByIsPublicTrue_WhenNoPublicPhotos_ShouldReturnEmptyList() {
        // ARRANGE: Persist only private photo
        entityManager.persist(privatePhoto1);
        entityManager.flush();
        entityManager.clear();

        Pageable pageable = PageRequest.of(0, 10);

        // ACT: Find public photos
        List<GalleryPhoto> photos = galleryPhotoRepository.findByIsPublicTrue(pageable);

        // ASSERT: Should return empty list (no public photos)
        assertNotNull(photos);
        assertTrue(photos.isEmpty(), "Should return empty list when no public photos");
    }

    // ========================================
    // PRIVACY FILTER TESTS (3 tests)
    // ========================================

    @Test
    @DisplayName("6. FindByUserIdAndIsPublicTrue - Should return only user's public photos")
    void testFindByUserIdAndIsPublicTrue_ShouldReturnOnlyUserPublicPhotos() {
        // ARRANGE: Persist photos
        entityManager.persist(publicPhoto1);  // User 1 public
        entityManager.persist(privatePhoto1); // User 1 private
        entityManager.persist(publicPhoto2);  // User 2 public
        entityManager.flush();
        entityManager.clear();

        Pageable pageable = PageRequest.of(0, 10);

        // ACT: Find User 1's public photos
        List<GalleryPhoto> photos = galleryPhotoRepository.findByUserIdAndIsPublicTrue(testUser1.getId(), pageable);

        // ASSERT: Should return only User 1's public photo (NOT private, NOT User 2's)
        assertNotNull(photos);
        assertEquals(1, photos.size(), "User 1 should have 1 public photo");
        assertEquals("Public Photo 1", photos.get(0).getTitle());
        assertTrue(photos.get(0).getIsPublic());
        assertEquals(testUser1.getId(), photos.get(0).getUser().getId());
    }

    @Test
    @DisplayName("7. CountByUserId - Should count all user photos (public + private)")
    void testCountByUserId_ShouldCountAllUserPhotos() {
        // ARRANGE: Persist photos
        entityManager.persist(publicPhoto1);  // User 1 public
        entityManager.persist(privatePhoto1); // User 1 private
        entityManager.persist(publicPhoto2);  // User 2 public
        entityManager.flush();
        entityManager.clear();

        // ACT: Count User 1's photos
        Long count = galleryPhotoRepository.countByUserId(testUser1.getId());

        // ASSERT: Should count both public and private photos
        assertNotNull(count);
        assertEquals(2L, count, "User 1 should have 2 photos total");
    }

    @Test
    @DisplayName("8. CountByIsPublicTrue - Should count only public photos")
    void testCountByIsPublicTrue_ShouldCountOnlyPublicPhotos() {
        // ARRANGE: Persist photos (2 public, 1 private)
        entityManager.persist(publicPhoto1);  // Public
        entityManager.persist(privatePhoto1); // Private
        entityManager.persist(publicPhoto2);  // Public
        entityManager.flush();
        entityManager.clear();

        // ACT: Count public photos
        Long count = galleryPhotoRepository.countByIsPublicTrue();

        // ASSERT: Should count only 2 public photos
        assertNotNull(count);
        assertEquals(2L, count, "Should have 2 public photos total");
    }

    @Test
    @DisplayName("9. CountByUserIdAndIsPublicTrue - Should count user's public photos only")
    void testCountByUserIdAndIsPublicTrue_ShouldCountUserPublicPhotos() {
        // ARRANGE: Persist photos
        entityManager.persist(publicPhoto1);  // User 1 public
        entityManager.persist(privatePhoto1); // User 1 private
        entityManager.persist(publicPhoto2);  // User 2 public
        entityManager.flush();
        entityManager.clear();

        // ACT: Count User 1's public photos
        Long count = galleryPhotoRepository.countByUserIdAndIsPublicTrue(testUser1.getId());

        // ASSERT: Should count only User 1's public photo (NOT private)
        assertNotNull(count);
        assertEquals(1L, count, "User 1 should have 1 public photo");
    }

    // ========================================
    // CRUD OPERATION TESTS (4 tests)
    // ========================================

    @Test
    @DisplayName("10. Save photo - Should persist with generated ID")
    void testSave_ShouldPersistWithGeneratedId() {
        // ACT: Save photo
        GalleryPhoto savedPhoto = galleryPhotoRepository.save(publicPhoto1);
        entityManager.flush();
        entityManager.clear();

        // ASSERT: Should have generated ID
        assertNotNull(savedPhoto.getId());
        assertTrue(savedPhoto.getId() > 0);
        assertEquals("Public Photo 1", savedPhoto.getTitle());

        // Verify in database
        GalleryPhoto foundPhoto = entityManager.find(GalleryPhoto.class, savedPhoto.getId());
        assertNotNull(foundPhoto);
        assertEquals("Public Photo 1", foundPhoto.getTitle());
    }

    @Test
    @DisplayName("11. FindById - Should return photo when exists")
    void testFindById_WhenPhotoExists_ShouldReturnPhoto() {
        // ARRANGE: Persist photo
        entityManager.persist(publicPhoto1);
        entityManager.flush();
        Long photoId = publicPhoto1.getId();
        entityManager.clear();

        // ACT: Find by ID
        var result = galleryPhotoRepository.findById(photoId);

        // ASSERT
        assertTrue(result.isPresent());
        assertEquals(photoId, result.get().getId());
        assertEquals("Public Photo 1", result.get().getTitle());
    }

    @Test
    @DisplayName("12. Update photo - Should update existing photo")
    void testUpdate_ShouldUpdateExistingPhoto() {
        // ARRANGE: Persist photo
        entityManager.persist(publicPhoto1);
        entityManager.flush();
        Long photoId = publicPhoto1.getId();

        // Modify photo
        publicPhoto1.setTitle("Updated Title");
        publicPhoto1.setIsPublic(false);

        // ACT: Update via save
        GalleryPhoto updatedPhoto = galleryPhotoRepository.save(publicPhoto1);
        entityManager.flush();
        entityManager.clear();

        // ASSERT
        assertEquals(photoId, updatedPhoto.getId(), "ID should remain same");
        assertEquals("Updated Title", updatedPhoto.getTitle());
        assertFalse(updatedPhoto.getIsPublic());

        // Verify in database
        GalleryPhoto foundPhoto = entityManager.find(GalleryPhoto.class, photoId);
        assertEquals("Updated Title", foundPhoto.getTitle());
        assertFalse(foundPhoto.getIsPublic());
    }

    @Test
    @DisplayName("13. Delete photo - Should remove from database")
    void testDelete_ShouldRemoveFromDatabase() {
        // ARRANGE: Persist photo
        entityManager.persist(publicPhoto1);
        entityManager.flush();
        Long photoId = publicPhoto1.getId();
        entityManager.clear();

        // Verify photo exists
        assertTrue(galleryPhotoRepository.existsById(photoId));

        // ACT: Delete photo
        galleryPhotoRepository.deleteById(photoId);
        entityManager.flush();
        entityManager.clear();

        // ASSERT: Photo should not exist
        assertFalse(galleryPhotoRepository.existsById(photoId));
        var result = galleryPhotoRepository.findById(photoId);
        assertFalse(result.isPresent());
    }
}

/**
 * SUMMARY TEST COVERAGE:
 * ======================
 *
 * Total Test Cases: 13 tests
 *
 * FindByUser Tests (3 tests):
 * - findByUserId returns all photos (public + private)
 * - findByUserId respects pagination
 * - findByUserId returns empty when no photos
 *
 * FindPublic Tests (2 tests):
 * - findByIsPublicTrue returns only public photos
 * - findByIsPublicTrue returns empty when no public photos
 *
 * Privacy Filter Tests (4 tests):
 * - findByUserIdAndIsPublicTrue returns user's public only
 * - countByUserId counts all user photos
 * - countByIsPublicTrue counts public only
 * - countByUserIdAndIsPublicTrue counts user's public only
 *
 * CRUD Operations (4 tests):
 * - save with ID generation
 * - findById
 * - update
 * - delete
 *
 * Database Technology: PostgreSQL Testcontainer (Singleton)
 * Expected Coverage: ~95%+
 *
 * KEY FEATURES TESTED:
 * ====================
 * ✅ Privacy filtering (public/private photos)
 * ✅ User ownership (photos belong to specific user)
 * ✅ Pagination (page size, sorting)
 * ✅ Custom query methods
 * ✅ CRUD operations
 * ✅ Foreign key relationships (User → GalleryPhoto)
 *
 * CARA MENJALANKAN:
 * ================
 * mvn test -Dtest=GalleryPhotoRepositoryTest
 */
