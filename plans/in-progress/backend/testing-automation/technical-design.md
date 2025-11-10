# Technical Design - Backend Testing Automation

## Architecture Overview

### Testing Pyramid

```
                    /\
                   /  \
                  / E2E \          (Playwright - already exists)
                 /______\
                /        \
               /   API    \        (REST Assured)
              /____________\
             /              \
            /  Integration   \     (MockMvc + Testcontainers)
           /__________________\
          /                    \
         /     Unit Tests       \  (JUnit 5 + Mockito)
        /________________________\
```

### Test Layer Responsibilities

```
┌─────────────────────────────────────────────────────────────┐
│                     E2E Tests (Playwright)                   │
│  - Full user flows (registration, login, profile update)    │
│  - Browser automation                                        │
│  - Frontend + Backend integration                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    API Tests (REST Assured)                  │
│  - HTTP request/response validation                         │
│  - JSON schema validation                                   │
│  - Status code verification                                 │
│  - API contract testing                                     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│           Integration Tests (MockMvc + Testcontainers)      │
│  - Controller + Service + Repository together               │
│  - Real PostgreSQL database                                 │
│  - Spring Security configuration                            │
│  - Transaction management                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Unit Tests (JUnit 5 + Mockito)                 │
│  - Service layer in isolation                               │
│  - Repository with H2 in-memory                             │
│  - Security components (JwtUtil, validators)                │
│  - Fast execution, no external dependencies                 │
└─────────────────────────────────────────────────────────────┘
```

## Implementation Approach

### Phase 1: Test Infrastructure Setup

**Goal:** Set up all testing dependencies and configuration

**Steps:**
1. Update pom.xml with testing dependencies
2. Create test configuration files
3. Set up Testcontainers
4. Create base test classes
5. Create test utilities and builders

### Phase 2: Unit Tests

**Goal:** Test individual components in isolation

**Steps:**
1. Create service layer unit tests
2. Create repository tests with H2
3. Create security component tests
4. Create validation tests
5. Verify 90%+ coverage for tested components

### Phase 3: Integration Tests

**Goal:** Test components working together

**Steps:**
1. Create controller integration tests with MockMvc
2. Set up Testcontainers for PostgreSQL
3. Create database integration tests
4. Create security integration tests
5. Verify end-to-end flows work

### Phase 4: API Tests

**Goal:** Test REST API contracts

**Steps:**
1. Set up REST Assured configuration
2. Create authentication API tests
3. Create user management API tests
4. Add JSON schema validation
5. Verify all endpoints work correctly

### Phase 5: Coverage & CI/CD

**Goal:** Achieve 80%+ coverage and CI/CD integration

**Steps:**
1. Configure JaCoCo for coverage
2. Configure Surefire for test reports
3. Create Maven test profiles
4. Verify coverage thresholds
5. Create CI/CD test scripts

## Code Structure

### Directory Layout

```
backend/registration-form-api/
├── src/
│   ├── main/
│   │   ├── java/com/registrationform/api/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   ├── dto/
│   │   │   ├── security/
│   │   │   ├── validation/
│   │   │   ├── exception/
│   │   │   └── config/
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       ├── java/com/registrationform/api/
│       │   ├── unit/
│       │   │   ├── service/
│       │   │   │   ├── AuthServiceTest.java
│       │   │   │   └── UserServiceTest.java
│       │   │   ├── repository/
│       │   │   │   └── UserRepositoryTest.java
│       │   │   ├── security/
│       │   │   │   ├── JwtUtilTest.java
│       │   │   │   └── PasswordValidatorTest.java
│       │   │   └── validation/
│       │   │       └── DtoValidationTest.java
│       │   ├── integration/
│       │   │   ├── controller/
│       │   │   │   ├── AuthControllerIntegrationTest.java
│       │   │   │   ├── UserProfileControllerIntegrationTest.java
│       │   │   │   └── UserControllerIntegrationTest.java
│       │   │   ├── security/
│       │   │   │   └── SecurityConfigIntegrationTest.java
│       │   │   └── database/
│       │   │       └── DatabaseIntegrationTest.java
│       │   ├── api/
│       │   │   ├── AuthApiTest.java
│       │   │   └── UserApiTest.java
│       │   ├── config/
│       │   │   ├── TestConfig.java
│       │   │   └── TestSecurityConfig.java
│       │   └── util/
│       │       ├── TestDataBuilder.java
│       │       ├── JwtTestUtil.java
│       │       └── TestConstants.java
│       └── resources/
│           ├── application-test.properties
│           ├── application-integration.properties
│           └── json-schemas/
│               ├── login-response-schema.json
│               └── user-response-schema.json
└── pom.xml
```

