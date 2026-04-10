/**
 * Authentication E2E Test Helpers
 *
 * Reusable helper functions for authentication-related E2E tests.
 * Includes JWT token creation and auth state management.
 */

/**
 * Create a fake JWT token for testing
 *
 * The isAuthenticated() function checks:
 * 1. Token exists in localStorage
 * 2. Token has valid JWT format (3 parts: header.payload.signature)
 * 3. Token is not expired (exp > now)
 *
 * @returns Fake JWT token string
 */
export function createFakeJwtToken(): string {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 3600; // Expires in 1 hour

  const payload = {
    userId: 123,
    email: 'test@example.com',
    fullName: 'Test User',
    exp: exp,
    iat: now,
    sub: 'test-user'
  };

  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${header}.${encodedPayload}.fake-signature`;
}
