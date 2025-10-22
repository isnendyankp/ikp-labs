# Protected Routes Architecture

This document explains the conceptual design and architecture of protected routes in the Registration Form application.

## What Are Protected Routes?

Protected routes are pages in a web application that require authentication to access. Without valid credentials (in our case, a JWT token), users are automatically redirected to the login page.

## Why Use Protected Routes?

### 1. Security
Protected routes ensure that sensitive user information and functionality are only accessible to authenticated users. This prevents unauthorized access to personal data.

### 2. User Experience
By automatically redirecting unauthenticated users to the login page, we create a seamless flow that guides users through the authentication process without showing error messages or broken pages.

### 3. State Management
Protected routes rely on client-side token verification, which is fast and doesn't require server roundtrips for every page load. This improves performance while maintaining security.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       User Journey                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Browser Loads   │
                    │   /home Page     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Check localStorage│
                    │  for 'authToken'  │
                    └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            Token Exists         Token Missing
                    │                   │
                    ▼                   ▼
          ┌──────────────────┐  ┌──────────────────┐
          │  Decode JWT      │  │  Redirect to     │
          │  Extract User    │  │  /login          │
          │  Info            │  └──────────────────┘
          └──────────────────┘
                    │
                    ▼
          ┌──────────────────┐
          │  Render Home     │
          │  Page with User  │
          │  Information     │
          └──────────────────┘
```

## Key Components

### 1. Authentication State Check

The `isAuthenticated()` function checks for the presence of a JWT token in localStorage:

```typescript
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('authToken');
  return !!token;
};
```

**Why this approach?**
- **Fast**: No server roundtrip needed
- **Simple**: Boolean check for token presence
- **Client-side**: Works in browser environment

**Limitations:**
- Doesn't validate token expiration
- Doesn't check token signature
- Trusts localStorage content

### 2. Token Decoding

The `getUserFromToken()` function extracts user information from the JWT payload:

```typescript
export const getUserFromToken = (): AuthUser | null => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = JSON.parse(window.atob(base64));

  return {
    email: payload.sub,
    fullName: payload.fullName
  };
};
```

**Why decode client-side?**
- Avoids extra API calls to fetch user data
- User info is already in the token
- Faster page rendering

**Important Note:**
This is NOT a security measure. The token is decoded, not verified. Server-side verification happens on API calls.

### 3. Navigation Guards

React's `useEffect` hook combined with Next.js `useRouter` creates navigation guards:

```typescript
useEffect(() => {
  if (!isAuthenticated()) {
    router.push('/login');
    return;
  }
  // ... load user data
}, [router]);
```

**Why useEffect?**
- Runs after component mount
- Prevents server-side rendering issues
- Allows for loading states

### 4. Reverse Protection

Login and register pages redirect authenticated users to prevent unnecessary re-authentication:

```typescript
useEffect(() => {
  if (isAuthenticated()) {
    router.push('/home');
  }
}, [router]);
```

**Why reverse protection?**
- Better UX: Already logged-in users go straight to their content
- Prevents confusion: No need to see login form when already authenticated
- Maintains flow: Natural progression through the app

## Security Considerations

### What This Architecture Protects Against

1. **Casual unauthorized access**: Prevents users without tokens from viewing protected pages
2. **UI/UX flow protection**: Ensures proper authentication flow
3. **Client-side routing protection**: Guards against manual URL manipulation

### What This Architecture Does NOT Protect Against

1. **Token theft**: If someone steals the token from localStorage, they can access protected pages
2. **Token tampering**: Client-side decoding doesn't validate token signature
3. **Expired tokens**: No automatic expiration check on client

### Why Server-Side Validation Still Matters

While client-side protection guards the UI, the real security happens on the server:

```
Client Protection:     Server Protection:
─────────────────     ──────────────────
Show/Hide Pages   ←→   Verify JWT Signature
Redirect Users    ←→   Check Token Expiration
Extract User Info ←→   Validate Permissions
                  ←→   Protect API Endpoints
```

**Key Principle**: Never trust the client. Client-side protection is for UX, not security.

## Trade-offs and Design Decisions

### Decision 1: localStorage vs Cookies

**We chose localStorage** because:
- Simple API: Easy to read/write
- No server configuration needed
- Works well with client-side routing

**Trade-off**:
- Vulnerable to XSS attacks
- Not automatically sent with requests
- Requires manual token handling

### Decision 2: Client-Side Token Decoding

**We decode tokens on client** because:
- Faster: No API call needed for user info
- User data already in token
- Better perceived performance

**Trade-off**:
- Token payload is public
- Must not store sensitive data in token
- Relies on server verification for security

### Decision 3: Redirect on Load vs Show Error

**We redirect immediately** because:
- Cleaner UX: No flash of protected content
- Clear user flow: Direct to login
- No confusing error messages

**Trade-off**:
- Users might not understand why they were redirected
- Requires loading states to prevent flash
- More complex state management

## Performance Implications

### Fast Path: Authenticated User

1. Page loads → 0ms
2. Check localStorage → ~1ms
3. Decode token → ~1ms
4. Render page → ~50-100ms

**Total: ~52-102ms to first paint**

### Slow Path: Unauthenticated User

1. Page loads → 0ms
2. Check localStorage → ~1ms
3. Redirect → ~50ms
4. Login page loads → ~100ms

**Total: ~151ms to login page**

### Optimization Strategies

1. **Early return**: Check auth before rendering complex components
2. **Loading states**: Show spinners during checks
3. **Memoization**: Cache decoded user data
4. **Lazy loading**: Load protected content only after auth check

## Evolution and Scalability

### Current State: Simple JWT Protection

```
Token in localStorage → Decode → Show Page
```

### Future Enhancements

1. **Token Refresh**: Automatically refresh expiring tokens
2. **Role-Based Access**: Check user roles for specific pages
3. **Permission System**: Fine-grained access control
4. **Server-Side Rendering**: Protect routes on server
5. **Session Management**: Track active sessions

### Migration Path

To add more sophisticated authentication:

1. Add token expiration check on client
2. Implement refresh token flow
3. Add role/permission checking
4. Move to server-side protection with middleware
5. Add session management system

## Related Concepts

- [Authentication Architecture](./authentication-architecture.md) - JWT flow and login process
- [CORS Configuration](./cors-configuration.md) - Cross-origin security
- [How to Implement Protected Routes](../how-to/implement-protected-routes.md) - Practical implementation guide

## Further Reading

- JWT Best Practices: https://tools.ietf.org/html/rfc8725
- Next.js Authentication Patterns: https://nextjs.org/docs/authentication
- localStorage Security: https://owasp.org/www-community/vulnerabilities/DOM_Based_XSS
