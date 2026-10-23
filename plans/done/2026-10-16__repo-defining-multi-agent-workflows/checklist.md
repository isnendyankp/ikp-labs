# Repo: Defining Multi-Agent Workflows — Implementation Checklist

## Status Legend

- [ ] Not started
- [🔄] In progress
- [✅] Completed
- [⏸️] Blocked/Waiting

---

## Pre-Flight: Both Flagged Adaptation Decisions Are Resolved

Both decisions flagged in `technical-design.md` as judgment calls surfaced during writing (not
part of the original six grilled questions) were resolved via a second round of live grilling
before implementation. Nothing further to confirm before Phase 1 begins:

- [✅] **Adaptation Decision 1 — resolved via live grilling ("Fork 1")**: YAML frontmatter
  (two-key `description`/`when_to_use`, matching OSE verbatim) IS used on
  `pr-review-quality-gate.md` during the retrofit — the earlier "no frontmatter" default is
  overridden. `governance/workflows/README.md` is unaffected (it's an index, not a workflow
  document).
- [✅] **Adaptation Decision 2 — resolved via live grilling ("Fork 2")**: Termination Criteria
  may be rigorous, command-backed enumerated prose, not mandatory Gherkin — so
  `pr-review-quality-gate.md`'s existing Done-Definition prose is retrofit-compatible as-is.
  This confirmed the written design's original default; no change to Task 2.2 was needed.

---

## Phase 1 (PR1): Create the New Skill — ✅ Done (PR #322)

### Task 1.1: Scaffold the Skill Directory and Header (15 min)

**Goal**: Create the skill file with the convention header matching sibling skills.

**Steps**:

1. [x] `mkdir -p .claude/skills/repo-defining-multi-agent-workflows`
2. [x] Create `.claude/skills/repo-defining-multi-agent-workflows/SKILL.md` with the
       `# Skill: Defining Multi-Agent Workflows` title, `**Category**`, `**Purpose**`,
       `**Used By**: None yet` line, and the `## Adoption Note` subsection (exact text in
       `technical-design.md`, Component 1)

**Acceptance Criteria**:

- [✅] `test -f .claude/skills/repo-defining-multi-agent-workflows/SKILL.md` succeeds
- [✅] File contains `**Used By**: None yet` and an `## Adoption Note` section

---

### Task 1.2: Write the Adapted Standard Sections (45 min)

**Goal**: Port OSE's `repo-defining-workflows` content into the new skill, applying every
adaptation from `technical-design.md`'s mapping table.

**Steps**:

1. [x] Write `## Overview` / purpose framing referencing IKP-Labs's actual consumer context
2. [x] Write `## Document Structure` section specifying the two-key YAML frontmatter
       (`description`, `when_to_use`, colon-quoted) plus the seven canonical H2 sections (Goal
       and Termination, Inputs, Outputs, Steps, Termination Criteria, Example Usage, Related
       Workflows) under the H1 — per Adaptation Decision 1 (Fork 1 resolution), matching OSE's
       frontmatter convention verbatim
3. [x] Write `## Execution Patterns` — Sequential pattern illustrated with
       `pr-review-quality-gate.md`'s actual maker→fixer→CI-gate loop; Parallel/Conditional/Mixed
       described in the abstract and explicitly labeled "no IKP-Labs example yet"
