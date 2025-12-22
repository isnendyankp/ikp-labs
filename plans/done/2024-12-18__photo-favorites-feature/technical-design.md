# Photo Favorites Feature - Technical Design Document

**Feature:** Photo Favorites
**Version:** 1.0
**Last Updated:** December 18, 2024
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
│  ┌────────────────┐  ┌───────────────────┐  ┌──────────────┐│
│  │ FavoriteButton │  │FavoritedPhotosPage│  │ favoritesSvc ││
│  │   Component    │  │     Component     │  │ (API Client) ││
│  └──────┬─────────┘  └──────┬────────────┘  └──────┬───────┘│
│         │                    │                      │        │
│         └────────────────────┴──────────────────────┘        │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP/REST (JWT)
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                    Backend (Spring Boot)                     │
│  ┌──────────────────────────────────────────────────────────┤
│  │  PhotoFavoriteController                                 │
│  │  - POST /api/gallery/photo/{id}/favorite                 │
│  │  - DELETE /api/gallery/photo/{id}/favorite               │
│  │  - GET /api/gallery/favorited-photos                     │
│  └──────────────────┬───────────────────────────────────────┘
│                     │
│  ┌──────────────────▼───────────────────────────────────────┐
│  │  PhotoFavoriteService (Business Logic)                   │
│  │  - favoritePhoto(photoId, userId)                        │
│  │  - unfavoritePhoto(photoId, userId)                      │
│  │  - getFavoritedPhotos(userId, pageable)                  │
│  │  - isFavoritedByUser(photoId, userId)                    │
│  └──────────────────┬───────────────────────────────────────┘
│                     │
│  ┌──────────────────▼───────────────────────────────────────┐
│  │  PhotoFavoriteRepository (Data Access)                   │
│  │  - Spring Data JPA                                       │
│  │  - Custom queries                                        │
│  └──────────────────┬───────────────────────────────────────┘
└────────────────────┬────────────────────────────────────────┘
                     │ SQL
┌────────────────────▼────────────────────────────────────────┐
│               PostgreSQL Database                            │
│  ┌──────────────────────────────────────────────────────────┤
│  │  photo_favorites table                                   │
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

### Photo Favorites Table

**Table Name:** `photo_favorites`

**Purpose:** Store favorite/bookmark relationships between users and photos (PRIVATE collection)

```sql
CREATE TABLE photo_favorites (
    id BIGSERIAL PRIMARY KEY,
    photo_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign keys
    CONSTRAINT fk_photo_favorites_photo
        FOREIGN KEY (photo_id)
        REFERENCES gallery_photos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_photo_favorites_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    -- Unique constraint (prevent duplicate favorites)
    CONSTRAINT uk_photo_favorites_photo_user
        UNIQUE (photo_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_photo_favorites_photo_id ON photo_favorites(photo_id);
CREATE INDEX idx_photo_favorites_user_id ON photo_favorites(user_id);
CREATE INDEX idx_photo_favorites_created_at ON photo_favorites(created_at DESC);
```

**Column Descriptions:**

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| `id` | BIGSERIAL | NO | Primary key, auto-increment |
| `photo_id` | BIGINT | NO | Foreign key to gallery_photos.id |
| `user_id` | BIGINT | NO | Foreign key to users.id (owner of favorite) |
| `created_at` | TIMESTAMP | NO | When the favorite was created (for ordering) |

**Constraints:**
1. **Primary Key:** `id` - Unique identifier for each favorite
2. **Foreign Key:** `photo_id` → `gallery_photos(id)` ON DELETE CASCADE
3. **Foreign Key:** `user_id` → `users(id)` ON DELETE CASCADE
4. **Unique Constraint:** `(photo_id, user_id)` - Prevent duplicate favorites

**Indexes:**
1. `idx_photo_favorites_photo_id` - Fast lookups by photo
2. `idx_photo_favorites_user_id` - Fast lookups by user (for favorited photos page)
3. `idx_photo_favorites_created_at` - Fast ordering by most recent

