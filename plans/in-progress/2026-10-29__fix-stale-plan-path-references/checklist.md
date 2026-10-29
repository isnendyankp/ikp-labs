# Fix Stale Plan Path References - Implementation Checklist

## Status Legend

- [ ] Not started
- [🔄] In progress
- [✅] Completed
- [⏸️] Blocked/Waiting

---

## Phase 0: Plan Setup

### Task 0.1: Create and commit the plan documents

**Goal**: Land this 4-document plan on `main` before any implementation work
starts.

**Steps**:

1. [ ] Create branch `docs/fix-stale-plan-path-references-plan`
2. [ ] `git add plans/in-progress/2026-10-29__fix-stale-plan-path-references/`
3. [ ] **COMMIT**: `docs(plan): add fix-stale-plan-path-references implementation plan`
4. [ ] Push branch, open PR, merge per this repo's branch-protection workflow
5. [ ] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [✅] All 4 plan documents exist under
  `plans/in-progress/2026-10-29__fix-stale-plan-path-references/`
- [✅] PR merged to `main`

**Verification**:

```bash
git log --oneline -1 -- plans/in-progress/2026-10-29__fix-stale-plan-path-references/
```

### Phase 0 Gate

> All checks below must pass before starting Phase 1.

- [ ] `test -d plans/in-progress/2026-10-29__fix-stale-plan-path-references`
      succeeds on `main`
- [ ] All 4 files (`README.md`, `requirements.md`, `technical-design.md`,
      `checklist.md`) present in that directory

Safe to stop here — plan is committed and on `main`, no implementation
changes yet. To resume: re-run the Phase 0 Gate checks above.

---

## Phase 1: Fix `docs/reference/claude-agents.md` (PR 1)

### Task 1.1: Correct all 5 stale path occurrences

**Goal**: Replace `plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc/requirements.md`
with `plans/done/2026-10-08__fix-claude-agents-catalog-doc/requirements.md`
at every occurrence in `docs/reference/claude-agents.md`.

**Steps**:

1. [x] Create branch `docs/fix-claude-agents-catalog-stale-path`
2. [x] Re-confirm current line numbers:
       `grep -n "plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc" docs/reference/claude-agents.md`
       (expect 5 matches; re-check exact line numbers in case the file
       shifted since this plan was written) — confirmed same 5 lines (62, 86, 94, 129, 137)
3. [x] Edit each of the 5 matched occurrences, changing only the
       `plans/in-progress/` segment to `plans/done/` — no other text on
       those lines changes
4. [x] **COMMIT**: `docs(reference): fix stale plan path in claude-agents.md`

**Acceptance Criteria**:

- [x] `grep -n "plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc" docs/reference/claude-agents.md`
      returns zero matches
- [x] `grep -c "plans/done/2026-10-08__fix-claude-agents-catalog-doc/requirements.md" docs/reference/claude-agents.md`
      returns exactly `5`
- [x] `test -f plans/done/2026-10-08__fix-claude-agents-catalog-doc/requirements.md`
      succeeds (confirms the corrected path actually resolves)
- [x] No other line in the file changed (diff touches only the 5 identified lines) — confirmed
      via `git diff`

**Verification**:

```bash
grep -n "plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc" docs/reference/claude-agents.md
grep -c "plans/done/2026-10-08__fix-claude-agents-catalog-doc/requirements.md" docs/reference/claude-agents.md
test -f plans/done/2026-10-08__fix-claude-agents-catalog-doc/requirements.md && echo OK
git diff --stat
```

**Dependencies**:

- Requires: Phase 0 Gate passed
- Blocks: Task 1.2

### Task 1.2: Open, merge, and verify PR 1

**Goal**: Land the Phase 1 fix on `main` through this repo's standard PR
workflow.

**Steps**:

1. [ ] Push branch `docs/fix-claude-agents-catalog-stale-path`
2. [ ] `gh pr create` with a title/body describing the stale-path fix and
       linking this plan
3. [ ] Merge via `gh pr merge --squash --auto` once checks pass
4. [ ] `git checkout main && git pull origin main`
5. [ ] Mark Task 1.1 and this task `[✅]` in this checklist and commit the
       update

**Acceptance Criteria**:

- [✅] PR merged to `main`
- [✅] `docs/reference/claude-agents.md` on `main` shows zero remaining
  occurrences of the stale pattern

**Verification**:

```bash
git checkout main && git pull origin main
grep -n "plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc" docs/reference/claude-agents.md
```

**Dependencies**:

- Requires: Task 1.1 complete

### Phase 1 Gate

> All checks below must pass before starting Phase 2.

- [ ] PR 1 merged to `main`
- [ ] `grep -n "plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc" docs/reference/claude-agents.md`
      (on `main`) returns zero matches

