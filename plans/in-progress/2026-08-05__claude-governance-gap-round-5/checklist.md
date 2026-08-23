# Checklist

## Status Legend

- [ ] Not started
- [🔄] In progress
- [✅] Completed

**Order matters**: Phase 1 ships first (highest leverage). Within Phase 5, PR25 merges
after PR24. Within Phase 6, PR27 merges after PR26. Phase 10 (PR39) must run last, after
Phases 1–9 are all merged, since it records final counts and the Round 5 archive entry.
All other PRs in Phases 1–9 are independent and may ship in any order within their phase.

---

## Standard PR Recipe

Every PR in Phases 1–9 (unless a task block says otherwise) follows this recipe. Each
phase's tasks below reference these steps by number instead of repeating them in full.

1. `git checkout -b docs/<item-slug>`
2. Fetch the current OSE source with the `gh api ... | jq -r '.content' | base64 -d`
   pattern from technical-design.md's Fetch Command Pattern section. If it 404s, recover
   the last pre-deletion version via commit history (same recovery pattern Round 4 used
   for `pr-review-maker`/`pr-review-fixer` — see
   `plans/done/2026-07-10__claude-governance-gap-round-4/checklist.md` Task 6.1)
3. Adapt the fetched content: apply the capability described in this PR's task block,
   using requirements.md's Per-Item Decision Record adaptation notes and
   technical-design.md's Adaptation Convention Table (strip OSE/ayokoding/organiclever/
   ose-www branding, `repo-governance/` paths, `vitest-axe`→`jest-axe`, etc.)
4. Merge the adapted content into the existing IKP-Labs file — this is an edit, not a
   replacement; preserve all existing sections that are not part of this PR's finding
5. Grep the edited file for OSE-specific strings (`ayokoding`, `organiclever`, `ose-www`,
   `repo-governance`, `wahidyankf`, and any item-specific terms called out in the task
   block) — zero matches required
6. Run `npm run lint:md` — fix all errors before committing
7. **COMMIT**: use the exact subject from technical-design.md's Commit Strategy table
8. `git push -u origin docs/<item-slug>`
9. `gh pr create`, wait for CI, `gh pr merge <n> --squash --auto`
10. `git checkout main && git pull origin main`

---

## Phase 0: Plan Setup

