# Taskly Backend — Implementation Checklist

Each phase is one PR. Branch names follow `governance/conventions/development.md`.

**Status Legend**: `[ ]` Not started | `[x]` Complete

---

## PR 1 — Project Scaffold

**Branch**: `feat/taskly-be-scaffold`
**Goal**: Establish the Go module and folder skeleton so the project compiles and is visible to Nx.

### Task 1.1: Initialize Go module

- [ ] Create directory `apps/taskly-be/`
- [ ] Run `go mod init github.com/isnendyankp/taskly-be` from inside `apps/taskly-be/`
- [ ] Verify `apps/taskly-be/go.mod` exists with the correct module name and `go 1.22` directive

### Task 1.2: Create folder skeleton

- [ ] Create `apps/taskly-be/cmd/server/` (will hold `main.go`)
- [ ] Create `apps/taskly-be/internal/config/`
- [ ] Create `apps/taskly-be/internal/db/migrations/`
- [ ] Create `apps/taskly-be/internal/repository/`
- [ ] Create `apps/taskly-be/internal/service/`
- [ ] Create `apps/taskly-be/internal/handler/`
- [ ] Create `apps/taskly-be/internal/middleware/`

### Task 1.3: Write minimal entrypoint

- [ ] Create `apps/taskly-be/cmd/server/main.go` with a `main()` function that prints `"taskly-be starting..."` and returns
- [ ] Verify `go build ./...` exits 0 from `apps/taskly-be/`

### Task 1.4: Add .gitignore

- [ ] Create `apps/taskly-be/.gitignore` with the following entries:
  - `taskly-be` (compiled binary name)
  - `*.exe`
  - `.env`
  - `dist/`
  - `tmp/`

### Task 1.5: Register with Nx

- [ ] Create `apps/taskly-be/project.json` with `serve`, `build`, and `lint` targets as specified in `technical-design.md`
- [ ] Run `nx show project taskly-be` from the monorepo root and confirm the project is listed

### Task 1.6: Commit and open PR

- [ ] Stage files: `go.mod`, `go.sum` (if present), `cmd/server/main.go`, `.gitignore`, `project.json`, all empty directory placeholders (use a `.gitkeep` in each empty dir)
- [ ] Commit message: `feat(taskly-be): scaffold go module and nx project`
- [ ] Push branch `feat/taskly-be-scaffold` and open PR

**Acceptance Criteria**:

- `go build ./...` exits 0 from `apps/taskly-be/`
- `nx show project taskly-be` lists the project without error
- `.env` is listed in `.gitignore`
- No business logic exists yet — just the skeleton

---

## PR 2 — Config and Environment Loading

**Branch**: `feat/taskly-be-config`
**Goal**: Load typed configuration from environment variables; the server refuses to start if required vars are missing.

### Task 2.1: Add godotenv dependency

- [ ] From `apps/taskly-be/`, run `go get github.com/joho/godotenv`
- [ ] Verify `go.mod` and `go.sum` are updated

### Task 2.2: Implement Config struct and Load()

- [ ] Create `apps/taskly-be/internal/config/config.go`
- [ ] Define `Config` struct with fields: `ServerPort string`, `DatabaseURL string`, `JWTSecret string`
- [ ] Implement `Load() (*Config, error)`:
  - Call `godotenv.Load()` — ignore "file not found" error (env vars may come from the shell)
  - Read `SERVER_PORT`, `DATABASE_URL`, `JWT_SECRET` via `os.Getenv`
  - Return an error listing any missing required variables
- [ ] Verify `go vet ./...` exits 0

### Task 2.3: Create .env.example

- [ ] Create `apps/taskly-be/.env.example` with placeholder values:

  ```env
  SERVER_PORT=8082
  DATABASE_URL=postgres://postgres:postgres@localhost:5432/taskly?sslmode=disable
  JWT_SECRET=change-me-in-production
  ```

### Task 2.4: Wire config into main.go

