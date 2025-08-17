"use client";

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Button
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Circle as CircleIcon,
  Message as MessageIcon
} from '@mui/icons-material';

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

interface ChatSidebarProps {
  chats: ChatUser[];
  usersForNewConversation: User[];
  selectedChat: ChatUser | null;
  onChatSelect: (chat: ChatUser) => void;
  onUserSelect: (user: User) => Promise<void>;
  isLoading: boolean;
}

export default function ChatSidebar({ 
  chats,
  usersForNewConversation, 
  selectedChat,
  onChatSelect,
  onUserSelect,
  isLoading
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'conversations' | 'users'>('conversations');

  const filteredChats = chats.filter(chat =>
    chat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = usersForNewConversation.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper
      elevation={2}
      sx={{
        width: 350,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        borderRight: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            💬 Messages
          </Typography>
          <IconButton 
            size="small" 
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            }
          }}
        />
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 2, pt: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button
            variant={activeTab === 'conversations' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setActiveTab('conversations')}
            sx={{ flex: 1, textTransform: 'none' }}
          >
            Recent Conversations
          </Button>
          <Button
            variant={activeTab === 'users' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setActiveTab('users')}
            sx={{ flex: 1, textTransform: 'none' }}
          >
            Start New Chat
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {activeTab === 'conversations' ? (
          <List sx={{ p: 0 }}>
            {isLoading ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Loading conversations...
                </Typography>
              </Box>
            ) : filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <ListItem
                  key={chat.conversationId}
                  component="div"
                  onClick={() => onChatSelect(chat)}
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: '1px solid',
                    borderColor: 'grey.100',
                    cursor: 'pointer',
                    backgroundColor: selectedChat?.conversationId === chat.conversationId ? 'primary.50' : 'transparent',
                    borderRight: selectedChat?.conversationId === chat.conversationId ? '3px solid' : 'none',
                    borderRightColor: selectedChat?.conversationId === chat.conversationId ? 'primary.main' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'primary.main',  
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <CircleIcon sx={{ fontSize: 12, color: 'success.main' }} />
                      }
                    >
                      <Avatar src={chat.user.avatar} alt={chat.user.name}>
                        {chat.user.name.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={chat.user.name}
                    secondary={chat.lastMessage || 'Start chatting...'}
                    primaryTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: 'medium'
                    }}
                    secondaryTypographyProps={{
                      variant: 'body2',
                      sx: { 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '200px'
                      }
                    }}
                  />
                  
                  {/* Timestamp and role badge */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-end',
                    gap: 0.5,
                    minWidth: 'fit-content'
                  }}>
                    <Typography variant="caption" color="text.secondary" component="span">
                      {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                    </Typography>
                    <Chip
                      label={chat.user.role}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.7rem',
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  </Box>
                </ListItem>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <MessageIcon sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  No conversations found
                </Typography>
              </Box>
            )}
          </List>
        ) : (
          <List sx={{ p: 0 }}>
            <ListItem sx={{ px: 3, py: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="medium">
                🤝 Available Mentors & Students
              </Typography>
            </ListItem>
            {isLoading ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Loading users...
                </Typography>
              </Box>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <ListItem
                  key={user._id}
                  component="div"
                  onClick={() => onUserSelect(user)}
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: '1px solid',
                    borderColor: 'grey.100',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <CircleIcon sx={{ fontSize: 12, color: 'success.main' }} />
                      }
                    >
                      <Avatar src={user.avatar} alt={user.name}>
                        {user.name.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={`${user.role} • ${user.email}`}
                    primaryTypographyProps={{
                      variant: 'subtitle2',
                      fontWeight: 'medium'
                    }}
                    secondaryTypographyProps={{
                      variant: 'body2',
                      sx: { color: 'text.secondary' }
                    }}
                  />
                </ListItem>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No users found
                </Typography>
              </Box>
            )}
          </List>
        )}
      </Box>
    </Paper>
  );
}