- [ ] Create branch for plan work (this plan itself, not an implementation branch)
- [ ] Create plan directory `plans/in-progress/2026-08-05__claude-governance-gap-round-5/`
- [ ] Write README.md, requirements.md, technical-design.md, checklist.md
- [ ] Commit and merge the plan itself as its own PR before Phase 1 starts, per Round 4
      precedent (Round 4's plan-setup PR was #204, merged before PR1)

---

## Phase 1 (PR1): Maker-Checker-Fixer Convergence Safeguards — ✅ Done (PR #230), spot-check found a systemic gap

**Target**: `.claude/skills/repo-applying-maker-checker-fixer/SKILL.md`
**OSE source**: `.claude/skills/repo-applying-maker-checker-fixer/SKILL.md`

### Task 1.1: Draft and ship the skill update

1. [x] Recipe steps 1–2: branch `docs/mcf-convergence-safeguards`, fetch OSE source
       (`gh api ... --jq '.content'` — note: `--jq -r '.content'` errors with "accepts 1
       arg(s), received 2"; `gh api --jq` does not take a separate `-r` flag, drop it)
2. [x] Adapted and added all five sub-capabilities: FALSE_POSITIVE skip list
       (`generated-reports/.known-false-positives.md`, reusing the file's own gitignored
       `generated-reports/` convention), scoped re-validation (`git diff --name-only HEAD`),
       post-edit self-verification (`grep` after every `sed`-style fix, log FAILED on
       silent no-op), escalation after 2+ rounds of disagreement (`ESCALATED` status), fixer
       `mode` parameter (lax/normal/strict/ocd) mapped to this repo's existing
       CRITICAL/HIGH/MEDIUM/LOW tiers from `wow-criticality-assessment`
3. [x] Kept the guidance generic — no Java/TypeScript/Go-specific hard-coding; reused
       AGENTS.md's existing HIGH/MEDIUM/FALSE_POSITIVE confidence vocabulary instead of
       inventing new terms
4. [x] Recipe steps 5–10: grep (zero OSE matches), lint (0 errors), commit
       (`docs(skills): add mcf convergence safeguards` — shortened from the originally
       planned subject, which at 77 chars exceeded commitlint's 72-char header-max-length),
       push, PR #230, CI green (7/7), merged, pulled

**Acceptance Criteria**:

- [x] All five sub-capabilities present in the updated SKILL.md
- [x] Zero OSE-specific string matches
- [x] `npm run lint:md` passes

### Task 1.2: Spot-check downstream inheritance (required before Phase 1 is done) — ⚠️ FAIL, systemic gap found

> Per README.md Success Criteria: verify the fix actually flows through to inheriting
> agents, not just that the skill file changed.

1. [x] Opened `.claude/agents/plan-checker.md` — **FAIL**. Its `permission.skill:` list is
       `plan-creating-project-plans`, `wow-criticality-assessment` only.
       `repo-applying-maker-checker-fixer` is absent, and grepping the file for
       `FALSE_POSITIVE`/`re-validat`/`maker-checker-fixer` returns zero matches — no
       reference AND no inline duplication. The agent has no convergence-safeguard
       behavior at all, from this skill or otherwise.
2. [x] Opened `.claude/agents/swe-ui-checker.md` — **FAIL**, identical pattern. Its
       `permission.skill:` list is `swe-developing-frontend-ui`, `wow-criticality-assessment`
       only; same zero-match grep result.
3. [x] Recorded both results. **Broader diagnostic** (not in the original task list, but
       necessary to characterize the finding): spot-checked 5 more checker agents
       (`repo-rules-checker`, `docs-checker`, `readme-checker`, `specs-checker`,
       `repo-harness-compatibility-checker`) — **none** reference
       `repo-applying-maker-checker-fixer` either. Root cause: this skill's own frontmatter
       says `**Used By**: repo-setup-manager, agent-maker` — it was designed as a
       meta-skill `agent-maker` consults _when authoring new_ checker/fixer agents (baking
       the pattern into the new agent's body text at creation time), not a skill existing
       checker/fixer agents load at runtime via `permission.skill:`. So Phase 1's stated
       rationale ("~14 pairs inherit this automatically") does not hold for any of the 7
       agents checked — likely none of the ~14 do.
       **Flagging as a new finding for a follow-up plan item, not a Phase 1 blocker**, per
       this task's own pre-written exception clause.

**Acceptance Criteria**:

- [x] Both spot-checked agents confirmed to inherit the skill via reference, not
      duplication (or the exception is explicitly recorded if not) — **exception recorded**:
      neither inherits it; PR1's improvements remain reference material for future
      `agent-maker` use only until a follow-up item retrofits existing agents

---

## Phase 2: Cluster A — TDD & Accessibility Testing — ✅ Done (PR #232, #234, #236, #239, #241)

### Task 2.1 (PR2): `swe-ui-maker.md` — ✅ Done (PR #232)

1. [x] Recipe steps 1–2: branch `docs/swe-ui-maker-tdd-a11y`, fetch OSE source
2. [x] Adapted: mandated `jest-axe`'s `toHaveNoViolations()` in every component test,
       written before the component implementation (per Adaptation Convention Table:
       `vitest-axe`→`jest-axe`); kept only the TDD/a11y capability, not OSE's
       CVA/Radix/Storybook/`libs/web-ui` component-authoring structure, which doesn't apply
       to this repo's app-local `apps/kameravue-fe/src/components/ui/` setup (Round 4 PR4);
       reordered the Workflow section to TDD (test → implement → refactor); noted `jest-axe`
       needs adding as a devDependency (not yet present in `kameravue-fe`) — not installed
       in this PR, scope is the agent instruction file only
3. [x] Recipe steps 5–10: grep (zero `vitest-axe` matches — had to rephrase one explanatory
       parenthetical that named `vitest-axe` even though it wasn't leftover OSE content, to
       satisfy the literal zero-match requirement), lint (0 errors), commit
       (`docs(agents): add jest-axe tdd mandate to swe-ui-maker` — lowercased "TDD" in the
       subject, commitlint's `subject-case` rule requires all-lowercase), push, PR #232, CI
       green (7/7), merged, pulled

**Acceptance Criteria**:

- [x] `jest-axe` (not `vitest-axe`) referenced as a required assertion
- [x] TDD ordering (test written before implementation) stated explicitly

### Task 2.2 (PR3): `swe-ui-checker.md` — ✅ Done (PR #234)

1. [x] Recipe steps 1–2: branch `docs/swe-ui-checker-contrast-darkmode`, fetch OSE source
2. [x] Adapted: added color-contrast as its own HIGH-severity dimension (WCAG AA ratios —
       4.5:1 normal text, 3:1 large text/UI — plus color-only status indicators), distinct
       from the generic Accessibility row; added dark-mode as its own MEDIUM dimension.
       Verified `globals.css`'s actual structure first: `:root` tokens under `@theme
inline`, overridden inside a `@media (prefers-color-scheme: dark)` block — the
       dark-mode check description reflects this real structure, not a generic claim.
       Also updated Workflow step 2 to read `globals.css` alongside each component file,
       since both new dimensions need it
3. [x] Recipe steps 5–10: grep (zero OSE-specific matches), lint (0 errors), commit
       (`docs(agents): add color-contrast and dark-mode checks` — shortened from the
       originally planned subject to stay under commitlint's 72-char header limit), push,
       PR #234, CI green (7/7), merged, pulled

**Acceptance Criteria**:

- [x] Color-contrast is a distinct HIGH-severity dimension
- [x] Dark-mode is a distinct MEDIUM-severity dimension
- [x] Both reference the actual `globals.css` `@theme inline` token location

### Task 2.3 (PR4): `swe-e2e-dev.md` — ✅ Done (PR #236)

1. [x] Recipe steps 1–2: branch `docs/swe-e2e-dev-red-green-refactor`, fetch OSE source
2. [x] Adapted: workflow now requires the Playwright spec be written and confirmed failing
       (because the feature doesn't exist yet, not a config/selector problem) before the
       feature lands — explicit Red→Green→Refactor, replacing the prior implied
       tests-written-after-the-fact ordering. Dropped OSE's manual-verification-script
       variant (tied to a Manual Behavioral Verification convention this repo doesn't have)
       to keep the change scoped
3. [x] Recipe steps 5–10: grep (zero OSE matches), lint (0 errors), commit
       (`docs(agents): add red-green-refactor requirement to swe-e2e-dev` — lowercased per
       commitlint's `subject-case` rule), push, PR #236, CI green (7/7), merged, pulled

**Acceptance Criteria**:

- [x] Explicit Red→Green→Refactor step ordering stated in the workflow

### Task 2.4 (PR5): `swe-csharp-dev.md` — ✅ Done (PR #239)

1. [x] Recipe steps 1–2: branch `docs/swe-csharp-dev-tdd`, fetch OSE source. Fetch 404'd
       at the plan's recorded path (`.claude/agents/swe-csharp-dev.md`) — OSE's Phase 6
       subfolder refactor moved it to `.claude/agents/swe/swe-csharp-dev.md`; recovered via
       the repo tree listing rather than commit-history walk
2. [x] Adapted: added an explicit `## Workflow (Red→Green→Refactor)` section (Red — write
       the xUnit `[Fact]`/`[Theory]` and confirm it fails; Green — implement the minimum
       code to pass; Refactor — clean up while keeping the suite green; Commit), mirroring
       PR4's `swe-e2e-dev.md` pattern rather than OSE's now-trimmed pointer-only style
       (OSE's refactored source delegates TDD detail entirely to
       `swe-developing-applications-common` and no longer states it inline)
3. [x] Recipe steps 5–10: grep (zero OSE matches), lint (0 errors in changed file; 5
       pre-existing unrelated errors in `docs/linkedin/History/`), commit
       (`docs(agents): add tdd workflow requirement to swe-csharp-dev` — lowercased per
       commitlint's `subject-case` rule), push, PR #239, CI green (14/14), merged, pulled

**Acceptance Criteria**:

- [x] TDD is a required workflow step, not only a documented pattern

### Task 2.5 (PR6): `swe-developing-frontend-ui` (skill) — ✅ Done (PR #241)

1. [x] Recipe steps 1–2: branch `docs/frontend-ui-a11y-testing`, fetch OSE source
       (fetched cleanly at the plan's recorded path, no move)
2. [x] Adapted: renamed "Testing UI Components" to "Testing UI Components (TDD)",
       added `jest-axe`'s `toHaveNoViolations()` as a required assertion written before
       the component implementation (mirroring PR2's wording), and added the same
       requirement to the "Checklist for New Components" list. OSE's source uses
       `vitest-axe`; substituted with `jest-axe` per IKP-Labs's Jest + RTL stack
3. [x] Recipe steps 5–10: grep (zero OSE matches, including `vitest-axe`), lint (0 errors
       in changed file; 5 pre-existing unrelated errors in `docs/linkedin/History/`),
       commit (`docs(skills): add a11y testing requirement to swe-developing-frontend-ui`
       — shortened from the plan's suggested subject to satisfy commitlint's
       `header-max-length` (72 chars) rule), push, PR #241, CI green (14/14), merged,
       pulled

**Acceptance Criteria**:

- [x] `jest-axe` requirement present at the skill level, consistent with PR2

**Acceptance Criteria — Phase 2 (all 5 PRs)**:

- [x] All 5 files reference `jest-axe` (where applicable) and TDD ordering consistently —
      verified via grep: `swe-ui-maker.md` and the `swe-developing-frontend-ui` skill
      reference `jest-axe` (UI-authoring surfaces); `swe-e2e-dev.md` and
      `swe-csharp-dev.md` state Red→Green→Refactor TDD ordering (test-writing surfaces,
      not UI-authoring, so `jest-axe` doesn't apply there); `swe-ui-checker.md`'s scope is
      color-contrast/dark-mode review (PR3), not test authoring, so neither applies
- [x] No file in this phase references `vitest-axe` — confirmed via grep, zero matches

---

## Phase 3: Cluster B — Language Hardening

### Task 3.1 (PR7): `swe-programming-golang` (skill) — ✅ Done (PR #243)

1. [x] Recipe steps 1–2: branch `docs/golang-linting-security`, fetch OSE source. 404'd
       at the plan's recorded path — OSE removed Go support entirely (agent + skill) in
       commit `a36388a` ("repository rules and quality-gate optimization"), since OSE's
       own apps dropped Go in favor of Rust CLIs. Recovered from the last pre-deletion
       commit (`e807b75`), pulling rule detail from that commit's
       `reference/naming-and-modern-features.md` and
       `reference/error-handling-concurrency-testing-security.md`
2. [x] Adapted: added "Linting Discipline" section (`errors.Is`/`errors.As` over `==`, `%w`
       not `%v` for wrapped errors — errorlint-enforced, sealed-interface exhaustiveness
       via `gochecksumtype`, no mixing `iota` with literal consts, godoc comment
       requirements via godot + revive); added "Security Practices" section (parameterized
       queries, `context.WithTimeout`, input validation)
3. [x] Recipe steps 5–10: grep (zero OSE matches, including `ose-primer`/`ose-public`),
       lint (0 errors in changed file; 5 pre-existing unrelated errors in
       `docs/linkedin/History/`), commit
       (`docs(skills): add lint and security practices to swe-programming-golang` —
       shortened twice from the plan's suggested subject to satisfy commitlint's
       `header-max-length` (72 chars) rule), push, PR #243, CI green (14/14), merged,
       pulled

**Acceptance Criteria**:

- [x] Both new sections present with the specific rules listed above

### Task 3.2 (PR8): `swe-programming-rust` (skill) — ✅ Done (PR #245)

1. [x] Recipe steps 1–2: branch `docs/rust-unsafe-policy-audit`, fetch OSE source.
       Fetched cleanly at the plan's recorded path, no move; pulled the specific rule
       detail from the linked `reference/unsafe-policy-cargo-lints.md`, plus
       `cargo audit`/`cargo deny` command detail from OSE's
       `docs/.../rust/security-standards.md` and `build-configuration.md` (not in the
       skill file itself — those two commands weren't documented at the skill level
       upstream either, so this PR adds them net-new rather than adapting existing text)
2. [x] Adapted: added four new sections — Unsafe Code Policy (`#![forbid(unsafe_code)]`
       required in both `lib.rs` and `main.rs`, plus `[lints.rust]` manifest-level
       enforcement); Dependency Vulnerability Scanning (`cargo audit` for CVEs, `cargo
deny check` for license/source policy, with an example `deny.toml`); Clippy
       Pedantic Lints (`[lints.clippy]` in `Cargo.toml`, hard-deny on `unwrap_used`/
       `panic`/`undocumented_unsafe_blocks`); Formatting (`.rustfmt.toml`, using this
       file's existing `edition = "2021"` rather than OSE's `2024`, to match the file's
       existing `Cargo.toml` example)
3. [x] Recipe steps 5–10: grep (zero OSE matches, including `rhino-cli` — the example
       app OSE's `deny.toml` sample was sourced from), lint (0 errors in changed file; 5
       pre-existing unrelated errors in `docs/linkedin/History/`), commit
       (`docs(skills): add unsafe policy and dep scanning to swe-programming-rust` —
       shortened from the plan's suggested subject to satisfy commitlint's
       `header-max-length` (72 chars) rule), push, PR #245, CI green (14/14), merged,
       pulled

**Acceptance Criteria**:

- [x] All four sub-items present (unsafe policy, audit/deny, Clippy hard-denies, rustfmt)

### Task 3.3 (PR9): `swe-programming-fsharp` (skill) — ✅ Done (PR #247)

1. [x] Recipe steps 1–2: branch `docs/fsharp-fantomas-fscheck`, fetch OSE source.
       Fetched cleanly at the plan's recorded path, no move; pulled the Fantomas/FsCheck
       detail from the linked `reference/qs-records-async-testing.md`
2. [x] Adapted: added "Formatting with Fantomas (Mandatory)" (`dotnet fantomas . --check`
       wired into pre-commit) and "Property-Based Testing with FsCheck" (`FsCheck.Xunit`
       `[<Property>]` tests alongside, not replacing, the existing example-based
       `[<Fact>]`/`[<Theory>]` xUnit tests). OSE's source uses the Expecto testing
       framework and an Islamic-finance ("zakat calculation") domain example — dropped
       both; kept this skill's existing xUnit convention and generic
       `User`/`UserService` example instead, per the plan's adaptation note ("alongside
       existing example-based xUnit guidance")
3. [x] Recipe steps 5–10: grep (zero OSE matches, including `zakat`/`expecto`/`nisab`),
       lint (0 errors in changed file; 5 pre-existing unrelated errors in
       `docs/linkedin/History/`), commit
       (`docs(skills): add fantomas and fscheck to swe-programming-fsharp` — shortened
       from the plan's suggested subject to satisfy commitlint's `header-max-length`
       (72 chars) rule), push, PR #247, CI green (14/14), merged, pulled

**Acceptance Criteria**:

- [x] Fantomas pre-commit check and FsCheck guidance both present

### Task 3.4 (PR10): `swe-programming-csharp` (skill)

1. [ ] Recipe steps 1–2: branch `docs/csharp-problemdetails`, fetch OSE source
2. [ ] Adapt: replace the ad-hoc anonymous-JSON error-handling example with ASP.NET
       Core's standard `ProblemDetails` (RFC 7807) pattern
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(skills): replace error handling example with ProblemDetails in swe-programming-csharp`),
       push, PR, merge, pull

**Acceptance Criteria**:

- [ ] Error-handling example uses `ProblemDetails`, not the old anonymous-JSON shape

---

## Phase 4: Cluster C — Documentation Quality & Fact-Checking

### Task 4.1 (PR11): `docs-checker.md`

1. [ ] Recipe steps 1–2: branch `docs/docs-checker-factual-accuracy`, fetch OSE source
2. [ ] Adapt: add factual-accuracy verification via `WebFetch`/`WebSearch` (command
       syntax, feature existence, version claims, citations), with
       `[Verified]`/`[Unverified]`/`[Error]`/`[Outdated]` labeling, delegating mechanics
       to `docs-validating-factual-accuracy` (this phase's PR15)
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add factual-accuracy verification to docs-checker`), push,
       PR, merge, pull

**Acceptance Criteria**:

- [ ] Factual-accuracy check present with 4-state labeling
- [ ] References `docs-validating-factual-accuracy` for verification mechanics

### Task 4.2 (PR12): `readme-checker.md`

1. [ ] Recipe steps 1–2: branch `docs/readme-checker-content-quality`, fetch OSE source
2. [ ] Adapt: add Problem-Solution Hook opening check, jargon/buzzword scanning,
       scannability check, active-voice check
3. [ ] Note the edge case from requirements.md FR-4: this dimension must not force
       pitch-style prose onto structural index READMEs (e.g., `.claude/agents/README.md`)
       — scope the check to product/app-level READMEs, or explicitly exempt index files
4. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add content-quality dimensions to readme-checker`), push,
       PR, merge, pull

**Acceptance Criteria**:

- [ ] All four content-quality dimensions present
- [ ] Index-file exemption or scoping note present

### Task 4.3 (PR13): `readme-fixer.md`

1. [ ] Recipe steps 1–2: branch `docs/readme-fixer-content-quality`, fetch OSE source
2. [ ] Adapt: add fix recipes for the same four dimensions PR12 adds to `readme-checker`
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add content-quality fix recipes to readme-fixer`), push, PR,
       merge, pull

**Acceptance Criteria**:

- [ ] Fix recipes exist for all four dimensions added in PR12

### Task 4.4 (PR14): `readme-maker.md`

1. [ ] Recipe steps 1–2: branch `docs/readme-maker-content-quality`, fetch OSE source
2. [ ] Adapt: add the same four content-quality dimensions to the authoring checklist
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add content-quality dimensions to readme-maker`), push, PR,
       merge, pull

**Acceptance Criteria**:

- [ ] Authoring checklist includes all four dimensions

### Task 4.5 (PR15): `docs-validating-factual-accuracy` (skill)

1. [ ] Recipe steps 1–2: branch `docs/factual-accuracy-4-state`, fetch OSE source
2. [ ] Adapt: add the 4-state confidence classification with full web-verification
       workflow, source-tier prioritization, and a mandatory 6-month re-validation cadence
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(skills): add 4-state confidence classification to docs-validating-factual-accuracy`),
       push, PR, merge, pull

**Acceptance Criteria**:

- [ ] 4-state classification, source-tier prioritization, and 6-month cadence all present

### Task 4.6 (PR16): `docs-validating-links` (skill)

1. [ ] Recipe steps 1–2: branch `docs/link-validation-caching`, fetch OSE source
2. [ ] Adapt: add link-caching with per-status TTLs (OK: 7 days, broken: 1 day) and
       HEAD-before-GET instead of re-checking every link every run; add progressive
       writing guidance (write findings immediately so a long scan survives context
       compaction)
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(skills): add link caching and progressive writing to docs-validating-links`),
       push, PR, merge, pull

**Acceptance Criteria**:

- [ ] TTL caching and HEAD-before-GET both present
- [ ] Progressive-writing guidance present

### Task 4.7 (PR17): `readme-writing-readme-files` (skill)

1. [ ] Recipe steps 1–2: branch `docs/readme-writing-hook-guidance`, fetch OSE source
2. [ ] Adapt: add Problem-Solution Hook opening and benefits-first language guidance to
       the writing standards
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(skills): add Problem-Solution Hook guidance to readme-writing-readme-files`),
       push, PR, merge, pull

**Acceptance Criteria**:

- [ ] Hook-opening and benefits-first guidance both present

### Task 4.8 (PR18): `docs-applying-content-quality` (skill)

1. [ ] Recipe steps 1–2: branch `docs/content-quality-no-time-estimates`, fetch OSE source
2. [ ] Adapt: add a "No Time Estimates" rule — **record, do not fix**, that
       `docs-applying-diataxis-framework`'s templates currently violate this with literal
       "**Time**: 30 minutes" fields (note this as a follow-up finding in the skill's own
       body or a linked note, not a template edit in this PR); add explicit numeric WCAG
       AA contrast ratios (4.5:1 normal text, 3:1 large text)
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(skills): add No Time Estimates rule and WCAG ratios to docs-applying-content-quality`),
       push, PR, merge, pull

**Acceptance Criteria**:

- [ ] "No Time Estimates" rule present
- [ ] Self-contradiction with `docs-applying-diataxis-framework` templates is noted, not
      silently fixed
- [ ] Numeric WCAG AA ratios (4.5:1 / 3:1) present

### Task 4.9 (PR19): `docs-creating-accessible-diagrams` (skill)

1. [ ] Recipe steps 1–2: branch `docs/diagrams-wcag-palette`, fetch OSE source
2. [ ] Adapt: add a concrete WCAG-verified 8-color hex palette for diagrams with
       per-color contrast ratios and "never use red/green/yellow" guidance; add a Mermaid
       special-character escaping table and comment-syntax gotchas
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(skills): add WCAG color palette and Mermaid escaping to docs-creating-accessible-diagrams`),
       push, PR, merge, pull

**Acceptance Criteria**:

- [ ] 8-color hex palette with contrast ratios present
- [ ] Mermaid escaping table present

**Acceptance Criteria — Phase 4 (all 9 PRs)**:

- [ ] All 9 files updated; `docs-checker` and `docs-validating-factual-accuracy` use
      consistent 4-state labeling terminology

---

## Phase 5: Cluster D — Plan Lifecycle

### Task 5.1 (PR20): `plan-maker.md`

1. [ ] Recipe steps 1–2: branch `docs/plan-maker-grill-me`, fetch OSE source
2. [ ] Adapt: wire in the existing `grill-me` skill — mandate a structured grill-me
       interview (2–4 concrete options per question) both before and after plan writing
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): wire grill-me interview into plan-maker`), push, PR, merge,
       pull

**Acceptance Criteria**:

- [ ] `grill-me` invoked both before and after plan writing, with 2–4-option question
      framing

### Task 5.2 (PR21): `plan-checker.md`

1. [ ] Recipe steps 1–2: branch `docs/plan-checker-pr-gate-factcheck`, fetch OSE source
2. [ ] Adapt: gate PR-bound plans on completion of the PR-Review Maker→Fixer cycle
       (link `governance/workflows/pr/pr-review-quality-gate.md`, adopted Round 4); add a
       factual-accuracy pass using `docs-validating-factual-accuracy`; add a persistent
       false-positives skip list (same shape as PR1)
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add PR-review gate and factual-accuracy pass to plan-checker`),
       push, PR, merge, pull

**Acceptance Criteria**:

- [ ] PR-Review cycle gate present and links to the correct governance doc
- [ ] Factual-accuracy pass present, referencing `docs-validating-factual-accuracy`
- [ ] Persistent skip list present

### Task 5.3 (PR22): `plan-execution-checker.md`

1. [ ] Recipe steps 1–2: branch `docs/plan-execution-checker-archival`, fetch OSE source
2. [ ] Adapt: add archival-mechanics verification (folder actually `git mv`'d to `done/`,
       index files updated, no orphaned references, archival commit exists)
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add archival-mechanics verification to plan-execution-checker`),
       push, PR, merge, pull

**Acceptance Criteria**:

- [ ] All four archival-mechanics checks present

### Task 5.4 (PR23): `plan-fixer.md`

1. [ ] Recipe steps 1–2: branch `docs/plan-fixer-governance-gate-rule`, fetch OSE source
2. [ ] Adapt: add a front-loaded hard rule that merge/PR steps are governance gates no fix
       recipe may ever touch; add false-positive persistence to the shared skip list
       `plan-checker` reads (PR21)
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add governance-gate hard rule to plan-fixer`), push, PR,
       merge, pull

