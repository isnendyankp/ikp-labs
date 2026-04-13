# RTK Commands Reference

Complete command reference for RTK (Rust Token Killer) — a CLI proxy that reduces token consumption when Claude Code executes shell commands.

## Meta Commands

These commands are always run directly (not intercepted by the hook).

### `rtk gain`

Display token savings analytics for the current scope.

```bash
rtk gain
```

**Example output:**

```
RTK Token Savings (Global Scope)
════════════════════════════════════════════════════════════

Total commands:    56
Input tokens:      9.5K
Output tokens:     5.1K
Tokens saved:      4.5K (47.0%)
Total exec time:   2m12s (avg 2.4s)
Efficiency meter: ████████████░░░░░░░░░░░░ 47.0%

By Command
───────────────────────────────────────────────────────────────────────
  #  Command                   Count  Saved    Avg%    Time  Impact
───────────────────────────────────────────────────────────────────────
 1.  rtk git commit                7    1.3K   98.0%    4.5s  ██████████
 2.  rtk git push origin           3     475   95.6%   18.9s  ████████
...
```

**Fields explained:**

| Field | Description |
|---|---|
| Total commands | Number of commands processed by RTK |
| Input tokens | Tokens in the raw command output |
| Output tokens | Tokens after RTK filtering |
| Tokens saved | Absolute and percentage reduction |
| Total exec time | Cumulative execution time |
| Efficiency meter | Visual indicator of savings rate |

---

### `rtk gain --history`

Show command usage history with per-command savings breakdown.

```bash
rtk gain --history
```

Useful for identifying which commands generate the most token overhead over time.

---

### `rtk discover`

Analyze Claude Code command history to find missed optimization opportunities — commands that were run without RTK filtering.

```bash
rtk discover
```

Run this after initial setup to see potential savings from previous sessions.

---

### `rtk proxy <cmd>`

Execute a raw command **without** RTK filtering. Used for debugging to compare filtered vs unfiltered output.

```bash
rtk proxy git log --oneline
```

Use this when you suspect RTK is incorrectly filtering output and want to see the raw result.

---

### `rtk --version`

Display the installed RTK version.

```bash
rtk --version
# Output: rtk 0.35.0
```

---

## Hook-Based Commands

All other commands are **automatically rewritten** by the Claude Code hook. You never call these directly — Claude Code does.

| Original Command | Rewritten As | Typical Savings |
|---|---|---|
| `git status` | `rtk git status` | ~52% |
| `git diff` | `rtk git diff` | ~76% |
| `git commit` | `rtk git commit` | ~98% |
| `git push` | `rtk git push` | ~92% |
| `git log` | `rtk git log` | ~2% |
| `git fetch` | `rtk git fetch` | ~25% |

> Savings percentages vary depending on output size. Commands with verbose output (like `git diff` on large files) benefit the most.

## Scope

By default, `rtk gain` reports on the **global scope** (all projects). RTK does not support per-project scoping — analytics are accumulated across all Claude Code sessions on the machine.

---

**See also**:
- [How to Setup RTK](../how-to/setup-rtk.md)
- [Understanding RTK Token Savings](../explanation/rtk-token-savings.md)
