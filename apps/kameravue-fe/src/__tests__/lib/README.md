# Unit Tests - lib/

This folder contains unit tests for utility functions in `frontend/src/lib/`.

## Files

| Test File           | Source File       | Description                                     |
| ------------------- | ----------------- | ----------------------------------------------- |
| `apiClient.test.ts` | `../apiClient.ts` | Tests for token management and headers creation |

## Testing Philosophy

- **NO MOCKING**: Uses real localStorage from JSDOM
- **NO API CALLS**: Network calls are tested in `/tests/api/` (Playwright)
- **Pure Functions**: Test logic directly without external dependencies

## What We Test

### apiClient.ts

- `getToken()` - Retrieve token from localStorage
- `saveToken()` - Store token to localStorage
- `removeToken()` - Clear token from localStorage
- `createHeaders()` - Create headers with/without auth
- `createAuthHeaders()` - Create headers with auth
- `createFormDataHeaders()` - Create headers for FormData uploads

## What We DON'T Test

- `fetchWithAuth()` - Network call, tested in API tests
- `fetchWithoutAuth()` - Network call, tested in API tests

## Run Tests

```bash
# Run all lib tests
npm test -- --testPathPatterns="lib/__tests__"

# Run specific file
npm test -- apiClient.test.ts
```

## Related

- API Tests: `/tests/api/` (Playwright)
- E2E Tests: `/tests/e2e/` (Playwright)
- Main Test README: `/tests/README.md`
