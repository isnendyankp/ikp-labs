# Create Implementation Plans

Learn how to create comprehensive implementation plans using the 4-document system to ensure successful project execution.

## What are Implementation Plans?

Implementation plans are structured documents that define what you're building, why you're building it, how you'll build it, and the specific steps to complete it. The 4-document system ensures clarity, feasibility, and traceability throughout the development lifecycle.

## The 4-Document System

### Required Documents

| Document | Purpose | Audience |
|----------|---------|----------|
| **README.md** | Overview, objectives, deliverables | Stakeholders, team |
| **requirements.md** | Functional & non-functional requirements | Developers, testers |
| **technical-design.md** | Architecture, data models, API specs | Developers, architects |
| **checklist.md** | Atomic tasks with time estimates | Developers implementing |

### Document Relationships

```
README.md (Overview)
    ↓
requirements.md (What to build)
    ↓
technical-design.md (How to build)
    ↓
checklist.md (Step-by-step tasks)
```

---

## Quick Start

### Step 1: Create Plan Directory

```bash
# Create new plan in in-progress/
mkdir -p plans/in-progress/feature-name
cd plans/in-progress/feature-name
```

### Step 2: Use plan-writer Agent

Invoke the plan-writer agent to create your plan:

```bash
@plan-writer
```

The agent will guide you through creating all 4 documents.

### Step 3: Validate Your Plan

Before starting implementation, validate your plan:

```bash
@plan-checker
```

Fix any CRITICAL or HIGH issues found.

### Step 4: Start Implementation

Once validated, begin implementing tasks from checklist.md.

---

## Document Structure

### 1. README.md

**Purpose:** High-level overview of the feature/project

**Required Sections:**

```markdown
# [Feature Name]

## Overview
[Brief description of what this feature does and why it's needed]

## Objectives
- [Objective 1]
- [Objective 2]
- [Objective 3]

## Scope

### In-Scope
- [Feature/Component 1]
- [Feature/Component 2]

### Out-of-Scope
- [Feature explicitly NOT included]
- [Feature deferred to future]

## Key Deliverables
- [Deliverable 1]
- [Deliverable 2]

## Timeline/Milestones
- [ ] Phase 1: [Description] - Week 1
- [ ] Phase 2: [Description] - Week 2
- [ ] Phase 3: [Description] - Week 3

## Success Criteria
- [ ] [Measurable success criteria 1]
- [ ] [Measurable success criteria 2]

## Related Documentation
- [Link to related specs/docs]
```

**Example:**

```markdown
# Gallery Sorting

## Overview
Add ability for users to sort gallery photos by newest, oldest, most liked, or most favorited. This improves user experience by allowing personalized photo organization.

## Objectives
- Enable multiple sorting options for gallery photos
- Maintain sorting preference across sessions
- Provide visual feedback for active sort option
- Ensure sorting works with pagination

## Scope

### In-Scope
- Sort by newest (upload date descending)
- Sort by oldest (upload date ascending)
- Sort by most liked (like count descending)
- Sort by most favorited (favorite count descending)
- Persist sort preference in localStorage

### Out-of-Scope
- Custom sort order
- Sort by multiple criteria
- Admin-defined sort orders

## Key Deliverables
- Backend API endpoint: GET /api/photos?sort=field
- Frontend sort dropdown component
- Updated gallery to use sorting
- E2E tests for all sort options
- API documentation

## Timeline/Milestones
- [ ] Phase 1: Backend sorting implementation - Week 1, Days 1-2
- [ ] Phase 2: Frontend sort controls - Week 1, Days 3-4
- [ ] Phase 3: Testing & documentation - Week 1, Day 5

## Success Criteria
- [ ] Users can sort by all 4 options
- [ ] Sort preference persists across sessions
- [ ] API responds in <200ms for sorted queries
- [ ] E2E tests pass for all sort options
- [ ] 100% code coverage for sorting logic
```

---

### 2. requirements.md

**Purpose:** Detailed functional and non-functional requirements

**Required Sections:**

