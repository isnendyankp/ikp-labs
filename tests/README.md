# 🧪 Testing Suite

This project uses a comprehensive testing strategy with multiple test types to ensure code quality and reliability.

## 📊 Testing Overview

| Test Type | Location | Tool | Purpose | API/Mocking |
|------------|------------|------|---------|--------------|
| **Unit Tests** | `frontend/**/*.test.tsx` | Jest + RTL | Test component logic & UI | ❌ No API, ❌ No Mocking |
| **Integration Tests** | `frontend/**/*.test.tsx` | Jest + RTL | Test component interactions | ❌ No API, ❌ No Mocking |
| **API Tests** | `tests/api/` | Playwright API | Test backend endpoints | ✅ Real API |
| **E2E Tests** | `tests/e2e/` | Playwright | Test full user flows | ✅ Real API |
| **Gherkin/BDD** | `tests/gherkin/` | Cucumber | Business requirements | ✅ Real API |

## 🎯 Testing Philosophy

### Unit & Integration Tests (Frontend)
- **Goal**: Test pure component logic and UI behavior
- **NO API calls**: Components with API logic tested at E2E level
- **NO mocking**: Tests are deterministic and fast
- **Scope**: Form validation, state changes, UI interactions

### API Tests (Backend Contract)
- **Goal**: Ensure backend endpoints work correctly
- **Real API**: Tests against actual backend server
- **Scope**: Endpoint responses, validation, error handling
- **Used by**: Frontend developers for API contract verification

### E2E Tests (Full User Flows)
- **Goal**: Test complete user journeys
- **Real API**: Uses tested backend endpoints
- **Scope**: Login flow, gallery navigation, profile management

### Gherkin/BDD Tests (Business Specs)
- **Goal**: Human-readable test specifications
- **Real API**: Uses tested backend endpoints
- **Scope**: Business requirement validation

---

## 🧪 Frontend Unit Tests (Jest + React Testing Library)

Fast, isolated component testing without external dependencies.

### Quick Start

```bash
# From frontend directory
cd frontend

# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test LoginForm.test.tsx
```

### Test Structure

```bash
frontend/
├── src/
│   ├── components/
│   │   ├── __tests__/
│   │   │   ├── LoginForm.test.tsx       # Form component tests
│   │   │   ├── PhotoCard.test.tsx        # UI component tests
│   │   │   └── ActionButton.test.tsx      # Button component tests
│   │   ├── ui/
│   │   │   └── __tests__/
│   │   │       ├── FormField.test.tsx     # Form field tests
│   │   │       ├── Toast.test.tsx         # Toast tests
│   │   │       └── ToastContainer.test.tsx
│   │   └── ...
│   ├── hooks/
│   │   └── __tests__/
│   │       ├── useAuth.test.ts            # Auth hook tests
│   │       └── useToast.test.ts           # Toast hook tests
│   ├── lib/
│   │   └── __tests__/
│   │       ├── apiClient.test.ts          # API client utility tests
│   │       └── validation.test.ts        # Validation utility tests
│   └── context/
│       └── __tests__/
│           └── ToastContext.test.tsx      # Context provider tests
└── jest.setup.js                      # Global test configuration
```

### What Gets Tested (Unit Tests)

| Component Type | Examples | What We Test |
|---------------|-------------|---------------|
| **Form Components** | LoginForm, RegistrationForm | Validation, error messages, input changes |
| **UI Components** | PhotoCard, ActionButton | Rendering, click handlers, state changes |
| **Hooks** | useAuth, useToast | State updates, return values |
| **Utilities** | validation, format functions | Input/output, edge cases |
| **Contexts** | ToastContext, AuthContext | Provider values, state management |

### What Does NOT Get Tested Here

| Tested In | Location |
|-----------|------------|
| **API calls** | `tests/api/` (API Tests) |
| **Full flows** | `tests/e2e/` (E2E Tests) |
| **Backend logic** | Backend JUnit tests |

