# Backend API Testing with MCP Playwright

**Status:** IN PROGRESS
**Created:** 2025-10-18
**Type:** API Testing Automation

## Overview

Automate backend API testing using Playwright's request API with MCP integration. This plan focuses on API-only testing (no browser) for all Spring Boot backend endpoints, replacing manual Postman testing with automated test suites.

## Scope Summary

This plan implements comprehensive API testing for:
- Authentication endpoints (register, login, refresh, validate)
- User management CRUD operations
- Protected endpoints requiring JWT authentication
- Error handling and validation testing

Testing approach uses Playwright's `request` context for direct HTTP testing without browser automation, integrated with MCP server for enhanced automation capabilities.

## Plan Documents

1. [Requirements](./requirements.md) - Detailed scope, non-scope, and user stories
2. [Technical Design](./technical-design.md) - Architecture, implementation approach, and code structure
3. [Checklist](./checklist.md) - Implementation tasks, testing, and validation steps

## Quick Links

- **Backend API Base URL:** `http://localhost:8081`
- **Existing E2E Tests:** `/tests/e2e/` (registration.spec.ts, login.spec.ts)
- **New API Tests Location:** `/tests/api/`
- **Playwright Config:** `/playwright.config.ts`

## Key Deliverables

- API test suite in `tests/api/` directory
- API helper utilities and test data generators
- MCP Playwright integration
- Extended Playwright configuration for API testing
- API testing documentation
- Daily commits for GitHub activity tracking

## Dependencies

- @playwright/test (already installed)
- MCP Playwright server (to be configured)
- TypeScript (already configured)
- Spring Boot backend running on port 8081
- PostgreSQL database

## Success Criteria

- All authentication flows tested
- All user management operations tested
- Protected endpoints authorization tested
- Error handling scenarios covered (400, 401, 404, 500)
- Input validation tested
- JWT token lifecycle tested
- Tests are independent and idempotent
- Test data cleanup implemented
- MCP integration working
- Documentation complete

## Timeline

Implementation follows a 5-day daily commit plan:
- **Day 1:** MCP Playwright setup + API test infrastructure
- **Day 2:** Auth API tests (register, login, refresh, validate)
- **Day 3:** User API tests (CRUD operations)
- **Day 4:** Protected endpoints + JWT authentication tests
- **Day 5:** Error handling tests + documentation

## Related Plans

- [Backend Testing Automation](../backend-testing-automation/) - JUnit/Mockito unit tests for backend
