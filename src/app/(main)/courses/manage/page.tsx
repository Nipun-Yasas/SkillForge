'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  ExpandMore,
  Save,
  Cancel,
  Visibility,
  VisibilityOff,
  PlayCircle,
  People,
  Star,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ManageCoursesSkeleton from "./components/ManageCoursesSkeleton";
import toast from 'react-hot-toast';

interface Course {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  isPremium: boolean;
  image: string;
  tags: string[];
  category: string;
  prerequisites: string[];
  learningOutcomes: string[];
  modules: {
    id: string;
    title: string;
    description: string;
    duration: string;
    resources?: {
      title: string;
      url: string;
      type: 'video' | 'pdf' | 'link' | 'quiz';
    }[];
  }[];
  isPublished: boolean;
  rating: number;
  totalRatings: number;
  enrolledStudents: number;
  createdAt: string;
}

interface CourseFormData {
  title: string;
  description: string;
  longDescription: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  isPremium: boolean;
  image: string;
  tags: string[];
  category: string;
  prerequisites: string[];
  learningOutcomes: string[];
  modules: {
    id: string;
    title: string;
    description: string;
    duration: string;
    resources?: {
      title: string;
      url: string;
      type: 'video' | 'pdf' | 'link' | 'quiz';
    }[];
  }[];
  isPublished: boolean;
}

const initialFormData: CourseFormData = {
  title: '',
  description: '',
  longDescription: '',
  duration: '',
  level: 'Beginner',
  price: 0,
  isPremium: false,
  image: '',
  tags: [],
  category: '',
  prerequisites: [],
  learningOutcomes: [],
  modules: [],
  isPublished: false,
};

const categories = [
  'Programming',
  'Design',
  'Data Science',
  'Marketing',
  'Business',
  'Languages',
  'Photography',
  'Music',
  'Health & Fitness',
  'Cooking',
];

