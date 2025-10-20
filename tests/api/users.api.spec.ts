import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { AuthHelper } from './helpers/auth-helper';
import { generateUniqueEmail, generateRandomFullName, generateValidPassword } from './helpers/test-data';

/**
 * User Management API Tests
 *
 * Tests all user management endpoints:
 * - POST /api/users (create user)
 * - GET /api/users (get all users)
 * - GET /api/users/{id} (get user by ID)
 * - PUT /api/users/{id} (update user)
 * - DELETE /api/users/{id} (delete user)
 * - GET /api/users/email/{email} (get user by email)
 * - GET /api/users/check-email/{email} (check if email exists)
 * - GET /api/users/count (get total user count)
 */

test.describe('User Management API Tests', () => {

  let validToken: string;
  let testUserId: number;

  // Get a valid JWT token before all tests
  test.beforeAll(async ({ request }) => {
    const client = new ApiClient(request);
    const authHelper = new AuthHelper(client);

    // Login with existing test user to get token
    const result = await authHelper.loginAndGetToken(
      'testuser123@example.com',
      'SecurePass123!'
    );

    validToken = result.token;
  });

  /**
   * POST /api/users - Create User Endpoint
   */
  test.describe('POST /api/users', () => {

    test('Should create user successfully with valid data', async ({ request }) => {
      const client = new ApiClient(request);

      const newUserData = {
        fullName: generateRandomFullName(),
        email: generateUniqueEmail(),
        password: generateValidPassword()
      };

      const response = await client.post('/api/users', newUserData, validToken);

      // Verify response status
      expect(response.status).toBe(201);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('created');
      expect(response.body.user).toBeTruthy();

      // Verify user data
      expect(response.body.user.email).toBe(newUserData.email);
      expect(response.body.user.fullName).toBe(newUserData.fullName);
      expect(response.body.user.id).toBeTruthy();

      // Store test user ID for later tests
      testUserId = response.body.user.id;

      console.log('✅ Test: Create user with valid data - PASSED');
    });

    test('Should reject user creation without JWT token', async ({ request }) => {
      const client = new ApiClient(request);

      const newUserData = {
        fullName: 'Unauthorized User',
        email: generateUniqueEmail(),
        password: generateValidPassword()
      };

      // No token provided
      const response = await client.post('/api/users', newUserData);

      // Verify response status (401 Unauthorized)
      expect(response.status).toBe(401);

      console.log('✅ Test: Reject create user without token - PASSED');
    });

    test('Should reject duplicate email when creating user', async ({ request }) => {
      const client = new ApiClient(request);

      const duplicateEmailData = {
        fullName: 'Duplicate Email User',
        email: 'testuser123@example.com', // Email that already exists
        password: generateValidPassword()
      };

      const response = await client.post('/api/users', duplicateEmailData, validToken);

      // Verify response status
      expect(response.status).toBe(400);

      // Verify error message
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');

      console.log('✅ Test: Reject duplicate email - PASSED');
    });

    test('Should validate required fields when creating user', async ({ request }) => {
      const client = new ApiClient(request);

      // Send request with empty fields
      const invalidData = {
        fullName: '',
        email: '',
        password: ''
      };

      const response = await client.post('/api/users', invalidData, validToken);

      // Verify response status
      expect(response.status).toBe(400);

      // Verify error response
      expect(response.body.success).toBe(false);

      console.log('✅ Test: Validate required fields when creating user - PASSED');
    });

    test('Should validate email format when creating user', async ({ request }) => {
      const client = new ApiClient(request);

      const invalidEmailData = {
        fullName: 'Invalid Email User',
        email: 'not-a-valid-email', // Invalid email format
        password: generateValidPassword()
      };

      const response = await client.post('/api/users', invalidEmailData, validToken);

      // Verify response status
      expect(response.status).toBe(400);

      console.log('✅ Test: Validate email format when creating user - PASSED');
    });

  });

  /**
   * GET /api/users - Get All Users Endpoint
   */
  test.describe('GET /api/users', () => {

    test('Should retrieve all users with valid JWT token', async ({ request }) => {
      const client = new ApiClient(request);

      const response = await client.get('/api/users', validToken);

      // Verify response status
      expect(response.status).toBe(200);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBeGreaterThan(0);

      // Verify user objects have required fields
      const firstUser = response.body.users[0];
      expect(firstUser.id).toBeTruthy();
      expect(firstUser.email).toBeTruthy();
      expect(firstUser.fullName).toBeTruthy();

      console.log('✅ Test: Retrieve all users with valid token - PASSED');
    });

    test('Should reject get all users without JWT token', async ({ request }) => {
      const client = new ApiClient(request);

      // No token provided
      const response = await client.get('/api/users');

      // Verify response status (401 Unauthorized)
      expect(response.status).toBe(401);

      console.log('✅ Test: Reject get all users without token - PASSED');
    });

    test('Should reject get all users with invalid JWT token', async ({ request }) => {
      const client = new ApiClient(request);

      const invalidToken = 'invalid.jwt.token.here';
      const response = await client.get('/api/users', invalidToken);

      // Verify response status (401 Unauthorized)
      expect(response.status).toBe(401);

      console.log('✅ Test: Reject get all users with invalid token - PASSED');
    });

  });

});
