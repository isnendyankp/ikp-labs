---
name: plan-writing-gherkin-criteria
description: Guide for writing Gherkin acceptance criteria using Given-When-Then syntax for testable requirements. Covers scenario structure, background blocks, scenario outlines with examples tables, common patterns for authentication/CRUD/validation/error handling, and best practices for clear testable specifications. Essential for writing user stories and plan acceptance criteria
---

# Skill: Writing Gherkin Acceptance Criteria

**Category**: Planning & Specifications
**Purpose**: Guide for writing Gherkin acceptance criteria using Given-When-Then syntax to create clear, testable specifications for features and user stories.
**Used By**: plan-maker, plan-checker, gherkin-spec-writer

---

## Overview

Gherkin acceptance criteria create unambiguous, testable specifications that bridge requirements and automated tests. IKP-Labs uses Gherkin in two places: `specs/*.feature` files (linked to Playwright E2E tests) and `plans/*/checklist.md` acceptance criteria sections.

---

## Core Concepts

### Given-When-Then Structure

```gherkin
Scenario: [Brief description of scenario]
  Given [Initial context/preconditions]
  When [Action or event occurs]
  Then [Expected outcome/postconditions]
```

- **Given** — sets up context (initial state, preconditions)
- **When** — describes the action or trigger
- **Then** — specifies expected outcome (assertions)

**Example:**

```gherkin
Scenario: User logs in with valid credentials
  Given a registered user with email "alice@example.com" and password "secure123"
  When the user submits the login form with correct credentials
  Then the user should be redirected to the dashboard
  And the user should see welcome message "Welcome back, Alice!"
```

---

## IKP-Labs Spec Structure

Feature files live in `specs/` grouped by domain:

```text
specs/
  authentication/   — login, registration, home page
  gallery/          — photo upload, management, likes, sorting, privacy
  profile/          — profile picture
```

**1-1-1 rule** (IKP-Labs hard rule): 1 Given, 1 When, 1 Then per scenario. Use `And` for additional steps within each block.

---

## Basic Scenario Patterns

### Pattern 1: Happy Path

```gherkin
Scenario: Upload a photo successfully
  Given I am logged in as a registered user
  When I upload a valid JPEG file under 5MB
  Then the photo should appear in my gallery
  And I should see success message "Photo uploaded"
```

### Pattern 2: Error Handling

```gherkin
Scenario: Reject oversized photo upload
  Given I am logged in as a registered user
  When I attempt to upload a file larger than 5MB
  Then the upload should be rejected
  And I should see error message "File size must be under 5MB"
```

### Pattern 3: Boundary Conditions

```gherkin
Scenario: Reject photo title exceeding maximum length
  Given I am logged in as a registered user
  When I attempt to save a photo with a title of 201 characters
  Then I should see validation error "Title must be 200 characters or less"
  And the photo should not be saved
```

---

## Advanced Gherkin Features

### Background Block

Shared setup for all scenarios in a feature:

```gherkin
Feature: Photo Gallery

Background:
  Given the application is running
  And the database contains the following users:
    | email             | password  | role  |
    | admin@test.com    | admin123  | admin |
    | user@test.com     | user123   | user  |

Scenario: Admin can view all photos
  When admin logs in and navigates to gallery
  Then all photos should be visible

Scenario: User sees only their own photos
  When user logs in and navigates to gallery
  Then only their own photos should be visible
```

### Scenario Outline with Examples

Test the same scenario with multiple data sets:

```gherkin
Scenario Outline: Validate email format on registration
  Given I am on the registration page
  When I enter email "<email>" and submit
  Then I should see "<result>"

  Examples:
    | email               | result                     |
    | valid@example.com   | Registration successful    |
    | invalid             | Please enter a valid email |
    | missing@            | Please enter a valid email |
    | @missing.com        | Please enter a valid email |
```

### Data Tables

Pass structured data to steps:

```gherkin
Scenario: Bulk tag photos
  Given I am logged in as admin
  When I tag the following photos:
    | photo_id | tag        |
    | 1        | landscape  |
    | 2        | portrait   |
    | 3        | landscape  |
  Then all 3 photos should have their tags saved
```

---

## IKP-Labs Domain Patterns

### Authentication

```gherkin
Scenario: Successful login
  Given a user with email "user@test.com" and password "secure123"
  When the user submits the login form
  Then the user should be authenticated
  And session token should be created
  And user should be redirected to the gallery

Scenario: Rejected login with wrong password
  Given a user with email "user@test.com"
  When the user submits an incorrect password
  Then authentication should fail
  And error message "Invalid credentials" should display
  And no session token should be created

Scenario: Redirect unauthenticated user
  Given the user is not logged in
  When the user attempts to access "/gallery"
  Then the user should be redirected to "/login"
```

### Photo Gallery (CRUD)

