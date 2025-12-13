# Authentication Architecture

Understanding the JWT-based authentication system in the Registration Form application.

## Overview

The Registration Form application uses a **stateless JWT (JSON Web Token) authentication** architecture. This document explains the conceptual design, architectural decisions, and how different components work together to provide secure authentication.

**Authentication Type:** JWT (JSON Web Token)
**Session Management:** Stateless (no server-side sessions)
**Password Security:** BCrypt hashing with 12 rounds
**Token Expiration:** 24 hours (configurable)
**Authorization:** Role-based access control (RBAC) ready

---

## Why JWT Authentication?

### The Hotel Key Card Analogy

Think of JWT authentication like a modern hotel key card system:

**Traditional Session-Based (Old Hotel Keys):**
- Front desk keeps a record of every guest (server stores sessions)
- When you enter your room, security calls front desk to verify (server checks session database)
- If front desk system crashes, all keys stop working (session data lost)
- Slow during check-in rush hour (database queries for every request)

**JWT Token-Based (Modern Key Cards):**
- Key card contains all guest information (JWT token contains user data)
- Room door scans card locally, no need to call front desk (server validates token without database)
- Card has expiration date printed on it (JWT has expiration claim)
- If front desk crashes, existing cards still work (stateless, no server dependency)
- Fast entry even during rush hour (no database lookup needed)

### Benefits of JWT

1. **Stateless & Scalable**
   - Server doesn't store session data
   - Easy to scale horizontally (add more servers)
   - No session synchronization between servers

2. **Performance**
   - No database lookup for every request
   - Token validation is cryptographic (very fast)
   - Reduced server memory usage

3. **Mobile-Friendly**
   - Works perfectly with mobile apps
   - No cookie dependency
   - Cross-domain authentication

4. **Microservices Ready**
   - Token can be validated by any service
   - No shared session store needed
   - Easier service-to-service communication

---

## Architecture Components

### Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          FRONTEND                                │
│  ┌────────────────┐    ┌────────────────┐    ┌────────────────┐│
│  │ Login Form     │    │ Auth Service   │    │ Local Storage  ││
│  │ (React)        │───▶│ (API calls)    │───▶│ (Token Store)  ││
│  └────────────────┘    └────────────────┘    └────────────────┘│
│           │                     │                      │         │
└───────────┼─────────────────────┼──────────────────────┼─────────┘
            │                     │                      │
            │ HTTP POST           │ Authorization:       │
            │ /api/auth/login     │ Bearer <token>       │
            ▼                     ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                          BACKEND                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Spring Security Filter Chain                   │ │
│  │  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │ │
│  │  │ CORS Filter  │───▶│ JWT Filter   │───▶│ Auth Filter  │ │ │
│  │  └──────────────┘    └──────────────┘    └──────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│           │                     │                      │         │
│  ┌────────▼─────────┐  ┌───────▼────────┐  ┌─────────▼───────┐ │
│  │ AuthController   │  │ JwtUtil        │  │ UserRepository  │ │
│  │ (REST endpoints) │  │ (Token ops)    │  │ (Database)      │ │
│  └──────────────────┘  └────────────────┘  └─────────────────┘ │
│           │                     │                      │         │
│  ┌────────▼─────────┐  ┌───────▼────────┐  ┌─────────▼───────┐ │
│  │ AuthService      │  │ SecurityConfig │  │ PostgreSQL DB   │ │
│  │ (Business logic) │  │ (Config)       │  │ (users table)   │ │
│  └──────────────────┘  └────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Purpose | Key Operations |
|-----------|---------|----------------|
| **Frontend Auth Service** | Handle authentication UI flow | Send login request, store token, attach token to requests |
| **AuthController** | REST API endpoints for auth | Receive credentials, return JWT token, validate requests |
| **AuthService** | Business logic layer | Validate credentials, generate tokens, refresh tokens |
| **JwtUtil** | JWT token operations | Create tokens, validate tokens, extract claims |
| **JwtAuthenticationFilter** | Automatic request filtering | Intercept requests, validate tokens, set security context |
| **SecurityConfig** | Spring Security configuration | Define public/protected routes, configure CORS, setup BCrypt |
| **UserRepository** | Database access layer | Query users by email, check existence, save users |
| **PostgreSQL** | Persistent storage | Store user credentials (hashed passwords) |

---

## Authentication Flow

### 1. Registration Flow

**Step-by-Step Process:**

