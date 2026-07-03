# Taskly Backend — Task CRUD Technical Design

---

## Architecture Overview

The task CRUD feature extends the existing three-layer architecture. No new architectural patterns are introduced — the auth plan's handler → service → repository chain is replicated exactly for tasks.

```text
apps/taskly-be/
  cmd/server/main.go          <-- wire TaskRepository → TaskService → TaskHandler; register /api/tasks routes
        |
        v
  internal/repository/        <-- task_repository.go: TaskRepository interface + pgTaskRepository SQL impl
  internal/service/           <-- task_service.go: TaskService interface + ownership + status validation
  internal/handler/           <-- task_handler.go: gin handlers, request/response structs, respondTaskError
```

**Dependency flow (new additions only):**

```text
main.go (existing)
  ...existing auth wiring...
  --> repository.NewTaskRepository(conn)          [new]
  --> service.NewTaskService(taskRepo)            [new]
  --> handler.NewTaskHandler(taskService)         [new]
  --> protected group.POST("/tasks", ...)         [new]
  --> protected group.GET("/tasks", ...)          [new]
  --> protected group.GET("/tasks/:id", ...)      [new]
  --> protected group.PUT("/tasks/:id", ...)      [new]
  --> protected group.DELETE("/tasks/:id", ...)   [new]
```

The `protected` route group already applies `middleware.AuthRequired(cfg.JWTSecret)` — the task routes inherit it automatically.

---

## Folder Structure — Changes Only

```text
apps/taskly-be/
├── internal/
│   ├── db/
│   │   └── migrations/
│   │       ├── 000002_create_tasks.up.sql     [NEW]
│   │       └── 000002_create_tasks.down.sql   [NEW]
│   ├── repository/
│   │   ├── models.go                          [UPDATED: add Task struct]
│   │   └── task_repository.go                 [NEW]
│   ├── service/
│   │   ├── errors.go                          [UPDATED: add ErrTaskNotFound, ErrForbidden]
│   │   └── task_service.go                    [NEW]
│   └── handler/
│       └── task_handler.go                    [NEW]
└── cmd/server/
    └── main.go                                [UPDATED: wire task chain + register routes]
```

Files that are NOT modified: `config/config.go`, `db/db.go`, `db/migrate.go`, `middleware/auth_middleware.go`, `handler/auth_handler.go`, `service/auth_service.go`, `repository/user_repository.go`.

---

## Database Schema

### Migration: `000002_create_tasks.up.sql`

```sql
CREATE TABLE IF NOT EXISTS tasks (
    id         BIGSERIAL    PRIMARY KEY,
    user_id    BIGINT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      VARCHAR(255) NOT NULL,
    status     VARCHAR(20)  NOT NULL DEFAULT 'todo'
                            CONSTRAINT tasks_status_check
                            CHECK (status IN ('todo', 'in_progress', 'done')),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks (user_id);
```

**Notes:**

- `BIGSERIAL` auto-increments; consistent with `users.id`
- `ON DELETE CASCADE` ensures orphan tasks are never left behind when a user is deleted
- `CONSTRAINT tasks_status_check` is a database-level guard; the service also validates before sending SQL
- `updated_at` defaults to `NOW()` at creation; subsequent updates set it via `NOW()` in the `UPDATE` statement — never computed in Go code

### Migration: `000002_create_tasks.down.sql`

```sql
DROP TABLE IF EXISTS tasks;
```

---

## Repository Layer

### `internal/repository/models.go` — Task struct (addition)

```go
type Task struct {
    ID        int64
    UserID    int64
    Title     string
    Status    string
    CreatedAt time.Time
    UpdatedAt time.Time
}
```

The existing `User` struct in this file remains unchanged.

### `internal/repository/task_repository.go`

```go
package repository

var ErrTaskNotFound = errors.New("task not found")

type TaskRepository interface {
    CreateTask(ctx context.Context, userID int64, title string) (*Task, error)
    FindTasksByUserID(ctx context.Context, userID int64) ([]*Task, error)
    FindTaskByID(ctx context.Context, id int64) (*Task, error)
    UpdateTask(ctx context.Context, id int64, title, status *string) (*Task, error)
    DeleteTask(ctx context.Context, id int64) error
}

type pgTaskRepository struct {
    db *sql.DB
}

func NewTaskRepository(db *sql.DB) TaskRepository {
    return &pgTaskRepository{db: db}
}
```

**Design notes:**

