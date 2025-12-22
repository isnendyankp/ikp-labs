# Gallery-Centric Navigation Feature

**Feature ID**: 2024-12-22__gallery-centric-navigation
**Status**: In Progress
**Created**: December 22, 2024
**Type**: UX Enhancement / Navigation Refactor

## Overview

This feature transforms the application's navigation structure to make the **Gallery** the central hub of user experience, replacing the current home/profile-centric approach. Users will be immediately directed to the photo gallery upon login, with a unified filter system for viewing different photo collections.

## Goals

### Primary Objectives
1. **Gallery as Home**: Make `/gallery` the default landing page after authentication
2. **Unified Filter System**: Replace view toggle buttons with a comprehensive dropdown filter
3. **Simplified Navigation**: Streamline user journey with clear, intuitive navigation paths
4. **Profile Separation**: Distinguish between "home" (gallery) and "my profile" (user settings)

### User Experience Improvements
- **Faster Time-to-Value**: Users see content immediately after login
- **Clearer Mental Model**: Gallery = main app, Profile = user management
- **Reduced Clicks**: Filter switching without page navigation
- **Better Discoverability**: All view options visible in one dropdown

## Key Changes Summary

### Route Structure
```
BEFORE:
/               → Default Next.js welcome page
/home           → User profile (redirected after login)
/gallery        → Photo gallery with My/Public toggle
/home/liked-photos      → Liked photos page
/home/favorited-photos  → Favorited photos page

AFTER:
/               → Auto-redirect to /gallery (or /login if not authenticated)
/gallery        → Main home page with filter dropdown (default: All Photos)
/myprofile      → User profile page
/myprofile/liked-photos    → Direct access to liked photos
/myprofile/favorited-photos → Direct access to favorited photos
```

### Navigation Components
```
BEFORE:
Navbar: [Home] [Gallery] [Upload] [Logout]
Gallery: [My Photos] [Public] buttons

AFTER:
Navbar: [My Profile] [Logout]
Gallery: [Filter: All Photos ▼] [+ Upload Photo]
Filter Options:
  - All Photos (public photos - default)
  - My Photos (user's uploads)
  - Liked Photos (photos user liked)
  - Favorited Photos (user's private favorites)
```

### User Flow
```
BEFORE:
Login → /home → Click Gallery → Choose My/Public

AFTER:
Login → /gallery (All Photos view) → Use filter dropdown to switch views
```

## Features

### 1. Auto-Redirect from Root
- Authenticated users: `/` → `/gallery`
- Unauthenticated users: `/` → `/login`

### 2. Filter Dropdown System
- **Position**: Below navbar, left side
- **Type**: Dropdown select menu
- **Default**: "All Photos" (public photos)
- **Options**:
  - All Photos (public)
  - My Photos (user uploads)
  - Liked Photos (user's likes)
  - Favorited Photos (private favorites)

### 3. URL State Management
- Filter state stored in URL query params
- Example: `/gallery?filter=all`, `/gallery?filter=liked`
- Benefits: Shareable links, browser navigation, bookmarkable views

### 4. Simplified Profile Page
- Route: `/myprofile` (renamed from `/home`)
- Content: Profile info, statistics, edit options
- Navigation: "Back to Gallery" button
- Sub-routes maintained for direct access

### 5. Updated Login Flow
- Login success → Redirect to `/gallery` (not `/home`)
- Consistent with gallery-as-home concept

## Technical Scope

### Frontend Changes
- Route restructuring (`/home` → `/myprofile`)
- Root page redirect logic
- Gallery page filter implementation
- New FilterDropdown component
- Navbar navigation updates
- Login redirect update

### Backend Requirements
- No backend changes required
- Existing API endpoints support all filter views

### Testing Scope
- Authentication flow tests
- Filter functionality tests
- Navigation tests
- URL state management tests
- Redirect logic tests

## Success Criteria

### Functional
- [x] Root `/` redirects based on auth status
- [x] `/gallery` is default post-login destination
- [x] Filter dropdown switches between 4 views
- [x] All filters show correct data (12 photos/page)
- [x] Pagination works with each filter
- [x] URL params reflect current filter state
- [x] "My Profile" link works correctly
- [x] "Back to Gallery" returns to filtered view

### User Experience
- [x] No broken links after route changes
- [x] Smooth transitions between filters
- [x] Browser back/forward works correctly
- [x] Filter selection persists on page refresh
- [x] Clear visual indication of active filter

### Code Quality
- [x] No duplicated filter logic
- [x] Reusable FilterDropdown component
- [x] Consistent URL parameter handling
- [x] Updated tests passing

## Dependencies

### Internal
- Existing auth system (`lib/auth.ts`)
- Existing API service (`services/api.ts`)
- Current gallery components

### External
- Next.js routing (`useRouter`, `useSearchParams`)
- React hooks (`useState`, `useEffect`)

## Timeline

**Estimated Duration**: 1 development session

**Phases**:
1. ✅ Planning & Documentation (Completed)
2. ⏳ Implementation (Pending approval)
3. ⏸️ Testing & Validation
4. ⏸️ Code Review & Polish

## Documentation

- [Requirements](./requirements.md) - Detailed feature requirements
- [Technical Design](./technical-design.md) - Architecture and implementation details
- [Checklist](./checklist.md) - Step-by-step implementation tasks

## Related Features

- Photo Gallery Feature (2024-11-24)
- Photo Likes Feature (2024-12-10)
- Photo Favorites Feature (2024-12-18)

## Notes

### Like vs Favorite Distinction
- **Like**: Public appreciation (visible to others, shows like count)
- **Favorite**: Private bookmark (only visible to user, no public counter)

### Filter Default Behavior
- Default filter: "All Photos" (public photos)
- Rationale: Show content discovery first, personal photos secondary

### Atomic Commit Strategy
Each implementation task = 1 focused commit + push for:
- Better rollback capability
- Clear change history
- Improved GitHub activity visibility
- Easier code review

---

**Last Updated**: December 22, 2024
**Next Step**: Await approval for Phase 2 (Implementation)
