# Unit Testing Java Backend - Requirements Document

**Status:** COMPLETED
**Last Updated:** November 6, 2024

---

## Overview

This document defines the requirements and specifications for implementing comprehensive unit tests for the Backend Java (Spring Boot) application.

**Back to:** [Main README](README.md) | **See also:** [Technical Design](technical-design.md) | [Checklist](checklist.md)

---

## Test Objectives

### Primary Goals

1. **High Code Coverage**
   - Target: 80%+ overall coverage
   - Service Layer: 90%+ coverage
   - Security Layer: 85%+ coverage
   - Controller Layer: 75%+ coverage

2. **Quality Assurance**
   - Test all public methods
   - Cover happy path + error paths
   - Verify business logic correctness
   - Test edge cases and null handling

3. **Professional Development Practice**
   - Industry-standard testing patterns
   - Mock external dependencies
   - Fast, isolated unit tests
   - Clear, maintainable test code

---

## Why Unit Test Java (Backend Only)?

### Testing Strategy Overview

```
┌─────────────────────────────────────────────────────┐
│                  TESTING STRATEGY                   │
└─────────────────────────────────────────────────────┘

FRONTEND (Next.js/React):
├── Component Tests → Jest + React Testing Library
├── Integration Tests → Jest
└── E2E Tests → Playwright ✅ (Sudah ada!)

BACKEND (Spring Boot/Java):
├── Unit Tests → JUnit + Mockito ⭐ (INI!)
├── Integration Tests → Spring Boot Test
└── API Tests → Playwright API Testing ✅ (Sudah ada!)
```

### Key Differences

**1. Bahasa yang Berbeda**
```
Frontend: JavaScript/TypeScript → Jest
Backend:  Java               → JUnit + Mockito
```

**2. Framework yang Berbeda**
```
Frontend: React Components → React Testing Library
Backend:  Spring Boot      → Spring Boot Test
```

**3. Tujuan yang Berbeda**
```
Frontend Unit Test:
- Test component rendering
- Test user interactions
- Test state management

Backend Unit Test:
- Test business logic
- Test data validation
- Test security
- Test database operations (dengan mock)
```

---

## Test Specifications

### Phase 1: Service Layer Testing (HIGH PRIORITY)

#### 1.1 AuthService ✅ COMPLETED

**File:** `service/AuthServiceTest.java`
**Tests:** 5
**Coverage:** ~90%

**Test Cases:**
1. Login with valid credentials → Should return success with JWT token
2. Login with email not found → Should throw exception
3. Login with wrong password → Should throw exception
4. Register new user with valid data → Should save successfully
5. Register with duplicate email → Should throw exception

**Dependencies Mocked:**
- UserRepository
- PasswordEncoder
- JwtUtil

---

#### 1.2 UserService

**File:** `service/UserServiceTest.java`
**Tests:** 9
**Priority:** HIGH

**Test Cases:**
1. getUserById() - user exists → return user
2. getUserById() - user not found → throw exception
3. getUserByEmail() - email exists → return user
4. getUserByEmail() - email not found → return empty
5. updateUser() - valid data → return updated user
6. updateUser() - user not found → throw exception
7. deleteUser() - user exists → delete success
8. deleteUser() - user not found → throw exception
9. getAllUsers() - return list of users

---

#### 1.3 FileStorageService

**File:** `service/FileStorageServiceTest.java`
**Tests:** 8
**Priority:** HIGH

**Test Cases:**
1. storeFile() - valid PNG image → save success
2. storeFile() - valid JPEG image → save success
3. storeFile() - invalid file type (PDF) → throw exception
4. storeFile() - file too large → throw exception
5. storeFile() - empty file → throw exception
6. storeFile() - null file → throw exception
7. deleteFile() - file exists → delete success
8. deleteFile() - file not exists → handle gracefully

---

#### 1.4 GalleryService

**File:** `service/GalleryServiceTest.java`
**Tests:** 18
**Priority:** HIGH