Safe to stop here — File 1 is fully corrected and merged; File 2 is
untouched. To resume: re-run the Phase 1 Gate checks above, then proceed to
Phase 2.

---

## Phase 2: Fix `governance/workflows/pr/pr-review-quality-gate.md` (PR 2)

### Task 2.1: Correct the stale path occurrence

**Goal**: Replace `plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows/`
with `plans/done/2026-10-16__repo-defining-multi-agent-workflows/` in
`governance/workflows/pr/pr-review-quality-gate.md`.

**Steps**:

1. [ ] Create branch `docs/fix-pr-review-quality-gate-stale-path`
2. [ ] Re-confirm current line number:
       `grep -n "plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows" governance/workflows/pr/pr-review-quality-gate.md`
       (expect 1 match; re-check exact line number in case the file shifted
       since this plan was written)
3. [ ] Edit that occurrence, changing only the `plans/in-progress/` segment
       to `plans/done/` — no other text on that line changes
4. [ ] **COMMIT**: `docs(governance): fix stale plan path in pr-review-quality-gate.md`

**Acceptance Criteria**:

- [✅] `grep -n "plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows" governance/workflows/pr/pr-review-quality-gate.md`
  returns zero matches
- [✅] `grep -c "plans/done/2026-10-16__repo-defining-multi-agent-workflows" governance/workflows/pr/pr-review-quality-gate.md`
  returns exactly `1`
- [✅] `test -d plans/done/2026-10-16__repo-defining-multi-agent-workflows`
  succeeds (confirms the corrected path actually resolves)
- [✅] No other line in the file changed (diff touches only the 1 identified line)

**Verification**:

```bash
grep -n "plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows" governance/workflows/pr/pr-review-quality-gate.md
grep -c "plans/done/2026-10-16__repo-defining-multi-agent-workflows" governance/workflows/pr/pr-review-quality-gate.md
test -d plans/done/2026-10-16__repo-defining-multi-agent-workflows && echo OK
git diff --stat
```

**Dependencies**:

- Requires: Phase 1 Gate passed
- Blocks: Task 2.2

### Task 2.2: Open, merge, and verify PR 2

**Goal**: Land the Phase 2 fix on `main` through this repo's standard PR
workflow.

**Steps**:

1. [ ] Push branch `docs/fix-pr-review-quality-gate-stale-path`
2. [ ] `gh pr create` with a title/body describing the stale-path fix and
       linking this plan
3. [ ] Merge via `gh pr merge --squash --auto` once checks pass
4. [ ] `git checkout main && git pull origin main`
5. [ ] Mark Task 2.1 and this task `[✅]` in this checklist and commit the
       update

**Acceptance Criteria**:

- [✅] PR merged to `main`
- [✅] `governance/workflows/pr/pr-review-quality-gate.md` on `main` shows
  zero remaining occurrences of the stale pattern

**Verification**:

```bash
git checkout main && git pull origin main
grep -n "plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows" governance/workflows/pr/pr-review-quality-gate.md
```

**Dependencies**:

- Requires: Task 2.1 complete

### Phase 2 Gate

> All checks below must pass before starting Phase 3.

- [ ] PR 2 merged to `main`
- [ ] `grep -n "plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows" governance/workflows/pr/pr-review-quality-gate.md`
      (on `main`) returns zero matches

Safe to stop here — both target files are fully corrected and merged. To
resume: re-run the Phase 2 Gate checks above, then proceed to Phase 3.

---

## Phase 3: Final Repo-Wide Verification and Archival

### Task 3.1: Repo-wide confirmation of zero remaining stale references

**Goal**: Confirm, after both PRs have merged, that no living file anywhere
in the repo still references either archived plan's old
`plans/in-progress/` path.

**Steps**:

1. [ ] On `main`, run:
       `grep -rn "plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc" --include="*.md" . | grep -v "^\./plans/done/" | grep -v "^\./generated-reports/"`
       — expect zero output
2. [ ] On `main`, run:
       `grep -rn "plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows" --include="*.md" . | grep -v "^\./plans/done/" | grep -v "^\./generated-reports/"`
       — expect zero output

**Acceptance Criteria**:

- [✅] Both grep commands above return zero output

**Verification**:

```bash
grep -rn "plans/in-progress/2026-10-08__fix-claude-agents-catalog-doc" --include="*.md" . | grep -v "^\./plans/done/" | grep -v "^\./generated-reports/"
grep -rn "plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows" --include="*.md" . | grep -v "^\./plans/done/" | grep -v "^\./generated-reports/"
```

**Dependencies**:

- Requires: Phase 2 Gate passed

### Task 3.2: Knowledge Capture