```markdown
# [Feature Name] - Requirements

## Functional Requirements

### FR-001: [Requirement Title]
**Description:** [Detailed description]

**Acceptance Criteria:**
- [ ] [Specific, testable criterion 1]
- [ ] [Specific, testable criterion 2]

**Priority:** [Must Have / Should Have / Could Have]

### FR-002: [Requirement Title]
...

## Non-Functional Requirements

### NFR-001: Performance
- [Performance requirement with metric]

### NFR-002: Security
- [Security requirement]

### NFR-003: Scalability
- [Scalability requirement]

## User Stories

### US-001: [Actor] wants to [action] so that [benefit]
**As a** [role]
**I want to** [action]
**So that** [benefit]

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Constraints & Assumptions

### Constraints
- [Technical constraint]
- [Business constraint]
- [Time constraint]

### Assumptions
- [Assumption 1]
- [Assumption 2]
```

**Example:**

```markdown
# Gallery Sorting - Requirements

## Functional Requirements

### FR-001: Sort by Upload Date
**Description:** Users can sort photos by newest or oldest upload date.

**Acceptance Criteria:**
- [ ] "Newest" option shows photos in descending order by upload date
- [ ] "Oldest" option shows photos in ascending order by upload date
- [ ] Selected sort option is visually indicated
- [ ] Sort applies to all photos across paginated pages

**Priority:** Must Have

### FR-002: Sort by Engagement
**Description:** Users can sort photos by most liked or most favorited.

**Acceptance Criteria:**
- [ ] "Most Liked" option shows photos by like count descending
- [ ] "Most Favorited" option shows photos by favorite count descending
- [ ] Photos with zero counts appear at the end
- [ ] Sort updates in real-time as likes/favorites change

**Priority:** Must Have

### FR-003: Persist Sort Preference
**Description:** User's sort selection persists across browser sessions.

**Acceptance Criteria:**
- [ ] Selected sort option saved to localStorage
- [ ] On page reload, last selected sort is applied
- [ ] Default to "newest" if no preference saved
- [ ] Preference clears on logout

**Priority:** Should Have

## Non-Functional Requirements

### NFR-001: Performance
- Sorted API queries must respond in <200ms (p95)
- Frontend sort option change must render in <100ms
- Database queries must use appropriate indexes

### NFR-002: Security
- Sort input must be validated against allowed values
- SQL injection protection for sort parameters
- No sensitive data exposed in sort queries

### NFR-003: Compatibility
- Works on Chrome, Firefox, Safari (latest 2 versions)
- Works on mobile browsers (iOS Safari, Chrome Mobile)
- Degrades gracefully if JavaScript disabled

## User Stories

### US-001: View Recent Photos
**As a** user
**I want to** see my most recently uploaded photos first
**So that** I can quickly find new content

**Acceptance Criteria:**
- [ ] "Newest" is the default sort option
- [ ] Most recent photos appear first
- [ ] Upload date is displayed on each photo

### US-002: View Popular Photos
**As a** user
**I want to** see photos with most likes/favorites
**So that** I can discover popular content

**Acceptance Criteria:**
- [ ] Can sort by most liked or most favorited
- [ ] Like/favorite counts are visible
- [ ] Sort order updates as counts change

## Constraints & Assumptions

### Constraints
- Must use existing PostgreSQL database
- Must maintain pagination (12 photos per page)
- Cannot change existing photo schema without migration
- Implementation must complete in 1 week

### Assumptions
- Users have JavaScript enabled
- Photos have like_count and favorite_count fields
- Database has indexes on created_at, like_count, favorite_count
- Frontend uses React with TypeScript
```

---

### 3. technical-design.md

**Purpose:** Technical architecture and implementation details

**Required Sections:**

```markdown
# [Feature Name] - Technical Design

## Architecture Overview
[High-level architecture diagram/description]

## Data Models

### Database Schema Changes
```sql
-- Schema changes, new tables, migrations
```

### Entity Relationships
[Entity-relationship description]

## API Specifications

### [Endpoint Name]
**Method:** GET /api/resource

**Authentication:** Required

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| param1 | string | Yes | Description |

**Response:**
```json
{
  "field": "value"
}
```

**Error Responses:**
- 400 Bad Request: Invalid parameters
- 401 Unauthorized: Not authenticated
- 404 Not Found: Resource not found

## Component Design

### Frontend Components

#### [ComponentName]
**Purpose:** [Component purpose]

**Props:** [TypeScript interface]
**State:** [React state]
**Behavior:** [Component behavior]

### Backend Components

#### [Service/Controller Name]
**Purpose:** [Component purpose]
**Methods:** [Key methods]

## Security Considerations
- [Security consideration 1]
- [Security consideration 2]

## Error Handling Strategy
- [Error handling approach]
- [User-facing error messages]

## Testing Strategy
- Unit tests: [What to test]
- Integration tests: [What to test]
- E2E tests: [What to test]

## Deployment Considerations
- [Deployment notes]
- [Migration requirements]
- [Rollback plan]
```

