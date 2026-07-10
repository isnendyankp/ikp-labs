# Checklist

## Status Legend

- [ ] Not started
- [🔄] In progress
- [✅] Completed

**Order matters**: Phase 3's three items (PR5 → PR6 → PR7) are sequential-dependent —
each must merge to `main` before the next starts. Phase 5 (PR9) must run last, after
PR1–PR8 are all merged, since it records final counts.

---

## Phase 0: Plan Setup

- [x] Create branch for plan work (this plan itself, not an implementation branch)
- [x] Create plan directory `plans/in-progress/2026-07-10__claude-governance-gap-round-4/`
- [x] Write README.md, requirements.md, technical-design.md, checklist.md

---

## Phase 1 (PR1): `api-exploratory-tester`

### Task 1.1: Draft the adapted agent file (45 min)

**Goal**: Produce `.claude/agents/api-exploratory-tester.md` with IKP-Labs adaptations
applied per technical-design.md's PR1 section.

1. [ ] `git checkout -b chore/api-exploratory-tester`
2. [ ] Write `.claude/agents/api-exploratory-tester.md` with frontmatter: `tools: Read,
Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch`, `model: sonnet`, `color: green`,
       `skills: plan-creating-project-plans, plan-writing-gherkin-criteria,
docs-applying-content-quality`
3. [ ] Apply all 6 body adaptations from technical-design.md's PR1 section (target
       endpoints, spec-discovery fallback, dead-link strip, `web-research-maker` rename,
       backlog path convention, cross-reference repoint)
4. [ ] Grep the new file for `ayokoding`, `organiclever`, `ose-www`, `repo-governance`,
       `web-researcher` (should return zero matches)

**Acceptance Criteria**:

- [ ] Agent file exists with valid frontmatter (all 3 skill refs resolve to existing
      `.claude/skills/` directories)
- [ ] Zero OSE-specific string matches per the grep above
- [ ] Example targets reference `kameravue-be :8081` and `taskly-be :8082`

### Task 1.2: Lint, commit, ship (20 min)

1. [ ] Run `npm run lint:md` — fix all errors before proceeding
2. [ ] **COMMIT 1**: `chore(agents): add api-exploratory-tester`
3. [ ] `git push -u origin chore/api-exploratory-tester`
4. [ ] `gh pr create` with summary + test plan
5. [ ] Wait for CI to pass
6. [ ] `gh pr merge <number> --squash --auto`
7. [ ] `git checkout main && git pull origin main`

**Verification**:

```bash
npm run lint:md
ls .claude/agents/api-exploratory-tester.md
```

---

## Phase 2 (PR2): `web-exploratory-tester`

### Task 2.1: Draft and ship the agent (60 min)

1. [ ] `git checkout -b chore/web-exploratory-tester`
2. [ ] Write `.claude/agents/web-exploratory-tester.md`: `tools: Read, Write, Edit, Glob,
Grep, Bash, WebFetch, WebSearch`, `model: sonnet`, `color: green`, `skills:
plan-creating-project-plans, plan-writing-gherkin-criteria, docs-applying-content-quality`
3. [ ] Apply the shared web-triad adaptation checklist from technical-design.md
       (target `kameravue-fe :3002`, strip dead links, rename `web-researcher`, backlog path
       convention)
4. [ ] Confirm the description explicitly scopes this agent to functional/edge-case
       defects (not usability or design) — matching the disjoint-triad boundary
5. [ ] Grep for OSE-specific strings — zero matches expected
6. [ ] Run `npm run lint:md` — fix all errors
7. [ ] **COMMIT 2**: `chore(agents): add web-exploratory-tester`
8. [ ] `git push -u origin chore/web-exploratory-tester`
9. [ ] `gh pr create`, wait for CI, `gh pr merge <number> --squash --auto`
10. [ ] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [ ] Agent file created with valid frontmatter, skills resolve to existing directories
- [ ] Zero OSE-specific references
- [ ] Description scope does not overlap `web-usability-tester` or `web-design-tester`

---

## Phase 2 (PR3): `web-usability-tester`

### Task 3.1: Draft and ship the agent (60 min)

