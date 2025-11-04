'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, AuthState, LoginCredentials, RegisterCredentials } from '@/types';
// import { api } from '@/lib/api';
import { mockApi, shouldUseMockApi } from '@/lib/mock-data';
import { getFromLocalStorage, setToLocalStorage, removeFromLocalStorage } from '@/lib/utils';
import { setCookie, getCookie, deleteCookie } from '@/lib/cookies';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const resetAuthState = () => ({
    user: null,
    profile: null,
    isLoading: false,
    isAuthenticated: false,
    role: null,
  });

  const createAuthenticatedState = (user: any) => ({
    user,
    profile: user?.profile || null,
    isLoading: false,
    isAuthenticated: true,
    role: user?.role || null,
  });

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    role: null,
  });
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    console.log('[AuthProvider] Initializing auth state...');
    
    // PRIORITY 1: Try to get from cookies first (more reliable after redirect)
    let token = getCookie('auth_token');
    let userData = getCookie('auth_user');
    
    console.log('[AuthProvider] Token from COOKIE:', token ? 'EXISTS' : 'NULL');
    console.log('[AuthProvider] User data from COOKIE:', userData ? 'EXISTS' : 'NULL');
    
    // PRIORITY 2: Fallback to localStorage if cookies are empty
    if (!token || !userData) {
      console.log('[AuthProvider] Cookies empty, trying localStorage...');
      token = getFromLocalStorage('auth_token');
      userData = getFromLocalStorage('auth_user');
      console.log('[AuthProvider] Token from localStorage:', token ? 'EXISTS' : 'NULL');
      console.log('[AuthProvider] User data from localStorage:', userData ? 'EXISTS' : 'NULL');
    }

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        console.log('[AuthProvider] Parsed user:', user);
        
        // Re-set cookies AND localStorage for redundancy
        setCookie('auth_token', token, 7);
        setCookie('auth_user', userData, 7);
        setToLocalStorage('auth_token', token);
        setToLocalStorage('auth_user', userData);
        
        setAuthState({
          user,
          profile: user?.profile || null,
          isLoading: false,
          isAuthenticated: true,
          role: user?.role || null,
        });
        console.log('[AuthProvider] ✅ Auth state set - User authenticated');
      } catch (error) {
        console.error('[AuthProvider] ❌ Error parsing user data:', error);
        // Invalid user data, clear storage and cookies
        removeFromLocalStorage('auth_token');
        removeFromLocalStorage('auth_user');
        deleteCookie('auth_token');
        deleteCookie('auth_user');
        setAuthState({
          user: null,
          profile: null,
          isLoading: false,
          isAuthenticated: false,
          role: null,
        });
      }
    } else {
      console.log('[AuthProvider] ⚠️ No auth data found - User not authenticated');
      setAuthState(resetAuthState());
    }
  }, []);

  // Auto refresh token periodically
  useEffect(() => {
    if (!authState.isAuthenticated) return;

    const interval = setInterval(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.warn('Token refresh failed:', error);
        logout();
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(interval);
  }, [authState.isAuthenticated]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await mockApi.auth.login(credentials);

      if (response.success && response.data) {
        const { user, token } = response.data;

        console.log('[LOGIN] 1️⃣ Received token:', token);
        console.log('[LOGIN] 2️⃣ Received user:', user);

        // Store in localStorage
        setToLocalStorage('auth_token', token);
        setToLocalStorage('auth_user', JSON.stringify(user));
        
        console.log('[LOGIN] 3️⃣ Saved to localStorage');
        console.log('[LOGIN] 4️⃣ Verify token in localStorage:', getFromLocalStorage('auth_token'));
        console.log('[LOGIN] 5️⃣ Verify user in localStorage:', getFromLocalStorage('auth_user'));

        // Set cookies for middleware using utility function
        setCookie('auth_token', token, 7);
        setCookie('auth_user', JSON.stringify(user), 7);
        
        console.log('[LOGIN] 6️⃣ Cookies set');
        console.log('[LOGIN] 7️⃣ Document.cookie:', document.cookie);

        setAuthState(createAuthenticatedState(user));

        // Wait a bit then redirect to let cookies set
        setTimeout(() => {
          console.log('[LOGIN] 8️⃣ About to redirect...');
          console.log('[LOGIN] 9️⃣ Final check - Token:', getFromLocalStorage('auth_token'));
          // Redirect based on user role
          if (user.role === 'admin') {
            window.location.href = '/admin';
          } else if (user.role === 'provider') {
            window.location.href = '/provider/dashboard';
          } else {
            window.location.href = '/applicant/dashboard';
          }
        }, 100);
      } else {
        // Handle failed login response
        setAuthState(prev => ({ ...prev, isLoading: false }));
        const errorMessage = response.error || 'Login failed';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setAuthState(resetAuthState());
      throw err;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      setError(null);
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await mockApi.auth.register(credentials);

      if (response.success && response.data) {
        const { user, token } = response.data;

        // Store in localStorage
        setToLocalStorage('auth_token', token);
        setToLocalStorage('auth_user', JSON.stringify(user));

        // Set cookies for middleware using utility function
        setCookie('auth_token', token, 7);
        setCookie('auth_user', JSON.stringify(user), 7);

        setAuthState(createAuthenticatedState(user));

        // Redirect to home page after successful registration
        window.location.href = '/';
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      setAuthState(resetAuthState());
      throw err;
    }
  };

  const logout = async () => {
    try {
      // Call logout API
      await mockApi.auth.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear localStorage
      removeFromLocalStorage('auth_token');
      removeFromLocalStorage('auth_user');

      // Clear cookies using utility function
      deleteCookie('auth_token');
      deleteCookie('auth_user');

      // Update state
      setAuthState(resetAuthState());
      setError(null);
      
      // Redirect to home page
      window.location.href = '/';
    }
  };

  const refreshToken = async () => {
    try {
      const response = await mockApi.auth.refreshToken();

      if (response.success && response.data) {
        setToLocalStorage('auth_token', response.data.token);
      }
    } catch (err) {
      // If refresh fails, logout user
      await logout();
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
    clearError,
    error,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protecting routes
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
}

// Hook for role-based access
export function useRequireRole(allowedRoles: string[], redirectTo = '/') {
  const { user, isAuthenticated, isLoading } = useAuth();

  const hasRequiredRole = user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRequiredRole && typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, hasRequiredRole, redirectTo]);

  return { hasRequiredRole, isLoading };
}
