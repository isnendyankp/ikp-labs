/**
 * Gallery Service - API Communication untuk Gallery Feature
 *
 * Service ini handle:
 * - Upload photo (POST /api/gallery)
 * - Get user photos (GET /api/gallery/user/{userId})
 * - Get public photos (GET /api/gallery/public)
 * - Get photo by ID (GET /api/gallery/{id})
 * - Update photo (PUT /api/gallery/{id})
 * - Delete photo (DELETE /api/gallery/{id})
 * - JWT authentication untuk protected endpoints
 */

import {
  GalleryPhoto,
  GalleryPhotoResponse,
  GalleryPhotoDetailResponse,
  GalleryListResponse,
  GalleryUpdateRequest,
  ApiResponse,
  ApiError
} from '../types/api';
import { createAuthHeaders } from '../lib/apiClient';

// === CONFIGURATION ===

const API_BASE_URL = 'http://localhost:8081';

// === UTILITY FUNCTIONS ===

/**
 * Create headers for FormData requests (no Content-Type)
 * Browser akan meng-set Content-Type dengan boundary otomatis untuk FormData
 */
const createFormDataHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Accept': 'application/json',
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// === API FUNCTIONS ===

/**
 * Upload photo to gallery
 * POST /api/gallery/upload
 *
 * @param file - Image file to upload
 * @param title - Optional title
 * @param description - Optional description
 * @param isPublic - Privacy setting
 */
export async function uploadPhoto(
  file: File,
  title?: string,
  description?: string,
  isPublic: boolean = false
): Promise<ApiResponse<GalleryPhotoResponse>> {
  console.log('🚀 Uploading photo:', { fileName: file.name, title, isPublic });

  try {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    formData.append('isPublic', String(isPublic));

    const response = await fetch(`${API_BASE_URL}/api/gallery/upload`, {
      method: 'POST',
      headers: createFormDataHeaders(),
      body: formData,
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Photo uploaded successfully:', data);
      return { data, status: response.status };
    } else {
      console.error('❌ Upload failed:', data);
      return { error: data as ApiError, status: response.status };
    }
  } catch (error) {
    console.error('❌ Upload error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Upload failed',
        errorCode: 'UPLOAD_ERROR'
      },
      status: 0,
    };
  }
}

/**
 * Get user's photos with pagination and sorting
 * GET /api/gallery/my-photos?page=0&size=12&sortBy=newest
 *
 * Returns GalleryListResponse with photos array and pagination metadata
 *
 * @param userId - User ID (not used, kept for compatibility)
 * @param page - Page number (0-indexed)
 * @param size - Items per page (default: 12)
 * @param sortBy - Sort option (default: newest)
 */
export async function getUserPhotos(
  userId: number,
  page: number = 0,
  size: number = 12,
  sortBy: string = 'newest'
): Promise<ApiResponse<GalleryListResponse>> {
  console.log('🚀 Fetching user photos:', { userId, page, size, sortBy });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/gallery/my-photos?page=${page}&size=${size}&sortBy=${sortBy}`,
      {
        method: 'GET',
        headers: createFormDataHeaders(),
        credentials: 'include',
      }
    );

    const listResponse = await response.json();

    if (response.ok) {
      // Backend returns GalleryListResponse object with photos array AND pagination metadata
      console.log('✅ Photos fetched:', listResponse.photos?.length || 0, 'Page:', listResponse.currentPage, 'Total pages:', listResponse.totalPages);
      return { data: listResponse, status: response.status };
    } else {
      console.error('❌ Fetch failed:', listResponse);
      return { error: listResponse as ApiError, status: response.status };
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch photos',
        errorCode: 'FETCH_ERROR'
      },
      status: 0,
    };
  }
}

/**
 * Get public photos with pagination and sorting
 * GET /api/gallery/public?page=0&size=12&sortBy=newest
 *
 * Returns GalleryListResponse with photos array and pagination metadata
 *
 * @param page - Page number (0-indexed)
 * @param size - Items per page (default: 12)
 * @param sortBy - Sort option (default: newest)
 */
export async function getPublicPhotos(
  page: number = 0,
  size: number = 12,
  sortBy: string = 'newest'
): Promise<ApiResponse<GalleryListResponse>> {
  console.log('🚀 Fetching public photos:', { page, size, sortBy });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/gallery/public?page=${page}&size=${size}&sortBy=${sortBy}`,
      {
        method: 'GET',
        headers: createFormDataHeaders(),
        credentials: 'include',
      }
    );

    const listResponse = await response.json();

    if (response.ok) {
      // Backend returns GalleryListResponse object with photos array AND pagination metadata
      console.log('✅ Public photos fetched:', listResponse.photos?.length || 0, 'Page:', listResponse.currentPage, 'Total pages:', listResponse.totalPages);
      return { data: listResponse, status: response.status };
    } else {
      console.error('❌ Fetch failed:', listResponse);
      return { error: listResponse as ApiError, status: response.status };
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch photos',
        errorCode: 'FETCH_ERROR'
      },
      status: 0,
    };
  }
}

