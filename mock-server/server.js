import { Server } from 'socket.io';
import { createServer } from 'http';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3002"],
    methods: ["GET", "POST"]
  }
});

// Store connected users with their roles
const connectedUsers = new Map(); // socketId -> { userId, role, name }
const userSockets = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // Handle user authentication
  const userId = socket.handshake.auth?.userId;
  const userRole = socket.handshake.auth?.role || 'applicant';
  const userName = socket.handshake.auth?.name || 'Anonymous User';
  
  if (userId) {
    connectedUsers.set(socket.id, { userId, role: userRole, name: userName });
    userSockets.set(userId, socket.id);
    
    console.log(`User ${userName} (${userRole}) connected with ID: ${userId}`);
    
    // Notify others that user is online
    socket.broadcast.emit('user_online', { userId, role: userRole, name: userName });
    
    // Send current online users to the new user
    const onlineUsers = Array.from(connectedUsers.values())
      .map(user => ({ userId: user.userId, role: user.role, name: user.name }));
    
    socket.emit('online_users', onlineUsers);
    
    // Broadcast updated online users list to everyone
    io.emit('users_list_update', {
      onlineUsers: Array.from(connectedUsers.values()),
      totalOnline: connectedUsers.size
    });
  }

  // Handle room joining
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    const user = connectedUsers.get(socket.id);
    console.log(`User ${user?.name || 'unknown'} joined room ${roomId}`);
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    const user = connectedUsers.get(socket.id);
    console.log(`User ${user?.name || 'unknown'} left room ${roomId}`);
  });

  // Handle messaging
  socket.on('send_message', (messageData) => {
    const sender = connectedUsers.get(socket.id);
    const receiverSocketId = userSockets.get(messageData.receiverId);
    
    if (!sender) {
      console.log('Message rejected: Sender not authenticated');
      return;
    }
    
    // Check role-based permissions
    const canChat = checkChatPermissions(sender.role, messageData.receiverId);
    if (!canChat) {
      console.log(`Chat blocked: ${sender.role} cannot chat with target user`);
      socket.emit('chat_error', { message: 'You cannot chat with this user' });
      return;
    }
    
    const roomId = [messageData.senderId, messageData.receiverId].sort().join('-');
    const message = {
      id: `msg-${Date.now()}-${Math.random()}`,
      ...messageData,
      senderName: sender.name,
      senderRole: sender.role,
      createdAt: new Date().toISOString(),
      status: 'sent'
    };
    
    // Send to room (both participants will receive)
    io.to(roomId).emit('message', message);
    console.log(`Message sent from ${sender.name} to room ${roomId}:`, message.content);
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    const sender = connectedUsers.get(socket.id);
    if (sender) {
      socket.to(data.roomId).emit('typing', {
        ...data,
        userId: sender.userId,
        userName: sender.name
      });
    }
  });

  // Handle marking notifications as read
  socket.on('mark_notifications_read', (notificationIds) => {
    console.log('Notifications marked as read:', notificationIds);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    if (user) {
      connectedUsers.delete(socket.id);
      userSockets.delete(user.userId);
      
      // Notify others that user is offline
      socket.broadcast.emit('user_offline', { 
        userId: user.userId, 
        role: user.role, 
        name: user.name 
      });
      
      // Broadcast updated online users list to everyone
      io.emit('users_list_update', {
        onlineUsers: Array.from(connectedUsers.values()),
        totalOnline: connectedUsers.size
      });
      
      console.log(`User ${user.name} (${user.role}) disconnected`);
    }
  });
});

// Helper function to check chat permissions
function checkChatPermissions(senderRole, receiverId) {
  // For demo purposes, get receiver role from mock data
  // In real app, you'd query this from database
  const receiverRole = getMockUserRole(receiverId);
  
  // Same role can chat with each other
  if (senderRole === receiverRole) return true;
  
  // Student can chat with Provider and vice versa
  if (
    (senderRole === 'applicant' && receiverRole === 'provider') ||
    (senderRole === 'provider' && receiverRole === 'applicant')
  ) {
    return true;
  }
  
  // Admin can chat with everyone
  if (senderRole === 'admin') return true;
  
  return false;
}

// Mock function to get user role - replace with real DB query
function getMockUserRole(userId) {
  const mockRoles = {
    'student-1': 'applicant',
    'student-2': 'applicant', 
    'student-3': 'applicant',
    'provider-1': 'provider',
    'provider-2': 'provider',
    'provider-3': 'provider',
    'admin-1': 'admin'
  };
  
  return mockRoles[userId] || 'applicant';
}

