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

## Phase 1 (PR1): `api-exploratory-tester` — ✅ Done (PR #205)

### Task 1.1: Draft the adapted agent file (45 min)

**Goal**: Produce `.claude/agents/api-exploratory-tester.md` with IKP-Labs adaptations
applied per technical-design.md's PR1 section.

1. [x] `git checkout -b chore/api-exploratory-tester`
2. [x] Write `.claude/agents/api-exploratory-tester.md` with frontmatter: `model: sonnet`,
       `color: green`, `permission.skill: plan-creating-project-plans,
plan-writing-gherkin-criteria, docs-applying-content-quality`
       — **deviation from plan**: verified against all 47 existing agents that the real
       frontmatter key is `permission.skill:`, not `skills:`, and that zero existing
       agents use a `tools:` field (tool scope is documented in body prose instead); both
       corrected before commit
3. [x] Apply all 6 body adaptations from technical-design.md's PR1 section (target
       endpoints, spec-discovery fallback, dead-link strip, `web-research-maker` rename,
       backlog path convention, cross-reference repoint)
4. [x] Grep the new file for `ayokoding`, `organiclever`, `ose-www`, `repo-governance`,
       `web-researcher` (zero matches confirmed)
5. [x] **Extra step (not in original plan)**: added a new "Live/Runtime Testers" section
       to `.claude/agents/README.md`'s agent index table — this per-agent index exists and
       needs a row for every new agent; Phase 2's three PRs will add to this same section

**Acceptance Criteria**:

- [x] Agent file exists with valid frontmatter (all 3 skill refs resolve to existing
      `.claude/skills/` directories)
- [x] Zero OSE-specific string matches per the grep above
- [x] Example targets reference `kameravue-be :8081` and `taskly-be :8082`

### Task 1.2: Lint, commit, ship (20 min)

1. [x] Run `npm run lint:md` — fixed 2 errors (missing fenced-code language, a `+` at
       line-start misparsed as a list marker after wrapping)
2. [x] **COMMIT**: `chore(agents): add api-exploratory-tester` (`265080a`)
3. [x] `git push -u origin chore/api-exploratory-tester`
4. [x] `gh pr create` — PR #205
5. [x] CI passed (7/7 checks green)
6. [x] `gh pr merge 205 --squash --auto` — merged 2026-07-13T11:56:24Z
7. [x] `git checkout main && git pull origin main`

**Verification**:

```bash
npm run lint:md
ls .claude/agents/api-exploratory-tester.md
```

**Note**: the plan itself (`README.md`, `requirements.md`, `technical-design.md`,
`checklist.md`) was committed and merged first, as its own PR (**PR #204**,
`docs(plan): add claude-governance-gap-round-4 in-progress plan`), per the Round 3
precedent of the plan landing before its first implementation PR. This PR is not one of
the 9 numbered PRs in this plan's scope.

---

## Phase 2 (PR2): `web-exploratory-tester` — ✅ Done (PR #207)

### Task 2.1: Draft and ship the agent (60 min)

1. [x] `git checkout -b chore/web-exploratory-tester`
2. [x] Write `.claude/agents/web-exploratory-tester.md`: `model: sonnet`, `color: green`,
       `permission.skill: plan-creating-project-plans, plan-writing-gherkin-criteria,
docs-applying-content-quality` — same frontmatter correction as PR1
       (`permission.skill:` not `skills:`, no `tools:` field)
3. [x] Apply the shared web-triad adaptation checklist from technical-design.md
       (target `kameravue-fe :3002`, strip dead links, rename `web-researcher`, backlog path
       convention) — plus one extra finding: verified `kameravue-fe` has no i18n/locale
       config, so OSE's mandatory multi-locale sweep language was rewritten to state
       locale coverage is n/a (single-locale), not left as dead instructions
4. [x] Confirmed the description explicitly scopes this agent to functional/edge-case
       defects (not usability or design) — matching the disjoint-triad boundary
