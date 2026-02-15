/**
 * Centralized API Client for Frontend Services
 *
 * Provides:
 * - JWT token management (get, save, remove)
 * - Auth headers creation
 * - Centralized fetch utilities
 *
 * Purpose: Eliminate duplicate auth logic across service files
 */

// === CONFIGURATION ===

const API_BASE_URL = "http://localhost:8081";
const TOKEN_KEY = "authToken";

// === TOKEN MANAGEMENT ===

/**
 * Get JWT token from localStorage
 *
 * @returns JWT token string or null if not found
 */
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Save JWT token to localStorage
 *
 * @param token - JWT token string from backend
 */
export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Remove JWT token from localStorage (logout)
 */
export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// === HEADERS MANAGEMENT ===

/**
 * Create headers for API requests
 *
 * @param includeAuth - Whether to include Authorization header
 * @returns HeadersInit object with Content-Type, Accept, and optionally Authorization
 */
export function createHeaders(includeAuth = false): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Create headers for authenticated API requests
 * Convenience wrapper that always includes auth
 *
 * @returns HeadersInit object with Authorization header
 */
export function createAuthHeaders(): HeadersInit {
  return createHeaders(true);
}

// === FETCH WRAPPERS ===

/**
 * Generic fetch with authentication
 *
 * @param url - API endpoint path (will be appended to API_BASE_URL)
 * @param options - Fetch options (method, body, etc.)
 * @returns Fetch response
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    credentials: "include", // Important for CORS
    headers: {
      ...createHeaders(true),
      ...options.headers,
    },
  });
}

/**
 * Generic fetch without authentication
 *
 * @param url - API endpoint path
 * @param options - Fetch options
 * @returns Fetch response
 */
export async function fetchWithoutAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    credentials: "include",
    headers: {
      ...createHeaders(false),
      ...options.headers,
    },
  });
}

/**
 * Create headers for FormData requests (without Content-Type)
 *
 * Browser automatically sets Content-Type with boundary for FormData.
 * This function creates headers with optional auth for FormData requests.
 *
 * @returns HeadersInit with Authorization (if token exists) and Accept
 */
export function createFormDataHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}