- `FindTaskByID` fetches by `id` only, without a `user_id` filter. The service does the ownership check after fetching the full `Task` (which includes `UserID`). This keeps ownership logic out of SQL.
- `UpdateTask` accepts `title` and `status` as `*string`. A nil pointer means "do not update this field" — achieved via `COALESCE` in SQL (see SQL section below).
- `FindTasksByUserID` always returns an initialized (non-nil) slice, so `json.Marshal` produces `[]` not `null`.

### SQL Queries

**CreateTask:**

```sql
INSERT INTO tasks (user_id, title)
VALUES ($1, $2)
RETURNING id, user_id, title, status, created_at, updated_at
```

**FindTasksByUserID:**

```sql
SELECT id, user_id, title, status, created_at, updated_at
FROM tasks
WHERE user_id = $1
ORDER BY created_at DESC
```

**FindTaskByID:**

```sql
SELECT id, user_id, title, status, created_at, updated_at
FROM tasks
WHERE id = $1
```

Return `ErrTaskNotFound` when `sql.ErrNoRows`.

**UpdateTask:**

```sql
UPDATE tasks
SET title      = COALESCE($1, title),
    status     = COALESCE($2, status),
    updated_at = NOW()
WHERE id = $3
RETURNING id, user_id, title, status, created_at, updated_at
```

When `title` or `status` is a nil `*string`, `pgx/stdlib` passes SQL `NULL`, so `COALESCE` keeps the existing column value. Return `ErrTaskNotFound` when `sql.ErrNoRows` (task deleted between ownership check and update).

**DeleteTask:**

```sql
DELETE FROM tasks WHERE id = $1
```

Return `ErrTaskNotFound` when `sql.RowsAffected() == 0` (use `db.ExecContext` and check `.RowsAffected()`).

---

## Service Layer

### `internal/service/errors.go` — additions

```go
// Existing:
var ErrEmailTaken         = errors.New("email already taken")
var ErrInvalidCredentials = errors.New("invalid credentials")
var ErrUserNotFound       = errors.New("user not found")

// New:
var ErrTaskNotFound = errors.New("task not found")
var ErrForbidden    = errors.New("forbidden")
```

### `internal/service/task_service.go`

```go
package service

type CreateTaskInput struct {
    Title string
}

type UpdateTaskInput struct {
    Title  *string // nil means "do not update"
    Status *string // nil means "do not update"
}

type TaskService interface {
    CreateTask(ctx context.Context, userID int64, input CreateTaskInput) (*repository.Task, error)
    ListTasks(ctx context.Context, userID int64) ([]*repository.Task, error)
    GetTask(ctx context.Context, userID, taskID int64) (*repository.Task, error)
    UpdateTask(ctx context.Context, userID, taskID int64, input UpdateTaskInput) (*repository.Task, error)
    DeleteTask(ctx context.Context, userID, taskID int64) error
}

type taskService struct {
    taskRepo repository.TaskRepository
}

func NewTaskService(taskRepo repository.TaskRepository) TaskService {
    return &taskService{taskRepo: taskRepo}
}
```

**Ownership check pattern** (used in `GetTask`, `UpdateTask`, `DeleteTask`):

```go
task, err := s.taskRepo.FindTaskByID(ctx, taskID)
if err != nil {
    if errors.Is(err, repository.ErrTaskNotFound) {
        return nil, ErrTaskNotFound
    }
    return nil, err
}
if task.UserID != userID {
    return nil, ErrForbidden
}
```

**Status validation** (in `UpdateTask`, before calling repository):

```go
validStatuses := map[string]bool{"todo": true, "in_progress": true, "done": true}
if input.Status != nil && !validStatuses[*input.Status] {
    return nil, fmt.Errorf("status must be one of: todo, in_progress, done")
}
```

Note: The status validation error is a plain `error` (not a sentinel), because it carries a specific message that is safe to return to the client. The handler checks for this before the sentinel dispatch.

---

## Handler Layer

### `internal/handler/task_handler.go`

```go
package handler

type TaskHandler struct {
    taskService service.TaskService
}

func NewTaskHandler(taskService service.TaskService) *TaskHandler {
    return &TaskHandler{taskService: taskService}
}
```

**Request structs:**

```go
type createTaskRequest struct {
    Title string `json:"title" binding:"required"`
}

type updateTaskRequest struct {
    Title  *string `json:"title"`
    Status *string `json:"status"`
}
```

**Response struct (used for all task responses):**

