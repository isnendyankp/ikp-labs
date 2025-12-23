# Gallery-Centric Navigation - Implementation Checklist

## Status Legend
- [ ] Not started
- [🔄] In progress
- [✅] Completed
- [⏸️] Blocked/Waiting

---

## Phase 1: Planning & Documentation ✅

### Task 1.1: Project Setup
- [✅] Move completed photo-favorites plan to done folder
- [✅] Create new plan folder structure
- [✅] Create README.md
- [✅] Create requirements.md
- [✅] Create technical-design.md
- [✅] Create checklist.md
- [✅] **COMMIT 1**: "docs: add gallery-centric navigation feature plan" (commit: 3cad254)

---

## Phase 2: Route Restructuring

### Task 2.1: Rename /home Route to /myprofile
**Files to Modify:**
- Rename: `frontend/src/app/home/` → `frontend/src/app/myprofile/`

**Steps:**
1. [ ] Rename directory `home` to `myprofile` via git mv
2. [ ] Verify sub-routes still accessible:
   - `/myprofile/liked-photos`
   - `/myprofile/favorited-photos`
3. [ ] Test: Access `/myprofile` in browser
4. [ ] **COMMIT 2**: "refactor(routes): rename /home to /myprofile"

**Acceptance Criteria:**
- [ ] `/myprofile` page loads successfully
- [ ] `/myprofile/liked-photos` works
- [ ] `/myprofile/favorited-photos` works
- [ ] No 404 errors

---

### Task 2.2: Update My Profile Page Content
**Files to Modify:**
- `frontend/src/app/myprofile/page.tsx`

**Changes:**
1. [ ] Add "Back to Gallery" link at top
2. [ ] Simplify page content (remove photo grids if any)
3. [ ] Keep profile info section
4. [ ] Add statistics section (photos uploaded, liked, favorited)
5. [ ] Keep edit profile button
6. [ ] Test: Click "Back to Gallery" navigates to `/gallery`
7. [ ] **COMMIT 3**: "feat(profile): add back to gallery link and simplify layout"

**Acceptance Criteria:**
- [ ] "Back to Gallery" link visible and working
- [ ] Profile info displays correctly
- [ ] Statistics show (can be placeholder values for now)
- [ ] Page layout is clean and simple

---

