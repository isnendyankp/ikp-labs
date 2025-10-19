# Implementation Plans

This directory contains structured implementation plans for features in the Registration Form application.

## Purpose

Implementation plans serve as **development roadmaps** that:

- Define clear scope and boundaries for features
- Break down work into actionable phases and tasks
- Provide technical guidance and architecture
- Track progress with checklists
- Ensure quality with testing and validation requirements

## Directory Structure

```
plans/
├── README.md           # This file - plans index
├── in-progress/        # Currently active plans
│   └── feature-name/
│       ├── README.md              # Plan overview
│       ├── requirements.md        # Scope and user stories
│       ├── technical-design.md    # Architecture and implementation
│       └── checklist.md           # Tasks and validation
└── completed/          # Finished plans (archived with date)
    └── YYYY-MM-DD--feature-name/
        └── (same structure)
```

## Plan Structure (4-Document System)

Each plan contains exactly **four documents**:

### 1. README.md - Plan Overview
- High-level summary
- Current status (🚧 IN PROGRESS or ✅ COMPLETED)
- Quick scope overview
- Links to other plan documents
- Completion date (if completed)

### 2. requirements.md - Scope & User Stories
- **Scope Definition**: What IS included (detailed)
- **Non-Scope Definition**: What is NOT included (detailed)
- **User Stories**: With Given/When/Then acceptance criteria
- **Success Criteria**: How to verify completion

### 3. technical-design.md - Architecture & Implementation
- Architecture overview with ASCII diagrams
- Implementation approach
- Code structure (files to create/modify)
- Technology choices and patterns
- Database changes (if applicable)
- API design (if applicable)
- Integration points

### 4. checklist.md - Tasks & Validation
- Implementation checklist with `- [ ]` checkboxes
- Testing requirements
- Documentation tasks
- Validation steps
- Quality gates

## Current Plans

### 🚧 In Progress

#### Backend Testing Automation
**Path:** `in-progress/backend-testing-automation/`
**Status:** IN PROGRESS
**Created:** 2025-10-18

Comprehensive automated testing for Spring Boot backend including unit tests (JUnit 5 + Mockito), integration tests (MockMvc + Testcontainers), API tests (REST Assured), and code coverage reporting (JaCoCo 80%+ target).

**Scope:**
- Unit tests for service layer and repositories
- Integration tests with real PostgreSQL via Testcontainers
- API tests with REST Assured
- Security component tests (JWT, validation)
- Code coverage with JaCoCo (80%+ target)
- CI/CD test automation ready

**Documents:**
- [README](./in-progress/backend-testing-automation/README.md)
- [Requirements](./in-progress/backend-testing-automation/requirements.md)
- [Technical Design](./in-progress/backend-testing-automation/technical-design.md)
- [Checklist](./in-progress/backend-testing-automation/checklist.md)

#### Backend API Testing with Playwright
**Path:** `in-progress/backend-api-testing-playwright/`
**Status:** IN PROGRESS
**Created:** 2025-10-18

Automate backend API testing using Playwright's request API with MCP integration. API-only testing (no browser) for all Spring Boot endpoints, replacing manual Postman testing with automated test suites. 5-day daily commit plan.

**Scope:**
- Authentication API tests (register, login, refresh, validate)
- User management CRUD API tests
- Protected endpoint authorization tests with JWT
- Error handling tests (400, 401, 404, 500)
- MCP Playwright integration
- API test helpers and utilities
- Daily commits for GitHub activity

**Documents:**
- [README](./in-progress/backend-api-testing-playwright/README.md)
- [Requirements](./in-progress/backend-api-testing-playwright/requirements.md)
- [Technical Design](./in-progress/backend-api-testing-playwright/technical-design.md)
- [Checklist](./in-progress/backend-api-testing-playwright/checklist.md)

#### Frontend Authentication Flow with Home Page
**Path:** `in-progress/frontend-authentication-flow/`
**Status:** IN PROGRESS
**Created:** 2025-10-19

Complete frontend authentication flow with protected home page route. Implements token-based session management with localStorage, route guards, and user profile display. 9-commit structure over 3 implementation days.

**Scope:**
- Protected home page route at /home (NOT /dashboard)
- Authentication context with React Context API
- Route protection and redirects for all pages
- User profile display with fullName, email, login time
- Logout functionality with token cleanup
- Token persistence across browser refreshes
- Complete E2E and API testing with Playwright
- Gherkin specifications for authentication flows

