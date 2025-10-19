/**
 * Authentication Utilities
 *
 * Provides JWT token management for frontend authentication.
 * Uses localStorage for token storage (beginner-friendly approach).
 *
 * Key Functions:
 * - saveToken: Store JWT token in localStorage
 * - getToken: Retrieve JWT token from localStorage
 * - logout: Remove token from localStorage
 * - isAuthenticated: Check if user has valid token
 * - getUserFromToken: Decode JWT and extract user information
 */

import { AuthUser } from '../types/api';

const TOKEN_KEY = 'authToken';

/**
 * Save JWT token to localStorage
 *
 * @param token - JWT token string from backend
 */
export function saveToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

/**
 * Get JWT token from localStorage
 *
 * @returns JWT token string or null if not found
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

/**
 * Remove JWT token from localStorage (logout)
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Check if user is authenticated
 *
 * Verifies:
 * 1. Token exists in localStorage
 * 2. Token has valid JWT format (3 parts)
 * 3. Token is not expired
 *
 * @returns true if authenticated with valid token, false otherwise
 */
export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;

  try {
    // Decode token to check expiration
    const payload = decodeToken(token);
    const now = Date.now() / 1000; // Convert to seconds

    // Check if token is expired
    return payload.exp > now;
  } catch {
    // If decoding fails, token is invalid
    return false;
  }
}

/**
 * Decode JWT token and extract user information
 *
 * Note: This is CLIENT-SIDE decoding only (no signature verification).
 * Token signature is verified by backend on API requests.
 * This function only reads the payload to display user info.
 *
 * @returns AuthUser object or null if token is invalid
 */
export function getUserFromToken(): AuthUser | null {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = decodeToken(token);

    return {
      id: 0, // Not in token, will be fetched from API if needed
      email: payload.email,
      fullName: payload.fullName,
      token: token
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Decode JWT payload (without signature verification)
 *
 * JWT structure: header.payload.signature
 * We only decode the payload part (middle section)
 *
 * @param token - Complete JWT token string
 * @returns Decoded payload object
 */
function decodeToken(token: string): {
  email: string;
  fullName: string;
  exp: number;
  iat: number;
  sub: string;
} {
  // Split JWT into parts (header.payload.signature)
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  // Decode base64 payload (second part)
  const payload = parts[1];
  const decodedPayload = atob(payload); // atob = base64 decode

  return JSON.parse(decodedPayload);
}

/**
 * Get user's full name from token
 *
 * @returns User's full name or null if not found
 */
export function getFullName(): string | null {
  const user = getUserFromToken();
  return user?.fullName || null;
}

/**
 * Get user's email from token
 *
 * @returns User's email or null if not found
 */
export function getEmail(): string | null {
  const user = getUserFromToken();
  return user?.email || null;
}
