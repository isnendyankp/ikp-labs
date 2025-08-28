
# Registration Form Initialization Checklist (Next.js)

## Project Setup
- [x] Initialize Next.js project (`npx create-next-app@latest registrationFormTemplate`)
- [x] Setup project structure (folders for components, services, etc.)
- [x] Install and configure Tailwind CSS.

## Page Creation
- [x] Create a registration page at `/register`.

## Component Creation
- [x] Create a `RegistrationForm` component.
- [x] Add input fields for:
    - [x] Full Name
    - [x] Email
    - [x] Password
    - [x] Confirm Password
- [x] Add a submit button.

## Form Logic
- [x] Implement state management for form inputs (e.g., using `useState`).
- [x] Implement form validation using Zod:
    - [x] Define a schema for the registration form.
    - [x] Validate form data against the schema.
- [x] Handle form submission:
    - [x] Create a function to handle form submission.
    - [x] Prevent default form submission behavior.
    - [x] Log form data to the console (for now).

## API Integration (Future)
- [ ] Create an API endpoint for user registration at `api/register`.
- [ ] Connect the form to the `api/register` endpoint.

## Styling
- [x] Style the form using Tailwind CSS.
- [x] Ensure the form is responsive.

## Testing
- [ ] Write unit tests for the `RegistrationForm` component.
- [ ] Set up Playwright for e2e testing.
- [ ] Set up Cucumber.js to work with Playwright.
- [ ] Write a Gherkin feature file (`registration.feature`) for the registration flow.
- [ ] Implement the step definitions for the Gherkin feature file using Playwright.
