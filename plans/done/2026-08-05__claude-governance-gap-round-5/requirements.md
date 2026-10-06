# Requirements

## Scope Definition

### In-Scope

**Phase 1 — Maker-Checker-Fixer convergence safeguards (1 file, 1 PR):**

- `.claude/skills/repo-applying-maker-checker-fixer/SKILL.md`

**Phase 2 — Cluster A: TDD & accessibility testing (5 files, 5 PRs):**

- `swe-ui-maker.md`, `swe-ui-checker.md`, `swe-e2e-dev.md`, `swe-csharp-dev.md`,
  `swe-developing-frontend-ui` (skill)

**Phase 3 — Cluster B: Language hardening (4 skills, 4 PRs):**

- `swe-programming-golang`, `swe-programming-rust`, `swe-programming-fsharp`,
  `swe-programming-csharp`

**Phase 4 — Cluster C: Documentation quality & fact-checking (9 files, 9 PRs):**

- `docs-checker.md`, `readme-checker.md`, `readme-fixer.md`, `readme-maker.md`,
  `docs-validating-factual-accuracy` (skill), `docs-validating-links` (skill),
  `readme-writing-readme-files` (skill), `docs-applying-content-quality` (skill),
  `docs-creating-accessible-diagrams` (skill)

**Phase 5 — Cluster D: Plan lifecycle (6 files, 6 PRs):**

- `plan-maker.md`, `plan-checker.md`, `plan-execution-checker.md`, `plan-fixer.md`,
  `plan-creating-project-plans` (skill), `plan-writing-gherkin-criteria` (skill)

**Phase 6 — Cluster E: CI / Nx validation (2 files, 2 PRs, sequential pair):**

- `ci-checker.md`, `ci-fixer.md`

**Phase 7 — Cluster F: PDF pipeline (3 files, 3 PRs):**

- `pdf-to-md-checker.md`, `pdf-to-md-fixer.md`, `pdf-to-md-maker.md`

**Phase 8 — Cluster G: Repo & process governance (5 files, 5 PRs):**

- `repo-setup-manager.md`, `repo-practicing-trunk-based-development` (skill),
  `agent-developing-agents` (skill), `docs-file-manager.md`, `docs-link-checker.md`

**Phase 9 — P3 minor items (9 files, bundled into 3 PRs + 1 recorded DEFER):**

- `social-linkedin-post-maker.md`, `grill-me` (skill), `ci-standards` (skill),
  `repo-harness-compatibility-checker.md`, `repo-harness-compatibility-fixer.md`,
  `repo-generating-validation-reports` (skill), `repo-assessing-criticality-confidence`
  (skill), `repo-understanding-repository-architecture` (skill) — 8 ADOPT items bundled
  into PR36–PR38
- `repo-defining-workflows` (skill) — DEFER, no PR

**Phase 10 — Sync record finalization (2 files, 1 PR, runs last):**

- `.claude/skills/repo-syncing-with-ose-primer/SKILL.md` inventory + last-synced update
- `plans/ideas.md` Round 5 archive entry

### Non-Scope

- The already-fixed `plan-maker.md` stale "Registration Form Template" content bug
  (PR #228) — merged before this plan started, not re-touched here
- Creating any new agent or skill file — every item in this round edits a file that
  already exists in both IKP-Labs and OSE
- Editing or refactoring any agent/skill created or content-synced in Rounds 1–4 beyond
  the 44 files explicitly listed above
- Application code changes (`apps/kameravue-fe`, `apps/kameravue-be`, `apps/taskly-be`, or
  their E2E suites)
- Fixing `docs-applying-diataxis-framework`'s templates to remove their literal
  "**Time**: 30 minutes" fields, even though Phase 4's `docs-applying-content-quality` PR
  (PR18) will surface this as a self-contradiction once that skill gains a "No Time
  Estimates" rule — noted as a follow-up finding in this plan's decision record (see
  Cluster C below), not fixed in the same PR
- Resolving the `repo-defining-workflows` topic mismatch — recorded as DEFER, requires a
  human product decision on whether IKP-Labs wants a "define a checker→fixer→checker chain
  as a document" capability before any adaptation is attempted
- Any item already permanently skipped per the existing "What IKP-Labs Intentionally Does
  NOT Adopt" table in `repo-syncing-with-ose-primer/SKILL.md`
- Modifying `plans/README.md` — same exclusion Round 4 applied to its own housekeeping
  phase
- Pre-writing the final adapted prose for any of the 44 files in this planning step —
  that is the checklist's job during Phase 1–9 execution, not this plan. This plan
  specifies what to fetch (OSE path) and what capability to add per file, not the final
  content

---

## Per-Item Decision Record

Recorded per `repo-syncing-with-ose-primer/SKILL.md` Step 4 format
(OSE source / Decision / Reason / Adaptation notes). All OSE source paths were confirmed
to exist as files that IKP-Labs already has a same-named counterpart for — this round is a
content diff, not a presence diff, so "Decision: ADOPT" here means "adopt OSE's additional
content into our existing file," never "create a new file."

### Phase 1

