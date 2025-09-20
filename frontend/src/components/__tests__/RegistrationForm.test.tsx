import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationForm from '../RegistrationForm';

// Mock alert function
window.alert = jest.fn();

describe('RegistrationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<RegistrationForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it('renders form buttons', () => {
    render(<RegistrationForm />);
    
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up with google/i })).toBeInTheDocument();
  });

  it('updates form fields when user types', async () => {
    const user = userEvent.setup();
    render(<RegistrationForm />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText('Password');
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');
    
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });

  it('renders the registration form', () => {
    render(<RegistrationForm />);
    
    expect(screen.getByTestId('registration-form')).toBeInTheDocument();
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByText("Let's get started with your 30 days free trial")).toBeInTheDocument();
  });

  it('renders hero section content', () => {
    render(<RegistrationForm />);
    
    expect(screen.getByText('abc.com')).toBeInTheDocument();
    expect(screen.getByText(/abc.com is the best place to find remote talent/)).toBeInTheDocument();
    expect(screen.getByText('Madhushan sasanka')).toBeInTheDocument();
    expect(screen.getByText('CEO, abc.com')).toBeInTheDocument();
  });

  it('calls Google signup handler when Google button is clicked', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<RegistrationForm />);
    
    const googleButton = screen.getByRole('button', { name: /sign up with google/i });
    await user.click(googleButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Sign up with Google clicked');
    
    consoleSpy.mockRestore();
  });
});