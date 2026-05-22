# Technical Design: Claude Settings Hardening

## Target settings.json

```json
{
  "permissions": {
    "allow": [
      "Read(.claude/**)",
      "Write(.claude/**)",
      "Edit(.claude/**)",
      "Write(/tmp/**)",
      "Read(/tmp/**)",
      "Bash",
      "Skill(update-config)"
    ]
  },
  "hooks": { ... },
  "enabledPlugins": {
    "context7@claude-plugins-official": true,
    "playwright@claude-plugins-official": true,
    "typescript-lsp@claude-plugins-official": true,
    "jdtls-lsp@claude-plugins-official": true,
    "nx@nx-claude-plugins": true
  },
  "extraKnownMarketplaces": {
    "nx-claude-plugins": {
      "source": {
        "source": "github",
        "repo": "nrwl/nx-ai-agents-config"
      }
    }
  }
}
```

## File to Modify

`.claude/settings.json` — already tracked (added in Gap #3). No `git add -f` needed.

## Risk

**Low** — additive only. Existing hooks untouched. `permissions.allow` grants
access to already-used paths; it doesn't restrict anything.
