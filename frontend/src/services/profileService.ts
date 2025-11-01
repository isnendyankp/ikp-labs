/**
 * Profile Service untuk Profile Picture Upload/Delete
 *
 * Service ini handle:
 * - Upload profile picture (multipart/form-data)
 * - Delete profile picture
 * - JWT token management
 * - Error handling
 * - Type safety
 */

import {
  ProfilePictureResponse,
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
 * Create headers for API requests (without Content-Type for FormData)
 */
const createAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = {};

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// === PROFILE PICTURE API FUNCTIONS ===

/**
 * Upload profile picture (protected)
 * POST /api/profile/upload-picture
 *
 * @param file - Image file to upload (JPEG, PNG, GIF)
 * @returns ProfilePictureResponse with new picture URL
 */
export async function uploadProfilePicture(
  file: File
): Promise<ApiResponse<ProfilePictureResponse>> {
  console.log('🚀 Uploading profile picture:', {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  });

  const token = getToken();
  if (!token) {
    return {
      error: {
        message: 'No authentication token found. Please login first.',
        errorCode: 'UNAUTHORIZED'
      },
      status: 401,
    };
  }

  try {
    // Create FormData untuk multipart/form-data request
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/profile/upload-picture`, {
      method: 'POST',
      headers: createAuthHeaders(), // Tidak include Content-Type, browser akan set otomatis
      body: formData,
      credentials: 'include',
    });

    const responseText = await response.text();
    let data: ProfilePictureResponse | ApiError;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error('Invalid response format');
    }

    if (response.ok) {
      console.log('✅ Profile picture uploaded successfully:', data);
      return {
        data: data as ProfilePictureResponse,
        status: response.status,
      };
    } else {
      console.error('❌ Upload failed:', data);
      return {
        error: data as ApiError,
        status: response.status,
      };
    }
  } catch (error) {
    console.error('❌ Upload request failed:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Network error occurred',
        errorCode: 'NETWORK_ERROR'
      },
      status: 0,
    };
  }
}

/**
 * Delete profile picture (protected)
 * DELETE /api/profile/delete-picture
 *
 * @returns ProfilePictureResponse with null picture URL
 */
export async function deleteProfilePicture(): Promise<ApiResponse<ProfilePictureResponse>> {
  console.log('🚀 Deleting profile picture');

  const token = getToken();
  if (!token) {
    return {
      error: {
        message: 'No authentication token found. Please login first.',
        errorCode: 'UNAUTHORIZED'
      },
      status: 401,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/profile/delete-picture`, {
      method: 'DELETE',
      headers: {
        ...createAuthHeaders(),
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const responseText = await response.text();
    let data: ProfilePictureResponse | ApiError;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error('Invalid response format');
    }

    if (response.ok) {
      console.log('✅ Profile picture deleted successfully:', data);
      return {
        data: data as ProfilePictureResponse,
        status: response.status,
      };
    } else {
      console.error('❌ Delete failed:', data);
      return {
        error: data as ApiError,
        status: response.status,
      };
    }
  } catch (error) {
    console.error('❌ Delete request failed:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Network error occurred',
        errorCode: 'NETWORK_ERROR'
      },
      status: 0,
    };
  }
}

/**
 * Get current user's profile picture (protected)
 * GET /api/profile/picture
 *
 * @returns ProfilePictureResponse with current user's picture info
 */
export async function getCurrentProfilePicture(): Promise<ApiResponse<ProfilePictureResponse>> {
  const token = getToken();
  if (!token) {
    return {
      error: {
        message: 'Not authenticated',
        errorCode: 'UNAUTHORIZED'
      },
      status: 401,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/profile/picture`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error('❌ Get picture request failed:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Network error occurred',
        errorCode: 'NETWORK_ERROR'
      },
      status: 0,
    };
  }
}

/**
 * Get profile picture URL for display
 *
 * @param picturePath - Path from backend (e.g., "profiles/user-83.jpg")
 * @returns Full URL or null
 */
export function getProfilePictureUrl(picturePath: string | null): string | null {
  if (!picturePath) {
    return null;
  }

  return `${API_BASE_URL}/uploads/${picturePath}`;
}

/**
 * Validate image file before upload
 *
 * @param file - File to validate
 * @returns Error message or null if valid
 */
export function validateImageFile(file: File): string | null {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Only JPEG, PNG, and GIF images are allowed';
  }

  if (file.size > MAX_SIZE) {
    return 'File size must be less than 5MB';
  }

  return null;
}

// === EXPORT DEFAULT ===

const profileService = {
  uploadProfilePicture,
  deleteProfilePicture,
  getCurrentProfilePicture,
  getProfilePictureUrl,
  validateImageFile,
};

export default profileService;
