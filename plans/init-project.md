
# Registration Form Initialization Checklist (Next.js)

## Project Setup
- [x] Initialize Next.js project (`npx create-next-app@latest registrationFormTemplate`)
- [x] Setup project structure (folders for components, services, etc.)
- [x] Install and configure Tailwind CSS.

## Page Creation
- [x] Create a registration page at `/register`.
- [x] Create a login page at `/login`.

## Component Creation
- [x] Create a `RegistrationForm` component.
- [x] Create a `LoginForm` component.
- [x] Add input fields for:
    - [x] Full Name
    - [x] Email
    - [x] Password
    - [x] Confirm Password
- [x] Add login input fields for:
    - [x] Email
    - [x] Password
- [x] Add a submit button.
- [x] Add "Remember Me" checkbox for login.
- [x] Add "Forgot Password?" link for login.
- [x] Add Google Sign-in button for login.
- [x] Add navigation between login and registration pages.
- [x] Add show/hide password toggle functionality:
    - [x] Password visibility toggle for login form
    - [x] Password visibility toggle for registration form password field
    - [x] Password visibility toggle for registration form confirm password field
- [x] Create custom tooltip component for better user experience:
    - [x] Replace HTML title tooltips with custom CSS tooltips
    - [x] Implement instant hover response with no delay
    - [x] Add smooth fade-in animation and arrow pointers

## Form Logic
- [x] Implement state management for form inputs (e.g., using `useState`).
- [x] Implement state management for login form inputs.
- [x] Implement form validation using Zod:
    - [x] Define a schema for the registration form.
    - [x] Validate form data against the schema.
    - [x] Define a schema for the login form.
    - [x] Validate login form data against the schema.
- [x] Handle form submission:
    - [x] Create a function to handle form submission.
    - [x] Prevent default form submission behavior.
    - [x] Log form data to the console (for now).
- [x] Handle login form submission:
    - [x] Create a function to handle login form submission.
    - [x] Prevent default login form submission behavior.
    - [x] Log login data to the console (for now).

## API Integration
- [x] Create an API endpoint for user registration at `/api/auth/register` (Spring Boot backend).
- [x] Connect the registration form to the `/api/auth/register` endpoint via `registerUser()` service.
- [x] Create an API endpoint for user login at `/api/auth/login` (Spring Boot backend).
- [x] Connect the login form to the `/api/auth/login` endpoint via `loginUser()` service.
- [x] Implement JWT token management (save, retrieve, remove from localStorage).
- [x] Create protected home page at `/home` with authentication guard.
- [x] Implement auto-redirect after successful registration/login to `/home`.
- [x] Add logout functionality with token cleanup and redirect to `/login`.

## Styling
- [x] Style the form using Tailwind CSS.
- [x] Ensure the form is responsive.
- [x] Style the login form using Tailwind CSS.
- [x] Ensure the login form is responsive.
- [x] Update hero section content for login page context.

## Testing
- [x] Write unit tests for the `RegistrationForm` component.
- [x] Write unit tests for the `LoginForm` component.
- [x] Set up Playwright for e2e testing.
- [x] Set up Cucumber.js to work with Playwright.
- [x] Write a Gherkin feature file (`registration.feature`) for the registration flow.
- [x] Write a Gherkin feature file (`login.feature`) for the login flow.
- [x] Implement the step definitions for the Gherkin feature file using Playwright.
- [x] Implement the step definitions for the login feature file using Playwright.
