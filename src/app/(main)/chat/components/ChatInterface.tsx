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
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import MessageBubblesSkeleton from './MessageBubblesSkeleton';

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
  isLoading?: boolean;
  onBackToSidebar?: () => void;
  isMobile?: boolean;
}

export default function ChatInterface({ 
  selectedChat,
  messages: propMessages,
  onSendMessage,
  isLoading = false,
  onBackToSidebar,
  isMobile = false,
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
            {/* Back button for mobile */}
            {isMobile && onBackToSidebar && (
              <IconButton 
                onClick={onBackToSidebar}
                sx={{ 
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            
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
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
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
          backgroundSize: '20px 20px',
        }}
      >
        {isLoading && messages.length === 0 ? (
          <MessageBubblesSkeleton items={3} />
        ) : (
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
                         background: msg.isOwnMessage ? '#007BFF' : '#0056CC',
                         color: 'textblack.main',
                         borderRadius: '20px', 
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
                           right: -10,
                           width: 0,
                           height: 0,
                           borderBottom: '10px solid transparent',
                         } : (!msg.isOwnMessage && isLastInGroup) ? {
                           content: '""',
                           position: 'absolute',
                           bottom: 0,
                           left: -10,
                           width: 0,
                           height: 0,
                           
                           borderBottom: '10px solid transparent',
                         } : {},
                         transition: 'all 0.2s ease',
                         '&:hover': {
                           transform: 'translateY(-1px)',
                           boxShadow: msg.isOwnMessage
                             ? '0 4px 12px rgba(0, 123, 255, 0.4)'
                             : (theme) => theme.palette.mode === 'dark'
                               ? '0 4px 12px rgba(0, 0, 0, 0.8)'
                               : '0 4px 12px rgba(0, 0, 0, 0.15)',
                         },
                       }}
                     >
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
                             fontSize: '0.75rem',
                             fontWeight: 500
                           }}
                         >
                           {new Date(msg.createdAt).toLocaleTimeString([], { 
                             hour: '2-digit', 
                             minute: '2-digit' 
                           })}
                         </Typography>
                         
                       </Box>
                     </Paper>
                   </Box>
                 </Box>
               </ListItem>
             );
            })}
          </List>
        )}
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
                border: '2px solid transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                 border: (theme) => theme.palette.mode === 'dark' 
                    ? '2px solid rgba(144, 202, 249, 0.5)' 
                    : '2px solid #e3f2fd',
                },
                '&.Mui-focused': {
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
              '&:hover': {
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
              '&:hover': {
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
              '&:hover': {
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
              '&:hover': {
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
