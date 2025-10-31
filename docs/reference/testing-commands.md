# Testing Commands Reference

Complete reference for all testing commands and options available in the Registration Form project.

## Table of Contents

- [Basic Commands](#basic-commands)
- [E2E Testing Commands](#e2e-testing-commands)
- [API Testing Commands](#api-testing-commands)
- [Test Filtering](#test-filtering)
- [Browsers](#browsers)
- [Reporters](#reporters)
- [Debugging](#debugging)
- [Configuration Options](#configuration-options)

---

## Basic Commands

### Run All Tests

```bash
npx playwright test
```

Runs all tests in the project (both E2E and API tests).

**Default behavior:**
- Runs in headless mode
- Uses all configured browsers (chromium, firefox, webkit)
- Shows list reporter
- Parallel execution with 5 workers

### Check Playwright Version

```bash
npx playwright --version
```

Shows installed Playwright version.

---

## E2E Testing Commands

### Run All E2E Tests

```bash
npx playwright test tests/e2e/
```

Runs all End-to-End tests located in `tests/e2e/` directory.

### Run Specific E2E Test File

```bash
npx playwright test tests/e2e/auth-flow.spec.ts
```

Runs only the authentication flow tests.

**Available E2E test files:**
- `auth-flow.spec.ts` - Complete authentication journey (8 tests)
- `registration.spec.ts` - Registration form tests (if exists)
- `login.spec.ts` - Login form tests (if exists)

### Run Single Test by Line Number

```bash
npx playwright test tests/e2e/auth-flow.spec.ts:33
```

Runs only the test starting at line 33 in the file.

### Run Tests with Headed Browser

```bash
npx playwright test tests/e2e/ --headed
```

Opens visible browser window to watch tests execute.

**Use cases:**
- Debugging test failures
- Understanding test flow
- Demo purposes

### Run Tests with UI Mode

```bash
npx playwright test --ui
```

Opens Playwright UI for interactive test running.

**Features:**
- Step through tests
- Inspect DOM at each step
- Time travel debugging
- See network requests
- View console logs

---

## API Testing Commands

### Run All API Tests

```bash
npx playwright test tests/api/
```

Runs all API tests located in `tests/api/` directory.

### Run Specific API Test File

```bash
npx playwright test tests/api/auth.api.spec.ts
```

Runs only authentication API tests.

**Available API test files:**
- `auth.api.spec.ts` - Authentication endpoints
- `users.api.spec.ts` - User management endpoints
- `protected.api.spec.ts` - Protected endpoints with JWT
- `error-handling.api.spec.ts` - Error scenario tests

### Run API Tests with Specific Project

```bash
npx playwright test tests/api/ --project=api-tests
```

Explicitly runs using the 'api-tests' project configuration.

---

## Test Filtering

### Run Tests by Name Pattern

```bash
npx playwright test --grep "login"
```

Runs only tests whose names match "login".

**Examples:**
```bash
# Run all login-related tests
npx playwright test --grep "login"

# Run all registration tests
npx playwright test --grep "register"

# Run all redirect tests
npx playwright test --grep "redirect"
```

### Exclude Tests by Pattern

```bash
npx playwright test --grep-invert "slow"
```

Runs all tests EXCEPT those containing "slow".

### Run Failed Tests Only

```bash
npx playwright test --last-failed
```

Re-runs only the tests that failed in the last run.

**Useful for:**
- Quick iteration on fixes
- Debugging flaky tests
- CI/CD pipeline optimization

---

## Browsers

### Run in Specific Browser

```bash
# Chromium only
npx playwright test --project=chromium

# Firefox only
npx playwright test --project=firefox

# WebKit (Safari) only
npx playwright test --project=webkit
```

### Run in Multiple Specific Browsers

```bash
npx playwright test --project=chromium --project=firefox
```

Runs tests in both Chromium and Firefox.

### List All Projects

```bash
npx playwright test --list
```

Shows all configured test projects.

---

## Reporters

### HTML Reporter (Default for CI)

```bash
npx playwright test --reporter=html
```

Generates HTML report in `playwright-report/` directory.

**View report:**
```bash
npx playwright show-report
```

Opens report in browser with:
- Test results
- Screenshots
- Videos
- Traces
- Network logs

### List Reporter (Default for Local)

```bash
npx playwright test --reporter=list
```

Shows simple list output in terminal.

### JSON Reporter

```bash
npx playwright test --reporter=json
```

Outputs results in JSON format.

**Use cases:**
- CI/CD integration
- Custom reporting tools
- Metrics collection

### JUnit Reporter

```bash
npx playwright test --reporter=junit
```

Generates JUnit XML report for CI systems.

### Multiple Reporters

```bash
npx playwright test --reporter=list --reporter=html
```

Uses both list (terminal) and HTML (file) reporters.

---

## Debugging

### Debug Mode

```bash
npx playwright test --debug
```

Opens Playwright Inspector for step-by-step debugging.

**Features:**
- Pause before each action
- Step through test
- Explore locators
- Generate code
- Edit selectors

### Debug Specific Test

```bash
npx playwright test tests/e2e/auth-flow.spec.ts:33 --debug
```

Debugs only one specific test.

### Show Trace Viewer

```bash
npx playwright show-trace trace.zip
```

Opens trace viewer for recorded test execution.

**Traces show:**
- Screenshots at each step
- DOM snapshots
- Network requests
- Console logs
- Action timeline

### Record Trace

```bash
npx playwright test --trace on
```

Records trace for all tests.

**Options:**
- `--trace on` - Always record
- `--trace off` - Never record
- `--trace on-first-retry` - Record on retry
- `--trace retain-on-failure` - Keep only failed

---

## Configuration Options

### Set Workers (Parallelization)

```bash
npx playwright test --workers=1
```

Runs tests sequentially (no parallelization).

**Options:**
- `--workers=1` - Sequential
- `--workers=2` - 2 parallel workers
- `--workers=50%` - Half of CPU cores

### Set Timeout

```bash
npx playwright test --timeout=60000
```

Sets test timeout to 60 seconds (default 30s).

### Set Global Timeout

```bash
npx playwright test --global-timeout=600000
```

Sets total test run timeout to 10 minutes.

### Retry Failed Tests

```bash
npx playwright test --retries=2
```

Retries each failed test up to 2 times.

**Use cases:**
- Handling flaky tests
- Network instability
- CI/CD environments

### Run Specific Number of Times

```bash
npx playwright test --repeat-each=3
```

Runs each test 3 times (for flakiness detection).

---

## Advanced Commands

### Update Snapshots

```bash
npx playwright test --update-snapshots
```

Updates visual comparison snapshots.

### Generate Code

```bash
npx playwright codegen http://localhost:3001
```

Opens browser and records actions as test code.

### Install Browsers

```bash
npx playwright install
```

Installs all Playwright browsers.

**Install specific browser:**
```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

### Check Installation

```bash
npx playwright install --dry-run
```

Checks what would be installed without installing.

---

## Environment-Specific Commands

### Development

```bash
# Run tests with headed browser
npx playwright test --headed

# Run with UI mode for interactive debugging
npx playwright test --ui

# Run single test in debug mode
npx playwright test auth-flow.spec.ts:33 --debug
```

### CI/CD

```bash
# Run all tests headless with retries
npx playwright test --retries=2

# Run with HTML reporter
npx playwright test --reporter=html

# Run with trace on failure
npx playwright test --trace on-first-retry
```

### Quick Smoke Test

```bash
# Run only chromium for quick feedback
npx playwright test --project=chromium tests/api/
```

---

## Combining Options

### Full Debug Setup

```bash
npx playwright test tests/e2e/auth-flow.spec.ts \
  --project=chromium \
  --headed \
  --debug \
  --workers=1
```

### Full CI Setup

```bash
npx playwright test \
  --reporter=html \
  --reporter=junit \
  --retries=2 \
  --trace on-first-retry \
  --workers=4
```

### Quick Feedback Loop

```bash
npx playwright test tests/api/ \
  --project=api-tests \
  --reporter=list \
  --workers=50%
```

---

## npm Scripts Reference

The project also provides npm scripts for common operations:

### Package.json Scripts

```json
{
  "scripts": {
    "test": "playwright test",
    "test:e2e": "playwright test tests/e2e/",
    "test:api": "playwright test tests/api/",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report"
  }
}
```

### Using npm Scripts

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Run API tests
npm run test:api

# Run with UI
npm run test:ui

# Show report
npm run test:report
```

---

## Exit Codes

Playwright uses standard exit codes:

- `0` - All tests passed
- `1` - Test failures or errors
- `2` - Configuration errors

**Use in CI/CD:**
```bash
npx playwright test || echo "Tests failed with code $?"
```

---

## Configuration Files

### playwright.config.ts

Main configuration file defining:
- Test directory
- Timeout settings
- Browser configurations
- Reporter settings
- Base URL
- Retry logic

**Location**: `playwright.config.ts` (project root)

### .env Files

Environment variables for tests:

```bash
# .env.test
API_BASE_URL=http://localhost:8081
FRONTEND_URL=http://localhost:3001
TEST_USER_EMAIL=test@example.com
```

---

## Performance Tips

### Speed Up Tests

```bash
# Run API tests only (faster than E2E)
npx playwright test tests/api/

# Use more workers
npx playwright test --workers=10

# Run in single browser
npx playwright test --project=chromium

# Skip video recording
npx playwright test --video=off
```

### Reduce Flakiness

```bash
# Add retries
npx playwright test --retries=2

# Increase timeout
npx playwright test --timeout=60000

# Run sequentially
npx playwright test --workers=1
```

---

## Troubleshooting Commands

### Clear Test Cache

```bash
rm -rf test-results/
rm -rf playwright-report/
```

### Re-install Browsers

```bash
npx playwright install --force
```

### Check System Dependencies

```bash
npx playwright install-deps
```

Installs system dependencies required by browsers.

---

## See Also

- [Testing Tutorial](../tutorials/testing-guide.md) - Learn to write tests
- [API Testing How-To](../how-to/api-testing.md) - API testing guide
- [E2E Testing How-To](../how-to/run-e2e-tests.md) - E2E testing guide
- [Playwright Documentation](https://playwright.dev/docs/intro) - Official docs
