# Taskly Backend — Task CRUD Requirements

---

## Functional Requirements

### FR-1: Tasks Table Migration

**Priority**: P0-Critical

**Description**:
A SQL migration file `000002_create_tasks` must create the `tasks` table with the correct schema and index. It must run automatically on application startup, after the existing `000001_create_users` migration, via the existing `golang-migrate` runner in `internal/db/migrate.go`. A corresponding down migration must drop the table cleanly.

**User Story**:

```text
As a developer setting up the app for the first time
I want the tasks table created automatically on startup
So that I can test task endpoints without running SQL manually
```

**Acceptance Criteria**:

- Given a `taskly` database where migration `000001` has already been applied, when the application starts, then migration `000002` is applied and the `tasks` table exists
- Given the app has already started once, when it starts again, then migration `000002` is skipped with "no change" (idempotent)
- Given the down migration is applied manually, when `\d tasks` is run in `psql`, then the `tasks` table no longer exists

**Edge Cases**:

- The `tasks` table must reference `users(id)` with `ON DELETE CASCADE` — deleting a user must cascade-delete all their tasks
- The `status` column must have a `CHECK` constraint limiting values to `'todo'`, `'in_progress'`, `'done'`
- `updated_at` must default to `NOW()` at the database level

**Schema**:

| Column       | Type           | Constraints                                          |
| ------------ | -------------- | ---------------------------------------------------- |
| `id`         | `BIGSERIAL`    | `PRIMARY KEY`                                        |
| `user_id`    | `BIGINT`       | `NOT NULL`, `REFERENCES users(id) ON DELETE CASCADE` |
| `title`      | `VARCHAR(255)` | `NOT NULL`                                           |
| `status`     | `VARCHAR(20)`  | `NOT NULL DEFAULT 'todo'`                            |
| `created_at` | `TIMESTAMPTZ`  | `NOT NULL DEFAULT NOW()`                             |
| `updated_at` | `TIMESTAMPTZ`  | `NOT NULL DEFAULT NOW()`                             |

---

### FR-2: Create Task

**Priority**: P0-Critical

**Description**:
`POST /api/tasks` creates a new task owned by the authenticated user. The task title is required. Status defaults to `'todo'` at the database level — the caller cannot set an initial status. The response includes all task fields.

**User Story**:

```text
As an authenticated user
I want to create a new task with a title
So that I can start tracking work I need to do
```

**Acceptance Criteria**:

- Given a valid JWT and a request body with a non-empty `title`, when `POST /api/tasks` is called, then `201 Created` is returned with the full task object including `id`, `user_id`, `title`, `status` (`"todo"`), `created_at`, and `updated_at`
- Given a request body missing the `title` field, when `POST /api/tasks` is called, then `400 Bad Request` is returned with `{"error": "Key: 'createTaskRequest.Title' Error:Field validation for 'Title' failed on the 'required' tag"}`
- Given no `Authorization` header, when `POST /api/tasks` is called, then `401 Unauthorized` is returned (handled by middleware)

**Edge Cases**:

- An empty string for `title` must be rejected with `400 Bad Request`
- The `user_id` in the response must match the authenticated user's id from the JWT

**Example**:

Request:

```json
POST /api/tasks
Authorization: Bearer eyJ...
{
  "title": "Write unit tests"
}
```

Response (201):

```json
{
  "id": 1,
  "user_id": 42,
  "title": "Write unit tests",
  "status": "todo",
  "created_at": "2026-07-03T10:00:00Z",
  "updated_at": "2026-07-03T10:00:00Z"
}
```

---

### FR-3: List Tasks

**Priority**: P0-Critical

**Description**:
`GET /api/tasks` returns all tasks belonging to the authenticated user, ordered by `created_at` descending (newest first). When the user has no tasks, the response body must be a JSON array `[]`, not `null`.

**User Story**:

```text
As an authenticated user
I want to see all my tasks in one request
So that I can review what I need to work on
```

**Acceptance Criteria**:

