Feature: User Registration
  As a new user
  I want to register an account
  So that I can access the application

  Background:
    Given I am on the registration page

  Scenario: Successful user registration with valid data
    When I fill in the name field with "John Doe"
    And I fill in the email field with "john.doe@example.com"
    And I fill in the password field with "SecurePass123"
    And I fill in the confirm password field with "SecurePass123"
    And I click the "Create Account" button
    Then I should see a success message

  Scenario: Registration fails with empty required fields
    When I click the "Create Account" button
    Then I should see validation errors for empty fields
    And I should see "Name must be at least 2 characters long"
    And I should see "Please enter a valid email address"
    And I should see "Password must be at least 8 characters long"

  Scenario: Registration fails with invalid email format
    When I fill in the name field with "John Doe"
    And I fill in the email field with "invalid-email"
    And I fill in the password field with "SecurePass123"
    And I fill in the confirm password field with "SecurePass123"
    And I click the "Create Account" button
    Then I should see "Please enter a valid email address"

  Scenario: Registration fails with short password
    When I fill in the name field with "John Doe"
    And I fill in the email field with "john.doe@example.com"
    And I fill in the password field with "123"
    And I fill in the confirm password field with "123"
    And I click the "Create Account" button
    Then I should see "Password must be at least 8 characters long"

  Scenario: Registration fails when passwords don't match
    When I fill in the name field with "John Doe"
    And I fill in the email field with "john.doe@example.com"
    And I fill in the password field with "SecurePass123"
    And I fill in the confirm password field with "DifferentPass456"
    And I click the "Create Account" button
    Then I should see "Passwords don't match"

  Scenario: Clicking Google Sign-up button
    When I click the "Sign up with Google" button
    Then the Google signup handler should be called

  Scenario: Form fields clear errors when user starts typing
    When I click the "Create Account" button
    Then I should see validation errors for empty fields
    When I start typing in the name field
    Then the name field error should disappear

  Scenario: Form is responsive on mobile devices
    Given I am using a mobile device
    When I view the registration page
    Then the hero section should be hidden
    And the form should take full width

  Scenario: Form validation provides visual feedback
    When I click the "Create Account" button
    Then form fields with errors should have red borders
    When I fill in the name field with "John"
    Then the name field should have normal border styling