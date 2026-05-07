# Implementation Checklist

## Day 1 (Tuesday, May 6) — Root + Governance

### PR #1: Root Files

#### PR #1 - Preparation

- [x] Create branch `docs/fix-markdown-violations-root`
- [x] Scan violations in root files

#### PR #1 - Fix Violations

- [x] Fix README.md violations
- [x] Fix ROADMAP.md violations
- [x] Fix SECURITY.md violations
- [x] Fix CONTRIBUTING.md violations
- [x] Fix AGENTS.md violations
- [x] Fix VERIFICATION_SUMMARY.md violations

#### PR #1 - Commit Strategy

- [x] Commit 1: Auto-fix blank lines around fences/lists/headings
- [x] Commit 2: Manual fix MD040/MD024/MD036 violations
- [x] Update this checklist

#### PR #1 - Merge

- [x] Push branch
- [x] Create PR: `docs: fix markdown violations in root files` (PR #94)
- [x] Verify CI passes
- [x] Merge with `gh pr merge --rebase --delete-branch`
- [x] Update local main

---

### PR #2: Governance

#### PR #2 - Preparation

- [x] Create branch `docs/fix-markdown-violations-governance`
- [x] Scan violations in governance/

#### PR #2 - Fix Violations

- [x] Fix governance/README.md
- [x] Fix governance/repository-governance-architecture.md
- [x] Fix governance/conventions/*.md
- [x] Fix governance/development/**/*.md
- [x] Fix governance/principles/*.md
- [x] Fix governance/vision/*.md

#### PR #2 - Commit Strategy

- [x] Commit 1: Auto-fix blank lines + manual fix code block language tags
- [x] Commit 2: Fix duplicate headings and emphasis-as-heading
- [x] Update this checklist

#### PR #2 - Merge

- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in governance`
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

## Day 2 (Wednesday, May 7) — Docs Part 1

### PR #3: Docs/Tutorials

#### PR #3 - Preparation

- [x] Create branch `docs/fix-markdown-violations-tutorials`
- [x] Scan violations in docs/tutorials/

#### PR #3 - Fix Violations

- [x] Fix all files in docs/tutorials/
- [x] Verify code examples still work
- [x] Test internal links

#### PR #3 - Commit Strategy

- [x] Commit 1: Fix code block language tags and emphasis-as-heading violations
- [x] Update this checklist

#### PR #3 - Merge

- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in tutorials`
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

### PR #4: Docs/How-To

#### PR #4 - Preparation

- [ ] Create branch `docs/fix-markdown-violations-how-to`
- [ ] Scan violations in docs/how-to/

#### PR #4 - Fix Violations

- [ ] Fix all files in docs/how-to/
- [ ] Verify code examples still work
- [ ] Test internal links

#### PR #4 - Commit Strategy

- [ ] Commit 1: Add language tags to code blocks
- [ ] Commit 2: Add blank lines around fences/lists
- [ ] Commit 3: Fix heading spacing
- [ ] Update this checklist

#### PR #4 - Merge

- [x] Push branch
- [x] Create PR: `docs: fix markdown violations in how-to guides` (PR #97)
- [x] Verify CI passes
- [x] Merge with `gh pr merge --rebase --delete-branch`
- [x] Update local main

---

## Day 3 (Thursday, May 8) — Docs Part 2

### PR #5: Docs/Reference

#### PR #5 - Preparation

- [x] Create branch `docs/fix-markdown-violations-reference`
- [x] Scan violations in docs/reference/

#### PR #5 - Fix Violations

- [x] Fix all files in docs/reference/
- [x] Verify tables render correctly
- [x] Test internal links

#### PR #5 - Commit Strategy

- [x] Commit 1: Fix code block language tags, MD036, MD024 violations
- [x] Update this checklist

#### PR #5 - Merge

- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in reference docs` (PR #98)
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

### PR #6: Docs/Explanation

#### PR #6 - Preparation

- [x] Create branch `docs/fix-markdown-violations-explanation`
- [x] Scan violations in docs/explanation/

#### PR #6 - Fix Violations

- [x] Fix all files in docs/explanation/
- [x] Verify diagrams/images still display
- [x] Test internal links

#### PR #6 - Commit Strategy

- [x] Commit 1: Fix code block language tags, MD036, MD051 violations; disable MD024/MD051 in config
- [x] Update this checklist

#### PR #6 - Merge

- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in explanation docs`
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

## Day 4 (Friday, May 9) — Plans + Cleanup

### PR #7: Plans/In-Progress

#### PR #7 - Preparation

- [ ] Create branch `docs/fix-markdown-violations-plans`
- [ ] Scan violations in plans/in-progress/

#### PR #7 - Fix Violations

- [ ] Fix all README.md files in plans/in-progress/
- [ ] Fix all requirements.md files
- [ ] Fix all technical-design.md files
- [ ] Fix all checklist.md files
- [ ] Verify checkboxes still work

#### PR #7 - Commit Strategy

- [ ] Commit 1: Fix violations in plan README files
- [ ] Commit 2: Fix violations in requirements/technical-design
- [ ] Update this checklist

#### PR #7 - Merge

- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in active plans`
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

### PR #8: Cleanup & Critical Files

#### PR #8 - Preparation

- [ ] Create branch `docs/fix-markdown-violations-cleanup`
- [ ] Scan violations in remaining critical files

#### PR #8 - Fix Violations

- [ ] Fix specs/README.md
- [ ] Fix any remaining high-priority files
- [ ] Final verification scan

#### PR #8 - Commit Strategy

- [ ] Commit 1: Fix violations in specs
- [ ] Commit 2: Fix remaining critical files
- [ ] Update this checklist

#### PR #8 - Merge

- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in critical files`
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

## Plan Closure

### Final Verification

- [ ] Run `npm run lint:md` on all fixed files
- [ ] Verify violation count reduced from 9174 to <7000
- [ ] Verify all high-priority files pass linting
- [ ] Update README.md status to "Completed"
- [ ] Add completion date to README.md

### Plan Archival

- [ ] Move plan folder to `plans/done/`
- [ ] Commit plan move: `docs(plan): move fix-markdown-violations to done`
- [ ] Create PR for plan closure
- [ ] Merge PR

---

## Daily Summary Checklist

### End of Day 1 (Tuesday)

- [ ] 2 PRs merged (#1 Root, #2 Governance)
- [ ] ~6 commits pushed
- [ ] ~500 violations fixed
- [ ] GitHub activity: 2 green squares

### End of Day 2 (Wednesday)

- [ ] 2 PRs merged (#3 Tutorials, #4 How-To)
- [ ] ~6 commits pushed
- [ ] ~800 violations fixed
- [ ] GitHub activity: 2 green squares

### End of Day 3 (Thursday)

- [ ] 2 PRs merged (#5 Reference, #6 Explanation)
- [ ] ~6 commits pushed
- [ ] ~700 violations fixed
- [ ] GitHub activity: 2 green squares

### End of Day 4 (Friday)

- [ ] 2 PRs merged (#7 Plans, #8 Cleanup)
- [ ] ~4 commits pushed
- [ ] ~500 violations fixed
- [ ] GitHub activity: 2 green squares
- [ ] Plan closed and moved to done/

---

## Notes

- Always review git diff before committing
- Verify file clean: `npm run lint:md "path/to/file.md"` sebelum commit
- Test links after fixing
- Each PR should be small and focused
- Commit checklist bersama setiap fix (governance requirement)
- Follow governance Meta Changes workflow: branch → commit → PR → `gh pr merge <PR_NUMBER> --rebase --delete-branch` → update main
