# Setup Caveman Mode

This guide explains how to install and configure Caveman Mode for Claude Code to get terse, token-efficient responses by default on every session.

## Prerequisites

- Claude Code installed and configured
- Node.js installed (for hook scripts)

## Step 1: Install the Caveman Plugin

Caveman is distributed as a Claude Code plugin. Install via the Claude Code plugin registry:

```bash
claude plugin install caveman
```

This places the hook files into `~/.claude/hooks/` and skill files into `~/.claude/skills/caveman/`.

**Verify installation:**

```bash
ls ~/.claude/hooks/ | grep caveman
# Expected: caveman-activate.js  caveman-config.js  caveman-mode-tracker.js  caveman-statusline.sh
```

## Step 2: Register Hooks in Claude Code Settings

Open `~/.claude/settings.json` and add the following hooks:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"/Users/YOUR_USERNAME/.claude/hooks/caveman-activate.js\"",
            "timeout": 5,
            "statusMessage": "Loading caveman mode..."
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "node \"/Users/YOUR_USERNAME/.claude/hooks/caveman-mode-tracker.js\"",
            "timeout": 5,
            "statusMessage": "Tracking caveman mode..."
          }
        ]
      }
    ]
  },
  "statusLine": {
    "type": "command",
    "command": "bash \"/Users/YOUR_USERNAME/.claude/hooks/caveman-statusline.sh\""
  }
}
```

Replace `YOUR_USERNAME` with your actual macOS username.

## Step 3: Set Default Mode (Optional)

The default mode is `full`. To change it, create a config file:

```bash
mkdir -p ~/.config/caveman
cat > ~/.config/caveman/config.json << 'EOF'
{
  "defaultMode": "lite"
}
EOF
```

Valid values: `off`, `lite`, `full`, `ultra`, `wenyan-lite`, `wenyan`, `wenyan-ultra`.

Alternatively, use an environment variable (takes highest priority):

```bash
export CAVEMAN_DEFAULT_MODE=lite
```

## Step 4: Verify Everything Works

Restart Claude Code. You should see in the session startup context:

```text
CAVEMAN MODE ACTIVE — level: full
```

The status bar will also show the active mode badge (e.g., `[CAVEMAN]`, `[CAVEMAN:ULTRA]`).

## How It Works

Once configured, Caveman activates **automatically on every session start** — no manual commands required.

```text
claude (terminal)
       │
       ▼
SessionStart hook fires
       │
       ▼
caveman-activate.js injects behavior rules into session context
       │
       ▼
Claude responds terse every turn
       │
       ▼
UserPromptSubmit hook tracks mode changes (/caveman lite|full|ultra)
```

## Global Configuration

The hooks are configured globally in `~/.claude/settings.json`, meaning Caveman applies to **all projects and all sessions** automatically. No per-project setup required.

## Troubleshooting

| Problem | Solution |
|---|---|
| Caveman not activating | Verify `caveman-activate.js` exists in `~/.claude/hooks/` |
| Status bar badge missing | Add `statusLine` config to `~/.claude/settings.json` |
| Mode not persisting across sessions | Check that `SessionStart` hook is registered correctly |
| `/caveman` command not recognized | Verify `UserPromptSubmit` hook is registered |
| Want to disable permanently | Set `defaultMode: "off"` in `~/.config/caveman/config.json` |

---

**See also**:

- [Caveman Commands Reference](../reference/caveman-commands.md)
- [Understanding Caveman Mode](../explanation/caveman-mode.md)
