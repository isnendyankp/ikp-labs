# Technical Design

## Architecture Overview

All deliverables are meta files: 6 new agent files under `.claude/agents/`, 1 new
governance workflow doc under `governance/workflows/pr/`, and updates to 2 existing
bookkeeping files (`.claude/skills/repo-syncing-with-ose-primer/SKILL.md`,
`plans/ideas.md`). No application code (`apps/kameravue-fe`, `apps/kameravue-be`,
`apps/taskly-be`) is changed by this plan — these agents _test_ those apps at runtime,
they do not modify them.

```text
.claude/
└── agents/
    ├── api-exploratory-tester.md      [PR1 — new]
    ├── web-exploratory-tester.md      [PR2 — new]
    ├── web-usability-tester.md        [PR3 — new]
    ├── web-design-tester.md           [PR4 — new]
    ├── pr-review-maker.md             [PR6 — new]
    └── pr-review-fixer.md             [PR7 — new]

governance/
└── workflows/
    └── pr/                            [PR5 — new subdirectory]
        └── pr-review-quality-gate.md  [PR5 — new]

.claude/skills/repo-syncing-with-ose-primer/SKILL.md   [PR8 + PR9 — updated]
plans/ideas.md                                          [PR9 — updated]
```

No entries are added to `.claude/hooks/` or `.claude/settings.json` — PR8's decision is
SKIP (see requirements.md FR-6). No new `.claude/skills/` directory is created — every
adopted item in this round reuses skills that already exist.

**Testing-target architecture (what the 4 new tester agents actually exercise):**

```text
                    ┌─────────────────────────────┐
                    │   api-exploratory-tester     │
                    │   (curl / Bash — no browser) │
                    └──────────┬───────────────────┘
                               │ HTTP requests
                 ┌─────────────┼─────────────────┐
                 ▼                               ▼
      kameravue-be :8081                 taskly-be :8082
      (Spring Boot 3.x, Java 17)          (Go 1.26, Gin, pgx)

                    ┌───────────────────────────────────┐
                    │   web-exploratory-tester           │
                    │   web-usability-tester             │
                    │   web-design-tester                │
                    │   (Playwright MCP browser tools)    │
                    └──────────────┬──────────────────────┘
                                   │ browser session
                                   ▼
                        kameravue-fe :3002
                        (Next.js 15.5.0, React 19.1.0)
```

**PR review quality gate architecture:**

```text
  Developer opens PR ──────────────────────────────────────────┐
                                                                 ▼
                                              governance/workflows/pr/
                                              pr-review-quality-gate.md
                                              (defines the N-cycle loop)
                                                                 │
                    ┌────────────────────────────────────────────┤
                    ▼                                            ▼
          pr-review-maker                              pr-review-fixer
          (reads diff + plan/issue,                     (lists unresolved
           posts line-anchored                           threads, 4-way
           findings via GitHub                           triage, pushes
           Reviews API)                                   fixes, replies,
                    │                                     resolves)
                    └───────────────┬────────────────────────────┘
                                    ▼
                          CI-green gate before
                          next cycle / merge
```

---

## Agent Frontmatter Pattern

All 6 new agents follow the IKP-Labs frontmatter convention (see
`.claude/agents/README.md` Triad Model and prior rounds' `technical-design.md` for
precedent):

```yaml
---
name: agent-name
description: >-
  [1-sentence purpose, trigger conditions inline]
tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch
model: sonnet
color: green
skills:
  - skill-name-1
  - skill-name-2
---
```

`pr-review-maker` deviates from this pattern in two ways, both taken directly from OSE and
preserved as-is (not an adaptation error):

- `tools:` omits `Write`/`Edit` — it only posts through the GitHub Reviews API, never
  edits files directly
- `model:` is left **blank** (`model:` with no value) — this means "inherit the
  orchestrator's model" (typically `opus`), matching OSE's stated justification that this
  agent needs judgment-heavy, planning-grade reasoning (weighing evidence for a confidence
  score, detecting prompt injection, distinguishing CI-gaming from legitimate
  simplification) rather than a mechanical rule check

---

## PR1: `api-exploratory-tester`

