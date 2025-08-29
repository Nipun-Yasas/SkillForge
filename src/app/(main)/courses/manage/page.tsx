"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CardMedia from "@mui/material/CardMedia";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import DeleteDialog from "@/app/_components/dialogs/DeleteDialog";

import Add from "@mui/icons-material/Add";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import Save from "@mui/icons-material/Save";
import Cancel from "@mui/icons-material/Cancel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import People from "@mui/icons-material/People";
import Star from "@mui/icons-material/Star";
import { motion } from "framer-motion";

import { useAuth } from "@/contexts/AuthContext";
import ManageCoursesSkeleton from "./components/ManageCoursesSkeleton";
import theme from "@/theme";
interface Course {
  _id: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  tags: string[];
  category: string;
  prerequisites?: string[];
  learningOutcomes: string[];
  totalDuration: number;
  isPublished: boolean;
  credit: number;
  youtubeLinks: string[];
  rating: number;
  totalRatings: number;
  enrolledStudents: number;
  createdAt: string;
}

interface CourseFormData {
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  tags: string[];
  category: string;
  prerequisites: string[];
  learningOutcomes: string[];
  totalDuration: number;
  isPublished: boolean;
  credit: number;
  youtubeLinks: string[];
}

const initialFormData: CourseFormData = {
  title: "",
  description: "",
  level: "Beginner",
  image: "",
  tags: [],
  category: "",
  prerequisites: [],
  learningOutcomes: [],
  totalDuration: 0,
  isPublished: false,
  credit: 0,
  youtubeLinks: [],
};

// simple YouTube URL validator
const isValidYouTubeUrl = (url: string) => {
  try {
    const u = new URL(url);
    return (
      u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")
    );
  } catch {
    return false;
  }
};

const categories = [
  "Programming",
  "Design",
  "Data Science",
  "Marketing",
  "Business",
  "Languages",
  "Photography",
  "Music",
  "Health & Fitness",
  "Cooking",
];

