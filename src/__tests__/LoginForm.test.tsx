import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from '@/components/LoginForm';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockSignIn = vi.fn();

vi.mock('@/repositories/supabaseAuthRepo', () => {
  return {
    SupabaseAuthRepository: class {
      signIn = mockSignIn;
      getCurrentUser = vi.fn();
      signOut = vi.fn();
    },
  };
});

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email input, password input, and submit button', () => {
    render(<LoginForm />);

    expect(screen.getByRole('heading', { name: /triton event portal/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('displays validation error when submitting an invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Please enter a valid email address.'
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('displays validation error when submitting a short password', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), '123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Password must be at least 6 characters.'
    );
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('redirects to /organizer-dashboard on successful organizer login', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValue({
      id: 'org-1',
      email: 'organizer@example.com',
      role: 'organizer',
    });

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'organizer@example.com');
    await user.type(screen.getByLabelText(/password/i), 'securePass123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/organizer-dashboard');
    });
  });

  it('displays error banner when repository signIn fails', async () => {
    const user = userEvent.setup();
    mockSignIn.mockRejectedValue(new Error('Invalid login credentials.'));

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Invalid login credentials.'
    );
    expect(mockPush).not.toHaveBeenCalled();
  });
});
