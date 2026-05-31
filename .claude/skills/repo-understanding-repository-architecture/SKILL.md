# Skill: Understanding Repository Architecture

**Category**: Repository Governance
**Purpose**: Describe the IKP-Labs repository layout, ownership model, and governance layer so agents can make accurate decisions about structure and rules.
**Used By**: repo-rules-maker, repo-rules-checker, repo-rules-fixer

---

## Repository Overview

IKP-Labs is an **Nx monorepo** hosted on GitHub (`isnendyankp/ikp-labs`). The primary application is **KameraVue**, a photo gallery app.

---

## Top-Level Structure

```text
IKP-Labs/
├── apps/
│   ├── kameravue-fe/          # Next.js 15.5.0 + React 19 + TypeScript + Tailwind 4
│   ├── kameravue-be/          # Spring Boot 3.2+ + Java 17+ + PostgreSQL + Maven
│   ├── kameravue-fe-e2e/      # Playwright E2E tests (frontend flows)
│   └── kameravue-be-e2e/      # Playwright API tests (backend contracts)
├── .github/
│   └── workflows/             # GitHub Actions CI/CD
├── .claude/
│   ├── agents/                # Custom Claude Code agents
│   ├── skills/                # Knowledge modules for agents
│   └── hooks/                 # Shell hooks for Claude Code events
├── governance/                # 6-layer governance model
│   └── conventions/
│       └── development.md     # TypeScript/Java/naming conventions
├── docs/                      # Diátaxis-structured documentation
├── plans/                     # Implementation plans (4-doc system)
├── specs/                     # Gherkin feature files
├── generated-reports/         # Audit output (gitignored)
├── nx.json                    # Nx workspace config
├── package.json               # Root package (workspaces)
├── pom.xml                    # Root Maven POM
├── commitlint.config.js       # Commit message rules
├── .husky/                    # Git hooks (pre-commit, commit-msg)
├── CONTRIBUTING.md            # Contribution guidelines
├── AGENTS.md                  # Agent governance
└── CLAUDE.md                  # Claude Code project instructions
```

---

## Application Details

### Frontend — `apps/kameravue-fe/`

| Property | Value |
|----------|-------|
| Framework | Next.js 15.5.0 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| State | React Context / hooks |
| Testing | Jest + React Testing Library (≥70% coverage) |
| Dev server | `http://localhost:3002` |

### Backend — `apps/kameravue-be/`

| Property | Value |
|----------|-------|
| Framework | Spring Boot 3.2+ |
| Language | Java 21 |
| Database | PostgreSQL 15 (prod), H2 (tests) |
| Build | Maven |
| Testing | JUnit 5 + Mockito + JaCoCo (≥80% coverage) |
| Dev server | `http://localhost:8081` |

### E2E — `apps/kameravue-fe-e2e/`, `apps/kameravue-be-e2e/`

- Playwright (TypeScript)
- Feature specs in `specs/` (Gherkin)
- E2E tests in `tests/e2e/`, API tests in `tests/api/`

---

## Governance Model (6 Layers)

Located in `governance/`:

| Layer | File/Directory | Purpose |
|-------|----------------|---------|
| Vision | `vision.md` | Project purpose and goals |
| Principles | `principles.md` | Engineering principles |
| Conventions | `conventions/development.md` | Code style, naming, file structure |
| Workflows | `workflows/` | PR process, branching strategy |
| Architecture | `repository-governance-architecture.md` | This 6-layer model |
| Operations | CI/CD, hooks | Enforcement tooling |

---

## Commit Conventions

Enforced by **commitlint** (`commitlint.config.js`):

| Rule | Value |
|------|-------|
| Types | `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `config` |
| Subject case | `lower-case` (no uppercase start) |
| Header max length | 72 characters |
| Format | `type(scope): subject` |

---

## Branch Naming

| Prefix | Use |
|--------|-----|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `docs/` | Documentation |
| `chore/` | Maintenance, tooling |
| `config/` | Configuration changes |
| `hotfix/` | Emergency production fixes |
| `test/` | Test-only changes |
| `refactor/` | Code refactoring |

---

## Git Hooks (Husky)

| Hook | Command | Purpose |
|------|---------|---------|
| `pre-commit` | `lint-staged` | ESLint + Prettier on staged files |
| `commit-msg` | `commitlint` | Enforce commit message format |

---

## Ownership

Single maintainer: **Isnendyan** (`@isnendyankp`)

All directories are owned by `@isnendyankp`. CODEOWNERS uses wildcard catch-all with specific overrides for major areas.

---

## GitHub Configuration (Current State)

| File | Status |
|------|--------|
| `.github/CODEOWNERS` | Missing — not yet created |
| `.github/pull_request_template.md` | Missing — not yet created |
| `.github/ISSUE_TEMPLATE/` | Missing — not yet created |
| `commitlint.config.js` | Present — 8 types, header max 72 |
| `.husky/pre-commit` | Present — lint-staged |
| `.husky/commit-msg` | Present — commitlint |
| `CONTRIBUTING.md` | Present — full guide |
| `SECURITY.md` | Missing |

---

## Related Skills

- **repo-generating-validation-reports** — report format for governance audits
- **wow-criticality-assessment** — severity classification
- **ci-standards** — CI workflow requirements
