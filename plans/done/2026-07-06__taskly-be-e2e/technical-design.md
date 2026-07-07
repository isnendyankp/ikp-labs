# Taskly Backend E2E — Technical Design

## Architecture Overview

`apps/taskly-be-e2e/` is a standalone Nx application that issues real HTTP requests to the `taskly-be` Go server. It does not import any application code — all interaction is over the network.

```text
Playwright Test Runner (workers=1, sequential)
        |
        |  HTTP  (port 8082, no mocking)
        v
apps/taskly-be  (Go + Gin, JWT auth)
        |
        v
PostgreSQL  (taskly database)
```

**Helper layer** (PR 2) sits between the test runner and the HTTP calls:

```text
tests/api/*.api.spec.ts
        |
        +--> AuthHelper.registerAndLogin()
        |         |
        |         +--> ApiClient.post("/api/auth/register")
        |         +--> ApiClient.post("/api/auth/login")
        |
        +--> ApiClient.get / post / put / delete
                  |
                  v
         APIRequestContext  (Playwright built-in)
                  |
                  v
         http://localhost:8082
```

---

## Folder Structure (New Files Only)

```text
apps/taskly-be-e2e/               ← new Nx application
├── .gitignore                     PR 1
├── playwright.config.ts           PR 1
├── project.json                   PR 1
├── tsconfig.json                  PR 1
├── helpers/
│   ├── .gitkeep                   PR 1  (placeholder, removed in PR 2)
│   ├── api-client.ts              PR 2
│   ├── auth-helper.ts             PR 2
│   └── test-data.ts               PR 2
├── tests/
│   └── api/
│       ├── .gitkeep               PR 1  (placeholder, removed in PR 3)
│       ├── auth.api.spec.ts       PR 3
│       └── tasks.api.spec.ts      PR 4
└── README.md                      PR 5
```

---

## PR 1 — Full File Contents

### `apps/taskly-be-e2e/playwright.config.ts`

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.api.spec.ts',
  timeout: process.env.CI ? 60 * 1000 : 30 * 1000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,

  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],

  outputDir: 'test-results/artifacts',

  use: {
    baseURL: 'http://localhost:8082',
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  },

  projects: [
    {
      name: 'api-tests',
      testMatch: '**/*.api.spec.ts',
    },
  ],
});
```

Key differences from `kameravue-be-e2e/playwright.config.ts`:

- `baseURL` is `http://localhost:8082` (not 8081)
- No note about `Content-Type` multipart (taskly-be has no file uploads)

### `apps/taskly-be-e2e/project.json`

```json
{
  "name": "taskly-be-e2e",
  "sourceRoot": "apps/taskly-be-e2e",
  "projectType": "application",
  "targets": {
    "e2e": {
      "executor": "nx:run-commands",
      "options": {
        "command": "playwright test --project=api-tests",
        "cwd": "apps/taskly-be-e2e"
      }
    },
    "e2e:ui": {
      "executor": "nx:run-commands",
      "options": {
        "command": "playwright test --project=api-tests --ui",
        "cwd": "apps/taskly-be-e2e"
      }
    },
    "e2e:debug": {
      "executor": "nx:run-commands",
      "options": {
        "command": "playwright test --project=api-tests --debug",
        "cwd": "apps/taskly-be-e2e"
      }
    }
  },
  "implicitDependencies": ["taskly-be"],
  "tags": ["type:e2e", "scope:taskly", "platform:playwright", "test:api"]
}
```

### `apps/taskly-be-e2e/tsconfig.json`

Identical to `apps/kameravue-be-e2e/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2022",
    "lib": ["ES2022"],
    "types": ["node", "@playwright/test"],
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["**/*.ts", "**/*.js"],
  "exclude": ["node_modules", "test-results", "playwright-report"]
}
```

### `apps/taskly-be-e2e/.gitignore`

```gitignore
node_modules/
playwright-report/
test-results/
.env
```

---

## PR 2 — Helper File Specifications

### `helpers/api-client.ts` — ApiClient Class Interface

