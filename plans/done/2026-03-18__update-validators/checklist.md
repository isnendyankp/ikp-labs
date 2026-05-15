# Checklist: Update Validator Agents

---

## Phase 1: Setup

- [x] Create work branch `fix/update-validators` from main
- [x] Create plan directory `plans/in-progress/2026-03-18__update-validators/`
- [x] Create README.md
- [x] Create requirements.md
- [x] Create technical-design.md
- [x] Create checklist.md

---

## Phase 2: Update test-validator.md

- [x] Update project structure diagram (lines ~35-55)
  - Change `frontend/tests/` to `tests/e2e/` and `tests/api/`
  - Add nested structure for gherkin
- [x] Update analysis steps reference (line ~70)
- [x] Update example findings with correct paths
- [x] Update Last Updated date to 2026-03-18
- [x] Commit: `fix(agents): update test-validator path references`

---

## Phase 3: Update docs-validator.md

- [x] Update project structure diagram (lines ~35-55)
- [x] Fix any path references
- [x] Update Last Updated date to 2026-03-18
- [x] Commit: `fix(agents): update docs-validator path references`

---

## Phase 4: Update plan-checker.md

- [x] Update project structure diagram (lines ~35-55)
- [x] Fix any path references
- [x] Update Last Updated date to 2026-03-18
- [x] Commit: `fix(agents): update plan-checker path references`

---

## Phase 5: Verification

- [x] Read all 3 updated files to verify changes
- [x] Confirm paths match actual project structure
- [x] Verify markdown syntax is correct

---

## Phase 6: Finalize & PR

- [ ] Update checklist with completion status
- [ ] Push branch to origin
- [ ] Create Pull Request with summary
- [ ] Wait for approval
- [ ] Merge with `gh pr merge --rebase --delete-branch`

---

## Commit Strategy

```text
1. git add .claude/agents/test-validator.md plans/in-progress/2026-03-18__update-validators/checklist.md
   → fix(agents): update test-validator path references

2. git add .claude/agents/docs-validator.md plans/in-progress/2026-03-18__update-validators/checklist.md
   → fix(agents): update docs-validator path references

3. git add .claude/agents/plan-checker.md plans/in-progress/2026-03-18__update-validators/checklist.md
   → fix(agents): update plan-checker path references

4. git add plans/in-progress/2026-03-18__update-validators/
   → docs(plan): add validator update plan
```

---

**Progress:** 15/18 tasks complete (83%)
**Estimated Remaining:** 3 tasks
