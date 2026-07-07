# taskly-be-e2e

Playwright API test suite for the `taskly-be` Go REST API. Tests run against live HTTP endpoints — no browser is launched. The suite runs sequentially (`workers: 1`, `fullyParallel: false`) to prevent concurrent database writes from causing flaky results.

## Prerequisites

- Node.js >= 18.0.0 (monorepo requirement)
- `taskly-be` running on `http://localhost:8082` with a reachable PostgreSQL database
- npm dependencies installed at the monorepo root (`npm install` from `IKP-Labs/`)

## Setup

From the monorepo root, install dependencies if not already done:

```bash
npm install
```

No additional setup is required inside `apps/taskly-be-e2e/` — there is no local `package.json`; the project relies on the workspace `node_modules`.

## Running Tests

### Via Nx (recommended)

```bash
# Run all API tests
nx run taskly-be-e2e:e2e

# Run with Playwright UI mode (interactive test explorer)
nx run taskly-be-e2e:e2e:ui

# Run in debug mode (step through tests)
nx run taskly-be-e2e:e2e:debug
```

### Direct Playwright commands

Run from inside `apps/taskly-be-e2e/`:

```bash
cd apps/taskly-be-e2e

# Run all API tests
npx playwright test --project=api-tests

# Run a single spec file
npx playwright test tests/api/auth.api.spec.ts --project=api-tests
npx playwright test tests/api/tasks.api.spec.ts --project=api-tests
```

### Nx targets reference

| Target      | Command                          | Purpose                        |
| ----------- | -------------------------------- | ------------------------------ |
| `e2e`       | `nx run taskly-be-e2e:e2e`       | Run full suite (CI and local)  |
| `e2e:ui`    | `nx run taskly-be-e2e:e2e:ui`    | Playwright interactive UI mode |
| `e2e:debug` | `nx run taskly-be-e2e:e2e:debug` | Step-through debugger          |

## Test Coverage

| Spec file                     | Endpoints covered                                                                                        | Tests |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- | ----- |
| `tests/api/auth.api.spec.ts`  | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/me`                                         | 13    |
| `tests/api/tasks.api.spec.ts` | `POST /api/tasks`, `GET /api/tasks`, `GET /api/tasks/:id`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id` | 20    |

Every test uses `uniqueEmail()` to generate a collision-free address, so tests never share state.

## Helper Architecture

| File                     | Export                         | Purpose                                                                                                                                                                                                  |
| ------------------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `helpers/api-client.ts`  | `ApiClient`                    | Wraps Playwright's `APIRequestContext`. Provides `get`, `post`, `put`, `delete` methods. Each method accepts an optional Bearer token and returns `{ status, body, headers }`.                           |
| `helpers/auth-helper.ts` | `AuthHelper`                   | Provides `registerAndLogin(email, password)` which performs two HTTP calls — `POST /api/auth/register` (expects 201) then `POST /api/auth/login` (expects 200) — and returns `{ token, userId, email }`. |
| `helpers/test-data.ts`   | `uniqueEmail`, `validPassword` | `uniqueEmail()` generates `test.api.<timestamp>.<random>@taskly.test`. `validPassword()` returns `"Password1!"`.                                                                                         |

## Configuration

Key values from `playwright.config.ts`:

| Setting         | Local                   | CI                      |
| --------------- | ----------------------- | ----------------------- |
| `baseURL`       | `http://localhost:8082` | `http://localhost:8082` |
| `timeout`       | 30 000 ms               | 60 000 ms               |
| `workers`       | 1                       | 1                       |
| `fullyParallel` | false                   | false                   |
| `retries`       | 0                       | 1                       |

Reports are written to `playwright-report/` (HTML) and `test-results/results.json` (JSON).

## Starting taskly-be

The tests require `taskly-be` to be running before execution. Start it with inline environment variables from `apps/taskly-be/`:

```bash
SERVER_PORT=8082 \
DATABASE_URL="postgres://postgres:postgres@localhost:5432/taskly?sslmode=disable" \
JWT_SECRET="change-me-in-production" \
go run ./cmd/server/
```

The server applies database migrations automatically on startup. For full setup and environment variable reference, see [`apps/taskly-be/README.md`](../taskly-be/README.md).
