# Requirements: Programming Shell Skill

---

## Scope

### In Scope

1. **New skill file**: `.claude/skills/programming-shell/SKILL.md`, adapted from OSE's
   `.agents/skills/programming-shell/SKILL.md` to IKP-Labs's plain-markdown skill-header convention
   (no YAML frontmatter — matches `tooling-nx`, `ci-standards`, and every other real skill in this
   repo), covering:
   - Reading the declared interpreter line and strict-mode setting before anything else, grounded
     in this repository's real (post-PR2) `.claude/hooks/*.sh` state.
   - Deciding whether an addition belongs in shell at all, grounded in `block-env-file-access.sh`'s
     real single-`jq`-query-plus-case-branching pattern as the line between "shell's job" and
     "logic that should move to a language with a unit-test layer" (this repo has no documented
     size threshold of its own, so the skill states the judgment directly).
   - Tracing where exit-on-error does not reach, grounded in `block-env-file-access.sh`'s real
     `tool_name="$(... | jq ...)"` declaration-from-substitution pattern and
     `format-lint-markdown.sh`'s now-fixed (post-PR2) equivalent.
   - Quoting and checking arguments, grounded in the fact that every expansion across the 5 real
     hooks is already quoted today, and `worktree-create.sh`'s real `NAME`/`CWD` fallback handling
     as the existing good example of checking an argument before its first use.
   - Testing the script as its callers run it, grounded in `block-env-file-access.test.sh`'s real
     84-line hand-rolled test suite, and the real fact (post-PR3) that it now runs in CI rather than
     manually only.
   - A "Before Handing Off" checklist adapted from OSE's, with its broken OSE governance
     cross-references replaced by a plain, honest statement that IKP-Labs has no standalone
     shell-standards or TDD-governance document today — no invented links, no loose-analog mapping.
2. **Every worked example in the new skill references real content** from an actual
   `.claude/hooks/*.sh` file in this repository — no invented scripts, line numbers, or behavior.
3. **Hook consistency fix** across all 5 `.claude/hooks/*.sh` files:
   - Normalize every shebang to `#!/usr/bin/env bash` (2 of 5 already use it; 3 use `#!/bin/bash`).
   - Normalize strict mode to `set -euo pipefail` (2 of 5 already have it; `worktree-create.sh` has
     `set -e` only; `format-lint-markdown.sh` has none).
   - Fix `format-lint-markdown.sh` line 7's `jq` exit-check gap: capture `jq`'s exit status
     explicitly and exit cleanly on failure, converting the current incidental safety (an
     empty-string fallback that happens to pass the next check) into documented, deliberate
     safety.
   - Preserve every existing `|| true` guard exactly where it already exists (these are
     deliberate, not strict-mode oversights) and preserve all decision logic (regex patterns,
     cache-warming commands, worktree-routing) unchanged.
4. **CI wiring**: add a new `claude-hooks-tests` job to `.github/workflows/kameravue-ci.yml` that
   runs `bash .claude/hooks/block-env-file-access.test.sh`, and add that job to `ci-summary`'s
   `needs:` list and status-check script, matching the exact pattern already used for the
   `markdown-lint` job.
5. **Backfill `docs/reference/claude-agents.md`'s Skills Reference table**:
   - Add the row for `programming-shell`, alphabetically positioned after
     `plan-writing-gherkin-criteria` and before `readme-writing-readme-files`.
   - Update the table's stated count from "32" to "33".
6. **Bump `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`'s Harness Inventory Reference
   table**: Skills count 32 → 33, with a dated note recording the addition of `programming-shell`
   (matching the existing note style for `tooling-nx`'s own entry), and update the file's
   `**Last Updated**:` footer to match.
7. **Add this plan to `plans/README.md`'s "In Progress" index now**, and **archive this plan** to
   `plans/done/2026-11-01__programming-shell/` via `git mv` once all checklist items are complete
   and merged, updating `plans/README.md`'s index again at that point (remove from "In Progress",
   add to "Done", bump the "Completed Projects" count).

### Non-Scope