**Test Cases:**
1. uploadPhoto() - happy path
2. uploadPhoto() - invalid file
3. uploadPhoto() - defaults to private
4. getMyPhotos() - all photos returned
5. getMyPhotos() - pagination works
6. getPublicPhotos() - only public shown
7. getUserPublicPhotos() - user's public photos
8. getPhotoById() - owner can see private
9. getPhotoById() - non-owner cannot see private
10. getPhotoById() - anyone can see public
11. updatePhoto() - owner can update
12. updatePhoto() - non-owner cannot update
13. togglePrivacy() - private to public
14. togglePrivacy() - public to private
15. togglePrivacy() - non-owner cannot toggle
16. deletePhoto() - owner can delete
17. deletePhoto() - non-owner cannot delete
18. deletePhoto() - file cleanup works

---

### Phase 2: Security Layer Testing (HIGH PRIORITY)

#### 2.1 JwtUtil

**File:** `security/JwtUtilTest.java`
**Tests:** 18
**Priority:** HIGH

**Test Cases:**
1. generateToken() - valid email → return valid JWT
2. generateToken() - null email → throw exception
3. generateToken() - empty email → throw exception
4. generateToken() - token format → contains 3 parts
5. extractEmail() - valid token → return correct email
6. extractEmail() - invalid token → throw exception
7. extractEmail() - malformed token → throw exception
8. extractEmail() - expired token → still extract email
9. validateToken() - valid token, correct email → return true
10. validateToken() - valid token, wrong email → return false
11. validateToken() - expired token → return false
12. validateToken() - invalid signature → return false
13. validateToken() - malformed token → return false
14. validateToken() - null token → return false
15. isTokenExpired() - valid token → return false
16. isTokenExpired() - expired token → return true
17. extractExpiration() - valid token → return future date
18. extractExpiration() - expired token → return past date

---

### Phase 3: Controller Layer Testing (MEDIUM PRIORITY)

#### 3.1 UserController

**File:** `controller/UserControllerTest.java`
**Tests:** 9
**Priority:** MEDIUM

**Test Cases:**
1. GET /api/users → 200 OK with user list
2. GET /api/users (empty) → 200 OK with empty array
3. GET /api/users/{id} - user exists → 200 OK with user
4. GET /api/users/{id} - user not found → 404 Not Found
5. POST /api/users - valid data → 201 Created
6. POST /api/users - missing field → 400 Bad Request
7. PUT /api/users/{id} - valid update → 200 OK
8. PUT /api/users/{id} - not found → 404 Not Found
9. DELETE /api/users/{id} - exists → 204 No Content

---

#### 3.2 ProfileController

**File:** `controller/ProfileControllerTest.java`
**Tests:** 8
**Priority:** MEDIUM

**Test Cases:**
1. GET /api/profile - authenticated → 200 OK with profile
2. GET /api/profile - not authenticated → 401 Unauthorized
3. PUT /api/profile - valid data → 200 OK
4. PUT /api/profile - invalid data → 400 Bad Request
5. POST /api/profile/picture - valid PNG → 200 OK
6. POST /api/profile/picture - invalid type → 400 Bad Request
7. DELETE /api/profile/picture - has picture → 204 No Content
8. DELETE /api/profile/picture - no picture → 404 Not Found

---

## Success Criteria

### Functional Requirements

- [x] All test files created
- [x] All ~60 test cases implemented
- [x] All tests passing
- [x] Overall coverage ≥ 80%
- [x] Service layer coverage ≥ 90%
- [x] Security layer coverage ≥ 85%
- [x] Controller layer coverage ≥ 75%

### Quality Requirements

- [x] All test methods have @Test annotation
- [x] All test methods have @DisplayName
- [x] Follows AAA pattern (Arrange-Act-Assert)
- [x] Proper use of @Mock and @InjectMocks
- [x] No hardcoded values (use constants or variables)
- [x] Clear variable names
- [x] Comprehensive assertions
- [x] Mock external dependencies
- [x] Fast execution (< 5 seconds total)

---

## Prerequisites

### Development Environment

**Before Starting:**
- JUnit 5 installed
- Mockito installed
- Spring Boot Test configured
- JaCoCo configured for coverage

**Verify Setup:**
```bash
cd backend/ikp-labs-api
mvn clean test
# Should see: Tests run: 5, Failures: 0 (AuthServiceTest)
```

---

## Out of Scope

- Integration tests with real database
- Performance/load testing
- Security penetration testing
- Repository layer tests (covered by service tests)

---

**Document Version:** 1.0
**Status:** COMPLETED
**Last Updated:** November 6, 2024

**Back to:** [Main README](README.md) | **Next:** [Technical Design](technical-design.md)
