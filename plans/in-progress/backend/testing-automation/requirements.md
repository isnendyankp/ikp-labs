# Requirements - Backend Testing Automation

## Scope Definition

### What IS Included

#### 1. Unit Tests (Service Layer)

- **AuthService Tests**
  - Test login method with valid credentials
  - Test login method with invalid email
  - Test login method with invalid password
  - Test register method with valid data
  - Test register method with duplicate email
  - Test validateToken method
  - Test getUserFromToken method
  - Test refreshToken method

- **UserService Tests**
  - Test getAllUsers method
  - Test getUserById method with valid ID
  - Test getUserById method with non-existent ID
  - Test updateUser method with valid data
  - Test updateUser method with non-existent user
  - Test updateUser method with duplicate email
  - Test deleteUser method

#### 2. Repository Tests

- **UserRepository Tests**
  - Test findByEmail with existing email
  - Test findByEmail with non-existent email
  - Test existsByEmail method
  - Test save new user
  - Test update existing user
  - Test delete user
  - Test custom query methods

#### 3. Security Component Tests

- **JwtUtil Tests**
  - Test generateToken method
  - Test extractEmail method
  - Test extractExpiration method
  - Test validateToken with valid token
  - Test validateToken with expired token
  - Test validateToken with invalid signature
  - Test isTokenExpired method
  - Test refreshToken method
  - Test getFullNameFromToken method

- **PasswordValidator Tests**
  - Test valid password scenarios
  - Test password too short
  - Test password without uppercase
  - Test password without lowercase
  - Test password without digit
  - Test password without special character

#### 4. Integration Tests (Controller + Service + Repository)

- **AuthController Integration Tests**
  - Test POST /api/auth/register with valid data
  - Test POST /api/auth/register with duplicate email
  - Test POST /api/auth/register with invalid data
  - Test POST /api/auth/login with valid credentials
  - Test POST /api/auth/login with invalid email
  - Test POST /api/auth/login with invalid password
  - Test POST /api/auth/refresh with valid token
  - Test POST /api/auth/refresh with invalid token
  - Test POST /api/auth/validate with valid token
  - Test POST /api/auth/validate with invalid token
  - Test GET /api/auth/health endpoint

- **UserProfileController Integration Tests**
  - Test GET /api/users/profile with valid token
  - Test GET /api/users/profile without token
  - Test GET /api/users/profile with invalid token
  - Test PUT /api/users/profile with valid data
  - Test PUT /api/users/profile with invalid data

- **UserController Integration Tests**
  - Test GET /api/users with admin authentication
  - Test GET /api/users/{id} with valid ID
  - Test PUT /api/users/{id} with valid data
  - Test DELETE /api/users/{id}

#### 5. API Tests (REST Assured)

- **Authentication API Tests**
  - Full registration flow validation
  - Full login flow validation
  - Token refresh flow validation
  - Token validation flow
  - HTTP status code verification
  - Response JSON structure validation
  - Error response format validation

- **User Management API Tests**
  - User profile retrieval
  - User profile update
  - User list retrieval
  - User deletion
  - Authorization header validation
  - CORS configuration validation

#### 6. Validation Tests

- **DTO Validation Tests**
  - LoginRequest validation (email format, required fields)
  - UserRegistrationRequest validation (email, password, fullName)
  - UserUpdateRequest validation
  - Custom password validator tests
  - Bean validation annotations tests

#### 7. Test Infrastructure

- **Test Configuration**
  - application-test.properties for test database
  - Testcontainers PostgreSQL configuration
  - H2 in-memory database configuration
  - Test security configuration
  - Mock data fixtures and builders

- **Test Utilities**
  - JWT token generator for tests
  - Test data builders (UserBuilder, LoginRequestBuilder)
  - Custom assertions and matchers
  - Test base classes

#### 8. Code Coverage & Reporting

- **JaCoCo Configuration**
  - Overall code coverage target: 80%+
  - Package-level coverage thresholds
  - Exclude configuration classes from coverage
  - HTML and XML coverage reports

- **Surefire Configuration**
  - Unit test execution
  - Integration test execution (separate profile)
  - Test result reports
  - Parallel test execution configuration

#### 9. CI/CD Integration

- **Maven Test Profiles**
  - Profile for unit tests only
  - Profile for integration tests only
  - Profile for all tests
  - Profile for coverage reporting