| Item                                | OSE source                                                  | Decision | Reason                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Adaptation notes                                                                                                                                                                                                                                                                                                                                            |
| ----------------------------------- | ----------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `repo-applying-maker-checker-fixer` | `.claude/skills/repo-applying-maker-checker-fixer/SKILL.md` | ADOPT    | IKP-Labs's version of this skill has no convergence safeguards — no false-positive skip list, no scoped re-validation, no post-edit self-verification, no escalation path, no fixer severity mode. All ~14 existing checker/fixer pairs (`repo-rules-checker/-fixer`, `specs-checker/-fixer`, `docs-checker/-fixer`, `readme-checker/-fixer`, `plan-checker/-fixer`, `repo-harness-compatibility-checker/-fixer`, `swe-code-checker`, `pdf-to-md-fixer`) already reference this skill, so fixing it once benefits all of them without touching their files | Strip OSE branding/paths per the standard adaptation table (technical-design.md); keep the five sub-capabilities (skip list, scoped re-validation, post-edit self-verification via `grep`, 2+ round escalation, fixer mode parameter lax/normal/strict/ocd) generic enough to apply across IKP-Labs's Java/TypeScript/Go stack, not tied to any one checker |

### Phase 2 — Cluster A: TDD & accessibility testing

| Item                         | OSE source                                           | Decision | Reason                                                                                                                                                                         | Adaptation notes                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------- | ---------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `swe-ui-maker`               | `.claude/agents/swe-ui-maker.md`                     | ADOPT    | Currently only a manual ARIA checklist item; OSE mandates automated a11y assertions written failing first (TDD order)                                                          | `vitest-axe`'s `toHaveNoViolations()` → IKP-Labs equivalent `jest-axe` (IKP-Labs uses Jest, confirmed via existing `swe-typescript-dev.md` test-stack references), since `kameravue-fe` uses Jest + React Testing Library, not Vitest                                                                                                                                                            |
| `swe-ui-checker`             | `.claude/agents/swe-ui-checker.md`                   | ADOPT    | Color-contrast and dark-mode are currently folded into a generic ARIA check, losing severity precision                                                                         | Add color-contrast as its own HIGH-severity dimension (WCAG AA ratios, color-only status indicators) distinct from generic ARIA; add dark-mode as MEDIUM (every token needs a dark variant) — verify against `kameravue-fe`'s actual Tailwind 4 CSS-first `@theme inline` token setup (confirmed in Round 4 PR4 to live in `apps/kameravue-fe/src/app/globals.css`, no `tailwind.config.*` file) |
| `swe-e2e-dev`                | `.claude/agents/swe-e2e-dev.md`                      | ADOPT    | Current step order implies Playwright specs are written to match an already-built feature; OSE requires explicit Red→Green→Refactor                                            | Require the Playwright spec be written and confirmed failing before the feature lands; no IKP-Labs-specific path changes needed beyond confirming references point at `apps/kameravue-fe-e2e/` and `apps/kameravue-be-e2e/`                                                                                                                                                                      |
| `swe-csharp-dev`             | `.claude/agents/swe-csharp-dev.md`                   | ADOPT    | TDD is only documented as a testing pattern, not a required workflow step, for this generic (not KameraVue-tied) agent                                                         | Mandate failing-test → confirm-red → implement → refactor as a required workflow step; this agent is explicitly "Generic — not tied to KameraVue stack" per its own description, so no IKP-Labs app-path adaptation is needed, only workflow-step wording                                                                                                                                        |
| `swe-developing-frontend-ui` | `.claude/skills/swe-developing-frontend-ui/SKILL.md` | ADOPT    | Skill-level counterpart to the `swe-ui-maker` gap — the automated a11y-testing requirement needs to live at the skill level too, since `swe-ui-maker.md` references this skill | Same `jest-axe` substitution as `swe-ui-maker`                                                                                                                                                                                                                                                                                                                                                   |

### Phase 3 — Cluster B: Language hardening

| Item                     | OSE source                                       | Decision | Reason                                                                                            | Adaptation notes                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------ | ------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `swe-programming-golang` | `.claude/skills/swe-programming-golang/SKILL.md` | ADOPT    | No Linting Discipline or Security Practices section exists today                                  | Add Linting Discipline (`errors.Is`/`errors.As` over `==`, `%w` not `%v` for wrapped errors — errorlint-enforced, sealed-interface exhaustiveness, no mixing `iota` with literal consts, godoc comment requirements) and Security Practices (parameterized queries, `context.WithTimeout`, input validation). This skill is generic (used by `swe-golang-dev`, not tied to a specific IKP-Labs app), so content is largely portable as-is |
| `swe-programming-rust`   | `.claude/skills/swe-programming-rust/SKILL.md`   | ADOPT    | No Unsafe Code Policy, dependency-vulnerability scanning, or enforced pedantic lints exist today  | Add Unsafe Code Policy (`#![forbid(unsafe_code)]` in application code + `[lints.rust]` in `Cargo.toml`), `cargo audit`/`cargo deny` for dependency scanning, Clippy pedantic lints with hard-deny on `unwrap_used`/`panic`/`undocumented_unsafe_blocks`, an enforced `.rustfmt.toml`. Generic skill, portable as-is                                                                                                                       |
| `swe-programming-fsharp` | `.claude/skills/swe-programming-fsharp/SKILL.md` | ADOPT    | No formatting enforcement or property-based testing guidance exists today                         | Add Fantomas formatting enforcement (`dotnet fantomas . --check` in pre-commit) and FsCheck property-based testing alongside existing example-based xUnit guidance. Generic skill, portable as-is                                                                                                                                                                                                                                         |
| `swe-programming-csharp` | `.claude/skills/swe-programming-csharp/SKILL.md` | ADOPT    | Current error-handling example uses an ad-hoc anonymous-JSON shape, not the current .NET 8+ idiom | Replace with ASP.NET Core's standard `ProblemDetails` (RFC 7807) pattern. Generic skill, portable as-is                                                                                                                                                                                                                                                                                                                                   |

### Phase 4 — Cluster C: Documentation quality & fact-checking

