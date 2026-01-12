# Frontend Unit Tests - Technical Design

**Plan**: Frontend Unit Tests
**Version**: 1.0
**Last Updated**: January 12, 2026

---

## Table of Contents

1. [Testing Architecture](#testing-architecture)
2. [Jest Configuration](#jest-configuration)
3. [Testing Patterns](#testing-patterns)
4. [Mocking Strategy](#mocking-strategy)
5. [Test Examples](#test-examples)

---

## Testing Architecture

### Test Pyramid

```
                 /\
                /  \
               / E2E \        ← Playwright (user flows)
              / 20%  \
             /--------\
            / API     \     ← Playwright API (endpoints)
           /  10%     \
          /-----------\
         /Integration \   ← Frontend + Backend (Jest + MSW)
        /    20%      \
       /----------------\
      /   Unit Tests    \  ← Jest + RTL (THIS PLAN)
     /      50%         \
    /----------------------\
```

**Unit Test Scope**:
- Component testing (UI rendering, interactions)
- Hook testing (state management, side effects)
- Utility testing (pure functions)
- Service testing (API calls with mocks)
- Context testing (provider behavior)

---

## Jest Configuration

### Base Configuration

**File**: `jest.config.js`

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Test environment
  testEnvironment: 'jest-environment-jsdom',

  // Module aliases
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/services/(.*)$': '<rootDir>/src/services/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/context/(.*)$': '<rootDir>/src/context/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/utils/(.*)$': '<rootDir>/src/utils/$1',

    // CSS modules
    '\\.css$': 'identity-obj-proxy',
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.module\\.scss$': 'identity-obj-proxy',

    // Assets
    '\\.(jpg|jpeg|png|gif|svg|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest', {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }],
  },

  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],

  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/e2e/',
    '<rootDir>/tests/api/',
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/main.tsx', // Entry point
  ],

  // Coverage thresholds
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 80,
      statements: 80,
    },
  },

  // Coverage reporters
  coverageReporters: ['text', 'text-summary', 'html', 'lcov'],

  // Module directories
  moduleDirectories: ['node_modules', '<rootDir>/src'],

  // Verbose output
  verbose: true,
}

module.exports = createJestConfig(customJestConfig)
```

---

### Setup File

**File**: `jest.setup.js`

```javascript
// Import jest-dom matchers
import '@testing-library/jest-dom'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />
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

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Suppress console errors in tests (optional)
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
```

---

## Testing Patterns

### Component Testing Pattern

```typescript
// PhotoCard.test.tsx
import { render, screen, within } from '@/test-utils'
import { PhotoCard } from '../PhotoCard'

describe('PhotoCard', () => {
  const mockPhoto = {
    id: 1,
    title: 'Test Photo',
    description: 'Test description',
    filePath: '/test/photo.jpg',
    likeCount: 5,
    isLikedByUser: false,
  }

  it('renders photo with correct information', () => {
    render(<PhotoCard photo={mockPhoto} />)

    expect(screen.getByAltText('Test Photo')).toBeInTheDocument()
    expect(screen.getByText('Test Photo')).toBeInTheDocument()
    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('shows like count', () => {
    render(<PhotoCard photo={mockPhoto} />)

    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('calls onLike when like button is clicked', async () => {
    const onLike = jest.fn()
    render(<PhotoCard photo={mockPhoto} onLike={onLike} />)

    const likeButton = screen.getByRole('button', { name: /like/i })
    await userEvent.click(likeButton)

    expect(onLike).toHaveBeenCalledWith(1)
  })

  it('shows loading state when isLoading is true', () => {
    render(<PhotoCard photo={mockPhoto} isLoading />)

    expect(screen.getByTestId('photo-card-skeleton')).toBeInTheDocument()
  })
})
```

---

### Hook Testing Pattern

```typescript
// useToast.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { useToast } from '../useToast'
import { ToastProvider } from '@/context/ToastContext'

const wrapper = ({ children }) => <ToastProvider>{children}</ToastProvider>

describe('useToast', () => {
  it('initializes with empty toasts', () => {
    const { result } = renderHook(() => useToast(), { wrapper })

    expect(result.current.toasts).toEqual([])
  })

  it('adds toast when success is called', () => {
    const { result } = renderHook(() => useToast(), { wrapper })

    act(() => {
      result.current.success('Success message')
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]).toMatchObject({
      type: 'success',
      message: 'Success message',
    })
  })

  it('removes toast when removeToast is called', () => {
    const { result } = renderHook(() => useToast(), { wrapper })

    act(() => {
      result.current.success('Test message')
    })
    const toastId = result.current.toasts[0].id

    act(() => {
      result.current.removeToast(toastId)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('auto-dismisses toast after duration', async () => {
    jest.useFakeTimers()
    const { result } = renderHook(() => useToast(), { wrapper })

    act(() => {
      result.current.success('Test message', 1000)
    })

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    await waitFor(() => {
      expect(result.current.toasts).toHaveLength(0)
    })

    jest.useRealTimers()
  })
})
```

---

### Service Testing Pattern

```typescript
// authService.test.ts
import { login, register } from '../authService'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

describe('authService', () => {
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('login', () => {
    it('returns user data on successful login', async () => {
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json({
            token: 'test-token',
            user: { id: 1, email: 'test@example.com' },
          })
        })
      )

      const result = await login('test@example.com', 'password')

      expect(result).toEqual({
        token: 'test-token',
        user: { id: 1, email: 'test@example.com' },
      })
    })

    it('throws error on failed login', async () => {
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json(
            { message: 'Invalid credentials' },
            { status: 401 }
          )
        })
      )

      await expect(
        login('test@example.com', 'wrong-password')
      ).rejects.toThrow('Invalid credentials')
    })

    it('handles network errors', async () => {
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.error()
        })
      )

      await expect(
        login('test@example.com', 'password')
      ).rejects.toThrow()
    })
  })
})
```

---

### Utility Testing Pattern

```typescript
// validation.test.ts
import { validateEmail, validatePassword, formatFileSize } from '../validation'