**Example:**

```markdown
# Gallery Sorting - Technical Design

## Architecture Overview

```
┌─────────────────┐      ┌─────────────────┐
│   Frontend      │      │    Backend      │
│   (Next.js)     │      │  (Spring Boot)   │
├─────────────────┤      ├─────────────────┤
│                 │      │                 │
│ SortDropdown    │─────▶│ PhotoController │
│                 │      │                 │
│ PhotoGrid       │─────▶│ PhotoService    │
│                 │      │                 │
└─────────────────┘      │ PhotoRepository │
         │               │                 │
         │               └─────────────────┘
         │                      │
         │                      ▼
         │               ┌─────────────────┐
         │               │   PostgreSQL    │
         │               │   (photos table) │
         │               └─────────────────┘
         │
         ▼
┌─────────────────┐
│   localStorage  │
│  (preferences)  │
└─────────────────┘
```

## Data Models

### Database Schema

**Existing Table:** `photos`

```sql
CREATE TABLE photos (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  filename VARCHAR(255) NOT NULL,
  content_type VARCHAR(100),
  file_size BIGINT,
  like_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for sorting
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);
CREATE INDEX idx_photos_like_count ON photos(like_count DESC);
CREATE INDEX idx_photos_favorite_count ON photos(favorite_count DESC);
CREATE INDEX idx_photos_user_id ON photos(user_id);
```

**No schema changes required** - using existing fields.

## API Specifications

### Get Sorted Photos
**Endpoint:** `GET /api/photos`

**Authentication:** Required (JWT token)

**Request Parameters:**
| Parameter | Type | Required | Description | Valid Values |
|-----------|------|----------|-------------|--------------|
| page | integer | No | Page number (default: 1) | ≥1 |
| limit | integer | No | Items per page (default: 12) | 1-50 |
| sort | string | No | Sort field | newest, oldest, mostLiked, mostFavorited |

**Example Request:**
```http
GET /api/photos?page=1&limit=12&sort=mostLiked
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": 123,
      "filename": "photo.jpg",
      "likeCount": 42,
      "favoriteCount": 15,
      "createdAt": "2026-01-09T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 156,
    "totalPages": 13
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid sort parameter
  ```json
  {
    "error": "Invalid sort parameter. Must be one of: newest, oldest, mostLiked, mostFavorited"
  }
  ```
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Database error

### Backend Implementation

**PhotoController.java:**
```java
@GetMapping("/photos")
public ResponseEntity<PhotoPageResponse> getPhotos(
    @RequestParam(defaultValue = "1") int page,
    @RequestParam(defaultValue = "12") int limit,
    @RequestParam(defaultValue = "newest") String sort
) {
    // Validate sort parameter
    if (!isValidSort(sort)) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("Invalid sort parameter"));
    }

    // Get photos
    Page<Photo> photos = photoService.getPhotos(page, limit, sort);
    return ResponseEntity.ok(PhotoPageResponse.from(photos));
}
```

**PhotoService.java:**
```java
public Page<Photo> getPhotos(int page, int limit, String sort) {
    Pageable pageable = createPageable(page, limit, sort);
    return photoRepository.findAllByUserId(userId, pageable);
}

private Pageable createPageable(int page, int limit, String sort) {
    Sort sortObj = switch (sort) {
        case "newest" -> Sort.by("createdAt").descending();
        case "oldest" -> Sort.by("createdAt").ascending();
        case "mostLiked" -> Sort.by("likeCount").descending();
        case "mostFavorited" -> Sort.by("favoriteCount").descending();
        default -> Sort.by("createdAt").descending();
    };
    return PageRequest.of(page - 1, limit, sortObj);
}
```

## Component Design

### Frontend Components

#### SortDropdown
**File:** `frontend/src/components/gallery/SortDropdown.tsx`

**Purpose:** Allow users to select sort option

**Props:**
```typescript
interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

type SortOption = 'newest' | 'oldest' | 'mostLiked' | 'mostFavorited';
```

