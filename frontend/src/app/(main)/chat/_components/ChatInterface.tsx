"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Badge,
  List,
  ListItem,
  InputAdornment,
  Chip
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
  Circle as CircleIcon,
  VideoCall as VideoCallIcon,
  Call as CallIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatInterfaceProps {
  recipientName: string;
  recipientAvatar?: string;
  isOnline: boolean;
}

export default function ChatInterface({ 
  recipientName, 
  recipientAvatar, 
  isOnline 
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: '1',
      senderName: recipientName,
      content: 'Hey! Thanks for agreeing to mentor me in React. When can we start?',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: '2',
      senderId: 'me',
      senderName: 'Me',
      content: 'Hi! I\'m excited to help you learn React. How about we start with the basics this weekend?',
      timestamp: '10:32 AM',
      isOwn: true
    },
    {
      id: '3',
      senderId: '1',
      senderName: recipientName,
      content: 'Perfect! Should I prepare anything beforehand?',
      timestamp: '10:35 AM',
      isOwn: false
    },
    {
      id: '4',
      senderId: 'me',
      senderName: 'Me',
      content: 'Just make sure you have Node.js installed and a code editor ready. We\'ll start with creating your first React component!',
      timestamp: '10:36 AM',
      isOwn: true
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      senderName: 'Me',
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Chat Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderRadius: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                isOnline ? (
                  <CircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                ) : null
              }
            >
              <Avatar src={recipientAvatar} alt={recipientName} sx={{ width: 45, height: 45 }}>
                {recipientName.charAt(0)}
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {recipientName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isOnline ? (
                  <span style={{ color: '#4caf50' }}>● Online</span>
                ) : (
                  'Last seen recently'
                )}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton color="primary">
              <CallIcon />
            </IconButton>
            <IconButton color="primary">
              <VideoCallIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: 'grey.50',
          p: 2
        }}
      >
        <List sx={{ p: 0 }}>
          {messages.map((msg) => (
            <ListItem
              key={msg.id}
              sx={{
                display: 'flex',
                justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                p: 1
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: msg.isOwn ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: 1
                }}
              >
                {!msg.isOwn && (
                  <Avatar 
                    src={recipientAvatar} 
                    alt={msg.senderName}
                    sx={{ width: 32, height: 32 }}
                  >
                    {msg.senderName.charAt(0)}
                  </Avatar>
                )}

                <Box>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      backgroundColor: msg.isOwn ? 'primary.main' : 'white',
                      color: msg.isOwn ? 'white' : 'text.primary',
                      borderRadius: 3,
                      borderTopRightRadius: msg.isOwn ? 1 : 3,
                      borderTopLeftRadius: msg.isOwn ? 3 : 1
                    }}
                  >
                    <Typography variant="body1" component="div">
                      {msg.content}
                    </Typography>
                  </Paper>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    component="div"
                    sx={{ 
                      display: 'block', 
                      mt: 0.5,
                      textAlign: msg.isOwn ? 'right' : 'left',
                      px: 1
                    }}
                  >
                    {msg.timestamp}
                  </Typography>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 0,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <IconButton size="small" color="primary">
            <AttachFileIcon />
          </IconButton>
          
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: 'grey.50'
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small">
                    <EmojiIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            sx={{
              bgcolor: message.trim() ? 'primary.main' : 'grey.300',
              color: 'white',
              '&:hover': {
                bgcolor: message.trim() ? 'primary.dark' : 'grey.400'
              },
              '&:disabled': {
                color: 'grey.500'
              }
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Chip
            label="Schedule Session"
            size="small"
            variant="outlined"
            clickable
            sx={{ fontSize: '0.75rem' }}
          />
          <Chip
            label="Share Resource"
            size="small"
            variant="outlined"
            clickable
            sx={{ fontSize: '0.75rem' }}
          />
          <Chip
            label="Quick Thanks"
            size="small"
            variant="outlined"
            clickable
            onClick={() => setMessage("Thank you for the help! 🙏")}
            sx={{ fontSize: '0.75rem' }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
