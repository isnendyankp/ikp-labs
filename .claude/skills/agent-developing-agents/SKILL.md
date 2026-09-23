# Skill: Developing AI Agents

**Category**: Meta
**Purpose**: Standards for creating new Claude agent files in IKP-Labs
**Used By**: agent-maker

---

## Agent File Structure

Every agent lives in `.claude/agents/<name>.md` with required frontmatter:

```yaml
---
name: agent-name              # kebab-case, matches filename
description: >                # when to use this agent (shown in FleetView)
  One sentence trigger condition. Key responsibilities:
  - Responsibility 1
  - Responsibility 2

  Examples:
  - <example>User: "..."
    Assistant: "I'll use agent-name to..."</example>
model: sonnet | haiku          # see model selection below
color: blue | green | yellow | purple | red | orange
permission.skill:              # optional: pre-loaded skills
  - skill-name-1
  - skill-name-2
---

Agent body — instructions to Claude when acting as this agent.
```

---

## Model Selection

### Decision Matrix

| Dimension | `sonnet` | `haiku` |
|---|---|---|
| Reasoning depth | Multi-step, judgment-based | Minimal, mechanical |
| Task ambiguity | Handles open-ended / structured-but-nuanced problems | Requires a deterministic, fully-specified flow |
| Output originality | Generates non-trivial code, makes design decisions | Executes a fixed procedure (rename, move, reformat) |
| Error recovery | Adapts to unexpected states, re-validates before acting | Fails or reports — doesn't reason about the unexpected |
| Typical agent role | Checkers, fixers, makers, developers — the large majority | File/permission managers doing pure mechanical transforms |
| Relative cost | Higher — reserve for tasks that actually need the reasoning | Lower — use freely once a task is confirmed mechanical |

Argue past `haiku` first, not down from `sonnet`: default to `sonnet` unless the task is
verifiably pure pattern-matching/file-ops with no judgment calls anywhere in its
workflow. Getting this wrong in the expensive direction (`sonnet` for trivial work) just
costs more; getting it wrong in the cheap direction (`haiku` for judgment-requiring work)
produces silently wrong output, which is the worse failure mode — when genuinely unsure,
default to `sonnet`.

**Decision guide** (walk top to bottom, first match wins):

1. Purely mechanical, fully-specified transform (rename, move, reformat, chmod)? →
   `haiku` — see `docs-file-manager.md` for a concrete example
2. Otherwise → `sonnet` (the default for the large majority of agents: checkers, fixers,
   makers, developers — anything requiring judgment, code generation, or re-validation
   before acting)
3. Omit the field entirely → inherits the parent session's model (usually `sonnet`) —
   acceptable, but an explicit declaration is preferred so the choice is visible to
   future maintainers, not just an accident of what happened to be running

### Common Mistakes

| Mistake | Problem | Correction |
|---|---|---|
| Using `haiku` for a checker/fixer | Validation and re-validation require judgment `haiku` can't reliably apply — produces false positives/negatives silently | Use `sonnet` for any agent that assesses, validates, or decides |
| Using `haiku` for content creation | Lacks the reasoning depth for non-trivial generated content (code, prose, structured docs) | Use `sonnet` for makers and developers |
| Defaulting to `sonnet` "just in case" for pure file-ops | Unnecessary cost for genuinely mechanical work | If the task is a fully-specified deterministic transform, use `haiku` |
| Omitting `model` to mean "the default" | An absent field reads as an oversight, not a deliberate choice — harder for a future maintainer to tell whether it was considered | Declare the model explicitly even when it matches the inherited default |
| Picking a model without writing why | Future maintainers can't assess whether the choice still fits as the agent's scope evolves | State the reasoning in a comment or the agent's own Model Selection note when the choice isn't obvious from the decision guide alone |

---

## Color Convention (Role)

| Color | Role | When |
|-------|------|------|
| `blue` | Maker | Creates new artifacts |
| `green` | Checker | Validates existing artifacts |
| `yellow` | Fixer | Fixes issues found by checker |
| `purple` | Developer | Implements features |
| `red` | Critic | Reviews for quality |
| `orange` | Orchestrator | Coordinates other agents |

---

## Naming Convention

Agent files follow `<domain>-<role>.md`:

```text
docs-maker.md         — creates docs
docs-checker.md       — validates docs
docs-fixer.md         — fixes docs
plan-maker.md         — creates plans
swe-typescript-dev.md — TypeScript developer
swe-ui-checker.md     — validates UI components
agent-maker.md        — creates new agents
```

---

## Description Field

The `description` field is critical — it determines when Claude auto-selects this agent.

Good description:

```yaml
description: >
  Use this agent to create new UI components following IKP-Labs Tailwind 4
  conventions. Creates component file, props interface, and unit tests.

  Key responsibilities:
  - Create React component with TypeScript props
  - Apply Tailwind 4 classes following design standards
  - Write Jest + React Testing Library tests
  - Ensure accessibility (ARIA, focus-visible)

  Examples:
  - <example>User: "Create a PhotoCard component"
    Assistant: "I'll use swe-ui-maker to create the PhotoCard component
    following IKP-Labs conventions."</example>
```

Bad description:

```yaml
description: Makes UI components.
```

---

## Body Structure

Use this order:

```markdown
You are a [role description] for IKP-Labs.

## When to Use This Agent

[Optional — see "When to Use This Agent" section below for when to include it]

## Project Context

[Tech stack and paths relevant to this agent]

## Core Responsibilities

[What this agent does — numbered list]

## Tools Usage

[Optional — see "Tools Usage" section below for when to include it]

## Workflow

[Step-by-step process]

## Reference Documentation

**Related Agents:**
- `agent-name` — brief role

**Skills:**
- `skill-name` — what it provides

---

**Agent Version:** 1.0
**Last Updated:** Month Year
```

---

## Tools Usage

Optional section documenting which tools an agent uses and why — helps users understand
capabilities and maintainers understand dependencies.

**Add this section when**:

- The agent declares 4+ tools
- Tool selection isn't obvious from the agent's description
- The agent has an unusual tool combination

**Skip it when**: the agent has 2-3 obvious tools and follows a standard family pattern
(see the examples below — most agents in a family look alike, so document once per
family rather than in every file if the pattern is truly standard).

**Placement**: after Core Responsibilities, before the detailed Workflow section.

**Pattern:**

```markdown
## Tools Usage

- **Read**: Read files to validate/create/fix
- **Glob**: Find files by pattern in directories
- **Grep**: Extract content patterns (code blocks, commands, etc.)
- **Write**: Create/update files and reports
- **Bash**: Run shell commands, timestamps, file operations
- **Edit**: Apply fixes to existing files
- **WebFetch**: Access official documentation URLs
- **WebSearch**: Find authoritative sources, verify claims
```

**Worked example — Checker agents** (`Read, Glob, Grep, Write, Bash`):

```markdown
## Tools Usage

- **Read**: Read files to validate
- **Glob**: Find files matching the domain's pattern
- **Grep**: Extract code blocks, commands, version numbers
- **Write**: Generate audit reports to `generated-reports/`
- **Bash**: Run verification commands, generate timestamps
```

**Worked example — Fixer agents** (`Read, Edit, Bash, Write`):

```markdown
## Tools Usage

- **Read**: Read audit reports and files to fix
- **Edit**: Apply targeted fixes to the flagged files
- **Bash**: Run shell commands, re-validation checks
- **Write**: Generate fix reports to `generated-reports/`
```

**Worked example — Maker agents** (`Read, Write, Glob, Grep`):

```markdown
## Tools Usage

- **Read**: Read existing files for context
- **Write**: Create the new artifact
- **Glob**: Find related files for cross-references
- **Grep**: Extract patterns for consistency with existing content
```

---

## When to Use This Agent

Optional section clarifying when to reach for this agent versus a related one —
improves discoverability and prevents misuse.

**Add this section when**:

- The agent's scope overlaps with another agent's (e.g., multiple checkers in the same
  family)
- Users might confuse this agent with a related one (maker vs. fixer, checker vs. maker)
- The agent has a specific prerequisite (e.g., it needs an existing audit report)

**Placement**: early in the file, right after the opening description — before Project
Context.

**Pattern:**

```markdown
## When to Use This Agent

**Use when**:

- [Primary use case 1]
- [Primary use case 2]
- [Specific scenario that fits]

**Do NOT use for**:

- [Anti-pattern 1] (use `other-agent` instead)
- [Anti-pattern 2] (use a different tool/approach)
- [Common misuse scenario]
```

**Worked example — Checker agents:**

```markdown
## When to Use This Agent

**Use when**:

- Validating content before merge/release
- Auditing existing content for standards compliance
- Reviewing changes for a specific quality dimension

**Do NOT use for**:

- Fixing found issues (use the matching `*-fixer` agent)
- Creating new content (use the matching `*-maker` agent)
- Domains outside this checker's declared scope (use the correct domain's checker)
```

**Worked example — Fixer agents:**

```markdown
## When to Use This Agent

**Use when**:

- A `*-checker` audit report already exists with findings to act on
- Findings have been reviewed and confirmed worth fixing

**Do NOT use for**:

- Initial validation (use the matching `*-checker` agent first)
- Content creation (use the matching `*-maker` agent)
- Ad-hoc manual fixes with no audit report — use `Edit` directly instead
```

---

## Skills Integration

Reference skills in frontmatter AND in the body:

```yaml
# frontmatter
permission.skill:
  - plan-creating-project-plans
  - wow-criticality-assessment
```

```markdown
# body
**See `plan-creating-project-plans` skill** for 4-document structure standards.
**See `wow-criticality-assessment` skill** for issue severity classification.
```

---

## IKP-Labs Specific Rules

1. No OSE-specific content (Open Sharia Enterprise, Nx, Golang)
2. Reference IKP-Labs paths: `apps/kameravue-fe/`, `apps/kameravue-be/`
3. Use IKP-Labs coverage: ≥70% FE, ≥80% BE
4. Use IKP-Labs test stack: Jest + RTL (FE), JUnit 5 + H2 (BE)
5. Use IKP-Labs dev servers: FE `http://localhost:3002`, BE `http://localhost:8081`
6. Commit type: `feat | fix | refactor | style | docs | test | chore | config`

---

## Creating a New Agent — Checklist

- [ ] File in `.claude/agents/<name>.md`
- [ ] Frontmatter: name, description, model, color
- [ ] Description has trigger condition, responsibilities, examples
- [ ] Body has project context, responsibilities, workflow
- [ ] Skills referenced in frontmatter and body
- [ ] No placeholder content
- [ ] Markdown lint passes
- [ ] Force-add with `git add -f` (`.claude/` is in `.gitignore`)
