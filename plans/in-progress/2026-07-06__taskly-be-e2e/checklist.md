# Taskly Backend E2E — Implementation Checklist

Each phase is one PR. Branch names follow `governance/conventions/development.md`.

**Status Legend**: `[ ]` Not started | `[x]` Complete

---

## PR 1 — Project Scaffold

**Branch**: `feat/taskly-be-e2e-scaffold`
**Goal**: Establish the Playwright project skeleton so `nx show project taskly-be-e2e` works and the test runner can start (no spec files yet).

### Task 1.1: Create application directory

- [x] Create directory `apps/taskly-be-e2e/`
- [x] Verify the directory exists:

  ```bash
  ls /Users/isnendyankp/Desktop/Programmer/Belajar/Project/Template/IKP-Labs/apps/taskly-be-e2e/
  ```

### Task 1.2: Write `playwright.config.ts`

- [x] Create `apps/taskly-be-e2e/playwright.config.ts` with content from `technical-design.md` — PR 1 section
- [x] Confirm `baseURL` is `http://localhost:8082` (not 8081)
- [x] Confirm `workers: 1` and `fullyParallel: false`

### Task 1.3: Write `project.json`

- [x] Create `apps/taskly-be-e2e/project.json` with content from `technical-design.md` — PR 1 section
- [x] Confirm `implicitDependencies` includes `"taskly-be"`
- [x] Confirm tags: `["type:e2e", "scope:taskly", "platform:playwright", "test:api"]`
- [x] Verify Nx recognizes the project:

  ```bash
  nx show project taskly-be-e2e
  ```

  Expected: project details printed without error

### Task 1.4: Write `tsconfig.json`

- [x] Create `apps/taskly-be-e2e/tsconfig.json` with content from `technical-design.md` — PR 1 section
- [x] Confirm `"strict": true` in compilerOptions

### Task 1.5: Write `.gitignore`

- [x] Create `apps/taskly-be-e2e/.gitignore`:

  ```text
  node_modules/
  playwright-report/
  test-results/
  .env
  ```

### Task 1.6: Create empty directory placeholders

- [x] Create `apps/taskly-be-e2e/helpers/.gitkeep`
- [x] Create `apps/taskly-be-e2e/tests/api/.gitkeep`
- [x] Verify both files exist:

  ```bash
  find apps/taskly-be-e2e -name ".gitkeep"
  ```

### Task 1.7: Commit and open PR

- [x] Stage: `playwright.config.ts`, `project.json`, `tsconfig.json`, `.gitignore`, `helpers/.gitkeep`, `tests/api/.gitkeep`
- [x] Commit message: `feat(taskly-be-e2e): scaffold playwright project and nx config`
- [x] Push branch `feat/taskly-be-e2e-scaffold` and open PR

**Acceptance Criteria**:

- `nx show project taskly-be-e2e` lists the project with three targets: `e2e`, `e2e:ui`, `e2e:debug`
- `apps/taskly-be-e2e/playwright.config.ts` has `baseURL: "http://localhost:8082"` and `workers: 1`
- `apps/taskly-be-e2e/.gitignore` contains `playwright-report/` and `test-results/`
- `helpers/.gitkeep` and `tests/api/.gitkeep` are committed
- No spec files exist yet

---

## PR 2 — Helpers

**Branch**: `feat/taskly-be-e2e-helpers`
**Goal**: Implement the three helper modules that all spec files will import. No tests yet — helpers are verified by TypeScript compilation.

### Task 2.1: Implement `helpers/api-client.ts`

