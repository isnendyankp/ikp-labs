# Technical Design - API Tests (Playwright)

## Overview

API tests use **Playwright** with **REAL PostgreSQL database** and **real HTTP server**. This is the highest level of backend testing before E2E.

## Architecture

```
API Test (Playwright)
    ↓ Real HTTP Request (via ApiClient)
Spring Boot Server (mvn spring-boot:run)
    ↓ Real Service Calls
PostgreSQL Database (localhost:5432)
    ↓ Real SQL
Database Tables (users, gallery_photos)
    +
Real File System (uploads/gallery/)
```

## Why Playwright?

**Decision:** Use Playwright instead of REST Assured for API testing

**Rationale:**
1. ✅ **Already Configured** - `playwright.config.ts` has API Tests project configured
2. ✅ **Existing Infrastructure** - Helper classes (ApiClient, AuthHelper) ready to use
3. ✅ **Consistent Stack** - Same tool for API + E2E tests (TypeScript)
4. ✅ **Better DX** - UI mode, trace viewer, HTML reports built-in
5. ✅ **Type Safety** - TypeScript provides better type checking than Java
6. ✅ **Existing Patterns** - Reference tests already exist (`auth.api.spec.ts`, etc.)

## Setup Requirements

### 1. Database Setup
```bash
# PostgreSQL must be running
# Database: registrationform_db
# User: postgres
# Password: (your password)

# Verify PostgreSQL running
psql -U postgres -d registrationform_db
```

### 2. Server Running
```bash
# Terminal 1: Start backend server
cd backend/registration-form-api
mvn spring-boot:run

# Verify server started
curl http://localhost:8081/api/auth/health
# Expected: {"status":"UP"}

# Terminal 2: Run Playwright API tests
npx playwright test --project="API Tests"
```

### 3. Playwright Configuration

**Already configured in `playwright.config.ts`:**
```typescript
{
  name: 'API Tests',
  testDir: './tests/api',
  use: {
    baseURL: 'http://localhost:8081',  // Backend API
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }
}
```

### 4. Helper Classes (Already Exist!)

**ApiClient (`tests/api/helpers/api-client.ts`):**
- HTTP request wrapper with JWT token support
- Methods: `get()`, `post()`, `put()`, `delete()`, `postMultipart()`
- Automatic JSON serialization/deserialization
- Error handling and response validation

**AuthHelper (`tests/api/helpers/auth-helper.ts`):**
- User registration and login helpers
- JWT token generation and management
- Test user creation utilities

**TestData (`tests/api/helpers/test-data.ts`):**
- Test data generators
- Unique email generation
- Random data creation

## Test Pattern

### Base Structure

**gallery.api.spec.ts:**
```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { AuthHelper } from './helpers/auth-helper';

test.describe('Gallery Photo API', () => {
  let client: ApiClient;
  let authHelper: AuthHelper;
  let authToken: string;
  let userId: number;

  test.beforeAll(async ({ request }) => {
    client = new ApiClient(request);
    authHelper = new AuthHelper(request);

    // Register and login
    const testUser = await authHelper.registerAndLogin(
      'apitest@test.com',
      'Gallery Test User',
      'Test@1234'
    );

    authToken = testUser.token;
    userId = testUser.userId;
  });

  test.afterEach(async () => {
    // Cleanup: delete test photos
    // Cleanup happens automatically via database cascade
  });

  test.afterAll(async () => {
    // Cleanup: delete test user
    await authHelper.deleteUser(userId, authToken);
  });

  // Tests here...
});
```

### Upload with Multipart

```typescript
test('should upload photo with full metadata', async () => {
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
  expect(response.body.filePath).toContain('gallery/user-');
});
```

### Get with Pagination

```typescript
test('should get my photos with pagination', async () => {
  // Upload 2 photos first
  await client.postMultipart('/api/gallery/upload',
    { file: './test-photo1.jpg', title: 'Photo 1' },
    authToken
  );
  await client.postMultipart('/api/gallery/upload',
    { file: './test-photo2.jpg', title: 'Photo 2' },
    authToken
  );

  // Get my photos
  const response = await client.get(
    '/api/gallery/my-photos?page=0&size=12',
    authToken
  );

  expect(response.status).toBe(200);
  expect(response.body.photos).toHaveLength(2);
  expect(response.body.currentPage).toBe(0);
  expect(response.body.totalPhotos).toBe(2);
  expect(response.body.totalPages).toBe(1);
});
```

### Get Public Photos

```typescript
test('should get only public photos', async () => {
  // Upload 1 public + 1 private photo
  await client.postMultipart('/api/gallery/upload',
    { file: './photo1.jpg', title: 'Public', isPublic: 'true' },
    authToken
  );
  await client.postMultipart('/api/gallery/upload',
    { file: './photo2.jpg', title: 'Private', isPublic: 'false' },
    authToken
  );

  // Get public photos
  const response = await client.get('/api/gallery/public', authToken);

  expect(response.status).toBe(200);
  expect(response.body.photos).toHaveLength(1);
  expect(response.body.photos[0].title).toBe('Public');
  expect(response.body.photos[0].isPublic).toBe(true);
});
```

### Update Photo

