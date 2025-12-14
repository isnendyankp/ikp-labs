# Unit Test Java - Implementation Checklist

## 📋 Overview

**Purpose:** Track semua unit test yang perlu dibuat untuk Backend Java
**Total Test Files:** 6 files (5 completed + 1 paused)
**Total Test Cases:** 91 test cases
**Target Coverage:** 80%+
**Status:** 5/6 Complete (83%) ✅

---

## 🎯 Quick Status Summary

```
Progress: ████████████████░░░░ 83% (5 of 6 files)

✅ Completed:  5 files  (91 tests passing!)
⏸️  Paused:     1 file   (AuthServiceTest - needs update)
⏱️  Time Spent: 3 days
```

---

## 📊 Detailed Checklist

### **PHASE 1: Service Layer Testing** (HIGH PRIORITY ⭐⭐⭐)

---

#### **1. AuthServiceTest.java** ✅ COMPLETED

**File Location:** `src/test/java/com/registrationform/api/service/AuthServiceTest.java`
**Status:** ✅ DONE
**Date Completed:** 2025-11-06
**Time Spent:** 60 minutes
**Coverage:** ~90%

**Test Cases:**
- [x] Test 1: Login with valid credentials → Should return success with JWT token
- [x] Test 2: Login with email not found → Should throw exception
- [x] Test 3: Login with wrong password → Should throw exception
- [x] Test 4: Register new user with valid data → Should save successfully
- [x] Test 5: Register with duplicate email → Should throw exception

**Dependencies Mocked:**
- [x] UserRepository
- [x] PasswordEncoder
- [x] JwtUtil

**Notes:**
- ✅ All tests passing
- ✅ Comprehensive comments in Indonesian
- ✅ Follows AAA pattern
- ✅ Good example for other tests

---

#### **2. UserServiceTest.java** 🔲 TODO

**File Location:** `src/test/java/com/registrationform/api/service/UserServiceTest.java`
**Status:** 🔲 NOT STARTED
**Priority:** ⭐⭐⭐ HIGH
**Estimated Time:** 30-40 minutes
**Complexity:** Medium
**Target Coverage:** 85%+

**Test Cases to Implement:**

**2.1 Get User Operations**
- [ ] Test 1: getUserById() - user exists → Should return user with correct data
- [ ] Test 2: getUserById() - user not found → Should throw exception
- [ ] Test 3: getUserByEmail() - email exists → Should return user
- [ ] Test 4: getUserByEmail() - email not found → Should return Optional.empty()
- [ ] Test 5: getAllUsers() - users exist → Should return list of users
- [ ] Test 6: getAllUsers() - no users → Should return empty list

**2.2 Update User Operations**
- [ ] Test 7: updateUser() - valid data → Should return updated user
- [ ] Test 8: updateUser() - user not found → Should throw exception
- [ ] Test 9: updateUser() - invalid data → Should throw validation exception

**2.3 Delete User Operations**
- [ ] Test 10: deleteUser() - user exists → Should delete successfully
- [ ] Test 11: deleteUser() - user not found → Should throw exception

**Dependencies to Mock:**
- [ ] UserRepository
- [ ] PasswordEncoder (if used in update)

**Edge Cases to Test:**
- [ ] Null parameters
- [ ] Empty strings
- [ ] Invalid email format

**Success Criteria:**
- [ ] All tests passing
- [ ] Coverage ≥ 85%
- [ ] All public methods tested
- [ ] Happy path + error paths covered

**Notes:**
- Similar structure to AuthServiceTest
- Can copy template from AuthServiceTest
- Focus on CRUD operations

---

#### **3. FileStorageServiceTest.java** 🔲 TODO

**File Location:** `src/test/java/com/registrationform/api/service/FileStorageServiceTest.java`
**Status:** 🔲 NOT STARTED
**Priority:** ⭐⭐⭐ HIGH
**Estimated Time:** 45-60 minutes
**Complexity:** High (file operations)
**Target Coverage:** 80%+

**Test Cases to Implement:**