```
User                Frontend            AuthController      AuthService         Database
 │                     │                      │                 │                  │
 │  Fill Form          │                      │                 │                  │
 ├────────────────────▶│                      │                 │                  │
 │                     │                      │                 │                  │
 │                     │  POST /api/auth/register              │                  │
 │                     ├─────────────────────▶│                 │                  │
 │                     │  {fullName, email,   │                 │                  │
 │                     │   password}          │                 │                  │
 │                     │                      │                 │                  │
 │                     │                      │  Validate Data  │                  │
 │                     │                      ├────────────────▶│                  │
 │                     │                      │                 │                  │
 │                     │                      │                 │  Check Email     │
 │                     │                      │                 ├─────────────────▶│
 │                     │                      │                 │  (exists?)       │
 │                     │                      │                 │◀─────────────────┤
 │                     │                      │                 │  false           │
 │                     │                      │                 │                  │
 │                     │                      │                 │  Hash Password   │
 │                     │                      │                 │  (BCrypt)        │
 │                     │                      │                 │                  │
 │                     │                      │                 │  Save User       │
 │                     │                      │                 ├─────────────────▶│
 │                     │                      │                 │◀─────────────────┤
 │                     │                      │                 │  User saved      │
 │                     │                      │                 │                  │
 │                     │                      │  Generate JWT   │                  │
 │                     │                      │◀────────────────┤                  │
 │                     │  HTTP 201 Created    │                 │                  │
 │                     │◀─────────────────────┤                 │                  │
 │                     │  {token, user info}  │                 │                  │
 │                     │                      │                 │                  │
 │  Store Token        │                      │                 │                  │
 │◀────────────────────┤                      │                 │                  │
 │  (localStorage)     │                      │                 │                  │
 │                     │                      │                 │                  │
 │  Redirect to Home   │                      │                 │                  │
 │◀────────────────────┤                      │                 │                  │
```

**Key Steps:**

1. **Frontend**: User submits registration form
2. **Validation**: Spring Boot validates input (email format, password strength)
3. **Duplicate Check**: AuthService checks if email already exists
4. **Password Hashing**: BCrypt hashes password with 12 rounds
5. **Database Save**: User record saved with hashed password
6. **Token Generation**: JWT token created with user info
7. **Response**: Token sent back to frontend with 201 Created
8. **Storage**: Frontend stores token in localStorage
9. **Redirect**: User automatically redirected to protected page

### 2. Login Flow

**Step-by-Step Process:**

```
User                Frontend            AuthController      AuthService         Database
 │                     │                      │                 │                  │
 │  Enter Credentials  │                      │                 │                  │
 ├────────────────────▶│                      │                 │                  │
 │                     │                      │                 │                  │
 │                     │  POST /api/auth/login│                 │                  │
 │                     ├─────────────────────▶│                 │                  │
 │                     │  {email, password}   │                 │                  │
 │                     │                      │                 │                  │
 │                     │                      │  Authenticate   │                  │
 │                     │                      ├────────────────▶│                  │
 │                     │                      │                 │                  │
 │                     │                      │                 │  Find User       │
 │                     │                      │                 ├─────────────────▶│
 │                     │                      │                 │  (by email)      │
 │                     │                      │                 │◀─────────────────┤
 │                     │                      │                 │  User found      │
 │                     │                      │                 │                  │
 │                     │                      │                 │  Verify Password │
 │                     │                      │                 │  (BCrypt.matches)│
 │                     │                      │                 │                  │
 │                     │                      │  Generate JWT   │                  │
 │                     │                      │◀────────────────┤                  │
 │                     │  HTTP 200 OK         │                 │                  │
 │                     │◀─────────────────────┤                 │                  │
 │                     │  {token, user info}  │                 │                  │
 │                     │                      │                 │                  │
 │  Store Token        │                      │                 │                  │
 │◀────────────────────┤                      │                 │                  │
 │  (localStorage)     │                      │                 │                  │
 │                     │                      │                 │                  │
 │  Redirect to Home   │                      │                 │                  │
 │◀────────────────────┤                      │                 │                  │
```

**Key Steps:**

1. **Frontend**: User submits login form
2. **Request**: POST to `/api/auth/login` with credentials
3. **User Lookup**: AuthService finds user by email
4. **Password Verification**: BCrypt compares hashed passwords
5. **Token Generation**: JWT created with user claims (email, name)
6. **Response**: Token sent with 200 OK status
7. **Storage**: Frontend stores token in localStorage
8. **Redirect**: User redirected to protected homepage