### Files to Create

#### Test Configuration Files

**File:** `src/test/resources/application-test.properties`
```properties
# H2 In-Memory Database for Unit Tests
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA Configuration for H2
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false

# JWT Configuration for Tests
jwt.secret=testSecretKeyForJwtTokenGenerationInTestEnvironment123456789
jwt.expiration=3600000

# Disable Spring Boot Banner
spring.main.banner-mode=off

# Logging
logging.level.org.springframework=WARN
logging.level.com.registrationform.api=DEBUG
```

**File:** `src/test/resources/application-integration.properties`
```properties
# Testcontainers PostgreSQL (dynamically configured)
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration for PostgreSQL
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# JWT Configuration for Tests
jwt.secret=integrationTestSecretKey123456789
jwt.expiration=3600000
```

#### Test Utilities

**File:** `src/test/java/com/registrationform/api/util/TestDataBuilder.java`
```java
package com.registrationform.api.util;

import com.registrationform.api.dto.LoginRequest;
import com.registrationform.api.dto.UserRegistrationRequest;
import com.registrationform.api.dto.UserUpdateRequest;
import com.registrationform.api.entity.User;

/**
 * Builder pattern for creating test data
 */
public class TestDataBuilder {

    public static class UserBuilder {
        private String fullName = "Test User";
        private String email = "test@example.com";
        private String password = "hashedPassword";

        public UserBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public User build() {
            User user = new User();
            user.setFullName(fullName);
            user.setEmail(email);
            user.setPassword(password);
            return user;
        }
    }

    public static class LoginRequestBuilder {
        private String email = "test@example.com";
        private String password = "Test@1234";

        public LoginRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public LoginRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public LoginRequest build() {
            LoginRequest request = new LoginRequest();
            request.setEmail(email);
            request.setPassword(password);
            return request;
        }
    }

    public static class RegistrationRequestBuilder {
        private String fullName = "Test User";
        private String email = "test@example.com";
        private String password = "Test@1234";

        public RegistrationRequestBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public RegistrationRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public RegistrationRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserRegistrationRequest build() {
            UserRegistrationRequest request = new UserRegistrationRequest();
            request.setFullName(fullName);
            request.setEmail(email);
            request.setPassword(password);
            return request;
        }
    }
}
```

**File:** `src/test/java/com/registrationform/api/util/JwtTestUtil.java`
```java
package com.registrationform.api.util;

import com.registrationform.api.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * Utility for generating JWT tokens in tests
 */
@Component
public class JwtTestUtil {

    @Autowired
    private JwtUtil jwtUtil;

    public String generateValidToken() {
        return jwtUtil.generateToken("test@example.com", "Test User");
    }

    public String generateExpiredToken() {
        // Implementation to generate expired token
        return "expired.token.here";
    }

    public String generateInvalidToken() {
        return "invalid.token.signature";
    }
}
```

**File:** `src/test/java/com/registrationform/api/util/TestConstants.java`
```java
package com.registrationform.api.util;

public class TestConstants {
    // Test Users
    public static final String TEST_EMAIL = "test@example.com";
    public static final String TEST_PASSWORD = "Test@1234";
    public static final String TEST_FULL_NAME = "Test User";

    // API Endpoints
    public static final String AUTH_BASE_URL = "/api/auth";
    public static final String REGISTER_URL = AUTH_BASE_URL + "/register";
    public static final String LOGIN_URL = AUTH_BASE_URL + "/login";
    public static final String REFRESH_URL = AUTH_BASE_URL + "/refresh";
    public static final String VALIDATE_URL = AUTH_BASE_URL + "/validate";

    public static final String USERS_BASE_URL = "/api/users";
    public static final String PROFILE_URL = USERS_BASE_URL + "/profile";
}
```

