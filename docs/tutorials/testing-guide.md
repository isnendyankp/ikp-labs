# Testing Guide: Your First Test

Welcome to the testing tutorial! This guide will walk you through running and writing tests for the Registration Form application.

## What You'll Learn

By the end of this tutorial, you will:
- Understand the different types of tests in the project
- Run E2E (End-to-End) tests with Playwright
- Run API tests for backend endpoints
- Write your first simple test
- Debug test failures

## Prerequisites

Before starting this tutorial:
- Complete the [Getting Started](./getting-started.md) tutorial
- Have both backend and frontend running
- Have Node.js installed

## Step 1: Understanding Test Types

This project has two main types of tests:

### E2E Tests (End-to-End)
- **Location**: `tests/e2e/`
- **What they test**: Full user journeys through the browser
- **Example**: User registers → sees home page → logs out
- **Tool**: Playwright with real browser

### API Tests
- **Location**: `tests/api/`
- **What they test**: Backend API endpoints directly
- **Example**: POST /api/auth/register returns JWT token
- **Tool**: Playwright without browser

**Think of it this way:**
- E2E tests = Testing the whole car on the road
- API tests = Testing individual car parts in the garage

## Step 2: Run Your First E2E Test

Let's run the authentication flow tests:

```bash
# Make sure you're in the project root directory
cd /path/to/RegistrationForm

# Run E2E tests
npx playwright test tests/e2e/auth-flow.spec.ts --project=chromium
```

**What you should see:**
```
Running 8 tests using 5 workers

✓ Test 1: Registration → Home redirect
✓ Test 2: Login → Home redirect
✓ Test 3: Display user info
✓ Test 4: Logout → Login redirect
✓ Test 5: Unauthenticated redirect
✓ Test 6: Authenticated redirect from login
✓ Test 7: Authenticated redirect from register
✓ Test 8: Token persists after refresh

8 passed (9.9s)
```

**If tests fail:**
1. Check if backend is running on port 8081
2. Check if frontend is running on port 3001
3. Check if database is running

## Step 3: Watch a Test in Action

Run a test in headed mode (with visible browser):

```bash
npx playwright test tests/e2e/auth-flow.spec.ts:33 --project=chromium --headed
```

**What happens:**
1. Chrome browser opens automatically
2. You see the registration page load
3. Form fills automatically
4. User clicks submit
5. Redirects to home page
6. Browser closes

**Cool, right?** This is automation testing!

## Step 4: Run API Tests

Now let's test the backend directly:

```bash
# Run all API tests
npx playwright test tests/api/ --project=api-tests
```

**What you should see:**
```
Running 20+ tests using 5 workers

✓ POST /api/auth/register - success
✓ POST /api/auth/register - duplicate email
✓ POST /api/auth/login - success
✓ POST /api/auth/login - wrong password
✓ GET /api/users/{id} - valid ID
✓ GET /api/users/{id} - invalid ID
... (more tests)

20 passed (5.2s)
```

**These tests:**
- Don't open a browser
- Call API directly
- Run much faster than E2E tests

## Step 5: Write Your First Test

Let's create a simple test that checks if the backend health endpoint works.

Create a new file: `tests/api/my-first-test.api.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('My First Test', () => {

  test('should check if API is alive', async ({ request }) => {
    // Step 1: Call the health check endpoint
    const response = await request.get('http://localhost:8081/api/auth/health');

    // Step 2: Check that it returned success (200 OK)
    expect(response.status()).toBe(200);

    // Step 3: Get the response data
    const data = await response.json();

    // Step 4: Verify the response contains what we expect
    expect(data.status).toBe('UP');
    expect(data.service).toBe('AuthController');

    console.log('✅ API is alive and healthy!');
  });

});
```

**Run your test:**
```bash
npx playwright test tests/api/my-first-test.api.spec.ts
```

**If it passes, you see:**
```
✓ My First Test › should check if API is alive (234ms)
```

**Congratulations! You wrote your first test!** 🎉

## Step 6: Understand Test Structure

Let's break down what each part does:

```typescript
test.describe('My First Test', () => {
  // This groups related tests together
  // Like a folder for tests

  test('should check if API is alive', async ({ request }) => {
    // test() = Define one test scenario
    // async = Test needs to wait for API response
    // { request } = Playwright gives us a way to make HTTP requests

    const response = await request.get('...');
    // await = Wait for the request to complete
    // request.get() = Make a GET request to API

    expect(response.status()).toBe(200);
    // expect() = What we expect to happen
    // toBe(200) = Should be exactly 200
  });
});
```

## Step 7: Common Test Patterns

### Pattern 1: Test User Registration

