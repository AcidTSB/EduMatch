import { useState, useEffect } from 'react';
import { useCurrentUser } from './useApi';
import { User, UserProfile, UserRole, AuthState } from '@/types';

interface UseAuthReturn extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    role: null,
  });

  const { data: currentUserData, isLoading: isLoadingUser, error } = useCurrentUser();

  useEffect(() => {
    if (isLoadingUser) {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      return;
    }

    if (error || !currentUserData?.data) {
      // No user or error, user is not authenticated
      setAuthState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
        role: null,
      });
      return;
    }

    // User is authenticated - currentUserData.data should be a UserProfile
    const profile = currentUserData.data;
    // Create a minimal user object from profile data
    const user: User = {
      id: profile.id,
      email: profile.email || profile.user?.email || '',
      role: profile.role || profile.user?.role || UserRole.STUDENT,
      status: 'ACTIVE' as any,
      subscriptionType: 'FREE' as any,
      emailVerified: profile.verified || false,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      profile,
    };
    
    setAuthState({
      user,
      profile,
      isLoading: false,
      isAuthenticated: true,
      role: user.role,
    });
  }, [currentUserData, isLoadingUser, error]);

  const login = (token: string, user: User) => {
    localStorage.setItem('auth_token', token);
    setAuthState({
      user,
      profile: user.profile || null,
      isLoading: false,
      isAuthenticated: true,
      role: user.role,
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setAuthState({
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
      role: null,
    });
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setAuthState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...updatedUser } : null,
    }));
  };

  const updateProfile = (updatedProfile: Partial<UserProfile>) => {
    setAuthState(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, ...updatedProfile } : null,
      user: prev.user ? { 
        ...prev.user, 
        profile: prev.profile ? { ...prev.profile, ...updatedProfile } : undefined 
      } : null,
    }));
  };

  const hasRole = (role: UserRole): boolean => {
    return authState.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return authState.role ? roles.includes(authState.role) : false;
  };

  return {
    ...authState,
    login,
    logout,
    updateUser,
    updateProfile,
    hasRole,
    hasAnyRole,
  };
};