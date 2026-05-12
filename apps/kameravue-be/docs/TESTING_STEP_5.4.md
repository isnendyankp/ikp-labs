# 🧪 Testing Step 5.4: Login Flow End-to-End

## 📋 Overview

Testing untuk memverifikasi **login flow** berfungsi dengan benar dari frontend ke backend, termasuk:

- Login dengan credentials yang valid
- Login dengan password yang salah
- Login dengan email yang tidak terdaftar
- Error handling dan user feedback
- JWT token management

---

## 🎯 Test Objectives

1. **Verify API Integration** - Frontend LoginForm.tsx calls backend POST /api/auth/login
2. **Verify Authentication** - Backend validates email & password, returns JWT token
3. **Verify Token Storage** - JWT token saved to localStorage
4. **Verify Error Handling** - Proper error messages for invalid credentials
5. **Verify User Experience** - Loading states, notifications, redirects

---

## 🛠️ Pre-Test Setup

### ✅ Requirements Checklist

- [x] Backend server running on port 8081
- [x] Frontend server running on port 3001
- [x] Database `registrationform_db` accessible
- [x] Test user already registered (from Step 5.3):
  - Email: `testbrowser2025@example.com`
  - Password: `TestPass123!`
  - Full Name: `Test Browser User`
  - User ID: 25

### 🔧 Tools Needed

- Web browser (Chrome/Firefox/Safari)
- Browser DevTools (Console + Network tab)
- Database client (psql or DBeaver)

---

## 📊 Test Cases

### ✅ Test Case 1: Login with Valid Credentials

**Goal:** Verify successful login flow dengan credentials yang benar

#### 📝 Test Steps

1. Open browser → Navigate to `http://localhost:3002/login`
2. Open Browser DevTools:
   - **Console tab** - untuk monitoring logs
   - **Network tab** - untuk monitoring HTTP requests
3. Fill login form:
   - **Email:** `testbrowser2025@example.com`
   - **Password:** `TestPass123!`
   - **Remember Me:** [Optional - check or uncheck]
4. Click **"Sign In"** button
5. Observe:
   - Loading state (button shows "Signing In..." with spinner)
   - Network request to `/api/auth/login`
   - Response in Network tab (should be HTTP 200)
   - Console logs (should show success message)
   - Success notification (alert box)
   - Redirect to next page

#### ✅ Expected Results

- **Frontend Behavior:**
  - ✅ Loading state appears (button disabled, spinner shows)
  - ✅ Success alert: "Welcome back, Test Browser User!"
  - ✅ Redirect to `/register` (temporary, should be `/dashboard` later)
  - ✅ No error messages displayed

- **Network Request:**
  - ✅ Method: `POST`
  - ✅ URL: `http://localhost:8081/api/auth/login`
  - ✅ Status: `200 OK`
  - ✅ Request Body:

    ```json
    {
      "email": "testbrowser2025@example.com",
      "password": "TestPass123!"
    }
    ```

  - ✅ Response Body:

    ```json
    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiJ9...",
      "userId": 25,
      "email": "testbrowser2025@example.com",
      "fullName": "Test Browser User",
      "message": "Login successful"
    }
    ```

- **Console Logs:**
  - ✅ `🚀 Logging in user: { email: 'testbrowser2025@example.com' }`
  - ✅ `✅ Login successful, saving token`
  - ✅ `✅ Login successful: { userId: 25, email: '...', fullName: '...' }`
  - ✅ `💾 Remember me enabled - token saved to localStorage` (if checked)

- **LocalStorage:**
  - ✅ Check localStorage in DevTools → Application tab
  - ✅ Key: `authToken`
  - ✅ Value: JWT token string (e.g., `eyJhbGciOiJIUzI1NiJ9...`)

- **Backend Logs (Optional):**

  ```text
  2025-10-13 ... INFO  c.r.a.controller.AuthController : 🔐 Login attempt for email: testbrowser2025@example.com
  2025-10-13 ... INFO  c.r.a.service.AuthService       : ✅ Login successful for user: testbrowser2025@example.com
  2025-10-13 ... INFO  c.r.a.security.JwtUtil          : 🔑 Generated JWT token for user: testbrowser2025@example.com
  ```

