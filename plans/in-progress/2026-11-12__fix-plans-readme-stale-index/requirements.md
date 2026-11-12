# Fix Plans README Stale Index - Requirements

## Resolved Decisions (Grill-Me Outcomes)

Seven decisions were grilled and explicitly resolved before writing this
plan (#1-#7). An eighth (#8) follows directly from the original task
framing rather than a fresh grill question — it is recorded here for the
same self-explanatory reason.

1. **Representation convention for the now-empty `in-progress/` and
   `backlog/` tree listings** — Resolved: **recreate `plans/in-progress/`
   with a real placeholder `README.md`** (mirroring `plans/backlog/
README.md`'s existing pattern), then show both tree listings as their
   literal true contents (`└── README.md` once both are genuinely empty of
   other plan folders), rather than inventing "(empty)" placeholder prose.
   This emerged mid-grill as a better option than any of the three
   originally offered (fenced block with inline empty-state comment; prose
   note replacing the code block; fenced block with a comment-style
   annotation) — it is simpler and more honest than all three, since the
   tree listing becomes literally accurate instead of needing invented
   text. For "In Progress" specifically, "literally accurate" is a
   two-step target rather than a one-shot edit — see Decision #8.

2. **`plans/backlog/README.md`'s "Completed/Moved Plans" section** —
   Resolved: **delete it entirely** (not fix its two entries, not reduce it
   to generic prose). It duplicates `plans/README.md`'s "Done (Archived)"
   tree, which is the canonical source for where archived plans live.
   Dual-tracking the same fact in two places is exactly the bug class this
   plan exists to fix — keeping the section, even corrected, would
   reintroduce the same drift risk the next time a plan moves.

3. **`plans/README.md`'s "Quick Stats" mirrored counts** — Resolved: **fix
   both**, with their now-false bullet entries removed. End-to-end this is
   `**In Progress**: 1` → `0` and `**Backlog**: 1` → `0`, but — per
   Decision #8 — `**In Progress**` passes through an accurate interim
   value of `1` (repointed at this plan) before reaching `0` at this
   plan's own archival; `**Backlog**` reaches `0` immediately since
   `plans/backlog/` is genuinely empty right now. Leaving either stat
   untouched while fixing the tree sections above would be an inconsistent
   half-fix of the identical underlying bug (the same false fact asserted
   twice in one file). `**Completed Projects**: 24` is explicitly excluded
   from this fix (except for its own routine +1 at this plan's archival,
   also per Decision #8) — see Non-Scope below.

4. **`plans/done/2026-01-12__cicd-pipeline/README.md`'s stale status
   line(s)** — Resolved: **in scope**. Verified via the plan's own
   `checklist.md` closing summary (`Status: FULL CI PIPELINE COMPLETE ✅`,
   Phase 6/Phase 9 explicitly marked skipped, not abandoned) and
   cross-referenced against real repo state (`CONTRIBUTING.md`,
   `docs/reference/branch-protection-status-checks.md`,
   `docs/how-to/cicd-setup.md`, a live CI badge in root `README.md` — all
   exist) that this was a genuine completion, not a mis-filed or abandoned
   plan. During plan-writing, a second stale assertion was found in the
   same file's footer (`**Status**: Ready to Start`, line 233) — fixed in
   the same pass under the same reasoning as Decision #3 (don't half-fix a
   bug that's duplicated within the very file being touched).

5. **Completion date to cite for the cicd-pipeline README fix** —
   Resolved: **February 23, 2026**, the `checklist.md`'s own `**Last
Updated**` date, directly backed by its in-document `VERIFIED Feb 20,
2026` statement for the CI pipeline's core deliverable. This is a more
   precise completion signal than the alternative considered (`March 24,
2026`, the date of the `fd97816` "move 4 completed plans to done"
   commit) — that commit is a single batch covering 4 unrelated plans, and
   `checklist.md` content dated after February 23 (`Phase 10: E2E Test
Fixes`) appears to belong to a separate, later plan
   (`2026-03-11__e2e-test-fixes`) rather than genuine cicd-pipeline work.

6. **"Done (Archived)" tree / `Completed Projects: 24` undercount** —
   Resolved: **confirmed out of scope**, citing
   `plans/done/2026-10-28__tooling-nx/README.md` and
   `plans/done/2026-10-08__fix-claude-agents-catalog-doc/README.md`, both
   of which already identified and explicitly deferred this exact problem.
   This plan touches zero entries in that tree and does not change
   `**Completed Projects**: 24`.

7. **PR granularity** — Resolved: **1 PR**. Everything in scope — the new
   `plans/in-progress/README.md`, the `plans/README.md` fixes, the
   `plans/backlog/README.md` fixes, and the cicd-pipeline README status-line
   fix — is one coherent concern (making the plan-lifecycle index match
   reality) on small, low-risk, mostly-documentation files. Per this
   session's established precedent (`plans/done/2026-11-01__programming-shell/`),
   PR count should track real risk boundaries, not be maximized for its
   own sake, and nothing here has an independent risk boundary.

8. **Handling this plan's own presence under `plans/in-progress/` while it
   is open** — Resolved per the original task framing (explicitly called
   out up front as expected, not a decision point requiring its own grill
   question): this plan's own setup commit creates
   `plans/in-progress/2026-11-12__fix-plans-readme-stale-index/`, so while
   it is open, `plans/README.md`'s "In Progress" tree and Quick Stats count
   are briefly accurate at `1` (pointing at this plan), not `0`. The fix
   lands in two stages: Phase 1 (this plan's own PR) corrects the tree/count
   to the true interim state; Phase 2 (this plan's own archival to
   `plans/done/`) corrects them again to the true final state (`0` /
   `README.md` only). This also means the "Done (Archived)" tree and
   `**Completed Projects**` counter each gain exactly **one** new entry —
   this plan's own — at Phase 2, per the same routine Step 4 archival
   practice every prior plan followed; that is not a reopening of the
   Decision #6 non-scope (the dozens-of-entries backfill), it is this
   plan correctly recording its own completion the same way every other
   plan in the tree already did.

## Scope Definition

### In Scope

- **Create** `plans/in-progress/README.md` — a new placeholder file
  modeled on `plans/backlog/README.md`'s structure (purpose statement,
  instructions, status legend), adapted for the in-progress context. This
  file's only job is to keep `plans/in-progress/` tracked in git with zero
  plan subfolders, exactly as `plans/backlog/README.md` already does for
  `plans/backlog/`.
- **Fix** `plans/README.md`, in two stages because this plan's own folder
  is itself briefly under `plans/in-progress/` while the fix is applied
  (see Decision #8 below):
  - **Interim state (Phase 1, this plan's own PR)** — "In Progress" tree
    listing (lines 142-151 as of 2026-11-12): replace the stale
    `2026-02-11__frontend-unit-tests/` entry with this plan's own real
    current entry, `2026-11-12__fix-plans-readme-stale-index/`, plus the
    new placeholder `README.md`. Quick Stats `**In Progress**: 1` stays
    `1`, with its bullet repointed from "Frontend Unit Tests" to this
    plan. "Backlog" tree listing (lines 157-166) and Quick Stats
    `**Backlog**: 1` → `0`: fixed to final state immediately, since
    `plans/backlog/` genuinely has zero plan folders right now.
  - **Final state (Phase 2, this plan's own archival)** — "In Progress"
    tree listing: `in-progress/` → `└── README.md` only. Quick Stats
    `**In Progress**: 1` → `0`, bullet removed.
  - "Step 3: Move to In Progress" / "Step 4: Move to Done" instructions
    (lines 197-209 as of 2026-11-12) — strengthen to explicitly checklist
    everything that must be updated on a transition, not just the `git
mv`: `plans/README.md`'s own tree + Quick Stats for both the source
    and destination sections, the moved plan's own `README.md` status
    line, and (when the plan came from `backlog/`) its entry in
    `plans/backlog/README.md`'s "Planned Projects" list.
- **Fix** `plans/backlog/README.md`:
  - Remove the `CI/CD Pipeline` entry (lines 9-13 as of 2026-11-12) from
    "Planned Projects" (it has been in `plans/done/` since `fd97816`);
    since no other entry exists under "Planned Projects" → "Infrastructure",
    replace the removed bullet with a one-line "no projects currently in
    the backlog" note and drop the now-empty "### Infrastructure"
    subheading.
  - Delete the "Completed/Moved Plans" section (lines 15-22 as of
    2026-11-12) entirely, per Resolved Decision #2.
  - Leave "## Instructions" and "## Plan Status Legend" untouched — both
    remain accurate and useful.
- **Fix** `plans/done/2026-01-12__cicd-pipeline/README.md`:
  - Line 3: `**Status**: 📋 Backlog` → `**Status**: ✅ Completed`.
  - Insert `**Completed**: February 23, 2026` immediately after line 4
    (`**Created**: January 12, 2026`), matching the field order used by
    other archived plans (e.g. `plans/done/2026-11-01__programming-shell/
README.md`'s `Status` / `Created` / `Completed` / `Type` / `Priority`
    sequence).
  - Footer (lines 232-233 as of 2026-11-12): `**Last Updated**: January
12, 2026` → `**Last Updated**: February 23, 2026`; `**Status**: Ready
to Start` → `**Status**: Completed`.
- Re-verify every fact above directly against the repository at
  implementation time (line numbers may have shifted since this plan was
  written) before editing — per the "Pre-Write Verification
  (Anti-Hallucination)" rule in `plan-creating-project-plans`.

### Non-Scope

- **The "Done (Archived)" tree's missing dozens of (pre-existing) entries**
  and the **general `**Completed Projects**` undercount** in
  `plans/README.md`'s Quick Stats — both already identified and explicitly
  deferred in `plans/done/2026-10-28__tooling-nx/README.md` and
  `plans/done/2026-10-08__fix-claude-agents-catalog-doc/README.md`. Per
  Resolved Decision #6, this plan does not backfill any of those
  historically-missing entries. The one exception, per Decision #8, is
  this plan's own entry: `**Completed Projects**: 24` becomes `25` and the
  Done tree gains exactly one new leaf (`2026-11-12__fix-plans-readme-stale-index/`)
  at Phase 2, when this plan archives itself — the same routine increment
  every prior plan's own archival already performed, not a reopening of
  the deferred backfill.
- **`plans/README.md`'s "Last Updated: July 7, 2026" footer line** — also
  stale (several Done-tree entries postdate it), but it is a symptom of
  the same deferred Done-tree/Completed-Projects backfill, not of either
  of the two reported bugs. Not touched by this plan.
- **A new `governance/` document for plan-lifecycle transition rules** —
  considered and rejected. `governance/development/workflow/
implementation.md` already explicitly defers plan-structure detail to
  `plans/README.md` (its own line 19: "How should I structure a plan? →
  `plans/README.md`") and already carries a short warning (around line 142) about forgetting to move plans to `done/`. Duplicating transition
  detail into `governance/` would create a second source of truth that can
  drift out of sync — exactly the bug class this plan fixes. The
  prevention fix lives entirely inside `plans/README.md`'s own existing
  "How to Create a New Plan" Step 3/Step 4 sections (see In Scope above).
- **Any plan folder other than `2026-02-11__frontend-unit-tests` and
  `2026-01-12__cicd-pipeline`** — no other plan's own `README.md` status
  line is touched by this plan.
- **Any Gherkin spec, agent file, skill file, or code change** — this
  plan is pure documentation/index correction across 4 markdown files (1
  new, 3 edited). No `.claude/`, `specs/`, `apps/`, or `governance/` file
  is created or modified.

## User Stories

### User Story 1: Developer trusts the "In Progress" and "Backlog" sections

As a developer opening `plans/README.md` to find what's actively being
worked on or queued next
I want the "In Progress" and "Backlog" tree listings to show the real,
current contents of `plans/in-progress/` and `plans/backlog/`
So that I don't go looking for a plan folder that was actually archived to
`plans/done/` months ago

**Acceptance Criteria:**

```gherkin
Scenario: In Progress section matches real directory contents (interim, Phase 1)
  Given plans/README.md's "In Progress" section has been corrected in this plan's own PR
  When the developer runs `ls plans/in-progress/` and compares it to the tree listing in plans/README.md
  Then the tree listing shows exactly plans/in-progress/'s real contents, including this plan's own folder
```

```gherkin
Scenario: In Progress section matches real directory contents (final, after Phase 2 archival)
  Given this plan has archived itself to plans/done/ (Phase 2)
  When the developer runs `ls plans/in-progress/` and compares it to the tree listing in plans/README.md
  Then the tree listing shows exactly plans/in-progress/'s real contents (README.md only)
```

```gherkin
Scenario: Backlog section matches real directory contents
  Given plans/README.md's "Backlog" section has been corrected
  When the developer runs `ls plans/backlog/` and compares it to the tree listing in plans/README.md
  Then the tree listing shows exactly plans/backlog/'s real contents (README.md only)
```

### User Story 2: Developer trusts the Quick Stats counts

As a developer scanning `plans/README.md`'s "Quick Stats" section for a
fast status summary
I want the `In Progress` and `Backlog` counts to match the real number of
plan folders in each directory
So that the summary doesn't contradict the tree listings directly above it

**Acceptance Criteria:**

```gherkin
Scenario: Quick Stats In Progress count matches real plan-folder count
  Given plans/README.md's Quick Stats section has been corrected
  When the developer counts plan subfolders under plans/in-progress/
  Then the count is 0 and Quick Stats reads "In Progress: 0" with no stale bullet
```

```gherkin
Scenario: Quick Stats Backlog count matches real plan-folder count
  Given plans/README.md's Quick Stats section has been corrected
  When the developer counts plan subfolders under plans/backlog/
  Then the count is 0 and Quick Stats reads "Backlog: 0" with no stale bullet
```

### User Story 3: Developer reading `plans/backlog/README.md` sees one source of truth

As a developer opening `plans/backlog/README.md` directly
I want it to list only genuinely pending backlog items and not duplicate
tracking of plans that have already moved on
So that I have exactly one place (`plans/README.md`'s "Done (Archived)"
tree) to check for where an archived plan actually lives

**Acceptance Criteria:**

```gherkin
Scenario: Backlog README no longer lists an archived plan as planned
  Given plans/backlog/README.md's "Planned Projects" section has been corrected
  When the developer searches it for "CI/CD Pipeline"
  Then zero matches are found
```

```gherkin
Scenario: Backlog README no longer duplicates archival tracking
  Given plans/backlog/README.md has been corrected
  When the developer searches it for "Completed/Moved Plans"
  Then zero matches are found
```

### User Story 4: Developer trusts the cicd-pipeline plan's own status

As a developer opening `plans/done/2026-01-12__cicd-pipeline/README.md`
directly (e.g. via a link from elsewhere, or by browsing `plans/done/`)
I want its own status line to say it is completed, not backlog
So that I don't mistake a completed, archived plan for one that's still
waiting to start

**Acceptance Criteria:**

```gherkin
Scenario: cicd-pipeline README header status reads Completed
  Given plans/done/2026-01-12__cicd-pipeline/README.md has been corrected
  When the developer reads its header Status line
  Then it reads "Status: Completed" with a "Completed: February 23, 2026" line, not "Backlog"
```

```gherkin
Scenario: cicd-pipeline README footer status reads Completed
  Given plans/done/2026-01-12__cicd-pipeline/README.md has been corrected
  When the developer reads its footer Status line
  Then it reads "Status: Completed", not "Ready to Start"
```

### User Story 5: Next archival pass doesn't repeat this bug

As a developer moving a plan from `in-progress/` to `done/` (or from
`backlog/` to `in-progress/`) in the future
I want `plans/README.md`'s own instructions to explicitly list every place
that needs updating, not just the `git mv`
So that the next archival pass doesn't leave `plans/README.md`'s index
stale again

**Acceptance Criteria:**

```gherkin
Scenario: Step 4 instructions name every file to update on archival
  Given plans/README.md's "Step 4: Move to Done" instructions have been strengthened
  When the developer reads the step
  Then it explicitly names plans/README.md's own tree + Quick Stats and the moved plan's own README.md status line as required updates
```

## Success Criteria

**Checked at Phase 1 (this plan's own PR merge) — interim state:**

- [ ] `plans/in-progress/README.md` exists and is tracked in git.
- [ ] `plans/README.md`'s "In Progress" tree listing matches the real
      contents of `plans/in-progress/` at that moment (the new `README.md`
      plus this plan's own folder), with no reference to
      `2026-02-11__frontend-unit-tests/` remaining.
- [ ] `plans/README.md`'s "Backlog" tree listing reads `backlog/` →
      `└── README.md`.
- [ ] `plans/README.md`'s Quick Stats reads `**Backlog**: 0` (stale CI/CD
      Pipeline bullet removed) and `**In Progress**: 1`, with its bullet
      pointing at this plan, not Frontend Unit Tests.
- [ ] `plans/README.md`'s Quick Stats `**Completed Projects**: 24` is
      unchanged at this stage.
- [ ] `plans/README.md`'s Step 3/Step 4 instructions explicitly checklist
      updating `plans/README.md`'s own index and the moved plan's own
      status line.
- [ ] `plans/backlog/README.md` no longer contains "CI/CD Pipeline" or a
      "Completed/Moved Plans" heading.
- [ ] `plans/done/2026-01-12__cicd-pipeline/README.md` reads `**Status**:
    ✅ Completed` with `**Completed**: February 23, 2026` in the header,
      and `**Status**: Completed` in the footer.
- [ ] `plans/README.md`'s pre-existing "Done (Archived)" tree entries
      (everything already there before this plan started) are
      byte-for-byte unchanged.
- [ ] Phase 1 changes committed and merged via PR per this repo's branch
      protection on `main`.

**Checked at Phase 2 (this plan's own archival) — final state:**

- [ ] `plans/README.md`'s "In Progress" tree listing reads `in-progress/`
      → `└── README.md` only.
- [ ] `plans/README.md`'s Quick Stats reads `**In Progress**: 0`, with no
      bullet underneath.
- [ ] `plans/README.md`'s "Done (Archived)" tree gains exactly one new
      leaf: `2026-11-12__fix-plans-readme-stale-index/`.
- [ ] `plans/README.md`'s Quick Stats `**Completed Projects**` reads `25`
      (24 + this plan), with a corresponding new bullet for this plan.
- [ ] This plan's own folder is moved via `git mv` from
      `plans/in-progress/` to `plans/done/` (verified via `git log
    --follow` showing the rename, no duplicate left under
      `plans/in-progress/`).
- [ ] Phase 2 changes committed and merged via PR per this repo's branch
      protection on `main`.
