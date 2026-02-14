# IKP Labs Frontend

> Next.js 15 frontend for the IKP Labs photo gallery application

## Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Context
- **HTTP Client**: Fetch API
- **Testing**: Jest + React Testing Library

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   │   ├── gallery/           # Gallery-specific components
│   │   └── ui/                # Reusable UI components
│   ├── contexts/              # React Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and helpers
│   └── __tests__/             # Unit tests
│       ├── components/        # Component tests
│       ├── context/           # Context tests
│       ├── hooks/             # Hook tests
│       └── lib/               # Utility tests
├── public/                    # Static assets
├── docs/                      # Frontend documentation
├── jest.config.js             # Jest configuration
├── jest.setup.js              # Jest setup file
└── package.json
```

## Development

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3002`

### Build for Production

```bash
npm run build
```

## Testing

### Testing Philosophy

**NO MOCKING** - We follow a testing philosophy that avoids mocking:
- Uses real JSDOM environment
- Tests component behavior, not implementation details
- Uses real localStorage and sessionStorage
- No API mocking - tests focus on UI logic only

### Run Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### Test Coverage

| Category | Tests | Description |
|----------|-------|-------------|
| **Utilities** | 46 | apiClient, auth functions |
| **Core Components** | 73 | PhotoCard, PhotoUploadForm, forms |
| **UI Elements** | 98 | Dropdowns, Pagination, Dialogs |
| **Hooks** | 30 | useClickOutside, useScrollRestoration |
| **Context** | - | ToastContext |
| **Total** | **393** | All passing |

### Test Structure

Tests are organized in `src/__tests__/` mirroring the source structure:

```
src/__tests__/
├── components/
│   ├── gallery/
│   │   ├── PhotoCard.test.tsx
│   │   ├── PhotoUploadForm.test.tsx
│   │   └── Pagination.test.tsx
│   ├── ui/
│   │   ├── ConfirmDialog.test.tsx
│   │   ├── EmptyState.test.tsx
│   │   └── Toast.test.tsx
│   ├── FilterDropdown.test.tsx
│   ├── SortByDropdown.test.tsx
│   ├── LoginForm.test.tsx
│   └── RegistrationForm.test.tsx
├── context/
│   └── ToastContext.test.tsx
├── hooks/
│   ├── useClickOutside.test.ts
│   └── useScrollRestoration.test.ts
└── lib/
    ├── apiClient.test.ts
    └── auth.test.ts
```

### Writing Tests

Follow these patterns:

```typescript
/**
 * Unit Tests for ComponentName
 *
 * Testing Philosophy: NO MOCKING
 * - Uses real JSDOM environment
 * - Tests component rendering and behavior
 * - NO API calls - only tests UI rendering
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComponentName from '../../components/ComponentName';

describe('ComponentName', () => {
  // Group tests by functionality
  describe('Rendering', () => {
    it('should render correctly', () => {
      render(<ComponentName />);
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle click', async () => {
      const user = userEvent.setup();
      const onClick = jest.fn();
      render(<ComponentName onClick={onClick} />);
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalled();
    });
  });
});
```

### Test Helpers

Test utilities are available in `src/lib/test-helpers.tsx`:

```typescript
import { renderWithProviders } from '../lib/test-helpers';

// Render with ToastProvider wrapper
renderWithProviders(<MyComponent />);
```

## Key Features

### Authentication
- JWT-based authentication
- Protected routes
- Token persistence in localStorage

### Photo Gallery
- Photo upload with drag & drop
- Privacy controls (public/private)
- Like/favorite functionality
- Pagination

### Profile Management
- Profile picture upload
- Real-time preview
- Avatar fallback

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
```

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Related Documentation

- [Frontend Plan](docs/FRONTEND_PLAN.md)
- [UX Components](docs/UX_COMPONENTS.md)
- [Main README](../README.md)
