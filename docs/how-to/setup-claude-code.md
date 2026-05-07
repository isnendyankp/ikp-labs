# Claude Code Configuration Setup

This guide explains how to set up Claude Code permissions for the IKP-Labs project.

## 📋 What is .clauderc?

`.clauderc` is a configuration file that controls what Claude Code can and cannot do in your local development environment. It's like a **permission system** for AI-assisted coding.

## 🔧 Setup Instructions

### Step 1: Copy the Example File

```bash
cp .clauderc.example .clauderc
```

### Step 2: Edit Paths

Open `.clauderc` in your editor and replace the placeholder paths:

**Replace:**

```json
"Edit(//path/to/your/IKP-Labs/**)"
"Read(//path/to/your/home/**)"
"Write(//path/to/your/IKP-Labs/**)"
```

**With your actual paths:**

```json
"Edit(//Users/YOUR_USERNAME/path/to/IKP-Labs/**)"
"Read(//Users/YOUR_USERNAME/**)"
"Write(//Users/YOUR_USERNAME/path/to/IKP-Labs/**)"
```

**Example (macOS):**

```json
"Edit(//Users/johndoe/projects/IKP-Labs/**)"
"Read(//Users/johndoe/**)"
"Write(//Users/johndoe/projects/IKP-Labs/**)"
```

**Example (Windows):**

```json
"Edit(//C:/Users/johndoe/projects/IKP-Labs/**)"
"Read(//C:/Users/johndoe/**)"
"Write(//C:/Users/johndoe/projects/IKP-Labs/**)"
```

### Step 3: Customize Preferences (Optional)

#### Co-Authorship

```json
"includeCoAuthoredBy": false
```

- `false`: Commits only show your name
- `true`: Commits include "Co-Authored-By: Claude"

#### Ask Permissions

```json
"ask": []
```

Add commands that require your approval before execution:

```json
"ask": [
  "Bash(git push:*)",    // Ask before pushing to GitHub
  "Bash(npm install:*)"  // Ask before installing packages
]
```

## 🔒 Security Features

### ✅ Allowed by Default

- Git operations (add, commit, push, log)
- Maven/NPM commands (test, build, run)
- File operations (read, write, edit) **only in project folder**
- Web search and documentation fetch
- Docker commands

### ❌ Denied (Safety Rules)

- `rm -rf /*` - Cannot delete system files
- `rm -rf ~/*` - Cannot delete home directory
- `sudo rm:*` - Cannot delete with admin privileges
- `sudo:*` - Cannot use sudo commands

## 📂 Why .clauderc is Gitignored

`.clauderc` is in `.gitignore` because:

1. **Personal Paths**: Contains your specific file system paths
2. **Personal Preferences**: Co-authorship and permission settings are individual choices
3. **Security**: Shouldn't expose your system structure to others
4. **Best Practice**: Local config files stay local

## 🚀 How to Use

Once configured, Claude Code will:

- ✅ Automatically run safe commands (git, mvn, npm)
- ✅ Edit/create files only in your IKP-Labs folder
- ✅ Respect safety rules (no dangerous deletions)
- ✅ Follow your permission preferences

## ⚠️ Troubleshooting

### Claude asks for permission every time

**Solution:** Check that paths in `.clauderc` match your actual project location.

### Claude cannot edit files

**Solution:** Verify `Edit(...)` and `Write(...)` paths include `**` wildcard for all subfolders.

### Commands are denied

**Solution:** Check if command is in `"deny"` list. Remove if you trust the command.

## 📚 Learn More

For more about Claude Code configuration:

- [Claude Code Documentation](https://docs.claude.com/claude-code)
- [Permissions Reference](https://docs.claude.com/claude-code/permissions)

## 🤝 Contributing

If you improve the `.clauderc.example` configuration:

1. Update `.clauderc.example` (not `.clauderc`)
2. Use placeholder paths (not your actual paths)
3. Commit and push the example file
4. Other developers will benefit from your improvements

---

**Remember:** Never commit your personal `.clauderc` file - it contains your local paths!

---

## 🔧 Troubleshooting: Migrasi dari z.ai ke Claude AI Subscription

## 📖 Background

Sebelumnya, Claude Code Extension dikonfigurasi menggunakan **z.ai API** (free tier dengan model `glm-5.1`). Namun, API key z.ai sudah **expired** dan perlu migrasi ke **Claude AI Subscription** (berbayar) menggunakan email sharing.

## ❌ Masalah yang Terjadi

### 1. **Error 401: Token Expired**

```text
401 {"error":{"message":"token expired or incorrect","type":"401"}}
```

### 2. **Claude Code Extension Tidak Bisa Response**

- Login di web browser (`claude.ai`) berhasil
- Extension menunjukkan sudah login dengan akun subscription
- Tapi saat chat, tidak ada response atau stuck di "Marinating..."

### 3. **Terminal Masih Menunjukkan z.ai**

```bash
$ claude
Claude Code v2.1.104
glm-5.1 · Claude Max  # ❌ Masih menunjukkan glm-5.1 (z.ai)
```

## 🔍 Akar Masalah

Konfigurasi z.ai tersimpan di **3 lokasi berbeda** dan masih aktif meskipun sudah login dengan subscription:

### 1. **File `~/.claude/settings.json`**

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "a86c96f2b8414e04b9929939d557e854.ychKTRNBP6G7krKC",
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5.1"
  }
}
```

### 2. **File `.claude/settings.json` (project-level)**

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "...",
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-5.1"
  }
}
```

### 3. **Environment Variables di `~/.zshrc`**