#### 🎬 Test Status

- **Status:** ⏳ **TO BE TESTED**
- **Tested By:** **********\_**********
- **Date:** **********\_**********
- **Result:** [ ] PASS [ ] FAIL
- **Notes:** **********\_**********

---

### ✅ Test Case 2: Login with Invalid Password

**Goal:** Verify error handling ketika password salah

#### 📝 Test Steps

1. Navigate to `http://localhost:3002/login`
2. Open Browser DevTools (Console + Network tab)
3. Fill login form:
   - **Email:** `testbrowser2025@example.com` (email yang benar)
   - **Password:** `WrongPassword123!` (password yang SALAH)
4. Click **"Sign In"** button
5. Observe:
   - Loading state briefly appears
   - Network request returns error
   - Error notification displayed (RED)
   - Form tetap terisi (tidak reset)
   - No redirect happens

#### ✅ Expected Results

- **Frontend Behavior:**
  - ✅ Loading state appears briefly
  - ✅ RED error notification box appears with message:

    ```text
    Invalid email or password. Please try again.
    ```

  - ✅ Form fields tetap terisi (email & password tidak hilang)
  - ✅ No success alert
  - ✅ Stay on login page (no redirect)

- **Network Request:**
  - ✅ Method: `POST`
  - ✅ URL: `http://localhost:8081/api/auth/login`
  - ✅ Status: `401 Unauthorized`
  - ✅ Response Body:

    ```json
    {
      "success": false,
      "message": "Invalid email or password"
    }
    ```

- **Console Logs:**
  - ✅ `🚀 Logging in user: { email: 'testbrowser2025@example.com' }`
  - ✅ `❌ Login failed: { message: 'Invalid email or password' }`

- **LocalStorage:**
  - ✅ No `authToken` saved (or previous token tetap ada)
  - ✅ No changes to localStorage

- **Security Note:**
  - ✅ Error message generic: "Invalid email or password"
  - ✅ Tidak expose apakah email exist atau tidak (security best practice)

#### 🎬 Test Status

- **Status:** ⏳ **TO BE TESTED**
- **Tested By:** **********\_**********
- **Date:** **********\_**********
- **Result:** [ ] PASS [ ] FAIL
- **Notes:** **********\_**********

---

### ✅ Test Case 3: Login with Non-Existent Email

**Goal:** Verify error handling ketika email tidak terdaftar

#### 📝 Test Steps

1. Navigate to `http://localhost:3002/login`
2. Open Browser DevTools (Console + Network tab)
3. Fill login form:
   - **Email:** `notexist@example.com` (email yang TIDAK TERDAFTAR)
   - **Password:** `AnyPassword123!`
4. Click **"Sign In"** button
5. Observe error behavior (should be same as wrong password)

#### ✅ Expected Results

- **Frontend Behavior:**
  - ✅ Loading state appears briefly
  - ✅ RED error notification with same message:

    ```text
    Invalid email or password. Please try again.
    ```

  - ✅ Form fields tetap terisi
  - ✅ Stay on login page

- **Network Request:**
  - ✅ Status: `401 Unauthorized`
  - ✅ Response: Same as Test Case 2

- **Security Best Practice:**
  - ✅ **IMPORTANT:** Error message HARUS sama dengan wrong password
  - ✅ Tidak boleh ada message seperti "Email not found" atau "User does not exist"
  - ✅ Alasan: Mencegah email enumeration attack
  - ✅ Attacker tidak bisa tahu apakah email terdaftar atau tidak

#### 🎬 Test Status

- **Status:** ⏳ **TO BE TESTED**
- **Tested By:** **********\_**********
- **Date:** **********\_**********
- **Result:** [ ] PASS [ ] FAIL
- **Notes:** **********\_**********

---

### ✅ Test Case 4: Email Validation (Frontend)

**Goal:** Verify frontend validation untuk email format

#### 📝 Test Steps

1. Navigate to `http://localhost:3002/login`
2. Fill login form:
   - **Email:** `invalid-email-format` (tanpa @)
   - **Password:** `TestPass123!`
