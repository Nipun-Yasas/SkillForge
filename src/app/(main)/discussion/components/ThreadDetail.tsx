"use client";

import React, { useState, useEffect } from 'react';
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
  CardContent,
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Reply as ReplyIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { 
  getThread, 
  createReply, 
  likeThread, 
  likeReply,
  bookmarkThread,
  Thread,
  Reply 
} from '@/lib/forumService';
import ThreadDetailSkeleton from "./ThreadDetailSkeleton";
import { toast } from 'react-hot-toast';

interface ThreadDetailProps {
  threadId: string;
  onBack: () => void;
}

export default function ThreadDetail({ threadId, onBack }: ThreadDetailProps) {
  const [newReply, setNewReply] = useState('');
  const [thread, setThread] = useState<Thread | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadThread();
  }, [threadId]);

  const loadThread = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getThread(threadId);
      setThread(response.thread);
      setReplies(response.replies);
    } catch (err) {
      console.error('Error loading thread:', err);
      const message = err instanceof Error ? err.message : 'Failed to load thread';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async () => {
    if (!newReply.trim()) return;
    
    try {
      setSubmitting(true);
      const reply = await createReply(threadId, newReply);
      setReplies(prev => [...prev, reply]);
      setNewReply('');
      toast.success('Reply posted successfully!');
      
      // Update thread reply count
      if (thread) {
        setThread({ ...thread, replies: thread.replies + 1 });
      }
    } catch (err) {
      console.error('Error creating reply:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeThread = async () => {
    if (!thread) return;
    
    try {
      const response = await likeThread(threadId);
      setThread({ ...thread, likes: response.likesCount });
    } catch (err) {
      console.error('Error liking thread:', err);
      toast.error('Failed to like thread');
    }
  };

  const handleLikeReply = async (replyId: string) => {
    try {
      const response = await likeReply(replyId);
      setReplies(prev => 
        prev.map(reply => 
          reply._id === replyId 
            ? { ...reply, likes: response.likesCount }
            : reply
        )
      );
    } catch (err) {
      console.error('Error liking reply:', err);
      toast.error('Failed to like reply');
    }
  };

  const handleBookmarkThread = async () => {
    if (!thread) return;
    
    try {
      await bookmarkThread(threadId);
      toast.success('Thread bookmark updated!');
    } catch (err) {
      console.error('Error bookmarking thread:', err);
      toast.error('Failed to bookmark thread');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return <ThreadDetailSkeleton />;
  }

  if (error || !thread) {
    return (
      <Box sx={{ width: '100%', p: 0 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {error || 'Thread not found'}
        </Typography>
        <Button onClick={onBack} startIcon={<ArrowBackIcon />}>
          Back to Forum
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 0 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header with back button */}
        <Box sx={{ mb: 3 }}>
          <Button 
            onClick={onBack} 
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Back to Forum
          </Button>
        </Box>

        {/* Main Thread */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            <Avatar 
              sx={{ width: 64, height: 64 }} 
              src={thread.author.avatar}
            >
              {!thread.author.avatar && thread.author.name.charAt(0)}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              {/* Thread Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                    {thread.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {thread.author.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatTimeAgo(thread.createdAt)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton onClick={handleBookmarkThread}>
                    <BookmarkIcon />
                  </IconButton>
                  <IconButton>
                    <ShareIcon />
                  </IconButton>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
              
              {/* Thread Content */}
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                {thread.content}
              </Typography>
              
              {/* Tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {thread.tags.map((tag) => (
                  <Chip key={tag} label={tag} variant="outlined" />
                ))}
              </Box>
              
              {/* Thread Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  startIcon={<ThumbUpIcon />}
                  onClick={handleLikeThread}
                  variant="outlined"
                >
                  {thread.likes} Likes
                </Button>
                <Button
                  startIcon={<ReplyIcon />}
                  variant="outlined"
                >
                  {thread.replies} Replies
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Replies Section */}
        <Paper sx={{ p: 4, borderRadius: 3, width: '100%' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Replies ({replies.length})
          </Typography>
          
          {/* Reply Input */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Add your reply
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder="Share your thoughts or answer..."
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleReplySubmit}
                  disabled={!newReply.trim() || submitting}
                >
                  {submitting ? 'Posting...' : 'Post Reply'}
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          {/* Replies List */}
          {replies.map((reply, index) => (
            <motion.div
              key={reply._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Box sx={{ mb: 3, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar src={reply.author.avatar}>
                    {reply.author.name.charAt(0)}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {reply.author.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimeAgo(reply.createdAt)}
                      </Typography>
                      {reply.isAcceptedAnswer && (
                        <Chip label="✓ Accepted Answer" size="small" color="success" />
                      )}
                    </Box>
                    
                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
                      {reply.content}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<ThumbUpIcon />}
                        onClick={() => handleLikeReply(reply._id)}
                      >
                        {reply.likes}
                      </Button>
                      <Button size="small" startIcon={<ReplyIcon />}>
                        Reply
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          ))}

          {replies.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No replies yet. Be the first to respond!
            </Typography>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
}
