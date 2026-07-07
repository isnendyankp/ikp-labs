# Taskly Backend E2E — Requirements

## Functional Requirements

### FR-1: Authentication Endpoint Tests

**Priority**: P0-Critical

**Description**: The test suite must cover all three auth endpoints exposed by `apps/taskly-be`. Every scenario must use `uniqueEmail()` so tests do not interfere with each other.

**User Story**:

```text
As a developer maintaining taskly-be
I want automated API tests for all auth endpoints
So that regressions in register, login, and /api/me are caught immediately
```

**Acceptance Criteria**:

POST /api/auth/register:

- Given a valid email and password (≥8 chars), when the request is sent, then the response is 201 with body `{"id": <number>, "email": "<email>"}`
- Given a valid email that is already registered, when the request is sent, then the response is 409 with body `{"error": "email already registered"}`
- Given a request body missing the `email` field, when the request is sent, then the response is 400
- Given a request body with an invalid email format (e.g., `"notanemail"`), when the request is sent, then the response is 400
- Given a password shorter than 8 characters, when the request is sent, then the response is 400

POST /api/auth/login:

- Given correct email and password, when the request is sent, then the response is 200 with body `{"token": "<jwt>"}`
- Given a registered email and the wrong password, when the request is sent, then the response is 401 with body `{"error": "invalid credentials"}`
- Given an email that does not exist, when the request is sent, then the response is 401 with body `{"error": "invalid credentials"}`
- Given a request body missing the `email` field, when the request is sent, then the response is 400
- Given a request body missing the `password` field, when the request is sent, then the response is 400

GET /api/me:

- Given a valid JWT in the Authorization header, when the request is sent, then the response is 200 with body `{"id": <number>, "email": "<email>"}`
- Given no Authorization header, when the request is sent, then the response is 401 with body `{"error": "authorization header required"}`
- Given a malformed token (e.g., `"Bearer invalid.token.here"`), when the request is sent, then the response is 401 with body `{"error": "invalid token"}`

**Edge Cases**:

- Register response must NOT include `password_hash`
- The JWT from login must be a valid 3-part dot-separated token

---

### FR-2: Task CRUD Happy Path Tests

**Priority**: P0-Critical

**Description**: The test suite must cover the full lifecycle of a task — create, list, get, update (title), update (status), and delete — all with valid JWTs.

**User Story**:

```text
As a developer maintaining taskly-be
I want automated API tests for all task CRUD happy paths
So that I can verify the task feature works end-to-end
```

**Acceptance Criteria**:

POST /api/tasks:

- Given a valid JWT and body `{"title": "My Task"}`, when the request is sent, then the response is 201 with body containing `id`, `user_id`, `title`, `status` (`"todo"`), `created_at`, `updated_at`

GET /api/tasks:

- Given a valid JWT for a user with no tasks, when the request is sent, then the response is 200 with body `[]`
- Given a valid JWT for a user who has created tasks, when the request is sent, then the response is 200 with a JSON array containing those tasks

GET /api/tasks/:id:

- Given a valid JWT and a task id that belongs to the authenticated user, when the request is sent, then the response is 200 with the full task object

PUT /api/tasks/:id:

- Given a valid JWT and body `{"title": "Updated Title"}`, when the request is sent, then the response is 200 with updated `title`
- Given a valid JWT and body `{"status": "in_progress"}`, when the request is sent, then the response is 200 with `status` set to `"in_progress"`
- Given a valid JWT and body `{"status": "done"}`, when the request is sent, then the response is 200 with `status` set to `"done"`

DELETE /api/tasks/:id:

- Given a valid JWT and a task id that belongs to the authenticated user, when the request is sent, then the response is 204 with no body

---

### FR-3: Task Validation Tests

**Priority**: P1-High

**Description**: The test suite must verify that taskly-be rejects malformed task requests with appropriate 400 status codes.

**User Story**:

```text
As a developer maintaining taskly-be
I want input validation to be tested
So that invalid requests are consistently rejected with 400
```

**Acceptance Criteria**:

POST /api/tasks:

- Given a valid JWT and a body with no `title` field, when the request is sent, then the response is 400

PUT /api/tasks/:id:

- Given a valid JWT and an empty body `{}` (neither `title` nor `status`), when the request is sent, then the response is 400 with body `{"error": "at least one of title or status must be provided"}`
- Given a valid JWT and body `{"status": "invalid_value"}`, when the request is sent, then the response is 400

---

### FR-4: Task Auth Guard Tests

**Priority**: P0-Critical

**Description**: All five task endpoints must reject requests with no JWT token.

**User Story**:

```text
As a developer maintaining taskly-be
I want all task endpoints protected by JWT middleware
So that unauthenticated users cannot access any task data
```

**Acceptance Criteria**:

