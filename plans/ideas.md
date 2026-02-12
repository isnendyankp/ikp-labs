# Ideas & Quick Concepts

Quick concept snippets and brainstorming notes that haven't been formalized into plans yet.

---

## 📝 Active Ideas

<!-- Add new ideas here with date -->

### 2026-01-13: Core UX Improvements (In Progress - Week 1)
- **Toast Notifications System** - Success/Error/Warning/Info feedback
- **Loading States** - Skeleton screens, spinners, progress bars
- **Confirmation Dialogs** - Destructive action confirmations
- **Empty States** - Helpful messages with CTAs
- **Form Validation UX** - Real-time inline validation
- **Micro-interactions** - Hover effects, animations
- Note: 6 core improvements, estimated 12-17 hours

### 2026-01-13: UX Enhancements (Backlog - Week 2+)
- **Dark Mode Toggle** - Theme switcher (light/dark/auto)
- **Image Lightbox/Preview** - Full-size image viewer with zoom
- **Drag & Drop Upload** - Better file upload experience
- **Lazy Loading Images** - Performance + UX improvement
- **Command Palette (Cmd+K)** - Quick search and actions
- **Keyboard Shortcuts** - Power user navigation
- **Optimistic UI** - Instant feedback with rollback
- **Infinite Scroll** - Replace pagination (optional)

### 2026-01-12: Future Feature Ideas (High Priority)
- **Photo Comments System** - Allow users to comment on photos
- **Photo Search & Advanced Filtering** - Search by tags, date ranges, metadata
- **User Tagging in Photos** - Tag other users in photos (@mentions)
- **Photo Albums/Collections** - Organize photos into albums
- **Batch Photo Operations** - Select multiple photos for bulk actions
- **Photo Metadata Editor** - Edit EXIF data, location, tags
- **Notification System** - In-app notifications for likes, comments, mentions

### 2026-01-12: Infrastructure Ideas (Medium Priority)
- **Docker Containerization** - Dockerfiles for local development and deployment
- **Redis Caching Layer** - Cache frequently accessed data
- **API Rate Limiting** - Prevent abuse, ensure fair usage
- **Database Backup Automation** - Automated backup system
- **Monitoring & Logging** - Application monitoring with alerts
- **API Documentation with Swagger/OpenAPI** - Interactive API docs

### 2026-01-12: Testing Ideas (Low Priority)
- **Visual Regression Tests** - Storybook + Chromatic for UI changes
- **Performance Tests** - Lighthouse CI for performance tracking
- **Accessibility Tests** - jest-axe for a11y validation
- **Contract Testing** - Pact for API contract validation

### 2026-01-12: Nice-to-Have Features
- **Photo Editing Tools** - Crop, rotate, filters
- **Social Sharing** - Share photos to social media
- **Photo Download** - Allow users to download photos
- **Print Ordering** - Integration with print services
- **Mobile App** - React Native or PWA version

---

## 🗃️ Archive

<!-- Ideas that have been implemented or rejected -->

### ✅ Moved to Done (Formal Plans Completed)
- **UX Improvements** (completed in `done/2026-01-13__ux-improvements/`)
  - Toast notifications, loading states, confirmation dialogs
  - Empty states, form validation, micro-interactions
  - Completed: January 18, 2026

- **Frontend Unit Tests** (in progress in `in-progress/2026-02-11__frontend-unit-tests/`)
  - Jest + React Testing Library setup
  - Component, hook, utility, and service testing
  - Phase 1 completed: February 11, 2026

- **CI/CD Pipeline** (planned in `backlog/2026-01-12__cicd-pipeline/`)
  - GitHub Actions workflows
  - Pre-commit hooks, automated deployment
  - Status: Backlog

### ✅ Implemented
- **Gallery Sorting Feature** (moved to `done/2024-12-28__gallery-sorting-feature/`)
  - Completed: January 4, 2026
  - 116+ comprehensive tests
  - 96% query reduction (N+1 problem solved)

- **Photo Favorites Feature** (moved to `done/2024-12-18__photo-favorites-feature/`)
  - Completed: December 22, 2024

- **Photo Likes Feature** (moved to `done/2024-12-10__photo-likes-feature/`)
  - Initial idea: December 2024
  - Completed: December 14, 2024

- **E2E Gallery Tests** (moved to `done/2024-12-08__e2e-gallery-tests/`)
  - Completed: December 1-6, 2024
  - 20 comprehensive E2E tests covering full Gallery lifecycle
  - 6-day commit streak with 31 atomic commits
  - 1,207 lines of test code (tests + helpers)
  - 1 critical frontend bug discovered and fixed

---

## 💡 How to Use This File

**Purpose**: Quick capture of ideas before they become formal plans

**Workflow**:
1. Add new ideas to "Active Ideas" section with date
2. When ready to plan → move to `backlog/` folder with full planning docs
3. When implemented → move to "Archive" section
4. When rejected → move to "Archive" with reason

**Format**:
```markdown
### YYYY-MM-DD: Idea Title
- Brief description
- Why this is valuable
- Rough estimate (if known)
```

---

**Last Updated**: January 12, 2026
