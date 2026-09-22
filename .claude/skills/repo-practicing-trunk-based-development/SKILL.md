# Skill: Practicing Trunk-Based Development

**Category**: Repository Governance
**Purpose**: Define trunk-based development (TBD) principles, practices, and anti-patterns for IKP-Labs so agents can audit, document, and enforce them correctly.
**Used By**: repo-workflow-maker, repo-workflow-checker, repo-workflow-fixer

---

## What Is Trunk-Based Development?

Trunk-Based Development is a branching model where all developers integrate their work into a single shared branch (the "trunk" — called `main` in IKP-Labs) frequently, at least once per day. Feature branches exist but are **short-lived** (hours to 2 days, not weeks).

Key difference from Gitflow: there are **no long-lived parallel branches** like `develop`, `staging`, or `release/x.y`.

---

## IKP-Labs TBD Configuration

| Property | Value |
|----------|-------|
| Trunk branch | `main` |
| Branch lifetime target | 1–2 days |
| Branch lifetime hard limit | 1 week |
| Merge strategy | Squash-merge only |
| CI requirement | All 7 jobs pass before merge |
| Direct commits to trunk | Not allowed |

---

## Core Practices

### 1. Short-Lived Branches

- Create a branch, do one focused task, open a PR, merge.
- A branch that lives more than 2 days without a PR is a warning sign.
- A branch that lives more than 1 week is a TBD violation.

### 2. Small, Atomic Commits

- Each commit should represent one logical change.
- Pre-commit hooks enforce code quality on every commit (not just at PR time).
- Use `git commit --amend` or `git rebase -i` to clean up before pushing (not after PRs are open).

### 3. Integrate Frequently

- Push to your feature branch at least daily.
- Open a draft PR early to get CI feedback.
- Do not accumulate large changesets before integrating.

### 4. Keep Main Green

- `main` must always pass CI.
- If a merge breaks `main`, revert immediately — do not attempt a fix-forward on a broken trunk.
- CI runs on every push to `main` and every PR targeting `main`.

### 5. Feature Flags Over Branches

When a feature is too large to merge in 1–2 days:

- Use a **runtime feature flag** to hide incomplete functionality.
- Merge the flag-gated code to `main` frequently.
- Remove the flag when the feature is complete.

Do NOT create a long-lived `feat/big-feature` branch that diverges for weeks.

### 6. Squash-Merge Policy

- All PRs use **squash-merge** to keep trunk history clean.
- The squash commit message must follow conventional commits.
- After merge, delete the source branch immediately.

---

## Delivery Mode: Worktree-to-PR (Default)

**IKP-Labs's default delivery mode is `worktree-to-pr`**: a disposable git worktree on a
plan-scoped branch, pushed to a PR against `main`, merged once CI is green. This is TBD
in practice — a short-lived branch reviewed and merged via PR is a recognized TBD flavor,
not an exception to it.

### Standard Flow

```bash
# 1. Provision a disposable worktree on a plan-scoped branch
#    (the .claude/hooks/worktree-create.sh WorktreeCreate hook automates this — it
#    routes to <repo-root>/worktrees/<name>/ on branch worktree/<name>)
git worktree add worktrees/<plan-identifier> -b <plan-identifier>
cd worktrees/<plan-identifier>

# 2. Make changes, commit frequently
git add <files>
git commit -m "feat(scope): description"

# 3. Push the plan branch and open a PR against main
git push -u origin <plan-identifier>
gh pr create --title "..." --body "..."

# 4. Drive PR CI green, then merge
gh pr merge <number> --squash --auto --delete-branch

# 5. Clean up the worktree
cd <repo-root>
git worktree remove worktrees/<plan-identifier>
```

For a small, single-file change where the overhead of a separate worktree isn't
warranted, working directly in the main checkout on a plan-scoped branch
(`git checkout -b <type>/<description>`) is an acceptable lighter-weight variant of the
same mode — the branch-then-PR discipline is what matters, not the worktree itself.
Reach for a dedicated worktree when isolation actually helps: concurrent work on
multiple plans, or a change risky enough that keeping the main checkout undisturbed is
worth the setup cost.

### `[AI]`/`[HUMAN]` Step Tagging

Tag every delivery-mode step with who performs it, so a plan's checklist is unambiguous
about what runs unattended versus what needs a human decision:

