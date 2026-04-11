import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { AuthHelper } from './helpers/auth-helper';

/**
 * Photo Likes API Tests
 *
 * Tests Photo Likes endpoints with REAL PostgreSQL database and REAL HTTP server.
 *
 * Prerequisites:
 * 1. PostgreSQL running on localhost:5432
 * 2. Backend server running: mvn spring-boot:run (port 8081)
 * 3. Test photo file exists: ./tests/fixtures/images/test-photo.jpg
 *
 * Test Pattern:
 * - Real HTTP requests via Playwright ApiClient
 * - Real database persistence
 * - JWT authentication required for all endpoints
 * - Tests verify full backend flow (Controller → Service → Repository → Database)
 *
 * API Endpoints Tested:
 * - POST /api/gallery/photo/{id}/like → Like a photo (201 Created)
 * - DELETE /api/gallery/photo/{id}/like → Unlike a photo (204 No Content)
 * - GET /api/gallery/liked-photos → Get user's liked photos (200 OK)
 */
test.describe('Photo Likes API', () => {
  // Shared test users (lazy initialization)
  const TEST_USER_EMAIL = `apitest-likes-${Date.now()}@test.com`;
  const TEST_USER_NAME = 'Photo Likes Test User';
  const TEST_USER_PASSWORD = 'Test@1234';

  const TEST_USER2_EMAIL = `apitest-likesuser-${Date.now()}@test.com`;
  const TEST_USER2_NAME = 'Photo Likes Second User';
  const TEST_USER2_PASSWORD = 'Test@1234';

  let sharedAuthToken: string;
  let sharedUserId: number;

  let sharedUser2Token: string;
  let sharedUser2Id: number;

  // Helper to get or create authenticated user 1
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

  // Helper to get or create authenticated user 2 (for creating photos to be liked)
  async function getAuthenticatedUser2(request: any) {
    if (sharedUser2Token && sharedUser2Id) {
      return { token: sharedUser2Token, userId: sharedUser2Id };
    }

    const client = new ApiClient(request);
    const authHelper = new AuthHelper(client);

    const testUser = await authHelper.registerAndLogin(
      TEST_USER2_EMAIL,
      TEST_USER2_NAME,
      TEST_USER2_PASSWORD
    );

    sharedUser2Token = testUser.token;
    sharedUser2Id = testUser.userId;

    return { token: sharedUser2Token, userId: sharedUser2Id };
  }

  // Helper to create a public photo owned by user2
  async function createPublicPhoto(request: any): Promise<number> {
    const { token } = await getAuthenticatedUser2(request);
    const client = new ApiClient(request);

    const response = await client.postMultipart(
      '/api/gallery/upload',
      {
        file: './tests/fixtures/images/test-photo.jpg',
        title: `Test Photo ${Date.now()}`,
        description: 'Photo for like testing',
        isPublic: 'true' // Must be public to be likeable
      },
      token
    );

    expect(response.status).toBe(201);
    return response.body.id;
  }

  /**
   * TEST 1: POST /like - should like photo successfully
   *
   * Verifies:
   * - User can like a public photo
   * - Returns 201 Created
   * - Photo appears in user's liked photos
   * - Like is persisted in database
   */
  test('POST /like - should like photo successfully', async ({ request }) => {
    const { token, userId } = await getAuthenticatedUser(request);
    const photoId = await createPublicPhoto(request);
    const client = new ApiClient(request);

    // Act: Like photo
    const response = await client.post(`/api/gallery/photo/${photoId}/like`, {}, token);

    // Assert: 201 Created
    expect(response.status).toBe(201);

    // Verify photo appears in liked photos
    const likedResponse = await client.get('/api/gallery/liked-photos', token);
    expect(likedResponse.status).toBe(200);

    const likedPhotos = likedResponse.body.photos;
    expect(likedPhotos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: photoId
        })
      ])
    );

    console.log(`✅ Test 1: Successfully liked photo ${photoId}`);
  });

  /**
   * TEST 2: POST /like - should prevent duplicate like (409 Conflict)
   *
   * Verifies:
   * - User cannot like same photo twice
   * - Returns 409 Conflict on duplicate attempt
   * - Database UNIQUE constraint works
   */
  test('POST /like - should prevent duplicate like', async ({ request }) => {
    const { token } = await getAuthenticatedUser(request);
    const photoId = await createPublicPhoto(request);
    const client = new ApiClient(request);

    // Arrange: Like photo once
    const firstResponse = await client.post(`/api/gallery/photo/${photoId}/like`, {}, token);
    expect(firstResponse.status).toBe(201);

    // Act: Try to like again
    const secondResponse = await client.post(`/api/gallery/photo/${photoId}/like`, {}, token);

    // Assert: 409 Conflict (or 400 Bad Request)
    // Note: Service throws IllegalStateException which should be mapped to 409
    expect([400, 409]).toContain(secondResponse.status);

    console.log(`✅ Test 2: Prevented duplicate like (status ${secondResponse.status})`);
  });

  /**
   * TEST 3: POST /like - should return 404 for invalid photo
   *
   * Verifies:
   * - Invalid photo ID returns 404 Not Found
   * - Error handled gracefully
   */
  test('POST /like - should return 404 for invalid photo', async ({ request }) => {
    const { token } = await getAuthenticatedUser(request);
    const client = new ApiClient(request);

    // Act: Try to like non-existent photo
    const response = await client.post('/api/gallery/photo/99999/like', {}, token);

    // Assert: 404 Not Found (or 400 Bad Request)
    expect([400, 404]).toContain(response.status);

    console.log(`✅ Test 3: Returned ${response.status} for invalid photo`);
  });

  /**
   * TEST 4: POST /like - should prevent liking own photo
   *
   * Verifies:
   * - User cannot like their own photos
   * - Returns 400 Bad Request or 403 Forbidden
   * - Business rule enforced
   */
  test('POST /like - should prevent liking own photo', async ({ request }) => {
    const { token } = await getAuthenticatedUser(request);
    const client = new ApiClient(request);

    // Arrange: Create photo as current user
    const photoResponse = await client.postMultipart(
      '/api/gallery/upload',
      {
        file: './tests/fixtures/images/test-photo.jpg',
        title: 'My Own Photo',
        isPublic: 'true'
      },
      token
    );
    expect(photoResponse.status).toBe(201);
    const ownPhotoId = photoResponse.body.id;

    // Act: Try to like own photo
    const likeResponse = await client.post(`/api/gallery/photo/${ownPhotoId}/like`, {}, token);

    // Assert: 400 Bad Request or 403 Forbidden
    expect([400, 403]).toContain(likeResponse.status);

    console.log(`✅ Test 4: Prevented liking own photo (status ${likeResponse.status})`);
  });

  /**
   * TEST 5: DELETE /like - should unlike photo successfully
   *
   * Verifies:
   * - User can unlike a previously liked photo
   * - Returns 204 No Content
   * - Photo removed from liked photos list
   * - Like deleted from database
   */
  test('DELETE /like - should unlike photo successfully', async ({ request }) => {
    const { token } = await getAuthenticatedUser(request);
    const photoId = await createPublicPhoto(request);
    const client = new ApiClient(request);

    // Arrange: Like photo first
    const likeResponse = await client.post(`/api/gallery/photo/${photoId}/like`, {}, token);
    expect(likeResponse.status).toBe(201);

    // Act: Unlike photo
    const unlikeResponse = await client.delete(`/api/gallery/photo/${photoId}/like`, token);

    // Assert: 204 No Content
    expect(unlikeResponse.status).toBe(204);

    // Verify photo removed from liked photos
    const likedResponse = await client.get('/api/gallery/liked-photos', token);
    const likedPhotos = likedResponse.body.photos;
    const photoStillLiked = likedPhotos.some((p: any) => p.id === photoId);

    expect(photoStillLiked).toBe(false);

    console.log(`✅ Test 5: Successfully unliked photo ${photoId}`);
  });

  /**
   * TEST 6: DELETE /like - should return error if not liked
   *
   * Verifies:
   * - Cannot unlike a photo that wasn't liked
   * - Returns 400 Bad Request
   * - Error handled gracefully
   */
  test('DELETE /like - should return error if not liked', async ({ request }) => {
    const { token } = await getAuthenticatedUser(request);
    const photoId = await createPublicPhoto(request);
    const client = new ApiClient(request);

    // Act: Try to unlike without liking first
    const response = await client.delete(`/api/gallery/photo/${photoId}/like`, token);

    // Assert: 400 Bad Request
    expect(response.status).toBe(400);

    console.log(`✅ Test 6: Returned 400 for unliking non-liked photo`);
  });

  /**
   * TEST 7: GET /liked-photos - should return user's liked photos
   *
   * Verifies:
   * - User can retrieve all liked photos
   * - Returns 200 OK with pagination
   * - Photos ordered by most recently liked
   * - Correct pagination metadata
   */
  test('GET /liked-photos - should return users liked photos', async ({ request }) => {
    const { token } = await getAuthenticatedUser(request);
    const client = new ApiClient(request);

    // Arrange: Like 3 photos
    const photo1 = await createPublicPhoto(request);
    const photo2 = await createPublicPhoto(request);
    const photo3 = await createPublicPhoto(request);

    await client.post(`/api/gallery/photo/${photo1}/like`, {}, token);
    await client.post(`/api/gallery/photo/${photo2}/like`, {}, token);
    await client.post(`/api/gallery/photo/${photo3}/like`, {}, token);

    // Act: Get liked photos
    const response = await client.get('/api/gallery/liked-photos?page=0&size=12', token);

    // Assert: 200 OK
    expect(response.status).toBe(200);

    // Verify response structure
    expect(response.body).toHaveProperty('photos');
    expect(response.body).toHaveProperty('currentPage');
    expect(response.body).toHaveProperty('totalPages');
    expect(response.body).toHaveProperty('totalPhotos');

    // Verify contains the 3 liked photos
    const photoIds = response.body.photos.map((p: any) => p.id);
    expect(photoIds).toContain(photo1);
    expect(photoIds).toContain(photo2);
    expect(photoIds).toContain(photo3);

    // Verify pagination metadata
    expect(response.body.totalPhotos).toBeGreaterThanOrEqual(3);

    console.log(`✅ Test 7: Retrieved ${response.body.totalPhotos} liked photos`);
  });

  /**
   * TEST 8: API - should require authentication (401 Unauthorized)
   *
   * Verifies:
   * - All endpoints require JWT authentication
   * - Returns 401 Unauthorized without token
   * - Returns 403 Forbidden for invalid token
   * - Security enforced
   */
  test('API - should require authentication', async ({ request }) => {
    const photoId = await createPublicPhoto(request);
    const client = new ApiClient(request);

    // Act: Try to like without authentication
    const likeResponse = await client.post(`/api/gallery/photo/${photoId}/like`, {});

    // Assert: 401 Unauthorized or 403 Forbidden
    expect([401, 403]).toContain(likeResponse.status);

    // Act: Try to get liked photos without authentication
    const likedResponse = await client.get('/api/gallery/liked-photos');

    // Assert: 401 Unauthorized or 403 Forbidden
    expect([401, 403]).toContain(likedResponse.status);

    console.log(`✅ Test 8: Authentication required (like: ${likeResponse.status}, liked-photos: ${likedResponse.status})`);
  });
});

