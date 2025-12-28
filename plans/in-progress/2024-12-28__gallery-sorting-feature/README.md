# Gallery Sorting & Enhanced Filtering Feature

**Status**: 🏗️ In Progress
**Created**: December 28, 2024
**Target Completion**: January 5, 2025 (Week 1)
**Priority**: P1 (High)
**Type**: Feature Enhancement

---

## Overview

Implement a comprehensive sorting system for the Gallery page that allows users to combine different filters (All Photos, My Photos, Liked Photos, Favorited Photos) with multiple sorting options (Newest, Oldest, Most Liked, Most Favorited). This will enhance user experience by giving them powerful control over how they view and discover photos.

## Problem Statement

Currently, the Gallery page supports filtering by photo source (All/My/Liked/Favorited) but has limited sorting capabilities:
- All endpoints **only** sort by `createdAt DESC` (newest first)
- No way to view oldest photos first
- No way to discover popular photos (most liked)
- No way to see trending favorited content
- Users cannot combine filters with custom sorting

**User Pain Points:**
- "I want to see my oldest photos" ❌ Not possible
- "Show me the most popular photos I've liked" ❌ Not possible
- "Which of my photos got the most likes?" ❌ Hard to find
- "I want to sort my favorited photos by popularity" ❌ Not possible

## Proposed Solution

### Two-Dropdown System

**Filter Dropdown** (Existing - Enhanced)
- All Photos
- My Photos
- Liked Photos
- Favorited Photos

**Sort Dropdown** (NEW)
- Newest First ⬇️ (default)
- Oldest First ⬆️
- Most Liked 🔥
- Most Favorited ⭐

### User Experience

```
Gallery Page
┌─────────────────────────────────────────────┐
│  Filter: [Liked Photos ▼]  Sort: [Most Liked ▼]  │
├─────────────────────────────────────────────┤
│  📸 Photo Grid (12 per page, sorted correctly) │
└─────────────────────────────────────────────┘
URL: /gallery?filter=liked&sortBy=mostLiked&page=1
```

**Examples:**
- User selects "My Photos" + "Most Liked" → See which of my photos are popular
- User selects "Liked Photos" + "Oldest First" → See the first photos I ever liked
- User selects "All Photos" + "Most Favorited" → Discover trending content
- User selects "Favorited Photos" + "Newest First" → See recently favorited photos

## Scope

### In-Scope ✅

#### Backend
- Add `sortBy` query parameter to 4 gallery endpoints
- Support 4 sorting algorithms (newest, oldest, mostLiked, mostFavorited)
- Optimize database queries (solve N+1 problem for counts)
- Add validation for sortBy parameter
- Maintain backward compatibility (default to newest)

#### Frontend
- Create new `SortingDropdown.tsx` component
- Enhance URL state management (`?filter=X&sortBy=Y&page=Z`)
- Update `Gallery` page to handle filter + sort combinations
- Update 4 service functions to accept `sortBy` parameter
- Ensure mobile responsiveness
- Add loading states and error handling

#### Testing (CRITICAL)
- **Gherkin BDD Tests**: 12-15 scenarios
- **Playwright E2E Tests**: 15-20 browser automation tests
- **Playwright API Tests**: 12-15 endpoint tests
- **Frontend Unit Tests**: 8-10 component tests
- **Backend Unit Tests**: 10-12 service/controller tests
- **Backend Integration Tests**: 5-8 full-stack tests
- **Total**: ~62-80 comprehensive test cases

#### Documentation
- API endpoint documentation
- Component JSDoc comments
- User guide section
- Developer notes

### Out-of-Scope ❌

- Search functionality (future feature)
- Advanced filters (date range, file type, etc.)
- Custom sort orders
- Sort by multiple criteria
- Sort persistence across sessions (beyond URL)
- Performance analytics/metrics
- Backend caching strategy (optimization phase)

## Success Criteria

### Must Have (P0)
- [ ] All 4 gallery endpoints support `sortBy` parameter
- [ ] All 4 sorting options work correctly (newest, oldest, mostLiked, mostFavorited)
- [ ] SortingDropdown component fully functional
- [ ] URL state reflects filter + sort + page
- [ ] No performance degradation (queries optimized)
- [ ] **ALL tests pass** (100% success rate)
- [ ] Mobile responsive design
- [ ] Error handling for invalid parameters

### Should Have (P1)
- [ ] N+1 query problem solved (batch queries)
- [ ] Loading states during fetch
- [ ] Empty states with helpful messages
- [ ] Keyboard accessibility
- [ ] SEO-friendly URLs

### Nice to Have (P2)
- [ ] Animations for dropdown transitions
- [ ] Sort direction toggle (ASC/DESC)
- [ ] Remember last sort preference (localStorage)
- [ ] Sort by upload_order for "My Photos"

## Technical Highlights

- **Backend**: Java Spring Boot + PostgreSQL with optimized JOINs
- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **State Management**: URL-based (no global state needed)
- **Testing**: Multi-layer (BDD + E2E + API + Unit + Integration)
- **Performance**: Solved N+1 problem with batch COUNT queries

## Timeline

| Phase | Duration | Tasks |
|-------|----------|-------|
| **Phase 1**: Backend | 2-3 hours | Repository, Service, Controller |
| **Phase 2**: Frontend UI | 2-3 hours | SortingDropdown, Gallery updates |
| **Phase 3**: Integration | 1-2 hours | URL state, service calls |
| **Phase 4**: Gherkin Tests | 2-3 hours | BDD scenarios + step definitions |
| **Phase 5**: E2E Tests | 2-3 hours | Playwright browser tests |
| **Phase 6**: Unit Tests | 2-3 hours | API + Frontend + Backend |
| **Phase 7**: Documentation | 1 hour | API docs, comments, guide |

**Total Estimated**: 12-18 hours (can be spread over Week 1)

## Dependencies

### No Blockers
- All required infrastructure exists
- Database schema supports feature (no migrations needed)
- Testing framework ready (Gherkin + Playwright + Jest + JUnit)

### Prerequisites
- Backend server running (`mvn spring-boot:run`)
- Frontend server running (`npm run dev`)
- PostgreSQL database accessible

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| N+1 query performance | HIGH | Use JOIN queries, batch COUNT |
| Complex URL state management | MEDIUM | Use Next.js router with proper validation |
| Test flakiness | MEDIUM | Use atomic commits, run tests 3x before merge |
| Breaking changes to existing filters | HIGH | Maintain backward compatibility (default sortBy) |

## Related Plans

- ✅ **2024-12-27 E2E Test Fixes** (Completed - 21/21 passing)
- ✅ **Gallery-Centric Navigation** (Completed)
- 🔄 **This Plan**: Gallery Sorting Enhancement
- 📋 **Future**: Advanced Search & Filters

## Files Overview

- [requirements.md](./requirements.md) - Detailed functional & technical requirements
- [technical-design.md](./technical-design.md) - Architecture, API design, database queries
- [checklist.md](./checklist.md) - Step-by-step implementation checklist with atomic commits

---

**Plan Version**: 1.0
**Last Updated**: December 28, 2024
**Status**: Ready to Execute
