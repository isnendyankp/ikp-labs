# Fix Three Confirmed Small Bugs - Implementation Checklist

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

1. [ ] Create branch `docs/fix-three-confirmed-bugs-plan`
2. [ ] `git add plans/in-progress/2026-11-19__fix-three-confirmed-bugs/`
3. [ ] **COMMIT**: `docs(plan): add fix-three-confirmed-bugs implementation plan`
4. [ ] Push branch, open PR, merge per this repo's branch-protection workflow
5. [ ] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [ ] All 4 plan documents exist under
      `plans/in-progress/2026-11-19__fix-three-confirmed-bugs/` on `main`
- [ ] PR merged to `main`

**Verification**:

```bash
git log --oneline -1 -- plans/in-progress/2026-11-19__fix-three-confirmed-bugs/
```

### Phase 0 Gate

> All checks below must pass before starting Phase 1.

- [ ] `test -d plans/in-progress/2026-11-19__fix-three-confirmed-bugs`
      succeeds on `main`
- [ ] All 4 files (`README.md`, `requirements.md`, `technical-design.md`,
      `checklist.md`) present in that directory

Safe to stop here — plan is committed and on `main`, no implementation
changes yet. To resume: re-run the Phase 0 Gate checks above.

---

## Phase 1: Fix all 3 bugs (the 1 counted PR)

### Task 1.1: Re-verify every fact before editing

**Goal**: Confirm nothing drifted between this plan being written and
implementation starting.

**Steps**:

1. [ ] Create branch `fix/three-confirmed-bugs`
2. [ ] `sed -n '3p' README.md` — re-confirm line 3 still contains two
       `workflows/ci.yml` occurrences
3. [ ] `grep -n "^name:" .claude/agents/docs-maker.md
   .claude/agents/docs-checker.md .claude/agents/specs-maker.md
   .claude/agents/test-checker.md` — re-confirm all 4 still carry the
       pre-rename values documented in `technical-design.md` Change 2
4. [ ] `grep -n "mismatch\|⚠" docs/reference/claude-agents.md` — re-confirm
       the paragraph, markers, and notes documented in `technical-design.md`
       Change 3 are all still present and unchanged
5. [ ] `grep -n "^model:" .claude/agents/pr-review-maker.md` — re-confirm
       line 5 is still empty `model:`

**Acceptance Criteria**:

- [ ] All before-text either matches `technical-design.md` exactly, or any
      drift is noted and the edits below are adjusted to the real current
      text before proceeding. No drift found.

**Dependencies**:

- Requires: Phase 0 Gate passed

---

### Task 1.2: Fix Bug 1 — `README.md` CI badge link

**Goal**: Apply Change 1 from `technical-design.md`.

**Steps**:

1. [ ] Replace both `workflows/ci.yml` occurrences on line 3 with
       `workflows/kameravue-ci.yml`
2. [ ] **COMMIT**: `fix(docs): point ci badge link at kameravue-ci.yml`

**Acceptance Criteria**:

- [ ] `grep -c "workflows/ci\.yml" README.md` returns `0`
- [ ] `grep -c "workflows/kameravue-ci\.yml" README.md` returns `2`
- [ ] `git diff README.md` touches only line 3

**Verification**:

```bash
grep -n "workflows/ci\.yml\|workflows/kameravue-ci\.yml" README.md
git diff --stat README.md
```

**Dependencies**:

- Requires: Task 1.1 complete
- Blocks: Task 1.3

---

### Task 1.3: Fix Bug 2, part A — agent frontmatter `name:` fields

**Goal**: Apply Change 2 from `technical-design.md` to all 4 agent files.

**Steps**:

1. [ ] `.claude/agents/docs-maker.md` line 2: `documentation-writer` →
       `docs-maker`
2. [ ] `.claude/agents/docs-checker.md` line 2: `docs-validator` →
       `docs-checker`
3. [ ] `.claude/agents/specs-maker.md` line 2: `gherkin-spec-writer` →
       `specs-maker`
4. [ ] `.claude/agents/test-checker.md` line 2: `test-validator` →
       `test-checker`
5. [ ] **COMMIT**: `fix(agents): correct frontmatter name field for 4 renamed agents`

**Acceptance Criteria**:

- [ ] `grep -n "^name:" .claude/agents/docs-maker.md` returns
      `name: docs-maker`
- [ ] `grep -n "^name:" .claude/agents/docs-checker.md` returns
      `name: docs-checker`
- [ ] `grep -n "^name:" .claude/agents/specs-maker.md` returns
      `name: specs-maker`
- [ ] `grep -n "^name:" .claude/agents/test-checker.md` returns
      `name: test-checker`
- [ ] `git diff` on each of the 4 files touches only line 2 — no other
      frontmatter field changed

**Verification**:

