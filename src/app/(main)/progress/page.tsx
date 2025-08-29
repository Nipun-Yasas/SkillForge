"use client";

import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Target,
  Award,
  Clock,
  Calendar,
  CheckCircle,
  Trophy,
  Star,
  BarChart3,
} from "lucide-react";
import theme from "@/theme";

interface SkillProgress {
  name: string;
  level: number;
  maxLevel: number;
  progress: number;
  category: string;
  xp: number;
  nextLevelXP: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  targetDate: string;
  category: string;
  completed: boolean;
}

const skillsData: SkillProgress[] = [
  {
    name: "JavaScript",
    level: 3,
    maxLevel: 5,
    progress: 75,
    category: "Programming",
    xp: 1250,
    nextLevelXP: 1500,
  },
  {
    name: "React",
    level: 2,
    maxLevel: 5,
    progress: 60,
    category: "Frontend",
    xp: 800,
    nextLevelXP: 1000,
  },
  {
    name: "UI/UX Design",
    level: 2,
    maxLevel: 5,
    progress: 45,
    category: "Design",
    xp: 450,
    nextLevelXP: 1000,
  },
  {
    name: "Python",
    level: 1,
    maxLevel: 5,
    progress: 30,
    category: "Programming",
    xp: 300,
    nextLevelXP: 500,
  },
];

const achievements: Achievement[] = [
  {
    id: "1",
    title: "First Steps",
    description: "Complete your first course",
    icon: "🎯",
    earned: true,
    earnedDate: "2024-01-15",
    rarity: "common",
  },
  {
    id: "2",
    title: "JavaScript Master",
    description: "Reach level 3 in JavaScript",
    icon: "⚡",
    earned: true,
    earnedDate: "2024-01-20",
    rarity: "rare",
  },
  {
    id: "3",
    title: "Consistent Learner",
    description: "Study for 7 days in a row",
    icon: "🔥",
    earned: true,
    earnedDate: "2024-01-18",
    rarity: "epic",
  },
  {
    id: "4",
    title: "Mentor Helper",
    description: "Help 10 other learners",
    icon: "🤝",
    earned: false,
    rarity: "legendary",
  },
  {
    id: "5",
    title: "Full Stack",
    description: "Learn both frontend and backend",
    icon: "🚀",
    earned: false,
    rarity: "epic",
  },
];

const learningGoals: LearningGoal[] = [
  {
    id: "1",
    title: "Master React Hooks",
    description: "Complete advanced React course and build 3 projects",
    progress: 65,
    targetDate: "2024-02-15",
    category: "Frontend",
    completed: false,
  },
  {
    id: "2",
    title: "Learn Python Basics",
    description: "Understand Python fundamentals and syntax",
    progress: 30,
    targetDate: "2024-03-01",
    category: "Programming",
    completed: false,
  },
  {
    id: "3",
    title: "Design System Creation",
    description: "Create a comprehensive design system",
    progress: 100,
    targetDate: "2024-01-30",
    category: "Design",
    completed: true,
  },
];

const weeklyStats = [
  { day: "Mon", hours: 2.5, completed: true },
  { day: "Tue", hours: 1.8, completed: true },
  { day: "Wed", hours: 3.2, completed: true },
  { day: "Thu", hours: 2.1, completed: true },
  { day: "Fri", hours: 2.8, completed: true },
  { day: "Sat", hours: 4.5, completed: true },
  { day: "Sun", hours: 1.2, completed: false },
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common":
      return "#28a745";
    case "rare":
      return "#007BFF";
    case "epic":
      return "#6A0DAD";
    case "legendary":
      return "#FF7A00";
    default:
      return "#666";
  }
};

