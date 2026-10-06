# Technical Design

## Architecture Overview

Unlike Rounds 1–4, this round creates **zero new files**. Every deliverable is a content
edit to a file that already exists in both `.claude/` (IKP-Labs) and OSE. No application
code (`apps/kameravue-fe`, `apps/kameravue-be`, `apps/taskly-be`) is touched.

```text
.claude/
├── agents/
│   ├── swe-ui-maker.md                          [PR2  — edit]
│   ├── swe-ui-checker.md                        [PR3  — edit]
│   ├── swe-e2e-dev.md                           [PR4  — edit]
│   ├── swe-csharp-dev.md                        [PR5  — edit]
│   ├── docs-checker.md                          [PR11 — edit]
│   ├── readme-checker.md                        [PR12 — edit]
│   ├── readme-fixer.md                          [PR13 — edit]
│   ├── readme-maker.md                          [PR14 — edit]
│   ├── plan-maker.md                            [PR20 — edit]
│   ├── plan-checker.md                          [PR21 — edit]
│   ├── plan-execution-checker.md                [PR22 — edit]
│   ├── plan-fixer.md                            [PR23 — edit]
│   ├── ci-checker.md                            [PR26 — edit]
│   ├── ci-fixer.md                              [PR27 — edit]
│   ├── pdf-to-md-checker.md                     [PR28 — edit]
│   ├── pdf-to-md-fixer.md                       [PR29 — edit]
│   ├── pdf-to-md-maker.md                       [PR30 — edit]
│   ├── repo-setup-manager.md                    [PR31 — edit]
│   ├── docs-file-manager.md                     [PR34 — edit]
│   ├── docs-link-checker.md                     [PR35 — edit]
│   ├── social-linkedin-post-maker.md            [PR38 — edit]
│   ├── repo-harness-compatibility-checker.md    [PR36 — edit]
│   └── repo-harness-compatibility-fixer.md      [PR36 — edit]
└── skills/
    ├── repo-applying-maker-checker-fixer/       [PR1  — edit]
    ├── swe-developing-frontend-ui/              [PR6  — edit]
    ├── swe-programming-golang/                  [PR7  — edit]
    ├── swe-programming-rust/                    [PR8  — edit]
    ├── swe-programming-fsharp/                  [PR9  — edit]
    ├── swe-programming-csharp/                  [PR10 — edit]
    ├── docs-validating-factual-accuracy/        [PR15 — edit]
    ├── docs-validating-links/                   [PR16 — edit]
    ├── readme-writing-readme-files/             [PR17 — edit]
    ├── docs-applying-content-quality/           [PR18 — edit]
    ├── docs-creating-accessible-diagrams/       [PR19 — edit]
    ├── plan-creating-project-plans/             [PR24 — edit]
    ├── plan-writing-gherkin-criteria/           [PR25 — edit]
    ├── repo-practicing-trunk-based-development/ [PR32 — edit]
    ├── agent-developing-agents/                 [PR33 — edit]
    ├── grill-me/                                [PR38 — edit]
    ├── ci-standards/                            [PR38 — edit]
    ├── repo-generating-validation-reports/      [PR37 — edit]
    ├── repo-assessing-criticality-confidence/   [PR37 — edit]
    ├── repo-understanding-repository-architecture/ [PR37 — edit]
    └── repo-syncing-with-ose-primer/            [PR39 — edit: adds DEFER row (repo-defining-workflows) + Phase 10 finalization]

plans/ideas.md                                    [PR39 — edit]
```

**Downstream inheritance diagram for Phase 1 (why it ships first):**

```text
                 .claude/skills/repo-applying-maker-checker-fixer/SKILL.md
                                        │
                          (permission.skill reference)
                                        │
        ┌───────────────┬──────────────┼───────────────┬──────────────────┐
        ▼               ▼              ▼                ▼                  ▼
  repo-rules-*     specs-*        docs-checker/    readme-checker/    plan-checker/
  checker/fixer   checker/fixer     -fixer          -fixer             -fixer
        │               │              │                │                  │
        ▼               ▼              ▼                ▼                  ▼
  repo-harness-*   swe-code-       pdf-to-md-fixer   (~14 pairs total, per README.md
  checker/fixer     checker                           Success Criteria — spot-check
                                                        at least 2 during Phase 1)

  Exception (confirmed by inspection, Phase 9 decision record):
  repo-harness-compatibility-fixer.md does NOT reference this skill — duplicates
  logic inline — so it needs its own local fix (PR36), not inherited from PR1.
```

