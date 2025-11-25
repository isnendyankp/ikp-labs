# API Tests - Implementation Plan

**Status:** 🚧 IN PROGRESS → ✅ TO BE COMPLETED

**Created:** 2025-11-23

**Last Updated:** 2025-11-26

**Timeline:** November 26-29, 2025 (Day 3-6 of Backend Testing Week)

## Overview

This plan implements comprehensive API tests for the Gallery Photo feature using **Playwright** with **REAL local PostgreSQL database**. API tests verify the complete backend stack with actual HTTP requests, real database persistence, and real file system operations.

## Scope Summary

**What IS Included:**
- Full backend testing with real local PostgreSQL
- **Playwright** for real HTTP requests (leveraging existing infrastructure)
- Gallery API tests with all CRUD operations
- Real file upload to file system
- Real database persistence and transactions
- Authorization and authentication with real JWT
- Complete test flow: Register → Login → Upload → Gallery → Delete

**What is NOT Included:**
- Frontend testing (E2E with Playwright in Week 2)
- Performance or load testing
- Mocked database (we use REAL PostgreSQL)
- Unit or integration tests (covered in Day 1-2)

## Why Playwright Instead of REST Assured?

**Decision:** Use Playwright for API testing (per senior's recommendation)

**Reasons:**
1. ✅ **Already Fully Configured** - Playwright setup complete with API test project
2. ✅ **Existing Infrastructure** - `tests/api/` folder with helper classes ready
3. ✅ **Consistent Technology Stack** - Same tool for API + E2E tests
4. ✅ **Helper Classes Available** - ApiClient, AuthHelper already implemented
5. ✅ **Team Familiarity** - Team already using Playwright for E2E tests
6. ✅ **TypeScript** - Same language as E2E tests (better consistency)

## Current State

**Existing Playwright API Tests:**
- ✅ `tests/api/auth.api.spec.ts` - Authentication endpoints
- ✅ `tests/api/users.api.spec.ts` - User management endpoints
- ✅ `tests/api/protected.api.spec.ts` - Protected endpoints
- ✅ `tests/api/error-handling.api.spec.ts` - Error scenarios
- ✅ `tests/api/health.api.spec.ts` - Health check

**Existing Helper Classes:**
- ✅ `tests/api/helpers/api-client.ts` - HTTP request wrapper with JWT
- ✅ `tests/api/helpers/auth-helper.ts` - Authentication utilities
- ✅ `tests/api/helpers/test-data.ts` - Test data generators
- ✅ `tests/api/helpers/cleanup.ts` - Database cleanup utilities

**Missing API Tests:**
- ❌ `tests/api/gallery.api.spec.ts` - Gallery CRUD with real DB + file system

**Total Existing:** ~15+ API tests (Playwright)
**To Add:** ~35-40 Gallery API tests
**Final Total:** ~50-55 API tests

## Plan Documents

1. **[requirements.md](./requirements.md)** - Detailed scope and API test scenarios
2. **[technical-design.md](./technical-design.md)** - Playwright setup, database config
3. **[checklist.md](./checklist.md)** - Day-by-day tasks for Days 3-6

## Key Deliverables

### Days 3-6: Gallery API Tests (35-40 tests)

**Day 3 (Wed):** Setup + Upload & Get photos tests (6-7 tests)
**Day 4 (Thu):** Get photos detail & pagination tests (8-10 tests)
**Day 5 (Fri):** Update & authorization tests (8-10 tests)
**Day 6 (Sat):** Delete, privacy toggle & edge cases (8-10 tests)

**Test Pattern:**
- Real PostgreSQL running locally
- Backend server running: `mvn spring-boot:run` (port 8081)
- **Playwright** for HTTP requests
- Test location: `tests/api/gallery.api.spec.ts`
- Test data pattern: `apitest*@test.com`
- Cleanup after each test (test.afterEach)

## Success Metrics

- ✅ 35-40 new Gallery API tests passing
- ✅ Real database persistence verified
- ✅ Real file uploads working
- ✅ All CRUD operations tested
- ✅ Authorization enforced
- ✅ Test cleanup working
- ✅ Leverage existing Playwright infrastructure

## Timeline

**Day 3-6 (4 days total):** ~4-6 hours per day

## Dependencies

**Prerequisites:**
- ✅ Unit tests complete (Day 1)
- ✅ Integration tests complete (Day 2)
- ✅ PostgreSQL installed locally
- ✅ **Playwright already configured** (existing infrastructure)
- ✅ **Existing API tests as reference** (auth, users, protected)
- ✅ **Helper classes ready** (ApiClient, AuthHelper)

**Blocks:** None (can start after Day 2)

## Running API Tests

```bash
# Start backend server first
cd backend/registration-form-api
mvn spring-boot:run

# In another terminal, run Playwright API tests
npx playwright test --project="API Tests"

# Run specific test file
npx playwright test tests/api/gallery.api.spec.ts

# Run with UI mode
npx playwright test tests/api/gallery.api.spec.ts --ui

# View HTML report
npx playwright show-report
```

## Notes

- API test = Full backend with REAL database
- Backend server must be running (`mvn spring-boot:run` on port 8081)
- PostgreSQL database must be running locally
- Test cleanup critical (prevent pollution)
- **Playwright leverages existing infrastructure** (no new setup needed)
- **Consistent with E2E tests** (same tool, same patterns)
