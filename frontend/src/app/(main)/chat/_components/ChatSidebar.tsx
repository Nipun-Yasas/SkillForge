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

interface ChatSidebarProps {
  onConversationSelect?: (conversation: Conversation) => void;
  onUserSelect?: (user: User) => void;
  selectedConversationId?: string;
}

export default function ChatSidebar({ 
  onConversationSelect, 
  onUserSelect, 
  selectedConversationId 
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'conversations' | 'users'>('conversations');

  // Mock data - replace with real data from your backend
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      user: {
        name: 'Nipun Yasas',
        avatar: '/nipun.png',
        isOnline: true
      },
      lastMessage: 'Hey! Thanks for the React tutorial session.',
      timestamp: '2 min ago',
      unreadCount: 2
    },
    {
      id: '2',
      user: {
        name: 'Dinithi Dewmini',
        avatar: '/dinithi.png',
        isOnline: true
      },
      lastMessage: 'The Figma project looks great!',
      timestamp: '1 hour ago',
      unreadCount: 0
    },
    {
      id: '3',
      user: {
        name: 'Alex Chen',
        avatar: '/alex.png',
        isOnline: false
      },
      lastMessage: 'Can we schedule the ML session for tomorrow?',
      timestamp: '3 hours ago',
      unreadCount: 1
    }
  ]);

  const [users] = useState<User[]>([
    {
      id: '4',
      name: 'Sarah Johnson',
      avatar: '/sarah.png',
      isOnline: true
    },
    {
      id: '5',
      name: 'Mike Rodriguez',
      avatar: '/mike.png',
      isOnline: false,
      lastSeen: '5 min ago'
    },
    {
      id: '6',
      name: 'Emily Davis',
      avatar: '/emily.png',
      isOnline: true
    }
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
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
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              backgroundColor: 'grey.50'
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
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <ListItem
                  key={conversation.id}
                  component="div"
                  onClick={() => onConversationSelect?.(conversation)}
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: '1px solid',
                    borderColor: 'grey.100',
                    cursor: 'pointer',
                    backgroundColor: selectedConversationId === conversation.id ? 'primary.50' : 'transparent',
                    borderRight: selectedConversationId === conversation.id ? '3px solid' : 'none',
                    borderRightColor: selectedConversationId === conversation.id ? 'primary.main' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'grey.50'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        conversation.user.isOnline ? (
                          <CircleIcon sx={{ fontSize: 12, color: 'success.main' }} />
                        ) : null
                      }
                    >
                      <Avatar src={conversation.user.avatar} alt={conversation.user.name}>
                        {conversation.user.name.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {conversation.user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {conversation.timestamp}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '200px'
                          }}
                        >
                          {conversation.lastMessage}
                        </Typography>
                        {conversation.unreadCount > 0 && (
                          <Chip
                            label={conversation.unreadCount}
                            size="small"
                            color="primary"
                            sx={{ 
                              minWidth: 20, 
                              height: 20, 
                              fontSize: '0.75rem',
                              '& .MuiChip-label': { px: 1 }
                            }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <MessageIcon sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <ListItem
                  key={user.id}
                  component="div"
                  onClick={() => onUserSelect?.(user)}
                  sx={{
                    py: 2,
                    px: 3,
                    borderBottom: '1px solid',
                    borderColor: 'grey.100',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'grey.50'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        user.isOnline ? (
                          <CircleIcon sx={{ fontSize: 12, color: 'success.main' }} />
                        ) : null
                      }
                    >
                      <Avatar src={user.avatar} alt={user.name}>
                        {user.name.charAt(0)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" fontWeight="medium">
                        {user.name}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {user.isOnline ? (
                          <span style={{ color: '#4caf50' }}>● Online</span>
                        ) : (
                          `Last seen ${user.lastSeen || 'recently'}`
                        )}
                      </Typography>
                    }
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