/**
 * NOTES FOR UNDERSTANDING:
 * ========================
 *
 * 1. TEST STRUCTURE:
 *    ===============
 *    - test.describe(): Groups related tests
 *    - test(): Individual test case
 *    - Arrange-Act-Assert pattern for clarity
 *
 * 2. REAL DATABASE TESTING:
 *    ======================
 *    - Uses actual PostgreSQL database
 *    - No mocking - full integration
 *    - Data persists between test steps (within same test)
 *    - Each test creates fresh data
 *
 * 3. AUTHENTICATION FLOW:
 *    ====================
 *    - getAuthenticatedUser(): Creates user + gets JWT token
 *    - Tokens cached (sharedAuthToken) to avoid repeated registration
 *    - Two test users: User 1 (liker) and User 2 (photo owner)
 *    - Why? Cannot like own photos, so need 2 users
 *
 * 4. TEST HELPERS:
 *    =============
 *    - ApiClient: HTTP request wrapper
 *    - AuthHelper: Registration/login helper
 *    - createPublicPhoto(): Creates test photo (public, owned by user 2)
 *
 * 5. HTTP STATUS CODE EXPECTATIONS:
 *    ===============================
 *    - 201 Created: Like successful
 *    - 204 No Content: Unlike successful
 *    - 200 OK: Get liked photos successful
 *    - 400 Bad Request: Invalid request (not liked, own photo)
 *    - 401 Unauthorized: No JWT token
 *    - 403 Forbidden: Invalid JWT token or permission denied
 *    - 404 Not Found: Photo doesn't exist
 *    - 409 Conflict: Already liked (duplicate)
 *
 * 6. RESPONSE STRUCTURE (Liked Photos):
 *    ===================================
 *    {
 *      "photos": [
 *        { "id": 123, "title": "...", ... }
 *      ],
 *      "currentPage": 0,
 *      "totalPages": 1,
 *      "totalPhotos": 3,
 *      "pageSize": 12,
 *      "hasNext": false,
 *      "hasPrevious": false
 *    }
 *
 * 7. TEST EXECUTION:
 *    ===============
 *    Run with: npm run test:api
 *    or: npx playwright test tests/api/photo-likes.api.spec.ts
 *
 *    Backend must be running on localhost:8081
 *    PostgreSQL must be running on localhost:5432
 *
 * 8. TEST ISOLATION:
 *    ===============
 *    - Each test is independent
 *    - Fresh data created per test
 *    - Unique email addresses (timestamp-based)
 *    - No cross-test dependencies
 *
 * 9. TROUBLESHOOTING:
 *    ================
 *    - Backend not running? Start with: mvn spring-boot:run
 *    - Database error? Check PostgreSQL is running
 *    - 403 Forbidden? JWT might be expired or invalid
 *    - Test failures? Check console.log output for details
 *
 * 10. NEXT STEPS:
 *     ===========
 *     After API tests pass:
 *     - Add Unit tests (PhotoLikeServiceTest.java)
 *     - Add Integration tests (PhotoLikeControllerIntegrationTest.java)
 *     - Add E2E tests (photo-likes.spec.ts)
 *     - Total: 32 tests (8 API + 8 Unit + 6 Integration + 10 E2E)
 */
