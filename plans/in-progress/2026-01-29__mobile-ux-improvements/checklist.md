# Checklist - Mobile UX Improvements

**Project**: Mobile UX Improvements - Sticky Filter & FAB Upload
**Status**: 🔄 In Progress (Planning)
**Created**: January 29, 2026

---

## Progress Summary

| Phase | Status | Completion |
|-------|--------|------------|
| Phase 1: Compact Header (Mobile) | ⏳ Not Started | 0/4 tasks |
| Phase 2: FAB Upload Button | ⏳ Not Started | 0/3 tasks |
| Phase 3: Sticky Action Bar (Desktop) | ⏳ Not Started | 0/2 tasks |
| Phase 4: Back to Top Button | ⏳ Not Started | 0/3 tasks |
| Phase 5: Responsive Testing & Polish | ⏳ Not Started | 0/6 tasks |
| Phase 6: E2E Testing | ⏳ Not Started | 0/6 tasks |
| **Overall** | **🔄 Planning** | **0/24 tasks** |

---

## Phase 1: Compact Header (Mobile)

**Estimated Time**: ~1.5 hours
**Status**: ⏳ Not Started

### Task 1.1: Create useClickOutside Hook

**Description**: Create a custom React hook to detect clicks outside a component.

**File**: `frontend/src/hooks/useClickOutside.ts`

**Steps**:
1. Create `frontend/src/hooks/` directory if it doesn't exist
2. Create `useClickOutside.ts` file
3. Implement hook with useEffect for mousedown event
4. Add proper TypeScript types (RefObject, callback function)
5. Clean up event listener on unmount

**Acceptance Criteria**:
- [ ] Hook accepts ref and callback parameters
- [ ] Hook calls callback when click is detected outside ref
- [ ] Hook does not call callback when click is inside ref
- [ ] Event listener is cleaned up on unmount
- [ ] TypeScript types are correct

**Atomic Commit Message**:
```
feat(mobile-ux): add useClickOutside hook

Add custom React hook to detect clicks outside a component:

- Hook accepts RefObject and callback parameters
- Calls callback on mousedown outside component
- Properly cleans up event listener on unmount
- TypeScript types for type safety

Used by MobileHeaderControls for dropdown dismissal.
```

**Estimated Time**: 15 minutes

---

### Task 1.2: Modify FilterDropdown Component

**Description**: Add variant prop to FilterDropdown for compact mode.

**File**: `frontend/src/components/FilterDropdown.tsx`

**Steps**:
1. Add `variant?: "default" | "compact"` prop to interface
2. When `variant="compact"`, hide the dropdown trigger button
3. Show only the dropdown menu items in compact mode
4. Maintain all existing functionality
5. Ensure all filter options are available

**Acceptance Criteria**:
- [ ] Variant prop added to interface
- [ ] Compact mode hides trigger button
- [ ] Compact mode shows dropdown items
- [ ] All 4 filter options available (All, My, Liked, Favorited)
- [ ] onFilterChange callback works correctly
- [ ] Existing functionality unchanged when variant="default"

**Atomic Commit Message**:
```
feat(mobile-ux): add compact variant to FilterDropdown

Add variant prop to FilterDropdown for mobile icon mode:

- Add variant?: "default" | "compact" prop
- Hide trigger button in compact mode
- Show dropdown menu items directly in compact mode
- Maintain all existing functionality
- All 4 filter options available

Allows dropdown to be used inside mobile header controls.
```

**Estimated Time**: 20 minutes

---

### Task 1.3: Modify SortByDropdown Component

**Description**: Add variant prop to SortByDropdown for compact mode.

**File**: `frontend/src/components/SortByDropdown.tsx`

**Steps**:
1. Add `variant?: "default" | "compact"` prop to interface
2. When `variant="compact"`, hide the dropdown trigger button
3. Show only the dropdown menu items in compact mode
4. Maintain all existing functionality
5. Ensure all sort options are available

**Acceptance Criteria**:
- [ ] Variant prop added to interface
- [ ] Compact mode hides trigger button
- [ ] Compact mode shows dropdown items
- [ ] All 4 sort options available (Newest, Oldest, Most Liked, Most Favorited)
- [ ] onSortChange callback works correctly
- [ ] Existing functionality unchanged when variant="default"