```go
type taskResponse struct {
    ID        int64     `json:"id"`
    UserID    int64     `json:"user_id"`
    Title     string    `json:"title"`
    Status    string    `json:"status"`
    CreatedAt time.Time `json:"created_at"`
    UpdatedAt time.Time `json:"updated_at"`
}
```

**Error dispatch helper:**

```go
func respondTaskError(c *gin.Context, err error) {
    switch {
    case errors.Is(err, service.ErrTaskNotFound):
        c.JSON(http.StatusNotFound, errorResponse{"task not found"})
    case errors.Is(err, service.ErrForbidden):
        c.JSON(http.StatusForbidden, errorResponse{"forbidden"})
    default:
        log.Printf("unexpected error: %v", err)
        c.JSON(http.StatusInternalServerError, errorResponse{"internal server error"})
    }
}
```

Note: `respondTaskError` is separate from the existing `respondError` in `auth_handler.go`. Each handler file owns its own error dispatch to avoid coupling.

**Handler method signatures:**

```go
func (h *TaskHandler) Create(c *gin.Context)
func (h *TaskHandler) List(c *gin.Context)
func (h *TaskHandler) Get(c *gin.Context)
func (h *TaskHandler) Update(c *gin.Context)
func (h *TaskHandler) Delete(c *gin.Context)
```

**Path parameter parsing pattern** (used in `Get`, `Update`, `Delete`):

```go
idStr := c.Param("id")
id, err := strconv.ParseInt(idStr, 10, 64)
if err != nil {
    c.JSON(http.StatusBadRequest, errorResponse{"invalid task id"})
    return
}
```

**User id extraction pattern** (used in all handlers):

```go
val, _ := c.Get("userID")
userID, ok := val.(int64)
if !ok {
    c.JSON(http.StatusInternalServerError, errorResponse{"internal server error"})
    return
}
```

**Update — empty body guard** (in `Update` handler, before calling service):

```go
if req.Title == nil && req.Status == nil {
    c.JSON(http.StatusBadRequest, errorResponse{"at least one of title or status must be provided"})
    return
}
```

---

## Router Wiring — `cmd/server/main.go` Changes

The `protected` group already exists and applies `AuthRequired`. Add task wiring after auth handler wiring:

```go
// Existing auth wiring (unchanged):
userRepo    := repository.NewUserRepository(conn)
authService := service.NewAuthService(userRepo, cfg.JWTSecret)
authHandler := handler.NewAuthHandler(authService)

// New task wiring:
taskRepo    := repository.NewTaskRepository(conn)
taskService := service.NewTaskService(taskRepo)
taskHandler := handler.NewTaskHandler(taskService)

// Existing protected group (unchanged declaration):
protected := router.Group("/api", middleware.AuthRequired(cfg.JWTSecret))
protected.GET("/me", authHandler.Me)

// New task routes:
protected.POST("/tasks",        taskHandler.Create)
protected.GET("/tasks",         taskHandler.List)
protected.GET("/tasks/:id",     taskHandler.Get)
protected.PUT("/tasks/:id",     taskHandler.Update)
protected.DELETE("/tasks/:id",  taskHandler.Delete)
```

---

## API Contract

### POST /api/tasks

| Field        | Value                         |
| ------------ | ----------------------------- |
| Method       | POST                          |
| Path         | `/api/tasks`                  |
| Content-Type | `application/json`            |
| Auth         | `Authorization: Bearer <jwt>` |

Request body:

```json
{ "title": "Write unit tests" }
```

Responses:

| Status | Body                                                                   | Condition              |
| ------ | ---------------------------------------------------------------------- | ---------------------- |
| 201    | `{"id":1,"user_id":42,"title":"Write unit tests","status":"todo",...}` | Success                |
| 400    | `{"error": "Key: 'createTaskRequest.Title' Error:..."}`                | Missing or empty title |
| 401    | `{"error": "authorization header required"}`                           | No or invalid JWT      |
| 500    | `{"error": "internal server error"}`                                   | Unexpected DB error    |

---

### GET /api/tasks

| Field  | Value                         |
| ------ | ----------------------------- |
| Method | GET                           |
| Path   | `/api/tasks`                  |
| Auth   | `Authorization: Bearer <jwt>` |

Responses:

| Status | Body                                         | Condition                       |
| ------ | -------------------------------------------- | ------------------------------- |
| 200    | `[{...}, {...}]` or `[]`                     | Success (array, possibly empty) |
| 401    | `{"error": "authorization header required"}` | No or invalid JWT               |
| 500    | `{"error": "internal server error"}`         | Unexpected DB error             |

