'use client';

import { useState, useEffect, useRef } from 'react';
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
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

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
import CourseDetailSkeleton from '../components/CourseDetailSkeleton';

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

type Quiz = {
  _id: string;
  videoUrl: string;
  question: string;
  answers: { text: string; correct?: boolean }[];
};
function toYouTubeEmbedUrl(url?: string) {
  if (!url) return null;
  const videoId = url.split('v=')[1]?.split('&')[0];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  // Extract the dynamic route param `[id]`
  const courseId = (Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined));

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [answers, setAnswers] = useState<Record<string, number[]>>({}); // quizId -> selected index(es)
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<{ score: number; passed: boolean } | null>(null);
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLDivElement | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const links = course?.youtubeLinks || [];
  const activeUrl = links[activeIndex];
  const activeEmbed = toYouTubeEmbedUrl(activeUrl);

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

  useEffect(() => {
    if (searchParams?.get("start") === "1" && links.length) {
      handleStartLearning();
    }
  }, [searchParams, links.length]);

  const handleStartLearning = () => {
    if (!links.length || !courseId) return;
    router.push(`/courses/${courseId}/learn/0`);
  };

  const getLevelColor = (level: string): 'success' | 'warning' | 'error' => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'success';
    }
  };

  // Load quizzes for current video
  useEffect(() => {
    if (!course?._id || !activeUrl) return;
    (async () => {
      setLastResult(null);
      setAnswers({});
      const res = await fetch(`/api/courses/${course._id}/quizzes`);
      if (res.ok) {
        const data = await res.json();
        const list: Quiz[] = (data.quizzes || []).filter((q: Quiz) => q.videoUrl === activeUrl);
        setQuizzes(list);
      } else {
        setQuizzes([]);
      }
    })();
  }, [course?._id, activeUrl]);

  const handleSelect = (quizId: string, idx: number) => {
    setAnswers(prev => ({ ...prev, [quizId]: [idx] })); // single-choice
  };

  const handleSubmitQuiz = async () => {
    if (!course?._id || !activeUrl || quizzes.length === 0) return;
    setSubmitting(true);
    try {
      const responses = quizzes.map(q => ({
        quizId: q._id,
        selected: answers[q._id] || [],
      }));
      const res = await fetch(`/api/courses/${course._id}/quizzes/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl: activeUrl, responses }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submit failed');
      setLastResult({ score: data.score, passed: data.passed });
      if (data.passed) {
        // Optionally advance automatically or show Next button
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast.error(e.message || 'Failed to submit');
      } else {
        toast.error('Failed to submit');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <CourseDetailSkeleton />
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Course not found</Alert>
      </Container>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => router.back()}
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

            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={enrolling}
              onClick={course.isEnrolled ? handleStartLearning : handleEnroll}
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
              {enrolling ? <CircularProgress size={24} color="inherit" /> : course.isEnrolled ? 'Start Learning' : 'Enroll Now'}
            </Button>

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

          {/* Video Player and Quiz Section */}
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            {/* Video Player (YouTube Embed) */}
            {showPlayer && activeEmbed ? (
              <Box ref={videoRef} sx={{ position: "relative", pb: "56.25%", borderRadius: 2, overflow: "hidden", mb: 3 }}>
                <Box
                  component="iframe"
                  src={`${activeEmbed}?rel=0&autoplay=1`}
                  title={course.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                />
              </Box>
            ) : null}

            {/* Quiz Section */}
            {activeEmbed && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Quiz</Typography>
                {quizzes.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No quiz for this video.</Typography>
                ) : (
                  <Stack spacing={2}>
                    {quizzes.map(q => (
                      <Paper key={q._id} sx={{ p: 2, borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>{q.question}</Typography>
                        <RadioGroup
                          value={(answers[q._id]?.[0] ?? -1).toString()}
                          onChange={(_, v) => handleSelect(q._id, Number(v))}
                        >
                          {q.answers.map((a, i) => (
                            <FormControlLabel
                              key={i}
                              value={i.toString()}
                              control={<Radio />}
                              label={a.text}
                            />
                          ))}
                        </RadioGroup>
                      </Paper>
                    ))}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Button variant="contained" onClick={handleSubmitQuiz} disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Quiz'}
                      </Button>
                      {lastResult && (
                        <Typography variant="body2">
                          Score: {lastResult.score}% — {lastResult.passed ? 'Passed' : 'Try again'}
                        </Typography>
                      )}
                      <Button
                        variant="outlined"
                        onClick={() => setActiveIndex(i => Math.min(i + 1, links.length - 1))}
                        disabled={!lastResult?.passed || activeIndex >= links.length - 1}
                      >
                        Next video
                      </Button>
                    </Box>
                  </Stack>
                )}
              </Box>
            )}
          </Paper>
        </Stack>
      </motion.div>
    </Container>
  );
}