- Given a valid JWT for a user who has created three tasks, when `GET /api/tasks` is called, then `200 OK` is returned with a JSON array of three task objects
- Given a valid JWT for a user who has no tasks, when `GET /api/tasks` is called, then `200 OK` is returned with `[]`
- Given no `Authorization` header, when `GET /api/tasks` is called, then `401 Unauthorized` is returned
- Given two users each with tasks, when user A calls `GET /api/tasks`, then only user A's tasks are returned

**Edge Cases**:

- The response must never include tasks belonging to other users
- The JSON array must never serialize as `null` — use `make([]*repository.Task, 0)` as the initial slice in the repository or service

**Example**:

Response (200):

```json
[
  {
    "id": 3,
    "user_id": 42,
    "title": "Deploy to production",
    "status": "in_progress",
    "created_at": "2026-07-03T12:00:00Z",
    "updated_at": "2026-07-03T12:30:00Z"
  },
  {
    "id": 1,
    "user_id": 42,
    "title": "Write unit tests",
    "status": "todo",
    "created_at": "2026-07-03T10:00:00Z",
    "updated_at": "2026-07-03T10:00:00Z"
  }
]
```

---

### FR-4: Get Single Task

**Priority**: P0-Critical

**Description**:
`GET /api/tasks/:id` returns a single task by its id. The service must verify that the task belongs to the authenticated user before returning it. If the task exists but belongs to a different user, the service returns `ErrForbidden`, which the handler maps to `403 Forbidden`.

**User Story**:

```text
As an authenticated user
I want to fetch a single task by its id
So that I can view its current details
```

**Acceptance Criteria**:

- Given a valid JWT and a task id that belongs to the authenticated user, when `GET /api/tasks/:id` is called, then `200 OK` is returned with the task object
- Given a valid JWT and a task id that does not exist, when `GET /api/tasks/:id` is called, then `404 Not Found` is returned with `{"error": "task not found"}`
- Given a valid JWT and a task id that belongs to a different user, when `GET /api/tasks/:id` is called, then `403 Forbidden` is returned with `{"error": "forbidden"}`
- Given a non-numeric `:id` path parameter, when `GET /api/tasks/:id` is called, then `400 Bad Request` is returned with `{"error": "invalid task id"}`

**Edge Cases**:

- The `403` response must be indistinguishable from a `404` in terms of information leakage — however, this plan uses `403` explicitly rather than a security-hardened `404` to practice the pattern
- The `:id` path parameter must be parsed to `int64`; non-numeric values must be caught in the handler before calling the service

---

### FR-5: Update Task

**Priority**: P0-Critical

**Description**:
`PUT /api/tasks/:id` updates a task's `title`, `status`, or both. Fields not included in the request body are left unchanged. The `updated_at` timestamp is set to `NOW()` in the SQL `UPDATE` statement, not in Go code. The service validates ownership before updating and validates that `status`, if provided, is one of `'todo'`, `'in_progress'`, or `'done'`.

**User Story**:

```text
As an authenticated user
I want to update a task's title or status
So that I can keep my tasks accurate as work progresses
```

**Acceptance Criteria**:

- Given a valid JWT, the task owner, and a body with `{"status": "in_progress"}`, when `PUT /api/tasks/:id` is called, then `200 OK` is returned with the task updated only in `status` and `updated_at`; `title` and `created_at` are unchanged
- Given a valid JWT, the task owner, and a body with `{"title": "New title", "status": "done"}`, when `PUT /api/tasks/:id` is called, then both `title` and `status` are updated
- Given a valid JWT and a `status` value of `"invalid_status"`, when `PUT /api/tasks/:id` is called, then `400 Bad Request` is returned with `{"error": "status must be one of: todo, in_progress, done"}`
- Given a valid JWT and a task id belonging to a different user, when `PUT /api/tasks/:id` is called, then `403 Forbidden` is returned
- Given a valid JWT and a task id that does not exist, when `PUT /api/tasks/:id` is called, then `404 Not Found` is returned

**Edge Cases**:

- A request body with neither `title` nor `status` must return `400 Bad Request` with `{"error": "at least one of title or status must be provided"}`
- `updated_at` must be updated in the SQL `UPDATE`, not computed in Go and passed as a parameter

