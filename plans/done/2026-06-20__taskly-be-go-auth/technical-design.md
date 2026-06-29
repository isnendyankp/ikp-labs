# Taskly Backend — Technical Design

---

## Architecture Overview

The application follows a three-layer architecture inside the `internal/` package: handlers (HTTP), service (business logic), and repository (data access). Each layer depends only on the interface of the layer below it, not the concrete type.

```text
apps/taskly-be/
  cmd/server/main.go          <-- entrypoint: wire dependencies, start server
        |
        v
  internal/config/            <-- load and validate env vars
  internal/db/                <-- connection pool + migrate runner
  internal/repository/        <-- SQL queries (no business logic)
  internal/service/           <-- business logic (no SQL, no HTTP)
  internal/handler/           <-- gin handlers (no SQL, no business logic)
  internal/middleware/        <-- JWT auth middleware
```

**Dependency flow (top to bottom, no reverse):**

```text
main.go
  --> config.Load()
  --> db.Connect(config.DatabaseURL)
  --> db.Migrate(conn)
  --> repository.NewUserRepository(conn)
  --> service.NewAuthService(userRepo, config.JWTSecret)
  --> handler.NewAuthHandler(authService)
  --> middleware.NewAuthMiddleware(config.JWTSecret)
  --> router setup (gin)
  --> http.ListenAndServe(config.ServerPort)
```

---

## Folder Structure

```text
apps/taskly-be/
├── cmd/
│   └── server/
│       └── main.go                          # Entrypoint — wire, configure, serve
├── internal/
│   ├── config/
│   │   └── config.go                        # Config struct + Load() function
│   ├── db/
│   │   ├── db.go                            # Connect() returns *sql.DB
│   │   ├── migrate.go                       # Migrate() runs golang-migrate
│   │   └── migrations/
│   │       ├── 000001_create_users.up.sql   # CREATE TABLE users
│   │       └── 000001_create_users.down.sql # DROP TABLE users
│   ├── repository/
│   │   ├── user_repository.go               # UserRepository interface + pgx impl
│   │   └── models.go                        # User struct (DB row shape)
│   ├── service/
│   │   └── auth_service.go                  # AuthService interface + impl
│   ├── handler/
│   │   └── auth_handler.go                  # RegisterHandler, LoginHandler, MeHandler
│   └── middleware/
│       └── auth_middleware.go               # AuthRequired() gin.HandlerFunc
├── .env                                     # Local secrets (gitignored)
├── .env.example                             # Template with placeholder values
├── .gitignore                               # taskly-be binary, .env, tmp/
├── go.mod                                   # module github.com/isnendyankp/taskly-be
├── go.sum                                   # Dependency checksums
├── project.json                             # Nx project config
└── README.md                                # How to run locally
```

---

## Technology Choices

| Concern           | Choice                                 | Rationale                                                                               |
| ----------------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| HTTP router       | `github.com/gin-gonic/gin` v1.10       | Minimal over stdlib, body binding built-in, widely used in Go ecosystem — good to learn |
| PostgreSQL driver | `github.com/jackc/pgx/v5/stdlib`       | Most performant pg driver, exposes `database/sql` interface so queries remain portable  |
| Password hashing  | `golang.org/x/crypto/bcrypt`           | Standard choice, battle-tested, part of official Go extended stdlib                     |
| JWT               | `github.com/golang-jwt/jwt/v5`         | Actively maintained successor to the original `dgrijalva/jwt-go`                        |
| Migrations        | `github.com/golang-migrate/migrate/v4` | SQL-first, no DSL to learn, works with raw `.sql` files                                 |
| Env loading       | `github.com/joho/godotenv`             | De-facto standard for `.env` loading in Go                                              |

---

## Configuration

```go
// internal/config/config.go

type Config struct {
    ServerPort  string // e.g. "8082"
    DatabaseURL string // e.g. "postgres://user:pass@localhost:5432/taskly?sslmode=disable"
    JWTSecret   string // e.g. "change-me-in-production"
}

func Load() (*Config, error) {
    // 1. Load .env file if present (dev convenience)
    // 2. Read os.Getenv for each required variable
    // 3. Return error if any required variable is empty
}
```

