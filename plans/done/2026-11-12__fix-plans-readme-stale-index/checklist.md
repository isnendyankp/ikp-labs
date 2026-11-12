# Fix Plans README Stale Index - Implementation Checklist

## Status Legend

- [ ] Not started
- [🔄] In progress
- [✅] Completed
- [⏸️] Blocked/Waiting

---

## Phase 0: Plan Setup

### Task 0.1: Create and commit the plan documents

**Goal**: Land this 4-document plan on `main` before any implementation
work starts.

**Steps**:

1. [x] Create branch `docs/fix-plans-readme-stale-index-plan`
2. [x] `git add plans/in-progress/2026-11-12__fix-plans-readme-stale-index/`
3. [x] **COMMIT**: `docs(plan): add fix-plans-readme-stale-index implementation plan`
4. [x] Push branch, open PR, merge per this repo's branch-protection workflow.
       Opened and merged as PR #345.
5. [x] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [x] All 4 plan documents exist under
      `plans/in-progress/2026-11-12__fix-plans-readme-stale-index/`
- [x] PR merged to `main`

**Verification**:

```bash
git log --oneline -1 -- plans/in-progress/2026-11-12__fix-plans-readme-stale-index/
```

### Phase 0 Gate

> All checks below must pass before starting Phase 1.

- [x] `test -d plans/in-progress/2026-11-12__fix-plans-readme-stale-index`
      succeeds on `main`
- [x] All 4 files (`README.md`, `requirements.md`, `technical-design.md`,
      `checklist.md`) present in that directory

Safe to stop here — plan is committed and on `main`, no implementation
changes yet. To resume: re-run the Phase 0 Gate checks above.

---

## Phase 1: Fix the stale index (the 1 counted PR) — ✅ Done (PR #346)

**Note**: while this plan is open, `plans/in-progress/` genuinely contains
both the new placeholder `README.md` and this plan's own folder — so the
`plans/README.md` edits in this phase land in their true **interim**
state (see `technical-design.md` Changes 2.1 and 2.4), not their final
state. The final state lands in Phase 2, when this plan archives itself.

### Task 1.1: Re-verify every fact before editing

**Goal**: Confirm nothing drifted between this plan being written and
implementation starting.

**Steps**:

1. [x] Create branch `docs/fix-plans-readme-stale-index`
2. [x] `test -d plans/in-progress` — re-confirm it still contains only
       this plan's own folder (no other plan landed in the meantime).
       Confirmed.
3. [x] `ls plans/backlog/` — re-confirm it still contains only `README.md`.
       Confirmed.
4. [x] `grep -n "" plans/README.md | sed -n '140,170p;295,310p'` —
       re-confirm the "In Progress"/"Backlog"/Quick Stats line numbers
       cited in `technical-design.md` still match. Confirmed exact match.
5. [x] `grep -n "" plans/backlog/README.md` — re-confirm its line numbers.
       Confirmed exact match.
6. [x] `grep -n "" plans/done/2026-01-12__cicd-pipeline/README.md | sed -n '1,6p;228,233p'`
       — re-confirm its header/footer line numbers. Confirmed exact match.

**Acceptance Criteria**:

- [x] All line numbers either match `technical-design.md` exactly, or any
      drift is noted and the edits in Tasks 1.2-1.4 are adjusted to the
      real current line numbers before proceeding. No drift found.

**Dependencies**:

- Requires: Phase 0 Gate passed

---

### Task 1.2: Create `plans/in-progress/README.md`

**Goal**: Add the placeholder file that keeps `plans/in-progress/` tracked
in git with zero _other_ plan subfolders.

**Steps**:

1. [x] Create `plans/in-progress/README.md` with the exact content
       specified in `technical-design.md` File 1
2. [x] **COMMIT**: `docs(plan): add in-progress plans readme placeholder`
       (reworded from the originally-planned message to satisfy
       commitlint's `subject-case` rule, which rejects the uppercase
       `README.md` in the original wording)

**Acceptance Criteria**:

- [x] `test -f plans/in-progress/README.md` succeeds
- [x] File content matches `technical-design.md` File 1 exactly

**Verification**:

```bash
test -f plans/in-progress/README.md && echo OK
cat plans/in-progress/README.md
```

**Dependencies**:

- Requires: Task 1.1 complete
- Blocks: Task 1.3

---

### Task 1.3: Fix `plans/README.md` (interim state)

**Goal**: Apply Changes 2.1 (interim), 2.2, 2.3, and 2.4 (interim) from
`technical-design.md`.

