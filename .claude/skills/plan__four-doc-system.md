# Skill: Plan Four-Document System

**Category**: Planning
**Purpose**: Define implementation plan structure and standards
**Used By**: plan-writer, plan-checker

---

## Overview

This skill defines the **4-Document Plan System** used in IKP-Labs for structured implementation planning. All implementation plans follow this consistent structure to ensure clarity, completeness, and trackability.

**What is the 4-Document System?**

Every implementation plan consists of **exactly 4 markdown files**:

1. **README.md** - Overview, scope, timeline (the "what" and "why")
2. **requirements.md** - Detailed functional and technical requirements (the "what exactly")
3. **technical-design.md** - Architecture, diagrams, implementation patterns (the "how")
4. **checklist.md** - Step-by-step tasks with acceptance criteria (the "execution")

**Why Use This System?**

- ✅ **Consistency** - All plans follow the same structure, easy to navigate
- ✅ **Completeness** - 4 documents ensure all aspects are covered
- ✅ **Clarity** - Separation of concerns (overview vs details vs execution)
- ✅ **Trackability** - Checklist provides clear progress tracking
- ✅ **Reviewability** - Team members can review each aspect independently
- ✅ **Reusability** - Plans serve as documentation after implementation

**Plan Directory Structure:**

```
plans/
├── in-progress/                              # Active plans
│   └── YYYY-MM-DD__feature-name/
│       ├── README.md                         # Overview (required)
│       ├── requirements.md                   # Requirements (required)
│       ├── technical-design.md               # Design (required)
│       └── checklist.md                      # Tasks (required)
├── done/                                     # Completed plans
│   └── YYYY-MM-DD__feature-name/
│       └── ... (same 4 files)
└── archived/                                 # Cancelled plans
    └── YYYY-MM-DD__feature-name/
        └── ... (same 4 files)
```

---

## Document 1: README.md

### Purpose

The **README.md** is the entry point for the plan. It provides a high-level overview that answers:
- What are we building?
- Why are we building it?
- What's the timeline?
- What's in scope / out of scope?

### Required Sections

```markdown
# [Feature Name] Implementation

**Status**: 🏗️ In Progress / ✅ Completed / ❌ Cancelled
**Created**: January 5, 2025
**Target Completion**: January 7, 2025 (Senin-Selasa)
**Priority**: P0-Critical / P1-High / P2-Medium / P3-Low
**Type**: Feature / Bugfix / Refactoring / Infrastructure / Enhancement

---

## Overview

[2-3 paragraph summary of what's being built and why]

## Problem Statement

### Current Pain Points
- [Pain point 1]
- [Pain point 2]
- [Pain point 3]

### User Pain Points
- "[User quote with specific problem]" ❌
- "[User quote with specific problem]" ❌

## Proposed Solution

[High-level description of the solution]

[Optional: Diagram/flowchart showing the solution]

## Scope

### In-Scope ✅
- [Feature/component 1]
- [Feature/component 2]
- [Feature/component 3]

### Out-of-Scope ❌
- [Explicitly state what's NOT included]
- [Future enhancements]

## Timeline

**Total Estimate**: X days / Y hours

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1: Setup | X hours | [Deliverable] |
| Phase 2: Implementation | Y hours | [Deliverable] |
| Phase 3: Testing | Z hours | [Deliverable] |

## Dependencies

- [Dependency 1: e.g., Backend API must be deployed]
- [Dependency 2: e.g., Design mockups approved]

## Success Criteria

- [✅] Criterion 1 (measurable)
- [✅] Criterion 2 (measurable)
- [✅] Criterion 3 (measurable)

## Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk 1] | High/Medium/Low | High/Medium/Low | [Strategy] |
| [Risk 2] | ... | ... | ... |

## References

- [Link to related documentation]
- [Link to design mockups]
- [Link to API specs]
```

### Best Practices

**DO:**
- ✅ Keep overview concise (2-3 paragraphs max)
- ✅ Use specific user quotes for pain points
- ✅ Define measurable success criteria
- ✅ Be explicit about what's out of scope
- ✅ Include realistic timeline with buffer

