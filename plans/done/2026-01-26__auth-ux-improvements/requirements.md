# Requirements: Google Sign-In Toast Notification

## Functional Requirements

### FR-1: Toast Notification on Click
**Priority**: P0 (Must Have)

When a user clicks the "Sign in with Google" button, the system SHALL display an informational toast notification.

**Acceptance Criteria**:
- [ ] Toast appears immediately on button click
- [ ] Toast is visible for at least 2 seconds
- [ ] Toast auto-dismisses after 3 seconds (default)
- [ ] Toast does not block user interaction with other elements

### FR-2: Toast Message Content
**Priority**: P0 (Must Have)

The toast notification SHALL contain a clear message explaining that Google OAuth is planned for future development.

**Required Message**:
```
"Google OAuth authentication is planned for future development. This is a learning project - currently only email/password authentication is available."
```

**Acceptance Criteria**:
- [ ] Message is grammatically correct
- [ ] Message is honest about project state
- [ ] Message manages user expectations
- [ ] Message references the learning nature of the project

### FR-3: Toast Visual Style
**Priority**: P0 (Must Have)

The toast SHALL use the "info" style (blue color) to indicate informational content.

**Acceptance Criteria**:
- [ ] Toast uses `toast.showInfo()` method
- [ ] Toast displays in blue/info color scheme
- [ ] Toast icon matches info style
- [ ] Toast appears in default position (top-right)

### FR-4: No Functional Change to Button
**Priority**: P0 (Must Have)

The "Sign in with Google" button SHALL NOT perform any OAuth authentication or navigation.

**Acceptance Criteria**:
- [ ] No OAuth flow is initiated
- [ ] No navigation occurs
- [ ] No API calls are made
- [ ] No authentication state changes

## Non-Functional Requirements

### NFR-1: Performance
**Priority**: P1 (Should Have)

The toast notification SHALL appear within 100ms of button click.

**Acceptance Criteria**:
- [ ] Toast appears instantly (no visible delay)
- [ ] No blocking operations before toast display
- [ ] No performance impact on page load

### NFR-2: Code Quality
**Priority**: P1 (Should Have)

The implementation SHALL follow existing code patterns and style.

**Acceptance Criteria**:
- [ ] Code follows TypeScript best practices
- [ ] Uses existing toast system correctly
- [ ] No console errors or warnings
- [ ] No ESLint violations

### NFR-3: Maintainability
**Priority**: P1 (Should Have)

The implementation SHALL be easy to remove or modify when OAuth is implemented.

**Acceptance Criteria**:
- [ ] Toast logic is isolated in `handleGoogleSignIn` function
- [ ] Easy to replace with actual OAuth implementation later
- [ ] No hardcoded values that should be constants
- [ ] Code is self-documenting with clear function names

### NFR-4: Accessibility
**Priority**: P2 (Nice to Have)

The toast notification SHALL be accessible to screen reader users.

**Acceptance Criteria**:
- [ ] Toast is announced by screen readers
- [ ] Toast can be dismissed manually (close button)
- [ ] Toast does not trap keyboard focus
- [ ] Toast respects user's motion preferences (reduced motion)

## User Stories

### US-1: Clear User Feedback
**As a** new visitor to the application,
**I want** to see feedback when I click the "Sign in with Google" button,
**So that** I know the feature is not broken, just not yet implemented.

**Acceptance Criteria**: FR-1, FR-2

### US-2: Transparency About Project State
**As a** portfolio reviewer or potential user,
**I want** to understand this is a learning project with planned features,
**So that** I can fairly evaluate the developer's planning and UI/UX skills.

**Acceptance Criteria**: FR-2, FR-4

### US-3: Non-Intrusive Feedback
**As a** user exploring the login page,
**I want** the feedback to be informational and non-blocking,
**So that** I can still proceed with email/password login without interruption.

**Acceptance Criteria**: FR-1, FR-3, NFR-1

## Technical Requirements

### TR-1: Use Existing Toast System
The implementation MUST use the existing `ToastContext` and `showInfo()` method.

**Rationale**: Avoid code duplication, leverage existing functionality.

### TR-2: Import useToast Hook
The `LoginForm` component MUST import and use the `useToast` hook.

**Rationale**: Proper integration with React context system.

### TR-3: Minimal Code Changes
The implementation should modify only the `handleGoogleSignIn` function.

**Rationale**: Reduce risk of introducing bugs, keep changes focused.