**Example**:

Request:

```json
PUT /api/tasks/1
Authorization: Bearer eyJ...
{
  "status": "done"
}
```

Response (200):

```json
{
  "id": 1,
  "user_id": 42,
  "title": "Write unit tests",
  "status": "done",
  "created_at": "2026-07-03T10:00:00Z",
  "updated_at": "2026-07-03T15:00:00Z"
}
```

---

### FR-6: Delete Task

**Priority**: P0-Critical

**Description**:
`DELETE /api/tasks/:id` permanently deletes a task. The service verifies ownership before deleting. On success, the handler returns `204 No Content` with no body. There is no soft delete.

**User Story**:

```text
As an authenticated user
I want to delete a task I no longer need
So that my task list stays clean
```

**Acceptance Criteria**:

- Given a valid JWT and a task id belonging to the authenticated user, when `DELETE /api/tasks/:id` is called, then `204 No Content` is returned with an empty body
- Given the same task id, when `GET /api/tasks/:id` is called after deletion, then `404 Not Found` is returned
- Given a valid JWT and a task id belonging to a different user, when `DELETE /api/tasks/:id` is called, then `403 Forbidden` is returned and the task is not deleted
- Given a valid JWT and a task id that does not exist, when `DELETE /api/tasks/:id` is called, then `404 Not Found` is returned

**Edge Cases**:

- The `204` response must have no body — `c.Status(http.StatusNoContent)` without `c.JSON(...)`
- Deleting a task must be permanent and not recoverable through any endpoint

---

## Technical Requirements

### TR-1: Three-Layer Architecture

**Priority**: P0-Critical

- Repository: SQL only, no business logic, no HTTP
- Service: business logic (ownership check, status validation), no SQL, no HTTP
- Handler: HTTP only (bind request, call service, map errors to status codes)
- All layers communicate via Go interfaces

### TR-2: Ownership Verification

**Priority**: P0-Critical

- The service must call `taskRepo.FindTaskByID` first, then compare `task.UserID` with the `authenticatedUserID` argument
- If `task.UserID != authenticatedUserID`, the service returns `ErrForbidden`
- This applies to `GetTask`, `UpdateTask`, and `DeleteTask`
- The repository never filters by `user_id` in single-task queries — it fetches by `id` only, letting the service check ownership

### TR-3: Partial Update Semantics

**Priority**: P1-High

- `updateTaskRequest` uses `*string` pointer fields for `Title` and `Status`
- When a JSON field is absent, the pointer is `nil`; when present, it points to the provided string
- The repository passes `*string` directly to `pgx/stdlib` — nil becomes SQL `NULL`, which `COALESCE` in the SQL turns into "keep the existing value"
- The service validates `Status` before calling the repository: if non-nil, must be one of `"todo"`, `"in_progress"`, `"done"`

### TR-4: Empty List Serialization

**Priority**: P0-Critical

- `FindTasksByUserID` must return an empty initialized slice `[]*Task{}` (not `nil`) when the user has no tasks
- This ensures `json.Marshal` produces `[]` rather than `null` in the HTTP response

### TR-5: Build and Lint

**Priority**: P1-High

- `go build ./...` must succeed with zero errors after each PR
- `go vet ./...` must produce zero warnings after each PR
- `gofmt -l .` must produce no output (all files formatted)

---

## Non-Functional Requirements

### NFR-1: Security

- All task endpoints require a valid JWT (enforced by existing `AuthRequired` middleware)
- Ownership check prevents cross-user data access even with a valid JWT
- `403 Forbidden` is returned for ownership violations rather than silently dropping the request

### NFR-2: Error Consistency

- All error responses use the same `errorResponse` struct as auth endpoints: `{"error": "<message>"}`
- The `respondTaskError` helper in `task_handler.go` maps all task-specific sentinel errors to HTTP codes
- No raw Go error messages are returned to the client

### NFR-3: Nil Safety

- `c.Get("userID")` returns `(interface{}, bool)` — the handler must type-assert to `int64` and handle the `!ok` case with a `500` response
- `FindTasksByUserID` must never return a nil slice
