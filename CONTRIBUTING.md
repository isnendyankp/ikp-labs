# Contributing to IKP Labs

Thank you for your interest in contributing to IKP Labs! This document provides guidelines for contributing to this project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Code Style](#code-style)
- [Testing Requirements](#testing-requirements)

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ikp-labs.git`
3. Add upstream remote: `git remote add upstream https://github.com/isnendyankp/ikp-labs.git`
4. Install dependencies:

   ```bash
   npm install
   ```

5. Start services:

   ```bash
   nx serve kameravue-be   # Backend on http://localhost:8081
   nx serve kameravue-fe   # Frontend on http://localhost:3002
   ```

For a full setup walkthrough, see [docs/how-to/setup-development-environment.md](docs/how-to/setup-development-environment.md).

## Development Workflow

1. **Create a feature branch** from `main`:

   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Test your changes** locally:

   ```bash
   # Frontend unit tests
   npx nx test kameravue-fe

   # Backend tests
   npx nx test kameravue-be

   # E2E tests (optional for small changes)
   npx nx e2e kameravue-fe-e2e
   ```

4. **Commit your changes** using conventional commits (enforced by commitlint)

5. **Push to your fork**:

   ```bash
   git push origin feat/your-feature-name
   ```

6. **Create a Pull Request** to the `main` branch

## Pull Request Process

### Before Creating a PR

- [ ] All tests pass locally
- [ ] Code follows the project's style guidelines
- [ ] Pre-commit hooks pass (Husky + lint-staged + commitlint)
- [ ] No console errors or warnings
- [ ] Documentation updated (if needed)

### PR Requirements

All Pull Requests **must**:

1. **Pass all CI checks** before merge:
   - ✅ Frontend Lint (ESLint + Prettier)
   - ✅ Frontend Unit Tests (394+ tests)
   - ✅ Frontend Build (Next.js production)
   - ✅ Backend Tests (298+ tests)
   - ✅ API Tests (Playwright)

2. **Have a clear description** explaining:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes

3. **Reference related issues** (if applicable):

   ```text
   Fixes #123
   Closes #456
   Related to #789
   ```

### CI Pipeline

When you create a PR, the following jobs will run automatically:

```text
Pull Request Trigger:
├── Frontend Lint (1m)
├── Frontend Tests (1m 30s)
├── Frontend Build (1m 30s)
├── Backend Tests (50s)
├── API Tests (2m)
└── CI Summary (gate)

Total Duration: ~3 minutes
```

**Note**: E2E tests run on a schedule (6 AM & 6 PM WIB) instead of on every PR. See [CI/CD Workflow Strategy](docs/explanation/ci-cd-workflow-strategy.md) for details.

### Merge Criteria

A PR can be merged when:

- ✅ All CI checks pass (green)
- ✅ No merge conflicts with `main`
- ✅ Code review approved (if applicable)
- ✅ Branch is up-to-date with `main`

## Branch Naming Convention

Use descriptive branch names with prefixes matching commit types:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat/` | New features | `feat/photo-comments` |
| `fix/` | Bug fixes | `fix/login-redirect` |
| `test/` | Test additions/fixes | `test/gallery-e2e` |
| `docs/` | Documentation | `docs/api-guide` |
| `refactor/` | Code refactoring | `refactor/auth-service` |
| `chore/` | Maintenance, dependencies | `chore/update-nx` |
| `config/` | Configuration changes | `config/cors-update` |

See [`governance/conventions/development.md`](governance/conventions/development.md) for full naming rules.

## Commit Message Guidelines

This project follows [Conventional Commits](https://www.conventionalcommits.org/) and enforces them automatically via **commitlint** + **Husky**.

```text
<type>(<optional scope>): <description>
```

### Rules (enforced automatically)

- Type must be one of the allowed types (see table below)
- Description must be **lowercase**
- Description cannot be empty
- No period at end of description
- Max 72 characters on first line

### Allowed Types

| Type | Use for |
|------|---------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change without behavior change |
| `style` | Formatting, whitespace |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `chore` | Maintenance, dependency updates |
| `config` | Configuration changes (CORS, env, API endpoints) |

### Examples

```bash
# ✅ Valid
feat(gallery): add photo comments feature
fix(auth): resolve jwt token expiration issue
docs: update setup guide
chore: update nx to v22
config: update cors for production

# ❌ Invalid — will be rejected by commitlint
Update stuff              # no type
Fix: broken upload        # uppercase type
feat: Add new feature.    # uppercase + period
```

### What Happens if Commit is Rejected

```bash
$ git commit -m "Update stuff"
⧗ input: Update stuff
✖ subject may not be empty [subject-empty]
✖ type may not be empty [type-empty]
✖ found 2 problems, 0 warnings
husky - commit-msg script failed (code 1)
```

Fix the message and try again.

## Code Style

### Frontend (TypeScript/React)

- **Linter**: ESLint with Next.js config
- **Formatter**: Prettier (config in `.prettierrc.json`)
- **Style**: Functional components with hooks
- **Naming**: camelCase for variables, PascalCase for components

#### Prettier Config

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "endOfLine": "lf"
}
```

Prettier runs automatically on staged files via lint-staged. To format manually:

```bash
cd apps/kameravue-fe
npm run format        # format all files
npm run format:check  # check without writing
```

### Backend (Java/Spring Boot)

- **Style**: Google Java Style Guide
- **Naming**: camelCase for methods, PascalCase for classes
- **Annotations**: Use Spring annotations appropriately

### Pre-commit Hooks

Two hooks run automatically on every commit:

| Hook | Trigger | What it does |
|------|---------|--------------|
| `pre-commit` | Before commit | ESLint fix + Prettier format on staged files |
| `commit-msg` | After message entered | commitlint validates message format |

If either hook fails, fix the issue and commit again.

## Testing Requirements

### Unit Tests

- **Frontend**: Jest + React Testing Library
  - Test component behavior, not implementation
  - Coverage threshold: 30%+ statements
  - Run: `npx nx test kameravue-fe`

- **Backend**: JUnit 5 + Mockito
  - Test business logic in isolation
  - Coverage threshold: 80%+ lines
  - Run: `npx nx test kameravue-be`

### Integration Tests

- **Backend**: Spring Boot Test + H2
  - Test API endpoints with database
  - Run: `npx nx test kameravue-be` (included)

### API Tests

- **Playwright API Testing**
  - Test REST API contracts
  - Run: `npx nx e2e kameravue-be-e2e`

### E2E Tests

- **Playwright E2E**
  - Test critical user flows
  - Run: `npx nx e2e kameravue-fe-e2e`
  - **Note**: Tests tagged `@demo` are skipped in CI

### Test Naming

```typescript
// Frontend
describe('PhotoCard', () => {
  it('should display photo title', () => { ... });
});

// Backend
@Test
void shouldReturnUserWhenValidId() { ... }
```

## Questions?

If you have questions about contributing, feel free to:

- Open an issue for discussion
- Check existing issues and PRs
- Review the [Setup Guide](docs/how-to/setup-development-environment.md)
- Review the [CI/CD Setup Guide](docs/how-to/cicd-setup.md)

---

**Thank you for contributing to IKP Labs!** 🚀
