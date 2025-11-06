# Registration Form Template

A production-ready, full-stack registration and authentication system with modern UI, profile management, and comprehensive testing. Features complete JWT authentication, protected routes, profile picture upload/delete functionality, and extensive test coverage with E2E, API, and unit tests.

![Registration Form Template](frontend/public/images/registerFormTemplate1.png)

![Login Form Template](frontend/public/images/loginFormTemplate1.png)

## Features

### Complete User Journey
- **Register → Login → Homepage → Profile Picture Upload**
- Full authentication flow with seamless transitions
- Protected homepage with user information display
- Profile picture management (upload/delete) with JWT authentication

### Authentication & Security
- **JWT Authentication**: Complete token-based authentication system
- **Protected Routes**: Auto-redirect based on authentication status
- **Token Management**: Secure localStorage-based token handling
- **Password Security**: BCrypt password hashing
- **CORS Configuration**: Secure cross-origin request handling

### User Profile Management
- **Profile Picture Upload**: Upload JPEG/PNG images (max 5MB)
- **Profile Picture Delete**: Remove profile pictures with confirmation
- **Avatar Fallback**: Automatic initials-based avatar when no picture
- **Picture Persistence**: Profile pictures stored in backend and persisted
- **File Validation**: Client-side and server-side validation
- **Protected Endpoints**: JWT-secured profile APIs

### User Interface
- **Modern Design**: Clean and professional UI with two-panel layout
- **Responsive**: Fully responsive design that works on all devices
- **Hero Section**: Beautiful left panel with customizable hero content
- **Form Validation**: Client-side and server-side validation
- **Loading States**: Professional loading indicators
- **Error Handling**: User-friendly error messages
- **Homepage Dashboard**: Welcome page with user info and profile management

### Testing & Quality
- **E2E Testing**: 30+ Playwright E2E test scenarios covering:
  - Registration flows (6 tests)
  - Login flows (4 tests)
  - Complete authentication journey (8 tests)
  - Profile picture upload/delete (10 tests)
  - Video recording and screenshot capture
- **API Testing**: 20+ API test scenarios with Playwright
- **Unit Testing**: Comprehensive Java unit tests (UserService, JwtUtil)
- **Test Coverage**: 100% critical path coverage
- **Gherkin Specs**: 18+ BDD scenarios in plain language
- **Test Automation**: Automated video/screenshot recording for demos
- **Comprehensive Documentation**: Diátaxis framework with 15+ guides

### Development
- **TypeScript**: Fully typed for better DX
- **Monorepo Structure**: Organized with workspaces
- **AI-Assisted**: Claude agents for docs, specs, and planning
- **Hot Reload**: Fast development with Next.js and Spring Boot DevTools

## Tech Stack