- [ ] Create `apps/taskly-be-e2e/helpers/api-client.ts`
- [ ] Implement `ApiClient` class with `baseURL = "http://localhost:8082"`
- [ ] Implement `post(endpoint, data, token?)` — sets `Content-Type: application/json`, optionally adds `Authorization: Bearer <token>`
- [ ] Implement `get(endpoint, token?)` — sets `Accept: application/json`, optionally adds `Authorization: Bearer <token>`
- [ ] Implement `put(endpoint, data, token?)` — sets `Content-Type: application/json`, optionally adds `Authorization: Bearer <token>`
- [ ] Implement `delete(endpoint, token?)` — sets `Accept: application/json`, optionally adds `Authorization: Bearer <token>`
- [ ] All four methods return `{ status: number; body: unknown; headers: Record<string, string> }` where `body` is `await response.json().catch(() => ({}))`
- [ ] Do NOT add `postMultipart` — taskly-be has no file upload endpoints

### Task 2.2: Implement `helpers/auth-helper.ts`

- [ ] Create `apps/taskly-be-e2e/helpers/auth-helper.ts`
- [ ] Import `ApiClient` from `./api-client`
- [ ] Define `AuthResult` interface: `{ token: string; userId: number; email: string }`
- [ ] Implement `AuthHelper` class with constructor receiving `ApiClient`
- [ ] Implement `registerAndLogin(email, password)`:
  - Step 1: `await this.client.post("/api/auth/register", { email, password })` → expect status 201, body `{id, email}`
  - Step 2: `await this.client.post("/api/auth/login", { email, password })` → expect status 200, body `{token}`
  - If either call fails, throw with the status and body: `throw new Error(\`register failed: \${resp.status} \${JSON.stringify(resp.body)}\`)`
  - Return `{ token, userId: id from register, email }`
- [ ] Note: Register returns `{id, email}` — there is NO token in the register response. This differs from `kameravue-be-e2e`'s AuthHelper.

### Task 2.3: Implement `helpers/test-data.ts`

- [ ] Create `apps/taskly-be-e2e/helpers/test-data.ts`
- [ ] Implement `uniqueEmail()`:

  ```typescript
  export function uniqueEmail(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `test.api.${timestamp}.${random}@taskly.test`;
  }
  ```

- [ ] Implement `validPassword()`:

  ```typescript
  export function validPassword(): string {
    return 'Password1!';
  }
  ```

### Task 2.4: Remove `.gitkeep` from `helpers/`

- [ ] Delete `apps/taskly-be-e2e/helpers/.gitkeep` (directory is no longer empty)

### Task 2.5: TypeScript compilation check

- [ ] From the monorepo root, run:

  ```bash
  npx tsc --project apps/taskly-be-e2e/tsconfig.json --noEmit
  ```

  Expected: exits 0 with no errors

### Task 2.6: Smoke-test `registerAndLogin` manually

- [ ] Ensure `taskly-be` is running: `go run ./cmd/server/` from `apps/taskly-be/`
- [ ] Verify register then login works end-to-end:

  ```bash
  EMAIL="smoke.$(date +%s)@taskly.test"
  curl -s -X POST http://localhost:8082/api/auth/register \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"Password1!\"}" | jq .
  # Expected: {"id": <number>, "email": "<email>"}

  curl -s -X POST http://localhost:8082/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"Password1!\"}" | jq .
  # Expected: {"token": "eyJ..."}
  ```

### Task 2.7: Commit and open PR

- [ ] Stage: `helpers/api-client.ts`, `helpers/auth-helper.ts`, `helpers/test-data.ts`; remove `helpers/.gitkeep`
- [ ] Commit message: `feat(taskly-be-e2e): add api client and auth helpers`
- [ ] Push branch `feat/taskly-be-e2e-helpers` and open PR

**Acceptance Criteria**:

- `npx tsc --project apps/taskly-be-e2e/tsconfig.json --noEmit` exits 0
- `ApiClient.baseURL` is `"http://localhost:8082"`
- `AuthHelper.registerAndLogin` makes two HTTP calls: register (201) then login (200)
- `uniqueEmail()` returns strings matching the pattern `test.api.<timestamp>.<random>@taskly.test`
- No `any` types in helper files
- `helpers/.gitkeep` is deleted

---

## PR 3 — Auth Tests

