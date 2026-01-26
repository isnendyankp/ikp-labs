# Google Sign-In Toast Notification

**Status**: ⏳ In Progress
**Created**: January 26, 2026
**Priority**: P1 (High)
**Type**: UX Improvement

---

## Overview

Add an informative toast notification to the existing "Sign in with Google" button in the login form. The button currently exists as a placeholder but provides no feedback when clicked.

## Problem Statement

The login page has a "Sign in with Google" button that:
- ✅ Exists in the UI
- ❌ Is not functionally implemented (OAuth not set up)
- ❌ Provides NO user feedback when clicked
- ❌ Only logs to console (`console.log("Sign in with Google clicked")`)

**Issues**:
- Poor user experience (click does nothing visible)
- No transparency about OAuth status
- Wasted learning opportunity (toast system exists but isn't used)

**User Journey Gap**:
- Users click the button and nothing happens
- No indication that this is a "coming soon" feature
- Confusion about whether the button is broken

## Proposed Solution

### Approach: Keep Button + Add Toast Notification

**Why keep the button?**
- This is a learning/educational project (stated in legal pages)
- Shows awareness of modern auth patterns (OAuth is standard)
- Demonstrates UI/UX planning for future features
- Portfolio value: leaves room for "future improvements" discussion

**Why toast notification?**
- Non-intrusive user feedback
- Uses existing toast notification system
- Transparent about project state
- Manages user expectations appropriately

### Toast Message

```
"Google OAuth authentication is planned for future development.
This is a learning project - currently only email/password authentication is available."
```

### Expected Behavior

1. User clicks "Sign in with Google" button
2. Blue info toast appears (top-right)
3. Toast displays message about OAuth being planned
4. Toast auto-dismisses after 3 seconds
5. No navigation, no authentication attempt

## Success Criteria

- [ ] Toast appears when Google Sign-in button is clicked
- [ ] Toast message is clear and informative
- [ ] Toast uses info style (blue color)
- [ ] Toast auto-dismisses after 3 seconds
- [ ] No console errors
- [ ] Existing login functionality remains unchanged

## Technical Context

**Files Involved**:
- `frontend/src/components/LoginForm.tsx` - Main change (add toast notification)

**Existing Components Used**:
- `ToastContext` - Already implemented
- `ToastContainer` - Already rendered in app
- `showInfo()` method - Already available

**No new dependencies** - Using existing toast system

## Estimated Time

- Implementation: 5-10 minutes
- Testing: 5 minutes
- Documentation: 5 minutes
- **Total: ~15-20 minutes**

## Related Work

- Toast notification system (already implemented)
- LoginForm component (already exists)
- Authentication system (email/password fully functional)