---

## Adaptation Convention Table

Reused from `.claude/skills/repo-syncing-with-ose-primer/SKILL.md` Step 3, applied to
every PR in this plan:

| OSE reference                                                                   | IKP-Labs replacement                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apps/ayokoding-web/`, `apps/organiclever-*`, `apps/ose-www-*`                  | _(remove — no equivalent)_                                                                                                                                                                                                                                   |
| `apps/ose-*` example targets                                                    | `apps/kameravue-fe/` (`:3002`) or `apps/kameravue-be/` (`:8081`) or `apps/taskly-be/` (`:8082`), as appropriate to the file                                                                                                                                  |
| Gradle / `./gradlew`                                                            | Maven / `./mvnw`                                                                                                                                                                                                                                             |
| `ayokoding`/`organiclever`/`ose-www` branding                                   | `IKP-Labs` / `KameraVue` / `Taskly`                                                                                                                                                                                                                          |
| `repo-governance/` path prefix                                                  | `governance/` — or strip the link entirely and keep the instruction as prose if no IKP-Labs equivalent file exists (confirm via `ls governance/` at implementation time before assuming a 1:1 path swap)                                                     |
| `vitest-axe`'s `toHaveNoViolations()`                                           | `jest-axe`'s `toHaveNoViolations()` — `kameravue-fe` uses Jest + React Testing Library, not Vitest                                                                                                                                                           |
| `libs/web-ui` design-system package references                                  | `apps/kameravue-fe/src/components/ui/` (app-local, not a published Nx `libs/` package — confirmed Round 4 PR4)                                                                                                                                               |
| `nx affected -t typecheck lint test:quick specs:coverage` (OSE's fixed command) | Whichever of `npm run lint`, `npm test`, `mvn test`, `go test ./...`, or their Nx-scoped equivalents apply to the PR's actually-changed files — framed as "run whichever apply," not one fixed command (same pattern Round 4 PR7 used for `pr-review-fixer`) |
| `web-researcher` agent                                                          | `web-research-maker`                                                                                                                                                                                                                                         |
| OSE's `.claude/hooks/guard-pre-commit-env.test.sh` conventions                  | N/A this round — no hook files are touched                                                                                                                                                                                                                   |

**Round-5-specific note**: Cluster B's four language skills (Go, Rust, F#, C#) are
explicitly generic — not tied to KameraVue or Taskly — per their own agent descriptions
(e.g., `swe-csharp-dev.md`: "Generic — not tied to KameraVue stack"). For these four PRs,
the adaptation pass is lighter: confirm no OSE/ayokoding branding survives, but the
technical content (linting rules, unsafe-code policy, formatter config) is largely
portable as-is since it describes language ecosystem conventions, not IKP-Labs-specific
paths.

---

## Fetch Command Pattern

Every PR in Phases 1–9 starts by fetching the exact current OSE source before adapting it
— content may have drifted since this plan was written (Round 4 already hit this once,
when `pr-review-maker`/`pr-review-fixer` had been refactored upstream between planning and
implementation — see `plans/done/2026-07-10__claude-governance-gap-round-4/checklist.md`
Task 6.1). Use:

```bash
# For agents:
gh api repos/wahidyankf/ose-public/contents/.claude/agents/<name>.md \
  --jq -r '.content' | base64 -d

# For skills:
gh api repos/wahidyankf/ose-public/contents/.claude/skills/<name>/SKILL.md \
  --jq -r '.content' | base64 -d
