# Technical Design: Project Governance

---

## Target Repository Structure

```
IKP-Labs/
├── governance/                          (NEW)
│   ├── README.md                        (NEW) - index and navigation
│   ├── vision.md                        (NEW) - Layer 1
│   ├── principles.md                    (NEW) - Layer 2
│   ├── conventions.md                   (NEW) - Layer 3
│   └── ai-agent-guidelines.md           (NEW) - Layer 3.5 / AI extension
│
├── .workflow-template.md                (UPDATE) - add governance references
│
├── docs/
│   └── explanation/
│       ├── README.md                    (UPDATE) - add link to governance.md
│       └── governance.md               (NEW) - explains 6-layer model
│
├── apps/                                (NO CHANGE)
├── plans/                               (NO CHANGE to existing plans)
└── specs/                               (NO CHANGE)
```

---

## Governance Layer Model

```
Layer 6  plans/                   Ephemeral - individual work plans
   |
Layer 5  .workflow-template.md    Workflows - step-by-step procedures
   |
Layer 4  .workflow-template.md    Development conventions - task types, commit strategy
   |
Layer 3  governance/conventions.md   Shared standards - naming, format, structure
   |
Layer 2  governance/principles.md    Values - what guides decisions
   |
Layer 1  governance/vision.md        Purpose - why this project exists
```

Higher layers provide context for lower layers. When a lower layer is ambiguous, look up to the next layer for guidance.

---

## Phase 1: Foundation Documents

### governance/README.md

Entry point for the governance folder. Contains:
- One-sentence summary of what governance is in this project
- List of all governance documents with a one-line description each
- Explanation of the 6-layer model in brief (3-5 lines)
- Note pointing to `docs/explanation/governance.md` for the full explanation

### governance/vision.md

Structure:
```
# Vision

## Project Purpose
[Why does IKP-Labs exist? What problem does it solve?]

## Target Users
[Who uses this system? Be specific.]

## What Success Looks Like
[Concrete, observable outcomes that indicate the project is working well]

## Long-Term Goals
[Where is this project headed? What would a mature version look like?]
```

Content guidance based on the current project state:
- IKP-Labs is a full-stack photo gallery application serving as a learning platform for modern web development practices
- It demonstrates NX monorepo management, Spring Boot + Next.js integration, and real-world testing strategies
- Target users are developers learning the stack and the project owner building portfolio work
- Success means: all apps build cleanly, tests pass in CI, and the codebase serves as a reference for NX monorepo patterns

### governance/principles.md

Structure per principle:
```
## [Number]. [Principle Name]

**Statement**: [One sentence]

**Rationale**: [Why this matters for IKP-Labs specifically]

**In practice**:
- [Concrete example 1]
- [Concrete example 2]
```

Recommended principles derived from observed project patterns:

1. **Test-First Confidence** — Write tests before or alongside features, never as an afterthought. Evidenced by the project's existing 30% coverage threshold in `jest.config.js` and comprehensive Gherkin specs.

2. **Explicit Over Implicit** — Prefer clear, readable code over clever shortcuts. Evidenced by the project's use of named DTOs, explicit endpoint paths, and typed TypeScript.

3. **Incremental Change** — Make one change at a time with a focused PR. Evidenced by the 7-PR-per-phase approach in the Nx test migration plan.

4. **Documentation as Code** — Documentation lives alongside code in the repository and is updated in the same PR. Evidenced by `.workflow-template.md` and `docs/` being tracked in git.

5. **DX Consistency** — Developer experience commands should be uniform across apps. Evidenced by the NX migration goal to unify `nx test <app>` and `nx e2e <app>` patterns.

6. **Separation of Concerns** — Keep layers distinct: specs from implementations, plans from docs, frontend from backend. Evidenced by `specs/`, `plans/`, `docs/`, `apps/` being separate top-level folders.

7. **Security by Default** — Authentication and authorization must be implemented correctly from the start, not retrofitted. Evidenced by the JWT authentication architecture and protected routes implementation.

### governance/conventions.md

Sections:

```
# Conventions

## Commit Messages
## Branch Naming
## Pull Request Format
## TypeScript Conventions
## Java Conventions
## File and Folder Naming
## Plan Naming
```

**Commit Messages** — formalize the pattern already in `.workflow-template.md`:

```
<type>: <description>

Types:
- feat     New feature
- fix      Bug fix
- refactor Code refactoring without behavior change
- style    Formatting, missing semicolons, whitespace
- docs     Documentation only
- test     Adding or updating tests
- chore    Maintenance, dependency updates
- config   Configuration changes (CORS, env, API endpoints)

Rules:
- Lowercase description
- No period at end
- Present tense ("add feature" not "added feature")
- Max 72 characters on first line
```

**Branch Naming** — formalize the pattern already in `.workflow-template.md`:

```
<type>/<short-description>

Examples:
- feat/photo-albums
- fix/login-redirect
- refactor/auth-service
- docs/governance-layer
- chore/update-dependencies
- config/cors-settings
- hotfix/critical-login-bug
- test/gallery-e2e-coverage
```

