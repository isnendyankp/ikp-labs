# 🔌 API Testing Guide

**Backend contract testing** using Playwright's API testing capabilities.

## Overview

API tests verify backend endpoints from an **external client perspective** using real HTTP requests. These tests validate:
- ✅ Endpoint contracts (request/response structure)
- ✅ Authentication & authorization
- ✅ Error handling & status codes
- ✅ Data persistence in PostgreSQL
- ✅ Business logic enforcement

**Note:** API tests are **NOT** the same as Integration tests. See [API vs Integration](#-api-vs-integration-tests) below.

## 🚀 Quick Start

### Prerequisites

**Only backend is required:**

```bash
# Terminal 1: Backend (port 8081)
cd backend/ikp-labs-api
mvn spring-boot:run
```

Frontend is **NOT** required for API tests!

### Run API Tests

```bash
# Run all API tests
npx playwright test tests/api/

# Run specific test file
npx playwright test tests/api/auth.api.spec.ts
npx playwright test tests/api/gallery.api.spec.ts

# Run with visible output
npx playwright test tests/api/ --reporter=list

# Run with detailed output
npx playwright test tests/api/ --reporter=line
```

## 📋 Test Files

### Core Authentication

**[auth.api.spec.ts](auth.api.spec.ts)** - Authentication endpoints
- ✅ POST `/api/auth/register` - User registration
- ✅ POST `/api/auth/login` - User login (returns JWT)
- ✅ POST `/api/auth/refresh` - Token refresh
- ✅ POST `/api/auth/validate` - Token validation
- ✅ Duplicate email prevention
- ✅ Password validation
- ✅ JWT token generation

**[protected.api.spec.ts](protected.api.spec.ts)** - Protected endpoints (requires JWT)
- ✅ GET `/api/profile` - User profile
- ✅ GET `/api/dashboard` - User dashboard
- ✅ GET `/api/settings` - User settings
- ✅ 401 Unauthorized without token
- ✅ 401 Unauthorized with invalid token
- ✅ Authorization header handling

### User Management

**[users.api.spec.ts](users.api.spec.ts)** - User CRUD operations
- ✅ GET `/api/users` - List all users
- ✅ GET `/api/users/{id}` - Get user by ID
- ✅ GET `/api/users/email/{email}` - Get user by email
- ✅ GET `/api/users/count` - Count total users
- ✅ PUT `/api/users/{id}` - Update user
- ✅ DELETE `/api/users/{id}` - Delete user
- ✅ 404 Not Found handling
- ✅ Data validation

### Gallery & Photos

**[gallery.api.spec.ts](gallery.api.spec.ts)** - Photo gallery endpoints
- ✅ GET `/api/photos` - List all photos (paginated)
- ✅ GET `/api/photos/{id}` - Get photo details
- ✅ GET `/api/photos/user/{userId}` - Get user's photos
- ✅ POST `/api/photos` - Upload photo
- ✅ DELETE `/api/photos/{id}` - Delete photo
- ✅ Pagination (page, size parameters)
- ✅ Authorization (can only delete own photos)
- ✅ File upload handling

**[photo-likes.api.spec.ts](photo-likes.api.spec.ts)** - Photo likes feature
- ✅ POST `/api/photos/{photoId}/like` - Like a photo
- ✅ DELETE `/api/photos/{photoId}/like` - Unlike a photo
- ✅ GET `/api/photos/liked` - Get user's liked photos
- ✅ Cannot like own photos (business rule)
- ✅ Duplicate like prevention
- ✅ Like count accuracy

### Error Handling

**[error-handling.api.spec.ts](error-handling.api.spec.ts)** - Error scenarios
- ✅ 400 Bad Request - Invalid data
- ✅ 401 Unauthorized - Missing/invalid token
- ✅ 404 Not Found - Resource doesn't exist
- ✅ 409 Conflict - Duplicate resource
- ✅ Error response format consistency

### Health Check

**[health.api.spec.ts](health.api.spec.ts)** - API health monitoring
- ✅ GET `/api/health` - Health check endpoint
- ✅ Response time validation
- ✅ Uptime monitoring

## 📁 Helpers

**[helpers/](helpers/)** - Reusable API test utilities

**[api-client.ts](helpers/api-client.ts)** - HTTP request wrapper
```typescript
import { ApiClient } from './helpers/api-client';

const client = new ApiClient(request);

// GET request
const response = await client.get('/api/users');

// POST request
const response = await client.post('/api/auth/register', {
  fullName: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123!'
});

// PUT request
const response = await client.put('/api/users/123', { fullName: 'Jane Doe' });

// DELETE request
const response = await client.delete('/api/users/123');
```

**[auth-helper.ts](helpers/auth-helper.ts)** - Authentication utilities
```typescript
import { AuthHelper } from './helpers/auth-helper';

// Register new user
const { token, userId } = await AuthHelper.register(request, {
  fullName: 'Test User',
  email: 'test@example.com',
  password: 'Password123!'
});

// Login existing user
const { token } = await AuthHelper.login(request, 'test@example.com', 'Password123!');

// Validate token
const isValid = await AuthHelper.validateToken(request, token);

// Get authenticated headers
const headers = AuthHelper.getAuthHeaders(token);
```

**[test-data.ts](helpers/test-data.ts)** - Test data generators
```typescript
import { generateUniqueEmail, generateRandomName } from './helpers/test-data';

// Generate unique email (with timestamp)
const email = generateUniqueEmail();
// => "testuser-1702893847123@example.com"

// Generate random name
const name = generateRandomName();
// => "John Smith"
```

**[cleanup.ts](helpers/cleanup.ts)** - Database cleanup utilities
```typescript
import { deleteTestUser } from './helpers/cleanup';

// Delete test user after test
await deleteTestUser(request, testEmail);
```

## 📝 Writing New API Tests

### Basic API Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { generateUniqueEmail } from './helpers/test-data';

test.describe('My API Tests', () => {

  test('should create resource', async ({ request }) => {
    const client = new ApiClient(request);
    const email = generateUniqueEmail();

    // Make API request
    const response = await client.post('/api/resource', {
      name: 'Test Resource',
      email: email
    });

    // Verify status code
    expect(response.status).toBe(201);

    // Verify response body
    const data = await response.json();
    expect(data.email).toBe(email);
    expect(data.id).toBeDefined();
  });

});
```

### Testing Protected Endpoints

```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { AuthHelper } from './helpers/auth-helper';

test('should access protected endpoint with JWT', async ({ request }) => {
  const client = new ApiClient(request);

  // Step 1: Register and get token
  const { token } = await AuthHelper.register(request, {
    fullName: 'Test User',
    email: generateUniqueEmail(),
    password: 'Password123!'
  });

  // Step 2: Access protected endpoint
  const response = await request.get('http://localhost:8081/api/profile', {
    headers: AuthHelper.getAuthHeaders(token)
  });

  // Step 3: Verify success
  expect(response.status).toBe(200);
  const data = await response.json();
  expect(data.email).toBeDefined();
});
```

### Testing Error Scenarios

```typescript
test('should return 404 for non-existent resource', async ({ request }) => {
  const client = new ApiClient(request);

  const response = await client.get('/api/users/99999');

  // Verify 404 status
  expect(response.status).toBe(404);

  // Verify error message
  const error = await response.json();
  expect(error.message).toContain('not found');
});

test('should return 401 without token', async ({ request }) => {
  const response = await request.get('http://localhost:8081/api/profile');

  expect(response.status).toBe(401);
});
```

### Testing with Data Cleanup

```typescript
import { deleteTestUser } from './helpers/cleanup';

test('should handle user lifecycle', async ({ request }) => {
  const client = new ApiClient(request);
  const email = generateUniqueEmail();

  try {
    // Create user
    const createResponse = await client.post('/api/users', {
      fullName: 'Test User',
      email: email,
      password: 'Password123!'
    });
    expect(createResponse.status).toBe(201);

    // Test something with the user
    const getResponse = await client.get(`/api/users/email/${email}`);
    expect(getResponse.status).toBe(200);

  } finally {
    // Cleanup: Delete test user
    await deleteTestUser(request, email);
  }
});
```

## 🎯 Best Practices

### 1. Test from External Perspective

```typescript
// ✅ GOOD: Test as an external client
const response = await request.post('http://localhost:8081/api/auth/register', {
  data: { fullName: 'Test', email: 'test@example.com', password: 'Pass123!' }
});
expect(response.status).toBe(201);

// ❌ BAD: Don't access internal Spring Boot components
// const userService = new UserService(); // WRONG for API tests
```

### 2. Verify Real Database Persistence

```typescript
// ✅ GOOD: Create via API, verify via another API call
await client.post('/api/users', { email: 'test@example.com', ... });

const response = await client.get('/api/users/email/test@example.com');
expect(response.status).toBe(200); // Data persisted in PostgreSQL

// ❌ BAD: Don't mock database in API tests
// Mock data doesn't verify real persistence
```

### 3. Test Complete Request/Response Cycle

```typescript
// ✅ GOOD: Test full cycle
const response = await client.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'Password123!'
});

