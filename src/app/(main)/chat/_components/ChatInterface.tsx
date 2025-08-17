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
  MoreVert as MoreVertIcon,
  DoneAll as DoneAllIcon
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
          p: 2,
          backgroundColor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(18, 18, 18, 0.8)' 
            : 'rgba(245, 245, 245, 0.8)',
          backgroundImage: (theme) => theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)'
            : 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)',
          backgroundSize: '20px 20px',
        }}
      >
        <List sx={{ p: 0 }}>
          {messages.map((msg, index) => {
            const showAvatar = !msg.isOwnMessage && (index === 0 || messages[index - 1]?.senderId !== msg.senderId);
            const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.senderId !== msg.senderId;
            
            return (
              <ListItem
                key={msg._id}
                sx={{
                  display: 'flex',
                  justifyContent: msg.isOwnMessage ? 'flex-end' : 'flex-start',
                  p: 0.5,
                  alignItems: 'flex-end'
                }}
              >
                <Box
                  sx={{
                    maxWidth: '75%',
                    display: 'flex',
                    flexDirection: msg.isOwnMessage ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 1,
                    mb: isLastInGroup ? 1 : 0
                  }}
                >
                  {/* Avatar - only show for other users and first message in group */}
                  {showAvatar ? (
                    <Avatar 
                      src={msg.senderAvatar || selectedChat.user.avatar} 
                      alt={msg.senderName}
                      sx={{ 
                        width: 32, 
                        height: 32,
                        border: (theme) => `2px solid ${theme.palette.background.paper}`,
                        boxShadow: (theme) => theme.palette.mode === 'dark'
                          ? '0 2px 4px rgba(0,0,0,0.5)'
                          : '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      {msg.senderName.charAt(0)}
                    </Avatar>
                  ) : !msg.isOwnMessage ? (
                    <Box sx={{ width: 32 }} /> // Spacer for alignment
                  ) : null}

                  <Box sx={{ position: 'relative' }}>
                    {/* Message Bubble */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        px: 2,
                        position: 'relative',
                        background: msg.isOwnMessage 
                          ? 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)'
                          : (theme) => theme.palette.mode === 'dark'
                            ? theme.palette.grey[800]
                            : theme.palette.background.paper,
                        color: msg.isOwnMessage 
                          ? 'white' 
                          : (theme) => theme.palette.text.primary,
                        borderRadius: 2.5,
                        borderTopRightRadius: msg.isOwnMessage ? 0.5 : 2.5,
                        borderTopLeftRadius: msg.isOwnMessage ? 2.5 : (showAvatar ? 0.5 : 2.5),
                        borderBottomRightRadius: msg.isOwnMessage && isLastInGroup ? 0.5 : 2.5,
                        borderBottomLeftRadius: !msg.isOwnMessage && isLastInGroup ? 0.5 : 2.5,
                        boxShadow: msg.isOwnMessage 
                          ? '0 2px 8px rgba(0, 123, 255, 0.3)'
                          : (theme) => theme.palette.mode === 'dark'
                            ? '0 2px 8px rgba(0, 0, 0, 0.6)'
                            : '0 2px 8px rgba(0, 0, 0, 0.1)',
                        border: (theme) => !msg.isOwnMessage && theme.palette.mode === 'dark' 
                          ? `1px solid ${theme.palette.grey[700]}` 
                          : 'none',
                        '&::before': msg.isOwnMessage && isLastInGroup ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          right: -8,
                          width: 0,
                          height: 0,
                          borderLeft: '8px solid #007BFF',
                          borderBottom: '8px solid transparent',
                        } : (!msg.isOwnMessage && isLastInGroup) ? {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: -8,
                          width: 0,
                          height: 0,
                          borderRight: (theme) => theme.palette.mode === 'dark'
                            ? `8px solid ${theme.palette.grey[800]}`
                            : `8px solid ${theme.palette.background.paper}`,
                          borderBottom: '8px solid transparent',
                        } : {},
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateY(-1px)',
                          boxShadow: msg.isOwnMessage 
                            ? '0 4px 12px rgba(0, 123, 255, 0.4)'
                            : (theme) => theme.palette.mode === 'dark'
                              ? '0 4px 12px rgba(0, 0, 0, 0.8)'
                              : '0 4px 12px rgba(0, 0, 0, 0.15)',
                        }
                      }}
                    >
                      {/* Sender name for group chats (if not own message and first in group) */}
                      {!msg.isOwnMessage && showAvatar && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: 'primary.main',
                            display: 'block',
                            mb: 0.5
                          }}
                        >
                          {msg.senderName}
                        </Typography>
                      )}
                      
                      {/* Message content */}
                      <Typography 
                        variant="body1" 
                        component="div"
                        sx={{
                          wordBreak: 'break-word',
                          lineHeight: 1.4,
                          fontSize: '0.95rem'
                        }}
                      >
                        {msg.content}
                      </Typography>
                      
                      {/* Timestamp and status */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'flex-end',
                          mt: 0.5,
                          gap: 0.5
                        }}
                      >
                        <Typography 
                          variant="caption" 
                          sx={{
                            color: msg.isOwnMessage ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                            fontSize: '0.75rem',
                            fontWeight: 500
                          }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </Typography>
                        
                        {/* Message status for own messages */}
                        {msg.isOwnMessage && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DoneAllIcon 
                              sx={{ 
                                fontSize: 16, 
                                color: 'rgba(255,255,255,0.8)',
                                ml: 0.25
                              }} 
                            />
                          </Box>
                        )}
                      </Box>
                    </Paper>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
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
          borderColor: 'divider',
          backgroundColor: (theme) => theme.palette.mode === 'dark' 
            ? theme.palette.grey[900] 
            : theme.palette.background.paper
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
          <IconButton 
            size="small" 
            color="primary"
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease'
            }}
          >
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
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? theme.palette.grey[800] 
                  : '#f8f9fa',
                border: '2px solid transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.mode === 'dark' 
                    ? theme.palette.grey[700] 
                    : 'white',
                  border: (theme) => theme.palette.mode === 'dark' 
                    ? '2px solid rgba(144, 202, 249, 0.5)' 
                    : '2px solid #e3f2fd',
                },
                '&.Mui-focused': {
                  backgroundColor: (theme) => theme.palette.mode === 'dark' 
                    ? theme.palette.grey[700] 
                    : 'white',
                  border: '2px solid #2196f3',
                  boxShadow: '0 0 0 3px rgba(33, 150, 243, 0.1)',
                },
                '& fieldset': {
                  border: 'none',
                }
              },
              '& .MuiInputBase-input': {
                fontSize: '0.95rem',
                lineHeight: 1.4,
                color: (theme) => theme.palette.mode === 'dark' 
                  ? theme.palette.grey[100] 
                  : theme.palette.text.primary,
                '&::placeholder': {
                  color: (theme) => theme.palette.mode === 'dark' 
                    ? theme.palette.grey[400] 
                    : theme.palette.grey[600],
                  opacity: 1,
                }
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    size="small"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'warning.main',
                        color: 'white',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
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
              backgroundColor: 'primary.main',
              color: 'white',
              width: 48,
              height: 48,
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'scale(1.05)',
              },
              '&:disabled': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? theme.palette.grey[700] 
                  : 'grey.300',
                color: (theme) => theme.palette.mode === 'dark' 
                  ? theme.palette.grey[500] 
                  : 'grey.500',
              },
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
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
            onClick={() => setMessage("Schedule a session with me! 📅")}
            sx={{ 
              fontSize: '0.75rem',
              borderColor: (theme) => theme.palette.mode === 'dark' 
                ? theme.palette.grey[600] 
                : theme.palette.grey[300],
              color: (theme) => theme.palette.mode === 'dark' 
                ? theme.palette.grey[100] 
                : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(144, 202, 249, 0.1)' 
                  : 'rgba(33, 150, 243, 0.1)',
                borderColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(144, 202, 249, 0.5)' 
                  : 'rgba(33, 150, 243, 0.5)',
              }
            }}
          />
          <Chip
            label="Share Resource"
            size="small"
            variant="outlined"
            clickable
            onClick={() => setMessage("Here's a resource I found helpful! 📚")}
            sx={{ 
              fontSize: '0.75rem',
              borderColor: (theme) => theme.palette.mode === 'dark' 
                ? theme.palette.grey[600] 
                : theme.palette.grey[300],
              color: (theme) => theme.palette.mode === 'dark' 
                ? theme.palette.grey[100] 
                : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(144, 202, 249, 0.1)' 
                  : 'rgba(33, 150, 243, 0.1)',
                borderColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(144, 202, 249, 0.5)' 
                  : 'rgba(33, 150, 243, 0.5)',
              }
            }}
          />
          <Chip
            label="Quick Thanks"
            size="small"
            variant="outlined"
            clickable
            onClick={() => setMessage("Thank you for the help! 🙏")}
            sx={{ 
              fontSize: '0.75rem',
              borderColor: (theme) => theme.palette.mode === 'dark' 
                ? theme.palette.grey[600] 
                : theme.palette.grey[300],
              color: (theme) => theme.palette.mode === 'dark' 
                ? theme.palette.grey[100] 
                : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(144, 202, 249, 0.1)' 
                  : 'rgba(33, 150, 243, 0.1)',
                borderColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(144, 202, 249, 0.5)' 
                  : 'rgba(33, 150, 243, 0.5)',
              }
            }}
          />
          <Chip
            label="How do I connect with you?"
            size="small"
            variant="outlined"
            clickable
            onClick={() => setMessage("How to connect Zoom or any other platform?")}
            sx={{ 
              fontSize: '0.75rem',
              borderColor: (theme) => theme.palette.mode === 'dark' 
                ? theme.palette.grey[600] 
                : theme.palette.grey[300],
              color: (theme) => theme.palette.mode === 'dark' 
                ? theme.palette.grey[100] 
                : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(144, 202, 249, 0.1)' 
                  : 'rgba(33, 150, 243, 0.1)',
                borderColor: (theme) => theme.palette.mode === 'dark' 
                  ? 'rgba(144, 202, 249, 0.5)' 
                  : 'rgba(33, 150, 243, 0.5)',
              }
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
