Feature: Protected Home Page Access
  As a user of the application
  I want to access my protected home page after authentication
  So that I can view my personalized information

  Background:
    Given the backend server is running at http://localhost:8081
    And the frontend server is running at http://localhost:3001

  # Aligns with: tests/e2e/auth-flow.spec.ts - Test 1
  Scenario: New user registers and is redirected to home page
    Given I am on the registration page at /register
    And I do not have a JWT token in localStorage
    When I submit valid registration data
    Then I should receive a JWT token from the backend
    And the token should be saved to localStorage with key "authToken"
    And I should be redirected to /home
    And I should see "Welcome, [My Full Name]!" on the page
    And I should see my email address displayed
    And I should see a logout button

  # Aligns with: tests/e2e/auth-flow.spec.ts - Test 2
  Scenario: Existing user logs in and is redirected to home page
    Given I am on the login page at /login
    And I have a registered account
    And I do not have a JWT token in localStorage
    When I submit valid login credentials
    Then I should receive a JWT token from the backend
    And the token should be saved to localStorage
    And I should be redirected to /home
    And I should see a welcome message with my name

  # Aligns with: tests/e2e/auth-flow.spec.ts - Test 3
  Scenario: Authenticated user views home page information
    Given I am logged in with a valid JWT token
    When I navigate to /home
    Then I should see the home page
    And I should see "Welcome, [My Full Name]!"
    And I should see my email address from the JWT token
    And I should see my full name from the JWT token
    And I should see a logout button
    And I should NOT be redirected

  # Aligns with: tests/e2e/auth-flow.spec.ts - Test 4
  Scenario: User logs out successfully
    Given I am logged in and on the /home page
    And I have a valid JWT token in localStorage
    When I click the logout button
    Then the JWT token should be removed from localStorage
    And I should be redirected to /login
    And I should see the login page
    And I should NOT be able to access /home without logging in again

  # Aligns with: tests/e2e/auth-flow.spec.ts - Test 5
  Scenario: Unauthenticated user cannot access home page
    Given I am not logged in
    And I do NOT have a JWT token in localStorage
    When I try to navigate to /home directly
    Then I should be redirected to /login
    And I should NOT see the home page content
    And I should see the login form

  # Aligns with: tests/e2e/auth-flow.spec.ts - Test 6
  Scenario: Authenticated user accessing login page is redirected to home
    Given I am logged in with a valid JWT token
    When I try to navigate to /login
    Then I should be redirected to /home
    And I should NOT see the login page
    And I should see the home page content

  # Aligns with: tests/e2e/auth-flow.spec.ts - Test 7
  Scenario: Authenticated user accessing register page is redirected to home
    Given I am logged in with a valid JWT token
    When I try to navigate to /register
    Then I should be redirected to /home
    And I should NOT see the registration page
    And I should see the home page content

  # Aligns with: tests/e2e/auth-flow.spec.ts - Test 8
  Scenario: Authentication persists across page refresh
    Given I am logged in and on the /home page
    And I have a valid JWT token in localStorage
    When I refresh the browser page
    Then I should still see the /home page
    And I should still see my user information
    And the JWT token should still be in localStorage
    And I should NOT be logged out

  Scenario: Expired token redirects to login
    Given I am on the /home page
    And I have an expired JWT token in localStorage
    When the page loads
    Then I should be redirected to /login
    And the expired token should be handled gracefully