**Cascade Behavior:**
- If a photo is deleted → All favorites for that photo are deleted
- If a user is deleted → All favorites by that user are deleted

**Key Difference from photo_likes:**
- No public counter (favorites are private)
- Used for bookmarking, not social engagement
- User CAN favorite their own photos

---

### Flyway Migration Script

**File:** `backend/ikp-labs-api/src/main/resources/db/migration/V4__create_photo_favorites.sql`

```sql
-- V4: Create photo_favorites table for Photo Favorites feature
-- Created: December 18, 2024

CREATE TABLE photo_favorites (
    id BIGSERIAL PRIMARY KEY,
    photo_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_photo_favorites_photo
        FOREIGN KEY (photo_id)
        REFERENCES gallery_photos(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_photo_favorites_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_photo_favorites_photo_user
        UNIQUE (photo_id, user_id)
);

CREATE INDEX idx_photo_favorites_photo_id ON photo_favorites(photo_id);
CREATE INDEX idx_photo_favorites_user_id ON photo_favorites(user_id);
CREATE INDEX idx_photo_favorites_created_at ON photo_favorites(created_at DESC);

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

photo_favorites (NEW)
  ├── id (PK)
  ├── photo_id (FK → gallery_photos.id) ──┐
  ├── user_id (FK → users.id) ────────────┼─ UNIQUE(photo_id, user_id)
  └── created_at                           ┘

photo_likes (existing - from last week)
  ├── id (PK)
  ├── photo_id (FK → gallery_photos.id)
  ├── user_id (FK → users.id)
  └── created_at
```

**Relationships:**
- `photo_favorites.photo_id` → Many favorites point to ONE photo
- `photo_favorites.user_id` → Many favorites created by ONE user
- **Many-to-Many** between `users` and `gallery_photos` (through `photo_favorites`)
- **Coexists with photo_likes** - same photo can be both liked AND favorited

---

## Backend Design

### Layer Architecture

