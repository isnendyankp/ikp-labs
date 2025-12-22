# Gallery-Centric Navigation - Technical Design

## 1. Architecture Overview

### 1.1 System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Browser                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Next.js App Router                               │  │
│  │  ┌─────────────┐  ┌──────────────┐                │  │
│  │  │ / (root)    │  │ /gallery     │  ← Main Route  │  │
│  │  │  redirect   │  │  + filters   │                │  │
│  │  └─────────────┘  └──────────────┘                │  │
│  │  ┌─────────────┐  ┌──────────────┐                │  │
│  │  │ /login      │  │ /myprofile   │  ← Renamed     │  │
│  │  │  redirect   │  │              │                │  │
│  │  └─────────────┘  └──────────────┘                │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Components Layer                                 │  │
│  │  • FilterDropdown (new)                           │  │
│  │  • GalleryGrid (modified)                         │  │
│  │  • Navbar (modified)                              │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  State Management                                 │  │
│  │  • URL Search Params (filter, page)              │  │
│  │  • React useState (local UI state)               │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Services Layer                                   │  │
│  │  • api.ts (photo fetching)                       │  │
│  │  • auth.ts (authentication)                      │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                Spring Boot Backend                       │
│  • /api/gallery-photos (existing)                       │
│  • /api/users/{id}/favorite-photos (existing)           │
│  • /api/auth/* (existing)                               │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Component Hierarchy
```
App Layout
├── Navbar (modified)
│   ├── Logo
│   ├── My Profile Link
│   └── Logout Button
│
├── / (root page)
│   └── Redirect Logic Component
│
├── /gallery (main page)
│   ├── FilterDropdown (new)
│   ├── Upload Button
│   ├── GalleryGrid (modified)
│   │   ├── PhotoCard[]
│   │   └── Pagination
│   └── LoadingSpinner
│
├── /myprofile (renamed from /home)
│   ├── Back to Gallery Link
│   ├── Profile Info
│   ├── Statistics
│   └── Edit Button
│
└── /login
    └── LoginForm (modified redirect)
```

## 2. Detailed Component Design

### 2.1 Root Page (`/app/page.tsx`)

**Purpose**: Auto-redirect based on authentication status

**Implementation**:
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/gallery');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
}
```

**Key Points**:
- Client component (needs `useEffect`, `useRouter`)
- Checks auth on mount
- No data fetching needed
- Shows brief loading state

---

### 2.2 FilterDropdown Component (New)

**File**: `frontend/src/components/FilterDropdown.tsx`

**Props**:
```typescript
interface FilterDropdownProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}
```

**Implementation**:
```typescript
'use client';

import { useState } from 'react';

type FilterOption = {
  value: string;
  label: string;
};

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Photos' },
  { value: 'my-photos', label: 'My Photos' },
  { value: 'liked', label: 'Liked Photos' },
  { value: 'favorited', label: 'Favorited Photos' },
];

export default function FilterDropdown({ currentFilter, onFilterChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const currentLabel = FILTER_OPTIONS.find(opt => opt.value === currentFilter)?.label || 'All Photos';

  const handleSelect = (value: string) => {
    onFilterChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Filter: {currentLabel}
        <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {FILTER_OPTIONS.map(option => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`${
                  currentFilter === option.value ? 'bg-gray-100 font-semibold' : ''
                } block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
              >
                {currentFilter === option.value && '✓ '}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

**Features**:
- Controlled component (state managed by parent)
- Visual indicator for selected filter
- Keyboard accessible
- Click outside to close (can be enhanced)

---

### 2.3 Gallery Page (`/app/gallery/page.tsx`)

**Major Changes**:
1. Remove view toggle buttons (My Photos / Public)
2. Add FilterDropdown component
3. Add URL query param management
4. Update data fetching based on filter

**Implementation**:
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAuthenticated, getUserFromToken } from '@/lib/auth';
import FilterDropdown from '@/components/FilterDropdown';
import { /* API functions */ } from '@/services/api';