```

If the fetch 404s (file deleted/moved/refactored upstream since this plan was written),
follow Round 4's recovery pattern: walk commit history via
`gh api repos/wahidyankf/ose-public/commits?path=<path>` to find the last version before
deletion, and adapt that instead — do not silently skip the item or invent new content.

---

## Per-Phase PR Specifications

Each row: PR number, target IKP-Labs file, OSE source path, one-line capability summary
(full detail in requirements.md's Per-Item Decision Record — this table exists so the
implementer can run the fetch command directly without cross-referencing).

### Phase 1

| PR  | Target file                                                 | OSE source path                                             | Capability to add                                                                                       |
| --- | ----------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| PR1 | `.claude/skills/repo-applying-maker-checker-fixer/SKILL.md` | `.claude/skills/repo-applying-maker-checker-fixer/SKILL.md` | Skip list, scoped re-validation, post-edit self-verification, escalation guidance, fixer mode parameter |

### Phase 2 — Cluster A

| PR  | Target file                                          | OSE source path                                      | Capability to add                                                   |
| --- | ---------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| PR2 | `.claude/agents/swe-ui-maker.md`                     | `.claude/agents/swe-ui-maker.md`                     | `jest-axe` `toHaveNoViolations()` mandate, written failing first    |
| PR3 | `.claude/agents/swe-ui-checker.md`                   | `.claude/agents/swe-ui-checker.md`                   | Color-contrast (HIGH) and dark-mode (MEDIUM) as distinct dimensions |
| PR4 | `.claude/agents/swe-e2e-dev.md`                      | `.claude/agents/swe-e2e-dev.md`                      | Explicit Red→Green→Refactor requirement                             |
| PR5 | `.claude/agents/swe-csharp-dev.md`                   | `.claude/agents/swe-csharp-dev.md`                   | Mandate TDD as required workflow step                               |
| PR6 | `.claude/skills/swe-developing-frontend-ui/SKILL.md` | `.claude/skills/swe-developing-frontend-ui/SKILL.md` | Same automated a11y-testing requirement as PR2, at skill level      |

### Phase 3 — Cluster B

| PR   | Target file                                      | OSE source path                                  | Capability to add                                                                      |
| ---- | ------------------------------------------------ | ------------------------------------------------ | -------------------------------------------------------------------------------------- |
| PR7  | `.claude/skills/swe-programming-golang/SKILL.md` | `.claude/skills/swe-programming-golang/SKILL.md` | Linting Discipline + Security Practices sections                                       |
| PR8  | `.claude/skills/swe-programming-rust/SKILL.md`   | `.claude/skills/swe-programming-rust/SKILL.md`   | Unsafe Code Policy, `cargo audit`/`deny`, Clippy pedantic hard-denies, `.rustfmt.toml` |
| PR9  | `.claude/skills/swe-programming-fsharp/SKILL.md` | `.claude/skills/swe-programming-fsharp/SKILL.md` | Fantomas pre-commit enforcement, FsCheck property-based testing                        |
| PR10 | `.claude/skills/swe-programming-csharp/SKILL.md` | `.claude/skills/swe-programming-csharp/SKILL.md` | `ProblemDetails` (RFC 7807) error-handling example                                     |

### Phase 4 — Cluster C

| PR   | Target file                                                 | OSE source path                                             | Capability to add                                                                                                |
| ---- | ----------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| PR11 | `.claude/agents/docs-checker.md`                            | `.claude/agents/docs-checker.md`                            | Factual-accuracy verification via `WebFetch`/`WebSearch`, 4-state labeling                                       |
| PR12 | `.claude/agents/readme-checker.md`                          | `.claude/agents/readme-checker.md`                          | Content-quality/engagement dimensions                                                                            |
| PR13 | `.claude/agents/readme-fixer.md`                            | `.claude/agents/readme-fixer.md`                            | Matching fix recipes for content-quality findings                                                                |
| PR14 | `.claude/agents/readme-maker.md`                            | `.claude/agents/readme-maker.md`                            | Content-quality dimensions in authoring checklist                                                                |
| PR15 | `.claude/skills/docs-validating-factual-accuracy/SKILL.md`  | `.claude/skills/docs-validating-factual-accuracy/SKILL.md`  | 4-state classification, web-verification workflow, 6-month re-validation cadence                                 |
| PR16 | `.claude/skills/docs-validating-links/SKILL.md`             | `.claude/skills/docs-validating-links/SKILL.md`             | Per-status TTL caching, HEAD-before-GET, progressive-writing guidance                                            |
| PR17 | `.claude/skills/readme-writing-readme-files/SKILL.md`       | `.claude/skills/readme-writing-readme-files/SKILL.md`       | Problem-Solution Hook, benefits-first language                                                                   |
| PR18 | `.claude/skills/docs-applying-content-quality/SKILL.md`     | `.claude/skills/docs-applying-content-quality/SKILL.md`     | "No Time Estimates" rule (+ record, don't fix, the Diátaxis-template self-contradiction), numeric WCAG AA ratios |
| PR19 | `.claude/skills/docs-creating-accessible-diagrams/SKILL.md` | `.claude/skills/docs-creating-accessible-diagrams/SKILL.md` | 8-color WCAG palette, Mermaid escaping table                                                                     |

### Phase 5 — Cluster D

| PR   | Target file                                             | OSE source path                                         | Capability to add                                                                               |
| ---- | ------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| PR20 | `.claude/agents/plan-maker.md`                          | `.claude/agents/plan-maker.md`                          | Mandatory `grill-me` interview before and after plan writing                                    |
| PR21 | `.claude/agents/plan-checker.md`                        | `.claude/agents/plan-checker.md`                        | PR-Review cycle completion gate, factual-accuracy pass, false-positives skip list               |
| PR22 | `.claude/agents/plan-execution-checker.md`              | `.claude/agents/plan-execution-checker.md`              | Archival-mechanics verification                                                                 |
| PR23 | `.claude/agents/plan-fixer.md`                          | `.claude/agents/plan-fixer.md`                          | Front-loaded governance-gate hard rule, false-positive persistence                              |
| PR24 | `.claude/skills/plan-creating-project-plans/SKILL.md`   | `.claude/skills/plan-creating-project-plans/SKILL.md`   | Mandatory grilling, anti-hallucination pre-write check, Knowledge Capture + Plan Archival phase |
| PR25 | `.claude/skills/plan-writing-gherkin-criteria/SKILL.md` | `.claude/skills/plan-writing-gherkin-criteria/SKILL.md` | Phase Gate Acceptance Checks (sequence after PR24)                                              |

### Phase 6 — Cluster E

| PR   | Target file                    | OSE source path                | Capability to add                                                                                                                      |
| ---- | ------------------------------ | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| PR26 | `.claude/agents/ci-checker.md` | `.claude/agents/ci-checker.md` | Nx conformance checks: `project.json` targets, coverage thresholds (FE ≥70%, BE ≥80%), 4-dimension tag scheme, `specs:coverage` target |
| PR27 | `.claude/agents/ci-fixer.md`   | `.claude/agents/ci-fixer.md`   | Matching fix recipes (sequence after PR26)                                                                                             |

### Phase 7 — Cluster F

| PR   | Target file                           | OSE source path                       | Capability to add                                                      |
| ---- | ------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------- |
| PR28 | `.claude/agents/pdf-to-md-checker.md` | `.claude/agents/pdf-to-md-checker.md` | Content-nesting-accuracy validation                                    |
| PR29 | `.claude/agents/pdf-to-md-fixer.md`   | `.claude/agents/pdf-to-md-fixer.md`   | Confidence-downgrade safety rule, false-positive skip-list persistence |
| PR30 | `.claude/agents/pdf-to-md-maker.md`   | `.claude/agents/pdf-to-md-maker.md`   | 50-page PDF chunking, typed Mermaid figure stubs                       |

### Phase 8 — Cluster G

| PR   | Target file                                                       | OSE source path                                                   | Capability to add                                                                  |
| ---- | ----------------------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| PR31 | `.claude/agents/repo-setup-manager.md`                            | `.claude/agents/repo-setup-manager.md`                            | Broaden scope to "Phase 0 of every plan"                                           |
| PR32 | `.claude/skills/repo-practicing-trunk-based-development/SKILL.md` | `.claude/skills/repo-practicing-trunk-based-development/SKILL.md` | Formalize worktree-to-PR default delivery mode                                     |
| PR33 | `.claude/skills/agent-developing-agents/SKILL.md`                 | `.claude/skills/agent-developing-agents/SKILL.md`                 | "Tools Usage" + "When to Use This Agent" sections, expanded model-selection matrix |
| PR34 | `.claude/agents/docs-file-manager.md`                             | `.claude/agents/docs-file-manager.md`                             | `git status` pre-check, uncommitted-file handling                                  |
| PR35 | `.claude/agents/docs-link-checker.md`                             | `.claude/agents/docs-link-checker.md`                             | Persistent external-link cache (6-month expiry, orphan pruning)                    |

### Phase 9 — P3 Minor Items (bundled)

| PR   | Target files                                                                                                                                                                                        | OSE source paths                       | Capability to add                                                                                                                                                 |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PR36 | `.claude/agents/repo-harness-compatibility-checker.md`, `.claude/agents/repo-harness-compatibility-fixer.md`                                                                                        | same-named `.claude/agents/*.md`       | Checker: periodic web-verification against live upstream Claude Code docs. Fixer: grep-based post-edit verification (local, since this fixer doesn't inherit PR1) |
| PR37 | `.claude/skills/repo-generating-validation-reports/SKILL.md`, `.claude/skills/repo-assessing-criticality-confidence/SKILL.md`, `.claude/skills/repo-understanding-repository-architecture/SKILL.md` | same-named `.claude/skills/*/SKILL.md` | UUID-chain execution tracking; domain-specific fixer examples; "skills are delivery infrastructure" clarification                                                 |
| PR38 | `.claude/agents/social-linkedin-post-maker.md`, `.claude/skills/grill-me/SKILL.md`, `.claude/skills/ci-standards/SKILL.md`                                                                          | same-named paths                       | 3,000-char limit enforcement; blank-state/discuss-first answer options; Gherkin Consumption Mandate                                                               |
| —    | `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`                                                                                                                                              | N/A (IKP-Labs bookkeeping)             | Record `repo-defining-workflows` as DEFER — folded into PR38 as a small addition, since it is a documentation-only decision record, not a content adaptation      |

### Phase 10 — Housekeeping

| PR   | Target files                                                             | Action                                                                                                          |
| ---- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| PR39 | `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`, `plans/ideas.md` | Update Harness Inventory Reference table + "Last Updated" footer; add Round 5 archive entry to `plans/ideas.md` |

---

## Commit Strategy

Each PR is a single squash-merged commit onto `main`, following
`governance/development/workflow/implementation.md`'s `type(scope): subject` convention.
Since every PR edits an existing file rather than creating one, the verb is
"add \<capability\>" or "enhance \<file\> with \<capability\>", not "add \<file\>":

```text
docs(skills): add convergence safeguards to repo-applying-maker-checker-fixer
docs(agents): add jest-axe TDD mandate to swe-ui-maker
docs(agents): add color-contrast and dark-mode checks to swe-ui-checker
docs(agents): add Red-Green-Refactor requirement to swe-e2e-dev
docs(agents): add TDD workflow requirement to swe-csharp-dev
docs(skills): add automated a11y testing requirement to swe-developing-frontend-ui
docs(skills): add linting discipline and security practices to swe-programming-golang
docs(skills): add unsafe code policy and dependency scanning to swe-programming-rust
docs(skills): add Fantomas enforcement and property-based testing to swe-programming-fsharp
docs(skills): replace error handling example with ProblemDetails in swe-programming-csharp
docs(agents): add factual-accuracy verification to docs-checker
docs(agents): add content-quality dimensions to readme-checker
docs(agents): add content-quality fix recipes to readme-fixer
docs(agents): add content-quality dimensions to readme-maker
docs(skills): add 4-state confidence classification to docs-validating-factual-accuracy
docs(skills): add link caching and progressive writing to docs-validating-links
docs(skills): add Problem-Solution Hook guidance to readme-writing-readme-files
docs(skills): add No Time Estimates rule and WCAG ratios to docs-applying-content-quality
docs(skills): add WCAG color palette and Mermaid escaping to docs-creating-accessible-diagrams
docs(agents): wire grill-me interview into plan-maker
docs(agents): add PR-review gate and factual-accuracy pass to plan-checker
docs(agents): add archival-mechanics verification to plan-execution-checker
docs(agents): add governance-gate hard rule to plan-fixer
docs(skills): add grilling and anti-hallucination checks to plan-creating-project-plans
docs(skills): add phase-gate acceptance checks to plan-writing-gherkin-criteria
docs(agents): add Nx conformance checks to ci-checker
docs(agents): add Nx fix recipes to ci-fixer
docs(agents): add content-nesting validation to pdf-to-md-checker
docs(agents): add confidence-downgrade safety rule to pdf-to-md-fixer
docs(agents): add PDF chunking and Mermaid figure stubs to pdf-to-md-maker
docs(agents): broaden repo-setup-manager to plan Phase 0
docs(skills): formalize worktree-to-PR delivery mode
docs(skills): add tools-usage and when-to-use sections to agent-developing-agents
docs(agents): add git status pre-check to docs-file-manager
docs(agents): add persistent link cache to docs-link-checker
docs(agents): add live harness verification to repo-harness-compatibility pair
docs(skills): add execution tracking and domain examples to repo governance skills
docs(agents): add character limit and interview options to misc agents
docs(plan): finalize claude-governance-gap-round-5 sync record
```