### Task 2.3: Add Backward Compatibility Redirect
**Files to Create:**
- `frontend/src/middleware.ts` (if doesn't exist)

**Changes:**
1. [ ] Create or update middleware.ts
2. [ ] Add redirect logic: `/home/*` → `/myprofile/*`
3. [ ] Test: Access old URLs redirect correctly
   - `/home` → `/myprofile`
   - `/home/liked-photos` → `/myprofile/liked-photos`
4. [ ] **COMMIT 4**: "feat(middleware): add redirect from /home to /myprofile"

**Acceptance Criteria:**
- [ ] Old `/home` URL redirects to `/myprofile`
- [ ] Sub-routes redirect correctly
- [ ] No bookmarks broken

---

## Phase 3: Root Page Auto-Redirect

### Task 3.1: Implement Root Page Redirect Logic
**Files to Modify:**
- `frontend/src/app/page.tsx`

**Changes:**
1. [ ] Replace default Next.js content
2. [ ] Add client component directive
3. [ ] Import auth utilities
4. [ ] Add useEffect for redirect logic:
   - If authenticated → `/gallery`
   - If not authenticated → `/login`
5. [ ] Add loading state ("Redirecting...")
6. [ ] Test both scenarios:
   - Logged in user visits `/`
   - Logged out user visits `/`
7. [ ] **COMMIT 5**: "feat(root): add auto-redirect based on auth status"

**Acceptance Criteria:**
- [ ] Authenticated users redirect to `/gallery`
- [ ] Unauthenticated users redirect to `/login`
- [ ] No flash of wrong content
- [ ] Smooth redirect experience

---

## Phase 4: Login Redirect Update

### Task 4.1: Update Login Success Redirect
**Files to Modify:**
- `frontend/src/components/LoginForm.tsx`

**Changes:**
1. [ ] Find login success handler
2. [ ] Change redirect from `/home` to `/gallery`
3. [ ] Test: Login redirects to gallery
4. [ ] Verify: Gallery shows default "All Photos" view
5. [ ] **COMMIT 6**: "feat(auth): redirect to gallery after login instead of home"

**Acceptance Criteria:**
- [ ] Login success → redirects to `/gallery`
- [ ] No intermediate redirects
- [ ] User sees photos immediately after login

---

## Phase 5: Filter Dropdown Component

### Task 5.1: Create FilterDropdown Component
**Files to Create:**
- `frontend/src/components/FilterDropdown.tsx`

**Steps:**
1. [ ] Create new component file
2. [ ] Define FilterDropdownProps interface
3. [ ] Define FILTER_OPTIONS constant
4. [ ] Implement dropdown UI:
   - Button with current filter label
   - Dropdown menu (initially hidden)
   - 4 filter options
   - Visual indicator for selected option
5. [ ] Add open/close state management
6. [ ] Add onClick handlers
7. [ ] Style with Tailwind CSS (consistent with app)
8. [ ] Test: Dropdown opens, closes, shows options
9. [ ] **COMMIT 7**: "feat(components): add FilterDropdown component"

**Acceptance Criteria:**
- [ ] Component renders without errors
- [ ] Dropdown opens/closes on button click
- [ ] All 4 options visible
- [ ] Selected option highlighted
- [ ] Clicking option closes dropdown
- [ ] Calls onFilterChange callback

---

### Task 5.2: Add Filter Dropdown Styling & Accessibility
**Files to Modify:**
- `frontend/src/components/FilterDropdown.tsx`

**Steps:**
1. [ ] Add hover states
2. [ ] Add focus states (keyboard navigation)
3. [ ] Add ARIA attributes
4. [ ] Add smooth transitions
5. [ ] Test keyboard navigation (Tab, Enter, Escape)
6. [ ] Test screen reader compatibility (optional)
7. [ ] **COMMIT 8**: "style(filter-dropdown): add accessibility and polish"

**Acceptance Criteria:**
- [ ] Hover states work
- [ ] Keyboard navigable
- [ ] Visually polished
- [ ] Consistent with app design

---

## Phase 6: Gallery Page Refactor

### Task 6.1: Add URL Query Param Management to Gallery
**Files to Modify:**
- `frontend/src/app/gallery/page.tsx`

**Steps:**
1. [ ] Import `useSearchParams`, `useRouter` from next/navigation
2. [ ] Read `filter` query param (default: 'all')
3. [ ] Read `page` query param (default: 1)
4. [ ] Create `handleFilterChange` function
   - Updates URL with new filter
   - Resets to page 1
5. [ ] Create `handlePageChange` function
   - Updates URL with new page
   - Keeps current filter
6. [ ] Test: URL updates when filter changes
7. [ ] **COMMIT 9**: "feat(gallery): add URL query param management"

**Acceptance Criteria:**
- [ ] URL reflects current filter
- [ ] URL reflects current page
- [ ] Browser back/forward works
- [ ] Refresh maintains state

---

### Task 6.2: Integrate FilterDropdown into Gallery
**Files to Modify:**
- `frontend/src/app/gallery/page.tsx`

**Steps:**
1. [ ] Import FilterDropdown component
2. [ ] Add FilterDropdown to page (above photo grid)
3. [ ] Pass `currentFilter` prop from URL param
4. [ ] Pass `handleFilterChange` as `onFilterChange` prop
5. [ ] Remove old "My Photos" / "Public" toggle buttons
6. [ ] Adjust layout (filter left, upload button right)
7. [ ] Test: Filter dropdown renders correctly
8. [ ] **COMMIT 10**: "feat(gallery): integrate filter dropdown and remove old toggles"

**Acceptance Criteria:**
- [ ] FilterDropdown visible above gallery
- [ ] Upload button positioned correctly
- [ ] Old toggle buttons removed
- [ ] Layout looks clean

---

### Task 6.3: Implement Filter-Based Data Fetching
**Files to Modify:**
- `frontend/src/app/gallery/page.tsx`
- `frontend/src/services/api.ts` (if needed)

**Steps:**
1. [ ] Update `useEffect` dependencies (add `filter`, `page`)
2. [ ] Add filter switch logic in data fetching:
   - `all` → fetch public photos
   - `my-photos` → fetch user's photos
   - `liked` → fetch liked photos
   - `favorited` → fetch favorited photos
3. [ ] Verify API functions exist in `api.ts`:
   - `fetchPublicPhotos(page)` ✅ (should exist)
   - `fetchMyPhotos(userId, page)` (verify/create)
   - `fetchLikedPhotos(userId, page)` (verify/create)
   - `fetchFavoritedPhotos(userId, page)` ✅ (should exist)
4. [ ] Implement missing API functions if needed
5. [ ] Test all 4 filters:
   - All Photos shows public photos
   - My Photos shows user's uploads
   - Liked Photos shows liked photos
   - Favorited Photos shows favorited photos
6. [ ] **COMMIT 11**: "feat(gallery): implement filter-based data fetching"

**Acceptance Criteria:**
- [ ] All 4 filters fetch correct data
- [ ] Loading states work
- [ ] Error handling in place
- [ ] Empty states handled

---

### Task 6.4: Test Filter Pagination
**Files to Test:**
- `frontend/src/app/gallery/page.tsx`

**Steps:**
1. [ ] Test pagination with "All Photos" filter
2. [ ] Test pagination with "My Photos" filter
3. [ ] Test pagination with "Liked Photos" filter
4. [ ] Test pagination with "Favorited Photos" filter
5. [ ] Verify: Changing filter resets to page 1
6. [ ] Verify: URL updates correctly for each scenario
7. [ ] Fix any bugs found
8. [ ] **COMMIT 12**: "fix(gallery): ensure pagination works with all filters"

**Acceptance Criteria:**
- [ ] Pagination works for all filters
- [ ] Page numbers update correctly
- [ ] Total pages calculated correctly
- [ ] No off-by-one errors

---

## Phase 7: Navigation Updates

### Task 7.1: Update Navbar Component
**Files to Modify:**
- Identify navbar component file (likely `frontend/src/components/Navbar.tsx` or similar)

**Steps:**
1. [ ] Locate navbar/navigation component
2. [ ] Remove "Home" link (if exists)
3. [ ] Update or add "My Profile" link → `/myprofile`
4. [ ] Ensure "Logout" button exists
5. [ ] Update any hardcoded `/home` references to `/myprofile`
6. [ ] Test: Navigation links work from any page
7. [ ] **COMMIT 13**: "feat(navbar): update navigation links for new structure"

**Acceptance Criteria:**
- [ ] "My Profile" link navigates to `/myprofile`
- [ ] "Logout" button works
- [ ] No broken links
- [ ] Navbar consistent across pages

---

### Task 7.2: Update All Internal Navigation Links
**Files to Search:**
- All components and pages with navigation

**Steps:**
1. [ ] Search codebase for hardcoded `/home` links
2. [ ] Update all instances to `/myprofile`
3. [ ] Check for any conditional navigation logic
4. [ ] Test: All links work correctly
5. [ ] **COMMIT 14**: "refactor(nav): update all internal links from /home to /myprofile"

**Acceptance Criteria:**
- [ ] No more `/home` references in code (except middleware)
- [ ] All navigation works
- [ ] No console warnings/errors

---

## Phase 8: API Service Layer

### Task 8.1: Verify/Add API Functions for Filters
**Files to Modify:**
- `frontend/src/services/api.ts`

**Steps:**
1. [ ] Check if `fetchMyPhotos(userId, page)` exists
   - If not, implement it
2. [ ] Check if `fetchLikedPhotos(userId, page)` exists
   - If not, implement it (may need backend endpoint verification)
3. [ ] Check if `fetchFavoritedPhotos(userId, page)` exists
   - Should exist from previous feature
4. [ ] Add proper error handling to all functions
5. [ ] Add JSDoc comments
6. [ ] Test each function independently
7. [ ] **COMMIT 15**: "feat(api): add/verify API functions for gallery filters"

**Acceptance Criteria:**
- [ ] All required API functions exist
- [ ] Functions handle errors gracefully
- [ ] Functions return consistent data structure
- [ ] Type definitions added (if using TypeScript)

---

## Phase 9: Testing & Validation

### Task 9.1: Manual Testing - Authentication Flow
**Test Cases:**
1. [ ] Visit `/` while logged out → redirects to `/login`
2. [ ] Login successfully → redirects to `/gallery`
3. [ ] Visit `/` while logged in → redirects to `/gallery`
4. [ ] Logout from gallery → redirects to `/login`
5. [ ] Visit `/myprofile` while logged out → redirects to `/login`
6. [ ] **COMMIT 16** (if fixes needed): "fix(auth): resolve authentication redirect issues"

**Acceptance Criteria:**
- [ ] All auth redirects work correctly
- [ ] No infinite redirect loops
- [ ] Token validation works

---

### Task 9.2: Manual Testing - Filter Functionality
**Test Cases:**
1. [ ] Default filter is "All Photos"
2. [ ] Switch to "My Photos" → shows only user's uploads
3. [ ] Switch to "Liked Photos" → shows liked photos
4. [ ] Switch to "Favorited Photos" → shows favorited photos
5. [ ] Each filter shows correct count
6. [ ] Empty states handled (e.g., no liked photos yet)
7. [ ] **COMMIT 17** (if fixes needed): "fix(filters): resolve filter data and UI issues"

**Acceptance Criteria:**
- [ ] All filters show correct data
- [ ] No filter shows wrong photos
- [ ] Empty states are user-friendly

---

### Task 9.3: Manual Testing - URL & Navigation
**Test Cases:**
1. [ ] URL updates when filter changes
2. [ ] URL updates when page changes
3. [ ] Direct URL access works: `/gallery?filter=liked&page=2`
4. [ ] Browser back button works correctly
5. [ ] Browser forward button works correctly
6. [ ] Page refresh maintains filter state
7. [ ] Invalid filter param defaults to "all"
8. [ ] Invalid page param defaults to 1
9. [ ] **COMMIT 18** (if fixes needed): "fix(navigation): resolve URL state and browser navigation issues"

**Acceptance Criteria:**
- [ ] URL always reflects current state
- [ ] Browser navigation works intuitively
- [ ] Invalid params handled gracefully

---

### Task 9.4: Manual Testing - Pagination
**Test Cases:**
1. [ ] Pagination shows on "All Photos" filter (if > 12 photos)
2. [ ] Pagination works on "My Photos" filter
3. [ ] Pagination works on "Liked Photos" filter
4. [ ] Pagination works on "Favorited Photos" filter
5. [ ] Changing filter resets to page 1
6. [ ] Next/Previous buttons work correctly
7. [ ] First/Last page buttons work (if implemented)
8. [ ] **COMMIT 19** (if fixes needed): "fix(pagination): resolve pagination issues across filters"

**Acceptance Criteria:**
- [ ] Pagination works for all filters
- [ ] No off-by-one errors
- [ ] Edge cases handled (first page, last page)

---

### Task 9.5: Cross-Browser Testing
**Test Browsers:**
1. [ ] Chrome (latest)
2. [ ] Firefox (latest)
3. [ ] Safari (latest)
4. [ ] Edge (latest)
5. [ ] Mobile Chrome (iOS/Android)
6. [ ] Mobile Safari (iOS)
7. [ ] **COMMIT 20** (if fixes needed): "fix(compat): resolve browser compatibility issues"

**Acceptance Criteria:**
- [ ] Works on all major browsers
- [ ] No visual glitches
- [ ] No JavaScript errors

---

### Task 9.6: Responsive Design Testing
**Test Breakpoints:**
1. [ ] Mobile (320px - 767px)
   - FilterDropdown usable
   - Gallery grid adapts
   - Navbar works
2. [ ] Tablet (768px - 1023px)
3. [ ] Desktop (1024px+)
4. [ ] **COMMIT 21** (if fixes needed): "fix(responsive): improve mobile/tablet layouts"

**Acceptance Criteria:**
- [ ] Responsive on all screen sizes
- [ ] No horizontal scroll
- [ ] Touch targets adequate on mobile

---

## Phase 10: Polish & Documentation

### Task 10.1: Add Loading & Empty States
**Files to Modify:**
- `frontend/src/app/gallery/page.tsx`

**Steps:**
1. [ ] Add loading spinner during data fetch
2. [ ] Add empty state for each filter:
   - "No public photos yet"
   - "You haven't uploaded any photos. Upload now!"
   - "You haven't liked any photos yet. Explore the gallery!"
   - "You haven't favorited any photos yet."
3. [ ] Add error state for API failures
4. [ ] Test all states
5. [ ] **COMMIT 22**: "feat(ux): add loading, empty, and error states"

**Acceptance Criteria:**
- [ ] Loading states visible during fetch
- [ ] Empty states user-friendly and actionable
- [ ] Error states helpful

---

### Task 10.2: Code Cleanup & Refactoring
**Files to Review:**
- All modified files

**Steps:**
1. [ ] Remove commented-out code
2. [ ] Remove console.logs (except intentional ones)
3. [ ] Fix linting warnings
4. [ ] Add missing TypeScript types
5. [ ] Improve variable names if needed
6. [ ] Add code comments for complex logic
7. [ ] **COMMIT 23**: "refactor: code cleanup and type improvements"

**Acceptance Criteria:**
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] Code is readable

