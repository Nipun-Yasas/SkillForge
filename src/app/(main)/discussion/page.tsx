"use client";

import React, { useState, useEffect } from 'react';
import ThreadDetail from './components/ThreadDetail';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  ThumbUp as ThumbUpIcon,
  Reply as ReplyIcon,
  Bookmark as BookmarkIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Help as HelpIcon,
  Code as CodeIcon,
  Brush as BrushIcon,
  EmojiEvents as EmojiEventsIcon,
  QuestionAnswer as QuestionAnswerIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { 
  getThreads, 
  createThread, 
  likeThread, 
  bookmarkThread,
  Thread as ThreadType,
  CreateThreadData 
} from '@/lib/forumService';
import DiscussionSkeleton from "./components/DiscussionSkeleton";

const forumCategories = [
  {
    id: 'skill-help',
    name: 'Skill Learning Help',
    icon: <HelpIcon />,
    color: '#007BFF',
    description: 'Get help learning new skills and overcome learning challenges'
  },
  {
    id: 'mentor-recommendations',
    name: 'Mentor Recommendations',
    icon: <PeopleIcon />,
    color: '#6A0DAD',
    description: 'Find and recommend the best mentors in the community'
  },
  {
    id: 'project-collaboration',
    name: 'Project Collaboration',
    icon: <CodeIcon />,
    color: '#FF7A00',
    description: 'Team up with others on exciting projects and builds'
  },
  {
    id: 'general-skill-talk',
    name: 'General Skill Talk',
    icon: <BrushIcon />,
    color: '#28a745',
    description: 'Discuss tools, methods, and skill development strategies'
  },
  {
    id: 'feedback-zone',
    name: 'Feedback Zone',
    icon: <ThumbUpIcon />,
    color: '#FFC107',
    description: 'Share your work and get constructive feedback'
  },
  {
    id: 'events-meetups',
    name: 'Events & Meetups',
    icon: <ScheduleIcon />,
    color: '#E91E63',
    description: 'Organize and join study groups and local meetups'
  },
  {
    id: 'success-stories',
    name: 'Success Stories',
    icon: <EmojiEventsIcon />,
    color: '#FF5722',
    description: 'Celebrate achievements and inspire others'
  },
  {
    id: 'ama-threads',
    name: 'Ask Me Anything',
    icon: <QuestionAnswerIcon />,
    color: '#9C27B0',
    description: 'Expert Q&A sessions with experienced professionals'
  }
];

// const mockThreads: ThreadType[] = [];

