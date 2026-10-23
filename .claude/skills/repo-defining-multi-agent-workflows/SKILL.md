# Skill: Defining Multi-Agent Workflows

**Category**: Repository Governance
**Purpose**: Standards for authoring reusable, validated multi-agent orchestration documents in
IKP-Labs — documents that describe how multiple Claude Code agents coordinate through
sequential, parallel, or conditional phases toward a shared, verifiable goal.
**Used By**: None yet — applied ad hoc (by `plan-maker`, or directly in conversation) when
authoring or retrofitting a workflow document. See "Adoption Note" below.

---

## Adoption Note

No agent currently declares this skill in `permission.skill:`. It is applied ad hoc today — read
directly during plan work (e.g., by `plan-maker`) or in conversation, whenever someone authors or
retrofits a `governance/workflows/` orchestration document. If a dedicated authoring agent for
this domain is ever justified, add this skill to its `permission.skill:` list and update this
note.

---

## Overview

A **workflow document** describes how two or more Claude Code agents coordinate to reach a
shared, verifiable goal — who does what, in what order, and how the loop knows it's done.
`governance/workflows/pr/pr-review-quality-gate.md` is IKP-Labs's real example: a sequential,
hard-gated review loop between `pr-review-maker` and `pr-review-fixer`. This skill defines the
standard such documents follow, grounded in IKP-Labs's actual tooling — the `Agent` tool (which
spawns the subagents a workflow document describes) and the
`repo-applying-maker-checker-fixer` skill (the pattern most workflow documents implement) — not
any external orchestration runtime.

---

## Document Structure

Every workflow document under `governance/workflows/` opens with a two-key YAML frontmatter
block, then the body carries the full contract as plain markdown H2 headings:

```markdown
---
description: "[one-line goal, colon-quoted if it contains a colon]"
when_to_use: "[one-line trigger — colon-quoted if it contains a colon]"
---

# [Workflow Name]

## Goal and Termination

## Inputs

## Outputs

## Steps

## Termination Criteria

## Example Usage

## Related Workflows
```

Frontmatter carries only the two metadata keys (`description`, `when_to_use`) — the contract
itself (goal, inputs, outputs, steps, termination, examples, related docs) always lives in the
body as H2 sections, never as additional frontmatter keys. The identifier is the filename stem,
not a frontmatter field.

**The YAML colon-quoting rule**: a frontmatter value containing a colon MUST be quoted, e.g.
`description: "PR-Review Maker→Fixer Cycle: sequential review loop"`. An unquoted colon breaks
YAML parsing.

---

## Execution Patterns

**Sequential** — steps run strictly one after another, each gated on the previous one
completing. `pr-review-quality-gate.md` is the worked example: a fixed-N-cycle loop
(`pr-review-maker` → `pr-review-fixer` → CI-green gate), repeated in strict order, never in
parallel, with a hard ceiling on cycle count.

**Parallel** — independent steps run concurrently, with no step depending on another's output.
*No IKP-Labs example yet.*

**Conditional** — a step's execution depends on a prior step's outcome (e.g., "if CRITICAL
findings exist, run the fixer; otherwise skip to done"). *No IKP-Labs example yet.*

**Mixed** — a workflow combining sequential, parallel, and/or conditional phases in the same
document. *No IKP-Labs example yet.*

---

## Standard Parameters

The one parameter pattern IKP-Labs's real example actually uses:

- **Cycle/iteration count** (number, with an explicit default and a documented hard ceiling) —
  `pr-review-quality-gate.md` uses `N = 3`, described as "a hard ceiling — never extended past
  this count." Every workflow document with a loop MUST document both the default and the
  ceiling explicitly, not just the default.

Optional, not-yet-exercised parameters a workflow MAY document if relevant:

- **dry-run** (boolean, default: false): preview without executing
- **verbose** (boolean, default: false): detailed logging

---

## Common Mistakes

### ❌ Mistake 1: Unquoted colons in YAML

**Wrong**:

```yaml
description: Workflow name: detailed description
```

**Right**:

```yaml
description: "Workflow name: detailed description"
```

### ❌ Mistake 2: Contract fields in frontmatter

**Wrong**: `goal`, `termination`, `inputs`, or `outputs` as frontmatter keys — they fail the
closed metadata schema and hide the contract from readers.
**Right**: exactly `description` and `when_to_use` in frontmatter; the contract lives in the body
sections.

### ❌ Mistake 3: Missing agent dependencies

**Wrong**: Marking two steps as parallel when the second needs the first one's output.
**Right**: Sequential execution with the dependency stated explicitly — `pr-review-quality-gate.md`'s
own `Steps` section names a `Depends on` field per step for exactly this reason.

### ❌ Mistake 4: No success criteria

**Wrong**: A workflow document with no way to tell when it's actually done.
**Right**: A `Termination Criteria` section with enumerated, independently-verifiable conditions
— see `pr-review-quality-gate.md`'s `Termination Criteria` section for the standard this repo
holds itself to.

### ❌ Mistake 5: Missing iteration ceiling

**Wrong**: A loop with a default cycle count but no stated maximum — risks running unbounded if
the termination condition is never met.
**Right**: State both the default AND the hard ceiling explicitly, as `pr-review-quality-gate.md`
does ("default 3, a hard ceiling — never extended past this count").

---

## Workflow File Naming

**Convention**: `[workflow-name].md`, plain-named, no numbered prefix — e.g.
`pr-review-quality-gate.md`.

---

## Quality Checklist

Before publishing a workflow document:

- [ ] Frontmatter carries exactly `description` and `when_to_use` (colons quoted)
- [ ] `Goal and Termination` section: goal is clear and concise, termination condition stated
- [ ] `Inputs` section documents every input (type, required or optional, default)
- [ ] `Outputs` section documents every output (type, pattern for file outputs)
- [ ] Execution phases clearly defined (sequential, parallel, conditional, or mixed)
- [ ] Dependencies between steps stated explicitly
- [ ] `Termination Criteria` section: Gherkin Given/When/Then OR an equivalently rigorous,
      independently-verifiable enumerated checklist (each item naming an exact command or
      observable state) — not free prose without verification hooks
- [ ] If the workflow loops, both the default cycle count AND the hard ceiling are documented
- [ ] `Example Usage` section provided
- [ ] `Related Workflows` section links related documents

---

## Example Usage

`governance/workflows/pr/pr-review-quality-gate.md` is this standard's worked example — its own
retrofit (PR #324 of the plan that created this skill) has merged, so its `## Example Usage`
section is live. That section promotes the loop's pseudocode and a mermaid sequence diagram
showing `pr-review-maker` → GitHub Reviews API → `pr-review-fixer` → CI, repeated for a fixed
cycle count. Read that document's `## Example Usage` section directly rather than duplicating it
here — this skill's job is to define the standard, not maintain a second copy of the example.

---

## Related Skills

- `repo-applying-maker-checker-fixer` — the maker-checker-fixer pattern most workflow documents implement
- `plan-writing-gherkin-criteria` — Gherkin acceptance-criteria format, one valid option for Termination Criteria
- `repo-understanding-repository-architecture` — IKP-Labs repo layout and governance model

---

**Last Updated:** 2026-10-17