### 3. Protected Request Flow

**Step-by-Step Process:**

```
User                Frontend            JWT Filter          Controller          Service
 │                     │                      │                 │                  │
 │  Click "Profile"    │                      │                 │                  │
 ├────────────────────▶│                      │                 │                  │
 │                     │                      │                 │                  │
 │                     │  GET /api/user/profile                │                  │
 │                     │  Authorization: Bearer <token>        │                  │
 │                     ├─────────────────────▶│                 │                  │
 │                     │                      │                 │                  │
 │                     │                      │  Extract Token  │                  │
 │                     │                      │  from Header    │                  │
 │                     │                      │                 │                  │
 │                     │                      │  Validate Token │                  │
 │                     │                      │  (JwtUtil)      │                  │
 │                     │                      │                 │                  │
 │                     │                      │  Set Security   │                  │
 │                     │                      │  Context        │                  │
 │                     │                      │                 │                  │
 │                     │                      │  Continue Chain │                  │
 │                     │                      ├────────────────▶│                  │
 │                     │                      │                 │                  │
 │                     │                      │                 │  Get User Data   │
 │                     │                      │                 ├─────────────────▶│
 │                     │                      │                 │◀─────────────────┤
 │                     │  HTTP 200 OK         │                 │  User profile    │
 │                     │◀─────────────────────┴─────────────────┤                  │
 │                     │  {profile data}      │                 │                  │
 │                     │                      │                 │                  │
 │  Display Profile    │                      │                 │                  │
 │◀────────────────────┤                      │                 │                  │
```

**Key Steps:**

1. **Frontend**: Attach token to Authorization header
2. **JWT Filter**: Intercepts request automatically
3. **Token Extraction**: Parse "Bearer <token>" from header
4. **Validation**: Check signature and expiration
5. **Security Context**: Set authenticated user in Spring Security
6. **Controller**: Process request with user context available
7. **Response**: Return protected data
8. **Frontend**: Display data to authenticated user

---

## JWT Token Structure

### Token Anatomy

A JWT consists of three parts separated by dots (`.`):

```
eyJhbGciOiJIUzUxMiJ9.eyJmdWxsTmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwic3ViIjoiam9obkBleGFtcGxlLmNvbSIsImlhdCI6MTczMDAwMDAwMCwiZXhwIjoxNzMwMDg2NDAwfQ.Jf36POk6yJI-J0kH-8SBjbCH0H8B9_P6iW4V3w8_YlQ
```

**Parts:**
1. **Header** (red): Algorithm and token type
2. **Payload** (purple): User data and claims
3. **Signature** (green): Cryptographic signature

### Decoded Token Example

**Header:**
```json
{
  "alg": "HS512",
  "typ": "JWT"
}
```

