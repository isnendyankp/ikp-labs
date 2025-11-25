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
    test('should upload photo with full metadata (title, description, isPublic)', async () => {
      const response = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Sunset Beach',
          description: 'Beautiful sunset at the beach',
          isPublic: 'false'
        },
        authToken
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

    test('should upload photo with minimal metadata (title only)', async () => {
      const response = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.png',
          title: 'Minimal Photo'
        },
        authToken
      );

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe('Minimal Photo');
      expect(response.body.description).toBeFalsy(); // null or empty
      expect(response.body.isPublic).toBe(false); // default to private
      expect(response.body.filePath).toBeTruthy();
    });

    test('should upload photo as public when isPublic=true', async () => {
      const response = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Public Photo',
          isPublic: 'true'
        },
        authToken
      );

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe('Public Photo');
      expect(response.body.isPublic).toBe(true);
    });

    test('should fail upload without authentication (403 Forbidden)', async () => {
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
    test('should get my photos with pagination', async () => {
      // Upload 2 photos first
      await client.postMultipart(
        '/api/gallery/upload',
        { file: './tests/fixtures/images/test-photo.jpg', title: 'Photo 1' },
        authToken
      );
      await client.postMultipart(
        '/api/gallery/upload',
        { file: './tests/fixtures/images/test-photo.png', title: 'Photo 2' },
        authToken
      );

      // Get my photos with pagination
      const response = await client.get('/api/gallery/my-photos?page=0&size=12', authToken);

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
      const newAuthHelper = new AuthHelper(request);
      const newClient = new ApiClient(request);

      const newUser = await newAuthHelper.registerAndLogin(
        'apitest-nophotos@test.com',
        'No Photos User',
        'Test@1234'
      );

      const response = await newClient.get('/api/gallery/my-photos?page=0&size=12', newUser.token);

      expect(response.status).toBe(200);
      expect(response.body.photos).toBeTruthy();
      expect(Array.isArray(response.body.photos)).toBe(true);
      expect(response.body.photos.length).toBe(0);
      expect(response.body.currentPage).toBe(0);
      expect(response.body.totalPhotos).toBe(0);
      expect(response.body.totalPages).toBe(0);

      // Cleanup new user
      await newAuthHelper.deleteUser(newUser.userId, newUser.token);
    });

    test('should fail to get photos without authentication (403 Forbidden)', async () => {
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
