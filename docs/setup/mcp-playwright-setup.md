# Playwright MCP Server Setup Guide

## Overview
Playwright MCP (Model Context Protocol) server enables AI assistants to interact with web browsers through Playwright for automated testing and browser automation tasks.

## Installation Status
- **Package**: @playwright/mcp
- **Version**: 0.0.45
- **Status**: ✅ Installed and Configured

## Configuration

### MCP Server Configuration File
Location: `~/.config/claude-code/mcp_server_config.json`

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

### What This Configuration Does
1. **mcpServers**: Defines available MCP servers
2. **playwright**: Name identifier for the Playwright MCP server
3. **command**: Uses `npx` to run the package
4. **args**:
   - `-y`: Auto-confirm package execution
   - `@playwright/mcp@latest`: Always use the latest version

## How to Use

### For AI Assistants
Once configured, AI assistants (like Claude Code) can:
- Launch browsers (Chromium, Firefox, WebKit)
- Navigate to URLs
- Interact with web elements
- Take screenshots
- Execute automated tests
- Fill forms and click buttons

### Restart Required
After creating or modifying the MCP configuration:
1. Restart your Claude Code session
2. The Playwright MCP tools will be available automatically

## Verification

To verify the installation:
```bash
npx -y @playwright/mcp@latest --version
```

Expected output: `Version 0.0.45` (or later)

## Benefits

### For Testing
- Automated E2E test execution
- Visual regression testing
- Cross-browser testing support

### For Development
- Interactive browser debugging
- Form testing and validation
- API interaction testing
- Screenshot and video recording

## Troubleshooting

### MCP Server Not Found
If the MCP server is not recognized:
1. Verify the config file exists at `~/.config/claude-code/mcp_server_config.json`
2. Check JSON syntax is valid
3. Restart Claude Code completely

### Command Fails
If `npx @playwright/mcp` fails:
1. Ensure Node.js and npm are installed
2. Check internet connection for package download
3. Verify npx is available: `npx --version`

## Related Documentation
- [Playwright Official Docs](https://playwright.dev)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [E2E Testing Guide](../testing/e2e-testing-guide.md)

## Last Updated
2025-11-06
