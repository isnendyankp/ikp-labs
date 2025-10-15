# Gherkin Specifications

This directory contains Gherkin feature files that describe the behavior of the Registration Form application from a user's perspective.

## Purpose

These specifications serve as **living documentation** that:

- Describe user scenarios in plain language
- Align with automated Playwright E2E tests
- Provide clear acceptance criteria for features
- Enable collaboration between technical and non-technical stakeholders

## Directory Structure

```
specs/
├── authentication/
│   ├── registration.feature  # User registration scenarios
│   └── login.feature          # User login scenarios
└── README.md                  # This file
```

## Gherkin Format

All specifications follow the **Gherkin syntax**:

- **Feature**: High-level description of functionality
- **Background**: Common preconditions for all scenarios
- **Scenario**: Individual test case
- **Given/When/Then**: Steps that describe behavior

### Example

```gherkin
Feature: User Registration
  As a new user
  I want to register for an account
  So that I can access the application

  Scenario: Successful registration
    Given the user is on the registration page
    When the user submits valid registration data
    Then the user should be registered successfully
```

## Alignment with Playwright Tests

Each Gherkin scenario aligns with existing Playwright E2E tests:

| Feature File               | Playwright Test File           | Description              |
| -------------------------- | ------------------------------ | ------------------------ |
| `authentication/registration.feature` | `tests/e2e/registration.spec.ts` | Registration flow tests |
| `authentication/login.feature`        | `tests/e2e/login.spec.ts`        | Login flow tests        |

## Writing Guidelines

### The 1-1-1 Rule

Each scenario must have:

- **1 Given** (precondition)
- **1 When** (action)
- **1 Then** (expected result)

### Focus on User Behavior

Write scenarios from the **user's perspective**, not technical implementation:

✅ **Good**: "When the user submits the registration form"
❌ **Bad**: "When POST request is sent to /api/auth/register"

### Use Business Language

Avoid technical jargon and implementation details:

✅ **Good**: "the user should see an error message"
❌ **Bad**: "the API should return HTTP 400 status code"

## How to Use

### Reading Specifications

1. Browse feature files to understand application behavior
2. Read scenarios to see specific use cases
3. Check examples in Scenario Outlines for data variations

### Creating New Specifications

Use the `gherkin-spec-writer` agent to create or update specs:

```bash
# In Claude Code
"Create Gherkin specifications for password reset feature"
```

The agent will:

- Follow the 1-1-1 rule
- Align with existing tests
- Use proper Gherkin syntax
- Place files in correct directory

### Updating Existing Specifications

When application behavior changes:

1. Update the corresponding feature file
2. Ensure alignment with updated Playwright tests
3. Maintain the 1-1-1 rule

## Testing with MCP Playwright

These specifications complement Playwright testing:

1. **Specs** describe **what** behavior is expected
2. **Playwright tests** verify **that** behavior works
3. **MCP Playwright** allows interactive browser testing

### Example Workflow

1. Read specification: `specs/authentication/registration.feature`
2. Run automated test: `npx playwright test tests/e2e/registration.spec.ts`
3. Debug with MCP: Use Claude to run interactive browser tests

## Related Documentation

- [Playwright E2E Tests](../tests/README.md) - Automated testing documentation
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/) - Official Gherkin syntax
- [BDD Best Practices](https://cucumber.io/docs/bdd/) - Behavior-Driven Development guide

## Contributing

When adding new features:

1. Write Gherkin specification first (spec-driven development)
2. Create or update Playwright tests to match
3. Implement the feature
4. Verify tests pass

This ensures features are well-documented and testable from the start.