export default function ProgressPage() {
  const [activeTab, setActiveTab] = useState(0);

  const totalXP = skillsData.reduce((sum, skill) => sum + skill.xp, 0);
  const completedGoals = learningGoals.filter((goal) => goal.completed).length;
  const earnedAchievements = achievements.filter(
    (achievement) => achievement.earned
  ).length;
  const weeklyHours = weeklyStats.reduce((sum, day) => sum + day.hours, 0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
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
          <Typography variant="h6" color="text.secondary">
            Track your learning journey and celebrate your achievements
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Box
          sx={{
            mb: 4,
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            gap: 2,
          }}
        >
          <Paper
            elevation={10}
            sx={{
              p: 3,
              textAlign: "center",
              background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
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
            <TrendingUp size={32} color="#007BFF" />
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#007BFF"
              sx={{ mt: 1 }}
            >
              {totalXP.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="black">
              Total XP
            </Typography>
          </Paper>

          <Paper
            elevation={10}
            sx={{
              p: 3,
              textAlign: "center",
              background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
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
            <Target size={32} color="#6A0DAD" />
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#6A0DAD"
              sx={{ mt: 1 }}
            >
              {completedGoals}/{learningGoals.length}
            </Typography>
            <Typography variant="body2" color="black">
              Goals Achieved
            </Typography>
          </Paper>

          <Paper
            elevation={10}
            sx={{
              p: 3,
              textAlign: "center",
              background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
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
            <Award size={32} color="#FF7A00" />
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#FF7A00"
              sx={{ mt: 1 }}
            >
              {earnedAchievements}
            </Typography>
            <Typography variant="body2" color="black">
              Achievements
            </Typography>
          </Paper>

          <Paper
            elevation={10}
            sx={{
              p: 3,
              textAlign: "center",
              background: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)",
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
            <Clock size={32} color="#28a745" />
            <Typography
              variant="h4"
              fontWeight="bold"
              color="#28a745"
              sx={{ mt: 1 }}
            >
              {weeklyHours.toFixed(1)}h
            </Typography>
            <Typography variant="body2" color="black">
              This Week
            </Typography>
          </Paper>
        </Box>

        {/* Tabs */}
        <Paper
          elevation={10}
          sx={{
            p: 2,
            textAlign: "center",
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
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                fontWeight: 600,
                textTransform: "none",
              },
            }}
          >
            <Tab
              label="Skills Progress"
              icon={<BarChart3 size={20} />}
              iconPosition="start"
            />
            <Tab
              label="Achievements"
              icon={<Trophy size={20} />}
              iconPosition="start"
            />
            <Tab
              label="Learning Goals"
              icon={<Target size={20} />}
              iconPosition="start"
            />
            <Tab
              label="Weekly Activity"
              icon={<Calendar size={20} />}
              iconPosition="start"
            />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {/* Skills Progress Tab */}
            {activeTab === 0 && (
              <Box sx={{ display: "grid", gap: 3 }}>
                {skillsData.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                          }}
                        >
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              {skill.name}
                            </Typography>
                            <Chip
                              label={skill.category}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                          <Box sx={{ textAlign: "right" }}>
                            <Typography
                              variant="h6"
                              fontWeight="bold"
                              color="primary.main"
                            >
                              Level {skill.level}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {skill.xp} / {skill.nextLevelXP} XP
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              Progress to Level {skill.level + 1}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {skill.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={skill.progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              "& .MuiLinearProgress-bar": {
                                background:
                                  "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                              },
                            }}
                          />
                        </Box>

                        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                          {Array.from({ length: skill.maxLevel }, (_, i) => (
                            <Star
                              key={i}
                              size={20}
                              fill={i < skill.level ? "#FFD700" : "none"}
                              color={i < skill.level ? "#FFD700" : "#ddd"}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            )}

            {/* Achievements Tab */}
            {activeTab === 1 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 3,
                        opacity: achievement.earned ? 1 : 0.6,
                        border: achievement.earned
                          ? `2px solid ${getRarityColor(achievement.rarity)}`
                          : "2px solid #ddd",
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      <CardContent sx={{ textAlign: "center", p: 3 }}>
                        <Box
                          sx={{
                            fontSize: "3rem",
                            mb: 2,
                            filter: achievement.earned
                              ? "none"
                              : "grayscale(100%)",
                          }}
                        >
                          {achievement.icon}
                        </Box>

                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ mb: 1 }}
                        >
                          {achievement.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {achievement.description}
                        </Typography>

                        <Chip
                          label={achievement.rarity.toUpperCase()}
                          size="small"
                          sx={{
                            background: getRarityColor(achievement.rarity),
                            color: "white",
                            fontWeight: "bold",
                            mb: 2,
                          }}
                        />

                        {achievement.earned && achievement.earnedDate && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 1,
                            }}
                          >
                            <CheckCircle size={16} color="#28a745" />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Earned{" "}
                              {new Date(
                                achievement.earnedDate
                              ).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            )}

            {/* Learning Goals Tab */}
            {activeTab === 2 && (
              <Box sx={{ display: "grid", gap: 3 }}>
                {learningGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 3,
                        opacity: goal.completed ? 0.8 : 1,
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            mb: 2,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <Typography variant="h6" fontWeight="bold">
                                {goal.title}
                              </Typography>
                              {goal.completed && (
                                <CheckCircle size={20} color="#28a745" />
                              )}
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                            >
                              {goal.description}
                            </Typography>
                            <Chip
                              label={goal.category}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          </Box>

                          <Box sx={{ textAlign: "right", ml: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Target:{" "}
                              {new Date(goal.targetDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
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
                              {goal.progress}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={goal.progress}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              "& .MuiLinearProgress-bar": {
                                background: goal.completed
                                  ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
                                  : "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                              },
                            }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            )}

            {/* Weekly Activity Tab */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  This Week&apos;s Learning Activity
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: 2,
                    mb: 4,
                  }}
                >
                  {weeklyStats.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: "center",
                          borderRadius: 2,
                          background: day.completed
                            ? "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)"
                            : "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
                          border: day.completed
                            ? "2px solid #28a745"
                            : "2px solid #FF7A00",
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{ mb: 1 }}
                        >
                          {day.day}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color={day.completed ? "#28a745" : "#FF7A00"}
                        >
                          {day.hours}h
                        </Typography>
                        {day.completed && (
                          <CheckCircle
                            size={16}
                            color="#28a745"
                            style={{ marginTop: "4px" }}
                          />
                        )}
                      </Paper>
                    </motion.div>
                  ))}
                </Box>

                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                      Learning Streak
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #FF7A00 0%, #FF9F40 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color="white"
                        >
                          🔥
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="h4"
                          fontWeight="bold"
                          color="#FF7A00"
                        >
                          5 days
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Keep it up! You&apos;re on fire!
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
}
