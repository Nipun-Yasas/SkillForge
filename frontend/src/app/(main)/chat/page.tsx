"use client";

import React, { useState } from 'react';
import { Box } from '@mui/material';
import ChatSidebar from './_components/ChatSidebar';
import ChatWelcome from './_components/ChatWelcome';
import ChatInterface from './_components/ChatInterface';

interface User {
  id: string;
  name: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: string;
}

interface Conversation {
  id: string;
  user: {
    name: string;
    avatar?: string;
    isOnline: boolean;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleUserSelect = (user: User) => {
    // Create a new conversation with selected user
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      user: user,
      lastMessage: '',
      timestamp: 'Now',
      unreadCount: 0
    };
    setSelectedConversation(newConversation);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: 'calc(100vh - 64px)', // Account for app header
      backgroundColor: 'grey.50'
    }}>
      {/* Sidebar */}
      <ChatSidebar 
        onConversationSelect={handleConversationSelect}
        onUserSelect={handleUserSelect}
        selectedConversationId={selectedConversation?.id}
      />
      
      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: 'flex' }}>
        {selectedConversation ? (
          <ChatInterface
            recipientName={selectedConversation.user.name}
            recipientAvatar={selectedConversation.user.avatar}
            isOnline={selectedConversation.user.isOnline}
          />
        ) : (
          <ChatWelcome />
        )}
      </Box>
    </Box>
  );
}