// Demo: Send periodic notifications and updates
setInterval(() => {
  // Send to random connected users
  const users = Array.from(connectedUsers.values());
  if (users.length === 0) return;
  
  const randomUser = users[Math.floor(Math.random() * users.length)];
  const socketId = userSockets.get(randomUser.userId);
  
  if (socketId) {
    const notificationTypes = ['status', 'reminder', 'new_scholarship', 'match'];
    const randomType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    const notifications = {
      status: {
        id: `notif-${Date.now()}`,
        type: 'status',
        title: 'Application Status Updated',
        message: 'Your application for Tech Innovation Grant has been reviewed',
        createdAt: new Date().toISOString(),
        read: false
      },
      reminder: {
        id: `notif-${Date.now()}`,
        type: 'reminder',
        title: 'Application Deadline Reminder',
        message: 'AI Research Fellowship deadline is in 3 days',
        createdAt: new Date().toISOString(),
        read: false
      },
      new_scholarship: {
        id: `notif-${Date.now()}`,
        type: 'new_scholarship',
        title: 'New Scholarship Available',
        message: 'Data Science Excellence Award matching your profile',
        createdAt: new Date().toISOString(),
        read: false
      },
      match: {
        id: `notif-${Date.now()}`,
        type: 'match',
        title: 'Perfect Match Found!',
        message: 'Machine Learning Research Grant - 95% match',
        createdAt: new Date().toISOString(),
        read: false
      }
    };

    io.to(socketId).emit('notification', notifications[randomType]);
    console.log(`Sent ${randomType} notification to ${randomUser.name}`);
  }
}, 15000); // Every 15 seconds

// Demo: Send application status updates (only to applicants)
setInterval(() => {
  const applicants = Array.from(connectedUsers.values())
    .filter(user => user.role === 'applicant');
    
  if (applicants.length === 0) return;
  
  const randomApplicant = applicants[Math.floor(Math.random() * applicants.length)];
  const socketId = userSockets.get(randomApplicant.userId);
  
  if (socketId) {
    const statuses = ['pending', 'interview', 'accepted', 'rejected', 'waitlist'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    io.to(socketId).emit('application_status_update', {
      id: `app-${Math.floor(Math.random() * 100)}`,
      scholarshipId: `scholarship-${Math.floor(Math.random() * 50)}`,
      applicantId: randomApplicant.userId,
      status: randomStatus,
      updatedAt: new Date().toISOString(),
      notes: randomStatus === 'interview' ? 'Interview scheduled for next week' : undefined
    });
    
    console.log(`Sent status update (${randomStatus}) to ${randomApplicant.name}`);
  }
}, 20000); // Every 20 seconds

// Demo: Send dashboard stats updates (only to providers and admins)
setInterval(() => {
  const providersAndAdmins = Array.from(connectedUsers.values())
    .filter(user => user.role === 'provider' || user.role === 'admin');
    
  if (providersAndAdmins.length === 0) return;
  
  const stats = {
    totalViews: 1250 + Math.floor(Math.random() * 100),
    totalApplications: 486 + Math.floor(Math.random() * 20),
    totalMatches: 234 + Math.floor(Math.random() * 10),
    activeUsers: connectedUsers.size,
    pendingApplications: 156 + Math.floor(Math.random() * 10),
    acceptedApplications: 89 + Math.floor(Math.random() * 5),
    lastUpdated: new Date().toISOString()
  };
  
  providersAndAdmins.forEach(user => {
    const socketId = userSockets.get(user.userId);
    if (socketId) {
      io.to(socketId).emit('dashboard_stats_update', stats);
    }
  });
  
  console.log(`Sent dashboard stats to ${providersAndAdmins.length} providers/admins`);
}, 5000); // Every 5 seconds

// Demo: Send match suggestions (only to applicants)
setInterval(() => {
  const applicants = Array.from(connectedUsers.values())
    .filter(user => user.role === 'applicant');
    
  if (applicants.length === 0) return;
  
  const randomApplicant = applicants[Math.floor(Math.random() * applicants.length)];
  const socketId = userSockets.get(randomApplicant.userId);
  
  if (socketId) {
    const reasons = [
      'Computer Science major match',
      'GPA requirement met (3.8+)',
      'Research experience in AI',
      'Leadership experience',
      'Community service record',
      'Technical skills alignment',
      'Location preference match'
    ];

    const selectedReasons = reasons
      .sort(() => 0.5 - Math.random())
      .slice(0, 3 + Math.floor(Math.random() * 3));

    io.to(socketId).emit('match_suggestion', {
      id: `match-${Date.now()}`,
      scholarshipId: `scholarship-${Math.floor(Math.random() * 100)}`,
      applicantId: randomApplicant.userId,
      score: 75 + Math.floor(Math.random() * 25), // 75-100% match
      reasons: selectedReasons,
      createdAt: new Date().toISOString()
    });
    
    console.log(`Sent match suggestion to ${randomApplicant.name}`);
  }
}, 25000); // Every 25 seconds

const PORT = process.env.PORT || 3003;
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO Mock Server running on port ${PORT}`);
  console.log(`📡 CORS enabled for http://localhost:3000 and http://localhost:3002`);
  console.log(`🎭 Demo mode: Sending role-based events every 5-25 seconds`);
  console.log(`👥 Role-based chat: Students ↔ Students, Providers ↔ Providers, Students ↔ Providers, Admin ↔ All`);
});