**Documents:**
- [README](./in-progress/frontend-authentication-flow/README.md)
- [Requirements](./in-progress/frontend-authentication-flow/requirements.md)
- [Technical Design](./in-progress/frontend-authentication-flow/technical-design.md)
- [Checklist](./in-progress/frontend-authentication-flow/checklist.md)

### ✅ Recently Completed

None yet. Plans will appear here when completed.

## Legacy Plans

The following plans exist in legacy format and may be migrated to new structure:

- `backend/docs/BACKEND_PLAN.md` - Backend development phases (Phase 1-5 completed)
- `frontend/docs/FRONTEND_PLAN.md` - Frontend development plan

These legacy plans document completed work and serve as historical reference.

## Creating a New Plan

Use the `plan-writer` agent to create structured implementation plans:

```bash
# In Claude Code
"Create an implementation plan for password reset feature"
```

The agent will:
1. Ask clarifying questions about scope
2. Define explicit scope and non-scope
3. Create all 4 plan documents
4. Place plan in `plans/in-progress/`
5. Update this index

## Plan Workflow

### 1. Create Plan
- Agent creates plan in `plans/in-progress/feature-name/`
- Plan includes all 4 documents
- Status set to "🚧 IN PROGRESS"
- Added to this index

### 2. Work on Plan
- Developer follows plan documents
- Check off items in `checklist.md` as completed
- Update documents if requirements change
- Keep plan in sync with actual implementation

### 3. Complete Plan
- Verify all checklist items are checked
- Move plan to `plans/completed/YYYY-MM-DD--feature-name/`
- Update README with "✅ COMPLETED" status and date
- Update this index

## Plan Quality Standards

Every plan must:

- ✅ Have explicit, comprehensive scope and non-scope
- ✅ Include user stories with Given/When/Then format
- ✅ Provide technical design with ASCII diagrams
- ✅ Reference actual file paths from codebase
- ✅ Include actionable tasks with checkboxes
- ✅ Define clear validation steps
- ❌ NOT include time estimates or scheduling
- ❌ NOT include placeholder content or TODOs
- ❌ NOT include fictional or unverified information

## Using Plans

### For Developers

**Starting new work:**
1. Read plan README for overview
2. Review requirements.md for scope
3. Study technical-design.md for architecture
4. Follow checklist.md for tasks

**During development:**
- Check off completed tasks
- Update plan if requirements change
- Verify implementation matches design

**Completing work:**
- Ensure all checklist items complete
- Verify all validation steps pass
- Request plan be marked complete

### For Reviewers

**Reviewing PRs:**
1. Check which plan the PR addresses
2. Verify implementation matches plan
3. Ensure checklist items covered
4. Confirm validation steps performed

### For Project Managers

**Tracking progress:**
1. Check plans/in-progress/ for active work
2. Review checklist.md for completion status
3. Monitor plans/completed/ for finished work

## Example: Authentication Plan

Here's how a completed authentication plan would look:

```
plans/completed/2024-01-15--jwt-authentication/
├── README.md                # ✅ COMPLETED 2024-01-15
├── requirements.md          # Scope: JWT login, registration, token validation
├── technical-design.md      # JwtUtil, AuthController, AuthService design
└── checklist.md             # All items checked: backend, frontend, tests, docs
```

The plan would include:
- User stories for registration and login
- JWT architecture diagram
- Implementation of controllers, services, repositories
- E2E tests with Playwright
- API documentation
- Validation that tokens work correctly

## Related Documentation

- [Project Documentation](../docs/README.md) - Diátaxis documentation
- [Gherkin Specifications](../specs/README.md) - Behavior documentation
- [API Endpoints Reference](../docs/reference/api-endpoints.md) - Backend API
- [Architecture Explanation](../docs/explanation/architecture.md) - System design

## Benefits of Structured Plans

### Before (No Plans)
- Unclear scope and requirements
- Missing implementation details
- No progress tracking
- Inconsistent quality
- Forgotten tasks

### After (With Structured Plans)
- ✅ Crystal clear scope boundaries
- ✅ Detailed technical guidance
- ✅ Trackable progress with checklists
- ✅ Consistent quality standards
- ✅ Nothing gets forgotten

Plans ensure features are built correctly, completely, and consistently.

## Contributing

When implementing a new feature:

1. Create plan first (or use existing plan)
2. Follow plan documents during implementation
3. Check off tasks as you complete them
4. Update plan if requirements change
5. Verify all validation steps before completion
6. Archive plan when fully complete

For help creating plans, use the `plan-writer` agent in Claude Code.