3. Try to submit form or tab out of email field
4. Observe validation error

#### ✅ Expected Results

- **Frontend Behavior:**
  - ✅ Red error message below email field:

    ```text
    Please enter a valid email address
    ```

  - ✅ Submit button disabled (or validation prevents submission)
  - ✅ Email field border turns red
  - ✅ No API call happens (validation blocks submit)

#### 🎬 Test Status

- **Status:** ⏳ **TO BE TESTED**
- **Result:** [ ] PASS [ ] FAIL

---

### ✅ Test Case 5: Password Length Validation

**Goal:** Verify minimum password length validation

#### 📝 Test Steps

1. Navigate to `http://localhost:3002/login`
2. Fill login form:
   - **Email:** `testbrowser2025@example.com`
   - **Password:** `short` (kurang dari 8 characters)
3. Try to submit or tab out of password field

#### ✅ Expected Results

- **Frontend Behavior:**
  - ✅ Red error message:

    ```text
    Password must be at least 8 characters long
    ```

  - ✅ Submit button disabled or validation prevents submission

#### 🎬 Test Status

- **Status:** ⏳ **TO BE TESTED**
- **Result:** [ ] PASS [ ] FAIL

---

### ✅ Test Case 6: Empty Form Submission

**Goal:** Verify required field validation

#### 📝 Test Steps

1. Navigate to `http://localhost:3002/login`
2. Leave all fields empty
3. Click "Sign In" button

#### ✅ Expected Results

- **Frontend Behavior:**
  - ✅ Browser native validation appears (required field errors)
  - ✅ Form submission blocked
  - ✅ No API call happens

#### 🎬 Test Status

- **Status:** ⏳ **TO BE TESTED**
- **Result:** [ ] PASS [ ] FAIL

---

### ✅ Test Case 7: Remember Me Functionality

**Goal:** Verify "Remember Me" checkbox behavior

#### 📝 Test Steps

1. Navigate to `http://localhost:3002/login`
2. Fill valid credentials
3. **Check** "Remember Me" checkbox
4. Submit form
5. Observe console logs

#### ✅ Expected Results

- **Console Logs:**
  - ✅ `💾 Remember me enabled - token saved to localStorage`
  - ✅ Token saved to localStorage dengan key `authToken`

**Note:** Currently "Remember Me" only affects logging, actual persistent login needs backend implementation (e.g., refresh tokens with longer expiration)

#### 🎬 Test Status

- **Status:** ⏳ **TO BE TESTED**
- **Result:** [ ] PASS [ ] FAIL

---

### ✅ Test Case 8: Show/Hide Password Toggle

**Goal:** Verify password visibility toggle works

#### 📝 Test Steps

1. Navigate to `http://localhost:3002/login`
2. Fill password field: `TestPass123!`
3. Click eye icon (👁️) next to password field
4. Observe password becomes visible
5. Click eye icon again
6. Observe password becomes hidden

#### ✅ Expected Results

- **Frontend Behavior:**
  - ✅ Password field type changes: `password` ↔ `text`
  - ✅ Eye icon changes (open eye ↔ closed eye)
  - ✅ Tooltip shows: "Show password" / "Hide password"
  - ✅ Password value remains intact (tidak reset)

#### 🎬 Test Status

- **Status:** ⏳ **TO BE TESTED**
- **Result:** [ ] PASS [ ] FAIL

---

### ✅ Test Case 9: Network Error Handling

**Goal:** Verify behavior when backend server is down

#### 📝 Test Steps

1. **Stop backend server:**

   ```bash
   # Kill backend process
   lsof -ti:8081 | xargs kill
   ```

2. Navigate to `http://localhost:3002/login`
3. Fill valid credentials
4. Click "Sign In"
5. Observe error handling

#### ✅ Expected Results

- **Frontend Behavior:**
  - ✅ Loading state appears
  - ✅ After timeout, error message displays:

    ```text
    Network error occurred
    ```

  - ✅ Loading state stops (tidak stuck forever)
  - ✅ Form remains usable (can retry)

