# Technical Design: Backend API Testing with MCP Playwright

## Architecture Overview

This implementation uses Playwright's `request` context for direct HTTP API testing without browser automation. The architecture separates API tests from E2E tests while sharing the same Playwright test runner.

### System Architecture

```
API Testing Architecture:

┌─────────────────────────────────────────────────────────────┐
│                     Playwright Test Runner                  │
│                                                              │
│  ┌────────────────┐              ┌────────────────┐        │
│  │   E2E Tests    │              │   API Tests    │        │
│  │  (Browser)     │              │  (Request API) │        │
│  └────────────────┘              └────────────────┘        │
│         │                                 │                 │
│         │                                 │                 │
│         v                                 v                 │
│  ┌────────────────┐              ┌────────────────┐        │
│  │ Browser Context│              │Request Context │        │
│  │  (Chromium)    │              │  (HTTP Client) │        │
│  └────────────────┘              └────────────────┘        │
└─────────────────────────────────────────────────────────────┘
         │                                 │
         v                                 v
┌────────────────┐              ┌────────────────┐
│   Frontend     │              │   Backend API  │
│ localhost:3001 │◄─────────────┤ localhost:8081 │
└────────────────┘              └────────────────┘
                                        │
                                        v
                                ┌────────────────┐
                                │   PostgreSQL   │
                                │    Database    │
                                └────────────────┘

MCP Integration:
┌─────────────────┐
│  MCP Server     │
│  (Playwright)   │
└─────────────────┘
         │
         v
┌─────────────────┐
│ Playwright Tests│
│   (API + E2E)   │
└─────────────────┘
```

### API Test Flow

```
Test Execution Flow:

┌─────────────┐
│ Test Suite  │
│  Start      │
└──────┬──────┘
       │
       v
┌─────────────────────┐
│ Setup Phase:        │
│ - Create test data  │
│ - Get auth tokens   │
└──────┬──────────────┘
       │
       v
┌─────────────────────┐
│ Test Phase:         │
│ - Send HTTP request │
│ - Receive response  │
│ - Validate response │
└──────┬──────────────┘
       │
       v
┌─────────────────────┐
│ Cleanup Phase:      │
│ - Delete test data  │
│ - Clear tokens      │
└──────┬──────────────┘
       │
       v
┌─────────────┐
│ Test Suite  │
│  Complete   │
└─────────────┘
```

### JWT Authentication Flow in Tests

```
Protected Endpoint Testing Flow:

1. Register/Login to get JWT
   ┌─────────────────────────────────────┐
   │ POST /api/auth/login                │
   │ { email, password }                 │
   └────────────┬────────────────────────┘
                v
   ┌─────────────────────────────────────┐
   │ Response: { token: "eyJhbGc..." }   │
   └────────────┬────────────────────────┘
                v
   ┌─────────────────────────────────────┐
   │ Store token in test context         │
   └────────────┬────────────────────────┘

2. Use JWT for protected endpoints
                v
   ┌─────────────────────────────────────┐
   │ GET /api/user/profile               │
   │ Authorization: Bearer <token>       │
   └────────────┬────────────────────────┘
                v
   ┌─────────────────────────────────────┐
   │ Backend validates JWT               │
   └────────────┬────────────────────────┘
                v
   ┌─────────────────────────────────────┐
   │ Response: { user profile data }     │
   └─────────────────────────────────────┘
```

## Implementation Approach

### Playwright Request API Usage

Instead of using browser automation, we use Playwright's `request` context:

```typescript
// Example: API test using request context
test('should login with valid credentials', async ({ request }) => {
  const response = await request.post('http://localhost:8081/api/auth/login', {
    data: {
      email: 'test@example.com',
      password: 'Password123!'
    }
  });

  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.success).toBe(true);
  expect(data.token).toBeTruthy();
});
```

### Test Organization Strategy

**Directory Structure:**
```
tests/
├── api/                          # NEW: API tests (no browser)
│   ├── auth.api.spec.ts         # Authentication endpoint tests
│   ├── users.api.spec.ts        # User management endpoint tests
│   ├── protected.api.spec.ts    # Protected endpoint tests
│   ├── errors.api.spec.ts       # Error handling tests
│   └── helpers/                 # Test utilities
│       ├── api-client.ts        # API request wrapper
│       ├── test-data.ts         # Test data generators
│       ├── auth-helper.ts       # JWT token management
│       └── cleanup.ts           # Database cleanup utilities
├── e2e/                          # EXISTING: E2E tests (browser)
│   ├── registration.spec.ts
│   └── login.spec.ts
└── fixtures/                     # EXISTING: Shared fixtures
    └── test-users.ts
```

