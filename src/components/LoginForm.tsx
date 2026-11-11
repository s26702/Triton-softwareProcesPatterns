'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService, UserRole } from '@/services/authService';
import { SupabaseAuthRepository } from '@/repositories/supabaseAuthRepo';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('volunteer');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const authService = useMemo(() => {
    return new AuthService(new SupabaseAuthRepository());
  }, []);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('volunteer');
    setError(null);
    setSuccessMessage(null);
  };

  const toggleMode = () => {
    resetForm();
    setIsSignUp((prev) => !prev);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await authService.register(email, password, confirmPassword, role);
        router.push(result.redirectUrl);
      } else {
        const result = await authService.login(email, password);
        router.push(result.redirectUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (isSignUp ? 'Sign-up failed.' : 'Login failed.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-container">
      <div className="login-card">
        <header className="login-header">
          <h1 className="login-title">Triton Event Portal</h1>
          <p className="login-subtitle">
            {isSignUp ? 'Create your account' : 'Sign in as a Volunteer or Organizer'}
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>

          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-option ${role === 'volunteer' ? 'role-option-active' : ''}`}
                    onClick={() => setRole('volunteer')}
                    disabled={isLoading}
                  >
                    Volunteer
                  </button>
                  <button
                    type="button"
                    className={`role-option ${role === 'organizer' ? 'role-option-active' : ''}`}
                    onClick={() => setRole('organizer')}
                    disabled={isLoading}
                  >
                    Organizer
                  </button>
                </div>
              </div>
            </>
          )}

          {error && (
            <p className="login-error-banner" role="alert">
              {error}
            </p>
          )}

          {successMessage && (
            <p className="login-success-banner" role="status">
              {successMessage}
            </p>
          )}

          <button type="submit" disabled={isLoading} className="login-submit-button">
            {isLoading
              ? (isSignUp ? 'Creating account...' : 'Signing in...')
              : (isSignUp ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <p className="login-toggle">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" className="login-toggle-button" onClick={toggleMode} disabled={isLoading}>
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </main>
  );
};

export default LoginForm;
