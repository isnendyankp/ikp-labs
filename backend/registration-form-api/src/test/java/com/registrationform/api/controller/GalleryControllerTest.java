package com.registrationform.api.controller;

import com.registrationform.api.dto.GalleryListResponse;
import com.registrationform.api.dto.GalleryPhotoDetailResponse;
import com.registrationform.api.dto.GalleryPhotoRequest;
import com.registrationform.api.dto.GalleryPhotoResponse;
import com.registrationform.api.entity.GalleryPhoto;
import com.registrationform.api.entity.User;
import com.registrationform.api.security.UserPrincipal;
import com.registrationform.api.service.GalleryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * GalleryControllerTest - Unit Tests for GalleryController REST API
 *
 * TEST STRATEGY:
 * ==============
 * 1. Unit Test ONLY (tidak pakai @WebMvcTest, murni mock)
 * 2. Mock GalleryService (service logic tested separately)
 * 3. Test 8 endpoints dengan berbagai scenarios
 * 4. Focus: HTTP status codes, request/response mapping, error handling
 *
 * COVERAGE TARGET: >85% controller code
 *
 * ANALOGI:
 * ========
 * GalleryController = Petugas di pintu masuk galeri
 * - Terima request pengunjung
 * - Validasi apakah request valid
 * - Panggil GalleryService untuk proses bisnis
 * - Kembalikan response ke pengunjung
 *
 * GalleryService (mocked) = Petugas di dalam galeri yang bekerja
 * - Kita tidak test service logic di sini (sudah di-test di GalleryServiceTest)
 * - Kita hanya test apakah controller panggil service dengan benar
 *
 * 8 ENDPOINTS TO TEST:
 * ====================
 * 1. POST   /api/gallery/upload           → Upload photo
 * 2. GET    /api/gallery/my-photos        → Get my photos (paginated)
 * 3. GET    /api/gallery/public           → Get public photos (paginated)
 * 4. GET    /api/gallery/user/{userId}/public → Get user's public photos
 * 5. GET    /api/gallery/photo/{photoId}  → Get photo detail
 * 6. PUT    /api/gallery/photo/{photoId}  → Update photo
 * 7. DELETE /api/gallery/photo/{photoId}  → Delete photo
 * 8. PUT    /api/gallery/photo/{photoId}/toggle-privacy → Toggle privacy
 *
 * TEST SCENARIOS PER ENDPOINT:
 * ============================
 * Upload: Success upload, with metadata, without metadata
 * GetMyPhotos: Success with pagination
 * GetPublicPhotos: Success with pagination
 * GetUserPublicPhotos: Success with pagination
 * GetPhotoById: Success get photo
 * UpdatePhoto: Success update
 * DeletePhoto: Success delete
 * TogglePrivacy: Success toggle
 *
 * TOTAL TESTS: 12-15 tests
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("GalleryController REST API Unit Tests")
@SuppressWarnings("null")
public class GalleryControllerTest {

    /**
     * Mock GalleryService - tidak test service logic di sini
     * Service logic sudah di-test di GalleryServiceTest.java
     */
    @Mock
    private GalleryService galleryService;

    /**
     * Controller yang akan di-test
     * Mockito inject mock GalleryService
     */
    @InjectMocks
    private GalleryController galleryController;

    // Test data
    private UserPrincipal currentUser;
    private User testUser;
    private GalleryPhoto testPhoto1;
    private GalleryPhoto testPhoto2;
    private MockMultipartFile mockFile;

    /**
     * Setup test data sebelum setiap test
     * Dipanggil otomatis sebelum @Test method
     */
    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setFullName("John Doe");
        testUser.setEmail("john@example.com");
        testUser.setPassword("hashedPassword123");
        testUser.setCreatedAt(LocalDateTime.now());

        // Setup UserPrincipal (authenticated user)
        currentUser = new UserPrincipal(
                testUser.getId(),
                testUser.getFullName(),
                testUser.getEmail(),
                testUser.getPassword(),
                null
        );

