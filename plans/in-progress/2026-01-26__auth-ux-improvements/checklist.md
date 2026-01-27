# Auth UX Improvements - Implementation Checklist

## Status: ✅ Phase 1 Complete | ✅ Phase 2 Complete | ✅ Phase 3 Complete | ✅ Phase 4 Complete | ✅ Phase 5 Complete | 🔄 Phase 6 Planning

**Phase 1** (Google Sign-in Toast) - COMPLETE
**Phase 2** (Registration Password Validation) - COMPLETE
**Phase 3** (User Feedback Fixes) - COMPLETE
**Phase 4** (Registration Google Sign-up Toast) - COMPLETE
**Phase 5** (Login Page UX Consistency) - COMPLETE
**Phase 6** (Backend Test Fixes) - NEW

---

# Phase 1: Google Sign-In Toast Notification ✅ COMPLETE

## Status Legend
- [ ] Not started
- [🔄] In progress
- [✅] Completed
- [⏸️] Blocked/Waiting

---

## Task 1: Read Current LoginForm Implementation (5 min) ✅

**Estimated Time**: 5 minutes

**Purpose**: Understand the current code structure before making changes.

**Steps**:
1. [x] Read `frontend/src/components/LoginForm.tsx`
2. [x] Locate the `handleGoogleSignIn` function
3. [x] Identify existing imports and hooks
4. [x] Verify toast system exists in codebase

**Verification**:
- [x] Current implementation: `console.log('Sign in with Google clicked')`
- [x] ToastContext exists at `@/context/ToastContext`
- [x] useToast hook is available

---

## Task 2: Import useToast Hook (2 min) ✅

**Estimated Time**: 2 minutes

**File**: `frontend/src/components/LoginForm.tsx`

**Steps**:
1. [x] Add import statement at top of file
2. [x] Verify no TypeScript errors
3. [x] **COMMIT**: "feat(login): import useToast hook for Google Sign-in feedback"

**Code to Add**:
```typescript
import { useToast } from '@/context/ToastContext';
```

**Acceptance Criteria**:
- [x] Import added correctly
- [x] No TypeScript errors
- [x] ESLint passes

---

## Task 3: Initialize Toast Hook (2 min) ✅

**Estimated Time**: 2 minutes

**File**: `frontend/src/components/LoginForm.tsx`

**Steps**:
1. [x] Add `const toast = useToast();` inside LoginForm component
2. [x] Place after other hooks (useState, useRouter, etc.)
3. [x] Verify hook is properly initialized
4. [x] **COMMIT**: "feat(login): initialize toast hook in LoginForm"

**Code to Add**:
```typescript
const toast = useToast();
```

**Acceptance Criteria**:
- [x] Hook initialized inside component
- [x] Placed after other hooks
- [x] No React hooks violations

---

## Task 4: Update handleGoogleSignIn Function (3 min) ✅

**Estimated Time**: 3 minutes

**File**: `frontend/src/components/LoginForm.tsx`

**Steps**:
1. [x] Replace `console.log()` with `toast.showInfo()`
2. [x] Add the informative message about OAuth
3. [x] Verify string concatenation is correct
4. [x] **COMMIT**: "feat(login): add toast notification for Google Sign-in placeholder"

**Code to Replace**:
```typescript
// BEFORE
const handleGoogleSignIn = () => {
  console.log('Sign in with Google clicked');
};

// AFTER
const handleGoogleSignIn = () => {
  toast.showInfo(
    'Google OAuth authentication is planned for future development. ' +
    'This is a learning project - currently only email/password authentication is available.'
  );
};
```

**Acceptance Criteria**:
- [x] console.log is removed
- [x] toast.showInfo() is called
- [x] Message is clear and informative
- [x] String concatenation is correct

---

## Task 5: Manual Testing (5 min) ✅

**Estimated Time**: 5 minutes

**Purpose**: Verify the implementation works correctly.

**Test Cases**:

### Test 1: Toast Appears
1. [x] Start frontend dev server
2. [x] Navigate to login page
3. [x] Click "Sign in with Google" button
4. [x] **Expected**: Blue toast appears