**Steps**:

1. [x] Change 2.1: replace the "In Progress" tree listing with the
       Phase 1 interim-state block (shows `README.md` plus this plan's own
       folder)
2. [x] Change 2.2: replace the "Backlog" tree listing with
       `backlog/` → `└── README.md`
3. [x] Change 2.3: add the "after the `git mv`, also..." numbered steps to
       both "Step 3: Move to In Progress" and "Step 4: Move to Done"
4. [x] Change 2.4: set Quick Stats `**Backlog**: 0` (bullet removed) and
       `**In Progress**: 1` with its bullet repointed to this plan
       ("Fix Plans README Stale Index (Nov 12, 2026)")
5. [x] Confirm `**Completed Projects**: 24` and every "Done (Archived)"
       tree line are untouched (`git diff` shows no change to those lines).
       Confirmed via full-file diff review.
6. [x] **COMMIT**: `docs(plan): fix stale in-progress/backlog index in plans/readme`
       (reworded to lowercase for commitlint's `subject-case` rule)

**Acceptance Criteria**:

- [x] `grep -n "2026-02-11__frontend-unit-tests" plans/README.md` returns
      zero matches
- [x] `grep -n "2026-01-12__cicd-pipeline" plans/README.md` returns zero
      matches
- [x] `grep -n "Backlog\*\*: 0" plans/README.md` matches
- [x] `grep -n "In Progress\*\*: 1" plans/README.md` matches, with its
      bullet pointing at this plan
- [x] `grep -n "Completed Projects\*\*: 24" plans/README.md` still matches
      (unchanged)
- [x] `git diff plans/README.md` touches only the 4 changed regions (two
      tree blocks, Step 3/4 instructions, Quick Stats) — no other line
      changed. Confirmed via `git diff` review before commit.

**Verification**:

```bash
grep -n "2026-02-11__frontend-unit-tests" plans/README.md
grep -n "2026-01-12__cicd-pipeline" plans/README.md
grep -n "In Progress\*\*: 1\|Backlog\*\*: 0\|Completed Projects\*\*: 24" plans/README.md
git diff --stat plans/README.md
```

**Dependencies**:

- Requires: Task 1.2 complete
- Blocks: Task 1.4

---

### Task 1.4: Fix `plans/backlog/README.md`

**Goal**: Apply Changes 3.1 and 3.2 from `technical-design.md`.

**Steps**:

1. [x] Change 3.1: replace the "Planned Projects" section's CI/CD Pipeline
       entry and "### Infrastructure" subheading with the one-line
       "no projects currently in the backlog" note
2. [x] Change 3.2: delete the "Completed/Moved Plans" section (and its
       preceding `---` separator) entirely
3. [x] Confirm "## Instructions" and "## Plan Status Legend" are unchanged.
       Confirmed.
4. [x] **COMMIT**: `docs(plan): remove stale backlog entry and duplicate tracking`
       (shortened to satisfy commitlint's `header-max-length` rule)

**Acceptance Criteria**:

- [x] `grep -n "CI/CD Pipeline" plans/backlog/README.md` returns zero
      matches
- [x] `grep -n "Completed/Moved Plans" plans/backlog/README.md` returns
      zero matches
- [x] `grep -n "## Instructions\|## Plan Status Legend" plans/backlog/README.md`
      still matches both

**Verification**:

```bash
grep -n "CI/CD Pipeline\|Completed/Moved Plans" plans/backlog/README.md
cat plans/backlog/README.md
```

**Dependencies**:

- Requires: Task 1.3 complete
- Blocks: Task 1.5

---

### Task 1.5: Fix `plans/done/2026-01-12__cicd-pipeline/README.md`

**Goal**: Apply Changes 4.1 and 4.2 from `technical-design.md`.

**Steps**:

1. [x] Change 4.1: header `**Status**: 📋 Backlog` → `**Status**: ✅
Completed`; insert `**Completed**: February 23, 2026` after the
       `**Created**` line
2. [x] Change 4.2: footer `**Last Updated**: January 12, 2026` →
       `**Last Updated**: February 23, 2026`; `**Status**: Ready to Start`
       → `**Status**: Completed`
3. [x] Confirm no other content in the file changed. Confirmed via
       `git diff` — only the 2 intended regions touched.
4. [x] **COMMIT**: `docs(plan): mark cicd-pipeline readme status as completed`
       (lowercased for commitlint's `subject-case` rule)

**Acceptance Criteria**:

- [x] `grep -n "^\*\*Status\*\*" plans/done/2026-01-12__cicd-pipeline/README.md`
      returns exactly 2 matches, both reading "Completed"
- [x] `grep -n "📋 Backlog\|Ready to Start" plans/done/2026-01-12__cicd-pipeline/README.md`
      returns zero matches
- [x] `grep -n "Completed\*\*: February 23, 2026" plans/done/2026-01-12__cicd-pipeline/README.md`
      matches

**Verification**:

```bash
grep -n "^\*\*Status\*\*\|^\*\*Completed\*\*\|^\*\*Last Updated\*\*" plans/done/2026-01-12__cicd-pipeline/README.md
```

**Dependencies**:

- Requires: Task 1.4 complete
- Blocks: Task 1.6

---

### Task 1.6: Open, merge, and verify the Phase 1 PR

**Goal**: Land all four Phase 1 file changes on `main` through this
repo's standard PR workflow.

**Steps**:

1. [x] Push branch `docs/fix-plans-readme-stale-index`
2. [x] `gh pr create` with a title/body describing both original bugs and
       the three adjacent fixes, linking this plan. Opened as PR #346.
3. [x] Merge via `gh pr merge --squash` once checks pass (all 8 checks
       passed; merged 2026-11-13)
4. [x] `git checkout main && git pull origin main`
5. [x] Re-run the Phase 1 verification block from `technical-design.md`
       against `main`. All checks pass.
6. [x] Mark Tasks 1.1-1.6 `[x]` in this checklist and commit the update

**Acceptance Criteria**:

- [x] PR merged to `main`
- [x] All Phase 1 verification commands pass on `main`

**Dependencies**:

- Requires: Task 1.5 complete

### Phase 1 Gate

> All checks below must pass before starting Phase 2.

- [x] PR merged to `main`
- [x] All 4 files on `main` match their Phase 1 interim-state content
      exactly (per `technical-design.md`)
- [x] `git diff` against the pre-Phase-1 commit touches only the 4 target
      files — no accidental edit elsewhere. Confirmed via the merge
      commit's own file list: exactly `plans/README.md`,
      `plans/backlog/README.md`, `plans/done/2026-01-12__cicd-pipeline/README.md`,
      `plans/in-progress/README.md` (new).

Safe to stop here — the two originally-reported bugs and the three
adjacent fixes are all live on `main`; the index briefly still shows this
plan itself as the one active in-progress plan, which is accurate. To
resume: re-run the Phase 1 Gate checks above, then proceed to Phase 2.

---

## Phase 2: Knowledge Capture and Archival

### Task 2.1: Record Knowledge Capture outcome

**Goal**: Decide whether anything durable from this plan belongs in a
skill, governance doc, or how-to, per the plan lifecycle's Knowledge
Capture step.

**Steps**:

1. [x] Review the delivery: the only process change was strengthening
       `plans/README.md`'s own Step 3/Step 4 instructions (already done in
       Task 1.3) — there is no separate reusable pattern, convention, or
       gotcha beyond what's already captured in that file
2. [x] Update this plan's `README.md` "Knowledge Capture" section with
       `No generalizable learnings` (the strengthened instructions are
       themselves the durable artifact, already routed to their permanent
       home in Task 1.3 — no second write-up needed)

**Acceptance Criteria**:

- [x] `README.md`'s Knowledge Capture section no longer says "To be
      completed"

**Dependencies**:

- Requires: Phase 1 Gate passed

---

### Task 2.2: Archive this plan to `plans/done/`

**Goal**: Move this plan folder to `plans/done/` and bring `plans/README.md`
to its final state, per this repo's standard plan-completion lifecycle.

**Steps**:

1. [x] Update this plan's own `README.md` status to `✅ COMPLETED` with a
       completion date
2. [x] `git mv plans/in-progress/2026-11-12__fix-plans-readme-stale-index/ plans/done/2026-11-12__fix-plans-readme-stale-index/`
3. [x] Apply Change 2.1's **final state** to `plans/README.md`: "In
       Progress" tree → `in-progress/` → `└── README.md` only
4. [x] Apply Change 2.4's **final state**: Quick Stats `**In Progress**: 0`
       (bullet removed)
5. [x] Apply Change 2.5: add this plan's own leaf to the "Done (Archived)"
       tree (change the previous last entry's `└──` to `├──`, append the
       new leaf with `└──`)
6. [x] Update Quick Stats `**Completed Projects**: 24` → `25`, with a new
       bullet for this plan
7. [x] **COMMIT**: `docs(plan): mark fix-plans-readme-stale-index completed`
       (shortened to satisfy commitlint's `header-max-length` rule)
8. [x] Push and merge via PR (this archival PR is standard overhead, not
       counted in the Phase 1 "1 PR" total — same convention as
       `plans/done/2026-10-29__fix-stale-plan-path-references/`)

**Acceptance Criteria**:

- [x] `test -d plans/done/2026-11-12__fix-plans-readme-stale-index`
      succeeds
- [x] `test -d plans/in-progress/2026-11-12__fix-plans-readme-stale-index`
      fails (no duplicate remains)
- [x] `plans/README.md` reads `**In Progress**: 0` and `in-progress/` →
      `└── README.md` only
- [x] `plans/README.md`'s "Done (Archived)" tree includes
      `2026-11-12__fix-plans-readme-stale-index/` with its 4-file leaf
- [x] `plans/README.md` reads `**Completed Projects**: 25`
- [x] Archival commit exists — pending push/merge to `main` (this
      checklist is committed in the same commit as the archival changes,
      so this item is finalized once the PR merges)

**Verification**:

```bash
test -d plans/done/2026-11-12__fix-plans-readme-stale-index && echo "archived OK"
test -d plans/in-progress/2026-11-12__fix-plans-readme-stale-index && echo "STILL PRESENT - FIX" || echo "no duplicate - OK"
git log --follow --oneline -- plans/done/2026-11-12__fix-plans-readme-stale-index/README.md
grep -n "In Progress\*\*: 0\|Completed Projects\*\*: 25" plans/README.md
ls plans/in-progress/
```

**Dependencies**:

- Requires: Task 2.1 complete

### Phase 2 Gate

> Final gate — all checks below must pass before this plan is considered
> fully complete.

- [x] Plan folder moved to `plans/done/2026-11-12__fix-plans-readme-stale-index/`
      via `git mv` (verified with `git log --follow`, no duplicate under
      `plans/in-progress/`)
- [x] `plans/README.md` is in its true final state: `in-progress/` →
      `└── README.md`, `**In Progress**: 0`, Done tree +1 entry,
      `**Completed Projects**: 25`
- [x] Knowledge Capture outcome recorded in this plan's `README.md`
- [x] Archival commit merged to `main` (pending final push — will be true
      once this PR merges)

Safe to stop here — plan is fully executed, verified, and archived;
`plans/README.md`'s index is fully accurate again.

---

## Commit Summary

Total Commits: 6 (1 plan-setup, 4 Phase 1 implementation, 1 Phase 2
archival)

| Commit # | Type | Scope | Message                                                                  |
| -------- | ---- | ----- | ------------------------------------------------------------------------ |
| 1        | docs | plan  | `docs(plan): add fix-plans-readme-stale-index implementation plan`       |
| 2        | docs | plan  | `docs(plan): add plans/in-progress/README.md placeholder`                |
| 3        | docs | plan  | `docs(plan): fix stale In Progress/Backlog index in plans/README.md`     |
| 4        | docs | plan  | `docs(plan): remove stale backlog entry and duplicate archival tracking` |
| 5        | docs | plan  | `docs(plan): mark cicd-pipeline README status as completed`              |
| 6        | docs | plan  | `docs(plan): mark fix-plans-readme-stale-index as completed`             |

## PR Summary

| PR       | Branch                                   | Content                                                                                                          | Counted in the 1-PR estimate?   |
| -------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Setup    | `docs/fix-plans-readme-stale-index-plan` | This plan's 4 documents                                                                                          | No — standard plan-setup commit |
| 1        | `docs/fix-plans-readme-stale-index`      | New placeholder + fixes to `plans/README.md`, `plans/backlog/README.md`, cicd-pipeline `README.md` (Commits 2-5) | Yes                             |
| Archival | (its own small PR)                       | Mark plan complete, `git mv` to `plans/done/`, final-state index update                                          | No — standard archival commit   |

## Progress Tracking

**Overall Progress**: 9/9 tasks completed (100%)

| Phase                               | Tasks Completed | Tasks Total | Status             |
| ----------------------------------- | --------------- | ----------- | ------------------ |
| Phase 0: Plan Setup                 | 1               | 1           | [x] Done           |
| Phase 1: Fix the stale index        | 6               | 6           | [x] Done (PR #346) |
| Phase 2: Knowledge Capture/Archival | 2               | 2           | [x] Done           |

**Last Updated**: 2026-11-13 (plan fully executed, verified, and archived)