## Out of Scope

The following are explicitly OUT OF SCOPE for this task:

- ❌ Implementing actual Google OAuth authentication
- ❌ Adding OAuth configuration or setup
- ❌ Creating OAuth backend endpoints
- ❌ Adding email verification
- ❌ Changing the button appearance or state
- ❌ Removing the button from the UI
- ❌ Adding any other social login providers (Facebook, Twitter, etc.)
- ❌ Creating unit tests for this change (manual testing only)
- ❌ Adding E2E tests for this specific interaction

## Future Considerations

When OAuth is eventually implemented, this toast can be replaced with:
1. Actual OAuth flow initiation
2. Loading state during OAuth redirect
3. Error handling for OAuth failures
4. Success toast after successful OAuth login

The current implementation provides a clean migration path since the `handleGoogleSignIn` function is already isolated and ready to be replaced with real OAuth logic.

---

# Requirements: Registration Password Validation (Phase 2)

## Status: ✅ COMPLETE (Phase 1) | 🔄 PLANNING (Phase 2)

**Phase 1** (Google Sign-in Toast) requirements above are **COMPLETE**.

**Phase 2** (Registration Password Validation) requirements below are **NEW**.

---

## Functional Requirements (Phase 2)

### FR-5: Frontend Validation Parity
**Priority**: P0 (Must Have)

The frontend validation schema SHALL match the backend @ValidPassword requirements exactly.

**Backend Requirements** (Java @ValidPassword):
- Minimum 8 characters
- At least one lowercase letter [a-z]
- At least one uppercase letter [A-Z]
- At least one digit [0-9]
- At least one special character [@$!%*?&]

**Acceptance Criteria**:
- [ ] Zod schema includes all 5 validation rules
- [ ] Error messages match backend requirements
- [ ] No password passes frontend but fails backend
- [ ] Validation happens on field change (real-time)

### FR-6: Password Requirements Guide Display
**Priority**: P0 (Must Have)

The registration form SHALL display password requirements below the password field.

**Acceptance Criteria**:
- [ ] Requirements are visible before user starts typing
- [ ] All 5 requirements are listed
- [ ] Requirements use clear, simple language
- [ ] Visual indicators show which requirements are met/not met
- [ ] Guide appears below password input field

### FR-7: Real-time Validation Feedback
**Priority**: P0 (Must Have)

The password requirements guide SHALL update in real-time as the user types.

**Acceptance Criteria**:
- [ ] Each requirement updates independently
- [ ] Visual indicator changes immediately on each keystroke
- [ ] Requirements show met state when satisfied
- [ ] Requirements show not-met state when not satisfied
- [ ] No submit-then-fail cycle (feedback before submission)

### FR-8: Visual State Indicators
**Priority**: P0 (Must Have)

Each password requirement SHALL have a clear visual state.

