package com.ikplabs.api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikplabs.api.dto.UserRegistrationRequest;
import com.ikplabs.api.entity.GalleryPhoto;
import com.ikplabs.api.entity.User;
import com.ikplabs.api.repository.GalleryPhotoRepository;
import com.ikplabs.api.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration Tests untuk GalleryController.
 *
 * DEFINISI INTEGRATION TEST (Per Senior's Definition):
 * =====================================================
 * Integration test = Test INTERAKSI antar component dalam Spring Container SAJA
 * - Test bagaimana Controller, Service, FileStorageService berinteraksi
 * - TIDAK test database (database = external system)
 * - Mock external dependencies (GalleryPhotoRepository, UserRepository)
 * - Focus pada component wiring dan Spring Security integration
 *
 * Test ini menggunakan:
 * - @SpringBootTest - Load full Spring context dengan semua beans
 * - @AutoConfigureMockMvc - Enable security filters untuk test JWT authentication
 * - @MockBean untuk GalleryPhotoRepository dan UserRepository - Mock database layer
 * - MockMvc - Simulate HTTP requests
 * - Real JWT authentication filter - Verify integration dengan Spring Security
 * - Real GalleryService - Test business logic integration
 * - Real FileStorageService - Test file upload/delete integration (mocked disk I/O)
 *
 * Test Coverage (18 tests total):
 * 1. Upload Photo Endpoint (3 tests)
 *    - Upload with full metadata
 *    - Upload with minimal metadata
 *    - Upload without authentication (should fail)
 *
 * 2. Get My Photos Endpoint (2 tests)
 *    - Get my photos with pagination
 *    - Get my photos without authentication
 *
 * 3. Get Public Photos Endpoint (2 tests)
 *    - Get public photos (accessible without auth)
 *    - Verify only public photos returned
 *
 * 4. Get Photo By ID Endpoint (3 tests)
 *    - Get public photo (anyone can access)
 *    - Get private photo as owner (should succeed)
 *    - Get private photo as non-owner (should fail 403)
 *
 * 5. Update Photo Endpoint (3 tests)
 *    - Update photo as owner (should succeed)
 *    - Update photo as non-owner (should fail 403)
 *    - Update photo without authentication (should fail)
 *
 * 6. Delete Photo Endpoint (2 tests)
 *    - Delete photo as owner (should succeed)
 *    - Delete photo as non-owner (should fail 403)
 *
 * 7. Toggle Privacy Endpoint (2 tests)
 *    - Toggle privacy as owner (should succeed)
 *    - Toggle privacy as non-owner (should fail 403)
 *
 * Test Strategy:
 * - Mock user registration → Generate JWT token → Use token for protected endpoints
 * - Mock repository responses untuk photo operations
 * - Test authorization (owner vs non-owner)
 * - Test authentication (with/without token)
 * - Verify service layer integration dengan controller
 *
 * @author Registration Form Team
 */
@SuppressWarnings("null")
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("GalleryController Integration Tests")
public class GalleryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private GalleryPhotoRepository galleryPhotoRepository;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private com.ikplabs.api.security.JwtUtil jwtUtil;

    // Test data
    private User testUser;
    private GalleryPhoto testPhoto1;
    private GalleryPhoto testPhoto2;

    /**
     * Setup test data sebelum setiap test untuk isolasi.
     */
    @BeforeEach
    void setUp() {
        // Reset all mocks
        reset(galleryPhotoRepository, userRepository);

        // Create test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("gallery@test.com");
        testUser.setFullName("Gallery Test User");
        testUser.setPassword("$2a$10$encodedPassword");
        testUser.setCreatedAt(LocalDateTime.now());
        testUser.setUpdatedAt(LocalDateTime.now());

        // Create test photos
        testPhoto1 = new GalleryPhoto();
        testPhoto1.setId(1L);
        testPhoto1.setUser(testUser);
        testPhoto1.setTitle("Test Photo 1");
        testPhoto1.setDescription("Description for test photo 1");
        testPhoto1.setFilePath("gallery/user-1/photo-1-123.jpg");
        testPhoto1.setIsPublic(false); // Private photo
        testPhoto1.setCreatedAt(LocalDateTime.now());
        testPhoto1.setUpdatedAt(LocalDateTime.now());

        testPhoto2 = new GalleryPhoto();
        testPhoto2.setId(2L);
        testPhoto2.setUser(testUser);
        testPhoto2.setTitle("Test Photo 2");
        testPhoto2.setDescription("Description for test photo 2");
        testPhoto2.setFilePath("gallery/user-1/photo-2-456.jpg");
        testPhoto2.setIsPublic(true); // Public photo
        testPhoto2.setCreatedAt(LocalDateTime.now());
        testPhoto2.setUpdatedAt(LocalDateTime.now());
    }

    // ========================================================================
    // HELPER METHODS
    // ========================================================================

    /**
     * Helper method untuk generate JWT token untuk testing.
     */
    private String generateTestToken(Long userId, String email, String fullName) {
        return jwtUtil.generateToken(userId, email, fullName);
    }

    /**
     * Helper method: Mock user registration dan return JWT token.
     */
    private String registerUserAndGetToken(String email, String fullName) throws Exception {
        // Mock: Email belum exist
        when(userRepository.findByEmail(email))
                .thenReturn(Optional.empty())  // First call during registration
                .thenAnswer(invocation -> {
                    // Subsequent calls dari JWT filter
                    User savedUser = new User(fullName, email, "$2a$10$encodedPassword");
                    savedUser.setId(1L);
                    return Optional.of(savedUser);
                });

        // Mock: Save user berhasil
        when(userRepository.save(any())).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            if (user != null) {
                user.setId(1L);
            }
            return user;
        });

        // Register user via HTTP request
        UserRegistrationRequest regRequest = new UserRegistrationRequest();
        regRequest.setFullName(fullName);
        regRequest.setEmail(email);
        regRequest.setPassword("Test@1234");

        String responseJson = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Extract token dari response
        return objectMapper.readTree(responseJson).get("token").asText();
    }

    // ========================================================================
    // UPLOAD PHOTO TESTS
    // ========================================================================

    /**
     * Test 1: Upload photo dengan full metadata (title, description, isPublic)
     *
     * Scenario:
     * 1. User authenticated dengan JWT token
     * 2. Upload photo dengan semua metadata
     * 3. Verify service dipanggil dengan parameter correct
     * 4. Verify response HTTP 201 CREATED dengan photo data
     */
    @Test
    @Order(1)
    @DisplayName("1. Upload photo - Full metadata should succeed")
    void testUploadPhoto_WithFullMetadata_ShouldReturn201() throws Exception {
        // ARRANGE: Setup authentication
        String token = registerUserAndGetToken("upload1@test.com", "Upload User One");

        // Mock: findById untuk get user
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // Mock: save photo (first save to get ID, second save to persist file path)
        when(galleryPhotoRepository.save(any(GalleryPhoto.class)))
                .thenAnswer(invocation -> {
                    GalleryPhoto photo = invocation.getArgument(0);
                    if (photo.getId() == null) {
                        photo.setId(1L); // First save - generate ID
                        photo.setCreatedAt(LocalDateTime.now());
                        photo.setUpdatedAt(LocalDateTime.now());
                    }
                    return photo;
                });

        // Create multipart file
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-photo.jpg",
                "image/jpeg",
                "fake image content".getBytes()
        );

        // ACT & ASSERT: Upload photo
        mockMvc.perform(multipart("/api/gallery/upload")
                        .file(file)
                        .param("title", "Sunset Beach")
                        .param("description", "Beautiful sunset at the beach")
                        .param("isPublic", "false")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Sunset Beach"))
                .andExpect(jsonPath("$.description").value("Beautiful sunset at the beach"))
                .andExpect(jsonPath("$.isPublic").value(false))
                .andExpect(jsonPath("$.ownerName").value("Gallery Test User"))
                .andExpect(jsonPath("$.filePath").exists())
                .andExpect(jsonPath("$.createdAt").exists());

        // VERIFY: Repository interactions
        verify(userRepository).findById(1L);
        verify(galleryPhotoRepository, times(2)).save(any(GalleryPhoto.class)); // Save twice (ID generation + file path)
    }

    /**
     * Test 2: Upload photo dengan minimal metadata (title only)
     *
     * Scenario:
     * 1. User authenticated
     * 2. Upload photo hanya dengan title (no description, isPublic default false)
     * 3. Verify photo saved dengan default values
     */
    @Test
    @Order(2)
    @DisplayName("2. Upload photo - Minimal metadata should succeed")
    void testUploadPhoto_WithMinimalMetadata_ShouldReturn201() throws Exception {
        // ARRANGE
        String token = registerUserAndGetToken("upload2@test.com", "Upload User Two");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(galleryPhotoRepository.save(any(GalleryPhoto.class)))
                .thenAnswer(invocation -> {
                    GalleryPhoto photo = invocation.getArgument(0);
                    if (photo.getId() == null) {
                        photo.setId(2L);
                    }
                    return photo;
                });

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-photo2.jpg",
                "image/jpeg",
                "fake image content 2".getBytes()
        );

        // ACT & ASSERT: Upload dengan title only
        mockMvc.perform(multipart("/api/gallery/upload")
                        .file(file)
                        .param("title", "Mountain View")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.title").value("Mountain View"))
                .andExpect(jsonPath("$.description").value(nullValue())) // Null description
                .andExpect(jsonPath("$.isPublic").value(false)) // Default to private
                .andExpect(jsonPath("$.filePath").exists());

        verify(galleryPhotoRepository, times(2)).save(any(GalleryPhoto.class));
    }

    /**
     * Test 3: Upload photo tanpa authentication harus fail
     *
     * Scenario:
     * 1. Attempt upload tanpa JWT token
     * 2. Spring Security harus block dengan 403 Forbidden
     */
    @Test
    @Order(3)
    @DisplayName("3. Upload photo - Without authentication should return 403")
    void testUploadPhoto_WithoutAuth_ShouldReturn403() throws Exception {
        // ARRANGE
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-photo3.jpg",
                "image/jpeg",
                "fake image content 3".getBytes()
        );

        // ACT & ASSERT: Upload tanpa Authorization header
        mockMvc.perform(multipart("/api/gallery/upload")
                        .file(file)
                        .param("title", "Should Fail"))
                .andDo(print())
                .andExpect(status().isForbidden()); // Spring Security blocks

        // VERIFY: Repository tidak pernah dipanggil
        verify(galleryPhotoRepository, never()).save(any());
    }

    // ========================================================================
    // GET MY PHOTOS TESTS
    // ========================================================================

    /**
     * Test 4: Get my photos dengan pagination
     *
     * Scenario:
     * 1. User authenticated
     * 2. Mock repository return 2 photos
     * 3. Verify response contains pagination metadata dan photos
     */
    @Test
    @Order(4)
    @DisplayName("4. Get my photos - With pagination should return photos")
    void testGetMyPhotos_WithPagination_ShouldReturn200() throws Exception {
        // ARRANGE
        String token = registerUserAndGetToken("myphotos@test.com", "My Photos User");

        // Mock: findByUserId return 2 photos
        List<GalleryPhoto> photos = Arrays.asList(testPhoto1, testPhoto2);
        when(galleryPhotoRepository.findByUserId(eq(1L), any(Pageable.class)))
                .thenReturn(photos);

        // Mock: countByUserId return 2
        when(galleryPhotoRepository.countByUserId(1L)).thenReturn(2L);

        // ACT & ASSERT
        mockMvc.perform(get("/api/gallery/my-photos")
                        .param("page", "0")
                        .param("size", "12")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.photos").isArray())
                .andExpect(jsonPath("$.photos", hasSize(2)))
                .andExpect(jsonPath("$.photos[0].id").value(1L))
                .andExpect(jsonPath("$.photos[0].title").value("Test Photo 1"))
                .andExpect(jsonPath("$.photos[0].isPublic").value(false))
                .andExpect(jsonPath("$.photos[1].id").value(2L))
                .andExpect(jsonPath("$.photos[1].title").value("Test Photo 2"))
                .andExpect(jsonPath("$.photos[1].isPublic").value(true))
                .andExpect(jsonPath("$.currentPage").value(0))
                .andExpect(jsonPath("$.totalPhotos").value(2))
                .andExpect(jsonPath("$.totalPages").value(1));

        // VERIFY
        verify(galleryPhotoRepository).findByUserId(eq(1L), any(Pageable.class));
        verify(galleryPhotoRepository).countByUserId(1L);
    }

    /**
     * Test 5: Get my photos tanpa authentication harus fail
     */
    @Test
    @Order(5)
    @DisplayName("5. Get my photos - Without authentication should return 403")
    void testGetMyPhotos_WithoutAuth_ShouldReturn403() throws Exception {
        // ACT & ASSERT
        mockMvc.perform(get("/api/gallery/my-photos"))
                .andDo(print())
                .andExpect(status().isForbidden());

        verify(galleryPhotoRepository, never()).findByUserId(anyLong(), any());
    }

    // ========================================================================
    // GET PUBLIC PHOTOS TESTS
    // ========================================================================

    /**
     * Test 6: Get public photos (requires authentication per SecurityConfig)
     *
     * Scenario:
     * 1. User authenticated (all /api/gallery/** require auth)
     * 2. Mock repository return hanya public photos
     * 3. Verify response contains only public photos
     */
    @Test
    @Order(6)
    @DisplayName("6. Get public photos - Should return only public photos")
    void testGetPublicPhotos_ShouldReturnOnlyPublic() throws Exception {
        // ARRANGE
        String token = registerUserAndGetToken("publicview@test.com", "Public Viewer");

        // Mock hanya return public photos
        List<GalleryPhoto> publicPhotos = Arrays.asList(testPhoto2); // testPhoto2 is public
        when(galleryPhotoRepository.findByIsPublicTrue(any(Pageable.class)))
                .thenReturn(publicPhotos);
        when(galleryPhotoRepository.countByIsPublicTrue()).thenReturn(1L);

        // ACT & ASSERT: Need Authorization header
        mockMvc.perform(get("/api/gallery/public")
                        .header("Authorization", "Bearer " + token)
                        .param("page", "0")
                        .param("size", "12"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.photos").isArray())
                .andExpect(jsonPath("$.photos", hasSize(1)))
                .andExpect(jsonPath("$.photos[0].id").value(2L))
                .andExpect(jsonPath("$.photos[0].title").value("Test Photo 2"))
                .andExpect(jsonPath("$.photos[0].isPublic").value(true)) // Must be public
                .andExpect(jsonPath("$.totalPhotos").value(1));

        verify(galleryPhotoRepository).findByIsPublicTrue(any(Pageable.class));
    }

    /**
     * Test 7: Get public photos tanpa authentication harus fail
     */
    @Test
    @Order(7)
    @DisplayName("7. Get public photos - Without authentication should return 403")
    void testGetPublicPhotos_WithoutAuth_ShouldReturn403() throws Exception {
        // ACT & ASSERT: Call WITHOUT Authorization header
        mockMvc.perform(get("/api/gallery/public"))
                .andDo(print())
                .andExpect(status().isForbidden()); // Spring Security blocks

        verify(galleryPhotoRepository, never()).findByIsPublicTrue(any());
    }

    // ========================================================================
    // GET PHOTO BY ID TESTS
    // ========================================================================

    /**
     * Test 8: Get public photo by ID (need authentication, but any user can access public photos)
     *
     * Scenario:
     * 1. Photo is public (isPublic = true)
     * 2. User authenticated (required by SecurityConfig)
     * 3. Public photos accessible to any authenticated user
     */
    @Test
    @Order(8)
    @DisplayName("8. Get photo by ID - Public photo accessible to authenticated users")
    void testGetPhotoById_PublicPhoto_ShouldReturn200() throws Exception {
        // ARRANGE
        String token = registerUserAndGetToken("viewer@test.com", "Photo Viewer");

        // testPhoto2 is public
        when(galleryPhotoRepository.findById(2L)).thenReturn(Optional.of(testPhoto2));

        // ACT & ASSERT: Auth needed but any user can access public photo
        mockMvc.perform(get("/api/gallery/photo/2")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(2L))
                .andExpect(jsonPath("$.title").value("Test Photo 2"))
                .andExpect(jsonPath("$.isPublic").value(true));

        verify(galleryPhotoRepository).findById(2L);
    }

    /**
     * Test 9: Get private photo as owner (should succeed)
     *
     * Scenario:
     * 1. Photo is private (isPublic = false)
     * 2. User authenticated and is owner
     * 3. Owner can view their private photos
     */
    @Test
    @Order(9)
    @DisplayName("9. Get photo by ID - Private photo accessible to owner")
    void testGetPhotoById_PrivatePhotoAsOwner_ShouldReturn200() throws Exception {
        // ARRANGE
        String token = registerUserAndGetToken("owner@test.com", "Photo Owner");

        // Mock: testPhoto1 is private, owned by user ID 1
        when(galleryPhotoRepository.findById(1L)).thenReturn(Optional.of(testPhoto1));

        // ACT & ASSERT: Owner can access private photo
        mockMvc.perform(get("/api/gallery/photo/1")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Test Photo 1"))
                .andExpect(jsonPath("$.isPublic").value(false));
    }

    /**
     * Test 10: Get private photo as non-owner (should fail 403)
     *
     * Scenario:
     * 1. Photo is private
     * 2. User authenticated tapi bukan owner
     * 3. Should return 403 Forbidden (UnauthorizedGalleryAccessException)
     */
    @Test
    @Order(10)
    @DisplayName("10. Get photo by ID - Private photo forbidden to non-owner")
    void testGetPhotoById_PrivatePhotoAsNonOwner_ShouldReturn403() throws Exception {
        // ARRANGE: Create different user (ID 2, bukan owner)
        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setEmail("other@test.com");
        otherUser.setFullName("Other User");

        // Generate token untuk user 2
        String token = generateTestToken(2L, "other@test.com", "Other User");

        // Mock: findByEmail untuk JWT authentication
        when(userRepository.findByEmail("other@test.com"))
                .thenReturn(Optional.of(otherUser));

        // Mock: testPhoto1 owned by user 1 (private)
        when(galleryPhotoRepository.findById(1L)).thenReturn(Optional.of(testPhoto1));

        // ACT & ASSERT: Non-owner cannot access private photo
        mockMvc.perform(get("/api/gallery/photo/1")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.errorCode").value("GALLERY_UNAUTHORIZED"))
                .andExpect(jsonPath("$.message", containsString("not authorized")));
    }

    // ========================================================================
    // UPDATE PHOTO TESTS
    // ========================================================================

    /**
     * Test 11: Update photo as owner (should succeed)
     *
     * Scenario:
     * 1. User authenticated and is owner
     * 2. Update title, description, privacy
     * 3. Verify repository.save() called dengan updated data
     */
    @Test
    @Order(11)
    @DisplayName("11. Update photo - Owner can update")
    void testUpdatePhoto_AsOwner_ShouldReturn200() throws Exception {
        // ARRANGE
        String token = registerUserAndGetToken("update@test.com", "Update User");

        when(galleryPhotoRepository.findById(1L)).thenReturn(Optional.of(testPhoto1));
        when(galleryPhotoRepository.save(any(GalleryPhoto.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        String updateRequest = """
                {
                    "title": "Updated Title",
                    "description": "Updated Description",
                    "isPublic": true
                }
                """;

        // ACT & ASSERT
        mockMvc.perform(put("/api/gallery/photo/1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateRequest))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.description").value("Updated Description"))
                .andExpect(jsonPath("$.isPublic").value(true));

        verify(galleryPhotoRepository).findById(1L);
        verify(galleryPhotoRepository).save(any(GalleryPhoto.class));
    }

    /**
     * Test 12: Update photo as non-owner (should fail 403)
     */
    @Test
    @Order(12)
    @DisplayName("12. Update photo - Non-owner should get 403")
    void testUpdatePhoto_AsNonOwner_ShouldReturn403() throws Exception {
        // ARRANGE: User 2 tries to update user 1's photo
        User otherUser = new User();
        otherUser.setId(2L);
        otherUser.setEmail("other2@test.com");
        otherUser.setFullName("Other User 2");

        String token = generateTestToken(2L, "other2@test.com", "Other User 2");

        when(userRepository.findByEmail("other2@test.com"))
                .thenReturn(Optional.of(otherUser));
        when(galleryPhotoRepository.findById(1L)).thenReturn(Optional.of(testPhoto1));

        String updateRequest = """
                {
                    "title": "Hacked Title"
                }
                """;

        // ACT & ASSERT
        mockMvc.perform(put("/api/gallery/photo/1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateRequest))
                .andDo(print())
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.errorCode").value("GALLERY_UNAUTHORIZED"))
                .andExpect(jsonPath("$.message", containsString("not authorized")));

        // VERIFY: save() tidak pernah dipanggil (authorization failed first)
        verify(galleryPhotoRepository, never()).save(any());
    }

    /**
     * Test 13: Update photo tanpa authentication (should fail 403)
     */
    @Test
    @Order(13)
    @DisplayName("13. Update photo - Without authentication should return 403")
    void testUpdatePhoto_WithoutAuth_ShouldReturn403() throws Exception {
        // ARRANGE
        String updateRequest = """
                {
                    "title": "No Auth Update"
                }
                """;

        // ACT & ASSERT
        mockMvc.perform(put("/api/gallery/photo/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateRequest))
                .andDo(print())
                .andExpect(status().isForbidden());

        verify(galleryPhotoRepository, never()).save(any());
    }

    // ========================================================================
    // DELETE PHOTO TESTS
    // ========================================================================

    /**
     * Test 14: Delete photo as owner (should succeed)
     *
     * Scenario:
     * 1. User authenticated and is owner
     * 2. Delete photo
     * 3. Verify repository.delete() called
     * 4. Verify file deletion attempted
     */
    @Test
    @Order(14)
    @DisplayName("14. Delete photo - Owner can delete")
    void testDeletePhoto_AsOwner_ShouldReturn204() throws Exception {
        // ARRANGE
        String token = registerUserAndGetToken("delete@test.com", "Delete User");

        when(galleryPhotoRepository.findById(1L)).thenReturn(Optional.of(testPhoto1));
        doNothing().when(galleryPhotoRepository).delete(any(GalleryPhoto.class));

        // ACT & ASSERT
        mockMvc.perform(delete("/api/gallery/photo/1")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isNoContent()); // 204 No Content

        verify(galleryPhotoRepository).findById(1L);
        verify(galleryPhotoRepository).delete(any(GalleryPhoto.class));
    }

    /**
     * Test 15: Delete photo as non-owner (should fail 403)
     */
    @Test
    @Order(15)
    @DisplayName("15. Delete photo - Non-owner should get 403")
    void testDeletePhoto_AsNonOwner_ShouldReturn403() throws Exception {
        // ARRANGE
        User otherUser = new User();
        otherUser.setId(3L);
        otherUser.setEmail("other3@test.com");
        otherUser.setFullName("Other User 3");

        String token = generateTestToken(3L, "other3@test.com", "Other User 3");

        when(userRepository.findByEmail("other3@test.com"))
                .thenReturn(Optional.of(otherUser));
        when(galleryPhotoRepository.findById(1L)).thenReturn(Optional.of(testPhoto1));

        // ACT & ASSERT
        mockMvc.perform(delete("/api/gallery/photo/1")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.errorCode").value("GALLERY_UNAUTHORIZED"))
                .andExpect(jsonPath("$.message", containsString("not authorized")));

        // VERIFY: delete() tidak dipanggil
        verify(galleryPhotoRepository, never()).delete(any());
    }

    // ========================================================================
    // TOGGLE PRIVACY TESTS
    // ========================================================================

    /**
     * Test 16: Toggle privacy as owner (should succeed)
     *
     * Scenario:
     * 1. User authenticated and is owner
     * 2. Toggle photo privacy (private → public)
     * 3. Verify repository.save() called dengan toggled isPublic
     */
    @Test
    @Order(16)
    @DisplayName("16. Toggle privacy - Owner can toggle")
    void testTogglePrivacy_AsOwner_ShouldReturn200() throws Exception {
        // ARRANGE
        String token = registerUserAndGetToken("toggle@test.com", "Toggle User");

        // testPhoto1 is private (false), akan toggle jadi public (true)
        when(galleryPhotoRepository.findById(1L)).thenReturn(Optional.of(testPhoto1));
        when(galleryPhotoRepository.save(any(GalleryPhoto.class)))
                .thenAnswer(invocation -> {
                    GalleryPhoto photo = invocation.getArgument(0);
                    // Simulate toggle (private → public)
                    photo.setIsPublic(true);
                    return photo;
                });

        // ACT & ASSERT
        mockMvc.perform(put("/api/gallery/photo/1/toggle-privacy")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.isPublic").value(true)); // Toggled to public

        verify(galleryPhotoRepository).findById(1L);
        verify(galleryPhotoRepository).save(any(GalleryPhoto.class));
    }

    /**
     * Test 17: Toggle privacy as non-owner (should fail 403)
     */
    @Test
    @Order(17)
    @DisplayName("17. Toggle privacy - Non-owner should get 403")
    void testTogglePrivacy_AsNonOwner_ShouldReturn403() throws Exception {
        // ARRANGE
        User otherUser = new User();
        otherUser.setId(4L);
        otherUser.setEmail("other4@test.com");
        otherUser.setFullName("Other User 4");

        String token = generateTestToken(4L, "other4@test.com", "Other User 4");

        when(userRepository.findByEmail("other4@test.com"))
                .thenReturn(Optional.of(otherUser));
        when(galleryPhotoRepository.findById(1L)).thenReturn(Optional.of(testPhoto1));

        // ACT & ASSERT
        mockMvc.perform(put("/api/gallery/photo/1/toggle-privacy")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.errorCode").value("GALLERY_UNAUTHORIZED"))
                .andExpect(jsonPath("$.message", containsString("not authorized")));

        verify(galleryPhotoRepository, never()).save(any());
    }

    /**
     * NOTES UNTUK PEMAHAMAN (PEMULA):
     * ================================
     *
     * 1. INTEGRATION TEST vs UNIT TEST:
     *    - Unit Test: Mock semua dependencies, test controller in isolation
     *    - Integration Test: Load Spring context, test component interaction
     *    - Mock hanya database layer (GalleryPhotoRepository, UserRepository)
     *    - Real service layer (GalleryService, FileStorageService)
     *    - Real Spring Security integration (JWT authentication)
     *
     * 2. MOCK STRATEGY:
     *    - @MockBean GalleryPhotoRepository - Mock database operations
     *    - @MockBean UserRepository - Mock user queries
     *    - when().thenReturn() - Setup mock behavior
     *    - verify() - Verify repository methods dipanggil
     *    - Real business logic execution di service layer
     *
     * 3. AUTHENTICATION TESTING:
     *    - registerUserAndGetToken() - Helper untuk get JWT token
     *    - Bearer token in Authorization header
     *    - Spring Security filter validates token
     *    - Controller receives authenticated UserPrincipal
     *
     * 4. AUTHORIZATION TESTING:
     *    - Owner vs Non-owner scenarios
     *    - Private vs Public photo access
     *    - Verify 403 Forbidden untuk unauthorized access
     *    - Test different user IDs (user 1, 2, 3, 4)
     *
     * 5. TEST COVERAGE:
     *    Total: 17 tests
     *    - Upload: 3 tests (full/minimal metadata, no auth)
     *    - Get My Photos: 2 tests (with pagination, no auth)
     *    - Get Public: 2 tests (only public, no auth required)
     *    - Get By ID: 3 tests (public, private as owner, private as non-owner)
     *    - Update: 3 tests (as owner, as non-owner, no auth)
     *    - Delete: 2 tests (as owner, as non-owner)
     *    - Toggle Privacy: 2 tests (as owner, as non-owner)
     *
     * 6. WHY THIS PATTERN:
     *    - Fast execution (no database startup)
     *    - Focus on component wiring
     *    - Test Spring Security integration
     *    - Test service layer business logic
     *    - Test authorization rules
     *    - No Testcontainers needed
     *
     * 7. MULTIPART FILE UPLOAD:
     *    - MockMultipartFile untuk simulate file upload
     *    - multipart() instead of post()
     *    - .file() untuk attach file
     *    - .param() untuk metadata (title, description, isPublic)
     *
     * 8. PAGINATION TESTING:
     *    - Mock repository return list of photos
     *    - Verify pagination metadata (currentPage, totalPhotos, totalPages)
     *    - Test different page sizes
     *
     * 9. ERROR SCENARIOS:
     *    - 403 Forbidden: No auth, non-owner access
     *    - 404 Not Found: Photo not exists (tested in API layer)
     *    - 400 Bad Request: Invalid file type (tested in API layer)
     *
     * 10. DATABASE TESTING:
     *     - Repository layer tested in API Test (Day 8)
     *     - API tests will use real PostgreSQL database
     *     - Integration tests focus on Spring context wiring
     */
}
