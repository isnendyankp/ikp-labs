# 🥒 Gherkin/BDD Testing Guide

**Business-friendly test specifications** using Behavior-Driven Development (BDD) with Cucumber and Gherkin syntax.

## Overview

Gherkin tests use **Given-When-Then** syntax to describe application behavior in plain English. This makes tests readable by both technical and non-technical stakeholders.

These tests combine:
- **Cucumber** - BDD test framework
- **Gherkin** - Plain-language syntax (Given-When-Then)
- **Playwright** - Browser automation engine
- **TypeScript** - Step definition implementation

## 🚀 Quick Start

### Prerequisites

**Both servers must be running:**

```bash
# Terminal 1: Backend (port 8081)
cd backend/ikp-labs-api
mvn spring-boot:run

# Terminal 2: Frontend (port 3002)
cd frontend
npm run dev
```

### Run Gherkin Tests

```bash
# Run all Gherkin tests
cd frontend
npm run test:cucumber

# Run specific feature file
npx cucumber-js ../tests/gherkin/features/login.feature --require-module ts-node/register --require ../tests/gherkin/steps/**/*.ts

# Run with specific tag
npx cucumber-js ../tests/gherkin/features/ --tags "@smoke" --require-module ts-node/register --require ../tests/gherkin/steps/**/*.ts
```

## 📁 Structure

```
tests/gherkin/
├── features/                   # Gherkin feature files (.feature)
│   ├── login.feature          # Login scenarios (11 scenarios)
│   └── registration.feature   # Registration scenarios (10 scenarios)
└── steps/                     # Step definitions (.ts)
    ├── login.steps.ts         # Login step implementations (Playwright)
    └── registration.steps.ts  # Registration step implementations
```

## 📋 Feature Files

### Login Feature

**[login.feature](features/login.feature)** - 11 scenarios

**Scenarios covered:**
1. ✅ Successful login with valid credentials
2. ✅ Failed login with invalid password
3. ✅ Failed login with non-existent email
4. ✅ Email field validation (invalid format)
5. ✅ Email field validation (empty email)
6. ✅ Password field validation (empty password)
7. ✅ Empty form submission
8. ✅ Login persistence (session management)
9. ✅ Logout functionality
10. ✅ Redirect after login
11. ✅ And more...

**Example scenario:**
```gherkin
Feature: User Login
  As a registered user
  I want to log in to the application
  So that I can access my account

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I fill in the email field with "testuser123@example.com"
    And I fill in the password field with "TestPass123!"
    And I click the login button
    Then I should be redirected to the home page
    And I should see a success message
```

### Registration Feature

**[registration.feature](features/registration.feature)** - 10 scenarios

**Scenarios covered:**
1. ✅ Successful registration with valid data
2. ✅ Duplicate email prevention
3. ✅ Password strength validation
4. ✅ Email format validation
5. ✅ Full name validation
6. ✅ Empty form submission
7. ✅ Database persistence verification
8. ✅ Automatic login after registration
9. ✅ And more...

**Example scenario:**
```gherkin
Feature: User Registration
  As a new user
  I want to register for an account
  So that I can use the application

  Scenario: Successful registration
    Given I am on the registration page
    When I fill in the full name with "John Doe"
    And I fill in the email with "john@example.com"
    And I fill in the password with "SecurePass123!"
    And I fill in the confirm password with "SecurePass123!"
    And I click the register button
    Then I should see a success message
    And I should be logged in automatically
    And my account should exist in the database
```

## 🔧 Step Definitions

### Login Steps

**[login.steps.ts](steps/login.steps.ts)** - Playwright implementation

**Key steps:**
```typescript
Given('I am on the login page', async function () {
  await page.goto('http://localhost:3002/login');
  await page.waitForLoadState('networkidle');
});

When('I fill in the email field with {string}', async function (email: string) {
  await page.fill('[name="email"]', email);
});

When('I fill in the password field with {string}', async function (password: string) {
  await page.fill('[name="password"]', password);
});

When('I click the login button', async function () {
  await page.click('button[type="submit"]');
});

Then('I should be redirected to the home page', async function () {
  await page.waitForURL('**/home');
  expect(page.url()).toContain('/home');
});
```

### Registration Steps

**[registration.steps.ts](steps/registration.steps.ts)** - Playwright implementation

