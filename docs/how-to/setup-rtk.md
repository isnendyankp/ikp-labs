# Setup RTK (Rust Token Killer)

This guide explains how to install and configure RTK for use with Claude Code to reduce token consumption.

## Prerequisites

- Claude Code installed and configured
- Homebrew installed (macOS)

## Step 1: Install RTK

```bash
brew install rtk-ai/tap/rtk
```

Verify the installation:

```bash
rtk --version
# Expected output: rtk X.Y.Z

which rtk
# Expected output: /opt/homebrew/bin/rtk
```

> **Warning**: There is a name collision with `reachingforthejack/rtk` (Rust Type Kit). If `rtk gain` fails or behaves unexpectedly, verify you have the correct binary with `which rtk`.

## Step 2: Configure the Hook

RTK works by intercepting Bash commands from Claude Code via a hook. Create the hook script:

```bash
mkdir -p ~/.claude/hooks
cat > ~/.claude/hooks/rtk-rewrite.sh << 'EOF'
#!/bin/bash
exec rtk proxy "$@"
EOF
chmod +x ~/.claude/hooks/rtk-rewrite.sh
```

## Step 3: Register the Hook in Claude Code Settings

Open `~/.claude/settings.json` and add the hook under the `Bash` matcher:

```json
{
  "hooks": [
    {
      "matcher": "Bash",
      "hooks": [
        {
          "type": "command",
          "command": "/Users/YOUR_USERNAME/.claude/hooks/rtk-rewrite.sh"
        }
      ]
    }
  ]
}
```

Replace `YOUR_USERNAME` with your actual macOS username.

## Step 4: Verify Everything Works

Restart Claude Code, then run:

```bash
rtk gain
```

If you see a savings report (even with 0 commands), the hook is active and RTK is working correctly.

## How It Works

Once configured, RTK runs **automatically in the background** — no manual intervention required. Every Bash command Claude Code executes is transparently rewritten through RTK, which filters and compresses the output before returning it to Claude.

```text
Claude Code → Bash command → rtk-rewrite.sh hook → RTK filters output → Claude receives compressed result
```

## Global Configuration

The hook is configured globally in `~/.claude/settings.json`, meaning it applies to **all projects** automatically. There is no per-project setup required.

## Troubleshooting

| Problem | Solution |
|---|---|
| `rtk: command not found` | Re-run `brew install rtk-ai/tap/rtk` |
| `rtk gain` shows Rust Type Kit output | Wrong `rtk` binary — check `which rtk` |
| Hook not firing | Verify `~/.claude/hooks/rtk-rewrite.sh` exists and is executable (`chmod +x`) |
| No savings shown | Normal for new installs — savings accumulate with usage |

---

**See also**:

- [RTK Commands Reference](../reference/rtk-commands.md)
- [Understanding RTK Token Savings](../explanation/rtk-token-savings.md)
