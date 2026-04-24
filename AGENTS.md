# AGENTS.md

Instructions and catalog for AI agents working in this repository via Claude Code.

---

## Project Overview

**IKP-Labs / KameraVue** — Photo gallery application built with Next.js (frontend) and Spring Boot (backend), structured as an Nx monorepo.

- **Frontend**: Next.js 15 — `apps/kameravue-fe/`
- **Backend**: Spring Boot (Java) — `apps/kameravue-be/`
- **E2E Tests**: Playwright — `apps/kameravue-fe-e2e/`, `apps/kameravue-be-e2e/`
- **Specs**: Gherkin feature files — `specs/`
- **Monorepo**: Nx with `apps/` and `libs/` structure
- **Git Workflow**: Branch protection on `main`. All changes via pull request. Use `gh pr merge --rebase --delete-branch` to merge.

---

## Governance Consultation Order

Before making any significant decision, consult governance in this order:

| Priority | Document | Question it answers |
|----------|----------|---------------------|
| 1 | `governance/vision.md` | Does this change serve the project's purpose? |
| 2 | `governance/principles.md` | Does this approach align with project values? |
| 3 | `governance/conventions.md` | Does this follow naming and format standards? |
| 4 | `.workflow-template.md` | Does this follow the development workflow? |
| 5 | `plans/README.md` | Does this plan follow the plan structure? |
| 6 | Active plan `checklist.md` | What is the current task and its acceptance criteria? |

See `docs/explanation/governance.md` for the full 6-layer governance model.

---

## Maker-Checker Pattern

IKP-Labs uses a two-stage quality workflow:

1. **Maker** — Creates content (docs, plans, specs). Tools: read, write, edit, glob, grep.
2. **Checker** — Validates content, generates audit reports to `generated-reports/`. Tools: read, glob, grep, write (reports only).

Fixes after a checker report are applied by invoking the relevant maker again with the checker's findings as input, or handled directly in conversation.

**Criticality Levels**: CRITICAL, HIGH, MEDIUM, LOW
**Confidence Levels**: HIGH, MEDIUM, FALSE_POSITIVE

Checker output format: `generated-reports/{type}-audit-YYYY-MM-DD-HHMM.md`

---

## Agent Families

Agents are organized into three families, each with a Maker and Checker:

### 1. Documentation

| Role | Agent | Purpose |
|------|-------|---------|
| Maker | `documentation-writer` | Create and update docs following Diátaxis framework |
| Checker | `docs-validator` | Validate doc completeness, JSDoc coverage, Diátaxis categorization |

**Skills used**: `docs__quality-standards`, `docs__diataxis-framework`, `wow__criticality-assessment`

**Docs structure** (`docs/`):
- `tutorials/` — Learning-oriented, step-by-step guides
- `how-to/` — Goal-oriented, solving a specific problem
- `reference/` — Information-oriented, lookup tables
- `explanation/` — Understanding-oriented, concepts and rationale

---

### 2. Planning

| Role | Agent | Purpose |
|------|-------|---------|
| Maker | `plan-writer` | Create and update implementation plans (4-document system) |
| Checker | `plan-checker` | Validate plan completeness, task atomicity, acceptance criteria |

**Skills used**: `plan__four-doc-system`, `wow__criticality-assessment`

**Plan structure** (`plans/`):
- `backlog/` — Planned, not yet started
- `in-progress/` — Currently being worked on
- `done/` — Completed and archived

Each plan folder contains: `README.md`, `requirements.md`, `technical-design.md`, `checklist.md`

---

### 3. Testing & Specs

| Role | Agent | Purpose |
|------|-------|---------|
| Maker | `gherkin-spec-writer` | Create and update Gherkin feature files in `specs/` |
| Checker | `test-validator` | Validate E2E coverage, specs ↔ Playwright sync, flaky test detection |

**Skills used**: `test__coverage-rules`, `test__playwright-patterns`, `wow__criticality-assessment`

**Specs structure** (`specs/`):
- `authentication/` — Login, registration, home page
- `gallery/` — Photo upload, management, likes, sorting, privacy
- `profile/` — Profile picture

**Gherkin rules**: 1-1-1 rule — 1 Given, 1 When, 1 Then per scenario.

---

## Skills Catalog

Skills inject knowledge into agent contexts. All skills live in `.claude/skills/`.

| Skill file | Used by | Purpose |
|------------|---------|---------|
| `docs__diataxis-framework.md` | documentation-writer, docs-validator | Diátaxis framework conventions |
| `docs__quality-standards.md` | documentation-writer, docs-validator | Documentation quality rules |
| `plan__four-doc-system.md` | plan-writer, plan-checker | 4-document plan system rules |
| `test__coverage-rules.md` | gherkin-spec-writer, test-validator | Test coverage standards |
| `test__playwright-patterns.md` | gherkin-spec-writer, test-validator | Playwright E2E patterns |
| `wow__criticality-assessment.md` | all checkers | CRITICAL/HIGH/MEDIUM/LOW classification |

---

## Generated Reports

Checker agents write audit reports to `generated-reports/`. Reports are gitignored (local and CI artifact only). Only `README.md` and `.gitkeep` are tracked.

| Report pattern | Generated by |
|----------------|-------------|
| `test-audit-YYYY-MM-DD-HHMM.md` | `test-validator` |
| `docs-audit-YYYY-MM-DD-HHMM.md` | `docs-validator` |
| `plan-audit-YYYY-MM-DD-HHMM.md` | `plan-checker` |

See `generated-reports/README.md` for full report format spec.

---

## What Agents Should NOT Do

- Skip plan creation for non-trivial work (>1 commit or >2 files)
- Push directly to `main` — always use a branch and PR
- Use `any` types in TypeScript
- Commit secrets or credentials
- Modify governance files without explicit user instruction
- Mark checklist items done unless the work is committed and verified

---

## Related Documentation

- **`CLAUDE.md`** — Claude Code configuration and session guidance
- **`governance/ai-agent-guidelines.md`** — Full agent decision protocol
- **`governance/conventions.md`** — Naming, commit, branch, PR conventions
- **`.workflow-template.md`** — Step-by-step development workflow
- **`generated-reports/README.md`** — Audit report format reference

---

**Last Updated**: 2026-04-24