**Pull Request Format** — derived from existing `gh pr create` usage:

```
Title: "<type>: short description" (max 70 chars)

Body:
## Summary
- Bullet point changes (3-5 max)

## Test Plan
- [ ] Manual step 1
- [ ] Manual step 2
```

**TypeScript Conventions:**
- Files: `PascalCase` for components (`PhotoCard.tsx`), `camelCase` for utilities (`apiClient.ts`), `kebab-case` for pages (`photo-upload/page.tsx`)
- Components: PascalCase named exports
- Hooks: camelCase prefixed with `use` (`useScrollRestoration`)
- Types/Interfaces: PascalCase (`PhotoCardProps`)
- Constants: `SCREAMING_SNAKE_CASE` for true constants
- API call functions: `camelCase` verbs (`fetchPhotos`, `uploadPhoto`)

**Java Conventions:**
- Classes: PascalCase (`PhotoController`, `PhotoService`)
- Methods: camelCase verbs (`uploadPhoto`, `getPhotoById`)
- Packages: all lowercase (`com.registrationform.api.controller`)
- DTOs: suffix `Request` or `Response` (`UploadPhotoRequest`, `PhotoResponse`)
- Services: `@Service` singleton beans
- Controllers: `@RestController` with `@RequestMapping("/api/<resource>")` base path

**File and Folder Naming:**
- App folders: `kebab-case` (`kameravue-fe`, `kameravue-be-e2e`)
- Spec files: `kebab-case.feature` (`photo-upload.feature`)
- Plan folders: `YYYY-MM-DD__kebab-case` (`2026-04-18__project-governance`)
- Documentation files: `kebab-case.md` (`ci-cd-workflow-strategy.md`)

---

## Phase 2: Integration Documents

### .workflow-template.md Update

Add a new section at the top of the file (after the quick reference table, before the full workflow):

```markdown
## Governance Reference

Before starting any work, you can consult the governance layer relevant to your decision:

| Question | Document |
|----------|----------|
| Why does this project exist? | `governance/vision.md` |
| Which approach aligns with project values? | `governance/principles.md` |
| What naming/format should I use? | `governance/conventions.md` |
| How should I structure a plan? | `plans/README.md` |
| How should I structure an explanation doc? | `docs/explanation/README.md` |

See `docs/explanation/governance.md` for the full governance model.
```

Also update the "2. Check/Create Plan" section to reference `governance/conventions.md` for the plan naming convention.

### docs/explanation/governance.md

Structure:
```
# Governance Model

## Why Governance?
## The 6-Layer Model
## Layer 1: Vision
## Layer 2: Principles
## Layer 3: Conventions
## Layer 4: Development
## Layer 5: Workflows
## Layer 6: Plans
## How Layers Interact
## For AI Agents
```

This document explains the *why* behind the model — it is conceptual, not procedural. It does not duplicate the content of `governance/` documents; it explains the structure and reasoning.

---

## Phase 3: AI Agent Guidelines

### governance/ai-agent-guidelines.md

Structure:
```
# AI Agent Guidelines

## Purpose
## Governance Consultation Order
## Decision Types and Which Layer Applies
## Handling Ambiguity
## What AI Agents Should NOT Do
## Plan Creation Protocol
## Code Change Protocol
## Documentation Protocol
```

Key content:

**Governance Consultation Order** (highest to lowest authority):
1. `governance/vision.md` — does this change serve the project's purpose?
2. `governance/principles.md` — does this approach align with project values?
3. `governance/conventions.md` — does this follow naming and format standards?
4. `.workflow-template.md` — does this follow the development workflow?
5. `plans/README.md` — does this plan follow the plan structure?

**Decision Types:**
- Architectural decisions → check Principles first
- Naming decisions → check Conventions first
- Process decisions (branching, committing) → check Development/Workflows
- Scope decisions → check Vision first

**What AI Agents Should NOT Do:**
- Modify `governance/` documents without explicit user instruction
- Skip the conventions when naming files, branches, or commits
- Create plans without following the 4-document structure
- Add features that conflict with the Vision without flagging the conflict

**Plan Creation Protocol:**
- Always use `YYYY-MM-DD__kebab-case` naming
- Always create all 4 documents: README.md, requirements.md, technical-design.md, checklist.md
- Always place in `plans/in-progress/` when starting
- Always include In Scope and Out of Scope sections
- Consult existing plans in `plans/done/` for pattern reference

---

## Files to Create

- `governance/README.md`
- `governance/vision.md`
- `governance/principles.md`
- `governance/conventions.md`
- `governance/ai-agent-guidelines.md`
- `docs/explanation/governance.md`

## Files to Update

- `.workflow-template.md` — add governance reference section
- `docs/explanation/README.md` — add link to governance.md

---

**Created**: April 18, 2026
**Last Updated**: April 18, 2026