- **Test Automation Scripts**
  - Script to run all tests
  - Script to run tests with coverage
  - Script to generate coverage reports
  - Script for CI/CD pipeline integration

### What is NOT Included

#### 1. Performance Testing
- Load testing with Apache JMeter or Gatling
- Stress testing to determine system limits
- Endurance testing for long-running scenarios
- Spike testing for sudden traffic increases
- Volume testing with large datasets

#### 2. Security Testing
- Penetration testing
- Vulnerability scanning
- SQL injection testing
- XSS attack testing
- Security audit automation
- OWASP dependency checks

#### 3. UI/E2E Testing
- Frontend component testing (already covered by Playwright)
- Browser automation tests (already covered)
- Visual regression testing
- Accessibility testing
- Cross-browser testing

#### 4. Advanced Test Scenarios
- Multi-threaded concurrent user tests
- Database transaction rollback scenarios
- Network failure simulation
- Cache invalidation testing
- Distributed transaction testing

#### 5. Test Data Management
- Large-scale test data generators
- Database seeding tools
- Test data anonymization
- Production data cloning for testing
- Test data versioning

#### 6. Monitoring & Observability
- Application performance monitoring during tests
- Log aggregation and analysis
- Metrics collection during test execution
- Distributed tracing for test scenarios
- Real-time test execution dashboards

#### 7. Documentation
- Test strategy document (separate from plan)
- Test case documentation beyond code
- Manual test procedures
- Test execution guides for QA team
- Bug reporting templates

#### 8. Third-Party Integrations Testing
- Email service integration tests (if email sending is added)
- External API mocking and testing
- Payment gateway testing
- SMS service testing
- Cloud service integration tests

## User Stories

### User Story 1: Developer Writing Unit Tests

**As a** backend developer
**I want** comprehensive unit tests for service layer
**So that** I can refactor code confidently without breaking functionality

**Acceptance Criteria:**

**Scenario 1: Testing successful login**
```gherkin
Given a user exists in the database with email "test@example.com"
When the developer runs AuthServiceTest.testLoginWithValidCredentials()
Then the test should pass with a valid JWT token returned
```

**Scenario 2: Testing failed login**
```gherkin
Given no user exists with email "nonexistent@example.com"
When the developer runs AuthServiceTest.testLoginWithInvalidEmail()
Then the test should pass with an error message "Invalid email or password"
```

**Scenario 3: Testing password validation**
```gherkin
Given a password "weak"
When the developer runs PasswordValidatorTest.testPasswordTooShort()
Then the test should pass with validation error
```

### User Story 2: Developer Running Integration Tests

**As a** backend developer
**I want** integration tests that use real database
**So that** I can verify that all layers work together correctly

**Acceptance Criteria:**

**Scenario 1: Testing registration endpoint with real database**
```gherkin
Given a Testcontainers PostgreSQL database is running
When the developer runs POST /api/auth/register integration test
Then the user should be saved to the database
And a valid JWT token should be returned
And the test should clean up the database after execution
```

**Scenario 2: Testing authentication flow**
```gherkin
Given a user is registered via the API
When the developer tests the login endpoint
Then the JWT token should authenticate successfully
And the token should grant access to protected endpoints
```

### User Story 3: Developer Checking Code Coverage

**As a** backend developer
**I want** code coverage reports with JaCoCo
**So that** I can identify untested code and improve test coverage

**Acceptance Criteria:**

**Scenario 1: Generating coverage report**
```gherkin
Given all tests are written and passing
When the developer runs `mvn clean test jacoco:report`
Then a coverage report should be generated in target/site/jacoco/
And the overall coverage should be at least 80%
```

**Scenario 2: Failing build on low coverage**
```gherkin
Given code coverage is below 80%
When the developer runs `mvn verify`
Then the build should fail with coverage threshold error
And a detailed coverage report should show which packages are under-covered
```

### User Story 4: CI/CD Pipeline Running Tests

**As a** DevOps engineer
**I want** automated tests in CI/CD pipeline
**So that** code quality is verified before deployment

**Acceptance Criteria:**

**Scenario 1: Running tests in CI**
```gherkin
Given a developer pushes code to the repository
When the CI pipeline runs
Then unit tests should execute first
And integration tests should execute with Testcontainers
And code coverage should be measured
And the pipeline should fail if tests fail or coverage is too low
```

