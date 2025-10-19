# Implementation Checklist: Frontend Authentication Flow with Home Page

## Day 1: Foundation (3 commits)

### Commit 1: Create AuthContext with state management

**File:** `frontend/src/contexts/AuthContext.tsx`

- [ ] Create contexts directory if it doesn't exist
- [ ] Create AuthContext.tsx file
- [ ] Define AuthContextType interface with all required properties
  - [ ] isAuthenticated: boolean
  - [ ] user: AuthUser | null
  - [ ] loading: boolean
  - [ ] error: string | null
  - [ ] login: (email: string, fullName: string, userId: number) => void
  - [ ] logout: () => void
  - [ ] checkAuth: () => Promise<void>
- [ ] Create AuthProvider component
- [ ] Implement state management with useState hooks
  - [ ] isAuthenticated state
  - [ ] user state
  - [ ] loading state
  - [ ] error state
- [ ] Implement login function
  - [ ] Update isAuthenticated to true
  - [ ] Set user data
  - [ ] Clear error
- [ ] Implement logout function
  - [ ] Call logoutUser() from API service
  - [ ] Clear user state
  - [ ] Set isAuthenticated to false
  - [ ] Redirect to /login using useRouter
- [ ] Implement checkAuth function
  - [ ] Get token from localStorage using getAuthToken()
  - [ ] If no token, set isAuthenticated to false
  - [ ] If token exists, fetch user profile via getUserProfile()
  - [ ] Handle successful response (set user data, isAuthenticated = true)
  - [ ] Handle error response (remove token, isAuthenticated = false)
- [ ] Add useEffect hook to check auth on mount
  - [ ] Call checkAuth() on component mount
  - [ ] Set loading to false after check completes
- [ ] Create useAuth custom hook for easy context consumption
- [ ] Export AuthProvider and useAuth
- [ ] Add TypeScript types for all props and state
- [ ] Add error boundaries (optional, for production)
- [ ] Test context in isolation (manual)

**Commit Message:**
```
feat: create authentication context provider

Implement global authentication state management using React Context API.
Includes login, logout, and checkAuth functions with token persistence.

- Add AuthContext with state management
- Implement login/logout functions
- Add token validation via getUserProfile API
- Auto-check authentication on app initialization
- Export useAuth hook for component consumption

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Commit 2: Create HomePage component with user display

**File:** `frontend/src/components/HomePage.tsx`

- [ ] Create HomePage.tsx in components directory
- [ ] Add 'use client' directive at top of file
- [ ] Import required dependencies
  - [ ] Import React and hooks (useState, useEffect)
  - [ ] Import useAuth from AuthContext
  - [ ] Import useRouter from next/navigation
- [ ] Create HomePage component function
- [ ] Use useAuth hook to get auth state
  - [ ] Destructure: user, isAuthenticated, logout, loading, error
- [ ] Add useEffect for authentication check
  - [ ] If not authenticated, redirect to /login
  - [ ] Use router.replace() to prevent back button issues
- [ ] Implement loading state UI
  - [ ] Show spinner or skeleton while loading
  - [ ] Center spinner on page
- [ ] Implement error state UI
  - [ ] Show error message if error exists
  - [ ] Provide retry button (optional)
- [ ] Implement authenticated state UI
  - [ ] Welcome message with user's fullName
  - [ ] Display user's email
  - [ ] Display login time (if available from user data)
  - [ ] Display user ID (optional, for debugging)
- [ ] Add logout button
  - [ ] Button triggers logout function from context
  - [ ] Add confirmation dialog (optional)
  - [ ] Show loading state while logging out
- [ ] Style the component with Tailwind CSS
  - [ ] Use clean, modern design
  - [ ] Ensure responsive layout
  - [ ] Match design of login/register pages
- [ ] Add proper TypeScript types
- [ ] Export HomePage component as default
- [ ] Test component manually with different auth states

**Commit Message:**
```
feat: create home page component with user profile display

Build protected home page that displays authenticated user information
and provides logout functionality.

