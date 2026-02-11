# Frontend Unit Tests - Technical Design

**Plan**: Frontend Unit Tests
**Created**: February 11, 2026

---

## 1. Architecture Overview

### 1.1 Test Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Test Runner (Jest)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Component    │  │    Hook      │  │   Utility    │     │
│  │    Tests     │  │    Tests     │  │    Tests     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│          │                 │                  │              │
│          └─────────────────┴──────────────────┘              │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │  Test Utilities │                        │
│                   │  (RTL + Custom) │                        │
│                   └────────┬────────┘                        │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │      MSW        │                        │
│                   │  (API Mocking)  │                        │
│                   └─────────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Test File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── PhotoCard.tsx
│   │   ├── PhotoCard.test.tsx       ← Component tests
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.test.tsx       ← Component tests
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useAuth.test.ts         ← Hook tests
│   │   └── ...
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── utils.test.ts           ← Utility tests
│   │   └── apiClient.ts
│   │   └── apiClient.test.ts       ← Utility tests
│   ├── services/
│   │   ├── authService.ts
│   │   ├── authService.test.ts     ← Service tests (MSW)
│   │   └── ...
│   └── __tests__/
│       ├── test-utils.tsx          ← Shared test utilities
│       ├── mocks/
│       │   ├── handlers.ts         ← MSW handlers
│       │   └── data.ts             ← Mock data generators
│       └── setup.ts                ← Test setup
```

---

## 2. Jest Configuration

### 2.1 jest.config.js

Update `frontend/jest.config.js`:

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Setup files to run before each test
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],

  // Test environment
  testEnvironment: 'jsdom',

  // Module paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // Transform files
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

  // Ignore patterns
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/__tests__/helpers/',
  ],

  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
```

### 2.2 Test Setup File

Create `frontend/src/__tests__/setup.ts`:

```typescript
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill for TextEncoder/TextDecoder
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
} as any

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock next/router
jest.mock('next/router', () => require('next-router-mock'))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))
```

---

## 3. MSW Configuration

### 3.1 MSW Setup

Create `frontend/src/__tests__/mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

// Mock data generators
import { createMockUser, createMockPhoto } from './data'

// Auth handlers
export const authHandlers = [
  // Login
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = await request.json()

    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: createMockUser(),
      })
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  // Register
  http.post('/api/auth/register', async ({ request }) => {
    const data = await request.json()

    return HttpResponse.json({
      token: 'mock-jwt-token',
      user: createMockUser(data),
    })
  }),

  // Get current user
  http.get('/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader) {
      return HttpResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    return HttpResponse.json(createMockUser())
  }),
]

// Gallery handlers
export const galleryHandlers = [
  // Get public photos
  http.get('/api/photos/public', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '0')
    const size = parseInt(url.searchParams.get('size') || '10')

    return HttpResponse.json({
      content: Array.from({ length: size }, () => createMockPhoto()),
      page: page,
      size: size,
      totalElements: 100,
      totalPages: 10,
      hasNext: page < 9,
      hasPrevious: page > 0,
    })
  }),

  // Get photo by ID
  http.get('/api/photos/:id', ({ params }) => {
    return HttpResponse.json(createMockPhoto({ id: params.id }))
  }),

  // Upload photo
  http.post('/api/photos', async ({ request }) => {
    return HttpResponse.json(createMockPhoto())
  }),
]

// Photo like handlers
export const likeHandlers = [
  // Like photo
  http.post('/api/photos/:id/like', ({ params }) => {
    return HttpResponse.json({
      liked: true,
      likeCount: 5,
    })
  }),

  // Unlike photo
  http.delete('/api/photos/:id/like', ({ params }) => {
    return HttpResponse.json({
      liked: false,
      likeCount: 4,
    })
  }),

  // Get liked photos
  http.get('/api/photos/liked', () => {
    return HttpResponse.json({
      content: Array.from({ length: 5 }, () => createMockPhoto()),
      page: 0,
      size: 10,
      totalElements: 5,
      totalPages: 1,
    })
  }),
]

// Photo favorite handlers
export const favoriteHandlers = [
  // Favorite photo
  http.post('/api/photos/:id/favorite', ({ params }) => {
    return HttpResponse.json({
      favorited: true,
    })
  }),

  // Unfavorite photo
  http.delete('/api/photos/:id/favorite', ({ params }) => {
    return HttpResponse.json({
      favorited: false,
    })
  }),

  // Get favorited photos
  http.get('/api/photos/favorites', () => {
    return HttpResponse.json({
      content: Array.from({ length: 3 }, () => createMockPhoto()),
      page: 0,
      size: 10,
      totalElements: 3,
      totalPages: 1,
    })
  }),
]

// Combine all handlers
export const handlers = [
  ...authHandlers,
  ...galleryHandlers,
  ...likeHandlers,
  ...favoriteHandlers,
]

// Setup MSW server
export const server = setupServer(...handlers)
```

### 3.2 Mock Data Generators

Create `frontend/src/__tests__/mocks/data.ts`:

