# Technical Design: Frontend Authentication Flow with Home Page

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   Next.js App Router                        │ │
│  │                                                              │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐  │ │
│  │  │    /     │  │ /register│  │  /login  │  │   /home   │  │ │
│  │  │  (root)  │  │   page   │  │   page   │  │   page    │  │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘  │ │
│  │       │             │             │              │         │ │
│  │       └─────────────┴─────────────┴──────────────┘         │ │
│  │                           │                                 │ │
│  │                           ▼                                 │ │
│  │              ┌─────────────────────────┐                   │ │
│  │              │   AuthContext Provider  │                   │ │
│  │              │  (Global Auth State)    │                   │ │
│  │              └──────────┬──────────────┘                   │ │
│  │                         │                                   │ │
│  │         ┌───────────────┼───────────────┐                  │ │
│  │         ▼               ▼               ▼                  │ │
│  │   ┌──────────┐   ┌──────────┐   ┌──────────┐             │ │
│  │   │Registration│   │ Login    │   │   Home   │             │ │
│  │   │   Form     │   │  Form    │   │Component │             │ │
│  │   └─────┬──────┘   └────┬─────┘   └────┬─────┘             │ │
│  │         │               │              │                   │ │
│  │         └───────────────┼──────────────┘                   │ │
│  │                         │                                   │ │
│  │                         ▼                                   │ │
│  │              ┌─────────────────────────┐                   │ │
│  │              │    API Service Layer    │                   │ │
│  │              │   (src/services/api.ts) │                   │ │
│  │              └──────────┬──────────────┘                   │ │
│  │                         │                                   │ │
│  └─────────────────────────┼─────────────────────────────────┘ │
│                            │                                     │
│                            ▼                                     │
│                  ┌──────────────────┐                           │
│                  │   localStorage   │                           │
│                  │  { authToken }   │                           │
│                  └──────────────────┘                           │
│                                                                   │
└───────────────────────────┼───────────────────────────────────────┘
                            │ HTTP Requests
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Backend API (localhost:8081)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  POST /api/auth/register  ────────►  UserService                │
│  POST /api/auth/login     ────────►  AuthService                │
│  GET  /api/users/{id}     ────────►  UserProfileController      │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Authentication Flow Diagram

```
User Flow: Login → Home → Logout

┌────────┐           ┌──────────┐          ┌──────────┐         ┌─────────┐
│ Browser│           │  Login   │          │   Auth   │         │  Home   │
│        │           │  Page    │          │ Context  │         │  Page   │
└───┬────┘           └────┬─────┘          └────┬─────┘         └────┬────┘
    │                     │                     │                    │
    │  Navigate /login    │                     │                    │
    ├────────────────────►│                     │                    │
    │                     │                     │                    │
    │                     │  Check Auth         │                    │
    │                     ├────────────────────►│                    │
    │                     │  isAuthenticated?   │                    │
    │                     │◄────────────────────┤                    │
    │                     │  false              │                    │
    │                     │                     │                    │
    │  Show Login Form    │                     │                    │
    │◄────────────────────┤                     │                    │
    │                     │                     │                    │
    │  Enter credentials  │                     │                    │
    ├────────────────────►│                     │                    │
    │                     │                     │                    │
    │                     │  Submit Login       │                    │
    │                     ├─────────────────────┼────────────────────┤
    │                     │  API: POST /login   │                    │
    │                     │  (save token to     │                    │
    │                     │   localStorage)     │                    │
    │                     ├─────────────────────┼────────────────────┤
    │                     │  Login Success      │                    │
    │                     │  Call context.login()│                   │
    │                     ├────────────────────►│                    │
    │                     │  Update auth state  │                    │
    │                     │◄────────────────────┤                    │
    │                     │                     │                    │
    │                     │  router.push(/home) │                    │
    │                     ├─────────────────────┼───────────────────►│
    │                     │                     │                    │
    │  Display Home Page  │                     │   Check Auth       │
    │◄────────────────────┼─────────────────────┼────────────────────┤
    │  with user info     │                     │   isAuthenticated? │
    │                     │                     │   true             │
    │                     │                     │                    │
    │                     │                     │   Fetch user data  │
    │                     │                     │   Display profile  │
    │                     │                     │                    │
    │  Click Logout       │                     │                    │
    ├─────────────────────┼─────────────────────┼───────────────────►│
    │                     │                     │   Call logout()    │
    │                     │                     │◄───────────────────┤
    │                     │                     │   Clear token      │
    │                     │                     │   Reset state      │
    │                     │   router.push(/login)                    │
    │                     │◄─────────────────────                    │
    │  Show Login Page    │                     │                    │
    │◄────────────────────┤                     │                    │
    │                     │                     │                    │
```