```
Controller Layer (REST API)
    │
    ├── PhotoFavoriteController.java
    │   - Handles HTTP requests
    │   - JWT authentication
    │   - Request validation
    │   - Response formatting
    │   - Privacy enforcement
    │
    ▼
Service Layer (Business Logic)
    │
    ├── PhotoFavoriteService.java
    │   - Core business rules
    │   - Transaction management
    │   - Error handling
    │   - Validation logic
    │   - Privacy logic
    │
    ▼
Repository Layer (Data Access)
    │
    ├── PhotoFavoriteRepository.java
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

**File:** `backend/.../entity/PhotoFavorite.java`

```java
package com.registrationform.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "photo_favorites", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"photo_id", "user_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoFavorite {

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
- `@Entity` - JPA entity mapped to `photo_favorites` table
- `@UniqueConstraint` - Enforces one favorite per user per photo
- `@ManyToOne` - Relationship to GalleryPhoto and User
- `@PrePersist` - Automatically sets `createdAt` on insert
- `FetchType.LAZY` - Performance optimization (don't load unless needed)

---

### Repository Interface

**File:** `backend/.../repository/PhotoFavoriteRepository.java`

```java
package com.registrationform.api.repository;

import com.registrationform.api.entity.PhotoFavorite;
import com.registrationform.api.entity.GalleryPhoto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PhotoFavoriteRepository extends JpaRepository<PhotoFavorite, Long> {

    /**
     * Find a favorite by photo ID and user ID
     * Used to check if user already favorited a photo
     */
    Optional<PhotoFavorite> findByPhotoIdAndUserId(Long photoId, Long userId);

    /**
     * Check if user has favorited a photo
     * More efficient than findBy when you only need boolean
     */
    boolean existsByPhotoIdAndUserId(Long photoId, Long userId);

    /**
     * Get all favorited photos for a user (paginated)
     * Ordered by most recently favorited first
     * PRIVACY: Only returns photos favorited by THIS user
     */
    @Query("SELECT pf.photo FROM PhotoFavorite pf WHERE pf.user.id = :userId ORDER BY pf.createdAt DESC")
    Page<GalleryPhoto> findFavoritedPhotosByUserId(Long userId, Pageable pageable);

    /**
     * Delete a favorite by photo ID and user ID
     * Used for unfavorite operation
     */
    void deleteByPhotoIdAndUserId(Long photoId, Long userId);
}
```

**Method Naming Convention:**
- `findByPhotoIdAndUserId` - Spring Data JPA auto-generates query
- `existsByPhotoIdAndUserId` - Returns boolean (more efficient than find)
- `@Query` - Custom JPQL for complex queries

**Privacy Note:**
- No method to get ALL favorites across users (private by design)
- No method to count favorites per photo (no public counter)

---

### Service Class

**File:** `backend/.../service/PhotoFavoriteService.java`

```java
package com.registrationform.api.service;

import com.registrationform.api.entity.GalleryPhoto;
import com.registrationform.api.entity.PhotoFavorite;
import com.registrationform.api.entity.User;
import com.registrationform.api.repository.GalleryPhotoRepository;
import com.registrationform.api.repository.PhotoFavoriteRepository;
import com.registrationform.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PhotoFavoriteService {

    private final PhotoFavoriteRepository photoFavoriteRepository;
    private final GalleryPhotoRepository galleryPhotoRepository;
    private final UserRepository userRepository;

    /**
     * Favorite a photo
     *
     * @param photoId ID of photo to favorite
     * @param userId ID of user favoriting the photo
     * @throws IllegalArgumentException if photo not found or not accessible
     * @throws IllegalStateException if already favorited
     */
    @Transactional
    public void favoritePhoto(Long photoId, Long userId) {
        // Validate photo exists
        GalleryPhoto photo = galleryPhotoRepository.findById(photoId)
            .orElseThrow(() -> new IllegalArgumentException("Photo not found"));

        // Privacy check: User can favorite if:
        // 1. Photo is public, OR
        // 2. User is the photo owner (can favorite own photos!)
        if (!photo.getIsPublic() && !photo.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("Cannot favorite private photos of other users");
        }

        // Check if already favorited
        if (photoFavoriteRepository.existsByPhotoIdAndUserId(photoId, userId)) {
            throw new IllegalStateException("Photo already favorited");
        }

        // Get user
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Create and save favorite
        PhotoFavorite photoFavorite = new PhotoFavorite();
        photoFavorite.setPhoto(photo);
        photoFavorite.setUser(user);
        photoFavoriteRepository.save(photoFavorite);
    }

    /**
     * Unfavorite a photo
     *
     * @param photoId ID of photo to unfavorite
     * @param userId ID of user unfavoriting the photo
     * @throws IllegalArgumentException if photo not found or not favorited
     */
    @Transactional
    public void unfavoritePhoto(Long photoId, Long userId) {
        // Validate photo exists
        if (!galleryPhotoRepository.existsById(photoId)) {
            throw new IllegalArgumentException("Photo not found");
        }

        // Check if favorited
        if (!photoFavoriteRepository.existsByPhotoIdAndUserId(photoId, userId)) {
            throw new IllegalArgumentException("Photo not favorited");
        }

        // Delete favorite
        photoFavoriteRepository.deleteByPhotoIdAndUserId(photoId, userId);
    }

    /**
     * Get all photos favorited by a user
     * PRIVACY: Only returns favorites for THIS user (not visible to others)
     *
     * @param userId ID of user
     * @param pageable Pagination parameters
     * @return Page of favorited photos
     */
    @Transactional(readOnly = true)
    public Page<GalleryPhoto> getFavoritedPhotos(Long userId, Pageable pageable) {
        return photoFavoriteRepository.findFavoritedPhotosByUserId(userId, pageable);
    }

    /**
     * Check if user has favorited a photo
     *
     * @param photoId ID of photo
     * @param userId ID of user
     * @return true if favorited, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean isFavoritedByUser(Long photoId, Long userId) {
        return photoFavoriteRepository.existsByPhotoIdAndUserId(photoId, userId);
    }
}
```

**Business Logic Highlights:**
1. **Privacy Validation:** User can favorite public photos OR own photos
2. **Can Favorite Own Photos:** Unlike Likes, users CAN favorite their own photos
3. **Duplicate Prevention:** Check if already favorited
4. **Transactions:** `@Transactional` ensures atomicity
5. **Error Handling:** Clear exception messages

**Key Difference from PhotoLikeService:**
- No "cannot favorite own photo" restriction
- Privacy check allows own photos
- No public counter logic

---

### Controller Class

**File:** `backend/.../controller/PhotoFavoriteController.java`

```java
package com.registrationform.api.controller;

import com.registrationform.api.dto.PhotoResponse;
import com.registrationform.api.entity.GalleryPhoto;
import com.registrationform.api.service.JwtUtil;
import com.registrationform.api.service.PhotoFavoriteService;
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
@CrossOrigin(origins = "http://localhost:3002")
public class PhotoFavoriteController {

    private final PhotoFavoriteService photoFavoriteService;
    private final PhotoLikeService photoLikeService;
    private final JwtUtil jwtUtil;

    /**
     * Favorite a photo
     * POST /api/gallery/photo/{photoId}/favorite
     * PRIVACY: Only current user can favorite (user ID from JWT)
     */
    @PostMapping("/photo/{photoId}/favorite")
    public ResponseEntity<Void> favoritePhoto(
            @PathVariable Long photoId,
            @RequestHeader("Authorization") String token) {

        // Extract user ID from JWT
        String jwt = token.substring(7); // Remove "Bearer "
        Long userId = jwtUtil.extractUserId(jwt);

        // Favorite photo
        photoFavoriteService.favoritePhoto(photoId, userId);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * Unfavorite a photo
     * DELETE /api/gallery/photo/{photoId}/favorite
     * PRIVACY: Only current user can unfavorite their own favorites
     */
    @DeleteMapping("/photo/{photoId}/favorite")
    public ResponseEntity<Void> unfavoritePhoto(
            @PathVariable Long photoId,
            @RequestHeader("Authorization") String token) {

        // Extract user ID from JWT
        String jwt = token.substring(7);
        Long userId = jwtUtil.extractUserId(jwt);

        // Unfavorite photo
        photoFavoriteService.unfavoritePhoto(photoId, userId);

        return ResponseEntity.noContent().build();
    }

    /**
     * Get all favorited photos for current user
     * GET /api/gallery/favorited-photos?page=0&size=12
     * PRIVACY: Only returns favorites for current user (from JWT)
     */
    @GetMapping("/favorited-photos")
    public ResponseEntity<Page<PhotoResponse>> getFavoritedPhotos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestHeader("Authorization") String token) {

        // Extract user ID from JWT
        String jwt = token.substring(7);
        Long userId = jwtUtil.extractUserId(jwt);

        // Get favorited photos (ONLY for this user!)
        Pageable pageable = PageRequest.of(page, size);
        Page<GalleryPhoto> favoritedPhotos = photoFavoriteService.getFavoritedPhotos(userId, pageable);

        // Convert to DTOs with both like and favorite status
        Page<PhotoResponse> response = favoritedPhotos.map(photo ->
            convertToPhotoResponse(photo, userId)
        );

        return ResponseEntity.ok(response);
    }

    /**
     * Helper method to convert GalleryPhoto to PhotoResponse DTO
     * Includes both like and favorite status for current user
     */
    private PhotoResponse convertToPhotoResponse(GalleryPhoto photo, Long currentUserId) {
        PhotoResponse response = new PhotoResponse();
        response.setId(photo.getId());
        response.setPhotoUrl(photo.getPhotoUrl());
        response.setTitle(photo.getTitle());
        response.setDescription(photo.getDescription());
        response.setIsPublic(photo.getIsPublic());
        response.setUploadDate(photo.getUploadDate());
        response.setUserId(photo.getUser().getId());
        response.setUserFullName(photo.getUser().getFullName());

        // Add like status (public)
        response.setLikeCount(photoLikeService.getLikeCount(photo.getId()));
        response.setIsLikedByCurrentUser(photoLikeService.isLikedByUser(photo.getId(), currentUserId));

        // Add favorite status (private - only for current user)
        response.setIsFavoritedByCurrentUser(photoFavoriteService.isFavoritedByUser(photo.getId(), currentUserId));

        return response;
    }
}
```

**HTTP Status Codes:**
- `201 Created` - Photo favorited successfully
- `204 No Content` - Photo unfavorited successfully
- `200 OK` - Favorited photos retrieved
- `400 Bad Request` - Invalid request (handled by exception handler)
- `401 Unauthorized` - No/invalid JWT token
- `404 Not Found` - Photo not found
- `409 Conflict` - Already favorited (handled by exception handler)

**Privacy Enforcement:**
- User ID always from JWT (never from request body)
- Only current user's favorites returned
- No endpoint to view other users' favorites

---

## Frontend Design

### Component Architecture

```
App
 └── HomeLayout
      ├── Sidebar/Navigation
      │    ├── "Liked Photos" link (existing)
      │    └── "Favorited Photos" link ← NEW
      │
      ├── GalleryPage
      │    └── GalleryPhotoCard[]
      │         ├── Photo Image
      │         ├── Photo Info
      │         ├── LikeButton (existing - heart ❤️)
      │         └── FavoriteButton ← NEW (star ⭐)
      │
      ├── PhotoDetailPage
      │    ├── Large Photo Display
      │    ├── Photo Metadata
      │    ├── LikeButton (existing)
      │    └── FavoriteButton ← NEW
      │
      ├── LikedPhotosPage (existing)
      │    └── Shows liked photos
      │
      └── FavoritedPhotosPage ← NEW
           ├── Page Header
           ├── Photo Grid
           │    └── GalleryPhotoCard[]
           │         ├── LikeButton
           │         └── FavoriteButton (already favorited)
           └── Pagination
```

---

### FavoriteButton Component

**File:** `frontend/src/components/FavoriteButton.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react'; // Icon library
import { favoritePhoto, unfavoritePhoto } from '@/services/photoFavoriteService';

interface FavoriteButtonProps {
  photoId: number;
  initialIsFavorited: boolean;
  onFavoriteChange?: (favorited: boolean) => void;
}

export default function FavoriteButton({
  photoId,
  initialIsFavorited,
  onFavoriteChange
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteToggle = async () => {
    // Prevent multiple clicks
    if (isLoading) return;

    // Optimistic update
    const previousIsFavorited = isFavorited;

    setIsFavorited(!isFavorited);
    setIsLoading(true);

    try {
      if (!isFavorited) {
        await favoritePhoto(photoId);
      } else {
        await unfavoritePhoto(photoId);
      }

      // Success - optimistic update was correct
      onFavoriteChange?.(!isFavorited);

    } catch (error) {
      // Rollback on error
      setIsFavorited(previousIsFavorited);

      console.error('Failed to toggle favorite:', error);
      alert('Failed to favorite photo. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavoriteToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 transition-colors ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-yellow-500'
      }`}
      aria-label={isFavorited ? 'Unfavorite photo' : 'Favorite photo'}
      title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Star
        className={`w-6 h-6 transition-all ${
          isFavorited ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
        }`}
      />
    </button>
  );
}
```

**Key Features:**
- ✅ Optimistic updates (instant UI feedback)
- ✅ Rollback on error
- ✅ Loading state (prevent double-clicks)
- ✅ Accessibility (aria-label, title tooltip)
- ✅ Clear visual states (outline vs filled star)
- ✅ Different color from Like button (yellow/gold vs red)

**Visual Design:**
- Unfavorited: Outline star (gray)
- Favorited: Filled star (yellow/gold)
- Position: Next to like button

---

### API Service

**File:** `frontend/src/services/photoFavoriteService.ts`

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
 * Favorite a photo
 * POST /api/gallery/photo/{photoId}/favorite
 */
export async function favoritePhoto(photoId: number): Promise<void> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/gallery/photo/${photoId}/favorite`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to favorite photo');
  }
}

