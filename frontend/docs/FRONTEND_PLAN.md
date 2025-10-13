# 🎨 Registration Form Frontend - Testing & Integration Plan

## 📋 Project Overview
Frontend testing dan integration plan untuk Registration Form menggunakan **React/Next.js** yang terintegrasi dengan backend Spring Boot API.

## 🎯 Testing Objectives
Setelah menyelesaikan testing plan ini, Anda akan:
1. **Manual E2E Testing** - Test flow registration & login secara manual
2. **Automated E2E Testing** - Setup Playwright MCP untuk automated testing
3. **Integration Testing** - Verify frontend-backend communication
4. **Error Handling Validation** - Test semua error scenarios
5. **User Experience Testing** - Verify loading states, notifications, redirects

## 🛠️ Tech Stack
- **Frontend Framework:** React 18+ with Next.js 14+
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Fetch API (native)
- **Testing (Manual):** Browser DevTools, Database verification
- **Testing (Automated):** Playwright MCP (planned)
- **Backend API:** Spring Boot REST API (port 8081)

## 🔌 Frontend-Backend Integration Points
```
Frontend (localhost:3001)  ←→  Backend (localhost:8081)

Components:
- RegistrationForm.tsx  →  POST /api/auth/register
- LoginForm.tsx         →  POST /api/auth/login
- api.ts (service)      →  All API calls with error handling
```

