# Skill: Shell Programming

**Category**: Software Engineering
**Purpose**: Guides shell script work in this repository — checking the declared interpreter and
strict-mode setting first, deciding whether a change belongs in shell at all, tracing where
exit-on-error does not reach, quoting and checking arguments, and testing a script the way its
actual callers invoke it.
**Used By**: None yet — documentation-only, applied ad hoc whenever a developer or agent is
writing, changing, or reviewing a script under `.claude/hooks/*.sh` or any other shell script in
this repository (see "Adoption Note" below).

---

## Overview

This skill adds only the **procedure and judgment** of shell work — it does not invent rules this
repository has never stated. IKP-Labs has no standalone shell-standards or shell-mechanics
governance document today (confirmed: nothing under `governance/` is comparable to a
`shell-standards.md` or `shell-scripts.md`), and no dedicated test-driven-development governance
document either (`governance/development/workflow/implementation.md` and
`governance/conventions/development.md` mention `bash` only inside example code fences, not as a
standards topic). Where a sentence in this skill would otherwise defer to one of those documents,
it states the judgment directly instead, grounded in this repository's real `.claude/hooks/*.sh`
files — the only shell scripts currently version-controlled here.

**Adoption Note**: no agent currently declares this skill in `permission.skill:` — confirmed via
`grep -rn "permission.skill" .claude/agents/*.md`, which returns no shell-related reference. Pull
this skill in ad hoc via the `Skill` tool whenever a `.claude/hooks/*.sh` file (or any future shell
script) is written, changed, or reviewed.

---

## Start From the First Line

Read the interpreter line and the strict-mode setting before anything else; they decide which
dialect's rules apply and which failures the shell will actually catch for you. Every one of this
repository's 5 hooks under `.claude/hooks/` shares `#!/usr/bin/env bash` and `set -euo pipefail`
today, with one deliberate exception: a hook whose design requires it to never block its caller
keeps an explicit `|| true` on each risky line instead of relying on strict mode to stop it, and
that exception is commented in place, not left looking like an oversight.

No `shellcheck` or `shfmt` (or equivalent analyser/formatter) is installed or referenced anywhere
in this repository — confirmed via `which shellcheck shfmt` and a grep across `package.json` and
`.github/workflows/*.yml`. Until one is adopted, `bash -n <script>` (syntax check only, no style or
correctness analysis) is the closest available substitute — run it, and carry the review a real
analyser would otherwise do.

---

## Decide Whether It Belongs in Shell

Before adding behavior to a hook, ask what the addition actually is. Reading a tool-call's JSON
payload through a single `jq` filter, branching on a fixed, small set of known shapes, and exiting
with a decision is shell's job — every one of this repository's 5 hooks does exactly this today
(for example, `block-env-file-access.sh` extracts `tool_name`, `tool_input.file_path`, and
`tool_input.command` with one `jq -r` call each, then branches with `case`/`grep -qE` over a
handful of known patterns).

This repository has no documented size threshold for when a script should move to a language with
a unit-test layer — there is no `shell-standards.md` equivalent here, so the call is a judgment
one: if a future change needs more than one or two single-concern `jq` queries, adds retry/backoff
logic, or starts computing something rather than matching it, treat that as the signal to move the
logic into a small Node script (this is an npm/Node-based repository) invoked by the hook, rather
than deep-nesting the logic in shell. Raise this before writing the logic, not after.

---

## Trace Where Exit-on-Error Does Not Reach

Strict mode only stops the script at a failing command where the shell actually checks it — and a
declaration assigned from a command substitution is one of the places it does not, even under
`set -euo pipefail`. This repository's own hooks are the real example: `block-env-file-access.sh`'s
`tool_name="$(printf '%s' "$input" | jq -r '.tool_name // empty')"` sets `tool_name` to an empty
string if `jq` fails, rather than stopping the script — a failing command substitution on the
right-hand side of a plain assignment is invisible to `set -e` in bash, strict mode or not. The
immediately following logic in that file happens to treat an empty `tool_name` safely (it simply
falls through every branch and exits 0), so this is currently safe by consequence, not by an
explicit check.

