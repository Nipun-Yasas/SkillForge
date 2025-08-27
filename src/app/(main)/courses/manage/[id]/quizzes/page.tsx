'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { useParams, useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';

import CourseDetailSkeleton from '../../components/CourseDetailSkeleton';

type QuizAnswer = { text: string; correct: boolean };
type Quiz = {
  _id: string;
  courseId: string;
  videoUrl: string;
  question: string;
  answers: QuizAnswer[];
  order?: number;
};

type Course = {
  _id: string;
  title: string;
  youtubeLinks: string[];
};

const emptyAnswers: QuizAnswer[] = [
  { text: '', correct: true },
  { text: '', correct: false },
  { text: '', correct: false },
  { text: '', correct: false },
  { text: '', correct: false },
];

export default function ManageQuizzesPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // New quiz form
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState<QuizAnswer[]>(emptyAnswers);

  const canSubmit = useMemo(
    () =>
      Boolean(videoUrl) &&
      question.trim().length > 0 &&
      answers.length === 5 &&
      answers.every(a => a.text.trim().length > 0) &&
      answers.some(a => a.correct),
    [videoUrl, question, answers]
  );

  const fetchQuizzes = async () => {
    try {
        // Fetch course for its videos
        const cRes = await fetch(`/api/courses/${courseId}`);
        if (!cRes.ok) throw new Error('Failed to load course');
        const cData = await cRes.json();
        setCourse(cData.course);
        // Fetch existing quizzes
        const qRes = await fetch(`/api/courses/${courseId}/quizzes`);
        if (!qRes.ok) throw new Error('Failed to load quizzes');
        const qData = await qRes.json();
        setQuizzes(Array.isArray(qData.quizzes) ? qData.quizzes : []);
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error(e);
          toast.error(e.message || 'Failed to load data');
        }
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    if (!courseId) return;
    fetchQuizzes();

  }, );

  const handleAnswerChange = (idx: number, field: 'text' | 'correct', value: string | boolean) => {
    setAnswers(prev =>
      prev.map((a, i) =>
        i === idx ? { ...a, [field]: value } : a
      )
    );
  };

  const handleSetCorrect = (idx: number) => {
    // Single correct by default; change to allow multiple if needed
    setAnswers(prev => prev.map((a, i) => ({ ...a, correct: i === idx })));
  };

  const resetForm = () => {
    setVideoUrl('');
    setQuestion('');
    setAnswers(emptyAnswers);
  };

  const handleCreateQuiz = async () => {
    if (!canSubmit) return;
    try {
      const res = await fetch(`/api/courses/${courseId}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, question: question.trim(), answers }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create quiz');
      }
      const data = await res.json();
      setQuizzes(prev => [data.quiz, ...prev]);
      toast.success('Quiz added');
      resetForm();
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) {
        toast.error(e.message || 'Failed to create quiz');
      }
    }
  };

  const quizzesByVideo = useMemo(() => {
    const map: Record<string, Quiz[]> = {};
    quizzes.forEach(q => {
      (map[q.videoUrl] ||= []).push(q);
    });
    return map;
  }, [quizzes]);

  // Show skeleton until course is loaded (no "not found" screen)
  if (loading || !course) {
    return <CourseDetailSkeleton />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>Quizzes — {course.title}</Typography>
        <Button onClick={() => router.back()}>Back</Button>
      </Box>

      {/* Create quiz */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Create a new quiz</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
          <Select
            fullWidth
            displayEmpty
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value as string)}
          >
            <MenuItem value="" disabled>Select a video</MenuItem>
            {course.youtubeLinks?.map(link => (
              <MenuItem key={link} value={link}>{link}</MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="Question"
            value={question}
            onChange={e => setQuestion(e.target.value)}
          />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
          {answers.map((ans, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant={ans.correct ? 'contained' : 'outlined'}
                onClick={() => handleSetCorrect(i)}
                sx={{ whiteSpace: 'nowrap' }}
              >
                {ans.correct ? 'Correct' : 'Mark correct'}
              </Button>
              <TextField
                fullWidth
                label={`Answer ${i + 1}`}
                value={ans.text}
                onChange={(e) => handleAnswerChange(i, 'text', e.target.value)}
              />
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" onClick={handleCreateQuiz} disabled={!canSubmit}>
            Add Question
          </Button>
        </Box>
      </Paper>

      {/* Existing quizzes grouped by video */}
      {course.youtubeLinks?.map((link) => (
        <Paper key={link} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip label="Video" size="small" />
            <Typography variant="subtitle2" sx={{ wordBreak: 'break-all' }}>{link}</Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List dense>
            {(quizzesByVideo[link] || []).length === 0 ? (
              <ListItem>
                <ListItemText primary="No quizzes yet for this video." />
              </ListItem>
            ) : (
              (quizzesByVideo[link] || []).map(q => (
                <ListItem key={q._id} sx={{ alignItems: 'flex-start' }}>
                  <ListItemText
                    primary={q.question}
                    primaryTypographyProps={{ component: 'div' }}
                    secondary={
                      <Box
                        sx={{
                          mt: 1,
                          display: 'grid',
                          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                          gap: 1,
                        }}
                      >
                        {q.answers.map((a, idx) => (
                          <Chip
                            key={idx}
                            label={a.text}
                            color={a.correct ? 'success' : 'default'}
                            variant={a.correct ? 'filled' : 'outlined'}
                          />
                        ))}
                      </Box>
                    }
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      ))}
    </Container>
  );
}