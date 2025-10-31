/**
 * Simple Socket.IO Server for Testing
 * Run: node socket-server.js
 */

const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Store online users
const onlineUsers = new Map(); // userId -> { socketId, role, name }

io.on('connection', (socket) => {
  const { userId, role, name } = socket.handshake.auth;
  
  console.log(`✅ User connected: ${name} (${role}) - Socket: ${socket.id}`);
  
  if (userId) {
    // Add user to online users
    onlineUsers.set(userId, { socketId: socket.id, role, name });
    
    // Broadcast to all users that someone came online
    socket.broadcast.emit('user_online', { userId, role, name });
    
    // Send current online users to the newly connected user
    const users = Array.from(onlineUsers.entries()).map(([id, data]) => ({
      userId: id,
      role: data.role,
      name: data.name
    }));
    socket.emit('online_users', users);
    
    // Broadcast updated users list
    io.emit('users_list_update', {
      onlineUsers: users,
      totalOnline: users.length
    });
  }
  
  // Handle joining chat room
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`📥 ${name} joined room: ${roomId}`);
  });
  
  // Handle leaving chat room
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`📤 ${name} left room: ${roomId}`);
  });
  
  // Handle sending messages
  socket.on('send_message', (message) => {
    // Calculate consistent room ID
    const roomId = [message.senderId, message.receiverId].sort().join('-');
    
    const fullMessage = {
      ...message,
      id: message.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: message.createdAt || new Date().toISOString(),
      status: 'delivered',
      senderName: name
    };
    
    console.log(`💬 Message from ${name} in room ${roomId}:`, message.content);
    
    // Emit to the room (all users in the room will receive it)
    io.to(roomId).emit('message', fullMessage);
    
    // Also emit directly to both users by their socket IDs to ensure delivery
    const senderData = Array.from(onlineUsers.entries())
      .find(([id]) => id === message.senderId);
    const receiverData = Array.from(onlineUsers.entries())
      .find(([id]) => id === message.receiverId);
    
    if (senderData) {
      io.to(senderData[1].socketId).emit('message', fullMessage);
    }
    if (receiverData) {
      io.to(receiverData[1].socketId).emit('message', fullMessage);
    }
  });
  
  // Handle typing indicator
  socket.on('typing', ({ roomId, userId: typingUserId, isTyping }) => {
    socket.to(roomId).emit('typing', { userId: typingUserId, roomId, isTyping });
  });
  
  // Handle mark messages as read
  socket.on('mark_messages_read', ({ roomId, messageIds }) => {
    console.log(`✓ ${name} marked ${messageIds.length} messages as read in room ${roomId}`);
    socket.to(roomId).emit('messages_read', { roomId, messageIds, readBy: userId });
  });
  
  // Handle mark notifications as read
  socket.on('mark_notifications_read', (notificationIds) => {
    console.log(`✓ ${name} marked ${notificationIds.length} notifications as read`);
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${name} - Socket: ${socket.id}`);
    
    if (userId && onlineUsers.has(userId)) {
      onlineUsers.delete(userId);
      
      // Broadcast to all users that someone went offline
      socket.broadcast.emit('user_offline', { userId, role, name });
      
      // Broadcast updated users list
      const users = Array.from(onlineUsers.entries()).map(([id, data]) => ({
        userId: id,
        role: data.role,
        name: data.name
      }));
      
      io.emit('users_list_update', {
        onlineUsers: users,
        totalOnline: users.length
      });
    }
  });
});

const PORT = process.env.PORT || 3003;

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO Server running on http://localhost:${PORT}`);
  console.log(`📡 Waiting for connections...`);
});

// Test notification sender (every 30 seconds)
setInterval(() => {
  if (onlineUsers.size > 0) {
    const users = Array.from(onlineUsers.keys());
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const userData = onlineUsers.get(randomUser);
    
    const notification = {
      id: `notif-${Date.now()}`,
      type: 'NEW_SCHOLARSHIP',
      title: 'New Scholarship Available!',
      message: 'A new scholarship matching your profile has been posted',
      createdAt: new Date().toISOString(),
      read: false,
      metadata: { scholarshipId: 'test-123' }
    };
    
    io.to(userData.socketId).emit('notification', notification);
    console.log(`🔔 Sent test notification to ${userData.name}`);
  }
}, 30000);