1. [ ] `git checkout -b chore/web-usability-tester`
2. [ ] Write `.claude/agents/web-usability-tester.md` with the same frontmatter shape as
       PR2 (`tools`, `model: sonnet`, `color: green`, same 3 skills)
3. [ ] Apply the shared web-triad adaptation checklist — this agent's distinguishing
       content is spec-blind heuristic evaluation (Nielsen's 10 heuristics, cognitive
       walkthrough, information scent, WCAG Understandable) against `kameravue-fe`
4. [ ] Confirm the description explicitly states it ignores specs/source/mockups
       (spec-blind), distinguishing it from `web-exploratory-tester`
5. [ ] Grep for OSE-specific strings — zero matches expected
6. [ ] Run `npm run lint:md` — fix all errors
7. [ ] **COMMIT 3**: `chore(agents): add web-usability-tester`
8. [ ] `git push -u origin chore/web-usability-tester`
9. [ ] `gh pr create`, wait for CI, `gh pr merge <number> --squash --auto`
10. [ ] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [ ] Agent file created with valid frontmatter
- [ ] Zero OSE-specific references
- [ ] Description explicitly states spec-blind evaluation approach

---

## Phase 2 (PR4): `web-design-tester`

### Task 4.1: Draft and ship the agent (60 min)

1. [ ] `git checkout -b chore/web-design-tester`
2. [ ] Verify at implementation time whether `apps/kameravue-fe` uses a JS/TS
       `tailwind.config.*` file or Tailwind 4's CSS-first `@theme` config — reflect the actual
       convention in the ground-truth sources section
3. [ ] Write `.claude/agents/web-design-tester.md` with the same frontmatter shape as PR2
       (`tools`, `model: sonnet`, `color: green`, same 3 skills)
4. [ ] Apply the shared web-triad adaptation checklist, plus the design-specific swap:
       replace `libs/web-ui` design-system-primitives ground truth with
       `apps/kameravue-fe/src/components/` and the actual Tailwind theme config location
       confirmed in step 2
5. [ ] Confirm the description explicitly scopes this agent to mockup/token/design-system
       fidelity (not functional correctness or usability heuristics)
6. [ ] Grep for OSE-specific strings and `libs/web-ui` — zero matches expected
7. [ ] Run `npm run lint:md` — fix all errors
8. [ ] **COMMIT 4**: `chore(agents): add web-design-tester`
9. [ ] `git push -u origin chore/web-design-tester`
10. [ ] `gh pr create`, wait for CI, `gh pr merge <number> --squash --auto`
11. [ ] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [ ] Agent file created with valid frontmatter
- [ ] Zero OSE-specific references, zero `libs/web-ui` references
- [ ] Ground-truth sources reflect `kameravue-fe`'s actual Tailwind 4 config style

**Acceptance Criteria — Phase 2 (all 3 PRs)**:

- [ ] All 3 web tester agents exist with non-overlapping scope descriptions
- [ ] No new skill directories were created (all 3 reuse the same pre-existing 3 skills)

---

## Phase 3 (PR5): `governance/workflows/pr/pr-review-quality-gate.md`

> **Sequential — must merge before PR6 starts.**

### Task 5.1: Draft and ship the workflow doc (60 min)

1. [ ] `git checkout -b docs/pr-review-quality-gate-workflow`
2. [ ] Create directory `governance/workflows/pr/`
3. [ ] Write `governance/workflows/pr/pr-review-quality-gate.md` following
       technical-design.md's PR5 section: no YAML frontmatter block (unlike OSE), open with an
       H1 + Purpose/When-to-use prose section, keep Execution Mode, Participants, Loop
       Algorithm (pseudocode + Mermaid diagram), Steps 0–4, GitHub Reviews API Mechanics, and
       a renamed unconditional **Done-Definition** section
4. [ ] Replace all `repo-governance/` links per the FR-5 dead-link table in
       requirements.md — either repoint to existing IKP-Labs skill files
       (`repo-assessing-criticality-confidence`, `repo-applying-maker-checker-fixer`) or strip
       the link and keep the instruction as prose
5. [ ] Replace the "every `*-to-pr` delivery mode" framing with "every PR, since IKP-Labs
       has exactly one delivery mode" per requirements.md FR-3