`.env.example`:

```text
SERVER_PORT=8082
DATABASE_URL=postgres://postgres:postgres@localhost:5432/taskly?sslmode=disable
JWT_SECRET=change-me-in-production
```

---

## Database Schema

### Migration: `000001_create_users.up.sql`

```sql
CREATE TABLE IF NOT EXISTS users (
    id           BIGSERIAL PRIMARY KEY,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(72)  NOT NULL,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
```

### Migration: `000001_create_users.down.sql`

```sql
DROP TABLE IF EXISTS users;
```

**Notes:**

- `VARCHAR(72)` is intentional: bcrypt output is always 60 characters, but 72 gives comfortable headroom
- `email` has a `UNIQUE` constraint enforced at the database level as a safety net in addition to the application-level check
- `BIGSERIAL` auto-increments from 1; no UUIDs at this stage (keeps queries simple for learning)

---

## Repository Layer

```go
// internal/repository/models.go
type User struct {
    ID           int64
    Email        string
    PasswordHash string
    CreatedAt    time.Time
}

// internal/repository/user_repository.go
type UserRepository interface {
    CreateUser(ctx context.Context, email, passwordHash string) (*User, error)
    FindByEmail(ctx context.Context, email string) (*User, error)
    FindByID(ctx context.Context, id int64) (*User, error)
}

type pgUserRepository struct {
    db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
    return &pgUserRepository{db: db}
}
```

All methods use parameterized queries via `db.QueryRowContext` with `$1`, `$2` placeholders (pgx/pgxstdlib style). No string interpolation in SQL.

---

## Service Layer

```go
// internal/service/auth_service.go
type RegisterInput struct {
    Email    string
    Password string
}

type LoginInput struct {
    Email    string
    Password string
}

type AuthService interface {
    Register(ctx context.Context, input RegisterInput) (*repository.User, error)
    Login(ctx context.Context, input LoginInput) (token string, err error)
    GetUserByID(ctx context.Context, id int64) (*repository.User, error)
}

type authService struct {
    users     repository.UserRepository
    jwtSecret []byte
}

func NewAuthService(users repository.UserRepository, jwtSecret string) AuthService {
    return &authService{users: users, jwtSecret: []byte(jwtSecret)}
}
```

Service-level errors:

- `ErrEmailTaken` — returned by `Register` when email already exists
- `ErrInvalidCredentials` — returned by `Login` for wrong password or unknown email
- `ErrUserNotFound` — returned by `GetUserByID` when user does not exist

These sentinel errors live in `internal/service/errors.go` and are checked in handlers with `errors.Is`.

---

## Handler Layer

```go
// internal/handler/auth_handler.go
type AuthHandler struct {
    auth service.AuthService
}

func NewAuthHandler(auth service.AuthService) *AuthHandler {
    return &AuthHandler{auth: auth}
}

// RegisterHandler: POST /api/auth/register
// LoginHandler:    POST /api/auth/login
// MeHandler:       GET  /api/me  (requires middleware)
```

Request/response structs use `binding:"required"` tags for gin's `ShouldBindJSON`:

```go
type registerRequest struct {
    Email    string `json:"email"    binding:"required,email"`
    Password string `json:"password" binding:"required,min=8"`
}

type registerResponse struct {
    ID    int64  `json:"id"`
    Email string `json:"email"`
}

type loginRequest struct {
    Email    string `json:"email"    binding:"required"`
    Password string `json:"password" binding:"required"`
}

type loginResponse struct {
    Token string `json:"token"`
}

type meResponse struct {
    ID    int64  `json:"id"`
    Email string `json:"email"`
}
```

Error response shape (used everywhere):

```go
type errorResponse struct {
    Error string `json:"error"`
}
```

---

## Middleware

