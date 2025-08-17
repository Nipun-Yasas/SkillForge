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
  _id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: Date;
  isOwnMessage: boolean;
  senderAvatar?: string;
}

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

interface ChatInterfaceProps {
  selectedChat: ChatUser;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
}

export default function ChatInterface({ 
  selectedChat,
  messages: propMessages,
  onSendMessage
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(propMessages || []);

  // Update messages when propMessages change
  useEffect(() => {
    setMessages(propMessages || []);
  }, [propMessages]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await onSendMessage(message);
      setMessage("");
    } catch (error) {
      console.error('Failed to send message:', error);
    }
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
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                // For now, we'll show all users as online since we don't have real-time status
                <CircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
              }
            >
              <Avatar src={selectedChat.user.avatar} alt={selectedChat.user.name} sx={{ width: 45, height: 45 }}>
                {selectedChat.user.name.charAt(0)}
              </Avatar>
            </Badge>
            <Box>
              <Typography variant="h6" fontWeight="bold" component="div">
                {selectedChat.user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" component="div">
                <span style={{ color: '#4caf50' }}>● Online</span>
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
          p: 2
        }}
      >
        <List sx={{ p: 0 }}>
          {messages.map((msg) => (
            <ListItem
              key={msg._id}
              sx={{
                display: 'flex',
                justifyContent: msg.isOwnMessage ? 'flex-end' : 'flex-start',
                p: 1
              }}
            >
              <Box
                sx={{
                  maxWidth: '70%',
                  display: 'flex',
                  flexDirection: msg.isOwnMessage ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  gap: 1
                }}
              >
                {!msg.isOwnMessage && (
                  <Avatar 
                    src={msg.senderAvatar || selectedChat.user.avatar} 
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
                      backgroundColor: msg.isOwnMessage ? 'primary.main' : '',
                      color: msg.isOwnMessage ? 'white' : 'text.primary',
                      borderRadius: 3,
                      borderTopRightRadius: msg.isOwnMessage ? 1 : 3,
                      borderTopLeftRadius: msg.isOwnMessage ? 3 : 1
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
                      textAlign: msg.isOwnMessage ? 'right' : 'left',
                      px: 1
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
