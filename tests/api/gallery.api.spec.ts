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

    test('should paginate correctly - page 0 (first page with 15 photos)', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload 15 photos to test multi-page pagination
      for (let i = 1; i <= 15; i++) {
        await client.postMultipart(
          '/api/gallery/upload',
          {
            file: './tests/fixtures/images/test-photo.jpg',
            title: `Pagination Test Photo ${i}`,
            isPublic: 'false'
          },
          token
        );
      }

      // Get page 0 with size 12 (should return 12 photos)
      const response = await client.get('/api/gallery/my-photos?page=0&size=12', token);

      expect(response.status).toBe(200);
      expect(response.body.photos).toBeTruthy();
      expect(Array.isArray(response.body.photos)).toBe(true);
      expect(response.body.photos.length).toBeGreaterThanOrEqual(12);

      // Verify pagination metadata for page 0
      expect(response.body.currentPage).toBe(0);
      expect(response.body.pageSize).toBe(12);
      expect(response.body.totalPhotos).toBeGreaterThanOrEqual(15);
      expect(response.body.totalPages).toBeGreaterThanOrEqual(2);
      expect(response.body.hasNext).toBe(true); // Has next page
      expect(response.body.hasPrevious).toBe(false); // No previous page (first page)
    });

    test('should paginate correctly - page 1 (second page with remainder)', async ({ request }) => {
      const { token, userId } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // First, ensure we have enough photos for page 1
      // Each test runs independently, so we need to check and upload if needed
      const checkResponse = await client.get('/api/gallery/my-photos?page=0&size=100', token);
      const currentTotal = checkResponse.body.totalPhotos || 0;

      // If we don't have at least 15 photos, upload more
      if (currentTotal < 15) {
        const photosToUpload = 15 - currentTotal;
        for (let i = 1; i <= photosToUpload; i++) {
          await client.postMultipart(
            '/api/gallery/upload',
            {
              file: './tests/fixtures/images/test-photo.jpg',
              title: `Page1 Test Photo ${i}`,
              isPublic: 'false'
            },
            token
          );
        }
      }

      // Now get page 1 (second page) - should have remaining photos
      const response = await client.get('/api/gallery/my-photos?page=1&size=12', token);

      expect(response.status).toBe(200);
      expect(response.body.photos).toBeTruthy();
      expect(Array.isArray(response.body.photos)).toBe(true);

      // Verify pagination metadata for page 1
      expect(response.body.currentPage).toBe(1);
      expect(response.body.pageSize).toBe(12);
      expect(response.body.hasPrevious).toBe(true); // Has previous page (not first page)

      // Verify photos are from current user
      response.body.photos.forEach((photo: any) => {
        expect(photo.userId).toBe(userId);
      });
    });
  });

  // Get Public Photos Tests - Day 4
  test.describe('GET /api/gallery/public', () => {
    test('should get public photos with pagination', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload 5 public photos
      for (let i = 1; i <= 5; i++) {
        await client.postMultipart(
          '/api/gallery/upload',
          {
            file: './tests/fixtures/images/test-photo.jpg',
            title: `Public Photo ${i}`,
            isPublic: 'true'
          },
          token
        );
      }

      // Get public photos
      const response = await client.get('/api/gallery/public?page=0&size=12', token);

      expect(response.status).toBe(200);
      expect(response.body.photos).toBeTruthy();
      expect(Array.isArray(response.body.photos)).toBe(true);
      expect(response.body.photos.length).toBeGreaterThanOrEqual(5);

      // Verify pagination metadata exists
      expect(response.body.currentPage).toBe(0);
      expect(response.body.totalPhotos).toBeGreaterThanOrEqual(5);
      expect(response.body.pageSize).toBe(12);
      expect(typeof response.body.hasNext).toBe('boolean');
      expect(typeof response.body.hasPrevious).toBe('boolean');

      // Verify all returned photos are public
      response.body.photos.forEach((photo: any) => {
        expect(photo.isPublic).toBe(true);
      });
    });

    test('should return only public photos (excludes private)', async ({ request }) => {
      const { token, userId } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload 3 public photos
      for (let i = 1; i <= 3; i++) {
        await client.postMultipart(
          '/api/gallery/upload',
          {
            file: './tests/fixtures/images/test-photo.jpg',
            title: `Public Test ${i}`,
            isPublic: 'true'
          },
          token
        );
      }

      // Upload 2 private photos
      for (let i = 1; i <= 2; i++) {
        await client.postMultipart(
          '/api/gallery/upload',
          {
            file: './tests/fixtures/images/test-photo.jpg',
            title: `Private Test ${i}`,
            isPublic: 'false'
          },
          token
        );
      }

      // Get public photos
      const response = await client.get('/api/gallery/public?page=0&size=50', token);

      expect(response.status).toBe(200);

      // Find photos from current user
      const userPhotos = response.body.photos.filter((photo: any) => photo.userId === userId);

      // Verify we can find the public photos we just uploaded
      const publicTestPhotos = userPhotos.filter((photo: any) => photo.title.includes('Public Test'));
      expect(publicTestPhotos.length).toBe(3); // We uploaded 3 public photos

      // All public test photos should be public
      publicTestPhotos.forEach((photo: any) => {
        expect(photo.isPublic).toBe(true);
        expect(photo.title).toContain('Public Test');
      });

      // Should NOT contain our private photos
      const privatePhotos = userPhotos.filter((photo: any) => photo.title.includes('Private Test'));
      expect(privatePhotos.length).toBe(0);
    });

    test('should get public photos from multiple users', async ({ request }) => {
      // User A uploads 2 public photos
      const userA = await getAuthenticatedUser(request);
      const clientA = new ApiClient(request);

      await clientA.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'User A Public Photo 1',
          isPublic: 'true'
        },
        userA.token
      );

      await clientA.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'User A Public Photo 2',
          isPublic: 'true'
        },
        userA.token
      );

      // User B uploads 3 public photos
      const clientB = new ApiClient(request);
      const authHelperB = new AuthHelper(clientB);
      const userB = await authHelperB.registerAndLogin(
        `apitest-multi-${Date.now()}@test.com`,
        'User B',
        'Test@1234'
      );

      await clientB.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'User B Public Photo 1',
          isPublic: 'true'
        },
        userB.token
      );

      await clientB.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'User B Public Photo 2',
          isPublic: 'true'
        },
        userB.token
      );

      await clientB.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'User B Public Photo 3',
          isPublic: 'true'
        },
        userB.token
      );

      // Get all public photos
      const response = await clientA.get('/api/gallery/public?page=0&size=50', userA.token);

      expect(response.status).toBe(200);

      // Should contain photos from both users
      const userAPhotos = response.body.photos.filter((photo: any) => photo.userId === userA.userId);
      const userBPhotos = response.body.photos.filter((photo: any) => photo.userId === userB.userId);

      expect(userAPhotos.length).toBeGreaterThanOrEqual(2);
      expect(userBPhotos.length).toBeGreaterThanOrEqual(3);
    });
  });

  // Get Photo By ID Tests - Day 4
  test.describe('GET /api/gallery/photo/:id', () => {
    test('should get public photo by anyone (non-owner can access)', async ({ request }) => {
      // User A uploads public photo
      const userA = await getAuthenticatedUser(request);
      const clientA = new ApiClient(request);

      const uploadResponse = await clientA.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Public Beach Photo',
          description: 'Beautiful public beach',
          isPublic: 'true'
        },
        userA.token
      );
      const photoId = uploadResponse.body.id;

      // User B tries to access User A's public photo
      const clientB = new ApiClient(request);
      const authHelperB = new AuthHelper(clientB);
      const userB = await authHelperB.registerAndLogin(
        `apitest-userB-${Date.now()}@test.com`,
        'User B',
        'Test@1234'
      );

      const response = await clientB.get(`/api/gallery/photo/${photoId}`, userB.token);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(photoId);
      expect(response.body.title).toBe('Public Beach Photo');
      expect(response.body.description).toBe('Beautiful public beach');
      expect(response.body.isPublic).toBe(true);
      expect(response.body.userId).toBe(userA.userId);
      expect(response.body.ownerName).toBeTruthy();
      expect(response.body.ownerEmail).toBeTruthy();
      expect(response.body.filePath).toBeTruthy();
    });

    test('should get private photo by owner (owner can access)', async ({ request }) => {
      const { token, userId } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload private photo
      const uploadResponse = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Private Family Photo',
          description: 'My private family photo',
          isPublic: 'false'
        },
        token
      );
      const photoId = uploadResponse.body.id;

      // Owner retrieves own private photo
      const response = await client.get(`/api/gallery/photo/${photoId}`, token);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(photoId);
      expect(response.body.title).toBe('Private Family Photo');
      expect(response.body.isPublic).toBe(false);
      expect(response.body.userId).toBe(userId);
    });

    test('should fail to get private photo by non-owner (403 Forbidden)', async ({ request }) => {
      // User A uploads private photo
      const userA = await getAuthenticatedUser(request);
      const clientA = new ApiClient(request);

      const uploadResponse = await clientA.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Private Secret Photo',
          isPublic: 'false'
        },
        userA.token
      );
      const photoId = uploadResponse.body.id;

      // User B tries to access User A's private photo
      const clientB = new ApiClient(request);
      const authHelperB = new AuthHelper(clientB);
      const userB = await authHelperB.registerAndLogin(
        `apitest-userB-private-${Date.now()}@test.com`,
        'User B',
        'Test@1234'
      );

      const response = await clientB.get(`/api/gallery/photo/${photoId}`, userB.token);

      expect(response.status).toBe(403);
    });

    test('should return 404 for non-existent photo', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      const response = await client.get('/api/gallery/photo/999999', token);

      expect(response.status).toBe(404);
    });

    test('should return complete photo detail structure', async ({ request }) => {
      const { token, userId } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload photo with full metadata
      const uploadResponse = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Complete Metadata Test',
          description: 'Testing all fields',
          isPublic: 'true'
        },
        token
      );
      const photoId = uploadResponse.body.id;

      // Get photo detail
      const response = await client.get(`/api/gallery/photo/${photoId}`, token);

      expect(response.status).toBe(200);

      // Verify all required fields exist
      expect(response.body.id).toBeTruthy();
      expect(response.body.userId).toBe(userId);
      expect(response.body.ownerName).toBeTruthy();
      expect(response.body.ownerEmail).toBeTruthy();
      expect(response.body.title).toBe('Complete Metadata Test');
      expect(response.body.description).toBe('Testing all fields');
      expect(response.body.filePath).toBeTruthy();
      expect(response.body.isPublic).toBe(true);
      expect(response.body.createdAt).toBeTruthy();
      expect(response.body.updatedAt).toBeTruthy();

      // Verify field types
      expect(typeof response.body.id).toBe('number');
      expect(typeof response.body.userId).toBe('number');
      expect(typeof response.body.ownerName).toBe('string');
      expect(typeof response.body.ownerEmail).toBe('string');
      expect(typeof response.body.title).toBe('string');
      expect(typeof response.body.isPublic).toBe('boolean');
    });
  });

  // Update Photo Tests - Day 5
  test.describe('PUT /api/gallery/photo/:id', () => {
    test('should update photo title only (partial update)', async ({ request }) => {
      const { token, userId } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload photo first
      const uploadResponse = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Original Title',
          description: 'Original Description',
          isPublic: 'false'
        },
        token
      );
      const photoId = uploadResponse.body.id;

      // Update only title
      const updateResponse = await client.put(
        `/api/gallery/photo/${photoId}`,
        {
          title: 'Updated Title Only'
        },
        token
      );

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.id).toBe(photoId);
      expect(updateResponse.body.title).toBe('Updated Title Only');
      expect(updateResponse.body.description).toBe('Original Description'); // Unchanged
      expect(updateResponse.body.isPublic).toBe(false); // Unchanged
      expect(updateResponse.body.userId).toBe(userId);
      expect(updateResponse.body.updatedAt).toBeTruthy();
    });

    test('should update photo description only (partial update)', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload photo first
      const uploadResponse = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Original Title',
          description: 'Original Description',
          isPublic: 'true'
        },
        token
      );
      const photoId = uploadResponse.body.id;

      // Update only description
      const updateResponse = await client.put(
        `/api/gallery/photo/${photoId}`,
        {
          description: 'Updated Description Only'
        },
        token
      );

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.id).toBe(photoId);
      expect(updateResponse.body.title).toBe('Original Title'); // Unchanged
      expect(updateResponse.body.description).toBe('Updated Description Only');
      expect(updateResponse.body.isPublic).toBe(true); // Unchanged
    });

    test('should update isPublic only (privacy toggle)', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload private photo first
      const uploadResponse = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Test Photo',
          description: 'Test Description',
          isPublic: 'false'
        },
        token
      );
      const photoId = uploadResponse.body.id;

      // Toggle privacy to public
      const updateResponse = await client.put(
        `/api/gallery/photo/${photoId}`,
        {
          isPublic: true
        },
        token
      );

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.id).toBe(photoId);
      expect(updateResponse.body.title).toBe('Test Photo'); // Unchanged
      expect(updateResponse.body.description).toBe('Test Description'); // Unchanged
      expect(updateResponse.body.isPublic).toBe(true); // Changed from false to true
    });

    test('should update all fields (full update)', async ({ request }) => {
      const { token, userId } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload photo first
      const uploadResponse = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Original Title',
          description: 'Original Description',
          isPublic: 'false'
        },
        token
      );
      const photoId = uploadResponse.body.id;

      // Update all fields
      const updateResponse = await client.put(
        `/api/gallery/photo/${photoId}`,
        {
          title: 'Completely New Title',
          description: 'Completely New Description',
          isPublic: true
        },
        token
      );

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.id).toBe(photoId);
      expect(updateResponse.body.title).toBe('Completely New Title');
      expect(updateResponse.body.description).toBe('Completely New Description');
      expect(updateResponse.body.isPublic).toBe(true);
      expect(updateResponse.body.userId).toBe(userId);
      expect(updateResponse.body.filePath).toBeTruthy(); // File path unchanged
      expect(updateResponse.body.updatedAt).toBeTruthy();
    });

    test('should fail update by non-owner (403 Forbidden)', async ({ request }) => {
      // User A uploads photo
      const userA = await getAuthenticatedUser(request);
      const clientA = new ApiClient(request);

      const uploadResponse = await clientA.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'User A Photo',
          isPublic: 'false'
        },
        userA.token
      );
      const photoId = uploadResponse.body.id;

      // User B tries to update User A's photo
      const clientB = new ApiClient(request);
      const authHelperB = new AuthHelper(clientB);
      const userB = await authHelperB.registerAndLogin(
        `apitest-update-${Date.now()}@test.com`,
        'User B',
        'Test@1234'
      );

      const updateResponse = await clientB.put(
        `/api/gallery/photo/${photoId}`,
        {
          title: 'Trying to hack User A photo'
        },
        userB.token
      );

      expect(updateResponse.status).toBe(403);
      // Verify photo was NOT updated (still has original title)
      const checkResponse = await clientA.get(`/api/gallery/photo/${photoId}`, userA.token);
      expect(checkResponse.body.title).toBe('User A Photo'); // Original title unchanged
    });

    test('should fail update without authentication (403 Forbidden)', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload photo first
      const uploadResponse = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Test Photo',
          isPublic: 'false'
        },
        token
      );
      const photoId = uploadResponse.body.id;

      // Try to update without token
      const updateResponse = await client.put(
        `/api/gallery/photo/${photoId}`,
        {
          title: 'Unauthorized Update'
        }
        // No token provided
      );

      expect(updateResponse.status).toBe(403);
    });

    test('should fail update non-existent photo (404 Not Found)', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Try to update non-existent photo
      const updateResponse = await client.put(
        '/api/gallery/photo/999999',
        {
          title: 'Update Non-Existent Photo'
        },
        token
      );

      expect(updateResponse.status).toBe(404);
    });

    test('should fail update with title too long (400 Bad Request)', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload photo first
      const uploadResponse = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Valid Title',
          isPublic: 'false'
        },
        token
      );
      const photoId = uploadResponse.body.id;

      // Try to update with title exceeding 100 characters
      const longTitle = 'A'.repeat(101); // 101 characters (max is 100)
      const updateResponse = await client.put(
        `/api/gallery/photo/${photoId}`,
        {
          title: longTitle
        },
        token
      );

      expect(updateResponse.status).toBe(400);
      // Verify error message mentions validation
      expect(updateResponse.body.message || updateResponse.body.error).toBeTruthy();
    });

    test('should fail update with description too long (400 Bad Request)', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload photo first
      const uploadResponse = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Test Photo',
          description: 'Valid description',
          isPublic: 'false'
        },
        token
      );
      const photoId = uploadResponse.body.id;

      // Try to update with description exceeding 5000 characters
      const longDescription = 'B'.repeat(5001); // 5001 characters (max is 5000)
      const updateResponse = await client.put(
        `/api/gallery/photo/${photoId}`,
        {
          description: longDescription
        },
        token
      );

      expect(updateResponse.status).toBe(400);
      // Verify error message mentions validation
      expect(updateResponse.body.message || updateResponse.body.error).toBeTruthy();
    });

    test('should update successfully with empty request body (no-op)', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload photo first
      const uploadResponse = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Original Title',
          description: 'Original Description',
          isPublic: 'false'
        },
        token
      );
      const photoId = uploadResponse.body.id;

      // Send PUT with empty body (no fields to update)
      const updateResponse = await client.put(
        `/api/gallery/photo/${photoId}`,
        {},
        token
      );

      expect(updateResponse.status).toBe(200);
      // Verify all fields remain unchanged
      expect(updateResponse.body.id).toBe(photoId);
      expect(updateResponse.body.title).toBe('Original Title');
      expect(updateResponse.body.description).toBe('Original Description');
      expect(updateResponse.body.isPublic).toBe(false);
    });
  });

  // Delete Photo Tests - Day 6
  test.describe('DELETE /api/gallery/photo/:id', () => {
    test('should delete photo by owner (204 No Content)', async ({ request }) => {
      const { token, userId } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload photo first
      const uploadResponse = await client.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'Photo to Delete',
          description: 'This will be deleted',
          isPublic: 'false'
        },
        token
      );
      const photoId = uploadResponse.body.id;

      // Delete the photo
      const deleteResponse = await client.delete(`/api/gallery/photo/${photoId}`, token);

      expect(deleteResponse.status).toBe(204);

      // Verify photo is gone - check my-photos
      const myPhotosResponse = await client.get('/api/gallery/my-photos?page=0&size=100', token);
      const deletedPhoto = myPhotosResponse.body.photos.find((photo: any) => photo.id === photoId);
      expect(deletedPhoto).toBeUndefined(); // Photo should not exist anymore

      // Also verify GET by ID returns 404
      const getResponse = await client.get(`/api/gallery/photo/${photoId}`, token);
      expect(getResponse.status).toBe(404);
    });

    test('should fail delete by non-owner (403 Forbidden)', async ({ request }) => {
      // User A uploads photo
      const userA = await getAuthenticatedUser(request);
      const clientA = new ApiClient(request);

      const uploadResponse = await clientA.postMultipart(
        '/api/gallery/upload',
        {
          file: './tests/fixtures/images/test-photo.jpg',
          title: 'User A Photo - Cannot Delete',
          isPublic: 'false'
        },
        userA.token
      );
      const photoId = uploadResponse.body.id;

      // User B tries to delete User A's photo
      const clientB = new ApiClient(request);
      const authHelperB = new AuthHelper(clientB);
      const userB = await authHelperB.registerAndLogin(
        `apitest-delete-${Date.now()}@test.com`,
        'User B',
        'Test@1234'
      );

      const deleteResponse = await clientB.delete(`/api/gallery/photo/${photoId}`, userB.token);

      expect(deleteResponse.status).toBe(403);

      // Verify photo still exists (not deleted)
      const checkResponse = await clientA.get(`/api/gallery/photo/${photoId}`, userA.token);
      expect(checkResponse.status).toBe(200);
      expect(checkResponse.body.id).toBe(photoId);
      expect(checkResponse.body.title).toBe('User A Photo - Cannot Delete');
    });

    test('should fail delete non-existent photo (404 Not Found)', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Try to delete non-existent photo
      const deleteResponse = await client.delete('/api/gallery/photo/999999', token);

      expect(deleteResponse.status).toBe(404);
    });

    test('should delete multiple photos and verify my-photos updates', async ({ request }) => {
      const { token } = await getAuthenticatedUser(request);
      const client = new ApiClient(request);

      // Upload 3 photos
      const photoIds: number[] = [];
      for (let i = 1; i <= 3; i++) {
        const uploadResponse = await client.postMultipart(
          '/api/gallery/upload',
          {
            file: './tests/fixtures/images/test-photo.jpg',
            title: `Delete Test Photo ${i}`,
            isPublic: 'false'
          },
          token
        );
        photoIds.push(uploadResponse.body.id);
      }

      // Get initial count
      const beforeResponse = await client.get('/api/gallery/my-photos?page=0&size=100', token);
      const initialCount = beforeResponse.body.totalPhotos;

      // Delete all 3 photos
      for (const photoId of photoIds) {
        const deleteResponse = await client.delete(`/api/gallery/photo/${photoId}`, token);
        expect(deleteResponse.status).toBe(204);
      }

      // Verify count decreased by 3
      const afterResponse = await client.get('/api/gallery/my-photos?page=0&size=100', token);
      const finalCount = afterResponse.body.totalPhotos;
      expect(finalCount).toBe(initialCount - 3);

      // Verify none of the deleted photos exist
      for (const photoId of photoIds) {
        const photo = afterResponse.body.photos.find((p: any) => p.id === photoId);
        expect(photo).toBeUndefined();
      }
    });
  });

  // Toggle Privacy Tests - Day 6
  test.describe('PUT /api/gallery/photo/:id/toggle-privacy', () => {
    // Tests will be implemented here
  });

  // Gallery Sorting API Tests - Gallery Sorting Feature
  test.describe('Gallery Sorting API', () => {

    test.describe('GET /api/gallery/public with sortBy parameter', () => {

      test('API-SORT-001: should sort public photos by newest (default)', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        // Upload 3 public photos with delays to ensure different timestamps
        for (let i = 1; i <= 3; i++) {
          await client.postMultipart(
            '/api/gallery/upload',
            {
              file: './tests/fixtures/images/test-photo.jpg',
              title: `Newest Test ${i}`,
              isPublic: 'true'
            },
            token
          );
          await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
        }

        // Get public photos sorted by newest (default)
        const response = await client.get('/api/gallery/public?page=0&size=12&sortBy=newest', token);

        expect(response.status).toBe(200);
        expect(response.body.photos).toBeTruthy();
        expect(Array.isArray(response.body.photos)).toBe(true);

        // Verify photos are sorted by createdAt descending
        const photos = response.body.photos;
        for (let i = 0; i < photos.length - 1; i++) {
          const current = new Date(photos[i].createdAt).getTime();
          const next = new Date(photos[i + 1].createdAt).getTime();
          expect(current).toBeGreaterThanOrEqual(next);
        }
      });

      test('API-SORT-002: should sort public photos by oldest', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        // Upload 3 public photos
        for (let i = 1; i <= 3; i++) {
          await client.postMultipart(
            '/api/gallery/upload',
            {
              file: './tests/fixtures/images/test-photo.jpg',
              title: `Oldest Test ${i}`,
              isPublic: 'true'
            },
            token
          );
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Get public photos sorted by oldest
        const response = await client.get('/api/gallery/public?page=0&size=12&sortBy=oldest', token);

        expect(response.status).toBe(200);
        expect(response.body.photos).toBeTruthy();

        // Verify photos are sorted by createdAt ascending
        const photos = response.body.photos;
        for (let i = 0; i < photos.length - 1; i++) {
          const current = new Date(photos[i].createdAt).getTime();
          const next = new Date(photos[i + 1].createdAt).getTime();
          expect(current).toBeLessThanOrEqual(next);
        }
      });

      test('API-SORT-003: should sort public photos by mostLiked', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        // Get public photos sorted by most liked
        const response = await client.get('/api/gallery/public?page=0&size=12&sortBy=mostLiked', token);

        expect(response.status).toBe(200);
        expect(response.body.photos).toBeTruthy();

        // Verify response includes like counts
        const photos = response.body.photos;
        if (photos.length > 0) {
          expect(photos[0].likeCount).toBeDefined();
          expect(typeof photos[0].likeCount).toBe('number');
        }

        // Verify photos are sorted by like count descending
        for (let i = 0; i < photos.length - 1; i++) {
          expect(photos[i].likeCount).toBeGreaterThanOrEqual(photos[i + 1].likeCount);
        }
      });

      test('API-SORT-004: should sort public photos by mostFavorited', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        // Get public photos sorted by most favorited
        const response = await client.get('/api/gallery/public?page=0&size=12&sortBy=mostFavorited', token);

        expect(response.status).toBe(200);
        expect(response.body.photos).toBeTruthy();

        // Verify response includes favorite counts
        const photos = response.body.photos;
        if (photos.length > 0) {
          expect(photos[0].favoriteCount).toBeDefined();
          expect(typeof photos[0].favoriteCount).toBe('number');
        }

        // Verify photos are sorted by favorite count descending
        for (let i = 0; i < photos.length - 1; i++) {
          expect(photos[i].favoriteCount).toBeGreaterThanOrEqual(photos[i + 1].favoriteCount);
        }
      });

      test('API-SORT-005: should default to newest when sortBy parameter is missing', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        // Get public photos without sortBy parameter
        const response = await client.get('/api/gallery/public?page=0&size=12', token);

        expect(response.status).toBe(200);
        expect(response.body.photos).toBeTruthy();

        // Verify photos are sorted by newest (default)
        const photos = response.body.photos;
        for (let i = 0; i < photos.length - 1; i++) {
          const current = new Date(photos[i].createdAt).getTime();
          const next = new Date(photos[i + 1].createdAt).getTime();
          expect(current).toBeGreaterThanOrEqual(next);
        }
      });

      test('API-SORT-006: should return 400 for invalid sortBy parameter', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        // Try to get photos with invalid sortBy
        const response = await client.get('/api/gallery/public?page=0&size=12&sortBy=invalidOption', token);

        // Should return 400 Bad Request
        expect(response.status).toBe(400);
        expect(response.body.message || response.body.error).toBeTruthy();
      });
    });

    test.describe('GET /api/gallery/my-photos with sortBy parameter', () => {

      test('API-SORT-007: should sort my photos by newest', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        // Upload 3 photos
        for (let i = 1; i <= 3; i++) {
          await client.postMultipart(
            '/api/gallery/upload',
            {
              file: './tests/fixtures/images/test-photo.jpg',
              title: `My Photo ${i}`,
              isPublic: 'false'
            },
            token
          );
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Get my photos sorted by newest
        const response = await client.get('/api/gallery/my-photos?page=0&size=12&sortBy=newest', token);

        expect(response.status).toBe(200);
        expect(response.body.photos).toBeTruthy();

        // Verify photos are sorted by createdAt descending
        const photos = response.body.photos;
        for (let i = 0; i < photos.length - 1; i++) {
          const current = new Date(photos[i].createdAt).getTime();
          const next = new Date(photos[i + 1].createdAt).getTime();
          expect(current).toBeGreaterThanOrEqual(next);
        }
      });

      test('API-SORT-008: should sort my photos by oldest', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        // Get my photos sorted by oldest
        const response = await client.get('/api/gallery/my-photos?page=0&size=12&sortBy=oldest', token);

        expect(response.status).toBe(200);
        expect(response.body.photos).toBeTruthy();

        // Verify photos are sorted by createdAt ascending
        const photos = response.body.photos;
        for (let i = 0; i < photos.length - 1; i++) {
          const current = new Date(photos[i].createdAt).getTime();
          const next = new Date(photos[i + 1].createdAt).getTime();
          expect(current).toBeLessThanOrEqual(next);
        }
      });

      test('API-SORT-009: should sort my photos by mostLiked', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        // Get my photos sorted by most liked
        const response = await client.get('/api/gallery/my-photos?page=0&size=12&sortBy=mostLiked', token);

        expect(response.status).toBe(200);
        expect(response.body.photos).toBeTruthy();

        // Verify photos are sorted by like count
        const photos = response.body.photos;
        for (let i = 0; i < photos.length - 1; i++) {
          expect(photos[i].likeCount).toBeGreaterThanOrEqual(photos[i + 1].likeCount);
        }
      });

      test('API-SORT-010: should sort my photos by mostFavorited', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        // Get my photos sorted by most favorited
        const response = await client.get('/api/gallery/my-photos?page=0&size=12&sortBy=mostFavorited', token);

        expect(response.status).toBe(200);
        expect(response.body.photos).toBeTruthy();

        // Verify photos are sorted by favorite count
        const photos = response.body.photos;
        for (let i = 0; i < photos.length - 1; i++) {
          expect(photos[i].favoriteCount).toBeGreaterThanOrEqual(photos[i + 1].favoriteCount);
        }
      });
    });

    test.describe('Pagination with Sorting', () => {

      test('API-SORT-011: should maintain sort order across pagination pages', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        // Upload 15 photos to test pagination
        for (let i = 1; i <= 15; i++) {
          await client.postMultipart(
            '/api/gallery/upload',
            {
              file: './tests/fixtures/images/test-photo.jpg',
              title: `Pagination Test ${i}`,
              isPublic: 'true'
            },
            token
          );
        }

        // Get page 0 sorted by newest
        const page0Response = await client.get('/api/gallery/public?page=0&size=12&sortBy=newest', token);

        // Get page 1 sorted by newest
        const page1Response = await client.get('/api/gallery/public?page=1&size=12&sortBy=newest', token);

        expect(page0Response.status).toBe(200);
        expect(page1Response.status).toBe(200);

        // Verify both pages are sorted correctly
        const page0Photos = page0Response.body.photos;
        const page1Photos = page1Response.body.photos;

        // Page 0 should be sorted
        for (let i = 0; i < page0Photos.length - 1; i++) {
          const current = new Date(page0Photos[i].createdAt).getTime();
          const next = new Date(page0Photos[i + 1].createdAt).getTime();
          expect(current).toBeGreaterThanOrEqual(next);
        }

        // Last photo of page 0 should be older than first photo of page 1
        if (page0Photos.length > 0 && page1Photos.length > 0) {
          const lastPage0 = new Date(page0Photos[page0Photos.length - 1].createdAt).getTime();
          const firstPage1 = new Date(page1Photos[0].createdAt).getTime();
          expect(lastPage0).toBeGreaterThanOrEqual(firstPage1);
        }
      });

      test('API-SORT-012: should work with empty results', async ({ request }) => {
        // Create new user with no photos
        const client = new ApiClient(request);
        const authHelper = new AuthHelper(client);

        const newUser = await authHelper.registerAndLogin(
          `apitest-empty-sort-${Date.now()}@test.com`,
          'Empty Sort User',
          'Test@1234'
        );

        // Get my photos with sortBy (should be empty)
        const response = await client.get('/api/gallery/my-photos?page=0&size=12&sortBy=mostLiked', newUser.token);

        expect(response.status).toBe(200);
        expect(response.body.photos).toBeTruthy();
        expect(Array.isArray(response.body.photos)).toBe(true);
        expect(response.body.photos.length).toBe(0);
        expect(response.body.totalPhotos).toBe(0);
      });
    });

    test.describe('Data Integrity with Sorting', () => {

      test('API-SORT-013: should include correct like and favorite counts', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        // Upload a public photo
        const uploadResponse = await client.postMultipart(
          '/api/gallery/upload',
          {
            file: './tests/fixtures/images/test-photo.jpg',
            title: 'Integrity Test Photo',
            isPublic: 'true'
          },
          token
        );

        // Get public photos with sorting
        const response = await client.get('/api/gallery/public?page=0&size=12&sortBy=mostLiked', token);

        expect(response.status).toBe(200);

        // Verify each photo has like and favorite counts
        const photos = response.body.photos;
        photos.forEach((photo: any) => {
          expect(photo.likeCount).toBeDefined();
          expect(photo.favoriteCount).toBeDefined();
          expect(typeof photo.likeCount).toBe('number');
          expect(typeof photo.favoriteCount).toBe('number');
          expect(photo.likeCount).toBeGreaterThanOrEqual(0);
          expect(photo.favoriteCount).toBeGreaterThanOrEqual(0);
        });
      });

      test('API-SORT-014: should include user-specific flags (isLikedByUser, isFavoritedByUser)', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        // Get public photos
        const response = await client.get('/api/gallery/public?page=0&size=12&sortBy=newest', token);

        expect(response.status).toBe(200);

        // Verify each photo has user-specific flags
        const photos = response.body.photos;
        photos.forEach((photo: any) => {
          expect(photo.isLikedByUser).toBeDefined();
          expect(photo.isFavoritedByUser).toBeDefined();
          expect(typeof photo.isLikedByUser).toBe('boolean');
          expect(typeof photo.isFavoritedByUser).toBe('boolean');
        });
      });
    });

    test.describe('Response Performance', () => {

      test('API-SORT-015: should respond within acceptable time (< 1000ms)', async ({ request }) => {
        const { token } = await getAuthenticatedUser(request);
        const client = new ApiClient(request);

        const startTime = Date.now();

        const response = await client.get('/api/gallery/public?page=0&size=25&sortBy=mostLiked', token);

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        expect(response.status).toBe(200);
        // Response time should be under 1 second (generous for CI/CD environments)
        expect(responseTime).toBeLessThan(1000);
      });
    });
  });
});
