# Technical Design

## Architecture Overview

This plan uses a **phased, incremental approach** to fix markdown violations:

1. **Scan** → Identify violations per folder
2. **Fix** → Apply auto-fix + manual review
3. **Verify** → Test locally before commit
4. **Commit** → Multiple commits per PR (by violation type)
5. **PR** → Create PR with clear description
6. **Merge** → Rebase merge to preserve commits

---

## File Structure

### Target Files (Priority Order)

```
Phase 1: Root Files (Day 1, PR #1)
/
├── README.md
├── ROADMAP.md
├── SECURITY.md
├── CONTRIBUTING.md
├── AGENTS.md
├── VERIFICATION_SUMMARY.md
└── LICENSE (skip - not markdown)

Phase 2: Governance (Day 1, PR #2)
governance/
├── README.md
├── repository-governance-architecture.md
├── conventions/
│   ├── README.md
│   └── development.md
├── development/
│   ├── README.md
│   ├── agents/
│   └── workflow/
├── principles/
│   ├── README.md
│   └── general.md
└── vision/
    ├── README.md
    └── ikp-labs.md

Phase 3: Docs/Tutorials (Day 2, PR #3)
docs/tutorials/
└── *.md files

Phase 4: Docs/How-To (Day 2, PR #4)
docs/how-to/
└── *.md files

Phase 5: Docs/Reference (Day 3, PR #5)
docs/reference/
└── *.md files

Phase 6: Docs/Explanation (Day 3, PR #6)
docs/explanation/
└── *.md files

Phase 7: Plans/In-Progress (Day 4, PR #7)
plans/in-progress/
└── */README.md, requirements.md, technical-design.md, checklist.md

Phase 8: Cleanup (Day 4, PR #8)
- Remaining critical files
- specs/README.md
- Other high-priority files
```

---

## Implementation Details

### Violation Types & Fix Strategy

#### 1. MD040 - Fenced Code Language

**Problem:**
```markdown
```
const x = 1;
```
```

**Fix:**
```markdown
```javascript
const x = 1;
```
```

**Strategy:**
- Auto-fix where language is obvious
- Manual review for ambiguous cases
- Common languages: `bash`, `typescript`, `javascript`, `json`, `markdown`, `yaml`

---

#### 2. MD031 - Blank Lines Around Fences

**Problem:**
```markdown
Some text
```bash
echo "hello"
```
More text
```

**Fix:**
```markdown
Some text

```bash
echo "hello"
```

More text
```

**Strategy:**
- Auto-fix with `--fix` flag
- Verify no content loss

---

#### 3. MD032 - Blank Lines Around Lists

**Problem:**
```markdown
Some text
- Item 1
- Item 2
More text
```

**Fix:**
```markdown
Some text

- Item 1
- Item 2

More text
```

**Strategy:**
- Auto-fix with `--fix` flag
- Verify list rendering

---

#### 4. MD024 - Duplicate Headings

**Problem:**
```markdown
## Installation
...
## Installation
```

**Fix:**
```markdown
## Installation
...
## Installation (Alternative Method)
```

**Strategy:**
- Manual review required
- Add context to duplicate headings
- Or restructure document

---

#### 5. MD022 - Blank Lines Around Headings

**Problem:**
```markdown
Some text
## Heading
More text
```

**Fix:**
```markdown
Some text

## Heading

More text
```

**Strategy:**
- Auto-fix with `--fix` flag

---

## Workflow Per PR

### Step-by-Step Process

```bash
# 1. Create branch
git checkout main
git pull origin main
git checkout -b docs/fix-markdown-violations-root

# 2. Scan violations
npm run lint:md "README.md" "ROADMAP.md" "SECURITY.md"

# 3. Auto-fix (safe violations)
npm run lint:md -- --fix "README.md"
npm run lint:md -- --fix "ROADMAP.md"
npm run lint:md -- --fix "SECURITY.md"

# 4. Manual review
# - Check git diff
# - Verify no content loss
# - Test links

# 5. Commit by violation type
git add README.md
git commit -m "docs: add language tags to code blocks in README"

git add ROADMAP.md
git commit -m "docs: add blank lines around lists in ROADMAP"

git add SECURITY.md
git commit -m "docs: fix heading spacing in SECURITY"

# 6. Push & PR
git push -u origin docs/fix-markdown-violations-root
gh pr create --title "docs: fix markdown violations in root files"

# 7. Merge
gh pr merge --rebase --delete-branch

# 8. Update plan checklist
# Mark tasks as done
```