### Route Protection Logic

```
Route Guards Decision Tree:

Accessing /home:
├─ Has valid token in localStorage?
│  ├─ Yes → Token valid in backend?
│  │  ├─ Yes → Render /home page
│  │  └─ No  → Clear token → Redirect to /login
│  └─ No  → Redirect to /login

Accessing /login:
├─ Has valid token in localStorage?
│  ├─ Yes → Redirect to /home
│  └─ No  → Render /login page

Accessing /register:
├─ Has valid token in localStorage?
│  ├─ Yes → Redirect to /home
│  └─ No  → Render /register page

Accessing / (root):
├─ Has valid token in localStorage?
│  ├─ Yes → Redirect to /home
│  └─ No  → Render / page (or redirect to /login)
```

## Implementation Approach

### Phase 1: Authentication Context Setup

Create a global authentication state management system using React Context API.

**Files to Create:**
- `frontend/src/contexts/AuthContext.tsx` - Auth context provider

**Implementation Steps:**

1. **Create AuthContext with state:**
   ```typescript
   interface AuthContextType {
     isAuthenticated: boolean;
     user: AuthUser | null;
     loading: boolean;
     error: string | null;
     login: (email: string, fullName: string, userId: number) => void;
     logout: () => void;
     checkAuth: () => Promise<void>;
   }
   ```

2. **Implement context provider:**
   - Initialize state from localStorage token check
   - Fetch user profile if token exists
   - Handle loading states
   - Handle error states

3. **Wrap app in AuthProvider:**
   - Update `frontend/src/app/layout.tsx`
   - Add AuthProvider wrapper around children

### Phase 2: Home Page Component

Create the protected home page that displays user information.

**Files to Create:**
- `frontend/src/app/home/page.tsx` - Home page route
- `frontend/src/components/HomePage.tsx` - Home page component

**Implementation Steps:**

1. **Create /home route:**
   - Use Next.js App Router structure
   - Import HomePage component

2. **Build HomePage component:**
   - Use AuthContext to get user data
   - Display welcome message with fullName
   - Display email
   - Display login time
   - Add logout button
   - Handle loading state
   - Handle error state

3. **Add route protection:**
   - Check authentication status on mount
   - Redirect to /login if not authenticated
   - Show loading spinner during auth check

### Phase 3: Route Guards and Redirects

Implement route protection logic for all pages.

**Files to Modify:**
- `frontend/src/app/page.tsx` - Root page redirect
- `frontend/src/app/login/page.tsx` - Login page redirect
- `frontend/src/app/register/page.tsx` - Register page redirect
- `frontend/src/app/home/page.tsx` - Home page protection

**Implementation Steps:**

1. **Add useEffect hooks to check auth:**
   - Use AuthContext `isAuthenticated` state
   - Implement redirect logic based on route

2. **Root page (/) redirect:**
   - If authenticated → redirect to /home
   - If not authenticated → stay on root or redirect to /login

3. **Login page redirect:**
   - If authenticated → redirect to /home
   - If not authenticated → render login form

4. **Register page redirect:**
   - If authenticated → redirect to /home
   - If not authenticated → render registration form

5. **Home page protection:**
   - If authenticated → render home page
   - If not authenticated → redirect to /login

### Phase 4: Update Login and Registration Flows

Modify existing forms to integrate with AuthContext and redirect to /home.