- Add HomePage component with user profile display
- Show welcome message with user's full name
- Display email and login information
- Add logout button with context integration
- Implement loading and error states
- Style with Tailwind CSS

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Commit 3: Create /home page route

**File:** `frontend/src/app/home/page.tsx`

- [ ] Create home directory under frontend/src/app
- [ ] Create page.tsx file in home directory
- [ ] Import HomePage component from components
- [ ] Create default export function for the route
- [ ] Return HomePage component
- [ ] Keep route simple (no additional logic in page.tsx)
- [ ] Add TypeScript types if needed
- [ ] Test route by navigating to http://localhost:3001/home
- [ ] Verify HomePage component renders correctly
- [ ] Check that authentication redirect works (should redirect to /login if not authenticated)

**Commit Message:**
```
feat: add /home page route

Create protected home page route using Next.js App Router.

- Add /home route with page.tsx
- Import and render HomePage component
- Route serves as entry point for authenticated users

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Day 2: Integration (3 commits)

### Commit 4: Update LoginForm to use AuthContext and redirect to /home

**File:** `frontend/src/components/LoginForm.tsx`

- [ ] Import useAuth hook from AuthContext
- [ ] Add useAuth to component (destructure login function)
- [ ] Locate successful login block (after response.data?.success check)
- [ ] Remove old redirect to /register (line 89)
- [ ] Add call to context.login() with user data
  - [ ] Pass response.data.email
  - [ ] Pass response.data.fullName
  - [ ] Pass response.data.userId
- [ ] Add redirect to /home using router.push('/home')
- [ ] Verify token is still saved by API service (don't remove that)
- [ ] Keep existing error handling unchanged
- [ ] Keep existing form validation unchanged
- [ ] Test login flow manually
  - [ ] Login with valid credentials
  - [ ] Verify redirect to /home
  - [ ] Check localStorage for authToken
  - [ ] Verify home page shows correct user data
- [ ] Test error cases
  - [ ] Invalid credentials show error
  - [ ] Network error shows error
  - [ ] Form validation still works

**Commit Message:**
```
feat: integrate login form with auth context and home redirect

Update login flow to use authentication context and redirect to /home
after successful authentication.

- Add AuthContext integration to LoginForm
- Call context.login() after successful API response
- Redirect to /home instead of /register
- Maintain existing token storage in API service
- Keep all existing error handling and validation

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Commit 5: Update RegistrationForm to use AuthContext and redirect to /home

**File:** `frontend/src/components/RegistrationForm.tsx`

- [ ] Read current RegistrationForm.tsx file first
- [ ] Import useAuth hook from AuthContext
- [ ] Add useAuth to component (destructure login function)
- [ ] Locate successful registration block (after response.data?.success check)
- [ ] Find existing redirect (likely to /login)
- [ ] Remove old redirect
- [ ] Add call to context.login() with user data
  - [ ] Pass response.data.email
  - [ ] Pass response.data.fullName
  - [ ] Pass response.data.userId
- [ ] Add redirect to /home using router.push('/home')
- [ ] Verify token is still saved by API service
- [ ] Keep existing error handling unchanged
- [ ] Keep existing form validation unchanged
- [ ] Test registration flow manually
  - [ ] Register with valid data
  - [ ] Verify redirect to /home
  - [ ] Check localStorage for authToken
  - [ ] Verify home page shows correct user data
- [ ] Test error cases
  - [ ] Duplicate email shows error
  - [ ] Invalid data shows validation errors
  - [ ] Network error shows error

