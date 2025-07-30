"use client";

import React from 'react';
import {
  Box,
  Typography,
  Paper
} from '@mui/material';
import {
  Message as MessageIcon,
  Chat as ChatIcon
} from '@mui/icons-material';

export default function ChatWelcome() {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey.50',
        flexDirection: 'column',
        p: 4
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          backgroundColor: 'transparent',
          maxWidth: 400
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            gap: 1
          }}
        >
          <ChatIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          <MessageIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
        </Box>
        
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #007BFF 30%, #6A0DAD 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Welcome to SkillForge Chat
        </Typography>
        
        <Typography 
          variant="h6" 
          color="text.secondary" 
          gutterBottom
          sx={{ mb: 3 }}
        >
          Connect, Learn, and Grow Together
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          💬 Start chatting by selecting a conversation from the sidebar
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          🤝 Or begin a new conversation with mentors and students
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Share knowledge • Ask questions • Build connections
        </Typography>
      </Paper>
    </Box>
  );
}