## 📊 Current Frontend Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── register/page.tsx     # Registration page
│   │   └── login/page.tsx        # Login page
│   ├── components/
│   │   ├── RegistrationForm.tsx  # Registration form component
│   │   ├── LoginForm.tsx         # Login form component
│   │   ├── Tooltip.tsx           # Tooltip component
│   │   └── __tests__/            # Jest unit tests
│   ├── services/
│   │   └── api.ts                # API integration layer
│   └── types/
│       └── api.ts                # TypeScript type definitions
└── package.json
```

## 📚 Testing Phases

---

### 🧪 Phase 1: Manual E2E Testing (Current Progress)
**Goal:** Verify frontend-backend integration dengan manual browser testing

#### ✅ Step 1.1: Registration Flow - Valid Data ✅ COMPLETED
**Test Case:**
- Open http://localhost:3001/register
- Fill form dengan data valid:
  - Full Name: "Test Browser User"
  - Email: "testbrowser2025@example.com"
  - Password: "TestPass123!"
  - Confirm Password: "TestPass123!"
- Submit form
- Verify success notification appears
- Verify redirect to login page
- Check database: user created with BCrypt hashed password

**Expected Result:**
- ✅ Green success notification: "Registration successful! Redirecting to login..."
- ✅ HTTP 201 Created response
- ✅ JWT token returned in response
- ✅ User saved in database (ID 25)
- ✅ Password hashed with BCrypt ($2a$12$...)

**Status:** ✅ **PASSED** (Tested: 2025-10-13)

---

#### ✅ Step 1.2: Registration Flow - Duplicate Email ✅ COMPLETED
**Test Case:**
- Open http://localhost:3001/register
- Fill form dengan email yang sudah ada:
  - Email: "testbrowser2025@example.com" (already exists)
- Submit form
- Verify error notification appears
- Verify form tidak reset (user data tetap ada)
- Check database: tidak ada duplicate entry

**Expected Result:**
- ✅ Red error notification: "Email already exists"
- ✅ HTTP 400 Bad Request response
- ✅ Form tetap terisi (tidak reset)
- ✅ No duplicate entry in database

**Status:** ✅ **PASSED** (Tested: 2025-10-13)

---

#### ✅ Step 1.3: Registration Flow - Validation Errors ✅ COMPLETED
**Test Case:**
- Test invalid email format:
  - Email: "invalid-email" (without @)
  - Expected: Email format error

- Test password mismatch:
  - Password: "TestPass123!"
  - Confirm Password: "DifferentPass456!"
  - Expected: Password mismatch error

- Test required fields:
  - Submit empty form
  - Expected: Required field errors

**Expected Result:**
- ✅ Client-side validation working
- ✅ Real-time error messages
- ✅ Submit button disabled until valid

**Status:** ✅ **PASSED** (Frontend validation already implemented)

---

#### [ ] Step 1.4: Login Flow - Valid Credentials
**Test Case:**
- Open http://localhost:3001/login
- Fill form dengan credentials yang benar:
  - Email: "testbrowser2025@example.com"
  - Password: "TestPass123!"
- Submit form
- Verify success notification
- Verify JWT token saved to localStorage
- Verify redirect to dashboard/profile page

**Expected Result:**
- [ ] Green success notification: "Login successful!"
- [ ] HTTP 200 OK response
- [ ] JWT token in response.data.token
- [ ] Token saved to localStorage: 'auth_token'
- [ ] Redirect to /dashboard or /profile

**Status:** ⏳ **PENDING** (Next test - Step 5.4 in BACKEND_PLAN)

---

#### [ ] Step 1.5: Login Flow - Invalid Password
**Test Case:**
- Open http://localhost:3001/login
- Fill form dengan password salah:
  - Email: "testbrowser2025@example.com"
  - Password: "WrongPassword123!"
- Submit form
- Verify error notification

**Expected Result:**
- [ ] Red error notification: "Invalid email or password"
- [ ] HTTP 401 Unauthorized response
- [ ] No token saved
- [ ] Form tetap di login page

**Status:** ⏳ **PENDING**

---

#### [ ] Step 1.6: Login Flow - Email Not Found
**Test Case:**
- Fill form dengan email yang tidak terdaftar:
  - Email: "notexist@example.com"
  - Password: "AnyPassword123!"
- Submit form

**Expected Result:**
- [ ] Red error notification: "Invalid email or password"
- [ ] HTTP 401 Unauthorized response
- [ ] Security best practice: same error message (jangan expose "email not found")

**Status:** ⏳ **PENDING**

---

#### [ ] Step 1.7: Protected Route Access
**Test Case:**
- Clear localStorage (remove auth_token)
- Try access /dashboard or /profile directly
- Verify redirect to login page

**Expected Result:**
- [ ] Redirect to /login if no token
- [ ] Protected pages tidak accessible tanpa auth

**Status:** ⏳ **PENDING** (Depends on protected routes implementation)

---

#### [ ] Step 1.8: Token Expiration Handling
**Test Case:**
- Login successfully (get token)
- Wait for token expiration (or manually set expired token)
- Try access protected route
- Verify redirect to login with message

**Expected Result:**
- [ ] Token validated before accessing protected routes
- [ ] Expired token → redirect to login
- [ ] Clear message: "Session expired, please login again"

**Status:** ⏳ **PENDING**

---

#### [ ] Step 1.9: Logout Flow
**Test Case:**
- Login successfully
- Click logout button
- Verify token removed from localStorage
- Verify redirect to home/login page

**Expected Result:**
- [ ] localStorage.removeItem('auth_token')
- [ ] Redirect to /login or /
- [ ] Success message: "Logged out successfully"

**Status:** ⏳ **PENDING** (Depends on logout implementation)

---

#### [ ] Step 1.10: Network Error Handling
**Test Case:**
- Stop backend server (kill Spring Boot process)
- Try register or login from frontend
- Verify error message displayed

**Expected Result:**
- [ ] User-friendly error: "Unable to connect to server"
- [ ] Not technical error like "ERR_CONNECTION_REFUSED"
- [ ] Loading state stops (tidak stuck loading)

**Status:** ⏳ **PENDING**

---

### 🤖 Phase 2: Playwright MCP Automated Testing (Future)
**Goal:** Setup automated browser testing dengan Playwright MCP untuk regression testing

#### [ ] Step 2.1: Setup Playwright MCP
**Tasks:**
- [ ] Install playwright-mcp package
- [ ] Configure MCP server in project
- [ ] Setup test environment configuration
- [ ] Create playwright.config.ts
- [ ] Verify browser automation working

**Prerequisites:**
- Node.js 18+ installed
- npm or yarn package manager
- Claude Desktop or MCP-compatible IDE

**Commands:**
```bash
# Install Playwright MCP
npm install -D @playwright/test
npx playwright install

# Install MCP server (if available via npm)
npm install -D playwright-mcp