#### Base Test Classes

**File:** `src/test/java/com/registrationform/api/config/TestConfig.java`
```java
package com.registrationform.api.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@TestConfiguration
public class TestConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

#### Unit Test Example

**File:** `src/test/java/com/registrationform/api/unit/service/AuthServiceTest.java`
```java
package com.registrationform.api.unit.service;

import com.registrationform.api.dto.LoginRequest;
import com.registrationform.api.dto.LoginResponse;
import com.registrationform.api.dto.UserRegistrationRequest;
import com.registrationform.api.entity.User;
import com.registrationform.api.repository.UserRepository;
import com.registrationform.api.security.JwtUtil;
import com.registrationform.api.service.AuthService;
import com.registrationform.api.util.TestDataBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthService
 *
 * Test Strategy:
 * - Mock all dependencies (UserRepository, PasswordEncoder, JwtUtil)
 * - Test each method in isolation
 * - Verify both success and failure scenarios
 * - Check method interactions with mocks
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private LoginRequest loginRequest;
    private UserRegistrationRequest registrationRequest;

    @BeforeEach
    void setUp() {
        // Arrange: Create test data
        testUser = new TestDataBuilder.UserBuilder()
                .email("test@example.com")
                .fullName("Test User")
                .password("$2a$10$hashedPassword")
                .build();

        loginRequest = new TestDataBuilder.LoginRequestBuilder()
                .email("test@example.com")
                .password("Test@1234")
                .build();

        registrationRequest = new TestDataBuilder.RegistrationRequestBuilder()
                .email("new@example.com")
                .fullName("New User")
                .password("Test@1234")
                .build();
    }

    @Test
    void testLoginWithValidCredentials_ShouldReturnSuccess() {
        // Arrange
        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("Test@1234", "$2a$10$hashedPassword"))
                .thenReturn(true);
        when(jwtUtil.generateToken("test@example.com", "Test User"))
                .thenReturn("valid.jwt.token");

        // Act
        LoginResponse response = authService.login(loginRequest);

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("valid.jwt.token", response.getToken());
        assertEquals("test@example.com", response.getEmail());

        // Verify interactions
        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, times(1)).matches(anyString(), anyString());
        verify(jwtUtil, times(1)).generateToken(anyString(), anyString());
    }

    @Test
    void testLoginWithInvalidEmail_ShouldReturnError() {
        // Arrange
        when(userRepository.findByEmail("nonexistent@example.com"))
                .thenReturn(Optional.empty());

        loginRequest.setEmail("nonexistent@example.com");

        // Act
        LoginResponse response = authService.login(loginRequest);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Invalid email or password", response.getMessage());

        // Verify that password was never checked
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generateToken(anyString(), anyString());
    }

    @Test
    void testLoginWithInvalidPassword_ShouldReturnError() {
        // Arrange
        when(userRepository.findByEmail("test@example.com"))
                .thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("WrongPassword", "$2a$10$hashedPassword"))
                .thenReturn(false);

        loginRequest.setPassword("WrongPassword");

        // Act
        LoginResponse response = authService.login(loginRequest);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Invalid email or password", response.getMessage());

        // Verify JWT was never generated
        verify(jwtUtil, never()).generateToken(anyString(), anyString());
    }

    @Test
    void testRegisterWithValidData_ShouldReturnSuccess() {
        // Arrange
        when(userRepository.findByEmail("new@example.com"))
                .thenReturn(Optional.empty());
        when(passwordEncoder.encode("Test@1234"))
                .thenReturn("$2a$10$hashedPassword");
        when(userRepository.save(any(User.class)))
                .thenReturn(testUser);
        when(jwtUtil.generateToken("test@example.com", "Test User"))
                .thenReturn("valid.jwt.token");

        // Act
        LoginResponse response = authService.register(registrationRequest);

        // Assert
        assertTrue(response.isSuccess());
        assertNotNull(response.getToken());

        // Verify user was saved
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterWithDuplicateEmail_ShouldReturnError() {
        // Arrange
        when(userRepository.findByEmail("new@example.com"))
                .thenReturn(Optional.of(testUser));

        // Act
        LoginResponse response = authService.register(registrationRequest);

        // Assert
        assertFalse(response.isSuccess());
        assertEquals("Email already exists", response.getMessage());

        // Verify user was never saved
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testValidateToken_WithValidToken_ShouldReturnTrue() {
        // Arrange
        when(jwtUtil.validateToken("valid.token", "test@example.com"))
                .thenReturn(true);

        // Act
        boolean isValid = authService.validateToken("valid.token", "test@example.com");

        // Assert
        assertTrue(isValid);
    }

    @Test
    void testValidateToken_WithInvalidToken_ShouldReturnFalse() {
        // Arrange
        when(jwtUtil.validateToken("invalid.token", "test@example.com"))
                .thenReturn(false);

        // Act
        boolean isValid = authService.validateToken("invalid.token", "test@example.com");

        // Assert
        assertFalse(isValid);
    }
}
```

#### Integration Test Example

**File:** `src/test/java/com/registrationform/api/integration/controller/AuthControllerIntegrationTest.java`
```java
package com.registrationform.api.integration.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.registrationform.api.dto.LoginRequest;
import com.registrationform.api.dto.UserRegistrationRequest;
import com.registrationform.api.repository.UserRepository;
import com.registrationform.api.util.TestDataBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

/**
 * Integration tests for AuthController
 *
 * Test Strategy:
 * - Use real PostgreSQL with Testcontainers
 * - Test full HTTP request/response cycle
 * - Verify database operations
 * - Test Spring Security integration
 */
@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@ActiveProfiles("integration")
class AuthControllerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
            .withDatabaseName("testdb")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        // Clean database before each test
        userRepository.deleteAll();
    }

    @Test
    void testRegister_WithValidData_ShouldReturn201AndToken() throws Exception {
        // Arrange
        UserRegistrationRequest request = new TestDataBuilder.RegistrationRequestBuilder()
                .email("newuser@example.com")
                .fullName("New User")
                .password("Test@1234")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value("newuser@example.com"))
                .andExpect(jsonPath("$.fullName").value("New User"));
    }

    @Test
    void testRegister_WithDuplicateEmail_ShouldReturn400() throws Exception {
        // Arrange: Register first user
        UserRegistrationRequest firstRequest = new TestDataBuilder.RegistrationRequestBuilder()
                .email("duplicate@example.com")
                .build();

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(firstRequest)))
                .andExpect(status().isCreated());

        // Act & Assert: Try to register again with same email
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(firstRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Email already exists"));
    }

    @Test
    void testLogin_WithValidCredentials_ShouldReturn200AndToken() throws Exception {
        // Arrange: Register user first
        UserRegistrationRequest regRequest = new TestDataBuilder.RegistrationRequestBuilder()
                .email("login@example.com")
                .password("Test@1234")
                .build();

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isCreated());

        // Prepare login request
        LoginRequest loginRequest = new TestDataBuilder.LoginRequestBuilder()
                .email("login@example.com")
                .password("Test@1234")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value("login@example.com"));
    }

    @Test
    void testLogin_WithInvalidPassword_ShouldReturn401() throws Exception {
        // Arrange: Register user
        UserRegistrationRequest regRequest = new TestDataBuilder.RegistrationRequestBuilder()
                .email("wrong@example.com")
                .password("Test@1234")
                .build();

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regRequest)))
                .andExpect(status().isCreated());

        // Prepare login with wrong password
        LoginRequest loginRequest = new TestDataBuilder.LoginRequestBuilder()
                .email("wrong@example.com")
                .password("WrongPassword@123")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Invalid email or password"));
    }
}
```

## Technology Choices

### Testing Framework: JUnit 5

**Why JUnit 5:**
- Industry standard for Java testing
- Built-in Spring Boot support
- Rich assertion library
- Parameterized tests support
- Extension model for customization

### Mocking Framework: Mockito

**Why Mockito:**
- Seamless JUnit 5 integration
- Intuitive API for stubbing
- Argument matchers and captors
- Verify method invocations
- Already included in spring-boot-starter-test

### Database Testing: Testcontainers

**Why Testcontainers:**
- Real PostgreSQL database for integration tests
- Isolated test environment
- Automatic container lifecycle management
- Same database as production
- No manual setup required

### API Testing: REST Assured

**Why REST Assured:**
- Fluent API for REST testing
- JSON schema validation
- Response extraction and validation
- BDD-style syntax
- HTTP status and header testing

### Code Coverage: JaCoCo

**Why JaCoCo:**
- Maven plugin integration
- HTML and XML reports
- Coverage thresholds enforcement
- Line and branch coverage
- Industry standard

### In-Memory Database: H2

**Why H2:**
- Fast unit test execution
- No external dependencies
- SQL compatibility with PostgreSQL
- In-memory mode for isolation
- Zero configuration

## Database Changes

No database schema changes required. Tests will use the existing schema with test data.

## Integration Points

### Test Execution Flow

```
Developer/CI
     |
     | mvn clean test
     |
     v
