'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { useParams, useRouter, useSearchParams } from "next/navigation";

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';

import {
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
import CourseDetailSkeleton from "@/app/(main)/courses/components/CourseDetailSkeleton";

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
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  credit: number;
  isPremium: boolean;
  image: string;
  tags: string[];
  category: string;
  prerequisites?: string[];
  learningOutcomes: string[];
  totalDuration: number;
  progress?: number;
  isEnrolled?: boolean;
  enrollmentId?: string;
  youtubeLinks?: string[];
}

const formatMinutes = (mins: number) => {
  const m = Number(mins) || 0;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? `${h}h ${r}m` : `${r}m`;
};

const getLevelColor = (level: string): 'success' | 'warning' | 'error' => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'success';
    }
  };

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  // Extract the dynamic route param `[id]`
  const courseId = (Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined));

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [savingRating, setSavingRating] = useState(false);
  const searchParams = useSearchParams();

  const links = course?.youtubeLinks || [];

  useEffect(() => {
    if (!courseId) return;
    let ignore = false;
    setLoading(true);
    (async () => {
      try {
        // Load course and enrollment in parallel
        const courseReq = fetch(`/api/courses/${courseId}`, { cache: "no-store" });
        const progressReq = user
          ? fetch(`/api/courses/${courseId}/progress`, { cache: "no-store" })
          : Promise.resolve(null as any);

        const [courseRes, progressRes] = await Promise.all([courseReq, progressReq]);

        if (!courseRes.ok) {
          if (courseRes.status === 404) {
            if (!ignore) router.push("/courses");
            return;
          }
          throw new Error("Failed to load course");
        }
        const { course: courseData } = await courseRes.json();
        if (!ignore) setCourse(courseData);

        if (progressRes && progressRes.ok) {
          const progressData = await progressRes.json();
          if (!ignore) {
            setIsEnrolled(true);
            setCourse((prev) =>
              prev
                ? { ...prev, isEnrolled: true, progress: progressData.progress ?? prev.progress }
                : prev
            );
            if (typeof progressData.rating === 'number') {
              setUserRating(progressData.rating);
            }
          }
        } else if (!ignore) {
          setIsEnrolled(false);
        }
      } catch (e) {
        console.error(e);
        if (!ignore) toast.error("Failed to load course");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [courseId, user?.id]);
  
  // Block render until both course and enrollment state are resolved
  if (loading || !course) {
    return <CourseDetailSkeleton />;
  }

  const enrolled = (isEnrolled ?? course.isEnrolled) || false;

  const handleStartLearning = () => {
    if (!links.length || !courseId) return;
    if (!enrolled) {
      handleEnroll();
      return;
    }
    router.push(`/courses/${courseId}/learn/0`);
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll in courses');
      return;
    }
    setEnrolling(true);
    try {
      const response = await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });
      if (response.ok) {
        toast.success('Successfully enrolled in course!');
        setIsEnrolled(true);
        setCourse(prev => (prev ? { ...prev, isEnrolled: true, progress: 0 } : prev));
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

  const handleSubmitRating = async () => {
    if (!courseId || !userRating) return;
    setSavingRating(true);
    try {
      const res = await fetch(`/api/courses/${courseId}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: userRating }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to save rating');
      toast.success('Rating saved');
      if (typeof data.courseRating === 'number') {
        setCourse(prev => prev ? { ...prev, rating: data.courseRating, totalRatings: data.totalRatings ?? prev.totalRatings } : prev);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message || 'Failed to save rating');
      } else {
        toast.error('Failed to save rating');
      }
    } finally {
      setSavingRating(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => router.push("/courses")}
          sx={{ mb: 3 }}
        >
          Back to Courses
        </Button>

        <Stack spacing={3}>
          {/* Course Header + Instructor, Prerequisites, What You'll Learn */}
          <Grid container spacing={3}>
            {/* Header + Instructor */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                <Box sx={{ mb: 3 }}>
                  <Chip label={course.level} color={getLevelColor(course.level)} sx={{ mb: 2 }} />
                  <Typography variant="h3" fontWeight="bold" gutterBottom>{course.title}</Typography>
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>{course.description}</Typography>
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
                        Duration: {formatMinutes(course.totalDuration)}
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
                  <Avatar src={course.instructor.avatar} sx={{ width: 64, height: 64 }}>
                    {course.instructor.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">{course.instructor.name}</Typography>
                    {course.instructor.bio && (
                      <Typography variant="body2" color="text.secondary">{course.instructor.bio}</Typography>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>

            {/* Prerequisites (only if available) */}
            {Array.isArray(course.prerequisites) && course.prerequisites.length > 0 && (
              <Grid size={{ xs: 12, lg: 3 }}>
                <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>Prerequisites</Typography>
                  <List>
                    {course.prerequisites.map((prerequisite, index) => (
                      <ListItem key={index} sx={{ py: 1 }}>
                        <ListItemIcon><BookOpen size={20} color="#666" /></ListItemIcon>
                        <ListItemText primary={prerequisite} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}

            {/* What You'll Learn (only if available) */}
            {Array.isArray(course.learningOutcomes) && course.learningOutcomes.length > 0 && (
              <Grid size={{ xs: 12, lg: 3 }}>
                <Paper sx={{ p: 4, borderRadius: 3, height: '100%' }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    <Target size={24} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                    What You&#39;ll Learn
                  </Typography>
                  <List>
                    {course.learningOutcomes.map((outcome, index) => (
                      <ListItem key={index} sx={{ py: 1 }}>
                        <ListItemIcon><CheckCircle size={20} color="#28a745" /></ListItemIcon>
                        <ListItemText primary={outcome} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}
          </Grid>

          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
              {course.credit === 0 ? 'Free' : `$${course.credit}`}
            </Typography>

            {course.isEnrolled && course.progress !== undefined && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Progress</Typography>
                  <Typography variant="body2">{course.progress}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={course.progress} sx={{ borderRadius: 1, height: 8 }} />
              </Box>
            )}

            {/* Enroll/Start button */}
            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={enrolling}
              onClick={enrolled ? handleStartLearning : handleEnroll}
              sx={{
                py: 2,
                mb: 3,
                background: enrolled
                  ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
                  : "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                "&:hover": {
                  background: enrolled
                    ? "linear-gradient(135deg, #218838 0%, #1ea085 100%)"
                    : "linear-gradient(135deg, #0056CC 0%, #4A0080 100%)",
                },
              }}
            >
              {enrolling ? <CircularProgress size={24} color="inherit" /> : enrolled ? "Start Learning" : "Enroll Now"}
            </Button>

            {/* Rating: only when course completed */}
            {enrolled && (course.progress ?? 0) >= 100 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Rate this course</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Rating
                    name="course-rating"
                    value={userRating ?? 0}
                    onChange={(_, v) => setUserRating(v)}
                    precision={1}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleSubmitRating}
                    disabled={!userRating || savingRating}
                  >
                    {savingRating ? <CircularProgress size={20} color="inherit" /> : 'Submit rating'}
                  </Button>
                </Stack>
              </Box>
            )}

            <Box sx={{ space: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Level</Typography>
                <Typography variant="body2" fontWeight="medium">{course.level}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Duration</Typography>
                <Typography variant="body2" fontWeight="medium"> Duration: {formatMinutes(course.totalDuration)}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Students</Typography>
                <Typography variant="body2" fontWeight="medium">{course.enrolledStudents.toLocaleString()}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="body2" color="text.secondary">Category</Typography>
                <Typography variant="body2" fontWeight="medium">{course.category}</Typography>
              </Box>
            </Box>
          </Paper>

          
        </Stack>
      </motion.div>
    </Container>
  );
}