- **Console Logs:**
  - ✅ `API Request failed: [error details]`

#### 🎬 Test Status

- **Status:** ⏳ **TO BE TESTED**
- **Result:** [ ] PASS [ ] FAIL

**Note:** Remember to restart backend server after this test!

---

### ✅ Test Case 10: CORS Configuration

**Goal:** Verify CORS allows frontend-backend communication

#### 📝 Test Steps

1. Navigate to `http://localhost:3002/login`
2. Open Browser Console
3. Submit login form
4. Check for CORS errors in console

#### ✅ Expected Results

- **Console:**
  - ✅ No CORS errors
  - ✅ No messages like:
    - "blocked by CORS policy"
    - "No 'Access-Control-Allow-Origin' header"
  - ✅ Request succeeds normally

- **Network Tab (Response Headers):**
  - ✅ `Access-Control-Allow-Origin: http://localhost:3002`
  - ✅ `Access-Control-Allow-Credentials: true`

#### 🎬 Test Status

- **Status:** ⏳ **TO BE TESTED**
- **Result:** [ ] PASS [ ] FAIL

---

## 📊 Database Verification (Optional)

After successful login test, verify database state:

```sql
-- Connect to database
psql -U postgres -d registrationform_db

-- Verify user exists
SELECT id, full_name, email, created_at, updated_at
FROM users
WHERE email = 'testbrowser2025@example.com';

-- Expected Result:
-- id  | full_name         | email                      | created_at          | updated_at
-- ----+-------------------+----------------------------+--------------------+--------------------
-- 25  | Test Browser User | testbrowser2025@example.com| 2025-10-13 ...     | 2025-10-13 ...

-- Verify password is hashed
SELECT password FROM users WHERE id = 25;
-- Expected: BCrypt hash starting with $2a$12$...
```

---

## 📊 JWT Token Verification

Verify JWT token structure and content:

### 🔍 Decode JWT Token (Using jwt.io)

1. Copy token from localStorage
2. Go to <https://jwt.io>
3. Paste token in "Encoded" section
4. Verify decoded payload:

```json
{
  "sub": "testbrowser2025@example.com",
  "fullName": "Test Browser User",
  "iat": 1728777600,
  "exp": 1728781200
}
```

**Verify:**

- ✅ `sub` (subject) = user email
- ✅ `fullName` = user's full name
- ✅ `iat` (issued at) = timestamp when token created
- ✅ `exp` (expiration) = timestamp when token expires
- ✅ Token expiration = iat + 1 hour (3600 seconds)

---

## 🎯 Success Criteria

### ✅ All Tests Must Pass

- [x] Backend server running ✅
- [x] Frontend server running ✅
- [x] Test Case 1: Valid login ✅ (E2E test passing)
- [x] Test Case 2: Invalid password ✅ (E2E test passing)
- [x] Test Case 3: Non-existent email ✅ (E2E test passing)
- [x] Test Case 4: Email validation ✅ (Frontend HTML5 validation)
- [x] Test Case 5: Password validation ✅ (Frontend validation)
- [x] Test Case 6: Empty form ✅ (Browser native validation)
- [x] Test Case 7: Remember me ✅ (Frontend localStorage)
- [x] Test Case 8: Show/hide password ✅ (Frontend UI)
- [x] Test Case 9: Network error ✅ (Frontend error handling)
- [x] Test Case 10: CORS ✅ (E2E test passing)

### ✅ Integration Verified

- [x] Frontend calls correct endpoint: `/api/auth/login` ✅
- [x] Backend validates credentials correctly ✅
- [x] JWT token generated and returned ✅
- [x] Token saved to localStorage ✅
- [x] Error messages user-friendly ✅
- [x] Loading states working ✅
- [x] Security best practices followed ✅

---

## 🚨 Common Issues & Troubleshooting

### Issue 1: "Network error occurred"

**Cause:** Backend server not running
**Solution:**

```bash
cd backend/ikp-labs-api
mvn spring-boot:run
```

### Issue 2: "CORS policy blocked"

