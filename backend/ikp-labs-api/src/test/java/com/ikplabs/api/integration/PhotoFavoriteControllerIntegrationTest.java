package com.ikplabs.api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikplabs.api.dto.UserRegistrationRequest;
import com.ikplabs.api.entity.GalleryPhoto;
import com.ikplabs.api.entity.PhotoLike;
import com.ikplabs.api.entity.PhotoFavorite;
import com.ikplabs.api.entity.User;
import com.ikplabs.api.repository.GalleryPhotoRepository;
import com.ikplabs.api.repository.PhotoFavoriteRepository;
import com.ikplabs.api.repository.PhotoLikeRepository;
import com.ikplabs.api.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
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
 * Integration Tests untuk PhotoFavoriteController
 *
 * Test coverage:
 * 1. POST /api/gallery/photo/{id}/favorite (201, 400)
 * 2. DELETE /api/gallery/photo/{id}/favorite (204, 400)
 * 3. GET /api/gallery/favorited-photos (200, 403)
 *
 * @author Isnendy Ankp
 * @since 2026-02-07
 */
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("PhotoFavoriteController Integration Tests")
public class PhotoFavoriteControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PhotoFavoriteRepository photoFavoriteRepository;

    @MockBean
    private GalleryPhotoRepository galleryPhotoRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PhotoLikeRepository photoLikeRepository;

    @Autowired
    private com.ikplabs.api.security.JwtUtil jwtUtil;

    // Test data
    private User favoriterUser;
    private User photoOwner;
    private GalleryPhoto publicPhoto;
    private GalleryPhoto privatePhoto;

    /**
     * Setup test data sebelum setiap test untuk isolasi
     */
    @BeforeEach
    void setUp() {
        // Reset all mocks
        reset(photoFavoriteRepository, galleryPhotoRepository, userRepository, photoLikeRepository);

        // Create favoriter user (ID 1)
        favoriterUser = new User();
        favoriterUser.setId(1L);
        favoriterUser.setEmail("favoriter@test.com");
        favoriterUser.setFullName("Photo Favoriter User");
        favoriterUser.setPassword("$2a$10$encodedPassword");
        favoriterUser.setCreatedAt(LocalDateTime.now());
        favoriterUser.setUpdatedAt(LocalDateTime.now());

        // Create photo owner (ID 2)
        photoOwner = new User();
        photoOwner.setId(2L);
        photoOwner.setEmail("owner@test.com");
        favoriterUser.setFullName("Photo Owner User");
        photoOwner.setPassword("$2a$10$encodedPassword");
        photoOwner.setCreatedAt(LocalDateTime.now());
        photoOwner.setUpdatedAt(LocalDateTime.now());

        // Create public photo owned by user 2
        publicPhoto = new GalleryPhoto();
        publicPhoto.setId(100L);
        publicPhoto.setUser(photoOwner);
        publicPhoto.setTitle("Test Public Photo");
        publicPhoto.setDescription("A public photo for favorite testing");
        publicPhoto.setFilePath("gallery/user-2/photo-100.jpg");
        publicPhoto.setIsPublic(true); // Can be favorited by others
        publicPhoto.setCreatedAt(LocalDateTime.now());
        publicPhoto.setUpdatedAt(LocalDateTime.now());

        // Create private photo owned by user 2
        privatePhoto = new GalleryPhoto();
        privatePhoto.setId(101L);
        privatePhoto.setUser(photoOwner);
        privatePhoto.setTitle("Test Private Photo");
        privatePhoto.setDescription("A private photo");
        privatePhoto.setFilePath("gallery/user-2/photo-101.jpg");
        privatePhoto.setIsPublic(false); // Cannot be favorited by others
        privatePhoto.setCreatedAt(LocalDateTime.now());
        privatePhoto.setUpdatedAt(LocalDateTime.now());
    }

    // ========================================================================
    // HELPER METHODS
    // ========================================================================

    /**
     * Helper method untuk generate JWT token untuk testing
     */
    private String generateTestToken(Long userId, String email, String fullName) {
        return jwtUtil.generateToken(userId, email, fullName);
    }

    /**
     * Helper method: Mock user registration dan return JWT token
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

        // Extract token from response
        // Response format: {"token":"jwt-token","userId":1,"email":"...","fullName":"..."}
        com.fasterxml.jackson.databind.JsonNode node = objectMapper.readTree(responseJson);
        return node.get("token").asText();
    }

    // ========================================================================
    // FAVORITE PHOTO TESTS
    // ========================================================================

    /**
     * PFCIT-001: POST /favorite - Should favorite photo successfully
     *
     * Scenario:
     * 1. User authenticated dengan JWT token
     * 2. Photo exists and is public
     * 3. User has not favorited this photo yet
     * 4. Favorite operation succeeds
     * 5. Returns 201 CREATED (empty body)
     */
    @Test
    @Order(1)
    @DisplayName("PFCIT-001: POST /favorite - Should favorite photo successfully (201)")
    void testFavoritePhoto_Success_ShouldReturn201() throws Exception {
        // ARRANGE: Setup authentication
        String token = registerUserAndGetToken("fav1@test.com", "Fav Test User One");

        // Mock: Photo exists and is public
        when(galleryPhotoRepository.findById(100L))
                .thenReturn(Optional.of(publicPhoto));

        // Mock: User has not favorited this photo yet
        when(photoFavoriteRepository.existsByPhotoIdAndUserId(100L, 1L))
                .thenReturn(false);

        // Mock: User repository (for getting user entity)
        when(userRepository.findById(1L))
                .thenReturn(Optional.of(favoriterUser));

        // Mock: Save PhotoFavorite
        when(photoFavoriteRepository.save(any(PhotoFavorite.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // ACT & ASSERT: Favorite photo
        mockMvc.perform(post("/api/gallery/photo/100/favorite")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isCreated()) // 201 Created
                .andExpect(content().string(isEmptyOrNullString())); // Empty body

        // VERIFY: Repository save method called
        verify(photoFavoriteRepository, times(1)).save(any(PhotoFavorite.class));
    }

    /**
     * PFCIT-002: POST /favorite - Already favorited should return 400
     *
     * Note: PhotoFavoriteService throws IllegalStateException when already favorited,
     * which is handled by GlobalExceptionHandler and returns 400 Bad Request.
     */
    @Test
    @Order(2)
    @DisplayName("PFCIT-002: POST /favorite - Already favorited should return 400")
    void testFavoritePhoto_AlreadyFavorited_ShouldReturn400() throws Exception {
        // ARRANGE: Setup authentication
        String token = registerUserAndGetToken("fav2@test.com", "Fav Test User Two");

        // Mock: Photo exists and is public
        when(galleryPhotoRepository.findById(100L))
                .thenReturn(Optional.of(publicPhoto));

        // Mock: User has ALREADY favorited this photo
        when(photoFavoriteRepository.existsByPhotoIdAndUserId(100L, 1L))
                .thenReturn(true); // Already favorited

        // Mock: User repository
        when(userRepository.findById(1L))
                .thenReturn(Optional.of(favoriterUser));

        // ACT & ASSERT: Try to favorite again
        mockMvc.perform(post("/api/gallery/photo/100/favorite")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isBadRequest()) // 400 Bad Request (IllegalStateException)
                .andExpect(jsonPath("$.message").value(containsString("already favorited")));

        // VERIFY: Repository save method NOT called
        verify(photoFavoriteRepository, never()).save(any(PhotoFavorite.class));
    }

    /**
     * PFCIT-003: POST /favorite - Without authentication should return 403
     */
    @Test
    @Order(3)
    @DisplayName("PFCIT-003: POST /favorite - Without authentication should return 403")
    void testFavoritePhoto_WithoutAuth_ShouldReturn403() throws Exception {
        // ACT & ASSERT: Try to favorite without token
        mockMvc.perform(post("/api/gallery/photo/100/favorite"))
                .andDo(print())
                .andExpect(status().isForbidden()); // 403 Forbidden

        // VERIFY: Repository never called
        verify(photoFavoriteRepository, never()).save(any(PhotoFavorite.class));
    }

    // ========================================================================
    // UNFAVORITE PHOTO TESTS
    // ========================================================================

    /**
     * PFCIT-004: DELETE /favorite - Should unfavorite photo successfully
     */
    @Test
    @Order(4)
    @DisplayName("PFCIT-004: DELETE /favorite - Should unfavorite photo successfully (204)")
    void testUnfavoritePhoto_Success_ShouldReturn204() throws Exception {
        // ARRANGE: Setup authentication
        String token = registerUserAndGetToken("fav3@test.com", "Fav Test User Three");

        // Mock: Photo exists
        when(galleryPhotoRepository.existsById(100L))
                .thenReturn(true);

        // Mock: User has favorited this photo
        when(photoFavoriteRepository.existsByPhotoIdAndUserId(100L, 1L))
                .thenReturn(true);

        // Mock: Delete favorite
        doNothing().when(photoFavoriteRepository).deleteByPhotoIdAndUserId(100L, 1L);

        // ACT & ASSERT: Unfavorite the photo
        mockMvc.perform(delete("/api/gallery/photo/100/favorite")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isNoContent()); // 204 No Content

        // VERIFY: Repository delete method called
        verify(photoFavoriteRepository, times(1)).deleteByPhotoIdAndUserId(100L, 1L);
    }

    /**
     * PFCIT-005: DELETE /favorite - Without authentication should return 403
     */
    @Test
    @Order(5)
    @DisplayName("PFCIT-005: DELETE /favorite - Without authentication should return 403")
    void testUnfavoritePhoto_WithoutAuth_ShouldReturn403() throws Exception {
        // ACT & ASSERT: Try to unfavorite without token
        mockMvc.perform(delete("/api/gallery/photo/100/favorite"))
                .andDo(print())
                .andExpect(status().isForbidden()); // 403 Forbidden

        // VERIFY: Repository never called
        verify(photoFavoriteRepository, never()).deleteByPhotoIdAndUserId(anyLong(), anyLong());
    }

    // ========================================================================
    // GET FAVORITED PHOTOS TESTS
    // ========================================================================

    /**
     * PFCIT-006: GET /favorited-photos - Should return paginated favorited photos
     */
    @Test
    @Order(6)
    @DisplayName("PFCIT-006: GET /favorited-photos - Should return paginated favorited photos (200)")
    void testGetFavoritedPhotos_Success_ShouldReturn200() throws Exception {
        // ARRANGE: Setup authentication
        String token = registerUserAndGetToken("fav4@test.com", "Fav Test User Four");

        // Mock: User repository for authentication
        when(userRepository.findById(1L))
                .thenReturn(Optional.of(favoriterUser));

        // Mock: Favorited photos list
        List<GalleryPhoto> photoList = Arrays.asList(
                publicPhoto,
                privatePhoto,
                publicPhoto
        );

        // Mock: findFavoritedPhotosByUserIdNewest returns List (for sortBy="newest")
        when(photoFavoriteRepository.findFavoritedPhotosByUserIdNewest(eq(1L), any(Pageable.class)))
                .thenReturn(photoList);

        // Mock: countFavoritedPhotosByUserId
        when(photoFavoriteRepository.countFavoritedPhotosByUserId(1L))
                .thenReturn(3L);

        // Mock: PhotoLikeService (used in GET endpoint)
        when(photoLikeRepository.countByPhotoId(anyLong()))
                .thenReturn(5L); // 5 likes per photo
        when(photoLikeRepository.existsByPhotoIdAndUserId(anyLong(), eq(1L)))
                .thenReturn(true); // User has liked all photos

        // ACT & ASSERT: Get favorited photos
        mockMvc.perform(get("/api/gallery/favorited-photos")
                        .header("Authorization", "Bearer " + token)
                        .param("page", "0")
                        .param("size", "12")
                        .param("sortBy", "newest"))
                .andDo(print())
                .andExpect(status().isOk()) // 200 OK
                .andExpect(jsonPath("$.photos").isArray())
                .andExpect(jsonPath("$.photos", hasSize(3)))
                .andExpect(jsonPath("$.photos[0].id").value(100))
                .andExpect(jsonPath("$.currentPage").value(0))
                .andExpect(jsonPath("$.totalPages").value(1))
                .andExpect(jsonPath("$.totalPhotos").value(3))
                .andExpect(jsonPath("$.pageSize").value(12))
                .andExpect(jsonPath("$.hasNext").value(false))
                .andExpect(jsonPath("$.hasPrevious").value(false));

        // VERIFY: Repository method called
        verify(photoFavoriteRepository, times(1)).findFavoritedPhotosByUserIdNewest(eq(1L), any(Pageable.class));
        verify(photoFavoriteRepository, times(1)).countFavoritedPhotosByUserId(1L);
    }

    /**
     * PFCIT-007: GET /favorited-photos - Without authentication should return 403
     */
    @Test
    @Order(7)
    @DisplayName("PFCIT-007: GET /favorited-photos - Without authentication should return 403")
    void testGetFavoritedPhotos_WithoutAuth_ShouldReturn403() throws Exception {
        // ACT & ASSERT: Try to get favorited photos without token
        mockMvc.perform(get("/api/gallery/favorited-photos")
                        .param("page", "0")
                        .param("size", "12"))
                .andDo(print())
                .andExpect(status().isForbidden()); // 403 Forbidden

        // VERIFY: Repository never called
        verify(photoFavoriteRepository, never()).findFavoritedPhotosByUserIdNewest(anyLong(), any());
    }

    // ========================================================================
    // HELPER METHODS FOR ENTITY CREATION
    // ========================================================================

    /**
     * Create mock User for testing
     */
    private User createMockUser(Long userId) {
        User user = new User();
        user.setId(userId);
        user.setEmail("test@example.com");
        user.setFullName("Test User");
        user.setPassword("encodedPassword");
        return user;
    }

    /**
     * Create mock GalleryPhoto for testing
     */
    private GalleryPhoto createMockPhoto(Long id, Long ownerId, boolean isPublic) {
        GalleryPhoto photo = new GalleryPhoto();
        photo.setId(id);
        photo.setUser(createMockUser(ownerId));
        photo.setTitle("Photo " + id);
        photo.setDescription("Description " + id);
        photo.setFilePath("uploads/gallery/user-" + ownerId + "/photo-" + id + ".jpg");
        photo.setIsPublic(isPublic);
        photo.setCreatedAt(LocalDateTime.now());
        photo.setUpdatedAt(LocalDateTime.now());
        return photo;
    }
}