- [ ] Update `apps/taskly-be/cmd/server/main.go`:
  - Call `config.Load()`
  - On error, `log.Fatalf("config error: %v", err)` and exit
  - On success, `log.Printf("server will listen on :%s", cfg.ServerPort)`
- [ ] Create your own `.env` (copy from `.env.example`, set real values) and verify the server prints the port then exits cleanly

### Task 2.5: Commit and open PR

- [ ] Stage: `internal/config/config.go`, updated `main.go`, `go.mod`, `go.sum`, `.env.example`
- [ ] Commit message: `feat(taskly-be): add typed config loading from env`
- [ ] Push branch `feat/taskly-be-config` and open PR

**Acceptance Criteria**:

- Running without any env vars set causes a fatal error with a descriptive message
- Running with all three vars set prints the port and exits cleanly
- `.env.example` is committed; `.env` is not

---

## PR 3 — Database Connection and Migration Runner

**Branch**: `feat/taskly-be-db`
**Goal**: Establish a PostgreSQL connection pool on startup and run all pending migrations automatically.

### Task 3.1: Add database dependencies

- [ ] From `apps/taskly-be/`, run:

  ```bash
  go get github.com/jackc/pgx/v5
  go get github.com/jackc/pgx/v5/stdlib
  go get github.com/golang-migrate/migrate/v4
  go get github.com/golang-migrate/migrate/v4/database/postgres
  go get github.com/golang-migrate/migrate/v4/source/file
  ```

- [ ] Verify `go.mod` lists all new dependencies

### Task 3.2: Implement db.Connect()

- [ ] Create `apps/taskly-be/internal/db/db.go`
- [ ] Implement `Connect(databaseURL string) (*sql.DB, error)`:
  - Use `pgx/stdlib.OpenDB(pgx.ConnConfig{...})` or `sql.Open("pgx", databaseURL)`
  - Call `db.Ping()` to verify connectivity
  - Set pool config: `db.SetMaxOpenConns(5)`, `db.SetMaxIdleConns(1)`
  - Return the `*sql.DB` handle

### Task 3.3: Implement db.Migrate()

- [ ] Create `apps/taskly-be/internal/db/migrate.go`
- [ ] Implement `Migrate(db *sql.DB, migrationsPath string) error`:
  - Use `migrate.NewWithDatabaseInstance(source, "postgres", driver)`
  - Call `m.Up()` — treat `migrate.ErrNoChange` as success (not an error)
  - Return any other error

### Task 3.4: Wire DB into main.go

- [ ] Update `apps/taskly-be/cmd/server/main.go`:
  - Call `db.Connect(cfg.DatabaseURL)` after loading config
  - On error, `log.Fatalf`
  - Call `db.Migrate(conn, "internal/db/migrations")` (path relative to `apps/taskly-be/`)
  - On error, `log.Fatalf`
  - Log `"database connected and migrations applied"`
- [ ] Start the app against your local `taskly` database and confirm the log line appears

### Task 3.5: Commit and open PR

- [ ] Stage: `internal/db/db.go`, `internal/db/migrate.go`, updated `main.go`, `go.mod`, `go.sum`
- [ ] Commit message: `feat(taskly-be): add postgresql connection pool and migrate runner`
- [ ] Push branch `feat/taskly-be-db` and open PR

**Acceptance Criteria**:

- `go build ./...` exits 0
- App starts against a running `taskly` database and logs success
- App exits with a fatal error when PostgreSQL is unreachable
- No migration files exist yet — the runner handles "no migrations found" gracefully (or the `migrations/` directory exists empty and the runner is a no-op)

---

## PR 4 — Users Table Migration

**Branch**: `feat/taskly-be-users-migration`
**Goal**: Create the `users` table via a versioned SQL migration file.

### Task 4.1: Write migration SQL

- [ ] Create `apps/taskly-be/internal/db/migrations/000001_create_users.up.sql`:

  ```sql
  CREATE TABLE IF NOT EXISTS users (
      id            BIGSERIAL    PRIMARY KEY,
      email         VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(72)  NOT NULL,
      created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
  ```

