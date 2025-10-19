# Requirements: Frontend Authentication Flow with Home Page

## Scope Definition

### What IS Included

This implementation includes the following features and deliverables:

**1. Protected Home Page (/home)**
- Home page route at /home (NOT /dashboard)
- User profile display with fullName, email, and login time
- Welcome message personalized with user's name
- Logout button with confirmation
- Protected route that requires authentication

**2. Authentication Context**
- React Context API for global auth state management
- State tracking: isAuthenticated, user data, loading, error
- Functions: login, logout, checkAuth
- Token persistence check on mount
- User data fetching on authentication

**3. Route Protection & Redirects**
- Redirect unauthenticated users from /home to /login
- Redirect authenticated users from /login to /home
- Redirect authenticated users from /register to /home
- Redirect authenticated users from / (root) to /home
- Check authentication status before rendering protected routes

**4. Logout Functionality**
- Logout button on home page
- Token removal from localStorage
- Auth context state reset
- Redirect to /login after logout
- Optional logout confirmation dialog

**5. Login Flow Integration**
- Update LoginForm to redirect to /home after successful login
- Remove placeholder redirect to /register
- Store token in localStorage (already implemented in api.ts)
- Trigger auth context update after login

**6. Registration Flow Integration**
- Update RegistrationForm to redirect to /home after successful registration
- Remove placeholder redirect to /login
- Store token in localStorage (already implemented in api.ts)
- Trigger auth context update after registration

**7. Token Persistence**
- Check for existing token on app initialization
- Validate token by fetching user profile
- Auto-login if valid token exists
- Clear invalid tokens

**8. User Profile Display**
- Display user's full name
- Display user's email
- Display login/registration time
- Display user ID (optional, for debugging)

**9. Testing Coverage**
- Gherkin specifications for authentication flows
- Playwright E2E tests for protected routes
- Playwright E2E tests for redirects
- Playwright API tests for authentication endpoints
- Manual testing checklist

**10. Documentation**
- Update API endpoints reference (if needed)
- Create how-to guide for authentication flow
- Update getting started tutorial with authentication
- Add explanation doc for authentication architecture

### What is NOT Included

This implementation explicitly excludes:

**1. Dashboard Page**
- No /dashboard route (using /home instead)
- No dashboard components or widgets
- No dashboard-specific features

**2. Alternative Token Storage**
- No sessionStorage usage
- No cookie-based authentication
- No IndexedDB storage
- No in-memory only storage

**3. Advanced Authentication Features**
- No token refresh mechanism
- No token expiration handling
- No "remember me" extended sessions
- No session timeout warnings
- No concurrent session management

**4. OAuth/Social Login on Home Page**
- No Google login integration on home page
- No social media connections display
- No third-party authentication providers

**5. Profile Management**
- No profile editing form
- No profile picture upload
- No profile settings page
- No password change functionality
- No email change functionality

**6. User Settings**
- No settings page
- No preferences management
- No notification settings
- No privacy controls

**7. Multi-Factor Authentication**
- No 2FA setup
- No OTP verification
- No backup codes
- No security questions

**8. Password Recovery on Home**
- No password reset on home page
- No forgot password link on home
- No email verification resend

**9. Role-Based Access Control**
- No user roles/permissions
- No admin features
- No user type differentiation

**10. Advanced UI Features**
- No dark mode toggle on home
- No language selection
- No theme customization
- No layout preferences

**11. Analytics/Tracking**
- No login analytics
- No session tracking
- No user behavior monitoring
- No audit logs

**12. Account Management**
- No account deletion
- No account deactivation
- No data export
- No privacy policy acceptance

## User Stories

### User Story 1: Access Protected Home Page After Login

As a registered user
I want to login and access my home page
So that I can see my personalized dashboard with my account information

**Acceptance Criteria:**

**Scenario 1: Successful login redirects to home page**
```gherkin
Given the user is on the login page
And the user has a registered account
When the user enters valid credentials and submits
Then the user should be redirected to /home
And the home page should display the user's full name
And the home page should display the user's email
And the token should be stored in localStorage
```

**Scenario 2: Home page displays user information**
```gherkin
Given the user is authenticated
And the user is on the home page
When the home page loads
Then the page should display "Welcome, [User's Full Name]"
And the page should display the user's email
And the page should display the login time
And the page should show a logout button
```

**Scenario 3: Token persists across page refreshes**
```gherkin
Given the user is authenticated
And the user is on the home page
When the user refreshes the browser
Then the user should remain on the home page
And the user information should still be displayed
And the user should not be redirected to login
```

### User Story 2: Access Protected Home Page After Registration

As a new user
I want to register and immediately access my home page
So that I can start using the application without additional login

**Acceptance Criteria:**

**Scenario 1: Successful registration redirects to home page**
```gherkin
Given the user is on the registration page
And the user has not registered before
When the user completes registration with valid data
Then the user should be redirected to /home
And the home page should display the user's full name
And the home page should display the user's email
And the token should be stored in localStorage
```

**Scenario 2: Registration creates authenticated session**
```gherkin
Given the user just completed registration
And the user is on the home page
When the user refreshes the browser
Then the user should remain authenticated
And the user should remain on the home page
```

### User Story 3: Prevent Unauthorized Access to Home Page

As the application
I want to protect the home page from unauthorized access
So that only authenticated users can view their information

**Acceptance Criteria:**

