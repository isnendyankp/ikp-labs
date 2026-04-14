# Caveman Commands Reference

Complete reference for Caveman Mode — a Claude Code plugin that enforces terse, token-efficient responses on every session.

## Mode Switching Commands

These commands are typed directly in the Claude Code prompt.

### `/caveman`

Activate or switch to **full** mode (default intensity).

```
/caveman
```

Drops: articles, filler words, pleasantries, hedging. Fragments allowed. Technical terms exact. Code blocks unchanged.

---

### `/caveman lite`

Switch to **lite** mode — drop filler words but keep complete sentences.

```
/caveman lite
```

Use when you want cleaner responses without losing readability.

---

### `/caveman ultra`

Switch to **ultra** mode — extreme compression, fragments dominant, prose minimal.

```
/caveman ultra
```

Use when context window is critical and you need maximum token efficiency.

---

### `/caveman wenyan-lite`

Switch to **Wenyan-Lite** mode — Classical Chinese style, light intensity.

```
/caveman wenyan-lite
```

---

### `/caveman wenyan`

Switch to **Wenyan-Full** mode — full 文言文 style.

```
/caveman wenyan
```

---

### `/caveman wenyan-ultra`

Switch to **Wenyan-Ultra** mode — ancient scholar mode, maximum classical compression.

```
/caveman wenyan-ultra
```

---

## Toggle Off/On

| Command | Effect |
|---|---|
| `stop caveman` | Deactivate — revert to normal verbose mode |
| `normal mode` | Same as above |
| `/caveman [level]` | Reactivate at specified level |

---

## Skills

Skills are invoked as slash commands. They have focused, task-specific behavior separate from the general intensity levels.

### `/caveman-commit`

Generate a terse conventional commit message (max 256 characters).

```
/caveman-commit
```

Follows conventional commits format: `type: description`. Drops verbose summaries and bullet lists.

---

### `/caveman-review`

Review code with one-line comments (max 30 per review).

```
/caveman-review
```

Each comment is a single line. No lengthy explanations.

---

### `/caveman-compress <file>`

Compress a Markdown file — approximately 46% size reduction.

```
/caveman-compress path/to/file.md
```

Removes filler prose, condenses tables, shortens headings while preserving semantic content.

---

### `/caveman-help`

Display a quick reference card with all modes and skills.

```
/caveman-help
```

---

## Mode Summary Table

| Mode | Trigger | Behavior |
|---|---|---|
| `lite` | `/caveman lite` | Drop filler, keep sentences |
| `full` | `/caveman` | Drop articles/filler/hedging, fragments OK — **default** |
| `ultra` | `/caveman ultra` | Extreme fragments, drop prose |
| `wenyan-lite` | `/caveman wenyan-lite` | Classical Chinese, light |
| `wenyan-full` | `/caveman wenyan` | Full 文言文 |
| `wenyan-ultra` | `/caveman wenyan-ultra` | Ancient scholar mode |

---

## Auto-Clarity Exceptions

Caveman automatically reverts to normal prose for:

- Security warnings
- Irreversible action confirmations
- Multi-step sequences where fragment order risks misread
- When user asks to clarify or repeats a question

Caveman resumes after the clear part is done.

---

## Flag File

Current active mode is stored at:

```bash
cat ~/.claude/.caveman-active
# Output: full
```

This file is read by the statusline script to display the mode badge.

---

## Default Mode Configuration

Resolution order (highest to lowest priority):

1. `CAVEMAN_DEFAULT_MODE` environment variable
2. `~/.config/caveman/config.json` → `defaultMode` field
3. Built-in default: `full`

---

**See also**:
- [How to Setup Caveman](../how-to/setup-caveman.md)
- [Understanding Caveman Mode](../explanation/caveman-mode.md)