---

### GET /api/tasks/:id

| Field  | Value                         |
| ------ | ----------------------------- |
| Method | GET                           |
| Path   | `/api/tasks/:id`              |
| Auth   | `Authorization: Bearer <jwt>` |

Responses:

| Status | Body                                         | Condition                    |
| ------ | -------------------------------------------- | ---------------------------- |
| 200    | `{"id":1,"user_id":42,...}`                  | Success                      |
| 400    | `{"error": "invalid task id"}`               | Non-numeric `:id`            |
| 401    | `{"error": "authorization header required"}` | No or invalid JWT            |
| 403    | `{"error": "forbidden"}`                     | Task belongs to another user |
| 404    | `{"error": "task not found"}`                | Task does not exist          |
| 500    | `{"error": "internal server error"}`         | Unexpected DB error          |

---

### PUT /api/tasks/:id

| Field        | Value                         |
| ------------ | ----------------------------- |
| Method       | PUT                           |
| Path         | `/api/tasks/:id`              |
| Content-Type | `application/json`            |
| Auth         | `Authorization: Bearer <jwt>` |

Request body (all fields optional, at least one required):

```json
{ "status": "done" }
```

Responses:

| Status | Body                                                            | Condition                    |
| ------ | --------------------------------------------------------------- | ---------------------------- |
| 200    | `{"id":1,"user_id":42,"status":"done",...}`                     | Success                      |
| 400    | `{"error": "at least one of title or status must be provided"}` | Empty body                   |
| 400    | `{"error": "status must be one of: todo, in_progress, done"}`   | Invalid status value         |
| 400    | `{"error": "invalid task id"}`                                  | Non-numeric `:id`            |
| 401    | `{"error": "authorization header required"}`                    | No or invalid JWT            |
| 403    | `{"error": "forbidden"}`                                        | Task belongs to another user |
| 404    | `{"error": "task not found"}`                                   | Task does not exist          |
| 500    | `{"error": "internal server error"}`                            | Unexpected DB error          |

---

### DELETE /api/tasks/:id

| Field  | Value                         |
| ------ | ----------------------------- |
| Method | DELETE                        |
| Path   | `/api/tasks/:id`              |
| Auth   | `Authorization: Bearer <jwt>` |

Responses:

| Status | Body                                         | Condition                    |
| ------ | -------------------------------------------- | ---------------------------- |
| 204    | (empty)                                      | Success                      |
| 400    | `{"error": "invalid task id"}`               | Non-numeric `:id`            |
| 401    | `{"error": "authorization header required"}` | No or invalid JWT            |
| 403    | `{"error": "forbidden"}`                     | Task belongs to another user |
| 404    | `{"error": "task not found"}`                | Task does not exist          |
| 500    | `{"error": "internal server error"}`         | Unexpected DB error          |

---

## Data Flow Diagrams

### Create Task

```text
POST /api/tasks
Authorization: Bearer <token>
{"title": "Write unit tests"}
        |
        v
  middleware.AuthRequired
        | validate JWT, extract userID int64
        | c.Set("userID", userID)
        | c.Next()
        |
        v
  TaskHandler.Create
        | c.Get("userID") -> userID int64
        | c.ShouldBindJSON(&createTaskRequest) -- fails if title missing/empty -> 400
        |
        v
  TaskService.CreateTask(ctx, userID, CreateTaskInput{Title: req.Title})
        |
        v
  TaskRepository.CreateTask(ctx, userID, title)
        | INSERT INTO tasks (user_id, title) VALUES ($1, $2)
        | RETURNING id, user_id, title, status, created_at, updated_at
        |
        v
  TaskHandler <- *Task{ID, UserID, Title, Status, CreatedAt, UpdatedAt}
        | respond 201 taskResponse{...}
```

---

### List Tasks

```text
GET /api/tasks
Authorization: Bearer <token>
        |
        v
  middleware.AuthRequired -> userID int64
        |
        v
  TaskHandler.List
        | c.Get("userID") -> userID
        |
        v
  TaskService.ListTasks(ctx, userID)
        |
        v
  TaskRepository.FindTasksByUserID(ctx, userID)
        | SELECT ... FROM tasks WHERE user_id = $1 ORDER BY created_at DESC
        | if no rows: return []*Task{} (empty slice, NOT nil)
        |
        v
  TaskHandler <- []*Task (may be empty)
        | respond 200 []taskResponse{...} or []
```

---

### Get Single Task (with ownership check)

