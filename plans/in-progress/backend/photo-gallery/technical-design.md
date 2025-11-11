# Photo Gallery Feature - Technical Design

**Status:** 🚧 IN PROGRESS
**Last Updated:** 2025-11-13

---

## Architecture Overview

### System Context

```
┌─────────────────────────────────────────────────────────────┐
│                    Photo Gallery System                      │
│                                                              │
│  ┌──────────┐      ┌──────────┐      ┌──────────────┐     │
│  │          │      │          │      │              │     │
│  │ Frontend │─────▶│ Backend  │─────▶│  PostgreSQL  │     │
│  │  (React) │◀─────│ (Spring) │◀─────│   Database   │     │
│  │          │      │          │      │              │     │
│  └──────────┘      └────┬─────┘      └──────────────┘     │
│                         │                                   │
│                         ▼                                   │
│                  ┌──────────────┐                          │
│                  │              │                          │
│                  │ File Storage │                          │
│                  │  (uploads/)  │                          │
│                  │              │                          │
│                  └──────────────┘                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction

```
User Request Flow:
┌────────┐   HTTP    ┌─────────────┐   JPA     ┌──────────┐
│        │──────────▶│             │──────────▶│          │
│ Client │           │ Controller  │           │ Database │
│        │◀──────────│             │◀──────────│          │
└────────┘   JSON    └──────┬──────┘   Data    └──────────┘
                            │
                            │ Delegate
                            ▼
                     ┌──────────────┐
                     │              │
                     │   Service    │
                     │              │
                     └──────┬───────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
                ▼           ▼           ▼
         ┌──────────┐ ┌──────────┐ ┌──────────┐
         │          │ │          │ │          │
         │Repository│ │FileStore │ │Validator │
         │          │ │          │ │          │
         └──────────┘ └──────────┘ └──────────┘
```

---

## Database Design

### Schema

```sql
-- Table: gallery_photos
CREATE TABLE IF NOT EXISTS gallery_photos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    title VARCHAR(100),
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    upload_order INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Foreign key with CASCADE delete
    CONSTRAINT fk_gallery_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_gallery_user_id ON gallery_photos(user_id);
CREATE INDEX idx_gallery_public ON gallery_photos(is_public) WHERE is_public = TRUE;
CREATE INDEX idx_gallery_user_created ON gallery_photos(user_id, created_at DESC);
```

### Entity Relationship

```
┌─────────────┐              ┌──────────────────┐
│    users    │              │  gallery_photos  │
├─────────────┤              ├──────────────────┤
│ id (PK)     │◀────────────│ id (PK)          │
│ full_name   │    1     N  │ user_id (FK)     │
│ email       │              │ file_path        │
│ password    │              │ title            │
│ created_at  │              │ description      │
│ ...         │              │ is_public        │
│             │              │ upload_order     │
│             │              │ created_at       │
│             │              │ updated_at       │
└─────────────┘              └──────────────────┘

Relationship: One User → Many Gallery Photos
Cascade: User deleted → All photos deleted
```

### Database Queries

**1. Get user's all photos (paginated):**
```sql
SELECT * FROM gallery_photos
WHERE user_id = ?
ORDER BY created_at DESC
LIMIT ? OFFSET ?;
```

**2. Get public photos (paginated):**
```sql
SELECT gp.*, u.full_name, u.email
FROM gallery_photos gp
JOIN users u ON gp.user_id = u.id
WHERE gp.is_public = TRUE
ORDER BY gp.created_at DESC
LIMIT ? OFFSET ?;
```

**3. Get user's public photos:**
```sql
SELECT * FROM gallery_photos
WHERE user_id = ? AND is_public = TRUE
ORDER BY created_at DESC
LIMIT ? OFFSET ?;
```

---

## Backend Architecture

### Layer Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Controller Layer                      │
│  - Handle HTTP requests                                  │
│  - Validate input                                        │
│  - Return DTOs                                           │
│  - GalleryController (8 endpoints)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                     Service Layer                        │
│  - Business logic                                        │
│  - Authorization checks                                  │
│  - Transaction management                                │
│  - GalleryService, FileStorageService                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Repository Layer                       │
│  - Data access                                           │
│  - Custom queries                                        │
│  - GalleryPhotoRepository                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                     Database                             │
│  - PostgreSQL                                            │
│  - gallery_photos table                                  │
└─────────────────────────────────────────────────────────┘
```

