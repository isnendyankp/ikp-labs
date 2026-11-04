# Checklist: Programming Shell Skill

---

## Phase 0 — Pre-flight (no PR)

- [x] Confirm `.claude/skills/programming-shell/` does not exist (`ls .claude/skills/ | grep
  programming-shell` returns nothing) — re-verify immediately before starting PR1, since time
      may have passed since this plan was written. Confirmed: no match (checked before PR1).
- [x] Confirm current real skill-directory count is still 32 via
      `ls .claude/skills/ | grep -v README | wc -l` — re-verify before PR4's count edits, in case
      another plan added or removed a skill in the meantime. Confirmed: 32 (checked before PR1).
- [x] Confirm the 5 `.claude/hooks/*.sh` files still show the documented inconsistency (`head -5`
      on each) before starting PR2 — re-verify in case another plan already touched them. Confirmed
      via `head -2` on all 5 before PR1 — inconsistency still present; re-verify again immediately
      before starting PR2 since PR1 has since merged.

---

## PR1 — Create `.claude/skills/programming-shell/SKILL.md` — ✅ Done (PR #337)

**Branch**: `docs/programming-shell-skill`

- [x] Create `.claude/skills/programming-shell/SKILL.md` with the exact content drafted in
      `technical-design.md`'s "Full Drafted Skill Content" section.
- [x] Verify every internal link in the new file resolves:
  - [x] `../ci-standards/SKILL.md` — confirm exists
  - [x] `../repo-understanding-repository-architecture/SKILL.md` — confirm exists
- [x] Verify every file path and line reference cited in the new skill is real:
  - [x] `.claude/hooks/block-env-file-access.sh` (the `tool_name="$(... | jq ...)"` declaration,
        and the quoting examples `"$file_path"`/`"$cmd"`) — confirm still accurate
  - [x] `.claude/hooks/worktree-create.sh` (the `NAME`/`CWD` fallback handling) — confirm still
        accurate
  - [x] `.claude/hooks/block-env-file-access.test.sh` (84 lines, `assert_deny`/`assert_allow`
        functions, real JSON input shape) — confirm still accurate
  - [x] No `shellcheck`/`shfmt` reference exists in `package.json` or `.github/workflows/*.yml` —
        re-confirm via `which shellcheck shfmt` and grep
- [x] **Note on forward-reference**: this skill's text describes the _post-PR2_ state (all 5 hooks
      sharing one interpreter line and strict mode, and `format-lint-markdown.sh`'s `jq` exit-check
      already fixed). If this PR is reviewed and merged before PR2 lands, that is a known,
      deliberate, short-lived gap between the skill's claim and the repository's actual state —
      acceptable since PR2 is the very next PR in this same plan, not an open-ended gap. PR1
      merged before PR2 on 2026-11-01; PR2 merged 2026-11-04, closing this forward-reference
      gap — the skill's text now matches the repository's actual state.
- [x] Confirm the file follows the plain-markdown skill header convention (no YAML frontmatter) —
      compare against `.claude/skills/tooling-nx/SKILL.md`'s structure.
- [x] Run `npm run lint:md` and fix all markdown violations.
- [x] Commit: `docs(skills): add programming-shell skill for shell script work`.
- [x] Push branch, open PR, confirm CI passes, merge `--squash --delete-branch`, pull `main`. Opened
      as PR #337, merged 2026-11-01.

---

## PR2 — Hook Consistency Fix — ✅ Done (PR #339)

**Branch**: `fix/hook-shebang-strict-mode-consistency`

### `.claude/hooks/format-lint-markdown.sh`

- [x] Change shebang line 1 from `#!/bin/bash` to `#!/usr/bin/env bash`.
- [x] Add `set -euo pipefail` after the comment block, before the `file_path=` assignment.
- [x] Replace the `file_path=$(jq -r '.tool_input.file_path // empty' 2>/dev/null)` line with the
      explicit exit-check form from `technical-design.md`'s "PR2 — Hook Consistency Fix" section.
- [x] Confirm every existing `|| true` guard on the `prettier`/`markdownlint-cli2` lines is
      unchanged.