```typescript
import { Photo, User } from '@/types'

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    name: 'Test User',
    profilePictureUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  }
}

export function createMockPhoto(overrides: Partial<Photo> = {}): Photo {
  const id = Math.random().toString(36).substring(7)
  return {
    id,
    title: `Test Photo ${id}`,
    description: 'This is a test photo description',
    imageUrl: `https://example.com/photos/${id}.jpg`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likeCount: Math.floor(Math.random() * 100),
    isLiked: false,
    isFavorited: false,
    owner: createMockUser(),
    ownerId: '1',
    ...overrides,
  }
}

export function createMockPhotos(count: number): Photo[] {
  return Array.from({ length: count }, () => createMockPhoto())
}
```

---

## 4. Test Utilities

### 4.1 Custom Render Function

Create `frontend/src/__tests__/test-utils.tsx`:

```typescript
import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '@/contexts/ToastContext'
import { AuthProvider } from '@/contexts/AuthContext'

// Test providers wrapper
interface TestProvidersProps {
  children: React.ReactNode
}

const TestProviders: React.FC<TestProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

// Custom render function
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: TestProviders, ...options })
}

// Re-export everything from RTL
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
```

---

## 5. Testing Patterns

### 5.1 Component Testing Pattern

```typescript
// Example: PhotoCard.test.tsx
import { renderWithProviders, screen, fireEvent, waitFor } from '@/__tests__/test-utils'
import { createMockPhoto } from '@/__tests__/mocks/data'
import PhotoCard from './PhotoCard'

describe('PhotoCard', () => {
  const mockPhoto = createMockPhoto({
    id: '123',
    title: 'Test Photo',
    likeCount: 5,
    isLiked: false,
  })

  it('should render photo correctly', () => {
    renderWithProviders(<PhotoCard photo={mockPhoto} />)

    expect(screen.getByAltText('Test Photo')).toBeInTheDocument()
    expect(screen.getByText('Test Photo')).toBeInTheDocument()
  })

  it('should display like count', () => {
    renderWithProviders(<PhotoCard photo={mockPhoto} />)

    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should toggle like status when like button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PhotoCard photo={mockPhoto} />)

    const likeButton = screen.getByTitle('Like photo')

    await user.click(likeButton)

    await waitFor(() => {
      expect(likeButton).toHaveAttribute('aria-pressed', 'true')
    })
  })

  it('should disable like button for own photo', () => {
    const ownPhoto = createMockPhoto({ isOwnPhoto: true })
    renderWithProviders(<PhotoCard photo={ownPhoto} />)

    const likeButton = screen.getByTitle('You cannot like your own photo')

    expect(likeButton).toBeDisabled()
  })
})
```

### 5.2 Hook Testing Pattern

```typescript
// Example: useAuth.test.ts
import { renderHook, act, waitFor } from '@testing-library/react'
import { server } from '@/__tests__/mocks/handlers'
import { useAuth } from './useAuth'

describe('useAuth', () => {
  beforeEach(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })

    await waitFor(() => {
      expect(result.current.user).toBeTruthy()
      expect(result.current.isAuthenticated).toBe(true)
    })
  })

  it('should handle login failure', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await expect(
        result.current.login('wrong@example.com', 'wrong')
      ).rejects.toThrow()
    })

    expect(result.current.user).toBeNull()
  })

  it('should logout and clear user data', async () => {
    const { result } = renderHook(() => useAuth())

    // First login
    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })

    await waitFor(() => {
      expect(result.current.user).toBeTruthy()
    })

    // Then logout
    act(() => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})
```

### 5.3 Service Testing Pattern

```typescript
// Example: authService.test.ts
import { server } from '@/__tests__/mocks/handlers'
import { login } from './authService'

describe('authService', () => {
  beforeEach(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  it('should login with valid credentials', async () => {
    const response = await login('test@example.com', 'password')

    expect(response.token).toBe('mock-jwt-token')
    expect(response.user).toBeTruthy()
  })

  it('should throw error with invalid credentials', async () => {
    await expect(
      login('wrong@example.com', 'wrong')
    ).rejects.toThrow('Invalid credentials')
  })
})
```

### 5.4 Utility Testing Pattern

```typescript
// Example: utils.test.ts
import { formatFileSize, formatDate, validateEmail } from './utils'

describe('formatFileSize', () => {
  it('should format bytes correctly', () => {
    expect(formatFileSize(500)).toBe('500 B')
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1024 * 1024)).toBe('1 MB')
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
  })
})

describe('formatDate', () => {
  it('should format relative time', () => {
    const now = new Date()
    expect(formatDate(now.toISOString())).toBe('just now')

    const yesterday = new Date(Date.now() - 86400000)
    expect(formatDate(yesterday.toISOString())).toBe('1 day ago')
  })
})

describe('validateEmail', () => {
  it('should validate email correctly', () => {
    expect(validateEmail('test@example.com')).toBe(true)
    expect(validateEmail('invalid')).toBe(false)
    expect(validateEmail('test@')).toBe(false)
    expect(validateEmail('@example.com')).toBe(false)
  })
})
```

---

## 6. Installation Commands

```bash
# Install MSW for API mocking
npm install --save-dev msw

# Install user-event for realistic user interactions
npm install --save-dev @testing-library/user-event

# (Optional) Install jest-extended for custom matchers
npm install --save-dev jest-extended
```

---

## 7. Package.json Scripts

Update `frontend/package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

---

**Technical Design Version**: 1.0
**Last Updated**: February 11, 2026
