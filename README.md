# IKP Labs

> Full-stack application showcasing modern web development practices with comprehensive testing

A complete full-stack learning project featuring photo gallery, authentication, and profile management. Built as part of my journey to master full-stack development from backend to frontend to testing.

---

## Status

**Current Phase**: Production-ready core features
**Latest**: Photo Likes feature (18/18 E2E tests passing)
**Demo**: Running locally on `localhost:3002` (frontend) and `localhost:8081` (backend)

⚠️ **Note**: This is a learning/portfolio project. Not intended for production deployment without additional security hardening.

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
- 119 total tests (40 integration, 31 API, 48 E2E)
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
cd backend/ikp-labs-api
./mvnw spring-boot:run

# Backend runs on http://localhost:8081
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev

# Frontend runs on http://localhost:3002
```

### 5. Run Tests (Optional)
```bash
# E2E Tests
npx playwright test

# Integration Tests
cd backend/ikp-labs-api
./mvnw test
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

## Project Structure

High-level organization:

```
ikp-labs/
├── frontend/              # Next.js application
├── backend/              # Spring Boot API
│   └── ikp-labs-api/
├── tests/                # E2E and API tests
│   ├── e2e/             # Playwright E2E tests
│   └── api/             # Playwright API tests
├── docs/                # Documentation (Diátaxis)
└── plans/               # Project planning
```

**📁 Complete structure**: [docs/reference/project-structure.md](docs/reference/project-structure.md)

---

## Development

### Running in Development

**Frontend:**
```bash
cd frontend
npm run dev
```

**Backend:**
```bash
cd backend/ikp-labs-api
./mvnw spring-boot:run
```

**Tests:**
```bash
# E2E (ensure backend & frontend are running)
npx playwright test

# Integration
cd backend/ikp-labs-api
./mvnw test
```

### Key Development Commands

```bash
# Frontend
npm run build          # Production build
npm run lint          # ESLint check

# Backend
./mvnw clean install  # Build JAR
./mvnw test          # Run tests

# Testing
npx playwright test --ui              # UI mode
npx playwright test --debug           # Debug mode
npx playwright show-report            # View test report
```

---

## Contributing

This is a personal learning project. While I'm not actively seeking contributions, feel free to:

- **Fork** and learn from the code
- **Report issues** if you find bugs
- **Ask questions** via GitHub Issues
- **Share** your own learning journey

---

## Copyright & License

Copyright © 2026 Isnendy Ankp. All rights reserved.

### Project Purpose

This project ("IKP Labs" / "Kameravue") is a **portfolio project** created for
educational and demonstration purposes to showcase full-stack development skills.

This is:
- ✅ A learning project to demonstrate web development skills
- ✅ A portfolio piece for job applications
- ✅ Open-source for others to learn from
- ❌ NOT a commercial product
- ❌ NOT intended for production use without modifications

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