**Branch**: `feat/taskly-be-e2e-auth-tests`
**Goal**: Write `tests/api/auth.api.spec.ts` — 13 test cases covering all auth endpoint scenarios.

### Task 3.1: Create `tests/api/auth.api.spec.ts`

- [ ] Create `apps/taskly-be-e2e/tests/api/auth.api.spec.ts`
- [ ] Add file-level import block:

  ```typescript
  import { test, expect } from '@playwright/test';
  import { ApiClient } from '../../helpers/api-client';
  import { AuthHelper } from '../../helpers/auth-helper';
  import { uniqueEmail, validPassword } from '../../helpers/test-data';
  ```

### Task 3.2: Implement `POST /api/auth/register` describe block (5 tests)

- [ ] `"returns 201 with {id, email} for valid email and password"`:
  - Send POST /api/auth/register with `uniqueEmail()` and `validPassword()`
  - Assert `response.status === 201`
  - Assert body contains `id` (positive number) and `email`
  - Assert body does NOT contain `password_hash`
- [ ] `"returns 409 when email is already registered"`:
  - Register with `uniqueEmail()` first (expect 201)
  - Register again with the same email
  - Assert `response.status === 409`
  - Assert `response.body.error === "email already registered"`
- [ ] `"returns 400 when email field is missing"`:
  - Send POST with `{ password: validPassword() }` — no `email` key
  - Assert `response.status === 400`
- [ ] `"returns 400 when email is an invalid format"`:
  - Send POST with `{ email: "notanemail", password: validPassword() }`
  - Assert `response.status === 400`
- [ ] `"returns 400 when password is shorter than 8 characters"`:
  - Send POST with `{ email: uniqueEmail(), password: "short" }`
  - Assert `response.status === 400`

### Task 3.3: Implement `POST /api/auth/login` describe block (5 tests)

- [ ] `"returns 200 with {token} for correct credentials"`:
  - Register a fresh user via `ApiClient.post`
  - Login with the same credentials
  - Assert `response.status === 200`
  - Assert `response.body.token` is a string with 3 dot-separated parts (JWT format)
- [ ] `"returns 401 for wrong password"`:
  - Register a fresh user
  - Login with the correct email but wrong password `"wrongpassword"`
  - Assert `response.status === 401`
  - Assert `response.body.error === "invalid credentials"`
- [ ] `"returns 401 for unknown email"`:
  - Send POST /api/auth/login with `{ email: uniqueEmail(), password: validPassword() }` (never registered)
  - Assert `response.status === 401`
  - Assert `response.body.error === "invalid credentials"`
- [ ] `"returns 400 when email field is missing"`:
  - Send POST with `{ password: validPassword() }` — no `email` key
  - Assert `response.status === 400`
- [ ] `"returns 400 when password field is missing"`:
  - Send POST with `{ email: uniqueEmail() }` — no `password` key
  - Assert `response.status === 400`

### Task 3.4: Implement `GET /api/me` describe block (3 tests)

- [ ] `"returns 200 with {id, email} for valid token"`:
  - Use `AuthHelper.registerAndLogin` to get a token
  - Send GET /api/me with the token
  - Assert `response.status === 200`
  - Assert body contains `id` and `email`
- [ ] `"returns 401 when Authorization header is absent"`:
  - Send GET /api/me with no token
  - Assert `response.status === 401`
  - Assert `response.body.error === "authorization header required"`
- [ ] `"returns 401 for a malformed token"`:
  - Send GET /api/me with a hardcoded invalid token: `"Bearer invalid.token.here"`
  - Assert `response.status === 401`
  - Assert `response.body.error === "invalid token"`

### Task 3.5: Remove `.gitkeep` from `tests/api/`

- [ ] Delete `apps/taskly-be-e2e/tests/api/.gitkeep`

### Task 3.6: Run the auth tests

- [ ] Ensure `taskly-be` is running on port 8082
- [ ] From `apps/taskly-be-e2e/`:

  ```bash
  npx playwright test tests/api/auth.api.spec.ts --project=api-tests
  ```

  Expected: all 13 tests pass, 0 failed