| Field  | Value                                                                                                                                    |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| File   | `.claude/agents/api-exploratory-tester.md`                                                                                               |
| Tools  | `Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch`                                                                               |
| Model  | `sonnet`                                                                                                                                 |
| Color  | `green` (tester role — quality discovery, matches web-triad convention)                                                                  |
| Skills | `plan-creating-project-plans`, `plan-writing-gherkin-criteria`, `docs-applying-content-quality` (all pre-existing, zero new skill files) |

**Body adaptation checklist** (applied while rewriting the OSE source, not a literal
copy-paste):

1. Replace every `organiclever-be`/`ose-be` example URL with `kameravue-be` (`:8081`,
   Spring Boot 3.x, Java 17, Maven) and `taskly-be` (`:8082`, Go 1.26, Gin, pgx,
   golang-jwt, golang-migrate)
2. Replace the `specs/apps/<product>/containers/contracts/openapi.yaml` path convention
   with a runtime-discovery instruction: check for a committed OpenAPI/Swagger doc first
   (none currently exists for either backend), otherwise treat handler source and
   existing `specs/**` Gherkin as the closest available ground truth
3. Strip the link to `repo-governance/development/quality/evidence-capture.md` (no
   IKP-Labs equivalent); keep the instruction to capture request/response evidence under
   the backlog plan's `evidence/` subfolder as plain prose
4. Rename `web-researcher` → `web-research-maker` everywhere it is referenced as a
   delegation target
5. Output destination: `plan` mode targets IKP-Labs's flat `plans/backlog/YYYY-MM-DD__<slug>/`
   structure (4-document system), not OSE's app-nested convention
6. Remove the "Relationship to Other Agents" cross-reference to `web-researcher` docs path
   and repoint to `.claude/agents/web-research-maker.md`

---

## PR2–PR4: Web Tester Triad

Each is created in its own PR with identical frontmatter shape; only `name`,
`description`, and the body's testing lens differ.

| Agent                    | File                                       | Color   | Skills (shared, pre-existing)                                                                   |
| ------------------------ | ------------------------------------------ | ------- | ----------------------------------------------------------------------------------------------- |
| `web-exploratory-tester` | `.claude/agents/web-exploratory-tester.md` | `green` | `plan-creating-project-plans`, `plan-writing-gherkin-criteria`, `docs-applying-content-quality` |
| `web-usability-tester`   | `.claude/agents/web-usability-tester.md`   | `green` | (same three)                                                                                    |
| `web-design-tester`      | `.claude/agents/web-design-tester.md`      | `green` | (same three)                                                                                    |

All three: `tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch`, `model: sonnet`.

**Confirmed via OSE `.claude/skills/` directory listing (30 entries)**: no skill file
named `web-exploratory-*`, `web-usability-*`, or `web-design-*` exists in OSE either —
these three agents rely on Playwright MCP browser tools
(`mcp__plugin_playwright_playwright__browser_navigate`, `_snapshot`, `_click`, `_type`,
`_take_screenshot`, `_console_messages`, `_network_requests`, etc.), which this
environment already exposes as deferred MCP tools. No new skill directory is created.

**Shared body adaptation checklist** (applies to all three agents):

1. Replace all example targets with `apps/kameravue-fe` (`http://localhost:3002`,
   Next.js 15.5.0, React 19.1.0)
2. Strip `repo-governance/` links per the FR-5 dead-link table in requirements.md; keep
   underlying instructions as prose
3. Rename `web-researcher` → `web-research-maker`
4. Output destination targets IKP-Labs's flat `plans/backlog/` structure
5. `web-design-tester` only: replace the `libs/web-ui` design-system-primitives ground
   truth source with `apps/kameravue-fe/src/components/` and the Tailwind CSS 4 theme
   config (`apps/kameravue-fe/tailwind.config.*` or the CSS-based theme tokens if Tailwind
   4's CSS-first config is in use — verify at implementation time which config style
   `kameravue-fe` actually uses before writing this section)
6. Each agent's description must keep the explicit disjoint-scope language from OSE
   (exploratory = functional/edge-case defects; usability = spec-blind heuristic
   evaluation; design = mockup/token/design-system fidelity) so the three never overlap

---

## PR5: `governance/workflows/pr/pr-review-quality-gate.md`

**File**: `governance/workflows/pr/pr-review-quality-gate.md` (new file, new `pr/`
subdirectory under `governance/workflows/`)

