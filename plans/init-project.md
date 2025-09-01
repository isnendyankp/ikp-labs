
# Registration Form Initialization Checklist (Next.js)

## Project Setup
- [x] Initialize Next.js project (`npx create-next-app@latest registrationFormTemplate`)
- [x] Setup project structure (folders for components, services, etc.)
- [x] Install and configure Tailwind CSS.

## Page Creation
- [x] Create a registration page at `/register`.
- [ ] Create a login page at `/login`.

## Component Creation
- [x] Create a `RegistrationForm` component.
- [ ] Create a `LoginForm` component.
- [x] Add input fields for:
    - [x] Full Name
    - [x] Email
    - [x] Password
    - [x] Confirm Password
- [ ] Add login input fields for:
    - [ ] Email
    - [ ] Password
- [x] Add a submit button.
- [ ] Add "Remember Me" checkbox for login.
- [ ] Add "Forgot Password?" link for login.
- [ ] Add Google Sign-in button for login.
- [ ] Add navigation between login and registration pages.

## Form Logic
- [x] Implement state management for form inputs (e.g., using `useState`).
- [ ] Implement state management for login form inputs.
- [x] Implement form validation using Zod:
    - [x] Define a schema for the registration form.
    - [x] Validate form data against the schema.
    - [ ] Define a schema for the login form.
    - [ ] Validate login form data against the schema.
- [x] Handle form submission:
    - [x] Create a function to handle form submission.
    - [x] Prevent default form submission behavior.
    - [x] Log form data to the console (for now).
- [ ] Handle login form submission:
    - [ ] Create a function to handle login form submission.
    - [ ] Prevent default login form submission behavior.
    - [ ] Log login data to the console (for now).

## API Integration (Future)
- [ ] Create an API endpoint for user registration at `api/register`.
- [ ] Connect the form to the `api/register` endpoint.
- [ ] Create an API endpoint for user login at `api/login`.
- [ ] Connect the login form to the `api/login` endpoint.

## Styling
- [x] Style the form using Tailwind CSS.
- [x] Ensure the form is responsive.
- [ ] Style the login form using Tailwind CSS.
- [ ] Ensure the login form is responsive.
- [ ] Update hero section content for login page context.

## Testing
- [x] Write unit tests for the `RegistrationForm` component.
- [ ] Write unit tests for the `LoginForm` component.
- [x] Set up Playwright for e2e testing.
- [x] Set up Cucumber.js to work with Playwright.
- [x] Write a Gherkin feature file (`registration.feature`) for the registration flow.
- [ ] Write a Gherkin feature file (`login.feature`) for the login flow.
- [x] Implement the step definitions for the Gherkin feature file using Playwright.
- [ ] Implement the step definitions for the login feature file using Playwright.
