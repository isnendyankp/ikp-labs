/**
 * Authentication Helpers Tests
 *
 * Tests for the auth-helpers module which provides JWT token creation
 * for E2E testing.
 *
 * Test Coverage:
 * - createFakeJwtToken() returns valid JWT format
 * - Token has 3 parts (header.payload.signature)
 * - Token payload contains required fields (userId, email, fullName, exp, iat, sub)
 * - Token expiration is 1 hour from now
 * - Token is not expired
 * - Token uses URL-safe base64 encoding
 *
 * @author Isnendy Ankp
 * @since 2026-02-07
 */

import { createFakeJwtToken } from '../auth-helpers';

describe('Authentication Helpers', () => {
  // ========== CREATE FAKE JWT TOKEN ==========

  describe('createFakeJwtToken()', () => {
    it('returns a string', () => {
      const token = createFakeJwtToken();

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('returns valid JWT format with 3 parts separated by dots', () => {
      const token = createFakeJwtToken();

      const parts = token.split('.');

      expect(parts).toHaveLength(3);
      expect(parts[0]).toBeDefined(); // header
      expect(parts[1]).toBeDefined(); // payload
      expect(parts[2]).toBeDefined(); // signature
    });

    it('has header with alg and typ claims', () => {
      const token = createFakeJwtToken();
      const [headerBase64] = token.split('.');

      // Decode header (base64)
      const headerJson = atob(headerBase64);
      const header = JSON.parse(headerJson);

      expect(header).toHaveProperty('alg', 'HS256');
      expect(header).toHaveProperty('typ', 'JWT');
    });

    it('has payload with all required fields', () => {
      const token = createFakeJwtToken();
      const [, payloadBase64] = token.split('.');

      // Decode payload (base64 with URL-safe chars)
      const payloadJson = atob(
        payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      );
      const payload = JSON.parse(payloadJson);

      // Check required fields
      expect(payload).toHaveProperty('userId', 123);
      expect(payload).toHaveProperty('email', 'test@example.com');
      expect(payload).toHaveProperty('fullName', 'Test User');
      expect(payload).toHaveProperty('exp');
      expect(payload).toHaveProperty('iat');
      expect(payload).toHaveProperty('sub', 'test-user');
    });

    it('has exp claim set to 1 hour from now', () => {
      const beforeTime = Math.floor(Date.now() / 1000);
      const token = createFakeJwtToken();
      const afterTime = Math.floor(Date.now() / 1000);

      const [, payloadBase64] = token.split('.');
      const payloadJson = atob(
        payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      );
      const payload = JSON.parse(payloadJson);

      // exp should be approximately 1 hour from now
      const expectedExpMin = beforeTime + 3600; // 1 hour
      const expectedExpMax = afterTime + 3600; // 1 hour

      expect(payload.exp).toBeGreaterThanOrEqual(expectedExpMin - 1); // -1 for timing margin
      expect(payload.exp).toBeLessThanOrEqual(expectedExpMax + 1); // +1 for timing margin
    });

    it('has iat claim set to current time', () => {
      const beforeTime = Math.floor(Date.now() / 1000);
      const token = createFakeJwtToken();
      const afterTime = Math.floor(Date.now() / 1000);

      const [, payloadBase64] = token.split('.');
      const payloadJson = atob(
        payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      );
      const payload = JSON.parse(payloadJson);

      // iat should be approximately now
      expect(payload.iat).toBeGreaterThanOrEqual(beforeTime);
      expect(payload.iat).toBeLessThanOrEqual(afterTime);
    });

    it('is not expired', () => {
      const token = createFakeJwtToken();
      const [, payloadBase64] = token.split('.');

      const payloadJson = atob(
        payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      );
      const payload = JSON.parse(payloadJson);

      const now = Math.floor(Date.now() / 1000);

      // exp should be in the future
      expect(payload.exp).toBeGreaterThan(now);
    });

    it('has consistent format on multiple calls', () => {
      const token1 = createFakeJwtToken();
      const token2 = createFakeJwtToken();

      // Both should have 3 parts
      expect(token1.split('.')).toHaveLength(3);
      expect(token2.split('.')).toHaveLength(3);

      // Both should have same structure
      const parts1 = token1.split('.');
      const parts2 = token2.split('.');

      expect(parts1[0]).toBe(parts2[0]); // Header should be the same

      // Payload should have same structure (but different iat/exp)
      const payload1 = JSON.parse(atob(parts1[1].replace(/-/g, '+').replace(/_/g, '/')));
      const payload2 = JSON.parse(atob(parts2[1].replace(/-/g, '+').replace(/_/g, '/')));

      expect(payload1.userId).toBe(payload2.userId);
      expect(payload1.email).toBe(payload2.email);
      expect(payload1.fullName).toBe(payload2.fullName);
      expect(payload1.sub).toBe(payload2.sub);
    });

    it('uses URL-safe base64 encoding for payload', () => {
      const token = createFakeJwtToken();
      const [, payloadBase64] = token.split('.');

      // Should not contain + or / (replaced with - and _)
      expect(payloadBase64).not.toContain('+');
      expect(payloadBase64).not.toContain('/');

      // Should not contain = (padding removed)
      expect(payloadBase64).not.toContain('=');
    });

    it('has fake-signature as signature', () => {
      const token = createFakeJwtToken();
      const [, , signature] = token.split('.');

      expect(signature).toBe('fake-signature');
    });
  });

  // ========== TOKEN VALIDATION ==========

  describe('Token Validation (simulating isAuthenticated checks)', () => {
    it('passes JWT format validation (3 parts)', () => {
      const token = createFakeJwtToken();

      const parts = token.split('.');
      expect(parts.length).toBe(3);
      expect(parts.every((part) => part.length > 0)).toBe(true);
    });

    it('passes expiration validation (exp > now)', () => {
      const token = createFakeJwtToken();
      const [, payloadBase64] = token.split('.');

      const payloadJson = atob(
        payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      );
      const payload = JSON.parse(payloadJson);

      const now = Math.floor(Date.now() / 1000);

      expect(payload.exp).toBeGreaterThan(now);
    });

    it('contains userId for authentication', () => {
      const token = createFakeJwtToken();
      const [, payloadBase64] = token.split('.');

      const payloadJson = atob(
        payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      );
      const payload = JSON.parse(payloadJson);

      expect(payload.userId).toBeDefined();
      expect(typeof payload.userId).toBe('number');
    });

    it('contains email for user identification', () => {
      const token = createFakeJwtToken();
      const [, payloadBase64] = token.split('.');

      const payloadJson = atob(
        payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      );
      const payload = JSON.parse(payloadJson);

      expect(payload.email).toBeDefined();
      expect(typeof payload.email).toBe('string');
    });

    it('contains fullName for display purposes', () => {
      const token = createFakeJwtToken();
      const [, payloadBase64] = token.split('.');

      const payloadJson = atob(
        payloadBase64.replace(/-/g, '+').replace(/_/g, '/')
      );
      const payload = JSON.parse(payloadJson);

      expect(payload.fullName).toBeDefined();
      expect(typeof payload.fullName).toBe('string');
    });
  });

  // ========== EDGE CASES ==========

  describe('Edge Cases', () => {
    it('can be stored in localStorage', () => {
      const token = createFakeJwtToken();

      // Simulate localStorage (not available in test env)
      const localStorageMock = (() => {
        let store: Record<string, string> = {};
        return {
          getItem: (key: string) => store[key] || null,
          setItem: (key: string, value: string) => {
            store[key] = value.toString();
          },
          removeItem: (key: string) => {
            delete store[key];
          },
          clear: () => {
            store = {};
          },
        };
      })();

      // Should not throw error
      expect(() => {
        localStorageMock.setItem('token', token);
      }).not.toThrow();

      // Should be retrievable
      expect(localStorageMock.getItem('token')).toBe(token);
    });

    it('has reasonable token length', () => {
      const token = createFakeJwtToken();

      // Token should be reasonably long but not excessive
      expect(token.length).toBeGreaterThan(50);
      expect(token.length).toBeLessThan(500);
    });

    it('produces different iat values on subsequent calls', () => {
      const token1 = createFakeJwtToken();

      // Wait a bit to ensure different timestamp
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          const token2 = createFakeJwtToken();

          const [, payloadBase641] = token1.split('.');
          const [, payloadBase642] = token2.split('.');

          const payload1 = JSON.parse(atob(payloadBase641.replace(/-/g, '+').replace(/_/g, '/')));
          const payload2 = JSON.parse(atob(payloadBase642.replace(/-/g, '+').replace(/_/g, '/')));

          // iat should be different (tokens created at different times)
          expect(payload1.iat).toBeLessThan(payload2.iat);

          resolve();
        }, 10);
      });
    });

    it('has consistent header on every call', () => {
      const token1 = createFakeJwtToken();
      const token2 = createFakeJwtToken();

      const [header1] = token1.split('.');
      const [header2] = token2.split('.');

      // Headers should be identical
      expect(header1).toBe(header2);

      // Header should decode to valid JSON
      const headerJson = atob(header1);
      const header = JSON.parse(headerJson);

      expect(header.alg).toBe('HS256');
      expect(header.typ).toBe('JWT');
    });
  });

  // ========== INTEGRATION WITH E2E TESTS ==========

  describe('Integration with E2E Tests', () => {
    it('provides token that can be used for Authorization header', () => {
      const token = createFakeJwtToken();

      // Token should be valid Bearer token
      expect(() => {
        const authHeader = `Bearer ${token}`;
        expect(authHeader).toMatch(/^Bearer [a-zA-Z0-9_.-]+\.[a-zA-Z0-9_.-]+\.[a-zA-Z0-9_.-]+$/);
      }).not.toThrow();
    });

    it('works with page.evaluate() context for localStorage injection', () => {
      const token = createFakeJwtToken();

      // Simulate what E2E tests do
      const storageKey = 'token';
      const storageValue = JSON.stringify({ token, user: { id: 123, email: 'test@example.com' } });

      expect(storageValue).toContain(token);
      expect(() => JSON.parse(storageValue)).not.toThrow();
    });
  });

  // ========== CONSISTENCY WITH REAL JWT ==========

  describe('Consistency with Real JWT', () => {
    it('follows JWT standard structure (header.payload.signature)', () => {
      const token = createFakeJwtToken();

      // JWT must have 3 parts separated by dots
      expect(token).toMatch(/^[^.]+\.[^.]+\.[^.]+$/);
    });

    it('uses HS256 algorithm (in header)', () => {
      const token = createFakeJwtToken();
      const [headerBase64] = token.split('.');

      const header = JSON.parse(atob(headerBase64));

      expect(header.alg).toBe('HS256');
    });

    it('uses JWT type (in header)', () => {
      const token = createFakeJwtToken();
      const [headerBase64] = token.split('.');

      const header = JSON.parse(atob(headerBase64));

      expect(header.typ).toBe('JWT');
    });

    it('has registered subject claim (sub)', () => {
      const token = createFakeJwtToken();
      const [, payloadBase64] = token.split('.');

      const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));

      expect(payload.sub).toBe('test-user');
    });
  });
});
