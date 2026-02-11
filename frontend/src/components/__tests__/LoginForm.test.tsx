import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../LoginForm';
import { ToastProvider } from '@/context/ToastContext';

// Mock alert function
window.alert = jest.fn();

// Custom render function with providers
function renderWithProviders(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe('LoginForm', () => {
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

  it('renders all form fields', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
  });

  it('renders form buttons and links', () => {
    // Enable Google OAuth for this test
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED = 'true';
    renderWithProviders(<LoginForm />);

    expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument();
  });

  it('updates form fields when user types', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
    
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(rememberMeCheckbox);
    
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(rememberMeCheckbox).toBeChecked();
  });

  it('renders the login form with correct content', () => {
    renderWithProviders(<LoginForm />);
    
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByText('Welcome back')).toBeInTheDocument();
    expect(screen.getByText('Please sign in to your account')).toBeInTheDocument();
  });

  it('renders hero section content with login context', () => {
    // Enable Google OAuth for this test
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED = 'true';
    renderWithProviders(<LoginForm />);

    expect(screen.getByText('abc.com')).toBeInTheDocument();
    expect(screen.getByText(/Welcome back! Ready to continue your journey/)).toBeInTheDocument();
    expect(screen.getByText('Madhushan sasanka')).toBeInTheDocument();
    expect(screen.getByText('CEO, abc.com')).toBeInTheDocument();
  });

  it('handles form submission with validation', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    
    // Test successful submission
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));
    
    // Check if alert was called with success message
    expect(window.alert).toHaveBeenCalledWith('Login successful!');
  });

  it('submits valid form successfully', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const signInButton = screen.getByRole('button', { name: /^sign in$/i });
    
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(signInButton);
    
    // Check if alert was called with success message
    expect(window.alert).toHaveBeenCalledWith('Login successful!');
  });

  it('calls Google signin handler when Google button is clicked', async () => {
    // Enable Google OAuth for this test
    process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED = 'true';
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    renderWithProviders(<LoginForm />);

    const googleButton = screen.getByRole('button', { name: /sign in with google/i });
    await user.click(googleButton);

    expect(consoleSpy).toHaveBeenCalledWith('Sign in with Google clicked');

    consoleSpy.mockRestore();
  });

  it('toggles password visibility when eye icon is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const toggleButton = passwordInput.parentElement?.querySelector('button');
    
    // Initially password should be hidden (type="password")
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click toggle button to show password
    if (toggleButton) {
      await user.click(toggleButton);
    }
    
    // Password should now be visible (type="text")
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click again to hide password
    if (toggleButton) {
      await user.click(toggleButton);
    }
    
    // Password should be hidden again (type="password")
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('handles form state changes correctly', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);
    const rememberMeCheckbox = screen.getByLabelText(/remember me/i);
    
    // Test form state updates
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'mypassword');
    await user.click(rememberMeCheckbox);
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('mypassword');
    expect(rememberMeCheckbox).toBeChecked();
  });

  it('renders navigation link to registration page', () => {
    renderWithProviders(<LoginForm />);
    
    const signUpLink = screen.getByText(/sign up/i);
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/register');
  });
});