# Technical Design - Mobile UX Improvements

**Project**: Mobile UX Improvements - Sticky Filter & FAB Upload
**Status**: 🔄 In Progress (Planning)
**Created**: January 29, 2026

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Design](#component-design)
3. [State Management](#state-management)
4. [Styling Approach](#styling-approach)
5. [Responsive Strategy](#responsive-strategy)
6. [Implementation Details](#implementation-details)
7. [Testing Strategy](#testing-strategy)
8. [Performance Considerations](#performance-considerations)
9. [Accessibility Implementation](#accessibility-implementation)
10. [Browser Compatibility](#browser-compatibility)

---

## Architecture Overview

### Current Architecture

```
frontend/src/app/gallery/page.tsx
├── Header Section (static)
├── Action Bar (NOT STICKY) ← PROBLEM: Disappears on scroll
│   ├── FilterDropdown
│   ├── SortByDropdown
│   └── Upload Button
└── PhotoGrid
    └── PhotoCard (mapped)
```

### Target Architecture

```
frontend/src/app/gallery/page.tsx
├── Header Section (static)
│   ├── MobileHeaderControls (mobile only) ← NEW
│   │   ├── FilterIconButton
│   │   └── SortIconButton
├── StickyActionBar (desktop only, STICKY) ← NEW
│   ├── FilterDropdown
│   ├── SortByDropdown
│   └── Upload Button
├── PhotoGrid
│   └── PhotoCard (mapped)
├── FABUpload (always visible) ← NEW
└── BackToTop (after scroll) ← EXISTING, integrate
```

### Component Hierarchy

```
GalleryPage
├── Header
│   ├── Title
│   └── MobileHeaderControls (sm:hidden)
│       ├── FilterIconButton
│       │   └── FilterDropdown (dropdown)
│       └── SortIconButton
│           └── SortByDropdown (dropdown)
├── StickyActionBar (hidden sm:flex sticky)
│   ├── FilterDropdown
│   ├── SortByDropdown
│   └── UploadButton
├── PhotoGrid
├── FABUpload (fixed)
└── BackToTop (fixed)
```

---

## Component Design

### 1. MobileHeaderControls Component

**File**: `frontend/src/components/gallery/MobileHeaderControls.tsx`

**Purpose**: Display icon-only filter and sort controls in the header on mobile devices.

**Props Interface**:
```typescript
interface MobileHeaderControlsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
}
```

**State**:
```typescript
const [isFilterOpen, setIsFilterOpen] = useState(false);
const [isSortOpen, setIsSortOpen] = useState(false);
const filterRef = useRef<HTMLDivElement>(null);
const sortRef = useRef<HTMLDivElement>(null);
```

**Key Features**:
1. Icon-only buttons (🔍 for filter, ⚙️ for sort)
2. Click outside detection to close dropdowns
3. Touch-friendly tap targets (min 44x44px)
4. Position dropdowns below icons
5. Keyboard accessibility
6. ARIA labels for screen readers

**Implementation Outline**:
```typescript
export function MobileHeaderControls({
  currentFilter,
  onFilterChange,
  currentSort,
  onSortChange,
}: MobileHeaderControlsProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // Click outside handlers
  useClickOutside(filterRef, () => setIsFilterOpen(false));
  useClickOutside(sortRef, () => setIsSortOpen(false));

  return (
    <div className="flex items-center gap-2 sm:hidden">
      {/* Filter Icon Button */}
      <div ref={filterRef} className="relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          aria-label="Filter photos"
          className="p-3 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
        {isFilterOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border p-2 z-50">
            <FilterDropdown
              currentFilter={currentFilter}
              onFilterChange={(filter) => {
                onFilterChange(filter);
                setIsFilterOpen(false);
              }}
              variant="compact"
            />
          </div>
        )}
      </div>

      {/* Sort Icon Button */}
      <div ref={sortRef} className="relative">
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          aria-label="Sort photos"
          className="p-3 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform"
        >
          <AdjustmentsIcon className="w-5 h-5" />
        </button>
        {isSortOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border p-2 z-50">
            <SortByDropdown
              currentSort={currentSort}
              onSortChange={(sort) => {
                onSortChange(sort);
                setIsSortOpen(false);
              }}
              variant="compact"
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

**Dependencies**:
- `useClickOutside` custom hook (need to create)
- Icons from `lucide-react` or Heroicons
- Modified FilterDropdown with `variant="compact"` prop
- Modified SortByDropdown with `variant="compact"` prop

---

### 2. FABUpload Component

**File**: `frontend/src/components/gallery/FABUpload.tsx`

**Purpose**: Floating action button for quick photo upload access.

**Props Interface**:
```typescript
interface FABUploadProps {
  onClick?: () => void;
  className?: string;
}
```

**State**: None (controlled component)

**Key Features**:
1. Fixed position at bottom-right
2. Circular design with upload icon
3. Green background (bg-green-600)
4. Hover scale animation
5. Active scale animation on click
6. ARIA label for accessibility
7. Keyboard navigation support

**Implementation Outline**:
```typescript
import { useRouter } from "next/navigation";
import { UploadIcon } from "lucide-react";

interface FABUploadProps {
  onClick?: () => void;
  className?: string;
}

export function FABUpload({ onClick, className = "" }: FABUploadProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push("/gallery/upload");
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Upload photo"
      className={`
        fixed bottom-4 right-4 z-40
        w-14 h-14 rounded-full
        bg-green-600 hover:bg-green-700
        text-white shadow-lg
        flex items-center justify-center
        hover:scale-110 active:scale-95
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        ${className}
      `}
    >
      <UploadIcon className="w-6 h-6" />
    </button>
  );
}
```

**Styling**:
- Fixed position: `fixed bottom-4 right-4`
- Z-index: `z-40` (above content, below BackToTop at z-50)
- Size: `w-14 h-14` (56px)
- Color: `bg-green-600` (Tailwind green-600)
- Animation: `hover:scale-110 active:scale-95`
- Transition: `transition-all duration-200`

---

### 3. StickyActionBar Component

**File**: `frontend/src/components/gallery/StickyActionBar.tsx`

**Purpose**: Wrapper component to make action bar sticky on desktop.

**Props Interface**:
```typescript
interface StickyActionBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
}
```

**State**: None (controlled component)

**Key Features**:
1. Sticky positioning on desktop
2. Hidden on mobile
3. Maintains existing action bar layout
4. Background color for scroll
5. Optional shadow on scroll

**Implementation Outline**:
```typescript
import { FilterDropdown } from "@/components/FilterDropdown";
import { SortByDropdown } from "@/components/SortByDropdown";

interface StickyActionBarProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
}

export function StickyActionBar({
  currentFilter,
  onFilterChange,
  currentSort,
  onSortChange,
}: StickyActionBarProps) {
  return (
    <div className="hidden sm:flex sticky top-0 z-10 bg-gray-50 py-4 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
        <FilterDropdown
          currentFilter={currentFilter}
          onFilterChange={onFilterChange}
        />
        <SortByDropdown
          currentSort={currentSort}
          onSortChange={onSortChange}
        />
        <button
          onClick={() => router.push("/gallery/upload")}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          + Upload Photo
        </button>
      </div>
    </div>
  );
}
```

**Styling**:
- Responsive: `hidden sm:flex` (hidden on mobile, flex on desktop)
- Sticky: `sticky top-0` (sticks to top of viewport)
- Z-index: `z-10` (above content, below header)
- Background: `bg-gray-50` (prevent show-through)
- Padding: `py-4` (maintains spacing)

---

### 4. useClickOutside Hook (New)

**File**: `frontend/src/hooks/useClickOutside.ts`

**Purpose**: Custom hook to detect clicks outside a component.

**Implementation**:
```typescript
import { useEffect, RefObject } from "react";

export function useClickOutside(
  ref: RefObject<HTMLElement>,
  callback: () => void
) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
}
```

---

## State Management

### Gallery Page State

**Current State** (in `frontend/src/app/gallery/page.tsx`):
```typescript
const [searchParams] = useSearchParams();
const currentFilter = searchParams.get("filter") || "all";
const currentSort = searchParams.get("sort") || "newest";
```

**No New State Required** for this feature:
- Filter/sort state already managed by URL parameters
- Dropdown open/close state is local to components
- Back to top visibility is local to BackToTop component

### Component State

**MobileHeaderControls**:
```typescript
const [isFilterOpen, setIsFilterOpen] = useState(false);
const [isSortOpen, setIsSortOpen] = useState(false);
```

**FABUpload**: No state (controlled component)

**StickyActionBar**: No state (controlled component)

**BackToTop** (existing):
```typescript
const [isVisible, setIsVisible] = useState(false);
```

---

## Styling Approach

### Tailwind CSS Classes

**Mobile Breakpoints**:
- Mobile (default): < 640px
- Small tablets (sm): ≥ 640px
- Tablets (md): ≥ 768px
- Desktop (lg): ≥ 1024px

**Key Classes**:

**Responsive Visibility**:
- Mobile only: `sm:hidden`
- Desktop only: `hidden sm:flex`

**Positioning**:
- Fixed: `fixed bottom-4 right-4` (FAB)
- Sticky: `sticky top-0` (action bar)
- Absolute: `absolute top-full right-0` (dropdowns)

**Z-Index Scale**:
- Content: `z-0` (default)
- Sticky action bar: `z-10`
- FAB upload: `z-40`
- Back to top: `z-50`
- Dropdowns: `z-50`

**Animations**:
- Hover scale: `hover:scale-110`
- Active scale: `active:scale-95`
- Transition: `transition-all duration-200`
- Fade in/out: `transition-opacity duration-300`

**Touch Targets**:
- Minimum size: `w-11 h-11` (44px)
- Padding: `p-3` (12px padding = 44px with icon)

---

## Responsive Strategy

### Breakpoint Strategy

**Mobile (< 640px)**:
- Show icon-only controls in header
- Hide action bar
- Show FAB upload button
- Show back to top button

**Desktop (≥ 640px)**:
- Hide icon-only controls
- Show sticky action bar
- Show FAB upload button
- Show back to top button

### Layout Changes

**Before**:
```
┌──────────────────────────────┐
│ Photo Gallery                │ ← Header
├──────────────────────────────┤
│ [Filter▼] [Sort▼] [+ Upload] │ ← Action bar (NOT sticky)
├──────────────────────────────┤
│  Photo Grid Content          │
└──────────────────────────────┘
```

**After (Mobile)**:
```
┌──────────────────────────────┐
│ Photo Gallery          🔍 ⚙️ │ ← Header with icons
├──────────────────────────────┤
│  Photo Grid Content          │
│                    ┌───┐   │
│                    │ 📤 │   │ ← FAB Upload
│                    └───┘   │
│                    ⬆️      │ ← Back to Top
└──────────────────────────────┘
```

**After (Desktop)**:
```
┌─────────────────────────────────────────────────┐
│ Photo Gallery                    [Filter▼] [Sort▼] [+ Upload] │ ← Sticky
├─────────────────────────────────────────────────┤
│  Photo Grid (3-4 columns)                        │
│                                     ┌───┐   │
│                                     │ 📤 │   │ ← FAB Upload
│                                     └───┘   │
│                                     ⬆️      │ ← Back to Top
└─────────────────────────────────────────────────┘
```

---

## Implementation Details

### Phase 1: Compact Header (Mobile)

**Steps**:

1. **Create `MobileHeaderControls` component**:
   ```bash
   touch frontend/src/components/gallery/MobileHeaderControls.tsx
   ```

2. **Create `useClickOutside` hook**:
   ```bash
   touch frontend/src/hooks/useClickOutside.ts
   ```

3. **Modify `FilterDropdown` component**:
   - Add `variant?: "default" | "compact"` prop
   - When `variant="compact"`, hide button text and show as dropdown list only
   - Maintain existing functionality

4. **Modify `SortByDropdown` component**:
   - Add `variant?: "default" | "compact"` prop
   - When `variant="compact"`, hide button text and show as dropdown list only
   - Maintain existing functionality

5. **Update gallery page header**:
   - Import `MobileHeaderControls`
   - Add to header: `<div className="flex sm:hidden"><MobileHeaderControls ... /></div>`
   - Hide action bar on mobile: `<div className="hidden sm:flex ...">`

**Files to Modify**:
- `frontend/src/components/gallery/MobileHeaderControls.tsx` (new)
- `frontend/src/hooks/useClickOutside.ts` (new)
- `frontend/src/components/FilterDropdown.tsx` (modify)
- `frontend/src/components/SortByDropdown.tsx` (modify)
- `frontend/src/app/gallery/page.tsx` (modify)

**Estimated Time**: 1.5 hours

---

### Phase 2: FAB Upload Button

**Steps**:

1. **Create `FABUpload` component**:
   ```bash
   touch frontend/src/components/gallery/FABUpload.tsx
   ```

2. **Implement component**:
   - Use `lucide-react` icons (UploadIcon)
   - Fixed position at bottom-right
   - Green background, circular design
   - Hover/active scale animations
   - ARIA label for accessibility

3. **Integrate into gallery page**:
   - Import `FABUpload`
   - Add to page: `<FABUpload />`
   - Position after PhotoGrid (z-index handles visibility)

**Files to Modify**:
- `frontend/src/components/gallery/FABUpload.tsx` (new)
- `frontend/src/app/gallery/page.tsx` (modify)

**Estimated Time**: 1 hour

---

### Phase 3: Sticky Action Bar (Desktop)

**Steps**:

1. **Create `StickyActionBar` component**:
   ```bash
   touch frontend/src/components/gallery/StickyActionBar.tsx
   ```

2. **Implement component**:
   - Wrap existing action bar markup
   - Add `sticky top-0 z-10` classes
   - Add `bg-gray-50` background
   - Add `hidden sm:flex` for responsive behavior
   - Import and use existing FilterDropdown, SortByDropdown

3. **Replace action bar in gallery page**:
   - Import `StickyActionBar`
   - Replace existing action bar `<div>` with `<StickyActionBar />`
   - Remove existing action bar markup

**Files to Modify**:
- `frontend/src/components/gallery/StickyActionBar.tsx` (new)
- `frontend/src/app/gallery/page.tsx` (modify)

**Estimated Time**: 30 minutes

---

### Phase 4: Back to Top Button

**Steps**:

1. **Review existing `BackToTop` component**:
   - Check if it already exists: `frontend/src/components/BackToTop.tsx`
   - Verify scroll threshold (currently 400px)
   - Verify smooth scroll implementation

2. **Integrate into gallery page** (if not already integrated):
   - Import `BackToTop`
   - Add to page: `<BackToTop />`
   - Ensure it's positioned correctly (bottom-left)

3. **Adjust positioning if needed**:
   - Ensure z-index is `z-50` (above FAB at `z-40`)
   - Position: `fixed bottom-4 left-4`
   - Ensure visibility on all devices

**Files to Modify**:
- `frontend/src/components/BackToTop.tsx` (modify if needed)
- `frontend/src/app/gallery/page.tsx` (modify)

**Estimated Time**: 1 hour

---

## Testing Strategy

### Unit Tests

**Components to Test**:
1. `MobileHeaderControls`
   - Filter icon opens dropdown on click
   - Sort icon opens dropdown on click
   - Dropdown closes on click outside
   - Dropdown closes on option select
   - Correct props passed to children

2. `FABUpload`
   - Renders correctly
   - Has correct classes
   - Navigates to upload page on click

3. `StickyActionBar`
   - Renders correctly
   - Has correct classes
   - Passes props to children

4. `useClickOutside`
   - Calls callback on click outside
   - Does not call callback on click inside

### E2E Tests

**File**: `tests/e2e/gallery-mobile-ux.spec.ts`

**Test Suites**:

1. **Mobile Header Controls** (4 tests):
   ```typescript
   test("should show filter icon on mobile", async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto("/gallery");
     await expect(page.locator('[aria-label="Filter photos"]')).toBeVisible();
   });

   test("should hide filter icon on desktop", async ({ page }) => {
     await page.setViewportSize({ width: 1024, height: 768 });
     await page.goto("/gallery");
     await expect(page.locator('[aria-label="Filter photos"]')).toBeHidden();
   });

   test("should open filter dropdown when icon clicked", async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto("/gallery");
     await page.click('[aria-label="Filter photos"]');
     await expect(page.locator("text=All Photos")).toBeVisible();
   });

   test("should close dropdown when clicking outside", async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto("/gallery");
     await page.click('[aria-label="Filter photos"]');
     await page.click("body");
     await expect(page.locator("text=All Photos")).toBeHidden();
   });
   ```

2. **FAB Upload Button** (4 tests):
   ```typescript
   test("should show FAB button on all devices", async ({ page }) => {
     await page.goto("/gallery");
     await expect(page.locator('[aria-label="Upload photo"]')).toBeVisible();
   });

   test("should navigate to upload page when FAB clicked", async ({ page }) => {
     await page.goto("/gallery");
     await page.click('[aria-label="Upload photo"]');
     await expect(page).toHaveURL("/gallery/upload");
   });

   test("should position FAB at bottom-right", async ({ page }) => {
     await page.goto("/gallery");
     const fab = page.locator('[aria-label="Upload photo"]');
     const box = await fab.boundingBox();
     expect(box?.x).toBeGreaterThan(300); // Right side
     expect(box?.y).toBeGreaterThan(500); // Bottom
   });

   test("should have green background", async ({ page }) => {
     await page.goto("/gallery");
     const fab = page.locator('[aria-label="Upload photo"]');
     await expect(fab).toHaveCSS("background-color", "rgb(22, 163, 74)"); // green-600
   });
   ```

3. **Back to Top** (4 tests):
   ```typescript
   test("should show back to top after scrolling", async ({ page }) => {
     await page.goto("/gallery");
     await page.evaluate(() => window.scrollTo(0, 500));
     await expect(page.locator('[aria-label="Back to top"]')).toBeVisible();
   });

   test("should hide back to top at top of page", async ({ page }) => {
     await page.goto("/gallery");
     await expect(page.locator('[aria-label="Back to top"]')).toBeHidden();
   });

   test("should scroll to top when clicked", async ({ page }) => {
     await page.goto("/gallery");
     await page.evaluate(() => window.scrollTo(0, 500));
     await page.click('[aria-label="Back to top"]');
     await expect(await page.evaluate(() => window.scrollY)).toBe(0);
   });

   test("should position back to top at bottom-left", async ({ page }) => {
     await page.goto("/gallery");
     await page.evaluate(() => window.scrollTo(0, 500));
     const button = page.locator('[aria-label="Back to top"]');
     const box = await button.boundingBox();
     expect(box?.x).toBeLessThan(50); // Left side
     expect(box?.y).toBeGreaterThan(500); // Bottom
   });
   ```

4. **Desktop Sticky Controls** (4 tests):
   ```typescript
   test("should stick action bar on desktop", async ({ page }) => {
     await page.setViewportSize({ width: 1024, height: 768 });
     await page.goto("/gallery");
     await page.evaluate(() => window.scrollTo(0, 500));
     const actionBar = page.locator("div.sticky");
     await expect(actionBar).toBeInViewport();
   });

   test("should hide action bar on mobile", async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto("/gallery");
     await expect(page.locator("div.sticky")).toBeHidden();
   });

   test("should show filter options on desktop", async ({ page }) => {
     await page.setViewportSize({ width: 1024, height: 768 });
     await page.goto("/gallery");
     await page.click("text=Filter");
     await expect(page.locator("text=All Photos")).toBeVisible();
   });

   test("should filter work when action bar is sticky", async ({ page }) => {
     await page.setViewportSize({ width: 1024, height: 768 });
     await page.goto("/gallery");
     await page.evaluate(() => window.scrollTo(0, 500));
     await page.click("text=Filter");
     await page.click("text=My Photos");
     await expect(page).toHaveURL(/?filter=my/);
   });
   ```

5. **Cross-Device** (4 tests):
   ```typescript
   test("should show correct layout on mobile", async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto("/gallery");
     await expect(page.locator('[aria-label="Filter photos"]')).toBeVisible();
     await expect(page.locator('[aria-label="Upload photo"]')).toBeVisible();
     await expect(page.locator("div.sticky")).toBeHidden();
   });

   test("should show correct layout on desktop", async ({ page }) => {
     await page.setViewportSize({ width: 1024, height: 768 });
     await page.goto("/gallery");
     await expect(page.locator('[aria-label="Filter photos"]')).toBeHidden();
     await expect(page.locator('[aria-label="Upload photo"]')).toBeVisible();
     await expect(page.locator("div.sticky")).toBeVisible();
   });

   test("should work on tablet", async ({ page }) => {
     await page.setViewportSize({ width: 768, height: 1024 });
     await page.goto("/gallery");
     await expect(page.locator('[aria-label="Upload photo"]')).toBeVisible();
     await expect(page.locator("div.sticky")).toBeVisible();
   });

   test("should not have horizontal scroll", async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto("/gallery");
     const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
     const clientWidth = await page.evaluate(() => document.body.clientWidth);
     expect(scrollWidth).toEqual(clientWidth);
   });
   ```

6. **Feature Parity** (4 tests):
   ```typescript
   test("should have all filter options on mobile", async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto("/gallery");
     await page.click('[aria-label="Filter photos"]');
     await expect(page.locator("text=All Photos")).toBeVisible();
     await expect(page.locator("text=My Photos")).toBeVisible();
     await expect(page.locator("text=Liked")).toBeVisible();
     await expect(page.locator("text=Favorited")).toBeVisible();
   });

   test("should have all sort options on mobile", async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto("/gallery");
     await page.click('[aria-label="Sort photos"]');
     await expect(page.locator("text=Newest")).toBeVisible();
     await expect(page.locator("text=Oldest")).toBeVisible();
     await expect(page.locator("text=Most Liked")).toBeVisible();
     await expect(page.locator("text=Most Favorited")).toBeVisible();
   });

   test("should update URL params on mobile", async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto("/gallery");
     await page.click('[aria-label="Filter photos"]');
     await page.click("text=My Photos");
     await expect(page).toHaveURL(/?filter=my/);
   });

   test("should make API calls on mobile", async ({ page }) => {
     await page.setViewportSize({ width: 375, height: 667 });
     await page.goto("/gallery");
     await page.click('[aria-label="Filter photos"]');
     await page.click("text=My Photos");
     // Wait for API call to complete
     await page.waitForLoadState("networkidle");
     // Verify photos are filtered
     await expect(page.locator(".photo-card")).toHaveCountGreaterThan(0);
   });
   ```

**Total E2E Tests**: 24 tests

---

## Performance Considerations

### Potential Issues

1. **Re-renders from dropdown state**:
   - **Issue**: Dropdown open/close state changes cause re-renders
   - **Solution**: Keep state local to components, use `React.memo` if needed

2. **Scroll event listeners**:
   - **Issue**: Back to top uses scroll event listener
   - **Solution**: Already optimized in existing BackToTop component

3. **Click outside listeners**:
   - **Issue**: Adding event listeners for dropdowns
   - **Solution**: Clean up listeners in `useEffect` return

4. **Fixed positioning repaints**:
   - **Issue**: Fixed elements can cause repaints during scroll
   - **Solution**: Use `will-change: transform` if needed, avoid for now

### Optimizations

1. **Memoization**:
   ```typescript
   export const MobileHeaderControls = React.memo(function MobileHeaderControls({
     currentFilter,
     onFilterChange,
     currentSort,
     onSortChange,
   }: MobileHeaderControlsProps) {
     // ...
   });
   ```

2. **Callback memoization**:
   ```typescript
   const handleFilterChange = useCallback((filter: FilterType) => {
     onFilterChange(filter);
     setIsFilterOpen(false);
   }, [onFilterChange]);
   ```

3. **Lazy loading**:
   - FABUpload: Already lightweight, no lazy loading needed
   - StickyActionBar: Already lightweight, no lazy loading needed

---

## Accessibility Implementation

### ARIA Labels

**MobileHeaderControls**:
```typescript
<button
  aria-label="Filter photos"
  aria-expanded={isFilterOpen}
  aria-haspopup="true"
