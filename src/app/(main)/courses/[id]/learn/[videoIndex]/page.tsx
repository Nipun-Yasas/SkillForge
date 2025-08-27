'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { useParams, useRouter } from 'next/navigation';

import  Box  from '@mui/material/Box';
import  Button  from '@mui/material/Button';
import  Typography  from '@mui/material/Typography';
import  Paper  from '@mui/material/Paper';
import  Stack  from '@mui/material/Stack';
import  Chip  from '@mui/material/Chip';
import  Container  from '@mui/material/Container';
import  Divider  from '@mui/material/Divider';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import  CircularProgress  from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { ArrowLeft, PlayCircle } from 'lucide-react';
import LearnVideoSkeleton from '@/app/(main)/courses/components/LearnVideoSkeleton';

type Quiz = {
  _id: string;
  videoUrl: string;
  question: string;
  answers: { text: string; correct?: boolean }[];
};

type Course = {
  _id: string;
  title: string;
  youtubeLinks: string[];
  level: string;
  tags: string[];
  credit: number;
};

function toYouTubeEmbedUrl(url?: string) {
  if (!url) return null;

  const raw = String(url).trim();

  // If it's already an embed URL, normalize and return
  if (/youtube\.com\/embed\//i.test(raw)) {
    return raw.startsWith('http') ? raw : `https:${raw}`;
  }

  // If user stored only the video ID
  const idLike = /^[a-zA-Z0-9_-]{11}$/.test(raw) ? raw : null;

  try {
    // Ensure we can parse even if protocol is missing
    const u = raw.startsWith('http') ? new URL(raw) : new URL(`https://${raw}`);

    // youtu.be/<id>
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.split('/').filter(Boolean)[0];
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return `https://www.youtube.com/embed/${id}`;
      }
    }

    // youtube.com/watch?v=<id>
    if (u.pathname === '/watch' && u.searchParams.get('v')) {
      const id = u.searchParams.get('v')!;
      return `https://www.youtube.com/embed/${id}`;
    }

    // youtube.com/shorts/<id>
    if (u.pathname.startsWith('/shorts/')) {
      const id = u.pathname.split('/')[2];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    // youtube.com/live/<id>
    if (u.pathname.startsWith('/live/')) {
      const id = u.pathname.split('/')[2];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    // fall through to id-like handling
  }

  if (idLike) {
    return `https://www.youtube.com/embed/${idLike}`;
  }

  return null;
}

export default function LearnVideoPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = (Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined)) || '';
  const indexParam = Array.isArray(params?.videoIndex) ? params.videoIndex[0] : (params?.videoIndex as string | undefined);
  const videoIndex = Math.max(0, parseInt(indexParam || '0', 10) || 0);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        if (!res.ok) throw new Error('Failed to load course');
        const data = await res.json();
        if (mounted) setCourse(data.course);
      } catch (e: unknown) {
        console.error(e);
        if (e instanceof Error) {
          toast.error(e.message || 'Failed to load course');
        } else {
          toast.error('Failed to load course');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [courseId]);

  const links = useMemo(() => course?.youtubeLinks || [], [course]);
  const videoUrl = links[videoIndex];
  const embed = toYouTubeEmbedUrl(videoUrl);
  const hasNext = videoIndex < (links.length - 1);
  const hasPrev = videoIndex > 0;

  // Load quizzes for this video after user clicks "Mark as done"
  useEffect(() => {
    if (!showQuiz || !course?._id || !videoUrl) return;
    let abort = false;
    (async () => {
      try {
        const res = await fetch(`/api/courses/${course._id}/quizzes`);
        if (!res.ok) throw new Error('Failed to load quizzes');
        const data = await res.json();
        if (!abort) {
          const list: Quiz[] = (data.quizzes || []).filter((q: Quiz) => q.videoUrl === videoUrl);
          setQuizzes(list);
          setAnswers({});
          setResult(null);
        }
      } catch (e: unknown) {
        if (!abort) {
          console.error(e);
          if (e instanceof Error) {
            toast.error(e.message || 'Failed to load quizzes');
          } else {
            toast.error('Failed to load quizzes');
          }
        }
      }
    })();
    return () => { abort = true; };
  }, [showQuiz, course?._id, videoUrl]);

  const onSubmit = async () => {
    if (!course?._id || !videoUrl || quizzes.length === 0) return;
    setSubmitting(true);
    try {
      const responses = quizzes.map(q => ({
        quizId: q._id,
        selected: answers[q._id] || [],
      }));
      const res = await fetch(`/api/courses/${course._id}/quizzes/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoUrl, responses }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submit failed');
      setResult({ score: data.score, passed: data.passed });
      if (!data.passed) toast('Score < 70%. Try again.', { icon: '📝' });
      if (data.passed && hasNext) {
        // Optionally auto-advance after a short delay
        // setTimeout(() => router.push(`/courses/${courseId}/learn/${videoIndex + 1}`), 800);
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
    return <LearnVideoSkeleton />;
  }

  if (!course || !videoUrl) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Video not available.</Alert>
        <Button sx={{ mt: 2 }} onClick={() => router.push(`/courses/${courseId}`)}>
          Back to course
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button startIcon={<ArrowLeft />} onClick={() => router.push(`/courses/${courseId}`)} sx={{ mb: 2 }}>
        Back to course
      </Button>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
          {course.title}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
          <Chip label={`Video ${videoIndex + 1} / ${links.length}`} size="small" />
          <Chip label={course.level} size="small" />
          {course.tags?.slice(0, 3).map(t => <Chip key={t} label={t} size="small" />)}
        </Stack>

        {/* Player */}
        {embed ? (
          <Box ref={playerRef} sx={{ position: 'relative', pb: '56.25%', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
            <Box
              component="iframe"
              src={`${embed}?rel=0&autoplay=1`}
              title={course.title}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          </Box>
        ) : (
          <Box
            sx={{
              height: 240,
              background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <PlayCircle size={60} color="white" style={{ opacity: 0.8 }} />
          </Box>
        )}

        {/* Mark as done -> reveals quiz */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              setShowQuiz(true);
              setTimeout(() => playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
            }}
          >
            Mark as done
          </Button>
          <Button
            variant="outlined"
            disabled={!hasPrev}
            onClick={() => router.push(`/courses/${courseId}/learn/${videoIndex - 1}`)}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            disabled={!hasNext || !result?.passed}
            onClick={() => router.push(`/courses/${courseId}/learn/${videoIndex + 1}`)}
          >
            Next
          </Button>
        </Stack>

        {/* Quiz */}
        {showQuiz && (
          <>
            <Divider sx={{ my: 2 }} />
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
                      onChange={(_, v) => setAnswers(prev => ({ ...prev, [q._id]: [Number(v)] }))}
                    >
                      {q.answers.map((a, i) => (
                        <FormControlLabel key={i} value={i.toString()} control={<Radio />} label={a.text} />
                      ))}
                    </RadioGroup>
                  </Paper>
                ))}
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button variant="contained" onClick={onSubmit} disabled={submitting}>
                    {submitting ? <CircularProgress size={20} color="inherit" /> : 'Submit Quiz'}
                  </Button>
                  {result && (
                    <Typography variant="body2">
                      Score: {result.score}% — {result.passed ? 'Passed' : 'Try again'}
                    </Typography>
                  )}
                </Stack>
              </Stack>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}