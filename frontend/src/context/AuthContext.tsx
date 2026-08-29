import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, registerLogoutCallback } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const logout = () => {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_username');
    setUsername(null);
    setIsAuthenticated(false);
    setError(null);
  };

  useEffect(() => {
    // Check if token exists in sessionStorage (on initial mount/page refresh)
    const token = sessionStorage.getItem('auth_token');
    const storedUsername = sessionStorage.getItem('auth_username');
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
    setIsLoading(false);

    // Register our logout callback in the Axios interceptor
    registerLogoutCallback(logout);
  }, []);

  const login = async (user: string, pass: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Build Basic Auth Token
      const base64Credentials = btoa(`${user}:${pass}`);
      const token = `Basic ${base64Credentials}`;

      // Temporarily write to session storage so the Axios request interceptor includes it
      sessionStorage.setItem('auth_token', token);

      // Perform a lightweight request to test authentication.
      // We call the protected customers endpoint with customer ID 1 as a validation check.
      // Even if ID 1 does not exist, a 404 response confirms we successfully bypassed Spring Security!
      // A 401 Unauthorized confirms the credentials are invalid.
      try {
        await api.get('/customers/1');
      } catch (err: any) {
        if (err.response && (err.response.status === 404 || err.response.status === 200)) {
          // Authentication success (request parsed by REST controller)
        } else if (err.response && err.response.status === 401) {
          throw new Error('Invalid username or password.');
        } else {
          throw new Error('Server connection failed. Make sure the API backend is running.');
        }
      }

      // If we reach this point, login is successful
      sessionStorage.setItem('auth_username', user);
      setUsername(user);
      setIsAuthenticated(true);
    } catch (err: any) {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_username');
      setError(err.message || 'An error occurred during login.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout, isLoading, error, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
