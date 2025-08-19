"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Avatar,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Input } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, X, Save, Camera, Edit, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileSkeleton from "./components/ProfileSkeleton";

import toast from "react-hot-toast";

// Predefined skill categories with popular skills
const skillCategories = {
  Programming: [
    "JavaScript",
    "Python",
    "Java",
    "TypeScript",
    "C++",
    "C#",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "React",
    "Angular",
    "Vue.js",
    "Node.js",
    "Spring Boot",
    "Django",
    "Flask",
    "Express.js",
    "Next.js",
  ],
  Design: [
    "UI/UX Design",
    "Graphic Design",
    "Web Design",
    "Mobile Design",
    "Figma",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Sketch",
    "InVision",
    "Canva",
    "Blender",
    "3D Modeling",
    "Animation",
  ],
  Marketing: [
    "Digital Marketing",
    "Social Media Marketing",
    "Content Marketing",
    "SEO",
    "SEM",
    "Email Marketing",
    "Brand Strategy",
    "Copywriting",
    "Analytics",
    "PPC Advertising",
    "Influencer Marketing",
  ],
  "Data Science": [
    "Machine Learning",
    "Data Analysis",
    "Statistics",
    "SQL",
    "Excel",
    "Tableau",
    "Power BI",
    "R",
    "Pandas",
    "NumPy",
    "TensorFlow",
    "PyTorch",
    "Data Visualization",
    "Big Data",
    "AI",
  ],
  Business: [
    "Project Management",
    "Leadership",
    "Strategic Planning",
    "Finance",
    "Accounting",
    "Sales",
    "Customer Service",
    "Operations",
    "Consulting",
    "Entrepreneurship",
    "Business Analysis",
    "Agile",
    "Scrum",
  ],
  Creative: [
    "Video Editing",
    "Photography",
    "Content Creation",
    "Writing",
    "Storytelling",
    "Music Production",
    "Podcasting",
    "Creative Writing",
    "Art",
    "Illustration",
    "Film Making",
  ],
  Languages: [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Japanese",
    "Korean",
    "Arabic",
    "Portuguese",
    "Italian",
    "Russian",
  ],
  Other: [
    "Communication",
    "Public Speaking",
    "Teaching",
    "Mentoring",
    "Time Management",
    "Problem Solving",
    "Critical Thinking",
    "Networking",
    "Research",
    "Presentation Skills",
  ],
};

// Flatten all skills for autocomplete
// const allSkills = Object.values(skillCategories).flat();

interface ProfileFormData {
  name: string;
  email: string;
  bio: string;
  role: string;
  location: string;
  experience: string;
  skillsLearning: string[];
  skillsTeaching: string[];
  learningGoals: string;
  availability: string;
}