# Or setup via MCP configuration
# Configure in ~/.claude/config.json or IDE settings
```

**Expected Output:**
- Playwright installed successfully
- Browsers downloaded (Chromium, Firefox, WebKit)
- Test runner configured

**Status:** 📅 **PLANNED** (After Phase 1 complete)

---

#### [ ] Step 2.2: Create Test Helpers & Utilities
**Tasks:**
- [ ] Create `tests/helpers/auth.ts` - Login/register helper functions
- [ ] Create `tests/fixtures/users.ts` - Test user data fixtures
- [ ] Create `tests/utils/api.ts` - API mock/intercept utilities
- [ ] Create `tests/pages/` - Page Object Models

**Example Structure:**
```typescript
// tests/helpers/auth.ts
export async function registerUser(page, userData) {
  await page.goto('http://localhost:3001/register');
  await page.fill('#fullName', userData.fullName);
  await page.fill('#email', userData.email);
  await page.fill('#password', userData.password);
  await page.fill('#confirmPassword', userData.confirmPassword);
  await page.click('button[type="submit"]');
}

// tests/fixtures/users.ts
export const testUsers = {
  valid: {
    fullName: 'Playwright Test User',
    email: 'playwright@example.com',
    password: 'TestPass123!',
  },
  // ...
};
```

**Status:** 📅 **PLANNED**

---

#### [ ] Step 2.3: Registration Flow Automated Tests
**Test Suite:** `tests/e2e/registration.spec.ts`

**Test Cases:**
```typescript
describe('Registration Flow', () => {
  test('should register with valid data', async ({ page }) => {
    // Navigate to registration page
    // Fill form with valid data
    // Submit form
    // Assert success notification appears
    // Assert redirect to login page
    // Verify in database (optional)
  });

  test('should show error for duplicate email', async ({ page }) => {
    // Register user first
    // Try register again with same email
    // Assert error notification appears
    // Assert HTTP 400 response
  });

  test('should validate email format', async ({ page }) => {
    // Fill invalid email
    // Assert validation error message
    // Assert submit button disabled
  });

  test('should validate password match', async ({ page }) => {
    // Fill mismatched passwords
    // Assert error message
  });

  test('should show loading state during submission', async ({ page }) => {
    // Submit form
    // Assert loading spinner/button state
    // Assert form disabled during loading
  });
});
```

**Status:** 📅 **PLANNED**

---

#### [ ] Step 2.4: Login Flow Automated Tests
**Test Suite:** `tests/e2e/login.spec.ts`

**Test Cases:**
```typescript
describe('Login Flow', () => {
  test('should login with valid credentials', async ({ page }) => {
    // Navigate to login page
    // Fill valid credentials
    // Submit form
    // Assert success notification
    // Assert JWT token in localStorage
    // Assert redirect to dashboard
  });

  test('should show error for invalid password', async ({ page }) => {
    // Fill correct email, wrong password
    // Submit form
    // Assert error notification
    // Assert no token saved
  });

  test('should show error for non-existent email', async ({ page }) => {
    // Fill non-existent email
    // Submit form
    // Assert error notification
  });

  test('should persist login after page refresh', async ({ page }) => {
    // Login successfully
    // Refresh page
    // Assert still logged in (token exists)
  });
});
```

**Status:** 📅 **PLANNED**

---

#### [ ] Step 2.5: Protected Routes Automated Tests
**Test Suite:** `tests/e2e/protected-routes.spec.ts`

**Test Cases:**
```typescript
describe('Protected Routes', () => {
  test('should redirect to login if not authenticated', async ({ page }) => {
    // Clear localStorage
    // Try access /dashboard
    // Assert redirect to /login
  });

  test('should access protected route when authenticated', async ({ page }) => {
    // Login first
    // Navigate to /dashboard
    // Assert page loads successfully
    // Assert user data displayed
  });

  test('should redirect to login on token expiration', async ({ page }) => {
    // Login with short-lived token
    // Wait for expiration
    // Try access protected route
    // Assert redirect to login
  });
});
```

**Status:** 📅 **PLANNED**

---

#### [ ] Step 2.6: Logout Flow Automated Tests
**Test Suite:** `tests/e2e/logout.spec.ts`

**Test Cases:**
```typescript
describe('Logout Flow', () => {
  test('should logout and clear token', async ({ page }) => {
    // Login first
    // Click logout button
    // Assert token removed from localStorage
    // Assert redirect to home/login
  });

  test('should not access protected routes after logout', async ({ page }) => {
    // Login first
    // Logout
    // Try access /dashboard
    // Assert redirect to login
  });
});
```

**Status:** 📅 **PLANNED**

---

#### [ ] Step 2.7: Error Handling Automated Tests
**Test Suite:** `tests/e2e/error-handling.spec.ts`

**Test Cases:**
```typescript
describe('Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure
    // Try submit form
    // Assert user-friendly error message
    // Assert form still usable (not stuck)
  });

  test('should handle server errors (500)', async ({ page }) => {
    // Mock server error response
    // Submit form
    // Assert error message displayed
  });

  test('should handle CORS errors', async ({ page }) => {
    // Test CORS configuration
    // Verify no CORS errors in console
  });
});
```

**Status:** 📅 **PLANNED**

---

#### [ ] Step 2.8: Performance & Accessibility Tests
**Test Suite:** `tests/e2e/performance.spec.ts`

**Test Cases:**
```typescript
describe('Performance & Accessibility', () => {
  test('should load registration page within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:3001/register');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000);
  });

  test('should pass accessibility checks', async ({ page }) => {
    // Use @axe-core/playwright
    await page.goto('http://localhost:3001/register');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Test Tab navigation through form
    // Test Enter to submit
  });
});
```

**Status:** 📅 **PLANNED**

---

#### [ ] Step 2.9: CI/CD Integration
**Tasks:**
- [ ] Create `.github/workflows/e2e-tests.yml`
- [ ] Configure automated testing on PR
- [ ] Setup test reporting
- [ ] Add test coverage reporting

**GitHub Actions Workflow:**
```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Start backend server
        run: |
          cd backend
          mvn spring-boot:run &
          sleep 10
      - name: Start frontend server
        run: npm run dev &
      - name: Wait for servers
        run: npx wait-on http://localhost:3001 http://localhost:8081
      - name: Run E2E tests
        run: npx playwright test
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

