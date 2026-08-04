# Requirements

## Scope Definition

### In-Scope

**Phase 1 — API exploratory testing (1 agent, 1 PR):**

- `api-exploratory-tester` agent

**Phase 2 — Web tester triad (3 agents, 3 PRs, one per agent):**

- `web-exploratory-tester` agent
- `web-usability-tester` agent
- `web-design-tester` agent

**Phase 3 — PR review quality gate (1 governance doc + 2 agents, 3 sequential PRs):**

- `governance/workflows/pr/pr-review-quality-gate.md`
- `pr-review-maker` agent
- `pr-review-fixer` agent

**Phase 4 — Hook decision (1 PR):**

- `guard-pre-commit-env.test.sh` adopt/skip decision

**Phase 5 — Sync record finalization (1 PR, runs last):**

- `.claude/skills/repo-syncing-with-ose-primer/SKILL.md` inventory + last-synced update
- `plans/ideas.md` Round 4 archive entry

### Non-Scope

- Editing or refactoring any agent/skill created in Round 1, 2, or 3
- Application code changes (`apps/kameravue-fe`, `apps/kameravue-be`, `apps/taskly-be`, or
  their E2E suites)
- Running a full production PR review cycle — only one manual dry-run smoke test against a
  real, low-stakes PR is required (Phase 3 acceptance criteria)
- Creating the still-missing `governance/workflows/branching-strategy.md`,
  `pr-workflow.md`, `trunk-based-development.md` files — pre-existing gap, unrelated to
  this sync round
- Modifying `plans/README.md`
- Any item already permanently skipped per the existing "What IKP-Labs Intentionally Does
  NOT Adopt" table in `repo-syncing-with-ose-primer/SKILL.md` (all `apps-ayokoding-*`,
  `apps-organiclever-*`, `apps-ose-www-*`, `apps-wahidyankf-*`,
  `apps-web-ui-storybook-deployer`, `docs-tutorial-*`, `docs-software-engineering-separation-*`)
- Provisioning a dedicated GitHub App/bot identity for `pr-review-maker`/`pr-review-fixer`
  — both agents post under the existing authenticated `gh` CLI identity with an
  AI-attribution footer, matching OSE's own documented "current reality, not aspiration"
  fallback

---

## Per-Item Decision Record

Recorded per `repo-syncing-with-ose-primer/SKILL.md` Step 4 format
(OSE source / Decision / Reason / Adaptation notes).

### 1. `api-exploratory-tester`

- **OSE source**: `.claude/agents/api-exploratory-tester.md`
- **Decision**: ADOPT
- **Reason**: Fills a real gap — no IKP-Labs agent performs live, session-based
  exploratory testing against a running API. Zero new skill dependencies: the three
  skills it references (`plan-creating-project-plans`, `plan-writing-gherkin-criteria`,
  `docs-applying-content-quality`) already exist in `.claude/skills/`.