┌─────────────────────────┐
│   Maven Surefire        │
│   (Unit Tests)          │
└─────────────────────────┘
     |
     | @Test methods
     |
     v
┌─────────────────────────┐
│   JUnit 5 Engine        │
└─────────────────────────┘
     |
     | Run test classes
     |
     v
┌──────────────┬──────────────┬──────────────┐
│ Service Tests│ Repo Tests   │Security Tests│
│  (Mockito)   │   (H2)       │  (JwtUtil)   │
└──────────────┴──────────────┴──────────────┘
     |
     | Test results
     |
     v
┌─────────────────────────┐
│   JaCoCo Agent          │
│   (Coverage tracking)   │
└─────────────────────────┘
     |
     | Generate reports
     |
     v
┌─────────────────────────┐
│   Coverage Reports      │
│   target/site/jacoco/   │
└─────────────────────────┘
```

### Integration Test Flow

```
Developer/CI
     |
     | mvn clean verify -P integration-tests
     |
     v
┌─────────────────────────┐
│   Maven Failsafe        │
│   (Integration Tests)   │
└─────────────────────────┘
     |
     | Start containers
     |
     v
┌─────────────────────────┐
│   Testcontainers        │
│   (PostgreSQL)          │
└─────────────────────────┘
     |
     | Configure Spring
     |
     v
