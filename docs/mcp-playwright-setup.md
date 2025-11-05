# MCP Playwright Setup Guide

## Apa itu MCP Playwright?

MCP (Model Context Protocol) Playwright adalah server yang memungkinkan AI seperti Claude untuk mengontrol browser secara langsung menggunakan Playwright. Dengan ini, Claude dapat:

- Navigate ke halaman web
- Klik button dan elemen UI
- Mengisi form
- Mengambil screenshot
- Execute JavaScript di browser
- Melakukan testing interaktif

## Installation

### 1. Install Package

Package sudah terinstall di project ini:

```bash
npm install @playwright/mcp
```

### 2. Konfigurasi Claude Desktop

File konfigurasi sudah dibuat di: `~/.config/claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": [
        "/Users/isnendyankp/Desktop/Programmer/Belajar/Project/Template/RegistrationForm/node_modules/@playwright/mcp/dist/index.js"
      ]
    }
  }
}
```

## Cara Menggunakan

### Restart Claude Desktop

Setelah konfigurasi, Anda perlu **restart Claude Desktop** agar MCP server aktif.

### Verifikasi MCP Server Aktif

Setelah restart, Claude akan memiliki akses ke tools Playwright seperti:

- `playwright_navigate` - Navigate ke URL
- `playwright_screenshot` - Ambil screenshot
- `playwright_click` - Click elemen
- `playwright_fill` - Isi form field
- `playwright_evaluate` - Execute JavaScript

### Contoh Penggunaan

**Contoh 1: Test Form Registration**
```
User: "Bisa tolong navigate ke http://localhost:3005 dan test form registration?"

Claude akan:
1. Navigate ke URL
2. Mengisi form dengan data test
3. Click button submit
4. Ambil screenshot hasil
5. Verifikasi success message
```

**Contoh 2: Visual Testing**
```
User: "Ambil screenshot dari halaman profile saya"

Claude akan:
1. Navigate ke halaman profile
2. Ambil screenshot
3. Tampilkan screenshot untuk review
```

**Contoh 3: Debugging**
```
User: "Cek apakah button upload picture visible di halaman profile"

Claude akan:
1. Navigate ke halaman profile
2. Check visibility button
3. Report status button
```

## Keuntungan MCP Playwright

### Dibanding E2E Test Biasa:

| **E2E Test (Playwright)** | **MCP Playwright** |
|--------------------------|-------------------|
| Static test script | Interactive browser control |
| Perlu tulis kode dulu | Claude bisa explore langsung |
| Fixed test scenarios | Flexible ad-hoc testing |
| Manual screenshot check | Auto screenshot by Claude |

### Use Cases:

1. **Quick Testing**: Test fitur baru tanpa menulis test script
2. **Debugging**: Investigate bug dengan interact langsung
3. **Visual Inspection**: Ambil screenshot untuk review UI
4. **Exploratory Testing**: Explore aplikasi secara interaktif
5. **Demo**: Demo fitur ke stakeholder dengan AI assistance

## Troubleshooting

### MCP Server Tidak Muncul

1. Pastikan path di `claude_desktop_config.json` benar
2. Restart Claude Desktop
3. Check apakah `@playwright/mcp` terinstall di `node_modules`

### Permission Error

Jika ada error permission, pastikan:
```bash
chmod +x node_modules/@playwright/mcp/dist/index.js
```

### Browser Tidak Launch

Pastikan Playwright browsers sudah terinstall:
```bash
npx playwright install
```

## Advanced Configuration

### Custom Browser Options

Anda bisa customize browser options di config:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "node",
      "args": [
        "/path/to/node_modules/@playwright/mcp/dist/index.js"
      ],
      "env": {
        "HEADLESS": "false",
        "BROWSER": "chromium"
      }
    }
  }
}
```

## Resources

- [Playwright MCP Official Docs](https://github.com/microsoft/playwright-mcp)
- [Model Context Protocol Spec](https://modelcontextprotocol.io)
- [Playwright Documentation](https://playwright.dev)

## Project Context

**Project**: Registration Form Application
**Tech Stack**: React (Frontend) + Spring Boot (Backend)
**Port**: Frontend runs on `http://localhost:3005`
**E2E Tests**: Located in `tests/e2e/`

Dengan MCP Playwright, Anda sekarang bisa meminta Claude untuk test aplikasi secara interaktif!