```typescript
test('should update photo by owner', async () => {
  // Upload photo
  const uploadRes = await client.postMultipart('/api/gallery/upload',
    { file: './photo.jpg', title: 'Old Title' },
    authToken
  );
  const photoId = uploadRes.body.id;

  // Update photo
  const response = await client.put(
    `/api/gallery/photo/${photoId}`,
    {
      title: 'New Title',
      description: 'Updated description'
    },
    authToken
  );

  expect(response.status).toBe(200);
  expect(response.body.title).toBe('New Title');
  expect(response.body.description).toBe('Updated description');
});
```

### Delete Photo

```typescript
test('should delete photo by owner', async () => {
  // Upload photo
  const uploadRes = await client.postMultipart('/api/gallery/upload',
    { file: './photo.jpg', title: 'To Delete' },
    authToken
  );
  const photoId = uploadRes.body.id;

  // Delete photo
  const response = await client.delete(
    `/api/gallery/photo/${photoId}`,
    authToken
  );

  expect(response.status).toBe(204);

  // Verify photo deleted
  const getRes = await client.get(`/api/gallery/photo/${photoId}`, authToken);
  expect(getRes.status).toBe(404);
});
```

### Authorization Tests

```typescript
test('should forbid non-owner from updating photo', async () => {
  // User A uploads photo
  const photoRes = await client.postMultipart('/api/gallery/upload',
    { file: './photo.jpg', title: 'User A Photo' },
    authTokenA
  );
  const photoId = photoRes.body.id;

  // User B tries to update (should fail)
  const response = await client.put(
    `/api/gallery/photo/${photoId}`,
    { title: 'Hacked!' },
    authTokenB  // Different user's token
  );

  expect(response.status).toBe(403);
  expect(response.body.errorCode).toBe('GALLERY_UNAUTHORIZED');
  expect(response.body.message).toContain('not authorized');
});
```

## Key Differences

| Test Type | Database | Server | HTTP Client | Language |
|-----------|----------|--------|-------------|----------|
| Unit | None (mocked) | None | None | Java |
| Integration | Mocked (@MockBean) | Spring context | MockMvc (simulated) | Java |
| **API** | **Real PostgreSQL** | **Real (mvn spring-boot:run)** | **Playwright (real HTTP)** | **TypeScript** |
| E2E | Real PostgreSQL | Real (both BE + FE) | Playwright (browser) | TypeScript |

## Playwright vs REST Assured

| Feature | Playwright | REST Assured |
|---------|-----------|--------------|
| **Setup** | ✅ Already configured | ❌ Needs installation |
| **Language** | TypeScript | Java |
| **Helper Classes** | ✅ ApiClient, AuthHelper ready | ❌ Need to create |
| **Multipart Upload** | ✅ Built-in support | Requires REST Assured library |
| **JWT Handling** | ✅ AuthHelper exists | Need to implement |
| **Reports** | ✅ HTML, JSON, Trace | Maven Surefire |
| **UI Mode** | ✅ Interactive debugging | ❌ Not available |
| **Trace Viewer** | ✅ Visual timeline | ❌ Not available |
| **Consistency** | ✅ Same as E2E tests | ❌ Different stack |
| **Type Safety** | ✅ TypeScript | Partial (Java) |
| **Learning Curve** | ✅ Team familiar | Need to learn |

## Running Tests

```bash
# Run all Gallery API tests
npx playwright test tests/api/gallery.api.spec.ts

# Run with UI mode (interactive)
npx playwright test tests/api/gallery.api.spec.ts --ui

# Run specific test
npx playwright test -g "upload photo"

# Run all API tests
npx playwright test --project="API Tests"

# View HTML report
npx playwright show-report

# Debug mode
npx playwright test tests/api/gallery.api.spec.ts --debug

# Run with trace (for debugging failures)
npx playwright test tests/api/gallery.api.spec.ts --trace on
```

## Test Data Management

### Naming Convention
- Test users: `apitest*@test.com` (e.g., `apitest-upload@test.com`)
- Test photos: Use descriptive titles in tests
- Cleanup: Automatic via cascade delete when user deleted

### Cleanup Strategy
```typescript
test.afterAll(async () => {
  // Delete test user (cascade deletes all their photos)
  await authHelper.deleteUser(userId, authToken);

  // Files on disk cleaned up automatically by FileStorageService
  // when photo records are deleted from database
});
```

## File Structure

```
tests/
├── api/
│   ├── gallery.api.spec.ts          ← NEW! Gallery API tests
│   ├── auth.api.spec.ts             ← Existing (reference)
│   ├── users.api.spec.ts            ← Existing (reference)
│   ├── protected.api.spec.ts        ← Existing
│   ├── error-handling.api.spec.ts   ← Existing
│   └── helpers/
│       ├── api-client.ts            ← HTTP wrapper (existing)
│       ├── auth-helper.ts           ← Auth utilities (existing)
│       ├── test-data.ts             ← Data generators (existing)
│       └── cleanup.ts               ← Cleanup utilities (existing)
└── fixtures/
    └── images/                       ← Test images
        ├── test-photo.jpg
        ├── test-photo.png
        └── large-photo.jpg (>5MB)
```

## Success Criteria

- ✅ Real database operations verified
- ✅ Real file uploads working
- ✅ JWT authentication working
- ✅ Test cleanup preventing pollution
- ✅ Leverage existing Playwright infrastructure
- ✅ Consistent with E2E test patterns
- ✅ 35-40 Gallery API tests passing
- ✅ HTML reports generated
