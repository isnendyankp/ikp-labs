# Documentation

Welcome to the **Registration Form Template** documentation. This documentation follows the [Diátaxis framework](https://diataxis.fr/), organizing content into four categories for different learning needs.

## 📚 Documentation Categories

### 🎓 Tutorials - *Learning-oriented*

Step-by-step guides for beginners to learn by doing:

- [Getting Started](./tutorials/getting-started.md) - Set up and run the project
- [Your First Registration](./tutorials/first-registration.md) - Create and test a user registration

**Best for**: Newcomers who want to learn the basics

---

### 🔧 How-To Guides - *Problem-solving*

Practical guides to solve specific problems:

- [Setup PostgreSQL Database](./how-to/setup-database.md) - Configure database for the project
- [Run E2E Tests with Playwright](./how-to/run-e2e-tests.md) - Execute automated tests
- [Add New API Endpoint](./how-to/add-api-endpoint.md) - Extend the backend API
- [Deploy to Production](./how-to/deploy-production.md) - Deploy frontend and backend

**Best for**: Developers who need to accomplish specific tasks

---

### 📖 Reference - *Information-oriented*

Technical specifications for quick lookup:

- [API Endpoints](./reference/api-endpoints.md) - Complete REST API reference
- [Database Schema](./reference/database-schema.md) - PostgreSQL table structures
- [npm Scripts](./reference/npm-scripts.md) - Available commands and their usage
- [Environment Variables](./reference/environment-variables.md) - Configuration options

**Best for**: Developers who need quick facts and specifications

---

### 💡 Explanation - *Understanding-oriented*

Conceptual documentation for deeper understanding:

- [Authentication Architecture](./explanation/authentication-architecture.md) - JWT authentication flow
- [Project Architecture](./explanation/architecture.md) - System design and structure
- [Bean Singleton Pattern](./explanation/singleton-pattern.md) - Why and how we use it
- [CORS Configuration](./explanation/cors-configuration.md) - Cross-origin request handling

**Best for**: Developers who want to understand "why" things work this way

---

## 🚀 Quick Start

**New to the project?** Follow this path:

1. Read [Getting Started Tutorial](./tutorials/getting-started.md)
2. Complete [Your First Registration](./tutorials/first-registration.md)
3. Explore [How-To Guides](./how-to/) for common tasks
4. Reference [API Documentation](./reference/api-endpoints.md) as needed

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
