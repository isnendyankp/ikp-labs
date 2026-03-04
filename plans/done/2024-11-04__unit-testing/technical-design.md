# Unit Testing Java Backend - Technical Design

**Status:** COMPLETED
**Last Updated:** November 6, 2024

---

## Overview

This document provides technical implementation details for unit testing the Backend Java (Spring Boot) application using JUnit 5 and Mockito.

**Back to:** [Main README](README.md) | **See also:** [Requirements](requirements.md) | [Checklist](checklist.md)

---

## Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Testing Framework | JUnit 5 | 5.x |
| Mocking Framework | Mockito | 5.x |
| Assertions | AssertJ (optional) | 3.x |
| Coverage | JaCoCo | 0.8.x |
| Build Tool | Maven | 3.x |

---

## Dependencies (pom.xml)

```xml
<dependencies>
    <!-- JUnit 5 -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- Mockito -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- Mockito + JUnit 5 Integration -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- Spring Boot Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## Test Structure

### Directory Structure

```
backend/ikp-labs-api/src/
├── main/java/com/registrationform/api/
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   └── FileStorageService.java
│   ├── security/
│   │   └── JwtUtil.java
│   └── controller/
│       ├── UserController.java
│       └── ProfileController.java
│
└── test/java/com/registrationform/api/
    ├── service/
    │   ├── AuthServiceTest.java
    │   ├── UserServiceTest.java
    │   └── FileStorageServiceTest.java
    ├── security/
    │   └── JwtUtilTest.java
    └── controller/
        ├── UserControllerTest.java
        └── ProfileControllerTest.java
```

---

## Test File Template

### Basic Unit Test Template

```java
package com.registrationform.api.service;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AuthService Unit Tests")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("login() with valid credentials should return JWT token")
    void login_ValidCredentials_ReturnsJwtToken() {
        // Arrange
        String email = "test@example.com";
        String password = "password123";
        User mockUser = new User();
        mockUser.setEmail(email);
        mockUser.setPassword("encodedPassword");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(password, "encodedPassword")).thenReturn(true);
        when(jwtUtil.generateToken(email)).thenReturn("mock-jwt-token");

        // Act
        LoginResponse response = authService.login(email, password);

        // Assert
        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        verify(userRepository).findByEmail(email);
        verify(passwordEncoder).matches(password, "encodedPassword");
        verify(jwtUtil).generateToken(email);
    }
}
```

---

## Testing Patterns

### 1. AAA Pattern (Arrange-Act-Assert)

```java
@Test
void getUserById_UserExists_ReturnsUser() {
    // ARRANGE - Setup test data and mocks
    Long userId = 1L;
    User expectedUser = new User();
    expectedUser.setId(userId);
    when(userRepository.findById(userId)).thenReturn(Optional.of(expectedUser));

    // ACT - Call the method under test
    User actualUser = userService.getUserById(userId);

    // ASSERT - Verify results
    assertNotNull(actualUser);
    assertEquals(userId, actualUser.getId());
    verify(userRepository).findById(userId);
}
```

### 2. Exception Testing

```java
@Test
@DisplayName("login() with email not found should throw exception")
void login_EmailNotFound_ThrowsException() {
    // Arrange
    String email = "notfound@example.com";
    String password = "password123";
    when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(AuthException.class, () -> {
        authService.login(email, password);
    });
}
```

### 3. Multiple Assertions with AssertJ

```java
@Test
void generateToken_ValidEmail_ReturnsValidJwt() {
    // Arrange
    String email = "test@example.com";

    // Act
    String token = jwtUtil.generateToken(email);

    // Assert
    assertThat(token).isNotNull();
    assertThat(token).isNotEmpty();
    assertThat(token.split("\\.")).hasSize(3); // JWT has 3 parts
}
```

---

## Mocking Patterns

### 1. Basic Mock Setup

```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    // userService automatically has userRepository injected
}
```

### 2. Mock Return Values

```java
// Return Optional with value
when(userRepository.findById(1L)).thenReturn(Optional.of(user));

// Return empty Optional
when(userRepository.findById(999L)).thenReturn(Optional.empty());

