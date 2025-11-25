import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { AuthHelper } from './helpers/auth-helper';

/**
 * Gallery Photo API Tests
 *
 * Tests Gallery endpoints with REAL PostgreSQL database and REAL HTTP server.
 *
 * Prerequisites:
 * 1. PostgreSQL running on localhost:5432
 * 2. Backend server running: mvn spring-boot:run (port 8081)
 *
 * Test Pattern:
 * - Real HTTP requests via Playwright ApiClient
 * - Real database persistence
 * - Real file uploads to file system
 * - JWT authentication required for all endpoints
 */
test.describe('Gallery Photo API', () => {
  let client: ApiClient;
  let authHelper: AuthHelper;
  let authToken: string;
  let userId: number;

  test.beforeAll(async ({ request }) => {
    client = new ApiClient(request);
    authHelper = new AuthHelper(request);

    // Register and login test user for Gallery API tests
    const testUser = await authHelper.registerAndLogin(
      'apitest-gallery@test.com',
      'Gallery Test User',
      'Test@1234'
    );

    authToken = testUser.token;
    userId = testUser.userId;
  });

  test.afterAll(async () => {
    // Cleanup: delete test user (cascade deletes all their photos)
    await authHelper.deleteUser(userId, authToken);
  });

  // Upload Photo Tests - Day 3
  test.describe('POST /api/gallery/upload', () => {
    // Tests will be implemented here
  });

  // Get My Photos Tests - Day 3
  test.describe('GET /api/gallery/my-photos', () => {
    // Tests will be implemented here
  });

  // Get Public Photos Tests - Day 4
  test.describe('GET /api/gallery/public', () => {
    // Tests will be implemented here
  });

  // Get Photo By ID Tests - Day 4
  test.describe('GET /api/gallery/photo/:id', () => {
    // Tests will be implemented here
  });

  // Update Photo Tests - Day 5
  test.describe('PUT /api/gallery/photo/:id', () => {
    // Tests will be implemented here
  });

  // Delete Photo Tests - Day 6
  test.describe('DELETE /api/gallery/photo/:id', () => {
    // Tests will be implemented here
  });

  // Toggle Privacy Tests - Day 6
  test.describe('PUT /api/gallery/photo/:id/toggle-privacy', () => {
    // Tests will be implemented here
  });
});
