# 🧪 E2E Tests with Playwright

Automated end-to-end tests for the Registration Form application using Playwright.

## 📁 Structure

```
tests/
├── e2e/                    # E2E test specs
│   └── login.spec.ts       # Login flow tests
├── fixtures/               # Test data
│   └── test-users.ts       # Test user credentials
├── helpers/                # Test helper functions
└── README.md              # This file
```

## 🚀 Running Tests

### Prerequisites

Make sure both servers are running:
```bash
# Terminal 1: Backend (port 8081)
cd backend/registration-form-api
mvn spring-boot:run

# Terminal 2: Frontend (port 3001)
cd frontend
npm run dev
```

### Run All Tests

```bash
# Run all tests in headless mode
npx playwright test

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test tests/e2e/login.spec.ts

# Run tests in debug mode
npx playwright test --debug
```

### Run Tests by Browser

```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# WebKit (Safari) only
npx playwright test --project=webkit

# All browsers
npx playwright test --project=chromium --project=firefox --project=webkit
```

### View Test Results

```bash
# Open HTML report
npx playwright show-report

# Show last test run traces
npx playwright show-trace
```

## 📊 Test Coverage

### Login Flow Tests (`login.spec.ts`)

Based on [backend/docs/TESTING_STEP_5.4.md](../backend/docs/TESTING_STEP_5.4.md):

- ✅ **Test Case 1**: Login with valid credentials
- ✅ **Test Case 2**: Login with invalid password
- ✅ **Test Case 3**: Login with non-existent email
- ✅ **Test Case 4**: Email validation (frontend)
- ✅ **Test Case 6**: Empty form submission
- ✅ **Test Case 10**: CORS configuration

### Upcoming Tests

- **Test Case 5**: Password length validation
- **Test Case 7**: Remember me functionality
- **Test Case 8**: Show/hide password toggle
- **Test Case 9**: Network error handling
- **Registration Flow**: Based on TESTING_STEP_5.3.md

## 🎯 Test User Credentials

Defined in `tests/fixtures/test-users.ts`:

- **Valid User**: `testuser123@example.com` / `TestPass123!`
- **Invalid Password**: Wrong password for existing user
- **Non-Existent User**: Email not in database
- **Invalid Email**: Malformed email format

## 🛠️ Playwright Configuration

See [playwright.config.ts](../playwright.config.ts) for:

- Browser configurations (Chromium, Firefox, WebKit)
- Test timeouts and retries
- Screenshot and video capture settings
- Reporter configurations

## 📝 Writing New Tests

### Example Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { testUsers } from '../fixtures/test-users';

test.describe('My Feature Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/my-page');
  });

  test('should do something', async ({ page }) => {
    // Your test steps
    await page.fill('input[name="email"]', testUsers.validUser.email);
    await page.click('button[type="submit"]');

    // Assertions
    await expect(page.locator('.success')).toBeVisible();
  });

});
```

### Best Practices

1. **Use data-testid attributes** for reliable selectors
2. **Keep tests independent** - each test should work in isolation
3. **Use fixtures** for test data
4. **Add meaningful console.log** for test progress
5. **Verify both happy path and error cases**
6. **Check network responses** not just UI
7. **Clean up after tests** (clear localStorage, etc.)

## 🎭 Playwright MCP (Optional)

For AI-powered testing with Claude:

```bash
# Run with MCP (in Claude Desktop or compatible IDE)
npx @executeautomation/playwright-mcp-server
```

See [Playwright MCP docs](https://executeautomation.github.io/mcp-playwright/) for more info.

## 🐛 Debugging

```bash
# Run in debug mode
npx playwright test --debug

# Run with UI mode
npx playwright test --ui

# Generate code (record actions)
npx playwright codegen http://localhost:3001
```

## 📊 CI/CD Integration

Tests can be integrated into GitHub Actions:

```yaml
- name: Run Playwright tests
  run: npx playwright test

- name: Upload test results
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright MCP](https://executeautomation.github.io/mcp-playwright/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Project Testing Plan](../frontend/docs/FRONTEND_PLAN.md)

---

**Happy Testing! 🎭**
