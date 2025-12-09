# Photo Likes Feature - Technical Design Document

**Feature:** Photo Likes
**Version:** 1.0
**Last Updated:** December 10, 2024
**Author:** Development Team

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Database Design](#database-design)
3. [Backend Design](#backend-design)
4. [Frontend Design](#frontend-design)
5. [API Specifications](#api-specifications)
6. [Testing Strategy](#testing-strategy)
7. [Security Considerations](#security-considerations)
8. [Performance Optimizations](#performance-optimizations)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                     │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────────┐│
│  │ LikeButton │  │LikedPhotosPage│  │ photoLikeService.ts  ││
│  │ Component  │  │  Component    │  │   (API Client)       ││
│  └──────┬─────┘  └──────┬───────┘  └──────────┬───────────┘│
│         │                │                      │            │
│         └────────────────┴──────────────────────┘            │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP/REST (JWT)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Backend (Spring Boot)                     │
│  ┌──────────────────────────────────────────────────────────┤
│  │  PhotoLikeController                                     │
│  │  - POST /api/gallery/photo/{id}/like                     │
│  │  - DELETE /api/gallery/photo/{id}/like                   │
│  │  - GET /api/gallery/liked-photos                         │
│  └──────────────────┬───────────────────────────────────────┘
│                     │
│  ┌──────────────────▼───────────────────────────────────────┐
│  │  PhotoLikeService (Business Logic)                       │
│  │  - likePhoto(photoId, userId)                            │
│  │  - unlikePhoto(photoId, userId)                          │
│  │  - getLikedPhotos(userId, pageable)                      │
│  └──────────────────┬───────────────────────────────────────┘
│                     │
│  ┌──────────────────▼───────────────────────────────────────┐
│  │  PhotoLikeRepository (Data Access)                       │
│  │  - Spring Data JPA                                       │
│  │  - Custom queries                                        │
│  └──────────────────┬───────────────────────────────────────┘
└────────────────────┬────────────────────────────────────────┘
                     │ SQL
┌────────────────────▼────────────────────────────────────────┐
│               PostgreSQL Database                            │
│  ┌──────────────────────────────────────────────────────────┤
│  │  photo_likes table                                       │
│  │  - id (PK), photo_id (FK), user_id (FK), created_at      │
│  │  - UNIQUE(photo_id, user_id)                             │
│  └──────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend:**
- Spring Boot 3.3.6
- Spring Data JPA
- Spring Security (JWT)
- PostgreSQL 14+
- Flyway (migrations)

**Frontend:**
- Next.js 15.5.0
- React 19.1.0
- TypeScript
- Tailwind CSS 4

**Testing:**
- JUnit 5 + Mockito (Unit & Integration)
- Playwright (API & E2E)

---

## Database Design

### Photo Likes Table

**Table Name:** `photo_likes`

**Purpose:** Store like relationships between users and photos

```sql
CREATE TABLE photo_likes (
    id BIGSERIAL PRIMARY KEY,
    photo_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign keys
    CONSTRAINT fk_photo_likes_photo
        FOREIGN KEY (photo_id)
        REFERENCES gallery_photos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_photo_likes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    -- Unique constraint (prevent duplicate likes)
    CONSTRAINT uk_photo_likes_photo_user
        UNIQUE (photo_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_photo_likes_photo_id ON photo_likes(photo_id);
CREATE INDEX idx_photo_likes_user_id ON photo_likes(user_id);
CREATE INDEX idx_photo_likes_created_at ON photo_likes(created_at DESC);
```

**Column Descriptions:**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGSERIAL | NO | Primary key, auto-increment |
| `photo_id` | BIGINT | NO | Foreign key to gallery_photos.id |
| `user_id` | BIGINT | NO | Foreign key to users.id |
| `created_at` | TIMESTAMP | NO | When the like was created (for ordering) |

**Constraints:**
1. **Primary Key:** `id` - Unique identifier for each like
2. **Foreign Key:** `photo_id` → `gallery_photos(id)` ON DELETE CASCADE
3. **Foreign Key:** `user_id` → `users(id)` ON DELETE CASCADE
4. **Unique Constraint:** `(photo_id, user_id)` - Prevent duplicate likes

**Indexes:**
1. `idx_photo_likes_photo_id` - Fast lookups by photo (for like count)
2. `idx_photo_likes_user_id` - Fast lookups by user (for liked photos page)
3. `idx_photo_likes_created_at` - Fast ordering by most recent

**Cascade Behavior:**
- If a photo is deleted → All likes for that photo are deleted
- If a user is deleted → All likes by that user are deleted

---

### Flyway Migration Script

**File:** `backend/registration-form-api/src/main/resources/db/migration/V3__create_photo_likes.sql`

```sql
-- V3: Create photo_likes table for Photo Likes feature
-- Created: December 10, 2024

CREATE TABLE photo_likes (
    id BIGSERIAL PRIMARY KEY,
    photo_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_photo_likes_photo
        FOREIGN KEY (photo_id)
        REFERENCES gallery_photos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_photo_likes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_photo_likes_photo_user
        UNIQUE (photo_id, user_id)
);

CREATE INDEX idx_photo_likes_photo_id ON photo_likes(photo_id);
CREATE INDEX idx_photo_likes_user_id ON photo_likes(user_id);
CREATE INDEX idx_photo_likes_created_at ON photo_likes(created_at DESC);

-- Migration complete
```

---

### Entity Relationship Diagram

```
users (existing)
  ├── id (PK)
  ├── full_name
  ├── email
  └── ...

gallery_photos (existing)
  ├── id (PK)
  ├── user_id (FK → users.id)
  ├── photo_url
  ├── title
  ├── description
  ├── is_public
  └── ...

photo_likes (NEW)
  ├── id (PK)
  ├── photo_id (FK → gallery_photos.id) ──┐
  ├── user_id (FK → users.id) ────────────┼─ UNIQUE(photo_id, user_id)
  └── created_at                           ┘
```

**Relationships:**
- `photo_likes.photo_id` → Many likes point to ONE photo
- `photo_likes.user_id` → Many likes created by ONE user
- **Many-to-Many** between `users` and `gallery_photos` (through `photo_likes`)

---

## Backend Design

### Layer Architecture

```
Controller Layer (REST API)
    │
    ├── PhotoLikeController.java
    │   - Handles HTTP requests
    │   - JWT authentication
    │   - Request validation
    │   - Response formatting
    │
    ▼
Service Layer (Business Logic)
    │
    ├── PhotoLikeService.java
    │   - Core business rules
    │   - Transaction management
    │   - Error handling
    │   - Validation logic
    │
    ▼
Repository Layer (Data Access)
    │
    ├── PhotoLikeRepository.java
    │   - Spring Data JPA
    │   - Custom queries
    │   - Database operations
    │
    ▼
Database Layer
    │
    └── PostgreSQL
```

---

### Entity Class

**File:** `backend/.../entity/PhotoLike.java`

```java
package com.registrationform.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "photo_likes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"photo_id", "user_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id", nullable = false)
    private GalleryPhoto photo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
```

**Key Features:**
- `@Entity` - JPA entity mapped to `photo_likes` table
- `@UniqueConstraint` - Enforces one like per user per photo
- `@ManyToOne` - Relationship to GalleryPhoto and User
- `@PrePersist` - Automatically sets `createdAt` on insert
- `FetchType.LAZY` - Performance optimization (don't load unless needed)

---

### Repository Interface

**File:** `backend/.../repository/PhotoLikeRepository.java`

```java
package com.registrationform.api.repository;

import com.registrationform.api.entity.PhotoLike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PhotoLikeRepository extends JpaRepository<PhotoLike, Long> {

    /**
     * Find a like by photo ID and user ID
     * Used to check if user already liked a photo
     */
    Optional<PhotoLike> findByPhotoIdAndUserId(Long photoId, Long userId);

    /**
     * Check if user has liked a photo
     * More efficient than findBy when you only need boolean
     */
    boolean existsByPhotoIdAndUserId(Long photoId, Long userId);

    /**
     * Count total likes for a photo
     * Used for displaying like count
     */
    long countByPhotoId(Long photoId);

    /**
     * Get all liked photos for a user (paginated)
     * Ordered by most recently liked first
     */
    @Query("SELECT pl.photo FROM PhotoLike pl WHERE pl.user.id = :userId ORDER BY pl.createdAt DESC")
    Page<GalleryPhoto> findLikedPhotosByUserId(Long userId, Pageable pageable);

    /**
     * Delete a like by photo ID and user ID
     * Used for unlike operation
     */
    void deleteByPhotoIdAndUserId(Long photoId, Long userId);
}
```

**Method Naming Convention:**
- `findByPhotoIdAndUserId` - Spring Data JPA auto-generates query
- `existsByPhotoIdAndUserId` - Returns boolean (more efficient than find)
- `countByPhotoId` - Returns long count
- `@Query` - Custom JPQL for complex queries

---

### Service Class

**File:** `backend/.../service/PhotoLikeService.java`

```java
package com.registrationform.api.service;

import com.registrationform.api.entity.GalleryPhoto;
import com.registrationform.api.entity.PhotoLike;
import com.registrationform.api.entity.User;
import com.registrationform.api.repository.GalleryPhotoRepository;
import com.registrationform.api.repository.PhotoLikeRepository;
import com.registrationform.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PhotoLikeService {

    private final PhotoLikeRepository photoLikeRepository;
    private final GalleryPhotoRepository galleryPhotoRepository;
    private final UserRepository userRepository;

    /**
     * Like a photo
     *
     * @param photoId ID of photo to like
     * @param userId ID of user liking the photo
     * @throws IllegalArgumentException if photo not found, not public, or user is owner
     * @throws IllegalStateException if already liked
     */
    @Transactional
    public void likePhoto(Long photoId, Long userId) {
        // Validate photo exists
        GalleryPhoto photo = galleryPhotoRepository.findById(photoId)
            .orElseThrow(() -> new IllegalArgumentException("Photo not found"));

        // Validate photo is public
        if (!photo.getIsPublic()) {
            throw new IllegalArgumentException("Cannot like private photos");
        }

        // Validate user is not the photo owner
        if (photo.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Cannot like your own photo");
        }

        // Check if already liked
        if (photoLikeRepository.existsByPhotoIdAndUserId(photoId, userId)) {
            throw new IllegalStateException("Photo already liked");
        }

        // Get user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Create and save like
        PhotoLike photoLike = new PhotoLike();
        photoLike.setPhoto(photo);
        photoLike.setUser(user);
        photoLikeRepository.save(photoLike);
    }

    /**
     * Unlike a photo
     *
     * @param photoId ID of photo to unlike
     * @param userId ID of user unliking the photo
     * @throws IllegalArgumentException if photo not found or not liked
     */
    @Transactional
    public void unlikePhoto(Long photoId, Long userId) {
        // Validate photo exists
        if (!galleryPhotoRepository.existsById(photoId)) {
            throw new IllegalArgumentException("Photo not found");
        }

        // Check if liked
        if (!photoLikeRepository.existsByPhotoIdAndUserId(photoId, userId)) {
            throw new IllegalArgumentException("Photo not liked");
        }

        // Delete like
        photoLikeRepository.deleteByPhotoIdAndUserId(photoId, userId);
    }

    /**
     * Get all photos liked by a user
     *
     * @param userId ID of user
     * @param pageable Pagination parameters
     * @return Page of liked photos
     */
    @Transactional(readOnly = true)
    public Page<GalleryPhoto> getLikedPhotos(Long userId, Pageable pageable) {
        return photoLikeRepository.findLikedPhotosByUserId(userId, pageable);
    }

    /**
     * Get like count for a photo
     *
     * @param photoId ID of photo
     * @return Number of likes
     */
    @Transactional(readOnly = true)
    public long getLikeCount(Long photoId) {
        return photoLikeRepository.countByPhotoId(photoId);
    }

    /**
     * Check if user has liked a photo
     *
     * @param photoId ID of photo
     * @param userId ID of user
     * @return true if liked, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean isLikedByUser(Long photoId, Long userId) {
        return photoLikeRepository.existsByPhotoIdAndUserId(photoId, userId);
    }
}
```

**Business Logic Highlights:**
1. **Validation:** Photo exists, is public, user not owner
2. **Duplicate Prevention:** Check if already liked
3. **Transactions:** `@Transactional` ensures atomicity
4. **Error Handling:** Clear exception messages

---

### Controller Class

**File:** `backend/.../controller/PhotoLikeController.java`

```java
package com.registrationform.api.controller;

import com.registrationform.api.dto.PhotoResponse;
import com.registrationform.api.entity.GalleryPhoto;
import com.registrationform.api.service.JwtUtil;
import com.registrationform.api.service.PhotoLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3005")
public class PhotoLikeController {

    private final PhotoLikeService photoLikeService;
    private final JwtUtil jwtUtil;

    /**
     * Like a photo
     * POST /api/gallery/photo/{photoId}/like
     */
    @PostMapping("/photo/{photoId}/like")
    public ResponseEntity<Void> likePhoto(
            @PathVariable Long photoId,
            @RequestHeader("Authorization") String token) {

        // Extract user ID from JWT
        String jwt = token.substring(7); // Remove "Bearer "
        String email = jwtUtil.extractEmail(jwt);
        Long userId = jwtUtil.extractUserId(jwt);

        // Like photo
        photoLikeService.likePhoto(photoId, userId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * Unlike a photo
     * DELETE /api/gallery/photo/{photoId}/like
     */
    @DeleteMapping("/photo/{photoId}/like")
    public ResponseEntity<Void> unlikePhoto(
            @PathVariable Long photoId,
            @RequestHeader("Authorization") String token) {

        // Extract user ID from JWT
        String jwt = token.substring(7);
        Long userId = jwtUtil.extractUserId(jwt);

        // Unlike photo
        photoLikeService.unlikePhoto(photoId, userId);

        return ResponseEntity.noContent().build();
    }

    /**
     * Get all liked photos for current user
     * GET /api/gallery/liked-photos?page=0&size=12
     */
    @GetMapping("/liked-photos")
    public ResponseEntity<Page<PhotoResponse>> getLikedPhotos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestHeader("Authorization") String token) {

        // Extract user ID from JWT
        String jwt = token.substring(7);
        Long userId = jwtUtil.extractUserId(jwt);

        // Get liked photos
        Pageable pageable = PageRequest.of(page, size);
        Page<GalleryPhoto> likedPhotos = photoLikeService.getLikedPhotos(userId, pageable);

        // Convert to DTOs
        Page<PhotoResponse> response = likedPhotos.map(this::convertToPhotoResponse);

        return ResponseEntity.ok(response);
    }

    /**
     * Helper method to convert GalleryPhoto to PhotoResponse DTO
     */
    private PhotoResponse convertToPhotoResponse(GalleryPhoto photo) {
        PhotoResponse response = new PhotoResponse();
        response.setId(photo.getId());
        response.setPhotoUrl(photo.getPhotoUrl());
        response.setTitle(photo.getTitle());
        response.setDescription(photo.getDescription());
        response.setIsPublic(photo.getIsPublic());
        response.setUploadDate(photo.getUploadDate());
        response.setUserId(photo.getUser().getId());
        response.setUserFullName(photo.getUser().getFullName());

        // Add like count and isLiked status
        response.setLikeCount(photoLikeService.getLikeCount(photo.getId()));
        // Note: isLikedByCurrentUser will be set in frontend based on liked photos

        return response;
    }
}
```

**HTTP Status Codes:**
- `201 Created` - Photo liked successfully
- `204 No Content` - Photo unliked successfully
- `200 OK` - Liked photos retrieved
- `400 Bad Request` - Invalid request (handled by exception handler)
- `401 Unauthorized` - No/invalid JWT token
- `404 Not Found` - Photo not found
- `409 Conflict` - Already liked (handled by exception handler)

---

## Frontend Design

### Component Architecture

```
App
 └── HomeLayout
      ├── Sidebar/Navigation
      │    └── "Liked Photos" link
      │
      ├── GalleryPage
      │    └── GalleryPhotoCard[]
      │         ├── Photo Image
      │         ├── Photo Info
      │         └── LikeButton ← NEW
      │
      ├── PhotoDetailPage
      │    ├── Large Photo Display
      │    ├── Photo Metadata
      │    └── LikeButton ← NEW
      │
      └── LikedPhotosPage ← NEW
           ├── Page Header
           ├── Photo Grid
           │    └── GalleryPhotoCard[]
           │         └── LikeButton (already liked)
           └── Pagination
```

---

### LikeButton Component

**File:** `frontend/src/components/LikeButton.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react'; // Icon library
import { likePhoto, unlikePhoto } from '@/services/photoLikeService';

interface LikeButtonProps {
  photoId: number;
  initialIsLiked: boolean;
  initialLikeCount: number;
  onLikeChange?: (liked: boolean) => void;
}

export default function LikeButton({
  photoId,
  initialIsLiked,
  initialLikeCount,
  onLikeChange
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeToggle = async () => {
    // Prevent multiple clicks
    if (isLoading) return;

    // Optimistic update
    const previousIsLiked = isLiked;
    const previousCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(prev => !isLiked ? prev + 1 : prev - 1);
    setIsLoading(true);

    try {
      if (!isLiked) {
        await likePhoto(photoId);
      } else {
        await unlikePhoto(photoId);
      }

      // Success - optimistic update was correct
      onLikeChange?.(!isLiked);

    } catch (error) {
      // Rollback on error
      setIsLiked(previousIsLiked);
      setLikeCount(previousCount);

      console.error('Failed to toggle like:', error);
      alert('Failed to like photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 transition-colors ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-red-500'
      }`}
      aria-label={isLiked ? 'Unlike photo' : 'Like photo'}
    >
      <Heart
        className={`w-6 h-6 transition-all ${
          isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'
        }`}
      />
      <span className="text-sm font-medium">{likeCount}</span>
    </button>
  );
}
```

**Key Features:**
- ✅ Optimistic updates (instant UI feedback)
- ✅ Rollback on error
- ✅ Loading state (prevent double-clicks)
- ✅ Accessibility (aria-label)
- ✅ Clear visual states (outline vs filled heart)

---

### API Service

**File:** `frontend/src/services/photoLikeService.ts`

```typescript
const API_BASE_URL = 'http://localhost:8081';

/**
 * Get JWT token from localStorage
 */
function getAuthToken(): string {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('Not authenticated');
  }
  return token;
}

/**
 * Like a photo
 * POST /api/gallery/photo/{photoId}/like
 */
export async function likePhoto(photoId: number): Promise<void> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/gallery/photo/${photoId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to like photo');
  }
}

/**
 * Unlike a photo
 * DELETE /api/gallery/photo/{photoId}/like
 */
export async function unlikePhoto(photoId: number): Promise<void> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/gallery/photo/${photoId}/like`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to unlike photo');
  }
}

/**
 * Get liked photos for current user
 * GET /api/gallery/liked-photos?page=0&size=12
 */
export async function getLikedPhotos(page: number = 0, size: number = 12) {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/gallery/liked-photos?page=${page}&size=${size}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch liked photos');
  }

  return response.json();
}
```

---

### Liked Photos Page

**File:** `frontend/src/app/home/liked-photos/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getLikedPhotos } from '@/services/photoLikeService';
import GalleryPhotoCard from '@/components/GalleryPhotoCard';
import Pagination from '@/components/Pagination';

export default function LikedPhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLikedPhotos();
  }, [currentPage]);

  async function loadLikedPhotos() {
    setIsLoading(true);
    try {
      const data = await getLikedPhotos(currentPage, 12);
      setPhotos(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load liked photos:', error);
      alert('Failed to load liked photos');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Liked Photos Yet</h2>
        <p className="text-gray-600">Start exploring and like photos you enjoy!</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Liked Photos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <GalleryPhotoCard key={photo.id} photo={photo} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
```

---

## API Specifications

### API Endpoint 1: Like Photo

**Endpoint:** `POST /api/gallery/photo/{photoId}/like`

**Description:** Like a public photo

**Authentication:** Required (JWT token in header)

**Request:**
```http
POST /api/gallery/photo/123/like HTTP/1.1
Host: localhost:8081
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**Response Success (201 Created):**
```http
HTTP/1.1 201 Created
```

**Response Error (409 Conflict - Already Liked):**
```http
HTTP/1.1 409 Conflict
Content-Type: text/plain

Photo already liked
```

**Response Error (403 Forbidden - Own Photo):**
```http
HTTP/1.1 403 Forbidden
Content-Type: text/plain

Cannot like your own photo
```

**Response Error (404 Not Found):**
```http
HTTP/1.1 404 Not Found
Content-Type: text/plain

Photo not found
```

---

### API Endpoint 2: Unlike Photo

**Endpoint:** `DELETE /api/gallery/photo/{photoId}/like`

**Description:** Unlike a previously liked photo

**Authentication:** Required (JWT)

**Request:**
```http
DELETE /api/gallery/photo/123/like HTTP/1.1
Host: localhost:8081
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**Response Success (204 No Content):**
```http
HTTP/1.1 204 No Content
```

**Response Error (400 Bad Request - Not Liked):**
```http
HTTP/1.1 400 Bad Request
Content-Type: text/plain

Photo not liked
```

---

### API Endpoint 3: Get Liked Photos

**Endpoint:** `GET /api/gallery/liked-photos?page=0&size=12`

**Description:** Get all photos liked by current user (paginated)

**Authentication:** Required (JWT)

**Request:**
```http
GET /api/gallery/liked-photos?page=0&size=12 HTTP/1.1
Host: localhost:8081
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**Response Success (200 OK):**
```json
{
  "content": [
    {
      "id": 123,
      "photoUrl": "/uploads/gallery/photo-123.jpg",
      "title": "Sunset Beach",
      "description": "Beautiful sunset at the beach",
      "isPublic": true,
      "uploadDate": "2024-12-10T10:00:00",
      "userId": 45,
      "userFullName": "John Doe",
      "likeCount": 15,
      "isLikedByCurrentUser": true
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 12
  },
  "totalPages": 3,
  "totalElements": 28,
  "size": 12,
  "number": 0,
  "first": true,
  "last": false
}
```

---

## Testing Strategy

### Overview: 4 Types of Testing (32 Tests Total)

```
Testing Pyramid:

                    ┌──────────┐
                    │   E2E    │  10 tests (Full FE + BE + DB)
                    │ Playwright│
                    └──────────┘
                   ┌────────────┐
                   │  API Tests │   8 tests (Full BE + Real DB)
                   │ Playwright │
                   └────────────┘
                 ┌──────────────────┐
                 │ Integration Tests│  6 tests (Controller + Service, NO DB)
                 │   MockMvc        │
                 └──────────────────┘
           ┌────────────────────────────┐
           │      Unit Tests            │  8 tests (Service only, mocked)
           │   JUnit 5 + Mockito        │
           └────────────────────────────┘
```

---

### Test Type 1: Unit Tests (8 tests)

**File:** `backend/.../test/.../PhotoLikeServiceTest.java`

**Purpose:** Test PhotoLikeService business logic in **complete isolation**

**Characteristics:**
- ✅ **NO database** - all repositories mocked with Mockito
- ✅ **Fast execution** (<100ms total)
- ✅ **Tests business rules** only
- ✅ **High confidence** in service logic

**Test Cases:**

1. **testLikePhoto_Success()**
   - Given: Valid photo, valid user, photo is public, not owner, not liked
   - When: likePhoto() called
   - Then: photoLikeRepository.save() called once

2. **testLikePhoto_PhotoNotFound()**
   - Given: Photo ID doesn't exist (repository returns empty)
   - When: likePhoto() called
   - Then: IllegalArgumentException thrown with "Photo not found"

3. **testLikePhoto_PhotoNotPublic()**
   - Given: Photo exists but is_public = false
   - When: likePhoto() called
   - Then: IllegalArgumentException thrown with "Cannot like private photos"

4. **testLikePhoto_UserIsOwner()**
   - Given: Photo owner_id == current user_id
   - When: likePhoto() called
   - Then: IllegalArgumentException thrown with "Cannot like your own photo"

5. **testLikePhoto_AlreadyLiked()**
   - Given: existsByPhotoIdAndUserId() returns true
   - When: likePhoto() called
   - Then: IllegalStateException thrown with "Photo already liked"

6. **testUnlikePhoto_Success()**
   - Given: Photo exists, user has liked it
   - When: unlikePhoto() called
   - Then: deleteByPhotoIdAndUserId() called once

7. **testUnlikePhoto_NotLiked()**
   - Given: existsByPhotoIdAndUserId() returns false
   - When: unlikePhoto() called
   - Then: IllegalArgumentException thrown with "Photo not liked"

8. **testGetLikedPhotos_ReturnsUserLikes()**
   - Given: User has liked 3 photos
   - When: getLikedPhotos() called
   - Then: Returns Page with 3 photos

**Example Test:**

```java
@ExtendWith(MockitoExtension.class)
class PhotoLikeServiceTest {

    @Mock
    private PhotoLikeRepository photoLikeRepository;

    @Mock
    private GalleryPhotoRepository galleryPhotoRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PhotoLikeService photoLikeService;

    @Test
    void testLikePhoto_Success() {
        // Arrange
        Long photoId = 1L;
        Long userId = 2L;

        GalleryPhoto photo = new GalleryPhoto();
        photo.setId(photoId);
        photo.setIsPublic(true);

        User owner = new User();
        owner.setId(999L); // Different from userId
        photo.setUser(owner);

        User currentUser = new User();
        currentUser.setId(userId);

        when(galleryPhotoRepository.findById(photoId))
            .thenReturn(Optional.of(photo));
        when(userRepository.findById(userId))
            .thenReturn(Optional.of(currentUser));
        when(photoLikeRepository.existsByPhotoIdAndUserId(photoId, userId))
            .thenReturn(false);

        // Act
        photoLikeService.likePhoto(photoId, userId);

        // Assert
        verify(photoLikeRepository, times(1)).save(any(PhotoLike.class));
    }

    @Test
    void testLikePhoto_AlreadyLiked() {
        // Arrange
        Long photoId = 1L;
        Long userId = 2L;

        GalleryPhoto photo = new GalleryPhoto();
        photo.setId(photoId);
        photo.setIsPublic(true);
        User owner = new User();
        owner.setId(999L);
        photo.setUser(owner);

        when(galleryPhotoRepository.findById(photoId))
            .thenReturn(Optional.of(photo));
        when(photoLikeRepository.existsByPhotoIdAndUserId(photoId, userId))
            .thenReturn(true); // Already liked

        // Act & Assert
        assertThrows(IllegalStateException.class, () -> {
            photoLikeService.likePhoto(photoId, userId);
        });

        verify(photoLikeRepository, never()).save(any());
    }
}
```

---

### Test Type 2: Integration Tests (6 tests)

**File:** `backend/.../test/.../PhotoLikeControllerIntegrationTest.java`

**Purpose:** Test Controller + Service **interaction** without database

**Characteristics:**
- ✅ **NO real database** - services are @MockBean
- ✅ **Tests HTTP layer** - request/response, status codes
- ✅ **Uses MockMvc** - simulates HTTP requests
- ✅ **Fast** (<500ms total)

**Test Cases:**

1. **testLikePhoto_Returns201Created()**
   - Given: Valid photo ID, valid JWT token
   - When: POST /api/gallery/photo/123/like
   - Then: Returns 201 Created

2. **testLikePhoto_Returns404NotFound()**
   - Given: Photo ID doesn't exist (service throws IllegalArgumentException)
   - When: POST /api/gallery/photo/999/like
   - Then: Returns 404 Not Found

3. **testLikePhoto_Returns401Unauthorized()**
   - Given: No Authorization header
   - When: POST /api/gallery/photo/123/like
   - Then: Returns 401 Unauthorized

4. **testUnlikePhoto_Returns204NoContent()**
   - Given: Valid photo ID, user has liked it
   - When: DELETE /api/gallery/photo/123/like
   - Then: Returns 204 No Content

5. **testGetLikedPhotos_Returns200WithPhotos()**
   - Given: User has liked photos
   - When: GET /api/gallery/liked-photos?page=0&size=12
   - Then: Returns 200 OK with paginated photos

6. **testGetLikedPhotos_Returns200EmptyPage()**
   - Given: User hasn't liked any photos
   - When: GET /api/gallery/liked-photos
   - Then: Returns 200 OK with empty content array

**Example Test:**

```java
@WebMvcTest(PhotoLikeController.class)
class PhotoLikeControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PhotoLikeService photoLikeService;

    @MockBean
    private JwtUtil jwtUtil;

    private String validToken = "Bearer valid.jwt.token";

    @Test
    void testLikePhoto_Returns201Created() throws Exception {
        // Arrange
        Long photoId = 123L;
        Long userId = 45L;

        when(jwtUtil.extractUserId(anyString())).thenReturn(userId);
        doNothing().when(photoLikeService).likePhoto(photoId, userId);

        // Act & Assert
        mockMvc.perform(post("/api/gallery/photo/" + photoId + "/like")
                .header("Authorization", validToken))
            .andExpect(status().isCreated());
    }

    @Test
    void testLikePhoto_Returns401Unauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(post("/api/gallery/photo/123/like"))
            .andExpect(status().isUnauthorized());
    }
}
```

---

### Test Type 3: API Tests (8 tests)

**File:** `tests/api/photo-likes.api.spec.ts`

**Purpose:** Test **complete backend cycle** with **REAL PostgreSQL database**

**Characteristics:**
- ✅ **REAL database** (PostgreSQL)
- ✅ **Full backend flow** (Controller → Service → Repository → Database)
- ✅ **Playwright API testing** (NOT manual Postman!)
- ✅ **Automated** - runs in CI/CD
- ✅ **Data cleanup** after each test

**Test Cases:**

1. **POST /like - should like photo successfully**
   - Arrange: Create test user + public photo
   - Act: POST /api/gallery/photo/{id}/like with JWT
   - Assert: 201 Created, photo appears in liked photos, like count increases

2. **POST /like - should prevent duplicate like**
   - Arrange: Like photo once
   - Act: Like same photo again
   - Assert: 409 Conflict

3. **POST /like - should return 404 for invalid photo**
   - Act: POST /api/gallery/photo/99999/like
   - Assert: 404 Not Found

4. **POST /like - should prevent liking own photo**
   - Arrange: Create photo with current user as owner
   - Act: Try to like own photo
   - Assert: 403 Forbidden

5. **DELETE /like - should unlike photo successfully**
   - Arrange: Like photo first
   - Act: DELETE /api/gallery/photo/{id}/like
   - Assert: 204 No Content, photo removed from liked photos

6. **DELETE /like - should return error if not liked**
   - Act: DELETE /api/gallery/photo/{id}/like (not liked)
   - Assert: 400 Bad Request

7. **GET /liked-photos - should return user's liked photos**
   - Arrange: Like 3 photos
   - Act: GET /api/gallery/liked-photos
   - Assert: Returns 3 photos, ordered by most recent

8. **API - should require authentication**
   - Act: POST /like without Authorization header
   - Assert: 401 Unauthorized

**Example Test:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Photo Likes API', () => {
  let authToken: string;
  let userId: number;
  let photoId: number;

  test.beforeEach(async ({ request }) => {
    // Create test user and get token
    const registerResponse = await request.post('/api/auth/register', {
      data: {
        fullName: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Password123!',
        confirmPassword: 'Password123!'
      }
    });

    const { token, user } = await registerResponse.json();
    authToken = token;
    userId = user.id;

    // Create test photo (by another user)
    // ... create photo logic
    photoId = createdPhoto.id;
  });

  test('POST /like - should like photo successfully', async ({ request }) => {
    // Act: Like photo
    const response = await request.post(`/api/gallery/photo/${photoId}/like`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    // Assert: 201 Created
    expect(response.status()).toBe(201);

    // Verify in database via API
    const likedPhotos = await request.get('/api/gallery/liked-photos', {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    const body = await likedPhotos.json();
    expect(body.content).toHaveLength(1);
    expect(body.content[0].id).toBe(photoId);
  });

  test('POST /like - should prevent duplicate like', async ({ request }) => {
    // Arrange: Like once
    await request.post(`/api/gallery/photo/${photoId}/like`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    // Act: Try to like again
    const response = await request.post(`/api/gallery/photo/${photoId}/like`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    // Assert: 409 Conflict
    expect(response.status()).toBe(409);
  });
});
```

---

### Test Type 4: E2E Tests (10 tests)

**File:** `tests/e2e/photo-likes.spec.ts`

**Purpose:** Test **complete user journey** through browser (FE + BE + DB)

**Characteristics:**
- ✅ **Browser automation** (real Chrome/Firefox)
- ✅ **Full stack** (Frontend → Backend → Database)
- ✅ **User interactions** (clicks, navigation)
- ✅ **Visual verification** (button states, counts)
- ✅ **Slow** (~30 seconds total) but comprehensive

**Test Cases:**

1. **should like photo from gallery view**
   - Navigate to gallery → Click like button → Verify heart fills → Verify count increases

2. **should unlike photo from gallery view**
   - Like photo → Click like button again → Verify heart empties → Verify count decreases

3. **should like photo from detail view**
   - Click photo → Open detail page → Click like button → Verify liked

4. **should show like count after liking**
   - Like photo → Verify "1 like" displayed → Like another → Verify "2 likes"

5. **should persist like after page refresh**
   - Like photo → Refresh page → Verify still liked (filled heart)

6. **should show liked photo in Liked Photos page**
   - Like photo → Navigate to Liked Photos → Verify photo appears

7. **should handle multiple like/unlike cycles**
   - Like → Unlike → Like → Unlike → Final state correct

8. **should show optimistic update**
   - Click like → Verify UI updates instantly (< 50ms) → Verify API confirms

9. **should rollback on error**
   - Simulate API error → Click like → Verify UI reverts → Show error message

10. **unauthenticated user cannot like**
    - Logout → View photo → Verify like button disabled or hidden

**Example Test:**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Photo Likes E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login
    await page.goto('/register');
    // ... registration flow
    await page.goto('/home/gallery');
  });

  test('should like photo from gallery view', async ({ page }) => {
    // Find first photo card
    const photoCard = page.locator('.photo-card').first();
    const likeButton = photoCard.locator('button[aria-label*="Like"]');
    const likeCount = photoCard.locator('.like-count');

    // Get initial count
    const initialCount = await likeCount.textContent();

    // Click like button
    await likeButton.click();

    // Verify heart icon filled (visual check)
    await expect(likeButton.locator('svg')).toHaveClass(/fill-red-500/);

    // Verify count increased
    const newCount = await likeCount.textContent();
    expect(parseInt(newCount)).toBe(parseInt(initialCount) + 1);
  });

  test('should persist like after page refresh', async ({ page }) => {
    // Like photo
    const likeButton = page.locator('.photo-card').first().locator('button[aria-label*="Like"]');
    await likeButton.click();

    // Wait for API to complete
    await page.waitForTimeout(500);

    // Refresh page
    await page.reload();

    // Verify still liked (heart filled)
    await expect(likeButton.locator('svg')).toHaveClass(/fill-red-500/);
  });

  test('should show liked photo in Liked Photos page', async ({ page }) => {
    // Like a photo
    const photoCard = page.locator('.photo-card').first();
    const photoTitle = await photoCard.locator('.photo-title').textContent();
    await photoCard.locator('button[aria-label*="Like"]').click();

    // Navigate to Liked Photos
    await page.click('text=Liked Photos');

    // Verify photo appears
    await expect(page.locator(`.photo-card:has-text("${photoTitle}")`)).toBeVisible();
  });
});
```

---

## Security Considerations

### Authentication & Authorization

1. **JWT Required:** All endpoints require valid JWT token
2. **User Verification:** User ID extracted from JWT (not from request body)
3. **Owner Validation:** Users cannot like their own photos
4. **Privacy Enforcement:** Only public photos can be liked

### Data Integrity

1. **Unique Constraint:** Database prevents duplicate likes (photo_id, user_id)
2. **Foreign Keys:** CASCADE delete maintains data consistency
3. **Transactions:** `@Transactional` ensures atomicity

### Input Validation

1. **Photo ID:** Validated in service layer (exists, is public)
2. **User ID:** Extracted from trusted JWT token
3. **Pagination:** Default values prevent invalid params

### CORS Configuration

```java
@CrossOrigin(origins = "http://localhost:3005")
```

Only frontend origin allowed.

---

## Performance Optimizations

### Database

1. **Indexes:**
   - `idx_photo_likes_photo_id` - Fast like count queries
   - `idx_photo_likes_user_id` - Fast user's liked photos
   - `idx_photo_likes_created_at` - Fast ordering

2. **Query Optimization:**
   - `existsByPhotoIdAndUserId` - More efficient than find for boolean check
   - `countByPhotoId` - Direct count query (no entity loading)

3. **Lazy Loading:**
   - `@ManyToOne(fetch = FetchType.LAZY)` - Don't load unless needed

### Frontend

1. **Optimistic Updates:**
   - UI updates before API confirms (feels instant)
   - Rollback on error

2. **Pagination:**
   - Load 12 photos at a time (not all)
   - Prevents slow page loads

3. **Debouncing:**
   - Prevent rapid like/unlike clicks during API call

---

**Next Document:** [Daily Checklist](checklist.md)

**Ready to implement! 🚀**