**Acceptance Criteria**:

- [ ] Hard rule appears near the top of the file (front-loaded, not buried)
- [ ] False-positive persistence shares the skip-list shape from PR21

### Task 5.5 (PR24): `plan-creating-project-plans` (skill)

1. [ ] Recipe steps 1–2: branch `docs/plan-skill-grilling-archival`, fetch OSE source
2. [ ] Adapt: add mandatory grilling (via `grill-me`) at both start and end of plan
       writing; add a pre-write anti-hallucination verification step so plans can't cite
       nonexistent files/APIs; add a final "Knowledge Capture" + "Plan Archival" phase
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(skills): add grilling and anti-hallucination checks to plan-creating-project-plans`),
       push, PR, merge, pull

**Acceptance Criteria**:

- [ ] Grilling, anti-hallucination check, and Knowledge Capture/Archival phase all present

### Task 5.6 (PR25): `plan-writing-gherkin-criteria` (skill)

> **Sequential — must merge after PR24.**

1. [ ] Confirm PR24 is merged to `main` and pulled locally before starting
2. [ ] Recipe steps 1–2: branch `docs/gherkin-phase-gate-checks`, fetch OSE source
3. [ ] Adapt: add "Phase Gate Acceptance Checks" — applying Gherkin-style testability to
       phase-gate checklist items, not just scenarios, referencing the phase-gate concept
       PR24 just added to `plan-creating-project-plans`
4. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(skills): add phase-gate acceptance checks to plan-writing-gherkin-criteria`),
       push, PR, merge, pull