### Test Naming Convention

**File naming:**
- `*.api.spec.ts` - API tests using request context
- `*.spec.ts` - E2E tests using browser context

**Test naming:**
- `should [action] when [condition]`
- Example: `should return 401 when token is expired`

### MCP Integration Strategy

**MCP Configuration File:** `.mcprc.json` (project root)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-playwright"],
      "env": {
        "PLAYWRIGHT_CONFIG": "./playwright.config.ts"
      }
    }
  }
}
```

**MCP Usage in Tests:**
- MCP server provides automation capabilities
- Tests can be triggered via MCP
- Results available in MCP-compatible format

## Code Structure

### Files to Create

**Test Files:**

1. **tests/api/auth.api.spec.ts**
   - Registration tests (valid, duplicate, validation)
   - Login tests (valid, invalid credentials)
   - Token refresh tests
   - Token validation tests
   - Health check test

2. **tests/api/users.api.spec.ts**
   - Create user tests
   - Get all users tests
   - Get user by ID tests
   - Update user tests
   - Delete user tests
   - Get user by email tests
   - Check email exists tests
   - Get user count tests

3. **tests/api/protected.api.spec.ts**
   - Profile endpoint with valid token
   - Profile endpoint without token
   - Dashboard endpoint with valid token
   - Settings endpoint with valid token
   - Expired token handling
   - Invalid token handling

4. **tests/api/errors.api.spec.ts**
   - 400 Bad Request scenarios
   - 401 Unauthorized scenarios
   - 404 Not Found scenarios
   - 500 Internal Server Error scenarios

**Helper Files:**

5. **tests/api/helpers/api-client.ts**
   - HTTP request wrapper functions
   - Base URL configuration
   - Request/response logging
   - Error handling

6. **tests/api/helpers/test-data.ts**
   - Generate unique emails
   - Generate random user data
   - Generate valid/invalid passwords
   - Create test users

7. **tests/api/helpers/auth-helper.ts**
   - Register and get token
   - Login and get token
   - Add Authorization header
   - Validate token format

8. **tests/api/helpers/cleanup.ts**
   - Delete test users by email pattern
   - Clear test data
   - Database cleanup utilities

**Configuration Files:**

9. **.mcprc.json** (project root)
   - MCP server configuration
   - Playwright integration

10. **playwright.config.ts** (extend existing)
    - Add API test project
    - Configure baseURL for API
    - Add request timeout

**Documentation Files:**

11. **docs/how-to/api-testing.md**
    - Running API tests guide
    - Writing new API tests
    - Test utilities usage
    - Troubleshooting

12. **docs/how-to/mcp-setup.md**
    - MCP installation
    - MCP configuration
    - Running tests via MCP

### Files to Modify

**Existing Files:**

1. **playwright.config.ts**
   - Add `api-tests` project
   - Configure API base URL
   - Add request-specific settings

2. **tests/README.md**
   - Document API test structure
   - Add API testing section
   - Link to how-to guides

3. **plans/README.md**
   - Add this plan to in-progress section

### Example Code Implementations

#### 1. API Client Helper (tests/api/helpers/api-client.ts)

```typescript
import { APIRequestContext } from '@playwright/test';

export const API_BASE_URL = 'http://localhost:8081';

export class ApiClient {
  constructor(private request: APIRequestContext) {}

  async post(endpoint: string, data: any, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request.post(`${API_BASE_URL}${endpoint}`, {
      data,
      headers,
    });
  }

  async get(endpoint: string, token?: string) {
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request.get(`${API_BASE_URL}${endpoint}`, {
      headers,
    });
  }

  async put(endpoint: string, data: any, token?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request.put(`${API_BASE_URL}${endpoint}`, {
      data,
      headers,
    });
  }

  async delete(endpoint: string, token?: string) {
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.request.delete(`${API_BASE_URL}${endpoint}`, {
      headers,
    });
  }
}
```

#### 2. Test Data Generator (tests/api/helpers/test-data.ts)

```typescript
export class TestDataGenerator {
  static generateUniqueEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `test.api.${timestamp}.${random}@example.com`;
  }

  static generateRandomFullName(): string {
    const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie'];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
  }

  static generateValidPassword(): string {
    return 'SecurePass123!';
  }

  static generateWeakPassword(): string {
    return 'weak';
  }

  static generateValidUserData() {
    return {
      fullName: this.generateRandomFullName(),
      email: this.generateUniqueEmail(),
      password: this.generateValidPassword(),
    };
  }

  static generateRegistrationData() {
    const userData = this.generateValidUserData();
    return {
      ...userData,
      confirmPassword: userData.password,
    };
  }
}
```

#### 3. Auth Helper (tests/api/helpers/auth-helper.ts)

```typescript
import { APIRequestContext } from '@playwright/test';
import { ApiClient } from './api-client';
import { TestDataGenerator } from './test-data';

