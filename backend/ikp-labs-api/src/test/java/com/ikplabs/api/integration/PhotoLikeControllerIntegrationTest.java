package com.ikplabs.api.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ikplabs.api.dto.UserRegistrationRequest;
import com.ikplabs.api.entity.GalleryPhoto;
import com.ikplabs.api.entity.PhotoLike;
import com.ikplabs.api.entity.User;
import com.ikplabs.api.repository.GalleryPhotoRepository;
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
 * Integration Tests untuk PhotoLikeController
 *
 * DEFINISI INTEGRATION TEST:
 * ==========================
 * Integration test = Test INTERAKSI antar component dalam Spring Container
 * - Test Controller ↔ Service ↔ Security integration
 * - Mock database layer (PhotoLikeRepository, GalleryPhotoRepository, UserRepository)
 * - Real JWT authentication filter (Spring Security)
 * - Real PhotoLikeService (business logic)
 * - Focus pada HTTP layer dan authorization
 *
 * Test Setup:
 * - @SpringBootTest - Load full Spring context
 * - @AutoConfigureMockMvc - Enable MockMvc with security filters
 * - @MockBean repositories - Mock database operations
 * - MockMvc - Simulate HTTP requests
 * - Real JWT authentication - Test security integration
 *
 * Test Coverage (6 tests):
 * 1. POST /api/gallery/photo/{id}/like
 *    - Like photo successfully (201)
 *    - Without authentication (403)
 *
 * 2. DELETE /api/gallery/photo/{id}/like
 *    - Unlike photo successfully (204)
 *    - Without authentication (403)
 *
 * 3. GET /api/gallery/liked-photos
 *    - Get liked photos with pagination (200)
 *    - Without authentication (403)
 *
 * Test Strategy:
 * - Mock user registration → Generate JWT token
 * - Mock repository responses untuk photo operations
 * - Test HTTP status codes (201, 204, 200, 403)
 * - Test request/response payloads
 * - Verify service layer integration
 * - Test authorization (with/without token)
 *
 * @author Registration Form Team
 */
