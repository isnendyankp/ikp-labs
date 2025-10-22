# How to Implement Protected Routes

This guide shows you how to implement protected routes in the Registration Form application using JWT authentication and Next.js navigation.

## Prerequisites

- Basic understanding of React and Next.js
- Understanding of JWT tokens
- Familiarity with localStorage API

## Overview

Protected routes prevent unauthenticated users from accessing certain pages. In this application, the `/home` page is protected and requires a valid JWT token.

## Step 1: Create Authentication Helper Functions

First, create helper functions to check authentication status:

```typescript
// frontend/src/lib/auth.ts

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;

  const token = localStorage.getItem('authToken');
  return !!token;
};

export const getUserFromToken = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    // Decode JWT token (middle part)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));

    return {
      email: payload.sub,
      fullName: payload.fullName
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};
```

## Step 2: Implement Protected Page Component

Create a protected page that checks authentication on mount:

```typescript
// frontend/src/app/home/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromToken, isAuthenticated } from '@/lib/auth';
import { AuthUser } from '@/types/api';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication on component mount
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Get user info from JWT token
    const userInfo = getUserFromToken();
    if (userInfo) {
      setUser(userInfo);
    } else {
      router.push('/login');
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>Welcome, {user.fullName}!</h2>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

## Step 3: Implement Reverse Protection for Auth Pages

Prevent authenticated users from accessing login/register pages:

```typescript
// frontend/src/components/LoginForm.tsx

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function LoginForm() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if already authenticated
    if (isAuthenticated()) {
      router.push('/home');
    }
  }, [router]);

  // ... rest of login form
}
```

## Step 4: Handle Logout

Create a logout function that clears the token and redirects:

```typescript
// frontend/src/components/LogoutButton.tsx

'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('authToken');

    // Redirect to login page
    router.push('/login');
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
```

## Testing Protected Routes

### Test 1: Unauthenticated Access
Try to access `/home` without logging in - you should be redirected to `/login`.

### Test 2: Authenticated Access
Login successfully and you should be redirected to `/home` with your user information displayed.

### Test 3: Token Persistence
Refresh the page while on `/home` - you should remain authenticated and see your information.

### Test 4: Logout
Click the logout button - you should be redirected to `/login` and unable to access `/home` without logging in again.

## Common Issues

### Issue: Infinite Redirect Loop

**Cause**: Both pages trying to redirect to each other.

**Solution**: Add loading states and ensure token check happens only once on mount.

### Issue: Token Persists After Logout

**Cause**: Token not cleared from localStorage.

**Solution**: Ensure `localStorage.removeItem('authToken')` is called on logout.

### Issue: User Data Not Displayed

**Cause**: JWT token not properly decoded.

**Solution**: Check token format and ensure payload contains expected fields (sub, fullName).

## Related Documentation

- [Authentication Architecture](../explanation/authentication-architecture.md) - Understanding JWT flow
- [API Endpoints Reference](../reference/api-endpoints.md) - Authentication endpoints
- [Run E2E Tests](./run-e2e-tests.md) - Testing authentication flow

## See Also

- [Home Page Feature Spec](../../specs/authentication/home-page.feature) - Gherkin scenarios
- [E2E Auth Flow Tests](../../tests/e2e/auth-flow.spec.ts) - Playwright test implementation
