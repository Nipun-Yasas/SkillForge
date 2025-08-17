"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  MessageCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { Helix } from "ldrs/react";
import "ldrs/react/Helix.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "courses":
        // TODO: Navigate to courses page
        break;
      case "mentors":
        router.push("/findmentor");
        break;
      case "messages":
        router.push("/chat");
        break;
      case "progress":
        // TODO: Navigate to progress page
        break;
      default:
        break;
    }
  };

  const handleGetStarted = () => {
    router.push("/profile");
  };

  if (isLoading) {
    return (
      <Helix size="45" speed="2.5" color="#007BFF" />
    );
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
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
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
            Welcome back, {user.name.split(" ")[0]}! 👋
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Ready to continue your learning journey?
          </Typography>
        </Box>

        {/* Profile Summary */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: "1px solid rgba(0, 123, 255, 0.1)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
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
              ></Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {user.name}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {user.email}
                </Typography>
                <Chip
                  label={
                    user.role === "both"
                      ? "Learner & Mentor"
                      : user.role.charAt(0).toUpperCase() + user.role.slice(1)
                  }
                  sx={{
                    background:
                      "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
            <Button
              variant="outlined"
              size="small"
              onClick={() => router.push("/profile")}
              sx={{ mt: 1 }}
            >
              Edit Profile
            </Button>
          </Box>

          {/* Skills Summary */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                Skills I&apos;m Learning
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {user.skills.learning.length > 0 ? (
                  user.skills.learning.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="outlined"
                      color="primary"
                      size="small"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No learning skills added yet
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                Skills I Can Teach
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {user.skills.teaching.length > 0 ? (
                  user.skills.teaching.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="outlined"
                      color="secondary"
                      size="small"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No teaching skills added yet
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Quick Actions */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 4,
          }}
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Paper
              onClick={() => handleQuickAction("courses")}
              sx={{
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 3,
                "&:hover": {
                  boxShadow: "0 8px 25px rgba(0, 123, 255, 0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <BookOpen size={40} color="#007BFF" />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mt: 1, mb: 0.5 }}
              >
                Find Courses
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Discover new skills to learn
              </Typography>
            </Paper>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Paper
              onClick={() => handleQuickAction("mentors")}
              sx={{
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 3,
                "&:hover": {
                  boxShadow: "0 8px 25px rgba(106, 13, 173, 0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Users size={40} color="#6A0DAD" />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mt: 1, mb: 0.5 }}
              >
                Find Mentors
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect with peers
              </Typography>
            </Paper>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Paper
              onClick={() => handleQuickAction("messages")}
              sx={{
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 3,
                "&:hover": {
                  boxShadow: "0 8px 25px rgba(255, 122, 0, 0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <MessageCircle size={40} color="#FF7A00" />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mt: 1, mb: 0.5 }}
              >
                Messages
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Chat with your connections
              </Typography>
            </Paper>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Paper
              onClick={() => handleQuickAction("progress")}
              sx={{
                p: 3,
                textAlign: "center",
                cursor: "pointer",
                borderRadius: 3,
                "&:hover": {
                  boxShadow: "0 8px 25px rgba(40, 167, 69, 0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Award size={40} color="#28a745" />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ mt: 1, mb: 0.5 }}
              >
                Progress
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Track your achievements
              </Typography>
            </Paper>
          </motion.div>
        </Box>

        {/* Recent Activity */}
        <Paper
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid rgba(0, 123, 255, 0.1)",
          }}
        >
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
            Recent Activity
          </Typography>

          <Box sx={{ textAlign: "center", py: 4 }}>
            <TrendingUp size={60} color="#ccc" />
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mt: 2, mb: 1 }}
            >
              No recent activity
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start connecting with mentors and learners to see your activity
              here
            </Typography>
            <Button
              variant="contained"
              onClick={handleGetStarted}
              sx={{
                background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #0056CC 0%, #4A0080 100%)",
                },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
}
