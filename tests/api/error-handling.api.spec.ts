import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { AuthHelper } from './helpers/auth-helper';
import { generateUniqueEmail, generateRandomFullName, generateValidPassword } from './helpers/test-data';

/**
 * Error Handling API Tests
 *
 * Tests comprehensive error scenarios across all endpoints:
 * - 400 Bad Request: Validation errors, malformed data
 * - 401 Unauthorized: Missing/invalid tokens, expired tokens
 * - 404 Not Found: Non-existent resources
 * - 500 Internal Server Error: Server-side errors (if applicable)
 *
 * This ensures robust error handling and proper HTTP status codes
 */

test.describe('Error Handling API Tests', () => {

  let validToken: string;
  let validUserId: number;
  let validUserEmail: string;

  // Setup: Get valid authentication token before all tests
  test.beforeAll(async ({ request }) => {
    const client = new ApiClient(request);
    const authHelper = new AuthHelper(client);

    // Login to get a valid token
    const result = await authHelper.loginAndGetToken(
      'testuser123@example.com',
      'SecurePass123!'
    );

    validToken = result.token;
    validUserEmail = result.email;

    // Create a test user for ID-based tests
    const newUserData = {
      fullName: generateRandomFullName(),
      email: generateUniqueEmail(),
      password: generateValidPassword()
    };

    const createResponse = await client.post('/api/users', newUserData, validToken);
    validUserId = createResponse.body.user.id;
  });

  /**
   * 400 Bad Request Error Tests
   * Testing validation errors and malformed data
   */
  test.describe('400 Bad Request Errors', () => {

    test('Should return 400 for registration with missing required fields', async ({ request }) => {
      const client = new ApiClient(request);

      const incompleteData = {
        fullName: '',
        email: '',
        password: ''
      };

      const response = await client.post('/api/auth/register', incompleteData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeTruthy();

      console.log('✅ Test: 400 for missing required fields - PASSED');
    });

    test('Should return 400 for registration with invalid email format', async ({ request }) => {
      const client = new ApiClient(request);

      const invalidEmailData = {
        fullName: 'Test User',
        email: 'not-an-email',
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!'
      };

      const response = await client.post('/api/auth/register', invalidEmailData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);

      console.log('✅ Test: 400 for invalid email format - PASSED');
    });

    test('Should return 400 for registration with weak password', async ({ request }) => {
      const client = new ApiClient(request);

      const weakPasswordData = {
        fullName: 'Test User',
        email: generateUniqueEmail(),
        password: '123',
        confirmPassword: '123'
      };

      const response = await client.post('/api/auth/register', weakPasswordData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);

      console.log('✅ Test: 400 for weak password - PASSED');
    });

    test('Should return 400 for registration with password mismatch', async ({ request }) => {
      const client = new ApiClient(request);

      const mismatchPasswordData = {
        fullName: 'Test User',
        email: generateUniqueEmail(),
        password: 'ValidPass123!',
        confirmPassword: 'DifferentPass123!'
      };

      const response = await client.post('/api/auth/register', mismatchPasswordData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('match');

      console.log('✅ Test: 400 for password mismatch - PASSED');
    });

    test('Should return 400 for duplicate email registration', async ({ request }) => {
      const client = new ApiClient(request);

      const duplicateData = {
        fullName: 'Duplicate User',
        email: 'testuser123@example.com', // Email that already exists
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!'
      };

      const response = await client.post('/api/auth/register', duplicateData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');

      console.log('✅ Test: 400 for duplicate email - PASSED');
    });

    test('Should return 400 for login with missing credentials', async ({ request }) => {
      const client = new ApiClient(request);

      const emptyCredentials = {
        email: '',
        password: ''
      };

      const response = await client.post('/api/auth/login', emptyCredentials);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);

      console.log('✅ Test: 400 for login with missing credentials - PASSED');
    });

    test('Should return 400 for creating user with invalid data', async ({ request }) => {
      const client = new ApiClient(request);

      const invalidUserData = {
        fullName: '', // Empty name
        email: 'invalid-email', // Invalid email format
        password: '123' // Weak password
      };

      const response = await client.post('/api/users', invalidUserData, validToken);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);

      console.log('✅ Test: 400 for creating user with invalid data - PASSED');
    });

    test('Should return 400 for updating user with duplicate email', async ({ request }) => {
      const client = new ApiClient(request);

      // Try to update with an existing email
      const updateData = {
        fullName: 'Updated Name',
        email: 'testuser123@example.com', // Email already in use
        password: 'NewPass123!'
      };

      const response = await client.put(`/api/users/${validUserId}`, updateData, validToken);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');

      console.log('✅ Test: 400 for updating user with duplicate email - PASSED');
    });

  });

  /**
   * 401 Unauthorized Error Tests
   * Testing authentication and authorization errors
   */
  test.describe('401 Unauthorized Errors', () => {

    test('Should return 401 for login with wrong password', async ({ request }) => {
      const client = new ApiClient(request);

      const wrongPasswordData = {
        email: 'testuser123@example.com',
        password: 'WrongPassword123!'
      };

      const response = await client.post('/api/auth/login', wrongPasswordData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');

      console.log('✅ Test: 401 for wrong password - PASSED');
    });

    test('Should return 401 for login with non-existent email', async ({ request }) => {
      const client = new ApiClient(request);

      const nonExistentData = {
        email: `nonexistent${Date.now()}@example.com`,
        password: 'SomePassword123!'
      };

      const response = await client.post('/api/auth/login', nonExistentData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);

      console.log('✅ Test: 401 for non-existent email - PASSED');
    });

    test('Should return 401 for accessing protected endpoint without token', async ({ request }) => {
      const client = new ApiClient(request);

      // Try to access users without token
      const response = await client.get('/api/users');

      expect(response.status).toBe(401);

      console.log('✅ Test: 401 for accessing protected endpoint without token - PASSED');
    });

    test('Should return 401 for accessing protected endpoint with invalid token', async ({ request }) => {
      const client = new ApiClient(request);

      const invalidToken = 'invalid.jwt.token.here';
      const response = await client.get('/api/users', invalidToken);

      expect(response.status).toBe(401);

      console.log('✅ Test: 401 for invalid token - PASSED');
    });

    test('Should return 401 for creating user without token', async ({ request }) => {
      const client = new ApiClient(request);

      const newUserData = {
        fullName: 'Unauthorized User',
        email: generateUniqueEmail(),
        password: generateValidPassword()
      };

      const response = await client.post('/api/users', newUserData);

      expect(response.status).toBe(401);

      console.log('✅ Test: 401 for creating user without token - PASSED');
    });

    test('Should return 401 for updating user without token', async ({ request }) => {
      const client = new ApiClient(request);

      const updateData = {
        fullName: 'Unauthorized Update',
        email: generateUniqueEmail(),
        password: 'NewPass123!'
      };

      const response = await client.put(`/api/users/${validUserId}`, updateData);

      expect(response.status).toBe(401);

      console.log('✅ Test: 401 for updating user without token - PASSED');
    });

    test('Should return 401 for deleting user without token', async ({ request }) => {
      const client = new ApiClient(request);

      const response = await client.delete(`/api/users/${validUserId}`);

      expect(response.status).toBe(401);

      console.log('✅ Test: 401 for deleting user without token - PASSED');
    });

    test('Should return 401 for token refresh with invalid token', async ({ request }) => {
      const client = new ApiClient(request);

      const invalidToken = 'totally.invalid.token';
      const response = await client.post(`/api/auth/refresh?token=${invalidToken}`, {});

      expect(response.status).toBe(401);

      console.log('✅ Test: 401 for token refresh with invalid token - PASSED');
    });

    test('Should return 401 for token validation with invalid token', async ({ request }) => {
      const client = new ApiClient(request);

      const invalidToken = 'bad.jwt.token';
      const response = await client.post(
        `/api/auth/validate?token=${invalidToken}&email=${validUserEmail}`,
        {}
      );

      expect(response.status).toBe(401);

      console.log('✅ Test: 401 for token validation with invalid token - PASSED');
    });

  });

  /**
   * 404 Not Found Error Tests
   * Testing non-existent resources and edge cases
   */
  test.describe('404 Not Found Errors', () => {

    test('Should return 404 for getting non-existent user by ID', async ({ request }) => {
      const client = new ApiClient(request);

      const nonExistentId = 999999;
      const response = await client.get(`/api/users/${nonExistentId}`, validToken);

      expect(response.status).toBe(404);

      console.log('✅ Test: 404 for non-existent user ID - PASSED');
    });

    test('Should return 404 for updating non-existent user', async ({ request }) => {
      const client = new ApiClient(request);

      const nonExistentId = 999999;
      const updateData = {
        fullName: 'Non-existent User',
        email: generateUniqueEmail(),
        password: 'NewPass123!'
      };

      const response = await client.put(`/api/users/${nonExistentId}`, updateData, validToken);

      expect(response.status).toBe(404);

      console.log('✅ Test: 404 for updating non-existent user - PASSED');
    });

    test('Should return 404 for deleting non-existent user', async ({ request }) => {
      const client = new ApiClient(request);

      const nonExistentId = 999999;
      const response = await client.delete(`/api/users/${nonExistentId}`, validToken);

      expect(response.status).toBe(404);

      console.log('✅ Test: 404 for deleting non-existent user - PASSED');
    });

    test('Should return 404 for getting user by non-existent email', async ({ request }) => {
      const client = new ApiClient(request);

      const nonExistentEmail = `nonexistent${Date.now()}@example.com`;
      const response = await client.get(`/api/users/email/${nonExistentEmail}`, validToken);

      expect(response.status).toBe(404);

      console.log('✅ Test: 404 for non-existent email - PASSED');
    });

    test('Should return 404 for accessing invalid endpoint', async ({ request }) => {
      const client = new ApiClient(request);

      const response = await client.get('/api/invalid-endpoint', validToken);

      expect(response.status).toBe(404);

      console.log('✅ Test: 404 for invalid endpoint - PASSED');
    });

  });

});