**Commit Message:**
```
feat: integrate registration form with auth context and home redirect

Update registration flow to use authentication context and redirect to
/home after successful registration.

- Add AuthContext integration to RegistrationForm
- Call context.login() after successful API response
- Redirect to /home instead of /login
- Maintain existing token storage in API service
- Keep all existing error handling and validation

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Commit 6: Implement route guards and redirects for all pages

**Files to Modify:**
- `frontend/src/app/layout.tsx` - Add AuthProvider wrapper
- `frontend/src/app/page.tsx` - Add redirect logic for root
- `frontend/src/app/login/page.tsx` - Add redirect for authenticated users
- `frontend/src/app/register/page.tsx` - Add redirect for authenticated users

#### File 1: layout.tsx

- [ ] Read current layout.tsx file
- [ ] Import AuthProvider from contexts/AuthContext
- [ ] Wrap {children} with <AuthProvider>
- [ ] Ensure proper nesting with other providers (if any)
- [ ] Test that context is available throughout app

#### File 2: page.tsx (root)

- [ ] Read current root page.tsx file
- [ ] Add 'use client' directive if not present
- [ ] Import useAuth and useRouter
- [ ] Add useAuth hook to get isAuthenticated state
- [ ] Add useEffect hook for redirect logic
  - [ ] If isAuthenticated, redirect to /home
  - [ ] Use router.replace() to prevent back button navigation
- [ ] Keep existing page content for unauthenticated users
- [ ] Consider showing loading state during auth check

#### File 3: login/page.tsx

- [ ] Read current login page.tsx file
- [ ] Check if it's a client component (has 'use client')
- [ ] If server component, create wrapper client component
- [ ] Import useAuth and useRouter
- [ ] Add useAuth hook to get isAuthenticated state
- [ ] Add useEffect hook for redirect logic
  - [ ] If isAuthenticated, redirect to /home
  - [ ] Use router.replace() to prevent back button navigation
- [ ] Render LoginForm only if not authenticated or during check
- [ ] Test redirect by accessing /login while authenticated

#### File 4: register/page.tsx

- [ ] Read current register page.tsx file
- [ ] Check if it's a client component (has 'use client')
- [ ] If server component, create wrapper client component
- [ ] Import useAuth and useRouter
- [ ] Add useAuth hook to get isAuthenticated state
- [ ] Add useEffect hook for redirect logic
  - [ ] If isAuthenticated, redirect to /home
  - [ ] Use router.replace() to prevent back button navigation
- [ ] Render RegistrationForm only if not authenticated or during check
- [ ] Test redirect by accessing /register while authenticated

**Testing Checklist:**
- [ ] Test root page redirect when authenticated
- [ ] Test login page redirect when authenticated
- [ ] Test register page redirect when authenticated
- [ ] Test all pages render correctly when not authenticated
- [ ] Test that home page redirects to login when not authenticated
- [ ] Test navigation flow: login → home → logout → login
- [ ] Test page refresh on each route maintains correct state

**Commit Message:**
```
feat: implement route guards and authentication redirects

Add route protection to all pages, redirecting based on authentication
status. Wrap app in AuthProvider for global state access.

- Add AuthProvider wrapper to app layout
- Redirect authenticated users from /login to /home
- Redirect authenticated users from /register to /home
- Redirect authenticated users from / to /home
- Use router.replace() to prevent back button issues
- Ensure smooth navigation between protected and public routes

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Day 3: Testing & Polish (3 commits)

### Commit 7: Add Gherkin specifications for authentication flows

**Files to Create:**
- `specs/authentication/authentication-flow.feature`
- `specs/authentication/route-protection.feature`

#### File 1: authentication-flow.feature

- [ ] Create file in specs/authentication directory
- [ ] Add feature description for authentication flow
- [ ] Write scenario: Login and redirect to home
  - [ ] Given user is on login page
  - [ ] When user submits valid credentials
  - [ ] Then user is redirected to /home
  - [ ] And user info is displayed
  - [ ] And token is in localStorage
- [ ] Write scenario: Registration and redirect to home
  - [ ] Given user is on registration page
  - [ ] When user submits valid registration data
  - [ ] Then user is redirected to /home
  - [ ] And user info is displayed
  - [ ] And token is in localStorage
- [ ] Write scenario: Logout and redirect to login
  - [ ] Given user is authenticated and on home page
  - [ ] When user clicks logout button
  - [ ] Then token is removed from localStorage
  - [ ] And user is redirected to /login
  - [ ] And user is no longer authenticated
- [ ] Write scenario: Token persistence on page refresh
  - [ ] Given user is authenticated and on home page
  - [ ] When user refreshes the page
  - [ ] Then user remains on home page
  - [ ] And user info is still displayed
  - [ ] And user remains authenticated

