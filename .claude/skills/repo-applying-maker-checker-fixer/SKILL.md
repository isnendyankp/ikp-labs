# Skill: Applying the Maker-Checker-Fixer Pattern

**Category**: Repository Governance
**Purpose**: Define the Maker-Checker-Fixer (MCF) pattern used in IKP-Labs — what each role does, when to use a full triad vs. a single agent, and how to name and structure MCF agents.
**Used By**: repo-setup-manager, agent-maker

---

## Overview

IKP-Labs uses a **Maker-Checker-Fixer (MCF) triad** pattern for quality-sensitive workflows. Each role has a distinct responsibility and toolset. A triad produces reliable, auditable output because the checker is independent of the maker, and the fixer acts only on confirmed findings.

---

## Roles

| Role | Responsibility | Typical tools |
|------|---------------|---------------|
| **Maker** | Creates or updates content (docs, plans, agents, config) | Read, Write, Edit, Glob, Grep |
| **Checker** | Validates content against a standard; writes an audit report | Read, Glob, Grep, Write (reports only) |
| **Fixer** | Reads checker report, re-validates each finding, applies targeted corrections | Read, Write, Edit |

### Key constraints

- **Checker never fixes** — it only reports. This keeps audit output trustworthy.
- **Fixer always re-validates** — it reads the actual file before applying any change. A finding that is already resolved is skipped, not re-applied.
- **Maker does not read checker output** — the maker creates from source; the fixer is the bridge between checker and corrected state.

---

## When to Use a Full Triad

Use a full Maker-Checker-Fixer triad when:

- The output will be committed to the repository and reviewed by others
- Errors are hard to spot by eye (e.g., broken links, missing frontmatter keys, Diátaxis category violations)
- The domain has explicit, enumerable rules (a skill or standard document exists)
- The fix operation is mechanical and auditable (not a judgment call)

Use a **single agent** (maker only) when:

- The task is exploratory or conversational (no committed artifact)
- The output will be immediately reviewed by the user before any action
- There is no enumerable rule set to check against

---

## Existing Triads in IKP-Labs

| Domain | Maker | Checker | Fixer |
|--------|-------|---------|-------|
| README files | `readme-maker` | `readme-checker` | `readme-fixer` |
| CI workflows | `ci-checker` | — | `ci-fixer` |
| Documentation | `documentation-writer` | `docs-validator` | `docs-fixer` |
| Docs links | `docs-link-checker` | — | `docs-link-fixer` |
| Docs files | `docs-file-manager` | — | — |
| Plans | `plan-maker` | `plan-checker` | `plan-fixer` |
| Repo rules | `repo-rules-maker` | `repo-rules-checker` | `repo-rules-fixer` |
| Repo workflows | `repo-workflow-maker` | `repo-workflow-checker` | `repo-workflow-fixer` |
| Harness config | — | `repo-harness-compatibility-checker` | `repo-harness-compatibility-fixer` |
| PDF to Markdown | `pdf-to-md-maker` | `pdf-to-md-checker` | `pdf-to-md-fixer` |
| Gherkin specs | `gherkin-spec-writer` | `specs-checker` | `specs-fixer` |
| E2E tests | `test-maker` | `test-validator` | `test-fixer` |

---

## Naming Convention

```text
<domain>-maker.md
<domain>-checker.md
<domain>-fixer.md
```

Examples: `readme-maker`, `ci-checker`, `docs-fixer`

For domain compound names, use full kebab-case: `repo-harness-compatibility-checker`.

Agent files live in `.claude/agents/`. Skill files live in `.claude/skills/<skill-name>/SKILL.md`.

---

## Audit Report Convention

Checker agents write reports to `generated-reports/` using this filename pattern:

```text
<domain>-audit__YYYY-MM-DD-HHMM__audit.md
```

Reports are gitignored — they are local and CI artifacts only. Only `README.md` and `.gitkeep` are tracked in `generated-reports/`.

---

## Criticality Levels in Reports

Checker agents classify findings using `wow-criticality-assessment`:

| Level | Meaning |
|-------|---------|
| CRITICAL | Broken behavior — must fix before next commit |
| HIGH | Significant gap — fix this sprint |
| MEDIUM | Quality issue — fix next sprint |
| LOW | Minor — fix when convenient |

Fixer agents process findings in CRITICAL → HIGH → MEDIUM → LOW order.

---

## Related Skills

- `repo-understanding-repository-architecture` — IKP-Labs repo layout and agent catalog
- `wow-criticality-assessment` — severity classification system
- `repo-generating-validation-reports` — audit report format reference

---

**Last Updated:** June 2026