**Payload (Claims):**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "sub": "john@example.com",
  "iat": 1730000000,
  "exp": 1730086400
}
```

**Signature:**
```
HMACSHA512(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

### Claim Explanations

| Claim | Type | Description | Example |
|-------|------|-------------|---------|
| `sub` | Standard | Subject (user identifier) | "john@example.com" |
| `iat` | Standard | Issued At timestamp | 1730000000 |
| `exp` | Standard | Expiration timestamp | 1730086400 |
| `fullName` | Custom | User's full name | "John Doe" |
| `email` | Custom | User's email address | "john@example.com" |

---

## Security Mechanisms

### 1. Password Security

**BCrypt Hashing:**
- **Algorithm**: BCrypt with 12 rounds
- **Salt**: Automatically generated per password
- **One-Way**: Cannot reverse hash to get password
- **Slow by Design**: Resistant to brute-force attacks

**Example:**
```java
// Plain password
String password = "SecurePass123!";

// BCrypt hash (60 characters)
String hash = "$2a$12$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

// Verification
boolean isValid = passwordEncoder.matches(password, hash); // true
```

**Why BCrypt?**
- Industry standard for password hashing
- Configurable work factor (rounds)
- Built-in salt prevents rainbow table attacks
- Slow enough to deter brute-force, fast enough for users

### 2. Token Security

**Secret Key:**
- Minimum 256-bit key for HS512 algorithm
- Stored in `application.properties` (should use environment variable in production)
- Never exposed to clients
- Used to sign and verify tokens

**Token Expiration:**
- Default: 24 hours (86400000 ms)
- Configurable via `jwt.expiration` property
- Prevents indefinite token reuse
- Requires periodic re-authentication

**Token Validation Checklist:**
1. ✅ Signature is valid (not tampered)
2. ✅ Token not expired (exp claim)
3. ✅ Issuer is correct (optional)
4. ✅ Email matches claimed user

### 3. CORS Security

**Configuration:**
```java
// Allow frontend origin
allowedOrigins: "http://localhost:3002"

// Allow credentials (cookies, authorization headers)
allowCredentials: true

// Allowed HTTP methods
allowedMethods: GET, POST, PUT, DELETE, OPTIONS

// Allowed headers
allowedHeaders: Authorization, Content-Type
```

**Why CORS?**
- Prevents unauthorized cross-origin requests
- Protects against CSRF attacks
- Allows controlled frontend-backend communication

### 4. Stateless Sessions

**Session Management:**
```java
.sessionManagement(session -> session
    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
)
```

**Benefits:**
- No session data stored on server
- No session fixation attacks
- Horizontal scalability (no shared session store)
- Reduced server memory usage

---

## Authorization Levels

### Endpoint Protection

The application defines three levels of access:

**1. Public Endpoints (No Authentication Required):**
```java
.requestMatchers("/api/auth/login").permitAll()
.requestMatchers("/api/auth/register").permitAll()
.requestMatchers("/api/auth/health").permitAll()
```

Anyone can access these without a token.

**2. Authenticated Endpoints (Valid Token Required):**
```java
.requestMatchers("/api/user/**").authenticated()
```

Requires a valid JWT token in Authorization header.

**3. Role-Based Endpoints (Specific Role Required):**
```java
.requestMatchers("/api/admin/**").hasRole("ADMIN")
```

Requires authentication AND specific role (future enhancement).

### Security Context

After successful authentication, user info is available via:

```java
// In controllers or services
Authentication auth = SecurityContextHolder.getContext().getAuthentication();
String email = auth.getName();  // User email
UserDetails user = (UserDetails) auth.getPrincipal();
```

This allows controllers to access authenticated user information without manual token parsing.

---

## Error Handling

### HTTP Status Codes

| Status | Scenario | Response |
|--------|----------|----------|
| **200 OK** | Successful login | `{success: true, token: "...", userId: 1}` |
| **201 Created** | Successful registration | `{success: true, token: "...", userId: 2}` |
| **400 Bad Request** | Invalid input data | `{success: false, message: "Invalid email format"}` |
| **401 Unauthorized** | Invalid credentials | `{success: false, message: "Invalid email or password"}` |
| **409 Conflict** | Duplicate email | `{success: false, message: "Email already registered"}` |
| **500 Server Error** | Unexpected error | `{success: false, message: "Internal server error"}` |

### Token Errors

**Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "timestamp": "2025-10-26T10:30:00"
}
```

**Missing Token:**
- Request proceeds but user is unauthenticated
- Protected endpoints return 401 Unauthorized
- Public endpoints still accessible

**Expired Token:**
```json
{
  "success": false,
  "message": "Token has expired",
  "timestamp": "2025-10-26T10:30:00"
}
```

**Malformed Token:**
- JwtUtil throws exception
- Filter catches and clears security context
- Request continues as unauthenticated

---

## Configuration Files

### Application Properties

**Location:** `backend/registration-form-api/src/main/resources/application.properties`

```properties
# JWT Configuration
jwt.secret=registrationFormSecretKeyThatIsVeryLongAndSecure123456789
jwt.expiration=86400000

# Server Configuration
server.port=8081

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/registration_form_db
spring.datasource.username=postgres
spring.datasource.password=postgres

# Security Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### Environment Variables (Production)

For production, use environment variables:

```bash
# JWT settings
JWT_SECRET=your-production-secret-key-here
JWT_EXPIRATION=86400000

# Database settings
DB_URL=jdbc:postgresql://prod-db:5432/registration_form_db
DB_USERNAME=app_user
DB_PASSWORD=secure_password
```

---

## Best Practices

### Implementation Guidelines

**1. Token Storage:**
- ✅ Store in localStorage for web apps
- ✅ Store in secure storage for mobile apps
- ❌ Never log tokens in console
- ❌ Never store in URL parameters

**2. Token Transmission:**
- ✅ Always use Authorization header
- ✅ Use Bearer prefix: `Bearer <token>`
- ✅ Use HTTPS in production
- ❌ Never send token in URL query params