### File Structure

```
backend/registration-form-api/src/main/java/com/registrationform/api/
├── entity/
│   └── GalleryPhoto.java                   ✅ EXISTS
├── repository/
│   └── GalleryPhotoRepository.java         ⏳ TO CREATE
├── service/
│   ├── FileStorageService.java             ⏳ TO EXTEND
│   └── GalleryService.java                 ⏳ TO CREATE
├── controller/
│   └── GalleryController.java              ⏳ TO CREATE
├── dto/
│   ├── GalleryPhotoRequest.java           ⏳ TO CREATE
│   ├── GalleryPhotoResponse.java          ⏳ TO CREATE
│   ├── GalleryListResponse.java           ⏳ TO CREATE
│   └── GalleryPhotoDetailResponse.java    ⏳ TO CREATE
├── exception/
│   ├── GalleryException.java              ⏳ TO CREATE
│   ├── GalleryNotFoundException.java      ⏳ TO CREATE
│   └── UnauthorizedGalleryAccessException.java  ⏳ TO CREATE
└── config/
    └── SecurityConfig.java                 ⏳ TO UPDATE
```

---

## File Storage Design

### Directory Structure

```
uploads/
├── profiles/                     ← Existing (single profile picture)
│   ├── user-1.jpg
│   ├── user-2.png
│   └── user-3.jpg
│
└── gallery/                      ← NEW (multiple gallery photos)
    ├── user-1/
    │   ├── photo-1-1731238845123.jpg
    │   ├── photo-2-1731238850456.png
    │   └── photo-3-1731238855789.gif
    │
    ├── user-2/
    │   ├── photo-4-1731238860123.jpg
    │   └── photo-5-1731238865456.webp
    │
    └── user-3/
        └── photo-6-1731238870123.jpg
```

### Filename Convention

**Format:** `photo-{photoId}-{timestamp}.{extension}`

**Example:** `photo-156-1731238845123.jpg`

**Components:**
- `photo-` : Prefix (identifies gallery photos)
- `156` : Photo ID from database
- `1731238845123` : Unix timestamp (milliseconds)
- `.jpg` : File extension

**Benefits:**
- ✅ Unique per photo (ID + timestamp)
- ✅ No conflicts possible
- ✅ Easy to identify in filesystem
- ✅ Sortable by timestamp
- ✅ Can trace back to database (photo ID)

### File Operations

**Upload Flow:**
```
1. Validate file (size, type, extension)
2. Get photo ID from database (after save)
3. Generate filename: photo-{id}-{timestamp}.ext
4. Create user subdirectory if not exists
5. Save file to: uploads/gallery/user-{userId}/filename
6. Return path: gallery/user-{userId}/filename
7. Store path in database
```

**Delete Flow:**
```
1. Get photo from database
2. Extract file path
3. Delete file from filesystem
4. Delete database record
5. Return success
```

---

## API Design

### Endpoint Specifications

#### 1. Upload Photo

**Endpoint:** `POST /api/gallery/upload`
**Auth:** Required (JWT)
**Content-Type:** `multipart/form-data`

**Request:**
```
POST /api/gallery/upload
Authorization: Bearer {jwt-token}
Content-Type: multipart/form-data

Form Data:
- file: (binary file)
- title: (optional string)
- description: (optional string)
- isPublic: (optional boolean, default: false)
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "photo": {
    "id": 156,
    "userId": 83,
    "userName": "Demo User",
    "filePath": "gallery/user-83/photo-156-1731238845123.jpg",
    "title": "Sunset at Beach",
    "description": "Beautiful sunset",
    "isPublic": false,
    "createdAt": "2025-11-13T10:30:00",
    "updatedAt": "2025-11-13T10:30:00"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "File size exceeds 5MB",
  "errorCode": "FILE_TOO_LARGE",
  "timestamp": "2025-11-13T10:30:00"
}
```