- [x] Manually invoke the hook with a sample `PostToolUse` JSON payload for a `.md` file and
      confirm it still formats/lints correctly and exits 0.
- [x] Manually invoke the hook with malformed/empty stdin and confirm it still exits 0 without
      error. Also tested garbage non-JSON stdin — exits 0.

### `.claude/hooks/warm-cache-before-push.sh`

- [x] Change shebang line 1 from `#!/bin/bash` to `#!/usr/bin/env bash`. No other change.
- [x] Manually invoke the hook with a sample `git push` `PreToolUse` JSON payload and confirm it
      still runs the `nx affected` cache-warming commands and exits 0. Confirmed the push-match
      regex still triggers and the non-push early-exit path (`git status`) exits 0 without
      running the nx chain.

### `.claude/hooks/worktree-create.sh`

- [x] Change shebang line 1 from `#!/bin/bash` to `#!/usr/bin/env bash`.
- [x] Change line 10 from `set -e` to `set -euo pipefail`.
- [x] Manually invoke the hook with a sample `WorktreeCreate` JSON payload (with and without a
      `name` field) and confirm it still creates/resolves a worktree path and prints it on the
      last line of stdout. Confirmed both paths (test worktrees cleaned up afterward).
- [x] Specifically confirm the `git worktree list --porcelain | grep -qF ...` check at line 42
      still behaves correctly now that `pipefail` is active (per `technical-design.md`'s reviewed
      edge case). Confirmed via the manual invocations above — no false failure.

### `.claude/hooks/block-env-file-access.sh` and `.claude/hooks/block-env-file-access.test.sh`

- [x] Confirm no change needed — both already use `#!/usr/bin/env bash` and
      `set -euo pipefail`.

### Validation (PR2)