1. **No agent declares `programming-shell` in `permission.skill:`.** Confirmed via grep across
   `.claude/agents/*.md`: zero agents reference shell work. Matches the precedent set by
   `tooling-nx` and `repo-defining-multi-agent-workflows` ("None yet — documentation-only, applied
   ad hoc").
2. **No new agent is created** to own this skill. The skill is discoverable via the
   `.claude/skills/` directory listing and the `Skill` tool, same as every other ad hoc,
   non-agent-owned skill in this repo.
3. **`AGENTS.md`'s "Skills Catalog" table is not modified.** That table is a deliberately partial
   sample tied to the three flagship Maker-Checker families; `programming-shell` doesn't belong to
   any of them, and this matches the exact precedent `tooling-nx` already set for the same table.
4. **No `shellcheck` or `shfmt` is installed or wired into this repository.** Confirmed absent from
   `package.json`, `.github/workflows/*.yml`, and any hook. The skill documents this gap honestly
   (OSE's "repository's analyser and formatter" does not exist here; `bash -n <script>` is named as
   the closest available substitute); installing an actual shell analyser/formatter is a separate,
   larger tooling decision this plan does not make.
5. **No new tests are written for the 3 currently-untested hooks** (`format-lint-markdown.sh`,
   `warm-cache-before-push.sh`, `worktree-create.sh`). This plan wires the one existing test
   (`block-env-file-access.test.sh`) into CI; it does not author new test coverage for the other
   hooks. That gap is documented in the new skill as a real, open finding — not closed here.
6. **No shell-standards or test-driven-development governance document is created.** OSE's 5
   broken cross-references (`shell-scripts.md`, `shell-standards.md`,
   `behaviour-driven-development.md`, `test-driven-development.md`, `developing-applications/SKILL.md`)
   are replaced with an honest "no equivalent exists" statement, not a new governance file. The
   user explicitly flagged this absence as a candidate for a future, separately-scoped,
   repo-wide (not shell-specific) plan — recorded in `README.md`, not actioned here.
7. **No hook's actual decision logic is changed.** `block-env-file-access.sh`'s regex-based
   allow/deny patterns, `warm-cache-before-push.sh`'s cache-warming commands, and
   `worktree-create.sh`'s worktree-routing logic are unchanged by PR2 — only the interpreter line,
   strict-mode setting, and (for `format-lint-markdown.sh` only) the one specific `jq` exit-check
   are touched.
8. **The orphaned test is not wired into `.husky/pre-push`.** CI (`kameravue-ci.yml`'s
   `ci-summary`) is the chosen enforcement point, since it is already the authoritative merge gate
   via branch protection; adding the same check to the local pre-push hook would duplicate
   enforcement without adding a capability CI doesn't already provide. See technical-design.md for
   the full rationale.
9. **No new CI step runs `shellcheck`/`shfmt`-style static analysis.** PR3 only runs the existing
   `block-env-file-access.test.sh`; per Non-Scope item 4, no such analyser exists in this repo to
   wire in.
10. **No `apps/*` application code, `apps/*/project.json`, or `nx.json` file is modified.** This
    plan's entire footprint is `.claude/skills/`, `.claude/hooks/`, `.github/workflows/kameravue-ci.yml`,
    `docs/reference/claude-agents.md`, `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`, and
    `plans/`.

---

## User Stories

### User Story: Checking the interpreter and strict-mode setting before changing a hook

As a developer or agent about to change a `.claude/hooks/*.sh` file
I want documented guidance to check the declared interpreter and strict mode first
So that I don't assume a hook has protections it doesn't actually have

**Acceptance Criteria:**

```gherkin
Scenario: A developer opens worktree-create.sh to add a new feature
  Given `.claude/skills/programming-shell/SKILL.md`'s "Start From the First Line" section
  When the developer reads the file's interpreter line and strict-mode setting before writing any
    change
  Then they confirm `#!/usr/bin/env bash` and `set -euo pipefail` are in effect, matching every
    other hook in this repository after this plan's consistency fix
```

### User Story: Tracing a declaration-from-substitution blind spot

As a developer or agent reviewing a shell script change
I want documented guidance on where `set -e` does not reach
So that I don't assume a variable assigned from a command substitution is safe just because strict
mode is on

**Acceptance Criteria:**

```gherkin
Scenario: A developer adds a new jq-based field extraction to a hook
  Given `.claude/skills/programming-shell/SKILL.md`'s "Trace Where Exit-on-Error Does Not Reach"
    section, citing block-env-file-access.sh's real `tool_name="$(... | jq ...)"` pattern
  When the developer writes a new `var=$(... | jq ...)` declaration in any hook
  Then they are directed to check what happens if the substitution fails, and to add an explicit
    status check rather than assume set -euo pipefail alone catches it
```

### User Story: Testing a hook the way Claude Code's harness actually invokes it

As a developer or agent adding or changing a `.claude/hooks/*.sh` file
I want documented guidance on testing the script with the same input shape its real caller sends
So that a passing test actually proves the hook behaves correctly under real invocation

**Acceptance Criteria:**

```gherkin
Scenario: A developer adds a new assertion to block-env-file-access.test.sh
  Given `.claude/skills/programming-shell/SKILL.md`'s "Test the Script as Its Callers Run It"
    section, citing the real `assert_deny`/`assert_allow` functions and their exact
    `{"tool_name":"...","tool_input":{...}}` JSON input shape
  When the developer writes both a failure-path assertion and a legitimate-path assertion for the
    new behavior
  Then the test exercises the hook exactly as Claude Code's PreToolUse harness invokes it, and
    (per PR3) runs automatically in `kameravue-ci.yml`'s `claude-hooks-tests` job rather than only
    when someone remembers to run it manually
```

### User Story: Discoverability of the new skill and the CI gate in the catalog

As a maintainer scanning `docs/reference/claude-agents.md` for the full skill inventory
I want the Skills Reference table to reflect every real skill directory, including
`programming-shell`
So that the catalog doesn't silently drift out of sync with `.claude/skills/`

**Acceptance Criteria:**

```gherkin
Scenario: Catalog table reflects the true skill count after this plan merges
  Given `.claude/skills/` contains 33 skill directories after `programming-shell` is added
  When a maintainer reads `docs/reference/claude-agents.md`'s Skills Reference table
  Then the table states "33" skill directories and lists a row for `programming-shell` with "not
    declared by any agent's `permission.skill:`" in its Declared By column
```

---

## Success Criteria

- `.claude/skills/programming-shell/SKILL.md` exists, follows the plain-markdown skill header
  convention used by every other skill in `.claude/skills/` (no YAML frontmatter), and every
  worked example cites a real file path and real content from this repository.
- `ls .claude/skills/ | grep -v README | wc -l` returns `33`.
- All 5 `.claude/hooks/*.sh` files share `#!/usr/bin/env bash` and `set -euo pipefail` (with any
  intentional `|| true` escape documented inline, not left looking like an oversight), confirmed
  via `head -5` on each file.
- `format-lint-markdown.sh`'s `jq` exit-check explicitly handles a failed substitution rather than
  relying on an incidental empty-string fallback.
- `bash .claude/hooks/block-env-file-access.test.sh` still exits 0 with all assertions passing
  after the consistency fix (confirming the fix didn't change the hook's actual behavior).
- `.github/workflows/kameravue-ci.yml` contains a `claude-hooks-tests` job that runs
  `block-env-file-access.test.sh`, and `ci-summary`'s `needs:` list and status-check script include
  it.
- `docs/reference/claude-agents.md`'s Skills Reference table states "33" and contains a row for
  `programming-shell`.
- `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`'s Harness Inventory Reference table states
  `33` for Skills with a dated note for the `programming-shell` addition.
- No agent file under `.claude/agents/` is modified by this plan.
- `AGENTS.md` is not modified by this plan.
- No `apps/*/project.json`, `nx.json`, or `.husky/*` file is modified by this plan.
- No new governance document is created by this plan.
- `npm run lint:md` passes on every changed markdown file.
- This plan is archived to `plans/done/2026-11-01__programming-shell/` after all four PRs merge.