- **Adaptation notes**:

  | OSE reference                                                              | IKP-Labs replacement                                                                                                                                                                                                                                                                                                               |
  | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `organiclever-be` (`:8202`), `ose-be` (`:8302`) example targets            | `apps/kameravue-be` (Spring Boot, Java 17, `:8081`) and `apps/taskly-be` (Go/Gin, `:8082`)                                                                                                                                                                                                                                         |
  | `repo-governance/development/quality/evidence-capture.md`                  | No IKP-Labs equivalent exists — strip the link; keep the underlying instruction ("capture request/response evidence under the backlog plan's `evidence/` subfolder") as plain prose                                                                                                                                                |
  | `specs/apps/<product>/containers/contracts/openapi.yaml` path convention   | IKP-Labs `specs/` is flat by domain (`specs/authentication/`, `specs/gallery/`, `specs/profile/`), not nested under `apps/<product>/containers/contracts/`; neither `kameravue-be` nor `taskly-be` currently publishes an OpenAPI spec file — note this as a discovery step the agent performs at runtime rather than a fixed path |
  | `web-researcher` agent reference                                           | Rename to `web-research-maker` (IKP-Labs's equivalent agent)                                                                                                                                                                                                                                                                       |
  | `ayokoding`/`organiclever`/`ose-www` domain mentions anywhere in body text | Remove entirely                                                                                                                                                                                                                                                                                                                    |

### 2. `web-exploratory-tester`

- **OSE source**: `.claude/agents/web-exploratory-tester.md`
- **Decision**: ADOPT
- **Reason**: No IKP-Labs agent currently drives a browser against the live rendered
  frontend for structured functional exploratory testing. Confirmed via listing OSE's full
  `.claude/skills/` directory (30 entries) that no `web-exploratory-*` skill file exists —
  this agent relies on Playwright MCP browser tools directly
  (`mcp__plugin_playwright_playwright__browser_*`), which are already available as MCP
  tools in this environment. Zero new skill dependencies.
- **Adaptation notes**: see shared web-triad adaptation table under Requirement FR-2 below.

### 3. `web-usability-tester`

- **OSE source**: `.claude/agents/web-usability-tester.md`
- **Decision**: ADOPT
- **Reason**: Same rationale as `web-exploratory-tester` — no IKP-Labs agent performs
  spec-blind, heuristic usability evaluation (Nielsen's 10 heuristics, cognitive
  walkthrough) of the live frontend. No corresponding OSE skill file found. Zero new skill
  dependencies.
- **Adaptation notes**: see shared web-triad adaptation table under Requirement FR-2 below.

### 4. `web-design-tester`

- **OSE source**: `.claude/agents/web-design-tester.md`
- **Decision**: ADOPT
- **Reason**: Same rationale — no IKP-Labs agent evaluates live rendered-page fidelity
  against design tokens/mockups. Runtime counterpart to the existing static-source
  `swe-ui-checker` (no overlap: `swe-ui-checker` audits component source, this agent
  drives a browser against what actually renders). No corresponding OSE skill file found.
  Zero new skill dependencies.
- **Adaptation notes**: see shared web-triad adaptation table under Requirement FR-2 below.
  Additional note: OSE's design-fidelity ground truth includes a dedicated
  `libs/web-ui` design-system-primitives package — IKP-Labs `kameravue-fe` has no such
  package. Adapt this ground-truth source to "component patterns in
  `apps/kameravue-fe/src/components/` and Tailwind CSS 4 theme tokens in
  `apps/kameravue-fe/tailwind.config.*`" instead.

### 5. `governance/workflows/pr/pr-review-quality-gate.md`

- **OSE source**: `repo-governance/workflows/pr/pr-review-quality-gate.md`
- **Decision**: ADOPT
- **Reason**: Successfully fetched in full from OSE (not a broken/private path). Defines
  the maker→fixer review-cycle loop that `pr-review-maker`/`pr-review-fixer` (PR6, PR7)
  both depend on and link back to. Must exist before either agent file is created.
- **Adaptation notes**: see Requirement FR-5 below — this is the item with the most
  structural adaptation (OSE's YAML-frontmatter workflow format vs. IKP-Labs's plain
  Markdown workflow doc format, and OSE's "delivery mode" vocabulary which IKP-Labs has no
  equivalent for).

### 6. `pr-review-maker`

- **OSE source**: `.claude/agents/pr-review-maker.md`
- **Decision**: ADOPT
- **Reason**: No IKP-Labs agent currently posts structured, line-anchored, evidence-cited
  findings to a PR via the GitHub Reviews API — the closest existing agents
  (`swe-code-checker`, `plan-checker`) write to `generated-reports/`, not to the PR itself.
- **Adaptation notes**: see Requirement FR-6 below.

### 7. `pr-review-fixer`

- **OSE source**: `.claude/agents/pr-review-fixer.md`
- **Decision**: ADOPT
- **Reason**: Pairs with `pr-review-maker` as the fixer half of the two-role loop; no
  IKP-Labs agent currently triages and resolves GitHub review threads programmatically.
- **Adaptation notes**: see Requirement FR-6 below (shared with `pr-review-maker`).

### 8. `guard-pre-commit-env.test.sh`

- **OSE source**: `.claude/hooks/guard-pre-commit-env.test.sh`
- **Decision**: **SKIP**
- **Reason**: Investigated via `gh api` before writing this plan. The test file exercises
  a script path (`scripts/check-no-env-staged.sh`) that returns 404 in OSE today — the
  actual guard OSE runs in production has been superseded by a Rust CLI subsystem
  (`apps/rhino-cli`, invoked as `cargo run --release --manifest-path apps/rhino-cli/Cargo.toml
-- env staged-guard validate` from `.husky/pre-commit`). IKP-Labs has no Rust CLI
  tooling and no plan to adopt one — porting this would mean inventing new
  infrastructure from scratch, not syncing an existing OSE pattern, which is outside this
  skill's adopt-then-adapt spirit. Additionally, IKP-Labs already has defense-in-depth at
  the harness level: `.claude/hooks/block-env-file-access.sh` (adopted in Round 3) blocks
  Claude Code tool-level `Read`/`Write`/`Edit`/`MultiEdit` access to `.env*` files, which
  is a broader guard (covers reads, not just staged commits) than what this OSE hook
  tests. IKP-Labs's own `.husky/pre-commit` currently only runs `npx lint-staged` — adding
  a bash-only staged-`.env*` guard would be a reasonable original addition for
  defense-in-depth, but it would not be a "sync from OSE" since OSE's own current
  implementation is a Rust binary, not a portable shell script.
- **Adaptation notes**: N/A — recorded as a permanent skip. Row added to the "What
  IKP-Labs Intentionally Does NOT Adopt" table in `repo-syncing-with-ose-primer/SKILL.md`.

### 9. Sync record finalization

- **OSE source**: N/A (IKP-Labs-internal bookkeeping)
- **Decision**: N/A — required housekeeping, not an adopt/skip evaluation
- **Reason**: The `repo-syncing-with-ose-primer/SKILL.md` "Harness Inventory Reference"
  table and `plans/ideas.md` must reflect the state after PR1–PR8 land, so the next sync
  round (Round 5) does not re-evaluate already-decided items.
- **Adaptation notes**: N/A

---

## Functional Requirements

### FR-1: API Exploratory Tester Agent

**Priority**: P1-High

**Description**: Create `.claude/agents/api-exploratory-tester.md`, adapted from OSE, that
performs spec-aware, contract-aware, session-based exploratory testing of a live REST or
GraphQL API given an endpoint/base-URL and a testing goal, then files findings as a new
backlog plan under `plans/backlog/` (README + requirements + technical-design + a findings
document with steps-to-reproduce, matching the 4-document system).

**User Story**:

```text
As a developer who just shipped a kameravue-be or taskly-be endpoint
I want an agent that exercises the running API against its contract and edge cases
So that I discover contract violations, boundary bugs, and missing spec coverage before a human tester does
```

**Acceptance Criteria**:

- Given a live `kameravue-be` (`:8081`) or `taskly-be` (`:8082`) endpoint and a stated
  testing goal, when `api-exploratory-tester` is invoked, then it produces a new backlog
  plan folder with reproducible request/response evidence
- Given no endpoint or goal is provided, when the agent starts, then it asks for the
  missing input rather than inventing a target
- Given the agent's output, when reviewed, then it contains zero references to
  `ayokoding`, `organiclever`, `ose-www`, or `repo-governance/`

**Edge Cases**:

- Endpoint has no published OpenAPI/GraphQL SDL — agent must discover contract-adjacent
  ground truth (existing Gherkin specs, handler source) rather than fail
- Auth-gated endpoints — agent must use only synthetic, non-privileged test credentials,
  never real secrets

---

### FR-2: Web Tester Triad (3 Separate Agents)

**Priority**: P1-High

**Description**: Create three agent files — `web-exploratory-tester.md`,
`web-usability-tester.md`, `web-design-tester.md` — each targeting the live rendered
`kameravue-fe` frontend (`:3002`, Next.js 15.5.0, React 19.1.0) via Playwright MCP browser
tools. Each is its own PR (PR2, PR3, PR4) per the maximum-granularity directive.

**User Story**:

```text
As a developer who just shipped a kameravue-fe UI change
I want separate agents for functional correctness, usability heuristics, and design fidelity
So that each testing lens produces a focused, non-overlapping backlog plan of findings
```

**Acceptance Criteria**:

- Given a live `kameravue-fe` URL and a testing goal, when any of the three agents is
  invoked, then it drives the browser via `mcp__plugin_playwright_playwright__*` tools
  (not raw HTTP) and produces a backlog plan with severity-rated findings
- Given the three agents' descriptions, when compared, then their scope boundaries are
  mutually exclusive (functional/edge-case defects → `web-exploratory-tester`; spec-blind
  first-time-user comprehension → `web-usability-tester`; mockup/token/design-system
  fidelity → `web-design-tester`)
- Given `web-design-tester`'s ground-truth sources, when adapted, then references to a
  `libs/web-ui` design-system package are replaced with
  `apps/kameravue-fe/src/components/` and the Tailwind 4 theme config

**Edge Cases**:

- No committed design mockups exist for a given `kameravue-fe` page — `web-design-tester`
  must fall back to runtime token/theme fidelity and design-best-practice grounding
  (delegating to `web-research-maker` for the latter) rather than fail
- Frontend page requires authentication — agents must use a test account, never a real
  user's session

**Shared Web-Triad Adaptation Table**:

| OSE reference                                                   | IKP-Labs replacement                                                                                                                                      |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Example targets (ayokoding-www, organiclever-www, ose-www URLs) | `apps/kameravue-fe` (`http://localhost:3002`)                                                                                                             |
| `repo-governance/` path prefix anywhere in body/links           | `governance/` — strip links to non-existent OSE-only docs (see FR-6 table for the full dead-link list, shared across all OSE-derived agents in this plan) |
| `web-researcher` agent reference                                | `web-research-maker`                                                                                                                                      |
| `plans/apps/<product>/...` backlog path convention              | IKP-Labs flat `plans/backlog/YYYY-MM-DD__<slug>/`                                                                                                         |

---

### FR-3: PR Review Quality Gate Workflow Doc

**Priority**: P1-High

**Description**: Create `governance/workflows/pr/pr-review-quality-gate.md`, defining the
maker→fixer PR review cycle that `pr-review-maker` and `pr-review-fixer` implement. Must
land before either agent file (sequential dependency: PR5 → PR6 → PR7).

**User Story**:

```text
As a developer about to merge a PR
I want a documented, repeatable review-cycle workflow
So that pr-review-maker and pr-review-fixer have a canonical process definition to link back to
```

**Acceptance Criteria**:

- Given the OSE source document, when adapted, then all `repo-governance/` path prefixes
  become `governance/` and all links target files that actually exist in IKP-Labs (or are
  removed if no equivalent exists)
- Given IKP-Labs has exactly one delivery mode (every change goes through a PR — branch
  protection blocks direct pushes to `main`, per `CLAUDE.md` Merge Strategy), when the doc
  is adapted, then OSE's four-way "delivery mode" vocabulary (`worktree-to-pr`,
  `main-to-pr`, `worktree-to-origin-main`, `main-to-origin-main`) is replaced with a single
  statement: this workflow runs on every PR before merge
