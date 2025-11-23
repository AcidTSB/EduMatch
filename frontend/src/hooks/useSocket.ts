'use client';

import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { SocketEvents } from '@/types/realtime';
import { createStompClient } from '@/lib/stomp';

// WebSocket URL qua Nginx Gateway
const SOCKET_URL = 'ws://localhost:8080/api/ws';

// Tạo biến global client bên ngoài hook để giữ kết nối qua các lần render
let globalClient: Client | null = null;
let globalUserId: string | null = null;

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

    // Nếu đã có client đang chạy và đúng user thì dùng lại, không tạo mới
    if (globalClient && globalClient.active && globalUserId === userId) {
      console.log('♻️ Reusing existing STOMP connection for user:', userId);
      clientRef.current = globalClient;
      setIsConnected(true);
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn('⚠️ No auth token found. Cannot connect to WebSocket.');
      return;
    }
    
    console.log('🔐 Auth token found, connecting WebSocket for user:', userId);
    console.log('🔑 Token (first 20 chars):', token.substring(0, 20) + '...');
    
    // Sử dụng createStompClient từ lib/stomp.ts
    const client = createStompClient(token);

    client.onConnect = (frame: any) => {
      console.log('✅ STOMP Connected successfully');
      console.log('📡 Connection frame:', frame);
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
    globalClient = client; // Lưu vào global để reuse
    globalUserId = userId; // Lưu userId để check

    // Cleanup: TẠM THỜI COMMENT để tránh mất kết nối khi re-render
    return () => {
      console.log('🔌 Component cleanup called, but keeping connection alive...');
      // client.deactivate(); // <--- COMMENT để giữ kết nối
      // clientRef.current = null;
      // setIsConnected(false);
    };
  }, [userId, userRole, userName]);

  /**
   * Gửi tin nhắn qua WebSocket
   * @param receiverId - ID người nhận
   * @param content - Nội dung tin nhắn
   */
  const sendMessage = (receiverId: any, content: string) => {
    console.log('🚀 Đang gửi tin nhắn tới ID:', receiverId, 'Kiểu:', typeof receiverId);
    
    if (!clientRef.current) {
      console.error('❌ Cannot send message: STOMP client is null');
      return;
    }
    
    if (!clientRef.current.connected) {
      console.error('❌ Chưa kết nối WebSocket, không thể gửi!');
      return;
    }

    // Ép kiểu sang số nguyên (Backend Java yêu cầu Long)
    const receiverIdLong = Number(receiverId);

    if (isNaN(receiverIdLong)) {
      console.error('❌ Lỗi: receiverId không phải là số!', receiverId);
      return;
    }

    const payload = {
      receiverId: receiverIdLong, // ✅ Đảm bảo luôn là số
      content
    };

    try {
      console.log('📤 Publishing to /app/chat.send | Payload:', payload);
      
      // Check lại client state trước khi gửi
      console.log('🔌 Client State:', { 
        connected: clientRef.current?.connected, 
        active: clientRef.current?.active 
      });

      clientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(payload)
      });
      console.log('✅ Message published successfully');
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