# Frontend Unit Tests

**Status**: 📋 Backlog
**Created**: January 12, 2026
**Priority**: P1 (High)
**Type**: Testing Enhancement

---

## Overview

Implement comprehensive unit testing for the frontend using Jest and React Testing Library. This will provide fast feedback during development, ensure component reliability, and catch bugs early in the development cycle.

## Problem Statement

Currently, the frontend lacks unit tests. Testing is primarily done through:
- E2E tests (slow, run after development)
- Manual testing (time-consuming, inconsistent)
- Backend integration tests (don't cover frontend logic)

**Current Testing Gaps:**
- No component testing (PhotoCard, LoginForm, etc.)
- No hook testing (useAuth, usePhotos)
- No utility function testing
- No service layer testing (API calls)
- Long feedback loop (E2E tests take minutes)
- Hard to debug frontend issues

## Proposed Solution

Implement a comprehensive unit testing suite using:
- **Jest** - Test runner and assertion library
- **React Testing Library (RTL)** - Component testing utilities
- **MSW (Mock Service Worker)** - API mocking
- **@testing-library/user-event** - User interaction simulation

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
| Custom Hooks | 90%+ | HIGH |
| Utility Functions | 100% | HIGH |
| Service Layer | 80%+ | MEDIUM |
| Context/Providers | 85%+ | MEDIUM |

## Scope

### In-Scope ✅

#### Component Testing
- PhotoCard component
- LoginForm component
- RegistrationForm component
- ProfileForm component
- FilterDropdown component
- SortByDropdown component
- Toast component
- ConfirmDialog component
- EmptyState component
- FormField component
- Pagination component
- PhotoUploadForm component

#### Hook Testing
- useAuth hook
- usePhotos hook (if exists)
- useToast hook
- Custom hooks for API calls

#### Utility Testing
- Validation utilities
- Date formatting utilities
- File size formatting utilities
- URL utilities
- Type guards

#### Service Testing
- galleryService.ts
- authService.ts
- profileService.ts
- photoService.ts

#### Context/Provider Testing
- ToastContext
- AuthContext (if exists)

### Out-of-Scope ❌
- E2E tests (already covered by Playwright)
- API tests (already covered by Playwright API)
- Backend tests (already covered by JUnit)
- Visual regression tests (separate tool)
- Performance tests (separate tool)

## Success Criteria

### Must Have (P0)
- [ ] Jest + RTL configured
- [ ] All components have unit tests
- [ ] All custom hooks have tests
- [ ] All utility functions have tests
- [ ] Coverage > 80% for new code
- [ ] All tests pass (100%)

### Should Have (P1)
- [ ] MSW configured for API mocking
- [ ] Service layer tests with mocked API
- [ ] Context provider tests
- [ ] Snapshot tests for critical components
- [ ] Coverage badge in README

### Nice to Have (P2)
- [ ] Visual regression tests (Storybook + Chromatic)
- [ ] Performance tests (Lighthouse CI)
- [ ] Accessibility tests (jest-axe)

## Technical Highlights

- **Test Runner**: Jest 29+
- **Component Testing**: React Testing Library
- **API Mocking**: MSW (Mock Service Worker)
- **User Interactions**: @testing-library/user-event
- **Coverage**: Istanbul (built-in to Jest)
- **Snapshot Testing**: Jest snapshots

## Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Phase 1**: Setup | 1-2 hours | Install dependencies, configure Jest |
| **Phase 2**: Utility Tests | 1-2 hours | Test utility functions |
| **Phase 3**: Component Tests | 4-6 hours | Test UI components |
| **Phase 4**: Hook Tests | 2-3 hours | Test custom hooks |
| **Phase 5**: Service Tests | 2-3 hours | Test API services with MSW |
| **Phase 6**: Context Tests | 1-2 hours | Test providers |
| **Phase 7**: Documentation | 1 hour | Update docs, add coverage badge |

**Total Estimated**: 12-19 hours

## Dependencies

### No Blockers
- All required infrastructure exists
- Frontend is ready for testing
- No backend changes needed

### Prerequisites
- Node.js installed
- npm/yarn available
- Frontend codebase accessible

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Test setup complexity | MEDIUM | Follow React Testing Library best practices |
| API mocking challenges | MEDIUM | Use MSW for consistent mocking |
| Flaky tests | LOW | Write deterministic tests, avoid timers |
| Low coverage | LOW | Set coverage thresholds in Jest config |
| Slow test execution | LOW | Keep unit tests fast, save integration for E2E |

## Related Plans

- 📋 **UX Improvements** (Backlog) - Will test new UX components
- 📋 **CI/CD Pipeline** (Backlog) - Will integrate tests into CI
- ✅ **Gallery Sorting Feature** (Completed) - Already has some frontend tests

## Files Overview

- [requirements.md](./requirements.md) - Detailed test requirements
- [technical-design.md](./technical-design.md) - Jest configuration, testing patterns
- [checklist.md](./checklist.md) - Step-by-step implementation checklist

---

**Plan Version**: 1.0
**Last Updated**: January 12, 2026
**Status**: Ready to Start
