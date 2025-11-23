# Technical Design - Unit Tests Completion

## Overview

This document outlines the technical approach for completing unit test coverage for the Gallery Photo feature. We will create two test classes following established patterns:

1. **GalleryControllerTest** - Controller unit test with mocked service
2. **GalleryPhotoRepositoryTest** - Repository test with Testcontainers PostgreSQL

## Architecture

### Gallery Testing Layers

```
┌────────────────────────────────────────────────────────────┐
│                  GalleryControllerTest                     │
│  - @WebMvcTest (controller isolation)                      │
│  - @MockBean GalleryService                                │
│  - MockMvc for HTTP simulation                             │
│  - NO real service, NO real database                       │
│  - Tests: Request → Controller → Service (mocked)          │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│              GalleryService (Already Tested)               │
│  - GalleryServiceTest with 18 tests ✅                     │
│  - Mocks: GalleryPhotoRepository, FileStorageService       │
│  - Business logic validated                                │
└────────────────────────────────────────────────────────────┘
                            ↓
┌────────────────────────────────────────────────────────────┐
│              GalleryPhotoRepositoryTest                    │
│  - @DataJpaTest (repository isolation)                     │
│  - PostgreSQL Testcontainers (singleton)                   │
│  - Real database, real SQL queries                         │
│  - Tests: Repository → Database                            │
└────────────────────────────────────────────────────────────┘
```

### Test Isolation Strategy

```
GalleryControllerTest (Unit Test)
├── Mock: GalleryService (entire service layer)
├── Real: GalleryController (class under test)
├── Test Focus: HTTP layer, request/response mapping
└── No Database: Service is mocked

GalleryPhotoRepositoryTest (Repository Test)
├── Real: GalleryPhotoRepository (class under test)
├── Real: PostgreSQL database via Testcontainers
├── Test Focus: SQL queries, database operations
└── No Service Layer: Repository tested in isolation
```

## Implementation Details

### 1. GalleryControllerTest

#### Test Pattern: @WebMvcTest with MockBean

**Annotation Setup:**
```java
@WebMvcTest(GalleryController.class)
@Import(SecurityConfig.class) // Import security if needed
class GalleryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private GalleryService galleryService; // Mock the service layer

    @BeforeEach
    void setUp() {
        reset(galleryService); // Reset mock before each test
    }
}
```

**Why @WebMvcTest?**
- Loads only web layer (Controller, filters, advice)
- Does NOT load Service, Repository, or Database components
- Faster than @SpringBootTest (only web context)
- Perfect for testing controller in isolation

**Why @MockBean?**
- Replaces real GalleryService with a Mockito mock
- Allows us to control service behavior with `when().thenReturn()`
- Allows us to verify service method calls with `verify()`

#### HTTP Request Simulation with MockMvc

**Example Test:**
```java
@Test
@DisplayName("POST /api/gallery/upload - Should upload photo successfully")
void testUploadPhoto_Success() throws Exception {
    // ARRANGE: Prepare test data
    MockMultipartFile file = new MockMultipartFile(
        "file",
        "test-photo.jpg",
        "image/jpeg",
        "fake image content".getBytes()
    );

    GalleryPhoto mockPhoto = new GalleryPhoto();
    mockPhoto.setId(1L);
    mockPhoto.setUserId(10L);
    mockPhoto.setFilePath("gallery/user-10/photo-1-123456.jpg");

    // Mock service behavior
    when(galleryService.uploadPhoto(any(), eq(10L), any(), any(), any()))
        .thenReturn(mockPhoto);

    // ACT & ASSERT: Send HTTP request
    mockMvc.perform(multipart("/api/gallery/upload")
            .file(file)
            .param("title", "Test Photo")
            .param("description", "Test description")
            .param("isPublic", "false")
            .with(authentication(mockAuth())) // Mock JWT auth
        )
        .andExpect(status().isCreated()) // Verify HTTP 201
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.filePath").exists());

    // VERIFY: Service method was called
    verify(galleryService).uploadPhoto(any(), eq(10L), eq("Test Photo"), eq("Test description"), eq(false));
}
```

