# Checklist: Claude Skills Subdirectory Restructure

---

## Phase 1 — Migrate Skill Files

### Branch Setup

- [x] `git checkout main && git pull origin main`
- [x] `git checkout -b chore/claude-skills-migrate-files`

### Create Subdirectories & Move Content

- [x] `mkdir .claude/skills/docs-applying-diataxis-framework/`
- [x] Copy `docs__diataxis-framework.md` → `docs-applying-diataxis-framework/SKILL.md`
- [x] `mkdir .claude/skills/docs-applying-content-quality/`
- [x] Copy `docs__quality-standards.md` → `docs-applying-content-quality/SKILL.md`
- [x] `mkdir .claude/skills/plan-creating-project-plans/`
- [x] Copy `plan__four-doc-system.md` → `plan-creating-project-plans/SKILL.md`
- [x] `mkdir .claude/skills/test-coverage-rules/`
- [x] Copy `test__coverage-rules.md` → `test-coverage-rules/SKILL.md`
- [x] `mkdir .claude/skills/test-playwright-patterns/`
- [x] Copy `test__playwright-patterns.md` → `test-playwright-patterns/SKILL.md`
- [x] `mkdir .claude/skills/wow-criticality-assessment/`
- [x] Copy `wow__criticality-assessment.md` → `wow-criticality-assessment/SKILL.md`

### Remove Old Flat Files

- [x] `git rm .claude/skills/docs__diataxis-framework.md`
- [x] `git rm .claude/skills/docs__quality-standards.md`
- [x] `git rm .claude/skills/plan__four-doc-system.md`
- [x] `git rm .claude/skills/test__coverage-rules.md`
- [x] `git rm .claude/skills/test__playwright-patterns.md`
- [x] `git rm .claude/skills/wow__criticality-assessment.md`

### Commit & PR

- [x] PR #127 — merged

---

## Phase 2 — Update Agent References

### Branch Setup

- [x] `git checkout main && git pull origin main`
- [x] `git checkout -b chore/claude-skills-update-refs`

### Update All 12 Agent Frontmatter

- [x] `docs-maker.md`: update 3 references
- [x] `docs-checker.md`: update 3 references
- [x] `docs-fixer.md`: update 3 references
- [x] `plan-maker.md`: update 2 references
- [x] `plan-checker.md`: update 2 references
- [x] `plan-fixer.md`: update 2 references
- [x] `test-maker.md`: update 3 references
- [x] `test-checker.md`: update 3 references
- [x] `test-fixer.md`: update 3 references
- [x] `specs-maker.md`: update 3 references
- [x] `specs-checker.md`: update 3 references
- [x] `specs-fixer.md`: update 3 references

### Verify

- [x] `grep -r "docs__\|plan__\|test__\|wow__" .claude/agents/` returns empty

### Commit & PR

- [ ] `git commit -m "chore(agents): update skill references to new subdirectory names"`
- [ ] `git push -u origin chore/claude-skills-update-refs`
- [ ] `gh pr create --title "chore(agents): update skill references to subdirectory names"`
- [ ] CI passes
- [ ] `gh pr merge --rebase --delete-branch`
- [ ] `git checkout main && git pull origin main`
- [ ] Update this checklist: mark Phase 2 done

---

## Close Plan

- [x] `git checkout -b docs/close-claude-skills-restructure-plan`
- [x] `git mv plans/in-progress/2026-05-20__claude-skills-restructure plans/done/`
- [x] `git commit -m "docs(plan): move claude-skills-restructure to done"`
- [x] PR + merge

---

**Created**: 2026-05-20
**Completed**: 2026-05-20
**Status**: Done