```gherkin
Scenario: Upload new photo
  Given I am authenticated as a registered user
  When I upload a photo with title "Sunset" and valid JPEG file
  Then photo should be saved to the gallery
  And photo should have status "published"
  And I should see success message "Photo uploaded"

Scenario: Delete photo
  Given I am authenticated as the photo owner
  And photo "Sunset" exists with id 42
  When I delete photo 42
  Then photo 42 should not exist in the database
  And I should be redirected to the gallery
```

### API Responses (Playwright API tests)

```gherkin
Scenario: GET photo by ID
  Given photo with id 42 exists in database
  When client sends GET request to "/api/photos/42"
  Then response status should be 200
  And response body should contain photo id, title, and url

Scenario: POST create photo
  Given client is authenticated
  When client sends POST request to "/api/photos" with valid photo data
  Then response status should be 201
  And response should contain the new photo id
  And photo should exist in database
```

---

## Best Practices

### DO

- Use business language, not technical jargon
- Write from the user's perspective
- Focus on WHAT (behavior), not HOW (implementation)
- Keep scenarios independent — each must run in isolation
- Make scenarios atomic — one behavior per scenario
- Use concrete examples, not abstract concepts

### DON'T

- Mix UI details with business logic
- Create dependencies between scenarios
- Include implementation details (SQL, CSS selectors, internal state)
- Use ambiguous language ("quickly", "properly", "correctly")
- Combine multiple behaviors in one scenario

**Example:**

```gherkin
# ✅ Good — business language, observable behavior
Scenario: Purchase photo print with sufficient credits
  Given user has 100 credits in their account
  When user purchases a photo print for 30 credits
  Then user balance should be 70 credits
  And purchase should be confirmed with order ID

# ❌ Bad — technical details, implementation-focused
Scenario: Click buy button and update database
  Given database table "accounts" has balance column = 100
  When user clicks button with id "btn-purchase"
  Then database balance column should equal 70
```

### Declarative over Imperative

```gherkin
# ✅ Declarative — describes WHAT
Scenario: User registration
  When I register with name "Alice", email "alice@example.com", and password "secure123"
  Then registration should succeed
  And I should receive a welcome email

# ❌ Imperative — describes HOW
Scenario: User registration
  When I click "Sign Up"
  And I fill in "Name" with "Alice"
  And I fill in "Email" with "alice@example.com"
  And I fill in "Password" with "secure123"
  And I click "Register"
  Then I should see "Registration successful"
```

---

## Integration with IKP-Labs Plans

### Plan Acceptance Criteria Format

In `plans/*/checklist.md`, acceptance criteria use condensed Gherkin:

```gherkin
Scenario: Phase 2a complete
  Given repo-harness-compatibility-checker agent is required
  When Phase 2a implementation is complete
  Then .claude/agents/repo-harness-compatibility-checker.md should exist
  And frontmatter should have valid model, color, and permission.skill fields
  And all permission.skill values should reference existing skill directories
```

### Feature File Format (specs/)

Full Gherkin in `specs/<domain>/<feature>.feature`:

```gherkin
Feature: Photo Upload

  Background:
    Given I am logged in as a registered user

  Scenario: Upload valid photo
    When I upload a valid JPEG file under 5MB with title "My Photo"
    Then the photo should appear in my gallery
    And I should see success message "Photo uploaded"

  Scenario: Reject invalid file type
    When I attempt to upload a PDF file
    Then the upload should be rejected
    And I should see error "Only image files are allowed"
```

---

## Common Mistakes

### Too many steps per scenario

Break long scenarios into multiple focused ones or use Background for shared setup.

### Asserting internal implementation

```gherkin
# ❌ Internal state
Then "sessions" table should have new row with user_id = 42

# ✅ Observable behavior
Then user should be logged in with an active session
```

### Ambiguous language

```gherkin
# ❌ Ambiguous
Then the system should respond quickly

# ✅ Specific
Then the response should be received within 200ms
```

### Multiple behaviors in one scenario

```gherkin
# ❌ Mixed behaviors
Scenario: User and photo management
  Given I create user "Alice"
  Then user "Alice" should exist
  And I create photo "Sunset"
  Then photo "Sunset" should exist

# ✅ Separate scenarios
Scenario: Create new user
  When I register user "Alice"
  Then user "Alice" should exist

Scenario: Upload new photo
  When I upload photo "Sunset"
  Then photo "Sunset" should appear in gallery
```

---

## Reference

**Specs location:** `specs/` — canonical home for `.feature` files
**Playwright tests:** `apps/kameravue-fe-e2e/` (FE), `apps/kameravue-be-e2e/` (API)

**Related Skills:**

- `plan-creating-project-plans` — 4-document plan system
- `repo-applying-maker-checker-fixer` — MCF validation workflow
- `test-playwright-patterns` — Playwright test patterns aligned with specs

**Related Agents:**

- `plan-maker` — creates plans with Gherkin acceptance criteria
- `plan-checker` — validates acceptance criteria format
- `gherkin-spec-writer` — writes feature files in `specs/`

**External References:**

- [Official Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
- [Writing Better Gherkin](https://cucumber.io/docs/bdd/better-gherkin/)

---

**Last Updated:** June 2026
