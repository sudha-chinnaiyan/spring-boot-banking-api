import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, error, clearError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!username.trim() || !password.trim()) {
      setValidationError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username, password);
    } catch (err) {
      // Error handled by AuthContext state
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-slate-900/40 border border-slate-900 p-8 rounded-2xl shadow-2xl backdrop-blur-md">
        <div className="text-center">
          <div className="inline-flex bg-indigo-600/10 p-3 rounded-2xl text-indigo-500 mb-4 border border-indigo-500/20">
            <Shield className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Sign in to Nexus Bank
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Secure, premium digital backend dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(validationError || error) && (
            <div className="bg-rose-950/40 border border-rose-850 p-4 rounded-xl flex items-start space-x-3 text-rose-200 text-sm">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-rose-500" />
              <span>{validationError || error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Username
              </label>
              <input
                id="username-input"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 transition-colors"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label htmlFor="password-input" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-slate-600 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 focus:outline-none focus:text-slate-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 active:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-600 pt-4 border-t border-slate-950/60">
          Default administrative credentials: <span className="font-semibold text-slate-500">admin</span> / <span className="font-semibold text-slate-500">password</span>
        </div>
      </div>
    </div>
  );
};