>
  <SearchIcon className="w-5 h-5" />
</button>
```

**FABUpload**:
```typescript
<button
  aria-label="Upload photo"
  type="button"
>
  <UploadIcon className="w-6 h-6" />
</button>
```

**BackToTop**:
```typescript
<button
  aria-label="Back to top"
  type="button"
>
  <ArrowUpIcon className="w-5 h-5" />
</button>
```

### Keyboard Navigation

**Tab Order**:
1. Header links (if any)
2. Filter icon button (mobile)
3. Sort icon button (mobile)
4. Filter dropdown (desktop)
5. Sort dropdown (desktop)
6. Upload button (desktop or FAB)
7. Photo cards
8. Back to top button

**Focus Management**:
- Dropdown items focusable with `tabindex`
- Focus trap in dropdowns when open
- Focus returns to trigger after close

### Focus Indicators

```typescript
className="focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
```

### Screen Reader Announcements

- Use `aria-label` for icon-only buttons
- Use `aria-expanded` for dropdown toggles
- Use `aria-haspopup="true"` for dropdown triggers
- Use semantic HTML (`<button>`, not `<div>`)

---

## Browser Compatibility

### Sticky Positioning

**Support**:
- Chrome: 56+ (March 2017)
- Firefox: 59+ (March 2018)
- Safari: 13+ (September 2019)
- Edge: 16+ (September 2017)

**Polyfill**: Not needed for modern browsers (last 2 years)

### Smooth Scroll

**Support**:
- Chrome: 61+ (September 2017)
- Firefox: 36+ (February 2015)
- Safari: 15.4+ (March 2022)
- Edge: 79+ (January 2020)

**Fallback**: Use `scroll-behavior: smooth` in CSS, JavaScript fallback if needed

### CSS Transforms

**Support**:
- All modern browsers
- Scale animations universally supported

### Feature Detection

```typescript
// Check for sticky support
const isStickySupported = CSS.supports("position", "sticky");

