# Unit Test Java Implementation Plan

## 📋 Executive Summary

**Tujuan:** Implementasi comprehensive unit testing untuk Backend Java (Spring Boot)
**Scope:** Service Layer, Security Layer, dan Controller Layer
**Target Coverage:** 80%+ code coverage
**Estimasi Waktu:** 4-6 jam (dapat dibagi per hari)
**Tools:** JUnit 5, Mockito, Spring Boot Test

---

## 🎯 Mengapa Unit Test Java (Hanya Backend)?

### ✅ Unit Test Java = Backend Only

```
┌─────────────────────────────────────────────────────┐
│                  TESTING STRATEGY                   │
└─────────────────────────────────────────────────────┘

FRONTEND (Next.js/React):
├── Component Tests         → Jest + React Testing Library
├── Integration Tests       → Jest
└── E2E Tests              → Playwright ✅ (Sudah ada!)

BACKEND (Spring Boot/Java):
├── Unit Tests             → JUnit + Mockito ⭐ (INI!)
├── Integration Tests      → Spring Boot Test
└── API Tests              → Playwright API Testing ✅ (Sudah ada!)
```

### Kenapa Backend Pakai Unit Test Java?

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

## 📊 Current State vs Target State

### Current State (Sekarang)

```
Registration Form Project
│
├── Frontend Testing: ✅ COMPLETE
│   ├── E2E Tests (Playwright)        ✅ 9 test files
│   ├── API Tests (Playwright)        ✅ 3 test files
│   ├── Video Recording               ✅ Configured
│   └── Screenshot Capture            ✅ Configured
│
└── Backend Testing: ⚠️ PARTIAL
    ├── Unit Tests                    ⚠️ 1 file only (AuthServiceTest)
    ├── Integration Tests             ❌ None
    └── Code Coverage                 ❌ Unknown (likely < 30%)
```

### Target State (Tujuan)

```
Registration Form Project
│
├── Frontend Testing: ✅ COMPLETE (No change needed)
│
└── Backend Testing: ✅ COMPLETE
    ├── Unit Tests                    ✅ 7+ test files
    │   ├── AuthServiceTest           ✅ DONE
    │   ├── UserServiceTest           🔲 TODO
    │   ├── FileStorageServiceTest    🔲 TODO
    │   ├── JwtUtilTest              🔲 TODO
    │   ├── UserControllerTest        🔲 TODO
    │   ├── ProfileControllerTest     🔲 TODO
    │   └── ValidationUtilTest        🔲 TODO
    │
    ├── Integration Tests             🔲 Optional
    └── Code Coverage                 ✅ Target: 80%+
```

---

## 🎯 Implementation Plan

### Phase 1: Service Layer Testing (HIGH PRIORITY)

**Goal:** Test all business logic in Service classes

#### 1.1 AuthService ✅ DONE
```
File: service/AuthService.java
Test: service/AuthServiceTest.java

Status: ✅ COMPLETED
Test Cases: 5
- Login with valid credentials
- Login with email not found
- Login with wrong password
- Register new user
- Register with duplicate email

Time Spent: ~60 minutes
Coverage: ~90% of AuthService
```

#### 1.2 UserService 🔲 TODO (NEXT!)
```
File: service/UserService.java
Test: service/UserServiceTest.java

Priority: ⭐⭐⭐ HIGH
Estimated Time: 30-40 minutes
Complexity: Medium

Test Cases to Implement:
1. getUserById() - user exists → return user
2. getUserById() - user not found → throw exception
3. getUserByEmail() - email exists → return user
4. getUserByEmail() - email not found → return empty
5. updateUser() - valid data → return updated user
6. updateUser() - user not found → throw exception
7. deleteUser() - user exists → delete success
8. deleteUser() - user not found → throw exception
9. getAllUsers() - return list of users

Dependencies to Mock:
- UserRepository
- PasswordEncoder (if used)

Expected Coverage: 85%+
```

