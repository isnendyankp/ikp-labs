# Repo: Defining Multi-Agent Workflows — Requirements

## Scope

### In-Scope ✅

1. **New skill directory and file**: `.claude/skills/repo-defining-multi-agent-workflows/SKILL.md`
   — adapted from OSE's `repo-defining-workflows` skill content (full source text verified and
   quoted in [technical-design.md](./technical-design.md)), stripped of OSE-specific runtime
   concepts, grounded in IKP-Labs's actual `Agent` tool and the
   `repo-applying-maker-checker-fixer` skill, and illustrated exclusively with IKP-Labs's real
   example — `governance/workflows/pr/pr-review-quality-gate.md` — never an invented or
   OSE-carried-over example.
2. **Full retrofit of `governance/workflows/pr/pr-review-quality-gate.md`** against the new
   skill's canonical section set, as its own dedicated PR (PR2), preserving:
   - Every fact currently documented (participants, loop algorithm, GitHub Reviews API
     mechanics, done-definition, escalation rules) — a reorganization, not a content rewrite,
     except where the new skill's standard requires added structure (e.g., explicit Inputs/
     Outputs sections) or a format change resolved in [technical-design.md](./technical-design.md).
   - The `#loop-exit-and-escalation-rules` anchor that `.claude/agents/pr-review-fixer.md:185`
     links to — either kept verbatim or updated in the same PR if the heading text changes.
3. **Fix to `governance/workflows/README.md`**, bundled into PR2: replace the stale
   `> Placeholder — workflow docs will be added here...` line with an accurate index that lists
   the real `pr/pr-review-quality-gate.md` file and notes the skill now backing it.
4. **Resolution of the DEFER record** in
   `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`: remove the `repo-defining-workflows`
   row from the "Deferred — Needs Product Decision" table, add a line to the "Harness Inventory
   Reference" table reflecting the new skill count, and bump the file's "Last Updated" footer —
   as its own dedicated PR (PR3), which also carries this plan's archival move
   (`plans/in-progress/ → plans/done/`).

### Non-Scope ❌

1. **No new agent** is created to own this skill. No existing agent's `permission.skill:` list
   is modified (resolved in grilling: documentation-only, applied ad hoc, until a real consumer
   agent is justified).
2. **No change to the existing `repo-defining-workflows` skill** — it keeps its current
   git/PR-convention scope untouched. This plan does not rename, merge, or deprecate it.
3. **No change to `repo-workflow-maker`/`repo-workflow-checker`/`repo-workflow-fixer`'s remit** —
   their canonical document set (`branching-strategy.md`, `pr-workflow.md`,
   `trunk-based-development.md`, `release-process.md`) is untouched; this plan does not fold
   orchestration-doc authorship into their job.
4. **No fabricated `Workflow` tool integration** — this session has no such tool (verified
   against this session's actual tool definitions); the new skill does not reference one.
5. **No retrofit of any other governance document** beyond
   `governance/workflows/pr/pr-review-quality-gate.md` and the `governance/workflows/README.md`
   index fix — there is exactly one real multi-agent orchestration document in this repo today,
   and this plan does not invent a second one to retrofit.
6. **No change to `pr-review-maker.md` or `pr-review-fixer.md`'s own content** beyond, if
   necessary, a single link-text update in `pr-review-fixer.md` to keep the
   `#loop-exit-and-escalation-rules` anchor valid after the retrofit (a one-line fix, not a
   content change to that agent's behavior).
7. **No update to `plans/README.md`'s plan index** — out of scope for this plan (which only
   creates plan documents); left for whoever runs the plan-setup commit.

---

## Functional Requirements

### FR-1: New Skill — `repo-defining-multi-agent-workflows`

**Priority**: P1-High

**Description**: Create `.claude/skills/repo-defining-multi-agent-workflows/SKILL.md`, a
standard for authoring reusable multi-agent orchestration documents in IKP-Labs, adapted from
OSE's `repo-defining-workflows` skill.

**User Story**:

```text
As a contributor authoring or retrofitting a multi-agent orchestration document
I want a documented standard for what such a document must contain
So that every orchestration doc in governance/workflows/ is structured consistently and is
actually usable by whoever runs it
```

**Acceptance Criteria**:

- Given the new skill file does not yet exist, when this plan's PR1 lands, then
  `.claude/skills/repo-defining-multi-agent-workflows/SKILL.md` exists with the required
  `SKILL.md` convention header (Category, Purpose, Used By) matching the pattern used by
  sibling skills (e.g., `repo-applying-maker-checker-fixer/SKILL.md`).
- Given the skill's content, when it is read, then it contains zero references to OSE-specific
  concepts ("Rhino", the N+1 background-agent concurrency model, `repo-governance/` cross-links)
  — verified by `grep -i` for these terms returning no matches.
- Given the skill's content, when it illustrates the standard with a worked example, then the
  example is `governance/workflows/pr/pr-review-quality-gate.md` (the only real IKP-Labs
  document of this kind) — never an invented OSE-style example name
  (`plan-quality-gate.md`, `rules-quality-gate.md`) that has no IKP-Labs equivalent.
- Given the skill's content references IKP-Labs's orchestration mechanism, when it names a
  tool, then it names the `Agent` tool (and, where relevant, cross-references
  `repo-applying-maker-checker-fixer`) — never a `Workflow` tool, which does not exist in this
  environment.

**Edge Cases**:

- The skill must not claim `repo-workflow-maker` (or any other existing agent) as a current
  consumer, since research confirmed none of them author this kind of document today.

---

### FR-2: Retrofit `governance/workflows/pr/pr-review-quality-gate.md`

**Priority**: P1-High

**Description**: Reshape the existing document's organic sections into the new skill's
canonical section set, without losing any currently documented fact, and without breaking the
one known external cross-reference to it.

**User Story**:

```text
As a future reader of governance/workflows/pr/pr-review-quality-gate.md
I want the document structured per a documented, consistent standard
So that I know exactly where to find the goal, inputs, outputs, steps, and success criteria of
this orchestration, the same way I would in any other workflow doc this repo later adds
```

**Acceptance Criteria**:

- Given the retrofit is complete, when the document is read, then its top-level sections map
  onto the new skill's canonical set (see [technical-design.md](./technical-design.md) for the
  exact mapping table) with no information loss versus the pre-retrofit version.