**Key Techniques:**
- `MockMultipartFile` - Simulates file upload without real files
- `mockMvc.perform()` - Simulates HTTP request
- `when().thenReturn()` - Mock service response
- `verify()` - Ensure service was called with correct parameters
- `jsonPath()` - Verify JSON response structure
- `status()` - Verify HTTP status codes

#### Authentication Mocking

**Pattern for JWT Authentication:**
```java
private Authentication mockAuth() {
    UserPrincipal userPrincipal = new UserPrincipal(10L, "test@example.com", "Test User");
    return new UsernamePasswordAuthenticationToken(
        userPrincipal, null, Collections.emptyList()
    );
}

// Usage in test:
mockMvc.perform(get("/api/gallery/my-photos")
    .with(authentication(mockAuth()))
)
```

**Alternative: @WithMockUser**
```java
@Test
@WithMockUser(username = "test@example.com", roles = {"USER"})
void testGetMyPhotos() throws Exception {
    // Authentication automatically provided
    mockMvc.perform(get("/api/gallery/my-photos"))
        .andExpect(status().isOk());
}
```

#### Exception Testing

**Test Service Throwing Exceptions:**
```java
@Test
@DisplayName("GET /api/gallery/photo/{id} - Should return 404 when photo not found")
void testGetPhoto_NotFound() throws Exception {
    // Mock service to throw exception
    when(galleryService.getPhotoById(eq(999L), any()))
        .thenThrow(new GalleryNotFoundException("Photo not found"));

    // Verify controller handles exception correctly
    mockMvc.perform(get("/api/gallery/photo/999")
            .with(authentication(mockAuth())))
        .andExpect(status().isNotFound()) // Verify HTTP 404
        .andExpect(jsonPath("$.message").value("Photo not found"));
}
```

#### Endpoint Test Coverage Matrix

| Endpoint | HTTP Method | Test Scenarios |
|----------|-------------|----------------|
| `/api/gallery/upload` | POST | ✅ Valid upload<br>✅ Invalid file type<br>✅ File too large<br>✅ No auth |
| `/api/gallery/my-photos` | GET | ✅ With pagination<br>✅ Default params<br>✅ Empty result |
| `/api/gallery/public` | GET | ✅ With pagination<br>✅ Sort order |
| `/api/gallery/user/{userId}/public` | GET | ✅ Valid userId<br>✅ Non-existent user |
| `/api/gallery/photo/{photoId}` | GET | ✅ Public photo<br>✅ Private photo (owner)<br>✅ Private photo (non-owner)<br>✅ Not found |
| `/api/gallery/photo/{photoId}` | PUT | ✅ Update by owner<br>✅ Update by non-owner<br>✅ Partial update |
| `/api/gallery/photo/{photoId}` | DELETE | ✅ Delete by owner<br>✅ Delete by non-owner<br>✅ Not found |
| `/api/gallery/photo/{photoId}/toggle-privacy` | PUT | ✅ Toggle success<br>✅ Unauthorized |

**Total Tests:** 10-15 covering all endpoints and error scenarios

---

### 2. GalleryPhotoRepositoryTest

#### Test Pattern: @DataJpaTest with Testcontainers

**Annotation Setup:**
```java
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Transactional
class GalleryPhotoRepositoryTest extends AbstractIntegrationTest {

    @Autowired
    private GalleryPhotoRepository galleryPhotoRepository;

    @Autowired
    private UserRepository userRepository; // Needed for foreign key

    @Autowired
    private EntityManager entityManager;

    private User testUser;

    @BeforeEach
    void setUp() {
        // Clean database
        galleryPhotoRepository.deleteAll();
        userRepository.deleteAll();
        entityManager.flush();
        entityManager.clear();

        // Create test user (needed for foreign key)
        testUser = new User();
        testUser.setFullName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashedPassword");
        testUser = userRepository.save(testUser);
        entityManager.flush();
        entityManager.clear();
    }
}
```

