# 🧪 Step 5.3: End-to-End Registration Flow Testing

**Date:** 2025-10-11
**Goal:** Test complete registration flow from Frontend → Backend → Database

---

## ✅ Pre-Test Checklist

- [x] Backend server running on port 8081
- [x] Frontend server running on port 3001
- [x] Database connected (registrationform_db)
- [x] Users table exists (currently 13 users)

---

## 📋 Test Scenarios

### Test 1: Registration with Valid Data ✅
**Objective:** Test normal registration flow

**Steps:**
1. Open browser: http://localhost:3001
2. Navigate to Registration Form page
3. Fill in form:
   - Full Name: `Test EndToEnd User`
   - Email: `testendtoend@example.com`
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`
4. Click "Register" button

**Expected Results:**
- ✅ Form submits successfully
- ✅ Success message appears
- ✅ JWT token generated and stored
- ✅ User redirected (if applicable)
- ✅ No console errors

**Database Verification:**
```sql
SELECT * FROM users WHERE email = 'testendtoend@example.com';
```

**Expected Database Record:**
- Full name matches input
- Email matches input
- Password is BCrypt hashed (starts with $2a$ or $2b$)
- created_at timestamp is current time

---

### Test 2: Duplicate Email Registration ⏳
**Objective:** Test duplicate email validation

**Steps:**
1. Try to register with same email: `testendtoend@example.com`
2. Fill all fields with valid data
3. Click "Register"

**Expected Results:**
- ❌ Registration fails
- ✅ Error message: "Email already exists" or similar
- ✅ User stays on registration form
- ✅ No new database record created

---

### Test 3: Password Mismatch ⏳
**Objective:** Test password confirmation validation

**Steps:**
1. Fill form with:
   - Full Name: `Mismatch Test`
   - Email: `mismatch@example.com`
   - Password: `Password123!`
   - Confirm Password: `Different123!`
2. Click "Register"

**Expected Results:**
- ❌ Form validation error
- ✅ Error message: "Passwords do not match"
- ✅ Form doesn't submit
- ✅ No API call made

---

### Test 4: Empty Fields Validation ⏳
**Objective:** Test required field validation

**Steps:**
1. Leave all fields empty
2. Click "Register"

**Expected Results:**
- ❌ Form validation errors
- ✅ Required field messages shown
- ✅ Form doesn't submit

---

### Test 5: Invalid Email Format ⏳
**Objective:** Test email format validation

**Steps:**
1. Fill form with invalid email: `notanemail`
2. Click "Register"

**Expected Results:**
- ❌ Email validation error
- ✅ Error message: "Invalid email format"
- ✅ Form doesn't submit

---

### Test 6: Weak Password ⏳
**Objective:** Test password strength validation (if implemented)

**Steps:**
1. Fill form with weak password: `123`
2. Click "Register"

**Expected Results:**
- Frontend validation catches weak password
- Or backend returns validation error

---

### Test 7: JWT Token Verification ⏳
**Objective:** Verify JWT token is generated and valid

**Steps:**
1. Register successfully with new email
2. Open Browser DevTools → Application/Storage → Local Storage
3. Check for JWT token

**Expected Results:**
- ✅ Token exists in localStorage/sessionStorage
- ✅ Token format: `header.payload.signature`
- ✅ Token can be decoded (jwt.io)
- ✅ Token contains user email and expiration

---

### Test 8: Network Error Handling ⏳
**Objective:** Test behavior when backend is down

**Steps:**
1. Stop backend server
2. Try to register
3. Start backend server again

**Expected Results:**
- ✅ Error message: "Cannot connect to server" or similar
- ✅ Loading state handled properly
- ✅ No app crash

---

## 📊 Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| Valid Registration | ⏳ Pending | |
| Duplicate Email | ⏳ Pending | |
| Password Mismatch | ⏳ Pending | |
| Empty Fields | ⏳ Pending | |
| Invalid Email | ⏳ Pending | |
| Weak Password | ⏳ Pending | |
| JWT Token | ⏳ Pending | |
| Network Error | ⏳ Pending | |

---

## 🐛 Issues Found

None yet.

---

## ✅ Success Criteria

- [ ] Valid registration creates user in database
- [ ] Duplicate email is rejected
- [ ] Password validation works
- [ ] Form validation prevents bad data
- [ ] JWT token is generated
- [ ] Error handling works properly
- [ ] No console errors
- [ ] No backend errors

---

## 🔍 How to Monitor During Testing

### Monitor Database (Real-time):
```bash
# Watch users table
watch -n 2 'psql -U isnendyankp -d registrationform_db -c "SELECT id, full_name, email, created_at FROM users ORDER BY id DESC LIMIT 5;"'
```

### Monitor Backend Logs:
Check terminal where backend is running for SQL logs and errors.

### Monitor Browser Console:
Open DevTools → Console tab for any JavaScript errors or API responses.

---

## 📝 Notes for Pemula

**Apa itu End-to-End Testing?**
End-to-end testing adalah testing yang menguji seluruh flow aplikasi dari awal sampai akhir, termasuk UI, API, dan Database.

**Analogi:**
Seperti test membeli barang online:
1. Klik barang di website (UI/Frontend)
2. Kirim order ke toko (API call)
3. Toko simpan pesanan (Database)
4. Dapat konfirmasi (Response)

**Kenapa Penting?**
- Memastikan semua komponen bekerja sama dengan baik
- Menemukan bug yang tidak terlihat di unit testing
- Validate user experience sebenarnya

**Flow Registration:**
```
User → Fill Form → Click Register
  → Frontend validation
  → API call (/api/auth/register)
  → Backend validation
  → Hash password (BCrypt)
  → Save to database
  → Generate JWT token
  → Return response
  → Frontend shows success/error
```
