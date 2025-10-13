/**
 * Test User Data Fixtures
 *
 * Contains test user data for E2E testing.
 * These users are used across different test suites.
 */

export const testUsers = {
  // Valid user with correct credentials
  validUser: {
    fullName: 'Test User New',
    email: 'testuser123@example.com',
    password: 'TestPass123!',
    confirmPassword: 'TestPass123!',
    userId: 26
  },

  // User for registration testing
  newUser: {
    fullName: 'E2E Test User',
    email: 'e2etest@example.com',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!'
  },

  // Invalid credentials
  invalidPassword: {
    email: 'testuser123@example.com',
    password: 'WrongPassword123!'
  },

  // Non-existent user
  nonExistentUser: {
    email: 'notexist@example.com',
    password: 'AnyPassword123!'
  },

  // Invalid email format
  invalidEmail: {
    email: 'invalid-email-format',
    password: 'TestPass123!'
  },

  // Short password
  shortPassword: {
    email: 'testuser123@example.com',
    password: 'short'
  }
};

export const apiEndpoints = {
  backend: 'http://localhost:8081',
  login: 'http://localhost:8081/api/auth/login',
  register: 'http://localhost:8081/api/auth/register',
  health: 'http://localhost:8081/api/auth/health'
};