```text
GET /api/tasks/5
Authorization: Bearer <token>
        |
        v
  middleware.AuthRequired -> userID int64
        |
        v
  TaskHandler.Get
        | strconv.ParseInt(c.Param("id")) -- fails if non-numeric -> 400
        | c.Get("userID") -> userID
        |
        v
  TaskService.GetTask(ctx, userID=42, taskID=5)
        |
        v
  TaskRepository.FindTaskByID(ctx, id=5)
        | SELECT ... FROM tasks WHERE id = $1
        | if no rows -> ErrTaskNotFound -> 404
        |
        v
  if task.UserID (e.g. 99) != userID (42)
        | return ErrForbidden -> 403
        |
  else
        | return task -> 200
```

---

### Update Task

```text
PUT /api/tasks/5
Authorization: Bearer <token>
{"status": "done"}
        |
        v
  middleware.AuthRequired -> userID int64
        |
        v
  TaskHandler.Update
        | ParseInt(":id") -- fails if non-numeric -> 400
        | c.ShouldBindJSON(&updateTaskRequest)
        | if req.Title == nil && req.Status == nil -> 400 "at least one..."
        |
        v
  TaskService.UpdateTask(ctx, userID=42, taskID=5, UpdateTaskInput{Status: ptr("done")})
        | validate *input.Status in {"todo","in_progress","done"} -- fails -> plain error -> 400
        |
        v
  TaskRepository.FindTaskByID(ctx, id=5)
        | if not found -> ErrTaskNotFound -> 404
        |
        v
  if task.UserID != userID -> ErrForbidden -> 403
        |
        v
  TaskRepository.UpdateTask(ctx, id=5, title=nil, status=ptr("done"))
        | UPDATE tasks SET title=COALESCE(NULL,title), status=COALESCE('done',status), updated_at=NOW()
        | WHERE id = $3
        | RETURNING ...
        |
        v
  TaskHandler <- *Task{updated fields}
        | respond 200 taskResponse{...}
```

---

### Delete Task

```text
DELETE /api/tasks/5
Authorization: Bearer <token>
        |
        v
  middleware.AuthRequired -> userID int64
        |
        v
  TaskHandler.Delete
        | ParseInt(":id") -- fails -> 400
        | c.Get("userID") -> userID
        |
        v
  TaskService.DeleteTask(ctx, userID=42, taskID=5)
        |
        v
  TaskRepository.FindTaskByID(ctx, id=5)
        | if not found -> ErrTaskNotFound -> 404
        |
        v
  if task.UserID != userID -> ErrForbidden -> 403
        |
        v
  TaskRepository.DeleteTask(ctx, id=5)
        | DELETE FROM tasks WHERE id = $1
        | if rowsAffected == 0 -> ErrTaskNotFound (race condition)
        |
        v
  TaskHandler
        | c.Status(http.StatusNoContent)  -- no body
```

---

## Error Handling Strategy

### Sentinel Error Dispatch Table

| Sentinel            | Defined in                   | HTTP Code | Response body                                                  |
| ------------------- | ---------------------------- | --------- | -------------------------------------------------------------- |
| `ErrTaskNotFound`   | `service/errors.go`          | 404       | `{"error":"task not found"}`                                   |
| `ErrForbidden`      | `service/errors.go`          | 403       | `{"error":"forbidden"}`                                        |
| Status validation   | plain `error` (message safe) | 400       | `{"error":"status must be one of: todo, in_progress, done"}`   |
| Empty update body   | checked in handler           | 400       | `{"error":"at least one of title or status must be provided"}` |
| Invalid `:id` param | checked in handler           | 400       | `{"error":"invalid task id"}`                                  |
| All other errors    | `respondTaskError` default   | 500       | `{"error":"internal server error"}`                            |

### How `respondTaskError` distinguishes status validation

Status validation returns a plain `error` with a user-safe message, not a sentinel. The handler checks this before calling `respondTaskError`:

```go
task, err := h.taskService.UpdateTask(ctx, userID, id, input)
if err != nil {
    // Status validation produces a non-nil, non-sentinel error with a safe message.
    // Check for it before the sentinel dispatch.
    if !errors.Is(err, service.ErrTaskNotFound) && !errors.Is(err, service.ErrForbidden) {
        c.JSON(http.StatusBadRequest, errorResponse{err.Error()})
        return
    }
    respondTaskError(c, err)
    return
}
```

Alternatively, define a dedicated `ErrInvalidStatus` sentinel in `errors.go` — either approach is valid; the plan supports both.