**Atomic Commit Message**:
```
feat(mobile-ux): add compact variant to SortByDropdown

Add variant prop to SortByDropdown for mobile icon mode:

- Add variant?: "default" | "compact" prop
- Hide trigger button in compact mode
- Show dropdown menu items directly in compact mode
- Maintain all existing functionality
- All 4 sort options available

Allows dropdown to be used inside mobile header controls.
```

**Estimated Time**: 20 minutes

---

### Task 1.4: Create MobileHeaderControls Component

**Description**: Create icon-only filter and sort controls for mobile header.

**File**: `frontend/src/components/gallery/MobileHeaderControls.tsx`

**Steps**:
1. Create component with TypeScript interface for props
2. Add state for filter and sort dropdown open/close
3. Add refs for click outside detection
4. Use useClickOutside hook for dropdown dismissal
5. Implement filter icon button (SearchIcon from lucide-react)
6. Implement sort icon button (AdjustmentsIcon from lucide-react)
7. Position dropdowns below icons
8. Add proper ARIA labels
9. Add touch-friendly tap targets (min 44x44px)
10. Add hover and active states

**Acceptance Criteria**:
- [ ] Component accepts currentFilter, onFilterChange, currentSort, onSortChange props
- [ ] Filter icon (🔍) visible on mobile
- [ ] Sort icon (⚙️) visible on mobile
- [ ] Clicking icon opens dropdown
- [ ] Clicking outside closes dropdown
- [ ] Selecting option closes dropdown
- [ ] Dropdowns positioned below icons
- [ ] ARIA labels present for accessibility
- [ ] Tap targets minimum 44x44px
- [ ] Component hidden on desktop (sm:hidden)

**Atomic Commit Message**:
```
feat(mobile-ux): add MobileHeaderControls component

Add icon-only filter and sort controls for mobile header:

- Filter icon (SearchIcon) and sort icon (AdjustmentsIcon)
- Click icon to open dropdown below icon
- Click outside to close dropdown
- Touch-friendly tap targets (44x44px min)
- ARIA labels for accessibility
- Hidden on desktop (sm:hidden)
- Uses useClickOutside hook for dropdown dismissal

Props: currentFilter, onFilterChange, currentSort, onSortChange
```

**Estimated Time**: 35 minutes

---

### Task 1.5: Integrate MobileHeaderControls into Gallery Page

**Description**: Add MobileHeaderControls to gallery page header and hide action bar on mobile.

**File**: `frontend/src/app/gallery/page.tsx`

**Steps**:
1. Import MobileHeaderControls component
2. Add MobileHeaderControls to header section
3. Position icons on right side of header
4. Hide existing action bar on mobile (add `hidden sm:flex`)
5. Test on mobile and desktop

**Acceptance Criteria**:
- [ ] MobileHeaderControls imported
- [ ] MobileHeaderControls added to header
- [ ] Props passed correctly (currentFilter, onFilterChange, currentSort, onSortChange)
- [ ] Icons visible on mobile (< 640px)
- [ ] Icons hidden on desktop (≥ 640px)
- [ ] Action bar hidden on mobile
- [ ] Action bar visible on desktop

**Atomic Commit Message**:
```
feat(mobile-ux): integrate MobileHeaderControls into gallery page

Add icon-only controls to gallery header for mobile:

- Import MobileHeaderControls component
- Add to header with proper props
- Hide existing action bar on mobile (hidden sm:flex)
- Icons visible on mobile, hidden on desktop

Mobile users now have filter/sort in header, desktop keeps action bar.
```

**Estimated Time**: 20 minutes

---

## Phase 2: FAB Upload Button

**Estimated Time**: ~1 hour
**Status**: ⏳ Not Started

### Task 2.1: Create FABUpload Component

**Description**: Create floating action button for photo upload.

**File**: `frontend/src/components/gallery/FABUpload.tsx`

