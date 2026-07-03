# Taskly Backend — Task CRUD Implementation Checklist

Each phase is one PR. Branch names follow `governance/conventions/development.md`.

**Status Legend**: `[ ]` Not started | `[x]` Complete

---

## PR 1 — Tasks Table Migration

**Branch**: `feat/taskly-be-tasks-migration`
**Goal**: Create the `tasks` table via a versioned SQL migration. No Go code changes.

### Task 1.1: Write the up migration

- [x] Create `apps/taskly-be/internal/db/migrations/000002_create_tasks.up.sql` with:

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

### Task 1.2: Write the down migration

- [x] Create `apps/taskly-be/internal/db/migrations/000002_create_tasks.down.sql` with:

  ```sql
  DROP TABLE IF EXISTS tasks;
  ```

### Task 1.3: Verify the migration runs

- [ ] Start the server from `apps/taskly-be/`: `go run ./cmd/server/`
- [ ] Confirm the startup log shows migration version 2 applied (golang-migrate logs the version)
- [ ] Connect to the `taskly` database and verify the schema:

  ```bash
  psql -d taskly -c "\d tasks"
  ```

  Confirm: `id BIGSERIAL`, `user_id BIGINT NOT NULL`, `title VARCHAR(255) NOT NULL`, `status VARCHAR(20) NOT NULL DEFAULT 'todo'`, `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ`, `idx_tasks_user_id` index

- [ ] Verify the `CHECK` constraint rejects bad values:

  ```bash
  psql -d taskly -c "INSERT INTO tasks (user_id, title, status) VALUES (1, 'test', 'invalid');"
  ```

  Expected: `ERROR: new row for relation "tasks" violates check constraint "tasks_status_check"`

### Task 1.4: Verify idempotency

- [ ] Stop and restart the server
- [ ] Confirm the startup log shows "no change" (not an error) — the migration runner skips already-applied versions

### Task 1.5: Commit and open PR

- [ ] Stage: `internal/db/migrations/000002_create_tasks.up.sql`, `internal/db/migrations/000002_create_tasks.down.sql`
- [ ] Commit message: `feat(taskly-be): add tasks table migration`
- [ ] Push branch `feat/taskly-be-tasks-migration` and open PR

**Acceptance Criteria**:

- `tasks` table exists in the `taskly` database after first startup with this migration
- Second startup logs "no change" and continues normally
- `CHECK` constraint rejects status values outside `{'todo','in_progress','done'}`
- `REFERENCES users(id) ON DELETE CASCADE` is present (verify via `\d tasks` in psql)
- `go build ./...` still exits 0 (no Go changes, but verify the binary still builds)

---

## PR 2 — Task Repository

**Branch**: `feat/taskly-be-task-repository`
**Goal**: Define the `Task` struct, `TaskRepository` interface, and pgx implementation. No service or handler code yet.

### Task 2.1: Add `Task` struct to models.go

- [x] Open `apps/taskly-be/internal/repository/models.go`
- [x] Add the `Task` struct below the existing `User` struct:

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

- [x] Verify the file still compiles: `go build ./internal/repository/` from `apps/taskly-be/`

### Task 2.2: Create task_repository.go with interface and constructor

- [x] Create `apps/taskly-be/internal/repository/task_repository.go`
- [x] Add package-level sentinel error:

  ```go
  var ErrTaskNotFound = errors.New("task not found")
  ```

- [x] Define the `TaskRepository` interface:

  ```go
  type TaskRepository interface {
      CreateTask(ctx context.Context, userID int64, title string) (*Task, error)
      FindTasksByUserID(ctx context.Context, userID int64) ([]*Task, error)
      FindTaskByID(ctx context.Context, id int64) (*Task, error)
      UpdateTask(ctx context.Context, id int64, title, status *string) (*Task, error)
      DeleteTask(ctx context.Context, id int64) error
  }
  ```

- [x] Define `pgTaskRepository` struct and `NewTaskRepository` constructor:

  ```go
  type pgTaskRepository struct {
      db *sql.DB
  }

  func NewTaskRepository(db *sql.DB) TaskRepository {
      return &pgTaskRepository{db: db}
  }
  ```

### Task 2.3: Implement CreateTask