```typescript
test('should register a new user', async ({ request }) => {
  // Arrange: Prepare test data
  const newUser = {
    fullName: 'Test User',
    email: `test${Date.now()}@example.com`, // Unique email
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!'
  };

  // Act: Perform the action
  const response = await request.post('http://localhost:8081/api/auth/register', {
    data: newUser
  });

  // Assert: Check the result
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.success).toBe(true);
  expect(data.token).toBeTruthy(); // Token should exist
  expect(data.email).toBe(newUser.email);
});
```

### Pattern 2: Test Login

```typescript
test('should login existing user', async ({ request }) => {
  // Arrange
  const credentials = {
    email: 'existing@example.com',
    password: 'SecurePass123!'
  };

  // Act
  const response = await request.post('http://localhost:8081/api/auth/login', {
    data: credentials
  });

  // Assert
  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.success).toBe(true);
  expect(data.token).toBeTruthy();
});
```

### Pattern 3: Test Error Cases

```typescript
test('should reject invalid email', async ({ request }) => {
  // Arrange: Invalid email (no @)
  const invalidUser = {
    fullName: 'Test User',
    email: 'invalid-email',
    password: 'SecurePass123!',
    confirmPassword: 'SecurePass123!'
  };

  // Act
  const response = await request.post('http://localhost:8081/api/auth/register', {
    data: invalidUser
  });

  // Assert: Should fail with 400
  expect(response.status()).toBe(400);
  const data = await response.json();
  expect(data.success).toBe(false);
});
```

## Step 8: Debugging Failed Tests

When a test fails, Playwright gives you helpful information:

```
✗ should register a new user

Error: expect(received).toBe(expected)

Expected: 200
Received: 400

Call log:
POST http://localhost:8081/api/auth/register
```

**How to debug:**

1. **Read the error message**: What was expected vs received?
2. **Check the endpoint**: Is the URL correct?
3. **Check the data**: Is the request data valid?
4. **Check the backend**: Is it running? Any errors in console?
5. **Use --debug flag**: `npx playwright test --debug`

## Step 9: Run Tests with Reporter

See beautiful HTML report:

```bash
# Run tests and generate report
npx playwright test tests/api/ --reporter=html

# Open the report
npx playwright show-report
```

**This opens a browser with:**
- All test results
- Screenshots (for E2E tests)
- Videos (for E2E tests)
- Network requests
- Console logs

## Step 10: Best Practices

### ✅ DO:
- Use unique emails for each test (add timestamp)
- Clean up test data after tests
- Make tests independent (can run in any order)
- Use clear test names: "should do X when Y"
- Test both success and error cases

### ❌ DON'T:
- Hardcode user emails (use generators)
- Depend on test execution order
- Share data between tests
- Leave console.log in production tests
- Skip error case testing

## Common Commands Cheat Sheet

```bash
# Run all tests
npx playwright test

# Run E2E tests only
npx playwright test tests/e2e/

# Run API tests only
npx playwright test tests/api/

# Run specific file
npx playwright test tests/api/auth.api.spec.ts

# Run one test by line number
npx playwright test tests/api/auth.api.spec.ts:25

# Run with visible browser
npx playwright test --headed

# Run with debug mode
npx playwright test --debug

# Generate HTML report
npx playwright test --reporter=html

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## What's Next?

Now that you can run and write tests, explore:

1. **How-to Guides:**
   - [Run E2E Tests](../how-to/run-e2e-tests.md) - Advanced E2E testing
   - [API Testing Guide](../how-to/api-testing.md) - Advanced API testing

2. **Write More Tests:**
   - Try writing a test for user update
   - Try writing a test for user deletion
   - Try writing an E2E test for logout

3. **Learn More:**
   - [Playwright Documentation](https://playwright.dev)
   - [API Endpoints Reference](../reference/api-endpoints.md)

## Troubleshooting

### Problem: "connect ECONNREFUSED"
**Solution**: Backend not running. Start it:
```bash
cd backend
mvn spring-boot:run
```

### Problem: "page.goto: net::ERR_CONNECTION_REFUSED"
**Solution**: Frontend not running. Start it:
```bash
cd frontend
npm run dev
```

### Problem: Tests timeout
**Solution**: Increase timeout in test:
```typescript
test('my slow test', async ({ request }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

### Problem: "Database connection error"
**Solution**: PostgreSQL not running. Start it:
```bash
# macOS with Homebrew
brew services start postgresql

# Or check if it's running
brew services list
```

## Summary

You've learned:
- ✅ Different types of tests (E2E vs API)
- ✅ How to run existing tests
- ✅ How to write your first test
- ✅ Common test patterns
- ✅ How to debug test failures
- ✅ Best practices for testing

**Next Tutorial**: [Writing Advanced Tests](./advanced-testing.md) (coming soon)

## Questions?

- Check [API Testing How-To](../how-to/api-testing.md)
- Check [E2E Testing How-To](../how-to/run-e2e-tests.md)
- See test examples in `tests/` directory
