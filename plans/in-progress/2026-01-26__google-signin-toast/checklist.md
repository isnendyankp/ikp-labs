# Google Sign-In Toast Notification - Implementation Checklist

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

## Task 2: Import useToast Hook (2 min)

**Estimated Time**: 2 minutes

**File**: `frontend/src/components/LoginForm.tsx`

**Steps**:
1. [ ] Add import statement at top of file
2. [ ] Verify no TypeScript errors
3. [ ] **COMMIT**: "feat(login): import useToast hook for Google Sign-in feedback"

**Code to Add**:
```typescript
import { useToast } from '@/context/ToastContext';
```

**Acceptance Criteria**:
- [ ] Import added correctly
- [ ] No TypeScript errors
- [ ] ESLint passes

---

## Task 3: Initialize Toast Hook (2 min)

**Estimated Time**: 2 minutes

**File**: `frontend/src/components/LoginForm.tsx`

**Steps**:
1. [ ] Add `const toast = useToast();` inside LoginForm component
2. [ ] Place after other hooks (useState, useRouter, etc.)
3. [ ] Verify hook is properly initialized
4. [ ] **COMMIT**: "feat(login): initialize toast hook in LoginForm"

**Code to Add**:
```typescript
const toast = useToast();
```

**Acceptance Criteria**:
- [ ] Hook initialized inside component
- [ ] Placed after other hooks
- [ ] No React hooks violations

---

## Task 4: Update handleGoogleSignIn Function (3 min)

**Estimated Time**: 3 minutes

**File**: `frontend/src/components/LoginForm.tsx`

**Steps**:
1. [ ] Replace `console.log()` with `toast.showInfo()`
2. [ ] Add the informative message about OAuth
3. [ ] Verify string concatenation is correct
4. [ ] **COMMIT**: "feat(login): add toast notification for Google Sign-in placeholder"

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
- [ ] console.log is removed
- [ ] toast.showInfo() is called
- [ ] Message is clear and informative
- [ ] String concatenation is correct

---

## Task 5: Manual Testing (5 min)

**Estimated Time**: 5 minutes

**Purpose**: Verify the implementation works correctly.

**Test Cases**:

### Test 1: Toast Appears
1. [ ] Start frontend dev server
2. [ ] Navigate to login page
3. [ ] Click "Sign in with Google" button
4. [ ] **Expected**: Blue toast appears

### Test 2: Toast Message Correct
1. [ ] Read the toast message
2. [ ] **Expected**: "Google OAuth authentication is planned..."
3. [ ] **Expected**: "This is a learning project..."

### Test 3: Toast Auto-Dismisses
1. [ ] Click "Sign in with Google" button
2. [ ] Wait 3 seconds
3. [ ] **Expected**: Toast disappears automatically

### Test 4: Manual Close Works
1. [ ] Click "Sign in with Google" button
2. [ ] Click X button on toast
3. [ ] **Expected**: Toast closes immediately

### Test 5: No Regression
1. [ ] Try normal email/password login
2. [ ] **Expected**: Login still works as before

---

## Task 6: Code Quality Checks (2 min)

**Estimated Time**: 2 minutes

**Steps**:
1. [ ] Run TypeScript compiler: `npx tsc --noEmit`
2. [ ] Run ESLint: `npm run lint`
3. [ ] Check for console errors in browser DevTools
4. [ ] Verify no warnings

**Acceptance Criteria**:
- [ ] No TypeScript errors
- [ ] No ESLint violations
- [ ] No console errors
- [ ] No console warnings

---

## Task 7: Final Verification & Documentation (3 min)

**Estimated Time**: 3 minutes

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

## Atomic Commit Summary

**Total Tasks**: 7
**Estimated Total Time**: ~20-25 minutes
**Total Commits**: 4

### Commit Breakdown:

1. **Commit 1**: Import useToast hook
   - File: `LoginForm.tsx`
   - Change: Add import statement

2. **Commit 2**: Initialize toast hook
   - File: `LoginForm.tsx`
   - Change: Add `const toast = useToast();`

3. **Commit 3**: Update handleGoogleSignIn
   - File: `LoginForm.tsx`
   - Change: Replace console.log with toast.showInfo()

4. **Commit 4**: (Optional) Move plan to done
   - Documentation update

---

## Progress Tracking

**Overall Progress**: 0/7 tasks completed (0%)

- [ ] Task 1: Read current implementation
- [ ] Task 2: Import useToast hook
- [ ] Task 3: Initialize toast hook
- [ ] Task 4: Update handleGoogleSignIn
- [ ] Task 5: Manual testing
- [ ] Task 6: Code quality checks
- [ ] Task 7: Final verification

---

## Notes

### Risk Assessment: LOW
- Single file change
- Isolated function
- No dependencies
- Easy rollback

### Dependencies
- ToastContext (already exists)
- useToast hook (already exists)
- LoginForm component (already exists)

### Blockers
None identified. All dependencies are in place.

### Out of Scope
- Implementing actual OAuth
- Adding OAuth configuration
- Unit tests
- E2E tests