**Status:** 📅 **PLANNED**

---

### 📖 Phase 3: Documentation & Best Practices
**Goal:** Document testing process dan best practices

#### [ ] Step 3.1: Create Testing Documentation
**Tasks:**
- [ ] Document manual testing checklist
- [ ] Document automated testing setup guide
- [ ] Create troubleshooting guide
- [ ] Add screenshots/videos of test execution

**Files to Create:**
- `TESTING_MANUAL.md` - Manual testing checklist
- `TESTING_AUTOMATED.md` - Playwright MCP setup & usage
- `TESTING_TROUBLESHOOTING.md` - Common issues & solutions

**Status:** 📅 **PLANNED**

---

#### [ ] Step 3.2: Create Test Data Management
**Tasks:**
- [ ] Create seed data scripts
- [ ] Create database cleanup scripts
- [ ] Document test user credentials
- [ ] Setup test database isolation

**Example:**
```bash
# Database setup for testing
npm run test:db:setup    # Create test database
npm run test:db:seed     # Seed test data
npm run test:db:cleanup  # Clean test data
```

**Status:** 📅 **PLANNED**

---

#### [ ] Step 3.3: Video Recording & Screenshot
**Tasks:**
- [ ] Enable Playwright video recording
- [ ] Setup screenshot on test failure
- [ ] Create visual regression testing (optional)

**Playwright Config:**
```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
});
```

**Status:** 📅 **PLANNED**

---

## 🎯 Success Metrics

### Phase 1 Success (Manual E2E Testing):
- [x] Registration with valid data ✅
- [x] Registration with duplicate email ✅
- [x] Registration validation errors ✅
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Protected route access control
- [ ] Token expiration handling
- [ ] Logout flow
- [ ] Network error handling
- [ ] All scenarios documented in TESTING_STEP_5.x.md

### Phase 2 Success (Playwright MCP Automated):
- [ ] Playwright MCP installed & configured
- [ ] All registration tests automated
- [ ] All login tests automated
- [ ] Protected routes tests automated
- [ ] Error handling tests automated
- [ ] Tests running in CI/CD
- [ ] Test coverage > 80%

### Phase 3 Success (Documentation):
- [ ] Complete testing documentation
- [ ] Test data management scripts
- [ ] Video/screenshot on failures
- [ ] Team onboarding guide for testing

---

## 📊 Current Test Status Summary

### ✅ Completed Tests (Manual):
| Test Scenario | Status | Date | Notes |
|--------------|--------|------|-------|
| Registration - Valid Data | ✅ PASSED | 2025-10-13 | User ID 25 created, BCrypt hashed |
| Registration - Duplicate Email | ✅ PASSED | 2025-10-13 | HTTP 400, proper error message |
| Registration - Validation | ✅ PASSED | - | Client-side validation working |