---

#### 2. Get My Photos

**Endpoint:** `GET /api/gallery/my-photos`
**Auth:** Required (JWT)
**Params:** `page`, `size`, `sort`

**Request:**
```
GET /api/gallery/my-photos?page=0&size=20&sort=createdAt,desc
Authorization: Bearer {jwt-token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "photos": [
    {
      "id": 156,
      "filePath": "gallery/user-83/photo-156-timestamp.jpg",
      "title": "Sunset",
      "description": "Beautiful sunset",
      "isPublic": false,
      "createdAt": "2025-11-13T10:30:00"
    },
    {
      "id": 157,
      "filePath": "gallery/user-83/photo-157-timestamp.png",
      "title": "Mountain",
      "description": null,
      "isPublic": true,
      "createdAt": "2025-11-13T11:00:00"
    }
  ],
  "pagination": {
    "totalPhotos": 25,
    "totalPages": 2,
    "currentPage": 0,
    "pageSize": 20
  }
}
```

---

#### 3. Get Public Photos

**Endpoint:** `GET /api/gallery/public`
**Auth:** Not required (public endpoint)
**Params:** `page`, `size`

**Request:**
```
GET /api/gallery/public?page=0&size=20
```

**Response (200 OK):**
```json
{
  "success": true,
  "photos": [
    {
      "id": 157,
      "userId": 83,
      "userName": "Demo User",
      "userEmail": "demo@example.com",
      "filePath": "gallery/user-83/photo-157-timestamp.png",
      "title": "Mountain View",
      "description": "Amazing view",
      "isPublic": true,
      "createdAt": "2025-11-13T11:00:00"
    }
  ],
  "pagination": {
    "totalPhotos": 100,
    "totalPages": 5,
    "currentPage": 0,
    "pageSize": 20
  }
}
```

---

#### 4. Get User's Public Photos

**Endpoint:** `GET /api/gallery/public/{userId}`
**Auth:** Not required
**Params:** `page`, `size`

**Request:**
```
GET /api/gallery/public/83?page=0&size=20
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 83,
    "name": "Demo User",
    "email": "demo@example.com"
  },
  "photos": [
    {
      "id": 157,
      "filePath": "gallery/user-83/photo-157-timestamp.png",
      "title": "Mountain View",
      "isPublic": true,
      "createdAt": "2025-11-13T11:00:00"
    }
  ],
  "pagination": {
    "totalPhotos": 5,
    "totalPages": 1,
    "currentPage": 0,
    "pageSize": 20
  }
}
```

---

#### 5. Get Photo Details

**Endpoint:** `GET /api/gallery/photo/{photoId}`
**Auth:** Conditional (required for private photos)

**Request:**
```
GET /api/gallery/photo/156
Authorization: Bearer {jwt-token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "photo": {
    "id": 156,
    "userId": 83,
    "userName": "Demo User",
    "userEmail": "demo@example.com",
    "filePath": "gallery/user-83/photo-156-timestamp.jpg",
    "title": "Sunset at Beach",
    "description": "Beautiful sunset during vacation",
    "isPublic": false,
    "createdAt": "2025-11-13T10:30:00",
    "updatedAt": "2025-11-13T10:30:00"
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "message": "You are not authorized to view this photo",
  "errorCode": "UNAUTHORIZED_ACCESS",
  "timestamp": "2025-11-13T10:30:00"
}
```

---

#### 6. Update Photo

**Endpoint:** `PUT /api/gallery/photo/{photoId}`
**Auth:** Required (owner only)
**Content-Type:** `application/json`