**Files to Modify:**
- `frontend/src/components/LoginForm.tsx`
- `frontend/src/components/RegistrationForm.tsx`

**Implementation Steps:**

1. **Update LoginForm:**
   - Import and use AuthContext
   - After successful login, call `context.login()`
   - Redirect to /home (remove redirect to /register)
   - Keep token storage in API service

2. **Update RegistrationForm:**
   - Import and use AuthContext
   - After successful registration, call `context.login()`
   - Redirect to /home (remove redirect to /login)
   - Keep token storage in API service

### Phase 5: Logout Functionality

Implement logout button and token cleanup.

**Files to Modify:**
- `frontend/src/components/HomePage.tsx` (add logout button)
- `frontend/src/contexts/AuthContext.tsx` (logout function)
- `frontend/src/services/api.ts` (already has logoutUser)

**Implementation Steps:**

1. **Add logout button to HomePage:**
   - Button in header or navigation
   - Click handler calls AuthContext logout

2. **Implement logout in AuthContext:**
   - Call `logoutUser()` from API service
   - Reset context state (isAuthenticated = false, user = null)
   - Redirect to /login

3. **Verify token removal:**
   - Check localStorage is cleared
   - Check context state is reset

## Code Structure

### File Organization

```
frontend/src/
├── app/
│   ├── layout.tsx                    # MODIFY: Add AuthProvider wrapper
│   ├── page.tsx                      # MODIFY: Add redirect logic
│   ├── home/
│   │   └── page.tsx                  # CREATE: Home page route
│   ├── login/
│   │   └── page.tsx                  # MODIFY: Add redirect for authenticated users
│   └── register/
│       └── page.tsx                  # MODIFY: Add redirect for authenticated users
├── components/
│   ├── HomePage.tsx                  # CREATE: Home page component
│   ├── LoginForm.tsx                 # MODIFY: Integrate AuthContext, update redirect
│   └── RegistrationForm.tsx          # MODIFY: Integrate AuthContext, update redirect
├── contexts/
│   └── AuthContext.tsx               # CREATE: Authentication context provider
├── services/
│   └── api.ts                        # EXISTS: Already has auth functions
└── types/
    └── api.ts                        # EXISTS: Already has auth types
```

### Technology Choices

**State Management:**
- **React Context API** - Global auth state accessible throughout app
- **Reason:** Built-in, no external dependencies, perfect for auth state

**Token Storage:**
- **localStorage** - Browser persistent storage
- **Key:** `authToken`
- **Reason:** Persists across browser refreshes, simple API, specified in requirements

**Routing:**
- **Next.js App Router** - File-based routing with page.tsx files
- **useRouter** - Programmatic navigation for redirects
- **Reason:** Already using Next.js 15.5.0, App Router is current standard

**HTTP Client:**
- **fetch API** - Native browser HTTP client
- **Existing API service** - Already implemented in `src/services/api.ts`
- **Reason:** No need for axios, fetch is sufficient and already in use

**Validation:**
- **Zod** - Runtime type validation
- **Reason:** Already in use for form validation

**Testing:**
- **Playwright** - E2E testing framework
- **Real HTTP requests** - No mocking
- **Reason:** Project standard, specified in requirements

## Database Changes

No database changes required. This is frontend-only implementation using existing backend APIs.

## API Design

### Existing Endpoints Used

All endpoints already exist in backend. No new endpoints needed.

**1. POST /api/auth/login**
```
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200 OK):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "loginTime": "2025-10-19T10:30:00"
}
```

**2. POST /api/auth/register**
```
Request:
{
  "fullName": "John Doe",
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200 OK):
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "loginTime": "2025-10-19T10:30:00"
}
```

**3. GET /api/users/{id}**
```
Request Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response (200 OK):
{
  "id": 1,
  "fullName": "John Doe",
  "email": "user@example.com",
  "createdAt": "2025-10-19T10:30:00",
  "updatedAt": "2025-10-19T10:30:00"
}

Response (401 Unauthorized):
{
  "message": "Invalid or expired token",
  "errorCode": "UNAUTHORIZED"
}
```

