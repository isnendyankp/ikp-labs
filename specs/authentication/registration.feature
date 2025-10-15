Feature: User Registration
  As a new user
  I want to register for an account
  So that I can access the application

  Background:
    Given the user is on the registration page

  # Aligns with: tests/e2e/registration.spec.ts - Test 1
  Scenario: Successful registration with valid credentials
    When the user submits valid registration data
    Then the user should be registered successfully with a JWT token

  # Aligns with: tests/e2e/registration.spec.ts - Test 2
  Scenario: Registration rejected for duplicate email
    Given a user already exists with the email
    When the user attempts to register with the same email
    Then the registration should be rejected with duplicate email error

  # Aligns with: tests/e2e/registration.spec.ts - Test 4
  Scenario: Registration form validates required fields
    When the user submits the registration form with empty fields
    Then the form should display required field validation errors

  # Aligns with: tests/e2e/registration.spec.ts - Test 5
  Scenario Outline: Registration validates email format
    When the user submits registration data with email "<email>"
    Then the form should display email format validation error

    Examples:
      | email             |
      | invalid-email     |
      | user@             |
      | @example.com      |
      | missing.domain    |

  # Aligns with: tests/e2e/registration.spec.ts - Test 7
  Scenario: Registration displays loading state during submission
    When the user submits valid registration data
    Then a loading indicator should be displayed during submission

  # Aligns with: tests/e2e/registration.spec.ts - Test 8
  Scenario: Registration API requests work without CORS errors
    When the user submits the registration form
    Then no CORS errors should appear in the browser console