### Test 2: Toast Message Correct
1. [x] Read the toast message
2. [x] **Expected**: "Google OAuth authentication is planned..."
3. [x] **Expected**: "This is a learning project..."

### Test 3: Toast Auto-Dismisses
1. [x] Click "Sign in with Google" button
2. [x] Wait 3 seconds
3. [x] **Expected**: Toast disappears automatically

### Test 4: Manual Close Works
1. [x] Click "Sign in with Google" button
2. [x] Click X button on toast
3. [x] **Expected**: Toast closes immediately

### Test 5: No Regression
1. [x] Try normal email/password login
2. [x] **Expected**: Login still works as before

---

## Task 6: Code Quality Checks (2 min) ✅

**Estimated Time**: 2 minutes

**Steps**:
1. [x] Run TypeScript compiler: `npx tsc --noEmit`
2. [x] Run ESLint: `npm run lint`
3. [x] Check for console errors in browser DevTools
4. [x] Verify no warnings

**Acceptance Criteria**:
- [x] No TypeScript errors (from my changes)
- [x] No ESLint violations (from my changes)
- [x] No console errors
- [x] No console warnings

---

## Task 7: Final Verification & Documentation (3 min) ✅

**Estimated Time**: 3 minutes

**Steps**:
1. [x] Verify all commits are pushed
2. [x] Update plan status to complete
3. [ ] Move plan to `plans/done/` (after Phase 2 also complete)

**Final Checks**:
- [x] All tasks completed
- [x] All tests pass
- [x] Code is clean
- [x] Documentation updated

---

## Phase 1 Atomic Commit Summary ✅ COMPLETE

**Total Tasks**: 7
**Actual Time**: ~15 minutes
**Total Commits**: 3 (all pushed)

### Commits Completed:

1. ✅ **df9da04** feat(login): import useToast hook for Google Sign-in feedback
   - File: `LoginForm.tsx`
   - Change: Added import statement

2. ✅ **e3128e5** feat(login): initialize toast hook in LoginForm
   - File: `LoginForm.tsx`
   - Change: Added `const toast = useToast();`

3. ✅ **6b160a1** feat(login): add toast notification for Google Sign-in placeholder
   - File: `LoginForm.tsx`
   - Change: Replaced console.log with toast.showInfo()

### Files Modified:
- `frontend/src/components/LoginForm.tsx` (3 atomic commits)

### Implementation Complete:
- ✅ Toast notification appears when Google Sign-in is clicked
- ✅ Informative message about OAuth being planned
- ✅ References learning project nature
- ✅ Uses existing toast notification system
- ✅ No TypeScript errors introduced
- ✅ All commits pushed to GitHub

---

# Phase 2: Registration Password Validation 🔄 NEW

## Status Legend
- [ ] Not started
- [🔄] In progress
- [✅] Completed
- [⏸️] Blocked/Waiting

---

## Task 1: Read RegistrationForm Implementation (5 min)

**Estimated Time**: 5 minutes

**Purpose**: Understand current registration form structure and validation.

**Steps**:
1. [ ] Read `frontend/src/components/RegistrationForm.tsx`
2. [ ] Locate password field validation
3. [ ] Check existing Zod schema
4. [ ] Check if PasswordStrengthIndicator component exists

**Verification**:
- [ ] Current Zod password schema: min 8 chars only
- [ ] Backend @ValidPassword requirements documented
- [ ] PasswordStrengthIndicator exists at `@/components/ui/PasswordStrengthIndicator.tsx`

---

## Task 2: Update Zod Password Schema (10 min)

**Estimated Time**: 10 minutes

**File**: `frontend/src/components/RegistrationForm.tsx`

**Steps**:
1. [ ] Locate `registrationSchema` definition
2. [ ] Update password field with 4 regex validations
3. [ ] Test regex patterns manually
4. [ ] **COMMIT**: "feat(register): add password complexity validation to Zod schema"