- Given the doc is created, when linked from `pr-review-maker.md` and `pr-review-fixer.md`,
  then the relative path resolves correctly (`../../governance/workflows/pr/pr-review-quality-gate.md`
  from `.claude/agents/`)

**Edge Cases**:

- OSE's doc references a `plan-execution.md` Step 8 orchestrator that has no IKP-Labs
  equivalent — the adapted doc states this workflow can be invoked standalone (by name)
  before any PR merge, not only from a larger orchestrated plan-execution pipeline

---

### FR-4: PR Review Maker Agent

**Priority**: P1-High

**Description**: Create `.claude/agents/pr-review-maker.md`, adapted from OSE, that reads a
PR's full diff plus its originating plan/issue context, then posts line-anchored,
evidence-cited findings (numeric confidence ≥ 80, CRITICAL/HIGH/MEDIUM/LOW severity) via
the GitHub Reviews API.

**User Story**:

```text
As a developer with an open PR
I want an independent reviewer that cites concrete evidence for every finding
So that I catch correctness bugs, scope creep, and CI-gaming before merging
```

**Acceptance Criteria**:

- Given an open PR, when `pr-review-maker` runs, then it pins the PR's head commit SHA
  before posting any finding
- Given a finding scores below 80 confidence, when the agent evaluates it, then it is
  dropped and never posted