**Steps**:
1. Create component with TypeScript interface for props
2. Use useRouter for navigation
3. Implement fixed position styling (bottom-4 right-4)
4. Add circular design (w-14 h-14 rounded-full)
5. Add green background (bg-green-600)
6. Add upload icon (UploadIcon from lucide-react)
7. Add hover scale animation (hover:scale-110)
8. Add active scale animation (active:scale-95)
9. Add transition (transition-all duration-200)
10. Add ARIA label for accessibility
11. Add focus ring for keyboard navigation

**Acceptance Criteria**:
- [ ] Component accepts onClick and className props
- [ ] Fixed position at bottom-right
- [ ] Circular design (56x56px)
- [ ] Green background (green-600)
- [ ] Upload icon visible
- [ ] Hover scale animation works
- [ ] Active scale animation works
- [ ] Navigates to /gallery/upload on click
- [ ] ARIA label present
- [ ] Focus ring present
- [ ] Z-index is 40

**Atomic Commit Message**:
```
feat(mobile-ux): add FABUpload component

Add floating action button for quick photo upload access:

- Fixed position at bottom-right (fixed bottom-4 right-4)
- Circular design (w-14 h-14 rounded-full)
- Green background (bg-green-600)
- Upload icon (UploadIcon from lucide-react)
- Hover scale animation (hover:scale-110)
- Active scale animation (active:scale-95)
- ARIA label for accessibility
- Focus ring for keyboard navigation
- Z-index 40 (above content, below BackToTop)

Always visible on all devices for easy upload access.
```

**Estimated Time**: 30 minutes

---

### Task 2.2: Integrate FABUpload into Gallery Page

**Description**: Add FABUpload component to gallery page.

**File**: `frontend/src/app/gallery/page.tsx`

**Steps**:
1. Import FABUpload component
2. Add FABUpload to page (after PhotoGrid)
3. No props needed (uses default navigation)

**Acceptance Criteria**:
- [ ] FABUpload imported
- [ ] FABUpload added to page
- [ ] FABUpload visible on all devices
- [ ] FABUpload positioned correctly
- [ ] FABUpload navigates to /gallery/upload

**Atomic Commit Message**:
```
feat(mobile-ux): integrate FABUpload into gallery page

Add floating upload button to gallery page:

- Import FABUpload component
- Add to page layout
- Always visible for quick upload access
- Works on all devices (mobile, tablet, desktop)

Upload button now always accessible without scrolling.
```

**Estimated Time**: 10 minutes

---

### Task 2.3: Remove Upload Button from Desktop Action Bar

**Description**: Remove upload button from desktop action bar since FAB is always visible.

**File**: `frontend/src/app/gallery/page.tsx`

**Steps**:
1. Locate upload button in action bar
2. Remove upload button from action bar
3. Keep filter and sort dropdowns
4. Test on desktop to ensure FAB is visible

**Acceptance Criteria**:
- [ ] Upload button removed from action bar
- [ ] Filter dropdown still present
- [ ] Sort dropdown still present
- [ ] FABUpload visible on desktop
- [ ] Desktop can still upload via FAB

**Atomic Commit Message**:
```
refactor(mobile-ux): remove upload button from action bar

Remove upload button from desktop action bar:

- FABUpload is always visible on all devices
- Prevents duplicate upload buttons
- Cleaner action bar with just filter/sort

Upload now only via FAB for consistency across devices.
```

**Estimated Time**: 10 minutes

---

### Task 2.4: Add FABUpload to Upload Page

**Description**: Add FABUpload to upload page for consistency (optional).

**File**: `frontend/src/app/gallery/upload/page.tsx`

**Steps**:
1. Import FABUpload component
2. Add FABUpload to upload page
3. Configure onClick to show modal or navigate (decide approach)

**Acceptance Criteria**:
- [ ] FABUpload added to upload page
- [ ] FABUpload behavior appropriate (maybe hidden or different action)
- [ ] Consistent with gallery page

**Note**: This task is optional and may be skipped if FAB is not needed on upload page.

