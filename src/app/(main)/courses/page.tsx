"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Rating from "@mui/material/Rating";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";

import { motion } from "framer-motion";
import {
  Search,
  PlayCircle,
  Clock,
  Users,
  BookOpen,
  TrendingUp,
  Award,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import CourseCardSkeleton from "./components/CourseCardSkeleton";

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  totalRatings: number;
  enrolledStudents: number;
  duration?: string; // legacy string, fallback
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  isPremium: boolean;
  image: string;
  tags: string[];
  category: string;
  progress?: number;
  isEnrolled?: boolean;
  enrollmentId?: string;
  youtubeLinks?: string[];           // new
  totalDuration?: number | string;   // minutes; may arrive as number or string
}

interface CoursesResponse {
  courses: Course[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export default function CoursesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Categories"]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/courses/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (selectedCategory !== "All Categories") params.append("category", selectedCategory);
        if (selectedLevel !== "All Levels") params.append("level", selectedLevel);
        params.append("page", currentPage.toString());
        params.append("limit", "12");
        const response = await fetch(`/api/courses?${params}`);
        if (response.ok) {
          const data: CoursesResponse = await response.json();
          setCourses(data.courses);
          setTotalPages(data.totalPages);
          setTotalCount(data.totalCount);
        } else {
          toast.error("Failed to load courses");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [searchTerm, selectedCategory, selectedLevel, currentPage]);

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast.error("Please login to enroll in courses");
      return;
    }

    setEnrolling(courseId);
    try {
      const response = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (response.ok) {
        toast.success("Successfully enrolled in course!");
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === courseId
              ? { ...course, isEnrolled: true, progress: 0 }
              : course
          )
        );
        router.push(`/courses/${courseId}?start=1`);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to enroll in course");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast.error("Failed to enroll in course");
    } finally {
      setEnrolling(null);
    }
  };

  const getLevelColor = (
    level: string
  ): "success" | "warning" | "error" | "primary" => {
    switch (level) {
      case "Beginner":
        return "success";
      case "Intermediate":
        return "warning";
      case "Advanced":
        return "error";
      default:
        return "primary";
    }
  };

  // Format minutes to "Xh Ym"
  const formatMinutes = (mins: number) => {
    if (!mins || mins < 0) return "0m";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h && m) return `${h}h ${m}m`;
    if (h) return `${h}h`;
    return `${m}m`;
  };
  
  // Safely parse totalDuration (number | string) to minutes number
  const toMinutes = (v?: number | string) => {
    const n =
      typeof v === "number"
        ? v
        : typeof v === "string"
        ? parseFloat(v)
        : NaN;
    return Number.isFinite(n) ? Math.round(n as number) : 0;
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
              background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
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
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "2fr 1fr 1fr" },
              gap: 3,
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search
                    size={20}
                    style={{ marginRight: "8px", color: "#666" }}
                  />
                ),
              }}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
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
        <Box
          sx={{
            mb: 4,
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: 2,
          }}
        >
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
            <BookOpen size={24} color="#007BFF" />
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
              {totalCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Courses
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
            <Users size={24} color="#6A0DAD" />
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
              {courses
                .reduce((sum, course) => sum + course.enrolledStudents, 0)
                .toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Students
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
            <TrendingUp size={24} color="#FF7A00" />
            <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
              92%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completion Rate
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
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
        {loading ? (
          <CourseCardSkeleton />
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 3,
                mb: 4,
              }}
            >
              {courses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0, 123, 255, 0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 8px 30px rgba(0, 123, 255, 0.2)",
                      },
                    }}
                  >
                    <Box sx={{ position: "relative" }}>
                      <CardMedia component="img" image={course.image || "/images/course-placeholder.jpg"} alt={course.title} sx={{ height: 200, objectFit: 'cover' }} />
                  
                      <Chip
                        label={course.level}
                        color={getLevelColor(course.level)}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          fontWeight: 600,
                        }}
                      />
                      {course.isEnrolled && (
                        <Chip
                          label="Enrolled"
                          color="primary"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                        {course.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {course.description}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Avatar
                          src={course.instructor.avatar}
                          sx={{
                            width: 24,
                            height: 24,
                            mr: 1,
                            fontSize: "0.75rem",
                          }}
                        >
                          {course.instructor.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {course.instructor.name}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Rating
                          value={course.rating}
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          {course.rating.toFixed(1)} ({course.totalRatings})
                        </Typography>
                      </Box>

                      {course.progress !== undefined && course.progress > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
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

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mb: 2,
                        }}
                      >
                        {course.tags.slice(0, 2).map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: "auto",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          {/* Videos count */}
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <PlayCircle size={16} color="#666" />
                            <Typography variant="body2" color="text.secondary">
                              {(course.youtubeLinks?.length ?? 0)} videos
                            </Typography>
                          </Box>
                          {/* Students enrolled */}
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Users size={16} color="#666" />
                            <Typography variant="body2" color="text.secondary">
                              {course.enrolledStudents?.toLocaleString?.() ?? 0}
                            </Typography>
                          </Box>
                          {/* Total duration */}
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Clock size={16} color="#666" />
                            <Typography variant="body2" color="text.secondary">
                              {toMinutes(course.totalDuration)
                                ? formatMinutes(toMinutes(course.totalDuration))
                                : (course.duration || "—")}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          disabled={enrolling === course._id}
                          onClick={() => {
                            if (course.isEnrolled) {
                              router.push(`/courses/${course._id}?start=1`);
                            } else {
                              handleEnroll(course._id);
                            }
                          }}
                          sx={{
                            background: course.isEnrolled
                              ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
                              : "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                            "&:hover": {
                              background: course.isEnrolled
                                ? "linear-gradient(135deg, #218838 0%, #1ea085 100%)"
                                : "linear-gradient(135deg, #0056CC 0%, #4A0080 100%)",
                            },
                        }}
                        >
                          {enrolling === course._id ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : course.isEnrolled ? (
                            course.progress && course.progress > 0 ? "Continue" : "Start"
                          ) : (
                            "Enroll Now"
                          )}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}

        {!loading && courses.length === 0 && (
          <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
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
