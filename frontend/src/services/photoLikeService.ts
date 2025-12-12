/**
 * Photo Like Service - API Communication untuk Photo Like Feature
 *
 * Service ini handle:
 * - Like photo (POST /api/gallery/photo/{id}/like)
 * - Unlike photo (DELETE /api/gallery/photo/{id}/like)
 * - Get liked photos (GET /api/gallery/liked-photos)
 * - JWT authentication untuk semua endpoints
 *
 * ANALOGI SEDERHANA:
 * ==================
 * Bayangkan Instagram Like Service:
 * - User klik ♡ (empty heart) → API call likePhoto() → Server save like → ❤️ (filled heart)
 * - User klik ❤️ lagi → API call unlikePhoto() → Server delete like → ♡ (empty heart)
 * - User buka "Liked Photos" → API call getLikedPhotos() → Server return semua foto yang di-like
 */

import {
  GalleryListResponse,
  ApiResponse,
  ApiError
} from '../types/api';

// === CONFIGURATION ===

const API_BASE_URL = 'http://localhost:8081';

// === UTILITY FUNCTIONS ===

/**
 * Get JWT token from localStorage
 */
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

/**
 * Create headers with JWT token
 */
const createAuthHeaders = (): HeadersInit => {
  const token = getToken();
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// === API FUNCTIONS ===

/**
 * Like a photo
 * POST /api/gallery/photo/{photoId}/like
 *
 * Validation (handled by backend):
 * - Photo must exist
 * - Photo must be public (can't like private photos)
 * - User cannot like their own photo
 * - User cannot like same photo twice
 *
 * HTTP Status Codes:
 * - 201 Created: Like saved successfully
 * - 400 Bad Request: Validation failed (private photo, own photo)
 * - 404 Not Found: Photo doesn't exist
 * - 409 Conflict: Already liked
 * - 401 Unauthorized: No JWT token
 *
 * @param photoId - ID of photo to like
 * @returns ApiResponse with empty data (backend returns 201 with no body)
 */
export async function likePhoto(
  photoId: number
): Promise<ApiResponse<void>> {
  console.log('❤️ Liking photo:', photoId);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/gallery/photo/${photoId}/like`,
      {
        method: 'POST',
        headers: createAuthHeaders(),
        credentials: 'include',
      }
    );

    // Backend returns 201 Created with empty body
    if (response.ok) {
      console.log('✅ Photo liked successfully:', photoId);
      return { data: undefined, status: response.status };
    } else {
      // Error responses have JSON body
      const errorData = await response.json();
      console.error('❌ Like failed:', errorData);
      return { error: errorData as ApiError, status: response.status };
    }
  } catch (error) {
    console.error('❌ Like error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to like photo',
        errorCode: 'LIKE_ERROR'
      },
      status: 0,
    };
  }
}

/**
 * Unlike a photo
 * DELETE /api/gallery/photo/{photoId}/like
 *
 * Validation (handled by backend):
 * - Photo must exist
 * - User must have liked this photo before
 *
 * HTTP Status Codes:
 * - 204 No Content: Unlike successful
 * - 400 Bad Request: Photo not liked by user
 * - 404 Not Found: Photo doesn't exist
 * - 401 Unauthorized: No JWT token
 *
 * @param photoId - ID of photo to unlike
 * @returns ApiResponse with empty data (backend returns 204 No Content)
 */
export async function unlikePhoto(
  photoId: number
): Promise<ApiResponse<void>> {
  console.log('💔 Unliking photo:', photoId);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/gallery/photo/${photoId}/like`,
      {
        method: 'DELETE',
        headers: createAuthHeaders(),
        credentials: 'include',
      }
    );

    // Backend returns 204 No Content with empty body
    if (response.ok) {
      console.log('✅ Photo unliked successfully:', photoId);
      return { data: undefined, status: response.status };
    } else {
      // Error responses have JSON body
      const errorData = await response.json();
      console.error('❌ Unlike failed:', errorData);
      return { error: errorData as ApiError, status: response.status };
    }
  } catch (error) {
    console.error('❌ Unlike error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to unlike photo',
        errorCode: 'UNLIKE_ERROR'
      },
      status: 0,
    };
  }
}

/**
 * Get liked photos for current user
 * GET /api/gallery/liked-photos?page=0&size=12
 *
 * Returns paginated list of photos liked by current user.
 * Photos ordered by most recently liked first.
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
 * @returns ApiResponse with GalleryListResponse
 */
export async function getLikedPhotos(
  page: number = 0,
  size: number = 12
): Promise<ApiResponse<GalleryListResponse>> {
  console.log('🚀 Fetching liked photos:', { page, size });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/gallery/liked-photos?page=${page}&size=${size}`,
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
        '✅ Liked photos fetched:',
        listResponse.photos?.length || 0,
        'Page:',
        listResponse.currentPage,
        'Total:',
        listResponse.totalPhotos
      );
      return { data: listResponse, status: response.status };
    } else {
      console.error('❌ Fetch liked photos failed:', listResponse);
      return { error: listResponse as ApiError, status: response.status };
    }
  } catch (error) {
    console.error('❌ Fetch liked photos error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch liked photos',
        errorCode: 'FETCH_ERROR'
      },
      status: 0,
    };
  }
}

// === EXPORT DEFAULT ===

const photoLikeService = {
  likePhoto,
  unlikePhoto,
  getLikedPhotos,
};

export default photoLikeService;