┌─────────────────────────┐
│   Spring Boot Test      │
│   Context               │
└─────────────────────────┘
     |
     | HTTP requests
     |
     v
┌─────────────────────────┐
│   MockMvc               │
│   (Controller tests)    │
└─────────────────────────┘
     |
     | Calls
     |
     v
┌──────────────┬──────────────┬──────────────┐
│ Controllers  │  Services    │ Repositories │
└──────────────┴──────────────┴──────────────┘
     |
     | SQL queries
     |
     v
┌─────────────────────────┐
│   PostgreSQL Container  │
└─────────────────────────┘
```

## Maven Configuration

### Dependencies (pom.xml additions)

```xml
<dependencies>
    <!-- Existing dependencies... -->

    <!-- Testcontainers for integration tests -->
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>testcontainers</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>postgresql</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>1.19.3</version>
        <scope>test</scope>
    </dependency>

    <!-- REST Assured for API testing -->
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <version>5.4.0</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>json-schema-validator</artifactId>
        <version>5.4.0</version>
        <scope>test</scope>
    </dependency>

    <!-- H2 Database for unit tests -->
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- AssertJ for better assertions -->
    <dependency>
        <groupId>org.assertj</groupId>
        <artifactId>assertj-core</artifactId>
        <version>3.25.1</version>
        <scope>test</scope>
    </dependency>

    <!-- Spring Security Test -->
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### Build Plugins (pom.xml additions)

