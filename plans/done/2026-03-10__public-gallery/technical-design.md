# Technical Design - Public Gallery

## Architecture

### Current State
```
/gallery → Auth Check → Redirect to /login (if not authenticated)
```

### Target State
```
/gallery → Show photos (public access)
         → Click photo → Check auth
                       → Authenticated: Show detail
                       → Not authenticated: Redirect to /login?returnUrl=/gallery
```

## Implementation Approach

### 1. Modify Gallery Page (`frontend/src/app/gallery/page.tsx`)

**Changes:**
- Remove auth check on mount
- Add auth check only when clicking photo detail
- Support public photo fetching without auth

**Key Logic:**
```typescript
// On mount: Fetch photos without auth check
// On photo click: Check auth before showing detail
const handlePhotoClick = (photoId: string) => {
  if (!isAuthenticated()) {
    router.push(`/login?returnUrl=${encodeURIComponent('/gallery')}`);
    return;
  }
  // Show photo detail
};
```

### 2. Update Login Page (`frontend/src/app/login/page.tsx`)

**Changes:**
- Read `returnUrl` from query params
- Redirect to `returnUrl` after successful login
- Default to `/myprofile` if no `returnUrl`

**Key Logic:**
```typescript
const searchParams = useSearchParams();
const returnUrl = searchParams.get('returnUrl') || '/myprofile';

// After login success
router.push(returnUrl);
```

### 3. Footer Component (Already Works)

**Current:** `onNavigate("/gallery")` callback
**No changes needed** - already functional

## File Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `gallery/page.tsx` | Modify | Remove auth gate, add soft gate |
| `login/page.tsx` | Modify | Add returnUrl handling |

## API Considerations

### Current API
- `GET /api/photos` - Requires authentication

### Options
1. **Use existing API** - Works if backend allows public access
2. **Create public endpoint** - `GET /api/public/photos` (if needed)

**Decision:** Check if current API works without auth. If not, backend changes needed.

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      GALLERY PAGE                           │
├─────────────────────────────────────────────────────────────┤
│  1. Component Mount                                          │
│     └── Fetch photos (public access)                        │
│                                                             │
│  2. User Clicks Photo                                        │
│     ├── Check isAuthenticated()                             │
│     │   ├── Yes → Show photo detail                         │
│     │   └── No  → Redirect to /login?returnUrl=/gallery    │
│                                                             │
│  3. [If redirected] Login Page                              │
│     ├── Read returnUrl from params                          │
│     ├── User logs in                                        │
│     └── Redirect to returnUrl                               │
│                                                             │
│  4. Back to Gallery                                          │
│     └── User now authenticated, can view details            │
└─────────────────────────────────────────────────────────────┘
```

## Security Considerations

1. **Public photos only** - Ensure API doesn't expose private user data
2. **Return URL validation** - Only allow relative URLs, no external redirects
3. **Token validation** - Still validate JWT on protected actions

## Testing Strategy

1. **Unit Tests**
   - Auth utility functions
   - returnUrl parsing

2. **Integration Tests**
   - Gallery page renders without auth
   - Redirect flow works correctly

3. **Manual Tests**
   - Non-login user can view gallery
   - Non-login user redirected on click
   - Return after login works
   - Authenticated user experience unchanged

## Rollback Plan

If issues arise:
1. Revert gallery page changes
2. Gallery returns to fully protected state
3. No data migration needed

## Estimated Complexity

**Low** - Primarily frontend changes, minimal new code