---

### Task 10.3: Update README (if needed)
**Files to Modify:**
- `frontend/README.md` or root `README.md`

**Steps:**
1. [ ] Update navigation structure documentation
2. [ ] Update screenshots (if any)
3. [ ] Update feature list
4. [ ] Add note about gallery-centric design
5. [ ] **COMMIT 24**: "docs: update README with new navigation structure"

**Acceptance Criteria:**
- [ ] Documentation reflects current state
- [ ] Easy for new developers to understand

---

## Phase 11: Final Testing & Deployment Prep

### Task 11.1: End-to-End User Journey Test
**Complete User Flow:**
1. [ ] User opens app (/) → auto-redirects
2. [ ] User logs in → lands on gallery (all photos)
3. [ ] User clicks filter → switches to "My Photos"
4. [ ] User navigates to page 2 of my photos
5. [ ] User clicks "Upload Photo" → uploads photo
6. [ ] User returns to gallery → sees new photo in "My Photos"
7. [ ] User clicks "My Profile" → views profile
8. [ ] User clicks "Back to Gallery" → returns to gallery (maintains filter)
9. [ ] User logs out → redirects to login
10. [ ] **COMMIT 25** (if fixes needed): "fix: resolve end-to-end user flow issues"

**Acceptance Criteria:**
- [ ] Complete flow works without errors
- [ ] Smooth transitions between pages
- [ ] No unexpected redirects