```go
// internal/middleware/auth_middleware.go

func AuthRequired(jwtSecret string) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. Read Authorization header
        // 2. Check "Bearer " prefix
        // 3. Parse and validate JWT with golang-jwt
        // 4. Extract "sub" claim as int64 userID
        // 5. c.Set("userID", userID)
        // 6. c.Next()
        // On any failure: c.AbortWithStatusJSON(401, errorResponse{...})
    }
}
```

The middleware is applied per-route group, not globally:

```go
protected := router.Group("/api")
protected.Use(middleware.AuthRequired(cfg.JWTSecret))
{
    protected.GET("/me", authHandler.MeHandler)
}
```

---

## API Contract

### POST /api/auth/register

| Field        | Value                |
| ------------ | -------------------- |
| Method       | POST                 |
| Path         | `/api/auth/register` |
| Content-Type | `application/json`   |
| Auth         | None                 |

Request body:

```json
{
  "email": "alice@example.com",
  "password": "securepass123"
}
```

Responses:

| Status | Body                                                  | Condition                       |
| ------ | ----------------------------------------------------- | ------------------------------- |
| 201    | `{"id": 1, "email": "alice@example.com"}`             | Success                         |
| 400    | `{"error": "email is required"}`                      | Missing field or invalid format |
| 400    | `{"error": "password must be at least 8 characters"}` | Short password                  |
| 409    | `{"error": "email already registered"}`               | Duplicate email                 |
| 500    | `{"error": "internal server error"}`                  | Unexpected DB error             |

---

### POST /api/auth/login

| Field        | Value              |
| ------------ | ------------------ |
| Method       | POST               |
| Path         | `/api/auth/login`  |
| Content-Type | `application/json` |
| Auth         | None               |

Request body:

```json
{
  "email": "alice@example.com",
  "password": "securepass123"
}
```

Responses:

| Status | Body                                 | Condition                       |
| ------ | ------------------------------------ | ------------------------------- |
| 200    | `{"token": "<jwt>"}`                 | Success                         |
| 400    | `{"error": "email is required"}`     | Missing field                   |
| 401    | `{"error": "invalid credentials"}`   | Wrong password or unknown email |
| 500    | `{"error": "internal server error"}` | Unexpected DB error             |

---

### GET /api/me

| Field  | Value                         |
| ------ | ----------------------------- |
| Method | GET                           |
| Path   | `/api/me`                     |
| Auth   | `Authorization: Bearer <jwt>` |

Responses:

| Status | Body                                         | Condition                       |
| ------ | -------------------------------------------- | ------------------------------- |
| 200    | `{"id": 1, "email": "alice@example.com"}`    | Success                         |
| 401    | `{"error": "authorization header required"}` | No header                       |
| 401    | `{"error": "invalid token"}`                 | Bad signature                   |
| 401    | `{"error": "token expired"}`                 | Expired JWT                     |
| 404    | `{"error": "user not found"}`                | User deleted after token issued |
| 500    | `{"error": "internal server error"}`         | Unexpected DB error             |

---

## JWT Structure

Algorithm: `HS256`

Claims:

```json
{
  "sub": "1",
  "iat": 1750000000,
  "exp": 1750086400
}
```

- `sub`: user id as string (standard claim)
- `iat`: issued-at Unix timestamp
- `exp`: expiry Unix timestamp (iat + 86400 seconds = 24 hours)

Token generation in `AuthService.Login`:

```go
claims := jwt.RegisteredClaims{
    Subject:   strconv.FormatInt(user.ID, 10),
    IssuedAt:  jwt.NewNumericDate(time.Now()),
    ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
}
token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
signed, err := token.SignedString(s.jwtSecret)
```

---

## Router Setup

```go
// cmd/server/main.go

router := gin.Default()

// Public routes
public := router.Group("/api/auth")
{
    public.POST("/register", authHandler.RegisterHandler)
    public.POST("/login",    authHandler.LoginHandler)
}

// Protected routes
protected := router.Group("/api")
protected.Use(middleware.AuthRequired(cfg.JWTSecret))
{
    protected.GET("/me", authHandler.MeHandler)
}

router.Run(":" + cfg.ServerPort)
```

