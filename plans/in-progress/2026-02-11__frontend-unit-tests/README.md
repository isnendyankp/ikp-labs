# Frontend Unit Tests

**Status**: 🚧 In Progress
**Created**: February 11, 2026
**Priority**: P1 (High)
**Type**: Testing Enhancement

---

## Overview

Implement comprehensive unit testing for the frontend using Jest and React Testing Library. This will provide fast feedback during development, ensure component reliability, and catch bugs early in the development cycle.

## Problem Statement

Currently, the frontend has minimal unit tests:
- Only `LikeButton` and `FavoriteButton` have tests (after ActionButton refactoring)
- Many critical components are untested (PhotoCard, LoginForm, etc.)
- No hook testing (useAuth, useToast, etc.)
- No utility function testing
- Long feedback loop - relying on E2E tests (15+ minutes)
- Hard to debug frontend issues

**Current Testing Gaps**:
- No component testing (PhotoCard, LoginForm, ProfileForm, etc.)
- No hook testing (useAuth, useToast, custom hooks)
- No utility function testing (validation, date formatting, etc.)
- No service layer testing (API calls with proper mocking)
- Slow development cycle (E2E tests take minutes)
- Difficult to test edge cases

## Proposed Solution

Implement a comprehensive unit testing suite using:
- **Jest** - Test runner and assertion library (already installed)
- **React Testing Library (RTL)** - Component testing utilities (already installed)
- **@testing-library/user-event** - User interaction simulation (to be installed)

### Testing Philosophy

**Unit Tests = Test Component Logic & UI, NO API, NO Mocking**

Components that call APIs (LoginForm, RegistrationForm, etc.):
- ✅ Test: Form validation, UI interactions, state changes
- ❌ NOT Test: API calls, network requests, response handling
- ✅ API behavior tested in: `/tests/api` (API Tests)
- ✅ Full flows tested in: `/tests/e2e` (E2E Tests)

This keeps unit tests:
- **Fast** - No network calls
- **Deterministic** - No external dependencies
- **Reliable** - No flaky mocks

### Testing Strategy

```
                 /\
                /  \
               /E2E \        ← Playwright (user flows)
              /------\
             / API   \       ← Playwright API (endpoints)
            /----------\
           /Integration\     ← Frontend/Backend integration
          /--------------\
         /  Unit Tests   \   ← Jest + RTL (THIS PLAN)
        /------------------\
```

### Test Coverage Targets

| Component Type | Target Coverage | Priority |
|----------------|----------------|----------|
| UI Components | 80%+ | HIGH |
| Custom Hooks | 85%+ | HIGH |
| Utility Functions | 100% | HIGH |
| Context/Providers | 80%+ | MEDIUM |

**Note**: Service layer tested in `/tests/api` (API Tests with Playwright)

## Scope

### In-Scope ✅

#### Phase 1: Setup & Infrastructure (Priority 1)
- Install @testing-library/user-event
- Configure Jest for optimal testing
- Setup test utilities and helpers
- Configure coverage reporting

#### Phase 2: Utility Tests (Priority 2)
- Validation utilities
- Date/time formatting utilities
- File size formatting utilities
- URL utilities
- Type guards
- apiClient utilities

#### Phase 3: Component Tests - Core (Priority 3)
- PhotoCard component (most critical)
- LoginForm component
- RegistrationForm component
- ProfileForm component
- PhotoUploadForm component

#### Phase 4: Component Tests - UI Elements (Priority 4)
- ActionButton component (extend existing tests)
- FilterDropdown component
- SortByDropdown component
- Pagination component
- ConfirmDialog component
- Toast component
- EmptyState component
- FormField component

#### Phase 5: Hook Tests (Priority 5)
- useAuth hook (state management only)
- useToast hook
- Custom hooks (if any)

#### Phase 6: Context/Provider Tests (Priority 6)
- ToastContext/Provider
- AuthContext/Provider (if exists)

#### Phase 7: Documentation (Priority 7)
- Update README with testing section
- Document coverage badges
- Add testing examples

### Out-of-Scope ❌
- E2E tests (already covered by Playwright)
- API tests (already covered by Playwright API)
- Backend tests (already covered by JUnit)
- Visual regression tests (separate tool)
- Performance tests (separate tool)

## Success Criteria

### Must Have (P0)
- [ ] All critical components have tests
- [ ] All custom hooks have tests
- [ ] All utility functions have tests
- [ ] Coverage > 80% for new code
- [ ] All tests pass (100%)
- [ ] Tests run in < 30 seconds

### Should Have (P1)
- [ ] Context provider tests
- [ ] Snapshot tests for critical components
- [ ] Coverage badge in README

### Nice to Have (P2)
- [ ] Visual regression tests (Storybook + Chromatic)
- [ ] Accessibility tests (jest-axe)

## Technical Highlights

- **Test Runner**: Jest 29+ (already installed)
- **Component Testing**: React Testing Library (already installed)
- **User Interactions**: @testing-library/user-event - to install
- **Coverage**: Istanbul (built-in to Jest)
- **Snapshot Testing**: Jest snapshots

**Note**: Service layer tested in `/tests/api` (Playwright API tests)

## Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Phase 1**: Setup & Infrastructure | 1-2 hours | Install dependencies, configure Jest |
| **Phase 2**: Utility Tests | 1-2 hours | Test utility functions |
| **Phase 3**: Core Component Tests | 4-6 hours | Test critical components (PhotoCard, Forms) |
| **Phase 4**: UI Element Tests | 2-3 hours | Test UI components |
| **Phase 5**: Hook Tests | 2-3 hours | Test custom hooks (state only) |
| **Phase 6**: Context Tests | 1-2 hours | Test providers |
| **Phase 7**: Documentation | 1 hour | Update docs, add coverage badge |

**Total Estimated**: 14-22 hours

## Dependencies

### No Blockers
- All required infrastructure exists
- Frontend is ready for testing
- Jest and RTL already installed

### Prerequisites
- Node.js installed ✅
- npm/yarn available ✅
- Frontend codebase accessible ✅

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| API mocking complexity | MEDIUM | Use MSW for consistent mocking |
| Component test complexity | MEDIUM | Follow RTL best practices |
| Flaky tests | LOW | Write deterministic tests, avoid timers |
| Low coverage | LOW | Set coverage thresholds in Jest config |
| Slow test execution | LOW | Keep unit tests fast, save integration for E2E |

## Related Plans

- ✅ **DRY Violations Fix** (Completed) - ActionButton now has tests
- 📋 **CI/CD Pipeline** (Backlog) - Will integrate these unit tests into CI
- ✅ **Gallery Sorting Feature** (Completed) - Has some frontend tests

## Files Overview

- [requirements.md](./requirements.md) - Detailed test requirements
- [technical-design.md](./technical-design.md) - Jest configuration, testing patterns
- [checklist.md](./checklist.md) - Step-by-step implementation checklist

## Next Steps

1. Start with Phase 1: Setup & Infrastructure
2. Install MSW and @testing-library/user-event
3. Configure Jest for optimal testing
4. Create test utilities and helpers
5. Begin with utility tests (easiest, fastest win)

---

**Plan Version**: 1.0
**Last Updated**: February 11, 2026
**Status**: Ready to Start
