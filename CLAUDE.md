# CLAUDE.md

@AGENTS.md

## Platform Binding — Claude Code

This file is the Claude Code platform-binding shim. The `@AGENTS.md` directive above imports
the canonical vendor-neutral instruction surface. The rest of this file documents
Claude Code-specific binding details.

---

## Pre-authorized Paths

`.claude/` paths are pre-authorized in `.claude/settings.json` — no approval prompt fires:

- `Read(.claude/**)`, `Write(.claude/**)`, `Edit(.claude/**)` — agent and skill files
- `.claude/agents/*.md` — agent definition files
- `.claude/skills/*/SKILL.md` — skill files
- `.claude/hooks/*.sh` — hook scripts

Edit these with normal `Write` / `Edit` tools. `Bash` heredoc remains fine for bulk substitutions.

---

## Active Hooks

| Hook                        | Trigger                                   | Purpose                                                |
| --------------------------- | ----------------------------------------- | ------------------------------------------------------ |
| `format-lint-markdown.sh`   | PostToolUse `Edit\|Write\|MultiEdit`      | Auto-format + markdownlint after every file edit       |
| `warm-cache-before-push.sh` | PreToolUse `Bash` (git push)              | Warms Nx cache before push                             |
| `block-env-file-access.sh`  | PreToolUse `Read\|Write\|Edit\|MultiEdit` | Blocks access to `.env*` files (except `.env.example`) |
| `worktree-create.sh`        | WorktreeCreate                            | Sets up isolated git worktree                          |

---

## Plan-First Enforcement

**Before implementing any non-trivial task**, check `plans/in-progress/` for an existing plan.

**Non-trivial** means any of:

- More than one commit required, OR
- More than two files changed, OR
- Multiple phases or acceptance criteria

**If no plan exists → create one first** using `plan-maker` agent before writing any code:

```text
plans/in-progress/YYYY-MM-DD__task-name/
├── README.md
├── requirements.md
├── technical-design.md
└── checklist.md
```

Then implement following the checklist. Move to `plans/done/` when all items complete.

This applies even when the user says "just do it quickly" — a plan takes one step, saves many.

---

## Merge Strategy

Branch protection is active on `main`. All changes go through PR:

```bash
git checkout -b <type>/<description>
# ... implement ...
git push -u origin <branch>
gh pr create ...
gh pr merge <number> --squash --auto
git checkout main && git pull origin main
```

Never push directly to `main`. Never use `--no-verify`.

---

## Related

- **`AGENTS.md`** — Canonical vendor-neutral agent instructions (imported above)
- **`governance/development/agents/ai-agent-guidelines.md`** — Full decision protocol
- **`governance/development/workflow/implementation.md`** — Step-by-step workflow
- **`plans/README.md`** — Plan structure and lifecycle
