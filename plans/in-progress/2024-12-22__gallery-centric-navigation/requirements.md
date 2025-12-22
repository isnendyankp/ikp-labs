# Gallery-Centric Navigation - Requirements

## 1. Business Requirements

### 1.1 Problem Statement
The current application structure requires users to navigate through multiple pages to access the main feature (photo gallery). The home page is profile-focused, which doesn't align with the app's primary use case: browsing and managing photos.

### 1.2 Solution Overview
Transform the gallery into the application's home page with an integrated filter system, allowing users to seamlessly switch between different photo views without page navigation.

### 1.3 Business Goals
- Reduce time-to-value for users (see content immediately)
- Improve user engagement with photo content
- Simplify navigation mental model
- Increase discoverability of features (likes, favorites)

## 2. User Requirements

### 2.1 User Stories

#### US-1: Auto-Redirect from Root
**As a** logged-in user
**I want** to be automatically redirected to the gallery when I visit the root URL
**So that** I can immediately start browsing photos without extra clicks

**Acceptance Criteria:**
- Given I am authenticated
- When I navigate to `/`
- Then I should be redirected to `/gallery`
- And see the default "All Photos" view

#### US-2: Login Redirect to Gallery
**As a** user completing login
**I want** to be taken directly to the gallery
**So that** I can start my session with the main content

**Acceptance Criteria:**
- Given I successfully log in
- When the login completes
- Then I should be redirected to `/gallery`
- And not to `/home` or any other page

#### US-3: Unified Photo Filter
**As a** user browsing photos
**I want** a single filter dropdown to switch between photo views
**So that** I can easily explore different collections without changing pages

**Acceptance Criteria:**
- Given I am on the gallery page
- When I click the filter dropdown
- Then I should see 4 options: All Photos, My Photos, Liked Photos, Favorited Photos
- And selecting any option updates the gallery content immediately
- And the URL reflects my current filter choice

#### US-4: Access My Profile
**As a** user wanting to view/edit my profile
**I want** a clear "My Profile" link in the navbar
**So that** I can easily access my personal settings

**Acceptance Criteria:**
- Given I am on any page
- When I look at the navbar
- Then I should see a "My Profile" link
- And clicking it takes me to `/myprofile`

#### US-5: Return to Gallery from Profile
**As a** user viewing my profile
**I want** a "Back to Gallery" button
**So that** I can quickly return to browsing photos

**Acceptance Criteria:**
- Given I am on `/myprofile`
- When I look for navigation options
- Then I should see a "Back to Gallery" button/link
- And clicking it returns me to `/gallery`

### 2.2 User Personas

#### Primary Persona: Content Consumer
- **Goal**: Browse and discover public photos
- **Behavior**: Logs in to explore gallery immediately
- **Need**: Fast access to photo content

#### Secondary Persona: Content Creator
- **Goal**: Upload and manage personal photos
- **Behavior**: Uses filters to switch between public and personal views
- **Need**: Easy navigation between viewing modes

## 3. Functional Requirements

### 3.1 Route Structure

#### FR-1: Root Route Behavior
- **Route**: `/`
- **Authentication Required**: No (handles both states)
- **Behavior**:
  - If user is authenticated → Redirect to `/gallery`
  - If user is not authenticated → Redirect to `/login`
- **Priority**: High
- **Complexity**: Low

#### FR-2: Gallery Route
- **Route**: `/gallery`
- **Authentication Required**: Yes
- **Default View**: All Photos (public photos)
- **Query Parameters**: `?filter=<filter-value>&page=<page-number>`
- **Filter Values**: `all`, `my-photos`, `liked`, `favorited`
- **Priority**: High
- **Complexity**: Medium

#### FR-3: My Profile Route (Renamed)
- **Old Route**: `/home`
- **New Route**: `/myprofile`
- **Authentication Required**: Yes
- **Sub-routes**:
  - `/myprofile/liked-photos`
  - `/myprofile/favorited-photos`
- **Priority**: High
- **Complexity**: Medium

#### FR-4: Login Route
- **Route**: `/login`
- **Authentication Required**: No
- **Post-Login Redirect**: `/gallery` (changed from `/home`)
- **Priority**: High
- **Complexity**: Low

### 3.2 Filter System

