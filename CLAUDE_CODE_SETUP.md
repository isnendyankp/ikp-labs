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