```xml
<build>
    <plugins>
        <!-- Existing plugins... -->

        <!-- Surefire for unit tests -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-surefire-plugin</artifactId>
            <version>3.2.3</version>
            <configuration>
                <includes>
                    <include>**/*Test.java</include>
                </includes>
                <excludes>
                    <exclude>**/*IntegrationTest.java</exclude>
                    <exclude>**/*ApiTest.java</exclude>
                </excludes>
            </configuration>
        </plugin>

        <!-- Failsafe for integration tests -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-failsafe-plugin</artifactId>
            <version>3.2.3</version>
            <configuration>
                <includes>
                    <include>**/*IntegrationTest.java</include>
                </includes>
            </configuration>
            <executions>
                <execution>
                    <goals>
                        <goal>integration-test</goal>
                        <goal>verify</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>

        <!-- JaCoCo for code coverage -->
        <plugin>
            <groupId>org.jacoco</groupId>
            <artifactId>jacoco-maven-plugin</artifactId>
            <version>0.8.11</version>
            <executions>
                <execution>
                    <id>prepare-agent</id>
                    <goals>
                        <goal>prepare-agent</goal>
                    </goals>
                </execution>
                <execution>
                    <id>report</id>
                    <phase>test</phase>
                    <goals>
                        <goal>report</goal>
                    </goals>
                </execution>
                <execution>
                    <id>check</id>
                    <goals>
                        <goal>check</goal>
                    </goals>
                    <configuration>
                        <rules>
                            <rule>
                                <element>PACKAGE</element>
                                <limits>
                                    <limit>
                                        <counter>LINE</counter>
                                        <value>COVEREDRATIO</value>
                                        <minimum>0.80</minimum>
                                    </limit>
                                </limits>
                            </rule>
                        </rules>
                    </configuration>
                </execution>
            </executions>
            <configuration>
                <excludes>
                    <exclude>**/config/**</exclude>
                    <exclude>**/dto/**</exclude>
                    <exclude>**/entity/**</exclude>
                    <exclude>**/RegistrationFormApiApplication.class</exclude>
                </excludes>
            </configuration>
        </plugin>
    </plugins>
</build>
```

### Maven Profiles

```xml
<profiles>
    <!-- Unit tests only -->
    <profile>
        <id>unit-tests</id>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-surefire-plugin</artifactId>
                    <configuration>
                        <excludes>
                            <exclude>**/*IntegrationTest.java</exclude>
                            <exclude>**/*ApiTest.java</exclude>
                        </excludes>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>

    <!-- Integration tests -->
    <profile>
        <id>integration-tests</id>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-failsafe-plugin</artifactId>
                    <configuration>
                        <includes>
                            <include>**/*IntegrationTest.java</include>
                        </includes>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>

    <!-- API tests (requires running server) -->
    <profile>
        <id>api-tests</id>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-surefire-plugin</artifactId>
                    <configuration>
                        <includes>
                            <include>**/*ApiTest.java</include>
                        </includes>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>
</profiles>
```

## Test Naming Conventions

### Unit Tests
- Class: `{ComponentName}Test.java` (e.g., `AuthServiceTest.java`)
- Method: `test{MethodName}_{Scenario}_Should{ExpectedResult}()`
- Example: `testLogin_WithValidCredentials_ShouldReturnSuccess()`

### Integration Tests
- Class: `{ComponentName}IntegrationTest.java` (e.g., `AuthControllerIntegrationTest.java`)
- Method: `test{Endpoint}_{Scenario}_Should{ExpectedResult}()`
- Example: `testRegister_WithValidData_ShouldReturn201AndToken()`

### API Tests
- Class: `{Feature}ApiTest.java` (e.g., `AuthApiTest.java`)
- Method: `test{Endpoint}_{Scenario}()`
- Example: `testLoginEndpoint_ReturnsValidTokenOnSuccess()`

## Performance Considerations

### Test Execution Time Targets

- **Unit tests:** < 30 seconds total
- **Integration tests:** < 2 minutes total
- **API tests:** < 1 minute total
- **All tests:** < 5 minutes total

### Optimization Strategies

1. **Use H2 for unit tests** (faster than PostgreSQL)
2. **Parallel test execution** (Surefire/Failsafe configuration)
3. **Reuse Spring context** (fewer context loads)
4. **Testcontainers singleton** (one container for all integration tests)
5. **Mock external dependencies** (no network calls)

## Next Steps

After implementation:

1. **Run tests locally** to verify everything works
2. **Check coverage reports** to identify gaps
3. **Integrate with CI/CD** pipeline
4. **Document test patterns** for team
5. **Create test maintenance guide**
