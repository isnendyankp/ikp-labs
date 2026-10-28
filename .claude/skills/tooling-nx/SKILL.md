# Skill: Nx Tooling

**Category**: Infrastructure
**Purpose**: Guides day-to-day Nx workspace work — selecting projects by the graph, adding a
target only where a capability exists, tracing a stale cached pass to its missing input, and
answering a module-boundary finding
**Used By**: None yet — documentation-only, applied ad hoc whenever a developer or agent is
working the Nx graph (see "Adoption Note" below)

---

## Overview

This skill adds only the **procedure and judgement** of working through the Nx task runner — it
does not restate rules that already live elsewhere. The rule for which targets a project role must
carry, and how its tags should look, is owned by
[`ci-checker.md`'s "Nx Conformance Checks (project.json)" section](../../agents/ci-checker.md).
Coverage-threshold rules are owned by
[`test-coverage-rules/SKILL.md`](../test-coverage-rules/SKILL.md). The code inside each project
follows that project's own language skill (`swe-programming-typescript`, `swe-programming-java`,
`swe-programming-golang`). Where a sentence here seems to state a rule those documents already
own, the referenced document decides — this skill only tells you what to _do_ when you hit one of
four situations: picking projects, adding a target, diagnosing a cache, or resolving a boundary
finding.

**Adoption Note**: no agent currently declares this skill in `permission.skill:` — confirmed by
scanning OSE's own 77 canonical `agents/*.md` files, where zero agents (including `ci-checker`,
which does the closest adjacent static-config audit) reference `tooling-nx` either. Pull this
skill in ad hoc via the `Skill` tool whenever one of the four situations below applies.

---

## Start From What the Project Records

Before changing a project's targets or tags, read what IKP-Labs already records about it:

- The **four-dimension tag vocabulary** (`type:`/`platform:`/`lang:`/`domain:`) and which project
  roles require which targets — both defined in
  [`ci-checker.md`'s Nx Conformance Checks section](../../agents/ci-checker.md#nx-conformance-checks-projectjson).
- The project's own `project.json` for its declared targets, and `nx.json` for `targetDefaults`
  and `namedInputs` that apply to it even when not repeated locally. For example,
  `apps/kameravue-fe/project.json`'s `build` target doesn't declare `dependsOn` itself — that
  comes from `nx.json`'s `targetDefaults.build.dependsOn: ["^build"]`.

Then ask Nx what it actually resolved rather than trusting the file alone — run
`nx show project <name>` (e.g. `nx show project kameravue-fe`). Workspace-level defaults from
`nx.json` never appear by reading `project.json` in isolation, so a target's real `outputs` or
`dependsOn` can differ from what the project's own file shows.

---

## Select by the Project Graph, Not by Hand

Run change-scoped work through `nx affected` (or `nx run-many` for a full pass) with the targets
it needs, rather than typing out a project list by hand.

**This matters concretely in IKP-Labs today**: `.github/workflows/kameravue-ci.yml` and
`kameravue-scheduled-e2e.yml` currently hand-list each job per app (`frontend-lint`,
`frontend-tests`, `backend-tests`, …) rather than running `nx affected` — confirmed via
`grep -n "nx affected" .github/workflows/*.yml` returning no matches. That hand-listing is exactly
the anti-pattern this section warns about: it makes the current run pass, but silently misses a
project the _next_ change actually touches. (Changing CI itself to use `nx affected` is a separate,
larger decision outside this skill's scope — this section is about how to work locally and in
agent-driven changes today, not about rewriting the pipeline.)

When a project you expected is missing from an `nx affected` selection, that absence is the
finding: look for the dependency or input Nx cannot see. In this workspace, cross-project edges are
often declared via `implicitDependencies` — for example, `apps/kameravue-fe-e2e/project.json`
declares `"implicitDependencies": ["kameravue-fe", "kameravue-be"]`, and `apps/taskly-be-e2e/project.json`
declares `"implicitDependencies": ["taskly-be"]`. If an e2e project you expected to see affected by
a backend change is missing, check whether that edge is actually declared — don't just add the
project to the run by hand, which makes this run pass and leaves the graph still blind on the next
one. When a project appears that you didn't expect, read the graph (`nx graph` or
`mcp__plugin_nx_nx-mcp__nx_workspace`) before assuming Nx is wrong — an unexpected edge is often a
real import.

---

## Add a Target Only Where a Capability Exists

Before adding a target, confirm the project can really do what the name claims. This repository
already has two real, currently-flagged examples of what happens when that check is skipped —
both documented in `ci-checker.md`'s findings and `ci-fixer.md`'s fix categories:

- **`kameravue-be` has no `lint` target.** Its `pom.xml` has no Checkstyle, PMD, or Spotless plugin
  configured — there is no working lint command to point a target at. `ci-fixer.md` correctly
  marks this `UNCERTAIN` rather than auto-adding a target, and recommends adding the linter plugin
  first, as its own separate change.
