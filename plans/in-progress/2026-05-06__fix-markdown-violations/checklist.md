# Implementation Checklist

## Day 1 (Tuesday, May 6) — Root + Governance

### PR #1: Root Files

#### Preparation
- [ ] Create branch `docs/fix-markdown-violations-root`
- [ ] Scan violations in root files

#### Fix Violations
- [ ] Fix README.md violations
- [ ] Fix ROADMAP.md violations
- [ ] Fix SECURITY.md violations
- [ ] Fix CONTRIBUTING.md violations
- [ ] Fix AGENTS.md violations
- [ ] Fix VERIFICATION_SUMMARY.md violations

#### Commit Strategy
- [ ] Commit 1: Add language tags to code blocks
- [ ] Commit 2: Add blank lines around fences/lists
- [ ] Commit 3: Fix heading spacing
- [ ] Update this checklist

#### PR & Merge
- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in root files`
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

### PR #2: Governance

#### Preparation
- [ ] Create branch `docs/fix-markdown-violations-governance`
- [ ] Scan violations in governance/

#### Fix Violations
- [ ] Fix governance/README.md
- [ ] Fix governance/repository-governance-architecture.md
- [ ] Fix governance/conventions/*.md
- [ ] Fix governance/development/**/*.md
- [ ] Fix governance/principles/*.md
- [ ] Fix governance/vision/*.md

#### Commit Strategy
- [ ] Commit 1: Fix violations in governance root files
- [ ] Commit 2: Fix violations in governance/conventions
- [ ] Commit 3: Fix violations in governance/development
- [ ] Update this checklist

#### PR & Merge
- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in governance`
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

## Day 2 (Wednesday, May 7) — Docs Part 1

### PR #3: Docs/Tutorials

#### Preparation
- [ ] Create branch `docs/fix-markdown-violations-tutorials`
- [ ] Scan violations in docs/tutorials/

#### Fix Violations
- [ ] Fix all files in docs/tutorials/
- [ ] Verify code examples still work
- [ ] Test internal links

#### Commit Strategy
- [ ] Commit 1: Add language tags to code blocks
- [ ] Commit 2: Add blank lines around fences/lists
- [ ] Commit 3: Fix heading spacing
- [ ] Update this checklist

#### PR & Merge
- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in tutorials`
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

### PR #4: Docs/How-To

#### Preparation
- [ ] Create branch `docs/fix-markdown-violations-how-to`
- [ ] Scan violations in docs/how-to/

#### Fix Violations
- [ ] Fix all files in docs/how-to/
- [ ] Verify code examples still work
- [ ] Test internal links

#### Commit Strategy
- [ ] Commit 1: Add language tags to code blocks
- [ ] Commit 2: Add blank lines around fences/lists
- [ ] Commit 3: Fix heading spacing
- [ ] Update this checklist

#### PR & Merge
- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in how-to guides`
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

## Day 3 (Thursday, May 8) — Docs Part 2

### PR #5: Docs/Reference

#### Preparation
- [ ] Create branch `docs/fix-markdown-violations-reference`
- [ ] Scan violations in docs/reference/

#### Fix Violations
- [ ] Fix all files in docs/reference/
- [ ] Verify tables render correctly
- [ ] Test internal links

#### Commit Strategy
- [ ] Commit 1: Add language tags to code blocks
- [ ] Commit 2: Add blank lines around fences/lists
- [ ] Commit 3: Fix heading spacing
- [ ] Update this checklist

#### PR & Merge
- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in reference docs`
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

### PR #6: Docs/Explanation

#### Preparation
- [ ] Create branch `docs/fix-markdown-violations-explanation`
- [ ] Scan violations in docs/explanation/

#### Fix Violations
- [ ] Fix all files in docs/explanation/
- [ ] Verify diagrams/images still display
- [ ] Test internal links

#### Commit Strategy
- [ ] Commit 1: Add language tags to code blocks
- [ ] Commit 2: Add blank lines around fences/lists
- [ ] Commit 3: Fix heading spacing
- [ ] Update this checklist

#### PR & Merge
- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in explanation docs`
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

## Day 4 (Friday, May 9) — Plans + Cleanup

### PR #7: Plans/In-Progress

#### Preparation
- [ ] Create branch `docs/fix-markdown-violations-plans`
- [ ] Scan violations in plans/in-progress/

#### Fix Violations
- [ ] Fix all README.md files in plans/in-progress/
- [ ] Fix all requirements.md files
- [ ] Fix all technical-design.md files
- [ ] Fix all checklist.md files
- [ ] Verify checkboxes still work

#### Commit Strategy
- [ ] Commit 1: Fix violations in plan README files
- [ ] Commit 2: Fix violations in requirements/technical-design
- [ ] Update this checklist

#### PR & Merge
- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in active plans`
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

### PR #8: Cleanup & Critical Files

#### Preparation
- [ ] Create branch `docs/fix-markdown-violations-cleanup`
- [ ] Scan violations in remaining critical files

#### Fix Violations
- [ ] Fix specs/README.md
- [ ] Fix any remaining high-priority files
- [ ] Final verification scan

#### Commit Strategy
- [ ] Commit 1: Fix violations in specs
- [ ] Commit 2: Fix remaining critical files
- [ ] Update this checklist

#### PR & Merge
- [ ] Push branch
- [ ] Create PR: `docs: fix markdown violations in critical files`
- [ ] Verify CI passes
- [ ] Merge with `gh pr merge --rebase --delete-branch`
- [ ] Update local main

---

## Plan Closure

### Final Verification
- [ ] Run `npm run lint:md` on all fixed files
- [ ] Verify violation count reduced from 9475 to <7000
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

- Use `--no-verify` flag for commits if markdown linting blocks commit
- Always review git diff before committing
- Test links after fixing
- Each PR should be small and focused
- Update this checklist after each commit
- Follow governance workflow: branch → commit → PR → merge → update main