### Task 3.7: Commit and open PR

- [ ] Stage: `tests/api/auth.api.spec.ts`; remove `tests/api/.gitkeep`
- [ ] Commit message: `test(taskly-be-e2e): add auth api spec (register, login, me)`
- [ ] Push branch `feat/taskly-be-e2e-auth-tests` and open PR

**Acceptance Criteria**:

- 13 tests in `auth.api.spec.ts` — 0 failed, 0 skipped
- `POST /api/auth/register` success test asserts `id > 0`, `email` matches input, no `password_hash` field
- `POST /api/auth/login` success test asserts JWT format (3 dot-separated parts)
- `GET /api/me` tests cover valid token (200), no token (401 + `"authorization header required"`), bad token (401 + `"invalid token"`)
- Each test uses `uniqueEmail()` — no shared state

---

## PR 4 — Task Tests

**Branch**: `feat/taskly-be-e2e-task-tests`
**Goal**: Write `tests/api/tasks.api.spec.ts` — 20 test cases covering full task CRUD, ownership enforcement, validation, and auth guards.

### Task 4.1: Create `tests/api/tasks.api.spec.ts`

- [ ] Create `apps/taskly-be-e2e/tests/api/tasks.api.spec.ts`
- [ ] Add file-level import block:

  ```typescript
  import { test, expect } from '@playwright/test';
  import { ApiClient } from '../../helpers/api-client';
  import { AuthHelper } from '../../helpers/auth-helper';
  import { uniqueEmail, validPassword } from '../../helpers/test-data';
  ```

### Task 4.2: Implement `POST /api/tasks` describe block (3 tests)

- [ ] `"returns 201 with full task object for valid title"`:
  - Get a token via `AuthHelper.registerAndLogin`
  - Send POST /api/tasks with `{ title: "My Task" }` and token
  - Assert `response.status === 201`
  - Assert body matches `{ id: <positive number>, user_id: <positive number>, title: "My Task", status: "todo" }`
  - Assert body has `created_at` and `updated_at` string fields
- [ ] `"returns 400 when title is missing from request body"`:
  - Get a token via `AuthHelper.registerAndLogin`
  - Send POST /api/tasks with `{}` (empty body) and token
  - Assert `response.status === 400`
- [ ] `"returns 401 when Authorization header is absent"`:
  - Send POST /api/tasks with `{ title: "Any" }` and no token
  - Assert `response.status === 401`

### Task 4.3: Implement `GET /api/tasks` describe block (3 tests)

- [ ] `"returns 200 with empty array when user has no tasks"`:
  - Get a fresh token via `AuthHelper.registerAndLogin` (new user, no tasks)
  - Send GET /api/tasks with token
  - Assert `response.status === 200`
  - Assert `response.body` is an array of length 0: `expect(Array.isArray(response.body)).toBe(true)` and `expect((response.body as []).length).toBe(0)`
- [ ] `"returns 200 with array containing the user's tasks"`:
  - Get a token, create two tasks via POST /api/tasks
  - Send GET /api/tasks with token
  - Assert `response.status === 200`
  - Assert the array has at least 2 items with correct structure
- [ ] `"returns 401 when Authorization header is absent"`:
  - Send GET /api/tasks with no token
  - Assert `response.status === 401`

### Task 4.4: Implement `GET /api/tasks/:id` describe block (4 tests)

- [ ] `"returns 200 with task object for the task owner"`:
  - Get a token, create a task, capture `id` from 201 response
  - Send GET /api/tasks/:id with owner's token
  - Assert `response.status === 200`
  - Assert body `id` matches created task id
- [ ] `"returns 403 when another user requests the task"`:
  - Register user_a, create a task, capture task id
  - Register user_b via separate `registerAndLogin` call
  - Send GET /api/tasks/:id with user_b's token
  - Assert `response.status === 403`
  - Assert `response.body` matches `{ error: "forbidden" }`
