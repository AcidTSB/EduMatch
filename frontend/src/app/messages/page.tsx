'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter,
  Users,
  Clock,
  CheckCircle,
  Wifi,
  WifiOff,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageList, QuickContacts } from '@/components/messaging/MessageComponents';
import { ChatWindow } from '@/components/ChatWindow';
import { useRealTime } from '@/providers/RealTimeProvider';
import { useAuth } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function MessagesPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { 
    messages, 
    chatRooms, 
    onlineUsers,
    onlineUsersMap,
    isConnected,
    sendMessage,
    markMessagesAsRead,
    isRealTimeEnabled 
  } = useRealTime();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContactId, setSelectedContactId] = useState<string>();
  const [isMessagePanelOpen, setIsMessagePanelOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Get recent conversations (grouped by user, not individual messages)
  const recentConversations = React.useMemo(() => {
    if (!user) return [];
    
    const conversationsMap = new Map<string, any>();
    
    // Go through all messages and group by other user
    Object.entries(messages).forEach(([roomId, roomMessages]) => {
      if (!roomMessages || roomMessages.length === 0) return;
      
      // Get the other participant ID from room ID
      const otherUserId = roomId.startsWith(user.id + '-') 
        ? roomId.substring(user.id.length + 1)
        : roomId.endsWith('-' + user.id)
        ? roomId.substring(0, roomId.length - user.id.length - 1)
        : null;
      
      if (!otherUserId) return;
      
      // Get the last message in this room
      const sortedMessages = [...(roomMessages as any[])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const lastMessage = sortedMessages[0];
      
      // Count unread messages from other user
      const unreadCount = (roomMessages as any[]).filter(
        msg => msg.senderId === otherUserId && msg.status !== 'read'
      ).length;
      
      // Get user info
      const userInfo = onlineUsersMap.get(otherUserId);
      
      conversationsMap.set(otherUserId, {
        id: lastMessage.id,
        userId: otherUserId,
        senderName: userInfo?.name || otherUserId,
        senderRole: userInfo?.role || 'applicant',
        content: lastMessage.content,
        timestamp: lastMessage.createdAt,
        isRead: lastMessage.status === 'read',
        senderAvatar: '',
        senderId: lastMessage.senderId,
        isFromCurrentUser: lastMessage.senderId === user.id,
        unreadCount,
        isOnline: onlineUsers.includes(otherUserId)
      });
    });
    
    // Convert to array and sort by timestamp
    return Array.from(conversationsMap.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [messages, user?.id, onlineUsersMap, onlineUsers]);

  // Convert chat rooms to contacts
  const onlineContacts = React.useMemo(() => {
    if (!user) return [];
    
    // Get contacts from chat rooms
    const roomContacts = Object.entries(chatRooms)
      .map(([roomId, room]: [string, any]) => {
        const otherParticipantId = room.participants?.find((p: string) => p !== user.id);
        if (!otherParticipantId) return null;
        
        const userInfo = onlineUsersMap.get(otherParticipantId);
        
        return {
          id: otherParticipantId,
          name: userInfo?.name || otherParticipantId,
          role: userInfo?.role || 'applicant',
          avatar: '',
          isOnline: onlineUsers.includes(otherParticipantId),
          unreadCount: room.unreadCount || 0,
          lastSeen: room.updatedAt || new Date().toISOString()
        };
      })
      .filter(Boolean) as any[];
    
    // Add online users who don't have chat rooms yet
    const onlineContactsOnly = onlineUsers
      .filter(userId => userId !== user.id)
      .filter(userId => !roomContacts.find(c => c.id === userId))
      .map(userId => {
        const userInfo = onlineUsersMap.get(userId);
        return {
          id: userId,
          name: userInfo?.name || userId,
          role: userInfo?.role || 'applicant',
          avatar: '',
          isOnline: true,
          unreadCount: 0,
          lastSeen: new Date().toISOString()
        };
      });
    
    return [...roomContacts, ...onlineContactsOnly];
  }, [chatRooms, onlineUsers, onlineUsersMap, user?.id]);

  // Filter conversations and contacts based on search query
  const filteredConversations = recentConversations.filter(conv =>
    conv.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = onlineContacts.filter(contact => {
    return contact.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate unread count from messages
  const unreadCount = React.useMemo(() => {
    let count = 0;
    Object.entries(messages).forEach(([roomId, roomMessages]) => {
      (roomMessages as any[]).forEach((msg: any) => {
        if (msg.receiverId === user?.id && msg.status !== 'read') {
          count++;
        }
      });
    });
    return count;
  }, [messages, user?.id]);

  const handleMessageClick = (conversationId: string) => {
    // Find the conversation and open chat with that user
    const conversation = recentConversations.find(c => c.id === conversationId);
    if (conversation) {
      setSelectedContactId(conversation.userId);
      setIsMessagePanelOpen(true);
    }
  };

  const handleContactClick = (contactId: string) => {
    setSelectedContactId(contactId);
    setIsMessagePanelOpen(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">{t('messages.loginRequired')}</p>
          <Link href="/auth/login">
            <Button className="bg-blue-600 hover:bg-blue-700">
              {t('messages.goToLogin')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-blue-50 to-brand-cyan-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center space-x-3">
                <MessageSquare className="h-10 w-10 text-brand-blue-600" />
                <span>{t('messages.title')}</span>
              </h1>
              <p className="text-gray-600 mt-2">
                {t('messages.subtitle').replace('{role}', user.role === 'applicant' ? t('messages.subtitleProvider') : t('messages.subtitleStudent'))}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              {/* Real-time Connection Status */}
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <>
                    <Wifi className="h-4 w-4 text-green-600" />
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      {t('messages.connected')}
                    </Badge>
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 text-red-600" />
                    <Badge variant="outline" className="text-red-700 border-red-300">
                      {t('messages.disconnected')}
                    </Badge>
                  </>
                )}
              </div>
              
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-sm">
                  {t('messages.unread').replace('{count}', unreadCount.toString())}
                </Badge>
              )}
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {t('messages.filter')}
              </Button>
              <Dialog open={isNewChatModalOpen} onOpenChange={setIsNewChatModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-brand-blue-600 hover:bg-brand-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('messages.newChat')}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('messages.startNewChat')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      {t('messages.selectUser')}
                    </p>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {onlineContacts.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">
                          {t('messages.noUsersAvailable')}
                        </p>
                      ) : (
                        onlineContacts.map((contact) => (
                          <div
                            key={contact.id}
                            onClick={() => {
                              setSelectedContactId(contact.id);
                              setIsMessagePanelOpen(true);
                              setIsNewChatModalOpen(false);
                            }}
                            className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <div className="relative">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {contact.name.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-white rounded-full"></div>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{contact.name}</p>
                              <p className="text-xs text-gray-500 capitalize">{contact.role}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('messages.searchPlaceholder')}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-brand-blue-100 rounded-lg mr-4">
                <MessageSquare className="h-6 w-6 text-brand-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{recentConversations.length}</p>
                <p className="text-xs text-muted-foreground">{t('messages.stats.total')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mr-4">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{unreadCount}</p>
                <p className="text-xs text-muted-foreground">{t('messages.stats.unread')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{onlineContacts.length}</p>
                <p className="text-xs text-muted-foreground">{t('messages.stats.onlineUsers')}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mr-4">
                {isConnected ? (
                  <Wifi className="h-6 w-6 text-purple-600" />
                ) : (
                  <WifiOff className="h-6 w-6 text-purple-600" />
                )}
              </div>
              <div>
                <p className="text-lg font-bold">
                  {isConnected ? t('messages.connected') : t('messages.offline')}
                </p>
                <p className="text-xs text-muted-foreground">{t('messages.stats.status')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Messages and Contacts */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="messages" className="space-y-6">
              <TabsList>
                <TabsTrigger value="messages" className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>{t('messages.tabs.messages')}</span>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-2">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="contacts" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{t('messages.tabs.contacts')}</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="messages">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('messages.recent')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MessageList
                      messages={filteredConversations}
                      onMessageClick={handleMessageClick}
                      emptyStateText={searchQuery ? t('messages.noMatches') : t('messages.noMessages')}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contacts">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('messages.yourContacts')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {filteredContacts.length === 0 ? (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p className="text-gray-500">
                            {searchQuery 
                              ? t('messages.noContacts')
                              : isConnected 
                                ? t('messages.noOnlineUsers')
                                : t('messages.connectRequired')
                            }
                          </p>
                          {!isConnected && (
                            <p className="text-xs text-red-500 mt-2">
                              {t('messages.connectionRequired')}
                            </p>
                          )}
                        </div>
                      ) : (
                        filteredContacts.map((contact) => (
                          <div
                            key={contact.id}
                            onClick={() => handleContactClick(contact.id)}
                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium">
                                    {contact.name.substring(0, 2).toUpperCase()}
                                  </span>
                                </div>
                                {contact.isOnline && (
                                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{contact.name}</p>
                                <p className="text-sm text-gray-500 capitalize">{contact.role}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {contact.unreadCount > 0 && (
                                <Badge variant="destructive">
                                  {contact.unreadCount}
                                </Badge>
                              )}
                              <Button variant="outline" size="sm">
                                {t('messages.messageButton')}
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Quick Contacts Sidebar */}
          <div>
            <QuickContacts
              contacts={filteredContacts.slice(0, 5)}
              onContactClick={handleContactClick}
            />
          </div>
        </div>
      </div>

      {/* Chat Window */}
      {isMessagePanelOpen && selectedContactId && user && (
        <ChatWindow
          roomId={[user.id, selectedContactId].sort().join('-')}
          otherUserId={selectedContactId}
          otherUserName={filteredContacts.find(c => c.id === selectedContactId)?.name || 'User'}
          currentUserId={user.id}
          isOpen={isMessagePanelOpen}
          onClose={() => {
            setIsMessagePanelOpen(false);
            setSelectedContactId(undefined);
          }}
        />
      )}
    </div>
  );
}