### Frontend
- **[Next.js 15.5.0](https://nextjs.org)** - React framework for production
- **[React 19.1.0](https://reactjs.org)** - JavaScript library for building user interfaces
- **[TypeScript](https://www.typescriptlang.org)** - Typed JavaScript for better development experience
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS framework
- **[ESLint](https://eslint.org)** - Code linting and formatting

### Backend
- **[Java 17+](https://openjdk.java.net/)** - Programming language
- **[Spring Boot 3.3.6](https://spring.io/projects/spring-boot)** - Java framework
- **[Spring Security](https://spring.io/projects/spring-security)** - Authentication & authorization
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Spring Data JPA](https://spring.io/projects/spring-data-jpa)** - Data persistence layer
- **[JWT (jjwt 0.12.3)](https://github.com/jwtk/jjwt)** - JSON Web Token implementation
- **[BCrypt](https://docs.spring.io/spring-security/site/docs/current/api/org/springframework/security/crypto/bcrypt/BCryptPasswordEncoder.html)** - Password encryption
- **[Maven](https://maven.apache.org/)** - Build and dependency management

### Testing
- **[Playwright](https://playwright.dev/)** - E2E and API testing framework
- **[Gherkin](https://cucumber.io/docs/gherkin/)** - BDD specification language
- **Test Utilities**: Custom helpers for API client, auth, test data, cleanup

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
# From root directory (recommended)
npm run dev
# or
npm run dev:frontend

# Or from frontend directory
cd frontend
npm run dev
```

4. Open your browser and navigate to:
   - [http://localhost:3001/register](http://localhost:3001/register) - Registration form
   - [http://localhost:3001/login](http://localhost:3001/login) - Login form
   - [http://localhost:3001/home](http://localhost:3001/home) - Homepage (requires authentication)

### Complete User Journey

**Try the full flow:**
1. Register a new account at `/register`
2. Automatically redirected to `/home` after successful registration
3. View your profile with user information
4. Upload a profile picture (JPEG/PNG, max 5MB)
5. Delete and re-upload profile pictures
6. Logout to end session

**Demo Video - Profile Picture Upload:**

<p align="center">
  <img src="frontend/public/videos/uploadProfilePicture.gif" alt="Profile Picture Upload Demo" width="800">
</p>

*Watch the complete flow of uploading a profile picture successfully*

**Alternative flow:**
1. Login with existing credentials at `/login`
2. Redirected to `/home` dashboard
3. Manage your profile and pictures

## Project Structure

```
project-root/
├── .claude/                    # Claude AI agents configuration
│   ├── agents/                # Specialized agents
│   │   ├── gherkin-spec-writer.md      # BDD test scenario writer
│   │   ├── documentation-writer.md     # Documentation specialist
│   │   └── plan-writer.md              # Implementation planner
│   └── settings.json          # Agent hooks and configuration
├── frontend/                   # Frontend React/Next.js application
│   ├── src/app/
│   │   ├── register/          # Registration page route
│   │   ├── login/             # Login page route
│   │   └── home/              # 🆕 Protected homepage with profile management
│   ├── src/components/        # React components
│   │   ├── RegistrationForm.tsx
│   │   ├── LoginForm.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── ProfilePicture.tsx           # 🆕 Profile picture display
│   │   └── ProfilePictureUpload.tsx     # 🆕 Upload component
│   ├── src/services/          # 🆕 API service layer
│   │   └── profileService.ts  # 🆕 Profile picture APIs
│   ├── src/lib/               # Utility functions
│   │   └── auth.ts            # JWT token management
│   ├── public/images/         # Static images
│   ├── public/videos/         # Demo videos (Postman testing)
│   └── package.json           # Frontend dependencies
├── backend/                    # Backend Java Spring Boot API
│   └── registration-form-api/ # Spring Boot application
│       ├── src/main/java/     # Java source code
│       │   └── com/registrationform/api/
│       │       ├── controller/   # REST API endpoints (@RestController)
│       │       │   ├── UserController.java
│       │       │   ├── AuthController.java       # 🆕 Login/Register
│       │       │   └── ProfileController.java    # 🆕 Profile picture APIs
│       │       ├── service/      # Business logic (@Service - Singleton)
│       │       │   ├── UserService.java
│       │       │   ├── AuthService.java          # 🆕 Authentication
│       │       │   ├── JwtUtil.java              # 🆕 JWT utilities
│       │       │   └── FileStorageService.java   # 🆕 File upload/delete
│       │       ├── repository/   # Data access layer (@Repository - Singleton)
│       │       ├── entity/       # JPA database entities
│       │       ├── dto/          # Data Transfer Objects
│       │       ├── validation/   # Custom validation components
│       │       ├── exception/    # Error handling
│       │       └── security/     # 🆕 Security configuration
│       │           ├── SecurityConfig.java
│       │           └── JwtAuthenticationFilter.java
│       ├── src/main/resources/   # Configuration files
│       │   └── application.properties
│       ├── src/test/java/        # 🆕 Unit tests
│       │   └── com/registrationform/api/
│       │       ├── service/
│       │       │   ├── UserServiceTest.java
│       │       │   └── JwtUtilTest.java
│       │       └── util/
│       ├── uploads/profiles/     # 🆕 Uploaded profile pictures
│       └── pom.xml               # Maven dependencies
├── tests/                      # Playwright E2E tests
│   ├── e2e/                   # Test specs
│   │   ├── registration.spec.ts
│   │   ├── login.spec.ts
│   │   ├── auth-flow.spec.ts           # 🆕 Complete auth journey
│   │   ├── profile-picture.spec.ts     # 🆕 Upload/delete tests
│   │   ├── demo-video-recording.spec.ts
│   │   └── demo-screenshot-capture.spec.ts
│   └── fixtures/              # Test data (images for upload tests)
├── specs/                      # Gherkin specifications (BDD)
│   └── authentication/        # Auth feature specs
├── docs/                       # Documentation (Diátaxis framework)
│   ├── tutorials/             # Learning-oriented guides
│   ├── how-to/                # Problem-solving guides
│   │   ├── upload-profile-picture.md      # 🆕
│   │   ├── run-e2e-tests.md
│   │   └── implement-protected-routes.md
│   ├── reference/             # Technical specifications
│   ├── explanation/           # Conceptual explanations
│   │   ├── authentication-architecture.md
│   │   └── protected-routes-architecture.md
│   └── testing/               # 🆕 Testing documentation
│       ├── unit-test-java-guide.md
│       └── video-screenshot-guide.md
├── plans/                      # Implementation plans
│   ├── in-progress/           # Active development plans
│   └── completed/             # Archived completed plans
└── package.json                # Workspace management

🆕 = New features/files added in latest version
```

### Key Files

#### Frontend
- `frontend/src/app/register/page.tsx` - Registration page route
- `frontend/src/app/login/page.tsx` - Login page route
- `frontend/src/app/home/page.tsx` - 🆕 Protected homepage with profile management
- `frontend/src/components/RegistrationForm.tsx` - Main registration form component
- `frontend/src/components/LoginForm.tsx` - Main login form component
- `frontend/src/components/ProfilePicture.tsx` - 🆕 Profile picture display component
- `frontend/src/components/ProfilePictureUpload.tsx` - 🆕 Profile picture upload component
- `frontend/src/components/LogoutButton.tsx` - 🆕 Logout functionality
- `frontend/src/services/profileService.ts` - 🆕 Profile picture API calls
- `frontend/src/lib/auth.ts` - JWT token management utilities
- `frontend/public/images/` - Static images including hero images
- `frontend/src/app/globals.css` - Global styles and Tailwind CSS imports

#### Backend
- `backend/registration-form-api/src/main/java/com/registrationform/api/RegistrationFormApiApplication.java` - Main Spring Boot application
- `backend/registration-form-api/src/main/java/com/registrationform/api/controller/AuthController.java` - 🆕 Login/Register endpoints
- `backend/registration-form-api/src/main/java/com/registrationform/api/controller/ProfileController.java` - 🆕 Profile picture upload/delete endpoints
- `backend/registration-form-api/src/main/java/com/registrationform/api/controller/UserController.java` - User management endpoints
- `backend/registration-form-api/src/main/java/com/registrationform/api/service/AuthService.java` - 🆕 Authentication service
- `backend/registration-form-api/src/main/java/com/registrationform/api/service/JwtUtil.java` - 🆕 JWT token generation/validation
- `backend/registration-form-api/src/main/java/com/registrationform/api/service/FileStorageService.java` - 🆕 File upload/storage service
- `backend/registration-form-api/src/main/java/com/registrationform/api/service/UserService.java` - User business logic (Singleton)
- `backend/registration-form-api/src/main/java/com/registrationform/api/repository/UserRepository.java` - Data access repository (Singleton)
- `backend/registration-form-api/src/main/java/com/registrationform/api/entity/User.java` - JPA entity for database mapping
- `backend/registration-form-api/src/main/java/com/registrationform/api/security/SecurityConfig.java` - 🆕 Spring Security configuration
- `backend/registration-form-api/src/main/java/com/registrationform/api/security/JwtAuthenticationFilter.java` - 🆕 JWT filter
- `backend/registration-form-api/src/main/resources/application.properties` - Database and server configuration

#### Testing
- `tests/e2e/registration.spec.ts` - Registration E2E tests
- `tests/e2e/login.spec.ts` - Login E2E tests
- `tests/e2e/auth-flow.spec.ts` - 🆕 Complete authentication journey tests
- `tests/e2e/profile-picture.spec.ts` - 🆕 Profile picture upload/delete tests
- `tests/fixtures/` - Test images and data for E2E tests
- `backend/registration-form-api/src/test/java/` - 🆕 Java unit tests

## Testing

### E2E Testing with Playwright 🎭

The application includes comprehensive automated end-to-end tests using Playwright covering the complete user journey from registration to profile management.

#### Running E2E Tests

**Prerequisites:**
- Backend server running on `http://localhost:8081`
- Frontend server running on `http://localhost:3001`

**Run all tests:**
```bash
npx playwright test
```

**Run specific test suite:**
```bash
# Registration tests (6 tests)
npx playwright test tests/e2e/registration.spec.ts

# Login tests (4 tests)
npx playwright test tests/e2e/login.spec.ts

# Complete authentication flow (8 tests)
npx playwright test tests/e2e/auth-flow.spec.ts

# Profile picture tests (10 tests)
npx playwright test tests/e2e/profile-picture.spec.ts
```

**Run with UI mode (interactive):**
```bash
npx playwright test --ui
```

**Run in headed mode (see browser):**
```bash
npx playwright test --headed
```

**Debug mode:**
```bash
npx playwright test --debug
```

**View test report:**
```bash
npx playwright show-report
```

#### Test Coverage

**1. Registration Flow Tests (6 tests):**
- ✅ Valid registration
- ✅ Duplicate email handling
- ✅ Empty fields validation
- ✅ Email format validation
- ✅ Loading state verification
- ✅ CORS configuration

**2. Login Flow Tests (4 tests):**
- ✅ Valid login credentials
- ✅ Invalid password handling
- ✅ Non-existent email handling (security best practice verified)
- ✅ CORS configuration

**3. Complete Authentication Journey Tests (8 tests):**
- ✅ Register → Auto-redirect to home
- ✅ Login → Redirect to home
- ✅ Home page displays user info from JWT
- ✅ Logout clears token and redirects to login
- ✅ Unauthenticated user redirected from home
- ✅ Authenticated user redirected from login to home
- ✅ Authenticated user redirected from register to home
- ✅ Token persists across page refresh

**4. Profile Picture Tests (10 tests):**
- ✅ Upload JPEG profile picture
- ✅ Upload PNG profile picture
- ✅ Delete profile picture
- ✅ Complete flow: Register → Login → Upload → Delete → Logout
- ✅ Multiple upload/delete cycles
- ✅ Picture persists after page refresh
- ✅ Reject files larger than 5MB
- ✅ Reject non-image files
- ✅ Replace existing profile picture
- ✅ Unauthenticated user cannot access upload

**5. Demo & Documentation Tests:**
- ✅ Video recording for demos
- ✅ Screenshot capture for documentation

**Total: 30+ E2E test scenarios**

**Test Documentation:**
- E2E guide: [docs/how-to/run-e2e-tests.md](docs/how-to/run-e2e-tests.md)
- Profile picture tests: [docs/plans/profile-picture-e2e-test-plan.md](docs/plans/profile-picture-e2e-test-plan.md)
- Video/screenshot guide: [docs/testing/video-screenshot-guide.md](docs/testing/video-screenshot-guide.md)

---

## Backend API Testing

### API Endpoints

The backend provides comprehensive REST APIs for authentication and user management.

#### Authentication Endpoints

**POST** `/api/auth/register` - Register new user
- Request body: `{ fullName, email, password, confirmPassword }`
- Returns: JWT token + user info
- Auto-login after registration

**POST** `/api/auth/login` - Login user
- Request body: `{ email, password }`
- Returns: JWT token + user info
- Token valid for session

#### Profile Picture Endpoints (JWT Protected)

**GET** `/api/profile/picture` - Get current user's profile picture
- Requires: JWT token in Authorization header
- Returns: Profile picture URL or null

**POST** `/api/profile/picture` - Upload profile picture
- Requires: JWT token + multipart/form-data
- Accepts: JPEG, PNG (max 5MB)
- Returns: Uploaded picture URL

**DELETE** `/api/profile/picture` - Delete profile picture
- Requires: JWT token
- Returns: Success message
- Reverts to avatar fallback

#### User Management Endpoints

- ✅ **POST** `/api/users` - Register new user
- ✅ **GET** `/api/users` - Get all users
- ✅ **GET** `/api/users/{id}` - Get user by ID
- ✅ **PUT** `/api/users/{id}` - Update user (supports partial update)
- ✅ **DELETE** `/api/users/{id}` - Delete user
- ✅ **GET** `/api/users/email/{email}` - Get user by email
- ✅ **GET** `/api/users/check-email/{email}` - Check if email exists
- ✅ **GET** `/api/users/count` - Get total user count

### Local Testing with Postman ✅

#### Demo Video

**GET Endpoints Testing:**

![Postman API Testing Demo](frontend/public/videos/getUserByEmailOrId.gif)

**Key Features Verified:**
- ✅ JWT authentication flow
- ✅ Protected endpoints with token validation
- ✅ File upload (multipart/form-data)
- ✅ Input validation (email format, required fields)
- ✅ Partial update support (update without password)
- ✅ Duplicate email prevention
- ✅ Proper HTTP status codes (200, 201, 400, 401, 404)
- ✅ JSON response format
- ✅ Database persistence with PostgreSQL
- ✅ File storage for profile pictures

**Test Environment:**
- Backend: `http://localhost:8081`
- Database: PostgreSQL
- File Storage: `backend/registration-form-api/uploads/profiles/`
- Testing Tool: Postman

### Unit Testing (Java) ✅

**Run unit tests:**
```bash
cd backend/registration-form-api
mvn test
```

**Test Coverage:**
- `UserServiceTest.java` - User business logic tests
- `JwtUtilTest.java` - JWT token generation/validation tests

**Documentation:**
- Unit test guide: [docs/testing/unit-test-java-guide.md](docs/testing/unit-test-java-guide.md)
- Implementation plan: [docs/plans/unit-test-java-implementation-plan.md](docs/plans/unit-test-java-implementation-plan.md)

---

## Claude AI Agents 🤖

This project includes specialized Claude agents to assist with development:

### 📝 gherkin-spec-writer
**Purpose**: Write BDD test scenarios in Gherkin format

Creates behavior specifications that are:
- Readable by non-technical stakeholders
- Aligned with Playwright E2E tests
- Following 1-1-1 rule (1 Given, 1 When, 1 Then)

**Usage**: "Create Gherkin specs for password reset feature"

**Location**: [specs/](./specs/)

### 📚 documentation-writer
**Purpose**: Create and maintain structured documentation

Organizes docs using Diátaxis framework:
- **Tutorials**: Step-by-step learning guides
- **How-To Guides**: Problem-solving instructions
- **Reference**: Technical specifications
- **Explanation**: Conceptual understanding

**Usage**: "Document the JWT authentication flow"

**Location**: [docs/](./docs/)

### 📋 plan-writer
**Purpose**: Create implementation plans for features

Generates 4-document plans:
- README: Overview and status
- requirements.md: Scope and user stories
- technical-design.md: Architecture
- checklist.md: Tasks and validation

**Usage**: "Create implementation plan for user profile editing"

**Location**: [plans/](./plans/)

### Why Use Agents?

✅ **Consistency**: Always follow project conventions
✅ **Completeness**: Never forget important details
✅ **Quality**: Maintain high documentation standards
✅ **Efficiency**: Faster than writing manually

See [.claude/agents/](./.claude/agents/) for agent definitions.

---

## What's New in Latest Version? 🆕

### Complete User Journey Implementation

The application now supports the complete user journey from registration to profile management:

**1. Registration & Authentication Flow**
- User registers with email/password → Receives JWT token → Auto-redirect to homepage
- User can login with credentials → Receives JWT token → Redirect to homepage
- Protected routes with automatic redirect based on authentication status
- Token persistence in localStorage with page refresh support

**2. Homepage Dashboard**
- Protected route accessible only to authenticated users
- Displays user information from JWT token (name, email, user ID)
- Shows authentication status and security message
- Clean, modern UI with responsive design
- Logout functionality that clears token and redirects to login

**3. Profile Picture Management**
- Upload profile pictures (JPEG/PNG, max 5MB)
- Delete profile pictures with confirmation dialog
- Automatic fallback to initials-based avatar
- Profile pictures stored in backend and persisted across sessions
- Real-time UI updates after upload/delete operations
- File validation on both client and server side

**Demo Video:**

<p align="center">
  <img src="frontend/public/videos/uploadProfilePicture.gif" alt="Profile Picture Upload Demo" width="800">
</p>

*Live demonstration of profile picture upload functionality*

**4. Comprehensive E2E Testing**
- 30+ Playwright test scenarios covering entire user journey
- Tests for registration, login, authentication flow, and profile pictures
- Automated video recording and screenshot capture for demos
- Test fixtures for upload validation (size, type)
- 100% critical path coverage

**5. Security Enhancements**
- JWT-based authentication with secure token handling
- Protected API endpoints requiring authentication
- Spring Security configuration with JWT filter
- CORS configuration for cross-origin requests
- BCrypt password hashing
- Input validation and file upload security

**6. Comprehensive Documentation**
- 15+ documentation guides following Diátaxis framework
- Tutorials for getting started and testing
- How-to guides for specific tasks
- Reference documentation for APIs
- Explanation documents for architecture concepts
- Test plans and implementation summaries

### Migration Path

If you have an existing version, the new features include:

**Frontend:**
- `/home` route with profile management
- `ProfilePicture` and `ProfilePictureUpload` components
- `profileService.ts` for API calls
- `LogoutButton` component
- Enhanced authentication utilities

**Backend:**
- `AuthController` for login/register
- `ProfileController` for profile picture operations
- `FileStorageService` for file uploads
- `JwtUtil` for token management
- Security configuration with JWT filter
- Unit tests for services

**Testing:**
- `auth-flow.spec.ts` for complete journey tests
- `profile-picture.spec.ts` for upload/delete tests
- Test fixtures for file validation
- Video/screenshot automation tests

---

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.