**Code to Change**:
```typescript
// BEFORE
password: z.string()
  .min(8, 'Password must be at least 8 characters long'),

// AFTER
password: z.string()
  .min(8, 'At least 8 characters')
  .regex(/[a-z]/, 'One lowercase letter (a-z)')
  .regex(/[A-Z]/, 'One uppercase letter (A-Z)')
  .regex(/[0-9]/, 'One number (0-9)')
  .regex(/[@$!%*?&]/, 'One special character (@$!%*?&)'),
```

**Acceptance Criteria**:
- [ ] All 4 regex patterns added
- [ ] Error messages are clear
- [ ] Matches backend @ValidPassword rules exactly
- [ ] No TypeScript errors

---

## Task 3: Check PasswordStrengthIndicator Component (5 min)

**Estimated Time**: 5 minutes

**Purpose**: Determine if existing component can be reused.

**Steps**:
1. [ ] Read `frontend/src/components/ui/PasswordStrengthIndicator.tsx`
2. [ ] Check component props interface
3. [ ] Determine if it supports requirements-based display
4. [ ] Decide: reuse OR create new component

**Decision Point**:
- [ ] If PasswordStrengthIndicator fits: Use it
- [ ] If PasswordStrengthIndicator doesn't fit: Create PasswordRequirementsGuide

---

## Task 4: Create/Integrate Password Requirements Guide (15 min)

**Estimated Time**: 15 minutes

**File**: `frontend/src/components/RegistrationForm.tsx`

**Option A: Reuse PasswordStrengthIndicator** (if it fits)
**Steps**:
1. [ ] Import PasswordStrengthIndicator
2. [ ] Add component after password field
3. [ ] Pass requirements array as props
4. [ ] **COMMIT**: "feat(register): add password requirements guide"

**Option B: Create New Component** (if needed)
**Steps**:
1. [ ] Create RequirementItem helper component
2. [ ] Add requirements guide UI after password field
3. [ ] Implement visual states (gray/green/red)
4. [ ] **COMMIT**: "feat(register): add password requirements guide"

**UI Structure**:
```typescript
<div className="mt-2 space-y-1">
  <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
  <ul className="space-y-1">
    <RequirementItem text="At least 8 characters" met={password.length >= 8} touched={touched} />
    <RequirementItem text="One lowercase letter (a-z)" met={/[a-z]/.test(password)} touched={touched} />
    <RequirementItem text="One uppercase letter (A-Z)" met={/[A-Z]/.test(password)} touched={touched} />
    <RequirementItem text="One number (0-9)" met={/[0-9]/.test(password)} touched={touched} />
    <RequirementItem text="One special character (@$!%*?&)" met={/[@$!%*?&]/.test(password)} touched={touched} />
  </ul>
</div>
```

**Acceptance Criteria**:
- [ ] Requirements guide visible below password field
- [ ] All 5 requirements listed
- [ ] Visual states work (gray/green/red)
- [ ] Updates in real-time as user types

---

## Task 5: Add Name Field Validation Hint (5 min)

**Estimated Time**: 5 minutes

**File**: `frontend/src/components/RegistrationForm.tsx`

**Steps**:
1. [ ] Locate name input field
2. [ ] Add "Min. 2 characters" hint below field
3. [ ] Style with subtle gray text
4. [ ] **COMMIT**: "feat(register): add name field validation hint"

**Code to Add**:
```typescript
<p className="mt-1 text-xs text-gray-500">Min. 2 characters</p>
```

**Acceptance Criteria**:
- [ ] Hint visible below name field
- [ ] Text is subtle but readable
- [ ] Doesn't clutter interface

---

## Task 6: Manual Testing (15 min)

**Estimated Time**: 15 minutes

**Purpose**: Verify all validation changes work correctly.

**Test Cases**:

### Test 1: Visual Feedback
1. [ ] Navigate to registration page
2. [ ] Click password field
3. [ ] **Expected**: All requirements show ⚪ gray icons

### Test 2: Real-time Updates
1. [ ] Type "a" in password field
2. [ ] **Expected**: Length gray, lowercase green, others red

### Test 3: All Requirements Met
1. [ ] Type "Password123!"
2. [ ] **Expected**: All 5 requirements show ✓ green

### Test 4: Submit with Invalid Password
1. [ ] Type "password" (no uppercase, digit, special)
2. [ ] Click submit
3. [ ] **Expected**: Form doesn't submit, errors shown

