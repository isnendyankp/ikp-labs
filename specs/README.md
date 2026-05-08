# Gherkin Specifications

Centralized Gherkin feature files (source of truth) for IKP-Labs test scenarios.

## Structure

```text
specs/
├── authentication/     # Login, registration, auth flows
├── gallery/           # Photo upload, management, likes, privacy, sorting
└── profile/           # User profile features
```

## Feature Files

### Authentication

- `login.feature` - User login scenarios (77 lines, 13 scenarios)
- `registration.feature` - User registration scenarios (67 lines, 11 scenarios)
- `home-page.feature` - Home page navigation and display

### Gallery

- `photo-upload.feature` - Photo upload functionality
- `photo-management.feature` - Photo CRUD operations
- `photo-likes.feature` - Photo likes feature
- `photo-privacy.feature` - Photo privacy settings
- `photo-sorting.feature` - Photo sorting and filtering (325 lines)

### Profile

- `profile-picture.feature` - Profile picture upload and management

## Usage

These Gherkin specs are imported by test implementations:

- **Frontend E2E** (future): `apps/kameravue-fe-e2e/steps/` - Step definitions for browser tests
- **Backend E2E** (future): `apps/kameravue-be-e2e/` - API contract tests
- **Current**: `tests/gherkin/steps/` - Existing step definitions

## Principles

1. **Single Source of Truth**: All feature files live here, not in test folders
2. **Domain Organization**: Organized by business domain (auth, gallery, profile)
3. **Reusable**: Same specs can be used by multiple test implementations
4. **Separation of Concerns**: Specs (what to test) separate from implementation (how to test)

## Gherkin Syntax

```gherkin
Feature: User Login
  As a user
  I want to log in to the application
  So that I can access my personalized dashboard

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I fill in the email field with "john.doe@example.com"
    And I fill in the password field with "SecurePass123"
    And I click the "Sign In" button
    Then I should see a login success message
```

## Related Documentation

- [Gherkin Testing Guide](../tests/gherkin/README.md) - How to write and run Gherkin tests
- [E2E Testing](../tests/e2e/) - End-to-end test implementation
- [API Testing](../tests/api/) - API contract test implementation

---

**Last Updated**: April 8, 2026
**Total Feature Files**: 11
**Total Scenarios**: 100+