**State:**
```typescript
const [isOpen, setIsOpen] = useState(false);
```

**Behavior:**
- Opens dropdown on click
- Displays 4 sort options
- Highlights current selection
- Closes on option selection or outside click

**Example Implementation:**
```typescript
export function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const options = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'mostLiked', label: 'Most Liked' },
    { value: 'mostFavorited', label: 'Most Favorited' },
  ];

  return (
    <div className="sort-dropdown">
      <label htmlFor="sort-select">Sort by:</label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

#### PhotoGrid (Modified)
**File:** `frontend/src/components/gallery/PhotoGrid.tsx`

**Changes:**
- Add `sort` state
- Add `onSortChange` handler
- Pass `sort` parameter to API

```typescript
const [sort, setSort] = useState<SortOption>('newest');
const [photos, setPhotos] = useState<Photo[]>([]);

// Load photos with sort
const loadPhotos = async (sortOption: SortOption) => {
  const response = await galleryService.getPhotos({ sort: sortOption });
  setPhotos(response.data);
};

// Handle sort change
const handleSortChange = (newSort: SortOption) => {
  setSort(newSort);
  saveSortPreference(newSort); // Save to localStorage
  loadPhotos(newSort);
};
```

## Security Considerations

### Input Validation
- Sort parameter validated against whitelist: `[newest, oldest, mostLiked, mostFavorited]`
- Page and limit parameters validated as integers
- SQL injection prevented via parameterized queries

### Authorization
- JWT token required for all requests
- Users can only see their own photos (user_id filter)

### Data Privacy
- No sensitive data exposed in sort queries
- User preferences stored locally (not server-side)

## Error Handling Strategy

### Frontend Errors
```typescript
try {
  const photos = await galleryService.getPhotos({ sort });
  setPhotos(photos.data);
} catch (error) {
  if (error.response?.status === 400) {
    showError('Invalid sort option');
  } else if (error.response?.status === 401) {
    showError('Please log in');
    redirectToLogin();
  } else {
    showError('Failed to load photos');
  }
}
```

### Backend Errors
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Invalid token
- `500 Internal Server Error`: Database failure (logged)

## Testing Strategy

### Unit Tests
- `SortOption` enum validation
- `createPageable()` sort logic
- `isValidSort()` validation

### Integration Tests
- `GET /api/photos?sort=mostLiked` returns photos sorted by likes
- `GET /api/photos?sort=invalid` returns 400
- Unauthenticated request returns 401

### E2E Tests
```typescript
test('sort photos by most liked', async ({ page }) => {
  await page.goto('/gallery');
  await page.getByRole('combobox', { name: 'Sort by' }).selectOption('mostLiked');
  await expect(page.locator('.photo-card').first())
    .toContainText('Likes: 999');
});

test('sort preference persists', async ({ page }) => {
  await page.goto('/gallery');
  await page.getByRole('combobox').selectOption('oldest');
  await page.reload();
  await expect(page.getByRole('combobox')).toHaveValue('oldest');
});
```

## Deployment Considerations

### Database Migration
- No schema changes required
- Verify indexes exist: `idx_photos_created_at`, `idx_photos_like_count`, `idx_photos_favorite_count`
- If indexes don't exist, run:
  ```sql
  CREATE INDEX CONCURRENTLY idx_photos_created_at ON photos(created_at DESC);
  CREATE INDEX CONCURRENTLY idx_photos_like_count ON photos(like_count DESC);
  CREATE INDEX CONCURRENTLY idx_photos_favorite_count ON photos(favorite_count DESC);
  ```

### Rollback Plan
- Remove sort parameter from API calls (defaults to newest)
- Hide sort dropdown component
- No data migration needed (no schema changes)

### Monitoring
- Monitor API response time (target: <200ms p95)
- Monitor database query performance
- Log invalid sort parameter attempts
```

---

### 4. checklist.md

**Purpose:** Atomic tasks with time estimates

**Required Sections:**

```markdown
# [Feature Name] - Implementation Checklist

## Phase 1: [Phase Name] ([Time Estimate])

### Backend
- [ ] [Task description] ([time estimate])
- [ ] [Task description] ([time estimate])

### Frontend
- [ ] [Task description] ([time estimate])
- [ ] [Task description] ([time estimate])

## Phase 2: [Phase Name] ([Time Estimate])

### Testing
- [ ] [Task description] ([time estimate])
- [ ] [Task description] ([time estimate])

### Documentation
- [ ] [Task description] ([time estimate])
- [ ] [Task description] ([time estimate])

## Total Time Estimate: [Total hours]

## Commit Strategy
Each task = 1 atomic commit with descriptive message.

## Definition of Done
- [ ] All tasks completed
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Deployed to staging
```