- **`taskly-be` has no `test` target.** Unlike the `lint` case, `go test ./...` already works
  against `taskly-be`'s real `go.mod`-backed test files — so `ci-fixer.md` marks this
  **safe to auto-fix**, adding:

  ```json
  "test": {
    "executor": "nx:run-commands",
    "options": { "command": "go test ./...", "cwd": "apps/taskly-be" }
  }
  ```

The distinguishing question is always the same: does a working command for this capability already
exist? If yes, wiring an `nx:run-commands` target to it is safe. If no, the missing capability
(the linter plugin, the test file, the coverage tool) is a prerequisite change, not something to
paper over with a target that points at nothing. An inferred or hand-added target the project
cannot actually run is removed, never left in place to pass on nothing. Record each intentional
omission with its reason — `ci-checker.md`'s own findings table is where IKP-Labs currently does
this for `apps/*/project.json` gaps.

---

## Cache Only Deterministic Targets

When a cached result is suspect, rerun the target with `--skip-nx-cache`
(e.g. `nx test kameravue-be --skip-nx-cache`). If the fresh run fails where the cached one passed,
the cache replayed a result its inputs did not determine.

Ground this in IKP-Labs's real `nx.json`:

```json
"tasksRunnerOptions": {
  "default": {
    "options": { "cacheableOperations": ["build", "test", "lint", "e2e"] }
  }
},
"targetDefaults": {
  "dev":   { "cache": false, "continuous": true },
  "serve": { "cache": false, "continuous": true },
  "test":  { "outputs": ["{projectRoot}/coverage", "{projectRoot}/target/surefire-reports"] }
}
```

`dev` and `serve` are correctly never cached (`cache: false`) because they're long-running
dev-server processes, not deterministic build/test passes — this is the one case where "turn
caching off" is the standard, not a shortcut hiding a defect. For an actually cacheable target
(`build`, `test`, `lint`, `e2e`), if a fresh `--skip-nx-cache` run disagrees with the cached one,
find the missing input — usually a file another project owns, an environment variable, or a tool
version — and add it to the target's `inputs` or to one of `nx.json`'s `namedInputs`
(`default`, `sharedGlobals`, `production`), then confirm the cache now misses on that change.
Turning caching off for the target entirely hides the defect rather than fixing it, unless the
target is one IKP-Labs's standard already never caches (`dev`, `serve`).

---

## Answer a Boundary Finding at the Dependency

A module-boundary finding means one project reached another its tags forbid.

**Honest state of this in IKP-Labs today**: the four-dimension tag scheme
(`type:`/`platform:`/`lang:`/`domain:`) exists and is audited _statically_ by
`ci-checker.md`'s "Four-Dimension Tag Scheme" check — but no `@nx/enforce-module-boundaries`
ESLint rule is currently wired into this workspace to enforce it _live_. Confirmed: no
`@nx/eslint-plugin` dependency in the root `package.json`, no root ESLint config referencing it,
and `apps/kameravue-fe/eslint.config.mjs` only extends `next/core-web-vitals`/`next/typescript`.
`ci-checker.md` already has real findings against this tag scheme today — for example,
`kameravue-fe-e2e/project.json` currently uses `"scope:kameravue"` instead of the standard
`"domain:kameravue"`, and is missing a `lang:` tag entirely — but those are flagged by a periodic
static audit, not a live lint failure at build/lint time.

This section documents the procedure for _if/when_ a live boundary lint is ever added: a finding
means move the shared code to a project both sides may depend on, or invert the dependency.
Retagging a project or widening a constraint just to make the lint pass changes the architecture,
and that needs the tag-scheme owner's agreement — currently recorded via `ci-checker.md`'s findings
and `ci-fixer.md`'s corresponding tag-fix category, not a separate adapter document. Never treat a
tag-widening edit as a mechanical fix on the same footing as correcting a typo'd tag.

---

## Before Handing Off

- Every new project carries tags from the recorded four-dimension vocabulary
  (`type:`/`platform:`/`lang:`/`domain:`) — see `ci-checker.md`'s Four-Dimension Tag Scheme check.
- Every new target names a real capability; every intentional omission is recorded in
  `ci-checker.md`'s findings (or, once fixed, removed from them).
- Each new or changed cacheable target (`build`, `test`, `lint`, `e2e`) lists inputs sufficient
  that a `--skip-nx-cache` run agrees with the cached one.
- Change-scoped work was selected through `nx affected`/`nx run-many`, not a hand-picked project
  list — and any unexpected inclusion or omission was investigated against the graph, not silently
  overridden.
- Coverage-threshold gating, where applicable, matches
  [`test-coverage-rules/SKILL.md`](../test-coverage-rules/SKILL.md) (≥70% FE / ≥80% BE).

---

## Related Skills

- **`ci-standards`** — GitHub Actions and Nx `project.json` conformance standards this skill's
  "what the rule is" layer defers to
- **`test-coverage-rules`** — coverage-threshold rules this skill's hand-off checklist defers to
- **`repo-understanding-repository-architecture`** — the repository's Nx monorepo layout overview

---

**Last Updated**: October 2026