**Scenario 1: Unauthenticated user accessing home redirects to login**
```gherkin
Given the user is not authenticated
And the user has no token in localStorage
When the user navigates to /home directly
Then the user should be redirected to /login
And the login page should be displayed
```

**Scenario 2: Invalid token redirects to login**
```gherkin
Given the user has an invalid token in localStorage
When the user navigates to /home
Then the application should detect the invalid token
And the token should be removed from localStorage
And the user should be redirected to /login
```

**Scenario 3: Expired token redirects to login**
```gherkin
Given the user has an expired token in localStorage
When the user navigates to /home
Then the backend should return 401 Unauthorized
And the token should be removed from localStorage
And the user should be redirected to /login
```

### User Story 4: Redirect Authenticated Users from Public Pages

As an authenticated user
I want to be automatically redirected from login/register pages
So that I don't need to manually navigate to my home page

**Acceptance Criteria:**

**Scenario 1: Authenticated user accessing login redirects to home**
```gherkin
Given the user is authenticated
And the user has a valid token in localStorage
When the user navigates to /login
Then the user should be redirected to /home
And the user should see their home page
```

**Scenario 2: Authenticated user accessing register redirects to home**
```gherkin
Given the user is authenticated
And the user has a valid token in localStorage
When the user navigates to /register
Then the user should be redirected to /home
And the user should see their home page
```

**Scenario 3: Authenticated user accessing root redirects to home**
```gherkin
Given the user is authenticated
And the user has a valid token in localStorage
When the user navigates to / (root URL)
Then the user should be redirected to /home
And the user should see their home page
```

### User Story 5: Logout and Clear Session

As an authenticated user
I want to logout from my account
So that my session is terminated and my token is removed

**Acceptance Criteria:**

**Scenario 1: Successful logout clears token and redirects**
```gherkin
Given the user is authenticated
And the user is on the home page
When the user clicks the logout button
Then the token should be removed from localStorage
And the user should be redirected to /login
And the user should no longer be authenticated
```

**Scenario 2: After logout, home page is inaccessible**
```gherkin
Given the user just logged out
When the user navigates to /home
Then the user should be redirected to /login
And the home page should not be displayed
```

**Scenario 3: Logout from home page**
```gherkin
Given the user is on the home page
When the user clicks logout
Then the authentication context should reset
And isAuthenticated should be false
And user data should be null
And the user should see the login page
```

## Success Criteria

The implementation is considered complete when:

1. **Functional Requirements Met:**
   - All 5 user stories are fully implemented
   - All scenarios pass in Playwright E2E tests
   - All Gherkin specifications are implemented

2. **Route Protection Working:**
   - Unauthenticated access to /home redirects to /login
   - Authenticated access to /login redirects to /home
   - Authenticated access to /register redirects to /home
   - Authenticated access to / redirects to /home

3. **Token Management Working:**
   - Token is stored in localStorage on login
   - Token is stored in localStorage on registration
   - Token is removed on logout
   - Token persists across page refreshes
   - Invalid tokens are detected and removed

4. **User Experience:**
   - Login redirects to /home with user info displayed
   - Registration redirects to /home with user info displayed
   - Logout redirects to /login
   - Page refreshes don't lose authentication state
   - No unnecessary authentication checks on public pages

5. **Testing Complete:**
   - All E2E tests pass (100% success rate)
   - All API tests pass (100% success rate)
   - Manual testing checklist completed
   - No console errors during normal flow

6. **Code Quality:**
   - No TypeScript errors
   - No ESLint warnings
   - Code follows project patterns
   - Components are properly typed
   - Context API properly implemented

7. **Documentation Updated:**
   - How-to guide created for authentication flow
   - Getting started tutorial updated
   - API endpoints reference accurate
   - Architecture explanation documented

## Technical Constraints

1. **Token Storage:** MUST use localStorage (NOT sessionStorage or cookies)
2. **Home Route:** MUST be /home (NOT /dashboard or other routes)
3. **Context API:** MUST use React Context for auth state (NOT Redux or Zustand)
4. **Backend API:** MUST use existing Spring Boot backend at localhost:8081
5. **Framework:** MUST use Next.js 15.5.0 with App Router
6. **Testing:** MUST use Playwright for E2E tests (NO Cypress or other tools)
7. **Specifications:** MUST write Gherkin .feature files for all flows

## Dependencies

**Existing Features Required:**
- Backend authentication API (POST /api/auth/login)
- Backend registration API (POST /api/auth/register)
- Backend profile API (GET /api/users/{id})
- JWT token generation in backend
- Frontend LoginForm component
- Frontend RegistrationForm component
- API service layer (src/services/api.ts)
- API types (src/types/api.ts)

**Technical Dependencies:**
- Next.js 15.5.0
- React 19.1.0
- TypeScript
- Zod (for validation)
- Playwright (for E2E tests)

## Validation Steps

1. **Manual Testing:**
   - Test login -> home flow manually
   - Test registration -> home flow manually
   - Test logout flow manually
   - Test direct /home access without auth
   - Test page refresh on /home
   - Verify localStorage token presence

2. **Automated Testing:**
   - Run `npm run test:e2e` (all tests pass)
   - Run API tests (all tests pass)
   - Check Gherkin spec coverage

3. **Code Quality:**
   - Run `npm run lint` (no errors)
   - Check TypeScript compilation (no errors)
   - Review console for errors during flows

4. **Browser Testing:**
   - Test in Chrome
   - Test in Firefox (optional)
   - Test in Safari (optional)
   - Test with DevTools Network tab
   - Test with DevTools Application tab (localStorage)