**Goal**: Decide whether this plan surfaced anything durable worth routing
to a permanent home, per this repo's plan-lifecycle Knowledge Capture step.

**Steps**:

1. [ ] Review whether this plan's investigation (the repo-wide stale-path
       grep method) is itself a reusable pattern worth documenting
       elsewhere — per the resolved Non-Scope decision (#3), this plan does
       **not** implement or propose a prevention mechanism, so the expected
       outcome is "no generalizable learning to route"
2. [ ] Record the outcome in this plan's `README.md` under a
       "Knowledge Capture" note: either the routed destination, or
       `No generalizable learnings`

**Acceptance Criteria**:

- [✅] `README.md` has a Knowledge Capture outcome recorded (routed or
  "No generalizable learnings")

**Dependencies**:

- Requires: Task 3.1 complete

### Task 3.3: Archive the plan to `plans/done/`

**Goal**: Move this plan folder to `plans/done/` per this repo's standard
plan-completion lifecycle.

**Steps**:

1. [ ] Update `README.md` status to `✅ COMPLETED` with completion date
2. [ ] `git mv plans/in-progress/2026-10-29__fix-stale-plan-path-references/ plans/done/2026-10-29__fix-stale-plan-path-references/`
3. [ ] Update `plans/README.md`'s current-plans index: remove from
       "In Progress", add to "Done (Archived)"
4. [ ] **COMMIT**: `docs(plan): mark fix-stale-plan-path-references as completed`
5. [ ] Push and merge via PR

**Acceptance Criteria**:

- [✅] `test -d plans/done/2026-10-29__fix-stale-plan-path-references` succeeds
- [✅] `test -d plans/in-progress/2026-10-29__fix-stale-plan-path-references`
  fails (no duplicate remains)
- [✅] `plans/README.md` index updated
- [✅] Archival commit exists and is merged to `main`

**Verification**:

```bash
test -d plans/done/2026-10-29__fix-stale-plan-path-references && echo "archived OK"
test -d plans/in-progress/2026-10-29__fix-stale-plan-path-references && echo "STILL PRESENT - FIX" || echo "no duplicate - OK"
```

**Dependencies**:

- Requires: Task 3.2 complete

### Phase 3 Gate

> Final gate — all checks below must pass before this plan is considered
> fully complete.

- [ ] Both grep checks in Task 3.1 return zero output
- [ ] Knowledge Capture outcome recorded in `README.md`
- [ ] Plan folder moved to `plans/done/2026-10-29__fix-stale-plan-path-references/`
      via `git mv` (verify with `git log --follow`)
- [ ] `plans/README.md` index updated
- [ ] Archival commit merged to `main`

Safe to stop here — plan is fully executed, verified, and archived.

---

## Commit Summary

Total Commits: 4 (1 plan-setup commit, 2 implementation fix commits across
the 2 counted PRs, 1 archival commit)

| Commit # | Type | Scope      | Message                                                              |
| -------- | ---- | ---------- | -------------------------------------------------------------------- |
| 1        | docs | plan       | `docs(plan): add fix-stale-plan-path-references implementation plan` |
| 2        | docs | reference  | `docs(reference): fix stale plan path in claude-agents.md`           |
| 3        | docs | governance | `docs(governance): fix stale plan path in pr-review-quality-gate.md` |
| 4        | docs | plan       | `docs(plan): mark fix-stale-plan-path-references as completed`       |

## PR Summary

| PR       | Branch                                         | Content                                                                 | Counted in the 2-PR estimate?   |
| -------- | ---------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------- |
| Setup    | `docs/fix-stale-plan-path-references-plan`     | This plan's 4 documents                                                 | No — standard plan-setup commit |
| 1        | `docs/fix-claude-agents-catalog-stale-path`    | 5-occurrence fix in `docs/reference/claude-agents.md`                   | Yes                             |
| 2        | `docs/fix-pr-review-quality-gate-stale-path`   | 1-occurrence fix in `governance/workflows/pr/pr-review-quality-gate.md` | Yes                             |
| Archival | (part of PR 2's follow-up or its own small PR) | Mark plan complete, `git mv` to `plans/done/`                           | No — standard archival commit   |

## Progress Tracking

**Overall Progress**: 0/8 tasks completed (0%)

| Phase                                  | Tasks Completed | Tasks Total | Status          |
| -------------------------------------- | --------------- | ----------- | --------------- |
| Phase 0: Plan Setup                    | 0               | 1           | [ ] Not Started |
| Phase 1: Fix claude-agents.md          | 0               | 2           | [ ] Not Started |
| Phase 2: Fix pr-review-quality-gate.md | 0               | 2           | [ ] Not Started |
| Phase 3: Verification and Archival     | 0               | 3           | [ ] Not Started |

**Last Updated**: 2026-10-29 (plan created, no implementation started)
