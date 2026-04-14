# Understanding Caveman Mode

This document explains what Caveman Mode is, why response verbosity matters when using Claude Code, and how Caveman enforces terse behavior reliably across sessions.

## What is Caveman Mode?

Caveman Mode is a Claude Code plugin that enforces terse, compressed responses from Claude on every session. When active, Claude drops filler words, articles, pleasantries, and hedging language — keeping only technical substance.

The name reflects the style: responses sound like a smart caveman who knows exactly what to say but wastes no words on social niceties.

## Why Verbosity Matters

Claude's default behavior is optimized for broad audiences — it includes pleasantries, hedging, explanations of what it's about to do, and trailing summaries. For developers working interactively in Claude Code, this creates friction:

- "Sure! I'd be happy to help you with that." — 12 tokens, zero information
- "Let me look into this for you." — 8 tokens before any real content starts
- "I hope this helps! Let me know if you need anything else." — 16 tokens after the work is done

Multiplied across hundreds of turns in a session, verbose responses consume context window space that could hold more code, more history, and more useful context. Caveman Mode eliminates this overhead.

## How Caveman Works

Caveman operates via two Claude Code hooks that fire automatically:

```
claude (terminal)
       │
       ▼
SessionStart hook fires
       │
       ▼
caveman-activate.js reads active mode from config
       │
       ├── Writes ~/.claude/.caveman-active (statusline reads this)
       └── Emits full behavior ruleset into session context
              │
              ▼
       Claude receives rules — terse behavior locked in for entire session
              │
              ▼
       Each user prompt → UserPromptSubmit hook fires
              │
              └── caveman-mode-tracker.js detects /caveman commands
                     → Updates ~/.claude/.caveman-active if mode changed
```

The ruleset is injected once at session start. Because it is comprehensive (not a 2-sentence summary), Claude does not drift back to verbose behavior mid-session — even after context compression prunes older messages.

## What Caveman Removes

| Removed | Example |
|---|---|
| Articles | "the file", "a function" → "file", "function" |
| Filler words | just, really, basically, actually, simply |
| Pleasantries | Sure!, Certainly!, Of course!, Happy to help! |
| Hedging | "This might be", "It seems like", "I think" |
| Trailing summaries | "I hope this helps! Let me know if..." |
| Preamble | "Let me look at that for you. I'll check..." |

## What Caveman Preserves

- All technical content and accuracy
- Code blocks (unchanged, never compressed)
- Error messages (quoted exactly)
- Technical terms (used precisely, never substituted)
- Numbered steps (order preserved)

## Intensity Levels

Caveman has three main intensity levels:

**Lite** — Removes filler words but keeps grammatically complete sentences. Best for users who want cleaner responses without losing readability.

**Full** (default) — Drops articles, filler, pleasantries, and hedging. Fragments are acceptable. The balance point between terse and readable.

**Ultra** — Maximum compression. Fragments dominate, prose is minimal. Best when context window space is critical.

## Auto-Clarity Safety

Caveman is not applied blindly. It automatically reverts to normal prose for situations where fragment-style responses risk confusion or missed information:

- **Security warnings** — must be unambiguous
- **Irreversible action confirmations** — "delete branch", "drop table" need clarity
- **Multi-step sequences** — where fragment order could be misread
- **Clarification requests** — when the user asks to repeat or explain

After the safety-critical part is communicated, Caveman resumes.

## Why a Hook Instead of a Prompt

An alternative approach is to tell Claude to be terse at the start of each conversation. This works, but has failure modes:

- Claude drifts back to verbose behavior after context compression
- Must be repeated every session manually
- Inconsistent across projects

The hook approach solves all three: the ruleset is injected automatically, it is comprehensive enough to survive context compression, and it applies globally to all projects.

## Relationship with RTK

Caveman Mode and RTK address different token costs:

| | Caveman Mode | RTK |
|---|---|---|
| What it compresses | Claude's text responses | Shell command output |
| When it fires | Every response turn | Every Bash command |
| Analytics | None (response style, not measurable tokens) | `rtk gain` shows savings |
| Scope | All sessions globally | All sessions globally |

Both are active simultaneously. RTK reduces tokens from command output; Caveman reduces tokens from Claude's prose. Together they cover the two main sources of token overhead in a typical Claude Code session.

---

**See also**:
- [How to Setup Caveman](../how-to/setup-caveman.md)
- [Caveman Commands Reference](../reference/caveman-commands.md)
