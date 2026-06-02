# Ideas & Quick Concepts

Quick concept snippets and brainstorming notes that haven't been formalized into plans yet.

---

## 📝 Active Ideas

<!-- Add new ideas here with date -->

### 2026-06-02: Claude Governance Gap Round 3 — Adopt More ose-public `.claude/` Patterns

Identified by re-comparing IKP-Labs `.claude/` vs `wahidyankf/ose-public` on 2026-06-02.

#### Critical (Security)

- `block-env-file-access.sh` hook + wiring in `settings.json` — PreToolUse guard that blocks Claude from reading/writing `.env*` files; ose-public has this for `Read|Write|Edit|MultiEdit` matcher
- `.env*` deny permissions in `settings.json` — explicit deny rules for `.env`, `.env.local`, `.env.*.local`, `.env.development`, `.env.production`, `.env.staging`, `.env.test`; allow `.env.example`

#### High Priority — Agents

- `repo-harness-compatibility-checker` + `repo-harness-compatibility-fixer` — validates/fixes Claude harness compatibility issues
- `repo-setup-manager` — manages initial repo setup workflow

#### High Priority — Skills

- `grill-me` — interactive knowledge testing/review skill
- `plan-writing-gherkin-criteria` — Gherkin acceptance criteria writing standard
- `repo-applying-maker-checker-fixer` — MCF pattern application guide
- `repo-assessing-criticality-confidence` — criticality + confidence assessment (may overlap with `wow-criticality-assessment`, evaluate before implementing)
- `docs-validating-software-engineering-separation` skill + `docs-software-engineering-separation-checker/fixer` agents — validates docs don't mix SE concerns with non-SE content

#### Medium Priority — Agents

- `pdf-to-md-maker/checker/fixer` triad — PDF to markdown conversion pipeline
- `docs-tutorial-maker/checker/fixer` triad — tutorial docs creation/validation
- `social-linkedin-post-maker` — creates LinkedIn posts from project content

#### Medium Priority — Skills

- `docs-creating-accessible-diagrams` — diagram accessibility standards
- `docs-creating-by-example-tutorials` — "by example" tutorial format guide
- `docs-creating-in-the-field-tutorials` — "in the field" tutorial format guide
- `docs-validating-factual-accuracy` — fact-checking documentation standards
- `repo-syncing-with-ose-primer` — OSE primer sync workflow (includes 5 reference sub-docs)

#### Low Priority — Agents + Skills

- `swe-golang-dev` + skill `swe-programming-golang`
- `swe-rust-dev` + skill `swe-programming-rust`
- `swe-csharp-dev` + skill `swe-programming-csharp`
- `swe-fsharp-dev` + skill `swe-programming-fsharp`

#### Low Priority — Settings

- Additional LSP plugins in `settings.json`: `gopls-lsp`, `rust-analyzer-lsp`, `pyright-lsp`, `kotlin-lsp`, `lua-lsp`, `swift-lsp`, `frontend-design` (all `@claude-plugins-official`)
- opencode sync permissions: `Read(.opencode/**)`, `Write(.opencode/**)`, `Edit(.opencode/**)`, `Bash(npm run sync:claude-to-opencode:*)`

~~### 2026-05-24: Claude Governance Gap Round 2 — Adopt More ose-public `.claude/` Patterns~~

~~**All priorities fully implemented (2026-05-25 to 2026-05-31). See Archive below.**~~

---

## 🗃️ Archive

<!-- Ideas that have been implemented or rejected -->

### ✅ Implemented

- **Claude Governance Gap Round 2 — ALL DONE** (completed 2026-05-25 to 2026-05-31)
  - All high, medium, and low priority items implemented across 5 PRs (#147–#151)

- **Claude Governance Gap Round 2 — Medium Priority Batch 3b** (completed 2026-05-31)
  - `repo-workflow-maker/checker/fixer` + skills `repo-defining-workflows`, `repo-practicing-trunk-based-development`

- **Claude Governance Gap Round 2 — Medium Priority Batch 3a** (completed 2026-05-31)
  - `repo-rules-maker/checker/fixer` + skills `repo-understanding-repository-architecture`, `repo-generating-validation-reports`

- **Claude Governance Gap Round 2 — Medium Priority Batch 2** (completed 2026-05-30)
  - `ci-checker/fixer` + skill `ci-standards`

- **Claude Governance Gap Round 2 — Medium Priority Batch 1** (completed 2026-05-29)
  - `readme-maker/checker/fixer` + skill `readme-writing-readme-files`
  - `docs-link-checker/fixer` + skill `docs-validating-links`

- **Claude Governance Gap Round 2 — High Priority Agents + Skills** (completed 2026-05-26)
  - `swe-typescript-dev` + skill `swe-programming-typescript` (Next.js/React)
  - `swe-java-dev` + skill `swe-programming-java` (Spring Boot)
  - `swe-ui-maker/checker/fixer` + skill `swe-developing-frontend-ui`
  - `swe-e2e-dev` + skill `swe-developing-e2e-test-with-playwright`
  - `swe-code-checker` + skill `swe-developing-applications-common`
  - `agent-maker` + skill `agent-developing-agents`

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

**Last Updated**: June 2, 2026 (Claude Governance Gap Round 3 added to Active Ideas)
