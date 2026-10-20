// Craftlane — Sign up page tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import { SignUpPage } from '@/features/auth/SignUpPage';

vi.mock('@/features/auth/auth.service', () => ({
  signup: vi.fn(),
  toAuthError: vi.fn((err: unknown) => ({
    message: err instanceof Error ? err.message : 'An error occurred.',
  })),
}));

import { signup } from '@/features/auth/auth.service';

const mockedSignup = signup as ReturnType<typeof vi.fn>;

const setupForm = () => {
  render(<SignUpPage />);
  const allInputs = document.querySelectorAll('input');
  return {
    fullName: allInputs[0] as HTMLInputElement,
    email: allInputs[1] as HTMLInputElement,
    password: allInputs[2] as HTMLInputElement,
    confirm: allInputs[3] as HTMLInputElement,
    submit: screen.getByRole('button', { name: /create account/i }),
  };
};

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockedSignup.mockResolvedValue({ id: 'u1', email: 'a@b.c' } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all required fields and terms checkbox', () => {
    setupForm();
    expect(document.querySelectorAll('input')).toHaveLength(5);
    expect(screen.getByRole('checkbox', { name: /agree to the/i })).toBeInTheDocument();
  });

  it('shows validation errors on submit with empty required fields', async () => {
    const { submit } = setupForm();
    fireEvent.click(submit);
    await waitFor(() => {
      expect(screen.getByText(/please enter your full name/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    expect(mockedSignup).not.toHaveBeenCalled();
  });

  it('shows terms error when checkbox not checked', async () => {
    const { email, password, confirm, submit } = setupForm();
    fireEvent.change(email, { target: { value: 'a@b.c' } });
    fireEvent.change(password, { target: { value: 'password123' } });
    fireEvent.change(confirm, { target: { value: 'password123' } });
    // leave terms unchecked
    fireEvent.click(submit);
    await waitFor(() => {
      expect(
        screen.getByText(/you must agree to the terms and privacy policy/i)
      ).toBeInTheDocument();
    });
    expect(mockedSignup).not.toHaveBeenCalled();
  });

  it('calls signup with form data and does not show a fake success', async () => {
    const { fullName, email, password, confirm, submit } = setupForm();
    fireEvent.change(fullName, { target: { value: 'Alex Rivera' } });
    fireEvent.change(email, { target: { value: 'alex@example.com' } });
    fireEvent.change(password, { target: { value: 'password123' } });
    fireEvent.change(confirm, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /agree to the/i }));
    fireEvent.click(submit);

    await waitFor(() => {
      expect(mockedSignup).toHaveBeenCalledTimes(1);
    });
    expect(mockedSignup).toHaveBeenCalledWith({
      full_name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'password123',
      password_confirm: 'password123',
      terms: true,
    });
    // No fake success message should appear
    expect(screen.queryByText(/account created/i)).not.toBeInTheDocument();
  });

  it('shows server error when signup fails and does not fabricate success', async () => {
    mockedSignup.mockRejectedValue(new Error('Email already in use.'));
    const { fullName, email, password, confirm, submit } = setupForm();
    fireEvent.change(fullName, { target: { value: 'Alex Rivera' } });
    fireEvent.change(email, { target: { value: 'alex@example.com' } });
    fireEvent.change(password, { target: { value: 'password123' } });
    fireEvent.change(confirm, { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /agree to the/i }));
    fireEvent.click(submit);

    await waitFor(() => {
      expect(screen.getByText(/email already in use/i)).toBeInTheDocument();
    });
    // No success state
    expect(screen.queryByText(/account created/i)).not.toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    const { password } = setupForm();
    expect(password).toHaveAttribute('type', 'password');
    const toggle = screen.getAllByRole('button', { name: /show password/i })[0]!;
    fireEvent.click(toggle);
    expect(password).toHaveAttribute('type', 'text');
    fireEvent.click(toggle);
    expect(password).toHaveAttribute('type', 'password');
  });
});
