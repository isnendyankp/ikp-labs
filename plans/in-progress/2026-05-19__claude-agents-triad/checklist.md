# Checklist: Claude Agents Maker/Checker/Fixer Triad

---

## Phase 1 — `plan` Domain

### Branch Setup

- [x] `git checkout main && git pull origin main`
- [x] `git checkout -b chore/claude-agents-plan-triad`

### File Operations

- [x] Rename `.claude/agents/plan-writer.md` → `.claude/agents/plan-maker.md`
  - Update `name:` frontmatter to `plan-maker`
  - Update `description:` to reflect maker role
- [x] Create `.claude/agents/plan-fixer.md`
  - Frontmatter: `name: plan-fixer`, `model: sonnet`, `color: orange`
  - Body: agent that fixes plan issues found by plan-checker

### Verify

- [x] `plan-maker.md` exists, `name: plan-maker` in frontmatter
- [x] `plan-writer.md` no longer exists
- [x] `plan-checker.md` unchanged
- [x] `plan-fixer.md` exists, `name: plan-fixer` in frontmatter

### Commit & PR

- [ ] `git add .claude/agents/`
- [ ] `git commit -m "chore(agents): rename plan-writer to plan-maker, add plan-fixer"`
- [ ] `git push -u origin chore/claude-agents-plan-triad`
- [ ] `gh pr create --title "chore(agents): plan domain triad - maker/checker/fixer"`
- [ ] CI passes
- [ ] `gh pr merge --rebase --delete-branch`
- [ ] `git checkout main && git pull origin main`
- [ ] Update this checklist: mark Phase 1 done

---

## Phase 2 — `docs` Domain

### Branch Setup

- [x] `git checkout main && git pull origin main`
- [x] `git checkout -b chore/claude-agents-docs-triad`

### File Operations

- [x] Rename `.claude/agents/documentation-writer.md` → `.claude/agents/docs-maker.md`
  - Update `name:` frontmatter to `docs-maker`
  - Update `description:` to reflect maker role
- [x] Rename `.claude/agents/docs-validator.md` → `.claude/agents/docs-checker.md`
  - Update `name:` frontmatter to `docs-checker`
  - Update `description:` to reflect checker role
- [x] Create `.claude/agents/docs-fixer.md`
  - Frontmatter: `name: docs-fixer`, `model: sonnet`, `color: orange`
  - Body: agent that fixes documentation issues found by docs-checker

### Verify

- [x] `docs-maker.md` exists, `name: docs-maker` in frontmatter
- [x] `docs-checker.md` exists, `name: docs-checker` in frontmatter
- [x] `documentation-writer.md` no longer exists
- [x] `docs-validator.md` no longer exists
- [x] `docs-fixer.md` exists, `name: docs-fixer` in frontmatter

### Commit & PR

- [ ] `git add .claude/agents/`
- [ ] `git commit -m "chore(agents): rename docs agents, add docs-fixer"`
- [ ] `git push -u origin chore/claude-agents-docs-triad`
- [ ] `gh pr create --title "chore(agents): docs domain triad - maker/checker/fixer"`
- [ ] CI passes
- [ ] `gh pr merge --rebase --delete-branch`
- [ ] `git checkout main && git pull origin main`
- [ ] Update this checklist: mark Phase 2 done

---

## Phase 3 — `test` Domain

### Branch Setup

- [x] `git checkout main && git pull origin main`
- [x] `git checkout -b chore/claude-agents-test-triad`

### File Operations

- [x] Rename `.claude/agents/test-validator.md` → `.claude/agents/test-checker.md`
  - Update `name:` frontmatter to `test-checker`
  - Update `description:` to reflect checker role
- [x] Create `.claude/agents/test-maker.md`
  - Frontmatter: `name: test-maker`, `model: sonnet`, `color: purple`
  - Body: agent that creates E2E/unit tests from specs or requirements
- [x] Create `.claude/agents/test-fixer.md`
  - Frontmatter: `name: test-fixer`, `model: sonnet`, `color: orange`
  - Body: agent that fixes failing or flaky tests

### Verify

- [x] `test-checker.md` exists, `name: test-checker` in frontmatter
- [x] `test-validator.md` no longer exists
- [x] `test-maker.md` exists, `name: test-maker` in frontmatter
- [x] `test-fixer.md` exists, `name: test-fixer` in frontmatter

### Commit & PR

- [ ] `git add .claude/agents/`
- [ ] `git commit -m "chore(agents): rename test-validator to test-checker, add test-maker + test-fixer"`
- [ ] `git push -u origin chore/claude-agents-test-triad`
- [ ] `gh pr create --title "chore(agents): test domain triad - maker/checker/fixer"`
- [ ] CI passes
- [ ] `gh pr merge --rebase --delete-branch`
- [ ] `git checkout main && git pull origin main`
- [ ] Update this checklist: mark Phase 3 done

---

## Phase 4 — `specs` Domain

### Branch Setup

- [x] `git checkout main && git pull origin main`
- [x] `git checkout -b chore/claude-agents-specs-triad`

### File Operations

- [x] Rename `.claude/agents/gherkin-spec-writer.md` → `.claude/agents/specs-maker.md`
  - Update `name:` frontmatter to `specs-maker`
  - Update `description:` to reflect maker role
- [x] Create `.claude/agents/specs-checker.md`
  - Frontmatter: `name: specs-checker`, `model: sonnet`, `color: blue`
  - Body: agent that validates Gherkin specs completeness and quality
- [x] Create `.claude/agents/specs-fixer.md`
  - Frontmatter: `name: specs-fixer`, `model: sonnet`, `color: orange`
  - Body: agent that fixes spec issues found by specs-checker

### Verify

- [x] `specs-maker.md` exists, `name: specs-maker` in frontmatter
- [x] `gherkin-spec-writer.md` no longer exists
- [x] `specs-checker.md` exists, `name: specs-checker` in frontmatter
- [x] `specs-fixer.md` exists, `name: specs-fixer` in frontmatter

### Commit & PR

- [ ] `git add .claude/agents/`
- [ ] `git commit -m "chore(agents): complete specs domain triad"`
- [ ] `git push -u origin chore/claude-agents-specs-triad`
- [ ] `gh pr create --title "chore(agents): specs domain triad - maker/checker/fixer"`
- [ ] CI passes
- [ ] `gh pr merge --rebase --delete-branch`
- [ ] `git checkout main && git pull origin main`
- [ ] Update this checklist: mark Phase 4 done

---

## Close Plan

- [ ] `git checkout -b docs/close-claude-agents-triad-plan`
- [ ] `git mv plans/in-progress/2026-05-19__claude-agents-triad plans/done/2026-05-19__claude-agents-triad`
- [ ] `git commit -m "docs(plan): move claude-agents-triad to done"`
- [ ] `git push -u origin docs/close-claude-agents-triad-plan`
- [ ] `gh pr merge --rebase --delete-branch`
- [ ] `git checkout main && git pull origin main`

---

**Created**: 2026-05-19
**Status**: In Progress
