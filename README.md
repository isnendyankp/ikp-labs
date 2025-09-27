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
├── frontend/                    # Frontend React/Next.js application
│   ├── src/app/register/       # Registration page route
│   ├── src/app/login/          # Login page route
│   ├── src/components/         # React components
│   ├── public/images/          # Static images
│   ├── public/videos/          # Demo videos (Postman testing)
│   └── package.json            # Frontend dependencies
├── backend/                     # Backend Java Spring Boot API
│   └── registration-form-api/  # Spring Boot application
│       ├── src/main/java/      # Java source code
│       │   └── com/registrationform/api/
│       │       ├── controller/ # REST API endpoints (@RestController)
│       │       ├── service/    # Business logic (@Service - Singleton)
│       │       ├── repository/ # Data access layer (@Repository - Singleton)
│       │       ├── entity/     # JPA database entities
│       │       ├── dto/        # Data Transfer Objects
│       │       ├── validation/ # Custom validation components
│       │       └── exception/  # Error handling
│       ├── src/main/resources/ # Configuration files
│       │   └── application.properties
│       └── pom.xml            # Maven dependencies
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

## Backend API Testing

### Local Testing with Postman ✅

The backend API has been thoroughly tested using Postman on local development environment. All endpoints are working correctly:

#### Demo Video

**GET Endpoints Testing (14 seconds):**

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.