/**
 * Get photo by ID
 * GET /api/gallery/photo/{id}
 *
 * @param photoId - Photo ID
 */
export async function getPhotoById(
  photoId: number
): Promise<ApiResponse<GalleryPhotoDetailResponse>> {
  console.log('🚀 Fetching photo:', photoId);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/gallery/photo/${photoId}`,
      {
        method: 'GET',
        headers: createFormDataHeaders(),
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Photo fetched:', data);
      return { data, status: response.status };
    } else {
      console.error('❌ Fetch failed:', data);
      return { error: data as ApiError, status: response.status };
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to fetch photo',
        errorCode: 'FETCH_ERROR'
      },
      status: 0,
    };
  }
}

/**
 * Update photo metadata
 * PUT /api/gallery/photo/{id}
 *
 * @param photoId - Photo ID
 * @param updates - Fields to update
 */
export async function updatePhoto(
  photoId: number,
  updates: GalleryUpdateRequest
): Promise<ApiResponse<GalleryPhotoResponse>> {
  console.log('🚀 Updating photo:', { photoId, updates });

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/gallery/photo/${photoId}`,
      {
        method: 'PUT',
        headers: createAuthHeaders(),
        body: JSON.stringify(updates),
        credentials: 'include',
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Photo updated:', data);
      return { data, status: response.status };
    } else {
      console.error('❌ Update failed:', data);
      return { error: data as ApiError, status: response.status };
    }
  } catch (error) {
    console.error('❌ Update error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to update photo',
        errorCode: 'UPDATE_ERROR'
      },
      status: 0,
    };
  }
}

/**
 * Delete photo
 * DELETE /api/gallery/photo/{id}
 *
 * Backend returns 204 No Content (empty response body)
 *
 * @param photoId - Photo ID
 */
export async function deletePhoto(
  photoId: number
): Promise<ApiResponse<GalleryPhotoResponse>> {
  console.log('🚀 Deleting photo:', photoId);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/gallery/photo/${photoId}`,
      {
        method: 'DELETE',
        headers: createFormDataHeaders(),
        credentials: 'include',
      }
    );

    if (response.ok) {
      // Backend returns 204 No Content - no JSON body to parse
      console.log('✅ Photo deleted successfully');
      return { data: {} as GalleryPhotoResponse, status: response.status };
    } else {
      // Error responses should have JSON body
      const data = await response.json();
      console.error('❌ Delete failed:', data);
      return { error: data as ApiError, status: response.status };
    }
  } catch (error) {
    console.error('❌ Delete error:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to delete photo',
        errorCode: 'DELETE_ERROR'
      },
      status: 0,
    };
  }
}

/**
 * Get photo URL for display
 * Backend stores: "gallery/user-X/photo-Y.jpg"
 * Spring serves from: "/uploads/**"
 * So we need: http://localhost:8081/uploads/gallery/user-X/photo-Y.jpg
 *
 * @param filePath - Path from GalleryPhoto.filePath (e.g., "gallery/user-132/photo-1.jpg")
 */
export function getPhotoUrl(filePath: string): string {
  // Add "uploads/" prefix if not already present
  const path = filePath.startsWith('uploads/') ? filePath : `uploads/${filePath}`;
  return `${API_BASE_URL}/${path}`;
}

// === EXPORT DEFAULT ===

const galleryService = {
  uploadPhoto,
  getUserPhotos,
  getPublicPhotos,
  getPhotoById,
  updatePhoto,
  deletePhoto,
  getPhotoUrl,
};

export default galleryService;