**DON'T:**
- ❌ Include implementation details (that's for technical-design.md)
- ❌ List every single task (that's for checklist.md)
- ❌ Use vague success criteria ("improve performance" → specify "reduce load time to <2s")

---

## Document 2: requirements.md

### Purpose

The **requirements.md** provides detailed functional and technical requirements. It answers:
- What exactly are the requirements?
- What are the acceptance criteria?
- What are the edge cases?

### Required Sections

```markdown
# [Feature Name] - Requirements

## Functional Requirements

### FR-1: [Requirement Name]
**Priority**: P0-Critical / P1-High / P2-Medium / P3-Low

**Description**:
[Detailed description of the requirement]

**User Story**:
```
As a [role]
I want to [action]
So that [benefit]
```

**Acceptance Criteria**:
- [✅] Given [precondition], when [action], then [expected result]
- [✅] Given [precondition], when [action], then [expected result]

**Edge Cases**:
- [Case 1: e.g., empty input, null values]
- [Case 2: e.g., maximum length exceeded]

**Example**:
[Concrete example with actual data]

---

### FR-2: [Another Requirement]
[Repeat structure above]

---

## Technical Requirements

### TR-1: [Technical Requirement]
**Priority**: P0-Critical / P1-High / P2-Medium / P3-Low

**Description**:
[Technical constraint or requirement]

**Acceptance Criteria**:
- [✅] [Technical criterion 1]
- [✅] [Technical criterion 2]

**Performance Requirements**:
- Response time: [e.g., < 200ms for API calls]
- Throughput: [e.g., handle 1000 concurrent users]
- Availability: [e.g., 99.9% uptime]

---

## Non-Functional Requirements

### NFR-1: Security
- [Requirement 1: e.g., JWT authentication required]
- [Requirement 2: e.g., Input validation against XSS]

### NFR-2: Accessibility
- [Requirement 1: e.g., WCAG 2.1 AA compliance]
- [Requirement 2: e.g., Keyboard navigation support]

### NFR-3: Testing
- [Requirement 1: e.g., ≥80% code coverage]
- [Requirement 2: e.g., E2E tests for critical paths]

---

## Data Requirements

### DR-1: Database Schema
[Description of new tables/fields needed]

**Tables**:
| Table | Fields | Relationships |
|-------|--------|---------------|
| [table_name] | [field1, field2] | [foreign keys] |

### DR-2: API Endpoints
[List of new/modified endpoints]

**Endpoints**:
| Method | Endpoint | Request | Response |
|--------|----------|---------|----------|
| POST | /api/... | {...} | {...} |

---

## Requirements Traceability Matrix

| Requirement ID | Test Coverage | Documentation | Status |
|---------------|---------------|---------------|--------|
| FR-1 | test-1.spec.ts | api-docs.md | ✅ |
| FR-2 | test-2.spec.ts | user-guide.md | 🔄 |
```

### Best Practices

**DO:**
- ✅ Use user stories format for functional requirements
- ✅ Define clear acceptance criteria (testable)
- ✅ Include concrete examples with actual data
- ✅ Specify performance metrics (numbers, not "fast")
- ✅ Map requirements to test coverage

**DON'T:**
- ❌ Mix functional and technical requirements (separate them)
- ❌ Use vague criteria ("should work well" → specify "response time <200ms")
- ❌ Forget edge cases (null, empty, max, min)

---

## Document 3: technical-design.md

### Purpose

The **technical-design.md** describes how the solution will be implemented. It answers:
- How will this be built?
- What's the architecture?
- What are the implementation patterns?

### Required Sections

```markdown
# [Feature Name] - Technical Design

## Architecture Overview

[High-level description of the architecture]

**System Architecture Diagram**:
```
[ASCII art or mermaid diagram showing components]
```

**Components**:
- **Component 1**: [Description and responsibility]
- **Component 2**: [Description and responsibility]

---

## Frontend Design

### Component Structure

```
src/
├── components/
│   ├── FeatureName/
│   │   ├── FeatureComponent.tsx
│   │   ├── FeatureComponent.test.tsx
│   │   └── FeatureComponent.module.css
│   └── ...
├── services/
│   └── featureService.ts
└── types/
    └── feature.types.ts
```

### Component Specifications

#### Component 1: [ComponentName]

**Props**:
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| prop1 | string | Yes | - | [Description] |
| prop2 | number | No | 0 | [Description] |

**State**:
| State | Type | Initial | Description |
|-------|------|---------|-------------|
| state1 | boolean | false | [Description] |

**Hooks Used**:
- `useState` - [purpose]
- `useEffect` - [purpose]
- `useCustomHook` - [purpose]

**Example Usage**:
```typescript
<ComponentName prop1="value" prop2={10} />
```

---

## Backend Design

### API Endpoints

#### Endpoint 1: POST /api/feature

**Request**:
```json
{
  "field1": "string",
  "field2": 123
}
```

**Response (200 OK)**:
```json
{
  "id": 456,
  "status": "success"
}
```

**Response (400 Bad Request)**:
```json
{
  "error": "Validation failed",
  "details": ["field1 is required"]
}
```

**Implementation**:
- **Controller**: `FeatureController.java`
- **Service**: `FeatureService.java`
- **Repository**: `FeatureRepository.java`

---

### Database Schema

**New Tables**:

```sql
CREATE TABLE feature_data (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  data VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_user_id ON feature_data(user_id);
```

**Modified Tables**:
- `users` table: Add column `feature_enabled BOOLEAN DEFAULT FALSE`

---

## Data Flow

**Sequence Diagram**:
```
User → Frontend → Backend → Database
  1. User clicks button
  2. Frontend sends POST /api/feature
  3. Backend validates request
  4. Backend saves to database
  5. Backend returns response
  6. Frontend updates UI
```

---

## State Management

[If using Redux, Context, or other state management]

**State Shape**:
```typescript
interface FeatureState {
  data: FeatureData[];
  loading: boolean;
  error: string | null;
}
```

**Actions**:
- `FETCH_FEATURE_REQUEST`
- `FETCH_FEATURE_SUCCESS`
- `FETCH_FEATURE_FAILURE`

---

## Error Handling

| Error Type | HTTP Status | User Message | Action |
|-----------|-------------|--------------|--------|
| Validation | 400 | "Invalid input" | Show error in form |
| Auth | 401 | "Please login" | Redirect to login |
| Not Found | 404 | "Not found" | Show empty state |
| Server | 500 | "Try again later" | Show retry button |

---

## Security Considerations

- **Authentication**: JWT token required in `Authorization` header
- **Input Validation**: Sanitize all user inputs (XSS prevention)
- **SQL Injection**: Use parameterized queries (JPA/Hibernate)
- **CORS**: Configure allowed origins in Spring Security
- **Rate Limiting**: Max 100 requests/minute per user

---

## Performance Optimization

- **Caching**: Cache API responses for 5 minutes (Redis)
- **Lazy Loading**: Load images on scroll (Intersection Observer)
- **Debouncing**: Debounce search input (300ms delay)
- **Pagination**: Load 12 items per page
- **Database**: Add indexes on frequently queried columns

---

## Testing Strategy

### Unit Tests
- [ ] All service methods (≥80% coverage)
- [ ] All React components (≥70% coverage)
- [ ] All utility functions (100% coverage)

### Integration Tests
- [ ] API endpoints (all CRUD operations)
- [ ] Database queries (repository layer)

### E2E Tests
- [ ] Happy path (user workflow end-to-end)
- [ ] Error scenarios (validation, auth failures)

---

## Deployment Plan

1. **Backend**: Deploy to staging → Run integration tests → Deploy to production
2. **Frontend**: Build → Deploy to CDN → Verify smoke tests
3. **Database**: Run migrations (backward compatible)
4. **Feature Flag**: Enable for 10% users → Monitor → Roll out 100%

---

## Rollback Plan

If deployment fails:
1. Revert backend to previous version (Docker tag)
2. Revert frontend build (rollback CDN)
3. Database: Migrations are backward compatible (no rollback needed)
```

### Best Practices

**DO:**
- ✅ Include ASCII diagrams for architecture
- ✅ Specify all API contracts (request/response)
- ✅ Define database schema with SQL
- ✅ Document error handling strategy
- ✅ Include security and performance considerations

**DON'T:**
- ❌ Write actual implementation code (just patterns/examples)
- ❌ Leave diagrams as "TODO" (create them upfront)
- ❌ Forget rollback plan (always have exit strategy)

---

## Document 4: checklist.md

### Purpose

The **checklist.md** provides a step-by-step execution plan. It answers:
- What are the exact tasks?
- In what order should they be done?
- What are the acceptance criteria for each task?
- What commits are needed?

### Required Sections

```markdown
# [Feature Name] - Implementation Checklist

## Status Legend
- [ ] Not started
- [🔄] In progress
- [✅] Completed
- [⏸️] Blocked/Waiting

---

## Phase 1: [Phase Name] (Day/Time - Estimated Duration)

### Task 1.1: [Task Name] (Duration)
**Goal**: [One-sentence description of what this task achieves]

**Steps**:
1. [ ] Sub-step 1
2. [ ] Sub-step 2
3. [ ] Sub-step 3
4. [ ] **COMMIT [N]**: "type(scope): commit message"

**Acceptance Criteria**:
- [✅] Criterion 1 (verifiable)
- [✅] Criterion 2 (verifiable)
- [✅] Criterion 3 (verifiable)

**Verification**:
```bash
# Commands to verify the task is complete
npm test
npm run build
```

**Dependencies**:
- Requires: [Task X.Y to be completed first]
- Blocks: [Task Z.W cannot start until this is done]

---

### Task 1.2: [Another Task] (Duration)
[Repeat structure above]

---

## Phase 2: [Another Phase] (Day/Time - Estimated Duration)

### Task 2.1: [Task Name] (Duration)
[Repeat structure above]

---

## Commit Summary

Total Commits: [N]

| Commit # | Type | Scope | Message | Files Changed |
|----------|------|-------|---------|---------------|
| 1 | feat | gallery | Add sorting dropdown | 3 files (+120, -5) |
| 2 | feat | api | Add sort endpoint | 2 files (+80, -0) |
| 3 | test | e2e | Add sorting tests | 1 file (+150, -0) |
| ... | ... | ... | ... | ... |

---

## Progress Tracking

**Overall Progress**: X/Y tasks completed (Z%)

| Phase | Tasks Completed | Tasks Total | Status |
|-------|----------------|-------------|--------|
| Phase 1 | 3 | 5 | 🔄 In Progress |
| Phase 2 | 0 | 4 | [ ] Not Started |
| Phase 3 | 0 | 3 | [ ] Not Started |

**Last Updated**: [Date and time of last update]
```

### Task Breakdown Guidelines

**Good Task Characteristics:**

1. **Atomic** - Can be completed in one sitting (15-60 min)
2. **Clear** - Obvious what needs to be done
3. **Verifiable** - Has objective acceptance criteria
4. **Ordered** - Dependencies are clear
5. **Committable** - Results in a meaningful commit

**Task Size Guidelines:**

| Duration | Task Type | Example |
|----------|-----------|---------|
| 10-15 min | Setup/Config | Create directory structure |
| 20-30 min | Simple Feature | Add single UI component |
| 45-60 min | Medium Feature | Implement API endpoint with tests |
| 2-3 hours | Complex Feature | Multi-component feature (split into subtasks) |

**Breaking Down Large Tasks:**

If a task is >1 hour, break it down:

❌ **Bad** (Too Large):
```markdown
### Task 1.1: Implement Gallery Sorting (4 hours)
1. [ ] Add UI dropdown
2. [ ] Add backend API
3. [ ] Add tests
4. [ ] Update documentation
```

✅ **Good** (Atomic):
```markdown
### Task 1.1: Add Sorting Dropdown UI (30 min)
1. [ ] Create SortDropdown component
2. [ ] Add dropdown to Gallery page
3. [ ] **COMMIT 1**: "feat(gallery): add sorting dropdown UI"

### Task 1.2: Implement Sort API Endpoint (45 min)
1. [ ] Add sortBy parameter to controller
2. [ ] Implement sorting logic in service
3. [ ] Add unit tests
4. [ ] **COMMIT 2**: "feat(api): add gallery sort endpoint"

### Task 1.3: Add E2E Tests (30 min)
1. [ ] Add sorting test scenarios
2. [ ] Verify URL updates
3. [ ] **COMMIT 3**: "test(e2e): add gallery sorting tests"
```

### Best Practices

**DO:**
- ✅ Keep tasks atomic (15-60 min each)
- ✅ Define clear acceptance criteria (testable)
- ✅ Specify exact commit messages upfront
- ✅ Include verification commands
- ✅ Update progress regularly

**DON'T:**
- ❌ Create tasks >2 hours (break them down)
- ❌ Use vague task names ("Fix stuff", "Update code")
- ❌ Forget to specify commit message
- ❌ Mix multiple concerns in one task

---

## Plan Lifecycle

### 1. Creation (in-progress/)

**When**: At the start of a new feature/project

**Steps**:
1. Create directory: `plans/in-progress/YYYY-MM-DD__feature-name/`
2. Create all 4 documents: README.md, requirements.md, technical-design.md, checklist.md
3. Fill in all required sections (no placeholders!)
4. Commit: `docs(plan): add [feature-name] implementation plan`

**Status**: 🏗️ In Progress

---

### 2. Execution (in-progress/)

**During**: While implementing the feature

**Updates**:
- Mark checklist tasks as [🔄] In progress or [✅] Completed
- Update README.md status if blocked: ⏸️ Blocked
- Add notes/learnings to technical-design.md if design changes
- Update progress tracking section regularly

**Commits**: Update plan as tasks complete (optional, not required)

---

### 3. Completion (done/)

**When**: All checklist tasks are ✅ Completed

**Steps**:
1. Verify all acceptance criteria met
2. Update README.md:
   - Status: 🏗️ In Progress → ✅ Completed
   - Add "Completed" date
3. Move directory: `plans/in-progress/` → `plans/done/`
4. Commit: `docs(plan): mark [feature-name] as completed`

**Verification Checklist**:
- [ ] All checklist tasks marked [✅]
- [ ] All acceptance criteria met
- [ ] All commits pushed to repository
- [ ] All documentation updated
- [ ] All tests passing

---

### 4. Cancellation (archived/)

**When**: Feature is cancelled/deprioritized

**Steps**:
1. Update README.md:
   - Status: 🏗️ In Progress → ❌ Cancelled
   - Add "Cancellation Reason" section
2. Move directory: `plans/in-progress/` → `plans/archived/`
3. Commit: `docs(plan): archive [feature-name] plan`

---

## Common Anti-Patterns

### ❌ 1. Placeholder Content

**Bad**:
```markdown
## Technical Design

TODO: Add architecture diagram
TODO: Define API endpoints
Coming soon...
```

**Why Bad**: Plan is incomplete, can't be used for implementation

**Fix**: Complete all sections before starting implementation

---

### ❌ 2. Missing Acceptance Criteria

**Bad**:
```markdown
### Task 1.1: Add sorting feature
- [ ] Implement sorting
- [ ] Test it
```

**Why Bad**: Unclear what "done" means, no way to verify

**Fix**: Add specific, measurable criteria
```markdown
### Task 1.1: Add sorting feature (30 min)
**Acceptance Criteria**:
- [✅] Dropdown shows 4 sort options
- [✅] URL updates to include ?sortBy parameter
- [✅] Photos reorder within 500ms
```

---

### ❌ 3. Vague Timeline

**Bad**:
```markdown
**Target Completion**: Soon / This week / TBD
```

**Why Bad**: No clear deadline, hard to track progress

**Fix**: Use specific dates
```markdown
**Target Completion**: January 10, 2025 (Rabu)
```

---

### ❌ 4. No Scope Definition

**Bad**:
```markdown
## Overview
Implement sorting feature
```

**Why Bad**: Unclear what's included, scope creep likely

**Fix**: Explicitly define in-scope and out-of-scope
```markdown
### In-Scope ✅
- Gallery page sorting (4 options)
- URL parameter persistence

### Out-of-Scope ❌
- Sorting on other pages (future enhancement)
- Custom sort preferences saved to profile
```

---

### ❌ 5. Outdated Plan

**Bad**: Plan created but never updated during implementation

**Why Bad**: Plan and reality diverge, plan becomes useless

**Fix**: Update checklist as tasks complete, note changes in technical-design.md

---

## Example: Good vs Bad Plans

### ❌ Bad Plan

```markdown
# My Feature

TODO: Write overview

## Requirements
- Add feature X
- Make it work

## Design
See code

## Tasks
- [ ] Do frontend
- [ ] Do backend
- [ ] Test
```

**Problems**:
- Placeholder content (TODO)
- Vague requirements ("make it work")
- No technical details
- Tasks too large, no acceptance criteria

---

### ✅ Good Plan

See actual example: `plans/done/2024-12-28__gallery-sorting-feature/`

**Strengths**:
- ✅ Complete overview with problem statement
- ✅ Detailed requirements with user stories
- ✅ Technical design with ASCII diagrams
- ✅ Atomic tasks with clear acceptance criteria
- ✅ Progress tracking updated throughout
- ✅ Moved to done/ when completed

---

## Validation Checklist

Before considering a plan "complete", verify:

### README.md
- [ ] **Status** line present with emoji
- [ ] **Timeline** specified with dates
- [ ] **Problem Statement** describes current pain points
- [ ] **Scope** explicitly defines in-scope and out-of-scope
- [ ] **Success Criteria** are measurable

### requirements.md
- [ ] **Functional Requirements** use user story format
- [ ] **Acceptance Criteria** are testable (Given/When/Then)
- [ ] **Edge Cases** identified and documented
- [ ] **Examples** include concrete data (not placeholders)

### technical-design.md
- [ ] **Architecture Diagram** present (ASCII or mermaid)
- [ ] **API Contracts** specify request/response format
- [ ] **Database Schema** uses SQL DDL
- [ ] **Error Handling** strategy defined
- [ ] **Security** considerations documented

### checklist.md
- [ ] **Tasks** are atomic (15-60 min each)
- [ ] **Acceptance Criteria** defined for each task
- [ ] **Commit Messages** specified in advance
- [ ] **Dependencies** between tasks documented
- [ ] **Progress Tracking** section present

---

## Related Skills

- **docs__quality-standards** - For documentation writing style
- **docs__diataxis-framework** - For categorizing implementation docs
- **wow__criticality-assessment** - For prioritizing plan tasks

---

**Last Updated**: January 7, 2026
**Version**: 1.0