```bash
grep -n "^name:" .claude/agents/docs-maker.md .claude/agents/docs-checker.md \
  .claude/agents/specs-maker.md .claude/agents/test-checker.md
git diff --stat .claude/agents/docs-maker.md .claude/agents/docs-checker.md \
  .claude/agents/specs-maker.md .claude/agents/test-checker.md
```

**Dependencies**:

- Requires: Task 1.2 complete
- Blocks: Task 1.4

---

### Task 1.4: Fix Bug 2, part B — clean up `docs/reference/claude-agents.md`

**Goal**: Apply Changes 3.1-3.5 from `technical-design.md` so the catalog
no longer documents a bug that was just fixed in Task 1.3.

**Steps**:

1. [ ] Change 3.1: remove the "Known frontmatter/filename mismatch (4
       agents)" paragraph
2. [ ] Change 3.2: remove `⚠` from the `docs-maker.md` and `docs-checker.md`
       rows in the Documentation family table
3. [ ] Change 3.3: remove the 2 inline "Known issue" notes after the
       Documentation family table
4. [ ] Change 3.4: remove `⚠` from the `specs-maker.md` and `test-checker.md`
       rows in the Testing & Specs family table
5. [ ] Change 3.5: remove the 2 inline "Known issue" notes after the
       Testing & Specs family table
6. [ ] Confirm no other content in the file changed (agent counts, other
       family tables, other sections)
7. [ ] **COMMIT**: `docs(agents): remove resolved frontmatter mismatch notes from catalog`

**Acceptance Criteria**:

- [ ] `grep -n "mismatch\|⚠" docs/reference/claude-agents.md` returns zero
      matches
- [ ] `grep -c "^### " docs/reference/claude-agents.md` is unchanged from
      before this task (no heading accidentally deleted)
- [ ] `git diff docs/reference/claude-agents.md` touches only the 5
      documented regions

**Verification**:

```bash
grep -n "mismatch\|⚠" docs/reference/claude-agents.md
git diff --stat docs/reference/claude-agents.md
```

**Dependencies**:

- Requires: Task 1.3 complete
- Blocks: Task 1.5

---

### Task 1.5: Fix Bug 3 — `pr-review-maker.md` empty `model:` field

**Goal**: Apply Change 4 from `technical-design.md`.

**Steps**:

1. [ ] `.claude/agents/pr-review-maker.md` line 5: `model:` → `model: sonnet`
2. [ ] **COMMIT**: `fix(agents): set model to sonnet on pr-review-maker`

**Acceptance Criteria**:

- [ ] `grep -n "^model:" .claude/agents/pr-review-maker.md` returns
      `model: sonnet`
- [ ] `git diff .claude/agents/pr-review-maker.md` touches only line 5

**Verification**:

```bash
grep -n "^model:\|^color:\|^tools:" .claude/agents/pr-review-maker.md
git diff --stat .claude/agents/pr-review-maker.md
```

**Dependencies**:

- Requires: Task 1.4 complete
- Blocks: Task 1.6

---

### Task 1.6: Open, merge, and verify the Phase 1 PR

**Goal**: Land all 3 bug fixes on `main` through this repo's standard PR
workflow.

**Steps**:

1. [ ] Push branch `fix/three-confirmed-bugs`
2. [ ] `gh pr create` with a title/body describing all 3 bugs and linking
       this plan
3. [ ] Merge via `gh pr merge --squash` once checks pass
4. [ ] `git checkout main && git pull origin main`
5. [ ] Re-run the full Verification Method block from `technical-design.md`
       against `main`
6. [ ] Mark Tasks 1.1-1.6 `[x]` in this checklist and commit the update

**Acceptance Criteria**:

- [ ] PR merged to `main`
- [ ] All verification commands from `technical-design.md` pass on `main`

**Dependencies**:

- Requires: Task 1.5 complete

### Phase 1 Gate

> All checks below must pass before starting Phase 2.

- [ ] PR merged to `main`
- [ ] `git diff` against the pre-Phase-1 commit touches only the 7 target
      files listed in `technical-design.md`'s "Files to Modify" — no
      accidental edit elsewhere
- [ ] All Verification Method commands from `technical-design.md` pass

Safe to stop here — all 3 bugs are fixed and live on `main`. To resume:
re-run the Phase 1 Gate checks above, then proceed to Phase 2.

---

## Phase 2: Knowledge Capture and Archival

### Task 2.1: Record Knowledge Capture outcome

**Goal**: Decide whether anything durable from this plan belongs in a
skill, governance doc, or how-to.

**Steps**:

1. [ ] Review the delivery: 3 independent, small, confirmed bugs fixed in
       1 PR; no new pattern, convention, or gotcha beyond what the
       `fix-plans-readme-stale-index` precedent already established
2. [ ] Update this plan's `README.md` "Knowledge Capture" section with the
       outcome (expected: no generalizable learnings beyond existing
       precedent, since this plan followed it rather than discovering
       something new)

**Acceptance Criteria**:

- [ ] `README.md`'s Knowledge Capture section no longer says "To be
      completed at plan archival"

**Dependencies**:

- Requires: Phase 1 Gate passed

---

### Task 2.2: Archive this plan to `plans/done/`

**Goal**: Move this plan folder to `plans/done/` and update `plans/README.md`
per this repo's standard plan-completion lifecycle.

**Steps**:

1. [ ] Update this plan's own `README.md` status to `✅ COMPLETED` with a
       completion date
2. [ ] `git mv plans/in-progress/2026-11-19__fix-three-confirmed-bugs/ plans/done/2026-11-19__fix-three-confirmed-bugs/`
3. [ ] Update `plans/README.md`'s "In Progress" tree listing (remove this
       plan's entry, restoring it to `└── README.md` only)
4. [ ] Update `plans/README.md`'s "Done (Archived)" tree listing (add this
       plan's own leaf with its 4-file contents)
5. [ ] Update `plans/README.md`'s Quick Stats: `**In Progress**` down by
       one, `**Completed Projects**` up by one with a new bullet for this
       plan
6. [ ] Remove this plan's entry from `plans/in-progress/README.md`'s
       "Currently In Progress" list
7. [ ] **COMMIT**: `docs(plan): mark fix-three-confirmed-bugs completed`
8. [ ] Push and merge via PR (this archival PR is standard overhead, not
       counted in the Phase 1 "1 PR" total — same convention as
       `plans/done/2026-11-12__fix-plans-readme-stale-index/`)

**Acceptance Criteria**:

- [ ] `test -d plans/done/2026-11-19__fix-three-confirmed-bugs` succeeds
- [ ] `test -d plans/in-progress/2026-11-19__fix-three-confirmed-bugs` fails
      (no duplicate remains)
- [ ] `plans/README.md` Quick Stats and tree listings reflect the move
- [ ] Archival commit merged to `main`

**Verification**:

```bash
test -d plans/done/2026-11-19__fix-three-confirmed-bugs && echo "archived OK"
test -d plans/in-progress/2026-11-19__fix-three-confirmed-bugs && echo "STILL PRESENT - FIX" || echo "no duplicate - OK"
git log --follow --oneline -- plans/done/2026-11-19__fix-three-confirmed-bugs/README.md
```

**Dependencies**:

- Requires: Task 2.1 complete

### Phase 2 Gate

> Final gate — all checks below must pass before this plan is considered
> fully complete.

- [ ] Plan folder moved to `plans/done/2026-11-19__fix-three-confirmed-bugs/`
      via `git mv` (verified with `git log --follow`, no duplicate under
      `plans/in-progress/`)
- [ ] `plans/README.md` is in its true final state
- [ ] Knowledge Capture outcome recorded in this plan's `README.md`
- [ ] Archival commit merged to `main`

Safe to stop here — plan is fully executed, verified, and archived.

---

## Commit Summary

Total Commits: 6 (1 plan-setup, 4 Phase 1 implementation, 1 Phase 2
archival)

| Commit # | Type | Scope  | Message                                                                 |
| -------- | ---- | ------ | ----------------------------------------------------------------------- |
| 1        | docs | plan   | `docs(plan): add fix-three-confirmed-bugs implementation plan`          |
| 2        | fix  | docs   | `fix(docs): point ci badge link at kameravue-ci.yml`                    |
| 3        | fix  | agents | `fix(agents): correct frontmatter name field for 4 renamed agents`      |
| 4        | docs | agents | `docs(agents): remove resolved frontmatter mismatch notes from catalog` |
| 5        | fix  | agents | `fix(agents): set model to sonnet on pr-review-maker`                   |
| 6        | docs | plan   | `docs(plan): mark fix-three-confirmed-bugs completed`                   |

## PR Summary

| PR       | Branch                               | Content                                       | Counted in the 1-PR estimate?   |
| -------- | ------------------------------------ | --------------------------------------------- | ------------------------------- |
| Setup    | `docs/fix-three-confirmed-bugs-plan` | This plan's 4 documents                       | No — standard plan-setup commit |
| 1        | `fix/three-confirmed-bugs`           | All 3 bug fixes (Commits 2-5)                 | Yes                             |
| Archival | (its own small PR)                   | Mark plan complete, `git mv` to `plans/done/` | No — standard archival commit   |

## Progress Tracking

**Overall Progress**: 0/9 tasks completed (0%)

| Phase                               | Tasks Completed | Tasks Total | Status      |
| ----------------------------------- | --------------- | ----------- | ----------- |
| Phase 0: Plan Setup                 | 0               | 1           | [ ] Pending |
| Phase 1: Fix all 3 bugs             | 0               | 6           | [ ] Pending |
| Phase 2: Knowledge Capture/Archival | 0               | 2           | [ ] Pending |

**Last Updated**: 2026-11-19 (plan created, not yet implemented)
