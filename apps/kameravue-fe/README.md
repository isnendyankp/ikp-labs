# IKP Labs Frontend

> Next.js 15 frontend for the IKP Labs photo gallery application

## Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks + Context
- **HTTP Client**: Fetch API
- **Testing**: Jest + React Testing Library + Playwright (E2E)

## Project Structure

```text
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth-related pages (login, register)
│   │   ├── gallery/           # Gallery pages
│   │   ├── my-photos/         # User's photo management
│   │   ├── liked/             # Liked photos
│   │   ├── favorites/         # Favorited photos
│   │   └── profile/           # User profile
│   ├── components/             # React components
│   │   ├── gallery/           # Gallery-specific components
│   │   ├── ui/                # Reusable UI components
│   │   ├── skeletons/         # Loading skeleton components
│   │   └── layout/            # Layout components (Header, Footer, Navbar)
│   ├── contexts/              # React Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and helpers
│   ├── services/              # API service layer
│   └── __tests__/             # Unit tests
├── tests/                      # E2E tests (Playwright)
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

| Category            | Tests   | Description                           |
| ------------------- | ------- | ------------------------------------- |
| **Utilities**       | 46      | apiClient, auth functions             |
| **Core Components** | 73      | PhotoCard, PhotoUploadForm, forms     |
| **UI Elements**     | 98      | Dropdowns, Pagination, Dialogs        |
| **Hooks**           | 30      | useClickOutside, useScrollRestoration |
| **Context**         | -       | ToastContext                          |
| **Total**           | **394** | All passing (19 test suites)          |

### Test Structure

Tests are organized in `src/__tests__/` mirroring the source structure:

```text
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

- JWT-based authentication with token persistence
- Protected routes with middleware
- Login/Register with form validation
- Password strength indicator
- Return URL support for post-login redirect

### Photo Gallery

- **Photo Upload**: Drag & drop, file selection, image preview
- **Privacy Controls**: Public/private photo visibility
- **Gallery Sorting**: Sort by newest, oldest, most liked, most favorited
- **Pagination**: Efficient photo browsing
- **Public Gallery**: Accessible without authentication (soft gate for actions)

### Photo Interactions

- **Like System**: Like/unlike photos with optimistic UI
- **Favorites System**: Save photos to personal favorites
- **My Photos**: Manage personal photo collection
- **Photo Deletion**: With confirmation dialog

### User Profile

- Profile picture upload with real-time preview
- Avatar fallback for users without profile picture
- User settings management

### UX Components

- **Toast Notifications**: Success, error, info, warning types
- **Loading States**: Skeleton screens, button spinners
- **Confirmation Dialogs**: For destructive actions
- **Empty States**: Helpful messages and CTAs
- **Form Validation**: Real-time validation with error messages

### Mobile Experience

- Responsive design for all screen sizes
- Mobile-friendly navigation with dropdown menu
- Touch-optimized interactions

### Landing Page

- Hero section with feature highlights
- Public gallery preview
- Call-to-action sections

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
npm run test:e2e     # Run E2E tests (Playwright)
```

## Production

- **Production URL**: <https://ikp-labs.my.id>
- **API Base URL**: Configured via `NEXT_PUBLIC_API_URL` environment variable

## Related Documentation

- [Frontend Plan](docs/FRONTEND_PLAN.md) - Testing & integration plan
- [UX Components](docs/UX_COMPONENTS.md) - UX component documentation
- [Main README](../README.md) - Project overview
- [Plans](../plans/README.md) - Implementation plans & feature tracking

---

**Last Updated**: March 2026