expect(response.status).toBe(200);
const data = await response.json();
expect(data.token).toBeDefined();
expect(data.expiresIn).toBe(3600);

// ❌ BAD: Don't just check status code
expect(response.status).toBe(200); // Incomplete test
```

### 4. Always Clean Up Test Data

```typescript
// ✅ GOOD: Clean up after test
test('my test', async ({ request }) => {
  const email = generateUniqueEmail();

  try {
    // Test logic
  } finally {
    await deleteTestUser(request, email);
  }
});

// ❌ BAD: Leave test data in database
// Causes pollution and test failures
```

### 5. Use Unique Identifiers

```typescript
// ✅ GOOD: Generate unique emails
const email = generateUniqueEmail();
// => "testuser-1702893847123@example.com"

// ❌ BAD: Hard-coded test data
const email = 'test@example.com'; // Causes conflicts
```

## 🔍 API vs Integration Tests

| Aspect | API Tests | Integration Tests |
|--------|-----------|-------------------|
| **Location** | `/tests/api/` | `/backend/src/test/java/.../integration/` |
| **Tool** | Playwright API | Spring Boot Test (MockMvc) |
| **Perspective** | External client | Internal component wiring |
| **HTTP** | Real HTTP requests | Mock HTTP (MockMvc) |
| **Database** | ✅ Real PostgreSQL | ❌ Mocked (MockBean) |
| **Purpose** | Contract validation | Component interaction |
| **Run Command** | `npx playwright test tests/api/` | `mvn test` |
| **Example** | `POST /api/auth/login` → verify JWT | UserController → UserService wiring |

**When to use API tests:**
- Validate endpoint contracts
- Test authentication flows
- Verify real database persistence
- Test from external client perspective

**When to use Integration tests:**
- Test Spring Boot component wiring
- Test Controller → Service → Repository interaction
- Mock external dependencies
- Faster test execution (no database)

## 🐛 Debugging Tips

### 1. Check Backend is Running

```bash
# Verify backend is up
curl http://localhost:8081/api/health