**Key steps:**
```typescript
Given('I am on the registration page', async function () {
  await page.goto('http://localhost:3002/register');
  await page.waitForLoadState('networkidle');
});

When('I fill in the full name with {string}', async function (fullName: string) {
  await page.fill('[name="fullName"]', fullName);
});

Then('I should see a success message', async function () {
  const successMessage = page.locator('.alert-success');
  await expect(successMessage).toBeVisible();
});

Then('my account should exist in the database', async function () {
  // Verify via API call
  const response = await page.request.get(`http://localhost:8081/api/users/email/${this.testEmail}`);
  expect(response.status()).toBe(200);
});
```

## 📝 Writing New Gherkin Tests

### Step 1: Create Feature File

Create a new `.feature` file in `features/` folder:

**features/photo-favorites.feature:**
```gherkin
Feature: Photo Favorites
  As a logged-in user
  I want to favorite photos
  So that I can save them for later

  Background:
    Given I am logged in as "user@example.com"
    And I am on the gallery page

  Scenario: Favorite a photo
    When I click the favorite button on the first photo
    Then the photo should be marked as favorited
    And the favorite count should increase by 1

  Scenario: View favorited photos
    Given I have favorited 3 photos
    When I navigate to the "Favorited Photos" page
    Then I should see 3 photos
    And all photos should have the favorited indicator
```

### Step 2: Create Step Definitions

Create corresponding `.steps.ts` file in `steps/` folder:

**steps/photo-favorites.steps.ts:**
```typescript
import { Given, When, Then, Before, After } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { chromium, Browser, Page, BrowserContext } from 'playwright';

let browser: Browser;
let context: BrowserContext;
let page: Page;

Before(async function () {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  await page.close();
  await context.close();
  await browser.close();
});

Given('I am logged in as {string}', async function (email: string) {
  await page.goto('http://localhost:3002/login');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', 'TestPass123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/home');
});

Given('I am on the gallery page', async function () {
  await page.goto('http://localhost:3002/gallery');
  await page.waitForLoadState('networkidle');
});

When('I click the favorite button on the first photo', async function () {
  const firstPhoto = page.locator('[data-testid^="photo-card-"]').first();
  await firstPhoto.locator('[data-testid="favorite-button"]').click();
});

Then('the photo should be marked as favorited', async function () {
  const firstPhoto = page.locator('[data-testid^="photo-card-"]').first();
  const favoriteButton = firstPhoto.locator('[data-testid="favorite-button"]');
  await expect(favoriteButton).toHaveClass(/favorited/);
});
```

### Step 3: Run Your Tests

```bash
cd frontend
npm run test:cucumber
```

## 🎯 Gherkin Syntax Guide

### Given-When-Then Pattern

**Given** - Initial context (setup)
```gherkin
Given I am on the login page
Given I am logged in as "user@example.com"
Given there are 5 photos in the gallery
```

**When** - Action/Event
```gherkin
When I click the login button
When I fill in the email with "test@example.com"
When I upload a photo
```

**Then** - Expected outcome (assertion)
```gherkin
Then I should see a success message
Then I should be redirected to the home page
Then the photo should appear in the gallery
```

**And/But** - Additional steps
```gherkin
And I fill in the password field
And I click the submit button
But I should not see an error message
```

### Background

Runs before each scenario in the feature:

```gherkin
Feature: Photo Management

  Background:
    Given I am logged in as "user@example.com"
    And I am on the gallery page

  Scenario: Upload photo
    When I upload a new photo
    Then the photo should appear in my gallery

  Scenario: Delete photo
    When I click delete on my photo
    Then the photo should be removed
```

### Scenario Outline (Data-driven tests)

```gherkin
Scenario Outline: Login with invalid credentials
  Given I am on the login page
  When I fill in the email with "<email>"
  And I fill in the password with "<password>"
  And I click the login button
  Then I should see an error message "<error>"

  Examples:
    | email              | password    | error                  |
    | invalid@format     | Pass123!    | Invalid email format   |
    | user@example.com   | wrong       | Invalid credentials    |
    | nonexistent@.com   | Pass123!    | User not found         |
```

### Tags

Organize scenarios with tags:

```gherkin
@smoke @critical
Scenario: User can login with valid credentials
  Given I am on the login page
  When I login with valid credentials
  Then I should see the dashboard

@skip
Scenario: Feature under development
  # This will be skipped