#### File 2: route-protection.feature

- [ ] Create file in specs/authentication directory
- [ ] Add feature description for route protection
- [ ] Write scenario: Unauthenticated access to /home
  - [ ] Given user is not authenticated
  - [ ] When user navigates to /home
  - [ ] Then user is redirected to /login
- [ ] Write scenario: Authenticated access to /login
  - [ ] Given user is authenticated
  - [ ] When user navigates to /login
  - [ ] Then user is redirected to /home
- [ ] Write scenario: Authenticated access to /register
  - [ ] Given user is authenticated
  - [ ] When user navigates to /register
  - [ ] Then user is redirected to /home
- [ ] Write scenario: Authenticated access to root
  - [ ] Given user is authenticated
  - [ ] When user navigates to /
  - [ ] Then user is redirected to /home
- [ ] Write scenario: Invalid token redirects to login
  - [ ] Given user has invalid token in localStorage
  - [ ] When user navigates to /home
  - [ ] Then token is removed from localStorage
  - [ ] And user is redirected to /login

**Commit Message:**
```
docs: add gherkin specifications for authentication flows

Create behavior specifications documenting authentication and route
protection flows using Gherkin syntax.

- Add authentication-flow.feature with login, registration, logout specs
- Add route-protection.feature with route guard scenarios
- Document token persistence behavior
- Document redirect logic for all routes
- Cover edge cases (invalid token, refresh, etc.)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Commit 8: Create Playwright E2E tests for authentication and route protection

**Files to Create:**
- `tests/e2e/authentication-flow.spec.ts`
- `tests/e2e/route-protection.spec.ts`

#### File 1: authentication-flow.spec.ts

- [ ] Create file in tests/e2e directory
- [ ] Import Playwright test and expect
- [ ] Import page URLs as constants
- [ ] Create test.describe block: 'Authentication Flow'
- [ ] Add beforeEach hook to clear localStorage
- [ ] Test: 'should login and redirect to home page'
  - [ ] Navigate to /login
  - [ ] Fill email input
  - [ ] Fill password input
  - [ ] Click submit button
  - [ ] Wait for navigation to /home
  - [ ] Assert URL is /home
  - [ ] Assert welcome message contains user's name
  - [ ] Assert email is displayed
  - [ ] Check localStorage for authToken
- [ ] Test: 'should register and redirect to home page'
  - [ ] Navigate to /register
  - [ ] Fill fullName input
  - [ ] Fill email input
  - [ ] Fill password input
  - [ ] Fill confirmPassword input
  - [ ] Click submit button
  - [ ] Wait for navigation to /home
  - [ ] Assert URL is /home
  - [ ] Assert welcome message contains user's name
  - [ ] Check localStorage for authToken
- [ ] Test: 'should logout and redirect to login page'
  - [ ] Login first (helper function or beforeEach)
  - [ ] Navigate to /home
  - [ ] Click logout button
  - [ ] Wait for navigation to /login
  - [ ] Assert URL is /login
  - [ ] Check localStorage authToken is removed
- [ ] Test: 'should persist authentication on page refresh'
  - [ ] Login first
  - [ ] Navigate to /home
  - [ ] Refresh page
  - [ ] Assert URL is still /home
  - [ ] Assert user info still displayed
  - [ ] Check localStorage still has authToken
- [ ] Add helper function: loginUser(email, password)
- [ ] Add helper function: registerUser(fullName, email, password)
- [ ] Add helper function: checkAuthToken(page)

#### File 2: route-protection.spec.ts

- [ ] Create file in tests/e2e directory
- [ ] Import Playwright test and expect
- [ ] Create test.describe block: 'Route Protection'
- [ ] Add beforeEach hook to clear localStorage
- [ ] Test: 'should redirect unauthenticated user from /home to /login'
  - [ ] Ensure no token in localStorage
  - [ ] Navigate to /home
  - [ ] Wait for redirect
  - [ ] Assert URL is /login
- [ ] Test: 'should redirect authenticated user from /login to /home'
  - [ ] Login first
  - [ ] Navigate to /login
  - [ ] Wait for redirect
  - [ ] Assert URL is /home
- [ ] Test: 'should redirect authenticated user from /register to /home'
  - [ ] Login first
  - [ ] Navigate to /register
  - [ ] Wait for redirect
  - [ ] Assert URL is /home
- [ ] Test: 'should redirect authenticated user from / to /home'
  - [ ] Login first
  - [ ] Navigate to /
  - [ ] Wait for redirect
  - [ ] Assert URL is /home
- [ ] Test: 'should handle invalid token gracefully'
  - [ ] Set invalid token in localStorage
  - [ ] Navigate to /home
  - [ ] Wait for API call to fail
  - [ ] Assert token removed from localStorage
  - [ ] Assert redirected to /login
- [ ] Add helper function: setAuthToken(page, token)
- [ ] Add helper function: clearAuthToken(page)

**Commit Message:**
```
test: add e2e tests for authentication flow and route protection

