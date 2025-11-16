'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, AuthState, LoginCredentials, RegisterCredentials } from '@/types';
import { authService } from '@/services/auth.service';
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
    // PRIORITY 1: Try to get from cookies first (more reliable after redirect)
    let token = getCookie('auth_token');
    let userData = getCookie('auth_user');
    
    // PRIORITY 2: Fallback to localStorage if cookies are empty
    if (!token || !userData) {
      token = getFromLocalStorage('auth_token');
      userData = getFromLocalStorage('auth_user');
    }

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        
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
      } catch (error) {
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
        logout();
      }
    }, 15 * 60 * 1000); // Refresh every 15 minutes

    return () => clearInterval(interval);
  }, [authState.isAuthenticated]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Sử dụng authService thật thay vì mock
      const response = await authService.login({
        email: credentials.email,
        password: credentials.password,
      });

      // Convert backend user format to frontend format
      const user: any = {
        id: response.user.id.toString(),
        username: response.user.username,
        email: response.user.email,
        firstName: response.user.firstName || '',
        lastName: response.user.lastName || '',
        role: authService.getUserRole() || 'student',
        profile: {
          bio: '',
          avatar: '',
        },
      };

      const token = response.accessToken;

      // Store in localStorage (đã được lưu trong authService)
      setToLocalStorage('auth_user', JSON.stringify(user));

      // Set cookies for middleware
      setCookie('auth_token', token, 7);
      setCookie('auth_user', JSON.stringify(user), 7);

      setAuthState(createAuthenticatedState(user));

      // Redirect immediately based on user role
      if (user.role === 'admin') {
        window.location.href = '/admin';
      } else if (user.role === 'employer') {
        window.location.href = '/employer/dashboard';
      } else {
        window.location.href = '/user/dashboard';
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

      // Sử dụng authService thật
      const response = await authService.register({
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.email,
        password: credentials.password,
        sex: (credentials as any).sex,
      });

      // Convert backend user format to frontend format
      const user: any = {
        id: response.user.id.toString(),
        username: response.user.username,
        email: response.user.email,
        firstName: response.user.firstName || '',
        lastName: response.user.lastName || '',
        role: authService.getUserRole() || 'student',
        profile: {
          bio: '',
          avatar: '',
        },
      };

      const token = response.accessToken;

      // Store in localStorage
      setToLocalStorage('auth_user', JSON.stringify(user));

      // Set cookies for middleware
      setCookie('auth_token', token, 7);
      setCookie('auth_user', JSON.stringify(user), 7);

      setAuthState(createAuthenticatedState(user));

      // Redirect to user dashboard
      setTimeout(() => {
        window.location.href = '/user/dashboard';
      }, 100);
    } catch (err: any) {
      const errorMessage = err.message || 'Đăng ký thất bại';
      setError(errorMessage);
      setAuthState(resetAuthState());
      throw err;
    }
  };

  const logout = async () => {
    try {
      // Call logout API - real backend
      await authService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear localStorage
      removeFromLocalStorage('auth_token');
      removeFromLocalStorage('auth_user');
      removeFromLocalStorage('refresh_token');
      removeFromLocalStorage('user');

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
      const newToken = await authService.refreshToken();
      
      // Token đã được lưu trong authService
      setCookie('auth_token', newToken, 7);
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
