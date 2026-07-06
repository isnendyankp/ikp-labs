# Taskly Backend E2E — Playwright API Test Suite

**Status**: 🏗️ In Progress
**Created**: July 6, 2026
**Priority**: P1-High
**Type**: Infrastructure / Testing

---

## Overview

This plan covers the creation of `apps/taskly-be-e2e/` — a Playwright API test suite for the `taskly-be` Go REST API running on port 8082. The suite validates all eight endpoints (three auth endpoints and five task CRUD endpoints) with real HTTP requests against a live server. No mocking.

The project is a new Nx application that mirrors the structure of the existing `apps/kameravue-be-e2e/` suite and is executable via `nx run taskly-be-e2e:e2e`.

## Problem Statement

### Current Pain Points

- `apps/taskly-be` implements eight REST endpoints with no automated test coverage
- Auth and task CRUD behavior is verified manually via curl after each change
- Task ownership enforcement (403 responses) has never been tested in a repeatable way
- There is no Nx target to run taskly-be API tests in CI

## Proposed Solution

Create `apps/taskly-be-e2e/` as a standalone Nx application with two spec files:

- `tests/api/auth.api.spec.ts` — covers register, login, and /api/me
- `tests/api/tasks.api.spec.ts` — covers full task CRUD, ownership enforcement, and validation

Each test creates its own isolated user via `uniqueEmail()`, so tests are fully independent with no shared mutable state.

## Scope

### In-Scope

- `apps/taskly-be-e2e/` Nx application scaffold: `playwright.config.ts`, `project.json`, `tsconfig.json`, `.gitignore`
- Empty `helpers/` and `tests/api/` directories with `.gitkeep` placeholders (PR 1)
- `helpers/api-client.ts` — `ApiClient` class wrapping `APIRequestContext` with `get`, `post`, `put`, `delete` methods
- `helpers/auth-helper.ts` — `AuthHelper` class with `registerAndLogin(email, password)` that makes register + login calls and returns a token
- `helpers/test-data.ts` — `uniqueEmail()` and `validPassword()` generator functions
- `tests/api/auth.api.spec.ts` — 13 test cases covering all register, login, and /api/me scenarios
- `tests/api/tasks.api.spec.ts` — 20 test cases covering all task CRUD scenarios including ownership and validation
- `apps/taskly-be-e2e/README.md` — app-level documentation with setup and run instructions
- Nx targets: `e2e`, `e2e:ui`, `e2e:debug`

### Out-of-Scope

- Browser-based frontend E2E tests
- Database seeding or teardown scripts (each test is self-contained)
- Performance or load testing
- Test fixtures or file upload helpers (taskly-be has no file upload endpoints)
- Gherkin spec files (already written in `specs/taskly-be/auth.feature`)
- CI pipeline changes (separate backlog item)
- Token expiry or refresh tests (taskly-be has no refresh endpoint)
- Playwright UI component or screenshot tests

## Dependencies

- `apps/taskly-be` must be running on `http://localhost:8082` before tests execute
- PostgreSQL `taskly` database must be accessible and fully migrated
- `@playwright/test` is already available in workspace `node_modules` via `kameravue-be-e2e`

## Success Criteria

- `nx run taskly-be-e2e:e2e` passes all tests against a live `taskly-be` server
- All 5 PRs merged to `main`
- Each test creates its own user via `uniqueEmail()` — no shared mutable state between tests
- `workers: 1` — sequential execution, same as `kameravue-be-e2e`
- No test skips or `test.fixme` in the final spec files

## References

- Reference suite: `apps/kameravue-be-e2e/`
- API handlers: `apps/taskly-be/internal/handler/`
- Auth plan (done): `plans/done/2026-06-20__taskly-be-go-auth/`
- Task CRUD plan (done): `plans/done/2026-07-03__taskly-be-task-crud/`

---

## Related Documents

- [requirements.md](./requirements.md) — Functional and non-functional requirements
- [technical-design.md](./technical-design.md) — Architecture and full file content specifications
- [checklist.md](./checklist.md) — Implementation tasks organized by PR