- [x] Implement `CreateTask(ctx context.Context, userID int64, title string) (*Task, error)`:
  - SQL: `INSERT INTO tasks (user_id, title) VALUES ($1, $2) RETURNING id, user_id, title, status, created_at, updated_at`
  - Use `db.QueryRowContext(ctx, sql, userID, title).Scan(&t.ID, &t.UserID, &t.Title, &t.Status, &t.CreatedAt, &t.UpdatedAt)`
  - Return the `*Task` on success; propagate any error

### Task 2.4: Implement FindTasksByUserID

- [x] Implement `FindTasksByUserID(ctx context.Context, userID int64) ([]*Task, error)`:
  - SQL: `SELECT id, user_id, title, status, created_at, updated_at FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`
  - Initialize the result slice as `tasks := make([]*Task, 0)` before the loop — this ensures `json.Marshal` produces `[]` not `null`
  - Use `db.QueryContext` and iterate rows with `rows.Next()`
  - Scan each row into a `&Task{}` and append to the slice
  - Check `rows.Err()` after the loop

### Task 2.5: Implement FindTaskByID

- [x] Implement `FindTaskByID(ctx context.Context, id int64) (*Task, error)`:
  - SQL: `SELECT id, user_id, title, status, created_at, updated_at FROM tasks WHERE id = $1`
  - Use `db.QueryRowContext`
  - Return `ErrTaskNotFound` when `errors.Is(err, sql.ErrNoRows)`

### Task 2.6: Implement UpdateTask

- [x] Implement `UpdateTask(ctx context.Context, id int64, title, status *string) (*Task, error)`:
  - SQL:

    ```sql
    UPDATE tasks
    SET title      = COALESCE($1, title),
        status     = COALESCE($2, status),
        updated_at = NOW()
    WHERE id = $3
    RETURNING id, user_id, title, status, created_at, updated_at
    ```

  - Pass `title` and `status` directly as `*string` — pgx/stdlib handles nil pointer as SQL `NULL`
  - Return `ErrTaskNotFound` when `sql.ErrNoRows` (task was deleted between the ownership check and this call)

### Task 2.7: Implement DeleteTask

- [x] Implement `DeleteTask(ctx context.Context, id int64) error`:
  - SQL: `DELETE FROM tasks WHERE id = $1`
  - Use `db.ExecContext(ctx, sql, id)`
  - Call `result.RowsAffected()` — if `== 0`, return `ErrTaskNotFound`
  - Return any other error from `ExecContext`

### Task 2.8: Verify compilation

- [x] From `apps/taskly-be/`, run: `go build ./...`
- [x] From `apps/taskly-be/`, run: `go vet ./...`
- [x] Both must exit 0

### Task 2.9: Commit and open PR

- [ ] Stage: updated `internal/repository/models.go`, new `internal/repository/task_repository.go`
- [ ] Commit message: `feat(taskly-be): add TaskRepository with pgx implementation`
- [ ] Push branch `feat/taskly-be-task-repository` and open PR

**Acceptance Criteria**:

- `TaskRepository` interface is defined with all five methods
- `pgTaskRepository` satisfies the interface (verified by `go build`)
- `FindTasksByUserID` returns an empty initialized slice (not nil) when no tasks exist
- `UpdateTask` uses `COALESCE` with `*string` arguments for partial update
- `ErrTaskNotFound` is defined at package level in `task_repository.go`
- `go build ./...` and `go vet ./...` both exit 0

---

## PR 3 — Task Service

**Branch**: `feat/taskly-be-task-service`
**Goal**: Implement business logic: ownership verification, status validation, and sentinel error wrapping. No HTTP code.

### Task 3.1: Extend errors.go with new sentinels

- [x] Open `apps/taskly-be/internal/service/errors.go`
- [x] Add the two new sentinel errors below the existing ones:

  ```go
  var ErrTaskNotFound = errors.New("task not found")
  var ErrForbidden    = errors.New("forbidden")
  ```

- [x] Verify `go build ./...` exits 0

### Task 3.2: Create task_service.go with types

- [x] Create `apps/taskly-be/internal/service/task_service.go`
- [x] Define `CreateTaskInput` and `UpdateTaskInput` types:

  ```go
  type CreateTaskInput struct {
      Title string
  }

  type UpdateTaskInput struct {
      Title  *string
      Status *string
  }
  ```

