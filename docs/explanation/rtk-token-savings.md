# Understanding RTK Token Savings

This document explains what RTK is, why token savings matter when using Claude Code, and how RTK achieves those savings transparently.

## What is RTK?

RTK (Rust Token Killer) is a CLI proxy tool that sits between Claude Code and your shell. When Claude Code runs a Bash command, RTK intercepts the output, filters out noise and redundant information, and returns a compressed version to Claude — consuming far fewer tokens.

It is available at [rtk-ai.app](https://www.rtk-ai.app/).

## Why Token Savings Matter

Claude Code operates within a token budget. Every time Claude executes a shell command, the output is returned as tokens that Claude must process. Without RTK:

- `git log --oneline -50` returns 50 full commit lines
- `git diff` on a large file returns the entire raw diff
- `git status` includes decorative text and hints Claude doesn't need

These tokens cost money on paid plans and consume context window space — reducing how much useful code and conversation can fit in a single session.

## How RTK Works

RTK operates as a **transparent hook** inside Claude Code. The flow is:

```
Claude Code
    │
    ▼
Bash command issued (e.g., "git status")
    │
    ▼
rtk-rewrite.sh hook intercepts
    │
    ▼
RTK filters & compresses the output
    │
    ▼
Claude receives the compressed result
```

This happens automatically — Claude Code doesn't know the difference, and you don't need to change how you prompt Claude.

## What RTK Filters

RTK applies intelligent filtering based on command type:

| Command Type | What Gets Filtered |
|---|---|
| `git log` | Decorative formatting, graph lines, author padding |
| `git diff` | Unchanged context lines (keeps only the diff) |
| `git commit` | Verbose confirmation messages, hints |
| `git push` | Progress bars, remote counting output |
| `git status` | Hint text, decorative separators |

The goal is to preserve **semantic content** (what changed, what the result was) while removing **presentation content** (formatting, tips, progress indicators).

## Expected Savings

Based on real usage data:

| Command | Average Savings |
|---|---|
| `git commit` | ~98% |
| `git push` | ~92% |
| `git diff` | ~76% |
| `git log` | ~2–62% (depends on flags) |
| `git status` | ~52% |

Overall session savings typically range from **40–70%** depending on workflow intensity. The more git operations Claude performs, the higher the savings rate.

## Why Some Commands Save More Than Others

`git commit` saves ~98% because the confirmation output is very verbose (full diff summary, stats, branch info) but Claude only needs to know "commit succeeded with hash X." RTK strips everything else.

`git log --oneline` saves less because the output is already compact — there is less noise to remove.

## Global vs Per-Project

RTK is configured globally in `~/.claude/settings.json`. This is intentional: token savings apply to every project without any per-project configuration. The `rtk gain` analytics are also global — they accumulate across all projects and all Claude Code sessions on the machine.

## Limitations

- RTK only filters **command output** — it does not compress prompts or file reads
- Savings depend on command verbosity — simple commands benefit less
- The `rtk discover` command can identify missed opportunities from sessions before RTK was installed, but cannot retroactively recover those tokens

---

**See also**:
- [How to Setup RTK](../how-to/setup-rtk.md)
- [RTK Commands Reference](../reference/rtk-commands.md)
