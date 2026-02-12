# Plans

**Temporary, ephemeral project planning** - Separate from permanent documentation in `docs/`.

---

## 📁 Directory Structure

```
plans/
├── README.md          # This file
├── ideas.md           # Quick concept snippets
├── backlog/           # Planned for future
├── in-progress/       # Currently working on
└── done/              # Completed and archived
```

---

## 🔄 Planning Workflow

### 1. **Ideas** → `ideas.md`
Quick brainstorming, rough concepts not yet formalized

**Format**: Simple bullet points with dates
**Purpose**: Capture ideas before they're forgotten
**Example**:
```markdown
### 2024-12-14: Photo Albums Feature
- Allow users to organize photos into albums
- Estimated: 5 days
```

### 2. **Backlog** → `backlog/`
Ideas that have been formalized into actionable plans

**Format**: `YYYY-MM-DD__project-identifier/`
**Contents**: Requirements, technical design, estimates
**Status**: Planned but not started

### 3. **In Progress** → `in-progress/`
Plans actively being worked on

**Format**: `YYYY-MM-DD__project-identifier.md` or folder
**Contents**: Implementation plan, checklist, progress tracking
**Status**: Currently implementing

### 4. **Done** → `done/`
Completed plans, archived for reference

**Format**: `YYYY-MM-DD__project-identifier/`
**Contents**: All planning documents from the project
**Status**: Completed and archived

---

## 📝 Naming Convention

All plans follow date-based naming:

**Format**: `YYYY-MM-DD__project-identifier`

**Examples**:
- `2024-11-24__photo-gallery-feature/`
- `2024-12-10__photo-likes-feature/`
- `2024-12-08__e2e-gallery-tests.md`

**Why Date-Based?**
- Clear chronological order
- Easy to track when projects started
- Simple sorting by date
- Prevents name conflicts

---

## 🗂️ Current Plans

### Done (Archived)
```
done/
├── 2024-11-04__unit-testing/
│   ├── unit-test-checklist.md
│   └── unit-test-java-implementation-plan.md
├── 2024-11-04__profile-picture-e2e/
│   └── profile-picture-e2e-test-plan.md
├── 2024-11-24__photo-gallery-feature/
│   ├── photo-gallery-feature-plan.md
│   ├── photo-gallery-feature-summary.md
│   ├── photo-gallery-progress-checklist.md
│   └── photo-gallery-test-plan.md
└── 2024-12-10__photo-likes-feature/
    ├── README.md
    ├── requirements.md
    ├── technical-design.md
    └── checklist.md
```

### In Progress
```
in-progress/
└── 2026-02-11__frontend-unit-tests/
    ├── README.md
    ├── requirements.md
    ├── technical-design.md
    └── checklist.md
```

### Backlog
```
backlog/
└── 2026-01-12__cicd-pipeline/
    ├── README.md
    ├── requirements.md
    ├── technical-design.md
    └── checklist.md
```

---

## ✅ How to Create a New Plan

### Step 1: Add to Ideas
```markdown
# In ideas.md
### 2024-12-15: New Feature Name
- Brief description
- Why it's valuable
- Rough estimate
```

### Step 2: Move to Backlog (when ready to plan)
```bash
mkdir -p plans/backlog/2024-12-15__new-feature/
cd plans/backlog/2024-12-15__new-feature/

# Create planning docs
touch README.md
touch requirements.md
touch technical-design.md
touch checklist.md
```

### Step 3: Move to In Progress (when starting)
```bash
git mv plans/backlog/2024-12-15__new-feature/ \
       plans/in-progress/
```

### Step 4: Move to Done (when completed)
```bash
git mv plans/in-progress/2024-12-15__new-feature/ \
       plans/done/
```

---

## 📋 Plan Template Structure

Each plan folder typically contains:

### Required Files
- **`README.md`** - Quick navigation & overview
- **`requirements.md`** - Feature scope, user stories, success criteria
- **`technical-design.md`** - Architecture, API design, database schema
- **`checklist.md`** - Implementation tasks with checkboxes

### Optional Files
- `test-plan.md` - Testing strategy
- `api-spec.md` - API endpoint specifications
- `progress-log.md` - Daily progress tracking
- `lessons-learned.md` - Post-mortem notes

---

## 🎯 Best Practices

### Do ✅
- Use date-based naming (`YYYY-MM-DD__project-name`)
- Keep plans focused and scoped
- Update status regularly (ideas → backlog → in-progress → done)
- Archive completed plans to `done/`
- Reference plans in commit messages

### Don't ❌
- Don't create permanent documentation here (use `docs/` instead)
- Don't leave plans in wrong status folder
- Don't use generic names without dates
- Don't delete completed plans (archive to `done/`)

---

## 📚 Related Documentation

Plans are **temporary** - they track work in progress.

For **permanent** documentation, see:
- **[docs/](../docs/)** - Permanent documentation (Diátaxis framework)
  - `tutorials/` - Learning guides
  - `how-to/` - Problem-solving
  - `reference/` - Technical specs
  - `explanation/` - Understanding
  - `journals/` - Development logs

**Key Difference**:
- `plans/` = Work tracking (temporary, project-focused)
- `docs/` = Knowledge sharing (permanent, topic-focused)

---

## 📊 Quick Stats

**Completed Projects**: 17
- Unit Testing (Nov 4, 2024)
- Profile Picture E2E (Nov 4, 2024)
- Photo Gallery Feature (Nov 24, 2024)
- Photo Likes Feature (Dec 10, 2024)
- Photo Favorites Feature (Dec 18, 2024)
- E2E Gallery Tests (Dec 16, 2024)
- Gallery-Centric Navigation (Dec 22, 2024)
- E2E Test Fixes (Dec 27, 2024)
- Gallery Sorting Feature (Jan 5, 2026)
- Claude Agents Infrastructure (Jan 11, 2026)
- UX Improvements (Jan 13, 2026)
- Landing Page (Jan 19, 2026)
- Auth UX Improvements (Jan 26, 2026)
- Mobile UX Improvements (Jan 29, 2026)
- Bug Analysis & Testing Coverage (Feb 2, 2026)
- DRY Violations Fix (Feb 8, 2026)

**In Progress**: 1
- Frontend Unit Tests (Feb 11, 2026)

**Backlog**: 1
- CI/CD Pipeline (Jan 12, 2026)

---

**Last Updated**: February 12, 2026
