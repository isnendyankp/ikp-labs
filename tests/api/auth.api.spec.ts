import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { AuthHelper } from './helpers/auth-helper';
import { generateUniqueEmail, generateRandomFullName, generateValidPassword, generateRegistrationData } from './helpers/test-data';

/**
 * Authentication API Tests
 *
 * Tests all authentication endpoints:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - POST /api/auth/refresh
 * - POST /api/auth/validate
 * - GET /api/auth/health (tested in health.api.spec.ts)
 */

test.describe('Authentication API Tests', () => {

  /**
   * POST /api/auth/register - User Registration Endpoint
   */
  test.describe('POST /api/auth/register', () => {

    test('Should register successfully with valid data', async ({ request }) => {
      const client = new ApiClient(request);
      const testData = generateRegistrationData();

      const response = await client.post('/api/auth/register', testData);

      // Verify response status
      expect(response.status).toBe(201);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeTruthy();
      expect(response.body.token).toBeTruthy();

      // Verify user data
      expect(response.body.email).toBe(testData.email);
      expect(response.body.fullName).toBe(testData.fullName);
      expect(response.body.userId).toBeTruthy();

      // Verify JWT token format
      const tokenParts = response.body.token.split('.');
      expect(tokenParts.length).toBe(3); // header.payload.signature

      console.log('✅ Test: Register with valid data - PASSED');
    });

    test('Should reject duplicate email registration', async ({ request }) => {
      const client = new ApiClient(request);

      // Use known existing email
      const duplicateData = {
        fullName: 'Duplicate User',
        email: 'testuser123@example.com', // Email that exists
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!'
      };

      const response = await client.post('/api/auth/register', duplicateData);

      // Verify response status
      expect(response.status).toBe(400);

      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');

      console.log('✅ Test: Reject duplicate email - PASSED');
    });

    test('Should validate required fields', async ({ request }) => {
      const client = new ApiClient(request);

      // Send request with empty fields
      const invalidData = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      };

      const response = await client.post('/api/auth/register', invalidData);

      // Verify response status
      expect(response.status).toBe(400);

      // Verify error response
      expect(response.body.success).toBe(false);

      console.log('✅ Test: Validate required fields - PASSED');
    });

    test('Should validate email format', async ({ request }) => {
      const client = new ApiClient(request);

      const invalidEmailData = {
        fullName: 'Test User',
        email: 'invalid-email-format', // Invalid email
        password: 'TestPass123!',
        confirmPassword: 'TestPass123!'
      };

      const response = await client.post('/api/auth/register', invalidEmailData);

      // Verify response status
      expect(response.status).toBe(400);

      console.log('✅ Test: Validate email format - PASSED');
    });

    test('Should validate password strength', async ({ request }) => {
      const client = new ApiClient(request);

      const weakPasswordData = {
        fullName: 'Test User',
        email: generateUniqueEmail(),
        password: 'weak', // Too weak
        confirmPassword: 'weak'
      };

      const response = await client.post('/api/auth/register', weakPasswordData);

      // Verify response status
      expect(response.status).toBe(400);

      console.log('✅ Test: Validate password strength - PASSED');
    });

    test('Should validate password confirmation match', async ({ request }) => {
      const client = new ApiClient(request);

      const mismatchData = {
        fullName: 'Test User',
        email: generateUniqueEmail(),
        password: 'TestPass123!',
        confirmPassword: 'DifferentPass123!' // Doesn't match
      };

      const response = await client.post('/api/auth/register', mismatchData);

      // Verify response status
      expect(response.status).toBe(400);

      console.log('✅ Test: Validate password confirmation - PASSED');
    });

  });

  /**
   * POST /api/auth/login - User Login Endpoint
   */
  test.describe('POST /api/auth/login', () => {

    test('Should login successfully with valid credentials', async ({ request }) => {
      const client = new ApiClient(request);

      // Use existing test user
      const loginData = {
        email: 'testuser123@example.com',
        password: 'SecurePass123!'
      };

      const response = await client.post('/api/auth/login', loginData);

      // Verify response status
      expect(response.status).toBe(200);

      // Verify response structure
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBeTruthy();
      expect(response.body.token).toBeTruthy();

      // Verify user data
      expect(response.body.email).toBe(loginData.email);
      expect(response.body.fullName).toBeTruthy();
      expect(response.body.userId).toBeTruthy();

      // Verify JWT token format
      const tokenParts = response.body.token.split('.');
      expect(tokenParts.length).toBe(3);

      console.log('✅ Test: Login with valid credentials - PASSED');
    });

    test('Should reject invalid password', async ({ request }) => {
      const client = new ApiClient(request);

      const invalidPasswordData = {
        email: 'testuser123@example.com',
        password: 'WrongPassword123!' // Incorrect password
      };

      const response = await client.post('/api/auth/login', invalidPasswordData);

      // Verify response status
      expect(response.status).toBe(401);

      // Verify error response
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid');

      console.log('✅ Test: Reject invalid password - PASSED');
    });

    test('Should reject non-existent email', async ({ request }) => {
      const client = new ApiClient(request);

      const nonExistentData = {
        email: 'nonexistent@example.com',
        password: 'AnyPassword123!'
      };

      const response = await client.post('/api/auth/login', nonExistentData);

      // Verify response status
      expect(response.status).toBe(401);

      // Verify error response
      expect(response.body.success).toBe(false);

      console.log('✅ Test: Reject non-existent email - PASSED');
    });

    test('Should validate required fields', async ({ request }) => {
      const client = new ApiClient(request);

      // Send request with empty fields
      const invalidData = {
        email: '',
        password: ''
      };

      const response = await client.post('/api/auth/login', invalidData);

      // Verify response status
      expect(response.status).toBe(400);

      console.log('✅ Test: Validate required fields - PASSED');
    });

    test('Should validate email format on login', async ({ request }) => {
      const client = new ApiClient(request);

      const invalidEmailData = {
        email: 'not-an-email',
        password: 'TestPass123!'
      };

      const response = await client.post('/api/auth/login', invalidEmailData);

      // Verify response status
      expect(response.status).toBe(400);

      console.log('✅ Test: Validate email format - PASSED');
    });

  });

});