Where this same shape of gap was fixed in this repository: `format-lint-markdown.sh`'s field
extraction now captures `jq`'s exit status explicitly and exits cleanly on failure, rather than
leaning on an incidental empty-string fallback. When you add a declaration shaped like
`var=$(... | jq ...)` to any hook, ask the same question: what happens if the substitution fails,
and does the next line actually handle that deliberately, or does it just happen to?

---

## Quote, Then Check

Every expansion across this repository's 5 hooks is already quoted — confirmed by reading all 5
files: `"$file_path"`, `"$cmd"`, `"$NAME"`, `"$CWD"`, `"$WORKTREE_PATH"`, and every other variable
reference. This section exists for the next script, not because an existing one needs fixing:
quote each expansion as you write it, since an unquoted one splits on spaces and expands wildcards
only when a path or value actually contains them — a bug that looks fine until the day it ships.

Check each argument before its first use, the way `worktree-create.sh` already does for its
optional `NAME` and `CWD` JSON fields: it falls back to a generated name (`auto-$(date
+%Y%m%d-%H%M%S)`) and the current working directory respectively, rather than assuming either
arrived.

---

## Test the Script as Its Callers Run It

`.claude/hooks/block-env-file-access.test.sh` is this repository's real example: 84 lines of
hand-rolled `assert_deny`/`assert_allow` functions, each piping the exact JSON shape Claude Code's
harness sends a `PreToolUse` hook (`{"tool_name":"Read","tool_input":{"file_path":"..."}}`) into
`bash .claude/hooks/block-env-file-access.sh` and asserting on its stdout — testing the script
exactly as its real caller invokes it, not through a simplified stand-in. It covers both
directions: the `assert_deny` cases are the failure paths (`.env.local`, `.env.production`,
`git add .env.local`), written the way this skill's own guidance recommends — failure paths first —
and the `assert_allow` cases confirm the legitimate paths (`.env.example`, project scripts under
`apps/|libs/|scripts/`) are not caught in the net.

This test now runs automatically in `kameravue-ci.yml`'s `claude-hooks-tests` job — a regression in
the hook fails CI the same way a regression in `apps/kameravue-fe` would. The other 4 hooks
(`format-lint-markdown.sh`, `warm-cache-before-push.sh`, `worktree-create.sh`, and the test file
itself) have no test of their own — writing one for each is a real, open gap this skill surfaces
but does not close.

Coverage is not measured for shell in this repository, the same as everywhere shell lacks a
unit-test layer coverage tooling can instrument — these behaviour tests are what carry the evidence
instead.

---

## Before Handing Off

- The interpreter line and strict-mode setting are either unchanged or deliberately changed, and
  every file under `.claude/hooks/` agrees (`#!/usr/bin/env bash` + `set -euo pipefail`), with any
  intentional `|| true` escape documented inline rather than left looking like an oversight.
- No logic beyond a single-concern `jq` extraction and a fixed-case branch was added without first
  asking whether it belongs in shell.
- Every expansion is quoted, and every argument is checked before its first use.
- Every place exit-on-error does not reach (a declaration assigned from a substitution, a command
  on the left of `&&`/`||`) has an explicit status check where the failure matters to the outcome.
- Every documented exit path has a test that invokes the script exactly as its real caller does
  (same JSON shape, same stdin/argv contract), with the failure paths tested, not only the happy
  path.
- No `shellcheck`/`shfmt`-equivalent analyser exists in this repository today — `bash -n <script>`
  (syntax check only) is the closest available substitute until one is adopted.

---

## Related Skills

- **`ci-standards`** — GitHub Actions workflow conformance this skill's CI-wiring example touches
- **`repo-understanding-repository-architecture`** — repository layout overview, including where
  `.claude/hooks/` sits in the harness

---

**Last Updated**: November 2026
