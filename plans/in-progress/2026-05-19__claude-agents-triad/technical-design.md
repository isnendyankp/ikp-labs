# Technical Design: Claude Agents Maker/Checker/Fixer Triad

## Approach

Pure file rename + new file creation. No app code changes. No behavior changes on renamed agents.

## Agent Frontmatter Schema

All agents in `.claude/agents/` use this schema:

```markdown
---
name: { agent-name }
description: { description with \n escaped newlines }
model: sonnet
color: { color }
permission.skill:
  - { skill-name }
---

{agent body}
```

**Rule**: `name:` field must match the filename (without `.md`).

## Role Definitions

| Role               | Responsibility                                      |
| ------------------ | --------------------------------------------------- |
| `{domain}-maker`   | Create new artifacts for the domain from scratch    |
| `{domain}-checker` | Validate/audit existing artifacts, generate reports |
| `{domain}-fixer`   | Fix issues found by checker, apply corrections      |

## File Operations Per Phase

### Phase 1 — `plan` Domain

```text
RENAME:  .claude/agents/plan-writer.md  →  .claude/agents/plan-maker.md
         (update frontmatter name: plan-maker, update description)

CREATE:  .claude/agents/plan-fixer.md
         (new agent: fixes issues found by plan-checker)

KEEP:    .claude/agents/plan-checker.md  (no change)
```

### Phase 2 — `docs` Domain

```text
RENAME:  .claude/agents/documentation-writer.md  →  .claude/agents/docs-maker.md
         (update frontmatter name: docs-maker, update description)

RENAME:  .claude/agents/docs-validator.md  →  .claude/agents/docs-checker.md
         (update frontmatter name: docs-checker, update description)

CREATE:  .claude/agents/docs-fixer.md
         (new agent: fixes issues found by docs-checker)
```

### Phase 3 — `test` Domain

```text
RENAME:  .claude/agents/test-validator.md  →  .claude/agents/test-checker.md
         (update frontmatter name: test-checker, update description)

CREATE:  .claude/agents/test-maker.md
         (new agent: creates E2E/unit tests from specs/requirements)

CREATE:  .claude/agents/test-fixer.md
         (new agent: fixes failing or flaky tests)
```

### Phase 4 — `specs` Domain

```text
RENAME:  .claude/agents/gherkin-spec-writer.md  →  .claude/agents/specs-maker.md
         (update frontmatter name: specs-maker, update description)

CREATE:  .claude/agents/specs-checker.md
         (new agent: validates Gherkin specs completeness and quality)

CREATE:  .claude/agents/specs-fixer.md
         (new agent: fixes spec issues found by specs-checker)
```

## New Agent Content Template

New agents (fixer/maker/checker) follow the same structure as existing agents.
Body must reference IKP-Labs tech stack and project structure.

```markdown
---
name: {domain}-{role}
description: {one-line description}
model: sonnet
color: purple
permission.skill:
  - {relevant-skill}
---

You are a {role} agent for the **IKP-Labs** project...

## Responsibilities

...
```

## Git Strategy

Each phase = separate branch + PR. Branch naming:

```text
Phase 1:  chore/claude-agents-plan-triad
Phase 2:  chore/claude-agents-docs-triad
Phase 3:  chore/claude-agents-test-triad
Phase 4:  chore/claude-agents-specs-triad
```

Commit type: `chore` (agent infrastructure maintenance).

## Risk

**Low** — only `.claude/agents/` files modified. CI only checks app code (lint/test/build).
Markdown lint runs on `.md` files — ensure frontmatter and body pass lint.

Rollback = revert single PR. No inter-phase dependencies.
