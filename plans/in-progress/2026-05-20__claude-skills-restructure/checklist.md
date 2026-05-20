# Checklist: Claude Skills Subdirectory Restructure

---

## Phase 1 — Migrate Skill Files

### Branch Setup

- [ ] `git checkout main && git pull origin main`
- [ ] `git checkout -b chore/claude-skills-migrate-files`

### Create Subdirectories & Move Content

- [ ] `mkdir .claude/skills/docs-applying-diataxis-framework/`
- [ ] Copy `docs__diataxis-framework.md` → `docs-applying-diataxis-framework/SKILL.md`
- [ ] `mkdir .claude/skills/docs-applying-content-quality/`
- [ ] Copy `docs__quality-standards.md` → `docs-applying-content-quality/SKILL.md`
- [ ] `mkdir .claude/skills/plan-creating-project-plans/`
- [ ] Copy `plan__four-doc-system.md` → `plan-creating-project-plans/SKILL.md`
- [ ] `mkdir .claude/skills/test-coverage-rules/`
- [ ] Copy `test__coverage-rules.md` → `test-coverage-rules/SKILL.md`
- [ ] `mkdir .claude/skills/test-playwright-patterns/`
- [ ] Copy `test__playwright-patterns.md` → `test-playwright-patterns/SKILL.md`
- [ ] `mkdir .claude/skills/wow-criticality-assessment/`
- [ ] Copy `wow__criticality-assessment.md` → `wow-criticality-assessment/SKILL.md`

### Remove Old Flat Files

- [ ] `git rm .claude/skills/docs__diataxis-framework.md`
- [ ] `git rm .claude/skills/docs__quality-standards.md`
- [ ] `git rm .claude/skills/plan__four-doc-system.md`
- [ ] `git rm .claude/skills/test__coverage-rules.md`
- [ ] `git rm .claude/skills/test__playwright-patterns.md`
- [ ] `git rm .claude/skills/wow__criticality-assessment.md`

### Commit & PR

- [ ] `git add -f .claude/skills/`
- [ ] `git commit -m "chore(skills): migrate to subdirectory structure"`
- [ ] `git push -u origin chore/claude-skills-migrate-files`
- [ ] `gh pr create --title "chore(skills): migrate to subdirectory structure"`
- [ ] CI passes
- [ ] `gh pr merge --rebase --delete-branch`
- [ ] `git checkout main && git pull origin main`
- [ ] Update this checklist: mark Phase 1 done

---

## Phase 2 — Update Agent References

### Branch Setup

- [ ] `git checkout main && git pull origin main`
- [ ] `git checkout -b chore/claude-skills-update-refs`

### Update All 12 Agent Frontmatter

- [ ] `docs-maker.md`: update 3 references
- [ ] `docs-checker.md`: update 3 references
- [ ] `docs-fixer.md`: update 3 references
- [ ] `plan-maker.md`: update 2 references
- [ ] `plan-checker.md`: update 2 references
- [ ] `plan-fixer.md`: update 2 references
- [ ] `test-maker.md`: update 3 references
- [ ] `test-checker.md`: update 3 references
- [ ] `test-fixer.md`: update 3 references
- [ ] `specs-maker.md`: update 3 references
- [ ] `specs-checker.md`: update 3 references
- [ ] `specs-fixer.md`: update 3 references

### Verify

- [ ] `grep -r "docs__\|plan__\|test__\|wow__" .claude/agents/` returns empty

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

- [ ] `git checkout -b docs/close-claude-skills-restructure-plan`
- [ ] `git mv plans/in-progress/2026-05-20__claude-skills-restructure plans/done/`
- [ ] `git commit -m "docs(plan): move claude-skills-restructure to done"`
- [ ] PR + merge

---

**Created**: 2026-05-20
**Status**: In Progress