- Given `.claude/agents/pr-review-fixer.md:185` links to
  `../../governance/workflows/pr/pr-review-quality-gate.md#loop-exit-and-escalation-rules`, when
  the retrofit lands, then that anchor still resolves (either the heading text is unchanged, or
  `pr-review-fixer.md`'s link is updated in the same PR).
- Given the retrofitted document, when `npm run lint:md` runs, then it reports zero new errors
  introduced by this change.

**Edge Cases**:

- The retrofit must not alter any normative behavior described in the doc (cycle count default
  of 3, hard-ceiling semantics, `COMMENT`-state-only GitHub Reviews API limitation, escalation
  rules) — this is a structural reorganization, not a behavior change.

---

### FR-3: Fix `governance/workflows/README.md` Stale Placeholder

**Priority**: P3-Low

**Description**: Replace the placeholder note with an accurate index entry for the real file
that already exists under `governance/workflows/pr/`.

**User Story**:

```text
As a contributor browsing governance/workflows/
I want the README to reflect what's actually in the directory
So that I don't believe the directory is empty when it already contains a real, load-bearing
workflow document
```

**Acceptance Criteria**:

- Given the current content is `> Placeholder — workflow docs will be added here as the project
scales...`, when this plan's PR2 lands, then the README lists
  `pr/pr-review-quality-gate.md` with a one-line description and references the
  `repo-defining-multi-agent-workflows` skill as the standard it follows.

---

### FR-4: Resolve the DEFER Record

**Priority**: P2-Medium

**Description**: Close out the `repo-defining-workflows` DEFER row in
`repo-syncing-with-ose-primer/SKILL.md` now that the blocking product decision has been made and
implemented.

**User Story**:

```text
As a future contributor running the next OSE sync round
I want resolved DEFER items removed from the open-decisions table
So that I don't re-evaluate an item that has already been decided and implemented
```

**Acceptance Criteria**:

- Given the "Deferred — Needs Product Decision" table currently has one row for
  `repo-defining-workflows`, when PR3 lands, then that row is removed and the table contains
  zero rows referencing this item.
- Given the "Harness Inventory Reference" table currently states `Skills | 30`, when PR3 lands,
  then it states `Skills | 31` with an updated "Last synced" note describing this addition.
- Given the file's `**Last Updated**` footer, when PR3 lands, then it reflects the date of this
  change.

---

## Non-Functional Requirements

### NFR-1: No Speculative Agent Scope

No agent's `permission.skill:` list gains an entry for this skill as part of this plan (resolved
via grilling — Q3). No new agent is created.

### NFR-2: Documentation Quality

All new/changed markdown passes `npm run lint:md` with zero new errors, per
`docs-applying-content-quality` and the repo's markdownlint PostToolUse hook
(`format-lint-markdown.sh`).

### NFR-3: No Fabricated Tooling References

No document created or edited by this plan references a `Workflow` tool, OSE's "Rhino" runtime,
or an N+1 background-agent concurrency model — none of these exist in this environment.

### NFR-4: Traceability

Every claim in this plan's `technical-design.md` is labeled `[Repo-grounded]`,
`[Judgment call]`, or `[Unverified]` per `plan-creating-project-plans`'s anti-hallucination rule.

---

## Requirements Traceability Matrix

| Requirement ID | Implementing PR | Verification                                                                                                                        |
| -------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| FR-1           | PR1             | `test -f .claude/skills/repo-defining-multi-agent-workflows/SKILL.md`; grep for OSE terms returns nothing                           |
| FR-2           | PR2             | Section-mapping table satisfied; `grep -n "loop-exit-and-escalation-rules" .claude/agents/pr-review-fixer.md` still resolves        |
| FR-3           | PR2             | `governance/workflows/README.md` no longer contains the word "Placeholder"                                                          |
| FR-4           | PR3             | `grep -c "repo-defining-workflows" .claude/skills/repo-syncing-with-ose-primer/SKILL.md` drops by exactly one DEFER-table reference |

---

## Success Criteria

- [ ] `.claude/skills/repo-defining-multi-agent-workflows/SKILL.md` exists, adapted, and free of
      OSE-specific runtime references.
- [ ] `governance/workflows/pr/pr-review-quality-gate.md` is retrofitted to the new skill's
      canonical section set with zero information loss and the `pr-review-fixer.md` cross-reference
      intact.
- [ ] `governance/workflows/README.md` accurately reflects the directory's real contents.
- [ ] `repo-syncing-with-ose-primer/SKILL.md`'s DEFER table no longer lists
      `repo-defining-workflows`; its Harness Inventory table reflects the new skill count.
- [ ] All three implementation PRs pass the repo's PR-review quality gate
      (`governance/workflows/pr/pr-review-quality-gate.md`) and CI before merge.
- [ ] This plan is archived to `plans/done/` with its checklist fully checked.