**Visual States**:
- ⚪ **Gray/Empty**: Not yet evaluated (user hasn't typed or field is empty)
- ✓ **Green**: Requirement is satisfied
- ✗ **Red**: Requirement is NOT satisfied (shown on validation error)

**Acceptance Criteria**:
- [ ] Three distinct visual states (empty/green/red)
- [ ] State changes are immediate and smooth
- [ ] Icons are clear and accessible
- [ ] Color coding is consistent with common patterns

### FR-9: Name Field Validation Hint
**Priority**: P1 (Should Have)

The full name field SHALL display a minimum length requirement.

**Acceptance Criteria**:
- [ ] Shows "Min. 2 characters" hint below field
- [ ] Hint is subtle but visible
- [ ] Hint does not clutter the interface
- [ ] Backend requires 2-100 characters (only letters, spaces, basic punctuation)

### FR-10: No Regression to Existing Functionality
**Priority**: P0 (Must Have)

All changes SHALL NOT break existing registration functionality.

**Acceptance Criteria**:
- [ ] Email validation still works
- [ ] Confirm password matching still works
- [ ] Form submission still works
- [ ] Error handling still works
- [ ] Loading states still work

## Non-Functional Requirements (Phase 2)

### NFR-5: Performance (Real-time Validation)
**Priority**: P1 (Should Have)

Real-time validation SHALL NOT cause lag or janky typing experience.

**Acceptance Criteria**:
- [ ] Validation runs without visible delay
- [ ] Typing is not blocked by validation
- [ ] UI updates are smooth (60fps)
- [ ] No performance degradation

### NFR-6: Code Quality (Phase 2)
**Priority**: P1 (Should Have)

Password validation implementation SHALL follow existing code patterns.

**Acceptance Criteria**:
- [ ] Uses existing Zod validation patterns
- [ ] Reuses PasswordStrengthIndicator component if available
- [ ] No hardcoded requirement strings (use constants)
- [ ] TypeScript types are properly defined
- [ ] No console errors or warnings

### NFR-7: Accessibility (Phase 2)
**Priority**: P1 (Should Have)

Password requirements SHALL be accessible to all users.

**Acceptance Criteria**:
- [ ] Requirements are readable by screen readers
- [ ] Visual states have text equivalents (not just color)
- [ ] Icons have aria-labels where needed
- [ ] Keyboard navigation works correctly
- [ ] High contrast mode supported

## User Stories (Phase 2)

### US-3: Clear Password Requirements
**As a** new user registering an account,
**I want** to see password requirements BEFORE I start typing,
**So that** I know what to include and don't have to guess.

**Acceptance Criteria**: FR-6, FR-7

### US-4: Real-time Validation Feedback
**As a** user creating a password,
**I want** to see which requirements I've met as I type,
**So that** I know when my password is valid without submitting.

**Acceptance Criteria**: FR-7, FR-8

### US-5: No Submit-Fail Cycle
**As a** user trying to register,
**I want** to know if my password is valid BEFORE I submit,
**So that** I don't have to go through submit → fail → retry cycles.

**Acceptance Criteria**: FR-5, FR-7

## Technical Requirements (Phase 2)

### TR-1: Use Zod Regex Validation
Frontend MUST use Zod's `.regex()` method for password complexity validation.

```typescript
.password(
  z.string()
    .min(8, 'At least 8 characters')
    .regex(/[a-z]/, 'One lowercase letter (a-z)')
    .regex(/[A-Z]/, 'One uppercase letter (A-Z)')
    .regex(/[0-9]/, 'One number (0-9)')
    .regex(/[@$!%*?&]/, 'One special character (@$!%*?&)')
)
```

**Rationale**: Matches backend @ValidPassword validation exactly.

### TR-2: Display Requirements Below Password Field
Password requirements guide MUST be placed immediately below the password input field.

**Rationale**: Users see requirements where they need them (at point of entry).

### TR-3: Use PasswordStrengthIndicator Component
If PasswordStrengthIndicator component exists in codebase, it SHOULD be integrated.

**Rationale**: Reuse existing code, avoid duplication.

### TR-4: Validation on Change Event
Password validation MUST run on `onChange` event (not just `onSubmit`).

**Rationale**: Provide real-time feedback as user types.

## Out of Scope (Phase 2)

The following are explicitly OUT OF SCOPE for Phase 2:

- ❌ Implementing actual Google OAuth authentication
- ❌ Adding OAuth configuration or setup
- ❌ Changing backend @ValidPassword requirements
- ❌ Implementing email verification
- ❌ Adding password reset functionality
- ❌ Creating password strength meter (weak/medium/strong)
- ❌ Changing overall form layout
- ❌ Creating unit tests
- ❌ Adding E2E tests

## Implementation Order (Phase 2)

1. **Update Zod Schema** - Add regex validations for password complexity
2. **Add Requirements Display** - Create UI component showing 5 requirements
3. **Implement Real-time Validation** - Connect validation to UI updates
4. **Style the Requirements** - Apply visual states (gray/green/red)
5. **Test & Verify** - Manual testing of all password scenarios

## Success Summary (Phase 1)

✅ **COMPLETE** - All Phase 1 requirements met:
- FR-1: Toast notification on click ✅
- FR-2: Toast message content ✅
- FR-3: Toast visual style ✅
- FR-4: No functional change ✅
- NFR-1 through NFR-4: All non-functional requirements met ✅

**Commits**:
- `df9da04` feat(login): import useToast hook
- `e3128e5` feat(login): initialize toast hook
- `6b160a1` feat(login): add toast notification

## Success Criteria (Phase 2 - Pending)

- [ ] FR-5 through FR-10: All functional requirements met
- [ ] NFR-5 through NFR-7: All non-functional requirements met
- [ ] US-3 through US-5: All user stories fulfilled
- [ ] TR-1 through TR-4: All technical requirements implemented
- [ ] Manual testing passed with various password combinations