#### 1.3 FileStorageService 🔲 TODO
```
File: service/FileStorageService.java
Test: service/FileStorageServiceTest.java

Priority: ⭐⭐⭐ HIGH
Estimated Time: 45-60 minutes
Complexity: High (file operations)

Test Cases to Implement:
1. storeFile() - valid PNG image → save success
2. storeFile() - valid JPEG image → save success
3. storeFile() - invalid file type (PDF) → throw exception
4. storeFile() - file too large → throw exception
5. storeFile() - empty file → throw exception
6. storeFile() - null file → throw exception
7. deleteFile() - file exists → delete success
8. deleteFile() - file not exists → handle gracefully
9. getFilePath() - return correct path
10. validateFileType() - valid types → return true
11. validateFileType() - invalid types → return false
12. validateFileSize() - within limit → return true
13. validateFileSize() - exceeds limit → return false

Dependencies to Mock:
- File system operations (dengan Mockito)
- Path operations

Challenges:
- Mock file system
- Test file operations without real files
- Handle IOException

Expected Coverage: 80%+
```

---

### Phase 2: Security Layer Testing (HIGH PRIORITY)

#### 2.1 JwtUtil 🔲 TODO
```
File: security/JwtUtil.java
Test: security/JwtUtilTest.java

Priority: ⭐⭐⭐ HIGH
Estimated Time: 30-40 minutes
Complexity: Medium

Test Cases to Implement:
1. generateToken() - valid email → return valid JWT
2. extractEmail() - valid token → return email
3. extractEmail() - invalid token → throw exception
4. validateToken() - valid token → return true
5. validateToken() - expired token → return false
6. validateToken() - invalid signature → return false
7. validateToken() - malformed token → return false
8. isTokenExpired() - expired token → return true
9. isTokenExpired() - valid token → return false

Dependencies to Mock:
- None (pure utility class)

Special Considerations:
- Test with real JWT library (io.jsonwebtoken)
- Test token expiration
- Test signature validation

Expected Coverage: 90%+
```

---

### Phase 3: Controller Layer Testing (MEDIUM PRIORITY)

**Note:** Controller tests are integration tests (use MockMvc)

#### 3.1 UserController 🔲 TODO
```
File: controller/UserController.java
Test: controller/UserControllerTest.java

Priority: ⭐⭐ MEDIUM
Estimated Time: 45-60 minutes
Complexity: Medium-High

Type: Integration Test (with MockMvc)

Test Cases to Implement:
1. GET /api/users → 200 OK with user list
2. GET /api/users/{id} - exists → 200 OK with user
3. GET /api/users/{id} - not found → 404 Not Found
4. POST /api/users - valid data → 201 Created
5. POST /api/users - invalid data → 400 Bad Request
6. PUT /api/users/{id} - valid update → 200 OK
7. PUT /api/users/{id} - not found → 404 Not Found
8. DELETE /api/users/{id} - exists → 204 No Content
9. DELETE /api/users/{id} - not found → 404 Not Found

Tools:
- @WebMvcTest
- MockMvc
- @MockBean for services

Expected Coverage: 75%+
```

#### 3.2 ProfileController 🔲 TODO
```
File: controller/ProfileController.java
Test: controller/ProfileControllerTest.java

Priority: ⭐⭐ MEDIUM
Estimated Time: 45-60 minutes
Complexity: Medium-High

Type: Integration Test (with MockMvc)

Test Cases to Implement:
1. GET /api/profile → 200 OK with user profile
2. GET /api/profile - not authenticated → 401 Unauthorized
3. PUT /api/profile - valid data → 200 OK
4. PUT /api/profile - invalid data → 400 Bad Request
5. POST /api/profile/picture - valid image → 200 OK
6. POST /api/profile/picture - invalid type → 400 Bad Request
7. POST /api/profile/picture - too large → 400 Bad Request
8. DELETE /api/profile/picture → 204 No Content
9. DELETE /api/profile/picture - no picture → 404 Not Found

Tools:
- @WebMvcTest
- MockMvc
- MockMultipartFile (for file upload)
- @MockBean for services

Expected Coverage: 75%+
```

---

### Phase 4: Utility/Helper Testing (LOW PRIORITY)

#### 4.1 ValidationUtil 🔲 TODO (Optional)
```
If you have validation utility classes

Priority: ⭐ LOW
Estimated Time: 20-30 minutes
Complexity: Low

Test Cases:
- Email validation
- Password strength validation
- Phone number validation
- etc.
```

