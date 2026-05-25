# Ideas & Quick Concepts

Quick concept snippets and brainstorming notes that haven't been formalized into plans yet.

---

## 📝 Active Ideas

<!-- Add new ideas here with date -->

### 2026-05-24: Claude Governance Gap Round 2 — Adopt More ose-public `.claude/` Patterns

Second gap analysis vs `wahidyankf/ose-public`. Items not yet in IKP-Labs, grouped by priority.
Skip list: `apps-*`, `pdf-to-md-*`, `social-*`, non-Java/TS languages, OSE-specific agents.

#### High Priority

- **SWE domain agents + skills** — Senior has per-language and per-layer agents missing here:
  - `swe-typescript-dev` + skill `swe-programming-typescript` (Next.js)
  - `swe-java-dev` + skill `swe-programming-java` (Spring Boot)
  - `swe-ui-maker/checker/fixer` + skill `swe-developing-frontend-ui`
  - `swe-e2e-dev` + skill `swe-developing-e2e-test-with-playwright`
  - `swe-code-checker` + skill `swe-developing-applications-common`
- **`agent-maker` + skill `agent-developing-agents`** — Meta-agent that creates new agents.
  High value for a template project.

#### Medium Priority

- **`readme` triad** — `readme-maker/checker/fixer` + skill `readme-writing-readme-files`.
  No dedicated README agent exists yet.
- **`repo` domain** — Two full triads missing:
  - `repo-rules-maker/checker/fixer`
  - `repo-workflow-maker/checker/fixer`
  - Skills: `repo-understanding-repository-architecture`, `repo-defining-workflows`,
    `repo-practicing-trunk-based-development`, `repo-generating-validation-reports`
- **`ci` triad** — `ci-checker/ci-fixer` + skill `ci-standards`. CI pipeline exists but no
  agent to validate or fix CI configuration.
- **`docs-link` pair** — `docs-link-checker/fixer` + skill `docs-validating-links`.

#### Low Priority

~~All implemented (2026-05-25). See Archive below.~~

References: `wahidyankf/ose-public` `.claude/` directory (fetched 2026-05-24).

---

## 🗃️ Archive

<!-- Ideas that have been implemented or rejected -->

### ✅ Implemented

- **Claude Governance Gap Round 2 — Low Priority Agents** (completed 2026-05-25)
  - `plan-execution-checker` — final quality gate before archiving plans
  - `web-research-maker` — isolated web research with confidence tagging
  - `docs-file-manager` — safe file management inside `docs/` with git history preservation
  - Plugin `frontend-design@claude-plugins-official` — external plugin, skipped (not buildable)

- **Claude Governance Gap #1–#5** (completed 2026-05-19 to 2026-05-23)
  - Gap #1: Maker/Checker/Fixer triad for all agent domains
  - Gap #2: Skills subdirectory structure (`skill-name/SKILL.md`)
  - Gap #3: Hooks as shell scripts
  - Gap #4: settings.json permissions + plugins + marketplaces
  - Gap #5: README in agents/ and skills/

- **UX Improvements** (completed in `done/2026-01-13__ux-improvements/`)
  - Toast notifications, loading states, confirmation dialogs
  - Empty states, form validation, micro-interactions
  - Completed: January 18, 2026

- **Frontend Unit Tests** (in progress in `in-progress/2026-02-11__frontend-unit-tests/`)
  - Jest + React Testing Library setup
  - Component, hook, utility, and service testing
  - Phase 1 completed: February 11, 2026

- **CI/CD Pipeline** (planned in `backlog/2026-01-12__cicd-pipeline/`)
  - GitHub Actions workflows
  - Pre-commit hooks, automated deployment
  - Status: Backlog

### ✅ Implemented (Features)

- **Gallery Sorting Feature** (moved to `done/2024-12-28__gallery-sorting-feature/`)
  - Completed: January 4, 2026
  - 116+ comprehensive tests
  - 96% query reduction (N+1 problem solved)

- **Photo Favorites Feature** (moved to `done/2024-12-18__photo-favorites-feature/`)
  - Completed: December 22, 2024

- **Photo Likes Feature** (moved to `done/2024-12-10__photo-likes-feature/`)
  - Initial idea: December 2024
  - Completed: December 14, 2024

- **E2E Gallery Tests** (moved to `done/2024-12-08__e2e-gallery-tests/`)
  - Completed: December 1-6, 2024
  - 20 comprehensive E2E tests covering full Gallery lifecycle
  - 6-day commit streak with 31 atomic commits
  - 1,207 lines of test code (tests + helpers)
  - 1 critical frontend bug discovered and fixed

### ⏸️ KameraVue Development Paused

The following ideas were scoped for KameraVue but are on hold as KameraVue development
is currently paused. Revisit if KameraVue development resumes.

- **UX Enhancements Week 2+** (2026-01-13)
  - Dark mode toggle, image lightbox/preview, drag & drop upload
  - Lazy loading images, command palette (Cmd+K), keyboard shortcuts
  - Optimistic UI, infinite scroll

- **Future Feature Ideas** (2026-01-12)
  - Photo comments system
  - Photo search & advanced filtering
  - User tagging in photos (@mentions)
  - Photo albums/collections
  - Batch photo operations
  - Photo metadata editor
  - Notification system

- **Infrastructure Ideas** (2026-01-12)
  - Docker containerization
  - Redis caching layer
  - API rate limiting
  - Database backup automation
  - Monitoring & logging
  - API documentation with Swagger/OpenAPI

- **Testing Ideas** (2026-01-12)
  - Visual regression tests (Storybook + Chromatic)
  - Performance tests (Lighthouse CI)
  - Accessibility tests (jest-axe)
  - Contract testing (Pact)

- **Nice-to-Have Features** (2026-01-12)
  - Photo editing tools (crop, rotate, filters)
  - Social sharing
  - Photo download
  - Print ordering integration
  - Mobile app (React Native or PWA)

---

## 💡 How to Use This File

**Purpose**: Quick capture of ideas before they become formal plans

**Workflow**:

1. Add new ideas to "Active Ideas" section with date
2. When ready to plan → move to `backlog/` folder with full planning docs
3. When implemented → move to "Archive" section
4. When rejected → move to "Archive" with reason

**Format**:

```markdown
### YYYY-MM-DD: Idea Title

- Brief description
- Why this is valuable
- Rough estimate (if known)
```

---

**Last Updated**: May 24, 2026 (Round 2 gap analysis added)
