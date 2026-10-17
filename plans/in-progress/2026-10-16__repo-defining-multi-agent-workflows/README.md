# Repo: Defining Multi-Agent Workflows — Implementation Plan

**Status**: 🏗️ In Progress
**Created**: October 16, 2026
**Type**: Infrastructure (Claude Code harness — new skill)
**Priority**: P2-Medium

---

## Overview

IKP-Labs syncs harness improvements from the senior reference repo (`wahidyankf/ose-public`)
via the workflow in `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`. During Round 5 of
that sync, one OSE item — `repo-defining-workflows` (skill) — was recorded as **DEFER**, not
**SKIP**: IKP-Labs already has a skill directory at the exact same name,
`.claude/skills/repo-defining-workflows/SKILL.md`, but it covers a different capability
entirely (git/PR conventions — branch naming, PR lifecycle, trunk-based development). OSE's
skill of the same name is a standard for **authoring reusable multi-agent orchestration
documents** — markdown specs that describe how multiple Claude Code agents coordinate through
sequential, parallel, or conditional phases, with documented inputs/outputs and Gherkin-style
success criteria.

The product decision needed to close this DEFER has now been made: **adopt OSE's capability
under a brand-new skill name**, `repo-defining-multi-agent-workflows`, adapted to IKP-Labs's
actual tooling (the `Agent` tool and the `repo-applying-maker-checker-fixer` skill — not OSE's
own runtime concepts), and proven against IKP-Labs's own real example of this kind of document:
`governance/workflows/pr/pr-review-quality-gate.md`.

This plan creates the new skill, retrofits that real example to conform to it, fixes an
adjacent stale index file discovered along the way, and closes out the DEFER record in
`repo-syncing-with-ose-primer/SKILL.md`.

---

## Important Correction to the Original Task Framing

The original task description assumed a `Workflow` tool exists in this session (a
`pipeline()`/`parallel()`/`agent()` script API, parallel to OSE's own orchestration runtime).
**This tool does not exist in this environment** — confirmed by searching this session's actual
tool definitions. The only real orchestration primitive available is the `Agent` tool (spawn
subagents, optional `isolation: worktree`). `governance/workflows/pr/pr-review-quality-gate.md`
itself confirms this is the correct grounding: it is a pure prose/markdown spec with a "Loop
Algorithm" pseudocode block, executed by a human or an orchestrating agent reading and following
the document — not a tool-executable script. The new skill is written against this reality: it
documents how to **author the markdown spec**, not how to call a nonexistent tool.

---

## Scope Summary

See [requirements.md](./requirements.md) for the full scope/non-scope breakdown. In short:

- **In scope**: a new skill (`repo-defining-multi-agent-workflows`), a full retrofit of
  `governance/workflows/pr/pr-review-quality-gate.md` against it, a fix to the stale
  `governance/workflows/README.md` placeholder, and closing the DEFER record in
  `repo-syncing-with-ose-primer/SKILL.md`.
- **Out of scope**: creating any new agent to own this skill, touching the existing
  (differently-scoped) `repo-defining-workflows` skill, and any change to
  `repo-workflow-maker`/`-checker`/`-fixer`'s remit.

---

## Key Decisions (resolved via grill-me before writing)

| #   | Decision                                              | Resolution                                                                                                                                                                                                                                                     |
| --- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | New skill name                                        | `repo-defining-multi-agent-workflows`                                                                                                                                                                                                                          |
| 2   | Retrofit `pr-review-quality-gate.md`?                 | Yes — full retrofit, its own dedicated PR (PR2)                                                                                                                                                                                                                |
| 3   | Agent `permission.skill:` ownership                   | None yet — documentation-only, applied ad hoc                                                                                                                                                                                                                  |
| 4   | Stale `governance/workflows/README.md`                | Fixed in this plan, bundled into PR2                                                                                                                                                                                                                           |
| 5   | DEFER record resolution                               | Remove the row entirely; add a Harness Inventory line                                                                                                                                                                                                          |
| 6   | PR granularity                                        | 3 PRs (see below)                                                                                                                                                                                                                                              |
| 7   | Frontmatter on `pr-review-quality-gate.md` ("Fork 1") | Yes — two-key YAML (`description`/`when_to_use`), matching OSE verbatim. Resolved via live grilling after the written design's first draft had defaulted to no frontmatter; `governance/workflows/README.md` is unaffected (it's an index, not a workflow doc) |
| 8   | Termination Criteria format ("Fork 2")                | Gherkin OR an equivalently rigorous, command-backed enumerated checklist — not mandatory Gherkin. Matches the written design's original default, confirmed via live grilling                                                                                   |

Decisions 7 and 8 surfaced as new forks while writing `technical-design.md` (not part of the
original six) and were resolved via a second round of live grilling, per `grill-me`'s rule that
a fork emerging mid-write must be grilled before the plan is done. See
[technical-design.md](./technical-design.md)'s "Adaptation Decisions" subsection for the full
reasoning and the section-mapping impact.

---

## PR Breakdown

| PR  | Scope                                                                                                                                      | Commit type |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| PR1 | Create `.claude/skills/repo-defining-multi-agent-workflows/SKILL.md`                                                                       | `docs`      |
| PR2 | Retrofit `governance/workflows/pr/pr-review-quality-gate.md` to the new standard; fix `governance/workflows/README.md`'s stale placeholder | `docs`      |
| PR3 | Resolve the DEFER record in `repo-syncing-with-ose-primer/SKILL.md`; archive this plan to `plans/done/`                                    | `docs`      |

This plan-creation itself is not counted as one of the three PRs above (per the task that
produced this plan) — it lands in its own setup commit/PR before PR1 begins.

---

## Documents

- [requirements.md](./requirements.md) — Scope, non-scope, user stories, success criteria
- [technical-design.md](./technical-design.md) — Skill content design, retrofit mapping, adaptation decisions
- [checklist.md](./checklist.md) — Per-PR tasks, phase gates, validation steps

---

## Related

- `.claude/skills/repo-syncing-with-ose-primer/SKILL.md` — the sync workflow this plan closes a DEFER item for
- `.claude/skills/repo-defining-workflows/SKILL.md` — the existing, differently-scoped skill this plan does NOT touch
- `governance/workflows/pr/pr-review-quality-gate.md` — the real worked example this plan retrofits
- `plans/done/2026-08-05__claude-governance-gap-round-5/` — the archived round that recorded the original DEFER