// Return list
when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

// Throw exception
when(userRepository.save(invalidUser)).thenThrow(new DataAccessException("..."));
```

### 3. Verify Mock Interactions

```java
// Verify method called once
verify(userRepository).findById(1L);

// Verify method called N times
verify(userRepository, times(2)).save(any(User.class));

// Verify method never called
verify(userRepository, never()).delete(any());

// Verify method called with any argument
verify(userRepository).save(any(User.class));
```

---

## Testing Strategies

### Testing Services

1. Mock all dependencies (Repository, other Services)
2. Test business logic only
3. Test all branches (if/else)
4. Test exception handling
5. Test validation logic

### Testing Security

1. Test token generation
2. Test token validation
3. Test token expiration
4. Test invalid token handling
5. Test null/empty input handling

### Testing Controllers

1. Mock Service layer
2. Test HTTP status codes
3. Test request/response mapping
4. Test validation
5. Test exception handling

---

## Running Tests

### Run All Tests

```bash
cd backend/ikp-labs-api
mvn clean test
```

### Run Specific Test Class

```bash
mvn test -Dtest=AuthServiceTest
```

### Run with Coverage

```bash
mvn clean test jacoco:report
# Report: target/site/jacoco/index.html
```

### Run with Verbose Output

```bash
mvn test -Dtest=AuthServiceTest -X
```

---

## Best Practices

### 1. Test Naming Convention

```java
// MethodName_Scenario_ExpectedBehavior
void getUserById_UserExists_ReturnsUser()
void login_EmailNotFound_ThrowsException()
void validateToken_ValidToken_ReturnsTrue()
```

### 2. Use @DisplayName

```java
@Test
@DisplayName("Should return user when user ID exists")
void getUserById_UserExists_ReturnsUser() { ... }
```

### 3. One Assertion Per Test (Preferred)

```java
// GOOD - One concept per test
@Test
void getToken_ReturnsTokenString() {
    String token = jwtUtil.generateToken("test@example.com");
    assertNotNull(token);
}

@Test
void getToken_HasThreeParts() {
    String token = jwtUtil.generateToken("test@example.com");
    assertEquals(3, token.split("\\.").length);
}

// ACCEPTABLE - Multiple related assertions
@Test
void getUserById_UserExists_ReturnsCorrectUser() {
    User user = userService.getUserById(1L);
    assertNotNull(user);
    assertEquals(1L, user.getId());
    assertEquals("test@example.com", user.getEmail());
}
```

### 4. Avoid Magic Numbers

```java
// BAD
assertEquals(5, result);

// GOOD
private static final int EXPECTED_COUNT = 5;
assertEquals(EXPECTED_COUNT, result);
```

---

## Coverage Goals

| Layer | Target | Actual |
|-------|--------|--------|
| Service Layer | 90% | ~90% |
| Security Layer | 85% | ~95% |
| Controller Layer | 75% | ~85% |
| **Overall** | **80%** | **~91%** |

---

## Troubleshooting

### Common Issues

**1. NullPointerException in @InjectMocks**
```java
// Make sure @ExtendWith(MockitoExtension.class) is present
@ExtendWith(MockitoExtension.class)
class MyTest { ... }
```

**2. Mock Not Returning Expected Value**
```java
// Check if stub is correct
when(repository.findById(1L)).thenReturn(Optional.of(user));
// Make sure the argument matches (use any() if needed)
when(repository.findById(anyLong())).thenReturn(Optional.of(user));
```

**3. Test Failing Due to Static Methods**
```java
// Use try-with-resources for static mocks
try (MockedStatic<MyUtils> mocked = mockStatic(MyUtils.class)) {
    mocked.when(() -> MyUtils.staticMethod()).thenReturn("mocked");
    // test code
}
```

---

## Future Enhancements

- Integration tests with @SpringBootTest
- Test containers for database testing
- Mutation testing with PIT
- Property-based testing
- Performance benchmarks

---

**Document Version:** 1.0
**Status:** COMPLETED
**Last Updated:** November 6, 2024

**Back to:** [Main README](README.md) | **Next:** [Checklist](checklist.md)