**Acceptance Criteria**:

- [ ] Phase Gate Acceptance Checks section present and cross-references
      `plan-creating-project-plans`' phase-gate concept

**Acceptance Criteria — Phase 5 (all 6 PRs)**:

- [ ] PR25 merged strictly after PR24
- [ ] `plan-checker` and `plan-fixer` share the same skip-list shape

---

## Phase 6: Cluster E — CI / Nx Validation

### Task 6.1 (PR26): `ci-checker.md`

1. [ ] Recipe steps 1–2: branch `docs/ci-checker-nx-conformance`, fetch OSE source
2. [ ] Adapt: add Nx-specific conformance checks — mandatory `project.json` targets,
       coverage-threshold values (verify this repo's actual thresholds — FE ≥70%, BE ≥80%
       — against `swe-code-checker.md`'s existing description before writing them), a
       4-dimension tag scheme, a `specs:coverage` target
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add Nx conformance checks to ci-checker`), push, PR, merge,
       pull

**Acceptance Criteria**:

- [ ] All four Nx-conformance checks present with correct, verified threshold values

### Task 6.2 (PR27): `ci-fixer.md`

> **Sequential — must merge after PR26.**

1. [ ] Confirm PR26 is merged to `main` and pulled locally before starting
2. [ ] Recipe steps 1–2: branch `docs/ci-fixer-nx-conformance`, fetch OSE source
3. [ ] Adapt: add matching fixer capability for whatever `ci-checker` now flags
       (`project.json` target gaps, coverage-threshold misconfiguration, tag-scheme
       gaps, missing `specs:coverage` target)
4. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add Nx fix recipes to ci-fixer`), push, PR, merge, pull