### Test 5: Backend Validation Parity
1. [ ] Create password: "Pass123!"
2. [ ] Fill form and submit
3. [ ] **Expected**: No backend validation error

### Test 6: Name Field Hint
1. [ ] View registration form
2. [ ] **Expected**: "Min. 2 characters" visible

### Test 7: No False Errors
1. [ ] Click password field, then click outside
2. [ ] **Expected**: No red errors (field empty = gray, not red)

---

## Task 7: Code Quality Checks (5 min)

**Estimated Time**: 5 minutes

**Steps**:
1. [ ] Run TypeScript compiler: `npx tsc --noEmit`
2. [ ] Run ESLint: `npm run lint`
3. [ ] Check for console errors in browser DevTools
4. [ ] Verify no performance issues (typing lag)

**Acceptance Criteria**:
- [ ] No TypeScript errors
- [ ] No ESLint violations
- [ ] No console errors
- [ ] No typing lag (smooth validation)

---

## Task 8: Final Verification & Documentation (5 min)

**Estimated Time**: 5 minutes

**Steps**:
1. [ ] Verify all commits are pushed
2. [ ] Update plan status to complete
3. [ ] Move plan to `plans/done/`

**Final Checks**:
- [ ] All tasks completed
- [ ] All tests pass
- [ ] Code is clean
- [ ] Documentation updated

---

## Phase 2 Atomic Commit Summary ✅ COMPLETE

**Total Tasks**: 8
**Actual Time**: ~45 minutes
**Total Commits**: 3 (all pushed)

### Commits Completed:

1. ✅ **f3edf90** feat(register): add password complexity validation to Zod schema
   - File: `RegistrationForm.tsx`
   - Change: Added 4 regex validations matching backend @ValidPassword

2. ✅ **0e76ef9** feat(register): add password requirements guide component
   - File: `PasswordRequirementsGuide.tsx` (new)
   - Change: Created visual requirements checklist with 3-state system

3. ✅ **8db3332** feat(register): add name field validation hint
   - File: `RegistrationForm.tsx`
   - Change: Added "Min. 2 characters" text below name field

---

# Phase 3: User Feedback Fixes 🔄 NEW

## Status Legend
- [ ] Not started
- [🔄] In progress
- [✅] Completed
- [⏸️] Blocked/Waiting

---

## Task 1: Fix Zod Validation Bug (10 min)

**Estimated Time**: 10 minutes

**Purpose**: Fix bug where only one validation error shows per field instead of all failures.

**Problem Identified**:
- User typed "test1234!" and clicked submit
- Expected: TWO errors (missing uppercase + wrong special char)
- Actual: Only ONE error (special char)

**Root Cause**: `Record<string, string>` only stores ONE message per field. Each error overwrites the previous.

**File**: `frontend/src/components/RegistrationForm.tsx`

**Steps**:
1. [ ] Locate error handling in handleSubmit (lines 122-128)
2. [ ] Modify loop to append multiple errors with semicolon separator
3. [ ] Test with "test1234!" to verify both errors show
4. [ ] **COMMIT**: "fix(register): show all Zod validation errors, not just the last one"

**Code to Change**:
```typescript
// BEFORE (buggy)
const newErrors: Record<string, string> = {};
error.issues.forEach((err) => {
  if (err.path && err.path.length > 0) {
    newErrors[err.path[0] as string] = err.message;  // Overwrites!
  }
});

// AFTER (fixed)
const newErrors: Record<string, string> = {};
error.issues.forEach((err) => {
  if (err.path && err.path.length > 0) {
    const field = err.path[0] as string;
    if (newErrors[field]) {
      newErrors[field] += '; ' + err.message;  // Append!
    } else {
      newErrors[field] = err.message;
    }
  }
});
```

**Acceptance Criteria**:
- [ ] All validation errors show for a field
- [ ] Errors separated by semicolon
- [ ] Test case "test1234!" shows both uppercase and special char errors

---

## Task 2: Add Placeholder Text - Option B (10 min)

**Estimated Time**: 10 minutes