export default function DiscussionPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [openNewThread, setOpenNewThread] = useState(false);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });
  
  // API state
  const [threads, setThreads] = useState<ThreadType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Load threads
  useEffect(() => {
    loadThreads();
  }, [selectedCategory, searchTerm, sortBy, pagination.page]);

  const loadThreads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getThreads(
        selectedCategory,
        searchTerm,
        sortBy,
        pagination.page,
        pagination.limit
      );
      
      setThreads(response.threads);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Error loading threads:', err);
      setError(err instanceof Error ? err.message : 'Failed to load threads');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async () => {
    try {
      if (!newThread.title || !newThread.content || !newThread.category) {
        setSnackbar({
          open: true,
          message: 'Please fill in all required fields',
          severity: 'error'
        });
        return;
      }

      const threadData: CreateThreadData = {
        title: newThread.title,
        content: newThread.content,
        category: newThread.category,
        tags: newThread.tags
      };

      await createThread(threadData);
      
      setOpenNewThread(false);
      setNewThread({ title: '', content: '', category: '', tags: '' });
      setSnackbar({
        open: true,
        message: 'Thread created successfully!',
        severity: 'success'
      });
      
      // Reload threads
      loadThreads();
    } catch (err) {
      console.error('Error creating thread:', err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to create thread',
        severity: 'error'
      });
    }
  };

  const handleLikeThread = async (threadId: string) => {
    try {
      const response = await likeThread(threadId);
      
      // Update thread in state
      setThreads(prevThreads => 
        prevThreads.map(thread => 
          thread._id === threadId 
            ? { ...thread, likes: response.likesCount }
            : thread
        )
      );
    } catch (err) {
      console.error('Error liking thread:', err);
      setSnackbar({
        open: true,
        message: 'Failed to like thread',
        severity: 'error'
      });
    }
  };

  const handleBookmarkThread = async (threadId: string) => {
    try {
      await bookmarkThread(threadId);
      setSnackbar({
        open: true,
        message: 'Thread bookmark updated!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error bookmarking thread:', err);
      setSnackbar({
        open: true,
        message: 'Failed to bookmark thread',
        severity: 'error'
      });
    }
  };

  const handleThreadClick = (threadId: string) => {
    setSelectedThread(threadId);
  };

  const handleBackToForum = () => {
    setSelectedThread(null);
    // Reload threads in case there were changes
    loadThreads();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        loadThreads();
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Reset page when category or sort changes
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [selectedCategory, sortBy]);

  const getCategoryIcon = (categoryId: string) => {
    const category = forumCategories.find(cat => cat.id === categoryId);
    return category?.icon || <HelpIcon />;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = forumCategories.find(cat => cat.id === categoryId);
    return category?.color || '#007BFF';
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

  // If a thread is selected, show the thread detail view
  if (selectedThread) {
    return <ThreadDetail threadId={selectedThread} onBack={handleBackToForum} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          
          <Typography variant="h6" color="text.secondary">
            Connect, learn, and grow together with the SkillForge community
          </Typography>
        </Box>

        {/* Categories Overview */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Discussion Categories
          </Typography>
          <Box 
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 2
            }}
          >
            {forumCategories.map((category) => (
              <Card
                key={category.id}
                sx={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: selectedCategory === category.id ? 2 : 1,
                  borderColor: selectedCategory === category.id ? category.color : 'divider',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 20px ${category.color}20`
                  }
                }}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Box sx={{ color: category.color, mb: 1 }}>
                    {category.icon}
                  </Box>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
                    {category.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {threads.filter(t => t.category === category.id).length} threads
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          
          <Button
            variant="outlined"
            startIcon={<TrendingUpIcon />}
            onClick={() => setSelectedCategory('all')}
            sx={{ 
              mt: 2,
              borderColor: selectedCategory === 'all' ? 'primary.main' : 'divider',
              color: selectedCategory === 'all' ? 'primary.main' : 'text.secondary'
            }}
          >
            View All Categories
          </Button>
        </Paper>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flex: 1, minWidth: 250 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }
              }}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="recent">Recent</MenuItem>
                <MenuItem value="popular">Most Liked</MenuItem>
                <MenuItem value="replies">Most Replies</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Threads List */}
        <Box sx={{ mb: 4 }}>
          {loading ? (
            <DiscussionSkeleton items={6} />
          ) : error ? (
             <Alert severity="error" sx={{ mb: 2 }}>
               {error}
               <Button onClick={loadThreads} sx={{ ml: 2 }}>
                 Retry
               </Button>
             </Alert>
           ) : threads.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <SearchIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                No discussions found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search terms or browse different categories
              </Typography>
            </Paper>
          ) : (
            threads.map((thread, index) => (
              <motion.div
                key={thread._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Paper
                  sx={{
                    p: 3,
                    mb: 2,
                    borderRadius: 3,
                    border: thread.isPinned ? 2 : 1,
                    borderColor: thread.isPinned ? 'primary.main' : 'divider',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(0, 123, 255, 0.1)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: getCategoryColor(thread.category), width: 48, height: 48 }}>
                      {getCategoryIcon(thread.category)}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            {thread.isPinned && (
                              <Chip label="Pinned" size="small" color="primary" />
                            )}
                            {thread.isAnswered && (
                              <Chip label="Answered" size="small" color="success" />
                            )}
                          </Box>
                          <Typography 
                            variant="h6" 
                            fontWeight="bold" 
                            sx={{ 
                              cursor: 'pointer', 
                              '&:hover': { color: 'primary.main' } 
                            }}
                            onClick={() => handleThreadClick(thread._id)}
                          >
                            {thread.title}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton size="small" onClick={() => handleBookmarkThread(thread._id)}>
                            <BookmarkIcon />
                          </IconButton>
                          <Button
                            size="small"
                            startIcon={<ThumbUpIcon />}
                            sx={{ minWidth: 'auto' }}
                            onClick={() => handleLikeThread(thread._id)}
                          >
                            {thread.likes}
                          </Button>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {thread.content}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {thread.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined" />
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24 }} src={thread.author.avatar}>
                              {thread.author.name.charAt(0)}
                            </Avatar>
                            <Typography variant="body2" color="text.secondary">
                              {thread.author.name}
                            </Typography>
                            {/* badge property removed as it does not exist on author */}
                            {/* <Chip label={thread.author.badge} size="small" variant="outlined" /> */}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimeAgo(thread.createdAt)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Button
                            size="small"
                            startIcon={<ReplyIcon />}
                            variant="outlined"
                            onClick={() => handleThreadClick(thread._id)}
                          >
                            {thread.replies} Replies
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            ))
          )}
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
          }}
          onClick={() => setOpenNewThread(true)}
        >
          <AddIcon />
        </Fab>

        {/* New Thread Dialog */}
        <Dialog open={openNewThread} onClose={() => setOpenNewThread(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Start a New Discussion
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <TextField
                fullWidth
                label="Discussion Title"
                value={newThread.title}
                onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                placeholder="What would you like to discuss?"
              />
              
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={newThread.category}
                  label="Category"
                  onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                >
                  {forumCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.icon}
                        {category.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Content"
                value={newThread.content}
                onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                placeholder="Share your thoughts, questions, or ideas with the community..."
              />
              
              <TextField
                fullWidth
                label="Tags"
                value={newThread.tags}
                onChange={(e) => setNewThread({ ...newThread, tags: e.target.value })}
                placeholder="e.g., React, Beginner, JavaScript (comma-separated)"
                helperText="Add relevant tags to help others find your discussion"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenNewThread(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateThread}
              disabled={!newThread.title || !newThread.content || !newThread.category}
              sx={{
                background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
              }}
            >
              Create Discussion
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Container>
  );
}

