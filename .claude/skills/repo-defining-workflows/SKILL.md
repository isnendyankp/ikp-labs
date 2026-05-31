# Skill: Defining Workflows

**Category**: Repository Governance
**Purpose**: Define what a complete, correct development workflow looks like for IKP-Labs — what documents must exist, what they must contain, and how they relate to enforced tooling.
**Used By**: repo-workflow-maker, repo-workflow-checker, repo-workflow-fixer

---

## Overview

IKP-Labs follows a **trunk-based development** model with short-lived feature branches. All workflow documentation lives in `governance/workflows/`. Tooling enforcement lives in commitlint, Husky, and CI.

---

## Required Workflow Documents

The following files must exist under `governance/workflows/`:

| File | Purpose |
|------|---------|
| `branching-strategy.md` | Branch naming prefixes, lifetime expectations, naming examples |
| `pr-workflow.md` | Full PR lifecycle: branch → commit → push → PR → review → squash-merge → delete |
| `trunk-based-development.md` | TBD principles: short branches, feature flags, avoid long-lived forks |

Optional but recommended:

| File | Purpose |
|------|---------|
| `release-process.md` | How releases are tagged and deployed from `main` |

---

## Branch Strategy

### Naming Convention

```text
<prefix>/<short-description-in-kebab-case>
```

| Prefix | When to use |
|--------|-------------|
| `feat/` | New user-facing features |
| `fix/` | Bug fixes |
| `docs/` | Documentation-only changes |
| `chore/` | Maintenance, dependency updates, tooling |
| `config/` | Configuration changes (CI, linters, build) |
| `hotfix/` | Urgent production fixes |
| `test/` | Test additions or corrections |
| `refactor/` | Code restructuring with no behavior change |

### Lifetime

- Target: merged within **1–2 days** of creation
- Never keep a branch alive longer than **1 week** without a PR open
- No direct commits to `main`

---

## Commit Message Rules

Enforced by commitlint (`commitlint.config.js`):

```text
<type>(<scope>): <subject>
```

| Field | Rule |
|-------|------|
| `type` | One of: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `config` |
| `scope` | Optional; use the app or module name (e.g., `kameravue-fe`, `ci`) |
| `subject` | Lowercase; no trailing period; max header = 72 characters |

---

## PR Workflow

### Full Lifecycle

1. **Branch** — create from `main` with correct prefix
2. **Develop** — small, atomic commits; run pre-commit hooks (Husky + lint-staged)
3. **Push** — push branch to origin
4. **Open PR** — use the PR template (`## Summary` + `## Test Plan`)
5. **CI** — all 7 CI jobs must pass before merge
6. **Review** — at least one approval (self-review acceptable for solo projects)
7. **Squash-merge** — merge via squash to keep `main` history clean
8. **Delete branch** — delete source branch after merge

### Squash-Merge Policy

- **Always squash** — no merge commits, no rebase merges
- The squash commit message should match the conventional commit format
- Squash title = `type(scope): summary of all changes in the branch`

---

## Trunk-Based Development Principles

1. **Single integration branch** — `main` is the only long-lived branch
2. **Short-lived branches** — branches exist for one task and are merged quickly
3. **No long-lived forks** — avoid "dev", "staging", or "release" branches that diverge over time
4. **Feature flags over branches** — if a feature needs to be hidden, use a runtime flag, not a separate branch
5. **CI on every push** — main CI runs on every push to `main` and every PR targeting `main`
6. **No broken main** — `main` must always be deployable; CI failure blocks merge

---

## Alignment with Tooling

Workflow docs must stay consistent with:

| Tool | What it enforces |
|------|-----------------|
| `commitlint.config.js` | Commit types + subject rules |
| `.husky/pre-commit` | lint-staged (ESLint + Prettier) |
| `.husky/commit-msg` | commitlint |
| `.github/workflows/kameravue-ci.yml` | 7 CI jobs that must pass |
| `CONTRIBUTING.md` | Human-readable workflow guide |

If tooling changes (e.g., a new commit type is added), workflow docs must be updated in the same PR.

---

## Document Quality Rules

| Rule | Detail |
|------|--------|
| No invented types | Only document commit types that exist in `commitlint.config.js` |
| No contradictions | Docs must not claim a merge strategy that differs from repo settings |
| No stale content | Remove references to branches or processes that no longer exist |
| Single concern | One topic per file — don't mix branching strategy with PR workflow |
| Commit type is `docs` | Workflow doc changes use `docs(governance): ...` commit type |

---

## Criticality Classification

| Severity | Trigger |
|----------|---------|
| CRITICAL | No `governance/workflows/` directory; or docs claim merge commits when squash is enforced |
| HIGH | Missing `branching-strategy.md` or `pr-workflow.md`; or docs list commit types not in commitlint |
| MEDIUM | Missing `trunk-based-development.md`; or docs omit CI requirement before merge |
| LOW | Missing `release-process.md`; stale examples; minor formatting issues |

---

## Related Skills

- **repo-practicing-trunk-based-development** — deeper TBD principles and anti-patterns
- **repo-understanding-repository-architecture** — current repo structure and tooling state
- **repo-generating-validation-reports** — report format for workflow audits
- **wow-criticality-assessment** — severity classification system