**Purpose**: Add example placeholders to guide users (instead of generic text).

**User Choice**: Option B (Examples)
- Name: "John doe"
- Email: "Jhondoe@mail.com"
- Password: "Test1234!"

**File**: `frontend/src/components/RegistrationForm.tsx`

**Steps**:
1. [ ] Add `placeholder="John doe"` to name input (~line 204)
2. [ ] Add `placeholder="Jhondoe@mail.com"` to email input (~line 223)
3. [ ] Add `placeholder="Test1234!"` to password input (~line 243)
4. [ ] Verify placeholders disappear when typing
5. [ ] **COMMIT**: "feat(register): add placeholder examples to input fields"

**Code to Add**:
```typescript
// Name field
<input
  placeholder="John doe"  // ADD THIS
  // ... other props
/>

// Email field
<input
  placeholder="Jhondoe@mail.com"  // ADD THIS
  // ... other props
/>

// Password field
<input
  placeholder="Test1234!"  // ADD THIS
  // ... other props
/>
```

**Acceptance Criteria**:
- [ ] All placeholders visible before typing
- [ ] Placeholders have example values (not generic text)
- [ ] Placeholders disappear on user input
- [ ] Placeholder color is subtle (placeholder-gray-500)

---

## Task 3: Add Gray Background to Input Fields (5 min)

**Estimated Time**: 5 minutes

**Purpose**: Match Figma design reference with gray input backgrounds.

**File**: `frontend/src/components/RegistrationForm.tsx`

**Steps**:
1. [ ] Locate input className with `bg-transparent`
2. [ ] Replace with `bg-gray-100` on all 4 input fields
3. [ ] Verify no conflicts with error/focus states
4. [ ] **COMMIT**: "feat(register): add gray background to input fields"

**Code to Change**:
```typescript
// BEFORE
className={`... bg-transparent ...`}

// AFTER
className={`... bg-gray-100 ...`}
```

**Apply to 4 fields**:
- Name input (~line 203)
- Email input (~line 223)
- Password input (~line 243)
- Confirm Password input (~line 286)

**Acceptance Criteria**:
- [ ] All inputs have gray background
- [ ] Background consistent across fields
- [ ] Doesn't conflict with error state (red border)
- [ ] Doesn't conflict with focus state (black border)

---

## Task 4: Remove PasswordRequirementsGuide Component (5 min)

**Estimated Time**: 5 minutes

**Purpose**: Remove visual checklist since placeholder examples now guide users.

**File**: `frontend/src/components/RegistrationForm.tsx`

**Steps**:
1. [ ] Remove import statement (line 8)
2. [ ] Remove JSX usage (lines 268-271)
3. [ ] (Optional) Delete PasswordRequirementsGuide.tsx file
4. [ ] Verify form still validates correctly
5. [ ] **COMMIT**: "feat(register): remove PasswordRequirementsGuide component"

**Code to Remove**:
```typescript
// REMOVE import (line 8)
import { PasswordRequirementsGuide } from './ui/PasswordRequirementsGuide';

// REMOVE JSX (lines 268-271)
<PasswordRequirementsGuide
  password={formData.password}
  showError={!!errors.password}
/>
```

**Acceptance Criteria**:
- [ ] No visual checklist below password field
- [ ] No TypeScript errors
- [ ] Form validation still works
- [ ] Only placeholder guides user

---

## Task 5: Manual Testing (15 min)

**Estimated Time**: 15 minutes

**Purpose**: Verify all changes work correctly together.

### Test 1: Placeholder Text
1. [ ] Navigate to `/register`
2. [ ] Click name field → "John doe" shows
3. [ ] Click email field → "Jhondoe@mail.com" shows
4. [ ] Click password field → "Test1234!" shows
5. [ ] Type in each → placeholder disappears

### Test 2: Gray Background
1. [ ] All 4 fields have gray background
2. [ ] Background visible on page load
3. [ ] Error state shows gray + red border
4. [ ] Focus state shows gray + black border

### Test 3: Zod Bug Fix
1. [ ] Type "test1234!" in password
2. [ ] Fill other fields
3. [ ] Click submit
4. [ ] **Expected**: "One uppercase letter (A-Z); One special character (@$!%*?&)"

