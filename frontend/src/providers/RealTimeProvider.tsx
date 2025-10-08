'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { 
  useNotificationStore,
  useMessageStore,
  useApplicationStore,
  useDashboardStore,
  useMatchStore
} from '@/stores/realtimeStore';

// Simple auth hook - same as Navbar and Messages
const useAuth = () => {
  const getStoredUser = () => {
    if (typeof window === 'undefined') return null;
    
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    const userData = localStorage.getItem('user_data');
    
    if (!token) return null;
    
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (e) {
        // fallback to basic user data
      }
    }
    
    return {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      role: role || 'applicant' as 'applicant' | 'provider' | 'admin',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    };
  };
  
  return {
    user: getStoredUser(),
    isAuthenticated: typeof window !== 'undefined' && localStorage.getItem('auth_token') !== null,
  };
};
import { 
  Notification as NotificationModel,
  Message,
  ApplicationStatus,
  DashboardStats,
  MatchSuggestion 
} from '@/types/realtime';

interface RealTimeContextType {
  socket: ReturnType<typeof useSocket>;
  sendMessage: (receiverId: string, content: string) => void;
  joinChatRoom: (roomId: string) => void;
  leaveChatRoom: (roomId: string) => void;
  canChatWith: (otherUserRole: string) => boolean;
}

const RealTimeContext = createContext<RealTimeContextType | null>(null);

interface RealTimeProviderProps {
  children: ReactNode;
}

export function RealTimeProvider({ children }: RealTimeProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const socket = useSocket(
    isAuthenticated ? user?.id : undefined,
    isAuthenticated ? user?.role : undefined,
    isAuthenticated ? user?.name : undefined
  );
  
  // Store actions
  const addNotification = useNotificationStore(state => state.addNotification);
  const addMessage = useMessageStore(state => state.addMessage);
  const updateApplicationStatus = useApplicationStore(state => state.updateApplicationStatus);
  const updateStats = useDashboardStore(state => state.updateStats);
  const addMatch = useMatchStore(state => state.addMatch);
  const setTyping = useMessageStore(state => state.setTyping);

  // Role-based chat rules
  const canChatWith = (otherUserRole: string): boolean => {
    if (!user) return false;
    
    const userRole = user.role;
    
    // Same role can chat with each other
    if (userRole === otherUserRole) return true;
    
    // Student can chat with Provider and vice versa
    if (
      (userRole === 'applicant' && otherUserRole === 'provider') ||
      (userRole === 'provider' && otherUserRole === 'applicant')
    ) {
      return true;
    }
    
    // Admin can chat with everyone
    if (userRole === 'admin') return true;
    
    return false;
  };

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  useEffect(() => {
    if (!socket.isConnected || !isAuthenticated) return;

    // Notification events
    socket.on('notification', (notification: NotificationModel) => {
      addNotification(notification);
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        });
      }
    });

    // Message events
    socket.on('message', (message: Message) => {
      const roomId = [message.senderId, message.receiverId].sort().join('-');
      addMessage(roomId, message);
    });

    // Application status events
    socket.on('application_status_update', (status: ApplicationStatus) => {
      updateApplicationStatus(status);
      
      // Create notification for status change
      const notification: NotificationModel = {
        id: `status-${status.id}-${Date.now()}`,
        type: 'status',
        title: 'Application Status Updated',
        message: `Your application status changed to ${status.status}`,
        createdAt: new Date().toISOString(),
        read: false,
        metadata: { applicationId: status.id }
      };
      addNotification(notification);
    });

    // Dashboard stats events
    socket.on('dashboard_stats_update', (stats: DashboardStats) => {
      updateStats(stats);
    });

    // Match suggestion events (only for applicants)
    socket.on('match_suggestion', (match: MatchSuggestion) => {
      if (user?.role === 'applicant') {
        addMatch(match);
        
        // Create notification for new match
        const notification: NotificationModel = {
          id: `match-${match.id}`,
          type: 'new_scholarship',
          title: 'New Scholarship Match!',
          message: `Found a scholarship with ${match.score}% match`,
          createdAt: new Date().toISOString(),
          read: false,
          metadata: { matchId: match.id, scholarshipId: match.scholarshipId }
        };
        addNotification(notification);
      }
    });

    // Typing events
    socket.on('typing', ({ userId: typingUserId, roomId, isTyping }) => {
      if (typingUserId !== user?.id) {
        setTyping(roomId, typingUserId, isTyping);
      }
    });

    // Cleanup
    return () => {
      socket.off('notification');
      socket.off('message');
      socket.off('application_status_update');
      socket.off('dashboard_stats_update');
      socket.off('match_suggestion');
      socket.off('typing');
    };
  }, [socket.isConnected, isAuthenticated, user?.id, user?.role, addNotification, addMessage, updateApplicationStatus, updateStats, addMatch, setTyping]);

  // Helper functions
  const sendMessage = (receiverId: string, content: string) => {
    if (!user?.id || !isAuthenticated) {
      console.warn('User must be authenticated to send messages');
      return;
    }
    
    const message = {
      senderId: user.id,
      receiverId,
      content,
      status: 'sent' as const,
      type: 'text' as const
    };
    
    // Just emit to server, don't add locally to avoid duplicates
    // Server will emit back to room and we'll receive it via socket.on('message')
    socket.emit('send_message', message);
  };

  const joinChatRoom = (roomId: string) => {
    if (!isAuthenticated) return;
    socket.joinRoom(roomId);
  };

  const leaveChatRoom = (roomId: string) => {
    if (!isAuthenticated) return;
    socket.leaveRoom(roomId);
  };

  const contextValue: RealTimeContextType = {
    socket,
    sendMessage,
    joinChatRoom,
    leaveChatRoom,
    canChatWith,
  };

  return (
    <RealTimeContext.Provider value={contextValue}>
      {children}
    </RealTimeContext.Provider>
  );
}

export function useRealTime() {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
}

// Hook to request notification permission
export function useNotificationPermission() {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);
}