### Example Unit Test

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';
import { ToastProvider } from '@/context/ToastContext';

// Helper to wrap with providers
function renderWithProviders(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe('LoginForm', () => {
  it('shows validation error for empty email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    // Test UI validation only (no API call)
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    const toggleButton = screen.getByLabelText(/show password/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    // Test UI interaction only
    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
```

### Test Coverage

```bash
# Run coverage report
npm run test:coverage

# View coverage in browser
open frontend/coverage/index.html
```

Target coverage:
- UI Components: 80%+
- Custom Hooks: 85%+
- Utilities: 100%
- Context/Providers: 80%+

### Best Practices

1. **Test Behavior, Not Implementation**
   ```typescript
   // ✅ Good - tests user behavior
   it('shows error when email is invalid', () => { ... });

   // ❌ Bad - tests implementation detail
   it('sets hasError state to true', () => { ... });
   ```

2. **No API Mocking**
   - Components with API calls should only test UI part
   - API call behavior tested in E2E tests
   - Tests stay fast and deterministic

3. **Use userEvent for Interactions**
   ```typescript
   // ✅ Good - realistic user interaction
   await user.click(button);

   // ❌ Avoid - less realistic
   button.click();
   ```

### Documentation

- **Plan**: [Frontend Unit Tests Plan](../plans/in-progress/2026-02-11__frontend-unit-tests/README.md)
- **Setup**: [jest.setup.js](../frontend/jest.setup.js) configuration

---

## 🧪 Playwright Tests (E2E + API)

Browser-based and API testing with Playwright.

### 📁 Structure

```
tests/
├── e2e/                    # E2E test specs (Playwright native - browser tests)
│   ├── login.spec.ts       # Login flow tests
│   ├── registration.spec.ts # Registration flow tests
│   ├── registration-with-tracker.spec.ts # 🆕 Registration with Test Plan Tracker
│   ├── auth-flow.spec.ts   # Complete authentication flow tests
│   ├── gallery.spec.ts     # Photo gallery tests
│   ├── photo-likes.spec.ts # Photo likes feature tests
│   └── helpers/            # E2E test utilities
├── gherkin/                # 🆕 Gherkin/BDD specifications (Cucumber)
│   ├── features/           # Feature files (Given-When-Then)
│   │   ├── login.feature   # Login scenarios
│   │   └── registration.feature # Registration scenarios
│   └── steps/              # Step definitions (Cucumber + Playwright)
│       ├── login.steps.ts
│       └── registration.steps.ts
├── api/                    # API test specs (backend contract tests)
│   ├── helpers/            # API test utilities
│   │   ├── api-client.ts   # HTTP request wrapper
│   │   ├── auth-helper.ts  # Authentication utilities
│   │   ├── test-data.ts    # Test data generators
│   │   └── cleanup.ts      # Database cleanup utilities
│   ├── auth.api.spec.ts    # Authentication endpoint tests
│   ├── users.api.spec.ts   # User management tests
│   ├── protected.api.spec.ts # Protected endpoint tests
│   ├── error-handling.api.spec.ts # Error scenario tests
│   └── health.api.spec.ts  # Health check tests
├── fixtures/               # Test data and utilities
│   ├── test-users.ts       # Test user credentials
│   └── test-plan-tracker.js # 🆕 Test Plan Tracker core class
├── plans/                  # 🆕 Test plan JSON files
│   └── registration.plan.json # Registration test plan
├── results/                # 🆕 Failed test data (auto-generated)
│   └── REG-XXX-*.json      # Preserved test data for debugging
└── README.md              # This file
```

## 🚀 Running Tests

### Prerequisites

**For E2E Tests:** Both servers must be running
```bash
# Terminal 1: Backend (port 8081)
cd backend/ikp-labs-api
mvn spring-boot:run

# Terminal 2: Frontend (port 3001)
cd frontend
npm run dev
```

**For API Tests:** Only backend is required
```bash
# Backend (port 8081)
cd backend/ikp-labs-api
mvn spring-boot:run
```

### Run All Tests

```bash
# Run all tests (E2E + API)
npx playwright test

# Run only E2E tests
npx playwright test tests/e2e/

# Run only API tests
npx playwright test tests/api/

# Run tests in headed mode (E2E only - see browser)
npx playwright test tests/e2e/ --headed

# Run specific test file
npx playwright test tests/e2e/login.spec.ts
npx playwright test tests/api/auth.api.spec.ts

# Run tests in debug mode
npx playwright test --debug
```

### Run Tests by Browser (E2E only)

```bash
# Chromium only
npx playwright test tests/e2e/ --project=chromium

# Firefox only
npx playwright test tests/e2e/ --project=firefox

# WebKit (Safari) only
npx playwright test tests/e2e/ --project=webkit

# All browsers
npx playwright test tests/e2e/ --project=chromium --project=firefox --project=webkit
```

**Note:** API tests don't use browsers - they run directly against the backend.

### View Test Results

```bash
# Open HTML report
npx playwright show-report

# Show last test run traces
npx playwright show-trace
```

## 📋 Test Plan Checklist System

**NEW!** Smart test execution tracking with automated cleanup.

### Features

- ✅ **Progress Tracking** - JSON-based test plan with real-time status updates
- ✅ **Smart Cleanup** - Auto-delete test users on PASS, preserve on FAIL for debugging
- ✅ **Historical Record** - Track test execution history, duration, and statistics
- ✅ **Pattern-Based User Management** - Auto-identify test users by email pattern
- ✅ **Failed Test Data Preservation** - Save failed test data to `tests/results/` for analysis

### Quick Start

```bash
# Run tests with Test Plan Tracker
npx playwright test registration-with-tracker

# View test plan progress
cat tests/plans/registration.plan.json

# Check failed test data (if any)
ls tests/results/
```

### Email Patterns for Auto-Cleanup

**Auto-cleanup patterns** (deleted on test PASS):
- `autotest-*` - Automated test users
- `qa-*` - QA automation users
- `testuser-*` - Integration test users

**Manual testing patterns** (preserved):
- `manual-*` - Manual testing users
- `demo-*` - Demo users
- Regular emails without prefix

### Example Usage

```typescript
import { TestPlanTracker } from '../fixtures/test-plan-tracker.js';

let tracker: TestPlanTracker;

test.beforeAll(async () => {
  tracker = new TestPlanTracker('registration');
});

test('REG-001: Successful registration', async ({ page, request }) => {
  const testId = 'REG-001';
  tracker.startTest(testId);

  try {
    const testEmail = `autotest-reg-001-${Date.now()}@example.com`;
    tracker.trackUser(testEmail, testId);

    // ... test logic ...

    tracker.markCompleted(testId);
    await tracker.cleanup(request, testId, true); // Auto-delete on PASS
  } catch (error) {
    tracker.markFailed(testId, error.message);
    await tracker.cleanup(request, testId, false); // Preserve on FAIL
    throw error;
  }
});
```

### Backend Integration

Test Admin Endpoints (`TestAdminController.java`):
- `DELETE /api/test-admin/users/{email}` - Delete specific test user
- `DELETE /api/test-admin/cleanup/automated` - Bulk cleanup all automated test users
- `GET /api/test-admin/users?automated=true` - List test users

**⚠️ Important:** TestAdminController should be disabled in production environment.

### Documentation

- **How-to Guide:** [Run Automated Tests with Test Plan Tracker](../docs/how-to/testing/run-automated-tests.md)
- **Explanation:** [Test Plan Checklist Strategy](../docs/explanation/testing/test-plan-checklist-strategy.md)

---

## 🧪 API Testing

For detailed information about API testing, see the [API Testing Guide](../docs/how-to/api-testing.md).

### Quick Start - API Tests

```bash
# Run all API tests
npx playwright test tests/api/

# Run specific API test file
npx playwright test tests/api/auth.api.spec.ts

# Run with output visible
npx playwright test tests/api/ --reporter=list
```

### API Test Coverage

- ✅ **Authentication Endpoints:** Login, register, token refresh, validation
- ✅ **User Management:** CRUD operations, email lookup, user count
- ✅ **Protected Endpoints:** Profile, dashboard, settings (with JWT)
- ✅ **Error Handling:** 400, 401, 404 scenarios
- ✅ **Health Checks:** API status monitoring

### API Test Helpers

Located in `tests/api/helpers/`:

- **api-client.ts** - HTTP request wrapper for GET, POST, PUT, DELETE
- **auth-helper.ts** - Authentication utilities (register, login, token validation)
- **test-data.ts** - Test data generators (unique emails, random names)
- **cleanup.ts** - Database cleanup utilities (delete test users)

**Example usage:**
```typescript
import { ApiClient } from './helpers/api-client';
import { generateUniqueEmail } from './helpers/test-data';

test('should create user', async ({ request }) => {
  const client = new ApiClient(request);
  const email = generateUniqueEmail();

  const response = await client.post('/api/users', {
    fullName: 'Test User',
    email,
    password: 'SecurePass123!'
  });

  expect(response.status).toBe(201);
});
```

For complete guide, see [API Testing Documentation](../docs/how-to/api-testing.md).

---

## 🥒 Gherkin/BDD Testing (Cucumber)

**Business-friendly test specifications** using Given-When-Then syntax.

For detailed information about Gherkin/BDD testing, see [tests/gherkin/README.md](gherkin/README.md).

### Quick Start - Gherkin Tests

```bash
# Run all Gherkin/Cucumber tests
cd frontend
npm run test:cucumber

# Run specific feature file
npx cucumber-js ../tests/gherkin/features/login.feature --require-module ts-node/register --require ../tests/gherkin/steps/**/*.ts
```

### Gherkin Test Coverage

**Login Feature** (`login.feature`) - 11 scenarios:
- ✅ Successful login with valid credentials
- ✅ Failed login with invalid password
- ✅ Failed login with non-existent email
- ✅ Email validation errors
- ✅ Empty form submission
- ✅ Session management
- ✅ Logout functionality
- ✅ And more...

**Registration Feature** (`registration.feature`) - 10 scenarios:
- ✅ Successful registration flow
- ✅ Duplicate email validation
- ✅ Password strength requirements
- ✅ Form validation errors
- ✅ Database persistence checks
- ✅ And more...

### Gherkin vs Playwright E2E

**Why two testing approaches?**

| Aspect | Gherkin/BDD (Week 5) | Playwright Native (Week 12+) |
|--------|---------------------|------------------------------|
| **Syntax** | Given-When-Then | TypeScript test cases |
| **Audience** | Business + Developers | Developers only |
| **Readability** | Non-technical friendly | Technical |
| **Maintenance** | Separate step definitions | All-in-one test file |
| **Use Case** | Requirements validation | Technical regression testing |
| **Run Command** | `npm run test:cucumber` | `npx playwright test tests/e2e/` |

**Both are valuable!** Gherkin is great for stakeholder communication, Playwright native is faster for developers.

---

## 📊 E2E Test Coverage

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
npx playwright codegen http://localhost:3002
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

### Documentation
- [API Testing Guide](../docs/how-to/api-testing.md) - Complete API testing documentation
- [E2E Testing Guide](../docs/how-to/run-e2e-tests.md) - Browser-based testing guide
- [Protected Routes Implementation](../docs/how-to/implement-protected-routes.md) - Authentication flows

### External Resources
- [Playwright Documentation](https://playwright.dev)
- [Playwright API Testing](https://playwright.dev/docs/api-testing)
- [Playwright MCP](https://executeautomation.github.io/mcp-playwright/)
- [Best Practices](https://playwright.dev/docs/best-practices)

---

**Happy Testing! 🎭**