export default function CourseManagementPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newOutcome, setNewOutcome] = useState("");
  const [newYoutubeLink, setNewYoutubeLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const router = useRouter();

  // Check if user is authorized
  useEffect(() => {
    if (user && !["mentor", "both", "admin"].includes(user.role)) {
      // toast.error("Access denied. Only mentors can manage courses.");
      // window.location.href = "/courses";
    }
  }, [user]);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    if (!user?._id) return;
    try {
      const res = await fetch(`/api/courses?instructor=${user._id}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to load courses");
      }
      const data = await res.json();
      setCourses(Array.isArray(data.courses) ? data.courses : []);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error("Fetch courses error:", e);
        toast.error(e.message || "Failed to load courses");
      }
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  // Fetch user's courses
  useEffect(() => {
    if (!user?._id) {
      return;
    }
    fetchCourses();
  }, [user?._id, fetchCourses]);

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        level: course.level,
        image: course.image,
        tags: course.tags || [],
        category: course.category,
        prerequisites: course.prerequisites || [],
        learningOutcomes: course.learningOutcomes || [],
        totalDuration: course.totalDuration || 0,
        isPublished: course.isPublished ?? false,
        credit: course.credit ?? 0,
        youtubeLinks: course.youtubeLinks || [],
      });
      setImageFile(null);
      setImagePreview(course.image || null);
    } else {
      setEditingCourse(null);
      setFormData(initialFormData);
      setImageFile(null);
      setImagePreview(null);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCourse(null);
    setFormData(initialFormData);
    setNewTag("");
    setNewPrerequisite("");
    setNewOutcome("");
    setNewYoutubeLink("");
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setImageFile(null);
  };

  const handleInputChange = (field: keyof CourseFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddPrerequisite = () => {
    if (
      newPrerequisite.trim() &&
      !formData.prerequisites.includes(newPrerequisite.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()],
      }));
      setNewPrerequisite("");
    }
  };

  const handleRemovePrerequisite = (prerequisiteToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(
        (p) => p !== prerequisiteToRemove
      ),
    }));
  };

  const handleAddOutcome = () => {
    if (
      newOutcome.trim() &&
      !formData.learningOutcomes.includes(newOutcome.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        learningOutcomes: [...prev.learningOutcomes, newOutcome.trim()],
      }));
      setNewOutcome("");
    }
  };

  const handleRemoveOutcome = (outcomeToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter(
        (o) => o !== outcomeToRemove
      ),
    }));
  };

  const handleAddYoutubeLink = () => {
    const link = newYoutubeLink.trim();
    if (!link) return;
    if (!isValidYouTubeUrl(link)) {
      toast.error("Enter a valid YouTube URL");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      youtubeLinks: [...prev.youtubeLinks, link],
    }));
    setNewYoutubeLink("");
  };

  const handleRemoveYoutubeLink = (linkToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      youtubeLinks: prev.youtubeLinks.filter((l) => l !== linkToRemove),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Optional: size/type validations
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string> => {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      throw new Error("Image upload failed");
    }
    const data = await res.json();
    return data.url as string;
  };

  const handleSaveCourse = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error("Please fill in required fields");
      return;
    }
    if (formData.learningOutcomes.length === 0) {
      toast.error("Please add at least one learning outcome");
      return;
    }

    setSaving(true);
    try {
      // 1) Upload image if a new file is selected
      let imageUrl = formData.image || "";
      if (imageFile) {
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (err) {
          console.error(err);
          toast.error("Failed to upload image");
          setSaving(false);
          return;
        }
      }

      const url = editingCourse
        ? `/api/courses/${editingCourse._id}`
        : "/api/courses";
      const method = editingCourse ? "PUT" : "POST";

      const payload = {
        title: formData.title,
        description: formData.description,
        level: formData.level,
        image: imageUrl,
        tags: formData.tags,
        category: formData.category,
        prerequisites: formData.prerequisites,
        learningOutcomes: formData.learningOutcomes,
        totalDuration: Number(formData.totalDuration) || 0,
        isPublished: formData.isPublished,
        credit: Number(formData.credit) || 0,
        youtubeLinks: formData.youtubeLinks,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          editingCourse
            ? "Course updated successfully"
            : "Course created successfully"
        );
        if (editingCourse) {
          setCourses((prev) =>
            prev.map((c) => (c._id === editingCourse._id ? data.course : c))
          );
        } else {
          setCourses((prev) => [data.course, ...prev]);
        }
        handleCloseDialog();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to save course");
      }
    } catch (err) {
      console.error("Save course error:", err);
      toast.error("Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (course: Course) => {
    setDeleteTarget({ id: course._id, title: course.title });
    setDeleteOpen(true);
  };

  const handleDeleteCourse = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/courses/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(data.error || "Failed to delete course");
      toast.success("Course deleted successfully");
      setCourses((prev) => prev.filter((c) => c._id !== deleteTarget.id));
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (error: unknown) {
      console.error("Delete course error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete course"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      const response = await fetch(`/api/courses/${course._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: !course.isPublished }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(
          course.isPublished ? "Course unpublished" : "Course published"
        );
        setCourses((prev) =>
          prev.map((c) => (c._id === course._id ? data.course : c))
        );
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update course");
      }
    } catch (error) {
      console.error("Toggle publish error:", error);
      toast.error("Failed to update course");
    }
  };

  const formatMinutes = (mins: number) => {
    const m = Number(mins) || 0;
    const h = Math.floor(m / 60);
    const r = m % 60;
    return h ? `${h}h ${r}m` : `${r}m`;
  };

  if (!user || !["mentor", "both", "admin"].includes(user.role)) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 8, display: "flex", justifyContent: "center" }}
      >
        <Typography variant="h6" color="text.secondary">
          You are not a mentor.
        </Typography>
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
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #0056CC 0%, #4A0080 100%)",
              },
            }}
          >
            Create Course
          </Button>
        </Box>

        {/* Courses Grid */}
        {loading ? (
          <ManageCoursesSkeleton items={6} />
        ) : courses.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 6 }}>No courses yet.</Box>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={course._id}>
                <Card
                  elevation={10}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
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
                  {/* Course Image */}
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      image={course.image || "/images/course-placeholder.jpg"}
                      alt={course.title}
                      sx={{ height: 200, objectFit: "cover" }}
                    />

                    <Box sx={{ position: "absolute", top: 12, right: 12 }}>
                      <Chip
                        label={course.isPublished ? "Published" : "Draft"}
                        color={course.isPublished ? "success" : "warning"}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {course.description}
                    </Typography>

                    {/* Stats */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1.5,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <People sx={{ fontSize: 16 }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.enrolledStudents}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Star sx={{ fontSize: 16 }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.rating.toFixed(1)} ({course.totalRatings})
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1.5,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Videos: {course.youtubeLinks?.length || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Credit: {course.credit}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Duration: {formatMinutes(course.totalDuration)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {course.tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>

                  <CardActions
                    sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                  >
                    <Box>
                      <IconButton
                        onClick={() => handleTogglePublish(course)}
                        color={course.isPublished ? "success" : "warning"}
                        size="small"
                      >
                        {course.isPublished ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenDialog(course)}
                        color="primary"
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => openDeleteDialog(course)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                        onClick={() =>
                          router.push(`/courses/manage/${course._id}/quizzes`)
                        }
                      >
                        Quizzes
                      </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {course.level}
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Course Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
          slotProps={{
            paper: { sx: { borderRadius: 3 } },
          }}
        >
          <DialogTitle sx={{ display: "flex", justifyContent: "center" }}>
            {editingCourse ? "Edit Course" : "Create New Course"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Basic info */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Course Title"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Short Description"
                  required
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={formData.level}
                    label="Level"
                    onChange={(e) => handleInputChange("level", e.target.value)}
                  >
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Total Duration (minutes)"
                  type="number"
                  value={formData.totalDuration}
                  onChange={(e) =>
                    handleInputChange(
                      "totalDuration",
                      Number(e.target.value) || ""
                    )
                  }
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Credit Cost"
                  type="number"
                  value={formData.credit}
                  onChange={(e) =>
                    handleInputChange("credit", Number(e.target.value) || "")
                  }
                />
              </Grid>

              {/* Cover Image Upload */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Cover Image
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 2,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Button variant="outlined" component="label">
                    Choose Image
                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                  {imagePreview ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CardMedia
                        component="img"
                        alt="Cover preview"
                        image={imagePreview}
                        sx={{
                          width: 160,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />
                      <Button
                        color="error"
                        onClick={() => {
                          if (imagePreview) URL.revokeObjectURL(imagePreview);
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                      >
                        Remove
                      </Button>
                    </Box>
                  ) : (
                    formData.image && (
                      <CardMedia
                        component="img"
                        alt="Current cover"
                        image={formData.image}
                        sx={{
                          width: 160,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 1,
                        }}
                      />
                    )
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  JPG, PNG, or WEBP. Max ~5MB is recommended.
                </Typography>
              </Grid>

              {/* Tags */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    label="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTag())
                    }
                  />
                  <Button onClick={handleAddTag}>Add</Button>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {formData.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Prerequisites */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Prerequisites
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Add prerequisite"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddPrerequisite())
                    }
                  />
                  <Button onClick={handleAddPrerequisite}>Add</Button>
                </Box>
                <List>
                  {formData.prerequisites.map((p, i) => (
                    <ListItem
                      key={i}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleRemovePrerequisite(p)}
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={p} />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              {/* Learning Outcomes */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Learning Outcomes *
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    fullWidth
                    label="Add learning outcome"
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddOutcome())
                    }
                  />
                  <Button onClick={handleAddOutcome}>Add</Button>
                </Box>
                <List>
                  {formData.learningOutcomes.map((o, i) => (
                    <ListItem
                      key={i}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveOutcome(o)}
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={o} />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              {/* YouTube Links */}
              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  YouTube Links (Course Materials)
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mb: 1,
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <TextField
                    fullWidth
                    label="https://youtu.be/... or https://www.youtube.com/watch?v=..."
                    value={newYoutubeLink}
                    onChange={(e) => setNewYoutubeLink(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddYoutubeLink())
                    }
                  />
                  <Button onClick={handleAddYoutubeLink}>Add</Button>
                </Box>
                <List>
                  {formData.youtubeLinks.map((link, i) => (
                    <ListItem
                      key={link + i}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveYoutubeLink(link)}
                        >
                          <Delete />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={link} />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              {/* Publish */}
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPublished}
                      onChange={(e) =>
                        handleInputChange("isPublished", e.target.checked)
                      }
                    />
                  }
                  label="Publish Course"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} startIcon={<Cancel />}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveCourse}
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : <Save />}
              sx={{
                background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0056CC 0%, #4A0080 100%)",
                },
              }}
            >
              {saving ? "Saving..." : "Save Course"}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <DeleteDialog
        open={deleteOpen}
        onClose={() => {
          if (deleting) return;
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteCourse}
        loading={deleting}
        title="Delete course"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
            : "Are you sure you want to delete this course? This action cannot be undone."
        }
      />
    </Container>
  );
}