---

## Nx Integration

`apps/taskly-be/project.json`:

```json
{
  "name": "taskly-be",
  "projectType": "application",
  "root": "apps/taskly-be",
  "targets": {
    "serve": {
      "executor": "nx:run-commands",
      "options": {
        "command": "go run ./cmd/server/",
        "cwd": "apps/taskly-be"
      }
    },
    "build": {
      "executor": "nx:run-commands",
      "options": {
        "command": "go build -o dist/taskly-be ./cmd/server/",
        "cwd": "apps/taskly-be"
      }
    },
    "lint": {
      "executor": "nx:run-commands",
      "options": {
        "command": "go vet ./... && gofmt -l .",
        "cwd": "apps/taskly-be"
      }
    }
  }
}
```

---

## Data Flow: Registration

```text
POST /api/auth/register
        |
        v
  AuthHandler.RegisterHandler
        | ShouldBindJSON -> registerRequest
        | validate email format, password length
        |
        v
  AuthService.Register(ctx, RegisterInput)
        | strings.ToLower + strings.TrimSpace email
        | bcrypt.GenerateFromPassword(password, 12)
        |
        v
  UserRepository.CreateUser(ctx, email, hash)
        | INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at
        |
        | if unique violation -> return ErrEmailTaken
        |
        v
  AuthHandler <- *User{ID, Email}
        | respond 201 registerResponse{ID, Email}
```

---

## Data Flow: Login

```text
POST /api/auth/login
        |
        v
  AuthHandler.LoginHandler
        | ShouldBindJSON -> loginRequest
        |
        v
  AuthService.Login(ctx, LoginInput)
        |
        v
  UserRepository.FindByEmail(ctx, email)
        | SELECT id, email, password_hash FROM users WHERE email = $1
        | if not found -> return ErrInvalidCredentials  (do NOT reveal "not found")
        |
        v
  bcrypt.CompareHashAndPassword(user.PasswordHash, input.Password)
        | if mismatch -> return ErrInvalidCredentials
        |
        v
  jwt.NewWithClaims(HS256, {sub: userID, exp: +24h})
        | SignedString(jwtSecret)
        |
        v
  AuthHandler <- token string
        | respond 200 loginResponse{Token}
```

---

## Data Flow: Protected Route

```text
GET /api/me
Authorization: Bearer <token>
        |
        v
  middleware.AuthRequired
        | extract token from header
        | jwt.ParseWithClaims(token, &RegisteredClaims{}, keyFunc)
        | extract sub claim -> userID int64
        | c.Set("userID", userID)
        | c.Next()
        |
        v
  AuthHandler.MeHandler
        | c.Get("userID") -> userID
        |
        v
  AuthService.GetUserByID(ctx, userID)
        |
        v
  UserRepository.FindByID(ctx, userID)
        | SELECT id, email FROM users WHERE id = $1
        | if not found -> return ErrUserNotFound
        |
        v
  AuthHandler <- *User{ID, Email}
        | respond 200 meResponse{ID, Email}
```

---

## Error Handling Strategy

Handlers translate service-layer errors to HTTP responses using `errors.Is`:

```go
func respondError(c *gin.Context, err error) {
    switch {
    case errors.Is(err, service.ErrEmailTaken):
        c.JSON(409, errorResponse{"email already registered"})
    case errors.Is(err, service.ErrInvalidCredentials):
        c.JSON(401, errorResponse{"invalid credentials"})
    case errors.Is(err, service.ErrUserNotFound):
        c.JSON(404, errorResponse{"user not found"})
    default:
        log.Printf("unexpected error: %v", err)
        c.JSON(500, errorResponse{"internal server error"})
    }
}
```

This pattern keeps the handler thin and keeps HTTP status code mapping in one place.
