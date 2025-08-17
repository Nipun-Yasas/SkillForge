"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ChatSidebar from './_components/ChatSidebar';
import ChatWelcome from './_components/ChatWelcome';
import ChatInterface from './_components/ChatInterface';
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
  const [isLoading, setIsLoading] = useState(true);
  const [lastMessageTime, setLastMessageTime] = useState<string>('');

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
      const data = await ChatAPI.getMessages(conversationId);
      setMessages(data.messages || []);
      if (data.messages && data.messages.length > 0) {
        setLastMessageTime(data.messages[data.messages.length - 1].createdAt);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Handle selecting an existing chat
  const handleChatSelect = (chat: ChatUser) => {
    setSelectedChat(chat);
    if (chat.conversationId) {
      loadMessages(chat.conversationId);
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
      loadMessages(conversation.conversationId);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  // Send message
  const handleSendMessage = async (content: string) => {
    if (!selectedChat?.conversationId) return;

    try {
      const result = await ChatAPI.sendMessage(selectedChat.conversationId, content);
      if (result.message) {
        setMessages(prev => [...prev, result.message]);
        setLastMessageTime(result.message.createdAt);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Polling for real-time updates
  useEffect(() => {
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
    }, 300); // Poll every 300ms as requested

    return () => clearInterval(pollInterval);
  }, [selectedChat?.conversationId, lastMessageTime]);

  // Initial load
  useEffect(() => {
    loadUsersAndConversations();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Chat System
      </Typography>

      {/* Testing Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => ChatAPI.runFullTest()}
          size="small"
        >
          🧪 Run Full API Test
        </Button>
        <Button 
          variant="outlined" 
          onClick={loadUsersAndConversations}
          size="small"
        >
          🔄 Refresh Users
        </Button>
      </Box>

      <Box sx={{ 
        display: 'flex', 
        height: '70vh',
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        {/* Sidebar */}
        <ChatSidebar
          chats={chats}
          usersForNewConversation={usersForNewConversation}
          selectedChat={selectedChat}
          onChatSelect={handleChatSelect}
          onUserSelect={handleUserSelect}
          isLoading={isLoading}
        />

        {/* Chat Interface */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedChat ? (
            <ChatInterface
              chat={selectedChat}
              messages={messages}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <ChatWelcome />
          )}
        </Box>
      </Box>
    </Container>
  );
}
