# How to Run API Tests with Playwright

This guide shows you how to run automated API tests for the Registration Form backend using Playwright's request API.

## What is API Testing?

API testing is a type of testing that validates the backend endpoints directly, without using a browser or UI. Instead of clicking buttons and filling forms, we send HTTP requests directly to the API and verify the responses.

**Benefits of API testing:**
- **Fast:** No browser overhead, tests run in milliseconds
- **Reliable:** No UI flakiness or timing issues
- **Focused:** Tests only the backend logic and data
- **Coverage:** Can test edge cases that are hard to reach via UI

**Difference from E2E testing:**
- **E2E tests:** Test through the browser (click buttons, fill forms)
- **API tests:** Test backend directly (send HTTP requests)

Both types are important and complement each other!

## Prerequisites

Before running API tests, ensure the backend server is running:

**Terminal 1 - Backend Server:**
```bash
cd backend/ikp-labs-api
mvn spring-boot:run
```

Backend should be available at: `http://localhost:8081`

**Note:** API tests do NOT require the frontend to be running, since we're testing the backend directly.

## Test Structure

API tests are located in the `tests/api/` directory:

```
tests/api/
├── helpers/
│   ├── api-client.ts      # HTTP request wrapper
│   ├── auth-helper.ts     # Authentication utilities
│   ├── test-data.ts       # Test data generators
│   └── cleanup.ts         # Database cleanup utilities
├── auth.api.spec.ts       # Authentication endpoint tests
├── users.api.spec.ts      # User management tests
├── protected.api.spec.ts  # Protected endpoint tests
├── error-handling.api.spec.ts  # Error scenario tests
└── health.api.spec.ts     # Health check tests
```

## Running API Tests

### Run All API Tests

From the project root directory:

```bash
# Run all API tests
npx playwright test tests/api/

# Run with output visible
npx playwright test tests/api/ --reporter=list

# Run in debug mode
npx playwright test tests/api/ --debug
```

### Run Specific Test File

```bash
# Run only authentication tests
npx playwright test tests/api/auth.api.spec.ts

# Run only user management tests
npx playwright test tests/api/users.api.spec.ts

# Run only protected endpoint tests
npx playwright test tests/api/protected.api.spec.ts
```

### Run Specific Test

```bash
# Run a single test by name
npx playwright test tests/api/auth.api.spec.ts -g "should register successfully"

# Run tests matching a pattern
npx playwright test tests/api/ -g "login"
```

### View Test Results

```bash
# Generate HTML report
npx playwright test tests/api/ --reporter=html

# Open the report
npx playwright show-report
```

## Writing New API Tests

### Basic Test Structure

Here's a simple example of an API test:

```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { generateUniqueEmail } from './helpers/test-data';

test.describe('My API Tests', () => {
  let apiClient: ApiClient;

  test.beforeEach(async ({ request }) => {
    // Initialize API client
    apiClient = new ApiClient(request);
  });

  test('should create a new user', async () => {
    // Arrange: Prepare test data
    const userData = {
      fullName: 'Test User',
      email: generateUniqueEmail(),
      password: 'SecurePass123!'
    };

    // Act: Send request
    const response = await apiClient.post('/api/users', userData);

    // Assert: Verify response
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.email).toBe(userData.email);
  });
});
```

### Using ApiClient Helper

The `ApiClient` helper simplifies making HTTP requests:

```typescript
import { ApiClient } from './helpers/api-client';

// Initialize
const apiClient = new ApiClient(request);

// POST request
const response = await apiClient.post('/api/auth/login', {
  email: 'user@example.com',
  password: 'password123'
});

// GET request
const response = await apiClient.get('/api/users');

// GET with authentication
const token = 'your-jwt-token';
const response = await apiClient.get('/api/users/profile', token);

// PUT request
const response = await apiClient.put('/api/users/1', {
  fullName: 'Updated Name'
}, token);

// DELETE request
const response = await apiClient.delete('/api/users/1', token);
```

### Using Test Data Generators

The `test-data.ts` helper provides functions to generate test data:

```typescript
import {
  generateUniqueEmail,
  generateRandomFullName,
  generateValidPassword,
  generateValidUserData
} from './helpers/test-data';

// Generate unique email (avoids duplicates)
const email = generateUniqueEmail();
// Example: test.api.1698765432123.4567@example.com

// Generate random full name
const fullName = generateRandomFullName();
// Example: "John Smith"

// Get valid password
const password = generateValidPassword();
// Returns: "SecurePass123!"

// Generate complete user data
const userData = generateValidUserData();
// Returns: { fullName, email, password }
```

### Using Authentication Helper

The `auth-helper.ts` simplifies authentication flows:

```typescript
import { AuthHelper } from './helpers/auth-helper';

// Initialize
const authHelper = new AuthHelper(request);

// Register and get token
const { token, email, userId } = await authHelper.registerAndGetToken();

// Login and get token
const { token, email, userId } = await authHelper.loginAndGetToken(
  'user@example.com',
  'password123'
);

// Validate token format
const isValid = authHelper.validateTokenFormat(token);
```

### Testing Protected Endpoints

For endpoints that require authentication:

```typescript
test('should access protected endpoint with valid token', async ({ request }) => {
  const apiClient = new ApiClient(request);
  const authHelper = new AuthHelper(request);

  // 1. Get authentication token
  const { token } = await authHelper.registerAndGetToken();

  // 2. Make authenticated request
  const response = await apiClient.get('/api/user/profile', token);

  // 3. Verify response
  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.user).toBeDefined();
});
```

### Testing Error Scenarios

Always test error cases:

```typescript
test('should return 400 for invalid email', async ({ request }) => {
  const apiClient = new ApiClient(request);

  const response = await apiClient.post('/api/auth/register', {
    fullName: 'Test User',
    email: 'invalid-email',  // ← Invalid format
    password: 'SecurePass123!'
  });

  expect(response.status).toBe(400);
  expect(response.body.success).toBe(false);
  expect(response.body.message).toContain('email');
});

test('should return 401 for invalid credentials', async ({ request }) => {
  const apiClient = new ApiClient(request);

  const response = await apiClient.post('/api/auth/login', {
    email: 'user@example.com',
    password: 'wrong-password'  // ← Wrong password
  });

  expect(response.status).toBe(401);
  expect(response.body.success).toBe(false);
});
```

### Cleaning Up Test Data

Use the cleanup helper to remove test data after tests:

```typescript
import { clearTestData, deleteTestUsers } from './helpers/cleanup';

test.describe('My API Tests', () => {
  // Clean up after all tests in this suite
  test.afterAll(async ({ request }) => {
    await clearTestData(request);
  });

  // Or clean up specific pattern
  test.afterAll(async ({ request }) => {
    await deleteTestUsers(request, 'test.api');
  });

  // Your tests here...
});
```

## Best Practices

### 1. Use Unique Test Data

Always generate unique emails to avoid conflicts:

```typescript
// ✅ Good: Unique email
const email = generateUniqueEmail();

// ❌ Bad: Hardcoded email (will fail on second run)
const email = 'test@example.com';
```

### 2. Test Independence

Each test should be independent and not rely on other tests:

```typescript
// ✅ Good: Test creates its own user
test('should get user profile', async ({ request }) => {
  const authHelper = new AuthHelper(request);
  const { token } = await authHelper.registerAndGetToken();
  // ... test logic
});

// ❌ Bad: Assumes user exists from previous test
test('should get user profile', async ({ request }) => {
  // Assumes user was created in previous test
});
```

### 3. Clean Up After Tests

Always clean up test data to keep the database tidy:

```typescript
test.afterAll(async ({ request }) => {
  await clearTestData(request);
});
```

### 4. Use Descriptive Test Names

Write clear, descriptive test names:

```typescript
// ✅ Good: Clear and specific
test('should return 400 when registering with duplicate email', async () => {
  // ...
});

// ❌ Bad: Vague
test('test registration', async () => {
  // ...
});
```

### 5. Follow AAA Pattern

Structure tests with Arrange-Act-Assert:

```typescript
test('should create user', async ({ request }) => {
  // Arrange: Prepare test data
  const apiClient = new ApiClient(request);
  const userData = generateValidUserData();

  // Act: Perform the action
  const response = await apiClient.post('/api/users', userData);

  // Assert: Verify the result
  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
});
```