```bash
export ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"
export ANTHROPIC_DEFAULT_SONNET_MODEL="glm-5.1"
export ZAI_API_KEY="a86c96f2b8414e04b9929939d557e854.ychKTRNBP6G7krKC"
```

### 4. **Cache & Session**

- `~/.claude/sessions/`
- `~/.claude/backups/`
- `~/.claude/debug/`
- `~/.windsurf/extensions/anthropic.claude-code-*/`

## ✅ Solusi Lengkap

### **Step 1: Bersihkan Konfigurasi z.ai dari File Settings**

#### Global Settings (`~/.claude/settings.json`)

```bash
cat > ~/.claude/settings.json << 'EOF'
{
  "permissions": {
    "allow": [
      "Bash(1 --timeout 120000)"
    ]
  }
}
EOF
```

#### Project Settings (`.claude/settings.json`)

```bash
cat > .claude/settings.json << 'EOF'
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|MultiEdit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'file_path=\"$(jq -r \".tool_input.file_path // empty\" <<< \"$CLAUDE_TOOL_INPUT\")\"; if [[ \"$file_path\" =~ \\.(js|jsx|ts|tsx|json|md|yml|yaml)$ ]]; then prettier --write \"$file_path\" 2>/dev/null || true; fi'"
          }
        ]
      }
    ]
  }
}
EOF
```

### **Step 2: Hapus Environment Variables dari `~/.zshrc`**

Edit `~/.zshrc` dan **hapus semua baris** yang berisi:

```bash
export ANTHROPIC_BASE_URL="https://api.z.ai/api/anthropic"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="glm-4.5-air"
export ANTHROPIC_DEFAULT_SONNET_MODEL="glm-5.1"
export ANTHROPIC_DEFAULT_OPUS_MODEL="glm-5.1"
export ZAI_API_KEY="..."
export PATH=/Users/isnendyankp/.opencode/bin:$PATH
```

**Pastikan hanya tersisa:**

```bash
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"
```

### **Step 3: Bersihkan Cache & Session**

```bash
# Hapus cache Claude
rm -rf ~/.claude/cache
rm -rf ~/.claude/sessions
rm -rf ~/.claude/backups
rm -rf ~/.claude/debug
rm -rf ~/.claude/ide
rm -rf ~/.claude/projects
rm -rf ~/.claude/mcp-needs-auth-cache.json

# Hapus extension cache
rm -rf ~/.windsurf/extensions/anthropic.claude-code*
rm -rf ~/Library/Application\ Support/Windsurf/CachedExtensionVSIXs/.trash/anthropic.claude-code*
```

### **Step 4: Uninstall & Reinstall Claude Code Extension**

1. **Uninstall:**
   - Buka Extensions panel (`Cmd + Shift + X`)
   - Cari "Claude Code"
   - Klik **Uninstall**

2. **Restart Windsurf:**
   - Tekan `Cmd + Q`
   - Buka kembali Windsurf

3. **Reinstall:**
   - Buka Extensions panel (`Cmd + Shift + X`)
   - Cari "Claude Code"
   - Klik **Install**

### **Step 5: Login dengan Subscription**

1. **Buka panel Claude Code** (klik icon bintang oranye di sidebar)
2. **Klik "Sign In"** atau ketik `/login`
3. **Pilih "Claude.ai Subscription"**
4. **Login dengan email sharing** dari senior
5. **Authorize** di browser

### **Step 6: Restart Windsurf & Terminal**

**PENTING:** Ini langkah yang paling krusial!

1. **Tutup SEMUA terminal** yang sedang berjalan di Windsurf
2. **Restart Windsurf sepenuhnya** (`Cmd + Q` → buka lagi)
3. **Buka terminal BARU**
4. **Verifikasi environment variables sudah bersih:**

   ```bash
   env | grep ANTHROPIC
   ```

   Seharusnya **tidak ada output** (kosong)

### **Step 7: Test Claude Code**

1. **Buka panel Claude Code**
2. **Ketik pesan sederhana:** `hello`
3. **Seharusnya mendapat response** dari Claude AI (bukan z.ai)

## ✅ Verifikasi Sukses

### **Cek di Terminal:**

```bash
$ claude
Claude Code v2.1.104
Claude Max  # ✅ Tidak ada "glm-5.1" lagi
```

### **Cek Account & Usage:**

- Ketik `/` di panel Claude Code
- Pilih "Account & Usage"
- **Auth method:** Claude AI ✅
- **Plan:** Claude max ✅
- **Organization:** email sharing ✅

## 🎯 Kesimpulan

**Masalah utama:** Environment variables z.ai masih aktif di terminal yang sedang berjalan, meskipun sudah dihapus dari file konfigurasi.

**Solusi kunci:**

1. Hapus semua konfigurasi z.ai dari 3 lokasi (settings.json, .zshrc, cache)
2. **Restart Windsurf sepenuhnya**
3. **Tutup semua terminal lama** dan buka terminal baru

**Mengapa restart penting:**

- Terminal yang sudah terbuka **menyimpan environment variables lama** di memory
- Meskipun `.zshrc` sudah dibersihkan, terminal lama masih pakai variable lama
- Hanya terminal **BARU** (setelah restart) yang akan membaca `.zshrc` yang sudah bersih

## 📚 Referensi

- [Claude Code Documentation](https://code.claude.com/docs/en/vs-code)
- [Troubleshooting: Claude Code Never Responds](https://code.claude.com/docs/en/vs-code#claude-code-never-responds)

---

**Catatan:** Dokumentasi ini dibuat berdasarkan pengalaman troubleshooting migrasi dari z.ai ke Claude AI Subscription pada 13 April 2026.
