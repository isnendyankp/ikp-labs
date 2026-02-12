/**
 * Unit Tests for apiClient.ts
 *
 * Testing Philosophy: NO MOCKING
 * - Uses real localStorage from JSDOM (not mocked)
 * - Tests pure functions directly
 * - Does NOT test fetchWithAuth/fetchWithoutAuth (network calls - tested in API tests)
 */

import {
  getToken,
  saveToken,
  removeToken,
  createHeaders,
  createAuthHeaders,
  createFormDataHeaders,
} from '../apiClient';

describe('apiClient', () => {
  const TOKEN_KEY = 'authToken';

  beforeEach(() => {
    // Clear localStorage before each test (not mocking, just cleanup)
    localStorage.clear();
  });

  // ============================================
  // Token Management Tests
  // ============================================

  describe('getToken', () => {
    it('should return null when no token exists', () => {
      expect(getToken()).toBeNull();
    });

    it('should return the token when it exists', () => {
      localStorage.setItem(TOKEN_KEY, 'test-token-123');
      expect(getToken()).toBe('test-token-123');
    });

    it('should return null after token is removed', () => {
      localStorage.setItem(TOKEN_KEY, 'test-token');
      localStorage.removeItem(TOKEN_KEY);
      expect(getToken()).toBeNull();
    });
  });

  describe('saveToken', () => {
    it('should save token to localStorage', () => {
      saveToken('my-jwt-token');
      expect(localStorage.getItem(TOKEN_KEY)).toBe('my-jwt-token');
    });

    it('should overwrite existing token', () => {
      saveToken('first-token');
      saveToken('second-token');
      expect(localStorage.getItem(TOKEN_KEY)).toBe('second-token');
    });

    it('should handle empty string token', () => {
      saveToken('');
      expect(localStorage.getItem(TOKEN_KEY)).toBe('');
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem(TOKEN_KEY, 'token-to-remove');
      removeToken();
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    });

    it('should not throw when no token exists', () => {
      expect(() => removeToken()).not.toThrow();
    });
  });

  // ============================================
  // Headers Management Tests
  // ============================================

  describe('createHeaders', () => {
    it('should return headers without auth when includeAuth is false', () => {
      const headers = createHeaders(false);
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });
    });

    it('should return headers without auth by default', () => {
      const headers = createHeaders();
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });
      expect(headers).not.toHaveProperty('Authorization');
    });

    it('should include Authorization header when includeAuth is true and token exists', () => {
      localStorage.setItem(TOKEN_KEY, 'my-auth-token');
      const headers = createHeaders(true);
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer my-auth-token',
      });
    });

    it('should not include Authorization header when includeAuth is true but no token', () => {
      const headers = createHeaders(true);
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });
      expect(headers).not.toHaveProperty('Authorization');
    });
  });

  describe('createAuthHeaders', () => {
    it('should return headers with Authorization when token exists', () => {
      localStorage.setItem(TOKEN_KEY, 'auth-token-xyz');
      const headers = createAuthHeaders();
      expect(headers).toHaveProperty('Authorization', 'Bearer auth-token-xyz');
      expect(headers).toHaveProperty('Content-Type', 'application/json');
      expect(headers).toHaveProperty('Accept', 'application/json');
    });

    it('should return headers without Authorization when no token', () => {
      const headers = createAuthHeaders();
      expect(headers).not.toHaveProperty('Authorization');
      expect(headers).toHaveProperty('Content-Type', 'application/json');
      expect(headers).toHaveProperty('Accept', 'application/json');
    });
  });

  describe('createFormDataHeaders', () => {
    it('should return headers with Authorization when token exists', () => {
      localStorage.setItem(TOKEN_KEY, 'form-token');
      const headers = createFormDataHeaders();
      expect(headers).toEqual({
        'Accept': 'application/json',
        'Authorization': 'Bearer form-token',
      });
      // FormData headers should NOT include Content-Type (browser sets it)
      expect(headers).not.toHaveProperty('Content-Type');
    });

    it('should return headers without Authorization when no token', () => {
      const headers = createFormDataHeaders();
      expect(headers).toEqual({
        'Accept': 'application/json',
      });
      expect(headers).not.toHaveProperty('Authorization');
      expect(headers).not.toHaveProperty('Content-Type');
    });

    it('should not include Content-Type (browser sets it for FormData)', () => {
      localStorage.setItem(TOKEN_KEY, 'token');
      const headers = createFormDataHeaders();
      expect(headers).not.toHaveProperty('Content-Type');
    });
  });

  // ============================================
  // Integration Tests (Token + Headers)
  // ============================================

  describe('Token and Headers Integration', () => {
    it('should reflect token changes in headers', () => {
      // Save token
      saveToken('integration-token');
      let headers = createAuthHeaders();
      expect(headers).toHaveProperty('Authorization', 'Bearer integration-token');

      // Remove token
      removeToken();
      headers = createAuthHeaders();
      expect(headers).not.toHaveProperty('Authorization');
    });

    it('should update headers when token changes', () => {
      saveToken('first-token');
      let headers = createAuthHeaders();
      expect(headers).toHaveProperty('Authorization', 'Bearer first-token');

      saveToken('second-token');
      headers = createAuthHeaders();
      expect(headers).toHaveProperty('Authorization', 'Bearer second-token');
    });
  });
});
