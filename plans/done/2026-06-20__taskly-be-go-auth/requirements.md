# Taskly Backend — Requirements

---

## Functional Requirements

### FR-1: Project Scaffold

**Priority**: P0-Critical

**Description**:
The `apps/taskly-be/` directory must exist as a valid Go module registered in the Nx workspace. This is the foundation every other requirement depends on. Without it, no Go code can be built or run.

**User Story**:

```text
As a developer working in the IKP-Labs monorepo
I want a Go application scaffold at apps/taskly-be/
So that I can run Go commands and Nx targets from the workspace root
```

**Acceptance Criteria**:

- Given the monorepo root, when `go build ./apps/taskly-be/...` is run, then the command exits without error
- Given the monorepo root, when `cat apps/taskly-be/go.mod`, then the module name is `github.com/isnendyankp/taskly-be`
- Given `apps/taskly-be/project.json`, when `nx show project taskly-be`, then Nx recognizes the project

**Edge Cases**:

- `go.sum` must be committed alongside `go.mod`
- `.gitignore` inside `apps/taskly-be/` must exclude the compiled binary (e.g., `taskly-be`, `*.exe`)

---

### FR-2: Environment Configuration

**Priority**: P0-Critical

**Description**:
The application must load runtime configuration from a `.env` file (development) or real environment variables (CI/production). All configuration is typed via a `Config` struct. The application must refuse to start if required variables are missing.

**User Story**:

```text
As a developer running the app locally
I want to configure the server port, database DSN, and JWT secret in a .env file
So that I never hard-code secrets in source code
```

**Acceptance Criteria**:

- Given a `.env` file with `SERVER_PORT`, `DATABASE_URL`, and `JWT_SECRET` defined, when the application starts, then it reads all three values without error
- Given a missing `JWT_SECRET`, when the application starts, then it exits with a descriptive error message before binding to any port
- Given `apps/taskly-be/.env.example`, when a new developer clones the repo, then they can copy `.env.example` to `.env` and have all required keys with placeholder values

**Edge Cases**:

- `.env` must be listed in `.gitignore` inside `apps/taskly-be/`
- `.env.example` must be committed and contain no real secrets

**Required Environment Variables**:

| Variable       | Example Value                                                | Description                         |
| -------------- | ------------------------------------------------------------ | ----------------------------------- |
| `SERVER_PORT`  | `8082`                                                       | TCP port the HTTP server listens on |
| `DATABASE_URL` | `postgres://user:pass@localhost:5432/taskly?sslmode=disable` | PostgreSQL DSN                      |
| `JWT_SECRET`   | `change-me-in-production`                                    | HMAC secret for signing JWTs        |

---

### FR-3: Database Connection

**Priority**: P0-Critical

**Description**:
The application must establish a PostgreSQL connection pool on startup and verify connectivity with a ping. Migration files must be applied automatically on startup using `golang-migrate`.

**User Story**:

```text
As a developer starting the app for the first time
I want the database schema to be created automatically
So that I don't need to run SQL scripts manually before testing
```

**Acceptance Criteria**:

- Given a running PostgreSQL instance with a `taskly` database, when the application starts, then the connection pool is established and a ping succeeds within 5 seconds
- Given pending migration files in `apps/taskly-be/internal/db/migrations/`, when the application starts, then all migrations are applied in version order
- Given migrations have already been applied, when the application restarts, then it starts without error (idempotent)

**Edge Cases**:

- If PostgreSQL is unreachable at startup, the application must log the error and exit with a non-zero status code
- Migrations must never be applied in parallel (migration runner must acquire a lock)

---

### FR-4: User Registration

**Priority**: P0-Critical

**Description**:
`POST /api/auth/register` accepts an email and plain-text password, validates them, hashes the password with bcrypt, stores the user, and returns the new user's id and email. It rejects duplicate emails.

**User Story**:

```text
As a new user
I want to create an account with my email and a password
So that I can log in and access protected features
```

**Acceptance Criteria**:

- Given a valid email and password of at least 8 characters, when `POST /api/auth/register` is called, then `201 Created` is returned with `{"id": <number>, "email": "<email>"}`
- Given an email that is already registered, when `POST /api/auth/register` is called with the same email, then `409 Conflict` is returned with `{"error": "email already registered"}`
- Given a request body missing the `email` field, when `POST /api/auth/register` is called, then `400 Bad Request` is returned with `{"error": "email is required"}`
- Given a password shorter than 8 characters, when `POST /api/auth/register` is called, then `400 Bad Request` is returned with `{"error": "password must be at least 8 characters"}`
- Given any valid registration, when inspecting the database, then the stored `password_hash` is a bcrypt hash, never the plain-text password

**Edge Cases**:

- Email must be lowercased and trimmed before storage
- The response body must never include the `password_hash` field
- An invalid email format (no `@`) must return `400 Bad Request`

**Example**:

Request:

```json
POST /api/auth/register
{
  "email": "alice@example.com",
  "password": "securepass123"
}
```

Response (201):

```json
{
  "id": 1,
  "email": "alice@example.com"
}
```

---

### FR-5: User Login

**Priority**: P0-Critical

**Description**:
`POST /api/auth/login` accepts an email and password, verifies the credentials against the stored bcrypt hash, and returns a signed JWT on success. The JWT contains the user's id as the `sub` claim and has a 24-hour expiry.

**User Story**:

```text
As a registered user
I want to log in with my email and password
So that I receive a token I can use to access protected routes
```

**Acceptance Criteria**:

- Given a registered user's correct email and password, when `POST /api/auth/login` is called, then `200 OK` is returned with `{"token": "<jwt>"}`
- Given a registered email but wrong password, when `POST /api/auth/login` is called, then `401 Unauthorized` is returned with `{"error": "invalid credentials"}`
- Given an unregistered email, when `POST /api/auth/login` is called, then `401 Unauthorized` is returned with `{"error": "invalid credentials"}` (same message — no user enumeration)
- Given the returned JWT, when decoded, then the `sub` claim equals the user's numeric id as a string, and `exp` is 24 hours from issuance

**Edge Cases**:

- The error response for wrong password and non-existent email must be identical to prevent user enumeration
- The JWT must be signed with `HS256`

**Example**:

Request:

```json
POST /api/auth/login
{
  "email": "alice@example.com",
  "password": "securepass123"
}
```

Response (200):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### FR-6: JWT Authentication Middleware

**Priority**: P0-Critical

**Description**:
A gin middleware function validates the `Authorization: Bearer <token>` header on every protected route. If the token is valid, the middleware stores the user id in the gin context and calls `Next()`. If invalid or missing, it returns `401 Unauthorized` and aborts.

**User Story**:

```text
As a developer wiring up protected routes
I want a reusable middleware that verifies JWTs
So that I can protect any route with a single line of code
```

**Acceptance Criteria**:

- Given a valid JWT in the `Authorization: Bearer` header, when a protected route is requested, then the middleware calls `Next()` and the handler receives the user id via `c.Get("userID")`
- Given a missing `Authorization` header, when a protected route is requested, then `401 Unauthorized` is returned with `{"error": "authorization header required"}`
- Given a JWT signed with the wrong secret, when a protected route is requested, then `401 Unauthorized` is returned with `{"error": "invalid token"}`
- Given an expired JWT, when a protected route is requested, then `401 Unauthorized` is returned with `{"error": "token expired"}`

**Edge Cases**:

- A token prefixed with something other than `Bearer` must be rejected
- The middleware must not leak signing key information in error messages

---

### FR-7: Protected Profile Route

**Priority**: P0-Critical

**Description**:
`GET /api/me` is a protected route that returns the authenticated user's id and email. It relies entirely on the JWT middleware for authentication; the handler only reads the user id from the gin context and fetches the user from the database.

**User Story**:

```text
As an authenticated user
I want to call GET /api/me with my token
So that I can retrieve my own account information
```

**Acceptance Criteria**:

- Given a valid JWT, when `GET /api/me` is called, then `200 OK` is returned with `{"id": <number>, "email": "<email>"}`
- Given no `Authorization` header, when `GET /api/me` is called, then `401 Unauthorized` is returned (handled by middleware, not the handler)
- Given a valid token for a user id that no longer exists in the database, when `GET /api/me` is called, then `404 Not Found` is returned with `{"error": "user not found"}`

**Example**:

Request:

```http
GET /api/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response (200):

```json
{
  "id": 1,
  "email": "alice@example.com"
}
```

---

## Technical Requirements

### TR-1: Language and Runtime

**Priority**: P0-Critical

- Go 1.22 or later (use `go 1.22` directive in `go.mod`)
- No CGO required — pure Go dependencies only
- Single binary output from `go build`

### TR-2: HTTP Framework

**Priority**: P1-High

- Use `github.com/gin-gonic/gin` v1.10+
- No additional framework layers on top of gin
- Gin's built-in JSON binding for request bodies (`c.ShouldBindJSON`)

### TR-3: Database Driver

**Priority**: P0-Critical

- Use `github.com/jackc/pgx/v5` with the `stdlib` adapter (`pgxpool` is acceptable)
- No ORM — raw SQL queries only, using `database/sql` interface
- Connection pool with sensible defaults: `MaxConns: 5`, `MinConns: 1`

### TR-4: Password Hashing

**Priority**: P0-Critical

- Use `golang.org/x/crypto/bcrypt` with cost factor 12
- Never log or return password hashes

### TR-5: JWT

**Priority**: P0-Critical

- Use `github.com/golang-jwt/jwt/v5`
- Algorithm: `HS256`
- Claims: `sub` (user id as string), `exp` (Unix timestamp), `iat` (Unix timestamp)

### TR-6: Migrations

**Priority**: P0-Critical

- Use `github.com/golang-migrate/migrate/v4` with the `postgres` and `file` drivers
- Migration files in `apps/taskly-be/internal/db/migrations/`
- File naming: `000001_create_users.up.sql` / `000001_create_users.down.sql`

### TR-7: Build and Lint

**Priority**: P1-High

- `go build ./...` must succeed with zero errors
- `go vet ./...` must produce zero warnings
- `gofmt -l .` must produce no output (all files formatted)

---

## Non-Functional Requirements

### NFR-1: Security

- Passwords stored as bcrypt hashes only (cost 12)
- JWT secret loaded from environment, never hard-coded
- Login errors return identical messages for wrong password and unknown email
- No stack traces exposed in HTTP responses

### NFR-2: Code Structure

- No business logic in handler functions — handlers delegate to a service layer
- No SQL in service functions — services delegate to a repository layer
- All layers communicate via Go interfaces to allow future testing
- `internal/` package used for all non-entrypoint code (prevents import from outside the module)

### NFR-3: Error Handling

- All errors logged to stdout with context (not silently swallowed)
- HTTP handlers always return JSON error bodies, never plain text
- `go` error values are never returned as raw strings to the client

### NFR-4: Nx Integration

- `apps/taskly-be/project.json` must define at minimum a `serve` target that runs `go run ./cmd/server/`
- The project must appear in `nx show projects` output