**Atomic Commit Message**:
```
feat(mobile-ux): add FABUpload to upload page

Add floating upload button to upload page for consistency:

- Import and add FABUpload component
- Hide or disable on upload page (already on upload page)
- Consistent UI across gallery pages

Optional: May skip if FAB not needed on upload page.
```

**Estimated Time**: 10 minutes (optional)

---

## Phase 3: Sticky Action Bar (Desktop)

**Estimated Time**: ~30 minutes
**Status**: ⏳ Not Started

### Task 3.1: Create StickyActionBar Component

**Description**: Create wrapper component to make action bar sticky on desktop.

**File**: `frontend/src/components/gallery/StickyActionBar.tsx`

**Steps**:
1. Create component with TypeScript interface for props
2. Add sticky positioning classes (sticky top-0)
3. Add z-index (z-10)
4. Add background color (bg-gray-50)
5. Add padding (py-4)
6. Add responsive classes (hidden sm:flex)
7. Import and use existing FilterDropdown
8. Import and use existing SortByDropdown
9. Remove upload button (use FAB instead)

**Acceptance Criteria**:
- [ ] Component accepts currentFilter, onFilterChange, currentSort, onSortChange props
- [ ] Sticky positioning (sticky top-0)
- [ ] Z-index is 10
- [ ] Background color present
- [ ] Hidden on mobile (hidden sm:flex)
- [ ] Filter dropdown present
- [ ] Sort dropdown present
- [ ] Upload button removed

**Atomic Commit Message**:
```
feat(mobile-ux): add StickyActionBar component

Add sticky wrapper for desktop action bar:

- Sticky positioning (sticky top-0 z-10)
- Background color (bg-gray-50) to prevent show-through
- Hidden on mobile (hidden sm:flex)
- Filter and sort dropdowns included
- Upload button removed (use FAB instead)

Props: currentFilter, onFilterChange, currentSort, onSortChange
```

**Estimated Time**: 20 minutes

---

### Task 3.2: Integrate StickyActionBar into Gallery Page

**Description**: Replace existing action bar with StickyActionBar component.

**File**: `frontend/src/app/gallery/page.tsx`

**Steps**:
1. Import StickyActionBar component
2. Replace existing action bar div with StickyActionBar
3. Remove old action bar markup
4. Test sticky behavior on desktop

**Acceptance Criteria**:
- [ ] StickyActionBar imported
- [ ] Old action bar removed
- [ ] StickyActionBar added
- [ ] Props passed correctly
- [ ] Action bar sticks on desktop
- [ ] Action bar hidden on mobile

**Atomic Commit Message**:
```
feat(mobile-ux): integrate StickyActionBar into gallery page

Replace action bar with sticky wrapper:

- Import StickyActionBar component
- Replace existing action bar div
- Remove old action bar markup
- Props passed correctly

Desktop action bar now sticks to top when scrolling.
```

**Estimated Time**: 10 minutes

---

## Phase 4: Back to Top Button

**Estimated Time**: ~1 hour
**Status**: ⏳ Not Started

### Task 4.1: Review Existing BackToTop Component

**Description**: Review existing BackToTop component to understand implementation.

**File**: `frontend/src/components/BackToTop.tsx`

**Steps**:
1. Read BackToTop component file
2. Check scroll threshold (should be 400px)
3. Check smooth scroll implementation
4. Check positioning classes
5. Check z-index

**Acceptance Criteria**:
- [ ] Component reviewed
- [ ] Scroll threshold confirmed (400px)
- [ ] Smooth scroll confirmed
- [ ] Positioning confirmed (bottom-left)
- [ ] Z-index confirmed (should be 50)

**Note**: If BackToTop component doesn't exist, create it in Task 4.2.

**Estimated Time**: 15 minutes

---

### Task 4.2: Create BackToTop Component (if needed)

**Description**: Create BackToTop component if it doesn't exist.

**File**: `frontend/src/components/BackToTop.tsx`

**Steps**:
1. Create component with TypeScript interface
2. Add state for visibility
3. Add scroll event listener with 400px threshold
4. Implement smooth scroll to top
5. Add button styling (fixed position, bottom-left)
6. Add arrow up icon
7. Add fade in/out animation
8. Add ARIA label

