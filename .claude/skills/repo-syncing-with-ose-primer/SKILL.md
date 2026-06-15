# Skill: Syncing with OSE Primer

**Category**: Repository Maintenance
**Purpose**: Workflow for discovering, evaluating, and adopting improvements from the ose-public senior repo into IKP-Labs `.claude/`
**Used By**: repo-harness-compatibility-checker, repo-harness-compatibility-fixer, repo-setup-manager

---

## Overview

IKP-Labs follows a **primer model**: the senior repo (`wahidyankf/ose-public`) acts as a reference harness. When the senior repo ships new agents, skills, hooks, or harness improvements, IKP-Labs evaluates and adopts what is applicable.

This skill defines the sync workflow: what to diff, how to evaluate, and how to adapt content from OSE context to IKP-Labs context.

---

## When to Sync

Sync when any of the following occur:

- Senior repo ships a new agent or skill that solves a gap you've encountered
- IKP-Labs `plan-checker` or `repo-harness-compatibility-checker` flags a missing capability
- A new governance round is planned (`plans/in-progress/YYYY-MM-DD__claude-governance-gap-*`)
- More than 4 weeks have passed since the last sync

---

## Sync Workflow

### Step 1 — Discover what's new in the senior repo

Compare `.claude/` directories between repos. Focus on three areas:

```bash
# List agents in IKP-Labs
ls .claude/agents/

# Compare against senior repo agents (manual or cloned locally)
ls <path-to-ose-public>/.claude/agents/

# Same for skills
ls .claude/skills/
ls <path-to-ose-public>/.claude/skills/
```

Build a diff table:

| Item | In OSE | In IKP-Labs | Action |
|------|--------|-------------|--------|
| `agent-maker.md` | ✅ | ✅ | — already synced |
| `new-agent.md` | ✅ | ❌ | Evaluate |
| `kameravue-specific.md` | ❌ | ✅ | — IKP-Labs only, keep |

---

### Step 2 — Evaluate each gap item

For every item in OSE that IKP-Labs lacks, answer these questions:

| Question | Yes → | No → |
|----------|--------|-------|
| Does IKP-Labs have the use case this addresses? | Adopt | Skip |
| Is the item OSE-specific (ayokoding, OSE branding, OSE stack)? | Adapt | Skip if unadaptable |
| Does IKP-Labs already have an equivalent under a different name? | Map / alias | — |
| Would adopting this item require IKP-Labs infrastructure that doesn't exist? | Defer | — |

**Common skip reasons:**

- References `apps/ayokoding-web/` (no educational content app in IKP-Labs)
- References OSE-specific CI infra or deployment scripts
- Requires Gradle (IKP-Labs uses Maven)
- Duplicates an existing IKP-Labs agent with different naming

---

### Step 3 — Adapt content for IKP-Labs

When adopting an item, strip OSE context and replace with IKP-Labs equivalents:

| OSE reference | IKP-Labs replacement |
|---|---|
| `apps/ayokoding-web/` | *(remove — no equivalent)* |
| `apps/ose-*` | `apps/kameravue-fe/` or `apps/kameravue-be/` |
| Gradle / `./gradlew` | Maven / `./mvnw` |
| `ayokoding` branding | `IKP-Labs` / `KameraVue` |
| OSE domain examples | IKP-Labs domains: CI, docs, plans, specs, harness |
| `repo-governance/` | `governance/` |

**IKP-Labs tech stack for replacement examples:**

- Frontend: Next.js 15.5.0, React 19.1.0, TypeScript, Tailwind CSS 4
- Backend: Spring Boot 3.3.6, Java 17, PostgreSQL, Maven
- Testing: Playwright, JUnit 5, Mockito
- Monorepo: Nx (not OSE's structure)
- Ports: FE `:3002`, BE `:8081`, DB `:5432`

---

### Step 4 — Record the decision

For every evaluated item, record the outcome in the governance round checklist:

```markdown
### <item-name>

**OSE source**: `.claude/agents/some-agent.md`
**Decision**: ADOPT / SKIP / DEFER
**Reason**: [One sentence — use case match or mismatch]
**Adaptation notes**: [What was changed from OSE version, if adopted]
```

This prevents re-evaluating the same item in future sync rounds.

---

### Step 5 — Implement adopted items

Follow the standard Meta Changes workflow for each adopted item:

1. `git checkout -b chore/<item-name>`
2. Create the file with IKP-Labs adaptations
3. Run `npm run lint:md` — fix all errors before committing
4. Commit: agent + checklist update together
5. Push → PR → CI → merge `--rebase --delete-branch`
6. Update local main

One PR per item. Do not batch multiple agents or skills into one PR.

---

## Harness Inventory Reference

Current IKP-Labs harness state (update after each sync round):

| Area | Count | Last synced |
|------|-------|-------------|
| Agents | 44 | 2026-06-11 (Round 3) |
| Skills | 27 | 2026-06-15 (Round 3) |
| Hooks | 5 | 2026-06-02 (Round 3) |

---

## What IKP-Labs Intentionally Does NOT Adopt

Document permanent skips here to avoid re-evaluation:

| OSE item | Skip reason |
|---|---|
| `docs-tutorial-maker/checker/fixer` | No `apps/ayokoding-web/` educational content app |
| `docs-creating-by-example-tutorials` | Depends on tutorial triad (N/A) |
| `docs-creating-in-the-field-tutorials` | Depends on tutorial triad (N/A) |
| `docs-software-engineering-separation-*` | No content/code app separation in IKP-Labs |
| Opencode sync permissions | No `.opencode/` folder or sync scripts |

---

## Related Skills

- **repo-applying-maker-checker-fixer** — MCF pattern used when creating new triads from OSE
- **repo-assessing-criticality-confidence** — For prioritizing which gaps to close first
- **repo-understanding-repository-architecture** — IKP-Labs harness structure overview

---

**Last Updated**: 2026-06-15
