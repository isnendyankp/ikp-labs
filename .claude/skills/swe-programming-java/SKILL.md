# Skill: Java Programming Standards

**Category**: Software Engineering
**Purpose**: Java 17 + Spring Boot 3.2 coding standards for IKP-Labs
**Used By**: swe-java-dev, swe-code-checker

---

## Naming Conventions

| Context | Convention | Example |
|---------|-----------|---------|
| Classes / Interfaces | PascalCase | `PhotoService`, `GalleryRepository` |
| Methods / variables | camelCase | `findPhotoById()`, `totalCount` |
| Constants | UPPER\_SNAKE\_CASE | `MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE` |
| Packages | lowercase.dots | `com.ikplabs.gallery.service` |
| Test classes | Suffix `Test` | `PhotoServiceTest` |

---

## Java 17 Features

Use modern Java features:

```java
// Records for immutable data
public record PhotoDto(String id, String title, String url) {}

// Sealed classes for domain types
public sealed interface PhotoResult
    permits PhotoResult.Success, PhotoResult.NotFound {}

// Pattern matching
if (result instanceof PhotoResult.Success s) {
    return s.photo();
}

// Text blocks for SQL/JSON
String query = """
    SELECT * FROM photos
    WHERE album_id = ?
    ORDER BY created_at DESC
    """;
```

---

## Spring Boot 3.2 Patterns

### REST Controller

```java
@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    @GetMapping("/{id}")
    public ResponseEntity<PhotoDto> getPhoto(@PathVariable String id) {
        return photoService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PhotoDto> createPhoto(
        @Valid @RequestBody CreatePhotoRequest request
    ) {
        PhotoDto photo = photoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(photo);
    }
}
```

### Service Layer

```java
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PhotoService {

    private final PhotoRepository photoRepository;

    public Optional<PhotoDto> findById(String id) {
        return photoRepository.findById(id)
            .map(PhotoMapper::toDto);
    }

    @Transactional
    public PhotoDto create(CreatePhotoRequest request) {
        Photo photo = PhotoMapper.fromRequest(request);
        return PhotoMapper.toDto(photoRepository.save(photo));
    }
}
```

### Repository

```java
@Repository
public interface PhotoRepository extends JpaRepository<Photo, String> {

    List<Photo> findByAlbumIdOrderByCreatedAtDesc(String albumId);

    @Query("SELECT p FROM Photo p WHERE p.userId = :userId AND p.liked = true")
    Page<Photo> findLikedByUser(@Param("userId") String userId, Pageable pageable);
}
```

### Entity

```java
@Entity
@Table(name = "photos")
@Getter
@Setter
@NoArgsConstructor
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String url;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

---

## Dependency Injection

Always use **constructor injection** (not field injection):

```java
// ✅ Good — constructor injection
@Service
@RequiredArgsConstructor
public class GalleryService {
    private final PhotoRepository photoRepository;
    private final UserService userService;
}

// ❌ Bad — field injection (hard to test)
@Service
public class GalleryService {
    @Autowired
    private PhotoRepository photoRepository;
}
```

---

## Error Handling

Use `@ControllerAdvice` for global error handling:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
        MethodArgumentNotValidException ex
    ) {
        String message = ex.getBindingResult().getFieldErrors()
            .stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(new ErrorResponse(message));
    }
}
```

---

## Testing Standards (JUnit 5 + Mockito + H2)

### Unit Test

```java
@ExtendWith(MockitoExtension.class)
class PhotoServiceTest {

    @Mock
    private PhotoRepository photoRepository;

    @InjectMocks
    private PhotoService photoService;

    @Test
    void shouldReturnPhotoWhenFoundById() {
        // Given
        Photo photo = new Photo();
        photo.setId("123");
        photo.setTitle("Sunset");
        when(photoRepository.findById("123")).thenReturn(Optional.of(photo));

        // When
        Optional<PhotoDto> result = photoService.findById("123");

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().title()).isEqualTo("Sunset");
    }
}
```

### Integration Test (H2 in-memory DB)

```java
@SpringBootTest
@AutoConfigureMockMvc
class PhotoControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnPhotoListForAlbum() throws Exception {
        mockMvc.perform(get("/api/albums/1/photos"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }
}
```

### Test Coverage

- Minimum: **80% line coverage**
- Run: `npx nx test kameravue-be`
- H2 config in `src/test/resources/application-test.yml`

---

## Validation

Use Bean Validation annotations:

```java
public record CreatePhotoRequest(
    @NotBlank(message = "Title is required")
    @Size(max = 255)
    String title,

    @NotBlank
    @Pattern(regexp = "^https?://.*", message = "Must be a valid URL")
    String url
) {}
```

---

## IKP-Labs Project Paths

```text
apps/kameravue-be/
├── src/main/java/com/ikplabs/
│   ├── controller/     — REST controllers
│   ├── service/        — business logic
│   ├── repository/     — Spring Data JPA repos
│   ├── entity/         — JPA entities
│   ├── dto/            — request/response DTOs
│   └── exception/      — custom exceptions
└── src/test/java/com/ikplabs/
    └── **/*Test.java   — unit and integration tests
```

---

## Anti-Patterns to Avoid

- ❌ Field injection with `@Autowired`
- ❌ Business logic in controllers
- ❌ Entities returned directly from controllers (use DTOs)
- ❌ `@Transactional` on repository methods (service layer only)
- ❌ Catching and swallowing exceptions silently