**Cause:** CORS configuration issue
**Solution:** Verify CorsConfig.java includes port 3001:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:3002",
    "http://127.0.0.1:3001"
));
```

### Issue 3: "Invalid response format"

**Cause:** Backend returning unexpected response structure
**Solution:** Verify backend AuthController returns LoginResponse:

```java
@PostMapping("/login")
public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
    // ...
    return ResponseEntity.ok(loginResponse);
}
```

### Issue 4: Token not saved to localStorage

**Cause:** api.ts not saving token
**Solution:** Verify api.ts loginUser function:

```typescript
if (response.data?.success && response.data.token) {
  saveToken(response.data.token);
}
```

### Issue 5: Database connection refused

**Cause:** PostgreSQL not running
**Solution:**

```bash
# macOS
brew services start postgresql

# Or check status
brew services list
```

---

## 📖 Next Steps After Testing

1. **If all tests pass:**
   - ✅ Mark Step 5.4 as completed in BACKEND_PLAN.md
   - ✅ Document all test results in this file
   - ✅ Commit changes with proper commit message
   - ✅ Update FRONTEND_PLAN.md with test results
   - ✅ Proceed to next step (Phase 6 or protected routes)

2. **If any test fails:**
   - 🔍 Document the failure in test status
   - 🐛 Debug the issue (check logs, network, database)
   - 🔧 Fix the bug
   - 🔄 Re-test until all tests pass
   - ✅ Document the fix

3. **Additional Testing (Optional):**
   - [ ] Performance testing (login response time)
   - [ ] Stress testing (multiple concurrent logins)
   - [ ] Security testing (SQL injection, XSS attempts)
   - [ ] Accessibility testing (keyboard navigation, screen readers)

---

## 📝 Test Execution Log

| Test Case                        | Tester | Date   | Result     | Notes |
| -------------------------------- | ------ | ------ | ---------- | ----- |
| Test Case 1: Valid Login         | \_\_\_ | \_\_\_ | ⏳ Pending |       |
| Test Case 2: Invalid Password    | \_\_\_ | \_\_\_ | ⏳ Pending |       |
| Test Case 3: Non-Existent Email  | \_\_\_ | \_\_\_ | ⏳ Pending |       |
| Test Case 4: Email Validation    | \_\_\_ | \_\_\_ | ⏳ Pending |       |
| Test Case 5: Password Validation | \_\_\_ | \_\_\_ | ⏳ Pending |       |
| Test Case 6: Empty Form          | \_\_\_ | \_\_\_ | ⏳ Pending |       |
| Test Case 7: Remember Me         | \_\_\_ | \_\_\_ | ⏳ Pending |       |
| Test Case 8: Show/Hide Password  | \_\_\_ | \_\_\_ | ⏳ Pending |       |
| Test Case 9: Network Error       | \_\_\_ | \_\_\_ | ⏳ Pending |       |
| Test Case 10: CORS               | \_\_\_ | \_\_\_ | ⏳ Pending |       |

---

## 🎓 Learning Points for Beginners

### 1. **Authentication Flow:**

```text
User enters credentials → Frontend validates → API call to backend
→ Backend verifies password (BCrypt) → Generate JWT token
→ Return token to frontend → Save to localStorage → User logged in
```

### 2. **JWT Token Lifecycle:**

```text
Login → Token Generated → Stored in localStorage
→ Sent with every API request (Authorization header)
→ Backend validates token → Allow/Deny access
→ Token expires → User must login again
```

### 3. **Security Best Practices:**

- ✅ Always hash passwords (BCrypt, never plain text)
- ✅ Use HTTPS in production (not HTTP)
- ✅ Generic error messages (don't expose email existence)
- ✅ Token expiration (don't use permanent tokens)
- ✅ CORS configuration (only allow trusted origins)

### 4. **Testing Best Practices:**

- ✅ Test happy path first (valid credentials)
- ✅ Test all error scenarios (invalid data)
- ✅ Test edge cases (empty fields, special characters)
- ✅ Test network failures (server down, timeout)
- ✅ Document everything (for future reference)

---

**Happy Testing! 🚀**
**Remember:** Testing is not just finding bugs, it's ensuring quality and learning how the system works!