**Structural adaptation** — OSE's version opens with a YAML frontmatter block
(`name`/`title`/`goal`/`termination`/`inputs`/`outputs`). IKP-Labs's existing workflow
docs (`governance/development/workflow/implementation.md`) use **plain Markdown headings
with no YAML frontmatter**, per the `repo-defining-workflows` skill's documented pattern
(a table of required files, then straight prose/tables — no structured frontmatter
metadata). Adapt the OSE doc to drop the YAML frontmatter block and open directly with a
`# PR-Review Maker→Fixer Cycle Workflow` H1, folding the `goal`/`termination`/`inputs`/
`outputs` fields into an opening **Purpose** / **When to Use** prose section instead, to
stay consistent with the rest of `governance/workflows/`.

**Content sections to carry over from OSE** (adapted):

1. **Purpose** and **When to use** — adapt "every `*-to-pr` delivery mode" to "every PR,
   since IKP-Labs has exactly one delivery mode: all changes go through a PR (branch
   protection blocks direct pushes to `main`, per `CLAUDE.md` Merge Strategy)"
2. **Execution Mode** — keep as-is: sequential, hard-gated, N cycles (default 3), never
   parallel
3. **Participants** — `pr-review-maker` and `pr-review-fixer`, linking to
   `.claude/agents/pr-review-maker.md` and `.claude/agents/pr-review-fixer.md` (relative
   path from `governance/workflows/pr/` is `../../../.claude/agents/...`)
4. **Loop Algorithm** — keep the pseudocode and Mermaid sequence diagram as-is; both agent
   names stay identical, so no renaming needed inside the diagram
5. **Steps 0–4** — keep the 5-step structure (resolve inputs, per-cycle maker pass,
   per-cycle fixer pass, per-cycle CI gate, done-definition check), replacing
   `repo-governance/` links per the FR-5 dead-link table
6. **GitHub Reviews API Mechanics** — keep verbatim; this is GitHub-API mechanics, not
   OSE-specific content
7. **Done-Definition for `*-to-pr` Modes** — rename section to **Done-Definition**,
   dropping the "`*-to-pr`" qualifier since it is now unconditional

**Cross-references to update elsewhere** (evaluate at implementation time, do not assume
mandatory):

- `CLAUDE.md` Merge Strategy section could optionally link to this new workflow doc as
  the review step before "Merge Strategy" is honored — this is a nice-to-have, not a hard
  requirement, since `CLAUDE.md`'s existing Merge Strategy section already covers the
  branch → PR → merge mechanics and this workflow is a refinement of the "Review" step
  within it, not a replacement
- `AGENTS.md`'s Agent Families table (`## Agent Families`) could gain a new row/family for
  `pr-review-maker`/`pr-review-fixer` — evaluate against the existing three families
  (Documentation, Planning, Testing & Specs) at implementation time; if a fourth family
  ("PR Quality Gate") is warranted, add it, otherwise list both agents under a note in the
  existing table structure. This decision is made during PR6/PR7 implementation, not PR5.

---

## PR6: `pr-review-maker`

| Field  | Value                                                               |
| ------ | ------------------------------------------------------------------- |
| File   | `.claude/agents/pr-review-maker.md`                                 |
| Tools  | `Read, Bash, Grep, Glob, WebFetch, WebSearch` (no `Write`/`Edit`)   |
| Model  | _(blank — inherits orchestrator model, typically opus)_             |
| Color  | `blue`                                                              |
| Skills | _(none — matches OSE, which lists no `skills:` key for this agent)_ |