---

### Task 11.2: Performance Check
**Metrics to Check:**
1. [ ] Root redirect time < 100ms
2. [ ] Filter switch time < 300ms
3. [ ] Initial gallery load < 2s
4. [ ] Subsequent loads < 500ms
5. [ ] No unnecessary re-renders
6. [ ] **COMMIT 26** (if optimizations needed): "perf: optimize filter switching and data fetching"

**Acceptance Criteria:**
- [ ] Meets performance targets
- [ ] No performance regressions

---

### Task 11.3: Accessibility Audit
**Checks:**
1. [ ] Keyboard navigation works
2. [ ] Screen reader friendly (basic check)
3. [ ] Proper heading hierarchy
4. [ ] Alt text on images
5. [ ] Color contrast sufficient
6. [ ] **COMMIT 27** (if fixes needed): "a11y: improve accessibility"

**Acceptance Criteria:**
- [ ] Basic accessibility requirements met
- [ ] No major a11y violations

---

## Phase 12: Deployment

### Task 12.1: Pre-Deployment Checklist
**Verify:**
1. [ ] All tests passing
2. [ ] No console errors in production build
3. [ ] Build succeeds (`npm run build`)
4. [ ] Environment variables set correctly
5. [ ] No secrets in code
6. [ ] All commits pushed to remote

