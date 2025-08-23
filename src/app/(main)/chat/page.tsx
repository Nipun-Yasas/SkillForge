"use client";

import React, { useState, useEffect } from 'react';
import { Box, Container, useTheme, useMediaQuery, Typography } from '@mui/material';
import ChatSidebar from './components/ChatSidebar';
import ChatWelcome from './components/ChatWelcome';
import ChatInterface from './components/ChatInterface';
import { ChatAPI } from '@/lib/chatTestUtils';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

interface ChatUser {
  conversationId?: string;
  user: User;
  lastMessage?: string;
  lastMessageTime?: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lastMessageSender?: any;
}

interface Message {
  _id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  createdAt: Date;
  isOwnMessage: boolean;
}

export default function ChatPage() {
  const [chats, setChats] = useState<ChatUser[]>([]);
  const [usersForNewConversation, setUsersForNewConversation] = useState<User[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true); // sidebar/loading users
  const [lastMessageTime, setLastMessageTime] = useState<string>('');
  const [messagesLoading, setMessagesLoading] = useState(false);
  
  // Mobile responsive state
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Start with sidebar open
  const [isClient, setIsClient] = useState(false);

  // Load users and conversations
  const loadUsersAndConversations = async () => {
    try {
      const data = await ChatAPI.getUsers();
      setChats(data.chats || []);
      setUsersForNewConversation(data.usersForNewConversation || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setIsLoading(false);
    }
  };

  // Load messages for selected conversation
  const loadMessages = async (conversationId: string) => {
    try {
      setMessagesLoading(true);
      const data = await ChatAPI.getMessages(conversationId);
      setMessages(data.messages || []);
      if (data.messages && data.messages.length > 0) {
        setLastMessageTime(data.messages[data.messages.length - 1].createdAt);
      } else {
        setLastMessageTime('');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  // Handle selecting an existing chat
  const handleChatSelect = (chat: ChatUser) => {
    setSelectedChat(chat);
    setMessages([]); // Clear previous messages so skeleton can show
    setMessagesLoading(true);
    if (chat.conversationId) {
      loadMessages(chat.conversationId);
    } else {
      setMessagesLoading(false);
    }
    
    // Close sidebar on mobile when chat is selected
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Handle selecting a user for new conversation
  const handleUserSelect = async (user: User) => {
    try {
      const conversation = await ChatAPI.createConversation(user._id);
      const newChat: ChatUser = {
        conversationId: conversation.conversationId,
        user: user,
        lastMessage: 'Start chatting...',
        lastMessageTime: new Date(),
      };
      setSelectedChat(newChat);
      setChats(prev => [newChat, ...prev]);
      setUsersForNewConversation(prev => prev.filter(u => u._id !== user._id));
      setMessages([]); // Clear messages for new conversation
      setMessagesLoading(true);
      loadMessages(conversation.conversationId);
      
      // Close sidebar on mobile when chat is selected
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      setMessagesLoading(false);
    }
  };

  // Handle going back to sidebar on mobile
  const handleBackToSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(true);
      setSelectedChat(null);
    }
  };

  // Handle sending message
  const handleSendMessage = async (content: string) => {
    if (!selectedChat?.conversationId) return;

    try {
      const result = await ChatAPI.sendMessage(selectedChat.conversationId, content);
      if (result.message) {
        setMessages(prev => [...prev, result.message]);
        setLastMessageTime(result.message.createdAt);
        
        // Update the chat's last message in the sidebar
        setChats(prev => prev.map(chat => 
          chat.conversationId === selectedChat.conversationId 
            ? { ...chat, lastMessage: content, lastMessageTime: new Date() }
            : chat
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Ensure proper hydration and mobile detection
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle sidebar state based on mobile and selected chat
  useEffect(() => {
    if (isClient) {
      if (isMobile) {
        // On mobile: show sidebar when no chat is selected
        setIsSidebarOpen(!selectedChat);
      } else {
        // On desktop: always show sidebar
        setIsSidebarOpen(true);
      }
    }
  }, [isMobile, selectedChat, isClient]);

  // Polling for real-time updates
  useEffect(() => {
    if (isLoading) return; // Don't start polling until initial load is done

    const pollInterval = setInterval(async () => {
      try {
        // Poll conversation list
        const conversationsData = await ChatAPI.pollUpdates();
        if (conversationsData.conversations) {
          setChats(conversationsData.conversations);
        }

        // Poll for new messages if a conversation is selected
        if (selectedChat?.conversationId && lastMessageTime) {
          const messagesData = await ChatAPI.pollUpdates(
            selectedChat.conversationId,
            lastMessageTime
          );
          if (messagesData.hasNewMessages && messagesData.newMessages.length > 0) {
            setMessages(prev => [...prev, ...messagesData.newMessages]);
            setLastMessageTime(messagesData.newMessages[messagesData.newMessages.length - 1].createdAt);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000); // Poll every 5 seconds to reduce server load

    return () => clearInterval(pollInterval);
  }, [selectedChat?.conversationId, lastMessageTime, isLoading]);

  // Initial load
  useEffect(() => {
    loadUsersAndConversations();
  }, []);

  // Don't render until client-side to prevent hydration mismatches
  if (!isClient) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          height: '75vh',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography>Loading chat...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        height: '75vh',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: { xs: '100%', md: '350px' },
            height: '100%',
            position: { xs: 'absolute', md: 'relative' },
            left: { xs: isSidebarOpen ? 0 : '-100%', md: 0 },
            top: 0,
            zIndex: { xs: 1000, md: 1 },
            transition: { xs: 'left 0.3s ease-in-out', md: 'none' },
            // Show sidebar on mobile when no chat is selected or sidebar is open
            // Always show on desktop
            display: { 
              xs: (isSidebarOpen || !selectedChat) ? 'block' : 'none', 
              md: 'block' 
            }
          }}
        >
          <ChatSidebar
            chats={chats}
            usersForNewConversation={usersForNewConversation}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
            onUserSelect={handleUserSelect}
            isLoading={isLoading}
          />
        </Box>

        {/* Chat Interface */}
        <Box 
          sx={{ 
            flex: 1, 
            flexDirection: 'column',
            width: { xs: '100%', md: 'calc(100% - 350px)' },
            position: { xs: 'absolute', md: 'relative' },
            left: { xs: isSidebarOpen ? '100%' : 0, md: 0 },
            top: 0,
            height: '100%',
            transition: { xs: 'left 0.3s ease-in-out', md: 'none' },
            zIndex: { xs: 999, md: 1 },
            // Hide chat interface on mobile when sidebar is open or no chat selected
            display: { 
              xs: (isSidebarOpen || !selectedChat) ? 'none' : 'flex', 
              md: 'flex' 
            }
          }}
        >
          {selectedChat ? (
            <ChatInterface
              selectedChat={selectedChat}
              isLoading={messagesLoading && messages.length === 0}
              messages={messages}
              onSendMessage={handleSendMessage}
              onBackToSidebar={isMobile ? handleBackToSidebar : undefined}
              isMobile={isMobile}
            />
          ) : (
            // Only show welcome screen on desktop when no chat is selected
            !isMobile && <ChatWelcome />
          )}
        </Box>

        {/* Mobile backdrop - only show when sidebar is open on mobile and there's a selected chat */}
        {isMobile && isSidebarOpen && selectedChat && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999,
            }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </Box>
    </Container>
  );
}
