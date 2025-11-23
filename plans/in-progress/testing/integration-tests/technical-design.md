# Technical Design - Integration Tests

## Overview

Integration tests verify component interaction within Spring container. Following senior's definition: integration tests focus on how Controller, Service, and Repository components work together WITHOUT using real external systems (database).

## Architecture

### Integration Test Pattern

```
┌──────────────────────────────────────────────────────────────┐
│         GalleryControllerIntegrationTest                     │
│  @SpringBootTest (full Spring context)                       │
│  @AutoConfigureMockMvc (MockMvc configured)                  │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│                  Spring Context                              │
│  ├─ GalleryController (REAL)                                 │
│  ├─ GalleryService (REAL)                                    │
│  ├─ FileStorageService (REAL)                                │
│  ├─ SecurityConfig (REAL)                                    │
│  ├─ GlobalExceptionHandler (REAL)                            │
│  └─ JWT Filters (REAL)                                       │
└──────────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────────┐
│              @MockBean Repositories                          │
│  ├─ GalleryPhotoRepository (MOCKED)                          │
│  └─ UserRepository (MOCKED)                                  │
└──────────────────────────────────────────────────────────────┘
```

### Why @MockBean?

**Per Senior's Advice:**
- Integration test = Test component interaction (NOT external systems)
- Database = External system
- Therefore: Mock repositories, test component wiring

**What's REAL in Integration Test:**
- ✅ Spring Context
- ✅ Controller layer
- ✅ Service layer
- ✅ Spring Security filters
- ✅ Exception handling

**What's MOCKED:**
- ❌ Repositories (database layer)
- ❌ External APIs
- ❌ File system (if needed)

## Implementation Details

### Test Class Setup

```java
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)  // Disable security for simpler testing
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class GalleryControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private GalleryPhotoRepository galleryPhotoRepository;

    @MockBean
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        reset(galleryPhotoRepository);
        reset(userRepository);
    }
}
```

### Mock Repository Setup Pattern

```java
@Test
@DisplayName("POST /api/gallery/upload - Should upload successfully")
void testUploadPhoto_Success() throws Exception {
    // ARRANGE: Mock User exists
    User mockUser = new User();
    mockUser.setId(10L);
    mockUser.setEmail("test@example.com");
    when(userRepository.findByEmail("test@example.com"))
        .thenReturn(Optional.of(mockUser));

    // Mock GalleryPhoto save
    GalleryPhoto mockPhoto = new GalleryPhoto();
    mockPhoto.setId(1L);
    mockPhoto.setUserId(10L);
    when(galleryPhotoRepository.save(any(GalleryPhoto.class)))
        .thenReturn(mockPhoto);

    // ACT: Upload photo
    MockMultipartFile file = new MockMultipartFile(
        "file", "test.jpg", "image/jpeg", "content".getBytes()
    );

    mockMvc.perform(multipart("/api/gallery/upload")
            .file(file)
            .param("title", "Test Photo")
            .with(authentication(mockAuth())))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1));

    // VERIFY: Repository was called
    verify(galleryPhotoRepository).save(any(GalleryPhoto.class));
}
```

### Authentication Mocking

```java
private Authentication mockAuth() {
    UserPrincipal userPrincipal = new UserPrincipal(10L, "test@example.com", "Test User");
    return new UsernamePasswordAuthenticationToken(
        userPrincipal, null, Collections.emptyList()
    );
}
```

### Exception Handling Testing

```java
@Test
@DisplayName("GET /api/gallery/photo/{id} - Should return 404 when not found")
void testGetPhoto_NotFound() throws Exception {
    // Mock repository returns empty (photo not found)
    when(galleryPhotoRepository.findById(999L))
        .thenReturn(Optional.empty());

    // GlobalExceptionHandler will convert to 404
    mockMvc.perform(get("/api/gallery/photo/999")
            .with(authentication(mockAuth())))
        .andExpect(status().isNotFound());
}
```

## Test Coverage Matrix

| Endpoint | HTTP Method | Test Count | Key Tests |
|----------|-------------|------------|-----------|
| `/api/gallery/upload` | POST | 3 | Valid upload, invalid file, no auth |
| `/api/gallery/my-photos` | GET | 2 | With photos, empty gallery |
| `/api/gallery/public` | GET | 2 | With photos, no photos |
| `/api/gallery/user/{userId}/public` | GET | 2 | Valid user, no photos |
| `/api/gallery/photo/{photoId}` | GET | 4 | Public photo, private (owner), private (non-owner), not found |
| `/api/gallery/photo/{photoId}` | PUT | 3 | Update by owner, by non-owner, not found |
| `/api/gallery/photo/{photoId}` | DELETE | 2 | Delete by owner, by non-owner |
| `/api/gallery/photo/{photoId}/toggle-privacy` | PUT | 2 | Toggle success, unauthorized |

**Total:** 18-20 integration tests

## Key Differences: Integration vs Unit vs API Tests

### Unit Test (GalleryControllerTest)
- @WebMvcTest (controller only)
- @MockBean GalleryService
- NO Spring context (minimal web context)
- Fast (<5 seconds)

### Integration Test (GalleryControllerIntegrationTest)
- @SpringBootTest (full Spring context)
- @MockBean Repositories
- Spring Security REAL, Service REAL
- Medium speed (<60 seconds)

### API Test (GalleryAPITest)
- Real HTTP server (mvn spring-boot:run)
- REST Assured
- Real PostgreSQL database
- Slow (2-5 minutes)

## Success Criteria

**Technical:**
- ✅ Spring context loads without errors
- ✅ All @MockBean dependencies inject correctly
- ✅ MockMvc performs HTTP requests successfully
- ✅ Repository verify() statements pass
- ✅ Exception handling works (GlobalExceptionHandler)

**Functional:**
- ✅ 18-20 tests pass (100%)
- ✅ All 8 endpoints covered
- ✅ Authentication and authorization tested
- ✅ HTTP status codes correct

## Reference Implementation

**Existing Integration Test:**
- `AuthControllerIntegrationTest.java` - 12 tests
- `UserControllerIntegrationTest.java` - 17 tests
- `UserProfileControllerIntegrationTest.java` - 11 tests

**Pattern to Follow:**
```java
// Setup
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class XxxControllerIntegrationTest {
    @Autowired MockMvc mockMvc;
    @MockBean XxxRepository repository;

    // Tests
    @Test
    void test() throws Exception {
        when(repository.method()).thenReturn(data);
        mockMvc.perform(...)
            .andExpect(status().isOk());
        verify(repository).method();
    }
}
```