export class AuthHelper {
  private apiClient: ApiClient;

  constructor(request: APIRequestContext) {
    this.apiClient = new ApiClient(request);
  }

  async registerAndGetToken() {
    const userData = TestDataGenerator.generateRegistrationData();

    const response = await this.apiClient.post('/api/auth/register', userData);
    const data = await response.json();

    if (!data.success || !data.token) {
      throw new Error('Registration failed');
    }

    return {
      token: data.token,
      userId: data.userId,
      email: data.email,
      fullName: data.fullName,
    };
  }

  async loginAndGetToken(email: string, password: string) {
    const response = await this.apiClient.post('/api/auth/login', {
      email,
      password,
    });

    const data = await response.json();

    if (!data.success || !data.token) {
      throw new Error('Login failed');
    }

    return data.token;
  }

  validateTokenFormat(token: string): boolean {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    return parts.length === 3;
  }
}
```

#### 4. Authentication API Tests (tests/api/auth.api.spec.ts)

```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from './helpers/api-client';
import { TestDataGenerator } from './helpers/test-data';
import { AuthHelper } from './helpers/auth-helper';

test.describe('Authentication API Tests', () => {
  let apiClient: ApiClient;
  let authHelper: AuthHelper;

  test.beforeEach(async ({ request }) => {
    apiClient = new ApiClient(request);
    authHelper = new AuthHelper(request);
  });

  test.describe('POST /api/auth/register', () => {
    test('should register successfully with valid data', async () => {
      const userData = TestDataGenerator.generateRegistrationData();

      const response = await apiClient.post('/api/auth/register', userData);

      expect(response.status()).toBe(201);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.token).toBeTruthy();
      expect(authHelper.validateTokenFormat(data.token)).toBe(true);
      expect(data.email).toBe(userData.email);
      expect(data.fullName).toBe(userData.fullName);
      expect(data.userId).toBeTruthy();
    });

    test('should reject duplicate email registration', async () => {
      // Use existing user from fixtures
      const userData = {
        fullName: 'Duplicate User',
        email: 'testuser123@example.com', // Existing user
        password: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      };

      const response = await apiClient.post('/api/auth/register', userData);

      expect(response.status()).toBe(400);

      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toContain('already exists');
    });

    test('should validate required fields', async () => {
      const invalidData = {
        fullName: '',
        email: '',
        password: '',
      };

      const response = await apiClient.post('/api/auth/register', invalidData);

      expect(response.status()).toBe(400);
    });

    test('should validate email format', async () => {
      const userData = TestDataGenerator.generateRegistrationData();
      userData.email = 'invalid-email-format';

      const response = await apiClient.post('/api/auth/register', userData);

      expect(response.status()).toBe(400);
    });
  });

  test.describe('POST /api/auth/login', () => {
    test('should login successfully with valid credentials', async () => {
      // Use existing test user
      const credentials = {
        email: 'testuser123@example.com',
        password: 'Test@123',
      };

      const response = await apiClient.post('/api/auth/login', credentials);

      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.token).toBeTruthy();
      expect(authHelper.validateTokenFormat(data.token)).toBe(true);
      expect(data.email).toBe(credentials.email);
    });

    test('should reject invalid credentials', async () => {
      const credentials = {
        email: 'testuser123@example.com',
        password: 'WrongPassword123!',
      };

      const response = await apiClient.post('/api/auth/login', credentials);

      expect(response.status()).toBe(401);

      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('should reject non-existent user', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      const response = await apiClient.post('/api/auth/login', credentials);

      expect(response.status()).toBe(401);

      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });

  test.describe('POST /api/auth/refresh', () => {
    test('should refresh valid token', async () => {
      const { token } = await authHelper.registerAndGetToken();

      const response = await apiClient.post('/api/auth/refresh?token=' + token, {});

      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.token).toBeTruthy();
      expect(data.token).not.toBe(token); // New token should be different
    });

    test('should reject invalid token', async () => {
      const invalidToken = 'invalid.token.format';

      const response = await apiClient.post('/api/auth/refresh?token=' + invalidToken, {});

      expect(response.status()).toBe(401);
    });
  });

  test.describe('POST /api/auth/validate', () => {
    test('should validate valid token', async () => {
      const { token, email } = await authHelper.registerAndGetToken();

      const response = await apiClient.post(
        `/api/auth/validate?token=${token}&email=${email}`,
        {}
      );

      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.valid).toBe(true);
    });

    test('should reject invalid token', async () => {
      const invalidToken = 'invalid.token.format';
      const email = 'test@example.com';

      const response = await apiClient.post(
        `/api/auth/validate?token=${invalidToken}&email=${email}`,
        {}
      );

      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.valid).toBe(false);
    });
  });

  test.describe('GET /api/auth/health', () => {
    test('should return health check status', async () => {
      const response = await apiClient.get('/api/auth/health');

      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.status).toBe('UP');
      expect(data.service).toBe('AuthController');
    });
  });
});
```

#### 5. Extended Playwright Config

```typescript
// Add to existing playwright.config.ts

