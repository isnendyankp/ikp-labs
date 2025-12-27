# Test Fixes - Technical Design Document

## 1. Architecture Overview

### Test Stack
```
┌─────────────────────────────────────────────────┐
│            Test Pyramid                         │
├─────────────────────────────────────────────────┤
│  E2E Tests (Cucumber + Playwright)              │
│  - User workflows (login, registration, etc.)   │
│  - Full stack validation                        │
│  - Real browser automation                      │
├─────────────────────────────────────────────────┤
│  Frontend Unit Tests (Jest + React Testing Lib) │
│  - Component logic                              │
│  - Isolated rendering                           │
│  - Mock API calls                               │
├─────────────────────────────────────────────────┤
│  Backend Unit Tests (JUnit + Mockito)           │
│  - Service layer logic                          │
│  - ✅ Already 100% PASS                         │
└─────────────────────────────────────────────────┘
```

### Test Coverage Philosophy
- **E2E**: Validate user journeys (login → gallery → upload → like)
- **Unit**: Validate component behavior (button click, form validation)
- **Integration**: Validate backend layer interactions (deferred to next week)

---

## 2. E2E Test Architecture (Cucumber + Playwright)

### Current Structure
```
frontend/
├── tests/
│   ├── gherkin/
│   │   ├── features/           # .feature files (Gherkin scenarios)
│   │   │   ├── auth.feature
│   │   │   ├── registration.feature
│   │   │   ├── gallery.feature
│   │   │   └── ...
│   │   └── step_definitions/   # Step implementation
│   │       ├── auth.steps.ts
│   │       ├── registration.steps.ts
│   │       └── common.steps.ts
│   ├── playwright.config.ts     # Playwright configuration
│   └── helpers/                 # Test utilities
```

### Playwright Configuration
**File**: `frontend/playwright.config.ts` (or similar)

**Current Issue**: Hardcoded port 3000
```typescript
// ❌ BEFORE (Incorrect)
export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',  // Wrong port!
  },
});
```

**Fix**:
```typescript
// ✅ AFTER (Correct)
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3002',
  },
});
```

**Rationale**:
- Frontend dev server runs on port 3002
- Use environment variable for flexibility (dev, CI, staging)

---

### Test Scenario Pattern

#### Scenario 1: Port Configuration Fix

**Feature**: `auth.feature`
**Failing Step**: `When I visit the login page`

**Current Implementation** (Incorrect):
```typescript
// step_definitions/auth.steps.ts
When('I visit the login page', async function() {
  await this.page.goto('http://localhost:3000/login');  // ❌ Wrong port!
});
```

**Fix**:
```typescript
When('I visit the login page', async function() {
  // Use baseURL from Playwright config
  await this.page.goto('/login');  // ✅ Relative URL!
});
```

**Why Relative URLs?**
- Respects Playwright config `baseURL`
- Easier to change environment (dev → staging → prod)
- No hardcoded values

---

#### Scenario 2: Validation Display Fix

**Feature**: `registration.feature`
**Failing Step**: `Then I should see validation error "Please enter a valid email"`

**Current Implementation** (Incorrect):
```typescript
// ❌ Expects validation immediately after input
When('I enter email {string}', async function(email: string) {
  await this.page.fill('[name="email"]', email);
});

Then('I should see validation error {string}', async function(errorMsg: string) {
  // This fails because validation only triggers on submit!
  await expect(this.page.locator(`text=${errorMsg}`)).toBeVisible();
});
```

**Fix**:
```typescript
// ✅ Submit form first, then check validation
When('I enter email {string}', async function(email: string) {
  await this.page.fill('[name="email"]', email);
});

When('I submit the form', async function() {
  await this.page.click('button[type="submit"]');
});

Then('I should see validation error {string}', async function(errorMsg: string) {
  // Now validation will appear!
  await expect(this.page.locator(`text=${errorMsg}`)).toBeVisible({ timeout: 5000 });
});
```

**Gherkin Scenario Update**:
```gherkin
# ❌ BEFORE
Scenario: Invalid email validation
  Given I am on the registration page
  When I enter email "invalid-email"
  Then I should see validation error "Please enter a valid email"

# ✅ AFTER
Scenario: Invalid email validation
  Given I am on the registration page
  When I enter email "invalid-email"
  And I submit the form
  Then I should see validation error "Please enter a valid email"
```

---

#### Scenario 3: Google OAuth Mock Fix

**Feature**: `auth.feature`
**Failing Step**: `When I click the Google login button`

**Current Implementation** (Incorrect):
```typescript
When('I click the Google login button', async function() {
  // This selector may be outdated
  await this.page.click('button:has-text("Sign in with Google")');  // ❌ Can't find element
});
```