**3. Secret Key Management:**
- ✅ Use environment variables in production
- ✅ Minimum 256-bit key for HS512
- ✅ Rotate keys periodically
- ❌ Never commit secrets to version control

**4. Password Handling:**
- ✅ Always hash with BCrypt
- ✅ Use strong password validation
- ✅ Never log passwords
- ❌ Never store plain-text passwords

**5. Error Messages:**
- ✅ Use generic messages for auth failures
- ✅ Log detailed errors server-side
- ❌ Don't reveal if email exists (timing attacks)
- ❌ Don't expose stack traces to clients

---

## Testing Strategy

### Test Coverage

**1. Unit Tests:**
- JwtUtil token generation/validation
- BCrypt password encoding/matching
- AuthService business logic

**2. Integration Tests:**
- Full registration flow
- Full login flow
- Token refresh flow

**3. E2E Tests (Playwright):**
- User registration journey
- User login journey
- Protected route access
- Token expiration handling

**4. Security Tests:**
- Invalid token handling
- Expired token handling
- Missing token handling
- CORS validation

### Test Fixtures

**Location:** `tests/fixtures/test-users.ts`

```typescript
export const testUsers = {
  validUser: {
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'TestPass123!',
    userId: 1
  },

  invalidPassword: {
    email: 'test@example.com',
    password: 'WrongPassword123!'
  }
};
```

---

## Future Enhancements

### Planned Features

**1. Role-Based Access Control (RBAC):**
```sql
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'USER';
```

**2. Refresh Tokens:**
- Separate short-lived access tokens (15 min)
- Long-lived refresh tokens (7 days)
- Refresh endpoint to get new access token

**3. Email Verification:**
```sql
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);
```

**4. Password Reset:**
- Forgot password endpoint
- Email-based password reset flow
- Time-limited reset tokens

**5. OAuth2 Integration:**
- Google Sign-In
- GitHub Sign-In
- Social authentication providers

**6. Multi-Factor Authentication (MFA):**
- TOTP (Time-based One-Time Password)
- SMS verification
- Email verification codes

---

## Troubleshooting

### Common Issues

**1. Token Not Working:**
```bash
# Check token in browser console
localStorage.getItem('token')

# Verify token format
# Should start with: eyJhbGciOiJIUzUxMiJ9...
```

**2. CORS Errors:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Check `CorsConfig.java` allows frontend origin:
```java
.allowedOrigins("http://localhost:3002")
```

**3. 401 Unauthorized on Protected Routes:**
- Check token exists in localStorage
- Verify token not expired
- Confirm Authorization header format: `Bearer <token>`

**4. BCrypt Password Not Matching:**
- Ensure password encoder strength matches (12 rounds)
- Check password string encoding (UTF-8)
- Verify no extra whitespace in password

---

## Architecture Decisions

### Why These Choices?

**1. JWT over Sessions:**
- **Decision**: Use JWT for authentication
- **Rationale**: Stateless architecture, better scalability, mobile-friendly
- **Trade-offs**: Cannot revoke tokens before expiration (mitigated by short expiry)

**2. BCrypt over Other Hash Functions:**
- **Decision**: Use BCrypt with 12 rounds
- **Rationale**: Industry standard, built-in salt, configurable work factor
- **Trade-offs**: Slower than SHA256 (but that's a security feature)

**3. localStorage for Token Storage:**
- **Decision**: Store JWT in browser localStorage
- **Rationale**: Simple, persistent across sessions, accessible to JavaScript
- **Trade-offs**: Vulnerable to XSS attacks (mitigated by React's XSS protection)

**4. Email as Primary Identifier:**
- **Decision**: Use email instead of username
- **Rationale**: More user-friendly, unique, useful for communication
- **Trade-offs**: Harder to change (requires additional logic)

**5. 24-Hour Token Expiration:**
- **Decision**: Set default expiry to 24 hours
- **Rationale**: Balance between security and UX (not too frequent re-login)
- **Trade-offs**: Longer exposure if token stolen (planned refresh token feature)

---

## Related Documentation

- [Database Schema Reference](../reference/database-schema.md) - User table structure
- [API Endpoints Reference](../reference/api-endpoints.md) - Authentication endpoints
- [Protected Routes Architecture](./protected-routes-architecture.md) - Frontend route protection
- [Getting Started Tutorial](../tutorials/getting-started.md) - Setup authentication

---

**Last Updated:** 2025-10-26