### Test 4: PasswordRequirementsGuide Removed
1. [ ] No checklist below password field
2. [ ] Only placeholder "Test1234!" guides user
3. [ ] Validation still works

### Test 5: Valid Submission
1. [ ] Use "Test1234!" as password
2. [ ] Fill all fields correctly
3. [ ] Submit → Should succeed

---

## Task 6: Code Quality Checks (5 min)

**Estimated Time**: 5 minutes

**Steps**:
1. [ ] Run TypeScript compiler: `npx tsc --noEmit`
2. [ ] Run ESLint: `npm run lint`
3. [ ] Check console for errors
4. [ ] Verify no performance issues

**Acceptance Criteria**:
- [ ] No TypeScript errors
- [ ] No ESLint violations
- [ ] No console errors
- [ ] Smooth typing experience

---

## Task 7: Final Verification & Documentation (5 min)

**Estimated Time**: 5 minutes

**Steps**:
1. [ ] Verify all commits pushed
2. [ ] Update plan status to complete
3. [ ] Move plan to `plans/done/`
4. [ ] Update summary table

**Final Checks**:
- [ ] All 7 tasks completed
- [ ] All tests pass
- [ ] Code is clean
- [ ] Documentation updated

---

## Phase 3 Atomic Commit Summary ✅ COMPLETE

**Total Tasks**: 7
**Actual Time**: ~30 minutes
**Total Commits**: 5 (all pushed)

### Commits Completed:

1. ✅ **28f11c9** fix(register): show all Zod validation errors
   - File: `RegistrationForm.tsx`
   - Change: Fixed error handling to append multiple errors with semicolon separator

2. ✅ **b08838f** feat(register): add placeholder examples to input fields
   - File: `RegistrationForm.tsx`
   - Change: Added "John doe", "Jhondoe@mail.com", "Test1234!" placeholders

3. ✅ **37956eb** feat(register): add gray background to input fields
   - File: `RegistrationForm.tsx`
   - Change: Replaced bg-transparent with bg-gray-100

4. ✅ **7c77ca6** feat(register): remove PasswordRequirementsGuide component
   - File: `RegistrationForm.tsx`
   - Change: Removed import and JSX usage

5. ✅ **4ffa103** chore(register): delete unused component
   - File: `PasswordRequirementsGuide.tsx` (deleted)
   - Change: Removed unused component file

---

# Phase 4: Registration Google Sign-up Toast ✅ COMPLETE

## Status Legend
- [ ] Not started
- [🔄] In progress
- [✅] Completed
- [⏸️] Blocked/Waiting

---

## Task 1: Read RegistrationForm Implementation (5 min) ✅

**Estimated Time**: 5 minutes

**Purpose**: Understand current Google Sign-up button implementation.

**Steps**:
1. [x] Read `frontend/src/components/RegistrationForm.tsx`
2. [x] Locate `handleGoogleSignup` function
3. [x] Verify useToast hook is available
4. [x] Check if similar to LoginForm implementation

**Verification**:
- [x] Current implementation: `console.log('Sign up with Google clicked')`
- [x] useToast hook available in codebase
- [x] Pattern similar to LoginForm Phase 1

---

## Task 2: Import useToast Hook (2 min) ✅

**Estimated Time**: 2 minutes

**File**: `frontend/src/components/RegistrationForm.tsx`

**Steps**:
1. [x] Add import statement at top of file
2. [x] Verify no TypeScript errors
3. [x] **COMMIT**: "feat(register): import useToast hook for Google Sign-up feedback"

**Code to Add**:
```typescript
import { useToast } from '@/context/ToastContext';
```

**Acceptance Criteria**:
- [x] Import added correctly
- [x] No TypeScript errors
- [x] ESLint passes

**Commit**: **a7bdc81** feat(register): import useToast hook for Google Sign-up feedback

---

## Task 3: Initialize Toast Hook (2 min) ✅

**Estimated Time**: 2 minutes

**File**: `frontend/src/components/RegistrationForm.tsx`