**Why @DataJpaTest?**
- Loads only JPA components (Repositories, Entities, EntityManager)
- Does NOT load web layer (Controllers, filters)
- Configures H2 by default (we override with Testcontainers PostgreSQL)
- Auto-rollback after each test with @Transactional

**Why extend AbstractIntegrationTest?**
- Provides singleton Testcontainers PostgreSQL instance
- Shared container across all repository tests (faster)
- Real PostgreSQL database (production-like testing)

**Why @AutoConfigureTestDatabase(replace = NONE)?**
- Prevents Spring from replacing our Testcontainers database with H2
- Uses the PostgreSQL container configured in AbstractIntegrationTest

#### Testcontainers Singleton Pattern

**AbstractIntegrationTest (Already Exists):**
```java
@Testcontainers
public abstract class AbstractIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
}
```

**Benefits:**
- Container starts ONCE for all tests (faster execution)
- Shared across multiple test classes
- Automatic cleanup after test suite
- Real PostgreSQL (not H2 - production-like)

#### Database Test Patterns

**Pattern 1: Save and Verify**
```java
@Test
@DisplayName("save() - Should persist new gallery photo with auto-generated ID")
void testSave_NewPhoto() {
    // ARRANGE: Create new photo
    GalleryPhoto photo = new GalleryPhoto();
    photo.setUserId(testUser.getId());
    photo.setFilePath("gallery/user-1/photo-123.jpg");
    photo.setTitle("Test Photo");
    photo.setDescription("Test description");
    photo.setIsPublic(false);

    // ACT: Save to database
    GalleryPhoto saved = galleryPhotoRepository.save(photo);
    entityManager.flush(); // Force SQL execution
    entityManager.clear(); // Clear L1 cache

    // ASSERT: Verify saved
    assertNotNull(saved.getId()); // Auto-generated ID
    assertNotNull(saved.getCreatedAt()); // Auto-generated timestamp
    assertNotNull(saved.getUpdatedAt());

    // Verify can be retrieved from database
    Optional<GalleryPhoto> retrieved = galleryPhotoRepository.findById(saved.getId());
    assertTrue(retrieved.isPresent());
    assertEquals("Test Photo", retrieved.get().getTitle());
}
```

**Pattern 2: Query and Verify**
```java
@Test
@DisplayName("findByUserId() - Should return all photos for specific user")
void testFindByUserId() {
    // ARRANGE: Create 3 photos for testUser
    GalleryPhoto photo1 = createPhoto(testUser.getId(), "photo1.jpg", true);
    GalleryPhoto photo2 = createPhoto(testUser.getId(), "photo2.jpg", false);
    GalleryPhoto photo3 = createPhoto(testUser.getId(), "photo3.jpg", true);

    // Create 2 photos for another user
    User anotherUser = createUser("another@example.com");
    createPhoto(anotherUser.getId(), "photo4.jpg", true);
    createPhoto(anotherUser.getId(), "photo5.jpg", true);

    entityManager.flush();
    entityManager.clear();

    // ACT: Find photos by testUser.getId()
    List<GalleryPhoto> userPhotos = galleryPhotoRepository.findByUserId(testUser.getId());

    // ASSERT: Should return only 3 photos (testUser's photos)
    assertEquals(3, userPhotos.size());
    assertTrue(userPhotos.stream().allMatch(p -> p.getUserId().equals(testUser.getId())));
}
```