### ⏳ Pending Tests (Manual):
| Test Scenario | Status | Priority | Depends On |
|--------------|--------|----------|------------|
| Login - Valid Credentials | ⏳ PENDING | HIGH | Step 5.4 in BACKEND_PLAN |
| Login - Invalid Password | ⏳ PENDING | HIGH | Step 5.4 |
| Login - Email Not Found | ⏳ PENDING | HIGH | Step 5.4 |
| Protected Route Access | ⏳ PENDING | MEDIUM | Protected routes implementation |
| Token Expiration | ⏳ PENDING | MEDIUM | JWT refresh token logic |
| Logout Flow | ⏳ PENDING | MEDIUM | Logout button implementation |
| Network Error Handling | ⏳ PENDING | LOW | - |

### 📅 Planned Tests (Automated):
- All manual tests will be automated using Playwright MCP
- CI/CD integration for automated regression testing
- Performance & accessibility testing

---

## 🚨 Important Notes

### 🎓 Testing Approach:
- **Manual First:** Test manually untuk understand flow
- **Automate Later:** Automate setelah flow stable
- **Document Everything:** Every test case documented with expected results
- **Think Like User:** Test dari perspektif user, bukan developer

### 🔧 Testing Best Practices:
- **Isolated Tests:** Each test should be independent
- **Clean Data:** Reset database state between tests
- **Realistic Data:** Use realistic test data (not "test123")
- **Error Scenarios:** Test not only happy path, but also error cases
- **Security Testing:** Test authentication, authorization, input validation

### 🎯 Focus Areas:
1. **Frontend-Backend Integration** - API calls working properly
2. **Error Handling** - User-friendly error messages
3. **Loading States** - UX during async operations
4. **Security** - Token handling, protected routes
5. **User Experience** - Smooth flow, clear feedback

### 📝 Test Documentation Format:
```markdown
#### Test Case: [Name]
**Scenario:** [What are we testing]
**Steps:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:**
- Result 1
- Result 2

**Actual Result:** [PASS/FAIL]
**Notes:** [Any observations]
**Date:** [YYYY-MM-DD]
**Tester:** [Name]
```

---

## 📖 Next Steps

### Immediate (Now):
1. **Lanjutkan Step 5.4** - Test login flow end-to-end (manual)
2. **Document login tests** in TESTING_STEP_5.4.md
3. **Verify all scenarios** (valid login, invalid password, email not found)

### Short Term (This Week):
1. Complete all Phase 1 manual tests
2. Fix any bugs found during testing
3. Update FRONTEND_PLAN.md with test results
4. Commit testing documentation incrementally

### Medium Term (Next Week):
1. Research Playwright MCP setup
2. Install and configure Playwright
3. Create test helpers and utilities
4. Start automating registration tests

### Long Term (This Month):
1. Complete all automated E2E tests
2. Setup CI/CD with automated testing
3. Create comprehensive testing documentation
4. Train team on testing process

---

## 🔗 Related Documents
- [`backend/docs/BACKEND_PLAN.md`](../../backend/docs/BACKEND_PLAN.md) - Backend development progress
- [`backend/docs/TESTING_STEP_5.3.md`](../../backend/docs/TESTING_STEP_5.3.md) - Registration testing results (completed)
- [`backend/docs/TESTING_STEP_5.4.md`](../../backend/docs/TESTING_STEP_5.4.md) - Login testing results (in progress)
- [`README.md`](../../README.md) - Project overview

---

## 📞 Testing Checklist (Quick Reference)

### Before Each Test:
- [ ] Backend server running (localhost:8081)
- [ ] Frontend server running (localhost:3001)
- [ ] Database connection verified
- [ ] Browser DevTools open (Console + Network tab)
- [ ] Clear localStorage (untuk test clean state)

### During Test:
- [ ] Fill form dengan test data
- [ ] Submit form
- [ ] Observe loading state
- [ ] Check notification message
- [ ] Verify network request/response
- [ ] Check console for errors

### After Test:
- [ ] Verify database state (psql query)
- [ ] Check localStorage (auth_token)
- [ ] Screenshot result (for documentation)
- [ ] Document test result
- [ ] Note any unexpected behavior

---

**Happy Testing! 🧪**
**Automated Testing Coming Soon! 🤖**