- Given the agent has no `Write`/`Edit` tools, when it wants to change code, then it
  cannot — all output goes through the GitHub Reviews API only

**Edge Cases**:

- PR body/comments contain an apparent prompt-injection attempt — agent surfaces this as
  its own finding rather than silently complying or silently ignoring it
- PR has no originating plan or issue — agent judges scope from the PR description alone
  and states this limitation explicitly

---

### FR-5: PR Review Fixer Agent

**Priority**: P1-High

**Description**: Create `.claude/agents/pr-review-fixer.md`, adapted from OSE, that
enumerates every unresolved GitHub review thread, applies a 4-way triage (fix /
reject-with-reason / defer-with-reason / clarify), pushes fixes, replies to every thread,
and resolves only what it addressed.

**User Story**:

```text
As a developer with pr-review-maker findings posted on my PR
I want every thread triaged and either fixed or answered with a reasoned response
So that no review comment is silently ignored before merge
```

**Acceptance Criteria**:

- Given N unresolved threads, when `pr-review-fixer` completes a pass, then all N threads
  have a reply (fix / reject / defer / clarify) — zero threads remain both unresolved and
  untouched
- Given a thread is rejected, when the reply is posted, then it cites the specific reason
  the maker's evidence does not hold — never a bare "won't fix"