**Investigation Steps**:
1. Inspect actual UI for Google button
2. Check if button exists in test environment
3. Update selector to match current markup

**Possible Fix 1** (Selector Update):
```typescript
When('I click the Google login button', async function() {
  // Use data-testid for stability
  await this.page.click('[data-testid="google-login-btn"]');  // ✅ Stable selector
});
```

**Possible Fix 2** (Mock Setup):
```typescript
// If Google button requires OAuth setup, mock it
When('I click the Google login button', async function() {
  // Mock Google OAuth response
  await this.page.route('**/auth/google/callback', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({ token: 'mock-jwt-token' }),
    });
  });

  await this.page.click('[data-testid="google-login-btn"]');
});
```

---

#### Scenario 4: Password Visibility Timing Fix

**Feature**: `registration.feature`
**Failing Step**: `Then the password should be visible`

**Current Implementation** (Incorrect):
```typescript
When('I click the password visibility toggle', async function() {
  await this.page.click('[data-testid="toggle-password-visibility"]');
});

Then('the password should be visible', async function() {
  // ❌ Fails! React hasn't updated state yet
  const fieldType = await this.page.getAttribute('[name="password"]', 'type');
  expect(fieldType).toBe('text');
});
```

**Fix**:
```typescript
When('I click the password visibility toggle', async function() {
  await this.page.click('[data-testid="toggle-password-visibility"]');

  // ✅ Wait for React state update to complete
  await this.page.waitForFunction(() => {
    const field = document.querySelector<HTMLInputElement>('[name="password"]');
    return field?.type === 'text';
  }, { timeout: 2000 });
});

Then('the password should be visible', async function() {
  // Now it's guaranteed to be updated
  const fieldType = await this.page.getAttribute('[name="password"]', 'type');
  expect(fieldType).toBe('text');
});
```

**Alternative Fix** (waitForSelector):
```typescript
When('I click the password visibility toggle', async function() {
  await this.page.click('[data-testid="toggle-password-visibility"]');

  // Wait for field type to change
  await this.page.waitForSelector('[name="password"][type="text"]', { timeout: 2000 });
});
```

---

## 3. Frontend Unit Test Architecture (Jest)

### Current Structure
```
frontend/src/
├── components/
│   ├── LoginForm.tsx
│   ├── __tests__/
│   │   └── LoginForm.test.tsx
│   ├── RegistrationForm.tsx
│   └── ...
```

### Jest Configuration
**File**: `frontend/jest.config.js`

**Typical Setup**:
```javascript
module.exports = {
  testEnvironment: 'jsdom',  // Browser-like environment
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',  // Mock CSS
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',  // TypeScript support
  },
};
```

---

### Unit Test Pattern

#### Example: LoginForm.test.tsx

**Current Test** (May Fail):
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';

