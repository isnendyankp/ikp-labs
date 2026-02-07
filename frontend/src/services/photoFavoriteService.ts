/**
 * Photo Favorite Service - API Communication untuk Photo Favorite Feature
 *
 * Service ini handle:
 * - Favorite photo (POST /api/gallery/photo/{id}/favorite)
 * - Unfavorite photo (DELETE /api/gallery/photo/{id}/favorite)
 * - Get favorited photos (GET /api/gallery/favorited-photos)
 * - JWT authentication untuk semua endpoints
 *
 * ANALOGI SEDERHANA:
 * ==================
 * Bayangkan YouTube "Save to Watch Later" atau Browser Bookmarks:
 * - User klik ☆ (empty star) → API call favoritePhoto() → Server save favorite → ⭐ (filled star)
 * - User klik ⭐ lagi → API call unfavoritePhoto() → Server delete favorite → ☆ (empty star)
 * - User buka "Favorited Photos" → API call getFavoritedPhotos() → Server return semua foto favorit
 *
 * KEY DIFFERENCES dari Photo Like Service:
 * ========================================
 * Photo Likes (PUBLIC appreciation):
 * - Icon: Heart ❤️
 * - Visibility: PUBLIC (everyone sees like count)
 * - Business Rule: CANNOT like own photos
 * - Use Case: "I appreciate this photo!"
 * - Endpoint: /api/gallery/photo/{id}/like
 *
 * Photo Favorites (PRIVATE bookmarks):
 * - Icon: Star ⭐
 * - Visibility: PRIVATE (only you see your favorites)
 * - Business Rule: CAN favorite own photos
 * - Use Case: "Save for later / Personal collection"
 * - Endpoint: /api/gallery/photo/{id}/favorite
 */

import {
  GalleryListResponse,
  ApiResponse,
  ApiError
} from '../types/api';
import { createAuthHeaders } from '../lib/apiClient';

// === CONFIGURATION ===

const API_BASE_URL = 'http://localhost:8081';

// === API FUNCTIONS ===

/**
 * Favorite a photo
 * POST /api/gallery/photo/{photoId}/favorite
 *
 * Validation (handled by backend):
 * - Photo must exist
 * - Photo must be public OR user is owner (privacy check)
 * - User CAN favorite their own photos (KEY DIFFERENCE from likes!)
 * - User cannot favorite same photo twice
 *
 * HTTP Status Codes:
 * - 201 Created: Favorite saved successfully
 * - 400 Bad Request: Validation failed (private photo of other user)
 * - 404 Not Found: Photo doesn't exist
 * - 409 Conflict: Already favorited
 * - 401 Unauthorized: No JWT token
 *
 * @param photoId - ID of photo to favorite
 * @returns ApiResponse with empty data (backend returns 201 with no body)
 */
export async function favoritePhoto(
  photoId: number
): Promise<ApiResponse<void>> {
  console.log('⭐ Favoriting photo:', photoId);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/gallery/photo/${photoId}/favorite`,
      {
        method: 'POST',
        headers: createAuthHeaders(),
        credentials: 'include',
      }
    );

    // Backend returns 201 Created with empty body
    if (response.ok) {
      console.log('✅ Photo favorited successfully:', photoId);
      return { data: undefined, status: response.status };
    } else {
      // Error responses have JSON body
      const errorData = await response.json();
      console.error('❌ Favorite failed:', errorData);
      return { error: errorData as ApiError, status: response.status };
    }
  } catch (error) {
    console.error('❌ Favorite error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to favorite photo',
        errorCode: 'FAVORITE_ERROR'
      },
      status: 0,
    };
  }
}

/**
 * Unfavorite a photo
 * DELETE /api/gallery/photo/{photoId}/favorite
 *
 * Validation (handled by backend):
 * - Photo must exist
 * - User must have favorited this photo before
 *
 * HTTP Status Codes:
 * - 204 No Content: Unfavorite successful
 * - 400 Bad Request: Photo not favorited by user
 * - 404 Not Found: Photo doesn't exist
 * - 401 Unauthorized: No JWT token
 *
 * @param photoId - ID of photo to unfavorite
 * @returns ApiResponse with empty data (backend returns 204 No Content)
 */
export async function unfavoritePhoto(
  photoId: number
): Promise<ApiResponse<void>> {
  console.log('⭐→☆ Unfavoriting photo:', photoId);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/gallery/photo/${photoId}/favorite`,
      {
        method: 'DELETE',
        headers: createAuthHeaders(),
        credentials: 'include',
      }
    );

    // Backend returns 204 No Content with empty body
    if (response.ok) {
      console.log('✅ Photo unfavorited successfully:', photoId);
      return { data: undefined, status: response.status };
    } else {
      // Error responses have JSON body
      const errorData = await response.json();
      console.error('❌ Unfavorite failed:', errorData);
      return { error: errorData as ApiError, status: response.status };
    }
  } catch (error) {
    console.error('❌ Unfavorite error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to unfavorite photo',
        errorCode: 'UNFAVORITE_ERROR'
      },
      status: 0,
    };
  }
}

/**
 * Get favorited photos for current user
 * GET /api/gallery/favorited-photos?page=0&size=12
 *
 * Returns paginated list of photos favorited by current user.
 * Photos ordered by most recently favorited first.
 *
 * PRIVACY ENFORCEMENT:
 * - Only returns CURRENT user's favorites (from JWT)
 * - Other users CANNOT see this list
 * - 100% private collection
 *
 * HTTP Status Codes:
 * - 200 OK: Success, returns GalleryListResponse
 * - 401 Unauthorized: No JWT token
 *
 * Response Structure:
 * {
 *   "photos": [...],
 *   "currentPage": 0,
 *   "totalPages": 3,
 *   "totalPhotos": 25,
 *   "pageSize": 12,
 *   "hasNext": true,
 *   "hasPrevious": false
 * }
 *
 * @param page - Page number (0-indexed, default: 0)
 * @param size - Items per page (default: 12)
 * @param sortBy - Sort option (default: newest)
 * @returns ApiResponse with GalleryListResponse
 */
export async function getFavoritedPhotos(
  page: number = 0,
  size: number = 12,
  sortBy: string = 'newest'
): Promise<ApiResponse<GalleryListResponse>> {
  console.log('🚀 Fetching favorited photos:', { page, size, sortBy });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/gallery/favorited-photos?page=${page}&size=${size}&sortBy=${sortBy}`,
      {
        method: 'GET',
        headers: createAuthHeaders(),
        credentials: 'include',
      }
    );

    const listResponse = await response.json();

    if (response.ok) {
      // Backend returns GalleryListResponse with photos array and pagination metadata
      console.log(
        '✅ Favorited photos fetched:',
        listResponse.photos?.length || 0,
        'Page:',
        listResponse.currentPage,
        'Total:',
        listResponse.totalPhotos
      );
      return { data: listResponse, status: response.status };
    } else {
      console.error('❌ Fetch favorited photos failed:', listResponse);
      return { error: listResponse as ApiError, status: response.status };
    }
  } catch (error) {
    console.error('❌ Fetch favorited photos error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch favorited photos',
        errorCode: 'FETCH_ERROR'
      },
      status: 0,
    };
  }
}

// === EXPORT DEFAULT ===

const photoFavoriteService = {
  favoritePhoto,
  unfavoritePhoto,
  getFavoritedPhotos,
};

export default photoFavoriteService;