**Request:**
```
PUT /api/gallery/photo/156
Authorization: Bearer {jwt-token}
Content-Type: application/json

{
  "title": "New Title",
  "description": "New description",
  "isPublic": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Photo updated successfully",
  "photo": {
    "id": 156,
    "title": "New Title",
    "description": "New description",
    "isPublic": true,
    "updatedAt": "2025-11-13T12:00:00"
  }
}
```

---

#### 7. Toggle Privacy

**Endpoint:** `PATCH /api/gallery/photo/{photoId}/privacy`
**Auth:** Required (owner only)

**Request:**
```
PATCH /api/gallery/photo/156/privacy
Authorization: Bearer {jwt-token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Privacy updated successfully",
  "photo": {
    "id": 156,
    "isPublic": true,
    "updatedAt": "2025-11-13T12:00:00"
  }
}
```

---

#### 8. Delete Photo

**Endpoint:** `DELETE /api/gallery/photo/{photoId}`
**Auth:** Required (owner only)

**Request:**
```
DELETE /api/gallery/photo/156
Authorization: Bearer {jwt-token}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Photo deleted successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Photo not found",
  "errorCode": "PHOTO_NOT_FOUND",
  "timestamp": "2025-11-13T12:00:00"
}
```

---

## Security Design

### Authorization Matrix

| Endpoint | Anonymous | Authenticated (Not Owner) | Owner |
|----------|-----------|---------------------------|-------|
| POST /upload | ❌ 401 | ✅ Can upload own | ✅ Can upload |
| GET /my-photos | ❌ 401 | ✅ Own photos only | ✅ All own photos |
| GET /public | ✅ Public photos | ✅ Public photos | ✅ Public photos |
| GET /public/{userId} | ✅ User's public | ✅ User's public | ✅ User's public |
| GET /photo/{id} | ⚠️ Public only | ⚠️ Public only | ✅ Own photos (all) |
| PUT /photo/{id} | ❌ 401 | ❌ 403 | ✅ Can update own |
| PATCH /privacy | ❌ 401 | ❌ 403 | ✅ Can toggle own |
| DELETE /photo/{id} | ❌ 401 | ❌ 403 | ✅ Can delete own |

### Privacy Filtering

**Repository Level:**
```java
// Public photos query (automatic filtering)
@Query("SELECT p FROM GalleryPhoto p WHERE p.isPublic = TRUE")
List<GalleryPhoto> findPublicPhotos(Pageable pageable);

// User's photos (no filtering needed)
List<GalleryPhoto> findByUserId(Long userId, Pageable pageable);
```

**Service Level:**
```java
public GalleryPhoto getPhotoById(Long photoId, Long requestingUserId) {
    GalleryPhoto photo = repository.findById(photoId)
        .orElseThrow(() -> new GalleryNotFoundException());

    // Privacy check
    if (!photo.getIsPublic() && !photo.getUser().getId().equals(requestingUserId)) {
        throw new UnauthorizedGalleryAccessException();
    }

    return photo;
}
```

---

## Implementation Details

### GalleryPhotoRepository

```java
public interface GalleryPhotoRepository extends JpaRepository<GalleryPhoto, Long> {

    // Find all photos by user (paginated)
    List<GalleryPhoto> findByUserId(Long userId, Pageable pageable);

    // Find public photos only
    @Query("SELECT p FROM GalleryPhoto p WHERE p.isPublic = TRUE")
    List<GalleryPhoto> findByIsPublicTrue(Pageable pageable);

    // Find user's public photos
    List<GalleryPhoto> findByUserIdAndIsPublicTrue(Long userId, Pageable pageable);

    // Count methods for pagination
    Long countByUserId(Long userId);
    Long countByIsPublicTrue();
    Long countByUserIdAndIsPublicTrue(Long userId);
}
```

### GalleryService

