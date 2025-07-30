"use client";

import React, { useState } from 'react';
import ThreadDetail from './_components/ThreadDetail';
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
  MenuItem
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

interface Thread {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    badge?: string;
  };
  category: string;
  tags: string[];
  replies: number;
  likes: number;
  createdAt: string;
  lastReply?: string;
  isPinned?: boolean;
  isAnswered?: boolean;
}

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

const mockThreads: Thread[] = [
  {
    id: '1',
    title: 'How do I get started with JavaScript?',
    content: 'I\'m completely new to programming and want to learn JavaScript. What\'s the best roadmap to follow?',
    author: { name: 'Alex Chen', avatar: '/alex.png' },
    category: 'skill-help',
    tags: ['JavaScript', 'Beginner', 'Roadmap'],
    replies: 12,
    likes: 8,
    createdAt: '2 hours ago',
    lastReply: '30 min ago',
    isAnswered: true
  },
  {
    id: '2',
    title: 'Looking for a React mentor who\'s beginner-friendly',
    content: 'I\'ve been learning React for a month and need guidance on best practices and project structure.',
    author: { name: 'Sarah Johnson', avatar: '/sarah.png', badge: 'Student' },
    category: 'mentor-recommendations',
    tags: ['React', 'Mentorship', 'Beginner'],
    replies: 6,
    likes: 15,
    createdAt: '4 hours ago',
    lastReply: '1 hour ago'
  },
  {
    id: '3',
    title: 'Frontend dev here! Looking for someone to help with backend',
    content: 'Working on a productivity app. Need help with Node.js and database design. Anyone interested?',
    author: { name: 'Mike Rodriguez', avatar: '/mike.png', badge: 'Developer' },
    category: 'project-collaboration',
    tags: ['Frontend', 'Backend', 'Node.js', 'Collaboration'],
    replies: 9,
    likes: 22,
    createdAt: '6 hours ago',
    lastReply: '2 hours ago',
    isPinned: true
  },
  {
    id: '4',
    title: 'Notion vs Trello – which do you prefer for project management?',
    content: 'I\'m trying to decide between Notion and Trello for managing my learning projects. What are your experiences?',
    author: { name: 'Emily Davis', avatar: '/emily.png' },
    category: 'general-skill-talk',
    tags: ['Productivity', 'Tools', 'Project Management'],
    replies: 18,
    likes: 31,
    createdAt: '8 hours ago',
    lastReply: '45 min ago'
  },
  {
    id: '5',
    title: 'Redesigned my portfolio site – feedback appreciated!',
    content: 'Just finished redesigning my portfolio. Looking for honest feedback on design and UX.',
    author: { name: 'David Kim', avatar: '/david.png', badge: 'Designer' },
    category: 'feedback-zone',
    tags: ['Portfolio', 'Design', 'Feedback', 'UX'],
    replies: 14,
    likes: 27,
    createdAt: '12 hours ago',
    lastReply: '3 hours ago'
  },
  {
    id: '6',
    title: 'Let\'s start a weekend study group for Python!',
    content: 'Looking to organize a virtual study group every Saturday. Who\'s interested in joining?',
    author: { name: 'Lisa Wang', avatar: '/lisa.png' },
    category: 'events-meetups',
    tags: ['Python', 'Study Group', 'Weekend', 'Virtual'],
    replies: 8,
    likes: 19,
    createdAt: '1 day ago',
    lastReply: '4 hours ago'
  },
  {
    id: '7',
    title: 'Just landed my first freelance gig – thanks SkillForge!',
    content: 'After 3 months of learning and mentorship, I got my first paid project! Grateful for this community.',
    author: { name: 'Carlos Martinez', avatar: '/carlos.png', badge: 'Graduate' },
    category: 'success-stories',
    tags: ['Freelance', 'Success', 'Milestone', 'Gratitude'],
    replies: 25,
    likes: 89,
    createdAt: '1 day ago',
    lastReply: '1 hour ago'
  },
  {
    id: '8',
    title: 'I\'m a Frontend Dev with 4 years experience – AMA!',
    content: 'Happy to answer questions about React, career growth, interviews, or anything frontend related.',
    author: { name: 'Jessica Brown', avatar: '/jessica.png', badge: 'Expert' },
    category: 'ama-threads',
    tags: ['AMA', 'Frontend', 'React', 'Career'],
    replies: 42,
    likes: 156,
    createdAt: '2 days ago',
    lastReply: '20 min ago',
    isPinned: true
  }
];

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

  const filteredThreads = mockThreads.filter(thread => {
    const matchesCategory = selectedCategory === 'all' || thread.category === selectedCategory;
    const matchesSearch = thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         thread.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes;
      case 'replies':
        return b.replies - a.replies;
      default:
        return 0; // Keep original order for 'recent'
    }
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = forumCategories.find(cat => cat.id === categoryId);
    return category?.icon || <HelpIcon />;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = forumCategories.find(cat => cat.id === categoryId);
    return category?.color || '#007BFF';
  };

  const handleCreateThread = () => {
    // Here you would typically send the data to your backend
    console.log('Creating thread:', newThread);
    setOpenNewThread(false);
    setNewThread({ title: '', content: '', category: '', tags: '' });
  };

  const handleThreadClick = (threadId: string) => {
    setSelectedThread(threadId);
  };

  const handleBackToForum = () => {
    setSelectedThread(null);
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
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            💬 Community Forum
          </Typography>
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
                    {mockThreads.filter(t => t.category === category.id).length} threads
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
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
          {sortedThreads.map((thread, index) => (
            <motion.div
              key={thread.id}
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
                          onClick={() => handleThreadClick(thread.id)}
                        >
                          {thread.title}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small">
                          <BookmarkIcon />
                        </IconButton>
                        <Button
                          size="small"
                          startIcon={<ThumbUpIcon />}
                          sx={{ minWidth: 'auto' }}
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
                          {thread.author.badge && (
                            <Chip label={thread.author.badge} size="small" variant="outlined" />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {thread.createdAt}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                          size="small"
                          startIcon={<ReplyIcon />}
                          variant="outlined"
                        >
                          {thread.replies} Replies
                        </Button>
                        {thread.lastReply && (
                          <Typography variant="caption" color="text.secondary">
                            Last reply {thread.lastReply}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Box>

        {/* No Results */}
        {filteredThreads.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <SearchIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No discussions found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search terms or browse different categories
            </Typography>
          </Paper>
        )}

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
      </motion.div>
    </Container>
  );
}
