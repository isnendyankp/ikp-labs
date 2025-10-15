# API Endpoints Reference

Complete reference for all REST API endpoints in the Registration Form application.

## Base URL

```
http://localhost:8081
```

## Authentication Endpoints

All authentication endpoints are under `/api/auth`.

### POST /api/auth/register

Register a new user account.

**Location**: `AuthController.java:79`

**Request Body**:
```json
{
  "fullName": "string (required)",
  "email": "string (required, valid email format)",
  "password": "string (required, min 8 chars)",
  "confirmPassword": "string (required, must match password)"
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "email": "user@example.com",
  "fullName": "John Doe"
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Email already exists",
  "token": null
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "success": false,
  "message": "Internal server error",
  "token": null
}
```

**Example**:
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!"
  }'
```

---

### POST /api/auth/login

Authenticate user and receive JWT token.

**Location**: `AuthController.java:123`

**Request Body**:
```json
{
  "email": "string (required, valid email format)",
  "password": "string (required)"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "email": "user@example.com",
  "fullName": "John Doe",
  "loginTime": "2024-01-15T10:30:00"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid email or password",
  "token": null
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "success": false,
  "message": "Internal server error",
  "token": null
}
```

**Example**:
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

**Frontend Usage**:
```typescript
const response = await fetch('http://localhost:8081/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123!'
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('authToken', data.token);
  // Redirect to dashboard
}
```

---

### POST /api/auth/refresh

Refresh JWT token without requiring login.

**Location**: `AuthController.java:159`

**Query Parameters**:
- `token` (required): Current JWT token

**Request**:
```
POST /api/auth/refresh?token=eyJhbGciOiJIUzUxMiJ9...
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "email": "user@example.com",
  "fullName": "John Doe"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "token": null
}
```

**Example**:
```bash
curl -X POST "http://localhost:8081/api/auth/refresh?token=eyJhbGciOiJIUzUxMiJ9..."
```

---

### POST /api/auth/validate

Validate if JWT token is still valid.

**Location**: `AuthController.java:188`

**Query Parameters**:
- `token` (required): JWT token to validate
- `email` (required): Email of the user

**Request**:
```
POST /api/auth/validate?token=eyJ...&email=user@example.com
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "valid": true,
  "message": "Token is valid"
}
```

**Invalid Token Response** (200 OK):
```json
{
  "success": true,
  "valid": false,
  "message": "Token is invalid"
}
```

**Error Response** (500 Internal Server Error):
```json
{
  "success": false,
  "valid": false,
  "message": "Error validating token",
  "error": "Malformed JWT token"
}
```

**Example**:
```bash
curl -X POST "http://localhost:8081/api/auth/validate?token=eyJ...&email=user@example.com"
```

---

### GET /api/auth/health

Health check endpoint for authentication service.

**Location**: `AuthController.java:220`

**Response** (200 OK):
```json
{
  "status": "UP",
  "service": "AuthController",
  "message": "Authentication service is running",
  "timestamp": "2024-01-15T10:30:00"
}
```

**Example**:
```bash
curl http://localhost:8081/api/auth/health
```

---

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET/POST request |
| 201 | Created | Successful resource creation (registration) |
| 400 | Bad Request | Invalid input data or business logic error |
| 401 | Unauthorized | Invalid credentials or expired token |
| 500 | Internal Server Error | Unexpected server error |

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "token": null
}
```

### Common Error Messages

| Message | Cause | Solution |
|---------|-------|----------|
| "Email already exists" | Duplicate registration | Use different email or login |
| "Invalid email or password" | Wrong credentials | Check email and password |
| "Invalid or expired token" | Token expired or malformed | Login again |
| "Internal server error" | Server-side error | Check backend logs |

## Security Considerations

### Password Requirements

Enforced by backend validation:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Token Handling

**JWT Token Format**:
```
Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA1MzE0NjAwLCJleHAiOjE3MDUzMTgyMDB9.signature
```

**Token Expiration**: 1 hour (configurable in `application.properties`)

**Frontend Storage**: Store token in `localStorage`:
```javascript
localStorage.setItem('authToken', token);
```

**Include Token in Requests**:
```javascript
fetch('/api/protected-endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## CORS Configuration

CORS is configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:3005`

Allowed methods: `GET`, `POST`, `PUT`, `DELETE`
Allowed headers: `*`

## Rate Limiting

Currently no rate limiting is implemented. Consider adding in production:
- Max 5 login attempts per IP per minute
- Max 10 registration attempts per IP per hour

## Testing

### With curl

```bash
# Test registration
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"TestPass123!","confirmPassword":"TestPass123!"}'

# Test login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'
```

### With Postman

Import collection or manually create requests:

1. Create request: `POST http://localhost:8081/api/auth/register`
2. Set header: `Content-Type: application/json`
3. Set body (raw JSON):
   ```json
   {
     "fullName": "Test User",
     "email": "test@example.com",
     "password": "TestPass123!",
     "confirmPassword": "TestPass123!"
   }
   ```
4. Send request
5. Save token from response for login tests

### With Playwright E2E Tests

See [How to Run E2E Tests](../how-to/run-e2e-tests.md) for automated testing.

## Related Documentation

- [Authentication Architecture](../explanation/authentication-architecture.md) - Understand JWT flow
- [How to Add API Endpoint](../how-to/add-api-endpoint.md) - Extend the API
- [Database Schema](./database-schema.md) - Database structure reference