#### FR-5: Filter Dropdown Component
- **Location**: Gallery page, below navbar, left side
- **Component Type**: Dropdown select
- **Default Selection**: "All Photos"
- **Options**:
  1. **All Photos** - Display all public photos
  2. **My Photos** - Display current user's uploaded photos
  3. **Liked Photos** - Display photos the user has liked
  4. **Favorited Photos** - Display photos the user has favorited

#### FR-6: Filter Data Fetching
- **All Photos**: Fetch from `/api/gallery-photos` (existing endpoint)
- **My Photos**: Filter by `userId` matching current user
- **Liked Photos**: Fetch photos where user has active like
- **Favorited Photos**: Fetch photos where user has active favorite

#### FR-7: Filter State Management
- **URL Sync**: Filter state must be reflected in URL query params
- **Format**: `/gallery?filter=<value>`
- **Default**: `/gallery` (no param) = `filter=all`
- **Browser Navigation**: Back/forward buttons must work correctly
- **Refresh Behavior**: Page refresh maintains filter state

#### FR-8: Pagination with Filters
- **Photos per Page**: 12 (unchanged from current implementation)
- **URL Format**: `/gallery?filter=<value>&page=<number>`
- **Behavior**: Each filter maintains independent pagination
- **Reset**: Changing filters resets to page 1

### 3.3 Navigation Components

#### FR-9: Navbar Updates
- **Remove**: "Home" link (if present)
- **Keep/Add**:
  - "My Profile" link → `/myprofile`
  - "Logout" button → Clears auth and redirects to `/login`
- **Priority**: Medium
- **Complexity**: Low

#### FR-10: Gallery Action Bar
- **Components**:
  - Filter dropdown (left side)
  - Upload Photo button (right side of filter)
- **Remove**: "My Photos" and "Public" toggle buttons
- **Priority**: High
- **Complexity**: Medium

#### FR-11: Profile Page Navigation
- **Add**: "Back to Gallery" button/link
- **Position**: Top of profile page
- **Behavior**: Returns to `/gallery` (maintains filter state if possible)
- **Priority**: Low
- **Complexity**: Low

### 3.4 Authentication & Security

#### FR-12: Protected Routes
All existing authentication checks remain:
- `/gallery` requires authentication
- `/myprofile` requires authentication
- `/login` redirects authenticated users to `/gallery`

## 4. Non-Functional Requirements

### 4.1 Performance
- **NFR-1**: Filter switching should complete within 300ms
- **NFR-2**: Initial gallery load should complete within 2 seconds
- **NFR-3**: URL updates should not cause full page refresh

### 4.2 Usability
- **NFR-4**: Filter dropdown should be keyboard accessible
- **NFR-5**: Active filter should be visually indicated
- **NFR-6**: Navigation should be consistent across all pages

### 4.3 Compatibility
- **NFR-7**: Works on modern browsers (Chrome, Firefox, Safari, Edge)
- **NFR-8**: Responsive design maintained (desktop and mobile)
- **NFR-9**: No breaking changes to existing API contracts

### 4.4 Maintainability
- **NFR-10**: FilterDropdown component should be reusable
- **NFR-11**: Filter logic should be centralized (no duplication)
- **NFR-12**: URL parameter handling should be consistent

## 5. UI/UX Requirements

### 5.1 Filter Dropdown Design
```
┌─────────────────────────────────────────────────────────┐
│  Navbar: [Logo]  [My Profile]  [Logout]                │
├─────────────────────────────────────────────────────────┤
│  Gallery                                                │
│  ┌──────────────────┐          ┌──────────────────┐    │
│  │ Filter: All Photos ▼ │      │ + Upload Photo   │    │
│  └──────────────────┘          └──────────────────┘    │
│                                                         │
│  [Photo Grid - 12 photos]                              │
└─────────────────────────────────────────────────────────┘
```

**Dropdown Expanded:**
```
┌──────────────────────┐
│ Filter: All Photos ▼ │
├──────────────────────┤
│ ✓ All Photos         │  ← Selected (checkmark)
│   My Photos          │
│   Liked Photos       │
│   Favorited Photos   │
└──────────────────────┘
```