**Acceptance Criteria**:

- [ ] A fix recipe exists for every finding category PR26 introduced

---

## Phase 7: Cluster F — PDF Pipeline

### Task 7.1 (PR28): `pdf-to-md-checker.md`

1. [ ] Recipe steps 1–2: branch `docs/pdf-checker-nesting-accuracy`, fetch OSE source
2. [ ] Adapt: add content-nesting-accuracy validation (list/indentation depth vs. PDF
       layout)
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add content-nesting validation to pdf-to-md-checker`), push,
       PR, merge, pull

**Acceptance Criteria**:

- [ ] Nesting-accuracy validation present

### Task 7.2 (PR29): `pdf-to-md-fixer.md`

1. [ ] Recipe steps 1–2: branch `docs/pdf-fixer-confidence-downgrade`, fetch OSE source
2. [ ] Adapt: add a confidence-downgrade safety rule (skip even HIGH_CONFIDENCE fixes
       touching >10 occurrences, editing outside the finding's region, or colliding with
       another pending finding); add false-positive skip-list persistence
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add confidence-downgrade safety rule to pdf-to-md-fixer`),
       push, PR, merge, pull

**Acceptance Criteria**:

- [ ] All three safety-rule conditions present (>10 occurrences, out-of-region,
      colliding findings)
