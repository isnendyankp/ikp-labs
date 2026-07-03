# Taskly Backend — Task CRUD

**Status**: 🏗️ In Progress
**Created**: July 3, 2026
**Priority**: P1-High
**Type**: Feature / Learning Project

---

## Overview

This plan adds full task management to `taskly-be`, the Go REST API that lives at `apps/taskly-be/` in the IKP-Labs monorepo. Authentication is already in place (JWT middleware, register, login, `/api/me`). This plan layers CRUD endpoints on top of that foundation.

A user can create tasks, list all their own tasks, fetch a single task, update a task's title or status, and delete a task. All five endpoints sit behind the existing JWT middleware: only authenticated users can reach them, and each user can only see and modify their own tasks. Ownership is enforced in the service layer.

Each phase of this plan is one small PR. The pattern mirrors the auth plan — repository first, then service, then handler, then docs — so that each PR is independently reviewable and the dependency chain is explicit.

---

## Problem Statement

### Current State

`taskly-be` has working authentication but no domain logic. After logging in, a user receives a JWT but has nothing to do with it beyond calling `/api/me`. The app is incomplete as a task management API.

### Learning Goals

- Build a full resource lifecycle (create, list, get, update, delete) in Go
- Practice ownership verification at the service layer (not the database layer)
- Work with pointer fields (`*string`) in Go for partial update semantics
- Use `COALESCE` in SQL to handle partial updates without dynamic query building
- Extend an existing sentinel error set and error dispatch function

---

## Proposed Solution

Add a `tasks` table (migration `000002`), a `TaskRepository` interface with pgx implementation, a `TaskService` with ownership checks and status validation, and a `TaskHandler` wired into a new `/api/tasks` route group protected by the existing `AuthRequired` middleware.

```text
HTTP Request
     |
     v
  gin Router
     |
     +--- POST   /api/tasks       --> AuthRequired --> TaskHandler.Create --> TaskService --> TaskRepository --> PostgreSQL
     +--- GET    /api/tasks       --> AuthRequired --> TaskHandler.List   --> TaskService --> TaskRepository --> PostgreSQL
     +--- GET    /api/tasks/:id   --> AuthRequired --> TaskHandler.Get    --> TaskService --> TaskRepository --> PostgreSQL
     +--- PUT    /api/tasks/:id   --> AuthRequired --> TaskHandler.Update --> TaskService --> TaskRepository --> PostgreSQL
     +--- DELETE /api/tasks/:id   --> AuthRequired --> TaskHandler.Delete --> TaskService --> TaskRepository --> PostgreSQL
```

---

## Scope

### In-Scope

- SQL migration `000002_create_tasks` (up + down)
- `Task` struct added to `internal/repository/models.go`
- `TaskRepository` interface and `pgTaskRepository` pgx implementation in `internal/repository/task_repository.go`
- `TaskService` interface and `taskService` implementation in `internal/service/task_service.go`
- Two new sentinel errors in `internal/service/errors.go`: `ErrTaskNotFound`, `ErrForbidden`
- `TaskHandler` in `internal/handler/task_handler.go` with `respondTaskError` helper
- Five endpoints wired into the protected route group in `cmd/server/main.go`
- `GET /api/tasks` returning `[]` (empty JSON array) when the user has no tasks
- `DELETE /api/tasks/:id` returning `204 No Content`
- `updated_at` updated via `NOW()` in SQL on every `UPDATE`, not in Go code
- Ownership check: service verifies `task.UserID == authenticatedUserID`; returns `ErrForbidden` if not
- Status enum enforced at both the database level (`CHECK` constraint) and service level validation
- Gherkin feature file `specs/taskly-be/tasks.feature`

### Out-of-Scope

- Task categories or labels
- Task priority levels
- Task due dates
- Pagination or filtering on `GET /api/tasks`
- Sorting options on `GET /api/tasks`
- Task comments or subtasks
- Soft delete (tasks are hard-deleted)
- Batch create, update, or delete
- Admin endpoints (viewing other users' tasks)
- Swagger / OpenAPI documentation generation
- Frontend integration (this plan is backend-only)
- Rate limiting on task endpoints
- Full-text search on task titles

---

## Dependencies

- Auth plan fully implemented and merged (`plans/done/2026-06-20__taskly-be-go-auth/`)
- `apps/taskly-be/internal/db/migrations/000001_create_users.up.sql` already applied to the local `taskly` database
- Go toolchain already installed (verified by auth plan)
- All existing dependencies in `go.mod` already present — no new Go dependencies required

---

## Success Criteria

- `POST /api/tasks` returns `201 Created` with a task object for a valid authenticated request
- `GET /api/tasks` returns `200 OK` with an array (even if empty) for any authenticated user
- `GET /api/tasks/:id` returns `200 OK` for the task owner and `403 Forbidden` for any other authenticated user
- `PUT /api/tasks/:id` updates only the provided fields, leaves others unchanged, returns `200 OK`
- `DELETE /api/tasks/:id` returns `204 No Content` and the task no longer appears in `GET /api/tasks`
- Unauthenticated requests to any task endpoint return `401 Unauthorized`
- `go build ./...` exits 0 from `apps/taskly-be/`
- `go vet ./...` exits 0 from `apps/taskly-be/`
- Gherkin feature file covers all five endpoints including ownership and error scenarios

---

## PR Strategy

Each checklist phase is one PR. Five PRs total:

| PR  | Branch                           | Scope                                                        |
| --- | -------------------------------- | ------------------------------------------------------------ |
| 1   | `feat/taskly-be-tasks-migration` | `000002_create_tasks` SQL migration (up + down)              |
| 2   | `feat/taskly-be-task-repository` | `Task` struct, `TaskRepository` interface + pgx impl         |
| 3   | `feat/taskly-be-task-service`    | `TaskService` interface + impl, two new sentinel errors      |
| 4   | `feat/taskly-be-task-handlers`   | `TaskHandler`, `respondTaskError`, route wiring in `main.go` |
| 5   | `docs/taskly-be-task-crud-specs` | Gherkin `tasks.feature`                                      |

---

## References

- `plans/done/2026-06-20__taskly-be-go-auth/` — auth plan (structural reference for this plan)
- `apps/taskly-be/internal/repository/user_repository.go` — repository pattern to mirror
- `apps/taskly-be/internal/service/auth_service.go` — service pattern to mirror
- `apps/taskly-be/internal/handler/auth_handler.go` — handler pattern to mirror
- `apps/taskly-be/cmd/server/main.go` — wiring point for new dependency chain
- `apps/taskly-be/internal/service/errors.go` — file to extend with new sentinels
- `specs/taskly-be/auth.feature` — Gherkin style reference
- `governance/conventions/development.md` — branch naming and PR format
