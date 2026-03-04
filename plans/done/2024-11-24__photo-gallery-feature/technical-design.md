# Photo Gallery Feature - Technical Design

**Status:** COMPLETED
**Last Updated:** November 24, 2024

---

## Overview

This document provides technical implementation details for the Photo Gallery feature with privacy control.

**Back to:** [Main README](README.md) | **See also:** [Requirements](requirements.md) | [Checklist](checklist.md)

---

## Architecture Overview

### Layer Structure

```
┌─────────────────────────────────────────────┐
│                 FRONTEND                     │
│  (Next.js + React + TypeScript)             │
├─────────────────────────────────────────────┤
│  Pages: /gallery, /gallery/upload,          │
│         /gallery/[id]                        │
│  Components: PhotoGrid, PhotoCard,           │
│              PhotoUploadForm, Pagination      │
│  Services: galleryService.ts                 │
└─────────────────────────────────────────────┘
                    │ HTTP/REST
                    ▼
┌─────────────────────────────────────────────┐
│                 BACKEND                      │
│  (Spring Boot + Java)                        │
├─────────────────────────────────────────────┤
│  Controller: GalleryController               │
│  Service: GalleryService                     │
│  Repository: GalleryPhotoRepository          │
│  Storage: FileStorageService                 │
│  Security: JwtAuthenticationFilter           │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│               DATABASE                       │
│  (PostgreSQL)                                │
│  Table: gallery_photos                       │
└─────────────────────────────────────────────┘
```

---

## Backend Implementation

### Database Migration

**File:** `V2__create_gallery_photos_table.sql`

```sql
CREATE TABLE gallery_photos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gallery_photos_user_id ON gallery_photos(user_id);
CREATE INDEX idx_gallery_photos_is_public ON gallery_photos(is_public);
CREATE INDEX idx_gallery_photos_created_at ON gallery_photos(created_at DESC);
```

---

### Entity Layer

**File:** `GalleryPhoto.java`

```java
@Entity
@Table(name = "gallery_photos")
public class GalleryPhoto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "file_type", nullable = false)
    private String fileType;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "is_public", nullable = false)
    private Boolean isPublic = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

---

### Repository Layer

**File:** `GalleryPhotoRepository.java`

```java
public interface GalleryPhotoRepository extends JpaRepository<GalleryPhoto, Long> {

    // Find all photos by user (for My Photos)
    Page<GalleryPhoto> findByUserId(Long userId, Pageable pageable);

    // Find all public photos (for Public Gallery)
    Page<GalleryPhoto> findByIsPublicTrue(Pageable pageable);

    // Find user's public photos only
    Page<GalleryPhoto> findByUserIdAndIsPublicTrue(Long userId, Pageable pageable);

    // Count methods
    long countByUserId(Long userId);
    long countByIsPublicTrue();
}
```

---

### Service Layer

**File:** `GalleryService.java`

```java
@Service
public class GalleryService {

    @Autowired
    private GalleryPhotoRepository galleryPhotoRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public GalleryPhotoResponse uploadPhoto(MultipartFile file, Long userId,
            String title, String description, Boolean isPublic) {
        // 1. Validate file
        fileStorageService.validateGalleryPhoto(file);

        // 2. Save file to disk
        String filePath = fileStorageService.saveGalleryPhoto(file, userId);

        // 3. Create entity
        GalleryPhoto photo = new GalleryPhoto();
        photo.setUserId(userId);
        photo.setTitle(title);
        photo.setDescription(description);
        photo.setFilePath(filePath);
        photo.setFileType(file.getContentType());
        photo.setFileSize(file.getSize());
        photo.setIsPublic(isPublic != null ? isPublic : false);

        // 4. Save to database
        photo = galleryPhotoRepository.save(photo);

        // 5. Return response
        return toResponse(photo);
    }

    public GalleryListResponse getMyPhotos(Long userId, Pageable pageable) {
        Page<GalleryPhoto> photos = galleryPhotoRepository.findByUserId(userId, pageable);
        return toListResponse(photos);
    }

    public GalleryListResponse getPublicPhotos(Pageable pageable) {
        Page<GalleryPhoto> photos = galleryPhotoRepository.findByIsPublicTrue(pageable);
        return toListResponse(photos);
    }