**Steps**:
1. [x] Add `const toast = useToast();` inside RegistrationForm component
2. [x] Place after other hooks (useState, useRouter, etc.)
3. [x] Verify hook is properly initialized
4. [x] **COMMIT**: "feat(register): initialize toast hook in RegistrationForm"

**Code to Add**:
```typescript
const toast = useToast();
```

**Acceptance Criteria**:
- [x] Hook initialized inside component
- [x] Placed after other hooks
- [x] No React hooks violations

**Commit**: **4d76598** feat(register): initialize toast hook in RegistrationForm

---

## Task 4: Update handleGoogleSignup Function (3 min) ✅

**Estimated Time**: 3 minutes

**File**: `frontend/src/components/RegistrationForm.tsx`

**Steps**:
1. [x] Replace `console.log()` with `toast.showInfo()`
2. [x] Add the informative message about OAuth
3. [x] Verify string concatenation is correct
4. [x] **COMMIT**: "feat(register): add toast notification for Google Sign-up placeholder"

**Code to Replace**:
```typescript
// BEFORE
const handleGoogleSignup = () => {
  console.log('Sign up with Google clicked');
};

// AFTER
const handleGoogleSignup = () => {
  toast.showInfo(
    'Google OAuth authentication is planned for future development. ' +
    'This is a learning project - currently only email/password authentication is available.'
  );
};
```

**Acceptance Criteria**:
- [x] console.log is removed
- [x] toast.showInfo() is called
- [x] Message is clear and informative
- [x] String concatenation is correct

**Commit**: **632703d** feat(register): add toast notification for Google Sign-up placeholder

---

## Task 5: Manual Testing (5 min) ✅

**Estimated Time**: 5 minutes

**Purpose**: Verify the implementation works correctly.

### Test 1: Toast Appears
1. [x] Navigate to registration page
2. [x] Click "Sign up with Google" button
3. [x] **Expected**: Blue toast appears

### Test 2: Toast Message Correct
1. [x] Read the toast message
2. [x] **Expected**: "Google OAuth authentication is planned..."
3. [x] **Expected**: "This is a learning project..."

### Test 3: Toast Auto-Dismisses
1. [x] Click "Sign up with Google" button
2. [x] Wait 3 seconds
3. [x] **Expected**: Toast disappears automatically

### Test 4: Manual Close Works
1. [x] Click "Sign up with Google" button
2. [x] Click X button on toast
3. [x] **Expected**: Toast closes immediately

### Test 5: No Regression
1. [x] Try normal email registration
2. [x] **Expected**: Registration still works as before

---

## Task 6: Code Quality Checks (2 min) ✅

**Estimated Time**: 2 minutes

**Steps**:
1. [x] Run TypeScript compiler: `npm run build`
2. [x] Run ESLint: `npm run lint`
3. [x] Check for console errors in browser DevTools
4. [x] Verify no warnings

**Acceptance Criteria**:
- [x] No TypeScript errors (from my changes)
- [x] No ESLint violations (from my changes)
- [x] No console errors
- [x] No console warnings

**Result**: Build successful. No errors in RegistrationForm.tsx. (Pre-existing errors in privacy.tsx and terms.tsx are unrelated)

---

## Task 7: Final Verification & Documentation (3 min) ✅

**Estimated Time**: 3 minutes

**Steps**:
1. [x] Verify all commits are pushed
2. [x] Update plan status to complete
3. [x] Move plan to `plans/done/`

**Final Checks**:
- [x] All tasks completed
- [x] All tests pass
- [x] Code is clean
- [x] Documentation updated

---

## Phase 4 Atomic Commit Summary ✅

**Total Tasks**: 7
**Estimated Time**: ~20 minutes
**Total Commits**: 3 (actual)

### Commits Completed:

1. ✅ **a7bdc81** feat(register): import useToast hook for Google Sign-up feedback
   - File: `RegistrationForm.tsx`
   - Change: Added import statement

2. ✅ **4d76598** feat(register): initialize toast hook in RegistrationForm
   - File: `RegistrationForm.tsx`
   - Change: Added `const toast = useToast();`