```typescript
import { APIRequestContext } from '@playwright/test';

export class ApiClient {
  private baseURL: string;

  constructor(private request: APIRequestContext) {
    this.baseURL = 'http://localhost:8082';
  }

  // POST with optional Bearer token
  // Sets Content-Type: application/json
  async post(
    endpoint: string,
    data: unknown,
    token?: string
  ): Promise<{
    status: number;
    body: unknown;
    headers: Record<string, string>;
  }>;

  // GET with optional Bearer token
  async get(
    endpoint: string,
    token?: string
  ): Promise<{
    status: number;
    body: unknown;
    headers: Record<string, string>;
  }>;

  // PUT with optional Bearer token
  // Sets Content-Type: application/json
  async put(
    endpoint: string,
    data: unknown,
    token?: string
  ): Promise<{
    status: number;
    body: unknown;
    headers: Record<string, string>;
  }>;

  // DELETE with optional Bearer token
  // DELETE /api/tasks/:id returns 204 with no body — body will be {}
  async delete(
    endpoint: string,
    token?: string
  ): Promise<{
    status: number;
    body: unknown;
    headers: Record<string, string>;
  }>;
}
```

No `postMultipart` method — taskly-be has no file upload endpoints.

All methods return `{ status, body, headers }`. The `body` field is the result of `response.json().catch(() => ({}))`, so 204 No Content responses safely return `{}`.

### `helpers/auth-helper.ts` — AuthHelper Class Interface

```typescript
import { ApiClient } from './api-client';

export interface AuthResult {
  token: string;
  userId: number;
  email: string;
}

export class AuthHelper {
  constructor(private client: ApiClient) {}

  // Two-step flow:
  //   1. POST /api/auth/register with {email, password} → 201 {id, email}
  //   2. POST /api/auth/login    with {email, password} → 200 {token}
  // Returns the JWT token, user id, and email.
  // Throws if either call does not return the expected status.
  async registerAndLogin(email: string, password: string): Promise<AuthResult>;
}
```

Important: `POST /api/auth/register` returns `{id, email}` — it does NOT return a token. `AuthHelper.registerAndLogin` must call register then login separately. This is the key difference from `kameravue-be-e2e`'s `registerAndGetToken`, which gets a token from the register response directly.

### `helpers/test-data.ts` — Generator Functions

```typescript
/**
 * Generate a unique email address for test isolation.
 * Format: test.api.<timestamp>.<random>@taskly.test
 * Example: test.api.1751808000000.4723@taskly.test
 */
export function uniqueEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test.api.${timestamp}.${random}@taskly.test`;
}

/**
 * Return a fixed valid password that satisfies the ≥8 char requirement.
 */
export function validPassword(): string {
  return 'Password1!';
}
```

---

## PR 3 — auth.api.spec.ts Structure

### Describe Blocks and Test Names

```text
describe("POST /api/auth/register")
  test: "returns 201 with {id, email} for valid email and password"
  test: "returns 409 when email is already registered"
  test: "returns 400 when email field is missing"
  test: "returns 400 when email is an invalid format"
  test: "returns 400 when password is shorter than 8 characters"

describe("POST /api/auth/login")
  test: "returns 200 with {token} for correct credentials"
  test: "returns 401 for wrong password"
  test: "returns 401 for unknown email"
  test: "returns 400 when email field is missing"
  test: "returns 400 when password field is missing"

describe("GET /api/me")
  test: "returns 200 with {id, email} for valid token"
  test: "returns 401 when Authorization header is absent"
  test: "returns 401 for a malformed token"
```

Total: 13 test cases.

### Import Pattern

```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../helpers/api-client';
import { AuthHelper } from '../../helpers/auth-helper';
import { uniqueEmail, validPassword } from '../../helpers/test-data';
```

### Test Pattern — Each test is independent

```typescript
test('returns 201 with {id, email} for valid email and password', async ({
  request,
}) => {
  const client = new ApiClient(request);
  const email = uniqueEmail();
  const password = validPassword();

  const response = await client.post('/api/auth/register', { email, password });

  expect(response.status).toBe(201);
  expect(response.body).toMatchObject({ email });
  expect((response.body as { id: number }).id).toBeGreaterThan(0);
  // Must NOT include password_hash
  expect(response.body).not.toHaveProperty('password_hash');
});
```

---

## PR 4 — tasks.api.spec.ts Structure

### Describe Blocks and Test Names

```text
describe("POST /api/tasks")
  test: "returns 201 with full task object for valid title"
  test: "returns 400 when title is missing from request body"
  test: "returns 401 when Authorization header is absent"