# Should return: {"status":"UP"}
```

### 2. Add Console Logs

```typescript
test('my test', async ({ request }) => {
  console.log('🔍 Sending request...');

  const response = await client.post('/api/endpoint', data);

  console.log('📊 Status:', response.status);
  console.log('📦 Body:', await response.json());
});
```

### 3. Inspect Response Details

```typescript
const response = await client.get('/api/users');

console.log('Status:', response.status);
console.log('Headers:', response.headers());
console.log('Body:', await response.text());
```

### 4. Test with Postman First

If API test fails:
1. Try the same request in Postman
2. Verify endpoint works manually
3. Copy working request to test

### 5. Check Database State

```bash
# Connect to PostgreSQL
psql -U postgres -d ikp_labs_db

# Check test data
SELECT * FROM users WHERE email LIKE '%testuser%';
```

## 📊 Test Reports

```bash
# Run tests
npx playwright test tests/api/

# Open HTML report
npx playwright show-report
```

## 🔗 Related Documentation

- [Main Testing Guide](../README.md) - Overview of all test types
- [E2E Testing Guide](../e2e/README.md) - Browser-based tests
- [Gherkin/BDD Guide](../gherkin/README.md) - Business-friendly specs
- [API Testing Guide](../../docs/how-to/api-testing.md) - Complete guide
- [Playwright API Testing Docs](https://playwright.dev/docs/api-testing) - Official docs

## 🆘 Common Issues

### Issue: "connect ECONNREFUSED 127.0.0.1:8081"

**Cause:** Backend not running

**Solution:**
```bash
cd backend/ikp-labs-api
mvn spring-boot:run
```

### Issue: "Duplicate key value violates unique constraint"

**Cause:** Test data not cleaned up from previous run

**Solution:**
```typescript
// Always use unique emails
const email = generateUniqueEmail();

// Always clean up after tests
test.afterEach(async ({ request }) => {
  await deleteTestUser(request, testEmail);
});
```

### Issue: "401 Unauthorized" on protected endpoint

**Cause:** Missing or invalid JWT token

**Solution:**
```typescript
// Get valid token first
const { token } = await AuthHelper.login(request, email, password);

// Include in request
const response = await request.get('http://localhost:8081/api/profile', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

**Happy API Testing! 🔌**

For questions or issues, check the [main testing guide](../README.md) or refer to the [complete API testing documentation](../../docs/how-to/api-testing.md).