3. ✅ **632703d** feat(register): add toast notification for Google Sign-up placeholder
   - File: `RegistrationForm.tsx`
   - Change: Replaced console.log with toast.showInfo()

### Files Modified:
- `frontend/src/components/RegistrationForm.tsx` (3 atomic commits)

### Implementation Complete:
- ✅ Toast notification appears when Google Sign-up is clicked
- ✅ Informative message about OAuth being planned
- ✅ References learning project nature
- ✅ Uses existing toast notification system
- ✅ No TypeScript errors introduced
- ✅ All commits pushed to GitHub

---

## Overall Progress Tracking

### Phase 1: ✅ COMPLETE (7/7 tasks)
- [x] Task 1: Read current implementation
- [x] Task 2: Import useToast hook
- [x] Task 3: Initialize toast hook
- [x] Task 4: Update handleGoogleSignIn
- [x] Task 5: Manual testing
- [x] Task 6: Code quality checks
- [x] Task 7: Final verification

### Phase 2: ✅ COMPLETE (8/8 tasks)
- [x] Task 1: Read RegistrationForm implementation
- [x] Task 2: Update Zod password schema
- [x] Task 3: Check PasswordStrengthIndicator component
- [x] Task 4: Create password requirements guide
- [x] Task 5: Add name field validation hint
- [x] Task 6: Manual testing
- [x] Task 7: Code quality checks
- [x] Task 8: Final verification

### Phase 3: ✅ COMPLETE (7/7 tasks)
- [x] Task 1: Fix Zod validation bug
- [x] Task 2: Add placeholder text
- [x] Task 3: Add gray background
- [x] Task 4: Remove PasswordRequirementsGuide
- [x] Task 5: Manual testing
- [x] Task 6: Code quality checks
- [x] Task 7: Final verification

### Phase 4: ✅ COMPLETE (7/7 tasks)
- [x] Task 1: Read RegistrationForm implementation
- [x] Task 2: Import useToast hook
- [x] Task 3: Initialize toast hook
- [x] Task 4: Update handleGoogleSignup
- [x] Task 5: Manual testing
- [x] Task 6: Code quality checks
- [x] Task 7: Final verification

### Phase 5: ✅ COMPLETE (4/4 tasks)
- [x] Task 1: Add placeholder to confirm password (register page)
- [x] Task 2: Add gray background to login page inputs
- [x] Task 3: Add placeholder text to login page
- [x] Task 4: Strengthen login password validation

### Phase 6: 🔄 PLANNING (0/2 tasks)
- [ ] Task 1: Fix PhotoLikeServiceTest failure
- [ ] Task 2: Clean up unused imports

---

## Overall Summary

| Phase | Tasks | Status | Time |
|-------|-------|--------|------|
| 1 | 7 tasks | ✅ Complete | ~15 min |
| 2 | 8 tasks | ✅ Complete | ~45 min |
| 3 | 7 tasks | ✅ Complete | ~30 min |
| 4 | 7 tasks | ✅ Complete | ~20 min |
| 5 | 4 tasks | ✅ Complete | ~20 min |
| 6 | 2 tasks | 🔄 Planning | ~30 min |
| **Total** | **35 tasks** | **33/35 (94%)** | **~160 min** |

---

## Notes

### Risk Assessment: LOW (Both Phases)
- Single file changes per phase
- Isolated validation logic
- No backend dependencies
- Easy rollback

### Dependencies

**Phase 1**:
- ToastContext (already exists)
- useToast hook (already exists)
- LoginForm component (already exists)

**Phase 2**:
- RegistrationForm component (already exists)
- Zod validation (already exists)
- PasswordStrengthIndicator (may exist, to be verified)

### Blockers
None identified. All dependencies are in place.

### Out of Scope

**Phase 1**:
- ❌ Implementing actual OAuth
- ❌ Adding OAuth configuration

**Phase 2**:
- ❌ Changing backend @ValidPassword requirements
- ❌ Implementing email verification
- ❌ Adding password reset functionality
- ❌ Creating password strength meter (weak/medium/strong)
- ❌ Creating unit tests
- ❌ Adding E2E tests

**General**:
- ❌ Other social login providers
- ❌ Two-factor authentication (2FA)