### API Service Functions

Already implemented in `frontend/src/services/api.ts`:

```typescript
// Already exists - no changes needed
export async function loginUser(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>>
export async function registerUser(userData: UserRegistrationRequest): Promise<ApiResponse<LoginResponse>>
export async function getUserProfile(userId: number): Promise<ApiResponse<UserRegistrationResponse>>
export function logoutUser(): void
export function isAuthenticated(): boolean
export function getAuthToken(): string | null
```

## Integration Points

### 1. AuthContext ↔ API Service

```typescript
// AuthContext uses API service functions
import { getUserProfile, logoutUser, getAuthToken } from '@/services/api';

// Example in checkAuth function:
const checkAuth = async () => {
  const token = getAuthToken();
  if (token) {
    const response = await getUserProfile(userId);
    if (response.data) {
      setUser(response.data);
      setIsAuthenticated(true);
    } else {
      // Invalid token
      logoutUser();
      setIsAuthenticated(false);
    }
  }
};
```

### 2. LoginForm ↔ AuthContext

```typescript
// LoginForm calls AuthContext after successful login
import { useAuth } from '@/contexts/AuthContext';

const { login } = useAuth();

// After API login success:
if (response.data?.success) {
  login(response.data.email, response.data.fullName, response.data.userId);
  router.push('/home');
}
```

### 3. RegistrationForm ↔ AuthContext

```typescript
// RegistrationForm calls AuthContext after successful registration
import { useAuth } from '@/contexts/AuthContext';

const { login } = useAuth();

// After API registration success:
if (response.data?.success) {
  login(response.data.email, response.data.fullName, response.data.userId);
  router.push('/home');
}
```

### 4. HomePage ↔ AuthContext

```typescript
// HomePage reads user data from AuthContext
import { useAuth } from '@/contexts/AuthContext';

const { user, isAuthenticated, logout, loading } = useAuth();

// Display user info and provide logout button
```

### 5. All Pages ↔ Router

```typescript
// All pages use Next.js router for redirects
import { useRouter } from 'next/navigation';

const router = useRouter();

// Redirect based on auth state:
useEffect(() => {
  if (!isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated]);
```

## Token Flow

### Login/Registration Token Flow

```
1. User submits login/registration form
   ↓
2. API service sends POST request to backend
   ↓
3. Backend validates credentials, generates JWT token
   ↓
4. Backend returns token in response
   ↓
5. API service saves token to localStorage (key: 'authToken')
   ↓
6. Form component calls AuthContext.login()
   ↓
7. AuthContext updates state: isAuthenticated = true, user = {...}
   ↓
8. Form component redirects to /home
   ↓
9. Home page reads user data from AuthContext
   ↓
10. User sees home page with their information
```

### Page Refresh Token Flow

```
1. User refreshes browser on /home
   ↓
2. AuthContext initializes on mount
   ↓
3. AuthContext checks localStorage for 'authToken'
   ↓
4. Token found? → Call getUserProfile API with token
   ↓
5. Backend validates token
   ├─ Valid → Return user data
   │  ↓
   │  AuthContext sets isAuthenticated = true, user = {...}
   │  ↓
   │  Home page renders with user data
   │
   └─ Invalid (401) → API service removes token from localStorage
      ↓
      AuthContext sets isAuthenticated = false
      ↓
      Home page redirects to /login
```

### Logout Token Flow

```
1. User clicks logout button on /home
   ↓
2. HomePage calls AuthContext.logout()
   ↓
3. AuthContext calls API service logoutUser()
   ↓
4. API service removes 'authToken' from localStorage
   ↓
5. AuthContext resets state: isAuthenticated = false, user = null
   ↓
6. AuthContext redirects to /login
   ↓
7. User sees login page
```

## Error Handling

### Invalid Token Scenarios

1. **Token expired:**
   - Backend returns 401
   - API service removes token
   - AuthContext redirects to /login

2. **Token malformed:**
   - Backend returns 401
   - API service removes token
   - AuthContext redirects to /login

