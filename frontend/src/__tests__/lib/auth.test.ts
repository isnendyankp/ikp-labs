/**
 * Unit Tests for auth.ts
 *
 * Testing Philosophy: NO MOCKING
 * - Uses real localStorage from JSDOM (not mocked)
 * - Tests pure functions directly
 * - Uses real JWT token encoding (base64)
 */

import {
  getToken,
  saveToken,
  logout,
  isAuthenticated,
  getUserFromToken,
  getFullName,
  getEmail,
} from '../../lib/auth';

describe('auth', () => {
  const TOKEN_KEY = 'authToken';

  // Helper to create a valid JWT token for testing
  // JWT structure: header.payload.signature (base64 encoded)
  function createTestToken(payload: object): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerB64 = btoa(JSON.stringify(header));
    const payloadB64 = btoa(JSON.stringify(payload));
    const signature = 'test-signature'; // Fake signature for testing
    return `${headerB64}.${payloadB64}.${signature}`;
  }

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

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem(TOKEN_KEY, 'token-to-remove');
      logout();
      expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    });

    it('should not throw when no token exists', () => {
      expect(() => logout()).not.toThrow();
    });

    it('should clear token after saveToken', () => {
      saveToken('test-token');
      logout();
      expect(getToken()).toBeNull();
    });
  });

  // ============================================
  // Authentication Check Tests
  // ============================================

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('should return true for valid non-expired token', () => {
      // Create token with future expiration (1 hour from now)
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const token = createTestToken({
        userId: 1,
        email: 'test@example.com',
        fullName: 'Test User',
        exp: futureExp,
        iat: Math.floor(Date.now() / 1000),
        sub: '1',
      });
      saveToken(token);
      expect(isAuthenticated()).toBe(true);
    });

    it('should return false for expired token', () => {
      // Create token with past expiration (1 hour ago)
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      const token = createTestToken({
        userId: 1,
        email: 'test@example.com',
        fullName: 'Test User',
        exp: pastExp,
        iat: pastExp - 3600,
        sub: '1',
      });
      saveToken(token);
      expect(isAuthenticated()).toBe(false);
    });

    it('should return false for invalid JWT format (missing parts)', () => {
      saveToken('invalid-token-format');
      expect(isAuthenticated()).toBe(false);
    });

    it('should return false for invalid JWT format (not base64)', () => {
      saveToken('not-base64.not-base64.not-base64');
      expect(isAuthenticated()).toBe(false);
    });

    it('should return false for invalid JSON in payload', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const invalidPayload = btoa('not-valid-json');
      const token = `${header}.${invalidPayload}.signature`;
      saveToken(token);
      expect(isAuthenticated()).toBe(false);
    });
  });

  // ============================================
  // User Info Extraction Tests
  // ============================================

  describe('getUserFromToken', () => {
    it('should return null when no token exists', () => {
      expect(getUserFromToken()).toBeNull();
    });

    it('should return user info for valid token', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const token = createTestToken({
        userId: 42,
        email: 'john@example.com',
        fullName: 'John Doe',
        exp: futureExp,
        iat: Math.floor(Date.now() / 1000),
        sub: '42',
      });
      saveToken(token);

      const user = getUserFromToken();
      expect(user).not.toBeNull();
      expect(user?.id).toBe(42);
      expect(user?.email).toBe('john@example.com');
      expect(user?.fullName).toBe('John Doe');
      expect(user?.token).toBe(token);
    });

    it('should return null for invalid JWT format', () => {
      saveToken('invalid-token');
      expect(getUserFromToken()).toBeNull();
    });

    it('should handle missing optional fields with defaults', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const token = createTestToken({
        // userId is missing - should default to 0
        email: 'minimal@example.com',
        fullName: 'Minimal User',
        exp: futureExp,
        iat: Math.floor(Date.now() / 1000),
        sub: '1',
      });
      saveToken(token);

      const user = getUserFromToken();
      expect(user).not.toBeNull();
      expect(user?.id).toBe(0); // Default value
      expect(user?.email).toBe('minimal@example.com');
    });
  });

  // ============================================
  // Convenience Functions Tests
  // ============================================

  describe('getFullName', () => {
    it('should return null when no token exists', () => {
      expect(getFullName()).toBeNull();
    });

    it('should return full name from token', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const token = createTestToken({
        userId: 1,
        email: 'jane@example.com',
        fullName: 'Jane Smith',
        exp: futureExp,
        iat: Math.floor(Date.now() / 1000),
        sub: '1',
      });
      saveToken(token);

      expect(getFullName()).toBe('Jane Smith');
    });

    it('should return null for invalid token', () => {
      saveToken('invalid-token');
      expect(getFullName()).toBeNull();
    });
  });

  describe('getEmail', () => {
    it('should return null when no token exists', () => {
      expect(getEmail()).toBeNull();
    });

    it('should return email from token', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const token = createTestToken({
        userId: 1,
        email: 'user@test.com',
        fullName: 'Test User',
        exp: futureExp,
        iat: Math.floor(Date.now() / 1000),
        sub: '1',
      });
      saveToken(token);

      expect(getEmail()).toBe('user@test.com');
    });

    it('should return null for invalid token', () => {
      saveToken('invalid-token');
      expect(getEmail()).toBeNull();
    });
  });

  // ============================================
  // Integration Tests
  // ============================================

  describe('Token Lifecycle Integration', () => {
    it('should handle complete auth flow', () => {
      // Start: not authenticated
      expect(isAuthenticated()).toBe(false);
      expect(getUserFromToken()).toBeNull();

      // Login: save token
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const token = createTestToken({
        userId: 100,
        email: 'flow@test.com',
        fullName: 'Flow User',
        exp: futureExp,
        iat: Math.floor(Date.now() / 1000),
        sub: '100',
      });
      saveToken(token);

      // After login: authenticated
      expect(isAuthenticated()).toBe(true);
      expect(getFullName()).toBe('Flow User');
      expect(getEmail()).toBe('flow@test.com');

      // Logout: clear token
      logout();

      // After logout: not authenticated
      expect(isAuthenticated()).toBe(false);
      expect(getUserFromToken()).toBeNull();
    });

    it('should reflect token changes immediately', () => {
      // First user
      const futureExp1 = Math.floor(Date.now() / 1000) + 3600;
      const token1 = createTestToken({
        userId: 1,
        email: 'first@test.com',
        fullName: 'First User',
        exp: futureExp1,
        iat: Math.floor(Date.now() / 1000),
        sub: '1',
      });
      saveToken(token1);
      expect(getFullName()).toBe('First User');

      // Switch to second user (token replacement)
      const futureExp2 = Math.floor(Date.now() / 1000) + 3600;
      const token2 = createTestToken({
        userId: 2,
        email: 'second@test.com',
        fullName: 'Second User',
        exp: futureExp2,
        iat: Math.floor(Date.now() / 1000),
        sub: '2',
      });
      saveToken(token2);
      expect(getFullName()).toBe('Second User');
      expect(getEmail()).toBe('second@test.com');
    });
  });
});