---

## 📅 Implementation Timeline

### Option 1: Intensive (2-3 Days)

```
Day 1 (2-3 hours):
├── ✅ AuthServiceTest (DONE)
├── 🔲 UserServiceTest (30 min)
└── 🔲 JwtUtilTest (30 min)

Day 2 (2-3 hours):
├── 🔲 FileStorageServiceTest (60 min)
└── 🔲 UserControllerTest (60 min)

Day 3 (1-2 hours):
├── 🔲 ProfileControllerTest (60 min)
└── 🔲 Code Coverage Review
```

### Option 2: Gradual (1 Week)

```
Monday:    ✅ AuthServiceTest (DONE)
Tuesday:   🔲 UserServiceTest
Wednesday: 🔲 JwtUtilTest
Thursday:  🔲 FileStorageServiceTest
Friday:    🔲 UserControllerTest
Weekend:   🔲 ProfileControllerTest + Review
```

### Option 3: Weekend Sprint

```
Saturday Morning:
├── ✅ AuthServiceTest (DONE)
├── 🔲 UserServiceTest
└── 🔲 JwtUtilTest

Saturday Afternoon:
├── 🔲 FileStorageServiceTest
└── 🔲 UserControllerTest

Sunday:
├── 🔲 ProfileControllerTest
├── 🔲 Code Coverage Analysis
└── 🔲 Documentation Update
```

---

## 🛠️ Technical Stack

### Testing Frameworks

```xml
<!-- pom.xml dependencies -->

<!-- JUnit 5 - Testing Framework -->
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.10.0</version>
    <scope>test</scope>
</dependency>

<!-- Mockito - Mocking Framework -->
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-core</artifactId>
    <version>5.5.0</version>
    <scope>test</scope>
</dependency>

<!-- Spring Boot Test - Integration Testing -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>

<!-- AssertJ - Fluent Assertions (Optional) -->
<dependency>
    <groupId>org.assertj</groupId>
    <artifactId>assertj-core</artifactId>
    <version>3.24.2</version>
    <scope>test</scope>
</dependency>

<!-- JaCoCo - Code Coverage -->
<dependency>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.10</version>
</dependency>
```

### Test Structure

```
src/test/java/com/registrationform/api/
│
├── service/              ← Service Layer Tests (Unit)
│   ├── AuthServiceTest.java         ✅
│   ├── UserServiceTest.java         🔲
│   └── FileStorageServiceTest.java  🔲
│
├── security/             ← Security Layer Tests (Unit)
│   └── JwtUtilTest.java             🔲
│
├── controller/           ← Controller Tests (Integration)
│   ├── UserControllerTest.java      🔲
│   └── ProfileControllerTest.java   🔲
│
└── repository/           ← Repository Tests (Optional)
    └── UserRepositoryTest.java      🔲
```

---

## 📏 Quality Metrics & Success Criteria

### Code Coverage Targets

```
Overall Target:        80%+  ✅
Service Layer:         90%+  ⭐
Security Layer:        85%+  ⭐
Controller Layer:      75%+  ⭐
Repository Layer:      50%+  (Optional)
```

### Test Quality Metrics

```
✅ All tests must pass
✅ No flaky tests (inconsistent results)
✅ Fast execution (< 5 seconds for all unit tests)
✅ Clear test names (@DisplayName)
✅ Comprehensive assertions
✅ Mock external dependencies
✅ Follow AAA pattern (Arrange-Act-Assert)
```

### Success Criteria

```
✅ Minimum 80% code coverage
✅ All critical business logic tested
✅ All public methods tested
✅ Happy path AND error paths tested
✅ Security logic tested
✅ File operations tested
✅ Tests run in CI/CD pipeline (future)
✅ Documentation updated
```

---

## 🎓 Learning Outcomes

### Skills Gained

```
✅ JUnit 5 testing framework
✅ Mockito mocking framework
✅ AAA pattern (Arrange-Act-Assert)
✅ Test-Driven Development (TDD) concepts
✅ Mock vs Real objects
✅ Integration testing with MockMvc
✅ Code coverage analysis
✅ Best practices for unit testing
```