6. [ ] Link forward to `.claude/agents/pr-review-maker.md` and
       `.claude/agents/pr-review-fixer.md` (these files do not exist yet — this is expected;
       PR6/PR7 create them next, and the sequential dependency runs this direction)

**Acceptance Criteria**:

- [ ] File exists at `governance/workflows/pr/pr-review-quality-gate.md`
- [ ] No YAML frontmatter block (matches IKP-Labs's existing workflow doc style)
- [ ] Zero dead links to non-existent `repo-governance/` files
- [ ] Zero references to OSE's four-way delivery-mode vocabulary

### Task 5.2: Lint, commit, ship (20 min)

1. [ ] Run `npm run lint:md` — fix all errors
2. [ ] **COMMIT 5**: `docs(governance): add pr-review-quality-gate workflow`
3. [ ] `git push -u origin docs/pr-review-quality-gate-workflow`
4. [ ] `gh pr create`, wait for CI, `gh pr merge <number> --squash --auto`
5. [ ] `git checkout main && git pull origin main`

---

## Phase 3 (PR6): `pr-review-maker`

> **Sequential — depends on PR5 being merged. Must merge before PR7 starts.**

### Task 6.1: Draft and ship the agent (60 min)

1. [ ] Confirm PR5 is merged to `main` and pulled locally before starting
2. [ ] `git checkout -b chore/pr-review-maker`
3. [ ] Write `.claude/agents/pr-review-maker.md`: `tools: Read, Bash, Grep, Glob,
WebFetch, WebSearch` (no `Write`/`Edit`), `model:` left blank (inherits orchestrator
       model), `color: blue`, no `skills:` key
4. [ ] Carry over Core Responsibility, Finding Requirements (confidence ≥ 80 hard floor,
       severity mapping, concrete evidence, anti-sycophantic framing), Scope Guard, CI-Gaming
       Watch, Untrusted-Input Handling, GitHub Reviews API Mechanics, Identity and Write-Scope
       Note, Maker-Fixer Loop Framing, Cross-Cycle Behavior, External Fact Verification
5. [ ] Apply the FR-5 dead-link adaptation table (criticality-levels → `.claude/skills/
repo-assessing-criticality-confidence`, maker-checker-fixer → `.claude/skills/
repo-applying-maker-checker-fixer`, strip the rest, `web-researcher` →
       `web-research-maker`)
6. [ ] Link `governance/workflows/pr/pr-review-quality-gate.md` at the correct relative
       path from `.claude/agents/`
7. [ ] Grep for OSE-specific strings and dead `repo-governance/` links — zero matches
       expected

**Acceptance Criteria**:

- [ ] Agent file created; `tools:` omits `Write`/`Edit`; `model:` is blank
- [ ] All links resolve to files that actually exist in this repo
- [ ] Zero OSE-specific references

### Task 6.2: Lint, commit, ship (20 min)

1. [ ] Run `npm run lint:md` — fix all errors
2. [ ] **COMMIT 6**: `chore(agents): add pr-review-maker`
3. [ ] `git push -u origin chore/pr-review-maker`
4. [ ] `gh pr create`, wait for CI, `gh pr merge <number> --squash --auto`
5. [ ] `git checkout main && git pull origin main`

---

## Phase 3 (PR7): `pr-review-fixer`

> **Sequential — depends on PR6 being merged.**

### Task 7.1: Draft and ship the agent (60 min)

1. [ ] Confirm PR6 is merged to `main` and pulled locally before starting
2. [ ] `git checkout -b chore/pr-review-fixer`
3. [ ] Write `.claude/agents/pr-review-fixer.md`: `tools: Read, Edit, Write, Bash, Grep,
Glob`, `model: sonnet`, `color: yellow`, no `skills:` key
4. [ ] Carry over Core Responsibility, Enumerating Unresolved Threads (GraphQL query
       pattern), the 4-way triage table, Reply and Resolve Discipline, Escalation on Repeated
       Rejection, Untrusted-Input Handling, Identity and Write Scope, Re-Run Quality Gates
       Before Every Push (adapt the example command to `npm run lint`, `npm test`, and the
       relevant `mvn test` / `go test ./...` depending on which app the fix touches, replacing
       the Nx-specific `nx affected -t ...` example), Maker-Checker-Fixer Framing (Two-Role
       Variant)
5. [ ] Apply the same FR-5 dead-link adaptation table as PR6
6. [ ] Link `governance/workflows/pr/pr-review-quality-gate.md` the same way as PR6
7. [ ] Grep for OSE-specific strings and dead links — zero matches expected

**Acceptance Criteria**:

- [ ] Agent file created with valid frontmatter
- [ ] Re-run-quality-gates section references actual IKP-Labs commands, not Nx-specific
      `nx affected` syntax
- [ ] Zero OSE-specific references

### Task 7.2: Lint, commit, ship (20 min)

1. [ ] Run `npm run lint:md` — fix all errors
2. [ ] **COMMIT 7**: `chore(agents): add pr-review-fixer`
3. [ ] `git push -u origin chore/pr-review-fixer`
4. [ ] `gh pr create`, wait for CI, `gh pr merge <number> --squash --auto`
5. [ ] `git checkout main && git pull origin main`

### Task 7.3: Manual dry-run smoke test (30 min, required before Phase 3 is done)

> Per the Risk Flag in requirements.md FR-5: this pair posts/resolves real GitHub PR
> review state, visible to collaborators. Do not consider Phase 3 done until this test
> runs.

1. [ ] Pick one real, low-stakes open PR (or open a trivial throwaway PR against a
       scratch branch specifically for this test)
2. [ ] Invoke `pr-review-maker` against it, confirm it posts at least one line-anchored
       comment (or correctly posts zero findings if the diff is clean) without erroring
3. [ ] Invoke `pr-review-fixer` against the same PR, confirm it enumerates any posted
       threads, applies a triage decision, and replies to each
4. [ ] Record the outcome (pass/fail + notes) in this checklist

**Acceptance Criteria — Phase 3 (all 3 PRs)**:

- [ ] Workflow doc + both agents exist and cross-link correctly
- [ ] Manual dry-run test documented with outcome

---

## Phase 4 (PR8): Hook Decision — `guard-pre-commit-env.test.sh`

### Task 8.1: Re-confirm the decision and record it (30 min)

1. [ ] `git checkout -b docs/skip-guard-pre-commit-env-hook`
2. [ ] Re-verify via `gh api repos/wahidyankf/ose-public/contents/scripts/check-no-env-staged.sh`
       that the path still 404s (confirm the Rust-CLI-supersession finding still holds at
       implementation time — OSE may have changed again since this plan was written)
3. [ ] Re-verify `.claude/hooks/block-env-file-access.sh` still exists and still covers
       `.env*` read/write/edit blocking in IKP-Labs
4. [ ] Add one row to the "What IKP-Labs Intentionally Does NOT Adopt" table in
       `.claude/skills/repo-syncing-with-ose-primer/SKILL.md` per technical-design.md's PR8
       section
5. [ ] Confirm `.claude/hooks/` directory and `.claude/settings.json` are unchanged
       (`git diff` shows no changes to either)

**Acceptance Criteria**:

- [ ] SKILL.md table has the new row with the Rust-CLI-supersession reason
- [ ] No new hook file created
- [ ] `.claude/settings.json` unchanged

### Task 8.2: Lint, commit, ship (15 min)

1. [ ] Run `npm run lint:md` — fix all errors
2. [ ] **COMMIT 8**: `docs(skills): record guard-pre-commit-env.test.sh as permanent skip`
3. [ ] `git push -u origin docs/skip-guard-pre-commit-env-hook`
4. [ ] `gh pr create`, wait for CI, `gh pr merge <number> --squash --auto`
5. [ ] `git checkout main && git pull origin main`

---

## Phase 5 (PR9): Finalize Sync Record

> **Must run last — confirm PR1 through PR8 are all merged before starting.**

### Task 9.1: Verify pre-conditions and count actual state (15 min)

1. [ ] Run `gh pr list --state merged --search "chore/api-exploratory-tester OR
chore/web-exploratory-tester OR chore/web-usability-tester OR chore/web-design-tester
OR chore/pr-review-maker OR chore/pr-review-fixer OR docs/pr-review-quality-gate-workflow
OR docs/skip-guard-pre-commit-env-hook"` (or equivalent) to confirm all 8 prior PRs
       merged
2. [ ] Run `ls .claude/agents/*.md | wc -l` and confirm the count is 53 (47 pre-Round-4 +
       6 new)
3. [ ] Run `ls -d .claude/skills/*/ | wc -l` and confirm the count is still 30
4. [ ] Run `ls .claude/hooks/ | wc -l` and confirm the count is still 5

### Task 9.2: Update SKILL.md and ideas.md, ship (30 min)

1. [ ] `git checkout -b docs/finalize-round-4-sync-record`
2. [ ] Update the "Harness Inventory Reference" table in
       `.claude/skills/repo-syncing-with-ose-primer/SKILL.md` per technical-design.md's PR9
       section (Agents → 53, "Last synced" → 2026-07-10 for Agents row only)
3. [ ] Update the `**Last Updated**:` footer in that SKILL.md to `2026-07-10`
4. [ ] Add the Round 4 bullet to `plans/ideas.md` under `### ✅ Implemented`, above the
       Round 3 entry, per technical-design.md's PR9 section — fill in the actual merged PR
       number range from Task 9.1's `gh pr list` output
5. [ ] Update `plans/ideas.md`'s trailing `**Last Updated**:` footer line
6. [ ] Run `npm run lint:md` — fix all errors
7. [ ] **COMMIT 9**: `docs(plan): finalize claude-governance-gap-round-4 sync record`
8. [ ] `git push -u origin docs/finalize-round-4-sync-record`
9. [ ] `gh pr create`, wait for CI, `gh pr merge <number> --squash --auto`
10. [ ] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [ ] SKILL.md counts match actual repo state (verified in Task 9.1)
- [ ] `plans/ideas.md` has the Round 4 entry with real PR numbers, not placeholders

### Task 9.3: Archive this plan (15 min)

1. [ ] Verify every checklist item in this file is checked
2. [ ] Update this plan's README.md status to `✅ Completed` with completion date
3. [ ] `git mv plans/in-progress/2026-07-10__claude-governance-gap-round-4/
plans/done/2026-07-10__claude-governance-gap-round-4/`
4. [ ] **COMMIT 10**: `docs(plan): move claude-governance-gap-round-4 to done`
5. [ ] Push and merge per the same branch → PR → CI → merge cycle

---

## Commit Summary

| Commit | Type  | Scope      | Message                                               |
| ------ | ----- | ---------- | ----------------------------------------------------- |
| 1      | chore | agents     | add api-exploratory-tester                            |
| 2      | chore | agents     | add web-exploratory-tester                            |
| 3      | chore | agents     | add web-usability-tester                              |
| 4      | chore | agents     | add web-design-tester                                 |
| 5      | docs  | governance | add pr-review-quality-gate workflow                   |
| 6      | chore | agents     | add pr-review-maker                                   |
| 7      | chore | agents     | add pr-review-fixer                                   |
| 8      | docs  | skills     | record guard-pre-commit-env.test.sh as permanent skip |
| 9      | docs  | plan       | finalize claude-governance-gap-round-4 sync record    |
| 10     | docs  | plan       | move claude-governance-gap-round-4 to done            |

---

## Progress Tracking

**Overall Progress**: 0/9 PRs completed (0%) — Phase 0 (plan setup) complete

| Phase                         | PR  | Status          |
| ----------------------------- | --- | --------------- |
| 1 — api-exploratory-tester    | PR1 | [ ] Not started |
| 2 — web-exploratory-tester    | PR2 | [ ] Not started |
| 2 — web-usability-tester      | PR3 | [ ] Not started |
| 2 — web-design-tester         | PR4 | [ ] Not started |
| 3 — pr-review-quality-gate.md | PR5 | [ ] Not started |
| 3 — pr-review-maker           | PR6 | [ ] Not started |
| 3 — pr-review-fixer           | PR7 | [ ] Not started |
| 4 — hook decision (skip)      | PR8 | [ ] Not started |
| 5 — finalize sync record      | PR9 | [ ] Not started |

**Last Updated**: 2026-07-10
