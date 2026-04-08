Feature: User Login
  As a registered user
  I want to login to my account
  So that I can access the application

  Background:
    Given I am on the login page

  Scenario: Successful user login with valid credentials
    When I fill in the email field with "john.doe@example.com"
    And I fill in the password field with "SecurePass123"
    And I click the "Sign In" button
    Then I should see a login success message

  Scenario: Login fails with empty required fields
    When I click the "Sign In" button
    Then I should see validation errors for empty login fields
    And I should see "Please enter a valid email address"
    And I should see "Password must be at least 8 characters long"

  Scenario: Login fails with invalid email format
    When I fill in the email field with "invalid-email"
    And I fill in the password field with "SecurePass123"
    And I click the "Sign In" button
    Then I should see "Please enter a valid email address"

  Scenario: Login fails with short password
    When I fill in the email field with "john.doe@example.com"
    And I fill in the password field with "123"
    And I click the "Sign In" button
    Then I should see "Password must be at least 8 characters long"

  Scenario: Remember me checkbox functionality
    When I fill in the email field with "john.doe@example.com"
    And I fill in the password field with "SecurePass123"
    And I check the "Remember me" checkbox
    And I click the "Sign In" button
    Then I should see a login success message
    And the remember me checkbox should be checked

  Scenario: Clicking Google Sign-in button
    When I click the "Sign in with Google" button
    Then the Google signin handler should be called

  Scenario: Password visibility toggle functionality
    When I fill in the password field with "mypassword"
    Then the password should be hidden by default
    When I click the password visibility toggle button
    Then the password should be visible
    When I click the password visibility toggle button again
    Then the password should be hidden again

  Scenario: Form fields clear errors when user starts typing
    When I click the "Sign In" button
    Then I should see validation errors for empty login fields
    When I start typing in the email field
    Then the email field error should disappear

  Scenario: Navigation to registration page
    When I click the "Sign up" link
    Then I should be redirected to the registration page

  Scenario: Form is responsive on mobile devices
    Given I am using a mobile device
    When I view the login page
    Then the hero section should be hidden
    And the form should take full width

  Scenario: Form validation provides visual feedback
    When I click the "Sign In" button
    Then form fields with errors should have red borders
    When I fill in the email field with "test@example.com"
    Then the email field should have normal border styling

  Scenario: Forgot password link functionality
    Then I should see the "Forgot your password?" link
    When I click the "Forgot your password?" link
    Then the forgot password handler should be called