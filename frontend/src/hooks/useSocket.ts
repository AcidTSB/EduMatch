'use client';

import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { SocketEvents } from '@/types/realtime';
import { createStompClient } from '@/lib/stomp';

// WebSocket URL qua Nginx Gateway
const SOCKET_URL = 'ws://localhost:8080/api/ws';

export function useSocket(userId?: string, userRole?: string, userName?: string) {
  const clientRef = useRef<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  
  // Store event handlers
  const eventHandlers = useRef<Map<string, Function[]>>(new Map());

  // Helper to trigger registered callbacks
  const trigger = (event: string, data: any) => {
    const handlers = eventHandlers.current.get(event);
    if (handlers) {
      handlers.forEach(cb => cb(data));
    }
  };

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn('⚠️ No auth token found. Cannot connect to WebSocket.');
      return;
    }
    
    // Sử dụng createStompClient từ lib/stomp.ts
    const client = createStompClient(token);

    client.onConnect = (frame: any) => {
      console.log('✅ STOMP Connected successfully');
      setIsConnected(true);
      trigger('connect', {});
      
      // Subscribe vào topic cá nhân: /topic/messages/{userId}
      client.subscribe(`/topic/messages/${userId}`, (message: any) => {
        try {
          const body = JSON.parse(message.body);
          console.log('📨 Received message:', body);
          
          // Update messages state
          setMessages(prev => [...prev, body]);
          
          // Trigger callback cho listener
          trigger('message', body);
        } catch (e) {
          console.error('❌ Error parsing message:', e);
        }
      });

      // Subscribe vào notifications
      client.subscribe(`/topic/notifications/${userId}`, (message: any) => {
        try {
          const body = JSON.parse(message.body);
          console.log('🔔 Received notification:', body);
          trigger('notification', body);
        } catch (e) {
          console.error('❌ Error parsing notification:', e);
        }
      });
    };

    client.onStompError = (frame: any) => {
      console.error('🔴 Broker reported error:', frame.headers['message']);
      console.error('Details:', frame.body);
      setIsConnected(false);
      trigger('connect_error', frame);
    };

    client.onWebSocketClose = () => {
      console.log('⚠️ WebSocket closed');
      setIsConnected(false);
      trigger('disconnect', {});
    };

    client.activate();
    clientRef.current = client;

    return () => {
      console.log('🔌 Cleaning up STOMP connection...');
      client.deactivate();
      clientRef.current = null;
      setIsConnected(false);
    };
  }, [userId, userRole, userName]);

  /**
   * Gửi tin nhắn qua WebSocket
   * @param receiverId - ID người nhận
   * @param content - Nội dung tin nhắn
   */
  const sendMessage = (receiverId: number, content: string) => {
    if (!clientRef.current || !clientRef.current.connected) {
      console.error('❌ Cannot send message: STOMP client not connected');
      return;
    }

    const payload = {
      receiverId,
      content
    };

    try {
      clientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(payload)
      });
      console.log('📤 Message sent:', payload);
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  };

  // Mimic Socket.IO API for compatibility
  const on = <K extends keyof SocketEvents>(
    event: K,
    callback: SocketEvents[K]
  ) => {
    const evt = event as string;
    if (!eventHandlers.current.has(evt)) {
        eventHandlers.current.set(evt, []);
    }
    eventHandlers.current.get(evt)?.push(callback as Function);
  };

  const off = <K extends keyof SocketEvents>(
    event: K,
    callback?: SocketEvents[K]
  ) => {
     const evt = event as string;
     if (eventHandlers.current.has(evt)) {
         if (callback) {
             const handlers = eventHandlers.current.get(evt) || [];
             const index = handlers.indexOf(callback as Function);
             if (index !== -1) {
                 handlers.splice(index, 1);
             }
         } else {
             eventHandlers.current.delete(evt);
         }
     }
  };

  const emit = <K extends keyof SocketEvents>(
    event: K,
    ...args: Parameters<SocketEvents[K]>
  ) => {
    if (clientRef.current && clientRef.current.connected) {
        const data = args[0];
        
        if (event === 'send_message') {
            // Backend expects payload at /app/chat.send
            clientRef.current.publish({
                destination: '/app/chat.send',
                body: JSON.stringify(data)
            });
        } 
        // Add other event mappings here if backend supports them
        // e.g. typing, mark_read
    }
  };

  const joinRoom = (roomId: string) => {
     // STOMP: No-op for 1-on-1 if using user-specific topics
  };

  const leaveRoom = (roomId: string) => {
     // STOMP: No-op
  };

  // Mock socket object to pass to RealTimeProvider
  const socket = {
      id: 'stomp-client',
      connected: isConnected,
      on,
      off,
      emit,
      disconnect: () => clientRef.current?.deactivate(),
      joinRoom,
      leaveRoom
  };

  return {
    socket, 
    isConnected,
    messages,
    onlineUsers,
    sendMessage, // Export sendMessage function
    on,
    off,
    emit,
    joinRoom,
    leaveRoom,
  };
}