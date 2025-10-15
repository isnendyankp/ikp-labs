Feature: User Login
  As a registered user
  I want to login to my account
  So that I can access my personalized dashboard

  Background:
    Given the user is on the login page

  # Aligns with: tests/e2e/login.spec.ts - Test Case 1
  Scenario: Successful login with valid credentials
    Given the user has valid credentials
    When the user submits the login form
    Then the user should be logged in with a JWT token

  # Aligns with: tests/e2e/login.spec.ts - Test Case 2
  Scenario: Login rejected for invalid password
    Given the user has a registered account
    When the user submits login form with incorrect password
    Then the login should be rejected with invalid credentials error

  # Aligns with: tests/e2e/login.spec.ts - Test Case 3
  Scenario: Login rejected for non-existent email
    When the user submits login form with non-existent email
    Then the login should be rejected with invalid credentials error

  # Aligns with: tests/e2e/login.spec.ts - Test Case 10
  Scenario: Login API requests work without CORS errors
    When the user submits the login form
    Then no CORS errors should appear in the browser console