**Acceptance Criteria**:
- [ ] Component created
- [ ] Appears after scrolling 400px
- [ ] Hides when at top of page
- [ ] Smooth scroll to top
- [ ] Fixed position at bottom-left
- [ ] Z-index is 50
- [ ] ARIA label present

**Atomic Commit Message**:
```
feat(mobile-ux): add BackToTop component

Add back to top button for quick navigation:

- Scroll threshold: 400px
- Smooth scroll animation
- Fixed position at bottom-left
- Fade in/out animation
- ARIA label for accessibility
- Z-index 50 (above FAB)

Helps users quickly return to top of page.
```

**Estimated Time**: 30 minutes (only if component doesn't exist)

---

### Task 4.3: Integrate BackToTop into Gallery Page

**Description**: Add BackToTop component to gallery page.

**File**: `frontend/src/app/gallery/page.tsx`

**Steps**:
1. Import BackToTop component
2. Add BackToTop to page layout
3. Test show/hide behavior
4. Test scroll to top functionality

**Acceptance Criteria**:
- [ ] BackToTop imported
- [ ] BackToTop added to page
- [ ] BackToTop appears after scrolling
- [ ] BackToTop hides at top of page
- [ ] BackToTop scrolls to top when clicked
- [ ] BackToTop positioned bottom-left
- [ ] BackToTop doesn't overlap with FAB

**Atomic Commit Message**:
```
feat(mobile-ux): integrate BackToTop into gallery page

Add back to top button to gallery page:

- Import BackToTop component
- Add to page layout
- Appears after scrolling 400px
- Smooth scroll to top
- Positioned bottom-left to avoid FAB conflict

Users can now quickly return to top of page.
```

**Estimated Time**: 15 minutes

---

## Phase 5: Responsive Testing & Polish

**Estimated Time**: ~2 hours
**Status**: ⏳ Not Started

### Task 5.1: Test on Mobile Screen Sizes

**Description**: Test layout on various mobile screen sizes.

**Steps**:
1. Open DevTools and set viewport to 375px (iPhone SE)
2. Test all features (filter, sort, upload, back to top)
3. Set viewport to 390px (iPhone 13)
4. Test all features
5. Set viewport to 414px (iPhone 14 Plus)
6. Test all features
7. Check for horizontal scroll
8. Check for element overlap
9. Check touch targets

**Acceptance Criteria**:
- [ ] No horizontal scroll on any mobile size
- [ ] No element overlap on any mobile size
- [ ] Filter/sort icons visible and tappable
- [ ] FAB visible and tappable
- [ ] Back to top visible and tappable
- [ ] Dropdowns fit within viewport
- [ ] All functionality works correctly

**Atomic Commit Message**:
```
test(mobile-ux): test mobile screen sizes

Test layout on mobile screen sizes:

- 375px (iPhone SE): All features working
- 390px (iPhone 13): All features working
- 414px (iPhone 14 Plus): All features working
- No horizontal scroll
- No element overlap
- Touch targets adequate (44x44px min)

Mobile layout validated across common screen sizes.
```

**Estimated Time**: 30 minutes

---

### Task 5.2: Test on Tablet Screen Sizes

**Description**: Test layout on tablet screen sizes.

**Steps**:
1. Open DevTools and set viewport to 640px (small tablet)
2. Test all features
3. Set viewport to 768px (tablet)
4. Test all features
5. Check breakpoint behavior (mobile vs desktop layout)
6. Check for layout issues

**Acceptance Criteria**:
- [ ] Correct layout at 640px (should be desktop layout)
- [ ] Correct layout at 768px (desktop layout)
- [ ] Action bar sticky behavior works
- [ ] FAB visible and working
- [ ] No layout issues at breakpoint

**Atomic Commit Message**:
```
test(mobile-ux): test tablet screen sizes

Test layout on tablet screen sizes:

- 640px (small tablet): Desktop layout working
- 768px (tablet): Desktop layout working
- Breakpoint behavior correct (sm: 640px)
- Sticky action bar working
- All features functional

Tablet layout validated.
```

**Estimated Time**: 20 minutes

---

### Task 5.3: Test on Desktop Screen Sizes

**Description**: Test layout on desktop screen sizes.

**Steps**:
1. Open DevTools and set viewport to 1024px (desktop)
2. Test all features
3. Set viewport to 1280px (large desktop)
4. Test all features
5. Set viewport to 1920px (full HD)
6. Test all features
7. Check sticky behavior
8. Check for layout issues

**Acceptance Criteria**:
- [ ] All desktop sizes working correctly
- [ ] Sticky action bar working
- [ ] Filter/sort dropdowns working
- [ ] FAB visible and working
- [ ] Back to top working
- [ ] No layout issues

**Atomic Commit Message**:
```
test(mobile-ux): test desktop screen sizes

Test layout on desktop screen sizes:

- 1024px (desktop): All features working
- 1280px (large desktop): All features working
- 1920px (full HD): All features working
- Sticky action bar working
- All features functional

Desktop layout validated across common screen sizes.
```

**Estimated Time**: 20 minutes

---

### Task 5.4: Test Touch Targets and Interactions

**Description**: Test touch targets and user interactions.

**Steps**:
1. Test filter icon tap target size
2. Test sort icon tap target size
3. Test FAB tap target size
4. Test back to top tap target size
5. Test dropdown item tap target size
6. Test hover animations on desktop
7. Test active animations
8. Test smooth transitions

**Acceptance Criteria**:
- [ ] Filter icon min 44x44px
- [ ] Sort icon min 44x44px
- [ ] FAB 56x56px
- [ ] Back to top min 44x44px
- [ ] Dropdown items full width, min 44px height
- [ ] Hover animations smooth
- [ ] Active animations smooth
- [ ] Transitions smooth (60fps)

**Atomic Commit Message**:
```
test(mobile-ux): test touch targets and interactions

Test touch targets and user interactions:

- Filter icon: 44x44px minimum ✓
- Sort icon: 44x44px minimum ✓
- FAB: 56x56px ✓
- Back to top: 44x44px minimum ✓
- Dropdown items: 44px height minimum ✓
- Hover animations: Smooth at 60fps ✓
- Active animations: Smooth ✓

All touch targets meet iOS/Android guidelines.
```

**Estimated Time**: 20 minutes

---

### Task 5.5: Test Accessibility

**Description**: Test accessibility features.

**Steps**:
1. Test keyboard navigation (Tab through all buttons)
2. Test focus indicators (visible on all buttons)
3. Test screen reader (announce button functions)
4. Test ARIA labels (present on icon-only buttons)
5. Test focus management (dropdowns)
6. Test color contrast (WCAG AA)

**Acceptance Criteria**:
- [ ] All buttons keyboard accessible
- [ ] Focus indicators visible
- [ ] Screen reader announces functions
- [ ] ARIA labels present
- [ ] Focus management correct
- [ ] Color contrast WCAG AA compliant

**Atomic Commit Message**:
```
test(mobile-ux): test accessibility features

Test accessibility compliance:

- Keyboard navigation: All buttons accessible ✓
- Focus indicators: Visible on all buttons ✓
- Screen reader: Announces button functions ✓
- ARIA labels: Present on icon-only buttons ✓
- Focus management: Dropdowns trap focus ✓
- Color contrast: WCAG AA compliant ✓

Accessibility requirements met.
```

**Estimated Time**: 20 minutes

---

### Task 5.6: Performance Testing and Optimization

**Description**: Test performance and optimize if needed.

**Steps**:
1. Test page load time (should not increase >100ms)
2. Test scroll performance (should be 60fps)
3. Test animation performance (should be 60fps)
4. Check for layout shift
5. Check for unnecessary re-renders
6. Optimize if needed

**Acceptance Criteria**:
- [ ] Page load time increased <100ms
- [ ] Scroll performance 60fps
- [ ] Animation performance 60fps
- [ ] No layout shift
- [ ] No unnecessary re-renders

**Atomic Commit Message**:
```
perf(mobile-ux): optimize performance

Performance testing and optimization:

- Page load time: <100ms increase ✓
- Scroll performance: 60fps ✓
- Animation performance: 60fps ✓
- No layout shift ✓
- No unnecessary re-renders ✓

Performance is acceptable.
```

**Estimated Time**: 20 minutes

---

## Phase 6: E2E Testing

**Estimated Time**: ~2 hours
**Status**: ⏳ Not Started

### Task 6.1: Create E2E Test File

**Description**: Create E2E test file for mobile UX features.

**File**: `tests/e2e/gallery-mobile-ux.spec.ts`

**Steps**:
1. Create test file
2. Set up test suite structure
3. Import necessary dependencies

**Acceptance Criteria**:
- [ ] Test file created
- [ ] Test suite structure set up
- [ ] Dependencies imported

**Atomic Commit Message**:
```
test(e2e): create gallery mobile UX test file

Create E2E test file for mobile UX features:

- File: tests/e2e/gallery-mobile-ux.spec.ts
- Test suite structure set up
- Dependencies imported

Ready for test implementations.
```

**Estimated Time**: 10 minutes

---

### Task 6.2: Add Mobile Header Controls Tests

**Description**: Add E2E tests for mobile header controls.

**Tests**:
1. Filter icon visible on mobile
2. Sort icon visible on mobile
3. Filter dropdown opens when tapped
4. Sort dropdown opens when tapped

**Acceptance Criteria**:
- [ ] Test 1: Filter icon visible on mobile (375px)
- [ ] Test 2: Sort icon visible on mobile (375px)
- [ ] Test 3: Filter dropdown opens on click
- [ ] Test 4: Sort dropdown opens on click
- [ ] All tests passing

**Atomic Commit Message**:
```
test(e2e): add mobile header controls tests

Add E2E tests for mobile header controls:

- Filter icon visible on mobile (375px)
- Sort icon visible on mobile (375px)
- Filter dropdown opens when clicked
- Sort dropdown opens when clicked

4 tests added, all passing.
```

**Estimated Time**: 20 minutes

---

### Task 6.3: Add FAB Upload Button Tests

**Description**: Add E2E tests for FAB upload button.

**Tests**:
1. FAB button visible on all pages
2. FAB button navigates to upload page
3. FAB button positioned bottom-right
4. FAB button has proper styling

**Acceptance Criteria**:
- [ ] Test 1: FAB visible on all devices
- [ ] Test 2: FAB navigates to /gallery/upload
- [ ] Test 3: FAB positioned bottom-right
- [ ] Test 4: FAB has green background
- [ ] All tests passing

**Atomic Commit Message**:
```
test(e2e): add FAB upload button tests

Add E2E tests for FAB upload button:

- FAB button visible on all devices
- FAB button navigates to /gallery/upload
- FAB button positioned bottom-right
- FAB button has green background (green-600)

4 tests added, all passing.
```

**Estimated Time**: 20 minutes

---

### Task 6.4: Add Back to Top Tests

**Description**: Add E2E tests for back to top button.

**Tests**:
1. Back to top appears after scrolling
2. Back to top hidden at top of page
3. Back to top scrolls to top smoothly
4. Back to top positioned correctly

**Acceptance Criteria**:
- [ ] Test 1: Back to top appears after 400px scroll
- [ ] Test 2: Back to top hidden at top
- [ ] Test 3: Back to top scrolls to top
- [ ] Test 4: Back to top positioned bottom-left
- [ ] All tests passing

**Atomic Commit Message**:
```
test(e2e): add back to top button tests

Add E2E tests for back to top button:

- Button appears after scrolling 400px
- Button hidden at top of page
- Button scrolls to top smoothly
- Button positioned bottom-left

4 tests added, all passing.
```

**Estimated Time**: 20 minutes

---

### Task 6.5: Add Desktop Sticky Controls Tests

**Description**: Add E2E tests for desktop sticky controls.

**Tests**:
1. Action bar sticks on desktop
2. Controls accessible when scrolled
3. Filter/sort work in sticky mode
4. Upload button accessible in sticky mode

**Acceptance Criteria**:
- [ ] Test 1: Action bar sticks on desktop (1024px)
- [ ] Test 2: Controls accessible when scrolled
- [ ] Test 3: Filter dropdown works when sticky
- [ ] Test 4: Sort dropdown works when sticky
- [ ] All tests passing

**Atomic Commit Message**:
```
test(e2e): add desktop sticky controls tests

Add E2E tests for desktop sticky controls:

- Action bar sticks on desktop (1024px)
- Controls accessible when scrolled
- Filter dropdown works when sticky
- Sort dropdown works when sticky

4 tests added, all passing.
```

**Estimated Time**: 20 minutes

---

### Task 6.6: Add Cross-Device and Feature Parity Tests

**Description**: Add E2E tests for cross-device compatibility and feature parity.

**Tests**:
1. Mobile layout correct (< 640px)
2. Desktop layout correct (≥ 640px)
3. All filter options work on mobile
4. All sort options work on mobile

**Acceptance Criteria**:
- [ ] Test 1: Mobile layout correct (375px)
- [ ] Test 2: Desktop layout correct (1024px)
- [ ] Test 3: All 4 filter options work on mobile
- [ ] Test 4: All 4 sort options work on mobile
- [ ] All tests passing

**Atomic Commit Message**:
```
test(e2e): add cross-device and feature parity tests

Add E2E tests for cross-device and feature parity:

- Mobile layout correct (< 640px)
- Desktop layout correct (≥ 640px)
- All 4 filter options work on mobile
- All 4 sort options work on mobile

4 tests added, all passing.

Total: 24 E2E tests for mobile UX improvements.
```

**Estimated Time**: 20 minutes

---

## Final Checklist

### Pre-Release Checks

**Code Quality**:
- [ ] All TypeScript errors resolved
- [ ] All ESLint errors resolved
- [ ] Code follows project style guide
- [ ] All files committed with atomic commits
- [ ] All commits pushed to remote

**Testing**:
- [ ] All 24 E2E tests passing
- [ ] Manual testing completed on mobile
- [ ] Manual testing completed on desktop
- [ ] Accessibility testing completed
- [ ] Performance testing completed

**Documentation**:
- [ ] README.md up to date
- [ ] requirements.md complete
- [ ] technical-design.md complete
- [ ] checklist.md complete (this file)
- [ ] All status fields updated

**Deployment**:
- [ ] No console errors in production
- [ ] No layout issues in production
- [ ] All features working in production
- [ ] Performance acceptable in production
- [ ] Ready for release

---

## Summary

**Total Tasks**: 24 tasks
**Total Estimated Time**: 6-8 hours
**Atomic Commits**: 24 commits (1 per task)
**E2E Tests**: 24 tests

**Phases**:
1. ✅ Phase 1: Compact Header (Mobile) - 4 tasks, ~1.5 hours
2. ✅ Phase 2: FAB Upload Button - 3 tasks, ~1 hour
3. ✅ Phase 3: Sticky Action Bar (Desktop) - 2 tasks, ~30 minutes
4. ✅ Phase 4: Back to Top Button - 3 tasks, ~1 hour
5. ✅ Phase 5: Responsive Testing & Polish - 6 tasks, ~2 hours
6. ✅ Phase 6: E2E Testing - 6 tasks, ~2 hours

**Files to Create**: 4 files
**Files to Modify**: 5 files
**Total Files**: 9 files

---

## Notes

- **Atomic Commit Rule**: Each task should be committed individually with one push per commit
- **Task Dependencies**: Some tasks depend on previous tasks being completed first
- **Testing**: E2E tests should be written alongside implementation, not all at the end
- **Flexibility**: Estimated times are approximate, actual times may vary
- **Optional Tasks**: Task 2.4 is optional and may be skipped if not needed

---

## Completion Criteria

**Project is complete when**:
- ✅ All 24 tasks completed
- ✅ All 24 E2E tests passing
- ✅ Manual testing completed
- ✅ No regressions in existing functionality
- ✅ Performance acceptable
- ✅ Accessibility requirements met
- ✅ Documentation up to date

**Ready to merge when**:
- ✅ All acceptance criteria met
- ✅ All tests passing
- ✅ Code reviewed
- ✅ No outstanding issues