- **Pushing to the plan branch is always `[AI]`** — it's not a merge, so it carries no
  review gate by itself.
- **The merge is `[AI]` by default** once CI is green — matches this repo's actual
  practice (`gh pr merge --squash --auto`, per `CLAUDE.md`'s Merge Strategy). A
  `[HUMAN]` merge-approval gate applies only when a plan explicitly opts into one (e.g.,
  a change touching production data or governance files) — that opt-in must be
  preserved, never silently "corrected" back to `[AI]`.
- **Never write a `[HUMAN]` "review the diff before pushing" step** — pushing to a PR
  branch isn't a merge to `main`; gating it on human review conflates the two and stalls
  the flow for no safety benefit.

### Resolving the Delivery Mode

Apply three-tier precedence: an explicit invocation argument, then a plan's own
`## Delivery Mode` field (if the 4-document plan template declares one), then this
repo-wide default (`worktree-to-pr`). Never silently substitute a different mode when
one is explicitly requested — treat an invalid or unclear request as a question for the
user.

---

## Anti-Patterns

| Anti-Pattern | Why Bad | Correct Practice |
|-------------|---------|-----------------|
| Long-lived `develop` branch | Creates a second trunk, doubles integration surface | Merge directly to `main` |
| `release/x.y.z` branches | Splits maintenance across branches | Tag `main` for releases |
| PRs open for > 1 week | Merge conflicts accumulate, review context lost | Break into smaller PRs |
| Merge commits on trunk | Pollutes history, makes `git bisect` harder | Squash-merge always |
| Bypassing CI with `--no-verify` | Breaks trunk quality guarantee | Fix the hook failure |
| Rebase-merging with history rewrites | Confuses commit attribution | Squash instead |
| Direct push to `main` | Bypasses CI and review | Always use a branch + PR |
| Stacking PRs on non-main base | Creates dependency chains, hard to untangle | Base all branches on `main` |

---

## Branch Naming in TBD Context

Short branch names signal short-lived intent:

```text
feat/add-photo-sorting        ✅ focused, specific
fix/gallery-null-pointer      ✅ focused, specific
feat/redesign-entire-frontend ⚠️ scope too large — split it
feat/q1-2026-work             ❌ time-boxed, not task-boxed
dev                           ❌ long-lived parallel trunk
```

---

## Relationship to CI

TBD relies on CI being fast and reliable:

| CI Requirement | IKP-Labs Status |
|---------------|----------------|
| Runs on every PR | ✅ `pull_request` trigger on `main` |
| Runs on merge to trunk | ✅ `push` trigger on `main` |
| Cancels stale runs | ✅ `concurrency: cancel-in-progress: true` |
| Target time | ~3 minutes for main CI |
| E2E separately scheduled | ✅ Scheduled E2E at 06:00 and 18:00 WIB |

If CI takes longer than 10 minutes for a standard push, investigate — slow CI discourages frequent integration.

---

## Release Strategy in TBD

In TBD, releases come from `main`:

1. All code is merged to `main` continuously
2. When ready to release, **tag** `main` with a semantic version: `git tag v1.2.0`
3. CI/CD deploys from the tag
4. No release branches — if a hotfix is needed, branch from the tag, fix, merge to `main`, tag again

---

## Documentation Checklist

A repository practicing TBD should have:

- [ ] `governance/workflows/trunk-based-development.md` — explains TBD principles to contributors
- [ ] `governance/workflows/branching-strategy.md` — branch prefixes and lifetime expectations
- [ ] `governance/workflows/pr-workflow.md` — full PR lifecycle from branch to delete
- [ ] `CONTRIBUTING.md` — references the above workflow docs
- [ ] No references to `develop`, `staging`, or release branches in any governance doc

---

## Criticality Classification

| Severity | Trigger |
|----------|---------|
| CRITICAL | Workflow docs describe merge commits or long-lived branches as the standard |
| HIGH | No `trunk-based-development.md` exists; or docs recommend weekly PR cadence |
| MEDIUM | Docs don't mention CI as a gate before merge; or feature flag strategy not documented |
| LOW | Anti-patterns table missing; examples use non-conventional branch names |

---

## Related Skills

- **repo-defining-workflows** — required workflow documents and their content standards
- **repo-understanding-repository-architecture** — current repo structure and CI setup
- **repo-generating-validation-reports** — report format for workflow audits
- **wow-criticality-assessment** — severity classification system
