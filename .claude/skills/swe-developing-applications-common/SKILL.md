# Skill: Common Application Development Workflow

**Category**: Software Engineering
**Purpose**: Universal development workflow for IKP-Labs — commits, branches, testing, tools
**Used By**: swe-typescript-dev, swe-java-dev, swe-e2e-dev, swe-code-checker

---

## Standard Development Workflow

Every implementation follows this pattern:

1. **Make it work** — get the feature functional
2. **Make it right** — refactor for clarity and correctness
3. **Make it fast** — optimize only if needed (profile first)

### 6-Step Implementation Process

1. **Requirements Analysis** — understand what needs to be built
2. **Design** — plan data models, API shape, component structure
3. **Implementation** — write code following language standards
4. **Testing** — write tests (ideally test-first)
5. **Self-review** — check against coding standards
6. **Documentation** — update relevant docs if behavior changed

---

## Git Workflow

### Branch Naming

```text
feat/photo-comments      — new feature
fix/login-redirect       — bug fix
test/gallery-e2e         — test additions
docs/api-guide           — documentation
refactor/auth-service    — refactoring
chore/update-nx          — maintenance
config/cors-update       — configuration
```

### Commit Messages (Conventional Commits)

```text
<type>(<optional-scope>): <description>

Types: feat | fix | refactor | style | docs | test | chore | config
Rules:
- Lowercase description
- No period at end
- Max 72 characters
- Present tense: "add feature" not "added feature"
```

Examples:

```text
feat(gallery): add photo sorting by date
fix(auth): correct jwt token expiry check
test(gallery): add e2e tests for photo upload
docs(plan): add photo-comments plan
chore: update playwright to v1.45
```

### Commit Strategy

Commit often — small, focused commits:

```bash
# One logical change per commit
git add src/components/PhotoCard.tsx
git commit -m "feat(gallery): add photo card component"

git add src/hooks/useGallery.ts
git commit -m "feat(gallery): add useGallery hook"

git add tests/e2e/gallery/gallery.spec.ts
git commit -m "test(gallery): add gallery E2E tests"
```

Never: `git add .` + `git commit -m "stuff"`.

---

## Tool Usage Patterns

| Tool | When to Use |
|------|-------------|
| `Read` | Read existing files before editing |
| `Edit` | Modify existing files |
| `Write` | Create new files |
| `Glob` | Find files by pattern |
| `Grep` | Search for symbols or text |
| `Bash` | Run commands (tests, lint, build) |

### Important Rules

- **Always Read before Edit** — understand existing code first
- **Never guess imports** — grep for the actual export name
- **Check existing patterns** — glob for similar files before creating new ones

```bash
# Find similar components before creating new one
glob "apps/kameravue-fe/src/components/**/*.tsx"

# Find how something is imported
grep "import.*PhotoCard" apps/kameravue-fe/src
```

---

## Project Commands

### Frontend (Next.js)

```bash
npx nx serve kameravue-fe          # dev server → http://localhost:3002
npx nx test kameravue-fe           # run Jest tests
npx nx lint kameravue-fe           # ESLint
npx nx build kameravue-fe          # production build
```

### Backend (Spring Boot)

```bash
npx nx serve kameravue-be          # dev server → http://localhost:8081
npx nx test kameravue-be           # run Maven tests
./mvnw test                        # alternatively via Maven directly
```

### E2E Tests

```bash
npx nx e2e kameravue-fe-e2e        # frontend E2E
npx nx e2e kameravue-be-e2e        # API tests
```

---

## Code Quality Gates

Before pushing, ensure:

- [ ] All tests pass
- [ ] Lint passes (no errors)
- [ ] TypeScript compiles (no type errors)
- [ ] Coverage meets threshold (≥70% FE, ≥80% BE)

Pre-commit hooks run automatically:

- Prettier formats staged files
- ESLint fixes auto-fixable issues
- commitlint validates commit message format

---

## Test-First Approach

Write tests before or alongside implementation:

```typescript
// 1. Write failing test first
test('should sort photos by date descending', () => {
  const photos = [
    { id: '1', createdAt: '2026-01-01' },
    { id: '2', createdAt: '2026-03-01' },
  ];
  const sorted = sortPhotos(photos, 'date-desc');
  expect(sorted[0].id).toBe('2');
});

// 2. Implement to make test pass
function sortPhotos(photos: Photo[], order: SortOrder): Photo[] {
  // implementation
}

// 3. Refactor if needed
```

---

## File Organization

```text
IKP-Labs/
├── apps/
│   ├── kameravue-fe/   — Next.js frontend
│   └── kameravue-be/   — Spring Boot backend
├── tests/
│   ├── e2e/            — Playwright E2E tests
│   ├── api/            — Playwright API tests
│   └── fixtures/       — shared test helpers
├── specs/              — Gherkin feature files
├── plans/              — implementation plans
│   ├── in-progress/
│   └── done/
└── .claude/            — Claude agents and skills
```

---

## Pull Request Workflow

```bash
# 1. Create branch
git checkout main && git pull origin main
git checkout -b feat/feature-name

# 2. Implement + commit
# ... make changes, commit often ...

# 3. Push
git push -u origin feat/feature-name

# 4. Create PR
gh pr create --title "feat: feature description"

# 5. Wait for CI (all checks must pass)
# 6. Merge
gh pr merge <NUMBER> --rebase --delete-branch

# 7. Update local main
git checkout main && git pull origin main
```