| Item                                | OSE source                                                  | Decision | Reason                                                                                                                              | Adaptation notes                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------- | ----------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs-checker`                      | `.claude/agents/docs-checker.md`                            | ADOPT    | Only checks completeness/coverage/Diátaxis placement/links, never whether documented claims are true                                | Add factual-accuracy verification via `WebFetch`/`WebSearch` (command syntax, feature existence, version claims, citations) with `[Verified]`/`[Unverified]`/`[Error]`/`[Outdated]` labeling, delegating the verification mechanics to the `docs-validating-factual-accuracy` skill (PR15, same phase)                                                                                                                                   |
| `readme-checker`                    | `.claude/agents/readme-checker.md`                          | ADOPT    | Currently structure-only (sections/versions/staleness/placeholders), never content quality                                          | Add Problem-Solution Hook opening check, jargon/buzzword scanning, scannability, active-voice checks                                                                                                                                                                                                                                                                                                                                     |
| `readme-fixer`                      | `.claude/agents/readme-fixer.md`                            | ADOPT    | Fixer counterpart to `readme-checker` — needs matching fix recipes for the new content-quality findings                             | Add fix recipes for the same four dimensions (hook opening, jargon, scannability, active voice); sequence after `readme-checker` (PR12) so the finding categories exist first                                                                                                                                                                                                                                                            |
| `readme-maker`                      | `.claude/agents/readme-maker.md`                            | ADOPT    | Maker counterpart — should write README content that satisfies the new quality bar from the start, not just structural completeness | Add the same four content-quality dimensions to the authoring checklist                                                                                                                                                                                                                                                                                                                                                                  |
| `docs-validating-factual-accuracy`  | `.claude/skills/docs-validating-factual-accuracy/SKILL.md`  | ADOPT    | Currently only checks claims against local repo files, no web-verification workflow                                                 | Add the 4-state confidence classification (`[Verified]`/`[Unverified]`/`[Error]`/`[Outdated]`) with full web-verification workflow, source-tier prioritization, and a mandatory 6-month re-validation cadence                                                                                                                                                                                                                            |
| `docs-validating-links`             | `.claude/skills/docs-validating-links/SKILL.md`             | ADOPT    | Re-checks every link every run with no caching, and has no progressive-writing guidance for long scans                              | Add link-caching with per-status TTLs (OK: 7 days, broken: 1 day) and HEAD-before-GET instead of full GET every run; add progressive-writing guidance (write findings immediately so a long scan survives context compaction)                                                                                                                                                                                                            |
| `readme-writing-readme-files`       | `.claude/skills/readme-writing-readme-files/SKILL.md`       | ADOPT    | Writing standards skill has no engagement guidance                                                                                  | Add Problem-Solution Hook opening and benefits-first language guidance to the writing standards, consistent with the `readme-checker`/`readme-fixer`/`readme-maker` additions in this same phase                                                                                                                                                                                                                                         |
| `docs-applying-content-quality`     | `.claude/skills/docs-applying-content-quality/SKILL.md`     | ADOPT    | No "No Time Estimates" rule exists, and WCAG contrast guidance is qualitative, not numeric                                          | Add a "No Time Estimates" rule — **note (do not fix in this PR)**: IKP-Labs's own `docs-applying-diataxis-framework` templates currently violate this with literal "**Time**: 30 minutes" fields; this PR should record that self-contradiction as a follow-up finding for a later fix, not resolve it inline, per this plan's explicit non-scope. Also add explicit numeric WCAG AA contrast ratios (4.5:1 normal text, 3:1 large text) |
| `docs-creating-accessible-diagrams` | `.claude/skills/docs-creating-accessible-diagrams/SKILL.md` | ADOPT    | No concrete color palette or Mermaid escaping guidance exists today                                                                 | Add a concrete WCAG-verified 8-color hex palette for diagrams with per-color contrast ratios and "never use red/green/yellow" guidance; add a Mermaid special-character escaping table and comment-syntax gotchas                                                                                                                                                                                                                        |

### Phase 5 — Cluster D: Plan lifecycle

| Item                            | OSE source                                              | Decision | Reason                                                                                                                                                                                                                                                                                                                             | Adaptation notes                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------- | ------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `plan-maker`                    | `.claude/agents/plan-maker.md`                          | ADOPT    | The `grill-me` skill already shipped (Round 3) but `plan-maker` never invokes it                                                                                                                                                                                                                                                   | Wire in `grill-me`: mandate a structured grill-me interview (2–4 concrete options per question) both before and after plan writing                                                                                                                                                                                                                                                                     |
| `plan-checker`                  | `.claude/agents/plan-checker.md`                        | ADOPT    | Three gaps: (1) does not gate PR-bound plans on completion of the PR-Review Maker→Fixer cycle, now actionable since `pr-review-maker`/`pr-review-fixer` exist (Round 4); (2) never calls the already-shipped `docs-validating-factual-accuracy` skill for a factual-accuracy pass; (3) has no persistent false-positives skip list | Add all three: PR-Review cycle completion gate (link to `governance/workflows/pr/pr-review-quality-gate.md`, adopted Round 4), a factual-accuracy pass reusing `docs-validating-factual-accuracy` (Phase 4, PR15 — sequence-independent, since the skill already exists pre-Round-5, only gains more capability in PR15), and a persistent skip list following the same shape as Phase 1's PR1 pattern |
| `plan-execution-checker`        | `.claude/agents/plan-execution-checker.md`              | ADOPT    | The "final quality gate" never verifies the archival step itself                                                                                                                                                                                                                                                                   | Add archival-mechanics verification: folder actually `git mv`'d to `done/`, index files updated, no orphaned references, archival commit exists                                                                                                                                                                                                                                                        |
| `plan-fixer`                    | `.claude/agents/plan-fixer.md`                          | ADOPT    | No explicit rule prevents a fix recipe from touching merge/PR governance gates, and no false-positive persistence exists                                                                                                                                                                                                           | Add a front-loaded hard rule that merge/PR steps are governance gates no fix recipe may ever touch; add false-positive persistence to the shared skip list `plan-checker` reads (same skip-list shape as PR1/PR21)                                                                                                                                                                                     |
| `plan-creating-project-plans`   | `.claude/skills/plan-creating-project-plans/SKILL.md`   | ADOPT    | No mandatory grilling, no anti-hallucination pre-write check, no Knowledge Capture / Plan Archival closing phase                                                                                                                                                                                                                   | Add mandatory grilling (via `grill-me`) at both start and end of plan writing; add a pre-write anti-hallucination verification step so plans can't cite nonexistent files/APIs; add a final "Knowledge Capture" + "Plan Archival" phase                                                                                                                                                                |
| `plan-writing-gherkin-criteria` | `.claude/skills/plan-writing-gherkin-criteria/SKILL.md` | ADOPT    | "Phase Gate Acceptance Checks" (applying Gherkin-style testability to phase-gate checklist items, not just scenarios) is only meaningful once `plan-creating-project-plans`' phase-gate concept exists                                                                                                                             | Sequence this PR (PR25) after `plan-creating-project-plans` (PR24) in the same phase                                                                                                                                                                                                                                                                                                                   |

### Phase 6 — Cluster E: CI / Nx validation

| Item         | OSE source                     | Decision | Reason                                                                                | Adaptation notes                                                                                                                                                                                                                                                     |
| ------------ | ------------------------------ | -------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci-checker` | `.claude/agents/ci-checker.md` | ADOPT    | Only audits `.github/workflows/` YAML today, with zero Nx-specific conformance checks | Add mandatory `project.json` targets check, coverage-threshold values (FE ≥70%, ≥80% BE — this repo's actual thresholds, confirmed via `swe-code-checker.md`'s existing coverage-check description), a 4-dimension tag scheme check, a `specs:coverage` target check |
| `ci-fixer`   | `.claude/agents/ci-fixer.md`   | ADOPT    | Fixer counterpart — needs matching fix recipes for whatever `ci-checker` now flags    | Sequence after `ci-checker` (PR26) so the new finding categories exist first; add fix recipes for missing `project.json` targets, coverage-threshold misconfiguration, tag-scheme gaps, and a missing `specs:coverage` target                                        |