- Given no Authorization header, when POST /api/tasks is called, then the response is 401
- Given no Authorization header, when GET /api/tasks is called, then the response is 401
- Given no Authorization header, when GET /api/tasks/:id is called, then the response is 401
- Given no Authorization header, when PUT /api/tasks/:id is called, then the response is 401
- Given no Authorization header, when DELETE /api/tasks/:id is called, then the response is 401

**Edge Cases**:

- The task id used in the path for GET/PUT/DELETE auth guard tests must be a real task id (created by another user's token) or any numeric id — the middleware rejects before the handler runs

---

### FR-5: Task Ownership Enforcement Tests

**Priority**: P1-High

**Description**: The test suite must verify that one user cannot access or modify another user's tasks.

**User Story**:

```text
As a developer maintaining taskly-be
I want task ownership to be enforced
So that user_b cannot read or modify user_a's tasks
```

**Acceptance Criteria**:

- Given user_a creates a task and user_b sends GET /api/tasks/:id with user_b's token, then the response is 403 with body `{"error": "forbidden"}`
- Given user_a creates a task and user_b sends PUT /api/tasks/:id with user_b's token, then the response is 403
- Given user_a creates a task and user_b sends DELETE /api/tasks/:id with user_b's token, then the response is 403

**Setup pattern**: Each ownership test creates two independent users via `uniqueEmail()`, creates a task as user_a, then attempts access as user_b.

---

## Non-Functional Requirements

### NFR-1: Test Independence

- Each test must create its own user via `uniqueEmail()` — no test may depend on data created by another test
- No `beforeAll` / `afterAll` hooks that mutate shared state
- Tests may call `beforeEach` only to create per-test isolated data

### NFR-2: Sequential Execution

- `workers: 1` in `playwright.config.ts` — all tests run sequentially
- `fullyParallel: false`

### NFR-3: Real HTTP — No Mocking

- All tests issue real HTTP requests to `http://localhost:8082`
- No `nock`, `msw`, or any request interception

### NFR-4: TypeScript Strict Mode

- `strict: true` in `tsconfig.json`
- No `any` types in helper files
- All response bodies are typed or narrowed before access

### NFR-5: Nx Integration

- `nx run taskly-be-e2e:e2e` must execute the full test suite
- `nx run taskly-be-e2e:e2e:ui` must open Playwright UI mode
- `nx run taskly-be-e2e:e2e:debug` must open Playwright debug mode

---

## API Contracts (Verified from Source)

Sourced from `apps/taskly-be/internal/handler/` — not inferred.

| Method | Endpoint           | Auth   | Success                                                    | Error responses                             |
| ------ | ------------------ | ------ | ---------------------------------------------------------- | ------------------------------------------- |
| POST   | /api/auth/register | None   | 201 `{id, email}`                                          | 400 (validation), 409 (duplicate email)     |
| POST   | /api/auth/login    | None   | 200 `{token}`                                              | 400 (validation), 401 (invalid credentials) |
| GET    | /api/me            | Bearer | 200 `{id, email}`                                          | 401 (no/invalid token)                      |
| POST   | /api/tasks         | Bearer | 201 `{id, user_id, title, status, created_at, updated_at}` | 400 (missing title), 401 (no token)         |
| GET    | /api/tasks         | Bearer | 200 `[...]`                                                | 401 (no token)                              |
| GET    | /api/tasks/:id     | Bearer | 200 task object                                            | 401, 403 (not owner), 404 (not found)       |
| PUT    | /api/tasks/:id     | Bearer | 200 task object                                            | 400, 401, 403, 404                          |
| DELETE | /api/tasks/:id     | Bearer | 204 (no body)                                              | 401, 403, 404                               |

**Error body shape** (all error responses): `{"error": "<message>"}`

**Task status values**: `"todo"` (default), `"in_progress"`, `"done"`

---

## Requirements Traceability

| Requirement      | Spec file         | Describe block                                                      |
| ---------------- | ----------------- | ------------------------------------------------------------------- |
| FR-1 register    | auth.api.spec.ts  | `POST /api/auth/register`                                           |
| FR-1 login       | auth.api.spec.ts  | `POST /api/auth/login`                                              |
| FR-1 /api/me     | auth.api.spec.ts  | `GET /api/me`                                                       |
| FR-2 create      | tasks.api.spec.ts | `POST /api/tasks`                                                   |
| FR-2 list        | tasks.api.spec.ts | `GET /api/tasks`                                                    |
| FR-2 get         | tasks.api.spec.ts | `GET /api/tasks/:id`                                                |
| FR-2 update      | tasks.api.spec.ts | `PUT /api/tasks/:id`                                                |
| FR-2 delete      | tasks.api.spec.ts | `DELETE /api/tasks/:id`                                             |
| FR-3 validation  | tasks.api.spec.ts | `POST /api/tasks`, `PUT /api/tasks/:id`                             |
| FR-4 auth guards | tasks.api.spec.ts | All five describe blocks                                            |
| FR-5 ownership   | tasks.api.spec.ts | `GET /api/tasks/:id`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id` |