        // Setup test photos
        testPhoto1 = new GalleryPhoto();
        testPhoto1.setId(1L);
        testPhoto1.setUser(testUser);
        testPhoto1.setTitle("Test Photo 1");
        testPhoto1.setDescription("Test description 1");
        testPhoto1.setFilePath("gallery/user-1/photo-1.jpg");
        testPhoto1.setPublic(false);
        testPhoto1.setUploadOrder(0);
        testPhoto1.setCreatedAt(LocalDateTime.now());
        testPhoto1.setUpdatedAt(LocalDateTime.now());

        testPhoto2 = new GalleryPhoto();
        testPhoto2.setId(2L);
        testPhoto2.setUser(testUser);
        testPhoto2.setTitle("Test Photo 2");
        testPhoto2.setDescription("Test description 2");
        testPhoto2.setFilePath("gallery/user-1/photo-2.jpg");
        testPhoto2.setPublic(true);
        testPhoto2.setUploadOrder(1);
        testPhoto2.setCreatedAt(LocalDateTime.now());
        testPhoto2.setUpdatedAt(LocalDateTime.now());

        // Setup mock file untuk upload tests
        mockFile = new MockMultipartFile(
                "file",
                "test-photo.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );
    }

    // ========================================
    // ENDPOINT 1: UPLOAD PHOTO TESTS
    // ========================================

    @Test
    @DisplayName("Upload photo - Success with full metadata")
    void uploadPhoto_Success_WithFullMetadata() throws IOException {
        // Arrange
        String title = "Sunset at Beach";
        String description = "Beautiful sunset";
        Boolean isPublic = false;

        when(galleryService.uploadPhoto(any(), eq(1L), eq(title), eq(description), eq(isPublic)))
                .thenReturn(testPhoto1);

        // Act
        ResponseEntity<GalleryPhotoResponse> response = galleryController.uploadPhoto(
                mockFile, title, description, isPublic, currentUser
        );

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("Test Photo 1", response.getBody().getTitle());

        // Verify service called once
        verify(galleryService, times(1)).uploadPhoto(any(), eq(1L), eq(title), eq(description), eq(isPublic));
    }

    @Test
    @DisplayName("Upload photo - Success with minimal metadata (title only)")
    void uploadPhoto_Success_WithTitleOnly() throws IOException {
        // Arrange
        String title = "Quick Photo";

        when(galleryService.uploadPhoto(any(), eq(1L), eq(title), isNull(), isNull()))
                .thenReturn(testPhoto1);

        // Act
        ResponseEntity<GalleryPhotoResponse> response = galleryController.uploadPhoto(
                mockFile, title, null, null, currentUser
        );

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());

