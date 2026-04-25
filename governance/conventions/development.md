# Conventions

Shared standards for naming, formatting, and structure across all IKP-Labs apps. These conventions apply to every contributor and every AI agent working in this repository.

---

## Commit Messages

```
<type>: <description>
```

**Types:**

| Type | Use for |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change without behavior change |
| `style` | Formatting, whitespace, missing semicolons |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `chore` | Maintenance, dependency updates |
| `config` | Configuration changes (CORS, env, API endpoints) |

**Rules:**
- Lowercase description
- No period at the end
- Present tense: `add feature` not `added feature`
- Max 72 characters on the first line
- Optional scope in parentheses: `feat(gallery): add photo upload`

**Examples:**
```
feat: add photo favorites feature
fix: correct JWT token expiry check
docs(plan): add governance implementation plan
test: add E2E tests for gallery upload
chore: update playwright to v1.42
```

---

## Branch Naming

```
<type>/<short-description>
```

**Types:**

| Type | Use for |
|------|---------|
| `feat` | New features |
| `fix` | Bug fixes |
| `refactor` | Refactoring |
| `docs` | Documentation changes |
| `chore` | Maintenance |
| `config` | Configuration changes |
| `hotfix` | Critical production fixes |
| `test` | Test-only changes |

**Rules:**
- Lowercase, kebab-case description
- Short but descriptive (max 4-5 words)
- Derived from the task, not the date

**Examples:**
```
feat/photo-albums
fix/login-redirect
refactor/auth-service
docs/governance-layer
chore/update-dependencies
config/cors-settings
hotfix/critical-login-bug
test/gallery-e2e-coverage
```

---

## Pull Request Format

**Title:**
```
<type>: short description
```
- Max 70 characters
- Same type vocabulary as commit messages
- Lowercase description

**Body template:**
```markdown
## Summary
- Bullet point change 1
- Bullet point change 2
- Bullet point change 3

## Test Plan
- [ ] Manual verification step 1
- [ ] Manual verification step 2
```

**Rules:**
- Summary: 3-5 bullet points maximum
- Test Plan: list what was manually verified (or state "no manual testing needed — docs only")
- No filler text, no "this PR..." preamble

---

## TypeScript Conventions

| Thing | Convention | Example |
|-------|------------|---------|
| Component files | PascalCase | `PhotoCard.tsx` |
| Utility/hook files | camelCase | `useScrollRestoration.ts`, `apiClient.ts` |
| Page files (App Router) | kebab-case folder + `page.tsx` | `photo-upload/page.tsx` |
| React components | PascalCase named export | `export function PhotoCard()` |
| Custom hooks | camelCase prefixed with `use` | `useGalleryFilter` |
| Types and interfaces | PascalCase | `PhotoCardProps`, `UserProfile` |
| True constants | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE_MB` |
| API call functions | camelCase verb | `fetchPhotos`, `uploadPhoto`, `deletePhoto` |

**Additional rules:**
- No `any` types — use `unknown` with a type guard if the shape is truly unknown
- Prefer `interface` for object shapes, `type` for unions and intersections
- All exported functions have explicit return types

---

## Java Conventions

| Thing | Convention | Example |
|-------|------------|---------|
| Classes | PascalCase | `PhotoController`, `PhotoService` |
| Methods | camelCase verb | `uploadPhoto`, `getPhotoById` |
| Packages | all lowercase | `com.registrationform.api.controller` |
| Request DTOs | PascalCase + `Request` suffix | `UploadPhotoRequest` |
| Response DTOs | PascalCase + `Response` suffix | `PhotoResponse` |
| Service beans | `@Service` annotation | `PhotoService` |
| Controllers | `@RestController` + `@RequestMapping("/api/<resource>")` | `@RequestMapping("/api/gallery")` |
| Test classes | PascalCase + `Test` suffix | `PhotoServiceTest` |

**Additional rules:**
- Controllers delegate to services — no business logic in controllers
- Services delegate to repositories — no raw SQL in services
- All API responses use a consistent response wrapper (if applicable)

---

## File and Folder Naming

| Thing | Convention | Example |
|-------|------------|---------|
| App folders | kebab-case | `kameravue-fe`, `kameravue-be-e2e` |
| Gherkin spec files | kebab-case `.feature` | `photo-upload.feature` |
| Plan folders | `YYYY-MM-DD__kebab-case` | `2026-04-18__project-governance` |
| Documentation files | kebab-case `.md` | `ci-cd-workflow-strategy.md` |
| Governance files | lowercase `.md` | `vision.md`, `conventions.md` |
| Test spec files | `kebab-case.spec.ts` | `gallery-upload.spec.ts` |
| Helper files | `kebab-case-helpers.ts` | `gallery-helpers.ts` |

---

## Plan Structure

Every plan in `plans/` must contain exactly 4 files:

| File | Purpose |
|------|---------|
| `README.md` | Overview, scope (in/out), status |
| `requirements.md` | User stories, acceptance criteria |
| `technical-design.md` | Architecture, file structure, content specs |
| `checklist.md` | Atomic tasks with checkboxes (15-60 min each) |

Plan folder naming: `YYYY-MM-DD__kebab-case-description`

Plans live in `plans/in-progress/` while active and move to `plans/done/` when complete.
