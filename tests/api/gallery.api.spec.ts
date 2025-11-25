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
  // Shared test user (lazy initialization)
  const TEST_USER_EMAIL = `apitest-gallery-${Date.now()}@test.com`;
  const TEST_USER_NAME = 'Gallery Test User';
  const TEST_USER_PASSWORD = 'Test@1234';

  let sharedAuthToken: string;
  let sharedUserId: number;

  // Helper to get or create authenticated user
  async function getAuthenticatedUser(request: any) {
    if (sharedAuthToken && sharedUserId) {
      return { token: sharedAuthToken, userId: sharedUserId };
    }

    const client = new ApiClient(request);
    const authHelper = new AuthHelper(client);

    const testUser = await authHelper.registerAndLogin(
      TEST_USER_EMAIL,
      TEST_USER_NAME,
      TEST_USER_PASSWORD
    );

    sharedAuthToken = testUser.token;
    sharedUserId = testUser.userId;

    return { token: sharedAuthToken, userId: sharedUserId };
  }

  // Upload Photo Tests - Day 3
  test.describe('POST /api/gallery/upload', () => {
    test('should upload photo with full metadata (title, description, isPublic)', async ({ request }) => {
      const { token, userId } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      const response = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Sunset Beach',
          description: 'Beautiful sunset at the beach',
          isPublic: 'false'
        },
        token
      );

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe('Sunset Beach');
      expect(response.body.description).toBe('Beautiful sunset at the beach');
      expect(response.body.isPublic).toBe(false);
      expect(response.body.filePath).toBeTruthy();
      expect(response.body.filePath).toContain('gallery/user-');
      expect(response.body.userId).toBe(userId);
    });

    test('should upload photo with minimal metadata (title only)', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      const response = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.png',
          title: 'Minimal Photo'
        },
        token
      );

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe('Minimal Photo');
      expect(response.body.description).toBeFalsy(); // null or empty
      expect(response.body.isPublic).toBe(false); // default to private
      expect(response.body.filePath).toBeTruthy();
    });

    test('should upload photo as public when isPublic=true', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      const response = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Public Photo',
          isPublic: 'true'
        },
        token
      );

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe('Public Photo');
      expect(response.body.isPublic).toBe(true);
    });

    test('should fail upload without authentication (403 Forbidden)', async ({ request }) => {
      const client = new ApiClient(request);

      const response = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Unauthorized Upload'
        }
        // No token provided
      );

      expect(response.status).toBe(403);
    });
  });

  // Get My Photos Tests - Day 3
  test.describe('GET /api/gallery/my-photos', () => {
    test('should get my photos with pagination', async ({ request }) => {
      const { token, userId } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload 2 photos first
      await client.postMultipart(
        '/api/gallery/upload',
        { file: './tests/fixtures/images/test-photo.jpg', title: 'Photo 1' },
        token
      );
      await client.postMultipart(
        '/api/gallery/upload',
        { file: './tests/fixtures/images/test-photo.png', title: 'Photo 2' },
        token
      );

      // Get my photos with pagination
      const response = await client.get('/api/gallery/my-photos?page=0&size=12', token);

      expect(response.status).toBe(200);
      expect(response.body.photos).toBeTruthy();
      expect(Array.isArray(response.body.photos)).toBe(true);
      expect(response.body.photos.length).toBeGreaterThanOrEqual(2);
      expect(response.body.currentPage).toBe(0);
      expect(response.body.totalPhotos).toBeGreaterThanOrEqual(2);
      expect(response.body.totalPages).toBeGreaterThanOrEqual(1);

      // Verify photos belong to authenticated user
      response.body.photos.forEach((photo: any) => {
        expect(photo.userId).toBe(userId);
      });
    });

    test('should get empty list when user has no photos', async ({ request }) => {
      // Create new user with no photos
      const client = new ApiClient(request);
      const authHelper = new AuthHelper(client);

      const newUser = await authHelper.registerAndLogin(
        `apitest-nophotos-${Date.now()}@test.com`,
        'No Photos User',
        'Test@1234'
      );

      const response = await client.get('/api/gallery/my-photos?page=0&size=12', newUser.token);

      expect(response.status).toBe(200);
      expect(response.body.photos).toBeTruthy();
      expect(Array.isArray(response.body.photos)).toBe(true);
      expect(response.body.photos.length).toBe(0);
      expect(response.body.currentPage).toBe(0);
      expect(response.body.totalPhotos).toBe(0);
      expect(response.body.totalPages).toBe(0);

      // Note: Cleanup skipped - users can't self-delete (403 Forbidden)
      // Test user will remain in database
    });

    test('should fail to get photos without authentication (403 Forbidden)', async ({ request }) => {
      const client = new ApiClient(request);

      const response = await client.get('/api/gallery/my-photos?page=0&size=12');
      expect(response.status).toBe(403);
    });
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