Implement comprehensive Playwright E2E tests covering authentication
flows, route guards, and token persistence.

- Add authentication-flow.spec.ts with login/register/logout tests
- Add route-protection.spec.ts with route guard tests
- Test token persistence across page refreshes
- Test invalid token handling
- Test all redirect scenarios
- Add helper functions for common test operations

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

### Commit 9: Create Playwright API tests for auth endpoints

**File:** `tests/api/auth-endpoints.api.spec.ts`

- [ ] Create file in tests/api directory
- [ ] Import Playwright test, expect, and request
- [ ] Define API base URL constant (http://localhost:8081)
- [ ] Create test.describe block: 'Authentication API Endpoints'
- [ ] Add beforeAll hook to create API request context
- [ ] Test: 'POST /api/auth/login - successful login'
  - [ ] Send POST to /api/auth/login with valid credentials
  - [ ] Assert status 200
  - [ ] Assert response has success: true
  - [ ] Assert response has token
  - [ ] Assert response has userId, email, fullName
  - [ ] Validate token format (JWT)
- [ ] Test: 'POST /api/auth/login - invalid credentials'
  - [ ] Send POST with invalid password
  - [ ] Assert status 401
  - [ ] Assert error message present
- [ ] Test: 'POST /api/auth/login - missing fields'
  - [ ] Send POST with missing email
  - [ ] Assert status 400
  - [ ] Assert validation error message
- [ ] Test: 'POST /api/auth/register - successful registration'
  - [ ] Generate unique email (timestamp-based)
  - [ ] Send POST to /api/auth/register with valid data
  - [ ] Assert status 200
  - [ ] Assert response has success: true
  - [ ] Assert response has token
  - [ ] Assert response has userId, email, fullName
- [ ] Test: 'POST /api/auth/register - duplicate email'
  - [ ] Register user first
  - [ ] Try to register again with same email
  - [ ] Assert status 400
  - [ ] Assert error message about duplicate email
- [ ] Test: 'POST /api/auth/register - invalid data'
  - [ ] Send POST with invalid email format
  - [ ] Assert status 400
  - [ ] Assert validation error
- [ ] Test: 'GET /api/users/{id} - with valid token'
  - [ ] Login/register to get token
  - [ ] Send GET to /api/users/{userId} with Bearer token
  - [ ] Assert status 200
  - [ ] Assert user data returned
  - [ ] Assert email, fullName, id match
- [ ] Test: 'GET /api/users/{id} - without token'
  - [ ] Send GET without Authorization header
  - [ ] Assert status 401
  - [ ] Assert error message
- [ ] Test: 'GET /api/users/{id} - with invalid token'
  - [ ] Send GET with invalid Bearer token
  - [ ] Assert status 401
  - [ ] Assert error message
- [ ] Add helper function: generateUniqueEmail()
- [ ] Add helper function: loginAndGetToken(apiContext, email, password)
- [ ] Add helper function: registerAndGetToken(apiContext, userData)

**Commit Message:**
```
test: add api tests for authentication endpoints

Implement Playwright API tests for all authentication endpoints with
comprehensive coverage of success and error scenarios.

- Test POST /api/auth/login (success, invalid, missing fields)
- Test POST /api/auth/register (success, duplicate, invalid)
- Test GET /api/users/{id} (valid token, no token, invalid token)
- Use real HTTP requests (no mocking)
- Add helper functions for token management
- Cover all edge cases and error scenarios

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Post-Implementation Validation

### Manual Testing Checklist

- [ ] Start backend server (port 8081)
- [ ] Start frontend server (port 3001)
- [ ] Clear browser localStorage
- [ ] Test full authentication flow:
  - [ ] Register new user → redirects to /home
  - [ ] Verify user info displayed on /home
  - [ ] Refresh page → still on /home with user info
  - [ ] Logout → redirects to /login
  - [ ] Login with registered user → redirects to /home
  - [ ] Try to access /login while authenticated → redirects to /home
  - [ ] Try to access /register while authenticated → redirects to /home
  - [ ] Logout again
  - [ ] Try to access /home while not authenticated → redirects to /login
- [ ] Check browser DevTools:
  - [ ] Application tab → localStorage → verify authToken present when logged in
  - [ ] Application tab → localStorage → verify authToken removed on logout
  - [ ] Console tab → no errors during normal flow
  - [ ] Network tab → verify API calls are made correctly
- [ ] Test error scenarios:
  - [ ] Login with wrong password → shows error, stays on /login
  - [ ] Manually edit token in localStorage to invalid value
  - [ ] Navigate to /home → token removed, redirected to /login

### Automated Testing Checklist

- [ ] Run all E2E tests: `npm run test:e2e`
  - [ ] All authentication-flow tests pass
  - [ ] All route-protection tests pass
- [ ] Run all API tests: `npm run test:e2e tests/api/`
  - [ ] All auth-endpoints tests pass
- [ ] Check test coverage:
  - [ ] Login flow covered
  - [ ] Registration flow covered
  - [ ] Logout flow covered
  - [ ] All redirect scenarios covered
  - [ ] Token persistence covered
  - [ ] Invalid token handling covered

### Code Quality Checklist

- [ ] Run ESLint: `npm run lint`
  - [ ] No errors
  - [ ] No warnings (or justified warnings)
- [ ] Run TypeScript check: `npx tsc --noEmit`
  - [ ] No type errors
  - [ ] All components properly typed
- [ ] Review code for:
  - [ ] Consistent naming conventions
  - [ ] Proper error handling
  - [ ] Clear comments where needed
  - [ ] No console.log in production code
  - [ ] No hardcoded credentials or tokens

### Documentation Checklist

- [ ] Update API endpoints reference (if needed)
  - [ ] Document token storage location (localStorage)
  - [ ] Document authentication flow
- [ ] Create how-to guide: "Setting up Authentication"
  - [ ] How to protect a new route
  - [ ] How to access user data in components
  - [ ] How to handle authentication in forms
- [ ] Update getting started tutorial
  - [ ] Add authentication setup steps
  - [ ] Add example of protected route
- [ ] Create explanation doc: "Authentication Architecture"
  - [ ] Explain AuthContext design
  - [ ] Explain token flow
  - [ ] Explain route protection strategy
  - [ ] Diagram the authentication flow

### Browser Compatibility Testing (Optional)

- [ ] Test in Chrome (primary)
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in Edge
- [ ] Verify localStorage works in all browsers
- [ ] Verify redirects work in all browsers

### Performance Testing (Optional)

- [ ] Check page load times with authentication
- [ ] Verify no unnecessary re-renders
- [ ] Check bundle size impact
- [ ] Test with slow network (DevTools throttling)

## Success Criteria

All checklist items must be completed for the implementation to be considered done:

- [ ] All 9 commits completed and pushed
- [ ] All manual tests pass
- [ ] All automated tests pass (E2E and API)
- [ ] No linting or TypeScript errors
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] Feature works as specified in requirements

## Notes

- Follow the commit order strictly (Day 1 → Day 2 → Day 3)
- Each commit should be file-by-file (one logical change per commit)
- Test after each commit to catch issues early
- Don't skip manual testing even if automated tests pass
- Keep commits small and focused for easy review and rollback if needed