**3.1 Store File Operations**
- [ ] Test 1: storeFile() - valid PNG image → Should save and return filename
- [ ] Test 2: storeFile() - valid JPEG image → Should save and return filename
- [ ] Test 3: storeFile() - invalid file type (PDF) → Should throw exception
- [ ] Test 4: storeFile() - file too large (> max size) → Should throw exception
- [ ] Test 5: storeFile() - empty file → Should throw exception
- [ ] Test 6: storeFile() - null file → Should throw exception
- [ ] Test 7: storeFile() - filename with special chars → Should sanitize filename

**3.2 Delete File Operations**
- [ ] Test 8: deleteFile() - file exists → Should delete successfully
- [ ] Test 9: deleteFile() - file not exists → Should handle gracefully (no exception)
- [ ] Test 10: deleteFile() - null filename → Should throw exception
- [ ] Test 11: deleteFile() - empty filename → Should throw exception

**3.3 Get File Operations**
- [ ] Test 12: getFilePath() - valid filename → Should return correct path
- [ ] Test 13: loadFile() - file exists → Should return file content
- [ ] Test 14: loadFile() - file not exists → Should throw exception

**3.4 Validation Operations**
- [ ] Test 15: validateFileType() - PNG → Should return true
- [ ] Test 16: validateFileType() - JPEG → Should return true
- [ ] Test 17: validateFileType() - JPG → Should return true
- [ ] Test 18: validateFileType() - PDF → Should return false
- [ ] Test 19: validateFileType() - TXT → Should return false
- [ ] Test 20: validateFileSize() - within limit → Should return true
- [ ] Test 21: validateFileSize() - exceeds limit → Should return false

**Dependencies to Mock:**
- [ ] File system operations (use Mockito)
- [ ] Path operations
- [ ] MultipartFile

**Special Challenges:**
- [ ] Mock file I/O operations
- [ ] Test without creating real files
- [ ] Handle IOException properly

**Success Criteria:**
- [ ] All tests passing
- [ ] Coverage ≥ 80%
- [ ] No real file created during tests
- [ ] All validation rules tested

**Notes:**
- Most complex test in Service layer
- Need to mock file system
- Test all file types (PNG, JPEG, JPG)
- Test size limits (e.g., 5MB max)

---

### **PHASE 2: Security Layer Testing** (HIGH PRIORITY ⭐⭐⭐)

---

#### **4. JwtUtilTest.java** 🔲 TODO

**File Location:** `src/test/java/com/registrationform/api/security/JwtUtilTest.java`
**Status:** 🔲 NOT STARTED
**Priority:** ⭐⭐⭐ HIGH
**Estimated Time:** 30-40 minutes
**Complexity:** Medium
**Target Coverage:** 90%+

**Test Cases to Implement:**

**4.1 Token Generation**
- [ ] Test 1: generateToken() - valid email → Should return valid JWT string
- [ ] Test 2: generateToken() - null email → Should throw exception
- [ ] Test 3: generateToken() - empty email → Should throw exception
- [ ] Test 4: generateToken() - token format → Should contain 3 parts (header.payload.signature)

