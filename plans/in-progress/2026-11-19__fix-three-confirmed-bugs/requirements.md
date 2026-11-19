# Requirements: Fix Three Confirmed Small Bugs

## Scope

### Bug 1 — Broken CI badge link in `README.md`

- Fix both occurrences of `workflows/ci.yml` on `README.md` line 3 (badge
  image URL and click-through link) to `workflows/kameravue-ci.yml`.

### Bug 2 — Agent frontmatter `name:` mismatches

- Change `.claude/agents/docs-maker.md` line 2 `name:` from
  `documentation-writer` to `docs-maker`.
- Change `.claude/agents/docs-checker.md` line 2 `name:` from
  `docs-validator` to `docs-checker`.
- Change `.claude/agents/specs-maker.md` line 2 `name:` from
  `gherkin-spec-writer` to `specs-maker`.
- Change `.claude/agents/test-checker.md` line 2 `name:` from
  `test-validator` to `test-checker`.
- Remove the "Known frontmatter/filename mismatch (4 agents)" paragraph
  from `docs/reference/claude-agents.md` (lines 49-63, plus its trailing
  blank line).
- Remove the `⚠` marker from the `docs-maker.md` and `docs-checker.md` rows
  in the Documentation family table (lines 74-75).
- Remove the `⚠` marker from the `specs-maker.md` and `test-checker.md`
  rows in the Testing & Specs family table (lines 117, 121).
- Remove the 2 inline "Known issue" notes following the Documentation
  family table (lines 81-95, including surrounding blank lines so exactly
  one blank line remains before the next heading).
- Remove the 2 inline "Known issue" notes following the Testing & Specs
  family table (lines 124-138, including surrounding blank lines so exactly
  one blank line remains before the next heading).

### Bug 3 — Empty `model:` field in `pr-review-maker.md`

- Set `.claude/agents/pr-review-maker.md` line 5 from `model:` (empty) to
  `model: sonnet`.

## Non-Scope

- **Agent description/example prose that narrates the old agent name in
  free text.** For example, `docs-maker.md`'s `description:` field still
  says "I'll use the documentation-writer agent to create proper
  documentation..." inside its `<example>` blocks. The confirmed bug is
  specifically the structural `name:` field used by the Agent tool's
  resolution logic — rewriting narrative prose inside `description:` is a
  separate, more invasive content edit not raised in the original bug
  report, and risks scope creep into a content-quality pass this plan does
  not cover.
- **Any other `model:` or frontmatter field on any other agent file.** Only
  `pr-review-maker.md`'s empty `model:` field was confirmed broken; this
  plan does not perform a sweep of all `.claude/agents/*.md` files for other
  frontmatter issues.
- **Historical records referencing the old agent names**:
  `plans/done/**` (any plan folder), `VERIFICATION_SUMMARY.md`, and
  `docs/reference/implementation-summary.md`. All three are dated,
  point-in-time records of what was true when specific past plans ran —
  confirmed by reading their headers (`VERIFICATION_SUMMARY.md`: "Date:
  January 11, 2026 ... Plan: 2025-01-05\_\_claude-agents-infrastructure";
  `implementation-summary.md`: "Implementation Period: January 5-11, 2026").
  Editing them would falsify history, not fix a bug.
- **`generated-reports/link-audit-2026-10-15-1943.md`.** This file is
  gitignored, local-only audit output, not a tracked repo artifact. It is
  cited in `README.md` of this plan as corroborating evidence that Bug 1
  was already flagged, but this plan does not edit or depend on its
  continued presence on disk.
- **Any CI/workflow logic changes.** Bug 1 is a documentation link fix only
  — this plan does not touch `.github/workflows/kameravue-ci.yml` or
  `kameravue-scheduled-e2e.yml` themselves.
- **Invoking the `agent-maker` agent.** Resolved via grill-me (Decision 2
  below): Bug 2's frontmatter correction is a direct one-line edit per
  file, not an `agent-maker` invocation.

## Resolved Grill-Me Decisions

