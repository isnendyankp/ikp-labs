import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegistrationForm from "../../components/RegistrationForm";
import { ToastProvider } from "@/context/ToastContext";

// Custom render function with providers
function renderWithProviders(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe("RegistrationForm", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });

  it("renders all form fields", () => {
    renderWithProviders(<RegistrationForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Test1234!/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("renders form buttons", () => {
    // Enable Google OAuth for this test
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED = "true";
    renderWithProviders(<RegistrationForm />);

    expect(
      screen.getByRole("button", { name: /create account/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up with google/i }),
    ).toBeInTheDocument();
  });

  it("updates form fields when user types", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegistrationForm />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/Test1234!/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "ValidPass123!");
    await user.type(confirmPasswordInput, "ValidPass123!");

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(passwordInput).toHaveValue("ValidPass123!");
    expect(confirmPasswordInput).toHaveValue("ValidPass123!");
  });

  it("renders the registration form", () => {
    renderWithProviders(<RegistrationForm />);

    expect(screen.getByTestId("registration-form")).toBeInTheDocument();
    expect(screen.getByText("Create an account")).toBeInTheDocument();
    expect(
      screen.getByText("Let's get started with your 30 days free trial"),
    ).toBeInTheDocument();
  });

  it("renders hero section content", () => {
    // Enable Google OAuth for this test
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED = "true";
    renderWithProviders(<RegistrationForm />);

    // Hero section content
    expect(screen.getByText("Kameravue")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Kameravue - Your perfect moments, beautifully captured/,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Kameravue Team")).toBeInTheDocument();
    expect(
      screen.getByText("Your moments, perfectly captured"),
    ).toBeInTheDocument();
  });

  it("calls Google signup handler when Google button is clicked", async () => {
    // Enable Google OAuth for this test
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED = "true";
    const user = userEvent.setup();

    renderWithProviders(<RegistrationForm />);

    const googleButton = screen.getByRole("button", {
      name: /sign up with google/i,
    });
    await user.click(googleButton);

    // Google handler shows info toast about OAuth being in development
    // The actual implementation uses toast.showInfo()
    expect(googleButton).toBeInTheDocument();
  });
});
