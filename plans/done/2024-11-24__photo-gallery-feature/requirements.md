# Photo Gallery Feature - Requirements Document

**Status:** COMPLETED
**Last Updated:** November 24, 2024

---

## Overview

This document defines the requirements and specifications for the Photo Gallery feature with privacy control.

**Back to:** [Main README](README.md) | **See also:** [Technical Design](technical-design.md) | [Checklist](checklist.md)

---

## Feature Objectives

### Primary Goals

1. **Photo Management**
   - Upload photos with metadata (title, description)
   - View photos in gallery grid
   - Edit photo metadata
   - Delete photos

2. **Privacy Control**
   - Mark photos as public or private
   - Toggle privacy setting
   - Public photos visible to all users
   - Private photos visible only to owner

3. **Gallery Views**
   - "My Photos" - shows all user's photos (public + private)
   - "Public Photos" - shows all public photos from all users

4. **User Experience**
   - Pagination for large galleries
   - Responsive design
   - Loading states and error handling

---

## Functional Requirements

### FR-1: Photo Upload

**Priority:** P0 (Critical)

**Description:** Users can upload photos with metadata

**Acceptance Criteria:**
- Accept JPEG, PNG, GIF, WebP formats
- Maximum file size: 5MB
- Required fields: file, title
- Optional fields: description, isPublic
- Default privacy: private
- Store in user-specific directory
- Return photo ID and metadata

**API Endpoint:**
```
POST /api/gallery/upload
Content-Type: multipart/form-data

Request:
- file: (binary)
- title: string
- description: string (optional)
- isPublic: boolean (default: false)

Response: GalleryPhotoResponse
```

---

### FR-2: View My Photos

**Priority:** P0 (Critical)

**Description:** Users can view all their uploaded photos

**Acceptance Criteria:**
- Show all photos (public + private)
- Display privacy badge
- Support pagination (default 20 per page)
- Show photo thumbnail, title, upload date
- Click to view details

**API Endpoint:**
```
GET /api/gallery/my-photos?page=0&size=20
Authorization: Bearer {token}

Response: GalleryListResponse
```

---

### FR-3: View Public Photos

**Priority:** P0 (Critical)

**Description:** Users can view all public photos

**Acceptance Criteria:**
- Show only public photos from all users
- Display owner name
- Support pagination
- Accessible without authentication (optional)

**API Endpoint:**
```
GET /api/gallery/public?page=0&size=20

Response: GalleryListResponse
```

---

### FR-4: View Photo Detail

**Priority:** P0 (Critical)

**Description:** Users can view detailed photo information

**Acceptance Criteria:**
- Show full-size image
- Display title, description, privacy status
- Show upload date, owner info
- Owner sees Edit/Delete buttons
- Non-owner sees View only

**API Endpoint:**
```
GET /api/gallery/photo/{id}
Authorization: Bearer {token} (optional for public)

Response: GalleryPhotoDetailResponse
```

---

### FR-5: Edit Photo

**Priority:** P1 (High)

**Description:** Photo owners can edit metadata

**Acceptance Criteria:**
- Only owner can edit
- Editable fields: title, description, isPublic
- Return updated photo data
- Update timestamp changed

**API Endpoint:**
```
PUT /api/gallery/photo/{id}
Authorization: Bearer {token}

Request:
- title: string
- description: string
- isPublic: boolean

Response: GalleryPhotoResponse
```

---

### FR-6: Toggle Privacy

**Priority:** P1 (High)

**Description:** Photo owners can change privacy setting

**Acceptance Criteria:**
- Only owner can toggle
- Toggle between public/private
- Return updated status
- Affect visibility in public gallery

**API Endpoint:**
```
PATCH /api/gallery/photo/{id}/privacy
Authorization: Bearer {token}

Response: GalleryPhotoResponse
```

---

### FR-7: Delete Photo

**Priority:** P1 (High)

**Description:** Photo owners can delete their photos

**Acceptance Criteria:**
- Only owner can delete
- Delete from database
- Delete file from storage
- Return success confirmation

**API Endpoint:**
```
DELETE /api/gallery/photo/{id}
Authorization: Bearer {token}

Response: 204 No Content
```

---

## Non-Functional Requirements

### NFR-1: Performance

- Photo upload: < 5 seconds for 5MB file
- Gallery load: < 2 seconds for 20 photos
- Pagination: < 1 second per page

### NFR-2: Security

- File type validation (server-side)
- File size validation (server-side)
- Authorization check on all endpoints
- User-specific storage directories

### NFR-3: Storage

- Photos stored in `uploads/gallery/user-{userId}/`
- Unique filename with timestamp
- Support up to 100 photos per user
- Total storage: up to 500MB per user

---

## Database Schema

### gallery_photos Table

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
```

---

## Data Transfer Objects

### GalleryPhotoRequest

```java
public class GalleryPhotoRequest {
    private String title;
    private String description;
    private Boolean isPublic;
}
```

### GalleryPhotoResponse

```java
public class GalleryPhotoResponse {
    private Long id;
    private String title;
    private String description;
    private String filePath;
    private Boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
```

### GalleryListResponse

```java
public class GalleryListResponse {
    private List<GalleryPhotoResponse> photos;
    private int currentPage;
    private int totalPages;
    private long totalElements;
}
```

---

## Error Handling

### Error Responses

| Error | Status | Message |
|-------|--------|---------|
| Photo not found | 404 | "Photo not found" |
| Unauthorized access | 403 | "You don't have permission" |
| File too large | 400 | "File size exceeds 5MB" |
| Invalid file type | 400 | "Only image files allowed" |
| Upload failed | 500 | "Failed to upload photo" |

---

## Acceptance Criteria Summary

### Must Have (MVP)
- [x] Upload photo with title
- [x] View my photos
- [x] View public photos
- [x] Delete own photo
- [x] Privacy toggle

### Should Have
- [x] Edit photo metadata
- [x] Pagination
- [x] Photo detail view

### Nice to Have
- [ ] Photo albums
- [ ] Photo comments
- [ ] Photo sharing
- [ ] Bulk operations

---

## Out of Scope

- Photo editing/cropping
- Photo albums/collections
- Photo comments
- Photo sharing via URL
- Photo search/filter
- Batch operations
- EXIF data extraction

---

**Document Version:** 1.0
**Status:** COMPLETED
**Last Updated:** November 24, 2024

**Back to:** [Main README](README.md) | **Next:** [Technical Design](technical-design.md)
