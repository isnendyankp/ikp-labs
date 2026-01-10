# IKP Labs - Documentation

Welcome to the IKP Labs documentation. This documentation follows the [Diátaxis](https://diataxis.fr/) framework for structured technical documentation.

## Documentation Categories

### [Tutorials](tutorials/)
**Learning-oriented** - Step-by-step guides to help you get started.

- [Getting Started](tutorials/getting-started.md)
- [MCP Playwright Setup](tutorials/mcp-playwright-setup.md)
- [Testing Guide](tutorials/testing-guide.md)

### [How-To Guides](how-to/)
**Problem-solving** - Practical guides for specific tasks.

- [Use Claude Validators](how-to/use-claude-validators.md) - How to use validator agents
- [Create Implementation Plans](how-to/create-implementation-plans.md) - How to create structured 4-document plans
- [Run E2E Tests](how-to/run-e2e-tests.md) - How to run end-to-end tests

Browse the [how-to](how-to/) directory for all available guides.

### [Reference](reference/)
**Information-oriented** - Technical specifications and API documentation.

- [Claude Agents](reference/claude-agents.md) - Complete agent reference
- [API Endpoints](reference/api-endpoints.md)
- [Database Schema](reference/database-schema.md)
- [Testing Commands](reference/testing-commands.md)
- [Test Scenarios](reference/test-scenarios/)

### [Explanation](explanation/)
**Understanding-oriented** - Conceptual guides and architecture explanations.

- [Authentication Architecture](explanation/authentication-architecture.md)
- [Protected Routes Architecture](explanation/protected-routes-architecture.md)
- [Feature Roadmap & Recommendations](explanation/feature-roadmap-recommendations.md)
- [Unit Test Java Guide](explanation/unit-test-java-guide.md)
- [Repository Test Explanation (Pemula)](explanation/repository-test-explanation-pemula.md)
- [Video & Screenshot Guide](explanation/video-screenshot-guide.md)

### [Journals](journals/)
**Time-based** - Development logs, progress tracking, and checklists.

- [2025-11](journals/2025-11/) - November 2025 entries
- [2025-12](journals/2025-12/) - December 2025 entries

## Quick Links

### For New Contributors
Start with [Getting Started](tutorials/getting-started.md) to set up your development environment.

### For Developers
- [Create Implementation Plans](how-to/create-implementation-plans.md) - Plan features with 4-document system
- [Use Claude Validators](how-to/use-claude-validators.md) - Validate code, docs, and plans
- [API Reference](reference/api-endpoints.md)
- [Testing Commands](reference/testing-commands.md)
- [Authentication Architecture](explanation/authentication-architecture.md)

### For QA/Testing
- [Use Claude Validators](how-to/use-claude-validators.md) - Validate test coverage and quality
- [Testing Guide](tutorials/testing-guide.md)
- [Test Scenarios](reference/test-scenarios/)
- [MCP Playwright Setup](tutorials/mcp-playwright-setup.md)

## Project Overview

**IKP Labs** is a full-stack registration and gallery application built with:
- **Backend**: Spring Boot + PostgreSQL
- **Frontend**: Next.js 15 + TypeScript
- **Testing**: Playwright E2E + Playwright API + JUnit 5 Integration Tests

### Test Coverage
- **Integration Tests**: 40 tests (Spring Boot + MockMvc)
- **API Tests**: 31 tests (Playwright API + Real HTTP)
- **E2E Tests**: 48 tests (Playwright Browser Automation)
- **Total**: 119 tests

## Contributing

When adding new documentation:
1. Choose the correct category based on [Diátaxis](https://diataxis.fr/)
2. Add your file to the appropriate directory
3. Update this README with a link
4. Follow existing markdown formatting conventions

## Documentation Structure

```
docs/
├── README.md (this file)
├── tutorials/          # Learning-oriented guides
├── how-to/             # Problem-solving guides
├── reference/          # Technical specifications
├── explanation/        # Understanding-oriented docs
└── journals/           # Time-based development logs
```
