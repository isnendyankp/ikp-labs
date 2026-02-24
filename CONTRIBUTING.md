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
   # Backend
   cd backend && mvn install
   
   # Frontend
   cd frontend && npm install
   ```

## Development Workflow

1. **Create a feature branch** from `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Test your changes** locally:
   ```bash
   # Backend tests
   cd backend && mvn test
   
   # Frontend tests
   cd frontend && npm test
   
   # E2E tests (optional for small changes)
   cd frontend && npm run test:e2e
   ```

4. **Commit your changes** using conventional commits

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** to the `main` branch

## Pull Request Process

### Before Creating a PR

- [ ] All tests pass locally
- [ ] Code follows the project's style guidelines
- [ ] Pre-commit hooks pass (Husky + lint-staged)
- [ ] No console errors or warnings
- [ ] Documentation updated (if needed)

### PR Requirements

All Pull Requests **must**:

1. **Pass all CI checks** before merge:
   - ✅ Frontend Lint (ESLint + Prettier)
   - ✅ Frontend Unit Tests (393+ tests)
   - ✅ Frontend Build (Next.js production)
   - ✅ Backend Tests (298+ tests)
   - ✅ API Tests (Playwright)

2. **Have a clear description** explaining:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes

3. **Reference related issues** (if applicable):
   ```
   Fixes #123
   Closes #456
   Related to #789
   ```

### CI Pipeline

When you create a PR, the following jobs will run automatically:

```
Pull Request Trigger:
├── Frontend Lint (1m)
├── Frontend Tests (1m 30s)
├── Frontend Build (1m 30s)
├── Backend Tests (50s)
├── API Tests (2m)
└── CI Summary (gate)

Total Duration: ~3 minutes
```

**Note**: E2E tests run on a schedule (6 AM & 6 PM WIB) instead of on every PR. This makes PR workflow faster while maintaining regular E2E health checks. See [CI/CD Workflow Strategy](docs/explanation/ci-cd-workflow-strategy.md) for details.

### Merge Criteria

A PR can be merged when:

- ✅ All CI checks pass (green)
- ✅ No merge conflicts with `main`
- ✅ Code review approved (if applicable)
- ✅ Branch is up-to-date with `main`

## Branch Naming Convention

Use descriptive branch names with prefixes:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New features | `feature/photo-comments` |
| `fix/` | Bug fixes | `fix/login-redirect` |
| `test/` | Test additions/fixes | `test/gallery-e2e` |
| `docs/` | Documentation | `docs/api-guide` |
| `refactor/` | Code refactoring | `refactor/auth-service` |
| `ci/` | CI/CD changes | `ci/add-deploy-job` |

## Commit Message Guidelines

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `test`: Adding/updating tests
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `ci`: CI/CD changes
- `chore`: Maintenance tasks

### Examples

```bash
feat(gallery): add photo comments feature
fix(auth): resolve JWT token expiration issue
test(e2e): add smoke tests for deployment
docs(readme): update installation instructions
refactor(api): extract pagination utility
ci: add E2E tests to GitHub Actions
```

## Code Style

### Frontend (TypeScript/React)

- **Linter**: ESLint with Next.js config
- **Formatter**: Prettier
- **Style**: Functional components with hooks
- **Naming**: camelCase for variables, PascalCase for components

### Backend (Java/Spring Boot)

- **Style**: Google Java Style Guide
- **Naming**: camelCase for methods, PascalCase for classes
- **Annotations**: Use Spring annotations appropriately

### Pre-commit Hooks

Pre-commit hooks will automatically:
- Run ESLint on staged `.ts`, `.tsx`, `.js`, `.jsx` files
- Run Prettier on staged files
- Format code before commit

If hooks fail, fix the issues and commit again.

## Testing Requirements

### Unit Tests

- **Frontend**: Jest + React Testing Library
  - Test component behavior, not implementation
  - Coverage threshold: 30%+ statements
  - Run: `npm test`

- **Backend**: JUnit 5 + Mockito
  - Test business logic in isolation
  - Coverage threshold: 80%+ lines
  - Run: `mvn test`

### Integration Tests

- **Backend**: Spring Boot Test + H2
  - Test API endpoints with database
  - Run: `mvn test` (included in backend tests)

### API Tests

- **Playwright API Testing**
  - Test REST API contracts
  - Run: `npm run test:api`

### E2E Tests

- **Playwright E2E**
  - Test critical user flows
  - Run: `npm run test:e2e`
  - **Note**: Many E2E tests are marked as `fixme()` for CI optimization

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
- Review the [CI/CD Setup Guide](docs/how-to/cicd-setup.md)

---

**Thank you for contributing to IKP Labs!** 🚀
