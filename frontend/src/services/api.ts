/**
 * API Service untuk Frontend-Backend Communication
 *
 * Service ini handle:
 * - HTTP requests ke backend (localhost:8081)
 * - CORS headers
 * - JWT token management
 * - Error handling
 * - Type safety
 */

import {
  UserRegistrationRequest,
  UserRegistrationResponse,
  LoginRequest,
  LoginResponse,
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
 * Save JWT token to localStorage
 */
const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

/**
 * Remove JWT token from localStorage
 */
const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

/**
 * Create headers for API requests
 */
const createHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Generic API request handler with error handling
 */
async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      credentials: 'include', // Important for CORS with cookies/auth
      headers: {
        ...createHeaders(false),
        ...options.headers,
      },
    });

    const responseText = await response.text();
    let data: T | ApiError;

    try {
      data = JSON.parse(responseText);
    } catch {
      // If response is not JSON, treat as error
      throw new Error('Invalid response format');
    }

    if (response.ok) {
      return {
        data: data as T,
        status: response.status,
      };
    } else {
      return {
        error: data as ApiError,
        status: response.status,
      };
    }
  } catch (error) {
    console.error('API Request failed:', error);
    return {
      error: {
        message: error instanceof Error ? error.message : 'Network error occurred',
        errorCode: 'NETWORK_ERROR'
      },
      status: 0,
    };
  }
}

// === API FUNCTIONS ===

/**
 * Register new user
 * POST /api/users
 */
export async function registerUser(
  userData: UserRegistrationRequest
): Promise<ApiResponse<UserRegistrationResponse>> {
  console.log('🚀 Registering user:', { email: userData.email, fullName: userData.fullName });

  const response = await apiRequest<UserRegistrationResponse>('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

  if (response.data) {
    console.log('✅ Registration successful:', response.data);
  } else if (response.error) {
    console.error('❌ Registration failed:', response.error);
  }

  return response;
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function loginUser(
  credentials: LoginRequest
): Promise<ApiResponse<LoginResponse>> {
  console.log('🚀 Logging in user:', { email: credentials.email });

  const response = await apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

  if (response.data?.success && response.data.token) {
    console.log('✅ Login successful, saving token');
    saveToken(response.data.token);
  } else if (response.error) {
    console.error('❌ Login failed:', response.error);
  }

  return response;
}

/**
 * Logout user (client-side)
 */
export function logoutUser(): void {
  console.log('🚀 Logging out user');
  removeToken();
  console.log('✅ Token removed');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token;
}

/**
 * Get current auth token
 */
export function getAuthToken(): string | null {
  return getToken();
}

// === PROTECTED API FUNCTIONS ===
// Functions yang memerlukan JWT token

/**
 * Get user profile (protected)
 * GET /api/users/{id}
 */
export async function getUserProfile(userId: number): Promise<ApiResponse<UserRegistrationResponse>> {
  console.log('🚀 Getting user profile:', userId);

  const token = getToken();
  if (!token) {
    return {
      error: {
        message: 'No authentication token found',
        errorCode: 'UNAUTHORIZED'
      },
      status: 401,
    };
  }

  const response = await apiRequest<UserRegistrationResponse>(`/api/users/${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (response.data) {
    console.log('✅ Profile retrieved:', response.data);
  } else if (response.error) {
    console.error('❌ Profile retrieval failed:', response.error);

    // If token is invalid, remove it
    if (response.status === 401 || response.status === 403) {
      removeToken();
    }
  }

  return response;
}

// === EXPORT DEFAULT ===

const apiService = {
  registerUser,
  loginUser,
  logoutUser,
  isAuthenticated,
  getAuthToken,
  getUserProfile,
};

export default apiService;