**Scenario 2: Generating test reports**
```gherkin
Given all tests have completed
When the CI pipeline finishes
Then Surefire test reports should be published
And JaCoCo coverage reports should be available
And test results should be visible in the CI dashboard
```

### User Story 5: QA Engineer Validating API

**As a** QA engineer
**I want** REST Assured API tests
**So that** I can validate API contracts and responses

**Acceptance Criteria:**

**Scenario 1: Validating registration API**
```gherkin
Given the backend server is running
When the QA engineer runs REST Assured registration test
Then the API should return 201 Created status
And the response should contain a valid JWT token
And the response JSON should match the expected schema
```

**Scenario 2: Validating error responses**
```gherkin
Given a registration request with duplicate email
When the REST Assured test executes
Then the API should return 400 Bad Request status
And the error response should have the expected format
And the error message should be "Email already exists"
```

## Success Criteria

### Functional Success Criteria

1. **Test Coverage**
   - Overall code coverage: 80%+
   - Service layer coverage: 90%+
   - Controller layer coverage: 85%+
   - Repository layer coverage: 75%+
   - Security components coverage: 90%+

2. **Test Execution**
   - All unit tests pass consistently
   - All integration tests pass with Testcontainers
   - All API tests pass against running server
   - Tests complete in under 5 minutes total
   - No flaky tests (tests pass 100% of the time)

3. **Test Quality**
   - Each test follows AAA pattern (Arrange-Act-Assert)
   - Tests are isolated and independent
   - Tests use meaningful names describing behavior
   - Tests validate both positive and negative scenarios
   - Tests include edge cases

### Technical Success Criteria

1. **Test Infrastructure**
   - Testcontainers PostgreSQL successfully starts and stops
   - H2 in-memory database works for fast unit tests
   - Test data builders provide clean test data
   - Mock objects properly stub dependencies
   - Test utilities reduce code duplication

2. **Build Configuration**
   - Maven Surefire plugin runs unit tests
   - Maven Failsafe plugin runs integration tests
   - JaCoCo plugin generates coverage reports
   - Separate test profiles work correctly
   - Build fails on test failures or low coverage

3. **Reporting**
   - HTML coverage reports are human-readable
   - XML coverage reports integrate with CI tools
   - Test execution reports show pass/fail details
   - Coverage reports identify uncovered lines
   - Reports are generated automatically on build

### Process Success Criteria

1. **Developer Experience**
   - Tests run from IDE (IntelliJ IDEA, VS Code)
   - Tests run from command line with Maven
   - Test results are easy to understand
   - Test failures provide clear error messages
   - Adding new tests follows consistent patterns

2. **CI/CD Integration**
   - Tests run automatically on pull requests
   - Test results block merging if failing
   - Coverage reports are published to PR
   - Test execution time is acceptable for CI
   - Flaky tests are identified and fixed

3. **Maintainability**
   - Test code follows same standards as production code
   - Tests are easy to update when requirements change
   - Test utilities reduce boilerplate
   - Test documentation is clear
   - Test patterns are consistent across codebase

## Validation Methods

### How to Verify Scope is Complete

1. **Run all tests:**
   ```bash
   cd backend/registration-form-api
   mvn clean test
   ```

2. **Run integration tests:**
   ```bash
   mvn clean verify -P integration-tests
   ```

3. **Generate coverage report:**
   ```bash
   mvn clean test jacoco:report
   open target/site/jacoco/index.html
   ```

4. **Verify coverage thresholds:**
   ```bash
   mvn clean verify
   # Should pass with 80%+ coverage
   ```

5. **Run API tests:**
   ```bash
   # Start backend server first
   mvn spring-boot:run

   # In another terminal
   mvn clean test -P api-tests
   ```

6. **Check test reports:**
   ```bash
   ls -la target/surefire-reports/
   ls -la target/site/jacoco/
   ```

### Validation Checklist

- [ ] All service methods have unit tests
- [ ] All repository methods have tests
- [ ] All controller endpoints have integration tests
- [ ] All API endpoints have REST Assured tests
- [ ] JaCoCo coverage report shows 80%+ overall
- [ ] All tests pass without failures
- [ ] Tests run in under 5 minutes
- [ ] Testcontainers starts and stops correctly
- [ ] Test utilities and builders work
- [ ] Maven profiles work correctly
- [ ] CI/CD pipeline can run tests
- [ ] Coverage reports are generated