export default defineConfig({
  // ... existing config ...

  projects: [
    // Existing browser projects
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // NEW: API testing project (no browser)
    {
      name: 'api-tests',
      testDir: './tests/api',
      use: {
        baseURL: 'http://localhost:8081',
        extraHTTPHeaders: {
          'Accept': 'application/json',
        },
      },
    },
  ],
});
```

## Technology Choices

### Testing Framework
- **@playwright/test**: Provides both browser and request API
- Already installed and configured
- Supports TypeScript natively
- Built-in assertions and fixtures

### HTTP Client
- **Playwright Request API**: Built into @playwright/test
- No additional dependencies needed
- Consistent with existing E2E tests
- Supports all HTTP methods

### Test Data Management
- **Custom generators**: Lightweight, no external dependencies
- Unique emails using timestamps
- Random data generation for realistic tests

### MCP Integration
- **@modelcontextprotocol/server-playwright**: Official MCP server for Playwright
- Enables automation via MCP
- Configuration-based setup

## API Endpoints Reference

### Authentication Endpoints (AuthController)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /api/auth/register | No | User registration |
| POST | /api/auth/login | No | User login |
| POST | /api/auth/refresh | No | Token refresh |
| POST | /api/auth/validate | No | Token validation |
| GET | /api/auth/health | No | Health check |

### User Management Endpoints (UserController)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | /api/users | No | Create user |
| GET | /api/users | No | Get all users |
| GET | /api/users/{id} | No | Get user by ID |
| PUT | /api/users/{id} | No | Update user |
| DELETE | /api/users/{id} | No | Delete user |
| GET | /api/users/email/{email} | No | Get user by email |
| GET | /api/users/check-email/{email} | No | Check email exists |
| GET | /api/users/count | No | Get user count |

### Protected Endpoints (UserProfileController)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | /api/user/profile | Yes | Get current user profile |
| GET | /api/user/dashboard | Yes | Get user dashboard |
| GET | /api/user/settings | Yes | Get user settings |

## Integration Points

### Database Integration
- Tests use real PostgreSQL database
- Test data cleanup required after tests
- Use unique emails to avoid conflicts
- Consider using test-specific email pattern (test.api.*)

### Backend Integration
- Backend must be running on localhost:8081
- Tests make real HTTP requests (no mocking)
- Verify backend health before running tests
- Handle backend errors gracefully

### Frontend Independence
- API tests completely independent from frontend
- Can run without frontend server
- No UI interactions
- Pure backend validation

### CI/CD Integration
- Tests can run in GitHub Actions
- Require PostgreSQL service container
- Require backend build and startup
- Test results in JSON format for reporting

## Daily Implementation Plan

### Day 1: Infrastructure Setup (Commit 1)
**Goal:** Setup MCP Playwright + API test infrastructure

**Tasks:**
- Install MCP Playwright server
- Create .mcprc.json configuration
- Create tests/api/ directory structure
- Create helper files (api-client.ts, test-data.ts, auth-helper.ts, cleanup.ts)
- Extend playwright.config.ts for API tests
- Create basic health check test
- Verify MCP integration works

**Commit Message:**
```
feat: setup MCP Playwright for API testing infrastructure

- Install @modelcontextprotocol/server-playwright
- Configure MCP in .mcprc.json
- Create tests/api directory structure
- Implement API client helper utilities
- Add test data generators
- Extend Playwright config for API testing
- Add health check smoke test