- [ ] Skip-list persistence present

### Task 7.3 (PR30): `pdf-to-md-maker.md`

1. [ ] Recipe steps 1–2: branch `docs/pdf-maker-chunking-mermaid`, fetch OSE source
2. [ ] Adapt: add PDF chunking (50-page segments) to avoid single-pass overflow on large
       PDFs; convert figure placeholders into typed Mermaid diagram stubs (inferred from
       captions) instead of plain `[FIGURE N: ...]` text
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add PDF chunking and Mermaid figure stubs to pdf-to-md-maker`),
       push, PR, merge, pull

**Acceptance Criteria**:

- [ ] 50-page chunking threshold present
- [ ] Figure placeholders replaced with typed Mermaid stub guidance

**Acceptance Criteria — Phase 7 (all 3 PRs)**:

- [ ] `pdf-to-md-checker`'s new nesting check and `pdf-to-md-fixer`'s safety rule are
      consistent in what they consider a "finding region"

---

## Phase 8: Cluster G — Repo & Process Governance

### Task 8.1 (PR31): `repo-setup-manager.md`

1. [ ] Recipe steps 1–2: branch `docs/repo-setup-manager-phase-0`, fetch OSE source
2. [ ] Adapt: broaden scope from "bootstrap a fresh clone" to "Phase 0 of every plan" —
       install deps, converge toolchain, run baseline tests, and resolve every in-scope
       preexisting test failure before plan work begins; keep OSE's "document
       out-of-scope failures rather than fixing them" boundary so scope stays bounded
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): broaden repo-setup-manager to plan Phase 0`), push, PR,
       merge, pull

**Acceptance Criteria**:

- [ ] Scope statement covers Phase-0-of-every-plan, not only fresh-clone bootstrap
- [ ] "Document, don't fix, out-of-scope failures" boundary preserved

### Task 8.2 (PR32): `repo-practicing-trunk-based-development` (skill)