describe('validateEmail', () => {
  it('returns true for valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true)
  })

  it('returns false for invalid email', () => {
    expect(validateEmail('invalid')).toBe(false)
    expect(validateEmail('@example.com')).toBe(false)
    expect(validateEmail('test@')).toBe(false)
    expect(validateEmail('')).toBe(false)
  })

  it('returns false for null or undefined', () => {
    expect(validateEmail(null)).toBe(false)
    expect(validateEmail(undefined)).toBe(false)
  })
})

describe('formatFileSize', () => {
  it('formats bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 Bytes')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1048576)).toBe('1 MB')
    expect(formatFileSize(1073741824)).toBe('1 GB')
  })

  it('handles decimal values', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(1572864)).toBe('1.5 MB')
  })

  it('handles edge cases', () => {
    expect(formatFileSize(-1)).toBe('0 Bytes')
    expect(formatFileSize(NaN)).toBe('0 Bytes')
  })
})
```

---

## Mocking Strategy

### MSW Setup

**File**: `mocks/handlers.ts`

```typescript
import { http, HttpResponse } from 'msw'

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json()
    if (body.email === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        token: 'mock-token',
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
      })
    }
    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      token: 'mock-token',
      user: { id: 1, email: body.email, name: body.name },
    })
  }),

  // Gallery endpoints
  http.get('/api/gallery/public', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '0')
    const size = parseInt(url.searchParams.get('size') || '12')

    return HttpResponse.json({
      photos: Array.from({ length: size }, (_, i) => ({
        id: i + 1,
        title: `Photo ${i + 1}`,
        filePath: `/photo-${i + 1}.jpg`,
        likeCount: 0,
        isLikedByUser: false,
      })),
      currentPage: page,
      totalPages: 5,
      totalPhotos: 60,
      pageSize: size,
      hasNext: true,
      hasPrevious: false,
    })
  }),

  http.post('/api/gallery/upload', async ({ request }) => {
    return HttpResponse.json({
      id: 1,
      title: 'Uploaded Photo',
      filePath: '/uploaded.jpg',
      createdAt: new Date().toISOString(),
    })
  }),

  // Photo interactions
  http.post('/api/photos/:id/like', () => {
    return HttpResponse.json({ likeCount: 1, isLiked: true })
  }),

  http.delete('/api/photos/:id/like', () => {
    return HttpResponse.json({ likeCount: 0, isLiked: false })
  }),

  // Profile endpoints
  http.get('/api/profile', () => {
    return HttpResponse.json({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      profilePicture: null,
    })
  }),

  http.put('/api/profile', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      id: 1,
      ...body,
    })
  }),
]
```

**File**: `mocks/server.ts`

```typescript
import { setupServer } from 'msw/node'
import { handlers } from './handlers'

export const server = setupServer(...handlers)
```

---

## Test Examples

### Form Component Test

```typescript
// LoginForm.test.tsx
import { render, screen, waitFor } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '../LoginForm'

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />)

    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(<LoginForm />)

    const submitButton = screen.getByRole('button', { name: 'Login' })
    await userEvent.click(submitButton)

    expect(await screen.findByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    render(<LoginForm />)

    const emailInput = screen.getByLabelText('Email')
    await userEvent.type(emailInput, 'invalid-email')
    await userEvent.tab()

    expect(await screen.findByText('Please enter a valid email')).toBeInTheDocument()
  })

  it('submits form with valid data', async () => {
    const onSubmit = jest.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('shows loading state during submission', async () => {
    const onSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 1000)))
    render(<LoginForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    expect(screen.getByRole('button', { name: 'Loading...' })).toBeInTheDocument()
  })
})
```

---

### Dropdown Component Test

```typescript
// FilterDropdown.test.tsx
import { render, screen } from '@/test-utils'
import userEvent from '@testing-library/user-event'
import { FilterDropdown } from '../FilterDropdown'

describe('FilterDropdown', () => {
  it('renders with current filter selected', () => {
    render(<FilterDropdown currentFilter="all" onFilterChange={jest.fn()} />)

    expect(screen.getByRole('button', { name: /all photos/i })).toBeInTheDocument()
  })

  it('opens dropdown when clicked', async () => {
    render(<FilterDropdown currentFilter="all" onFilterChange={jest.fn()} />)

    const button = screen.getByRole('button', { name: /all photos/i })
    await userEvent.click(button)

    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /my photos/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /liked photos/i })).toBeInTheDocument()
  })

  it('calls onFilterChange when option is selected', async () => {
    const onFilterChange = jest.fn()
    render(<FilterDropdown currentFilter="all" onFilterChange={onFilterChange} />)

    await userEvent.click(screen.getByRole('button'))
    await userEvent.click(screen.getByRole('menuitem', { name: /my photos/i }))

    expect(onFilterChange).toHaveBeenCalledWith('my-photos')
  })

  it('closes dropdown when clicking outside', async () => {
    render(
      <>
        <FilterDropdown currentFilter="all" onFilterChange={jest.fn()} />
        <div data-testid="outside">Outside</div>
      </>
    )

    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('outside'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes dropdown with ESC key', async () => {
    render(<FilterDropdown currentFilter="all" onFilterChange={jest.fn()} />)

    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('menu')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
```

---

**Technical Design Version**: 1.0
**Last Updated**: January 12, 2026
**Ready for Implementation**: Yes