```java
@Service
public class GalleryService {

    @Autowired
    private GalleryPhotoRepository repository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;

    public GalleryPhotoResponse uploadPhoto(
            MultipartFile file,
            Long userId,
            String title,
            String description,
            Boolean isPublic) {

        // 1. Validate file
        fileStorageService.validateGalleryPhoto(file);

        // 2. Get user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Create photo entity
        GalleryPhoto photo = new GalleryPhoto(user, null);
        photo.setTitle(title);
        photo.setDescription(description);
        photo.setIsPublic(isPublic != null ? isPublic : false);

        // 4. Save to database (get ID)
        photo = repository.save(photo);

        // 5. Save file to disk (using ID)
        String filePath = fileStorageService.saveGalleryPhoto(file, userId, photo.getId());

        // 6. Update photo with file path
        photo.setFilePath(filePath);
        photo = repository.save(photo);

        // 7. Return response
        return GalleryPhotoResponse.from(photo);
    }

    public GalleryListResponse getMyPhotos(Long userId, Pageable pageable) {
        List<GalleryPhoto> photos = repository.findByUserId(userId, pageable);
        Long total = repository.countByUserId(userId);
        return GalleryListResponse.from(photos, total, pageable);
    }

    public GalleryListResponse getPublicPhotos(Pageable pageable) {
        List<GalleryPhoto> photos = repository.findByIsPublicTrue(pageable);
        Long total = repository.countByIsPublicTrue();
        return GalleryListResponse.from(photos, total, pageable);
    }

    public void deletePhoto(Long photoId, Long userId) {
        GalleryPhoto photo = repository.findById(photoId)
            .orElseThrow(() -> new GalleryNotFoundException());

        // Authorization check
        if (!photo.getUser().getId().equals(userId)) {
            throw new UnauthorizedGalleryAccessException();
        }

        // Delete file from disk
        fileStorageService.deleteGalleryPhoto(userId, photoId, getExtension(photo.getFilePath()));

        // Delete from database
        repository.delete(photo);
    }

    public GalleryPhotoResponse togglePrivacy(Long photoId, Long userId) {
        GalleryPhoto photo = repository.findById(photoId)
            .orElseThrow(() -> new GalleryNotFoundException());

        // Authorization check
        if (!photo.getUser().getId().equals(userId)) {
            throw new UnauthorizedGalleryAccessException();
        }

        // Toggle privacy
        photo.togglePrivacy();
        photo = repository.save(photo);

        return GalleryPhotoResponse.from(photo);
    }
}
```

---

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   └── Gallery/
│       ├── GalleryGrid.tsx         - Photo grid layout
│       ├── PhotoCard.tsx           - Individual photo card
│       ├── PhotoUploadModal.tsx    - Upload modal
│       ├── PhotoDetailModal.tsx    - Photo detail view
│       ├── PrivacyToggle.tsx       - Privacy switch
│       └── ImageLightbox.tsx       - Full-screen viewer
│
├── pages/
│   ├── MyGallery.tsx              - User's all photos
│   └── PublicGallery.tsx          - All public photos
│
└── services/
    └── galleryService.ts          - API integration
```

### State Management

```typescript
// Gallery state
interface GalleryState {
  photos: Photo[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
  };
  filter: 'all' | 'public' | 'private';
}
```

---

## Testing Strategy

### Test Pyramid

```
        ┌─────────────┐
        │   E2E (6)   │  ← Critical user flows
        │             │
        ├─────────────┤
        │ Integration │  ← API endpoints (9)
        │   (9)       │
        ├─────────────┤
        │   Unit      │  ← Business logic (33)
        │   (33)      │
        └─────────────┘
```

### Test Coverage

**Backend Tests (42 total):**
- Repository: 7 tests
- FileStorageService: 8 tests
- GalleryService: 18 tests
- Integration: 9 tests

**E2E Tests (6 critical):**
- Upload flow
- Privacy toggle
- Delete flow
- Gallery views
- Validation
- Authorization

---

**Last Updated:** 2025-11-13
**Status:** Technical design complete, ready for implementation