**Task Size Guidelines:**

| Duration | Task Type | Example | Action |
|----------|-----------|---------|--------|
| <10 min | Too Small | "Add import" | ❌ Merge with other tasks |
| 10-15 min | Setup | "Create directory" | ✅ Good |
| 20-30 min | Simple | "Add UI component" | ✅ Good |
| 45-60 min | Medium | "API endpoint + tests" | ✅ Good |
| >60 min | Too Large | "Build entire feature" | ❌ Break down |

**Example:**

```markdown
# Gallery Sorting - Implementation Checklist

## Phase 1: Backend Sorting (2 hours)

### Setup
- [ ] Create feature branch `feature/gallery-sorting` (10 min)
- [ ] Verify database indexes exist (15 min)

### API Implementation
- [ ] Add `sort` parameter to PhotoController (30 min)
- [ ] Implement `createPageable()` with sort logic (45 min)
- [ ] Add sort parameter validation (15 min)
- [ ] Add unit tests for sort logic (30 min)

### API Testing
- [ ] Write integration test: sort by newest (20 min)
- [ ] Write integration test: sort by mostLiked (20 min)
- [ ] Write integration test: invalid sort returns 400 (15 min)

**Phase 1 Subtotal: 3 hours**

---

## Phase 2: Frontend Controls (2 hours)

### Components
- [ ] Create SortDropdown component (30 min)
- [ ] Add SortOption type definition (10 min)
- [ ] Integrate SortDropdown into PhotoGrid (30 min)
- [ ] Add sort state management (30 min)
- [ ] Implement sort preference localStorage (20 min)

### API Integration
- [ ] Update galleryService to accept sort parameter (20 min)
- [ ] Handle API errors for invalid sort (15 min)

**Phase 2 Subtotal: 2.5 hours**

---

## Phase 3: Testing & Documentation (2 hours)

### E2E Tests
- [ ] Test: sort by newest (20 min)
- [ ] Test: sort by mostLiked (20 min)
- [ ] Test: sort preference persists (20 min)
- [ ] Test: invalid sort handled gracefully (15 min)

### Documentation
- [ ] Update API documentation (20 min)
- [ ] Add JSDoc to SortDropdown (15 min)
- [ ] Update README with sort feature (10 min)

### Code Review
- [ ] Self-review and cleanup (20 min)
- [ ] Create pull request (10 min)

**Phase 3 Subtotal: 2.5 hours**

---

## Phase 4: Deployment (1 hour)

### Staging
- [ ] Deploy to staging environment (20 min)
- [ ] Manual QA testing on staging (20 min)

### Production
- [ ] Deploy to production (10 min)
- [ ] Smoke test on production (10 min)

**Phase 4 Subtotal: 1 hour**

---

## Total Time Estimate: 9 hours

## Commit Strategy

**Phase 1 Commits:**
1. `feat(photo): add sort parameter to controller`
2. `feat(photo): implement sort logic with Pageable`
3. `test(photo): add sort validation tests`
4. `test(photo): add integration tests for sorting`

**Phase 2 Commits:**
5. `feat(gallery): create SortDropdown component`
6. `feat(gallery): integrate sort controls`
7. `feat(gallery): add sort preference persistence`

**Phase 3 Commits:**
8. `test(e2e): add sorting scenarios`
9. `docs(api): update API documentation`
10. `docs(readme): document sort feature`

**Phase 4 Commits:**
11. `chore(release): deploy gallery sorting to production`

## Definition of Done
- [ ] All 11 commits pushed to main
- [ ] All tests pass (unit, integration, E2E)
- [ ] Code coverage ≥70% frontend, ≥80% backend
- [ ] API documentation updated
- [ ] No console errors in production
- [ ] Manual QA completed on staging
```

---

## Best Practices

### DO ✅

1. **Write atomic tasks**
   - Each task 15-60 minutes
   - One task = one commit
   - Clear, testable outcomes