/**
 * Unfavorite a photo
 * DELETE /api/gallery/photo/{photoId}/favorite
 */
export async function unfavoritePhoto(photoId: number): Promise<void> {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}/api/gallery/photo/${photoId}/favorite`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to unfavorite photo');
  }
}

/**
 * Get favorited photos for current user
 * GET /api/gallery/favorited-photos?page=0&size=12
 * PRIVACY: Only returns current user's favorites
 */
export async function getFavoritedPhotos(page: number = 0, size: number = 12) {
  const token = getAuthToken();

  const response = await fetch(
    `${API_BASE_URL}/api/gallery/favorited-photos?page=${page}&size=${size}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch favorited photos');
  }

  return response.json();
}
```

---

### Favorited Photos Page

**File:** `frontend/src/app/home/favorited-photos/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getFavoritedPhotos } from '@/services/photoFavoriteService';
import GalleryPhotoCard from '@/components/GalleryPhotoCard';
import Pagination from '@/components/Pagination';

export default function FavoritedPhotosPage() {
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavoritedPhotos();
  }, [currentPage]);

  async function loadFavoritedPhotos() {
    setIsLoading(true);
    try {
      const data = await getFavoritedPhotos(currentPage, 12);
      setPhotos(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Failed to load favorited photos:', error);
      alert('Failed to load favorited photos');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading your favorites...</div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⭐</div>
        <h2 className="text-2xl font-bold mb-4">No Favorited Photos Yet</h2>
        <p className="text-gray-600 mb-2">
          Start exploring and save photos to your favorites!
        </p>
        <p className="text-sm text-gray-500">
          Tip: Click the star icon on any photo to add it to your collection
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Favorited Photos</h1>
        <p className="text-gray-600">
          Your private collection • {photos.length} photo{photos.length !== 1 ? 's' : ''} on this page
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photos.map((photo) => (
          <GalleryPhotoCard
            key={photo.id}
            photo={photo}
            onFavoriteChange={() => loadFavoritedPhotos()} // Reload on unfavorite
          />
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

### API Endpoint 1: Favorite Photo

**Endpoint:** `POST /api/gallery/photo/{photoId}/favorite`

**Description:** Add a photo to favorites (private bookmark)

**Authentication:** Required (JWT token in header)

**Request:**
```http
POST /api/gallery/photo/123/favorite HTTP/1.1
Host: localhost:8081
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**Response Success (201 Created):**
```http
HTTP/1.1 201 Created
```

**Response Error (409 Conflict - Already Favorited):**
```http
HTTP/1.1 409 Conflict
Content-Type: text/plain

Photo already favorited
```

**Response Error (403 Forbidden - Private Photo):**
```http
HTTP/1.1 403 Forbidden
Content-Type: text/plain

Cannot favorite private photos of other users
```

**Response Error (404 Not Found):**
```http
HTTP/1.1 404 Not Found
Content-Type: text/plain

Photo not found
```

---

### API Endpoint 2: Unfavorite Photo

**Endpoint:** `DELETE /api/gallery/photo/{photoId}/favorite`

**Description:** Remove a photo from favorites

**Authentication:** Required (JWT)

**Request:**
```http
DELETE /api/gallery/photo/123/favorite HTTP/1.1
Host: localhost:8081
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

**Response Success (204 No Content):**
```http
HTTP/1.1 204 No Content
```

**Response Error (400 Bad Request - Not Favorited):**
```http
HTTP/1.1 400 Bad Request
Content-Type: text/plain

Photo not favorited
```

---

### API Endpoint 3: Get Favorited Photos

**Endpoint:** `GET /api/gallery/favorited-photos?page=0&size=12`

**Description:** Get all photos favorited by current user (PRIVATE - paginated)

**Authentication:** Required (JWT)

**Request:**
```http
GET /api/gallery/favorited-photos?page=0&size=12 HTTP/1.1
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
      "uploadDate": "2024-12-18T10:00:00",
      "userId": 45,
      "userFullName": "John Doe",
      "likeCount": 15,
      "isLikedByCurrentUser": true,
      "isFavoritedByCurrentUser": true
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

**File:** `backend/.../test/.../PhotoFavoriteServiceTest.java`

**Purpose:** Test PhotoFavoriteService business logic in **complete isolation**

**Characteristics:**
- ✅ **NO database** - all repositories mocked with Mockito
- ✅ **Fast execution** (<100ms total)
- ✅ **Tests business rules** only
- ✅ **High confidence** in service logic

**Test Cases:**

1. **testFavoritePhoto_Success()**
   - Given: Valid photo, valid user, photo is public (or user is owner)
   - When: favoritePhoto() called
   - Then: photoFavoriteRepository.save() called once

2. **testFavoritePhoto_CanFavoriteOwnPhoto()**
   - Given: Photo owner_id == current user_id
   - When: favoritePhoto() called
   - Then: Photo is favorited successfully (no error)

3. **testFavoritePhoto_PhotoNotFound()**
   - Given: Photo ID doesn't exist (repository returns empty)
   - When: favoritePhoto() called
   - Then: IllegalArgumentException thrown with "Photo not found"

4. **testFavoritePhoto_PrivatePhotoNotOwner()**
   - Given: Photo is_public = false AND photo owner_id ≠ current user_id
   - When: favoritePhoto() called
   - Then: IllegalArgumentException thrown with "Cannot favorite private photos of other users"

5. **testFavoritePhoto_AlreadyFavorited()**
   - Given: existsByPhotoIdAndUserId() returns true
   - When: favoritePhoto() called
   - Then: IllegalStateException thrown with "Photo already favorited"

6. **testUnfavoritePhoto_Success()**
   - Given: Photo exists, user has favorited it
   - When: unfavoritePhoto() called
   - Then: deleteByPhotoIdAndUserId() called once

7. **testUnfavoritePhoto_NotFavorited()**
   - Given: existsByPhotoIdAndUserId() returns false
   - When: unfavoritePhoto() called
   - Then: IllegalArgumentException thrown with "Photo not favorited"

8. **testGetFavoritedPhotos_ReturnsUserFavorites()**
   - Given: User has favorited 3 photos
   - When: getFavoritedPhotos() called
   - Then: Returns Page with 3 photos

**Example Test:**

```java
@ExtendWith(MockitoExtension.class)
class PhotoFavoriteServiceTest {

    @Mock
    private PhotoFavoriteRepository photoFavoriteRepository;

    @Mock
    private GalleryPhotoRepository galleryPhotoRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PhotoFavoriteService photoFavoriteService;

    @Test
    void testFavoritePhoto_CanFavoriteOwnPhoto() {
        // Arrange
        Long photoId = 1L;
        Long userId = 2L;

        GalleryPhoto photo = new GalleryPhoto();
        photo.setId(photoId);
        photo.setIsPublic(true);

        User owner = new User();
        owner.setId(userId); // SAME as current user
        photo.setUser(owner);

        User currentUser = new User();
        currentUser.setId(userId);

        when(galleryPhotoRepository.findById(photoId))
            .thenReturn(Optional.of(photo));
        when(userRepository.findById(userId))
            .thenReturn(Optional.of(currentUser));
        when(photoFavoriteRepository.existsByPhotoIdAndUserId(photoId, userId))
            .thenReturn(false);

        // Act
        photoFavoriteService.favoritePhoto(photoId, userId);

        // Assert
        verify(photoFavoriteRepository, times(1)).save(any(PhotoFavorite.class));
        // NO exception thrown - can favorite own photo!
    }

    @Test
    void testFavoritePhoto_PrivatePhotoNotOwner() {
        // Arrange
        Long photoId = 1L;
        Long userId = 2L;
        Long ownerId = 999L; // Different user

        GalleryPhoto photo = new GalleryPhoto();
        photo.setId(photoId);
        photo.setIsPublic(false); // PRIVATE
        User owner = new User();
        owner.setId(ownerId);
        photo.setUser(owner);

        when(galleryPhotoRepository.findById(photoId))
            .thenReturn(Optional.of(photo));

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            photoFavoriteService.favoritePhoto(photoId, userId);
        });

        verify(photoFavoriteRepository, never()).save(any());
    }
}
```

---

### Test Type 2: Integration Tests (6 tests)

**File:** `backend/.../test/.../PhotoFavoriteControllerIntegrationTest.java`

**Purpose:** Test Controller + Service **interaction** without database

**Test Cases:**

1. **testFavoritePhoto_Returns201Created()**
2. **testFavoritePhoto_Returns404NotFound()**
3. **testFavoritePhoto_Returns401Unauthorized()**
4. **testUnfavoritePhoto_Returns204NoContent()**
5. **testGetFavoritedPhotos_Returns200WithPhotos()**
6. **testGetFavoritedPhotos_Returns200EmptyPage()**

---

### Test Type 3: API Tests (8 tests)

**File:** `tests/api/photo-favorites.api.spec.ts`

**Purpose:** Test **complete backend cycle** with **REAL PostgreSQL database**

**Test Cases:**

1. **POST /favorite - should favorite photo successfully**
2. **POST /favorite - should allow favoriting own photo**
3. **POST /favorite - should prevent duplicate favorite**
4. **POST /favorite - should return 404 for invalid photo**
5. **POST /favorite - should prevent favoriting private photo of others**
6. **DELETE /favorite - should unfavorite photo successfully**
7. **GET /favorited-photos - should return user's favorited photos (private)**
8. **API - should require authentication**

---

### Test Type 4: E2E Tests (10 tests)

**File:** `tests/e2e/photo-favorites.spec.ts`

**Purpose:** Test **complete user journey** through browser (FE + BE + DB)

**Test Cases:**

1. **should favorite photo from gallery view**
2. **should unfavorite photo from gallery view**
3. **should favorite own photo**
4. **should favorite photo from detail view**
5. **should persist favorite after page refresh**
6. **should show favorited photo in Favorited Photos page**
7. **should handle multiple favorite/unfavorite cycles**
8. **should show optimistic update**
9. **should work independently from likes (both buttons on same photo)**
10. **unauthenticated user cannot favorite**

---

## Security Considerations

### Authentication & Authorization

1. **JWT Required:** All endpoints require valid JWT token
2. **User Verification:** User ID extracted from JWT (not from request body)
3. **Privacy Enforcement:** Users can only see their own favorites
4. **Photo Access:** Can favorite public photos OR own photos (regardless of privacy)

### Privacy Protection

1. **No Public Counter:** Favorites are not counted publicly
2. **No "Who Favorited" Endpoint:** No way to see who favorited a photo
3. **User Favorites Private:** No endpoint to view other users' favorites
4. **API Enforcement:** Privacy enforced at controller level

### Data Integrity

1. **Unique Constraint:** Database prevents duplicate favorites (photo_id, user_id)
2. **Foreign Keys:** CASCADE delete maintains data consistency
3. **Transactions:** `@Transactional` ensures atomicity

### Input Validation

1. **Photo ID:** Validated in service layer (exists, accessible)
2. **User ID:** Extracted from trusted JWT token
3. **Pagination:** Default values prevent invalid params

### CORS Configuration

```java
@CrossOrigin(origins = "http://localhost:3002")
```

Only frontend origin allowed.

---

## Performance Optimizations

### Database

1. **Indexes:**
   - `idx_photo_favorites_photo_id` - Fast lookups by photo
   - `idx_photo_favorites_user_id` - Fast user's favorited photos
   - `idx_photo_favorites_created_at` - Fast ordering

2. **Query Optimization:**
   - `existsByPhotoIdAndUserId` - More efficient than find for boolean check

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
   - Prevent rapid favorite/unfavorite clicks during API call

---

**Next Document:** [Daily Checklist](checklist.md)

**Ready to implement! 🚀**