### Portfolio Value

```
✅ Demonstrates professional testing skills
✅ Shows understanding of quality assurance
✅ Proves knowledge of industry standards
✅ Attractive to recruiters
✅ Production-ready code quality
```

---

## 🚀 Quick Start Guide

### Step 1: Setup (5 minutes)
```bash
# Verify dependencies in pom.xml
cd backend/registration-form-api
mvn clean test

# Should see:
# Tests run: 5, Failures: 0 (AuthServiceTest)
```

### Step 2: Choose Your First Test
```
Option A: UserServiceTest (easier, similar to AuthService)
Option B: JwtUtilTest (interesting, security-focused)
Option C: FileStorageServiceTest (challenging, file operations)
```

### Step 3: Follow the Template
```java
// Copy structure from AuthServiceTest.java
// Replace class names
// Replace test cases
// Run test: mvn test -Dtest=YourTestClass
```

### Step 4: Verify Coverage
```bash
# Generate coverage report
mvn clean test jacoco:report

# Open report
open target/site/jacoco/index.html
```

---

## 📚 Resources & References

### Documentation
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Spring Boot Testing](https://spring.io/guides/gs/testing-web/)
- [Unit Test Guide (Project Docs)](./unit-test-java-guide.md)

### Examples in Project
- `AuthServiceTest.java` - Complete example ✅
- `unit-test-java-guide.md` - Comprehensive guide ✅

---

## 🎯 Next Actions

### Immediate (This Week)
```
1. 🔲 Implement UserServiceTest
2. 🔲 Implement JwtUtilTest
3. 🔲 Review and refactor if needed
```

### Short Term (This Month)
```
4. 🔲 Implement FileStorageServiceTest
5. 🔲 Implement UserControllerTest
6. 🔲 Implement ProfileControllerTest
7. 🔲 Achieve 80% coverage
```

### Long Term (Nice to Have)
```
8. 🔲 Integration tests for repositories
9. 🔲 Performance tests
10. 🔲 CI/CD integration
```

---

## ❓ FAQ

### Q: Apakah Frontend juga perlu unit test Java?
**A:** TIDAK! Frontend pakai JavaScript/TypeScript, bukan Java.
- Frontend → Jest + React Testing Library
- Backend → JUnit + Mockito

### Q: Apakah E2E test sudah cukup? Kenapa perlu unit test?
**A:** E2E test dan unit test berbeda:
- E2E: Test seluruh flow (lambat, ~1 detik per test)
- Unit: Test 1 function (cepat, ~1ms per test)
- Keduanya saling melengkapi!

### Q: Harus test semua class?
**A:** Fokus priority:
1. HIGH: Service Layer (business logic)
2. HIGH: Security Layer (authentication)
3. MEDIUM: Controller Layer
4. LOW: Repository (sudah di-test Spring Data JPA)

### Q: Berapa lama untuk complete semua test?
**A:** Estimasi 4-6 jam total, bisa dibagi:
- Intensive: 2-3 hari (2 jam/hari)
- Gradual: 1 minggu (1 jam/hari)
- Sprint: 1 weekend

### Q: Apa benefit untuk karir?
**A:** BESAR!
- Recruiter suka lihat test coverage
- Menunjukkan code quality
- Professional development practice
- Production-ready mindset

---

## ✅ Checklist

### Setup
- [x] JUnit 5 installed
- [x] Mockito installed
- [x] First test created (AuthServiceTest)
- [x] Documentation created
- [ ] JaCoCo configured
- [ ] Coverage baseline measured

### Implementation
- [x] Phase 1.1: AuthService ✅
- [ ] Phase 1.2: UserService
- [ ] Phase 1.3: FileStorageService
- [ ] Phase 2.1: JwtUtil
- [ ] Phase 3.1: UserController
- [ ] Phase 3.2: ProfileController

### Quality
- [ ] 80%+ code coverage
- [ ] All tests passing
- [ ] No flaky tests
- [ ] Fast execution (<5s)
- [ ] Documentation complete

---

**Plan Created:** 2025-11-06
**Status:** In Progress (1 of 7 test files complete)
**Next Step:** Implement UserServiceTest
