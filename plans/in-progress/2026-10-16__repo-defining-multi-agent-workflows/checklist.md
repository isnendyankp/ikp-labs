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

## Phase 1 (PR1): Create the New Skill — ✅ Done

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
6. [🔄] Run the PR-Review Maker→Fixer cycle (`governance/workflows/pr/pr-review-quality-gate.md`)
   — 3 cycles, 0 CRITICAL/HIGH outstanding — cycle 1 of 3 actively running as of this commit
7. [ ] Confirm CI green, then `gh pr merge --squash --auto`
8. [ ] `git checkout main && git pull origin main`

**Dependencies**:

- Requires: Pre-Flight confirmation
- Blocks: Phase 2 (PR2's "Example Usage" section quotes this skill's existence)

---

### Phase 1 Gate

> All checks below must pass before starting Phase 2.

- [ ] `test -f .claude/skills/repo-defining-multi-agent-workflows/SKILL.md` on `main` after merge
- [ ] `npm run lint:md` passes on `main`
- [ ] PR1 merged, branch deleted, CI green on `main`

Safe to stop here — the new skill exists and is usable ad hoc even if Phase 2/3 are delayed. To
resume: start Task 2.1.

---

## Phase 2 (PR2): Retrofit `pr-review-quality-gate.md` + Fix `governance/workflows/README.md`

### Task 2.1: Map Old Sections to the Canonical Set (20 min)

**Goal**: Produce the actual retrofitted heading structure before moving prose, using
`technical-design.md`'s section-mapping table as the source of truth.

**Steps**:

1. [ ] Read the current full file: `governance/workflows/pr/pr-review-quality-gate.md`
2. [ ] Draft the new heading skeleton: a two-key YAML frontmatter block (`description`,
       `when_to_use` — colon-quoted), then the H1, then the 7 canonical H2s, then a
       `## Supplementary` group for `GitHub Reviews API Mechanics` / `Applicability` / `Notes`
3. [ ] Confirm the `### Loop-Exit and Escalation Rules` sub-heading is retained nested under
       `## Termination Criteria` (anchor preservation — see Task 2.3)

**Acceptance Criteria**:

- [✅] A heading skeleton exists (even empty) matching the canonical set before any prose is moved

---

### Task 2.2: Move Content Into the New Structure (45 min)

**Steps**:

1. [ ] Fill the frontmatter: `description` from a compressed one-line version of old
       `## Purpose`; `when_to_use` from a compressed one-line version of old `## When to Use`
       — quote both values (the description in particular contains a colon, e.g.
       `"PR-Review Maker→Fixer Cycle: sequential review loop"`, and MUST be quoted)
2. [ ] Fill `## Goal and Termination` from old `## Purpose` + `## Execution Mode`
3. [ ] Fill `## Inputs` (new) by consolidating every step's `**Args**` line
4. [ ] Fill `## Outputs` (new) by consolidating every step's `**Output**` line
5. [ ] Keep `## Steps` as-is (already canonical; verify no content lost in the move)
6. [ ] Fill `## Termination Criteria` from old `## Done-Definition` +
       `## Loop-Exit and Escalation Rules` (kept as a nested `###` sub-heading per Task 2.3)
7. [ ] Fill `## Example Usage` by promoting the old `## Loop Algorithm` pseudocode + mermaid
       sequence diagram verbatim
8. [ ] Keep `## Related Workflows` as-is
9. [ ] Move `## GitHub Reviews API Mechanics`, `## Applicability`, `## Notes` into a trailing
       `## Supplementary` group with a one-line note explaining why they're additional

**Acceptance Criteria**:

- [✅] Diff the retrofitted file against the pre-retrofit version for prose content (not
  headings) — every sentence of normative behavior (cycle default, hard ceiling,
  `COMMENT`-state limitation, escalation rules, AI-attribution footer requirement) is still
  present somewhere in the new file
- [✅] No new normative behavior is introduced that wasn't in the original
- [✅] The frontmatter block parses as valid YAML (spot-check with a one-line parse, e.g.
  `python3 -c "import yaml,sys; yaml.safe_load(open('governance/workflows/pr/pr-review-quality-gate.md').read().split('---')[1])"`
  or equivalent) — `markdownlint` does not itself validate frontmatter YAML syntax, so this
  is a separate check
- [✅] Both `description` and `when_to_use` frontmatter values are quoted if they contain a colon

---

### Task 2.3: Preserve the `pr-review-fixer.md` Anchor (10 min)

**Steps**:

1. [ ] `grep -n "loop-exit-and-escalation-rules" .claude/agents/pr-review-fixer.md` — confirm
       line 185's link target