- [ ] Create `apps/taskly-be/internal/db/migrations/000001_create_users.down.sql`:

  ```sql
  DROP TABLE IF EXISTS users;
  ```

### Task 4.2: Verify migration runs

- [ ] Start the app against your local `taskly` database
- [ ] Confirm the migration log shows version 1 applied
- [ ] Connect to PostgreSQL and confirm `\d users` shows the correct schema:
  - `id BIGSERIAL PRIMARY KEY`
  - `email VARCHAR(255) UNIQUE NOT NULL`
  - `password_hash VARCHAR(72) NOT NULL`
  - `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
  - Index on `email`

### Task 4.3: Verify idempotency

- [ ] Restart the app a second time
- [ ] Confirm the migration log shows "no change" (not an error)

### Task 4.4: Commit and open PR

- [ ] Stage: both migration SQL files
- [ ] Commit message: `feat(taskly-be): add users table migration`
- [ ] Push branch `feat/taskly-be-users-migration` and open PR

**Acceptance Criteria**:

- `users` table exists in the `taskly` database after first app startup
- Second startup logs "no change" and continues normally
- `down.sql` exists and would drop the table cleanly

---

## PR 5 — Register Endpoint

**Branch**: `feat/taskly-be-register`
**Goal**: Implement `POST /api/auth/register` end-to-end: repository, service, handler, and gin router.

### Task 5.1: Add gin and bcrypt dependencies

- [ ] From `apps/taskly-be/`, run:

  ```bash
  go get github.com/gin-gonic/gin
  go get golang.org/x/crypto
  ```

### Task 5.2: Implement UserRepository

- [ ] Create `apps/taskly-be/internal/repository/models.go` with the `User` struct
- [ ] Create `apps/taskly-be/internal/repository/user_repository.go` with the `UserRepository` interface and `pgUserRepository` struct
- [ ] Implement `CreateUser(ctx, email, passwordHash string) (*User, error)`:
  - SQL: `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at`
  - Detect unique violation (pgx error code `23505`) and return a typed sentinel error `ErrEmailTaken`
- [ ] Implement `FindByEmail(ctx, email string) (*User, error)` and `FindByID(ctx, id int64) (*User, error)` as stubs (returning `ErrUserNotFound`) — these will be used in later PRs

### Task 5.3: Implement AuthService.Register()

- [ ] Create `apps/taskly-be/internal/service/errors.go` with sentinel errors:

  ```go
  var ErrEmailTaken        = errors.New("email already taken")
  var ErrInvalidCredentials = errors.New("invalid credentials")
  var ErrUserNotFound      = errors.New("user not found")
  ```

- [ ] Create `apps/taskly-be/internal/service/auth_service.go` with the `AuthService` interface
- [ ] Implement `Register(ctx, RegisterInput) (*repository.User, error)`:
  - `strings.ToLower(strings.TrimSpace(input.Email))`
  - `bcrypt.GenerateFromPassword([]byte(input.Password), 12)`
  - Call `userRepo.CreateUser(...)` and propagate errors
  - Wrap `repository.ErrEmailTaken` → `service.ErrEmailTaken`

### Task 5.4: Implement RegisterHandler

- [ ] Create `apps/taskly-be/internal/handler/auth_handler.go` with:
  - `registerRequest` struct with `binding:"required,email"` and `binding:"required,min=8"` tags
  - `registerResponse` struct with `ID` and `Email`
  - `respondError(c *gin.Context, err error)` helper function
  - `RegisterHandler(c *gin.Context)` method

### Task 5.5: Wire router in main.go

- [ ] Update `main.go` to:
  - Instantiate `userRepo`, `authService`, `authHandler`
  - Create a gin router with `gin.Default()`
  - Register `POST /api/auth/register` on a `/api/auth` group
  - Call `router.Run(":" + cfg.ServerPort)`

### Task 5.6: Manual verification

- [ ] Start the server: `go run ./cmd/server/` from `apps/taskly-be/`
- [ ] Send a registration request:

  ```bash
  curl -s -X POST http://localhost:8082/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"securepass"}' | jq .
  ```

  Expected: `{"id": 1, "email": "test@example.com"}`

- [ ] Send the same request again: Expected `409` with `{"error": "email already registered"}`
- [ ] Send with a short password: Expected `400`
- [ ] Send with a missing email: Expected `400`

### Task 5.7: Commit and open PR

- [ ] Stage: `internal/repository/`, `internal/service/`, `internal/handler/auth_handler.go`, updated `main.go`, `go.mod`, `go.sum`
- [ ] Commit message: `feat(taskly-be): add POST /api/auth/register endpoint`
- [ ] Push branch `feat/taskly-be-register` and open PR

**Acceptance Criteria**:

- `curl` test from Task 5.6 passes all four scenarios
- Stored `password_hash` in the database is a bcrypt string (starts with `$2a$`)
- Response never includes `password_hash`
- `go vet ./...` exits 0

---

## PR 6 — Login Endpoint and JWT Generation

**Branch**: `feat/taskly-be-login`
**Goal**: Implement `POST /api/auth/login` returning a signed JWT.

### Task 6.1: Add JWT dependency

- [ ] From `apps/taskly-be/`, run `go get github.com/golang-jwt/jwt/v5`

### Task 6.2: Complete UserRepository.FindByEmail()

- [ ] Update `FindByEmail` stub in `user_repository.go` with real SQL:

  ```sql
  SELECT id, email, password_hash, created_at FROM users WHERE email = $1
  ```

- [ ] Return `ErrUserNotFound` when `sql.ErrNoRows`

### Task 6.3: Implement AuthService.Login()

- [ ] Add `jwtSecret []byte` field to `authService` struct
- [ ] Update `NewAuthService` to accept `jwtSecret string` and store it
- [ ] Implement `Login(ctx, LoginInput) (string, error)`:
  - Call `userRepo.FindByEmail` — if `ErrUserNotFound`, return `ErrInvalidCredentials` (not the real error)
  - Call `bcrypt.CompareHashAndPassword` — if mismatch, return `ErrInvalidCredentials`
  - Build `jwt.RegisteredClaims{Subject: strconv.FormatInt(user.ID, 10), ExpiresAt: ...24h..., IssuedAt: ...now...}`
  - Sign with `jwt.SigningMethodHS256` and `s.jwtSecret`
  - Return the signed token string

### Task 6.4: Implement LoginHandler

- [ ] Add `loginRequest`, `loginResponse` structs to `auth_handler.go`
- [ ] Implement `LoginHandler(c *gin.Context)`:
  - Bind request
  - Call `authService.Login`
  - Map `ErrInvalidCredentials` → 401
  - Respond 200 with `loginResponse{Token: token}`

### Task 6.5: Register route in main.go

- [ ] Add `POST /api/auth/login` to the `/api/auth` group

### Task 6.6: Manual verification

- [ ] Register a user if not already done
- [ ] Send a login request:

  ```bash
  curl -s -X POST http://localhost:8082/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"securepass"}' | jq .
  ```

  Expected: `{"token": "eyJ..."}`

- [ ] Send with wrong password: Expected `401` with `{"error": "invalid credentials"}`
- [ ] Send with unknown email: Expected `401` with `{"error": "invalid credentials"}` (same message)
- [ ] Decode the JWT at [jwt.io](https://jwt.io) and verify `sub` is the user id and `exp` is 24 hours from now

### Task 6.7: Commit and open PR

- [ ] Stage: updated `user_repository.go`, updated `auth_service.go`, updated `auth_handler.go`, updated `main.go`, `go.mod`, `go.sum`
- [ ] Commit message: `feat(taskly-be): add POST /api/auth/login with jwt generation`
- [ ] Push branch `feat/taskly-be-login` and open PR

**Acceptance Criteria**:

- Valid credentials return a JWT
- Wrong password and unknown email both return `401` with the same error message
- Decoded JWT contains `sub` equal to the user's numeric id
- `go vet ./...` exits 0

---

## PR 7 — JWT Authentication Middleware

**Branch**: `feat/taskly-be-jwt-middleware`
**Goal**: Implement a reusable gin middleware that validates Bearer tokens and injects the user id into the context.

### Task 7.1: Implement AuthRequired middleware

- [ ] Create `apps/taskly-be/internal/middleware/auth_middleware.go`
- [ ] Implement `AuthRequired(jwtSecret string) gin.HandlerFunc`:
  - Read `Authorization` header: if empty, `c.AbortWithStatusJSON(401, ...)`
  - Check prefix `"Bearer "`: if missing, `c.AbortWithStatusJSON(401, ...)`
  - Extract token string (after `"Bearer "`)
  - Parse with `jwt.ParseWithClaims(tokenStr, &jwt.RegisteredClaims{}, func(t *jwt.Token) (interface{}, error) { ... })`
  - Verify signing method is `HS256` inside the key function — reject otherwise
  - On parse error: check `errors.Is(err, jwt.ErrTokenExpired)` → `"token expired"`, else → `"invalid token"`
  - Extract `claims.Subject` → parse to `int64` userID
  - `c.Set("userID", userID)`
  - `c.Next()`

### Task 7.2: Write a smoke test manually

- [ ] Apply the middleware to a temporary test route in `main.go`:

  ```go
  protected.GET("/ping", func(c *gin.Context) {
      userID, _ := c.Get("userID")
      c.JSON(200, gin.H{"userID": userID})
  })
  ```

- [ ] Test with no header: Expected `401`
- [ ] Test with a valid token: Expected `200` with the correct user id
- [ ] Test with an expired token (manually craft one or use a 1-second expiry temporarily): Expected `401` with `"token expired"`
- [ ] Remove the temporary test route before committing

### Task 7.3: Commit and open PR

- [ ] Stage: `internal/middleware/auth_middleware.go`
- [ ] Commit message: `feat(taskly-be): add jwt auth middleware`
- [ ] Push branch `feat/taskly-be-jwt-middleware` and open PR

**Acceptance Criteria**:

- Valid token: middleware calls `Next()` and `c.Get("userID")` returns the correct int64
- Missing header: `401` with `{"error": "authorization header required"}`
- Invalid signature: `401` with `{"error": "invalid token"}`
- Expired token: `401` with `{"error": "token expired"}`
- `go vet ./...` exits 0

---

## PR 8 — Protected /api/me Endpoint

**Branch**: `feat/taskly-be-me`
**Goal**: Implement `GET /api/me` — a protected route that returns the authenticated user's profile.

### Task 8.1: Complete UserRepository.FindByID()

- [ ] Update `FindByID` stub in `user_repository.go` with real SQL:

  ```sql
  SELECT id, email, created_at FROM users WHERE id = $1
  ```

- [ ] Return `ErrUserNotFound` when `sql.ErrNoRows`

### Task 8.2: Implement AuthService.GetUserByID()

- [ ] Implement `GetUserByID(ctx context.Context, id int64) (*repository.User, error)`:
  - Call `userRepo.FindByID(ctx, id)`
  - Propagate `ErrUserNotFound` directly
  - Wrap unexpected errors

### Task 8.3: Implement MeHandler

- [ ] Add `meResponse` struct to `auth_handler.go`
- [ ] Implement `MeHandler(c *gin.Context)`:
  - Read `userID` from context: `userID, _ := c.Get("userID")`
  - Assert type to `int64`
  - Call `authService.GetUserByID(ctx, userID)`
  - Map `ErrUserNotFound` → 404
  - Respond 200 with `meResponse{ID: user.ID, Email: user.Email}`

### Task 8.4: Register protected route in main.go

- [ ] Create a `/api` group with `middleware.AuthRequired(cfg.JWTSecret)` applied
- [ ] Register `GET /api/me` on the protected group

### Task 8.5: Manual end-to-end verification

- [ ] Register a user (if needed)
- [ ] Login and capture the token:

  ```bash
  TOKEN=$(curl -s -X POST http://localhost:8082/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"securepass"}' | jq -r .token)
  ```

- [ ] Call /api/me:

  ```bash
  curl -s http://localhost:8082/api/me \
    -H "Authorization: Bearer $TOKEN" | jq .
  ```

  Expected: `{"id": 1, "email": "test@example.com"}`

- [ ] Call /api/me with no header: Expected `401`
- [ ] Call /api/me with a tampered token: Expected `401`

### Task 8.6: Commit and open PR

- [ ] Stage: updated `user_repository.go`, updated `auth_service.go`, updated `auth_handler.go`, updated `main.go`
- [ ] Commit message: `feat(taskly-be): add GET /api/me protected endpoint`
- [ ] Push branch `feat/taskly-be-me` and open PR

**Acceptance Criteria**:

- Valid token returns `200` with `{"id": <number>, "email": "<email>"}`
- No header returns `401`
- Tampered token returns `401`
- `go vet ./...` exits 0
- Full auth flow works end-to-end: register → login → /api/me

---

## PR 9 — README and Gherkin Specs

**Branch**: `docs/taskly-be-readme-gherkin`
**Goal**: Document how to run the app locally and write Gherkin acceptance criteria in `specs/`.

### Task 9.1: Write apps/taskly-be/README.md

- [ ] Create `apps/taskly-be/README.md` with the following sections:
  - **Overview** — what this app is and its learning purpose
  - **Prerequisites** — Go 1.22+, PostgreSQL, a `taskly` database
  - **Setup** — copy `.env.example` to `.env`, fill in values
  - **Running** — `go run ./cmd/server/` or `nx run taskly-be:serve`
  - **API Endpoints** — table with method, path, auth, description for all three endpoints
  - **Example requests** — curl snippets for register, login, and /api/me

### Task 9.2: Write Gherkin feature file

- [ ] Create `specs/taskly-be/auth.feature` (create the `specs/taskly-be/` directory):

```gherkin
Feature: Taskly authentication
  As a user of the Taskly API
  I want to register, log in, and access my profile
  So that my data is protected and I can prove my identity

  Background:
    Given the Taskly API is running on http://localhost:8082

  Scenario: Successful user registration
    Given no account exists for "newuser@example.com"
    When I POST to /api/auth/register with email "newuser@example.com" and password "securepass123"
    Then the response status is 201
    And the response body contains "id" and "email"

  Scenario: Duplicate email is rejected
    Given an account exists for "existing@example.com"
    When I POST to /api/auth/register with email "existing@example.com" and password "securepass123"
    Then the response status is 409
    And the response body contains error "email already registered"

  Scenario: Password too short is rejected
    Given no account exists for "shortpass@example.com"
    When I POST to /api/auth/register with email "shortpass@example.com" and password "short"
    Then the response status is 400
    And the response body contains error "password must be at least 8 characters"

  Scenario: Successful login
    Given an account exists for "alice@example.com" with password "alicepass1"
    When I POST to /api/auth/login with email "alice@example.com" and password "alicepass1"
    Then the response status is 200
    And the response body contains a "token" field

  Scenario: Login with wrong password
    Given an account exists for "alice@example.com" with password "alicepass1"
    When I POST to /api/auth/login with email "alice@example.com" and password "wrongpassword"
    Then the response status is 401
    And the response body contains error "invalid credentials"

  Scenario: Login with unknown email
    Given no account exists for "ghost@example.com"
    When I POST to /api/auth/login with email "ghost@example.com" and password "anypassword"
    Then the response status is 401
    And the response body contains error "invalid credentials"

  Scenario: Access protected profile with valid token
    Given I am logged in as "alice@example.com"
    When I GET /api/me with a valid Authorization header
    Then the response status is 200
    And the response body contains "id" and "email"

  Scenario: Access protected profile without a token
    Given I am not authenticated
    When I GET /api/me without an Authorization header
    Then the response status is 401
    And the response body contains error "authorization header required"

  Scenario: Access protected profile with an invalid token
    Given I am not authenticated
    When I GET /api/me with an Authorization header containing "Bearer invalid.token.here"
    Then the response status is 401
    And the response body contains error "invalid token"
```

### Task 9.3: Commit and open PR

- [ ] Stage: `apps/taskly-be/README.md`, `specs/taskly-be/auth.feature`
- [ ] Commit message: `docs(taskly-be): add readme and gherkin auth specs`
- [ ] Push branch `docs/taskly-be-readme-gherkin` and open PR

**Acceptance Criteria**:

- README is clear enough for a developer who has never seen the project to run it in under 5 minutes
- All three endpoints have curl examples that work against a running server
- Gherkin file covers all success and failure scenarios for register, login, and /api/me
- `specs/taskly-be/auth.feature` follows the 1-1-1 rule (1 Given, 1 When, 1 Then per scenario)

---

## Commit Summary

| PR  | Branch                           | Commit Message                                                       |
| --- | -------------------------------- | -------------------------------------------------------------------- |
| 1   | `feat/taskly-be-scaffold`        | `feat(taskly-be): scaffold go module and nx project`                 |
| 2   | `feat/taskly-be-config`          | `feat(taskly-be): add typed config loading from env`                 |
| 3   | `feat/taskly-be-db`              | `feat(taskly-be): add postgresql connection pool and migrate runner` |
| 4   | `feat/taskly-be-users-migration` | `feat(taskly-be): add users table migration`                         |
| 5   | `feat/taskly-be-register`        | `feat(taskly-be): add POST /api/auth/register endpoint`              |
| 6   | `feat/taskly-be-login`           | `feat(taskly-be): add POST /api/auth/login with jwt generation`      |
| 7   | `feat/taskly-be-jwt-middleware`  | `feat(taskly-be): add jwt auth middleware`                           |
| 8   | `feat/taskly-be-me`              | `feat(taskly-be): add GET /api/me protected endpoint`                |
| 9   | `docs/taskly-be-readme-gherkin`  | `docs(taskly-be): add readme and gherkin auth specs`                 |

---

## Final Validation

Before moving this plan to `plans/done/`, verify every item below:

- [ ] `go build ./...` exits 0 from `apps/taskly-be/`
- [ ] `go vet ./...` exits 0 from `apps/taskly-be/`
- [ ] `gofmt -l .` produces no output from `apps/taskly-be/`
- [ ] `nx show project taskly-be` lists the project
- [ ] `POST /api/auth/register` returns `201` for a new user
- [ ] `POST /api/auth/register` returns `409` for a duplicate email
- [ ] `POST /api/auth/login` returns `200` with a token for correct credentials
- [ ] `POST /api/auth/login` returns `401` for wrong credentials
- [ ] `GET /api/me` returns `200` with `{id, email}` for a valid token
- [ ] `GET /api/me` returns `401` for a missing or invalid token
- [ ] All 9 PRs merged to `main`
- [ ] `specs/taskly-be/auth.feature` committed and present
- [ ] `apps/taskly-be/README.md` committed and present
- [ ] `.env` is not tracked by git (`git status` shows no `.env`)

---

## Progress Tracking

| PR                     | Status          |
| ---------------------- | --------------- |
| PR 1 — Scaffold        | [ ] Not started |
| PR 2 — Config          | [ ] Not started |
| PR 3 — DB Connection   | [ ] Not started |
| PR 4 — Users Migration | [ ] Not started |
| PR 5 — Register        | [ ] Not started |
| PR 6 — Login + JWT     | [ ] Not started |
| PR 7 — JWT Middleware  | [ ] Not started |
| PR 8 — /api/me         | [ ] Not started |
| PR 9 — Docs + Gherkin  | [ ] Not started |

**Overall**: 0/9 PRs merged

**Last Updated**: June 20, 2026
