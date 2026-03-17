# Frontend Documentation

This folder contains all frontend-related documentation for the IKP Labs photo gallery application.

## Contents

### Core Documentation

| Document                                       | Description                             |
| ---------------------------------------------- | --------------------------------------- |
| [FRONTEND_PLAN.md](FRONTEND_PLAN.md)           | Testing & integration plan (auth flows) |
| [UX_COMPONENTS.md](UX_COMPONENTS.md)           | UX component documentation & usage      |
| [UX_TESTING_SUMMARY.md](UX_TESTING_SUMMARY.md) | E2E testing summary for UX features     |

## Implemented Features

### Authentication & Authorization

- JWT-based authentication
- Login/Register flows
- Protected routes with middleware
- Return URL support

### Photo Gallery

- Photo upload with drag & drop
- Gallery with sorting (newest, oldest, most liked, most favorited)
- Pagination
- Public gallery access (soft gate for actions)

### Photo Interactions

- Like/unlike photos
- Add/remove favorites
- Photo deletion with confirmation

### User Profile

- Profile picture upload
- Avatar fallback system

### UX Components

- Toast notifications (success, error, info, warning)
- Loading states & skeletons
- Confirmation dialogs
- Empty states with CTAs
- Form validation

### Mobile Experience

- Responsive design
- Mobile navigation dropdown
- Touch-optimized interactions

## Testing Status

| Type       | Status      | Count      |
| ---------- | ----------- | ---------- |
| Unit Tests | Passing     | 394 tests  |
| E2E Tests  | Implemented | Playwright |

## Related Documentation

- [Backend Documentation](../../backend/docs/) - Backend API docs
- [Plans](../../plans/README.md) - Implementation plans & tracking
- [Project README](../../README.md) - Project overview

---

**Last Updated:** March 2026