- [ ] `"returns 404 for a non-existent task id"`:
  - Get a token
  - Send GET /api/tasks/999999999 with token
  - Assert `response.status === 404`
  - Assert `response.body` matches `{ error: "task not found" }`
- [ ] `"returns 401 when Authorization header is absent"`:
  - Send GET /api/tasks/1 with no token
  - Assert `response.status === 401`

### Task 4.5: Implement `PUT /api/tasks/:id` describe block (8 tests)

- [ ] `"returns 200 with updated task when title is changed"`:
  - Get token, create task, send PUT with `{ title: "Updated" }`
  - Assert `response.status === 200`
  - Assert `response.body.title === "Updated"`
- [ ] `"returns 200 when status is changed to in_progress"`:
  - Get token, create task, send PUT with `{ status: "in_progress" }`
  - Assert `response.status === 200`
  - Assert `response.body.status === "in_progress"`
- [ ] `"returns 200 when status is changed to done"`:
  - Get token, create task, send PUT with `{ status: "done" }`
  - Assert `response.status === 200`
  - Assert `response.body.status === "done"`
- [ ] `"returns 400 when body contains neither title nor status"`:
  - Get token, create task, send PUT with `{}`
  - Assert `response.status === 400`
  - Assert `response.body.error === "at least one of title or status must be provided"`
- [ ] `"returns 400 when status is an unrecognized value"`:
  - Get token, create task, send PUT with `{ status: "invalid_status" }`
  - Assert `response.status === 400`
- [ ] `"returns 403 when another user updates the task"`:
  - Register user_a, create task
  - Register user_b, send PUT /api/tasks/:id with user_b's token
  - Assert `response.status === 403`
  - Assert `response.body` matches `{ error: "forbidden" }`
- [ ] `"returns 404 for a non-existent task id"`:
  - Get token, send PUT /api/tasks/999999999 with `{ title: "x" }`
  - Assert `response.status === 404`
- [ ] `"returns 401 when Authorization header is absent"`:
  - Send PUT /api/tasks/1 with `{ title: "x" }` and no token
  - Assert `response.status === 401`

### Task 4.6: Implement `DELETE /api/tasks/:id` describe block (4 tests)

- [ ] `"returns 204 when owner deletes their task"`:
  - Get token, create task, send DELETE /api/tasks/:id with owner's token
  - Assert `response.status === 204`
  - Verify task is gone: send GET /api/tasks/:id with same token, expect 404
- [ ] `"returns 403 when another user deletes the task"`:
  - Register user_a, create task
  - Register user_b, send DELETE /api/tasks/:id with user_b's token
  - Assert `response.status === 403`
- [ ] `"returns 404 for a non-existent task id"`:
  - Get token, send DELETE /api/tasks/999999999 with token
  - Assert `response.status === 404`
- [ ] `"returns 401 when Authorization header is absent"`:
  - Send DELETE /api/tasks/1 with no token
  - Assert `response.status === 401`

### Task 4.7: Run the task tests

- [ ] Ensure `taskly-be` is running on port 8082
- [ ] From `apps/taskly-be-e2e/`:

  ```bash
  npx playwright test tests/api/tasks.api.spec.ts --project=api-tests
  ```

  Expected: all 20 tests pass, 0 failed

### Task 4.8: Run the full suite

- [ ] From `apps/taskly-be-e2e/`:

  ```bash
  npx playwright test --project=api-tests
  ```

  Expected: all 33 tests pass (13 auth + 20 tasks)
- [ ] From the monorepo root:

  ```bash
  nx run taskly-be-e2e:e2e
  ```

  Expected: same result via Nx

### Task 4.9: Commit and open PR

- [ ] Stage: `tests/api/tasks.api.spec.ts`
- [ ] Commit message: `test(taskly-be-e2e): add task crud api spec`
- [ ] Push branch `feat/taskly-be-e2e-task-tests` and open PR

**Acceptance Criteria**:

- 20 tests in `tasks.api.spec.ts` — 0 failed, 0 skipped
- `POST /api/tasks` success test asserts `status === "todo"` as default
- `GET /api/tasks` empty-list test asserts `response.body` is an empty array `[]`
- Ownership tests (403) use two independently registered users via `uniqueEmail()`
- `DELETE` success test verifies the task is gone via a follow-up GET (404)
- Full suite: `nx run taskly-be-e2e:e2e` reports 33 passed

---

## PR 5 — App README

**Branch**: `docs/taskly-be-e2e-readme`
**Goal**: Write `apps/taskly-be-e2e/README.md` — the app-level documentation for the test suite.

### Task 5.1: Write `apps/taskly-be-e2e/README.md`

- [ ] Create `apps/taskly-be-e2e/README.md` with the following sections:
  - **Overview** — what this project tests and which endpoints it covers
  - **Prerequisites** — taskly-be running on port 8082, PostgreSQL accessible
  - **Running tests** — `nx run taskly-be-e2e:e2e` and `npx playwright test --project=api-tests`
  - **Test structure** — describe how `tests/api/auth.api.spec.ts` and `tasks.api.spec.ts` are organized
  - **Helpers** — one-line description of `ApiClient`, `AuthHelper`, `test-data`
  - **Nx targets** — table showing `e2e`, `e2e:ui`, `e2e:debug` commands

### Task 5.2: Commit and open PR

- [ ] Stage: `apps/taskly-be-e2e/README.md`
- [ ] Commit message: `docs(taskly-be-e2e): add readme`
- [ ] Push branch `docs/taskly-be-e2e-readme` and open PR

**Acceptance Criteria**:

- README contains a working `nx run taskly-be-e2e:e2e` command
- README lists both spec files and how many tests each contains
- README describes the `AuthHelper.registerAndLogin` two-step pattern (register then login separately)
- No placeholder content (TODO, TBD, Coming soon)

---

## Commit Summary

| PR  | Branch                          | Commit Message                                                   |
| --- | ------------------------------- | ---------------------------------------------------------------- |
| 1   | `feat/taskly-be-e2e-scaffold`   | `feat(taskly-be-e2e): scaffold playwright project and nx config` |
| 2   | `feat/taskly-be-e2e-helpers`    | `feat(taskly-be-e2e): add api client and auth helpers`           |
| 3   | `feat/taskly-be-e2e-auth-tests` | `test(taskly-be-e2e): add auth api spec (register, login, me)`   |
| 4   | `feat/taskly-be-e2e-task-tests` | `test(taskly-be-e2e): add task crud api spec`                    |
| 5   | `docs/taskly-be-e2e-readme`     | `docs(taskly-be-e2e): add readme`                                |

---

## Final Validation

Before moving this plan to `plans/done/`, verify every item below:

- [ ] `nx show project taskly-be-e2e` lists three targets
- [ ] `npx tsc --project apps/taskly-be-e2e/tsconfig.json --noEmit` exits 0
- [ ] `nx run taskly-be-e2e:e2e` reports 33 passed, 0 failed against a live taskly-be server
- [ ] `apps/taskly-be-e2e/playwright.config.ts` has `baseURL: "http://localhost:8082"` and `workers: 1`
- [ ] `helpers/auth-helper.ts` calls register then login separately (two HTTP calls)
- [ ] All 33 tests use `uniqueEmail()` — no hardcoded email addresses
- [ ] No `test.fixme` or `test.skip` in any spec file
- [ ] `apps/taskly-be-e2e/README.md` committed and present
- [ ] All 5 PRs merged to `main`

---

## Progress Tracking

| PR                | Status          |
| ----------------- | --------------- |
| PR 1 — Scaffold   | [x] Complete    |
| PR 2 — Helpers    | [ ] Not started |
| PR 3 — Auth tests | [ ] Not started |
| PR 4 — Task tests | [ ] Not started |
| PR 5 — README     | [ ] Not started |

**Overall**: 0/5 PRs merged

**Last Updated**: July 6, 2026