        verify(galleryService, times(1)).uploadPhoto(any(), eq(1L), eq(title), isNull(), isNull());
    }

    @Test
    @DisplayName("Upload photo - Success without any metadata")
    void uploadPhoto_Success_WithoutMetadata() throws IOException {
        // Arrange
        when(galleryService.uploadPhoto(any(), eq(1L), isNull(), isNull(), isNull()))
                .thenReturn(testPhoto1);

        // Act
        ResponseEntity<GalleryPhotoResponse> response = galleryController.uploadPhoto(
                mockFile, null, null, null, currentUser
        );

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());

        verify(galleryService, times(1)).uploadPhoto(any(), eq(1L), isNull(), isNull(), isNull());
    }

    // ========================================
    // ENDPOINT 2: GET MY PHOTOS TESTS
    // ========================================

    @Test
    @DisplayName("Get my photos - Success with pagination")
    void getMyPhotos_Success() {
        // Arrange
        List<GalleryPhoto> photos = Arrays.asList(testPhoto1, testPhoto2);
        Pageable pageable = PageRequest.of(0, 12, Sort.by("createdAt").descending());

        when(galleryService.getMyPhotos(1L, pageable)).thenReturn(photos);
        when(galleryService.countMyPhotos(1L)).thenReturn(2L);

        // Act
        ResponseEntity<GalleryListResponse> response = galleryController.getMyPhotos(0, 12, currentUser);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().getPhotos().size());
        assertEquals(0, response.getBody().getCurrentPage());
        assertEquals(1, response.getBody().getTotalPages());
        assertEquals(2, response.getBody().getTotalPhotos());
        assertFalse(response.getBody().isHasNext());
        assertFalse(response.getBody().isHasPrevious());

        verify(galleryService, times(1)).getMyPhotos(1L, pageable);
        verify(galleryService, times(1)).countMyPhotos(1L);
    }

    // ========================================
    // ENDPOINT 3: GET PUBLIC PHOTOS TESTS
    // ========================================

    @Test
    @DisplayName("Get public photos - Success with pagination")
    void getPublicPhotos_Success() {
        // Arrange
        List<GalleryPhoto> photos = Arrays.asList(testPhoto2); // Only public photo
        Pageable pageable = PageRequest.of(0, 12, Sort.by("createdAt").descending());

        when(galleryService.getPublicPhotos(pageable)).thenReturn(photos);
        when(galleryService.countPublicPhotos()).thenReturn(1L);

        // Act
        ResponseEntity<GalleryListResponse> response = galleryController.getPublicPhotos(0, 12);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getPhotos().size());
        assertEquals(1, response.getBody().getTotalPhotos());

        verify(galleryService, times(1)).getPublicPhotos(pageable);
        verify(galleryService, times(1)).countPublicPhotos();
    }

    // ========================================
    // ENDPOINT 4: GET USER'S PUBLIC PHOTOS TESTS
    // ========================================

    @Test
    @DisplayName("Get user's public photos - Success with pagination")
    void getUserPublicPhotos_Success() {
        // Arrange
        Long userId = 1L;
        List<GalleryPhoto> photos = Arrays.asList(testPhoto2);
        Pageable pageable = PageRequest.of(0, 12, Sort.by("createdAt").descending());

        when(galleryService.getUserPublicPhotos(userId, pageable)).thenReturn(photos);
        when(galleryService.countUserPublicPhotos(userId)).thenReturn(1L);

        // Act
        ResponseEntity<GalleryListResponse> response = galleryController.getUserPublicPhotos(userId, 0, 12);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getPhotos().size());

        verify(galleryService, times(1)).getUserPublicPhotos(userId, pageable);
        verify(galleryService, times(1)).countUserPublicPhotos(userId);
    }

    // ========================================
    // ENDPOINT 5: GET PHOTO BY ID TESTS
    // ========================================

    @Test
    @DisplayName("Get photo by ID - Success")
    void getPhotoById_Success() {
        // Arrange
        Long photoId = 1L;
        when(galleryService.getPhotoById(photoId, 1L)).thenReturn(testPhoto1);

        // Act
        ResponseEntity<GalleryPhotoDetailResponse> response = galleryController.getPhotoById(photoId, currentUser);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(photoId, response.getBody().getId());

        verify(galleryService, times(1)).getPhotoById(photoId, 1L);
    }

    // ========================================
    // ENDPOINT 6: UPDATE PHOTO TESTS
    // ========================================

    @Test
    @DisplayName("Update photo - Success")
    void updatePhoto_Success() {
        // Arrange
        Long photoId = 1L;
        GalleryPhotoRequest request = new GalleryPhotoRequest();
        request.setTitle("Updated Title");
        request.setDescription("Updated Description");
        request.setIsPublic(true);

        GalleryPhoto updatedPhoto = new GalleryPhoto();
        updatedPhoto.setId(photoId);
        updatedPhoto.setUser(testUser);
        updatedPhoto.setTitle("Updated Title");
        updatedPhoto.setDescription("Updated Description");
        updatedPhoto.setFilePath("gallery/user-1/photo-1.jpg");
        updatedPhoto.setPublic(true);

        when(galleryService.updatePhoto(photoId, 1L, "Updated Title", "Updated Description", true))
                .thenReturn(updatedPhoto);

        // Act
        ResponseEntity<GalleryPhotoResponse> response = galleryController.updatePhoto(photoId, request, currentUser);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Updated Title", response.getBody().getTitle());
        assertEquals("Updated Description", response.getBody().getDescription());
        assertTrue(response.getBody().isPublic());

        verify(galleryService, times(1)).updatePhoto(photoId, 1L, "Updated Title", "Updated Description", true);
    }

    // ========================================
    // ENDPOINT 7: DELETE PHOTO TESTS
    // ========================================

    @Test
    @DisplayName("Delete photo - Success")
    void deletePhoto_Success() throws IOException {
        // Arrange
        Long photoId = 1L;
        doNothing().when(galleryService).deletePhoto(photoId, 1L);

        // Act
        ResponseEntity<Void> response = galleryController.deletePhoto(photoId, currentUser);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());

        verify(galleryService, times(1)).deletePhoto(photoId, 1L);
    }

    // ========================================
    // ENDPOINT 8: TOGGLE PRIVACY TESTS
    // ========================================

    @Test
    @DisplayName("Toggle privacy - Success (private to public)")
    void togglePrivacy_Success() {
        // Arrange
        Long photoId = 1L;
        GalleryPhoto toggledPhoto = new GalleryPhoto();
        toggledPhoto.setId(photoId);
        toggledPhoto.setUser(testUser);
        toggledPhoto.setTitle("Test Photo 1");
        toggledPhoto.setFilePath("gallery/user-1/photo-1.jpg");
        toggledPhoto.setPublic(true); // Toggled from false to true

        when(galleryService.togglePrivacy(photoId, 1L)).thenReturn(toggledPhoto);

        // Act
        ResponseEntity<GalleryPhotoResponse> response = galleryController.togglePrivacy(photoId, currentUser);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isPublic()); // Verify privacy toggled

        verify(galleryService, times(1)).togglePrivacy(photoId, 1L);
    }

    // ========================================
    // PAGINATION TESTS
    // ========================================

    @Test
    @DisplayName("Get my photos - Pagination with multiple pages")
    void getMyPhotos_PaginationMultiplePages() {
        // Arrange: Simulate 25 photos, page size 12
        List<GalleryPhoto> firstPagePhotos = Arrays.asList(testPhoto1, testPhoto2);
        Pageable pageable = PageRequest.of(0, 12, Sort.by("createdAt").descending());

        when(galleryService.getMyPhotos(1L, pageable)).thenReturn(firstPagePhotos);
        when(galleryService.countMyPhotos(1L)).thenReturn(25L); // Total 25 photos

        // Act
        ResponseEntity<GalleryListResponse> response = galleryController.getMyPhotos(0, 12, currentUser);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(0, response.getBody().getCurrentPage());
        assertEquals(3, response.getBody().getTotalPages()); // ceil(25/12) = 3 pages
        assertEquals(25, response.getBody().getTotalPhotos());
        assertTrue(response.getBody().isHasNext()); // Page 0 has next
        assertFalse(response.getBody().isHasPrevious()); // Page 0 has no previous
    }

    @Test
    @DisplayName("Get my photos - Custom page size")
    void getMyPhotos_CustomPageSize() {
        // Arrange: Custom page size of 5
        List<GalleryPhoto> photos = Arrays.asList(testPhoto1, testPhoto2);
        Pageable pageable = PageRequest.of(0, 5, Sort.by("createdAt").descending());

        when(galleryService.getMyPhotos(1L, pageable)).thenReturn(photos);
        when(galleryService.countMyPhotos(1L)).thenReturn(2L);

        // Act
        ResponseEntity<GalleryListResponse> response = galleryController.getMyPhotos(0, 5, currentUser);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(5, response.getBody().getPageSize());
        assertEquals(1, response.getBody().getTotalPages());
    }
}