**Pattern 3: Cascade Delete**
```java
@Test
@DisplayName("Cascade Delete - When user deleted, gallery photos should also be deleted")
void testCascadeDelete() {
    // ARRANGE: Create user with 3 photos
    User user = createUser("cascade@example.com");
    createPhoto(user.getId(), "photo1.jpg", true);
    createPhoto(user.getId(), "photo2.jpg", true);
    createPhoto(user.getId(), "photo3.jpg", false);

    entityManager.flush();
    entityManager.clear();

    long photoCountBefore = galleryPhotoRepository.countByUserId(user.getId());
    assertEquals(3, photoCountBefore);

    // ACT: Delete user
    userRepository.deleteById(user.getId());
    entityManager.flush();
    entityManager.clear();

    // ASSERT: User's photos should also be deleted
    long photoCountAfter = galleryPhotoRepository.countByUserId(user.getId());
    assertEquals(0, photoCountAfter); // Cascade delete worked
}
```

#### EntityManager Usage

**Why use EntityManager?**
- `flush()` - Forces immediate SQL execution (don't wait for transaction commit)
- `clear()` - Clears L1 cache (ensures we read from database, not cache)
- Useful for verifying database state in tests

**Common Pattern:**
```java
// Save entity
GalleryPhoto saved = repository.save(photo);
entityManager.flush();  // Execute INSERT immediately
entityManager.clear();  // Clear cache

// Retrieve from DB (not cache)
Optional<GalleryPhoto> retrieved = repository.findById(saved.getId());
```

#### Test Coverage Matrix

| Repository Method | Test Scenarios |
|-------------------|----------------|
| `save()` | ✅ Save new photo<br>✅ Update existing photo<br>✅ Verify auto-generated ID<br>✅ Verify timestamps |
| `findById()` | ✅ Find existing photo<br>✅ Find non-existent photo |
| `findByUserId()` | ✅ Find with multiple photos<br>✅ Find with no photos<br>✅ Verify sorting |
| `findByIsPublicTrue()` | ✅ Find public photos only<br>✅ Exclude private photos |
| `findByUserIdAndIsPublicTrue()` | ✅ Find user's public photos<br>✅ Exclude private photos |
| `delete()` | ✅ Delete existing photo<br>✅ Verify removed from DB |
| `existsById()` | ✅ Photo exists<br>✅ Photo doesn't exist |
| `count()` / `countByUserId()` | ✅ Count all photos<br>✅ Count user's photos<br>✅ Count when empty |
| Cascade Delete | ✅ Delete user deletes photos |

**Total Tests:** 10-12 covering all repository methods

---

## Test Execution Strategy

### Running Tests Individually

```bash
# Run GalleryControllerTest only
mvn test -Dtest=GalleryControllerTest

# Run GalleryPhotoRepositoryTest only
mvn test -Dtest=GalleryPhotoRepositoryTest

# Run both Gallery tests
mvn test -Dtest=Gallery*Test
```

### Running with Coverage

```bash
# Run tests with JaCoCo coverage
mvn clean test jacoco:report

# View coverage report
open target/site/jacoco/index.html
```

### Expected Execution Time

- GalleryControllerTest: ~5-10 seconds (no database)
- GalleryPhotoRepositoryTest: ~10-20 seconds (Testcontainers startup)
- **Total: ~15-30 seconds**

---

## Code Quality Standards

### 1. AAA Pattern (Arrange-Act-Assert)

**All tests must follow this pattern:**
```java
@Test
void testSomething() {
    // ARRANGE: Set up test data and mocks
    GalleryPhoto photo = new GalleryPhoto();
    when(service.method()).thenReturn(photo);

    // ACT: Execute the method under test
    ResponseEntity<GalleryPhotoResponse> response = controller.uploadPhoto(...);

    // ASSERT: Verify the results
    assertEquals(HttpStatus.CREATED, response.getStatusCode());
    verify(service).method();
}
```

### 2. Comprehensive Javadoc

**Every test method must have Javadoc:**
```java
/**
 * Test: Upload photo dengan valid file dan metadata harus return 201 Created.
 *
 * Scenario:
 * 1. User upload JPEG file dengan title dan description
 * 2. Service.uploadPhoto() dipanggil dengan parameter correct
 * 3. Response HTTP 201 Created
 * 4. Response body berisi photo ID dan filePath
 *
 * Verification:
 * - verify() service method dipanggil
 * - HTTP status = 201
 * - JSON response valid
 */
@Test
@DisplayName("POST /api/gallery/upload - Should upload photo successfully")
void testUploadPhoto_Success() throws Exception {
    // Test implementation
}
```

### 3. Test Naming Convention

**Format:** `test[MethodName]_[Scenario]_[ExpectedResult]()`

**Examples:**
- `testUploadPhoto_ValidFile_ShouldReturn201()`
- `testUploadPhoto_InvalidFileType_ShouldReturn400()`
- `testFindByUserId_WithMultiplePhotos_ShouldReturnAllPhotos()`
- `testDelete_NonExistentPhoto_ShouldThrowException()`

### 4. Mock Verification

**Always verify service interactions in controller tests:**
```java
// Verify service method was called
verify(galleryService).uploadPhoto(any(), eq(10L), any(), any(), any());

// Verify service method was NOT called
verify(galleryService, never()).deletePhoto(any(), any());

// Verify service method called exactly once
verify(galleryService, times(1)).getPhotoById(eq(123L), any());
```

### 5. Test Isolation

**Each test must be independent:**
- Use `@BeforeEach` to reset state
- Use `@Transactional` for auto-rollback (repository tests)
- Use `reset(mock)` to reset mocks (controller tests)
- Don't rely on test execution order

---

## Dependencies and Tools

### Required Dependencies (Already in pom.xml)

```xml
<!-- JUnit 5 -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>

<!-- Mockito -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <scope>test</scope>
</dependency>

<!-- Spring Boot Test (includes MockMvc) -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- Testcontainers PostgreSQL -->
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <scope>test</scope>
</dependency>

<!-- AssertJ (fluent assertions) -->
<dependency>
    <groupId>org.assertj</groupId>
    <artifactId>assertj-core</artifactId>
    <scope>test</scope>
</dependency>
```

### Tools Used

- **JUnit 5** - Test framework
- **Mockito** - Mocking framework
- **MockMvc** - HTTP request simulation
- **Testcontainers** - Docker containers for testing
- **AssertJ** - Fluent assertions
- **JaCoCo** - Code coverage

---

## Reference Implementation

### Existing Tests to Follow

**For GalleryControllerTest, reference:**
- `UserControllerTest.java` - Controller test pattern
- `ProfileControllerTest.java` - File upload test pattern
- Pattern: @WebMvcTest + @MockBean + MockMvc

**For GalleryPhotoRepositoryTest, reference:**
- `UserRepositoryTest.java` - Repository test pattern
- Pattern: @DataJpaTest + Testcontainers + EntityManager

**Location:**
```
backend/registration-form-api/src/test/java/com/registrationform/api/
├── controller/
│   ├── UserControllerTest.java (Reference for GalleryControllerTest)
│   └── ProfileControllerTest.java (File upload reference)
└── repository/
    └── UserRepositoryTest.java (Reference for GalleryPhotoRepositoryTest)
```

---

## Success Criteria

**GalleryControllerTest:**
- ✅ 10-15 tests covering all 8 endpoints
- ✅ All tests pass (100% pass rate)
- ✅ Service methods verified with `verify()`
- ✅ HTTP status codes verified
- ✅ JSON response structure verified
- ✅ Exception handling tested
- ✅ Code coverage >85% for GalleryController

**GalleryPhotoRepositoryTest:**
- ✅ 10-12 tests covering all repository methods
- ✅ All tests pass (100% pass rate)
- ✅ Uses Testcontainers PostgreSQL
- ✅ Database operations verified
- ✅ Cascade delete tested
- ✅ Foreign key constraints verified
- ✅ Code coverage >90% for GalleryPhotoRepository

**General:**
- ✅ All tests follow AAA pattern
- ✅ Comprehensive Javadoc comments
- ✅ Test naming convention followed
- ✅ Tests can run independently
- ✅ Execution time <30 seconds total
