import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService, IAuthRepository, UserProfile } from '@/services/authService';

describe('AuthService', () => {
  let mockAuthRepo: IAuthRepository;
  let authService: AuthService;

  beforeEach(() => {
    mockAuthRepo = {
      signIn: vi.fn(),
      signUp: vi.fn(),
      getCurrentUser: vi.fn(),
      signOut: vi.fn(),
    };
    authService = new AuthService(mockAuthRepo);
  });

  describe('login()', () => {
    it('throws an error when email is empty or whitespace', async () => {
      await expect(authService.login('', 'password123')).rejects.toThrow(
        'Please enter a valid email address.'
      );
      await expect(authService.login('   ', 'password123')).rejects.toThrow(
        'Please enter a valid email address.'
      );
      expect(mockAuthRepo.signIn).not.toHaveBeenCalled();
    });

    it('throws an error when email does not contain "@"', async () => {
      await expect(authService.login('invalidemail.com', 'password123')).rejects.toThrow(
        'Please enter a valid email address.'
      );
      expect(mockAuthRepo.signIn).not.toHaveBeenCalled();
    });

    it('throws an error when password is empty or shorter than 6 characters', async () => {
      await expect(authService.login('user@example.com', '')).rejects.toThrow(
        'Password must be at least 6 characters.'
      );
      await expect(authService.login('user@example.com', '12345')).rejects.toThrow(
        'Password must be at least 6 characters.'
      );
      expect(mockAuthRepo.signIn).not.toHaveBeenCalled();
    });

    it('trims email and returns organizer redirect URL when user role is organizer', async () => {
      const organizerProfile: UserProfile = {
        id: 'org-1',
        email: 'org@example.com',
        role: 'organizer',
      };
      vi.mocked(mockAuthRepo.signIn).mockResolvedValue(organizerProfile);

      const result = await authService.login('  org@example.com  ', 'password123');

      expect(mockAuthRepo.signIn).toHaveBeenCalledWith('org@example.com', 'password123');
      expect(result).toEqual({
        profile: organizerProfile,
        redirectUrl: '/organizer-dashboard',
      });
    });

    it('returns volunteer redirect URL when user role is volunteer', async () => {
      const volunteerProfile: UserProfile = {
        id: 'vol-1',
        email: 'vol@example.com',
        role: 'volunteer',
      };
      vi.mocked(mockAuthRepo.signIn).mockResolvedValue(volunteerProfile);

      const result = await authService.login('vol@example.com', 'password123');

      expect(mockAuthRepo.signIn).toHaveBeenCalledWith('vol@example.com', 'password123');
      expect(result).toEqual({
        profile: volunteerProfile,
        redirectUrl: '/volunteer-dashboard',
      });
    });

    it('propagates errors from the auth repository', async () => {
      vi.mocked(mockAuthRepo.signIn).mockRejectedValue(
        new Error('Invalid login credentials.')
      );

      await expect(
        authService.login('user@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid login credentials.');
    });
  });

  describe('authorize()', () => {
    it('returns unauthorized and redirects to /login when no user is logged in', async () => {
      vi.mocked(mockAuthRepo.getCurrentUser).mockResolvedValue(null);

      const result = await authService.authorize('organizer');

      expect(result).toEqual({
        authorized: false,
        profile: null,
        redirectUrl: '/login',
      });
    });

    it('returns authorized when user role matches allowedRole', async () => {
      const profile: UserProfile = {
        id: 'org-1',
        email: 'org@example.com',
        role: 'organizer',
      };
      vi.mocked(mockAuthRepo.getCurrentUser).mockResolvedValue(profile);

      const result = await authService.authorize('organizer');

      expect(result).toEqual({
        authorized: true,
        profile,
        redirectUrl: null,
      });
    });

    it('redirects a volunteer trying to access an organizer route to /volunteer-dashboard', async () => {
      const profile: UserProfile = {
        id: 'vol-1',
        email: 'vol@example.com',
        role: 'volunteer',
      };
      vi.mocked(mockAuthRepo.getCurrentUser).mockResolvedValue(profile);

      const result = await authService.authorize('organizer');

      expect(result).toEqual({
        authorized: false,
        profile,
        redirectUrl: '/volunteer-dashboard',
      });
    });

    it('redirects an organizer trying to access a volunteer route to /organizer-dashboard', async () => {
      const profile: UserProfile = {
        id: 'org-1',
        email: 'org@example.com',
        role: 'organizer',
      };
      vi.mocked(mockAuthRepo.getCurrentUser).mockResolvedValue(profile);

      const result = await authService.authorize('volunteer');

      expect(result).toEqual({
        authorized: false,
        profile,
        redirectUrl: '/organizer-dashboard',
      });
    });
  });

  describe('logout()', () => {
    it('calls signOut on the repository', async () => {
      vi.mocked(mockAuthRepo.signOut).mockResolvedValue(undefined);

      await authService.logout();

      expect(mockAuthRepo.signOut).toHaveBeenCalledTimes(1);
    });
  });
});