- Given the same finding is rejected across 2+ consecutive cycles, when the fixer detects
  this, then it escalates by surfacing both rejection justifications in the PR description

**Edge Cases**:

- A fix would require touching code outside the PR's declared scope — triage as
  defer-with-reason, not fix
- A finding is ambiguous (unclear what change is being requested) — triage as clarify,
  never guess

**Risk Flag (applies to FR-4 and FR-5 together)**: this agent pair automates posting and
resolving PR review comments via `gh` against **real GitHub state visible to
collaborators**, not a local sandbox. Unlike a checker/fixer pair that only writes to
`generated-reports/`, a bad interaction here is publicly visible and affects shared repo
state (open threads, PR description edits, pushed commits). Checklist Phase 3 therefore
requires a **manual dry-run test against one real, low-stakes PR** before Phase 3 is
considered done — not just agent-file creation.

**Shared Adaptation Table for FR-3, FR-4, FR-5** (dead-link resolution — none of these OSE
docs exist under IKP-Labs `governance/`, confirmed by listing the full `governance/` tree):

| OSE reference                                                                                                                                    | IKP-Labs replacement                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `repo-governance/development/quality/criticality-levels.md`                                                                                      | `.claude/skills/repo-assessing-criticality-confidence/SKILL.md` (adopted Round 3)                                                |
| `repo-governance/development/pattern/maker-checker-fixer.md`                                                                                     | `.claude/skills/repo-applying-maker-checker-fixer/SKILL.md` (adopted Round 3)                                                    |
| `repo-governance/development/quality/root-cause-orientation.md`, `ci-blocker-resolution.md`, `regression-test-mandate.md`, `evidence-capture.md` | No IKP-Labs equivalent — strip the links, keep the underlying instruction as inline prose, do not fabricate new governance files |
| `repo-governance/conventions/writing/web-research-delegation.md`                                                                                 | No IKP-Labs equivalent — strip the link; keep "delegate multi-page research to `web-research-maker`" as inline prose             |
| `repo-governance/conventions/structure/plans.md#delivery-mode`                                                                                   | Replace with a one-line note: IKP-Labs has a single delivery mode (every change via PR)                                          |
| `repo-governance/development/workflow/git-push-default.md`                                                                                       | No IKP-Labs equivalent — strip the link; `CLAUDE.md` Merge Strategy already covers this                                          |
| `web-researcher` agent                                                                                                                           | `web-research-maker`                                                                                                             |
| `plan-checker`, `ci-fixer`, `plan-fixer` sibling-agent references                                                                                | Keep as-is — these agents already exist in IKP-Labs under the same names                                                         |

