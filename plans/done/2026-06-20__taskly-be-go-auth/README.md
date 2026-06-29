# Taskly Backend — Go Auth API

**Status**: 🏗️ In Progress
**Created**: June 20, 2026
**Priority**: P1-High
**Type**: Feature / Learning Project

---

## Overview

`taskly-be` is a Go backend application that lives at `apps/taskly-be/` in the IKP-Labs monorepo. Its sole purpose at this stage is to build a working REST API with user authentication from scratch using Go, giving the developer hands-on experience with Go idioms, HTTP routing, JWT handling, and PostgreSQL integration.

The application exposes three endpoints: user registration, user login (returning a JWT), and a protected profile route that requires a valid token. There is no frontend. There is no task management logic yet. The focus is entirely on getting authentication right in Go.

This plan is structured so that each phase corresponds to one small pull request. This keeps each PR reviewable in under 10 minutes, makes individual pieces easy to revert, and produces a clean commit history that demonstrates progressive, deliberate learning.

---

## Problem Statement

### Learning Gaps to Close

- No prior Go backend built in this monorepo
- No Go application scaffolded in the Nx workspace yet
- Need hands-on practice with Go module setup, folder layout conventions, and the standard library HTTP package before adding any framework
- Need practical understanding of PostgreSQL integration in Go (no ORM — raw `database/sql` with `pgx` driver)
- Need to understand JWT generation and verification in Go without magic wrapper libraries

### Developer Goals

- "I want to understand how Go handles HTTP routing, not just copy a framework tutorial" — learning by building with minimal abstractions
- "I want each PR to be small enough that a reviewer (or future me) can fully understand it in one sitting"
- "I want the GitHub activity to reflect real incremental progress, not one giant commit"

---

## Proposed Solution

A minimal Go REST API using `gin` as the HTTP router (thin enough to remain educational while removing boilerplate that obscures concepts), `golang-jwt/jwt/v5` for token handling, and `jackc/pgx/v5` as the PostgreSQL driver. Configuration is loaded from environment variables via `joho/godotenv`. Database migrations are managed with `golang-migrate/migrate/v4`.

```text
HTTP Request
     |
     v
  gin Router
     |
     +--- POST /api/auth/register --> RegisterHandler --> UserService --> UserRepository --> PostgreSQL
     |
     +--- POST /api/auth/login    --> LoginHandler    --> UserService --> UserRepository --> PostgreSQL
     |                                                         |
     |                                                   JWT generation
     |
     +--- GET  /api/me            --> AuthMiddleware (JWT verify) --> MeHandler --> UserRepository --> PostgreSQL
```

---

## Scope

### In-Scope

- Go module initialization (`go mod init`) and Nx project registration
- Folder structure following Go community conventions (`cmd/`, `internal/`)
- Environment variable loading with `joho/godotenv`
- Config struct with typed fields for server port, DB DSN, JWT secret
- PostgreSQL connection pool setup with health check
- Migration runner using `golang-migrate` with SQL migration files
- `users` table DDL migration (id, email, password_hash, created_at)
- `POST /api/auth/register` endpoint with email uniqueness check and bcrypt password hashing
- `POST /api/auth/login` endpoint with credential verification and JWT issuance
- JWT middleware that extracts and validates the Bearer token from `Authorization` header
- `GET /api/me` protected endpoint returning the authenticated user's id and email
- Gherkin feature file for auth scenarios in `specs/`
- README at `apps/taskly-be/README.md`

### Out-of-Scope

- Task management (CRUD for tasks) — that is the next plan
- Frontend or any UI — this plan is backend-only
- Refresh tokens or token revocation
- Email verification on registration
- Password reset flow
- Role-based access control
- Rate limiting
- Docker or docker-compose setup
- Deployment configuration
- Nx executor/target configuration beyond `project.json` registration
- Integration with the existing `kameravue-be` or `kameravue-fe` apps
- Redis or any caching layer
- Swagger / OpenAPI documentation generation

---

## Dependencies

- Go 1.22+ installed locally (`go version` to verify)
- PostgreSQL running locally (same instance used by `kameravue-be`)
- A dedicated database created: `CREATE DATABASE taskly;`
- Nx workspace version already present in `nx.json`
- `apps/` directory exists (confirmed: `apps/kameravue-be/`, `apps/kameravue-fe/`, etc.)

---

## Success Criteria

- `POST /api/auth/register` returns `201 Created` with a new user when given a valid email and password
- `POST /api/auth/login` returns `200 OK` with a signed JWT when credentials are correct
- `GET /api/me` returns `200 OK` with `{id, email}` when a valid JWT is supplied in the `Authorization` header
- `GET /api/me` returns `401 Unauthorized` when the token is missing or invalid
- All migrations run cleanly on a fresh `taskly` database
- `go build ./...` produces zero errors
- `go vet ./...` produces zero warnings
- The Gherkin feature file in `specs/` covers register, login, and protected route scenarios

---

## PR Strategy

Each checklist phase is one PR. Nine PRs total:

| PR  | Branch                           | Scope                                                |
| --- | -------------------------------- | ---------------------------------------------------- |
| 1   | `feat/taskly-be-scaffold`        | go mod, folder structure, gitignore, Nx project.json |
| 2   | `feat/taskly-be-config`          | env loading, config struct, server entrypoint        |
| 3   | `feat/taskly-be-db`              | PostgreSQL connection, migrate runner                |
| 4   | `feat/taskly-be-users-migration` | users table DDL migration                            |
| 5   | `feat/taskly-be-register`        | POST /api/auth/register                              |
| 6   | `feat/taskly-be-login`           | POST /api/auth/login + JWT generation                |
| 7   | `feat/taskly-be-jwt-middleware`  | JWT auth middleware                                  |
| 8   | `feat/taskly-be-me`              | GET /api/me protected endpoint                       |
| 9   | `docs/taskly-be-readme-gherkin`  | README + Gherkin specs                               |

---

## References

- [Go standard library net/http](https://pkg.go.dev/net/http)
- [gin-gonic/gin](https://github.com/gin-gonic/gin)
- [golang-jwt/jwt/v5](https://github.com/golang-jwt/jwt)
- [jackc/pgx/v5](https://github.com/jackc/pgx)
- [golang-migrate/migrate](https://github.com/golang-migrate/migrate)
- [joho/godotenv](https://github.com/joho/godotenv)
- [Nx project.json reference](https://nx.dev/reference/project-configuration)
- `governance/conventions/development.md` — branch naming and PR format
- `plans/done/2024-12-10__photo-likes-feature/checklist.md` — atomic PR strategy reference