2. **Use testable acceptance criteria**
   - Specific metrics (e.g., "API responds in <200ms")
   - Binary outcomes (pass/fail)
   - INVEST principles (Independent, Negotiable, Valuable, Estimable, Small, Testable)

3. **Cross-reference documents**
   - README → requirements (refer to specific FRs)
   - requirements → technical-design (implementation details)
   - technical-design → checklist (tasks for each component)

4. **Validate before implementing**
   - Always run `@plan-checker` before starting
   - Fix CRITICAL and HIGH issues first
   - Re-validate after major changes

5. **Keep plans updated**
   - Mark tasks as completed in checklist
   - Update timeline if scope changes
   - Move to `plans/done/` when complete

### DON'T ❌

1. **Don't write vague tasks**
   - ❌ "Implement sorting" (too large, unclear)
   - ✅ "Add sort parameter to PhotoController endpoint" (specific, atomic)

2. **Don't skip documents**
   - All 4 documents are required
   - Missing technical-design is a CRITICAL issue
   - Incomplete requirements lead to scope creep

3. **Don't use untestable criteria**
   - ❌ "System should be fast" (vague)
   - ✅ "API responds in <200ms p95" (testable)

4. **Don't ignore task atomicity**
   - Tasks >60 min need breakdown
   - Tasks <10 min should be merged
   - Average task size: 30-45 min

5. **Don't forget cross-references**
   - Broken links confuse readers
   - Update links when files move
   - Verify links work

---

## Common Workflows

### Workflow 1: Starting a New Feature

```bash
# 1. Create plan directory
mkdir -p plans/in-progress/new-feature
cd plans/in-progress/new-feature

# 2. Use plan-writer agent
@plan-writer

# 3. Validate plan
@plan-checker

# 4. Fix any CRITICAL/HIGH issues

# 5. Re-validate until ready
@plan-checker

# 6. Start implementation
```

---

### Workflow 2: Updating Existing Plan

```bash
# 1. Read current plan
cat plans/in-progress/feature-name/README.md

# 2. Make changes to documents
# (edit files)

# 3. Re-validate
@plan-checker

# 4. Commit changes
git add plans/in-progress/feature-name/
git commit -m "docs(plan): update technical design"
```

---

### Workflow 3: Completing a Feature

```bash
# 1. Mark all checklist items as completed
# Edit checklist.md and change - [ ] to - [x]

# 2. Run final validation
@plan-checker

# 3. Move plan to done/
mv plans/in-progress/feature-name plans/done/

# 4. Archive (optional)
mv plans/done/feature-name plans/archived/

# 5. Update project README
# Add feature to implemented features list
```

---

## Example Plans

See existing plans for reference:

- [Gallery Sorting Plan](../../plans/done/gallery-sorting/) - Complete example
- [Authentication Plan](../../plans/done/user-authentication/) - Security-focused example

---

## Templates

### Quick Template

Use this template to start a new plan quickly:

```bash
# Copy template
cp -r templates/plan-template plans/in-progress/my-feature

# Edit files
cd plans/in-progress/my-feature
# Edit README.md, requirements.md, technical-design.md, checklist.md
```

### Using plan-writer Agent

The plan-writer agent can generate all 4 documents for you:

```bash
@plan-writer create plan for [feature description]
```

The agent will:
1. Ask clarifying questions
2. Generate all 4 documents
3. Ensure cross-references are correct
4. Create atomic tasks with time estimates

---

## Related Documentation

- [Use Claude Validators](./use-claude-validators.md) - How to validate your plans
- [4-Document System Skill](../../.claude/skills/plan__four-doc-system.md) - Detailed standards
- [Criticality Assessment](../../.claude/skills/wow__criticality-assessment.md) - Issue classification

---

## Summary

| Document | Purpose | When to Update |
|----------|---------|----------------|
| **README.md** | High-level overview | Scope changes, new objectives |
| **requirements.md** | Detailed requirements | New features, changed criteria |
| **technical-design.md** | Technical implementation | Architecture decisions, API changes |
| **checklist.md** | Implementation tasks | Progress tracking, task breakdown |

**Key Takeaways:**
- ✅ All 4 documents are required
- ✅ Tasks must be atomic (15-60 min)
- ✅ Acceptance criteria must be testable
- ✅ Validate plan before implementing
- ✅ Update plan as scope changes
- ✅ Move to done/ when complete

**Well-structured plans lead to successful implementations!** 🚀
