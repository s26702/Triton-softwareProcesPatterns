import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoleGuard } from '@/components/RoleGuard';

const mockReplace = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

const mockGetCurrentUser = vi.fn();
const mockSignOut = vi.fn();

vi.mock('@/repositories/supabaseAuthRepo', () => {
  return {
    SupabaseAuthRepository: class {
      signIn = vi.fn();
      getCurrentUser = mockGetCurrentUser;
      signOut = mockSignOut;
    },
  };
});

describe('RoleGuard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially while checking permissions', () => {
    mockGetCurrentUser.mockReturnValue(new Promise(() => {})); // never resolves

    render(
      <RoleGuard allowedRole="organizer">
        {(profile) => <div>Welcome {profile.email}</div>}
      </RoleGuard>
    );

    expect(screen.getByText(/checking permissions/i)).toBeInTheDocument();
  });

  it('renders children when user has the allowed role', async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: 'org-1',
      email: 'organizer@example.com',
      role: 'organizer',
    });

    render(
      <RoleGuard allowedRole="organizer">
        {(profile) => <div>Welcome {profile.email}</div>}
      </RoleGuard>
    );

    expect(await screen.findByText('Welcome organizer@example.com')).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('redirects to /login when user is not authenticated', async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    render(
      <RoleGuard allowedRole="organizer">
        {(profile) => <div>Welcome {profile.email}</div>}
      </RoleGuard>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });

  it('redirects to /volunteer-dashboard when a volunteer accesses an organizer page', async () => {
    mockGetCurrentUser.mockResolvedValue({
      id: 'vol-1',
      email: 'volunteer@example.com',
      role: 'volunteer',
    });

    render(
      <RoleGuard allowedRole="organizer">
        {(profile) => <div>Welcome {profile.email}</div>}
      </RoleGuard>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/volunteer-dashboard');
    });
  });

  it('logs out and redirects to /login when handleLogout is called', async () => {
    const user = userEvent.setup();
    mockGetCurrentUser.mockResolvedValue({
      id: 'org-1',
      email: 'organizer@example.com',
      role: 'organizer',
    });
    mockSignOut.mockResolvedValue(undefined);

    render(
      <RoleGuard allowedRole="organizer">
        {(profile, handleLogout) => (
          <div>
            <span>Welcome {profile.email}</span>
            <button onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </RoleGuard>
    );

    const logoutButton = await screen.findByRole('button', { name: /log out/i });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });
});