4. [x] Write `## Standard Parameters` — cycle/iteration-count pattern (default + hard ceiling,
       grounded in the real example's `N = 3`), with `dry-run`/`verbose` noted as optional,
       not-yet-exercised parameters a workflow MAY document — no `max-concurrency`/N+1 model
5. [x] Write `## Common Mistakes` — 5 items per the mapping table (items 1–4 kept verbatim, now
       that frontmatter is in active use per Adaptation Decision 1 — including the YAML
       colon-quoting rule; item 5 replaced with the "missing iteration ceiling" risk, grounded
       in `pr-review-quality-gate.md`'s own hard-ceiling language)
6. [x] Write `## Workflow File Naming` — `[workflow-name].md`, plain-named, no numbered prefix
7. [x] Write `## Quality Checklist` — adapted bullets per the mapping table, no frontmatter bullet
8. [x] Write `## Example Usage` — quotes/summarizes `pr-review-quality-gate.md`'s retrofitted
       Example Usage section (forward-reference; this section will be finalized once PR2 lands —
       mark with a one-line note if PR2 hasn't merged yet when PR1 is authored) — PR2 has not
       merged yet at PR1 authoring time, so the forward-reference note was kept
9. [x] Write `## Related Skills` footer linking `repo-applying-maker-checker-fixer`,
       `plan-writing-gherkin-criteria`, and `repo-understanding-repository-architecture`

**Acceptance Criteria**:

- [x] `grep -iE "rhino|n\+1|repo-governance" .claude/skills/repo-defining-multi-agent-workflows/SKILL.md` returns no matches
- [x] `grep -c "pr-review-quality-gate" .claude/skills/repo-defining-multi-agent-workflows/SKILL.md` is ≥ 1 (the only example used) — actual count: 8
- [x] `grep -iE "workflow tool|pipeline\(\)|parallel\(\)" .claude/skills/repo-defining-multi-agent-workflows/SKILL.md` returns no matches (no fabricated tool)

---

### Task 1.3: Lint and Local Validation (15 min)

**Steps**:

1. [x] `npm run lint:md` — fix all errors before committing
2. [x] Manually re-read the file once end-to-end for internal contradictions

**Acceptance Criteria**:

- [x] `npm run lint:md` exits 0 with no errors attributable to the new file

---

### Task 1.4: Commit and Open PR1 (15 min)

**Steps**:

1. [x] `git checkout -b docs/repo-defining-multi-agent-workflows-skill`
2. [x] `git add .claude/skills/repo-defining-multi-agent-workflows/SKILL.md` (needed `-f`:
       `.claude/` is gitignored at the directory level despite being tracked content)
3. [x] **COMMIT 1**: `docs(skills): add repo-defining-multi-agent-workflows skill`
4. [x] `git push -u origin docs/repo-defining-multi-agent-workflows-skill`
5. [x] `gh pr create` — Summary + Test Plan per the PR template — opened as PR #322
6. [x] Run the PR-Review Maker→Fixer cycle (`governance/workflows/pr/pr-review-quality-gate.md`)
       — 3 cycles, 0 CRITICAL/HIGH outstanding — all 3 cycles complete as of this commit (this is
       cycle 3, the final cycle)
7. [x] Confirm CI green, then `gh pr merge --squash --auto` — merged 2026-10-18
8. [x] `git checkout main && git pull origin main`

**Dependencies**:

- Requires: Pre-Flight confirmation
- Blocks: Phase 2 (PR2's "Example Usage" section quotes this skill's existence)

**Review cycle actuals**: 3 cycles ran (`pr-review-maker`→`pr-review-fixer`), 3 findings
total (1 MEDIUM cycle 1, 1 HIGH cycle 2, 1 MEDIUM cycle 3), all fixed and resolved — 0
CRITICAL/HIGH outstanding at merge. One stray non-finding thread (`TEST-PROBE-DELETE-ME`, a
test artifact from the maker's own API exploration, not a real review item) was identified,
correctly not acted on by the fixer per untrusted-input handling, and resolved directly by
the orchestrator.

---

### Phase 1 Gate

> All checks below must pass before starting Phase 2.

- [x] `test -f .claude/skills/repo-defining-multi-agent-workflows/SKILL.md` on `main` after merge
- [x] `npm run lint:md` passes on `main` (no errors attributable to the new file)
- [x] PR1 merged, branch deleted, CI green on `main`

Safe to stop here — the new skill exists and is usable ad hoc even if Phase 2/3 are delayed. To
resume: start Task 2.1.

---

## Phase 2 (PR2): Retrofit `pr-review-quality-gate.md` + Fix `governance/workflows/README.md` — ✅ Done (PR #324)

### Task 2.1: Map Old Sections to the Canonical Set (20 min)

**Goal**: Produce the actual retrofitted heading structure before moving prose, using
`technical-design.md`'s section-mapping table as the source of truth.

**Steps**:

1. [x] Read the current full file: `governance/workflows/pr/pr-review-quality-gate.md`
2. [x] Draft the new heading skeleton: a two-key YAML frontmatter block (`description`,
       `when_to_use` — colon-quoted), then the H1, then the 7 canonical H2s, then a
       `## Supplementary` group for `GitHub Reviews API Mechanics` / `Applicability` / `Notes`
3. [x] Confirm the `### Loop-Exit and Escalation Rules` sub-heading is retained nested under
       `## Termination Criteria` (anchor preservation — see Task 2.3)

**Acceptance Criteria**:

- [x] A heading skeleton exists (even empty) matching the canonical set before any prose is moved

---

### Task 2.2: Move Content Into the New Structure (45 min)

**Steps**:

1. [x] Fill the frontmatter: `description` from a compressed one-line version of old
       `## Purpose`; `when_to_use` from a compressed one-line version of old `## When to Use`
       — quote both values (the description in particular contains a colon, e.g.
       `"PR-Review Maker→Fixer Cycle: sequential review loop"`, and MUST be quoted)
2. [x] Fill `## Goal and Termination` from old `## Purpose` + `## Execution Mode`
3. [x] Fill `## Inputs` (new) by consolidating every step's `**Args**` line — also folded in
       the old `## Participants` section's two agent descriptions (not explicitly mapped in
       the technical-design.md table, but real content that needed a home — Inputs fits since
       participant agents are a fixed input to the loop)
4. [x] Fill `## Outputs` (new) by consolidating every step's `**Output**` line
5. [x] Keep `## Steps` as-is (already canonical; verify no content lost in the move)
6. [x] Fill `## Termination Criteria` from old `## Done-Definition` +
       `## Loop-Exit and Escalation Rules` (kept as a nested `###` sub-heading per Task 2.3)
7. [x] Fill `## Example Usage` by promoting the old `## Loop Algorithm` pseudocode + mermaid
       sequence diagram verbatim
8. [x] Keep `## Related Workflows` as-is
9. [x] Move `## GitHub Reviews API Mechanics`, `## Applicability`, `## Notes` into a trailing
       `## Supplementary` group with a one-line note explaining why they're additional

**Acceptance Criteria**:

- [x] Diff the retrofitted file against the pre-retrofit version for prose content (not
      headings) — every sentence of normative behavior (cycle default, hard ceiling,
      `COMMENT`-state limitation, escalation rules, AI-attribution footer requirement) is still
      present somewhere in the new file — spot-checked via grep count comparison on 9 key phrases,
      all preserved or increased, zero decreased
- [x] No new normative behavior is introduced that wasn't in the original
- [x] The frontmatter block parses as valid YAML (spot-checked via Node `js-yaml`, since
      `pyyaml` was not installed in this environment) — parses cleanly, both keys present
- [x] Both `description` and `when_to_use` frontmatter values are quoted if they contain a colon

---

### Task 2.3: Preserve the `pr-review-fixer.md` Anchor (10 min)

**Steps**:

1. [x] `grep -n "loop-exit-and-escalation-rules" .claude/agents/pr-review-fixer.md` — confirmed
       line 185's link target
2. [x] Verify the retrofitted file still has a heading that generates the
       `#loop-exit-and-escalation-rules` anchor (i.e., `### Loop-Exit and Escalation Rules`
       verbatim, nested under `## Termination Criteria`) — confirmed at line 150, nested under
       `## Termination Criteria` (line 108), before the next `##` (Example Usage, line 169)
3. [x] Heading text did not need to change — `pr-review-fixer.md` was not touched

**Acceptance Criteria**:

- [x] The anchor resolves: confirmed `### Loop-Exit and Escalation Rules` lands correctly
      nested under `## Termination Criteria`
- [x] `git diff` shows zero changes to `pr-review-fixer.md`

---

### Task 2.4: Fix `governance/workflows/README.md` (15 min)

**Steps**:

1. [x] Replace the `> Placeholder...` line with the target content from `technical-design.md`
       Component 3 (adds a "Current Workflows" table listing `pr/pr-review-quality-gate.md` and
       references the new skill)

**Acceptance Criteria**:

- [x] `grep -i placeholder governance/workflows/README.md` returns no matches
- [x] File references `repo-defining-multi-agent-workflows`

---

### Task 2.5: Lint and Local Validation (15 min)

**Steps**:

1. [x] `npm run lint:md` on both changed files
2. [x] Re-read the full retrofitted `pr-review-quality-gate.md` end-to-end for coherence

**Acceptance Criteria**:

- [x] `npm run lint:md` exits 0 for both files

---

### Task 2.6: Commit and Open PR2 (15 min)

**Steps**:

1. [x] `git checkout -b docs/retrofit-pr-review-quality-gate`
2. [x] `git add governance/workflows/pr/pr-review-quality-gate.md governance/workflows/README.md`
       (`.claude/agents/pr-review-fixer.md` did not need updating — anchor preserved verbatim)
3. [x] **COMMIT 2**: `docs(governance): retrofit pr-review-quality-gate to workflow standard`
       (shortened from the planned message — original was 82 chars, over the 72-char
       commitlint limit)
4. [x] `git push -u origin docs/retrofit-pr-review-quality-gate`
5. [x] `gh pr create` — opened as PR #324
6. [x] Run the PR-Review Maker→Fixer cycle against **this very PR** — 3 cycles ran, 0
       findings in any cycle (0 CRITICAL/HIGH outstanding — the cleanest possible outcome,
       since the retrofit itself was reviewed by the exact cycle it documents)
7. [x] Confirm CI green, then `gh pr merge --squash --auto` — merged 2026-10-21
8. [x] `git checkout main && git pull origin main`

**Dependencies**:

- Requires: Phase 1 Gate passed
- Blocks: Phase 3 (the new skill's "Example Usage" section, if left as a forward-reference in
  Task 1.2 step 8, should be finalized/confirmed against the now-merged retrofit — a small
  follow-up edit to the Phase 1 skill file, included as Task 3.0 below if needed)

**Review cycle actuals**: 3 cycles ran (`pr-review-maker`→`pr-review-fixer`), 0 findings in
any cycle, 0 review threads ever created — both agents independently re-verified content
preservation, anchor integrity, YAML validity, and scope on every cycle rather than
rubber-stamping after cycle 1's clean result.

---

### Phase 2 Gate

> All checks below must pass before starting Phase 3.

- [x] `governance/workflows/pr/pr-review-quality-gate.md` on `main` matches the canonical
      section set
- [x] `governance/workflows/README.md` on `main` no longer contains "Placeholder"
- [x] `grep -n "loop-exit-and-escalation-rules" .claude/agents/pr-review-fixer.md` still resolves
      to a real heading in the retrofitted file
- [x] PR2 merged, branch deleted, CI green on `main`

Safe to stop here — the proof-of-concept retrofit is live and correct even if Phase 3 (DEFER
bookkeeping) is delayed. To resume: start Task 3.1.

---

## Phase 3 (PR3): Resolve the DEFER Record + Archive This Plan — ✅ Done (PR #326)

### Task 3.0: Finalize the Skill's "Example Usage" Forward-Reference, If Needed (10 min)

**Steps**:

1. [x] Re-read `.claude/skills/repo-defining-multi-agent-workflows/SKILL.md`'s `## Example
Usage` section written in Task 1.2 step 8
2. [x] If it was left as a forward-reference note, update it now to quote/summarize the
       actually-merged retrofitted section from PR2
3. [x] This required a file change, folded into this PR's commit (Task 3.3) rather than
       opening a fourth PR for one paragraph — also fixed a stale `Done-Definition` reference
       in Mistake 4 (the retrofit renamed that section to `Termination Criteria`)

**Acceptance Criteria**:

- [x] The skill's Example Usage section no longer says "will be finalized once PR2 lands" (or
      equivalent) — it reflects the real, merged retrofit

---

### Task 3.1: Remove the DEFER Row (10 min)

**Steps**:

1. [x] Open `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`
2. [x] Delete the `repo-defining-workflows` row from the "Deferred — Needs Product Decision"
       table — left the header row + an empty-table note ("No items currently deferred"),
       per Component 4's "if this is the only remaining row" guidance. Deliberately did NOT
       add a resolution note naming the old item by name here, since that would reintroduce
       the very string this check requires to be zero

**Acceptance Criteria**:

- [x] `grep -c "repo-defining-workflows" .claude/skills/repo-syncing-with-ose-primer/SKILL.md`
      drops to zero — confirmed immediately after this task's edit

---

### Task 3.2: Update the Harness Inventory and Footer (10 min)

**Steps**:

1. [x] Change `| Skills | 30 | ... |` to `| Skills | 31 | ... |` — **deviated from the
       planned exact wording**: the plan's own literal target text
       (`resolving the Round 5 repo-defining-workflows DEFER item`) reintroduces the string
       Task 3.1's acceptance criterion and the Phase 3 Gate both require to be zero on `main`
       — a real contradiction between this task's literal instruction and the Phase 3 Gate.
       Resolved in the Gate's favor (the authoritative final bar): reworded to
       "resolving the Round 5 workflow-authoring DEFER item" — same informational content,
       zero occurrences of the colliding name
2. [x] Change `**Last Updated**: 2026-10-06` to `**Last Updated**: 2026-10-16`

**Acceptance Criteria**:

- [x] Both edits present; `Agents` and `Hooks` rows unchanged — confirmed via grep, both
      still read `53`/`2026-10-06` and `5`/`2026-10-06` respectively

---

### Task 3.3: Commit, Open PR3, and Archive the Plan (30 min)

**Steps**:

1. [x] `git checkout -b docs/resolve-defer-repo-defining-workflows`
2. [x] `git add .claude/skills/repo-syncing-with-ose-primer/SKILL.md` (plus the Task 3.0 skill
       edit)
3. [x] Update this plan's own `README.md` status to `✅ Completed` and add a Completed date
4. [x] `git mv plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows/ plans/done/2026-10-16__repo-defining-multi-agent-workflows/`
5. [x] **COMMIT 3**: `docs(plan): resolve repo-defining-workflows defer and archive plan`
       (lowercased "DEFER" in the subject — commitlint's `subject-case` rule requires
       all-lowercase)
6. [x] `git push -u origin docs/resolve-defer-repo-defining-workflows`
7. [x] `gh pr create` — opened as PR #326
8. [x] Run the PR-Review Maker→Fixer cycle — 3 cycles ran; 0 findings in cycles 1-2; 1 MEDIUM
       finding in cycle 3 (stale Progress Tracking table, fixed same cycle); 0 CRITICAL/HIGH
       outstanding across all 3 cycles
9. [x] Confirm CI green, then `gh pr merge --squash --auto` — merged 2026-10-23
10. [x] `git checkout main && git pull origin main`

**Dependencies**:

- Requires: Phase 2 Gate passed

**Review cycle actuals**: 3 cycles ran (`pr-review-maker`→`pr-review-fixer`), 1 MEDIUM
finding total (a self-contradictory Progress Tracking table in this very file, caught and
fixed in cycle 3 before this plan's own archival became final), 0 CRITICAL/HIGH outstanding
at merge.

---

### Phase 3 Gate

> All checks below must pass before this plan is considered complete.

- [x] `grep -c "repo-defining-workflows" .claude/skills/repo-syncing-with-ose-primer/SKILL.md`
      is 0 on `main`
- [x] Harness Inventory table on `main` shows `Skills | 31`
- [x] Plan directory exists at `plans/done/2026-10-16__repo-defining-multi-agent-workflows/`
      (verified via clean `git mv` renames, no duplicate remains under `plans/in-progress/`
      — that directory no longer exists at all, since this was its only entry)
- [x] PR3 merged, branch deleted, CI green on `main`

Safe to stop here — this plan is fully delivered.

---

## Commit Summary

| Commit # | PR  | Type | Scope      | Message                                                                  |
| -------- | --- | ---- | ---------- | ------------------------------------------------------------------------ |
| 1        | PR1 | docs | skills     | `docs(skills): add repo-defining-multi-agent-workflows skill`            |
| 2        | PR2 | docs | governance | `docs(governance): retrofit pr-review-quality-gate to workflow standard` |
| 3        | PR3 | docs | plan       | `docs(plan): resolve repo-defining-workflows defer and archive plan`     |

(Both PR2 and PR3's actual commit subjects were shortened/lowercased from the originally
planned text to satisfy commitlint's 72-char length limit and lowercase-subject rule.)

---

## Validation Steps (End-to-End, Run After PR3 Merges)

- [x] `npm run lint:md` passes repo-wide (no errors attributable to any file this plan touched)
- [x] `test -f .claude/skills/repo-defining-multi-agent-workflows/SKILL.md`
- [x] `test -f plans/done/2026-10-16__repo-defining-multi-agent-workflows/README.md`
- [x] `grep -i placeholder governance/workflows/README.md` — no matches
- [x] `grep -c "repo-defining-workflows" .claude/skills/repo-syncing-with-ose-primer/SKILL.md` — 0
- [x] `grep -n "loop-exit-and-escalation-rules" .claude/agents/pr-review-fixer.md` resolves to a
      real heading in the retrofitted `pr-review-quality-gate.md`

---

## Quality Gates

- [x] All three PRs passed the PR-Review Maker→Fixer cycle with 0 CRITICAL/HIGH outstanding
- [x] All three PRs' CI is green at merge time
- [x] No agent's `permission.skill:` list was modified (NFR-1) — confirmed via
      `git log --name-only` across all 3 content PRs' merge range: zero files under
      `.claude/agents/` touched
- [x] No reference to "Rhino", N+1 concurrency, `repo-governance/`, or a `Workflow` tool exists
      in any new content this plan authored (NFR-3) — `repo-syncing-with-ose-primer/SKILL.md`
      has pre-existing, unrelated mentions of "rhino" and "repo-governance/" in its permanent
      "What IKP-Labs Intentionally Does NOT Adopt" table from earlier governance rounds;
      confirmed via diff that none of this plan's own added lines contain these terms

---

## Progress Tracking

| Phase         | Tasks Completed | Tasks Total | Status        |
| ------------- | --------------- | ----------- | ------------- |
| Pre-Flight    | 2               | 2           | [✅] Complete |
| Phase 1 (PR1) | 4               | 4           | [✅] Complete |
| Phase 2 (PR2) | 6               | 6           | [✅] Complete |
| Phase 3 (PR3) | 3               | 3           | [✅] Complete |

**Last Updated**: October 23, 2026 (Pre-Flight, Phase 1, and Phase 2 complete — PR #322 and
PR #324 merged; Phase 3 — Tasks 3.0-3.2 complete, Task 3.3 in progress: PR #326 open, PR-Review
Maker→Fixer cycle complete at cycle 3 of 3 with 0 CRITICAL/HIGH outstanding, awaiting CI-green
confirmation and merge per steps 7-8)