export default function CourseManagementPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newOutcome, setNewOutcome] = useState('');

  // Check if user is authorized
  useEffect(() => {
    if (user && !['mentor', 'both', 'admin'].includes(user.role)) {
      toast.error('Access denied. Only mentors can manage courses.');
      window.location.href = '/courses';
    }
  }, [user]);

  // Fetch user's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/courses?instructor=${user?._id}`);
        if (response.ok) {
          const data = await response.json();
          setCourses(data.courses);
        } else {
          toast.error('Failed to load courses');
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user]);

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        longDescription: course.longDescription || '',
        duration: course.duration,
        level: course.level,
        price: course.price,
        isPremium: course.isPremium,
        image: course.image,
        tags: course.tags,
        category: course.category,
        prerequisites: course.prerequisites,
        learningOutcomes: course.learningOutcomes,
        modules: course.modules.map(module => ({
          ...module,
          resources: module.resources || []
        })),
        isPublished: course.isPublished,
      });
    } else {
      setEditingCourse(null);
      setFormData(initialFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCourse(null);
    setFormData(initialFormData);
    setNewTag('');
    setNewPrerequisite('');
    setNewOutcome('');
  };

  const handleInputChange = (field: keyof CourseFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const handleRemovePrerequisite = (prerequisiteToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(p => p !== prerequisiteToRemove)
    }));
  };

  const handleAddOutcome = () => {
    if (newOutcome.trim() && !formData.learningOutcomes.includes(newOutcome.trim())) {
      setFormData(prev => ({
        ...prev,
        learningOutcomes: [...prev.learningOutcomes, newOutcome.trim()]
      }));
      setNewOutcome('');
    }
  };

  const handleRemoveOutcome = (outcomeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter(o => o !== outcomeToRemove)
    }));
  };

  const handleAddModule = () => {
    const newModule = {
      id: `module-${Date.now()}`,
      title: '',
      description: '',
      duration: '',
      resources: [],
    };
    setFormData(prev => ({
      ...prev,
      modules: [...prev.modules, newModule]
    }));
  };

  const handleUpdateModule = (moduleIndex: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, index) =>
        index === moduleIndex ? { ...module, [field]: value } : module
      )
    }));
  };

  const handleRemoveModule = (moduleIndex: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, index) => index !== moduleIndex)
    }));
  };

  const handleSaveCourse = async () => {
    // Validation
    if (!formData.title || !formData.description || !formData.duration || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.learningOutcomes.length === 0) {
      toast.error('Please add at least one learning outcome');
      return;
    }

    setSaving(true);
    try {
      const url = editingCourse 
        ? `/api/courses/${editingCourse._id}` 
        : '/api/courses';
      
      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(editingCourse ? 'Course updated successfully' : 'Course created successfully');
        
        // Update courses list
        if (editingCourse) {
          setCourses(prev => prev.map(course => 
            course._id === editingCourse._id ? data.course : course
          ));
        } else {
          setCourses(prev => [data.course, ...prev]);
        }
        
        handleCloseDialog();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save course');
      }
    } catch (error) {
      console.error('Save course error:', error);
      toast.error('Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Course deleted successfully');
        setCourses(prev => prev.filter(course => course._id !== courseId));
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Delete course error:', error);
      toast.error('Failed to delete course');
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      const response = await fetch(`/api/courses/${course._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: !course.isPublished }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(course.isPublished ? 'Course unpublished' : 'Course published');
        setCourses(prev => prev.map(c => 
          c._id === course._id ? data.course : c
        ));
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update course');
      }
    } catch (error) {
      console.error('Toggle publish error:', error);
      toast.error('Failed to update course');
    }
  };

  if (!user || !['mentor', 'both', 'admin'].includes(user.role)) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Access denied. Only mentors can manage courses.</Alert>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            📚 My Courses
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #0056CC 0%, #4A0080 100%)',
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
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No courses created yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first course to start teaching
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0056CC 0%, #4A0080 100%)',
                },
              }}
            >
              Create Course
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid size={{xs:12, sm:6, lg:4}} key={course._id}>
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
                  {/* Course Image */}
                  <Box
                    sx={{
                      height: 200,
                      background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <PlayCircle sx={{ fontSize: 60, color: 'white', opacity: 0.8 }} />
                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                      <Chip
                        label={course.isPublished ? 'Published' : 'Draft'}
                        color={course.isPublished ? 'success' : 'warning'}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {course.description}
                    </Typography>

                    {/* Stats */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <People sx={{ fontSize: 16 }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.enrolledStudents}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Star sx={{ fontSize: 16 }} />
                        <Typography variant="body2" color="text.secondary">
                          {course.rating.toFixed(1)} ({course.totalRatings})
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {course.tags.slice(0, 2).map((tag) => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Box>
                      <IconButton
                        onClick={() => handleTogglePublish(course)}
                        color={course.isPublished ? 'success' : 'warning'}
                        size="small"
                      >
                        {course.isPublished ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                      <IconButton
                        onClick={() => handleOpenDialog(course)}
                        color="primary"
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteCourse(course._id)}
                        color="error"
                        size="small"
                      >
                        <Delete />
                      </IconButton>
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
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle>
            {editingCourse ? 'Edit Course' : 'Create New Course'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Basic Info */}
              <Grid container spacing={2}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>
              
              <Grid container spacing={2}>
                <TextField
                  fullWidth
                  label="Course Title"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </Grid>
              
              <Grid container spacing={2}>
                <TextField
                  fullWidth
                  label="Short Description"
                  required
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </Grid>
              
              <Grid container spacing={2}>
                <TextField
                  fullWidth
                  label="Long Description"
                  multiline
                  rows={5}
                  value={formData.longDescription}
                  onChange={(e) => handleInputChange('longDescription', e.target.value)}
                />
              </Grid>

              <Grid container spacing={2}>
                <TextField
                  fullWidth
                  label="Duration (e.g., 8 weeks)"
                  required
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                />
              </Grid>

              <Grid container spacing={2} >
                <FormControl fullWidth required>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={formData.level}
                    label="Level"
                    onChange={(e) => handleInputChange('level', e.target.value)}
                  >
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Advanced">Advanced</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid container spacing={2}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    label="Category"
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid container spacing={2}>
                <TextField
                  fullWidth
                  label="Price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                />
              </Grid>

              <Grid container spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPremium}
                      onChange={(e) => handleInputChange('isPremium', e.target.checked)}
                    />
                  }
                  label="Premium Course"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPublished}
                      onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                    />
                  }
                  label="Publish Course"
                />
              </Grid>

              {/* Tags */}
              <Grid container spacing={2}>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <Button onClick={handleAddTag}>Add</Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
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
              <Grid container spacing={2}>
                <Typography variant="h6" gutterBottom>
                  Prerequisites
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add prerequisite"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddPrerequisite()}
                  />
                  <Button onClick={handleAddPrerequisite}>Add</Button>
                </Box>
                <List>
                  {formData.prerequisites.map((prerequisite, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={prerequisite} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemovePrerequisite(prerequisite)}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Grid>

              {/* Learning Outcomes */}
              <Grid container spacing={2}>
                <Typography variant="h6" gutterBottom>
                  Learning Outcomes *
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add learning outcome"
                    value={newOutcome}
                    onChange={(e) => setNewOutcome(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddOutcome()}
                  />
                  <Button onClick={handleAddOutcome}>Add</Button>
                </Box>
                <List>
                  {formData.learningOutcomes.map((outcome, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={outcome} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveOutcome(outcome)}
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Grid>

              {/* Course Modules */}
              <Grid container spacing={2}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Course Modules
                  </Typography>
                  <Button startIcon={<Add />} onClick={handleAddModule}>
                    Add Module
                  </Button>
                </Box>
                
                {formData.modules.map((module, index) => (
                  <Accordion key={module.id} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography>
                        Module {index + 1}: {module.title || 'Untitled Module'}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid container spacing={2}>
                          <TextField
                            fullWidth
                            label="Module Title"
                            value={module.title}
                            onChange={(e) => handleUpdateModule(index, 'title', e.target.value)}
                          />
                        </Grid>
                        <Grid container spacing={2}>
                          <TextField
                            fullWidth
                            label="Module Description"
                            multiline
                            rows={3}
                            value={module.description}
                            onChange={(e) => handleUpdateModule(index, 'description', e.target.value)}
                          />
                        </Grid>
                        <Grid container spacing={2}>
                          <TextField
                            fullWidth
                            label="Duration (e.g., 120 minutes)"
                            value={module.duration}
                            onChange={(e) => handleUpdateModule(index, 'duration', e.target.value)}
                          />
                        </Grid>
                        <Grid container spacing={2}>
                          <Button
                            color="error"
                            onClick={() => handleRemoveModule(index)}
                            startIcon={<Delete />}
                          >
                            Remove Module
                          </Button>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                ))}
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
                background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #0056CC 0%, #4A0080 100%)',
                },
              }}
            >
              {saving ? 'Saving...' : 'Save Course'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
}
