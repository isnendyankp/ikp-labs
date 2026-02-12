# Unit Tests - Frontend

This folder contains all unit tests for the frontend application using Jest and React Testing Library.

## 📁 Folder Structure

```
__tests__/
├── components/              # Component tests
│   ├── LoginForm.test.tsx
│   ├── RegistrationForm.test.tsx
│   ├── LikeButton.test.tsx
│   ├── FavoriteButton.test.tsx
│   └── ui/                  # UI component tests
│       ├── IconButton.test.tsx
│       ├── Toast.test.tsx
│       └── ToastContainer.test.tsx
├── context/                 # Context/Provider tests
│   └── ToastContext.test.tsx
└── lib/                     # Utility function tests
    ├── README.md
    └── apiClient.test.ts
```

## 🎯 Testing Philosophy

- **NO MOCKING**: Uses real localStorage from JSDOM
- **NO API CALLS**: Network calls tested in `/tests/api/` (Playwright)
- **Pure Functions**: Test logic directly without external dependencies

## 📊 Test Types

| Folder | Test Type | What We Test |
|--------|-----------|--------------|
| `components/` | Unit Test | Form validation, button clicks, rendering |
| `components/ui/` | Unit Test | UI elements like Toast, IconButton |
| `context/` | Unit Test | Context state management |
| `lib/` | Unit Test | Utility functions (token, headers, etc.) |

## 🚀 Run Tests

```bash
# From frontend directory
cd frontend

# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- LoginForm.test.tsx

# Run tests for specific folder
npm test -- --testPathPatterns="components"
```

## 📈 Coverage Targets

| Component Type | Target |
|----------------|--------|
| UI Components | 80%+ |
| Hooks | 85%+ |
| Utility Functions | 100% |
| Context/Providers | 80%+ |

## 🔗 Related Tests

- **API Tests**: `/tests/api/` (Playwright) - Backend endpoints
- **E2E Tests**: `/tests/e2e/` (Playwright) - Full user flows
- **BDD Specs**: `/tests/gherkin/` (Cucumber) - Business requirements

## 📚 Best Practices

1. **One test file per source file**
2. **Descriptive test names** - "should [expected behavior] when [condition]"
3. **Arrange-Act-Assert pattern**
4. **Test behavior, not implementation**
5. **Keep tests simple and readable**

---

**Testing Framework**: Jest 29+ with React Testing Library
**Last Updated**: February 12, 2026