5. [x] Grep for OSE-specific strings — zero matches confirmed
6. [x] Run `npm run lint:md` — 0 errors in changed files
7. [x] **COMMIT**: `chore(agents): add web-exploratory-tester` (`107ad45`)
8. [x] `git push -u origin chore/web-exploratory-tester`
9. [x] `gh pr create` — PR #207; CI passed (7/7); `gh pr merge 207 --squash --auto` —
       merged 2026-07-16T12:03:50Z
10. [x] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [x] Agent file created with valid frontmatter, skills resolve to existing directories
- [x] Zero OSE-specific references
- [x] Description scope does not overlap `web-usability-tester` or `web-design-tester`

---

## Phase 2 (PR3): `web-usability-tester` — ✅ Done (PR #209)

### Task 3.1: Draft and ship the agent (60 min)

1. [x] `git checkout -b chore/web-usability-tester`
2. [x] Write `.claude/agents/web-usability-tester.md` with the same frontmatter shape as
       PR2 (`model: sonnet`, `color: green`, `permission.skill:` — same 3 skills, no
       `tools:` field)
3. [x] Apply the shared web-triad adaptation checklist — this agent's distinguishing
       content is spec-blind heuristic evaluation (Nielsen's 10 heuristics, cognitive
       walkthrough, information scent, WCAG Understandable) against `kameravue-fe` — plus
       the same locale n/a finding as PR2, and `repo-governance/principles/content/
accessibility-first.md` confirmed to have no IKP-Labs equivalent (stripped to prose)
4. [x] Confirmed the description explicitly states it ignores specs/source/mockups
       (spec-blind), distinguishing it from `web-exploratory-tester` — and explicitly
       preserved its two unique artifacts (`walkthrough.md`, `spec-suggestions.md`) while
       stating it produces no `spec-gaps.md` (that's PR2's agent's output)
5. [x] Grep for OSE-specific strings — zero matches confirmed
6. [x] Run `npm run lint:md` — 0 errors in changed files
7. [x] **COMMIT**: `chore(agents): add web-usability-tester` (`7846dbf`)
8. [x] `git push -u origin chore/web-usability-tester`
9. [x] `gh pr create` — PR #209; CI passed (7/7); `gh pr merge 209 --squash --auto` —
       merged 2026-07-18T11:10:20Z
10. [x] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [x] Agent file created with valid frontmatter
- [x] Zero OSE-specific references
- [x] Description explicitly states spec-blind evaluation approach

---

## Phase 2 (PR4): `web-design-tester` — ✅ Done (PR #211)

### Task 4.1: Draft and ship the agent (60 min)

1. [x] `git checkout -b chore/web-design-tester`
2. [x] Verified `apps/kameravue-fe` uses Tailwind 4's CSS-first `@theme inline` config in
       `apps/kameravue-fe/src/app/globals.css` — no `tailwind.config.*` file exists;
       reflected the actual convention in the ground-truth sources section
3. [x] Write `.claude/agents/web-design-tester.md` with the same frontmatter shape as PR2
       (`model: sonnet`, `color: green`, `permission.skill:` — same 3 skills, no `tools:`
       field)
4. [x] Apply the shared web-triad adaptation checklist, plus the design-specific swap:
       replaced `libs/web-ui` design-system-primitives ground truth with
       `apps/kameravue-fe/src/components/ui/` (verified real files: Button, ConfirmDialog,
       EmptyState, FormField, IconButton, Toast) — explicitly softened as app-local, not a
       published Nx `libs/` package like OSE's; also found `plans/README.md` has no
       UI-mockup convention, so that ground-truth source was reworded honestly instead of
       asserting a nonexistent path
5. [x] Confirmed the description explicitly scopes this agent to mockup/token/design-system
       fidelity (not functional correctness or usability heuristics)
6. [x] Grep for OSE-specific strings and `libs/web-ui` — zero matches confirmed
7. [x] Run `npm run lint:md` — 0 errors in changed files
8. [x] **COMMIT**: `chore(agents): add web-design-tester` (`c41591d`)
9. [x] `git push -u origin chore/web-design-tester`
10. [x] `gh pr create` — PR #211; CI passed (7/7); `gh pr merge 211 --squash --auto` —
        merged 2026-07-19T08:54:32Z
11. [x] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [x] Agent file created with valid frontmatter
- [x] Zero OSE-specific references, zero `libs/web-ui` references
- [x] Ground-truth sources reflect `kameravue-fe`'s actual Tailwind 4 config style

**Acceptance Criteria — Phase 2 (all 3 PRs)**:

- [x] All 3 web tester agents exist with non-overlapping scope descriptions
- [x] No new skill directories were created (all 3 reuse the same pre-existing 3 skills)

---

## Phase 3 (PR5): `governance/workflows/pr/pr-review-quality-gate.md` — ✅ Done (PR #213)

> **Sequential — must merge before PR6 starts.**

### Task 5.1: Draft and ship the workflow doc (60 min)

1. [x] `git checkout -b docs/pr-review-quality-gate-workflow`
2. [x] Created directory `governance/workflows/pr/`
3. [x] Wrote `governance/workflows/pr/pr-review-quality-gate.md` — no YAML frontmatter
       (matches `governance/development/workflow/implementation.md`'s style, verified
       directly), H1 + Purpose/When-to-use prose, kept Execution Mode, Participants, Loop
       Algorithm (pseudocode + Mermaid diagram), Steps 0–4, GitHub Reviews API Mechanics,
       and a renamed unconditional **Done-Definition** section
4. [x] Went beyond the original plan's scope estimate — OSE's doc needed **heavy** cutting,
       not light adaptation: deleted delivery-mode vocabulary (`*-to-pr`, `worktree-to-pr`,
       etc.), the `[AI]`/`[HUMAN]` executor-tagging system, the `plan-execution.md` Step-8
       orchestrator, merge precondition (e) and its Mermaid flowchart (referenced
       nonexistent `ui-quality-gate.md`/`api-quality-gate.md`), the "three-repo nuance" and
       "byte-identity-boundary sibling PRs" notes (pure OSE multi-repo concepts), and the
       Principles/Conventions citation lists (all OSE-only doc paths) — replaced with one
       Explicit-Over-Implicit citation to `governance/principles/general.md`
5. [x] Replaced the "every `*-to-pr` delivery mode" framing with "every PR, since IKP-Labs
       has exactly one delivery mode" (branch → PR → CI → squash-merge, per `CLAUDE.md`)
6. [x] Linked forward to `.claude/agents/pr-review-maker.md` and
       `.claude/agents/pr-review-fixer.md` (correct 3-levels-up relative path verified;
       files don't exist yet — expected, PR6/PR7 create them next)

**Acceptance Criteria**:

- [x] File exists at `governance/workflows/pr/pr-review-quality-gate.md`
- [x] No YAML frontmatter block (matches IKP-Labs's existing workflow doc style)
- [x] Zero dead links — grepped 16 OSE-only terms, zero matches; all remaining links
      verified to resolve to real files
- [x] Zero references to OSE's four-way delivery-mode vocabulary

### Task 5.2: Lint, commit, ship (20 min)

1. [x] Run `npm run lint:md` — 0 errors in the new file
2. [x] **COMMIT**: `docs(governance): add pr-review-quality-gate workflow` (`f499da0`)
3. [x] `git push -u origin docs/pr-review-quality-gate-workflow`
4. [x] `gh pr create` — PR #213; CI passed (7/7); `gh pr merge 213 --squash --auto` —
       merged 2026-07-22T11:02:57Z
5. [x] `git checkout main && git pull origin main`

---

## Phase 3 (PR6): `pr-review-maker` — ✅ Done (PR #215)

> **Sequential — depends on PR5 being merged. Must merge before PR7 starts.**

### Task 6.1: Draft and ship the agent (60 min)

1. [x] Confirmed PR5 is merged to `main` and pulled locally before starting
2. [x] `git checkout -b chore/pr-review-maker`
3. [x] **Discovery mid-task**: re-fetching the OSE source 404'd — OSE refactored this
       agent upstream into 9 specialist makers + a synthesizer sometime after this round
       was planned. Adopting that would contradict PR5's already-merged 2-role loop
       design, so recovered the last pre-refactor version via the parent commit before
       OSE's deletion (`gh api commits?path=...` → parent SHA → fetch at that ref) and
       adapted that instead — no scope change from the original plan
4. [x] Write `.claude/agents/pr-review-maker.md`: `tools: Read, Bash, Grep, Glob,
WebFetch, WebSearch` (no `Write`/`Edit`), `model:` left blank (inherits orchestrator
       model), `color: blue`, no `permission.skill:` key — deliberate exception to the
       no-`tools:`-field convention PR1-4 established, per the plan's technical-design.md
5. [x] Carried over Core Responsibility, Finding Requirements (confidence ≥ 80 hard floor,
       severity mapping, concrete evidence, anti-sycophantic framing), Scope Guard, CI-Gaming
       Watch, Untrusted-Input Handling, GitHub Reviews API Mechanics, Identity and Write-Scope
       Note, Maker-Fixer Loop Framing, Cross-Cycle Behavior, External Fact Verification
6. [x] Applied the FR-5 dead-link adaptation table (criticality-levels →
       `.claude/skills/repo-assessing-criticality-confidence`, maker-checker-fixer →
       `.claude/skills/repo-applying-maker-checker-fixer`, `git-fixture-isolation` dropped
       entirely — doesn't transfer to IKP-Labs's Jest/JUnit/Go/Playwright suites,
       `web-researcher` → `web-research-maker`)
7. [x] Linked `governance/workflows/pr/pr-review-quality-gate.md` at the correct relative
       path from `.claude/agents/`
8. [x] Grep for OSE-specific strings and dead `repo-governance/` links — zero matches
       confirmed
9. [x] **Extra step**: added a new "PR Review" section to `.claude/agents/README.md`'s
       agent index (this round's second new domain section, after "Live/Runtime Testers")

**Acceptance Criteria**:

- [x] Agent file created; `tools:` omits `Write`/`Edit`; `model:` is blank
- [x] All links resolve to files that actually exist in this repo
- [x] Zero OSE-specific references

### Task 6.2: Lint, commit, ship (20 min)

1. [x] Run `npm run lint:md` — 0 errors in changed files
2. [x] **COMMIT**: `chore(agents): add pr-review-maker` (`445f44c`)
3. [x] `git push -u origin chore/pr-review-maker`
4. [x] `gh pr create` — PR #215; CI passed (7/7); `gh pr merge 215 --squash --auto` —
       merged 2026-07-24T13:15:34Z
5. [x] `git checkout main && git pull origin main`

---

## Phase 3 (PR7): `pr-review-fixer` — ✅ Agent shipped (PR #217, frontmatter fixed in PR #222); dry-run test partially blocked

> **Sequential — depends on PR6 being merged.**

### Task 7.1: Draft and ship the agent (60 min)

1. [x] Confirmed PR6 is merged to `main` and pulled locally before starting
2. [x] `git checkout -b chore/pr-review-fixer`
3. [x] **Discovery mid-task**: OSE's current live `pr-review-fixer.md` (unlike the maker,
       it wasn't deleted) had already been rewritten to reference the 9-specialist
       decomposition (`pr-review-synthesis-maker` + 8 discipline specialists) — same
       upstream-drift situation as PR6. Recovered the pre-decomposition version via the
       same historical git ref used in PR6 and adapted that instead, staying consistent
       with our already-merged PR5/PR6
4. [x] Write `.claude/agents/pr-review-fixer.md`: `tools: Read, Edit, Write, Bash, Grep,
Glob`, `model: sonnet`, `color: yellow`, no `permission.skill:` key
5. [x] Carried over Core Responsibility, Enumerating Unresolved Threads (GraphQL query
       pattern), the 4-way triage table, Reply and Resolve Discipline, Escalation on Repeated
       Rejection, Untrusted-Input Handling, Identity and Write Scope, Re-Run Quality Gates
       Before Every Push (adapted the example command to `npm run lint`/`test`, `mvn test`,
       `go test ./...`, and Nx-scoped equivalents, framed as "run whichever apply to the PR's
       changed files" instead of one fixed Nx-target command), Maker-Checker-Fixer Framing
       (Two-Role Variant)
6. [x] Applied the same FR-5 dead-link adaptation table as PR6 (`git-push-default`
       convention dropped entirely — its contrast point doesn't exist in IKP-Labs)
7. [x] Linked `governance/workflows/pr/pr-review-quality-gate.md` the same way as PR6;
       `pr-review-maker` is now a real backward link since PR6 is merged
8. [x] Grep for OSE-specific strings and dead links — zero matches confirmed
9. [x] **Extra step**: added the Fixer row to `.claude/agents/README.md`'s "PR Review"
       section (created in PR6), completing the maker/fixer pair

**Acceptance Criteria**:

- [x] Agent file created with valid frontmatter — **correction**: the `description` field
      was actually malformed (real unindented multi-line YAML instead of the single-line
      escaped-`\n` convention every sibling agent uses), which left `pr-review-fixer`
      unrecognized as an invokable Agent-tool subagent type. Not caught at ship time because
      lint (`npm run lint:md`) only checks Markdown, not frontmatter structure, and nothing
      exercised the agent as an actual tool call until Task 7.3. Fixed in PR #222
      (2026-08-01) by reformatting to match `pr-review-maker.md`'s convention — no wording
      changed
- [x] Re-run-quality-gates section references actual IKP-Labs commands, not Nx-specific
      `nx affected` syntax
- [x] Zero OSE-specific references

### Task 7.2: Lint, commit, ship (20 min)

1. [x] Run `npm run lint:md` — 0 errors in changed files
2. [x] **COMMIT**: `chore(agents): add pr-review-fixer` (`d20927b`)
3. [x] `git push -u origin chore/pr-review-fixer`
4. [x] `gh pr create` — PR #217; CI passed (7/7); `gh pr merge 217 --squash --auto` —
       merged 2026-07-26T06:03:56Z
5. [x] `git checkout main && git pull origin main`

### Task 7.3: Manual dry-run smoke test (30 min, required before Phase 3 is done) — ⚠️ PARTIALLY RUN, blocked

> Per the Risk Flag in requirements.md FR-5: this pair posts/resolves real GitHub PR
> review state, visible to collaborators. Do not consider Phase 3 done until this test
> runs. **This is a live-state action (posts real comments on a real PR, visible to
> collaborators) — requires explicit user go-ahead before running, per this session's
> standing risk posture. Not run automatically as part of shipping PR7.**

1. [x] Picked a trivial throwaway PR against a scratch branch specifically for this test —
       PR #221 (`test/pr-review-fixer-dry-run-smoke-test`), one file
       (`SMOKE_TEST_PR_REVIEW.md`) with a deliberate `TODO:` line as reviewer bait
2. [x] Invoked `pr-review-maker` against PR #221 — **pass**. It read the diff, checked for
       prompt injection (none), correctly judged the `TODO:` line didn't clear its
       ≥80-confidence bar (no HARD RULE to anchor even a LOW nit — no TODO-tracking
       convention exists in `governance/`), and posted **zero findings** without erroring
3. [ ] Invoked `pr-review-fixer` against PR #221 — **blocked, not run**. The Agent tool
       reported `Agent type 'pr-review-fixer' not found` even though the file existed.
       Root-caused to malformed frontmatter (see Task 7.1's acceptance-criteria correction
       above); fixed and merged in PR #222. Re-attempted the invocation both before and
       after the fix merged to `main` (same session) — still not found both times. The
       Agent tool's subagent registry appears to snapshot once at session start and does
       not hot-reload mid-session, even across a merge to `main`. **This step needs to be
       re-run in a fresh session** (registry will pick up the now-fixed
       `.claude/agents/pr-review-fixer.md` on next session start)
4. [x] Recorded the outcome above (this entry)

**Acceptance Criteria — Phase 3 (all 3 PRs)**:

- [x] Workflow doc + both agents exist and cross-link correctly
- [ ] Manual dry-run test documented with outcome — **pr-review-maker leg passed;
      pr-review-fixer leg still needs a fresh-session re-run against PR #221 or a new
      throwaway PR (see Task 7.3 step 3)**

---

## Phase 4 (PR8): Hook Decision — `guard-pre-commit-env.test.sh` — ✅ Done (PR #219)

### Task 8.1: Re-confirm the decision and record it (30 min)

1. [x] `git checkout -b docs/skip-guard-pre-commit-env-hook`
2. [x] Re-verified via `gh api repos/wahidyankf/ose-public/contents/scripts/check-no-env-staged.sh`
       that the path still 404s — Rust-CLI-supersession finding still holds
3. [x] Re-verified `.claude/hooks/block-env-file-access.sh` still exists and is still
       wired in `.claude/settings.json`
4. [x] Added one row to the "What IKP-Labs Intentionally Does NOT Adopt" table in
       `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`
5. [x] Confirmed `.claude/hooks/` directory and `.claude/settings.json` are unchanged
       (`git diff --stat` showed only the 1-line SKILL.md change)

**Acceptance Criteria**:

- [x] SKILL.md table has the new row with the Rust-CLI-supersession reason
- [x] No new hook file created
- [x] `.claude/settings.json` unchanged

### Task 8.2: Lint, commit, ship (15 min)

1. [x] Run `npm run lint:md` — 0 errors in changed files
2. [x] **COMMIT**: `docs(skills): record guard-pre-commit-env.test.sh as permanent skip` (`45f3d05`)
3. [x] `git push -u origin docs/skip-guard-pre-commit-env-hook`
4. [x] `gh pr create` — PR #219; CI passed (7/7); `gh pr merge 219 --squash --auto` —
       merged 2026-07-29T12:14:07Z
5. [x] `git checkout main && git pull origin main`

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

**Unplanned**: `fix(agents): repair malformed frontmatter in pr-review-fixer.md` (PR #222,
merged 2026-08-01) — discovered during Task 7.3's dry-run smoke test; see Task 7.1's
acceptance-criteria correction above.

---

## Progress Tracking

**Overall Progress**: 8/9 PRs completed (89%) — Phase 0-4 all shipped (Phase 3's dry-run smoke test partially run: pr-review-maker leg passed, pr-review-fixer leg blocked on a frontmatter bug now fixed in PR #222 and needs a fresh-session re-run, see checklist Task 7.3); Phase 5 (PR9, finalize) is the last PR

| Phase                         | PR  | Status                                                 |
| ----------------------------- | --- | ------------------------------------------------------ |
| 1 — api-exploratory-tester    | PR1 | [x] Done (PR #205)                                     |
| 2 — web-exploratory-tester    | PR2 | [x] Done (PR #207)                                     |
| 2 — web-usability-tester      | PR3 | [x] Done (PR #209)                                     |
| 2 — web-design-tester         | PR4 | [x] Done (PR #211)                                     |
| 3 — pr-review-quality-gate.md | PR5 | [x] Done (PR #213)                                     |
| 3 — pr-review-maker           | PR6 | [x] Done (PR #215)                                     |
| 3 — pr-review-fixer           | PR7 | [x] Shipped (PR #217, #222); dry-run fixer leg pending |
| 4 — hook decision (skip)      | PR8 | [x] Done (PR #219)                                     |
| 5 — finalize sync record      | PR9 | [ ] Not started                                        |

**Plan-setup PR** (not one of the 9): `docs/add-claude-governance-gap-round-4-plan` → PR #204, merged.
**Checklist-sync PRs** (not one of the 9): `docs/mark-round-4-pr1-complete` → PR #206, merged;
`docs/mark-round-4-pr2-complete` → PR #208, merged; `docs/mark-round-4-pr3-complete` → PR #210, merged;
`docs/mark-round-4-pr4-complete` → PR #212, merged; `docs/mark-round-4-pr5-complete` → PR #214, merged;
`docs/mark-round-4-pr6-complete` → PR #216, merged; `docs/mark-round-4-pr7-complete` → PR #218, merged.

**Open item**: Task 7.3's manual dry-run smoke test (`pr-review-maker` + `pr-review-fixer` against
a real PR) has not been run — it posts real, collaborator-visible GitHub state, so it needs an
explicit go-ahead rather than running automatically as part of shipping PR7. PR9 (Phase 5) should
hold until this either runs or is explicitly deferred, since PR9 records final Round 4 state.

**Last Updated**: 2026-07-29