Body carries over: Core Responsibility (pin head SHA → read diff → read plan/issue →
form findings), Finding Requirements (confidence ≥ 80 hard floor, CRITICAL/HIGH/MEDIUM/LOW
severity, concrete `file:line` evidence, anti-sycophantic framing), Scope Guard,
CI-Gaming Watch, Untrusted-Input Handling, GitHub Reviews API Mechanics, Identity and
Write-Scope Note (documents the temporary "post under existing `gh` identity + AI
attribution footer" fallback since IKP-Labs has no dedicated bot/App identity either),
Maker-Fixer Loop Framing, Cross-Cycle Behavior, External Fact Verification.

Apply the FR-5 dead-link adaptation table from requirements.md throughout. Link
`pr-review-quality-gate.md` at `../../governance/workflows/pr/pr-review-quality-gate.md`.

---

## PR7: `pr-review-fixer`

| Field  | Value                                 |
| ------ | ------------------------------------- |
| File   | `.claude/agents/pr-review-fixer.md`   |
| Tools  | `Read, Edit, Write, Bash, Grep, Glob` |
| Model  | `sonnet`                              |
| Color  | `yellow`                              |
| Skills | _(none — matches OSE)_                |

Body carries over: Core Responsibility (enumerate unresolved threads → 4-way triage →
apply → reply → resolve), Enumerating Unresolved Threads (GraphQL `reviewThreads`
query pattern), the 4-way triage table (fix / reject-with-reason / defer-with-reason /
clarify) with the "reject requires a higher bar than disagree" rule, Reply and Resolve
Discipline, Escalation on Repeated Rejection (2+ consecutive same-finding rejections),
Untrusted-Input Handling, Identity and Write Scope, **Re-Run Quality Gates Before Every
Push** (adapt the example command from Nx-specific `nx affected -t typecheck lint
test:quick specs:coverage` to IKP-Labs's actual commands — `npm run lint`, `npm test`, the
relevant Maven/`mvn test` or `go test ./...` command depending on which app the fix
touches), Maker-Checker-Fixer Framing (Two-Role Variant).

Apply the same FR-5 dead-link adaptation table. Link `pr-review-quality-gate.md` the same
way as PR6.

---

## PR8: Hook Decision (Documentation-Only)

No new file. Edit only
`.claude/skills/repo-syncing-with-ose-primer/SKILL.md`, adding one row to the "What
IKP-Labs Intentionally Does NOT Adopt" table:

```markdown
| `.claude/hooks/guard-pre-commit-env.test.sh` | Tests a superseded `scripts/check-no-env-staged.sh` path (404 in OSE); OSE's actual guard now lives in a Rust CLI (`apps/rhino-cli`) IKP-Labs does not have. IKP-Labs already has equivalent protection via `.claude/hooks/block-env-file-access.sh` (Round 3) |
```

No changes to `.claude/hooks/` directory contents or `.claude/settings.json`.

---

## PR9: Sync Record Finalization

**File 1**: `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`

Update the "Harness Inventory Reference" table:

```markdown
| Area   | Count | Last synced          |
| ------ | ----- | -------------------- |
| Agents | 53    | 2026-07-10 (Round 4) |
| Skills | 30    | 2026-06-15 (Round 3) |
| Hooks  | 5     | 2026-06-02 (Round 3) |
```

(Skills and Hooks "Last synced" dates stay at their Round 3 values since neither count
changed this round — only Agents changed.)

Update the `**Last Updated**:` footer to `2026-07-10`.

**File 2**: `plans/ideas.md`

Add a new bullet under `### ✅ Implemented`, immediately above the existing
"Claude Governance Gap Round 3 — ALL DONE" entry, styled identically:

```markdown
- **Claude Governance Gap Round 4 — ALL DONE** (completed 2026-07-10)
  - Phase 1: `api-exploratory-tester` agent (live API exploratory testing, kameravue-be + taskly-be)
  - Phase 2: web tester triad — `web-exploratory-tester`, `web-usability-tester`, `web-design-tester`
  - Phase 3: PR review quality gate — `governance/workflows/pr/pr-review-quality-gate.md` +
    `pr-review-maker` + `pr-review-fixer`
  - Phase 4 (Skipped): `guard-pre-commit-env.test.sh` hook — tests an OSE path superseded by a
    Rust CLI IKP-Labs does not have; existing `block-env-file-access.sh` already covers the gap
  - Implemented across PRs #<first>–#<last>
```

Update the trailing `**Last Updated**:` footer line to reflect the Round 4 addition, same
style as the existing footer's parenthetical note pattern.

---

## Commit Strategy

Each PR is a single squash-merged commit onto `main`. Suggested per-PR commit subjects
(final squash title, following `governance/development/workflow/implementation.md`'s
`type(scope): subject` convention):

```text
chore(agents): add api-exploratory-tester
chore(agents): add web-exploratory-tester
chore(agents): add web-usability-tester
chore(agents): add web-design-tester
docs(governance): add pr-review-quality-gate workflow
chore(agents): add pr-review-maker
chore(agents): add pr-review-fixer
docs(skills): record guard-pre-commit-env.test.sh as permanent skip
docs(plan): finalize claude-governance-gap-round-4 sync record
```