### Phase 7 — Cluster F: PDF pipeline

| Item                | OSE source                            | Decision | Reason                                                                      | Adaptation notes                                                                                                                                                                                                                                          |
| ------------------- | ------------------------------------- | -------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pdf-to-md-checker` | `.claude/agents/pdf-to-md-checker.md` | ADOPT    | No content-nesting-accuracy validation exists                               | Add validation that list/indentation depth in the converted Markdown matches the PDF layout                                                                                                                                                               |
| `pdf-to-md-fixer`   | `.claude/agents/pdf-to-md-fixer.md`   | ADOPT    | No confidence-downgrade safety rule or false-positive persistence exists    | Add a confidence-downgrade safety rule: skip even HIGH_CONFIDENCE fixes touching >10 occurrences, editing outside the finding's region, or colliding with another pending finding; add false-positive skip-list persistence (same shape as PR1/PR21/PR23) |
| `pdf-to-md-maker`   | `.claude/agents/pdf-to-md-maker.md`   | ADOPT    | No chunking strategy for large PDFs, and figure placeholders are plain text | Add PDF chunking (50-page segments) to avoid single-pass overflow on large PDFs; convert figure placeholders into typed Mermaid diagram stubs (inferred from captions) instead of plain `[FIGURE N: ...]` text                                            |

### Phase 8 — Cluster G: Repo & process governance

| Item                                      | OSE source                                                        | Decision | Reason                                                                                                               | Adaptation notes                                                                                                                                                                                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `repo-setup-manager`                      | `.claude/agents/repo-setup-manager.md`                            | ADOPT    | Currently scoped only to "bootstrap a fresh clone," not "Phase 0 of every plan"                                      | Broaden scope: install deps, converge toolchain, run baseline tests, and resolve every in-scope preexisting test failure before plan work begins (document out-of-scope failures rather than fixing them)                                        |
| `repo-practicing-trunk-based-development` | `.claude/skills/repo-practicing-trunk-based-development/SKILL.md` | ADOPT    | IKP-Labs already ships `.claude/hooks/worktree-create.sh` but has no documented standard for when to use it          | Formalize a "worktree-to-PR" default delivery mode (disposable worktree → plan-scoped branch → draft PR, with `[AI]`/`[HUMAN]` step tagging)                                                                                                     |
| `agent-developing-agents`                 | `.claude/skills/agent-developing-agents/SKILL.md`                 | ADOPT    | Agent-authoring guidance lacks a Tools-Usage section and a When-to-Use section, and model-selection guidance is thin | Add "Tools Usage" (list each tool + why) and "When to Use This Agent" (use when / do NOT use for) sections; expand model-selection guidance into a fuller decision matrix with cost trade-offs and common mistakes                               |
| `docs-file-manager`                       | `.claude/agents/docs-file-manager.md`                             | ADOPT    | No pre-check before batch rename/move operations, and no explicit handling for uncommitted files                     | Add a `git status` pre-check before batch rename/move operations (warn the user first if uncommitted changes exist); add explicit handling for recently-created uncommitted files (a rename can't preserve git history that was never committed) |
| `docs-link-checker`                       | `.claude/agents/docs-link-checker.md`                             | ADOPT    | Re-checks every external link every run, no persistent cache                                                         | Add a persistent external-link cache (e.g., `docs/metadata/external-links-status.yaml`, 6-month expiry, orphan pruning) so repeat runs skip already-verified URLs                                                                                |

### Phase 9 — P3 minor items

| Item                                         | OSE source                                                           | Decision  | Reason                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Adaptation notes                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------------------------- | -------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `social-linkedin-post-maker`                 | `.claude/agents/social-linkedin-post-maker.md`                       | ADOPT     | No character-limit enforcement exists                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Enforce LinkedIn's 3,000-character post-body limit with an explicit measure-and-trim step before finishing a draft                                                                                                                                                                                                                                                                                                                       |
| `grill-me`                                   | `.claude/skills/grill-me/SKILL.md`                                   | ADOPT     | No blank-state/type-your-own answer option, no "let's discuss before deciding" option                                                                                                                                                                                                                                                                                                                                                                                                      | Add a standing type-your-own/blank-state answer option and a "let's discuss before deciding" option on every question, plus more nuanced batching rules                                                                                                                                                                                                                                                                                  |
| `ci-standards`                               | `.claude/skills/ci-standards/SKILL.md`                               | ADOPT     | No explicit Gherkin-coverage mandate                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Explicitly name a "Gherkin Consumption Mandate" — unit tests must be a superset of Gherkin scenarios, not just inspired by them                                                                                                                                                                                                                                                                                                          |
| `repo-harness-compatibility-checker`         | `.claude/agents/repo-harness-compatibility-checker.md`               | ADOPT     | Only checks internal consistency, never whether harness conventions still match live upstream Claude Code docs                                                                                                                                                                                                                                                                                                                                                                             | Add periodic web-verification that harness conventions (frontmatter schema, hook trigger keys) still match live upstream Claude Code docs                                                                                                                                                                                                                                                                                                |
| `repo-harness-compatibility-fixer`           | `.claude/agents/repo-harness-compatibility-fixer.md`                 | ADOPT     | No post-edit verification that a fix actually applied — same class of gap Phase 1 fixes system-wide, but this agent needs its own local fix since it is not one of the ~14 agents that inherits `repo-applying-maker-checker-fixer`. **Confirmed by inspection**: `repo-harness-compatibility-fixer.md` does not reference `permission.skill: repo-applying-maker-checker-fixer` and instead duplicates re-validation logic inline, so Phase 1's skill fix does not reach it automatically | Add grep-based post-edit verification (same pattern as Phase 1's `sed`-then-`grep` rule) applied locally in this agent's own body, since it does not inherit the skill                                                                                                                                                                                                                                                                   |
| `repo-generating-validation-reports`         | `.claude/skills/repo-generating-validation-reports/SKILL.md`         | ADOPT     | No collision-safe tracking for parallel report generation                                                                                                                                                                                                                                                                                                                                                                                                                                  | Add UUID-chain + scope-based execution tracking for collision-free parallel report generation                                                                                                                                                                                                                                                                                                                                            |
| `repo-assessing-criticality-confidence`      | `.claude/skills/repo-assessing-criticality-confidence/SKILL.md`      | ADOPT     | No guidance for embedding domain-specific examples directly in fixer agents                                                                                                                                                                                                                                                                                                                                                                                                                | Add guidance for embedding domain-specific HIGH/MEDIUM/FALSE_POSITIVE examples directly in fixer-agent files                                                                                                                                                                                                                                                                                                                             |
| `repo-understanding-repository-architecture` | `.claude/skills/repo-understanding-repository-architecture/SKILL.md` | ADOPT     | The existing 6-layer governance model description doesn't distinguish skills' role clearly                                                                                                                                                                                                                                                                                                                                                                                                 | Add a "skills are delivery infrastructure, not a governance layer" clarification to sharpen the existing 6-layer governance model description                                                                                                                                                                                                                                                                                            |
| `repo-defining-workflows`                    | `.claude/skills/repo-defining-workflows/SKILL.md`                    | **DEFER** | Topic mismatch, not a content gap. OSE's version is about authoring reusable multi-agent orchestration documents (phased execution, Gherkin success criteria); IKP-Labs's version of the same skill name covers git/PR conventions instead — a different capability entirely, not a thinner version of the same one                                                                                                                                                                        | No adaptation attempted. Needs a human product decision on whether IKP-Labs wants a "define a checker→fixer→checker chain as a document" capability at all — and if so, whether it should live under this skill name (colliding with the existing git/PR-conventions content) or a new one — before any content is adapted. Record this as DEFER in `repo-syncing-with-ose-primer/SKILL.md`, not as a permanent skip and not as an adopt |

---

## Functional Requirements

### FR-1: Maker-Checker-Fixer Convergence Safeguards

**Priority**: P1-High

**Description**: Update `.claude/skills/repo-applying-maker-checker-fixer/SKILL.md` to add
five convergence safeguards: a persistent false-positives skip list, scoped re-validation
(only `git diff`-touched surface on repeat runs), post-edit self-verification (`grep` after
every `sed`-style fix, mark FAILED on silent no-op), escalation guidance after 2+ rounds of
maker/fixer disagreement on the same finding, and a fixer "mode" parameter concept
(lax / normal / strict / ocd) controlling which severity tiers get auto-fixed.

**User Story**:

```text
As a checker/fixer pair re-running against the same codebase repeatedly
I want convergence safeguards baked into the shared pattern skill
So that re-runs don't re-litigate already-accepted findings and silent no-op fixes get caught
```

**Acceptance Criteria**:

- Given the updated skill, when any of the ~14 existing checker/fixer agents that already
  reference `repo-applying-maker-checker-fixer` runs again, then it has access to skip-list,
  scoped-re-validation, self-verification, escalation, and mode-parameter guidance without
  any change to its own agent file
- Given a `sed`-style fix that silently no-ops (exits 0, changes nothing), when the
  post-edit self-verification step runs, then the finding is marked FAILED, not fixed
- Given the same finding is disputed across 2+ maker/fixer rounds, when the fixer detects
  this, then it escalates per the new guidance rather than re-litigating a third time

**Edge Cases**:

- A checker/fixer agent does not reference this skill at all (confirmed for
  `repo-harness-compatibility-fixer` in the Phase 9 decision record) — it does not inherit
  this fix and needs its own local safeguard, tracked as a separate Phase 9 item, not a
  Phase 1 regression

---

### FR-2: Cluster A — TDD & Accessibility Testing

**Priority**: P2-Medium

**Description**: Update `swe-ui-maker.md`, `swe-ui-checker.md`, `swe-e2e-dev.md`,
`swe-csharp-dev.md`, and `swe-developing-frontend-ui` (skill) to mandate TDD ordering
(failing test first) and automated accessibility assertions where each currently only
documents these as after-the-fact checklist items.

**User Story**:

```text
As a developer using swe-ui-maker or swe-e2e-dev to build a new feature
I want the test written and confirmed failing before the implementation lands
So that the test actually proves the feature works, instead of being retrofitted to pass
```

**Acceptance Criteria**:

- Given `swe-ui-maker.md` and `swe-developing-frontend-ui`, when updated, then both
  reference `jest-axe`'s `toHaveNoViolations()` as a required assertion in every component
  test, written before the component implementation
- Given `swe-ui-checker.md`, when updated, then it has a distinct HIGH-severity
  color-contrast check dimension (WCAG AA ratios, color-only status indicators) and a
  distinct MEDIUM-severity dark-mode check dimension, separate from generic ARIA checks
- Given `swe-e2e-dev.md` and `swe-csharp-dev.md`, when updated, then both state an explicit
  Red→Green→Refactor requirement as a workflow step, not only as documented testing
  patterns

**Edge Cases**:

- A component genuinely has no interactive/ARIA-relevant surface (e.g., a pure layout
  wrapper) — the `jest-axe` requirement still applies since `toHaveNoViolations()` passes
  trivially on such components; this is not an exemption case

---

### FR-3: Cluster B — Language Hardening

**Priority**: P2-Medium

**Description**: Update the four generic (not KameraVue-tied) language-standards skills —
Go, Rust, F#, C# — with sections OSE's current versions carry that IKP-Labs's versions
lack: linting/security discipline (Go), unsafe-code policy and dependency scanning (Rust),
formatter enforcement and property-based testing (F#), and RFC 7807 error handling (C#).

**User Story**:

```text
As a developer using swe-golang-dev, swe-rust-dev, swe-fsharp-dev, or swe-csharp-dev
I want the language-standards skill to reflect current idiomatic tooling and security practice
So that generated code doesn't lag behind what the ecosystem now considers standard
```

**Acceptance Criteria**:

- Given `swe-programming-golang`, when updated, then it has a "Linting Discipline" section
  (`errors.Is`/`errors.As`, `%w` wrapping, sealed-interface exhaustiveness, `iota` discipline,
  godoc requirements) and a "Security Practices" section (parameterized queries,
  `context.WithTimeout`, input validation)
- Given `swe-programming-rust`, when updated, then it has an Unsafe Code Policy section,
  `cargo audit`/`cargo deny` guidance, Clippy pedantic hard-denies, and an enforced
  `.rustfmt.toml`
- Given `swe-programming-fsharp`, when updated, then it has Fantomas pre-commit enforcement
  and FsCheck property-based testing guidance alongside existing xUnit patterns
- Given `swe-programming-csharp`, when updated, then its error-handling example uses
  `ProblemDetails` (RFC 7807), not an ad-hoc anonymous-JSON shape

**Edge Cases**: None — these are additive documentation sections with no IKP-Labs
app-specific path dependencies, since all four skills are explicitly generic.

---

### FR-4: Cluster C — Documentation Quality & Fact-Checking

**Priority**: P2-Medium

**Description**: Update `docs-checker.md` to add factual-accuracy verification; update
`readme-checker.md`/`readme-fixer.md`/`readme-maker.md` to add content-quality/engagement
dimensions; update `docs-validating-factual-accuracy`, `docs-validating-links`,
`readme-writing-readme-files`, `docs-applying-content-quality`, and
`docs-creating-accessible-diagrams` skills with the specific capabilities each currently
lacks (see Per-Item Decision Record above for the full list per file).

**User Story**:

```text
As a developer relying on docs-checker and readme-checker
I want them to validate that documented claims are actually true and that README content is engaging
So that documentation passes review on more than structural completeness alone
```

**Acceptance Criteria**:

- Given `docs-checker.md`, when updated, then it performs `WebFetch`/`WebSearch`-based
  factual-accuracy verification with `[Verified]`/`[Unverified]`/`[Error]`/`[Outdated]`
  labeling, reusing `docs-validating-factual-accuracy`'s (PR15) verification workflow
- Given `readme-checker.md`, `readme-fixer.md`, `readme-maker.md`, when updated, then all
  three reference the same four content-quality dimensions (Problem-Solution Hook opening,
  jargon/buzzword scanning, scannability, active voice)
- Given `docs-applying-content-quality`, when updated, then it records — but does not fix —
  the finding that `docs-applying-diataxis-framework`'s templates violate the new "No Time
  Estimates" rule with literal "**Time**: 30 minutes" fields
- Given `docs-validating-links`, when updated, then it specifies per-status TTLs (OK: 7
  days, broken: 1 day) and HEAD-before-GET, replacing full re-checks every run

**Edge Cases**:

- A README's Problem-Solution Hook check runs against a directory-index README (e.g.,
  `.claude/agents/README.md`) that isn't a product pitch — `readme-checker`'s new dimension
  must not force pitch-style prose onto structural index files; this nuance is left to
  implementation-time judgment when adapting OSE's content, not resolved by this plan

---

### FR-5: Cluster D — Plan Lifecycle

**Priority**: P2-Medium

**Description**: Wire the already-shipped `grill-me` and `docs-validating-factual-accuracy`
skills into `plan-maker.md`/`plan-creating-project-plans`; gate `plan-checker.md` on the
already-shipped PR-Review Maker→Fixer cycle; add archival-mechanics verification to
`plan-execution-checker.md`; add a governance-gate hard rule and false-positive persistence
to `plan-fixer.md`; add phase-gate acceptance checks to `plan-writing-gherkin-criteria`.

**User Story**:

```text
As a developer creating or closing out a plan
I want the plan-lifecycle agents to actually use the grilling, fact-checking, and
PR-review capabilities this repo already shipped in earlier rounds
So that plans get the full benefit of infrastructure that currently sits unused
```

**Acceptance Criteria**:

- Given `plan-maker.md`, when updated, then it mandates a `grill-me` interview (2–4
  concrete options per question) both before and after plan writing
- Given `plan-checker.md`, when updated, then it gates PR-bound plans on PR-Review
  Maker→Fixer cycle completion, calls `docs-validating-factual-accuracy` for a
  factual-accuracy pass, and maintains a persistent false-positives skip list
- Given `plan-execution-checker.md`, when updated, then it verifies the archival folder
  move actually happened (`git mv` to `done/`), index files were updated, no orphaned
  references remain, and an archival commit exists
- Given `plan-fixer.md`, when updated, then it has a front-loaded hard rule that no fix
  recipe may ever touch a merge/PR governance gate
- Given `plan-writing-gherkin-criteria`, when updated (after `plan-creating-project-plans`
  in the same phase), then it applies Gherkin-style testability to phase-gate checklist
  items, not only to scenarios

**Edge Cases**:

- A plan has no PR at all yet (still in `backlog/`) — `plan-checker`'s PR-Review cycle gate
  applies only to plans that are actively PR-bound, not to backlog-stage plans

---

### FR-6: Cluster E — CI / Nx Validation

**Priority**: P2-Medium

**Description**: Update `ci-checker.md` to add Nx-specific conformance checks
(`project.json` targets, coverage thresholds, tag scheme, `specs:coverage` target); update
`ci-fixer.md` with matching fix recipes.

**User Story**:

```text
As a developer relying on ci-checker
I want it to also validate Nx workspace conformance, not only GitHub Actions YAML
So that project.json misconfiguration and coverage-threshold drift get caught before CI does
```

**Acceptance Criteria**:

- Given `ci-checker.md`, when updated, then it checks for mandatory `project.json` targets,
  coverage-threshold values matching this repo's actual thresholds (FE ≥70%, BE ≥80%), a
  4-dimension tag scheme, and a `specs:coverage` target
- Given `ci-fixer.md`, when updated (after `ci-checker`, PR26, in the same phase), then it
  has a fix recipe for every new finding category `ci-checker` introduces

**Edge Cases**: None — this is an audit-scope broadening within the same two existing
files, no new infrastructure required.

---

### FR-7: Cluster F — PDF Pipeline

**Priority**: P2-Medium

**Description**: Update `pdf-to-md-checker.md` with content-nesting-accuracy validation;
update `pdf-to-md-fixer.md` with a confidence-downgrade safety rule and false-positive
persistence; update `pdf-to-md-maker.md` with PDF chunking and typed Mermaid figure stubs.

**User Story**:

```text
As a developer converting a large or figure-heavy PDF
I want the pipeline to chunk large documents, produce structured figure stubs, and
apply fixes conservatively
So that conversion doesn't silently drop content or over-apply risky bulk edits
```

**Acceptance Criteria**:

- Given `pdf-to-md-checker.md`, when updated, then it validates that list/indentation depth
  in the Markdown output matches the PDF's visual layout
- Given `pdf-to-md-fixer.md`, when updated, then it skips even HIGH_CONFIDENCE fixes that
  touch >10 occurrences, edit outside a finding's region, or collide with another pending
  finding, and persists false positives to a skip list
- Given `pdf-to-md-maker.md`, when updated, then it chunks PDFs over 50 pages into segments
  before conversion, and converts figure placeholders into typed Mermaid diagram stubs
  inferred from captions instead of plain `[FIGURE N: ...]` text

**Edge Cases**:

- A PDF is exactly at or just under 50 pages — chunking is a "greater than 50 pages"
  threshold, single-pass conversion remains the default below it

---

### FR-8: Cluster G — Repo & Process Governance

**Priority**: P2-Medium

**Description**: Broaden `repo-setup-manager.md`'s scope to cover Phase 0 of every plan;
formalize a worktree-to-PR default delivery mode in
`repo-practicing-trunk-based-development`; add authoring-guidance sections to
`agent-developing-agents`; add pre-check and uncommitted-file handling to
`docs-file-manager.md`; add a persistent external-link cache to `docs-link-checker.md`.

**User Story**:

```text
As a developer starting a new plan or renaming files in docs/
I want repo-setup-manager to converge the toolchain before work starts, and docs-file-manager
to warn me about uncommitted changes before a batch rename
So that plan work starts on a clean, working baseline and file history isn't silently lost
```

**Acceptance Criteria**:

- Given `repo-setup-manager.md`, when updated, then its scope statement covers "Phase 0 of
  every plan" (install deps, converge toolchain, run baseline tests, resolve in-scope
  preexisting failures, document out-of-scope failures), not only fresh-clone bootstrap
- Given `repo-practicing-trunk-based-development`, when updated, then it documents a
  default worktree-to-PR delivery mode referencing the existing
  `.claude/hooks/worktree-create.sh` hook, with `[AI]`/`[HUMAN]` step tagging
- Given `agent-developing-agents`, when updated, then it has "Tools Usage" and "When to Use
  This Agent" sections, and an expanded model-selection decision matrix
- Given `docs-file-manager.md`, when updated, then it runs `git status` before any batch
  rename/move and warns the user first if uncommitted changes exist, with explicit handling
  for files that were never committed (history can't be preserved for those)
- Given `docs-link-checker.md`, when updated, then it persists external-link check results
  to a cache file with a 6-month expiry and orphan pruning, skipping already-verified URLs
  on repeat runs

**Edge Cases**:

- `repo-setup-manager`'s "resolve every in-scope preexisting test failure" broadening could
  in principle expand unboundedly — the adapted content must retain OSE's "document
  out-of-scope failures rather than fixing them" boundary so this doesn't become an
  unbounded mandate

---

### FR-9: Phase 9 — P3 Minor Items (Bundled)

**Priority**: P3-Low

**Description**: Bundle 8 small, independent findings into 3 PRs by natural affinity, and
record `repo-defining-workflows` as DEFER with no code change.

**User Story**:

```text
As a maintainer of the .claude/ harness
I want small, low-priority findings bundled into a handful of PRs instead of 8 separate ones
So that PR overhead is proportional to the size of each individual change
```

**Acceptance Criteria**:

- Given PR36, when opened, then it contains both `repo-harness-compatibility-checker.md`
  and `repo-harness-compatibility-fixer.md` changes together (natural checker/fixer
  pairing)
- Given PR37, when opened, then it contains `repo-generating-validation-reports`,
  `repo-assessing-criticality-confidence`, and `repo-understanding-repository-architecture`
  skill changes together (all three are `repo-`-prefixed governance skills)
- Given PR38, when opened, then it contains `social-linkedin-post-maker.md`, `grill-me`,
  and `ci-standards` changes together (no other natural cluster fits these three)
- Given `repo-defining-workflows`, when this phase completes, then it has a DEFER row
  recorded in `repo-syncing-with-ose-primer/SKILL.md` — distinct from the existing "does
  NOT adopt" permanent-skip table, since DEFER means "undecided," not "permanently
  rejected"

**Edge Cases**: None — all three PRs are documentation-only, no application code touched.

---

### FR-10: Sync Record Finalization

**Priority**: Housekeeping (runs last)

**Description**: Update `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`'s "Harness
Inventory Reference" table and "Last Updated" footer, and add a Round 5 entry to
`plans/ideas.md` Archive → Implemented, styled like the Round 4 entry.

**Acceptance Criteria**:

- Given PR1–PR38 are all merged, when this PR is opened, then the Agents, Skills, and Hooks
  counts in the inventory table are re-verified against actual `ls` output (not assumed to
  be unchanged, since this round, unlike Round 4, edits skill files directly and could in
  principle change a skill's directory structure — though no PR in this plan is expected to
  add or remove a skill directory)
- Given `plans/ideas.md`, when this PR merges, then it has a Round 5 bullet list under
  Archive → Implemented matching the Round 4 entry's format (phase-by-phase summary, PR
  range reference, the one DEFER item called out explicitly)

**Edge Cases**: If any of PR1–PR38 is not yet merged when this PR is opened, hold this PR
until all 38 are merged — the counts and summary must reflect final, merged state, not
planned state.

---

## Non-Functional Requirements

- NFR-1: No new agent or skill files are created by this round — every PR edits a file
  that already exists in both IKP-Labs and OSE
- NFR-2: No OSE-specific content (`ayokoding`, `organiclever`, `ose-www`, `wahidyankf`,
  Nx-specific-to-OSE conventions, `repo-governance/` path prefix, OSE's `vitest-axe`) is
  adopted verbatim into any edited file — always translated through the adaptation table
  in technical-design.md
- NFR-3: Markdown lint (`npm run lint:md`) passes on all edited files before each PR merges
- NFR-4: Each of the 39 PRs in this plan corresponds to exactly the file grouping specified
  in the Scope Definition above — Phases 1–8 are strictly one PR per file, Phase 9 bundles
  by the groupings in FR-9, Phase 10 is a single housekeeping PR
- NFR-5: Phase 1 (PR1) must merge and be spot-verified (per README.md Success Criteria)
  before any Phase 2–9 PR that depends on inherited checker/fixer behavior is considered
  fully validated — though Phases 2–9 do not have a hard merge-order dependency on Phase 1
  beyond that spot-check
- NFR-6: Within Phase 5, PR25 (`plan-writing-gherkin-criteria`) must merge after PR24
  (`plan-creating-project-plans`). Within Phase 6, PR27 (`ci-fixer`) must merge after PR26
  (`ci-checker`). No other cross-PR merge-order dependency exists in this plan