Day 1/5: API Testing Infrastructure
```

### Day 2: Authentication Tests (Commit 2)
**Goal:** Complete all authentication endpoint tests

**Tasks:**
- Create auth.api.spec.ts
- Test POST /api/auth/register (valid, duplicate, validation)
- Test POST /api/auth/login (valid, invalid, non-existent)
- Test POST /api/auth/refresh (valid token, invalid token)
- Test POST /api/auth/validate (valid, invalid, expired)
- Test GET /api/auth/health
- Verify all tests pass

**Commit Message:**
```
feat: add comprehensive authentication API tests

- Implement registration tests (valid, duplicate, validation)
- Implement login tests (valid, invalid credentials)
- Implement token refresh tests
- Implement token validation tests
- Add health check endpoint test
- All auth endpoints covered with success and error cases

Day 2/5: Authentication API Tests
```

### Day 3: User Management Tests (Commit 3)
**Goal:** Complete all user CRUD operation tests

**Tasks:**
- Create users.api.spec.ts
- Test POST /api/users (create user)
- Test GET /api/users (get all users)
- Test GET /api/users/{id} (get by ID, not found)
- Test PUT /api/users/{id} (update user)
- Test DELETE /api/users/{id} (delete user)
- Test GET /api/users/email/{email} (get by email)
- Test GET /api/users/check-email/{email} (check exists)
- Test GET /api/users/count (get count)
- Implement cleanup utilities

**Commit Message:**
```
feat: add user management CRUD API tests

- Implement create user tests
- Implement get all users tests
- Implement get by ID tests (found, not found)
- Implement update user tests
- Implement delete user tests
- Implement email lookup tests
- Implement user count tests
- Add database cleanup utilities

Day 3/5: User Management API Tests
```

### Day 4: Protected Endpoints Tests (Commit 4)
**Goal:** Complete JWT authentication and protected endpoint tests

**Tasks:**
- Create protected.api.spec.ts
- Test GET /api/user/profile (with token, without token, invalid token)
- Test GET /api/user/dashboard (authenticated, unauthenticated)
- Test GET /api/user/settings (authenticated, unauthenticated)
- Test expired token handling
- Test token format validation
- Test Authorization header variations

**Commit Message:**
```
feat: add protected endpoints and JWT authorization tests

- Implement profile endpoint tests (authenticated/unauthenticated)
- Implement dashboard endpoint tests
- Implement settings endpoint tests
- Add expired token handling tests
- Add invalid token tests
- Add missing Authorization header tests
- Verify JWT authentication flow end-to-end

Day 4/5: Protected Endpoints & JWT Tests
```

### Day 5: Error Handling & Documentation (Commit 5)
**Goal:** Complete error handling tests and documentation

**Tasks:**
- Create errors.api.spec.ts
- Test all 400 Bad Request scenarios
- Test all 401 Unauthorized scenarios
- Test all 404 Not Found scenarios
- Test 500 Internal Server Error handling
- Create docs/how-to/api-testing.md
- Create docs/how-to/mcp-setup.md
- Update tests/README.md
- Update plans/README.md

**Commit Message:**
```
feat: add error handling tests and API testing documentation

- Implement 400 Bad Request scenario tests
- Implement 401 Unauthorized scenario tests
- Implement 404 Not Found scenario tests
- Implement 500 error handling tests
- Create API testing how-to guide
- Create MCP setup guide
- Update testing documentation
- Mark plan as complete

Day 5/5: Error Handling & Documentation Complete
```

## Testing Strategy

### Test Independence
- Each test creates its own test data
- Tests don't depend on execution order
- Unique emails prevent data conflicts
- Cleanup after each test suite

### Test Data Management
- Generate unique emails with timestamp
- Use test-specific email pattern (test.api.*)
- Clean up test data after suite completion
- Reuse existing fixture users for login tests

### Error Handling
- Test both success and failure scenarios
- Verify HTTP status codes
- Validate error response format
- Check error messages

### Performance Considerations
- Tests run in parallel where possible
- Request timeout: 30 seconds
- Full test suite target: < 2 minutes
- Database cleanup is async

## Quality Standards

### Code Quality
- TypeScript strict mode
- ESLint compliance
- Consistent formatting
- Clear test descriptions
- AAA pattern (Arrange, Act, Assert)

### Test Quality
- No flaky tests
- Independent tests
- Clear assertions
- Descriptive error messages
- Proper cleanup

### Documentation Quality
- Clear how-to guides
- Step-by-step instructions
- Troubleshooting section
- Code examples
- MCP setup documentation