    // ... other methods
}
```

---

### Controller Layer

**File:** `GalleryController.java`

```java
@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    @Autowired
    private GalleryService galleryService;

    @PostMapping("/upload")
    public ResponseEntity<GalleryPhotoResponse> uploadPhoto(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "isPublic", required = false) Boolean isPublic,
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = getUserIdFromUserDetails(userDetails);
        GalleryPhotoResponse response = galleryService.uploadPhoto(
            file, userId, title, description, isPublic);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my-photos")
    public ResponseEntity<GalleryListResponse> getMyPhotos(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Long userId = getUserIdFromUserDetails(userDetails);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        GalleryListResponse response = galleryService.getMyPhotos(userId, pageable);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/public")
    public ResponseEntity<GalleryListResponse> getPublicPhotos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        GalleryListResponse response = galleryService.getPublicPhotos(pageable);

        return ResponseEntity.ok(response);
    }

    // ... other endpoints
}
```

---

### File Storage

**File:** `FileStorageService.java` (extended)

```java
public String saveGalleryPhoto(MultipartFile file, Long userId) {
    try {
        // Create user-specific directory
        String userDir = galleryUploadDir + "/user-" + userId;
        Files.createDirectories(Paths.get(userDir));

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String filename = "photo-" + System.currentTimeMillis() + extension;

        // Save file
        Path filePath = Paths.get(userDir, filename);
        Files.copy(file.getInputStream(), filePath);

        return filePath.toString();
    } catch (IOException e) {
        throw new GalleryException("Failed to save photo: " + e.getMessage());
    }
}

public void validateGalleryPhoto(MultipartFile file) {
    if (file == null || file.isEmpty()) {
        throw new GalleryException("File cannot be empty");
    }

    if (file.getSize() > MAX_GALLERY_PHOTO_SIZE) {
        throw new GalleryException("File size must not exceed 5 MB");
    }

    String contentType = file.getContentType();
    if (!ALLOWED_IMAGE_TYPES.contains(contentType)) {
        throw new GalleryException("Only image files (JPEG, PNG, GIF, WebP) are allowed");
    }
}
```

---

## Frontend Implementation

### File Structure

```
frontend/src/
├── app/gallery/
│   ├── page.tsx              # Gallery list page
│   ├── upload/page.tsx       # Upload page
│   └── [id]/page.tsx         # Photo detail page
├── components/gallery/
│   ├── PhotoGrid.tsx         # Photo grid component
│   ├── PhotoCard.tsx         # Individual photo card
│   ├── PhotoUploadForm.tsx   # Upload form
│   └── Pagination.tsx        # Pagination controls
└── services/
    └── galleryService.ts     # API service
```

---

### API Service

**File:** `galleryService.ts`

```typescript
const API_BASE = '/api/gallery';

export const galleryService = {
  async uploadPhoto(formData: FormData): Promise<GalleryPhotoResponse> {
    const response = await api.post(`${API_BASE}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  async getMyPhotos(page = 0, size = 20): Promise<GalleryListResponse> {
    const response = await api.get(`${API_BASE}/my-photos`, {
      params: { page, size }
    });
    return response.data;
  },

  async getPublicPhotos(page = 0, size = 20): Promise<GalleryListResponse> {
    const response = await api.get(`${API_BASE}/public`, {
      params: { page, size }
    });
    return response.data;
  },

  async getPhotoById(id: number): Promise<GalleryPhotoResponse> {
    const response = await api.get(`${API_BASE}/photo/${id}`);
    return response.data;
  },

  async updatePhoto(id: number, data: UpdatePhotoRequest): Promise<GalleryPhotoResponse> {
    const response = await api.put(`${API_BASE}/photo/${id}`, data);
    return response.data;
  },

  async togglePrivacy(id: number): Promise<GalleryPhotoResponse> {
    const response = await api.patch(`${API_BASE}/photo/${id}/privacy`);
    return response.data;
  },

  async deletePhoto(id: number): Promise<void> {
    await api.delete(`${API_BASE}/photo/${id}`);
  }
};
```

---

### Component Example

**File:** `PhotoCard.tsx`

```typescript
interface PhotoCardProps {
  photo: GalleryPhoto;
  onClick?: () => void;
  showPrivacy?: boolean;
}

export function PhotoCard({ photo, onClick, showPrivacy = true }: PhotoCardProps) {
  return (
    <div
      className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="aspect-square relative overflow-hidden rounded-t-lg">
        <img
          src={`/api/files/gallery/${photo.id}`}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
        {showPrivacy && (
          <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium
            ${photo.isPublic ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {photo.isPublic ? 'Public' : 'Private'}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 truncate">{photo.title}</h3>
        {photo.description && (
          <p className="text-sm text-gray-500 truncate mt-1">{photo.description}</p>
        )}
      </div>
    </div>
  );
}
```

---

## Security Configuration

**File:** `SecurityConfig.java`

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/gallery/public").permitAll()
            .requestMatchers("/api/gallery/**").authenticated()
        );

    return http.build();
}
```

---

## Testing Strategy

### Unit Tests
- GalleryServiceTest (18 tests)
- FileStorageServiceTest (8 tests)
- Repository tests (7 tests)

### Integration Tests
- API endpoint tests
- Authorization tests
- File upload tests

### E2E Tests
- See: [E2E Gallery Tests](../2024-12-08__e2e-gallery-tests/)

---

**Document Version:** 1.0
**Status:** COMPLETED
**Last Updated:** November 24, 2024

**Back to:** [Main README](README.md) | **Next:** [Checklist](checklist.md)
