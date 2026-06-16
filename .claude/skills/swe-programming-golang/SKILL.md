# Skill: Go Programming Standards

**Category**: Software Engineering
**Purpose**: Idiomatic Go patterns, module system, error handling, and testing conventions
**Used By**: swe-golang-dev

---

## Overview

Go (Golang) is a statically typed, compiled language designed for simplicity, concurrency, and performance. It favors composition over inheritance, explicit error handling over exceptions, and simplicity over abstraction.

**Core philosophy**: Write Go that reads like Go — not Java, not Python, not C.

---

## Project Structure

Standard Go module layout:

```text
my-project/
├── go.mod              # Module definition
├── go.sum              # Dependency checksums
├── main.go             # Entry point (cmd/ for multi-binary)
├── cmd/
│   └── server/
│       └── main.go     # Binary entry point
├── internal/           # Private packages (not importable externally)
│   ├── handler/        # HTTP handlers
│   ├── service/        # Business logic
│   └── repository/     # Data access
└── pkg/                # Public packages (importable by others)
```

**Rules:**

- `internal/` — private to the module, enforced by compiler
- `pkg/` — public API surface, be deliberate about what goes here
- One package per directory
- Package name matches directory name (except `main`)

---

## Module System

```bash
# Initialize a module
go mod init github.com/username/project-name

# Add a dependency
go get github.com/some/package@v1.2.3

# Tidy (remove unused, add missing)
go mod tidy

# Download dependencies
go mod download
```

**`go.mod` example:**

```go
module github.com/username/my-project

go 1.22

require (
    github.com/gin-gonic/gin v1.9.1
    github.com/jackc/pgx/v5 v5.5.0
)
```

---

## Idiomatic Go Patterns

### Error Handling

Go uses explicit error returns — no exceptions.

```go
// Good — explicit error check
result, err := doSomething()
if err != nil {
    return fmt.Errorf("doSomething failed: %w", err)
}

// Good — wrap errors with context
if err := db.Query(ctx, query); err != nil {
    return fmt.Errorf("query users: %w", err)
}
```

**Rules:**

- Always check `err != nil` immediately after the call
- Wrap errors with `%w` to preserve the chain: `fmt.Errorf("context: %w", err)`
- Return early on error — avoid deep nesting
- Never ignore errors with `_` unless intentional and commented

### Interfaces

Keep interfaces small — prefer single-method interfaces.

```go
// Good — small, composable
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

type ReadWriter interface {
    Reader
    Writer
}
```

Define interfaces where they are **used**, not where they are **implemented**.

### Structs and Constructors

```go
type UserService struct {
    repo   UserRepository
    logger *slog.Logger
}

// Constructor — return pointer, accept dependencies
func NewUserService(repo UserRepository, logger *slog.Logger) *UserService {
    return &UserService{
        repo:   repo,
        logger: logger,
    }
}
```

### Defer

```go
func readFile(path string) ([]byte, error) {
    f, err := os.Open(path)
    if err != nil {
        return nil, fmt.Errorf("open %s: %w", path, err)
    }
    defer f.Close() // Always defer cleanup right after acquiring the resource

    return io.ReadAll(f)
}
```

### Goroutines and Channels

```go
// Fan-out pattern
func processItems(items []Item) []Result {
    results := make(chan Result, len(items))

    for _, item := range items {
        go func(i Item) {
            results <- process(i)
        }(item) // Pass item as argument — avoid closure capture bug
    }

    out := make([]Result, 0, len(items))
    for range items {
        out = append(out, <-results)
    }
    return out
}
```

**Rules:**

- Always pass loop variables as arguments to goroutines (closure capture bug)
- Use `context.Context` for cancellation and timeouts
- Close channels from the sender, not the receiver

---

## HTTP Handlers (net/http or Gin)

### Standard library

```go
func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
    id := r.PathValue("id") // Go 1.22+
    user, err := h.svc.GetByID(r.Context(), id)
    if err != nil {
        http.Error(w, "not found", http.StatusNotFound)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}
```

### Gin

```go
func (h *UserHandler) GetUser(c *gin.Context) {
    id := c.Param("id")
    user, err := h.svc.GetByID(c.Request.Context(), id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
        return
    }
    c.JSON(http.StatusOK, user)
}
```

---

## Testing

Go has a built-in test framework — no external library needed for basic tests.

### Unit Tests

```go
// File: user_service_test.go
func TestUserService_GetByID(t *testing.T) {
    // Table-driven tests — idiomatic Go
    tests := []struct {
        name    string
        userID  string
        want    *User
        wantErr bool
    }{
        {
            name:   "returns user when found",
            userID: "123",
            want:   &User{ID: "123", Name: "Alice"},
        },
        {
            name:    "returns error when not found",
            userID:  "999",
            wantErr: true,
        },
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            svc := NewUserService(mockRepo, slog.Default())
            got, err := svc.GetByID(context.Background(), tt.userID)

            if (err != nil) != tt.wantErr {
                t.Errorf("GetByID() error = %v, wantErr %v", err, tt.wantErr)
                return
            }
            if !reflect.DeepEqual(got, tt.want) {
                t.Errorf("GetByID() = %v, want %v", got, tt.want)
            }
        })
    }
}
```

### Run Tests

```bash
go test ./...                    # Run all tests
go test ./internal/service/...   # Run specific package
go test -v ./...                 # Verbose output
go test -run TestUserService ./... # Run specific test
go test -cover ./...             # Coverage report
go test -race ./...              # Race condition detector
```

### Mocking

Use interfaces for testability — mock by implementing the interface:

```go
type mockUserRepo struct {
    users map[string]*User
}

func (m *mockUserRepo) FindByID(_ context.Context, id string) (*User, error) {
    user, ok := m.users[id]
    if !ok {
        return nil, ErrNotFound
    }
    return user, nil
}
```

---

## Common Conventions

| Convention | Rule |
|---|---|
| Naming | `camelCase` for unexported, `PascalCase` for exported |
| Error variables | `var ErrNotFound = errors.New("not found")` |
| Context | Always first parameter: `func Foo(ctx context.Context, ...)` |
| Receiver names | Short, consistent: `u *UserService`, not `self` or `this` |
| Zero values | Design structs to be useful at zero value where possible |
| Comments | `// ExportedFunc does X` — exported symbols must be commented |

---

## Build and Run

```bash
go build ./...          # Build all packages
go run cmd/server/      # Run a specific binary
go vet ./...            # Static analysis
gofmt -w .              # Format all files
goimports -w .          # Format + fix imports
```

---

## Related Skills

- **swe-developing-applications-common** — General dev workflow (branching, commits, PRs)

---

**Last Updated**: 2026-06-16
