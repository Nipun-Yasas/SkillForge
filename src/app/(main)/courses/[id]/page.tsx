'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Button,
  Avatar,
  Grid,
 
  LinearProgress,
  // Grid, (remove from here)
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  PlayCircle,
  Clock,
  Users,
  Star,
  CheckCircle,
  ArrowLeft,
  BookOpen,
 
  Target,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl?: string;
  resources?: {
    title: string;
    url: string;
    type: 'video' | 'pdf' | 'link' | 'quiz';
  }[];
  isCompleted?: boolean;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  rating: number;
  totalRatings: number;
  enrolledStudents: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  isPremium: boolean;
  image: string;
  tags: string[];
  category: string;
  prerequisites?: string[];
  learningOutcomes: string[];
  modules: CourseModule[];
  totalDuration: number;
  progress?: number;
  isEnrolled?: boolean;
  enrollmentId?: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | false>(false);

  const courseId = params.id as string;

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data.course);
        } else if (response.status === 404) {
          toast.error('Course not found');
          router.push('/courses');
        } else {
          toast.error('Failed to load course');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId, router]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll in courses');
      return;
    }

    setEnrolling(true);
    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        toast.success('Successfully enrolled in course!');
        setCourse(prev => prev ? { ...prev, isEnrolled: true, progress: 0 } : null);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to enroll in course');
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  const handleModuleAccordionChange = (moduleId: string) => (
    event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedModule(isExpanded ? moduleId : false);
  };

  const getLevelColor = (level: string): 'success' | 'warning' | 'error' => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'success';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Course not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back Button */}
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => router.back()}
          sx={{ mb: 3 }}
        >
          Back to Courses
        </Button>

        <Grid container spacing={4}>
          {/* Left Column - Course Info */}
          <Grid container spacing={2}>
            {/* Course Header */}
            <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Chip
                  label={course.level}
                  color={getLevelColor(course.level)}
                  sx={{ mb: 2 }}
                />
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                  {course.description}
                </Typography>

                {course.longDescription && (
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {course.longDescription}
                  </Typography>
                )}

                {/* Course Stats */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Star size={20} color="#FFD700" />
                    <Typography variant="body2">
                      {course.rating.toFixed(1)} ({course.totalRatings} reviews)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Users size={20} color="#666" />
                    <Typography variant="body2">
                      {course.enrolledStudents.toLocaleString()} students
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Clock size={20} color="#666" />
                    <Typography variant="body2">
                      {course.duration}
                    </Typography>
                  </Box>
                </Box>

                {/* Tags */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {course.tags.map((tag) => (
                    <Chip key={tag} label={tag} variant="outlined" size="small" />
                  ))}
                </Box>
              </Box>

              {/* Instructor */}
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={course.instructor.avatar}
                  sx={{ width: 64, height: 64 }}
                >
                  {course.instructor.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {course.instructor.name}
                  </Typography>
                  {course.instructor.bio && (
                    <Typography variant="body2" color="text.secondary">
                      {course.instructor.bio}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>

            {/* Learning Outcomes */}
            <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                <Target size={24} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                What You&#39;ll Learn
              </Typography>
              <List>
                {course.learningOutcomes.map((outcome, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <CheckCircle size={20} color="#28a745" />
                    </ListItemIcon>
                    <ListItemText primary={outcome} />
                  </ListItem>
                ))}
              </List>
            </Paper>

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Prerequisites
                </Typography>
                <List>
                  {course.prerequisites.map((prerequisite, index) => (
                    <ListItem key={index} sx={{ py: 1 }}>
                      <ListItemIcon>
                        <BookOpen size={20} color="#666" />
                      </ListItemIcon>
                      <ListItemText primary={prerequisite} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}

            {/* Course Content */}
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Course Content
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {course.modules.length} modules • {Math.floor(course.totalDuration / 60)}h {course.totalDuration % 60}m total duration
              </Typography>

              {course.modules.map((module, index) => (
                <Accordion
                  key={module.id}
                  expanded={expandedModule === module.id}
                  onChange={handleModuleAccordionChange(module.id)}
                  sx={{ mb: 1 }}
                >
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                      <Typography variant="body1" fontWeight="medium">
                        {index + 1}. {module.title}
                      </Typography>
                      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Clock size={16} color="#666" />
                        <Typography variant="body2" color="text.secondary">
                          {module.duration}
                        </Typography>
                        {module.isCompleted && (
                          <CheckCircle size={16} color="#28a745" />
                        )}
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {module.description}
                    </Typography>
                    {module.resources && module.resources.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Resources:
                        </Typography>
                        {module.resources.map((resource, idx) => (
                          <Chip
                            key={idx}
                            label={`${resource.type.toUpperCase()}: ${resource.title}`}
                            variant="outlined"
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </Paper>
          </Grid>

          {/* Right Column - Enrollment */}
          <Grid container spacing={2}>
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 24 }}>
              {/* Course Image */}
              <Box
                sx={{
                  height: 200,
                  background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <PlayCircle size={60} color="white" style={{ opacity: 0.8 }} />
              </Box>

              {/* Price */}
              <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </Typography>

              {/* Progress (if enrolled) */}
              {course.isEnrolled && course.progress !== undefined && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{course.progress}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={course.progress}
                    sx={{ borderRadius: 1, height: 8 }}
                  />
                </Box>
              )}

              {/* Enrollment Button */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={enrolling}
                onClick={course.isEnrolled ? undefined : handleEnroll}
                sx={{
                  py: 2,
                  mb: 3,
                  background: course.isEnrolled
                    ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                    : 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
                  '&:hover': {
                    background: course.isEnrolled
                      ? 'linear-gradient(135deg, #218838 0%, #1ea085 100%)'
                      : 'linear-gradient(135deg, #0056CC 0%, #4A0080 100%)',
                  },
                }}
              >
                {enrolling ? (
                  <CircularProgress size={24} color="inherit" />
                ) : course.isEnrolled ? (
                  <>
                    <CheckCircle size={20} style={{ marginRight: 8 }} />
                    Enrolled
                  </>
                ) : (
                  'Enroll Now'
                )}
              </Button>

              {/* Course Info */}
              <Box sx={{ space: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Level
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {course.level}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {course.duration}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Students
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {course.enrolledStudents.toLocaleString()}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Category
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {course.category}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
}