---

### Task 12.2: Create Final Summary Commit (if needed)
**If there are any final tweaks:**
1. [ ] Group any remaining minor fixes
2. [ ] **COMMIT 28**: "chore: final polish before feature completion"

---

### Task 12.3: Mark Plan as Complete
**Steps:**
1. [ ] Update checklist.md (mark all tasks complete)
2. [ ] Update README.md status to "Completed"
3. [ ] Move plan folder to `plans/done/`
4. [ ] **COMMIT 29**: "docs: mark gallery-centric navigation as complete"

---

## Atomic Commit Summary

**Expected Commits (~25-30):**
1. docs: add gallery-centric navigation feature plan
2. refactor(routes): rename /home to /myprofile
3. feat(profile): add back to gallery link and simplify layout
4. feat(middleware): add redirect from /home to /myprofile
5. feat(root): add auto-redirect based on auth status
6. feat(auth): redirect to gallery after login instead of home
7. feat(components): add FilterDropdown component
8. style(filter-dropdown): add accessibility and polish
9. feat(gallery): add URL query param management
10. feat(gallery): integrate filter dropdown and remove old toggles
11. feat(gallery): implement filter-based data fetching
12. fix(gallery): ensure pagination works with all filters
13. feat(navbar): update navigation links for new structure
14. refactor(nav): update all internal links from /home to /myprofile
15. feat(api): add/verify API functions for gallery filters
16-21. fix: (various bug fixes discovered during testing)
22. feat(ux): add loading, empty, and error states
23. refactor: code cleanup and type improvements
24. docs: update README with new navigation structure
25-27. fix/perf/a11y: (final optimizations)
28-29. chore/docs: (completion tasks)

---

## Notes

- **Atomic Commits**: Each task = 1 commit for easy rollback and clear history
- **Testing**: Test after each major change before committing
- **Flexibility**: If tasks need to be split/merged, update this checklist
- **Communication**: Each commit will be explained to user as if explaining to a beginner

---

**Checklist Version**: 1.0
**Last Updated**: December 22, 2024
**Status**: Ready to Execute