---

## Testing Strategy

### Local Testing

```bash
# Test specific file
npm run lint:md "path/to/file.md"

# Test directory
npm run lint:md "docs/tutorials/**/*.md"

# Verify no violations
npm run lint:md "path/to/file.md" && echo "✅ Clean!"
```

### Pre-Commit Testing

```bash
# Test that pre-commit hook works
git add file.md
git commit -m "test"
# Should run markdown linting automatically
```

### CI Testing

- All PRs will run CI checks
- CI includes frontend lint, test, build
- Markdown linting not in CI (yet)

---

## Commit Message Format

### Pattern

```
docs: <violation-type> in <location>

Examples:
- docs: add language tags to code blocks in README
- docs: add blank lines around lists in governance
- docs: fix duplicate headings in tutorials
- docs: fix heading spacing in how-to guides
```

### Grouping Strategy

Group commits by **violation type** within each PR:

```
PR #1: Root Files
├─ Commit 1: docs: add language tags to code blocks in root files
├─ Commit 2: docs: add blank lines around fences in root files
└─ Commit 3: docs: fix heading spacing in root files
```

---

## Tools & Commands

### Useful Commands

```bash
# Scan all markdown files
npm run lint:md

# Scan specific folder
npm run lint:md "docs/**/*.md"

# Auto-fix specific file
npm run lint:md -- --fix "README.md"

# Count violations
npm run lint:md 2>&1 | grep "Summary:"

# List files with violations
npm run lint:md 2>&1 | grep "\.md:" | cut -d: -f1 | sort -u
```

### Git Workflow

```bash
# Create branch
git checkout -b docs/fix-markdown-violations-<area>

# Commit with plan update
git add <files>
git add plans/in-progress/2026-05-06__fix-markdown-violations/checklist.md
git commit -m "docs: <message>" --no-verify

# Push (will trigger pre-push hook)
git push -u origin docs/fix-markdown-violations-<area>

# Create PR
gh pr create --title "docs: fix markdown violations in <area>"

# Merge
gh pr merge --rebase --delete-branch
```

---

## Risk Mitigation

### Preventing Content Loss

1. **Always review git diff** before committing
2. **Test links** after fixing
3. **Verify code blocks** still render correctly
4. **Check lists** still work (especially checkboxes)

### Handling Complex Cases

1. **MD024 (duplicate headings)** — Manual review, add context
2. **Code blocks with special syntax** — Manual review
3. **Tables** — Verify alignment preserved
4. **Nested lists** — Verify indentation correct

### Rollback Strategy

If issues found after merge:

```bash
# Revert specific commit
git revert <commit-hash>

# Or revert entire PR
git revert -m 1 <merge-commit-hash>

# Push revert
git push origin main
```

---

## Performance Optimization

### Batch Processing

```bash
# Fix multiple files at once
npm run lint:md -- --fix "docs/tutorials/*.md"

# But commit separately for better git history
for file in docs/tutorials/*.md; do
  git add "$file"
  git commit -m "docs: fix markdown violations in $(basename $file)"
done
```

### Parallel Work

- Can work on multiple PRs in parallel (different branches)
- But merge sequentially to avoid conflicts

---

## Success Metrics

### Per PR

- [ ] All target files pass `npm run lint:md`
- [ ] No content loss (verified via git diff)
- [ ] All links work
- [ ] CI checks pass
- [ ] 2-3 commits per PR

### Overall Plan

- [ ] 8 PRs merged
- [ ] 16-24 commits total
- [ ] ~2500 violations fixed
- [ ] Violations reduced from 9475 to <7000
- [ ] Completed in 4 days
