# IKP Labs

[![CI](https://github.com/isnendyankp/ikp-labs/actions/workflows/ci.yml/badge.svg)](https://github.com/isnendyankp/ikp-labs/actions/workflows/ci.yml)
[![Tests](https://img.shields.io/badge/Tests-512%20total-blue)](docs/tutorials/testing-guide.md)
[![Coverage](https://img.shields.io/badge/Coverage-80%25%2B-brightgreen)](docs/tutorials/testing-guide.md)

[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org/)
[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://openjdk.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-6db33f?logo=spring)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)

> Full-stack application showcasing modern web development practices with comprehensive testing

A complete full-stack learning project featuring photo gallery, authentication, and profile management. Built as part of my journey to master full-stack development from backend to frontend to testing.

---

## Status

**Current Phase**: Production Deployed ✅
**Latest**: Production deployment on DigitalOcean VPS with SSL
**Live Demo**: [kameravue.com](https://kameravue.com)

### Environments
- **Production**: [kameravue.com](https://kameravue.com) (Frontend) | [api.kameravue.com](https://api.kameravue.com) (Backend)
- **Development**: `localhost:3002` (frontend) and `localhost:8081` (backend)

---

## What & Why

### What is IKP Labs?

IKP Labs is my personal learning laboratory for full-stack development. It's a progressive web application where I implement industry-standard features and practices:

- **Photo Gallery**: Full CRUD with privacy controls, likes, and pagination
- **Authentication**: JWT-based auth with protected routes
- **Profile Management**: User profiles with photo uploads
- **Comprehensive Testing**: E2E, API, and integration tests

### Why This Project?

**Learning Goals:**
- Master full-stack development (React/Next.js + Spring Boot)
- Practice test-driven development (TDD)
- Build production-quality code architecture
- Document everything (for future me and others)

**Key Differentiators:**
- **Production Deployed** on DigitalOcean VPS with SSL certificates
- 512 total tests (40 integration, 31 API, 48 E2E, 393 unit)
- 100% E2E test pass rate
- Industry-standard project structure
- Comprehensive documentation following Diátaxis framework

---

## Features

### Photo Gallery
Complete photo management system with privacy controls, likes, and real-time updates.

**Capabilities**: Upload, view, edit, delete, privacy settings, pagination, photo likes
**Testing**: 40 E2E tests (100% pass rate across Chromium + Firefox)

### Authentication
JWT-based authentication with protected routes and secure token management.

**Capabilities**: Register, login, logout, auto-redirect, token refresh
**Security**: BCrypt password hashing, CORS configuration, JWT validation

### User Profiles
Profile management with photo upload and real-time preview.

**Capabilities**: Upload profile picture, delete picture, avatar fallback
**Validation**: Client-side and server-side file validation (5MB limit)

### Photo Likes
Social feature allowing users to like/unlike photos with real-time counter updates.

**Capabilities**: Like/unlike photos, view liked photos, persistent like counts
**Testing**: 18 E2E tests covering multi-user scenarios

---

## Tech Stack

### Frontend
### Frontend
- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Fetch API

### Backend
- **Framework**: Spring Boot 3.3.5
- **Language**: Java 21
- **Database**: PostgreSQL 16
- **Security**: Spring Security + JWT
- **Build Tool**: Maven

### Testing
- **Unit Tests**: Jest + React Testing Library
- **E2E**: Playwright (TypeScript)
- **API Testing**: Playwright API
- **Integration**: JUnit 5 + Spring Boot Test
- **BDD**: Gherkin specifications

### Production Infrastructure
- **Hosting**: DigitalOcean Droplet (Ubuntu 24.04)
- **Domain**: kameravue.com (Namecheap)
- **Reverse Proxy**: Nginx with SSL (Let's Encrypt)
- **Process Manager**: PM2
- **Database**: PostgreSQL 16

---

## Nx Monorepo

This project uses **Nx monorepo** for managing multiple applications and shared libraries in a single repository.

### Benefits

- **Better Developer Experience**: Unified commands for all apps (`nx serve`, `nx build`, `nx test`)
- **Affected Commands**: Run commands only on changed projects (`nx affected -t build`)
- **Dependency Graph**: Visualize project structure (`nx graph`)
- **Future Scalability**: Easy to add new apps (mobile, admin dashboard) in the future
- **Shared Libraries**: Reusable code via `libs/` directory

### Common Nx Commands

```bash
# Start all services (quick)
nx run-many -t dev

# Or start specific services
nx serve kameravue-fe     # Frontend
nx serve kameravue-be     # Backend

# Build all apps
nx run-many -t build

# Test all apps
nx run-many -t test

# Lint all apps
nx run-many -t lint

# View dependency graph
nx graph

# Build only affected projects by code changes
nx affected -t build

# Test only affected projects
nx affected -t test
```

**Full Nx Migration Guide**: [plans/done/2026-03-25__nx-migration/](plans/done/2026-03-25__nx-migration/)

---

## Production Deployment

This project is deployed on a DigitalOcean VPS with full SSL encryption.

### Live URLs
- **Frontend**: [https://kameravue.com](https://kameravue.com)
- **Backend API**: [https://api.kameravue.com](https://api.kameravue.com)

### Infrastructure Overview
- **Server**: DigitalOcean Droplet (1GB RAM, 1 vCPU, 25GB SSD)
- **OS**: Ubuntu 24.04 LTS
- **Web Server**: Nginx (reverse proxy with SSL)
- **SSL Certificates**: Let's Encrypt via Certbot
- **Process Manager**: PM2 (auto-restart on crash/reboot)
- **Database**: PostgreSQL 16

### Deployment Commands

**For Linux VPS** (one-time setup after clone):
```bash
cd frontend
npm run setup:linux  # Install native Linux binaries
npm run build
```

**Useful PM2 Commands**:
```bash
pm2 list              # View all processes
pm2 logs [name]       # View logs
pm2 restart [name]    # Restart process
pm2 save              # Save process list
```

---

## Quick Start

### Prerequisites
- Node.js 20+ and npm
- Java 21
- PostgreSQL 16
- Maven 3.9+

### 1. Clone Repository
```bash
git clone https://github.com/isnendyankp/ikp-labs.git
cd ikp-labs
```

### 2. Setup Database
```bash
# Create PostgreSQL database
createdb registration_form_db

# Database will auto-initialize via Spring Boot
```

### 3. Start Backend
```bash
# Using Nx (recommended)
nx serve kameravue-be

# Or using traditional approach
cd apps/kameravue-be/ikp-labs-api
./mvnw spring-boot:run

# Backend runs on http://localhost:8081
```

### 4. Start Frontend
```bash
# Using Nx (recommended)
nx serve kameravue-fe

# Or using traditional approach
cd apps/kameravue-fe
npm run dev

# Frontend runs on http://localhost:3002
```

### 5. Run Tests (Optional)
```bash
# Frontend E2E Tests
npx nx e2e kameravue-fe-e2e

# Backend API Tests
npx nx e2e kameravue-be-e2e

# Backend Integration Tests
npx nx test kameravue-be
```

**Default URLs:**
- Frontend: `http://localhost:3002`
- Backend API: `http://localhost:8081`
- API Docs: `http://localhost:8081/swagger-ui.html` (if enabled)

---

## Testing

### Test Coverage Summary

| Type | Count | Status | Technology |
|------|-------|--------|------------|
| **Unit Tests** | 393 tests | ✅ 100% pass | Jest + React Testing Library |
| **E2E Tests** | 48 tests | ✅ 100% pass | Playwright + TypeScript |
| **API Tests** | 31 tests | ✅ 100% pass | Playwright API |
| **Integration Tests** | 40 tests | ✅ 100% pass | JUnit 5 + Spring Boot Test |
| **Total** | **512 tests** | ✅ **100% pass** | - |

### Unit Test Breakdown (Frontend)
- **Utilities**: 46 tests (apiClient, auth)
- **Core Components**: 73 tests (PhotoCard, PhotoUploadForm, LoginForm, RegistrationForm)
- **UI Elements**: 98 tests (FilterDropdown, SortByDropdown, Pagination, ConfirmDialog, EmptyState, Toast)
- **Hooks**: 30 tests (useClickOutside, useScrollRestoration)
- **Context**: Existing ToastContext tests

### E2E Test Breakdown
- **Registration & Login**: 8 tests
- **Auth Flow**: 4 tests
- **Profile Picture**: 10 tests
- **Photo Gallery**: 8 tests
- **Photo Likes**: 18 tests

### Cross-Browser Testing
All E2E tests verified on:
- ✅ Chromium
- ✅ Firefox
- ⏸️ WebKit (Safari) - Skipped due to localhost restrictions

**📚 Full Testing Documentation**: [docs/explanation/](docs/explanation/)

---

## Documentation

This project follows the [Diátaxis](https://diataxis.fr/) documentation framework for structured, comprehensive documentation.

### Quick Links

**🎓 [Tutorials](docs/tutorials/)** - Step-by-step learning guides
**🔧 [How-To Guides](docs/how-to/)** - Practical task guides
**📖 [Reference](docs/reference/)** - Technical specifications
**💡 [Explanation](docs/explanation/)** - Understanding-oriented docs
**📔 [Journals](docs/journals/)** - Development logs

### Key Documentation

- **[API Endpoints](docs/reference/api-endpoints.md)** - Complete API reference
- **[Database Schema](docs/reference/database-schema.md)** - Database structure
- **[Authentication Architecture](docs/explanation/authentication-architecture.md)** - How auth works
- **[Testing Guide](docs/tutorials/testing-guide.md)** - How to run and write tests
- **[Getting Started](docs/tutorials/getting-started.md)** - Detailed setup guide

**📂 Browse all docs**: [docs/](docs/)

---

## Governance

This project uses a **6-layer governance model** to keep decisions consistent across sessions — whether made by a human or an AI agent.

| Layer | File | Purpose |
|-------|------|---------|
| 1 | [`governance/vision/ikp-labs.md`](governance/vision/ikp-labs.md) | Why this project exists |
| 2 | [`governance/principles/general.md`](governance/principles/general.md) | Values that guide decisions |
| 3 | [`governance/conventions/development.md`](governance/conventions/development.md) | Naming, commit, branch, PR standards |
| 4 | [`governance/development/workflow/implementation.md`](governance/development/workflow/implementation.md) | Step-by-step development workflow |
| 5 | [`governance/development/agents/ai-agent-guidelines.md`](governance/development/agents/ai-agent-guidelines.md) | AI agent decision protocols |
| 6 | [`plans/`](plans/) | Active work tracking |

Higher layers override lower ones. When in doubt, escalate up.

**📋 Full governance overview**: [`governance/README.md`](governance/README.md)

---

## Project Structure

[![Nx](https://img.shields.io/badge/Monorepo-Nx-9f001-blue)](https://nx.dev/)

This project uses **Nx monorepo** for managing multiple applications and shared libraries in a single repository.

### High-level Organization

```
ikp-labs/
├── apps/
│   ├── kameravue-fe/         # Next.js application (Frontend)
│   └── kameravue-be/         # Spring Boot application (Backend)
│       └── ikp-labs-api/
├── libs/                     # Shared libraries (future)
├── tests/                    # E2E and API tests
│   ├── e2e/             # Playwright E2E tests
│   └── api/             # Playwright API tests
├── docs/                    # Documentation (Diátaxis)
└── plans/                 # Project planning
```

**📁 Complete structure**: [docs/reference/project-structure.md](docs/reference/project-structure.md)

---

## Development

### Running in Development

**Using Nx (recommended):**
```bash
# Start backend
nx serve kameravue-be

# Start frontend (in new terminal)
nx serve kameravue-fe

# Or run both simultaneously
nx run-many -t dev
```

**Using Traditional approach:**
```bash
# Backend
cd apps/kameravue-be/ikp-labs-api
./mvnw spring-boot:run

# Frontend
cd apps/kameravue-fe
npm run dev
```

**Tests:**
```bash
# E2E Tests (ensure backend & frontend are running)
npx playwright test

# Backend Integration
cd apps/kameravue-be/ikp-labs-api
./mvnw test
```

### Nx Commands (Quick Reference)
```bash
# Build all apps
nx run-many -t build

# Test all apps
nx run-many -t test

# Lint all apps
nx run-many -t lint

# View dependency graph
nx graph

# Build only affected projects by code changes
nx affected -t build

# Test only affected projects
nx affected -t test
```

### Key Development Commands (Traditional)
```bash
# Frontend (from apps/kameravue-fe/)
npm run build          # Production build
npm run lint          # ESLint check
npm run test           # Run unit tests

# Backend (from apps/kameravue-be/ikp-labs-api/)
./mvnw clean install  # Build JAR
./mvnw test              # Run tests

# Testing
npx playwright test --ui              # UI mode
npx playwright test --debug           # Debug mode
npx playwright show-report            # View test report
```

---

## Claude Validators

This project includes optional Claude-powered validator agents for quality checks. These can be run on-demand during development.

### Available Validators

| Validator | Description | Output |
|-----------|-------------|--------|
| `@test-validator` | E2E test coverage audit, spec synchronization, flaky test detection | `generated-reports/test-audit-*.md` |
| `@docs-validator` | API documentation completeness, JSDoc coverage, Diátaxis compliance | `generated-reports/docs-audit-*.md` |
| `@plan-checker` | Implementation plan validation, 4-doc system check, task atomicity | `generated-reports/plan-audit-*.md` |

### Usage

Validators are triggered by asking Claude to run them:

```
"@test-validator - check my test coverage"
"@docs-validator - audit my API documentation"
"@plan-checker - validate my implementation plan"
```

### Output

Reports are generated in `generated-reports/` directory (gitignored by default).

---

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration with automated quality checks.

### Automated Checks

| Check | Description | Trigger |
|-------|-------------|---------|
| **Frontend Lint** | ESLint + Prettier | Push, PR |
| **Frontend Tests** | Jest unit tests with coverage | Push, PR |
| **Frontend Build** | TypeScript + Next.js build | Push, PR |
| **Backend Tests** | JUnit tests with JaCoCo coverage | Push, PR |

### Pre-commit Hooks

Pre-commit hooks run automatically before each commit:

```bash
# ESLint auto-fix and Prettier format on staged files
# Commit blocked if checks fail
git commit -m "feat: add feature"
```

### Running Checks Locally

```bash
# Frontend
npm run lint:frontend      # ESLint check
npm run test:frontend      # Jest tests

# Backend
cd backend/ikp-labs-api
./mvnw test               # JUnit tests
```

**Full CI/CD Guide**: [docs/how-to/cicd-setup.md](docs/how-to/cicd-setup.md)

---

## Contributing

Contributions are welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md) for details on:

- 📋 Pull Request process and requirements
- ✅ Required CI checks (all must pass before merge)
- 🌿 Branch naming conventions
- 📝 Commit message guidelines
- 🧪 Testing requirements
- 🎨 Code style guidelines

### Quick Contribution Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and ensure all tests pass locally
4. Commit using conventional commits: `feat: add new feature`
5. Push and create a Pull Request
6. Wait for CI checks to pass (all 7 jobs must be green)

**Full guidelines**: [CONTRIBUTING.md](CONTRIBUTING.md)

---

## Copyright & License

Copyright © 2026 Isnendy Ankp. All rights reserved.

### Project Purpose

This project ("IKP Labs" / "Kameravue") is a **portfolio project** created for
educational and demonstration purposes to showcase full-stack development skills.

**Live at**: [kameravue.com](https://kameravue.com)

This is:
- ✅ A learning project to demonstrate web development skills
- ✅ A portfolio piece for job applications
- ✅ Open-source for others to learn from
- ✅ Deployed to production with real SSL certificates

### Usage Guidelines

You are free to:
- Use this code for learning and inspiration
- Reference this project for your own work
- Fork and modify for your needs

Please:
- Give credit where appropriate
- Use ethically and responsibly
- Understand this is for educational purposes

### License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Diátaxis Framework** for documentation structure
- **Playwright** for excellent E2E testing tools
- **Spring Boot** and **Next.js** communities

---

## Contact & Links

- **GitHub**: [github.com/isnendyankp](https://github.com/isnendyankp)
- **Project**: [github.com/isnendyankp/ikp-labs](https://github.com/isnendyankp/ikp-labs)
- **Documentation**: [/docs](docs/)

---

**Built with ❤️ as part of my full-stack development journey**
