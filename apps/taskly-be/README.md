# taskly-be

## Overview

taskly-be is a Go REST API that serves as a learning project for Go backend development. It demonstrates a 3-layer architecture (repository / service / handler), JWT-based authentication, and PostgreSQL schema management via golang-migrate.

## Tech Stack

- Go 1.26.4
- Gin v1.12.0 — HTTP router and middleware
- pgx v5.10.0 — PostgreSQL driver
- golang-jwt/jwt v5.3.1 — JWT token generation and validation
- golang-migrate v4.19.1 — SQL migration runner
- godotenv v1.5.1 — `.env` file loader

## Prerequisites

- Go 1.26 or later
- PostgreSQL running locally
- A `taskly` database:

```bash
psql -c "CREATE DATABASE taskly;"
```

## Setup

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Environment variables:

| Variable       | Description                        | Example value                                                        |
| -------------- | ---------------------------------- | -------------------------------------------------------------------- |
| `SERVER_PORT`  | Port the HTTP server listens on    | `8082`                                                               |
| `DATABASE_URL` | PostgreSQL connection string       | `postgres://postgres:postgres@localhost:5432/taskly?sslmode=disable` |
| `JWT_SECRET`   | Secret key used to sign JWT tokens | `change-me-in-production`                                            |

## Running

```bash
# Direct (from apps/taskly-be/)
go run ./cmd/server/

# Via Nx (from repo root)
nx run taskly-be:serve
```

The server starts on `http://localhost:8082`. Database migrations in `internal/db/migrations/` are applied automatically on startup.

## Building

```bash
# Direct (from apps/taskly-be/)
go build -o dist/taskly-be ./cmd/server/

# Via Nx (from repo root)
nx run taskly-be:build
```

## Linting

```bash
# Direct (from apps/taskly-be/)
go vet ./... && gofmt -l .

# Via Nx (from repo root)
nx run taskly-be:lint
```

## API Endpoints

| Method | Path                 | Auth Required | Description                  |
| ------ | -------------------- | ------------- | ---------------------------- |
| POST   | `/api/auth/register` | No            | Register a new user          |
| POST   | `/api/auth/login`    | No            | Login and receive a JWT      |
| GET    | `/api/me`            | Bearer JWT    | Get the current user profile |

## Example Requests

### Register

```bash
curl -s -X POST http://localhost:8082/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

### Login (capture token)

```bash
TOKEN=$(curl -s -X POST http://localhost:8082/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
```

### Get current user profile

```bash
curl -s http://localhost:8082/api/me \
  -H "Authorization: Bearer $TOKEN"
```