- [x] Define the `TaskService` interface:

  ```go
  type TaskService interface {
      CreateTask(ctx context.Context, userID int64, input CreateTaskInput) (*repository.Task, error)
      ListTasks(ctx context.Context, userID int64) ([]*repository.Task, error)
      GetTask(ctx context.Context, userID, taskID int64) (*repository.Task, error)
      UpdateTask(ctx context.Context, userID, taskID int64, input UpdateTaskInput) (*repository.Task, error)
      DeleteTask(ctx context.Context, userID, taskID int64) error
  }
  ```

- [x] Define `taskService` struct and `NewTaskService` constructor:

  ```go
  type taskService struct {
      taskRepo repository.TaskRepository
  }

  func NewTaskService(taskRepo repository.TaskRepository) TaskService {
      return &taskService{taskRepo: taskRepo}
  }
  ```

### Task 3.3: Implement CreateTask

- [x] Implement `CreateTask(ctx context.Context, userID int64, input CreateTaskInput) (*repository.Task, error)`:
  - Call `s.taskRepo.CreateTask(ctx, userID, input.Title)`
  - Propagate any error directly (no special wrapping needed — the repo doesn't return task-specific sentinels for create)

### Task 3.4: Implement ListTasks

- [x] Implement `ListTasks(ctx context.Context, userID int64) ([]*repository.Task, error)`:
  - Call `s.taskRepo.FindTasksByUserID(ctx, userID)`
  - Propagate any error directly

### Task 3.5: Implement GetTask with ownership check

- [x] Implement `GetTask(ctx context.Context, userID, taskID int64) (*repository.Task, error)`:
  - Call `s.taskRepo.FindTaskByID(ctx, taskID)`
  - If `errors.Is(err, repository.ErrTaskNotFound)`, return `ErrTaskNotFound`
  - If any other error, propagate
  - Check ownership: `if task.UserID != userID { return nil, ErrForbidden }`
  - Return the task

### Task 3.6: Implement UpdateTask with ownership check and status validation

- [x] Implement `UpdateTask(ctx context.Context, userID, taskID int64, input UpdateTaskInput) (*repository.Task, error)`:
  - Validate status if provided:

    ```go
    if input.Status != nil {
        valid := map[string]bool{"todo": true, "in_progress": true, "done": true}
        if !valid[*input.Status] {
            return nil, fmt.Errorf("status must be one of: todo, in_progress, done")
        }
    }
    ```

  - Fetch task: `s.taskRepo.FindTaskByID(ctx, taskID)` — wrap `repository.ErrTaskNotFound` as `ErrTaskNotFound`
  - Ownership check: `if task.UserID != userID { return nil, ErrForbidden }`
  - Call `s.taskRepo.UpdateTask(ctx, taskID, input.Title, input.Status)`
  - Propagate errors from the update call

### Task 3.7: Implement DeleteTask with ownership check

- [x] Implement `DeleteTask(ctx context.Context, userID, taskID int64) error`:
  - Fetch task: `s.taskRepo.FindTaskByID(ctx, taskID)` — wrap `repository.ErrTaskNotFound` as `ErrTaskNotFound`
  - Ownership check: `if task.UserID != userID { return ErrForbidden }`
  - Call `s.taskRepo.DeleteTask(ctx, taskID)`
  - Propagate any error

### Task 3.8: Verify compilation

- [ ] From `apps/taskly-be/`, run: `go build ./...`
- [ ] From `apps/taskly-be/`, run: `go vet ./...`
- [ ] Both must exit 0

### Task 3.9: Commit and open PR

- [ ] Stage: updated `internal/service/errors.go`, new `internal/service/task_service.go`
- [ ] Commit message: `feat(taskly-be): add TaskService with ownership checks and status validation`
- [ ] Push branch `feat/taskly-be-task-service` and open PR

**Acceptance Criteria**:

- `ErrTaskNotFound` and `ErrForbidden` are defined in `internal/service/errors.go`
- `TaskService` interface is defined with all five methods
- `GetTask`, `UpdateTask`, and `DeleteTask` all call `FindTaskByID` first, then compare `task.UserID != userID`
- `UpdateTask` rejects unknown status values with a plain error before calling the repository
- `DeleteTask` uses `FindTaskByID` before `DeleteTask` to enable the ownership check
- `go build ./...` and `go vet ./...` both exit 0

---

## PR 4 — Task Handlers and Route Wiring

**Branch**: `feat/taskly-be-task-handlers`
**Goal**: Implement the five gin handlers, wire all routes in `main.go`, and manually verify every endpoint with curl.

### Task 4.1: Create task_handler.go with type definitions

- [ ] Create `apps/taskly-be/internal/handler/task_handler.go`
- [ ] Add `TaskHandler` struct and `NewTaskHandler` constructor:

  ```go
  type TaskHandler struct {
      taskService service.TaskService
  }

  func NewTaskHandler(taskService service.TaskService) *TaskHandler {
      return &TaskHandler{taskService: taskService}
  }
  ```

- [ ] Add request structs:

  ```go
  type createTaskRequest struct {
      Title string `json:"title" binding:"required"`
  }

  type updateTaskRequest struct {
      Title  *string `json:"title"`
      Status *string `json:"status"`
  }
  ```

- [ ] Add response struct:

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

- [ ] Add `respondTaskError` helper:

  ```go
  func respondTaskError(c *gin.Context, err error) {
      switch {
      case errors.Is(err, service.ErrTaskNotFound):
          c.JSON(http.StatusNotFound, errorResponse{"task not found"})
      case errors.Is(err, service.ErrForbidden):
          c.JSON(http.StatusForbidden, errorResponse{"forbidden"})
      default:
          log.Printf("unexpected task error: %v", err)
          c.JSON(http.StatusInternalServerError, errorResponse{"internal server error"})
      }
  }
  ```

  Note: `errorResponse` is already defined in `auth_handler.go` in the same `handler` package — do not redefine it.

### Task 4.2: Implement Create handler

- [ ] Implement `TaskHandler.Create(c *gin.Context)`:
  - Extract `userID` via `c.Get("userID")` with type assertion to `int64`; return `500` if assertion fails
  - Bind request with `c.ShouldBindJSON(&req)`; return `400` on bind error
  - Call `h.taskService.CreateTask(ctx, userID, service.CreateTaskInput{Title: req.Title})`
  - On error: call `respondTaskError(c, err)`
  - On success: `c.JSON(http.StatusCreated, taskResponse{...})` with all six fields populated

### Task 4.3: Implement List handler

- [ ] Implement `TaskHandler.List(c *gin.Context)`:
  - Extract `userID`
  - Call `h.taskService.ListTasks(ctx, userID)`
  - On error: `respondTaskError(c, err)`
  - On success: build `[]taskResponse` from the returned slice and respond with `200`

  ```go
  result := make([]taskResponse, len(tasks))
  for i, t := range tasks {
      result[i] = taskResponse{...}
  }
  c.JSON(http.StatusOK, result)
  ```

  When `tasks` is empty, `result` is `[]taskResponse{}` — `json.Marshal` produces `[]`.

### Task 4.4: Implement Get handler

- [ ] Implement `TaskHandler.Get(c *gin.Context)`:
  - Parse `:id` with `strconv.ParseInt(c.Param("id"), 10, 64)`; return `400 {"error":"invalid task id"}` on failure
  - Extract `userID`
  - Call `h.taskService.GetTask(ctx, userID, id)`
  - On error: `respondTaskError(c, err)` (handles both `ErrTaskNotFound` → 404 and `ErrForbidden` → 403)
  - On success: `c.JSON(http.StatusOK, taskResponse{...})`

### Task 4.5: Implement Update handler

- [ ] Implement `TaskHandler.Update(c *gin.Context)`:
  - Parse `:id`; return `400` on failure
  - Extract `userID`
  - Bind request with `c.ShouldBindJSON(&req)` (no `binding:"required"` on any field — optional fields)
  - Guard: `if req.Title == nil && req.Status == nil { c.JSON(400, errorResponse{"at least one of title or status must be provided"}); return }`
  - Call `h.taskService.UpdateTask(ctx, userID, id, service.UpdateTaskInput{Title: req.Title, Status: req.Status})`
  - On error:
    - If not a known sentinel (`ErrTaskNotFound`, `ErrForbidden`), it is the status validation error — respond `400` with `err.Error()`
    - Otherwise `respondTaskError(c, err)`
  - On success: `c.JSON(http.StatusOK, taskResponse{...})`

### Task 4.6: Implement Delete handler

- [ ] Implement `TaskHandler.Delete(c *gin.Context)`:
  - Parse `:id`; return `400` on failure
  - Extract `userID`
  - Call `h.taskService.DeleteTask(ctx, userID, id)`
  - On error: `respondTaskError(c, err)`
  - On success: `c.Status(http.StatusNoContent)` (no body — do NOT call `c.JSON`)

### Task 4.7: Wire task dependency chain in main.go

- [ ] Open `apps/taskly-be/cmd/server/main.go`
- [ ] After the existing auth wiring block, add:

  ```go
  taskRepo    := repository.NewTaskRepository(conn)
  taskService := service.NewTaskService(taskRepo)
  taskHandler := handler.NewTaskHandler(taskService)
  ```

- [ ] In the existing `protected` group block, register the five routes:

  ```go
  protected.POST("/tasks",       taskHandler.Create)
  protected.GET("/tasks",        taskHandler.List)
  protected.GET("/tasks/:id",    taskHandler.Get)
  protected.PUT("/tasks/:id",    taskHandler.Update)
  protected.DELETE("/tasks/:id", taskHandler.Delete)
  ```

### Task 4.8: Verify compilation

- [ ] From `apps/taskly-be/`: `go build ./...` — must exit 0
- [ ] From `apps/taskly-be/`: `go vet ./...` — must exit 0

### Task 4.9: Manual end-to-end verification

- [ ] Start the server: `go run ./cmd/server/` from `apps/taskly-be/`

- [ ] Register and log in as a test user, capture the token:

  ```bash
  curl -s -X POST http://localhost:8082/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"tasktest@example.com","password":"securepass"}' | jq .

  TOKEN=$(curl -s -X POST http://localhost:8082/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"tasktest@example.com","password":"securepass"}' | jq -r .token)
  ```

- [ ] Create a task:

  ```bash
  curl -s -X POST http://localhost:8082/api/tasks \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"title":"Write unit tests"}' | jq .
  ```

  Expected: `201` with `{"id":1,"user_id":<n>,"title":"Write unit tests","status":"todo",...}`

- [ ] Create a second task:

  ```bash
  curl -s -X POST http://localhost:8082/api/tasks \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"title":"Deploy to production"}' | jq .
  ```

- [ ] List all tasks:

  ```bash
  curl -s http://localhost:8082/api/tasks \
    -H "Authorization: Bearer $TOKEN" | jq .
  ```

  Expected: `200` with array of two tasks, newest first

- [ ] Get a single task (replace `1` with the actual id from the create response):

  ```bash
  curl -s http://localhost:8082/api/tasks/1 \
    -H "Authorization: Bearer $TOKEN" | jq .
  ```

  Expected: `200` with the task object

- [ ] Update the task status:

  ```bash
  curl -s -X PUT http://localhost:8082/api/tasks/1 \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"status":"in_progress"}' | jq .
  ```

  Expected: `200` with `"status":"in_progress"` and a newer `updated_at` than `created_at`; `title` unchanged

- [ ] Try an invalid status:

  ```bash
  curl -s -X PUT http://localhost:8082/api/tasks/1 \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"status":"invalid"}' | jq .
  ```

  Expected: `400` with `{"error":"status must be one of: todo, in_progress, done"}`

- [ ] Try an empty update body:

  ```bash
  curl -s -X PUT http://localhost:8082/api/tasks/1 \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{}' | jq .
  ```

  Expected: `400` with `{"error":"at least one of title or status must be provided"}`

- [ ] Delete the task:

  ```bash
  curl -s -X DELETE http://localhost:8082/api/tasks/1 \
    -H "Authorization: Bearer $TOKEN" -v
  ```

  Expected: `204` with no body

- [ ] Verify deletion by listing tasks again:

  ```bash
  curl -s http://localhost:8082/api/tasks \
    -H "Authorization: Bearer $TOKEN" | jq .
  ```

  Expected: `200` with array containing only the second task (id 2)

- [ ] Verify getting the deleted task returns 404:

  ```bash
  curl -s http://localhost:8082/api/tasks/1 \
    -H "Authorization: Bearer $TOKEN" | jq .
  ```

  Expected: `404` with `{"error":"task not found"}`

- [ ] Verify unauthenticated access is blocked:

  ```bash
  curl -s http://localhost:8082/api/tasks | jq .
  ```

  Expected: `401` with `{"error":"authorization header required"}`

- [ ] Register a second user, log in, and attempt to access first user's task:

  ```bash
  curl -s -X POST http://localhost:8082/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"other@example.com","password":"securepass"}' | jq .

  TOKEN2=$(curl -s -X POST http://localhost:8082/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"other@example.com","password":"securepass"}' | jq -r .token)

  curl -s http://localhost:8082/api/tasks/2 \
    -H "Authorization: Bearer $TOKEN2" | jq .
  ```

  Expected: `403` with `{"error":"forbidden"}`

### Task 4.10: Commit and open PR

- [ ] Stage: new `internal/handler/task_handler.go`, updated `cmd/server/main.go`
- [ ] Commit message: `feat(taskly-be): add task CRUD handlers and wire routes`
- [ ] Push branch `feat/taskly-be-task-handlers` and open PR

**Acceptance Criteria**:

- All curl tests from Task 4.9 pass
- `GET /api/tasks` returns `[]` for a user with no tasks (not `null`)
- `DELETE /api/tasks/:id` returns `204` with no body
- `PUT /api/tasks/:id` with only `status` leaves `title` unchanged
- Cross-user access returns `403` not `404`
- `go build ./...` and `go vet ./...` both exit 0

---

## PR 5 — Gherkin Specifications

**Branch**: `docs/taskly-be-task-crud-specs`
**Goal**: Write Gherkin scenarios covering all five task endpoints, all success paths, and all error paths.

### Task 5.1: Create tasks.feature

- [ ] Create `specs/taskly-be/tasks.feature`:

```gherkin
Feature: Task management
  As an authenticated user of the Taskly API
  I want to create, list, view, update, and delete my tasks
  So that I can manage my work through the API

  Background:
    Given the Taskly API is running on http://localhost:8082
    And I am authenticated as "taskuser@example.com" with password "securepass1"

  Scenario: Create a task with a valid title
    Given I have a valid authentication token
    When I POST to /api/tasks with body {"title": "Write unit tests"}
    Then the response status is 201
    And the response body contains "id", "user_id", "title", "status", "created_at", and "updated_at"

  Scenario: Create a task without a title
    Given I have a valid authentication token
    When I POST to /api/tasks with an empty body {}
    Then the response status is 400

  Scenario: Create a task without authentication
    Given I have no authentication token
    When I POST to /api/tasks with body {"title": "Write unit tests"}
    Then the response status is 401
    And the response body contains error "authorization header required"

  Scenario: List tasks returns array for a user with tasks
    Given I have a valid authentication token
    And I have previously created two tasks
    When I GET /api/tasks
    Then the response status is 200
    And the response body is a JSON array with 2 items

  Scenario: List tasks returns empty array for a user with no tasks
    Given I have a valid authentication token
    And I have no tasks
    When I GET /api/tasks
    Then the response status is 200
    And the response body is the JSON array []

  Scenario: List tasks without authentication
    Given I have no authentication token
    When I GET /api/tasks
    Then the response status is 401
    And the response body contains error "authorization header required"

  Scenario: Get a task owned by the authenticated user
    Given I have a valid authentication token
    And I have a task with id 1 owned by me
    When I GET /api/tasks/1
    Then the response status is 200
    And the response body contains "id", "title", and "status"

  Scenario: Get a task that does not exist
    Given I have a valid authentication token
    When I GET /api/tasks/99999
    Then the response status is 404
    And the response body contains error "task not found"

  Scenario: Get a task owned by another user
    Given I have a valid authentication token
    And there is a task with id 10 owned by a different user
    When I GET /api/tasks/10
    Then the response status is 403
    And the response body contains error "forbidden"

  Scenario: Update a task status to in_progress
    Given I have a valid authentication token
    And I have a task with id 1 and status "todo" owned by me
    When I PUT /api/tasks/1 with body {"status": "in_progress"}
    Then the response status is 200
    And the response body contains status "in_progress"
    And the response body contains the original title unchanged

  Scenario: Update a task with an invalid status
    Given I have a valid authentication token
    And I have a task with id 1 owned by me
    When I PUT /api/tasks/1 with body {"status": "invalid_status"}
    Then the response status is 400
    And the response body contains error "status must be one of: todo, in_progress, done"

  Scenario: Update a task with an empty body
    Given I have a valid authentication token
    And I have a task with id 1 owned by me
    When I PUT /api/tasks/1 with body {}
    Then the response status is 400
    And the response body contains error "at least one of title or status must be provided"

  Scenario: Update a task owned by another user
    Given I have a valid authentication token
    And there is a task with id 10 owned by a different user
    When I PUT /api/tasks/10 with body {"status": "done"}
    Then the response status is 403
    And the response body contains error "forbidden"

  Scenario: Delete a task owned by the authenticated user
    Given I have a valid authentication token
    And I have a task with id 1 owned by me
    When I DELETE /api/tasks/1
    Then the response status is 204
    And the response body is empty

  Scenario: Delete a task that does not exist
    Given I have a valid authentication token
    When I DELETE /api/tasks/99999
    Then the response status is 404
    And the response body contains error "task not found"

  Scenario: Delete a task owned by another user
    Given I have a valid authentication token
    And there is a task with id 10 owned by a different user
    When I DELETE /api/tasks/10
    Then the response status is 403
    And the response body contains error "forbidden"
```

### Task 5.2: Verify 1-1-1 rule compliance

- [ ] Re-read the feature file and confirm every scenario has exactly one `Given`, one `When`, and one `Then`
- [ ] The `Background` block does not count as the `Given` for the 1-1-1 rule — each scenario's inline `Given` counts

### Task 5.3: Commit and open PR

- [ ] Stage: `specs/taskly-be/tasks.feature`
- [ ] Commit message: `docs(taskly-be): add gherkin specs for task CRUD`
- [ ] Push branch `docs/taskly-be-task-crud-specs` and open PR

**Acceptance Criteria**:

- `specs/taskly-be/tasks.feature` covers all five endpoints
- All five success scenarios are present (one per endpoint)
- Ownership violation (`403`) and not-found (`404`) scenarios exist for `GET`, `PUT`, and `DELETE`
- Empty array response scenario exists for `GET /api/tasks`
- Empty body update scenario exists for `PUT`
- Unauthenticated scenarios exist for `POST` and `GET /api/tasks`
- 1-1-1 rule: each scenario has exactly one `Given`, one `When`, one `Then`

---

## Commit Summary

| PR  | Branch                           | Commit Message                                                                 |
| --- | -------------------------------- | ------------------------------------------------------------------------------ |
| 1   | `feat/taskly-be-tasks-migration` | `feat(taskly-be): add tasks table migration`                                   |
| 2   | `feat/taskly-be-task-repository` | `feat(taskly-be): add TaskRepository with pgx implementation`                  |
| 3   | `feat/taskly-be-task-service`    | `feat(taskly-be): add TaskService with ownership checks and status validation` |
| 4   | `feat/taskly-be-task-handlers`   | `feat(taskly-be): add task CRUD handlers and wire routes`                      |
| 5   | `docs/taskly-be-task-crud-specs` | `docs(taskly-be): add gherkin specs for task CRUD`                             |

---

## Final Validation

Before moving this plan to `plans/done/`, verify every item below:

- [ ] `go build ./...` exits 0 from `apps/taskly-be/`
- [ ] `go vet ./...` exits 0 from `apps/taskly-be/`
- [ ] `gofmt -l .` produces no output from `apps/taskly-be/`
- [ ] `tasks` table exists in the `taskly` database with correct schema and `CHECK` constraint
- [ ] `POST /api/tasks` returns `201` with all six fields
- [ ] `GET /api/tasks` returns `200` with `[]` when no tasks exist (not `null`)
- [ ] `GET /api/tasks` returns `200` with an array of tasks ordered by `created_at DESC`
- [ ] `GET /api/tasks/:id` returns `200` for the task owner
- [ ] `GET /api/tasks/:id` returns `403` for a valid JWT belonging to a different user
- [ ] `GET /api/tasks/:id` returns `404` for a non-existent id
- [ ] `PUT /api/tasks/:id` with only `status` leaves `title` unchanged; `updated_at` advances
- [ ] `PUT /api/tasks/:id` with an invalid status returns `400`
- [ ] `PUT /api/tasks/:id` with empty body `{}` returns `400`
- [ ] `DELETE /api/tasks/:id` returns `204` with no body
- [ ] After delete, `GET /api/tasks/:id` returns `404` for the deleted task
- [ ] Any task endpoint without `Authorization` header returns `401`
- [ ] All 5 PRs merged to `main`
- [ ] `specs/taskly-be/tasks.feature` committed and present

---

## Progress Tracking

| PR                     | Status          |
| ---------------------- | --------------- |
| PR 1 — Tasks Migration | [ ] Not started |
| PR 2 — Task Repository | [ ] Not started |
| PR 3 — Task Service    | [ ] Not started |
| PR 4 — Task Handlers   | [ ] Not started |
| PR 5 — Gherkin Specs   | [ ] Not started |

**Overall**: 0/5 PRs merged

**Last Updated**: July 3, 2026