**Decision 1 — PR bundling strategy.** Chosen: **1 PR for all 3 bugs.**
Considered alternatives: 2 PRs split by blast radius (Bug 1 + Bug 3 trivial
edits in one PR, Bug 2 + its doc cleanup in a second), or 3 PRs (one per
bug, maximum traceability). Rejected both in favor of bundling because all
3 bugs are small, independently-confirmed, documentation/metadata-only
fixes with zero file overlap and zero shared root cause beyond being found
together in the same health-sweep — the same "bundling-when-genuinely-low-
risk beats PR-count-maximization" precedent established earlier this
session (`programming-shell` plan) and reaffirmed in
`plans/done/2026-11-12__fix-plans-readme-stale-index/`.

**Decision 2 — Bug 2 fix mechanism.** Chosen: **direct one-line frontmatter
edit per file, no `agent-maker` invocation.** Considered alternative:
invoking `agent-maker`, since `docs/reference/claude-agents.md` literally
says this mismatch is "tracked as a follow-up for `agent-maker`'s domain."
Rejected because `agent-maker` exists for creating new agents or
substantially restructuring existing ones to full convention compliance
(per `.claude/skills/agent-developing-agents`) — a single stale frontmatter
value on 4 files that are otherwise already convention-compliant doesn't
need that overhead, and risks scope creep (agent-maker "fixing" more than
the 1-line mismatch).

## User Stories

### User Story: Developer clicks the CI badge from the root README

As a developer browsing the repo on GitHub
I want the CI badge and its link to point at the real workflow
So that I land on the actual CI run history instead of a 404

**Acceptance Criteria:**

```gherkin
Scenario: CI badge link resolves to the real workflow
  Given a visitor is viewing README.md on GitHub
  When they click the CI badge at the top of the file
  Then they are taken to the kameravue-ci.yml workflow's Actions page, not a 404
```

### User Story: Developer invokes an agent by its catalog-documented name

As a developer following `docs/reference/claude-agents.md`
I want to invoke `docs-maker`, `docs-checker`, `specs-maker`, or
`test-checker` by the name the catalog tells me to use
So that the Agent tool actually resolves and runs the agent I asked for

**Acceptance Criteria:**

```gherkin
Scenario: Invoking an agent by its catalog-documented name resolves successfully
  Given the catalog at docs/reference/claude-agents.md documents an agent as "docs-maker"
  When a developer invokes the Agent tool with subagent_type "docs-maker"
  Then the Agent tool resolves and runs the docs-maker agent, not an "Agent type not found" error
```

### User Story: Developer reads the agent catalog and trusts it

As a developer reading `docs/reference/claude-agents.md`
I want the catalog to describe only bugs that still exist
So that I don't waste time investigating a frontmatter mismatch that was already fixed

**Acceptance Criteria:**

```gherkin
Scenario: Catalog no longer documents a fixed bug
  Given the 4 agent frontmatter name mismatches have been corrected
  When a developer reads docs/reference/claude-agents.md
  Then no "Known frontmatter/filename mismatch" paragraph, ⚠ marker, or inline note remains
```

### User Story: Planner expects a reasoning-grade model on `pr-review-maker`

As a developer invoking the `pr-review-maker` agent
I want it to run on the same model class as other complex-reasoning agents
So that its full-diff review and evidence-cited findings get adequate reasoning capacity

**Acceptance Criteria:**

```gherkin
Scenario: pr-review-maker has an explicit, correct model value
  Given .claude/agents/pr-review-maker.md previously had an empty model field
  When a developer reads its frontmatter after this fix
  Then model: sonnet is set, matching its sibling pr-review-fixer.md and other reasoning-heavy agents
```

## Success Criteria

- `grep -c "workflows/ci\.yml" README.md` returns `0`; `grep -c
"workflows/kameravue-ci\.yml" README.md` returns `2`.
- `grep -n "^name:" .claude/agents/docs-maker.md` returns `name: docs-maker`;
  same pattern confirmed for `docs-checker.md`, `specs-maker.md`,
  `test-checker.md` against their respective correct names.
- `grep -n "mismatch\|⚠" docs/reference/claude-agents.md` returns zero
  matches.
- `grep -n "^model:" .claude/agents/pr-review-maker.md` returns
  `model: sonnet`.
- All changes land on `main` via a single merged PR.