2. [ ] Verify the retrofitted file still has a heading that generates the
       `#loop-exit-and-escalation-rules` anchor (i.e., `### Loop-Exit and Escalation Rules`
       verbatim, nested under `## Termination Criteria`)
3. [ ] If the heading text had to change for any reason, update
       `.claude/agents/pr-review-fixer.md:185`'s link target in this same PR instead

**Acceptance Criteria**:

- [✅] The anchor resolves: open the rendered file (or verify via a markdown anchor-checker) and
  confirm `#loop-exit-and-escalation-rules` lands on the correct heading
- [✅] `git diff` shows either zero changes to `pr-review-fixer.md`, or an intentional,
  documented one-line link-target update

---

### Task 2.4: Fix `governance/workflows/README.md` (15 min)

**Steps**:

1. [ ] Replace the `> Placeholder...` line with the target content from `technical-design.md`
       Component 3 (adds a "Current Workflows" table listing `pr/pr-review-quality-gate.md` and
       references the new skill)

**Acceptance Criteria**:

- [✅] `grep -i placeholder governance/workflows/README.md` returns no matches
- [✅] File references `repo-defining-multi-agent-workflows`

---

### Task 2.5: Lint and Local Validation (15 min)

**Steps**:

1. [ ] `npm run lint:md` on both changed files
2. [ ] Re-read the full retrofitted `pr-review-quality-gate.md` end-to-end for coherence

**Acceptance Criteria**:

- [✅] `npm run lint:md` exits 0 for both files

---

### Task 2.6: Commit and Open PR2 (15 min)

**Steps**:

1. [ ] `git checkout -b docs/retrofit-pr-review-quality-gate`
2. [ ] `git add governance/workflows/pr/pr-review-quality-gate.md governance/workflows/README.md`
       (and `.claude/agents/pr-review-fixer.md` only if its link needed updating)
3. [ ] **COMMIT 2**: `docs(governance): retrofit pr-review-quality-gate to multi-agent workflow standard`
4. [ ] `git push -u origin docs/retrofit-pr-review-quality-gate`
5. [ ] `gh pr create` — Summary + Test Plan
6. [ ] Run the PR-Review Maker→Fixer cycle against **this very PR** (the workflow document
       describing the cycle is itself gated by the cycle it describes) — 3 cycles, 0
       CRITICAL/HIGH outstanding
7. [ ] Confirm CI green, then `gh pr merge --squash --auto`
8. [ ] `git checkout main && git pull origin main`

**Dependencies**:

- Requires: Phase 1 Gate passed
- Blocks: Phase 3 (the new skill's "Example Usage" section, if left as a forward-reference in
  Task 1.2 step 8, should be finalized/confirmed against the now-merged retrofit — a small
  follow-up edit to the Phase 1 skill file, included as Task 3.0 below if needed)

---

### Phase 2 Gate

> All checks below must pass before starting Phase 3.

- [ ] `governance/workflows/pr/pr-review-quality-gate.md` on `main` matches the canonical
      section set
- [ ] `governance/workflows/README.md` on `main` no longer contains "Placeholder"
- [ ] `grep -n "loop-exit-and-escalation-rules" .claude/agents/pr-review-fixer.md` still resolves
      to a real heading in the retrofitted file
- [ ] PR2 merged, branch deleted, CI green on `main`

Safe to stop here — the proof-of-concept retrofit is live and correct even if Phase 3 (DEFER
bookkeeping) is delayed. To resume: start Task 3.1.

---

## Phase 3 (PR3): Resolve the DEFER Record + Archive This Plan

### Task 3.0: Finalize the Skill's "Example Usage" Forward-Reference, If Needed (10 min)

**Steps**:

1. [ ] Re-read `.claude/skills/repo-defining-multi-agent-workflows/SKILL.md`'s `## Example
Usage` section written in Task 1.2 step 8
2. [ ] If it was left as a forward-reference note, update it now to quote/summarize the
       actually-merged retrofitted section from PR2
3. [ ] If this requires a file change, fold it into this PR's commit (Task 3.3) rather than
       opening a fourth PR for one paragraph

**Acceptance Criteria**:

- [✅] The skill's Example Usage section no longer says "will be finalized once PR2 lands" (or
  equivalent) — it reflects the real, merged retrofit

---

### Task 3.1: Remove the DEFER Row (10 min)

**Steps**:

1. [ ] Open `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`
2. [ ] Delete the `repo-defining-workflows` row from the "Deferred — Needs Product Decision" table

**Acceptance Criteria**:

- [✅] `grep -c "repo-defining-workflows" .claude/skills/repo-syncing-with-ose-primer/SKILL.md`
  drops to zero (the file no longer references the old DEFER item at all, since the
  colliding skill name itself is never mentioned elsewhere in this file)

---

### Task 3.2: Update the Harness Inventory and Footer (10 min)

**Steps**:

1. [ ] Change `| Skills | 30 | ... |` to
       `| Skills | 31 | 2026-10-16 (added repo-defining-multi-agent-workflows, resolving the Round 5 repo-defining-workflows DEFER item) |`
2. [ ] Change `**Last Updated**: 2026-10-06` to `**Last Updated**: 2026-10-16`

**Acceptance Criteria**:

- [✅] Both edits present; `Agents` and `Hooks` rows unchanged

---

### Task 3.3: Commit, Open PR3, and Archive the Plan (30 min)

**Steps**:

1. [ ] `git checkout -b docs/resolve-defer-repo-defining-workflows`
2. [ ] `git add .claude/skills/repo-syncing-with-ose-primer/SKILL.md` (plus the Task 3.0 skill
       edit, if any)
3. [ ] Update this plan's own `README.md` status to `✅ Completed` and add a Completed date
4. [ ] `git mv plans/in-progress/2026-10-16__repo-defining-multi-agent-workflows/ plans/done/2026-10-16__repo-defining-multi-agent-workflows/`
5. [ ] **COMMIT 3**: `docs(plan): resolve repo-defining-workflows DEFER and archive plan`
6. [ ] `git push -u origin docs/resolve-defer-repo-defining-workflows`
7. [ ] `gh pr create` — Summary + Test Plan
8. [ ] Run the PR-Review Maker→Fixer cycle — 3 cycles, 0 CRITICAL/HIGH outstanding
9. [ ] Confirm CI green, then `gh pr merge --squash --auto`
10. [ ] `git checkout main && git pull origin main`

**Dependencies**:

- Requires: Phase 2 Gate passed

---

### Phase 3 Gate

> All checks below must pass before this plan is considered complete.

- [ ] `grep -c "repo-defining-workflows" .claude/skills/repo-syncing-with-ose-primer/SKILL.md`
      is 0 on `main`
- [ ] Harness Inventory table on `main` shows `Skills | 31`
- [ ] Plan directory exists at `plans/done/2026-10-16__repo-defining-multi-agent-workflows/`
      (verify via `git log --follow` showing the rename) and no duplicate remains under
      `plans/in-progress/`
- [ ] PR3 merged, branch deleted, CI green on `main`

Safe to stop here — this plan is fully delivered.

---

## Commit Summary

| Commit # | PR  | Type | Scope      | Message                                                                              |
| -------- | --- | ---- | ---------- | ------------------------------------------------------------------------------------ |
| 1        | PR1 | docs | skills     | `docs(skills): add repo-defining-multi-agent-workflows skill`                        |
| 2        | PR2 | docs | governance | `docs(governance): retrofit pr-review-quality-gate to multi-agent workflow standard` |
| 3        | PR3 | docs | plan       | `docs(plan): resolve repo-defining-workflows DEFER and archive plan`                 |

---

## Validation Steps (End-to-End, Run After PR3 Merges)

- [ ] `npm run lint:md` passes repo-wide
- [ ] `test -f .claude/skills/repo-defining-multi-agent-workflows/SKILL.md`
- [ ] `test -f plans/done/2026-10-16__repo-defining-multi-agent-workflows/README.md`
- [ ] `grep -i placeholder governance/workflows/README.md` — no matches
- [ ] `grep -c "repo-defining-workflows" .claude/skills/repo-syncing-with-ose-primer/SKILL.md` — 0
- [ ] `grep -n "loop-exit-and-escalation-rules" .claude/agents/pr-review-fixer.md` resolves to a
      real heading in the retrofitted `pr-review-quality-gate.md`

---

## Quality Gates

- [ ] All three PRs passed the PR-Review Maker→Fixer cycle with 0 CRITICAL/HIGH outstanding
- [ ] All three PRs' CI is green at merge time
- [ ] No agent's `permission.skill:` list was modified (NFR-1)
- [ ] No reference to "Rhino", N+1 concurrency, `repo-governance/`, or a `Workflow` tool exists
      in any file this plan touches (NFR-3)

---

## Progress Tracking

| Phase         | Tasks Completed | Tasks Total | Status          |
| ------------- | --------------- | ----------- | --------------- |
| Pre-Flight    | 0               | 2           | [ ] Not Started |
| Phase 1 (PR1) | 0               | 4           | [ ] Not Started |
| Phase 2 (PR2) | 0               | 6           | [ ] Not Started |
| Phase 3 (PR3) | 0               | 3           | [ ] Not Started |

**Last Updated**: October 16, 2026 (plan created, no implementation started)