**4.2 Token Extraction**
- [ ] Test 5: extractEmail() - valid token → Should return correct email
- [ ] Test 6: extractEmail() - invalid token → Should throw exception
- [ ] Test 7: extractEmail() - malformed token → Should throw exception
- [ ] Test 8: extractEmail() - expired token → Should still extract email (but won't validate)

**4.3 Token Validation**
- [ ] Test 9: validateToken() - valid token, correct email → Should return true
- [ ] Test 10: validateToken() - valid token, wrong email → Should return false
- [ ] Test 11: validateToken() - expired token → Should return false
- [ ] Test 12: validateToken() - invalid signature → Should return false
- [ ] Test 13: validateToken() - malformed token → Should return false
- [ ] Test 14: validateToken() - null token → Should return false

**4.4 Token Expiration**
- [ ] Test 15: isTokenExpired() - valid token → Should return false
- [ ] Test 16: isTokenExpired() - expired token → Should return true
- [ ] Test 17: extractExpiration() - valid token → Should return future date
- [ ] Test 18: extractExpiration() - expired token → Should return past date

**Dependencies to Mock:**
- [ ] None (pure utility class, use real JWT library)

**Special Considerations:**
- [ ] Test with real io.jsonwebtoken library
- [ ] Create tokens with different expiration times
- [ ] Test signature validation
- [ ] Test token structure

**Success Criteria:**
- [ ] All tests passing
- [ ] Coverage ≥ 90%
- [ ] All security scenarios covered
- [ ] Token generation/validation tested

**Notes:**
- Critical for security
- No mocking needed (pure logic)
- Test expired tokens carefully
- Ensure signature validation works

---

### **PHASE 3: Controller Layer Testing** (MEDIUM PRIORITY ⭐⭐)

**Note:** Controller tests are Integration Tests using MockMvc

---

#### **5. UserControllerTest.java** 🔲 TODO

**File Location:** `src/test/java/com/registrationform/api/controller/UserControllerTest.java`
**Status:** 🔲 NOT STARTED
**Priority:** ⭐⭐ MEDIUM
**Estimated Time:** 45-60 minutes
**Complexity:** Medium-High
**Type:** Integration Test
**Target Coverage:** 75%+

**Test Cases to Implement:**

**5.1 GET Endpoints**
- [ ] Test 1: GET /api/users → 200 OK with list of users
- [ ] Test 2: GET /api/users (empty) → 200 OK with empty array
- [ ] Test 3: GET /api/users/{id} - user exists → 200 OK with user data
- [ ] Test 4: GET /api/users/{id} - user not found → 404 Not Found
- [ ] Test 5: GET /api/users/{id} - invalid ID format → 400 Bad Request

**5.2 POST Endpoints**
- [ ] Test 6: POST /api/users - valid data → 201 Created with location header
- [ ] Test 7: POST /api/users - missing required field → 400 Bad Request
- [ ] Test 8: POST /api/users - invalid email format → 400 Bad Request
- [ ] Test 9: POST /api/users - duplicate email → 409 Conflict

**5.3 PUT Endpoints**
- [ ] Test 10: PUT /api/users/{id} - valid update → 200 OK with updated user
- [ ] Test 11: PUT /api/users/{id} - user not found → 404 Not Found
- [ ] Test 12: PUT /api/users/{id} - invalid data → 400 Bad Request

**5.4 DELETE Endpoints**
- [ ] Test 13: DELETE /api/users/{id} - user exists → 204 No Content
- [ ] Test 14: DELETE /api/users/{id} - user not found → 404 Not Found

**Tools & Annotations:**
- [ ] @WebMvcTest(UserController.class)
- [ ] @MockBean for services
- [ ] MockMvc for HTTP requests
- [ ] ObjectMapper for JSON

**Success Criteria:**
- [ ] All HTTP status codes correct
- [ ] Request/Response JSON validated
- [ ] Error messages tested
- [ ] Coverage ≥ 75%

**Notes:**
- Integration test (not pure unit test)
- Test HTTP layer
- Mock service layer
- Validate JSON request/response

---

#### **6. ProfileControllerTest.java** 🔲 TODO

**File Location:** `src/test/java/com/registrationform/api/controller/ProfileControllerTest.java`
**Status:** 🔲 NOT STARTED
**Priority:** ⭐⭐ MEDIUM
**Estimated Time:** 45-60 minutes
**Complexity:** Medium-High
**Type:** Integration Test
**Target Coverage:** 75%+

**Test Cases to Implement:**

**6.1 GET Profile**
- [ ] Test 1: GET /api/profile - authenticated → 200 OK with user profile
- [ ] Test 2: GET /api/profile - not authenticated → 401 Unauthorized
- [ ] Test 3: GET /api/profile - invalid token → 401 Unauthorized

**6.2 UPDATE Profile**
- [ ] Test 4: PUT /api/profile - valid data → 200 OK with updated profile
- [ ] Test 5: PUT /api/profile - invalid data → 400 Bad Request
- [ ] Test 6: PUT /api/profile - not authenticated → 401 Unauthorized

**6.3 Profile Picture Upload**
- [ ] Test 7: POST /api/profile/picture - valid PNG → 200 OK with image URL
- [ ] Test 8: POST /api/profile/picture - valid JPEG → 200 OK with image URL
- [ ] Test 9: POST /api/profile/picture - invalid type (PDF) → 400 Bad Request
- [ ] Test 10: POST /api/profile/picture - file too large → 400 Bad Request
- [ ] Test 11: POST /api/profile/picture - no file → 400 Bad Request
- [ ] Test 12: POST /api/profile/picture - not authenticated → 401 Unauthorized

**6.4 Profile Picture Delete**
- [ ] Test 13: DELETE /api/profile/picture - has picture → 204 No Content
- [ ] Test 14: DELETE /api/profile/picture - no picture → 404 Not Found
- [ ] Test 15: DELETE /api/profile/picture - not authenticated → 401 Unauthorized

**Tools & Annotations:**
- [ ] @WebMvcTest(ProfileController.class)
- [ ] @MockBean for services
- [ ] MockMvc for HTTP requests
- [ ] MockMultipartFile for file upload testing
- [ ] ObjectMapper for JSON

**Special Testing:**
- [ ] Multipart file upload
- [ ] Authentication/Authorization
- [ ] File validation
- [ ] Response headers

**Success Criteria:**
- [ ] All HTTP status codes correct
- [ ] File upload tested
- [ ] Authentication tested
- [ ] Coverage ≥ 75%

**Notes:**
- Test file upload with MockMultipartFile
- Test authentication flow
- Mock FileStorageService
- Validate content-type headers

---

### **PHASE 4: Utility/Helper Testing** (LOW PRIORITY ⭐)

---

#### **7. ValidationUtilTest.java** 🔲 TODO (OPTIONAL)

**File Location:** `src/test/java/com/registrationform/api/util/ValidationUtilTest.java`
**Status:** 🔲 NOT STARTED
**Priority:** ⭐ LOW (Optional)
**Estimated Time:** 20-30 minutes
**Complexity:** Low
**Target Coverage:** 90%+

**Test Cases to Implement (if ValidationUtil exists):**

**7.1 Email Validation**
- [ ] Test 1: validateEmail() - valid email → Should return true
- [ ] Test 2: validateEmail() - invalid format → Should return false
- [ ] Test 3: validateEmail() - missing @ → Should return false
- [ ] Test 4: validateEmail() - null → Should return false
- [ ] Test 5: validateEmail() - empty string → Should return false

**7.2 Password Validation**
- [ ] Test 6: validatePassword() - strong password → Should return true
- [ ] Test 7: validatePassword() - weak password → Should return false
- [ ] Test 8: validatePassword() - too short → Should return false
- [ ] Test 9: validatePassword() - no special char → Should return false
- [ ] Test 10: validatePassword() - null → Should return false

**7.3 Phone Number Validation**
- [ ] Test 11: validatePhone() - valid format → Should return true
- [ ] Test 12: validatePhone() - invalid format → Should return false

**Dependencies to Mock:**
- [ ] None (pure utility)

**Success Criteria:**
- [ ] All validation rules tested
- [ ] Edge cases covered
- [ ] Coverage ≥ 90%

**Notes:**
- Only if ValidationUtil class exists
- Low priority
- Quick to implement

---

## 📈 Progress Tracking

### Overall Progress

```
┌────────────────────────────────────────────────┐
│ Test Files Progress                            │
├────────────────────────────────────────────────┤
│ ✅ AuthServiceTest           [████████████] 100%│
│ 🔲 UserServiceTest           [            ]   0%│
│ 🔲 FileStorageServiceTest    [            ]   0%│
│ 🔲 JwtUtilTest              [            ]   0%│
│ 🔲 UserControllerTest        [            ]   0%│
│ 🔲 ProfileControllerTest     [            ]   0%│
│ 🔲 ValidationUtilTest        [            ]   0%│
├────────────────────────────────────────────────┤
│ Overall:                     [██          ]  14%│
└────────────────────────────────────────────────┘
```

### Test Cases Progress

```
Total Test Cases: ~60
Completed: 5
Remaining: ~55
Progress: 8%
```

### Time Tracking

```
Completed: 60 minutes (AuthServiceTest)
Estimated Remaining: 4-5 hours
Total Estimated: 5-6 hours
```

---

## 🎯 Priority Matrix

### Must Have (Phase 1 & 2)
```
⭐⭐⭐ AuthServiceTest         ✅ DONE
⭐⭐⭐ UserServiceTest         🔲 TODO (NEXT!)
⭐⭐⭐ FileStorageServiceTest  🔲 TODO
⭐⭐⭐ JwtUtilTest            🔲 TODO
```

### Should Have (Phase 3)
```
⭐⭐ UserControllerTest      🔲 TODO
⭐⭐ ProfileControllerTest   🔲 TODO
```

### Nice to Have (Phase 4)
```
⭐ ValidationUtilTest       🔲 TODO (Optional)
```

---

## ✅ Daily Checklist Template

**Copy this for daily tracking:**

```markdown
## Date: ____-____-____

### Today's Goal:
- [ ] Test File: ________________Test.java
- [ ] Estimated Time: ____ minutes
- [ ] Target: Complete _____ test cases

### Before Starting:
- [ ] Read existing code
- [ ] Understand dependencies
- [ ] Plan test cases
- [ ] Setup test file structure

### During Implementation:
- [ ] Create test class with @Mock and @InjectMocks
- [ ] Implement test cases one by one
- [ ] Run tests frequently
- [ ] Fix failing tests immediately

### After Implementation:
- [ ] All tests passing ✅
- [ ] Run coverage report
- [ ] Coverage ≥ target% ✅
- [ ] Commit & push to GitHub ✅
- [ ] Update this checklist ✅

### Notes:
___________________________________________
___________________________________________
```

---

## 🎓 Quality Checklist

**Before marking any test file as DONE, verify:**

### Code Quality
- [ ] All test methods have @Test annotation
- [ ] All test methods have @DisplayName with clear description
- [ ] Follows AAA pattern (Arrange-Act-Assert)
- [ ] Proper use of @Mock and @InjectMocks
- [ ] No hardcoded values (use constants or variables)
- [ ] Clear variable names

### Test Coverage
- [ ] All public methods tested
- [ ] Happy path tested
- [ ] Error paths tested
- [ ] Edge cases tested
- [ ] Null checks tested
- [ ] Coverage ≥ target%

### Documentation
- [ ] Comments in Indonesian for beginners
- [ ] Explanation of what's being tested
- [ ] Explanation of why it's being tested
- [ ] Example usage if needed

### Execution
- [ ] All tests passing ✅
- [ ] Fast execution (< 1 second per test)
- [ ] No flaky tests
- [ ] Can run independently
- [ ] Can run with all other tests

### Git
- [ ] Committed with descriptive message
- [ ] Pushed to GitHub
- [ ] Checklist updated

---

## 📊 Coverage Goals by Layer

```
Service Layer:
├── AuthService:        90%+  ✅ DONE
├── UserService:        85%+  🔲 TODO
└── FileStorageService: 80%+  🔲 TODO

Security Layer:
└── JwtUtil:           90%+  🔲 TODO

Controller Layer:
├── UserController:     75%+  🔲 TODO
└── ProfileController:  75%+  🔲 TODO

Overall Target:         80%+  🎯
```

---

## 🚀 Quick Reference

### Run Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=AuthServiceTest

# Run specific test method
mvn test -Dtest=AuthServiceTest#testLogin_ValidCredentials_ShouldReturnSuccessWithToken

# Run with coverage
mvn clean test jacoco:report
```

### View Coverage
```bash
# Generate coverage report
mvn clean test jacoco:report

# Open report in browser
open target/site/jacoco/index.html
```

### Commit Pattern
```bash
git add path/to/TestFile.java
git commit -m "test: add unit tests for [ClassName]

[Description of test cases]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push
```

---

## 📝 Notes & Learnings

### Lessons Learned
- _Add notes here as you implement tests_
- _Document challenges and solutions_
- _Record time spent vs estimated_

### Common Issues
- _Document recurring issues_
- _How to solve them_

### Best Practices Discovered
- _Add best practices you discover_
- _Patterns that work well_

---

## 🎉 Completion Checklist

**When ALL tests are done:**

- [ ] All 7 test files created
- [ ] All ~60 test cases implemented
- [ ] All tests passing ✅
- [ ] Overall coverage ≥ 80%
- [ ] Service layer coverage ≥ 90%
- [ ] Security layer coverage ≥ 85%
- [ ] Controller layer coverage ≥ 75%
- [ ] All files committed to Git
- [ ] All files pushed to GitHub
- [ ] Documentation updated
- [ ] Code review done (self or peer)
- [ ] Celebrate! 🎉

---

**Checklist Created:** 2025-11-06
**Last Updated:** 2025-11-06
**Status:** 1/7 Complete (14%)
**Next:** UserServiceTest.java
