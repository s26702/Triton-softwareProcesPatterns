export type UserRole = 'volunteer' | 'organizer';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
}

export interface IAuthRepository {
  signIn(email: string, password: string): Promise<UserProfile>;
  signUp(email: string, password: string, role: UserRole): Promise<UserProfile>;
  getCurrentUser(): Promise<UserProfile | null>;
  signOut(): Promise<void>;
}

export class AuthService {
  constructor(private authRepo: IAuthRepository) {}

  async register(
    email: string,
    password: string,
    confirmPassword: string,
    role: UserRole,
  ): Promise<{ profile: UserProfile; redirectUrl: string }> {
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    const profile = await this.authRepo.signUp(cleanEmail, password, role);

    const redirectUrl = profile.role === 'organizer'
      ? '/organizer-dashboard'
      : '/volunteer-dashboard';

    return { profile, redirectUrl };
  }

  async login(email: string, password: string): Promise<{ profile: UserProfile; redirectUrl: string }> {
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const profile = await this.authRepo.signIn(cleanEmail, password);

    const redirectUrl = profile.role === 'organizer'
      ? '/organizer-dashboard'
      : '/volunteer-dashboard';

    return { profile, redirectUrl };
  }
  
  async authorize(allowedRole: UserRole): Promise<{
    authorized: boolean;
    profile: UserProfile | null;
    redirectUrl: string | null;
  }> {
    const profile = await this.authRepo.getCurrentUser();

    if (!profile) {
      return { authorized: false, profile: null, redirectUrl: '/login' };
    }

    if (profile.role !== allowedRole) {
      const fallbackUrl = profile.role === 'organizer'
        ? '/organizer-dashboard'
        : '/volunteer-dashboard';
      return { authorized: false, profile, redirectUrl: fallbackUrl };
    }

    return { authorized: true, profile, redirectUrl: null };
  }

  async logout(): Promise<void> {
    await this.authRepo.signOut();
  }
}