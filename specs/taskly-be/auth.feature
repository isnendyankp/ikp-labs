Feature: Taskly authentication
  As a user of the Taskly API
  I want to register, log in, and access my profile
  So that my data is protected and I can prove my identity

  Background:
    Given the Taskly API is running on http://localhost:8082

  Scenario: Successful user registration
    Given no account exists for "newuser@example.com"
    When I POST to /api/auth/register with email "newuser@example.com" and password "securepass123"
    Then the response status is 201
    And the response body contains "id" and "email"

  Scenario: Duplicate email is rejected
    Given an account exists for "existing@example.com"
    When I POST to /api/auth/register with email "existing@example.com" and password "securepass123"
    Then the response status is 409
    And the response body contains error "email already registered"

  Scenario: Password too short is rejected
    Given no account exists for "shortpass@example.com"
    When I POST to /api/auth/register with email "shortpass@example.com" and password "short"
    Then the response status is 400
    And the response body contains error "password must be at least 8 characters"

  Scenario: Successful login
    Given an account exists for "alice@example.com" with password "alicepass1"
    When I POST to /api/auth/login with email "alice@example.com" and password "alicepass1"
    Then the response status is 200
    And the response body contains a "token" field

  Scenario: Login with wrong password
    Given an account exists for "alice@example.com" with password "alicepass1"
    When I POST to /api/auth/login with email "alice@example.com" and password "wrongpassword"
    Then the response status is 401
    And the response body contains error "invalid credentials"

  Scenario: Login with unknown email
    Given no account exists for "ghost@example.com"
    When I POST to /api/auth/login with email "ghost@example.com" and password "anypassword"
    Then the response status is 401
    And the response body contains error "invalid credentials"

  Scenario: Access protected profile with valid token
    Given I am logged in as "alice@example.com"
    When I GET /api/me with a valid Authorization header
    Then the response status is 200
    And the response body contains "id" and "email"

  Scenario: Access protected profile without a token
    Given I am not authenticated
    When I GET /api/me without an Authorization header
    Then the response status is 401
    And the response body contains error "authorization header required"

  Scenario: Access protected profile with an invalid token
    Given I am not authenticated
    When I GET /api/me with an Authorization header containing "Bearer invalid.token.here"
    Then the response status is 401
    And the response body contains error "invalid token"