## Troubleshooting

### Backend Not Running

**Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:8081
```

**Solution:**
Make sure the backend server is running on port 8081:
```bash
cd backend/ikp-labs-api
mvn spring-boot:run
```

### Database Connection Issues

**Error:**
```
Could not connect to PostgreSQL database
```

**Solution:**
1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list

   # Linux
   sudo systemctl status postgresql
   ```

2. Verify database credentials in `backend/ikp-labs-api/src/main/resources/application.properties`

### Test Timeouts

**Error:**
```
Test timeout of 30000ms exceeded
```

**Solution:**
1. Check if backend is responding slowly
2. Increase timeout in test:
   ```typescript
   test('slow test', async ({ request }) => {
     test.setTimeout(60000); // 60 seconds
     // ...
   });
   ```

### JWT Token Errors

**Error:**
```
401 Unauthorized
```

**Solution:**
1. Verify token is being sent in Authorization header
2. Check token format: `Bearer <token>`
3. Verify token is not expired
4. Use `AuthHelper.validateTokenFormat()` to check token

### Duplicate Email Errors

**Error:**
```
400 Bad Request: Email already exists
```

**Solution:**
Use `generateUniqueEmail()` instead of hardcoded emails:
```typescript
// ✅ Good
const email = generateUniqueEmail();

// ❌ Bad
const email = 'test@example.com';
```

### Flaky Tests

**Symptom:** Tests pass sometimes and fail other times

**Common Causes:**
1. **Test data conflicts:** Use unique test data
2. **Race conditions:** Ensure proper async/await usage
3. **Dirty database:** Clean up test data properly
4. **Backend timing:** Add appropriate waits if needed

**Solutions:**
```typescript
// Use unique data
const email = generateUniqueEmail();

// Clean up properly
test.afterAll(async ({ request }) => {
  await clearTestData(request);
});

// Proper async handling
await apiClient.post('/api/users', userData); // Don't forget await!
```

## Test Coverage

Current API test coverage:

- ✅ **Authentication Endpoints:**
  - POST `/api/auth/register` - Registration
  - POST `/api/auth/login` - Login
  - POST `/api/auth/refresh` - Token refresh
  - POST `/api/auth/validate` - Token validation
  - GET `/api/auth/health` - Health check

- ✅ **User Management Endpoints:**
  - GET `/api/users` - Get all users
  - POST `/api/users` - Create user
  - GET `/api/users/{id}` - Get user by ID
  - PUT `/api/users/{id}` - Update user
  - DELETE `/api/users/{id}` - Delete user
  - GET `/api/users/email/{email}` - Get user by email
  - GET `/api/users/check-email/{email}` - Check email exists
  - GET `/api/users/count` - Get user count

- ✅ **Protected Endpoints:**
  - GET `/api/user/profile` - User profile
  - GET `/api/user/dashboard` - User dashboard
  - GET `/api/user/settings` - User settings

- ✅ **Error Handling:**
  - 400 Bad Request scenarios
  - 401 Unauthorized scenarios
  - 404 Not Found scenarios
  - Error response format validation

## Useful Commands Reference

```bash
# Run all API tests
npx playwright test tests/api/

# Run specific file
npx playwright test tests/api/auth.api.spec.ts

# Run with debug
npx playwright test tests/api/ --debug

# Run with UI mode
npx playwright test tests/api/ --ui

# Generate report
npx playwright test tests/api/ --reporter=html
npx playwright show-report

# Run specific test
npx playwright test tests/api/ -g "should register successfully"

# Run in headed mode (see browser - though API tests don't use browser)
npx playwright test tests/api/ --headed

# List all tests without running
npx playwright test tests/api/ --list
```

## Next Steps

- Read [API Endpoints Reference](../reference/api-endpoints.md) for complete API documentation
- Check [E2E Testing Guide](./run-e2e-tests.md) for browser-based tests
- See [Protected Routes Implementation](./implement-protected-routes.md) for frontend integration

## Need Help?

- Check [Playwright API Testing Documentation](https://playwright.dev/docs/api-testing)
- Review existing test files in `tests/api/` for examples
- Check the troubleshooting section above for common issues