describe("GET /api/tasks")
  test: "returns 200 with empty array when user has no tasks"
  test: "returns 200 with array containing the user's tasks"
  test: "returns 401 when Authorization header is absent"

describe("GET /api/tasks/:id")
  test: "returns 200 with task object for the task owner"
  test: "returns 403 when another user requests the task"
  test: "returns 404 for a non-existent task id"
  test: "returns 401 when Authorization header is absent"

describe("PUT /api/tasks/:id")
  test: "returns 200 with updated task when title is changed"
  test: "returns 200 when status is changed to in_progress"
  test: "returns 200 when status is changed to done"
  test: "returns 400 when body contains neither title nor status"
  test: "returns 400 when status is an unrecognized value"
  test: "returns 403 when another user updates the task"
  test: "returns 404 for a non-existent task id"
  test: "returns 401 when Authorization header is absent"

describe("DELETE /api/tasks/:id")
  test: "returns 204 when owner deletes their task"
  test: "returns 403 when another user deletes the task"
  test: "returns 404 for a non-existent task id"
  test: "returns 401 when Authorization header is absent"
```

Total: 20 test cases.

### Ownership Test Pattern (FR-5)

```typescript
test('returns 403 when another user requests the task', async ({ request }) => {
  const client = new ApiClient(request);
  const auth = new AuthHelper(client);

  // user_a creates a task
  const userA = await auth.registerAndLogin(uniqueEmail(), validPassword());
  const createResp = await client.post(
    '/api/tasks',
    { title: 'Task A' },
    userA.token
  );
  const taskId = (createResp.body as { id: number }).id;

  // user_b tries to read it
  const userB = await auth.registerAndLogin(uniqueEmail(), validPassword());
  const response = await client.get(`/api/tasks/${taskId}`, userB.token);

  expect(response.status).toBe(403);
  expect(response.body).toMatchObject({ error: 'forbidden' });
});
```

### Auth Guard Test Pattern (FR-4)

```typescript
test('returns 401 when Authorization header is absent', async ({ request }) => {
  const client = new ApiClient(request);
  // No token passed — ApiClient omits Authorization header when token is undefined
  const response = await client.post('/api/tasks', { title: 'Any' });
  expect(response.status).toBe(401);
});
```

For GET/PUT/DELETE auth guard tests, use a hardcoded numeric id (e.g., `999999`) — the middleware fires before the handler, so ownership is not checked.

---

## How to Run

```bash
# Prerequisites: taskly-be must be running on port 8082
# From apps/taskly-be/: go run ./cmd/server/
# Or: nx run taskly-be:serve

# Run full test suite (from monorepo root)
nx run taskly-be-e2e:e2e

# Run full test suite (from apps/taskly-be-e2e/)
npx playwright test --project=api-tests

# Run a single spec file
npx playwright test tests/api/auth.api.spec.ts --project=api-tests

# Run a single test by name
npx playwright test --grep "returns 201 with" --project=api-tests

# Open Playwright UI mode
nx run taskly-be-e2e:e2e:ui

# Open Playwright debug mode
nx run taskly-be-e2e:e2e:debug

# View HTML report (after a test run)
npx playwright show-report playwright-report
```

---

## Security Considerations

- Tests use `uniqueEmail()` to avoid email collisions across parallel CI runs on the same database
- Tokens are never logged in passing tests
- The `baseURL` is hardcoded to localhost — tests cannot accidentally hit production

---

## Error Handling in Helpers

`ApiClient` uses `.catch(() => ({}))` on `response.json()` so that 204 No Content responses do not throw. The `status` field always reflects the real HTTP status code and is the primary assertion target.

`AuthHelper.registerAndLogin` throws immediately if either the register call (expected 201) or the login call (expected 200) returns an unexpected status. This surfaces setup failures as clear error messages rather than cryptic undefined property errors.