export default function GalleryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filter from URL, default to 'all'
  const filter = searchParams.get('filter') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [photos, setPhotos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userInfo = getUserFromToken();
    if (userInfo) {
      setUser(userInfo);
    } else {
      router.push('/login');
    }
  }, [router]);

  // Fetch photos based on filter
  useEffect(() => {
    if (!user) return;

    const fetchPhotos = async () => {
      setLoading(true);
      try {
        let data;
        switch (filter) {
          case 'all':
            data = await fetchPublicPhotos(page);
            break;
          case 'my-photos':
            data = await fetchMyPhotos(user.userId, page);
            break;
          case 'liked':
            data = await fetchLikedPhotos(user.userId, page);
            break;
          case 'favorited':
            data = await fetchFavoritedPhotos(user.userId, page);
            break;
          default:
            data = await fetchPublicPhotos(page);
        }
        setPhotos(data.photos);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [filter, page, user]);

  const handleFilterChange = (newFilter: string) => {
    // Update URL with new filter, reset to page 1
    router.push(`/gallery?filter=${newFilter}&page=1`);
  };

  const handlePageChange = (newPage: number) => {
    router.push(`/gallery?filter=${filter}&page=${newPage}`);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4">
      {/* Action Bar */}
      <div className="flex justify-between items-center my-6">
        <FilterDropdown
          currentFilter={filter}
          onFilterChange={handleFilterChange}
        />
        <button
          onClick={() => router.push('/gallery/upload')}
          className="btn-primary"
        >
          + Upload Photo
        </button>
      </div>

      {/* Photo Grid */}
      {loading ? (
        <div>Loading photos...</div>
      ) : photos.length === 0 ? (
        <div>No photos found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map(photo => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
```

**Key Changes**:
- `useSearchParams()` to read URL params
- Filter-specific fetch logic
- URL updates via `router.push()`
- Removed view toggle buttons

---

### 2.4 My Profile Page (Renamed)

**Old Path**: `frontend/src/app/home/`
**New Path**: `frontend/src/app/myprofile/`

**Changes Required**:
1. Rename directory
2. Update internal links
3. Add "Back to Gallery" button
4. Simplify content (remove photo grids)

**Implementation** (`/app/myprofile/page.tsx`):
```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserFromToken } from '@/lib/auth';
import Link from 'next/link';

export default function MyProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalPhotos: 0,
    totalLikes: 0,
    totalFavorites: 0,
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const userInfo = getUserFromToken();
    if (userInfo) {
      setUser(userInfo);
      // Fetch user stats
      fetchUserStats(userInfo.userId);
    }
  }, [router]);

  const fetchUserStats = async (userId: number) => {
    // Implementation: Fetch user statistics
    // For now, placeholder
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to Gallery */}
      <Link
        href="/gallery"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
      >
        ← Back to Gallery
      </Link>

      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      {/* Profile Info */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <p className="mt-1 text-lg">{user.fullName}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-lg">{user.email}</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Statistics</h2>
        <ul className="space-y-2">
          <li>• {stats.totalPhotos} Photos Uploaded</li>
          <li>• {stats.totalLikes} Photos Liked</li>
          <li>• {stats.totalFavorites} Photos Favorited</li>
        </ul>
      </div>

      {/* Edit Profile Button */}
      <button className="btn-primary">Edit Profile</button>
    </div>
  );
}
```

---

### 2.5 Login Form Update

**File**: `frontend/src/components/LoginForm.tsx`

**Change**: Update redirect destination

```typescript
// BEFORE:
const response = await loginUser(email, password);
router.push('/home');

// AFTER:
const response = await loginUser(email, password);
router.push('/gallery');
```

---

## 3. Data Flow

### 3.1 Filter Data Flow
```
User clicks filter
      ↓
FilterDropdown.onFilterChange(newFilter)
      ↓
GalleryPage.handleFilterChange(newFilter)
      ↓
router.push(`/gallery?filter=${newFilter}&page=1`)
      ↓
URL updates → searchParams changes
      ↓
useEffect triggers (filter dependency)
      ↓
fetchPhotos() with new filter
      ↓
API call based on filter type
      ↓
setPhotos(data) + setTotalPages(data)
      ↓
Gallery re-renders with new photos
```

### 3.2 Authentication Flow
```
User visits /
      ↓
useEffect checks isAuthenticated()
      ↓
  Authenticated?
  ├── Yes → router.push('/gallery')
  └── No  → router.push('/login')
      ↓
Login success
      ↓
router.push('/gallery')
      ↓
Gallery loads with default filter (all)
```

## 4. API Integration

### 4.1 Required API Functions

**File**: `frontend/src/services/api.ts`

```typescript
// Existing (check and use):
export async function fetchPublicPhotos(page: number = 1) {
  const response = await fetch(`${API_URL}/gallery-photos?page=${page}&size=12`);
  return response.json();
}

// New or verify exists:
export async function fetchMyPhotos(userId: number, page: number = 1) {
  const response = await fetch(
    `${API_URL}/gallery-photos?userId=${userId}&page=${page}&size=12`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.json();
}

export async function fetchLikedPhotos(userId: number, page: number = 1) {
  // Check if endpoint exists, may need to create or use alternative
  const response = await fetch(
    `${API_URL}/users/${userId}/liked-photos?page=${page}&size=12`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.json();
}

export async function fetchFavoritedPhotos(userId: number, page: number = 1) {
  // This endpoint exists from previous feature
  const response = await fetch(
    `${API_URL}/users/${userId}/favorite-photos?page=${page}&size=12`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.json();
}
```

### 4.2 API Endpoints Verification

**Needs Verification**:
1. Does `/api/users/{id}/liked-photos` exist?
   - If not, may need to filter client-side or backend implementation
   - Alternative: Fetch all photos and filter where user has liked

2. Does `/api/gallery-photos` support `userId` filter?
   - If not, may need separate endpoint or client-side filtering

**Action**: Verify these during implementation phase

---

## 5. URL Structure

### 5.1 Query Parameter Schema

```
/gallery
/gallery?filter=all
/gallery?filter=all&page=1
/gallery?filter=my-photos&page=2
/gallery?filter=liked&page=1
/gallery?filter=favorited&page=3
```

**Parameters**:
- `filter`: string (all | my-photos | liked | favorited)
  - Default: 'all'
  - Validation: If invalid, default to 'all'
- `page`: number
  - Default: 1
  - Validation: If < 1, set to 1; if > totalPages, set to totalPages

### 5.2 URL Handling Logic

```typescript
// Reading params
const searchParams = useSearchParams();
const filter = searchParams.get('filter') || 'all';
const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

// Updating params
const updateURL = (newFilter: string, newPage: number) => {
  const params = new URLSearchParams();
  if (newFilter !== 'all') params.set('filter', newFilter);
  if (newPage !== 1) params.set('page', newPage.toString());

  const queryString = params.toString();
  router.push(`/gallery${queryString ? '?' + queryString : ''}`);
};
```

---

## 6. State Management

### 6.1 URL as Source of Truth

**Philosophy**: URL query params are the single source of truth for:
- Current filter
- Current page

**Benefits**:
- Shareable URLs
- Browser navigation works
- Refresh maintains state
- No complex state sync

### 6.2 Component State

**Local State** (useState):
- `photos`: array - Current page photos
- `totalPages`: number - Total pages for pagination
- `loading`: boolean - Loading indicator
- `user`: object - Current user info
- `isDropdownOpen`: boolean - FilterDropdown open state

**No Global State Needed**:
- No Context API required
- No Redux/Zustand needed
- URL + local state sufficient

---

## 7. File Structure Changes

### 7.1 Route Changes
```
BEFORE:
frontend/src/app/
├── home/
│   ├── page.tsx
│   ├── liked-photos/
│   │   └── page.tsx
│   └── favorited-photos/
│       └── page.tsx
├── gallery/
│   ├── page.tsx
│   └── ...
└── page.tsx (default Next.js)

AFTER:
frontend/src/app/
├── myprofile/              ← RENAMED
│   ├── page.tsx           ← MODIFIED
│   ├── liked-photos/
│   │   └── page.tsx
│   └── favorited-photos/
│       └── page.tsx
├── gallery/
│   ├── page.tsx           ← MODIFIED (major refactor)
│   └── ...
└── page.tsx               ← MODIFIED (redirect logic)
```

### 7.2 Component Changes
```
frontend/src/components/
├── FilterDropdown.tsx     ← NEW
├── LoginForm.tsx          ← MODIFIED (redirect change)
├── Navbar.tsx             ← MODIFIED (links update)
└── (other components)
```

### 7.3 No Backend Changes
```
backend/
└── (no changes required)
```

---

## 8. Migration Strategy

### 8.1 Backward Compatibility

**Old URLs Redirect**:
```typescript
// Create middleware or add to layout
// frontend/src/middleware.ts (if doesn't exist, create)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect /home to /myprofile
  if (pathname.startsWith('/home')) {
    const newPath = pathname.replace('/home', '/myprofile');
    return NextResponse.redirect(new URL(newPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/home/:path*',
};
```

### 8.2 Data Migration
- **No data migration needed** (routes only, no data changes)
- All existing photo data remains unchanged
- All existing user data remains unchanged

---

## 9. Testing Strategy

### 9.1 Unit Tests
- FilterDropdown component
  - Renders with correct current filter
  - Calls onFilterChange with correct value
  - Shows/hides dropdown on click
- URL parameter parsing logic
- Filter data fetching functions

### 9.2 Integration Tests
- Filter switching updates photos correctly
- Pagination works with each filter
- URL params sync with UI state
- Authentication redirects work

### 9.3 E2E Tests
- User journey: Login → Gallery (all) → Switch filter → Upload → View my photos
- URL navigation: Direct access to `/gallery?filter=liked`
- Browser navigation: Back/forward buttons work
- Logout and re-login flow

---

## 10. Performance Considerations

### 10.1 Optimization Opportunities
- **Filter Switching**: Debounce if needed (currently immediate)
- **Photo Loading**: Show skeleton loaders during fetch
- **Caching**: Consider caching filter results (optional)
- **Prefetching**: Prefetch next page in background

### 10.2 Load Time Targets
- Root redirect: < 100ms
- Filter switch: < 300ms
- Initial gallery load: < 2s
- Subsequent filter loads: < 500ms

---

## 11. Security Considerations

### 11.1 Authentication
- All protected routes check `isAuthenticated()`
- JWT token validation on every API call
- Expired token auto-redirects to login

### 11.2 Data Access
- "My Photos" filter: Only show current user's photos
- "Liked Photos" filter: Only show what current user liked
- "Favorited Photos" filter: Private to current user

### 11.3 URL Manipulation
- Validate filter param (whitelist: all, my-photos, liked, favorited)
- Sanitize page param (must be positive integer)
- Invalid params default to safe values

---

## 12. Error Handling

### 12.1 API Errors
```typescript
try {
  const data = await fetchPhotos(filter, page);
  setPhotos(data.photos);
} catch (error) {
  console.error('Error fetching photos:', error);
  // Show user-friendly error message
  setError('Failed to load photos. Please try again.');
}
```

### 12.2 Authentication Errors
```typescript
if (!isAuthenticated()) {
  router.push('/login');
  return null; // Prevent rendering protected content
}
```

### 12.3 Empty States
- No photos in filter: "No photos found in this category"
- New user (no uploads): "Upload your first photo to get started"
- Network error: "Unable to load photos. Check your connection."

---

## 13. Accessibility

### 13.1 FilterDropdown
- Keyboard navigable (Tab, Enter, Escape)
- ARIA labels for screen readers
- Focus management on open/close
- Visual focus indicators

### 13.2 Navigation
- Semantic HTML (`<nav>`, `<a>`, `<button>`)
- Skip links for keyboard users
- Meaningful link text ("My Profile" not "Click here")

---

## 14. Browser Compatibility

**Target Browsers**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features**:
- ES6+ (Next.js transpiles)
- URLSearchParams API
- Fetch API
- Modern CSS (flexbox, grid)

---

**Document Version**: 1.0
**Last Updated**: December 22, 2024
**Status**: Ready for Implementation
