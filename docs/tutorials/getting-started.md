# Getting Started with Registration Form Template

Welcome! This tutorial will help you set up and run the Registration Form application on your local machine. By the end, you'll have a working full-stack application with user registration and login.

## What You'll Learn

- How to install project dependencies
- How to set up PostgreSQL database
- How to start the backend API server
- How to start the frontend application
- How to verify everything works

## Prerequisites

Before starting, ensure you have these installed:

### Required Software

**Node.js and npm:**
- Node.js 18+ (20+ recommended)
- npm 9+

Check your versions:
```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

**Java Development Kit (JDK):**
- Java 17 or higher

Check your version:
```bash
java --version  # Should be 17 or higher
```

**PostgreSQL:**
- PostgreSQL 14+ (16+ recommended)

Check if installed:
```bash
psql --version  # Should be 14.0 or higher
```

**Maven:**
- Maven 3.6+ (for building backend)

Check your version:
```bash
mvn --version  # Should be 3.6 or higher
```

## Step 1: Clone the Repository

First, get the project code:

```bash
# Clone the repository
git clone <repository-url>
cd RegistrationForm
```

You should see this structure:
```
RegistrationForm/
├── frontend/           # Next.js application
├── backend/            # Spring Boot API
├── tests/              # Playwright tests
├── docs/               # Documentation (you're here!)
└── package.json        # Workspace configuration
```

## Step 2: Install Dependencies

Install all project dependencies:

```bash
# From the project root
npm install
```

This installs:
- Frontend dependencies (Next.js, React, Tailwind CSS)
- Testing dependencies (Playwright)
- Development tools (ESLint, Prettier)

You should see output like:
```
added 234 packages in 45s
```

## Step 3: Set Up PostgreSQL Database

### Create Database

Open PostgreSQL terminal:
```bash
psql -U postgres
```

Create the database:
```sql
CREATE DATABASE registration_form;
```

Verify:
```sql
\l  -- List databases
```

You should see `registration_form` in the list.

Exit PostgreSQL:
```sql
\q
```

### Configure Database Connection

The backend is already configured with default settings in:
`backend/registration-form-api/src/main/resources/application.properties`

Default configuration:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/registration_form
spring.datasource.username=postgres
spring.datasource.password=your_password_here
```

**If your PostgreSQL uses different credentials**, update this file:

```bash
# Edit the file
cd backend/registration-form-api/src/main/resources
# Update username and password to match your PostgreSQL setup
```

### Database Tables

Don't worry about creating tables manually. Spring Boot will auto-create them when the backend starts, using JPA entity definitions.

## Step 4: Start the Backend API

Open a **new terminal window** and start the backend:

```bash
# From project root
cd backend/registration-form-api
mvn spring-boot:run
```

**First run** will take 2-3 minutes as Maven downloads dependencies.

You'll see output like:
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

Started RegistrationFormApiApplication in 5.432 seconds
```

**Backend is ready when you see:**
```
Tomcat started on port(s): 8081 (http)
```

Test the backend:
```bash
# In another terminal
curl http://localhost:8081/api/health
```

Expected response:
```json
{"status": "UP"}
```

✅ **Backend is running!**

## Step 5: Start the Frontend Application

Open **another new terminal window** and start the frontend:

```bash
# From project root
cd frontend
npm run dev
```

You'll see:
```
▲ Next.js 15.5.0
- Local:        http://localhost:3002
- Network:      http://192.168.1.x:3001

✓ Ready in 2.3s
```

✅ **Frontend is running!**

## Step 6: Verify Everything Works

### Open the Application

Open your browser and navigate to:

**Registration Page:**
```
http://localhost:3002/register
```

You should see a beautiful registration form with:
- Left side: Hero section with welcome message
- Right side: Registration form with fields for Name, Email, Password

**Login Page:**
```
http://localhost:3002/login
```

You should see a login form with Email and Password fields.

### Test Registration Flow

Let's create your first user:

1. **Go to registration page**: `http://localhost:3002/register`

2. **Fill the form**:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `SecurePass123!`
   - Confirm Password: `SecurePass123!`

3. **Click "Sign Up"**

4. **Expected result**:
   - Loading indicator appears briefly
   - Success! You'll be redirected to login/dashboard
   - JWT token is saved to browser's localStorage

5. **Check the backend logs** (in backend terminal):
   ```
   User registered successfully: test@example.com
   ```

✅ **Registration works!**

### Test Login Flow

Now let's login with the user you just created:

1. **Go to login page**: `http://localhost:3002/login`

2. **Fill the form**:
   - Email: `test@example.com`
   - Password: `SecurePass123!`

3. **Click "Sign In"**

4. **Expected result**:
   - Loading indicator appears briefly
   - Success! You're logged in with JWT token

✅ **Login works!**

## Troubleshooting

### Backend Doesn't Start

**Error**: `Connection refused` or database errors

**Solutions**:
1. Check PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   # Should show postgresql running

   # Linux
   sudo systemctl status postgresql
   ```

2. Verify database exists:
   ```bash
   psql -U postgres -l | grep registration_form
   ```

3. Check credentials in `application.properties` match your PostgreSQL setup

### Frontend Doesn't Start

**Error**: Port 3001 already in use

**Solution**: Kill the process using port 3001:
```bash
# Find process
lsof -i :3001

# Kill it (replace PID)
kill -9 <PID>
```

### Registration Fails

**Error**: Network error or CORS error

**Solutions**:
1. Verify backend is running on port 8081
2. Check browser console for error messages
3. Verify CORS is configured in backend (it should be by default)

## What's Next?

Congratulations! You now have a working full-stack application. 🎉

**Continue learning**:
- [Your First Registration Tutorial](./first-registration.md) - Deep dive into registration flow
- [Run E2E Tests](../how-to/run-e2e-tests.md) - Run automated tests
- [API Endpoints Reference](../reference/api-endpoints.md) - Explore backend API

**Understand the system**:
- [Authentication Architecture](../explanation/authentication-architecture.md) - How JWT auth works
- [Project Architecture](../explanation/architecture.md) - System design overview

**Extend the application**:
- [Add New API Endpoint](../how-to/add-api-endpoint.md) - Add backend features
- [Gherkin Specifications](../../specs/README.md) - Behavior documentation

## Summary

You've successfully:
- ✅ Installed all dependencies
- ✅ Set up PostgreSQL database
- ✅ Started backend API on port 8081
- ✅ Started frontend on port 3001
- ✅ Created a test user
- ✅ Logged in with JWT authentication

Your development environment is ready! Happy coding! 🚀
