'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthUser, Scholarship, Application, Notification } from '@/types';
import { authService } from '@/services/auth.service';

// =============================================================================
// APP STATE TYPES
// =============================================================================

interface AppState {
  // Authentication
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  
  // Data
  scholarships: Scholarship[];
  applications: Application[];
  notifications: Notification[];
  savedScholarships: string[];
  
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}

type AppAction = 
  | { type: 'SET_USER'; payload: AuthUser | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SCHOLARSHIPS'; payload: Scholarship[] }
  | { type: 'SET_APPLICATIONS'; payload: Application[] }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'SET_SAVED_SCHOLARSHIPS'; payload: string[] }
  | { type: 'TOGGLE_SAVED_SCHOLARSHIP'; payload: string }
  | { type: 'ADD_APPLICATION'; payload: Application }
  | { type: 'UPDATE_APPLICATION_STATUS'; payload: { id: string; status: string } }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' };

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  scholarships: [],
  applications: [],
  notifications: [],
  savedScholarships: [],
  sidebarOpen: false,
  theme: 'light'
};

// =============================================================================
// REDUCER
// =============================================================================

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
      
    case 'SET_SCHOLARSHIPS':
      return {
        ...state,
        scholarships: action.payload
      };
      
    case 'SET_APPLICATIONS':
      return {
        ...state,
        applications: action.payload
      };
      
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload
      };
      
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };
      
    case 'SET_SAVED_SCHOLARSHIPS':
      return {
        ...state,
        savedScholarships: action.payload
      };
      
    case 'TOGGLE_SAVED_SCHOLARSHIP':
      return {
        ...state,
        savedScholarships: state.savedScholarships.includes(action.payload)
          ? state.savedScholarships.filter(id => id !== action.payload)
          : [...state.savedScholarships, action.payload]
      };
      
    case 'ADD_APPLICATION':
      return {
        ...state,
        applications: [action.payload, ...state.applications]
      };
      
    case 'UPDATE_APPLICATION_STATUS':
      return {
        ...state,
        applications: state.applications.map(app =>
          app.id === action.payload.id
            ? { ...app, status: action.payload.status as any }
            : app
        )
      };
      
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload
            ? { ...notif, read: true }
            : notif
        )
      };
      
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen
      };
      
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
      
    default:
      return state;
  }
}

// =============================================================================
// CONTEXT
// =============================================================================

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadScholarships: () => Promise<void>;
  loadApplications: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  loadSavedScholarships: () => Promise<void>;
  toggleSavedScholarship: (scholarshipId: string) => Promise<void>;
  submitApplication: (applicationData: any) => Promise<boolean>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app on mount
  useEffect(() => {
    const initializeApp = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        // KHÔNG tự động load user - để login page xử lý
        console.log('🔧 [AppContext] Skipping auto-login check');
        
        // Chỉ check xem có stored user không
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          console.log('✅ [AppContext] Found stored user');
          // Có thể parse và set user nếu cần
        } else {
          console.log('ℹ️ [AppContext] No stored user found');
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();
  }, []);

  const loadInitialData = async (_userId: string) => {
    // Legacy data prefetch disabled to avoid random 401s from unfinished endpoints
    console.log('ℹ️ [AppContext] Skipping legacy data prefetch (scholarships/applications/notifications)');
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  // Actions
  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const { user } = await authService.login({ email, password });
      dispatch({ type: 'SET_USER', payload: user as unknown as AuthUser });
      await loadInitialData(String(user.id));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_SCHOLARSHIPS', payload: [] });
      dispatch({ type: 'SET_APPLICATIONS', payload: [] });
      dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
      dispatch({ type: 'SET_SAVED_SCHOLARSHIPS', payload: [] });
    }
  };

  const loadScholarships = async (): Promise<void> => {
    console.log('ℹ️ [AppContext] loadScholarships skipped (legacy API not wired)');
  };

  const loadApplications = async (): Promise<void> => {
    if (!state.user) return;
    console.log('ℹ️ [AppContext] loadApplications skipped (legacy API not wired)');
  };

  const loadNotifications = async (): Promise<void> => {
    if (!state.user) return;
    console.log('ℹ️ [AppContext] loadNotifications skipped (legacy API not wired)');
  };

  const loadSavedScholarships = async (): Promise<void> => {
    if (!state.user) return;
    console.log('ℹ️ [AppContext] loadSavedScholarships skipped (legacy API not wired)');
  };

  const toggleSavedScholarship = async (scholarshipId: string): Promise<void> => {
    if (!state.user) return;
    console.log('ℹ️ [AppContext] toggleSavedScholarship skipped (legacy API not wired)');
    // Optimistically toggle UI state only
    dispatch({ type: 'TOGGLE_SAVED_SCHOLARSHIP', payload: scholarshipId });
  };

  const submitApplication = async (_applicationData: any): Promise<boolean> => {
    if (!state.user) return false;
    console.log('ℹ️ [AppContext] submitApplication skipped (legacy API not wired)');
    return false;
  };

  const markNotificationAsRead = async (notificationId: string): Promise<void> => {
    console.log('ℹ️ [AppContext] markNotificationAsRead skipped (legacy API not wired)');
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> => {
    try {
      const newNotification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...notification,
        createdAt: new Date(),
      };
      
      dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    } catch (error) {
      console.error('Failed to add notification:', error);
    }
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    loadScholarships,
    loadApplications,
    loadNotifications,
    loadSavedScholarships,
    toggleSavedScholarship,
    submitApplication,
    markNotificationAsRead,
    addNotification
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// =============================================================================
// HOOK
// =============================================================================

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// =============================================================================
// SELECTOR HOOKS
// =============================================================================

export function useAuth() {
  const { state, login, logout } = useApp();
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    login,
    logout
  };
}

export function useScholarshipsData() {
  const { state, loadScholarships } = useApp();
  return {
    scholarships: state.scholarships,
    loading: state.loading,
    refetch: loadScholarships
  };
}

export function useApplicationsData() {
  const { state, loadApplications, submitApplication } = useApp();
  return {
    applications: state.applications,
    loading: state.loading,
    submitApplication,
    refetch: loadApplications
  };
}

export function useNotificationsData() {
  const { state, loadNotifications, markNotificationAsRead } = useApp();
  return {
    notifications: state.notifications,
    unreadCount: state.notifications.filter(n => !n.read).length,
    markAsRead: markNotificationAsRead,
    refetch: loadNotifications
  };
}

export function useSavedScholarshipsData() {
  const { state, toggleSavedScholarship, loadSavedScholarships } = useApp();
  return {
    savedScholarships: state.savedScholarships,
    toggle: toggleSavedScholarship,
    isScholarshipSaved: (scholarshipId: string) => state.savedScholarships.includes(scholarshipId),
    refetch: loadSavedScholarships
  };
}