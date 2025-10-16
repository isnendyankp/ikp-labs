# Registration Form Template

A modern, responsive registration form template built with Next.js and Tailwind CSS. This monorepo contains a complete frontend implementation with placeholder for backend development. The frontend provides a clean, professional-looking registration page with a hero section and form layout that's perfect for any web application.

![Registration Form Template](frontend/public/images/registerFormTemplate1.png)

![Login Form Template](frontend/public/images/loginFormTemplate1.png)

## Features

- **Modern Design**: Clean and professional UI with a two-panel layout
- **Responsive**: Fully responsive design that works on all devices
- **Hero Section**: Beautiful left panel with customizable hero content
- **Form Components**: Complete registration form with validation ready fields
- **Google Integration**: Ready-to-use Google sign-up button
- **TypeScript**: Fully typed for better development experience
- **Monorepo Structure**: Organized with separate frontend and backend directories
- **Workspace Management**: NPM workspaces for easy development
- **AI-Assisted Development**: Claude agents for documentation, testing specs, and planning
- **Behavior Documentation**: Gherkin specifications for clear feature behavior
- **Structured Documentation**: Diátaxis framework for organized docs

## Tech Stack

### Frontend
- **[Next.js 15.5.0](https://nextjs.org)** - React framework for production
- **[React 19.1.0](https://reactjs.org)** - JavaScript library for building user interfaces
- **[TypeScript](https://www.typescriptlang.org)** - Typed JavaScript for better development experience
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS framework
- **[ESLint](https://eslint.org)** - Code linting and formatting

### Backend (In Development)
- **[Java 17+](https://openjdk.java.net/)** - Programming language
- **[Spring Boot 3.2+](https://spring.io/projects/spring-boot)** - Java framework for enterprise applications
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Spring Data JPA](https://spring.io/projects/spring-data-jpa)** - Data persistence layer
- **[Maven](https://maven.apache.org/)** - Build and dependency management
- **[Bean Singleton Pattern](https://docs.spring.io/spring-framework/docs/current/reference/html/core.html#beans-factory-scopes-singleton)** - Default Spring scope for component management

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

4. Open [http://localhost:3001/register](http://localhost:3001/register) with your browser to see the registration form.
5. Open [http://localhost:3001/login](http://localhost:3001/login) for the login form.

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
│   ├── src/app/register/      # Registration page route
│   ├── src/app/login/         # Login page route
│   ├── src/components/        # React components
│   ├── public/images/         # Static images
│   ├── public/videos/         # Demo videos (Postman testing)
│   └── package.json           # Frontend dependencies
├── backend/                    # Backend Java Spring Boot API
│   └── registration-form-api/ # Spring Boot application
│       ├── src/main/java/     # Java source code
│       │   └── com/registrationform/api/
│       │       ├── controller/   # REST API endpoints (@RestController)
│       │       ├── service/      # Business logic (@Service - Singleton)
│       │       ├── repository/   # Data access layer (@Repository - Singleton)
│       │       ├── entity/       # JPA database entities
│       │       ├── dto/          # Data Transfer Objects
│       │       ├── validation/   # Custom validation components
│       │       └── exception/    # Error handling
│       ├── src/main/resources/   # Configuration files
│       │   └── application.properties
│       └── pom.xml               # Maven dependencies
├── tests/                      # Playwright E2E tests
│   ├── e2e/                   # Test specs
│   └── fixtures/              # Test data
├── specs/                      # Gherkin specifications (BDD)
│   └── authentication/        # Auth feature specs
├── docs/                       # Documentation (Diátaxis framework)
│   ├── tutorials/             # Learning-oriented guides
│   ├── how-to/                # Problem-solving guides
│   ├── reference/             # Technical specifications
│   └── explanation/           # Conceptual explanations
├── plans/                      # Implementation plans
│   ├── in-progress/           # Active development plans
│   └── completed/             # Archived completed plans
└── package.json                # Workspace management
```

### Key Files

#### Frontend
- `frontend/src/app/register/page.tsx` - Registration page route
- `frontend/src/app/login/page.tsx` - Login page route
- `frontend/src/components/RegistrationForm.tsx` - Main registration form component
- `frontend/src/components/LoginForm.tsx` - Main login form component
- `frontend/public/images/` - Static images including hero images
- `frontend/src/app/globals.css` - Global styles and Tailwind CSS imports

#### Backend (Current Progress: Phase 3 - User Management)
- `backend/registration-form-api/src/main/java/com/registrationform/api/RegistrationFormApiApplication.java` - Main Spring Boot application
- `backend/registration-form-api/src/main/java/com/registrationform/api/controller/UserController.java` - REST API endpoints for user operations
- `backend/registration-form-api/src/main/java/com/registrationform/api/service/UserService.java` - Business logic service (Singleton)
- `backend/registration-form-api/src/main/java/com/registrationform/api/repository/UserRepository.java` - Data access repository (Singleton)
- `backend/registration-form-api/src/main/java/com/registrationform/api/entity/User.java` - JPA entity for database mapping
- `backend/registration-form-api/src/main/java/com/registrationform/api/validation/ValidPassword.java` - Custom password validation annotation
- `backend/registration-form-api/src/main/resources/application.properties` - Database and server configuration
- `backend/BACKEND_PLAN.md` - Detailed backend development plan and progress tracking

## Testing

### E2E Testing with Playwright 🎭

The application includes comprehensive automated end-to-end tests using Playwright for both registration and login flows.

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
# Registration tests
npx playwright test tests/e2e/registration.spec.ts

# Login tests
npx playwright test tests/e2e/login.spec.ts
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

**Registration Flow Tests:**
- ✅ Valid registration
- ✅ Duplicate email handling
- ✅ Empty fields validation
- ✅ Email format validation
- ✅ Loading state verification
- ✅ CORS configuration

**Login Flow Tests:**
- ✅ Valid login credentials
- ✅ Invalid password handling
- ✅ Non-existent email handling (security best practice verified)
- ✅ CORS configuration

**Test Documentation:**
- Complete guide: `tests/README.md`
- Manual testing plans: `backend/docs/TESTING_STEP_5.3.md` & `backend/docs/TESTING_STEP_5.4.md`
- Frontend testing plan: `frontend/docs/FRONTEND_PLAN.md`

---

## Backend API Testing

### Local Testing with Postman ✅

The backend API has been thoroughly tested using Postman on local development environment. All endpoints are working correctly:

#### Demo Video

**GET Endpoints Testing:**

![Postman API Testing Demo](frontend/public/videos/getUserByEmailOrId.gif)

**Tested Endpoints:**
- ✅ **POST** `/api/users` - Register new user
- ✅ **GET** `/api/users` - Get all users
- ✅ **GET** `/api/users/{id}` - Get user by ID
- ✅ **PUT** `/api/users/{id}` - Update user (supports partial update)
- ✅ **DELETE** `/api/users/{id}` - Delete user
- ✅ **GET** `/api/users/email/{email}` - Get user by email
- ✅ **GET** `/api/users/check-email/{email}` - Check if email exists
- ✅ **GET** `/api/users/count` - Get total user count

**Key Features Verified:**
- ✅ Input validation (email format, required fields)
- ✅ Partial update support (update without password)
- ✅ Duplicate email prevention
- ✅ Proper HTTP status codes
- ✅ JSON response format
- ✅ Database persistence with PostgreSQL

**Test Environment:**
- Backend: `http://localhost:8081`
- Database: PostgreSQL
- Testing Tool: Postman

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.