# Documentation

Welcome to the **Registration Form Template** documentation. This documentation follows the [Diátaxis framework](https://diataxis.fr/), organizing content into four categories for different learning needs.

## 📚 Documentation Categories

### 🎓 Tutorials - *Learning-oriented*

Step-by-step guides for beginners to learn by doing:

- [Getting Started](./tutorials/getting-started.md) - Set up and run the project
- [Testing Guide](./tutorials/testing-guide.md) - Learn to run and write tests

**Best for**: Newcomers who want to learn the basics

---

### 🔧 How-To Guides - *Problem-solving*

Practical guides to solve specific problems:

- [Run E2E Tests with Playwright](./how-to/run-e2e-tests.md) - Execute automated tests
- [API Testing Guide](./how-to/api-testing.md) - Test REST APIs with Playwright
- [Implement Protected Routes](./how-to/implement-protected-routes.md) - Add authentication to frontend routes

**Best for**: Developers who need to accomplish specific tasks

---

### 📖 Reference - *Information-oriented*

Technical specifications for quick lookup:

- [API Endpoints](./reference/api-endpoints.md) - Complete REST API reference
- [Database Schema](./reference/database-schema.md) - PostgreSQL table structures
- [Testing Commands](./reference/testing-commands.md) - Playwright testing commands reference

**Best for**: Developers who need quick facts and specifications

---

### 💡 Explanation - *Understanding-oriented*

Conceptual documentation for deeper understanding:

- [Authentication Architecture](./explanation/authentication-architecture.md) - JWT authentication flow
- [Protected Routes Architecture](./explanation/protected-routes-architecture.md) - Frontend route protection

**Best for**: Developers who want to understand "why" things work this way

---

## 🚀 Quick Start

**New to the project?** Follow this path:

1. Read [Getting Started Tutorial](./tutorials/getting-started.md)
2. Learn [Testing Guide](./tutorials/testing-guide.md)
3. Explore [How-To Guides](./how-to/) for common tasks
4. Reference [API Documentation](./reference/api-endpoints.md) as needed
5. Understand [Authentication Architecture](./explanation/authentication-architecture.md)

---

## 🏗️ Project Overview

This is a full-stack registration form application:

- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Spring Boot 3.2 + Java 17 + PostgreSQL
- **Testing**: Playwright E2E + Gherkin specifications
- **Development**: npm workspaces monorepo

---

## 📂 Related Documentation

- [Gherkin Specifications](../specs/README.md) - Behavior documentation in plain language
- [Implementation Plans](../plans/README.md) - Feature development roadmaps
- [Project README](../README.md) - Project overview and quick start

---

## 🤝 Contributing

When adding new features:

1. Write documentation in the appropriate Diátaxis category
2. Update relevant reference documentation
3. Add or update Gherkin specifications
4. Ensure examples use actual code from the repository

For help writing documentation, use the `documentation-writer` agent.

---

## 📖 About Diátaxis

This documentation follows the [Diátaxis framework](https://diataxis.fr/), which organizes documentation into four distinct types:

- **Tutorials**: Learning by doing
- **How-To Guides**: Solving specific problems
- **Reference**: Looking up information
- **Explanation**: Understanding concepts

This structure ensures you can find what you need, whether you're learning, problem-solving, looking up facts, or seeking understanding.