3. **No token:**
   - AuthContext sets isAuthenticated = false
   - Protected routes redirect to /login

### Network Error Scenarios

1. **API unreachable:**
   - Show error message to user
   - Don't remove token (might be temporary)
   - Provide retry option

2. **Timeout:**
   - Show loading indicator
   - Show timeout message
   - Provide retry option

### User Experience

1. **Loading states:**
   - Show spinner during auth check
   - Show skeleton on home page load
   - Disable buttons during API calls

2. **Error messages:**
   - Clear, user-friendly messages
   - Don't expose technical details
   - Provide actionable next steps

## Performance Considerations

1. **Minimize re-renders:**
   - Use React.memo for components
   - Optimize AuthContext dependencies

2. **Lazy load home page:**
   - Use dynamic imports if needed
   - Prioritize above-the-fold content

3. **Cache user data:**
   - Store user data in AuthContext
   - Don't fetch on every render
   - Only fetch on mount or explicit refresh

4. **Optimize redirects:**
   - Use router.replace() instead of router.push() for auth redirects
   - Prevent back button issues

## Security Considerations

1. **Token storage:**
   - Use localStorage (as specified)
   - Don't log tokens to console in production
   - Clear token on logout

2. **CORS:**
   - Already configured in backend (CorsConfig.java)
   - Frontend uses credentials: 'include'

3. **Route protection:**
   - Always verify token on backend
   - Frontend guards are UX only, not security
   - Backend must validate all protected endpoints

4. **Input validation:**
   - Already handled by Zod schemas in forms
   - Backend also validates (double validation)

## Testing Strategy

### Unit Tests

Not required for this implementation (focusing on E2E tests as per project standard).

### E2E Tests (Playwright)

**Test Files to Create:**
- `tests/e2e/authentication-flow.spec.ts`
- `tests/e2e/route-protection.spec.ts`

**Test Scenarios:**

1. **Login → Home flow:**
   - Login with valid credentials
   - Verify redirect to /home
   - Verify user info displayed
   - Verify token in localStorage

2. **Registration → Home flow:**
   - Register new user
   - Verify redirect to /home
   - Verify user info displayed
   - Verify token in localStorage

3. **Route protection:**
   - Access /home without token → redirect to /login
   - Access /login with token → redirect to /home
   - Access /register with token → redirect to /home

4. **Logout flow:**
   - Login first
   - Navigate to /home
   - Click logout
   - Verify redirect to /login
   - Verify token removed from localStorage

5. **Page refresh:**
   - Login first
   - Navigate to /home
   - Refresh page
   - Verify still on /home
   - Verify user info still displayed

### API Tests (Playwright)

**Test Files to Create:**
- `tests/api/auth-endpoints.api.spec.ts`

**Test Scenarios:**

1. **POST /api/auth/login:**
   - Valid credentials → 200 with token
   - Invalid credentials → 401
   - Missing fields → 400

2. **POST /api/auth/register:**
   - Valid data → 200 with token
   - Duplicate email → 400
   - Invalid data → 400

3. **GET /api/users/{id}:**
   - With valid token → 200 with user data
   - With invalid token → 401
   - Without token → 401

### Gherkin Specifications

**Files to Create:**
- `specs/authentication/authentication-flow.feature`
- `specs/authentication/route-protection.feature`

**Coverage:**
- All user stories from requirements.md
- All acceptance criteria scenarios
- Edge cases and error scenarios

## Commit Structure

Following the 9-commit structure over 3 days:

**Day 1 - Foundation (3 commits):**
1. Create AuthContext with state management
2. Create HomePage component with user display
3. Create /home page route

**Day 2 - Integration (3 commits):**
4. Update LoginForm to use AuthContext and redirect to /home
5. Update RegistrationForm to use AuthContext and redirect to /home
6. Implement route guards and redirects for all pages

**Day 3 - Testing & Polish (3 commits):**
7. Add Gherkin specifications for authentication flows
8. Create Playwright E2E tests for authentication and route protection
9. Create Playwright API tests for auth endpoints

Each commit should be file-by-file for clarity and should include descriptive commit messages.
