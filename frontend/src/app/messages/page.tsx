'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  MessageSquare, 
  Search, 
  Users,
  Clock,
  Wifi,
  WifiOff,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';
import { useAuth } from '@/lib/auth';
import chatService from '@/services/chat.service';
import Link from 'next/link';
import { Client } from '@stomp/stompjs';

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  sentAt: string;
}

interface Conversation {
  conversationId: number;
  otherParticipantId: number;
  otherUserName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export default function MessagesPage() {
  const { user } = useAuth();
  
  // STOMP WebSocket connection
  const { 
    socket, 
    isConnected, 
    messages: stompMessages,
    sendMessage: sendStompMessage // Use the sendMessage function from hook
  } = useSocket(user?.id, user?.role, user?.name);
  
  // State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Ref for auto-scrolling to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations from backend
  const loadConversations = async () => {
    if (!user) return;
    
    try {
      setIsLoadingConversations(true);
      const response = await chatService.getConversations();
      console.log('✅ Loaded conversations:', response);
      setConversations(response);
    } catch (error) {
      console.error('❌ Error loading conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  // Load messages for selected conversation
  const loadMessages = async (conversationId: number) => {
    if (!user) return;
    
    try {
      setIsLoadingMessages(true);
      const response = await chatService.getMessages(conversationId);
      console.log('✅ Loaded messages:', response);
      // Response is { content: Message[], totalPages, totalElements }
      const messages = response.content || [];
      // Sort by sentAt ascending (oldest first, newest last)
      const sortedMessages = messages.sort((a, b) => 
        new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );
      setChatMessages(sortedMessages);
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      setChatMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Send message via STOMP
  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation || !user || !isConnected) return;
    
    try {
      setIsSending(true);
      
      console.log('📤 Sending message to user:', selectedConversation.otherParticipantId);
      
      // Use the sendMessage function from useSocket hook
      sendStompMessage(selectedConversation.otherParticipantId.toString(), messageInput.trim());
      
      // Optimistically add message to UI
      const optimisticMessage: Message = {
        id: Date.now(),
        content: messageInput.trim(),
        senderId: parseInt(user.id),
        receiverId: selectedConversation.otherParticipantId,
        sentAt: new Date().toISOString()
      };
      
      setChatMessages(prev => [...prev, optimisticMessage]);
      setMessageInput('');
      
      // Reload conversations to update last message
      setTimeout(() => loadConversations(), 500);
    } catch (error) {
      console.error('❌ Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Handle new STOMP messages
  useEffect(() => {
    if (!stompMessages || stompMessages.length === 0) return;
    
    console.log('🔔 New STOMP messages:', stompMessages);
    
    // Get the latest message
    const latestMessage = stompMessages[stompMessages.length - 1];
    
    // If this message is for the currently selected conversation, add it
    if (selectedConversation) {
      const isRelevant = 
        (latestMessage.senderId === selectedConversation.otherParticipantId && latestMessage.receiverId === parseInt(user?.id || '0')) ||
        (latestMessage.receiverId === selectedConversation.otherParticipantId && latestMessage.senderId === parseInt(user?.id || '0'));
      
      if (isRelevant) {
        setChatMessages(prev => {
          // Avoid duplicates
          if (prev.find(m => m.id === latestMessage.id)) return prev;
          return [...prev, latestMessage];
        });
      }
    }
    
    // Reload conversations to update last message
    loadConversations();
  }, [stompMessages, selectedConversation, user?.id]);

  // Initial load
  useEffect(() => {
    loadConversations();
  }, [user]);

  // Load messages when selecting a conversation
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.conversationId);
    }
  }, [selectedConversation]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    return conversations.filter(conv => 
      conv.otherUserName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  // Calculate stats
  const totalUnread = useMemo(() => {
    return conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
  }, [conversations]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">Please login to view messages</p>
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-sm text-gray-600">
                  {isConnected ? (
                    <span className="flex items-center space-x-1">
                      <Wifi className="h-3 w-3 text-green-600" />
                      <span>Connected</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <WifiOff className="h-3 w-3 text-red-600" />
                      <span>Disconnected</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            {totalUnread > 0 && (
              <Badge variant="destructive" className="text-lg px-4 py-2">
                {totalUnread} unread
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="flex items-center p-4">
              <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{conversations.length}</p>
                <p className="text-sm text-gray-600">Total Conversations</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-4">
              <Clock className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-2xl font-bold">{totalUnread}</p>
                <p className="text-sm text-gray-600">Unread Messages</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-4">
              {isConnected ? (
                <Wifi className="h-8 w-8 text-green-600 mr-3" />
              ) : (
                <WifiOff className="h-8 w-8 text-gray-400 mr-3" />
              )}
              <div>
                <p className="text-lg font-bold">
                  {isConnected ? 'Connected' : 'Offline'}
                </p>
                <p className="text-sm text-gray-600">Connection Status</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle>Conversations</CardTitle>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search conversations..."
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingConversations ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-500">Loading...</p>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p className="text-gray-500">No conversations yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Start chatting with students or employers
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredConversations.map((conv) => (
                      <div
                        key={conv.conversationId}
                        onClick={() => setSelectedConversation(conv)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedConversation?.conversationId === conv.conversationId
                            ? 'bg-blue-50 border-l-4 border-blue-600'
                            : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-semibold text-gray-900 truncate">
                                {conv.otherUserName || `User ${conv.otherParticipantId}`}
                              </p>
                              {conv.unreadCount > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {conv.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {conv.lastMessage || 'No messages yet'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(conv.lastMessageAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {selectedConversation.otherUserName?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {selectedConversation.otherUserName || `User ${selectedConversation.otherParticipantId}`}
                          </h3>
                          <p className="text-xs text-gray-500">
                            User ID: {selectedConversation.otherParticipantId}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoadingMessages ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Loading messages...</p>
                      </div>
                    ) : chatMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-xs text-gray-400">Send a message to start the conversation</p>
                      </div>
                    ) : (
                      <>
                        {chatMessages.map((msg) => {
                          const isOwnMessage = msg.senderId === parseInt(user.id);
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                  isOwnMessage
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-900'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                                <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                                  {new Date(msg.sentAt).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        {/* Invisible div for auto-scrolling */}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </CardContent>

                  {/* Input */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        disabled={isSending || !isConnected}
                        className="flex-1"
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={!messageInput.trim() || isSending || !isConnected}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSending ? 'Sending...' : 'Send'}
                      </Button>
                    </div>
                    {!isConnected && (
                      <p className="text-xs text-red-600 mt-2">
                        ⚠️ Not connected to chat server. Please refresh the page.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 text-lg">Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