export default function ProfilePage() {
  const { user, updateUser, refreshUser, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    bio: "",
    role: "",
    location: "",
    experience: "",
    skillsLearning: [],
    skillsTeaching: [],
    learningGoals: "",
    availability: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [skillDialogType, setSkillDialogType] = useState<
    "learning" | "teaching"
  >("learning");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }

    // Initialize form data when user data is available
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        role: user.role || "",
        location: user.location || "",
        experience: user.experience || "",
        skillsLearning: user.skills?.learning || [],
        skillsTeaching: user.skills?.teaching || [],
        learningGoals: user.learningGoals || "",
        availability: user.availability || "",
      });
    }
  }, [user, isLoading, router]);

  // Additional effect to handle user data updates
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        name: user.name || prev.name,
        email: user.email || prev.email,
        bio: user.bio || prev.bio,
        role: user.role || prev.role,
        location: user.location || prev.location,
        experience: user.experience || prev.experience,
        skillsLearning: user.skills?.learning || prev.skillsLearning,
        skillsTeaching: user.skills?.teaching || prev.skillsTeaching,
        learningGoals: user.learningGoals || prev.learningGoals,
        availability: user.availability || prev.availability,
      }));
    }
  }, [user]);

  const handleInputChange = (
    field: keyof ProfileFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSkill = (skill: string, type: "learning" | "teaching") => {
    const field = type === "learning" ? "skillsLearning" : "skillsTeaching";
    const currentSkills = formData[field];

    if (!currentSkills.includes(skill)) {
      handleInputChange(field, [...currentSkills, skill]);
    }
  };

  const handleRemoveSkill = (skill: string, type: "learning" | "teaching") => {
    const field = type === "learning" ? "skillsLearning" : "skillsTeaching";
    const currentSkills = formData[field];
    handleInputChange(
      field,
      currentSkills.filter((s) => s !== skill)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (!user) {
        toast.error("User not found. Please log in again.");
        setIsSaving(false);
        return;
      }
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user._id,
        },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          role: formData.role,
          location: formData.location,
          experience: formData.experience,
          skills: {
            learning: formData.skillsLearning,
            teaching: formData.skillsTeaching,
          },
          learningGoals: formData.learningGoals,
          availability: formData.availability,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        updateUser(updatedUser.user);
        await refreshUser();
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        throw new Error("Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const openSkillDialog = (type: "learning" | "teaching") => {
    setSkillDialogType(type);
    setSkillDialogOpen(true);
    setSelectedCategory("");
    setCustomSkill("");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setIsUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: { "x-user-id": user._id },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      updateUser(data.user);
      // Optional: update local formData to reflect new avatar immediately
      setFormData((prev) => ({ ...prev }));
      toast.success("Profile picture updated");
    } catch (e: unknown) {
      toast.error("Failed to upload picture");
      console.log(e);
    } finally {
      setIsUploadingAvatar(false);
      if (e.target) e.target.value = "";
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const res = await fetch("/api/profile", {
          headers: { "x-user-id": user._id },
        });
        if (res.ok) {
          const data = await res.json();
          updateUser(data.user);
        }
      } catch {
        // ignore
      }
    };
    if (user?._id) load();
  }, [user?._id, user, updateUser]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (!user) {
    return null;
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
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              My Profile
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage your profile and skills to get better mentor matches
            </Typography>
          </Box>

          <Button
            variant={isEditing ? "outlined" : "contained"}
            startIcon={isEditing ? <X /> : <Edit />}
            onClick={() => setIsEditing(!isEditing)}
            sx={{
              background: isEditing
                ? "transparent"
                : "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
              "&:hover": {
                background: isEditing
                  ? "rgba(0, 123, 255, 0.1)"
                  : "linear-gradient(135deg, #0056CC 0%, #4A0080 100%)",
              },
            }}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </Box>

        {/* Profile Picture & Basic Info */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 4, mb: 4 }}
          >
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={user.avatar || undefined}
                sx={{
                  width: 120,
                  height: 120,
                  background:
                    "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                  fontSize: "3rem",
                  fontWeight: 700,
                }}
              >
                {!user.avatar && formData.name
                  ? formData.name.charAt(0).toUpperCase()
                  : null}
              </Avatar>
              {isEditing && (
                <>
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "primary.main",
                      color: "white",
                      width: 36,
                      height: 36,
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <Camera size={16} />
                    )}
                  </IconButton>
                  <Input
                    type="file"
                    inputRef={fileInputRef}
                    inputProps={{ accept: "image/png,image/jpeg,image/webp" }}
                    onChange={handleAvatarChange}
                    sx={{ display: "none" }}
                  />
                </>
              )}
            </Box>

            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                disabled
                sx={{ mb: 2 }}
                helperText="Email cannot be changed"
              />

              <FormControl fullWidth disabled={!isEditing}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={(e) => handleInputChange("role", e.target.value)}
                >
                  <MenuItem value="learner">Learner</MenuItem>
                  <MenuItem value="mentor">Mentor</MenuItem>
                  <MenuItem value="both">Both Learner & Mentor</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Bio"
            placeholder="Tell others about yourself, your interests, and what you're passionate about..."
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            disabled={!isEditing}
            sx={{ mb: 3 }}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            <TextField
              label="Location"
              placeholder="e.g., New York, USA"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              disabled={!isEditing}
            />

            <FormControl disabled={!isEditing}>
              <InputLabel>Experience Level</InputLabel>
              <Select
                value={formData.experience}
                label="Experience Level"
                onChange={(e) =>
                  handleInputChange("experience", e.target.value)
                }
              >
                <MenuItem value="beginner">Beginner (0-1 years)</MenuItem>
                <MenuItem value="intermediate">
                  Intermediate (1-3 years)
                </MenuItem>
                <MenuItem value="advanced">Advanced (3-5 years)</MenuItem>
                <MenuItem value="expert">Expert (5+ years)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Skills Section */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 3, display: "flex", alignItems: "center" }}
          >
            <BookOpen size={24} style={{ marginRight: "12px" }} />
            Skills & Expertise
          </Typography>

          {/* Skills I'm Learning */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="primary.main">
                Skills I&apos;m Learning
              </Typography>
              {isEditing && (
                <Button
                  size="small"
                  startIcon={<Plus size={16} />}
                  onClick={() => openSkillDialog("learning")}
                  variant="outlined"
                >
                  Add Skill
                </Button>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                minHeight: 60,
                p: 2,
                border: "1px dashed #ccc",
                borderRadius: 2,
              }}
            >
              <AnimatePresence>
                {formData.skillsLearning.map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Chip
                      label={skill}
                      color="primary"
                      variant="outlined"
                      deleteIcon={isEditing ? <X size={16} /> : undefined}
                      onDelete={
                        isEditing
                          ? () => handleRemoveSkill(skill, "learning")
                          : undefined
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {formData.skillsLearning.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ alignSelf: "center" }}
                >
                  No learning skills added yet.{" "}
                  {isEditing && 'Click "Add Skill" to get started!'}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Skills I Can Teach */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" color="secondary.main">
                Skills I Can Teach
              </Typography>
              {isEditing && (
                <Button
                  size="small"
                  startIcon={<Plus size={16} />}
                  onClick={() => openSkillDialog("teaching")}
                  variant="outlined"
                  color="secondary"
                >
                  Add Skill
                </Button>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                minHeight: 60,
                p: 2,
                border: "1px dashed #ccc",
                borderRadius: 2,
              }}
            >
              <AnimatePresence>
                {formData.skillsTeaching.map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Chip
                      label={skill}
                      color="secondary"
                      variant="outlined"
                      deleteIcon={isEditing ? <X size={16} /> : undefined}
                      onDelete={
                        isEditing
                          ? () => handleRemoveSkill(skill, "teaching")
                          : undefined
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {formData.skillsTeaching.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ alignSelf: "center" }}
                >
                  No teaching skills added yet.{" "}
                  {isEditing && 'Click "Add Skill" to get started!'}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Learning Goals & Availability */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ mb: 3, display: "flex", alignItems: "center" }}
          >
            <Target size={24} style={{ marginRight: "12px" }} />
            Learning Goals & Availability
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Learning Goals"
            placeholder="What do you want to achieve? What are your short-term and long-term learning goals?"
            value={formData.learningGoals}
            onChange={(e) => handleInputChange("learningGoals", e.target.value)}
            disabled={!isEditing}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Availability"
            placeholder="e.g., Weekday evenings, Weekend mornings, Flexible"
            value={formData.availability}
            onChange={(e) => handleInputChange("availability", e.target.value)}
            disabled={!isEditing}
          />
        </Paper>

        {/* Save Button */}
        {isEditing && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={isSaving}
              sx={{
                background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0056CC 0%, #4A0080 100%)",
                },
                px: 4,
                py: 1.5,
              }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        )}

        {/* Skill Selection Dialog */}
        <Dialog
          open={skillDialogOpen}
          onClose={() => setSkillDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Add {skillDialogType === "learning" ? "Learning" : "Teaching"} Skill
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Skill Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Skill Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {Object.keys(skillCategories).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedCategory && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Popular {selectedCategory} Skills:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {skillCategories[
                      selectedCategory as keyof typeof skillCategories
                    ].map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        onClick={() => handleAddSkill(skill, skillDialogType)}
                        sx={{ cursor: "pointer" }}
                        color={
                          (skillDialogType === "learning"
                            ? formData.skillsLearning
                            : formData.skillsTeaching
                          ).includes(skill)
                            ? "primary"
                            : "default"
                        }
                      />
                    ))}
                  </Box>
                </Box>
              )}

              <TextField
                fullWidth
                label="Or add a custom skill"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && customSkill.trim()) {
                    handleAddSkill(customSkill.trim(), skillDialogType);
                    setCustomSkill("");
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSkillDialogOpen(false)}>Close</Button>
            {customSkill.trim() && (
              <Button
                variant="contained"
                onClick={() => {
                  handleAddSkill(customSkill.trim(), skillDialogType);
                  setCustomSkill("");
                }}
              >
                Add &quot;{customSkill}&quot;
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
}