```

Run specific tags:
```bash
npx cucumber-js ../tests/gherkin/features/ --tags "@smoke"
npx cucumber-js ../tests/gherkin/features/ --tags "not @skip"
```

## 🔍 Gherkin vs Playwright E2E

| Aspect | Gherkin/BDD | Playwright Native E2E |
|--------|-------------|----------------------|
| **File Format** | `.feature` (Gherkin) | `.spec.ts` (TypeScript) |
| **Syntax** | Given-When-Then | `test()` / `describe()` |
| **Audience** | Business + Developers | Developers only |
| **Readability** | Very high (plain English) | Medium (code) |
| **Reusability** | High (shared step definitions) | Medium (helper functions) |
| **Maintenance** | 2 files (feature + steps) | 1 file (test spec) |
| **Learning Curve** | Low (non-technical friendly) | Medium (requires TS knowledge) |
| **Speed** | Same (both use Playwright) | Same |
| **When to Use** | Requirements documentation | Rapid test development |

**Both are valuable!**
- Use **Gherkin** for stakeholder communication and living documentation
- Use **Playwright native** for developer-focused regression testing

## 🐛 Debugging Tips

### 1. Run Specific Scenario

```bash
# By line number
npx cucumber-js ../tests/gherkin/features/login.feature:12 --require-module ts-node/register --require ../tests/gherkin/steps/**/*.ts

# By name
npx cucumber-js ../tests/gherkin/features/ --name "Successful login" --require-module ts-node/register --require ../tests/gherkin/steps/**/*.ts
```

### 2. Add Console Logs

```typescript
When('I click the login button', async function () {
  console.log('🔍 Clicking login button...');
  await page.click('button[type="submit"]');
  console.log('✅ Login button clicked');
});
```

### 3. Take Screenshots

```typescript
After(async function (scenario) {
  if (scenario.result.status === 'failed') {
    const screenshot = await page.screenshot();
    this.attach(screenshot, 'image/png');
  }
});
```

### 4. Use Playwright Inspector

Pause execution in step definition:

```typescript
When('I click the login button', async function () {
  await page.pause(); // Opens Playwright Inspector
  await page.click('button[type="submit"]');
});
```

## 📊 Test Reports

### Default Console Output

```bash
cd frontend
npm run test:cucumber
```

Output:
```
Feature: User Login

  Scenario: Successful login with valid credentials
    ✓ Given I am on the login page
    ✓ When I fill in the email field with "testuser123@example.com"
    ✓ When I fill in the password field with "TestPass123!"
    ✓ When I click the login button
    ✓ Then I should be redirected to the home page

2 scenarios (2 passed)
10 steps (10 passed)
0m12.345s
```

### Pretty Formatter

Install prettier reporter:
```bash
npm install --save-dev @cucumber/pretty-formatter
```

Use in command:
```bash
npx cucumber-js ../tests/gherkin/features/ --format @cucumber/pretty-formatter --require-module ts-node/register --require ../tests/gherkin/steps/**/*.ts
```

## 🔗 Related Documentation

- [Main Testing Guide](../README.md) - Overview of all test types
- [E2E Testing Guide](../e2e/README.md) - Playwright native tests
- [API Testing Guide](../api/README.md) - Backend contract tests
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/) - Official Cucumber docs
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/) - Gherkin syntax guide

## 🆘 Common Issues

### Issue: "Undefined step"

**Cause:** Step definition not implemented or not loaded

**Solution:**
```typescript
// Make sure step is defined in steps/*.ts file
When('I perform some action', async function () {
  // Implementation
});
```

### Issue: "Cannot find module 'ts-node/register'"

**Cause:** Missing TypeScript dependencies

**Solution:**
```bash
npm install --save-dev ts-node typescript @types/node
```

### Issue: "Browser not launched"

**Cause:** Missing `Before` hook in step definitions

**Solution:**
```typescript
Before(async function () {
  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();
});
```

### Issue: Steps don't match feature file

**Cause:** Mismatch between feature file text and step definition regex

**Example:**
```gherkin
# Feature file
When I login with "user@example.com"

# Step definition (WRONG - no string parameter)
When('I login', async function () { ... })

# Step definition (CORRECT)
When('I login with {string}', async function (email: string) { ... })
```

---

**Happy BDD Testing! 🥒**

For questions or issues, check the [main testing guide](../README.md) or refer to the [Cucumber documentation](https://cucumber.io/docs/cucumber/).