### 5.2 My Profile Page Design
```
┌─────────────────────────────────────────────────────────┐
│  Navbar: [Logo]  [My Profile]  [Logout]                │
├─────────────────────────────────────────────────────────┤
│  ← Back to Gallery                                      │
│                                                         │
│  My Profile                                             │
│  ────────────────                                       │
│                                                         │
│  Name: John Doe                                         │
│  Email: john@example.com                                │
│                                                         │
│  Statistics                                             │
│  • 50 Photos Uploaded                                   │
│  • 120 Photos Liked                                     │
│  • 30 Photos Favorited                                  │
│                                                         │
│  [Edit Profile]                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.3 Filter Labels
- **Label Format**: Plain text (no icons initially)
- **Active State**: Checkmark (✓) or bold text
- **Hover State**: Background highlight
- **Disabled State**: N/A (all filters always available)

## 6. Data Requirements

### 6.1 Filter Data Sources

#### All Photos
- **Source**: Public gallery photos
- **API Endpoint**: `/api/gallery-photos`
- **Filters**: `public=true` or no user filter
- **Sort**: Most recent first

#### My Photos
- **Source**: Current user's uploads
- **API Endpoint**: `/api/gallery-photos` filtered by `userId`
- **Filters**: `userId=<currentUserId>`
- **Sort**: Most recent upload first

#### Liked Photos
- **Source**: Photos with active like from current user
- **API Endpoint**: TBD (check if exists, may need `/api/users/{id}/liked-photos`)
- **Filters**: Join with photo_likes table
- **Sort**: Most recent like first

#### Favorited Photos
- **Source**: Photos with active favorite from current user
- **API Endpoint**: `/api/users/{userId}/favorite-photos` (existing)
- **Filters**: Join with photo_favorites table
- **Sort**: Most recent favorite first

### 6.2 Pagination
- **Page Size**: 12 photos
- **Response Format**: `{ photos: [...], totalPages: N, currentPage: M }`
- **Boundary Handling**: Empty state for last page, disable "Next" button

## 7. Edge Cases & Error Handling

### 7.1 Authentication
- **EC-1**: Unauthenticated access to `/gallery` → Redirect to `/login`
- **EC-2**: Token expiration during session → Auto-logout, redirect to `/login`
- **EC-3**: Authenticated user visits `/login` → Redirect to `/gallery`

### 7.2 Filter States
- **EC-4**: Filter with no results → Show "No photos found" message
- **EC-5**: Invalid filter query param → Default to `filter=all`
- **EC-6**: Filter switch during pagination → Reset to page 1

### 7.3 Navigation
- **EC-7**: Direct URL access to old `/home` → Redirect to `/myprofile`
- **EC-8**: Bookmarked links with old routes → Still work via redirect
- **EC-9**: Browser back from profile → Return to last gallery filter state

### 7.4 Data Loading
- **EC-10**: API error during filter fetch → Show error message, retry option
- **EC-11**: Slow network → Show loading spinner
- **EC-12**: Empty gallery (new user) → Show welcome message + upload CTA

## 8. Constraints

### 8.1 Technical Constraints
- Must use existing Next.js routing system
- Must maintain backward compatibility with existing API
- Must not break existing authentication flow
- Must preserve current photo data structure

### 8.2 Business Constraints
- No backend changes required (frontend-only refactor)
- No changes to database schema
- No impact on existing user data

## 9. Success Metrics

### 9.1 Functional Metrics
- [ ] 100% of routes correctly redirect based on auth state
- [ ] All 4 filters return correct photo data
- [ ] URL params correctly sync with filter state
- [ ] Pagination works for all filters
- [ ] All navigation links function correctly

### 9.2 User Experience Metrics
- [ ] Reduced clicks to reach gallery from login (2 → 1)
- [ ] Filter switching completes in < 300ms
- [ ] No broken links or 404 errors
- [ ] Browser navigation (back/forward) works intuitively

## 10. Out of Scope

The following are explicitly NOT included in this feature:
- Backend API changes or new endpoints
- Database schema modifications
- Advanced filter combinations (e.g., "Liked AND My Photos")
- Filter sorting options (by date, popularity, etc.)
- Search functionality
- Bulk photo operations
- Photo tagging or categorization
- User settings for default filter
- Filter analytics or usage tracking

---

**Document Version**: 1.0
**Last Updated**: December 22, 2024
**Status**: Approved for Implementation