- [x] Run `bash .claude/hooks/block-env-file-access.test.sh` and confirm all assertions still pass
      (sanity check that the consistency fix didn't break an unrelated hook). Confirmed: 13/13
      pass.
- [x] Confirm `head -5` on all 5 hooks now shows a consistent `#!/usr/bin/env bash` +
      `set -euo pipefail` (or the documented `|| true`-based exception, if any remain by design —
      none should after this PR, since `format-lint-markdown.sh` now also has `set -euo pipefail`).
      Confirmed via `Read` on all 5 files.
- [x] Confirm no hook's decision logic (regex patterns, cache-warming commands, worktree-routing)
      changed — diff review against `technical-design.md`'s exact diffs. Confirmed via `git diff`:
      only the 3 drafted edits present, nothing else.
- [x] Run `npm run lint:md` if any markdown comment inside the scripts changed (unlikely, but
      check). N/A — no markdown files touched by this PR.
- [x] Commit: `fix(hooks): normalize shebang and strict mode across claude hooks`.
- [x] Push branch, open PR, confirm CI passes, merge `--squash --delete-branch`, pull `main`.
      Opened as PR #339, merged 2026-11-04.

---

## PR3 — Wire Orphaned Test into CI

**Branch**: `chore/wire-claude-hooks-tests-into-ci`

- [ ] Insert the `claude-hooks-tests` job into `.github/workflows/kameravue-ci.yml` between
      `markdown-lint` and `ci-summary`, exactly as drafted in `technical-design.md`.
- [ ] Update `ci-summary`'s `needs:` list to include `claude-hooks-tests`.
- [ ] Update `ci-summary`'s status-check script (both the failure branch and the success branch)
      to check and echo `claude-hooks-tests`'s result, exactly as drafted.
- [ ] Confirm no other job definition in `kameravue-ci.yml` was altered.
- [ ] Push branch, open PR, and **specifically confirm on this PR's own real CI run** that the new
      `claude-hooks-tests` job passes — this is the verification step for the "jq is preinstalled
      on `ubuntu-latest`" assumption documented in `technical-design.md`. If `jq` is not present,
      add an explicit `jq` install step (e.g. `sudo apt-get install -y jq`) before the test step
      and re-push.
- [ ] Confirm `ci-summary` correctly reflects a failure if `claude-hooks-tests` is made to fail
      temporarily (optional local verification: intentionally break the test file in a throwaway
      branch, confirm `ci-summary` fails, then revert — do this only if quick to verify; otherwise
      rely on reading the YAML logic).
- [ ] Merge `--squash --delete-branch`, pull `main`.

---

## PR4 — Catalog Bookkeeping + Archive

**Branch**: `docs/programming-shell-catalog-bookkeeping`

### `docs/reference/claude-agents.md`

- [ ] Update line 361 (`The 32 skill directories under`) to `The 33 skill directories under`.
- [ ] Insert the `programming-shell` row (alphabetically after `plan-writing-gherkin-criteria`,
      before `readme-writing-readme-files`) following the `tooling-nx` row's style for a
      zero-agents-declared skill.
- [ ] Re-count the table's rows manually after editing and confirm it equals 33.

### `.claude/skills/repo-syncing-with-ose-primer/SKILL.md`

- [ ] Update the Harness Inventory Reference table's Skills row: count `32` → `33`, with the note
      `2026-11-01 (added \`programming-shell\`, guidance for shell script
      interpreter/strict-mode/exit-on-error/testing judgment — no name collision, no DEFER
      record)`.
- [ ] Update the `**Last Updated**:` footer date to match.

### Archive

- [ ] Update this plan's `README.md` status from "🚧 In Progress" to "✅ Completed", add a
      **Completed** date line.
- [ ] `git mv plans/in-progress/2026-11-01__programming-shell plans/done/2026-11-01__programming-shell`.
- [ ] Update `plans/README.md`'s index: remove the "In Progress" entry added when this plan was
      created, add a "Done (Archived)" tree entry, and bump the "Completed Projects" count.

### Validation (PR4)

- [ ] Run `npm run lint:md` and fix all markdown violations across all changed files.
- [ ] Confirm the Skills Reference table in `docs/reference/claude-agents.md` has exactly 33 rows.
- [ ] Commit: `docs(plan): backfill claude-agents skills catalog and archive programming-shell plan`.
- [ ] Push branch, open PR, confirm CI passes, merge `--squash --delete-branch`, pull `main`.

---

## Quality Gates

- [ ] No file under `.claude/agents/` is modified by any PR.
- [ ] `AGENTS.md` is not modified by any PR.
- [ ] No file under `apps/`, `nx.json`, or `.husky/` is modified by any PR.
- [ ] No new governance document is created by any PR.
- [ ] Each PR's commit type matches `commitlint.config.js`'s allowed `type-enum`
      (`feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `config`).
- [ ] `npm run lint:md` passes with zero errors on every markdown file touched across all 4 PRs.
- [ ] Every claim in the shipped skill file is re-verified against the actual post-PR2 repository
      state before PR1 is considered final (not just at plan-writing time).

---

## Post-Write Grill-Me Validation (performed during plan creation, not an implementation task)

- [ ] Decision 1 (4-PR split by risk boundary, hook retrofit + CI wiring in scope) — reflected in
      `README.md`'s Key Decisions table and the PR Breakdown.
- [ ] Decision 2 (exact OSE name, no `swe-` prefix) — reflected in every file path reference across
      all 4 documents.
- [ ] Decision 3 (`tooling-nx` header convention, compressed OSE wording) — reflected in the full
      drafted skill content in `technical-design.md`.
- [ ] Decision 4 (generalized coverage line, no TS/Java threshold contrast) — reflected in the
      skill's "Test the Script as Its Callers Run It" section's closing paragraph.
- [ ] Decision 5 (fix `format-lint-markdown.sh`'s `jq` gap in PR2) — reflected in
      `technical-design.md`'s PR2 diffs and `requirements.md` Scope item 3.
- [ ] Decision 6 (honest "no equivalent" governance statement, plus the recorded-not-actioned
      follow-up note) — reflected in the skill's Overview section, `technical-design.md`'s
      Governance-Equivalent Mapping table, and `README.md`'s "Follow-up note" callout.
- [ ] Decision 7 (4-PR exact shape, bookkeeping+archive bundled) — reflected in the PR Breakdown
      table and this checklist's PR1–PR4 structure.
