'use client';

import React, { useState, useEffect } from 'react';
import { UserRole } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { useRealTime } from '@/providers/RealTimeProvider';
import { cn } from '@/lib/utils';
import { 
  MessageCircle, 
  Search, 
  Users, 
  GraduationCap, 
  Building,
  Crown,
  Filter
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  role: 'user' | 'employer' | 'admin';
  avatar?: string;
  bio?: string;
  isOnline: boolean;
}

interface UserDirectoryProps {
  onStartChat: (user: User) => void;
}

export function UserDirectory({ onStartChat }: UserDirectoryProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [onlineFilter, setOnlineFilter] = useState<string>('all');
  
  const { user: currentUser } = useAuth();
  const { socket } = useRealTime();

  // Define role-based chat rules
  const canChatWith = (targetRole: string): boolean => {
    if (!currentUser) return false;
    const { role: currentRole } = currentUser;
    if (currentRole === UserRole.ADMIN) return true;
    if (currentRole === UserRole.USER && (targetRole === 'user' || targetRole === 'employer')) return true;
    if (currentRole === UserRole.EMPLOYER && (targetRole === 'employer' || targetRole === 'user')) return true;
    return false;
  };

  // Load mock users and track online status
  useEffect(() => {
    const mockUsers = [
      { id: '1', name: 'John Student', role: 'user' as const, bio: 'Computer Science • MIT', isOnline: false },
      { id: '2', name: 'Jane Employer', role: 'employer' as const, bio: 'AI & Machine Learning • Tech Innovation Foundation', isOnline: false },
      { id: '3', name: 'Admin User', role: 'admin' as const, bio: 'System Administrator', isOnline: false }
    ];

    // Filter out current user and users they can't chat with
    const availableUsers = mockUsers
      .filter(u => u.id !== currentUser?.id)
      .filter(u => canChatWith(u.role));

    setUsers(availableUsers);
  }, [currentUser, canChatWith]);

  // Track online users via socket
  useEffect(() => {
    if (!socket) return;

    const updateOnlineStatus = (onlineUserIds: string[]) => {
      setUsers(prevUsers => 
        prevUsers.map(user => ({
          ...user,
          isOnline: onlineUserIds.includes(user.id)
        }))
      );
    };

    // Listen for user presence updates
    socket.on('users_list_update', (data: any) => {
      const onlineIds = data.onlineUsers?.map((u: any) => u.userId) || [];
      updateOnlineStatus(onlineIds);
    });

    socket.on('user_online', (userData: any) => {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userData.userId
            ? { ...user, isOnline: true }
            : user
        )
      );
    });

    socket.on('user_offline', (userData: any) => {
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userData.userId
            ? { ...user, isOnline: false }
            : user
        )
      );
    });

    return () => {
      if (socket) {
        socket.off('users_list_update');
        socket.off('user_online');
        socket.off('user_offline');
      }
    };
  }, [socket]);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Online status filter
    if (onlineFilter === 'online') {
      filtered = filtered.filter(user => user.isOnline);
    } else if (onlineFilter === 'offline') {
      filtered = filtered.filter(user => !user.isOnline);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, onlineFilter]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'applicant':
        return <GraduationCap className="h-4 w-4" />;
      case 'provider':
        return <Building className="h-4 w-4" />;
      case 'admin':
        return <Crown className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'applicant':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'provider':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStartChat = (user: User) => {
    if (!canChatWith(user.role)) {
      alert(`You cannot chat with ${user.role}s`);
      return;
    }
    onStartChat(user);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with Search */}
      <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Chat Directory</h3>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
        
        <div className="flex space-x-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
          >
            <option value="all">All Roles</option>
            <option value="applicant">Students</option>
            <option value="provider">Providers</option>
            <option value="admin">Admins</option>
          </select>
          
          <select
            value={onlineFilter}
            onChange={(e) => setOnlineFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium">No users found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-200 hover:shadow-sm"
                onClick={() => handleStartChat(user)}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-semibold shadow-md">
                    {user.avatar || user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                    user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">{user.name}</h4>
                    <Badge className={cn(
                      "text-xs px-2 py-0.5 rounded-full flex items-center gap-1 border",
                      getRoleBadgeColor(user.role)
                    )}>
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </Badge>
                  </div>
                  {user.bio && (
                    <p className="text-sm text-gray-600 truncate">{user.bio}</p>
                  )}
                  <div className="flex items-center gap-1 mt-1">
                    <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-xs text-gray-500">
                      {user.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300 rounded-lg px-4 py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartChat(user);
                  }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Connected to chat
          </span>
          <span>{filteredUsers.filter(u => u.isOnline).length} users online</span>
        </div>
      </div>
    </div>
  );
}