@SuppressWarnings({"null", "unchecked", "unused"})
@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("PhotoLikeController Integration Tests")
public class PhotoLikeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PhotoLikeRepository photoLikeRepository;

    @MockBean
    private GalleryPhotoRepository galleryPhotoRepository;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private com.ikplabs.api.security.JwtUtil jwtUtil;

    // Test data
    private User likerUser;
    private User photoOwner;
    private GalleryPhoto publicPhoto;

    /**
     * Setup test data sebelum setiap test untuk isolasi
     */
    @BeforeEach
    void setUp() {
        // Reset all mocks
        reset(photoLikeRepository, galleryPhotoRepository, userRepository);

        // Create liker user (ID 1)
        likerUser = new User();
        likerUser.setId(1L);
        likerUser.setEmail("liker@test.com");
        likerUser.setFullName("Photo Liker User");
        likerUser.setPassword("$2a$10$encodedPassword");
        likerUser.setCreatedAt(LocalDateTime.now());
        likerUser.setUpdatedAt(LocalDateTime.now());

        // Create photo owner (ID 2)
        photoOwner = new User();
        photoOwner.setId(2L);
        photoOwner.setEmail("owner@test.com");
        photoOwner.setFullName("Photo Owner User");
        photoOwner.setPassword("$2a$10$encodedPassword");
        photoOwner.setCreatedAt(LocalDateTime.now());
        photoOwner.setUpdatedAt(LocalDateTime.now());

        // Create public photo owned by user 2
        publicPhoto = new GalleryPhoto();
        publicPhoto.setId(100L);
        publicPhoto.setUser(photoOwner);
        publicPhoto.setTitle("Test Public Photo");
        publicPhoto.setDescription("A public photo for like testing");
        publicPhoto.setFilePath("gallery/user-2/photo-100.jpg");
        publicPhoto.setIsPublic(true); // Must be public to be likeable
        publicPhoto.setCreatedAt(LocalDateTime.now());
        publicPhoto.setUpdatedAt(LocalDateTime.now());
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

        // Extract token dari response
        return objectMapper.readTree(responseJson).get("token").asText();
    }

    // ========================================================================
    // LIKE PHOTO TESTS
    // ========================================================================

    /**
     * Test 1: POST /like - Should like photo successfully
     *
     * Scenario:
     * 1. User authenticated dengan JWT token
     * 2. Photo exists and is public
     * 3. User is not the owner
     * 4. Photo not yet liked by user
     * 5. Like operation succeeds
     * 6. Returns 201 CREATED
     *
     * Flow:
     * - Controller receives authenticated request
     * - Service validates photo (exists, public, not owner, not liked)
     * - Repository saves PhotoLike
     * - Returns 201 with success message
     */
    @Test
    @Order(1)
    @DisplayName("PLCIT-001: POST /like - Should like photo successfully")
    void testLikePhoto_Success_ShouldReturn201() throws Exception {
        // ARRANGE: Setup authentication
        String token = registerUserAndGetToken("like1@test.com", "Like Test User One");

        // Mock: Photo exists and is public
        when(galleryPhotoRepository.findById(100L))
                .thenReturn(Optional.of(publicPhoto));

        // Mock: User has not liked this photo yet
        when(photoLikeRepository.existsByPhotoIdAndUserId(100L, 1L))
                .thenReturn(false);

        // Mock: User repository (for getting user entity)
        when(userRepository.findById(1L))
                .thenReturn(Optional.of(likerUser));

        // Mock: Save PhotoLike
        when(photoLikeRepository.save(any(PhotoLike.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // ACT & ASSERT: Like photo
        mockMvc.perform(post("/api/gallery/photo/100/like")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isCreated()); // 201 Created (empty body)

        // VERIFY: Repository interactions
        verify(galleryPhotoRepository).findById(100L);
        verify(photoLikeRepository).existsByPhotoIdAndUserId(100L, 1L);
        verify(userRepository).findById(1L);
        verify(photoLikeRepository).save(any(PhotoLike.class));
    }

    /**
     * Test 2: POST /like - Without authentication should return 403
     *
     * Scenario:
     * 1. Request sent without JWT token
     * 2. Spring Security blocks with 403 Forbidden
     * 3. Controller never reached
     */
    @Test
    @Order(2)
    @DisplayName("PLCIT-002: POST /like - Without authentication should return 403")
    void testLikePhoto_WithoutAuth_ShouldReturn403() throws Exception {
        // ACT & ASSERT: Try to like without token
        mockMvc.perform(post("/api/gallery/photo/100/like"))
                .andDo(print())
                .andExpect(status().isForbidden()); // 403 Forbidden

        // VERIFY: Repository never called (Spring Security blocked request)
        verify(photoLikeRepository, never()).save(any());
    }

    // ========================================================================
    // UNLIKE PHOTO TESTS
    // ========================================================================

    /**
     * Test 3: DELETE /like - Should unlike photo successfully
     *
     * Scenario:
     * 1. User authenticated
     * 2. Photo exists
     * 3. User has liked this photo before
     * 4. Unlike operation succeeds
     * 5. Returns 204 NO CONTENT
     *
     * Flow:
     * - Controller receives authenticated request
     * - Service validates (photo exists, is liked)
     * - Repository deletes PhotoLike
     * - Returns 204 No Content
     */
    @Test
    @Order(3)
    @DisplayName("PLCIT-003: DELETE /like - Should unlike photo successfully")
    void testUnlikePhoto_Success_ShouldReturn204() throws Exception {
        // ARRANGE: Setup authentication
        String token = registerUserAndGetToken("unlike1@test.com", "Unlike Test User One");

        // Mock: Photo exists
        when(galleryPhotoRepository.existsById(100L))
                .thenReturn(true);

        // Mock: User has liked this photo
        when(photoLikeRepository.existsByPhotoIdAndUserId(100L, 1L))
                .thenReturn(true);

        // Mock: Delete PhotoLike
        doNothing().when(photoLikeRepository).deleteByPhotoIdAndUserId(100L, 1L);

        // ACT & ASSERT: Unlike photo
        mockMvc.perform(delete("/api/gallery/photo/100/like")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isNoContent()); // 204 No Content

        // VERIFY: Repository interactions
        verify(galleryPhotoRepository).existsById(100L);
        verify(photoLikeRepository).existsByPhotoIdAndUserId(100L, 1L);
        verify(photoLikeRepository).deleteByPhotoIdAndUserId(100L, 1L);
    }

    /**
     * Test 4: DELETE /like - Without authentication should return 403
     *
     * Scenario:
     * 1. Request sent without JWT token
     * 2. Spring Security blocks with 403 Forbidden
     */
    @Test
    @Order(4)
    @DisplayName("PLCIT-004: DELETE /like - Without authentication should return 403")
    void testUnlikePhoto_WithoutAuth_ShouldReturn403() throws Exception {
        // ACT & ASSERT: Try to unlike without token
        mockMvc.perform(delete("/api/gallery/photo/100/like"))
                .andDo(print())
                .andExpect(status().isForbidden()); // 403 Forbidden

        // VERIFY: Repository never called
        verify(photoLikeRepository, never()).deleteByPhotoIdAndUserId(anyLong(), anyLong());
    }

    // ========================================================================
    // GET LIKED PHOTOS TESTS
    // ========================================================================

    /**
     * Test 5: GET /liked-photos - Should return paginated liked photos
     *
     * Scenario:
     * 1. User authenticated
     * 2. User has liked 3 photos
     * 3. Request page 0 with size 12
     * 4. Returns 200 OK with paginated response
     *
     * Flow:
     * - Controller receives authenticated request
     * - Service queries liked photos for user
     * - Repository returns Page<GalleryPhoto>
     * - Controller converts to GalleryListResponse
     * - Returns 200 with pagination metadata
     */
    @Test
    @Order(5)
    @DisplayName("PLCIT-005: GET /liked-photos - Should return paginated liked photos")
    void testGetLikedPhotos_Success_ShouldReturn200() throws Exception {
        // ARRANGE: Setup authentication
        String token = registerUserAndGetToken("likedphotos@test.com", "Liked Photos User");

        // Create 3 liked photos
        GalleryPhoto photo1 = new GalleryPhoto();
        photo1.setId(101L);
        photo1.setUser(photoOwner);
        photo1.setTitle("Liked Photo 1");
        photo1.setFilePath("gallery/user-2/photo-101.jpg");
        photo1.setIsPublic(true);

        GalleryPhoto photo2 = new GalleryPhoto();
        photo2.setId(102L);
        photo2.setUser(photoOwner);
        photo2.setTitle("Liked Photo 2");
        photo2.setFilePath("gallery/user-2/photo-102.jpg");
        photo2.setIsPublic(true);

        GalleryPhoto photo3 = new GalleryPhoto();
        photo3.setId(103L);
        photo3.setUser(photoOwner);
        photo3.setTitle("Liked Photo 3");
        photo3.setFilePath("gallery/user-2/photo-103.jpg");
        photo3.setIsPublic(true);

        List<GalleryPhoto> likedPhotos = Arrays.asList(photo1, photo2, photo3);

        // Mock: Repository returns Page with 3 photos
        // Note: PageImpl needs Pageable to set correct pageSize (12 requested)
        Pageable pageable = PageRequest.of(0, 12);
        Page<GalleryPhoto> photoPage = new PageImpl<>(likedPhotos, pageable, 3);
        when(photoLikeRepository.findLikedPhotosByUserId(eq(1L), any(Pageable.class)))
                .thenReturn(photoPage);

        // ACT & ASSERT: Get liked photos
        mockMvc.perform(get("/api/gallery/liked-photos")
                        .param("page", "0")
                        .param("size", "12")
                        .header("Authorization", "Bearer " + token))
                .andDo(print())
                .andExpect(status().isOk()) // 200 OK
                .andExpect(jsonPath("$.photos").isArray())
                .andExpect(jsonPath("$.photos", hasSize(3)))
                .andExpect(jsonPath("$.photos[0].id").value(101L))
                .andExpect(jsonPath("$.photos[0].title").value("Liked Photo 1"))
                .andExpect(jsonPath("$.photos[1].id").value(102L))
                .andExpect(jsonPath("$.photos[1].title").value("Liked Photo 2"))
                .andExpect(jsonPath("$.photos[2].id").value(103L))
                .andExpect(jsonPath("$.photos[2].title").value("Liked Photo 3"))
                .andExpect(jsonPath("$.currentPage").value(0))
                .andExpect(jsonPath("$.totalPhotos").value(3))
                .andExpect(jsonPath("$.totalPages").value(1))
                .andExpect(jsonPath("$.pageSize").value(12))
                .andExpect(jsonPath("$.hasNext").value(false))
                .andExpect(jsonPath("$.hasPrevious").value(false));

        // VERIFY: Repository interactions
        verify(photoLikeRepository).findLikedPhotosByUserId(eq(1L), any(Pageable.class));
    }

    /**
     * Test 6: GET /liked-photos - Without authentication should return 403
     *
     * Scenario:
     * 1. Request sent without JWT token
     * 2. Spring Security blocks with 403 Forbidden
     */
    @Test
    @Order(6)
    @DisplayName("PLCIT-006: GET /liked-photos - Without authentication should return 403")
    void testGetLikedPhotos_WithoutAuth_ShouldReturn403() throws Exception {
        // ACT & ASSERT: Try to get liked photos without token
        mockMvc.perform(get("/api/gallery/liked-photos"))
                .andDo(print())
                .andExpect(status().isForbidden()); // 403 Forbidden

        // VERIFY: Repository never called
        verify(photoLikeRepository, never()).findLikedPhotosByUserId(anyLong(), any());
    }

    /**
     * NOTES UNTUK PEMAHAMAN (PEMULA):
     * =================================
     *
     * 1. INTEGRATION TEST vs UNIT TEST:
     *    ==============================
     *    UNIT TEST (PhotoLikeServiceTest):
     *    - Test business logic in isolation
     *    - Mock ALL dependencies (repositories)
     *    - No Spring context
     *    - Focus: Service methods work correctly
     *    - Speed: Very fast (<1s)
     *
     *    INTEGRATION TEST (PhotoLikeControllerIntegrationTest):
     *    - Test component interaction
     *    - Load Spring context (controllers, services, security)
     *    - Mock ONLY database layer (repositories)
     *    - Focus: HTTP layer + Spring Security integration
     *    - Speed: Slower (3-5s due to Spring context)
     *
     * 2. WHAT WE TEST HERE:
     *    ==================
     *    ✅ Controller receives HTTP requests correctly
     *    ✅ JWT authentication works (Spring Security integration)
     *    ✅ Authorization header parsing
     *    ✅ Controller → Service method calls
     *    ✅ Service → Repository method calls
     *    ✅ HTTP status codes (201, 204, 200, 403)
     *    ✅ Response JSON structure
     *    ✅ Error handling at HTTP layer
     *
     *    ❌ NOT tested here (covered in other test types):
     *    - Business logic validation → Unit Test
     *    - Database operations → API Test
     *    - Frontend interaction → E2E Test
     *
     * 3. MOCK STRATEGY:
     *    ==============
     *    @MockBean - Spring replaces real bean dengan mock
     *    - PhotoLikeRepository → Mock database operations
     *    - GalleryPhotoRepository → Mock photo queries
     *    - UserRepository → Mock user queries
     *
     *    Real (NOT mocked):
     *    - PhotoLikeController → Test target
     *    - PhotoLikeService → Real business logic
     *    - Spring Security filters → Real JWT validation
     *    - JwtUtil → Real token generation/validation
     *
     * 4. AUTHENTICATION FLOW:
     *    ====================
     *    registerUserAndGetToken() helper:
     *    1. Mock user registration
     *    2. POST /api/auth/register
     *    3. Extract JWT token from response
     *    4. Use token in Authorization header
     *    5. Spring Security validates token
     *    6. Controller receives UserPrincipal
     *
     * 5. TEST COVERAGE (6 tests):
     *    ========================
     *    PLCIT-001: Like photo successfully (201) ✅
     *    PLCIT-002: Like without auth (403) ✅
     *    PLCIT-003: Unlike photo successfully (204) ✅
     *    PLCIT-004: Unlike without auth (403) ✅
     *    PLCIT-005: Get liked photos (200 with pagination) ✅
     *    PLCIT-006: Get liked photos without auth (403) ✅
     *
     * 6. HTTP STATUS CODES:
     *    ==================
     *    - 201 Created: Like successful
     *    - 204 No Content: Unlike successful (no response body)
     *    - 200 OK: Get liked photos successful
     *    - 403 Forbidden: No JWT token or invalid token
     *    - 400 Bad Request: Business logic errors (tested in unit tests)
     *    - 404 Not Found: Photo not exists (tested in API tests)
     *
     * 7. VERIFY() USAGE:
     *    ===============
     *    verify(repository).method() - Pastikan method dipanggil
     *    verify(repository, never()).method() - Pastikan TIDAK dipanggil
     *    verify(repository, times(2)).method() - Dipanggil 2x
     *
     *    Examples:
     *    - verify(photoLikeRepository).save(any()) → Pastikan like disimpan
     *    - verify(photoLikeRepository, never()).save(any()) → Tidak ada save saat 403
     *
     * 8. WHEN() MOCKING:
     *    ===============
     *    when(method()).thenReturn(value) - Setup mock behavior
     *
     *    Examples:
     *    when(galleryPhotoRepository.findById(100L))
     *        .thenReturn(Optional.of(publicPhoto));
     *    → Kalau findById(100L) dipanggil, return publicPhoto
     *
     *    when(photoLikeRepository.existsByPhotoIdAndUserId(100L, 1L))
     *        .thenReturn(false);
     *    → User belum like foto ini
     *
     * 9. JSONPATH ASSERTIONS:
     *    ====================
     *    jsonPath() - Parse JSON response dan assert value
     *
     *    Examples:
     *    .andExpect(jsonPath("$.photos").isArray())
     *    → Response punya array "photos"
     *
     *    .andExpect(jsonPath("$.photos", hasSize(3)))
     *    → Array photos punya 3 items
     *
     *    .andExpect(jsonPath("$.photos[0].id").value(101L))
     *    → Photo pertama punya ID 101
     *
     *    .andExpect(jsonPath("$.currentPage").value(0))
     *    → Current page = 0
     *
     * 10. TYPICAL INTEGRATION TEST FLOW:
     *     ==============================
     *     1. Setup (@BeforeEach): Create test data
     *     2. Arrange: Mock repository behavior
     *     3. Act: Make HTTP request via MockMvc
     *     4. Assert: Check HTTP status + response JSON
     *     5. Verify: Check repository method calls
     *
     *     Example:
     *     // ARRANGE
     *     when(repo.findById(100L)).thenReturn(Optional.of(photo));
     *
     *     // ACT
     *     mockMvc.perform(post("/api/gallery/photo/100/like")
     *         .header("Authorization", "Bearer " + token))
     *
     *     // ASSERT
     *     .andExpect(status().isCreated())
     *     .andExpect(jsonPath("$.message").exists());
     *
     *     // VERIFY
     *     verify(repo).save(any());
     *
     * 11. WHY INTEGRATION TESTS MATTER:
     *     ==============================
     *     - Unit tests OK, tapi controller broken? Integration test catch it!
     *     - JWT authentication broken? Integration test catch it!
     *     - Wrong HTTP status code? Integration test catch it!
     *     - Wrong JSON structure? Integration test catch it!
     *     - Authorization logic broken? Integration test catch it!
     *
     *     Analogi:
     *     - Unit Test: Tes mesin mobil di bengkel
     *     - Integration Test: Tes mesin mobil + transmisi + roda (semua nyambung)
     *     - API Test: Tes mobil jalan di jalan raya pakai bensin asli
     *     - E2E Test: Tes mobil jalan + sopir + penumpang + GPS
     *
     * 12. TEST EXECUTION:
     *     ===============
     *     Run with:
     *     mvn test -Dtest=PhotoLikeControllerIntegrationTest
     *
     *     Expected output:
     *     Tests run: 6, Failures: 0, Errors: 0, Skipped: 0
     *     Time elapsed: ~3-5s (due to Spring context loading)
     *
     * 13. TEST ISOLATION:
     *     ===============
     *     - @BeforeEach runs before EACH test
     *     - reset(mocks) clears mock state
     *     - Each test independent (no side effects)
     *     - Tests can run in any order (@Order for readability only)
     *
     * 14. NEXT STEPS AFTER THESE TESTS:
     *     ==============================
     *     After integration tests pass:
     *     - Day 4: Frontend (LikeButton component + LikedPhotosPage)
     *     - Day 5: E2E tests (full user flow with Playwright)
     *     - Day 5: Documentation + LinkedIn post
     *
     *     Total test count so far:
     *     - 8 API tests (Day 2) ✅
     *     - 8 Unit tests (Day 3 morning) ✅
     *     - 6 Integration tests (Day 3 afternoon) ✅
     *     = 22 tests total!
     */
}
