"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";

import { useParams, useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import CourseDetailSkeleton from "../../components/CourseDetailSkeleton";
import DeleteDialog from "@/app/_components/dialogs/DeleteDialog";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import theme from "@/theme";

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
  { text: "", correct: true },
  { text: "", correct: false },
  { text: "", correct: false },
  { text: "", correct: false },
  { text: "", correct: false },
];

export default function ManageQuizzesPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // New quiz form
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<QuizAnswer[]>(emptyAnswers);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    _id: string;
    videoUrl: string;
    question: string;
    answers: QuizAnswer[];
  } | null>(null);

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    question: string;
  } | null>(null);

  const canSubmit = useMemo(
    () =>
      Boolean(videoUrl) &&
      question.trim().length > 0 &&
      answers.length === 5 &&
      answers.every((a) => a.text.trim().length > 0) &&
      answers.some((a) => a.correct),
    [videoUrl, question, answers]
  );

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const cRes = await fetch(`/api/courses/${courseId}`);
      if (!cRes.ok) throw new Error("Failed to load course");
      const cData = await cRes.json();
      setCourse(cData.course);

      const qRes = await fetch(`/api/courses/${courseId}/quizzes`);
      if (!qRes.ok) throw new Error("Failed to load quizzes");
      const qData = await qRes.json();
      setQuizzes(Array.isArray(qData.quizzes) ? qData.quizzes : []);
    } catch (e: unknown) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;
    fetchQuizzes();
  }, [courseId, fetchQuizzes]);

  const handleAnswerChange = (
    idx: number,
    field: "text" | "correct",
    value: string | boolean
  ) => {
    setAnswers((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );
  };

  const handleSetCorrect = (idx: number) => {
    // Single correct by default; change to allow multiple if needed
    setAnswers((prev) => prev.map((a, i) => ({ ...a, correct: i === idx })));
  };

  const resetForm = () => {
    setVideoUrl("");
    setQuestion("");
    setAnswers(emptyAnswers);
  };

  const handleCreateQuiz = async () => {
    if (!canSubmit) return;
    try {
      const res = await fetch(`/api/courses/${courseId}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl, question: question.trim(), answers }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create quiz");
      }
      const data = await res.json();
      setQuizzes((prev) => [data.quiz, ...prev]);
      toast.success("Quiz added");
      resetForm();
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error) {
        toast.error(e.message || "Failed to create quiz");
      }
    }
  };

  // Edit handlers
  const openEdit = (q: Quiz) => {
    setEditForm({
      _id: q._id,
      videoUrl: q.videoUrl,
      question: q.question,
      answers: q.answers.map((a) => ({ text: a.text, correct: !!a.correct })),
    });
    setEditOpen(true);
  };

  const closeEdit = () => {
    if (editing) return;
    setEditOpen(false);
    setEditForm(null);
  };

  const setEditAnswer = (
    idx: number,
    field: "text" | "correct",
    value: string | boolean
  ) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      answers: editForm.answers.map((a, i) =>
        i === idx ? { ...a, [field]: value } : a
      ),
    });
  };

  const setEditCorrect = (idx: number) => {
    if (!editForm) return;
    setEditForm({
      ...editForm,
      answers: editForm.answers.map((a, i) => ({ ...a, correct: i === idx })),
    });
  };

  const canSaveEdit = useMemo(() => {
    if (!editForm) return false;
    return (
      Boolean(editForm.videoUrl) &&
      editForm.question.trim().length > 0 &&
      editForm.answers.length === 5 &&
      editForm.answers.every((a) => a.text.trim().length > 0) &&
      editForm.answers.some((a) => a.correct)
    );
  }, [editForm]);

  const handleSaveEdit = async () => {
    if (!editForm || !canSaveEdit) return;
    setEditing(true);
    try {
      const res = await fetch(
        `/api/courses/${courseId}/quizzes/${editForm._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            videoUrl: editForm.videoUrl,
            question: editForm.question.trim(),
            answers: editForm.answers,
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to update quiz");
      setQuizzes((prev) =>
        prev.map((q) => (q._id === editForm._id ? data.quiz : q))
      );
      toast.success("Quiz updated");
      setEditOpen(false);
      setEditForm(null);
    } catch (e: unknown) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to update quiz");
    } finally {
      setEditing(false);
    }
  };

  // Delete handlers
  const openDelete = (q: Quiz) => {
    setDeleteTarget({ id: q._id, question: q.question });
    setDeleteOpen(true);
  };
  const closeDelete = () => {
    if (deleting) return;
    setDeleteOpen(false);
    setDeleteTarget(null);
  };
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(
        `/api/courses/${courseId}/quizzes/${deleteTarget.id}`,
        { method: "DELETE" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to delete quiz");
      setQuizzes((prev) => prev.filter((q) => q._id !== deleteTarget.id));
      toast.success("Quiz deleted");
      closeDelete();
    } catch (e: unknown) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to delete quiz");
    } finally {
      setDeleting(false);
    }
  };

  const quizzesByVideo = useMemo(() => {
    const map: Record<string, Quiz[]> = {};
    quizzes.forEach((q) => {
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Quizzes — {course.title}
        </Typography>
        <Button onClick={() => router.back()}>Back</Button>
      </Box>

      {/* Create quiz */}
      <Paper
        elevation={10}
        sx={{
          p: 3,
          mb: 4,
          position: "relative",
          zIndex: 1,
          backdropFilter: "blur(10px) saturate(1.08)",
          WebkitBackdropFilter: "blur(10px) saturate(1.08)",
          borderRadius: 3,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 10px 40px rgba(0,0,0,0.45)"
              : "0 10px 40px rgba(0,0,0,0.12)",
          transition: "background-color 200ms ease, backdrop-filter 200ms ease",
          "&:hover": {
            boxShadow: "0 8px 25px rgba(0, 123, 255, 0.2)",
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Create a new quiz
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mb: 2,
            mt: 3,
          }}
        >
          <Select
            fullWidth
            displayEmpty
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value as string)}
          >
            <MenuItem value="" disabled>
              Select a video
            </MenuItem>
            {course.youtubeLinks?.map((link) => (
              <MenuItem key={link} value={link}>
                {link}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            label="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
          {answers.map((ans, i) => (
            <Box key={i} sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant={ans.correct ? "contained" : "outlined"}
                onClick={() => handleSetCorrect(i)}
                sx={{ whiteSpace: "nowrap", px: 3 }}
              >
                {ans.correct ? "Correct" : "Mark correct"}
              </Button>
              <TextField
                fullWidth
                label={`Answer ${i + 1}`}
                value={ans.text}
                onChange={(e) => handleAnswerChange(i, "text", e.target.value)}
              />
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleCreateQuiz}
            disabled={!canSubmit}
          >
            Add Question
          </Button>
        </Box>
      </Paper>

      {/* Existing quizzes grouped by video */}
      {course.youtubeLinks?.map((link) => (
        <Paper
          key={link}
          elevation={10}
          sx={{
            p: 3,
            mb: 4,
            position: "relative",
            zIndex: 1,
            backdropFilter: "blur(10px) saturate(1.08)",
            WebkitBackdropFilter: "blur(10px) saturate(1.08)",
            borderRadius: 3,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 10px 40px rgba(0,0,0,0.45)"
                : "0 10px 40px rgba(0,0,0,0.12)",
            transition:
              "background-color 200ms ease, backdrop-filter 200ms ease",
            "&:hover": {
              boxShadow: "0 8px 25px rgba(0, 123, 255, 0.2)",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Chip label="Video" size="small" />
            <Typography variant="subtitle2" sx={{ wordBreak: "break-all" }}>
              {link}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List dense>
            {(quizzesByVideo[link] || []).length === 0 ? (
              <ListItem>
                <ListItemText primary="No quizzes yet for this video." />
              </ListItem>
            ) : (
              (quizzesByVideo[link] || []).map((q) => (
                <ListItem key={q._id} sx={{ alignItems: "flex-start" }}>
                  <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <ListItemText
                        primary={q.question}
                        primaryTypographyProps={{ component: "div" }}
                        secondary={
                          <Box
                            sx={{
                              mt: 1,
                              display: "grid",
                              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                              gap: 1,
                            }}
                          >
                            {q.answers.map((a, idx) => (
                              <Chip
                                key={idx}
                                label={a.text}
                                color={a.correct ? "success" : "default"}
                                variant={a.correct ? "filled" : "outlined"}
                              />
                            ))}
                          </Box>
                        }
                        secondaryTypographyProps={{ component: "div" }}
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => openEdit(q)} size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => openDelete(q)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      ))}

      {/* Edit Quiz Dialog */}
      <Dialog open={editOpen} onClose={closeEdit} fullWidth maxWidth="sm">
        <DialogTitle>Edit Quiz</DialogTitle>
        <DialogContent dividers>
          {editForm && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <Select
                fullWidth
                value={editForm.videoUrl}
                onChange={(e) =>
                  setEditForm((prev) =>
                    prev
                      ? { ...prev, videoUrl: e.target.value as string }
                      : prev
                  )
                }
              >
                {course.youtubeLinks?.map((link) => (
                  <MenuItem key={link} value={link}>
                    {link}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                fullWidth
                label="Question"
                value={editForm.question}
                onChange={(e) =>
                  setEditForm((prev) =>
                    prev ? { ...prev, question: e.target.value } : prev
                  )
                }
              />
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
                {editForm.answers.map((ans, i) => (
                  <Box key={i} sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant={ans.correct ? "contained" : "outlined"}
                      onClick={() => setEditCorrect(i)}
                      sx={{ whiteSpace: "nowrap", px: 3 }}
                    >
                      {ans.correct ? "Correct" : "Mark correct"}
                    </Button>
                    <TextField
                      fullWidth
                      label={`Answer ${i + 1}`}
                      value={ans.text}
                      onChange={(e) => setEditAnswer(i, "text", e.target.value)}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEdit} disabled={editing}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={!canSaveEdit || editing}
          >
            {editing ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteDialog
        open={deleteOpen}
        onClose={closeDelete}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete quiz"
        message={
          deleteTarget
            ? `Are you sure you want to delete: "${deleteTarget.question}"?`
            : "Are you sure you want to delete this quiz?"
        }
      />
    </Container>
  );
}
