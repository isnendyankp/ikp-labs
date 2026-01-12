# Frontend Unit Tests - Detailed Requirements

**Plan**: Frontend Unit Tests
**Version**: 1.0
**Last Updated**: January 12, 2026

---

## Table of Contents

1. [Functional Requirements](#functional-requirements)
2. [Technical Requirements](#technical-requirements)
3. [Test Coverage Requirements](#test-coverage-requirements)
4. [Testing Best Practices](#testing-best-practices)

---

## Functional Requirements

### FR-1: Test Configuration

**Requirement**: Jest must be properly configured for the Next.js project

**Configuration Requirements**:
- Jest configured for TypeScript
- React Testing Library configured
- Module aliases configured (@/components, @/services, etc.)
- Test environment set to jsdom
- Setup files configured
- Coverage thresholds configured
- Transform rules for TypeScript and CSS

**Acceptance Criteria**:
- ✅ Jest runs without configuration errors
- ✅ Imports work correctly with aliases
- ✅ CSS modules are handled
- ✅ Tests run in jsdom environment

---

### FR-2: Component Testing Requirements

**Requirement**: All UI components must have comprehensive tests

**Components to Test**:

| Component | Test Cases | Priority |
|-----------|------------|----------|
| PhotoCard | 6-8 tests | HIGH |
| LoginForm | 8-10 tests | HIGH |
| RegistrationForm | 10-12 tests | HIGH |
| ProfileForm | 8-10 tests | HIGH |
| FilterDropdown | 6-8 tests | MEDIUM |
| SortByDropdown | 6-8 tests | MEDIUM |
| Toast | 5-6 tests | MEDIUM |
| ConfirmDialog | 6-8 tests | MEDIUM |
| EmptyState | 4-5 tests | LOW |
| FormField | 6-8 tests | MEDIUM |
| Pagination | 8-10 tests | MEDIUM |
| PhotoUploadForm | 10-12 tests | HIGH |

**Component Test Coverage** (per component):
- Renders correctly with default props
- Renders correctly with custom props
- Handles user interactions (click, type, etc.)
- Shows correct loading state
- Shows correct error state
- Shows correct empty state
- Calls correct callbacks
- Updates state correctly

---

### FR-3: Hook Testing Requirements

**Requirement**: All custom hooks must have tests

**Hooks to Test**:

| Hook | Test Cases | Priority |
|------|------------|----------|
| useAuth | 8-10 tests | HIGH |
| useToast | 6-8 tests | HIGH |
| usePhotos | 6-8 tests | MEDIUM |
| useForm (custom) | 8-10 tests | MEDIUM |

**Hook Test Coverage** (per hook):
- Initializes with correct default state
- Returns correct values
- Updates state correctly
- Handles edge cases
- Cleans up side effects
- Handles errors correctly

---

### FR-4: Utility Function Testing Requirements

**Requirement**: All utility functions must have tests

**Utilities to Test**:

| Utility | Test Cases | Priority |
|---------|------------|----------|
| Validation utils | 10-15 tests | HIGH |
| Date formatting | 8-10 tests | MEDIUM |
| File size formatting | 6-8 tests | MEDIUM |
| URL utilities | 6-8 tests | LOW |
| Type guards | 6-8 tests | LOW |

**Utility Test Coverage** (per utility):
- Returns correct output for valid input
- Handles edge cases (null, undefined, empty)
- Throws errors for invalid input (if applicable)
- Works with different data types
- Handles boundary conditions

---

### FR-5: Service Layer Testing Requirements

**Requirement**: All API service functions must have tests with mocked responses

**Services to Test**:

| Service | Test Cases | Priority |
|---------|------------|----------|
| galleryService | 10-12 tests | HIGH |
| authService | 8-10 tests | HIGH |
| profileService | 8-10 tests | HIGH |
| photoService | 10-12 tests | HIGH |

**Service Test Coverage** (per service):
- Makes correct API request
- Handles success response
- Handles error response
- Passes correct parameters
- Handles network errors
- Handles timeout (if applicable)

---

### FR-6: Context/Provider Testing Requirements

**Requirement**: All React contexts must have tests

**Contexts to Test**:

| Context | Test Cases | Priority |
|---------|------------|----------|
| ToastContext | 6-8 tests | HIGH |
| AuthContext | 8-10 tests | MEDIUM |

**Context Test Coverage** (per context):
- Provides correct default values
- Updates context value correctly
- Renders children correctly
- Handles multiple consumers
- Handles provider updates

---

## Technical Requirements

### TR-1: Jest Configuration

**Requirement**: Jest must be configured for Next.js + TypeScript

**jest.config.js**:
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

**Acceptance Criteria**:
- ✅ Next.js features work in tests
- ✅ TypeScript compilation works
- ✅ Module aliases resolve correctly
- ✅ Coverage thresholds are enforced

---

### TR-2: React Testing Library Setup

**Requirement**: RTL must be configured for custom render functions

**jest.setup.js**:
```javascript
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return ''
  },
}))

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
```

**Acceptance Criteria**:
- ✅ jest-dom matchers available
- ✅ Next.js router mocked
- ✅ Window APIs mocked

---

### TR-3: MSW Configuration

**Requirement**: MSW must be configured for API mocking

**mocks/handlers.ts**:
```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      token: 'mock-token',
      user: { id: 1, email: 'test@example.com' },
    })
  }),

  // Gallery endpoints
  http.get('/api/gallery/public', () => {
    return HttpResponse.json({
      photos: [],
      totalPages: 0,
      currentPage: 0,
    })
  }),

  // ... more handlers
]
```

**mocks/server.ts**:
```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

**Acceptance Criteria**:
- ✅ All API endpoints have handlers
- ✅ Handlers return realistic responses
- ✅ Server can be started/stopped in tests

---

### TR-4: Test Utilities

**Requirement**: Custom test utilities must be created

**test-utils.tsx**:
```typescript
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ToastProvider } from '@/context/ToastContext'

// Custom render with providers
interface AllTheProvidersProps {
  children: React.ReactNode
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return <ToastProvider>{children}</ToastProvider>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

**Acceptance Criteria**:
- ✅ Custom render wraps with providers
- ✅ All RTL utilities re-exported
- ✅ Easy to use in tests

---

## Test Coverage Requirements

### Coverage Targets

| Metric Type | Target | Minimum |
|-------------|--------|---------|
| Statements | 85% | 80% |
| Branches | 75% | 70% |
| Functions | 85% | 80% |
| Lines | 85% | 80% |

### Per-Component Targets

| Component Type | Target | Rationale |
|----------------|--------|-----------|
| Critical Components (forms) | 90%+ | High user impact |
| UI Components (cards, buttons) | 80%+ | Standard coverage |
| Utility Functions | 100% | Pure functions, easy to test |
| Custom Hooks | 90%+ | Core logic |
| Services | 80%+ | API interactions |

---

## Testing Best Practices

### TP-1: Test User Behavior, Not Implementation

**Good**:
```typescript
test('submits login form with email and password', () => {
  render(<LoginForm />)
  userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
  userEvent.type(screen.getByLabelText('Password'), 'password123')
  userEvent.click(screen.getByRole('button', { name: 'Login' }))

  expect(mockLogin).toHaveBeenCalledWith({
    email: 'test@example.com',
    password: 'password123',
  })
})
```

**Bad**:
```typescript
test('sets email state when typed', () => {
  render(<LoginForm />)
  const input = screen.getByLabelText('Email')
  fireEvent.change(input, { target: { value: 'test@example.com' } })
  expect(input).toHaveValue('test@example.com')
})
```

---

### TP-2: Use data-testid Sparingly

**Prefer accessible selectors**:
```typescript
// Good
screen.getByRole('button', { name: 'Submit' })
screen.getByLabelText('Email')
screen.getByText('Welcome')

// Acceptable
screen.getByTestId('submit-button')

// Bad
container.querySelector('.btn-primary')
```

---

### TP-3: Test Async Behavior Correctly

**Use waitFor and find**:
```typescript
test('shows success message after login', async () => {
  render(<LoginForm />)
  userEvent.click(screen.getByRole('button', { name: 'Login' }))

  await waitFor(() => {
    expect(screen.getByText('Login successful')).toBeVisible()
  })
})
```

---

### TP-4: Mock External Dependencies

**Mock API calls**:
```typescript
import { server } from '@/mocks/server'

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('loads photos on mount', async () => {
  render(<GalleryPage />)
  await waitFor(() => {
    expect(screen.getAllByRole('img')).toHaveLength(12)
  })
})
```

---

### TP-5: Keep Tests Isolated

**Each test should**:
- Be independent of other tests
- Clean up after itself
- Not rely on test execution order
- Have clear, descriptive names

---

## Acceptance Criteria Summary

### Must Pass (P0)
- [ ] Jest configured and running
- [ ] All components have tests
- [ ] All hooks have tests
- [ ] All utilities have tests
- [ ] All services have tests
- [ ] Coverage > 80% globally
- [ ] All tests pass (100%)

### Should Pass (P1)
- [ ] MSW configured for API mocking
- [ ] Context providers have tests
- [ ] Snapshot tests for critical components
- [ ] Coverage badge in README

### Nice to Have (P2)
- [ ] Visual regression tests
- [ ] Performance tests
- [ ] Accessibility tests
- [ ] Coverage > 90%

---

**Requirements Version**: 1.0
**Last Updated**: January 12, 2026
**Total Requirements**: 40+ detailed requirements