1. [ ] Recipe steps 1–2: branch `docs/worktree-to-pr-delivery-mode`, fetch OSE source
2. [ ] Adapt: formalize a "worktree-to-PR" default delivery mode (disposable worktree →
       plan-scoped branch → draft PR, with `[AI]`/`[HUMAN]` step tagging), referencing the
       existing `.claude/hooks/worktree-create.sh` hook
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(skills): formalize worktree-to-PR delivery mode`), push, PR, merge,
       pull

**Acceptance Criteria**:

- [ ] Worktree-to-PR mode documented with `[AI]`/`[HUMAN]` tagging and a reference to
      `worktree-create.sh`

### Task 8.3 (PR33): `agent-developing-agents` (skill)

1. [ ] Recipe steps 1–2: branch `docs/agent-authoring-tools-usage`, fetch OSE source
2. [ ] Adapt: add "Tools Usage" (list each tool + why) and "When to Use This Agent" (use
       when / do NOT use for) sections; expand model-selection guidance into a fuller
       decision matrix with cost trade-offs and common mistakes
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(skills): add tools-usage and when-to-use sections to agent-developing-agents`),
       push, PR, merge, pull

**Acceptance Criteria**:

- [ ] Both new sections present
- [ ] Expanded model-selection decision matrix present

### Task 8.4 (PR34): `docs-file-manager.md`

1. [ ] Recipe steps 1–2: branch `docs/docs-file-manager-git-status-precheck`, fetch OSE
       source
2. [ ] Adapt: add a `git status` pre-check before batch rename/move operations (warn the
       user first if uncommitted changes exist); add explicit handling for recently
       -created uncommitted files (a rename can't preserve git history that was never
       committed)
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add git status pre-check to docs-file-manager`), push, PR,
       merge, pull

**Acceptance Criteria**:

- [ ] `git status` pre-check present with an explicit user-warning step
- [ ] Uncommitted-file handling documented separately from the general pre-check

### Task 8.5 (PR35): `docs-link-checker.md`

1. [ ] Recipe steps 1–2: branch `docs/docs-link-checker-cache`, fetch OSE source
2. [ ] Adapt: add a persistent external-link cache (e.g.,
       `docs/metadata/external-links-status.yaml`, 6-month expiry, orphan pruning) so
       repeat runs skip already-verified URLs instead of re-checking everything every run
3. [ ] Recipe steps 5–10: grep, lint,
       commit (`docs(agents): add persistent link cache to docs-link-checker`), push, PR,
       merge, pull

**Acceptance Criteria**:

- [ ] Cache file path, 6-month expiry, and orphan pruning all specified

**Acceptance Criteria — Phase 8 (all 5 PRs)**:

- [ ] All 5 files updated with no cross-file inconsistency introduced

---

## Phase 9: P3 Minor Items (Bundled — 3 PRs, not 8)

> Per requirements.md FR-9: these findings are individually too small for separate PRs.
> Bundled by natural affinity: checker/fixer pairing (PR36), shared `repo-` skill prefix
> (PR37), and remaining standalone items (PR38).

### Task 9.1 (PR36): `repo-harness-compatibility-checker.md` + `repo-harness-compatibility-fixer.md`

1. [ ] `git checkout -b docs/harness-compat-live-verification`
2. [ ] Fetch OSE source for both files (two separate `gh api` calls, same PR)
3. [ ] Adapt `repo-harness-compatibility-checker.md`: add periodic web-verification that
       harness conventions (frontmatter schema, hook trigger keys) still match live
       upstream Claude Code docs, not just internal consistency
4. [ ] Adapt `repo-harness-compatibility-fixer.md`: add grep-based post-edit verification
       that a fix actually applied (same pattern as Phase 1's PR1) — applied locally in
       this file's own body, since Phase 1's confirmation (requirements.md Phase 9
       decision record) established this fixer does not reference
       `repo-applying-maker-checker-fixer` and would not inherit PR1 automatically
5. [ ] Grep both files for OSE-specific strings — zero matches
6. [ ] Run `npm run lint:md`
7. [ ] **COMMIT**: `docs(agents): add live harness verification to repo-harness-compatibility pair`
8. [ ] Push, PR, CI, `gh pr merge --squash --auto`
9. [ ] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [ ] Checker has live-verification capability against upstream Claude Code docs
- [ ] Fixer has local grep-based post-edit verification (not inherited from PR1)

### Task 9.2 (PR37): `repo-generating-validation-reports` + `repo-assessing-criticality-confidence` + `repo-understanding-repository-architecture` (skills)

1. [ ] `git checkout -b docs/repo-skills-tracking-examples-clarification`
2. [ ] Fetch OSE source for all three skills
3. [ ] Adapt `repo-generating-validation-reports`: add UUID-chain + scope-based execution
       tracking for collision-free parallel report generation
4. [ ] Adapt `repo-assessing-criticality-confidence`: add guidance for embedding
       domain-specific HIGH/MEDIUM/FALSE_POSITIVE examples directly in fixer-agent files
5. [ ] Adapt `repo-understanding-repository-architecture`: add a "skills are delivery
       infrastructure, not a governance layer" clarification to sharpen the existing
       6-layer governance model description
6. [ ] Grep all three files for OSE-specific strings — zero matches
7. [ ] Run `npm run lint:md`
8. [ ] **COMMIT**: `docs(skills): add execution tracking and domain examples to repo governance skills`
9. [ ] Push, PR, CI, `gh pr merge --squash --auto`
10. [ ] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [ ] All three skills carry their respective new guidance

### Task 9.3 (PR38): `social-linkedin-post-maker.md` + `grill-me` (skill) + `ci-standards` (skill), plus the `repo-defining-workflows` DEFER record

1. [ ] `git checkout -b docs/misc-p3-items-and-defer-record`
2. [ ] Fetch OSE source for all three files
3. [ ] Adapt `social-linkedin-post-maker.md`: enforce LinkedIn's 3,000-character post-body
       limit with an explicit measure-and-trim step before finishing a draft
4. [ ] Adapt `grill-me`: add a standing type-your-own/blank-state answer option and a
       "let's discuss before deciding" option on every question, plus more nuanced
       batching rules
5. [ ] Adapt `ci-standards`: explicitly name a "Gherkin Consumption Mandate" — unit tests
       must be a superset of Gherkin scenarios, not just inspired by them
6. [ ] Add a DEFER row for `repo-defining-workflows` to
       `.claude/skills/repo-syncing-with-ose-primer/SKILL.md` — a new "Deferred — Needs
       Product Decision" table, distinct from the existing permanent-skip table, recording
       the topic-mismatch reason from requirements.md's Per-Item Decision Record verbatim
7. [ ] Grep the three adapted files for OSE-specific strings — zero matches
8. [ ] Run `npm run lint:md`
9. [ ] **COMMIT**: `docs(agents): add character limit and interview options to misc agents`
10. [ ] Push, PR, CI, `gh pr merge --squash --auto`
11. [ ] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [ ] Character limit, blank-state/discuss-first options, and Gherkin Consumption Mandate
      all present in their respective files
- [ ] `repo-syncing-with-ose-primer/SKILL.md` has a new DEFER row for
      `repo-defining-workflows` under a "Deferred" table, not the permanent-skip table

**Acceptance Criteria — Phase 9 (all 3 PRs)**:

- [ ] 8 items adopted across 3 PRs (not 8 PRs)
- [ ] 1 item (`repo-defining-workflows`) recorded as DEFER, zero content adapted for it

---

## Phase 10 (PR39): Sync Record Finalization

> **Must run last — confirm PR1 through PR38 are all merged before starting.**

### Task 10.1: Verify pre-conditions and count actual state

1. [ ] Run a `gh pr view` sweep (or `gh pr list --state merged`) confirming all 38 prior
       PRs are merged
2. [ ] Run `ls .claude/agents/*.md | grep -v README.md | wc -l` — confirm the Agents count
       (expected: unchanged from pre-Round-5, since this round edits existing agent files,
       creates none)
3. [ ] Run `ls -d .claude/skills/*/ | wc -l` — confirm the Skills count (expected:
       unchanged, since this round edits existing skill files, creates none)
4. [ ] Run `ls .claude/hooks/ | wc -l` — confirm the Hooks count (expected: unchanged, no
       hook is touched this round)

### Task 10.2: Update SKILL.md and ideas.md, ship

1. [ ] `git checkout -b docs/finalize-round-5-sync-record`
2. [ ] Update the "Harness Inventory Reference" table in
       `.claude/skills/repo-syncing-with-ose-primer/SKILL.md` — Agents/Skills/Hooks rows'
       "Last synced" columns updated to reflect Round 5 verified the content of 44 files,
       even though the counts themselves are unchanged from Round 4
3. [ ] Update the `**Last Updated**:` footer in that SKILL.md
4. [ ] Add the Round 5 bullet to `plans/ideas.md` under `### ✅ Implemented`, above the
       Round 4 entry, styled identically: phase-by-phase summary, the one DEFER item
       (`repo-defining-workflows`) called out explicitly, real PR range