// Check for smooth scroll support
const isSmoothScrollSupported = "scrollBehavior" in document.documentElement.style;
```

---

## Migration Path

### Step-by-Step Migration

1. **Phase 1**: Create and integrate MobileHeaderControls
2. **Phase 2**: Create and integrate FABUpload
3. **Phase 3**: Create and integrate StickyActionBar
4. **Phase 4**: Integrate BackToTop
5. **Phase 5**: Test and polish
6. **Phase 6**: Add E2E tests

### Rollback Strategy

Each phase is independent and can be rolled back:

1. **Phase 1**: Remove MobileHeaderControls, show action bar on mobile
2. **Phase 2**: Remove FABUpload
3. **Phase 3**: Remove StickyActionBar, use regular action bar
4. **Phase 4**: Remove BackToTop

---

## Summary

This technical design document provides:

1. **Component Architecture**: 4 new components with clear responsibilities
2. **State Management**: Minimal new state, URL-based filter/sort
3. **Styling Approach**: Tailwind CSS with responsive utilities
4. **Implementation Details**: Step-by-step for each phase
5. **Testing Strategy**: 24 E2E tests covering all features
6. **Performance**: Optimizations and considerations
7. **Accessibility**: ARIA labels, keyboard navigation, focus management
8. **Browser Compatibility**: Modern browsers, no polyfills needed

**Key Technical Decisions**:
- Use existing FilterDropdown/SortByDropdown with `variant` prop
- Fixed position for FAB (z-index: 40)
- Sticky position for action bar (z-index: 10)
- Local state for dropdown open/close
- URL-based state for filter/sort
- Tailwind CSS for all styling
- Lucide React for icons

**Files to Create**: 4 new files
**Files to Modify**: 5 existing files
**Total Components**: 4 new components
**Total E2E Tests**: 24 tests