---

### FR-6: Hook Decision — `guard-pre-commit-env.test.sh`

**Priority**: P3-Low

**Description**: Record the SKIP decision (see Per-Item Decision Record, item 8) in
`.claude/skills/repo-syncing-with-ose-primer/SKILL.md`'s "What IKP-Labs Intentionally Does
NOT Adopt" table. No hook file, test file, or `settings.json` change is created.

**Acceptance Criteria**:

- Given the SKILL.md table, when this PR merges, then it contains a new row for
  `guard-pre-commit-env.test.sh` with the Rust-CLI-supersession reason from the decision
  record
- Given `.claude/hooks/`, when inspected after this PR, then it is unchanged (still 5
  files, no new hook added)
- Given `.claude/settings.json`, when inspected after this PR, then it is unchanged

**Edge Cases**: None — this is a documentation-only PR.

---

### FR-7: Sync Record Finalization

**Priority**: Housekeeping (runs last)

**Description**: Update `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`'s "Harness
Inventory Reference" table (Agents, Skills, Hooks counts and "Last synced" date) and "Last
Updated" footer. Add a Round 4 entry to `plans/ideas.md` Archive → Implemented, styled
like the existing Round 3 entry, and update its "Last Updated" footer line.

**Acceptance Criteria**:

- Given PR1–PR8 are all merged, when this PR is opened, then the Agents count reflects
  47 + 6 = 53 (six new agents: `api-exploratory-tester`, `web-exploratory-tester`,
  `web-usability-tester`, `web-design-tester`, `pr-review-maker`, `pr-review-fixer`), the
  Skills count remains 30 (zero new skills added this round), and the Hooks count remains
  5 (PR8 was a documented skip)
- Given `plans/ideas.md`, when this PR merges, then it has a Round 4 bullet list under
  Archive → Implemented matching the Round 3 entry's format (phase-by-phase summary, PR
  range reference)

**Edge Cases**: If any of PR1–PR8 is not yet merged when this PR is opened, hold this PR
until all eight are merged — the counts must reflect final, merged state, not planned
state.

---

## Non-Functional Requirements

- NFR-1: All new agent files follow IKP-Labs frontmatter conventions (`name`,
  `description`, `tools`, `model`, `color`, and `skills` where applicable)
- NFR-2: No new skill files are required — all skill dependencies for every adopted item
  already exist in `.claude/skills/`
- NFR-3: No OSE-specific content (`ayokoding`, `organiclever`, `ose-www`, `wahidyankf`,
  Nx-specific-to-OSE conventions, `repo-governance/` path prefix) survives in any new file
- NFR-4: Markdown lint (`npm run lint:md`) passes on all new/modified files before each PR
  merges
- NFR-5: Each of the 9 checklist phases maps to exactly one PR — no bundling
- NFR-6: Phase 3 (PR6 + PR7) is not considered complete until a manual dry-run test
  against one real PR is documented, per the Risk Flag in FR-5
