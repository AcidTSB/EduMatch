'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '@/types/realtime';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3003';

export function useSocket(userId?: string, userRole?: string, userName?: string) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: {
        userId,
        role: userRole,
        name: userName
      },
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // User presence events
    socket.on('user_online', (userData: { userId: string; role: string; name: string }) => {
      setOnlineUsers(prev => [...prev.filter(id => id !== userData.userId), userData.userId]);
      console.log(`${userData.name} (${userData.role}) came online`);
    });

    socket.on('user_offline', (userData: { userId: string; role: string; name: string }) => {
      setOnlineUsers(prev => prev.filter(id => id !== userData.userId));
      console.log(`${userData.name} (${userData.role}) went offline`);
    });

    socket.on('online_users', (users: Array<{ userId: string; role: string; name: string }>) => {
      setOnlineUsers(users.map(u => u.userId));
      console.log('Current online users:', users);
    });

    socket.on('users_list_update', (data: { onlineUsers: Array<{ userId: string; role: string; name: string }>; totalOnline: number }) => {
      setOnlineUsers(data.onlineUsers.map(u => u.userId));
      console.log(`Online users updated: ${data.totalOnline} total`, data.onlineUsers);
    });

    // Chat error handling
    socket.on('chat_error', (error) => {
      console.error('Chat error:', error.message);
      alert(`Chat Error: ${error.message}`);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('user_online');
        socket.off('user_offline');
        socket.off('online_users');
        socket.off('users_list_update');
        socket.off('chat_error');
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, userRole, userName]);

  // Socket event listeners
  const on = <K extends keyof SocketEvents>(
    event: K,
    callback: SocketEvents[K]
  ) => {
    if (socketRef.current) {
      socketRef.current.on(event as string, callback);
    }
  };

  const off = <K extends keyof SocketEvents>(
    event: K,
    callback?: SocketEvents[K]
  ) => {
    if (socketRef.current) {
      socketRef.current.off(event as string, callback);
    }
  };

  // Socket event emitters
  const emit = <K extends keyof SocketEvents>(
    event: K,
    ...args: Parameters<SocketEvents[K]>
  ) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event as string, ...args);
    }
  };

  const joinRoom = (roomId: string) => {
    emit('join_room', roomId);
  };

  const leaveRoom = (roomId: string) => {
    emit('leave_room', roomId);
  };

  return {
    socket: socketRef.current,
    isConnected,
    onlineUsers,
    on,
    off,
    emit,
    joinRoom,
    leaveRoom,
  };
}