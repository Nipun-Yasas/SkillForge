"use client";

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  TextField,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Reply as ReplyIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Reply {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    badge?: string;
  };
  likes: number;
  createdAt: string;
  isLiked?: boolean;
}

interface ThreadDetailProps {
  threadId: string;
  onBack: () => void;
}

export default function ThreadDetail({ threadId, onBack }: ThreadDetailProps) {
  const [newReply, setNewReply] = useState('');
  const [replies] = useState<Reply[]>([
    {
      id: '1',
      content: 'Start with FreeCodeCamp\'s JavaScript course. It\'s comprehensive and completely free. Then move to practical projects to solidify your understanding.',
      author: { name: 'Sarah Chen', avatar: '/sarah.png', badge: 'Mentor' },
      likes: 12,
      createdAt: '2 hours ago',
      isLiked: false
    },
    {
      id: '2',
      content: 'I\'d recommend starting with JavaScript30 by Wes Bos after you understand the basics. Building real projects helps a lot!',
      author: { name: 'Mike Rodriguez', avatar: '/mike.png', badge: 'Developer' },
      likes: 8,
      createdAt: '1 hour ago',
      isLiked: true
    },
    {
      id: '3',
      content: 'Don\'t forget to practice algorithms on platforms like LeetCode or Codewars. It helps with problem-solving skills.',
      author: { name: 'Emily Davis', avatar: '/emily.png' },
      likes: 5,
      createdAt: '45 minutes ago',
      isLiked: false
    }
  ]);

  const thread = {
    id: threadId,
    title: 'How do I get started with JavaScript?',
    content: 'I\'m completely new to programming and want to learn JavaScript. What\'s the best roadmap to follow? I\'ve heard about different resources but don\'t know where to start. Should I focus on theory first or jump into practical projects?',
    author: { name: 'Alex Chen', avatar: '/alex.png' },
    category: 'skill-help',
    tags: ['JavaScript', 'Beginner', 'Roadmap'],
    likes: 24,
    createdAt: '3 hours ago',
    isLiked: false,
    isBookmarked: false
  };

  const handleReplySubmit = () => {
    if (!newReply.trim()) return;
    
    // Here you would typically send the reply to your backend
    console.log('Submitting reply:', newReply);
    setNewReply('');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back Button */}
        <Button 
          onClick={onBack}
          sx={{ mb: 3 }}
          variant="outlined"
        >
          ← Back to Forum
        </Button>

        {/* Main Thread */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {thread.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                {thread.title}
              </Typography>
            </Box>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
            {thread.content}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar src={thread.author.avatar} sx={{ width: 40, height: 40 }}>
                {thread.author.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {thread.author.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Posted {thread.createdAt}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<ThumbUpIcon />}
                variant={thread.isLiked ? "contained" : "outlined"}
                size="small"
              >
                {thread.likes}
              </Button>
              <IconButton size="small">
                <ShareIcon />
              </IconButton>
              <IconButton size="small">
                <BookmarkIcon color={thread.isBookmarked ? "primary" : "inherit"} />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* Replies Section */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          💬 {replies.length} Replies
        </Typography>

        {replies.map((reply, index) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={reply.author.avatar} sx={{ width: 36, height: 36 }}>
                      {reply.author.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {reply.author.name}
                        </Typography>
                        {reply.author.badge && (
                          <Chip label={reply.author.badge} size="small" color="primary" variant="outlined" />
                        )}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {reply.createdAt}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size="small">
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                  {reply.content}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    startIcon={<ThumbUpIcon />}
                    variant={reply.isLiked ? "contained" : "outlined"}
                    size="small"
                  >
                    {reply.likes}
                  </Button>
                  <Button
                    startIcon={<ReplyIcon />}
                    variant="outlined"
                    size="small"
                  >
                    Reply
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Reply Input */}
        <Paper sx={{ p: 3, borderRadius: 3, mt: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            💭 Add Your Reply
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Share your thoughts, experiences, or helpful resources..."
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Be respectful and constructive in your responses
            </Typography>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={handleReplySubmit}
              disabled={!newReply.trim()}
              sx={{
                background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
              }}
            >
              Post Reply
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}
