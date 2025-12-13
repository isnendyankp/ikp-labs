# How to Run E2E Tests with Playwright

This guide shows you how to run automated end-to-end tests for the Registration Form application using Playwright.

## Prerequisites

Before running tests, ensure both servers are running:

**Terminal 1 - Backend Server:**
```bash
cd backend/registration-form-api
mvn spring-boot:run
```

Backend should be available at: `http://localhost:8081`

**Terminal 2 - Frontend Server:**
```bash
cd frontend
npm run dev
```

Frontend should be available at: `http://localhost:3002`

## Running Tests

### Run All Tests

From the project root directory:

```bash
# Run all tests in headless mode (no browser window)
npx playwright test

# Run tests with browser visible
npx playwright test --headed

# Run tests in UI mode (interactive)
npx playwright test --ui
```

### Run Specific Test File

```bash
# Run only registration tests
npx playwright test tests/e2e/registration.spec.ts

# Run only login tests
npx playwright test tests/e2e/login.spec.ts
```

### Run Tests by Browser

```bash
# Chromium only (default)
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# WebKit (Safari) only
npx playwright test --project=webkit

# All browsers
npx playwright test --project=chromium --project=firefox --project=webkit
```

## Viewing Test Results

### HTML Report

After tests run, view the HTML report:

```bash
npx playwright show-report
```

This opens an interactive report in your browser showing:
- Test results (passed/failed)
- Screenshots on failure
- Trace files for debugging
- Test duration and timing

### Real-Time Output

Tests display console output during execution:

```
🧪 Test 1: Registration with Valid Data
✅ Test 1: PASSED
   User created: test.e2e.1234567890@example.com (ID: 42)

🧪 Test 2: Duplicate Email Registration
✅ Test 2: PASSED - Duplicate email rejected
```

## Debugging Tests

### Debug Mode

Run tests in debug mode with Playwright Inspector:

```bash
npx playwright test --debug
```

This allows you to:
- Step through tests line by line
- Pause execution
- Inspect page elements
- View network requests

### Debug Specific Test

```bash
# Debug only failing tests
npx playwright test --debug tests/e2e/registration.spec.ts

# Debug specific test by name
npx playwright test --debug -g "Should register successfully"
```

### Generate Test Code

Record browser actions to generate test code:

```bash
npx playwright codegen http://localhost:3002/register
```

This opens a browser where your actions are converted to Playwright code.

## Test Coverage

### Registration Tests

File: `tests/e2e/registration.spec.ts`

- ✅ Test 1: Valid registration
- ✅ Test 2: Duplicate email rejection
- ⏭️ Test 3: Password mismatch validation (skipped - frontend validation not implemented)
- ✅ Test 4: Empty fields validation
- ✅ Test 5: Email format validation
- ⏭️ Test 6: Password strength validation (skipped - not implemented)
- ✅ Test 7: Loading state verification
- ✅ Test 8: CORS verification

### Login Tests

File: `tests/e2e/login.spec.ts`

- ✅ Test Case 1: Valid login
- ✅ Test Case 2: Invalid password
- ✅ Test Case 3: Non-existent email
- ✅ Test Case 10: CORS verification

For detailed behavior specifications, see [Gherkin Specs](../../specs/README.md).

## Test Configuration

Test configuration is in `playwright.config.ts`:

- **Base URL**: `http://localhost:3002`
- **Browsers**: Chromium, Firefox, WebKit
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure only
- **Videos**: On failure only

## Test User Credentials

Test users are defined in `tests/fixtures/test-users.ts`:

```typescript
export const testUsers = {
  validUser: {
    email: 'testuser123@example.com',
    password: 'TestPass123!'
  },
  // ... other test users
};
```

These users must exist in the database for login tests to pass.

## Troubleshooting

### Backend Not Running

**Error**: `net::ERR_CONNECTION_REFUSED` to `http://localhost:8081`

**Solution**: Start the backend server:
```bash
cd backend/registration-form-api
mvn spring-boot:run
```

### Frontend Not Running

**Error**: `page.goto: net::ERR_CONNECTION_REFUSED`

**Solution**: Start the frontend server:
```bash
cd frontend
npm run dev
```

### Test User Not Found

**Error**: Login tests fail with 401 error

**Solution**: Create the test user manually or run registration test first:
```bash
npx playwright test tests/e2e/registration.spec.ts -g "Test 1"
```

### Database Issues

**Error**: Database connection errors in backend

**Solution**: Verify PostgreSQL is running and credentials in `application.properties` are correct.

### Port Already in Use

**Error**: Port 8081 or 3001 already in use

**Solution**: Stop other processes using these ports:
```bash
# Find process using port
lsof -i :8081
lsof -i :3001

# Kill process (replace PID with actual process ID)
kill -9 <PID>
```

## CI/CD Integration

Tests can run in GitHub Actions or other CI systems:

```yaml
name: E2E Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: actions/setup-java@v3

      - name: Install dependencies
        run: npm install

      - name: Start backend
        run: |
          cd backend/registration-form-api
          mvn spring-boot:run &

      - name: Start frontend
        run: |
          cd frontend
          npm run dev &

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Interactive Testing with MCP Playwright

For AI-powered interactive testing with Claude:

1. Install MCP Playwright server
2. Configure in Claude Desktop
3. Use Claude to run tests interactively with visible browser

See [MCP Playwright documentation](https://executeautomation.github.io/mcp-playwright/) for setup.

## Related Documentation

- [Gherkin Specifications](../../specs/README.md) - Test scenarios in plain language
- [API Endpoints Reference](../reference/api-endpoints.md) - Backend API details
- [Playwright Official Docs](https://playwright.dev) - Full Playwright documentation

## Next Steps

- [Add New API Endpoint](./add-api-endpoint.md) - Extend backend functionality
- [Setup Database](./setup-database.md) - Configure PostgreSQL
- [Authentication Architecture](../explanation/authentication-architecture.md) - Understand auth flow