5. [ ] Update `plans/ideas.md`'s trailing `**Last Updated**:` footer line
6. [ ] Run `npm run lint:md`
7. [ ] **COMMIT**: `docs(plan): finalize claude-governance-gap-round-5 sync record`
8. [ ] Push, PR, CI, `gh pr merge --squash --auto`
9. [ ] `git checkout main && git pull origin main`

**Acceptance Criteria**:

- [ ] SKILL.md counts and "Last synced" dates match actual verified repo state
- [ ] `plans/ideas.md` has the Round 5 entry with real PR numbers, not placeholders, and
      explicitly notes the DEFER item

### Task 10.3: Archive this plan

1. [ ] Verify every checklist item in this file is checked
2. [ ] Update this plan's README.md status to `✅ Completed`, add `**Completed**: <date>`
3. [ ] `git mv plans/in-progress/2026-08-05__claude-governance-gap-round-5/ plans/done/2026-08-05__claude-governance-gap-round-5/`
4. [ ] **COMMIT**: `docs(plan): move claude-governance-gap-round-5 to done`
5. [ ] Push and merge per the same branch → PR → CI → merge cycle

---

## Commit Summary

39 PRs total, one per file grouping specified in requirements.md's Scope Definition. See
technical-design.md's Commit Strategy table for the exact subject line of every PR listed
above (Phase 1 → PR1 through Phase 10 → PR39).

---

## Progress Tracking

| Phase                                   | PRs       | Status          |
| --------------------------------------- | --------- | --------------- |
| 1 — MCF convergence safeguards          | PR1       | [ ] Not started |
| 2 — Cluster A (TDD & accessibility)     | PR2–PR6   | [ ] Not started |
| 3 — Cluster B (language hardening)      | PR7–PR10  | [ ] Not started |
| 4 — Cluster C (docs quality/fact-check) | PR11–PR19 | [ ] Not started |
| 5 — Cluster D (plan lifecycle)          | PR20–PR25 | [ ] Not started |
| 6 — Cluster E (CI / Nx validation)      | PR26–PR27 | [ ] Not started |
| 7 — Cluster F (PDF pipeline)            | PR28–PR30 | [ ] Not started |
| 8 — Cluster G (repo/process governance) | PR31–PR35 | [ ] Not started |
| 9 — P3 minor items (bundled)            | PR36–PR38 | [ ] Not started |
| 10 — Sync record finalization           | PR39      | [ ] Not started |

**Last Updated**: 2026-08-05