describe('LoginForm', () => {
  it('renders all form fields', () => {
    render(<LoginForm />);

    // These selectors may be outdated
    expect(screen.getByLabelText('Email')).toBeInTheDocument();  // ❌ Might fail
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const mockSubmit = jest.fn();
    render(<LoginForm onSubmit={mockSubmit} />);

    // API mock may need updating
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(mockSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });
});
```

**Common Fixes**:

1. **Update Selectors**:
```typescript
// ✅ Use flexible queries
expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
```

2. **Update Snapshots**:
```bash
# If UI changed intentionally
npm test -- -u  # Update snapshots
```

3. **Mock API Calls**:
```typescript
// Mock fetch or axios
jest.mock('../services/api', () => ({
  loginUser: jest.fn(() => Promise.resolve({ data: { token: 'mock-token' } })),
}));
```

---

## 4. Test Data Management

### Test User Credentials
```typescript
// tests/fixtures/testUsers.ts
export const TEST_USERS = {
  validUser: {
    email: 'test@example.com',
    password: 'Test@1234',
    fullName: 'Test User',
  },
  invalidUser: {
    email: 'invalid',
    password: '123',
  },
};
```

### Test Photo Data
```typescript
// tests/fixtures/testPhotos.ts
export const TEST_PHOTOS = {
  publicPhoto: {
    id: 1,
    title: 'Test Public Photo',
    isPublic: true,
    filePath: 'gallery/user-1/photo-1.jpg',
  },
  privatePhoto: {
    id: 2,
    title: 'Test Private Photo',
    isPublic: false,
    filePath: 'gallery/user-1/photo-2.jpg',
  },
};
```

---

## 5. Wait Strategies

### ❌ Bad: Arbitrary Sleeps
```typescript
await page.click('#submit-btn');
await page.waitForTimeout(3000);  // ❌ Flaky! Might be too short or too long
```

### ✅ Good: Condition-Based Waits
```typescript
await page.click('#submit-btn');
await page.waitForSelector('.success-message', { timeout: 5000 });  // ✅ Waits for actual condition
```

### ✅ Good: Network-Based Waits
```typescript
await Promise.all([
  page.waitForResponse(resp => resp.url().includes('/api/login')),
  page.click('#submit-btn'),
]);  // ✅ Waits for API call to complete
```

### ✅ Good: State-Based Waits
```typescript
await page.waitForFunction(() => {
  return document.querySelector('#user-menu') !== null;
}, { timeout: 5000 });  // ✅ Waits for React component to mount
```

---

## 6. Error Handling Patterns

### E2E Test Error Handling
```typescript
Then('I should see validation error {string}', async function(errorMsg: string) {
  try {
    await expect(this.page.locator(`text=${errorMsg}`)).toBeVisible({ timeout: 5000 });
  } catch (error) {
    // Take screenshot for debugging
    await this.page.screenshot({ path: `test-failed-${Date.now()}.png` });
    throw error;  // Re-throw to fail test
  }
});
```

### Unit Test Error Handling
```typescript
it('shows error message on failed login', async () => {
  // Mock API to return error
  (loginUser as jest.Mock).mockRejectedValueOnce({ message: 'Invalid credentials' });

  render(<LoginForm />);

  // Submit form
  await userEvent.click(screen.getByRole('button', { name: /login/i }));

  // Check error message
  expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
});
```

---

## 7. Configuration Management

### Environment Variables
```bash
# .env.test (for testing)
BASE_URL=http://localhost:3002
API_BASE_URL=http://localhost:8081
PLAYWRIGHT_HEADLESS=true
```

### Playwright Config (Dynamic)
```typescript
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3002',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 3002,
    timeout: 120000,
    reuseExistingServer: !process.env.CI,  // Faster local runs
  },
});
```

---

## 8. Debugging Tools

### Playwright Debugging
```bash
# Run with UI mode (visual debugging)
npx playwright test --ui

# Run with headed browser
PLAYWRIGHT_HEADLESS=false npx playwright test

# Show trace (record test execution)
npx playwright test --trace on
npx playwright show-trace trace.zip
```

### Jest Debugging
```bash
# Run specific test file
npm test -- LoginForm.test.tsx

# Run with debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Update snapshots
npm test -- -u
```

---

## 9. Test Organization Best Practices

### Gherkin Scenario Structure
```gherkin
Feature: User Login
  As a registered user
  I want to log in to my account
  So that I can access my photo gallery

  Background:
    Given the application is running
    And I have a registered account with email "test@example.com" and password "Test@1234"

  Scenario: Successful login with valid credentials
    When I visit the login page
    And I enter email "test@example.com"
    And I enter password "Test@1234"
    And I submit the login form
    Then I should be redirected to the gallery page
    And I should see my profile picture in the navbar

  Scenario: Failed login with invalid credentials
    When I visit the login page
    And I enter email "test@example.com"
    And I enter password "wrongpassword"
    And I submit the login form
    Then I should see error message "Invalid email or password"
    And I should remain on the login page
```

### Step Definition Reusability
```typescript
// common.steps.ts - Reusable steps
Given('the application is running', async function() {
  // Check health endpoint
  const response = await fetch(`${process.env.API_BASE_URL}/actuator/health`);
  expect(response.ok).toBeTruthy();
});

When('I enter {string} into field {string}', async function(value: string, fieldName: string) {
  await this.page.fill(`[name="${fieldName}"]`, value);
});

When('I submit the form', async function() {
  await this.page.click('button[type="submit"]');
});

Then('I should see text {string}', async function(text: string) {
  await expect(this.page.locator(`text=${text}`)).toBeVisible({ timeout: 5000 });
});
```

---

## 10. Implementation Checklist Summary

### E2E Fixes
1. ✅ Update Playwright config port (3000 → 3002)
2. ✅ Update step definitions to use relative URLs
3. ✅ Add form submission before validation checks
4. ✅ Fix Google OAuth button selector
5. ✅ Add proper wait conditions for React state updates

### Unit Test Fixes
1. ✅ Run `npm test`
2. ✅ Update outdated snapshots
3. ✅ Fix broken selectors (use roles, labels)
4. ✅ Update API mocks if needed

### Documentation
1. ✅ Document wait patterns
2. ✅ Add troubleshooting guide
3. ✅ Explain port configuration

---

**Document Version**: 1.0
**Last Updated**: December 27, 2024
**Status**: Ready for Implementation
