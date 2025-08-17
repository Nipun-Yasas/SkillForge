'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Search,
  PlayCircle,
  Clock,
  Users,
  BookOpen,
  TrendingUp,
  Award,
} from 'lucide-react';

const courses = [
  {
    id: 1,
    title: 'Complete JavaScript Mastery',
    instructor: 'Sarah Chen',
    rating: 4.8,
    students: 12453,
    duration: '8 weeks',
    level: 'Intermediate',
    price: 'Free',
    image: '/api/placeholder/300/200',
    progress: 65,
    tags: ['JavaScript', 'Web Development', 'Frontend'],
    description: 'Master JavaScript from basics to advanced concepts with hands-on projects.',
  },
  {
    id: 2,
    title: 'React for Beginners',
    instructor: 'Mike Johnson',
    rating: 4.9,
    students: 8932,
    duration: '6 weeks',
    level: 'Beginner',
    price: 'Free',
    image: '/api/placeholder/300/200',
    progress: 30,
    tags: ['React', 'Frontend', 'Components'],
    description: 'Learn React fundamentals and build your first web applications.',
  },
  {
    id: 3,
    title: 'Python Data Science',
    instructor: 'Dr. Emily Davis',
    rating: 4.7,
    students: 15621,
    duration: '10 weeks',
    level: 'Advanced',
    price: 'Free',
    image: '/api/placeholder/300/200',
    progress: 0,
    tags: ['Python', 'Data Science', 'Machine Learning'],
    description: 'Comprehensive data science course using Python and popular libraries.',
  },
  {
    id: 4,
    title: 'UI/UX Design Fundamentals',
    instructor: 'Alex Rodriguez',
    rating: 4.6,
    students: 7234,
    duration: '5 weeks',
    level: 'Beginner',
    price: 'Free',
    image: '/api/placeholder/300/200',
    progress: 0,
    tags: ['Design', 'UI/UX', 'Figma'],
    description: 'Learn the principles of user interface and user experience design.',
  },
];

const skillCategories = [
  'All Categories',
  'Programming',
  'Design',
  'Data Science',
  'Marketing',
  'Business',
  'Languages',
];

const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All Categories' || 
                           course.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesLevel = selectedLevel === 'All Levels' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getLevelColor = (level: string): 'success' | 'warning' | 'error' | 'primary' => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'primary';
    }
  };

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
              // WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            📚 Courses
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover and learn new skills with our curated courses
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
              gap: 3,
              alignItems: 'center'
            }}
          >
            <TextField
              fullWidth
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search size={20} style={{ marginRight: '8px', color: '#666' }} />,
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {skillCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select
                value={selectedLevel}
                label="Level"
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                {levels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Stats */}
        <Box sx={{ mb: 4, display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <BookOpen size={24} color="#007BFF" />
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
              {courses.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Courses
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Users size={24} color="#6A0DAD" />
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
              45,240
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Students
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <TrendingUp size={24} color="#FF7A00" />
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
              92%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completion Rate
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Award size={24} color="#28a745" />
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
              1,245
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Certificates Earned
            </Typography>
          </Paper>
        </Box>

        {/* Course Grid */}
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3
          }}
        >
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0, 123, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 8px 30px rgba(0, 123, 255, 0.2)',
                    },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 200,
                        background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PlayCircle size={60} color="white" style={{ opacity: 0.8 }} />
                    </CardMedia>
                    <Chip
                      label={course.level}
                      color={getLevelColor(course.level)}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      {course.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {course.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                        {course.instructor.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        {course.instructor}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={course.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {course.rating} ({course.students.toLocaleString()})
                      </Typography>
                    </Box>
                    
                    {course.progress > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Progress
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {course.progress}%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={course.progress} 
                          sx={{ borderRadius: 1, height: 6 }}
                        />
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {course.tags.slice(0, 2).map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Clock size={16} color="#666" />
                        <Typography variant="body2" color="text.secondary">
                          {course.duration}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #0056CC 0%, #4A0080 100%)',
                          },
                        }}
                      >
                        {course.progress > 0 ? 'Continue' : 'Start Course'}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
          ))}
        </Box>

        {filteredCourses.length === 0 && (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <BookOpen size={60} color="#ccc" />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              No courses found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria
            </Typography>
          </Paper>
        )}
      </motion.div>
    </Container>
  );
}
