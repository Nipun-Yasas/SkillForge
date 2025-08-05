"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { motion } from "framer-motion";
import {
  BookOpen,
  Eye,
  EyeOff,
  LogIn,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import BackgroundShape from "../_components/background/BackgroundShape";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const success = await login(formData.email.trim(), formData.password);

      if (success) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stats = [
    { icon: Users, value: "10K+", label: "Active Learners" },
    { icon: Award, value: "500+", label: "Expert Mentors" },
    { icon: TrendingUp, value: "95%", label: "Success Rate" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      {/* Animated Background Shapes */}
      <BackgroundShape
        className="shape1"
        color="#007BFF"
        opacity="0.1"
        width={400}
        height={400}
        cx={200}
        cy={200}
        rx={180}
        ry={200}
      />
      <BackgroundShape
        className="shape2"
        color="#6A0DAD"
        opacity="0.15"
        width={600}
        height={300}
        cx={300}
        cy={150}
        rx={250}
        ry={120}
      />
      <BackgroundShape
        className="shape3"
        color="#FF6B6B"
        opacity="0.08"
        width={350}
        height={350}
        cx={175}
        cy={175}
        rx={150}
        ry={170}
      />

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          top: "10%",
          right: "15%",
          zIndex: 1,
        }}
      >
        <Box
          color="textblack.main"
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Sparkles size={32} />
        </Box>
      </motion.div>

      <motion.div
        animate={{
          y: [20, -20, 20],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          zIndex: 1,
        }}
      >
        <Box
          color="textblack.main"
          sx={{
            width: 60,
            height: 60,
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BookOpen size={24} />
        </Box>
      </motion.div>

      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: 6,
              alignItems: "center",
              minHeight: "80vh",
            }}
          >
            {/* Left Side - Welcome Content */}
            {!isMobile && (
              <motion.div variants={itemVariants}>
                <Box sx={{ pr: 4 }}>
                  {/* Logo */}
                  <Link href="/" style={{ textDecoration: "none" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 4,
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                          backdropFilter: "blur(10px)",
                          width: 48,
                          height: 48,
                        }}
                      >
                        <BookOpen size={24} />
                      </Avatar>
                      <Typography
                        variant="h4"
                        color="textblack.main"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        SkillForge
                      </Typography>
                    </Box>
                  </Link>

                  {/* Hero Content */}
                  <Typography
                    variant="h2"
                    color="textblack.main"
                    sx={{
                      fontWeight: 800,
                      mb: 3,
                      fontSize: { xs: "2rem", md: "3rem" },
                    }}
                  >
                    Welcome Back to
                    <Box
                      component="span"
                      sx={{ display: "block", color: "#FFD700" }}
                    >
                      Your Learning Journey
                    </Box>
                  </Typography>

                  <Typography
                    variant="h6"
                    color="textblack.main"
                    sx={{
                      mb: 4,
                      opacity: 0.9,
                      lineHeight: 1.6,
                      maxWidth: "500px",
                    }}
                  >
                    Connect with expert mentors, join vibrant communities, and
                    unlock your potential with AI-powered learning experiences.
                  </Typography>

                  {/* Stats */}
                  <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Box
                          color="textblack.main"
                          sx={{
                            textAlign: "center",
                            p: 2,
                            borderRadius: 2,
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                          }}
                        >
                          <stat.icon
                            size={24}
                            style={{ marginBottom: "8px" }}
                          />
                          <Typography
                            variant="h6"
                            color="textblack.main"
                            fontWeight="bold"
                          >
                            {stat.value}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="textblack.main"
                            sx={{ opacity: 0.8 }}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>

                  {/* Features */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {[
                      "AI-Powered Mentor Matching",
                      "Real-time Chat & Collaboration",
                      "Progress Tracking & Analytics",
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        variants={itemVariants}
                        whileHover={{ x: 10 }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              bgcolor: "#FFD700",
                            }}
                          />
                          <Typography
                            variant="body1"
                            color="textblack.main"
                            sx={{ opacity: 0.9 }}
                          >
                            {feature}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </motion.div>
            )}

            {/* Right Side - Login Form */}
            <motion.div variants={itemVariants}>
              <Paper
                elevation={0}
                color="backgroundcolor.primary"
                sx={{
                  p: isMobile ? 3 : 4,
                  borderRadius: 4,
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Form Header */}
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  {isMobile && (
                    <Link href="/" style={{ textDecoration: "none" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 1,
                          mb: 3,
                        }}
                      >
                        <BookOpen size={28} color="#007BFF" />
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            background:
                              "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          SkillForge
                        </Typography>
                      </Box>
                    </Link>
                  )}

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        p: 2,
                        borderRadius: "50%",
                        background:
                          "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                        mb: 2,
                        position: "relative",
                      }}
                    >
                      <LogIn size={32} color="white" />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                          position: "absolute",
                          inset: -8,
                          borderRadius: "50%",
                          border: "2px solid rgba(0, 123, 255, 0.3)",
                        }}
                      />
                    </Box>
                  </motion.div>

                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                      background:
                        "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      mb: 1,
                    }}
                  >
                    Welcome Back!
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                    Sign in to continue your learning adventure
                  </Typography>

                  {/* Status Chip */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Chip
                      icon={<Sparkles size={16} />}
                      label="AI-Enhanced Learning Platform"
                      variant="outlined"
                      size="small"
                      sx={{
                        mt: 2,
                        borderColor: "primary.main",
                        color: "primary.main",
                        "& .MuiChip-icon": { color: "primary.main" },
                      }}
                    />
                  </motion.div>
                </Box>

                {/* Login Form */}
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ width: "100%" }}
                >
                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      sx={{ mb: 3 }}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={20} color="#666" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      sx={{ mb: 4 }}
                      disabled={isLoading}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock size={20} color="#666" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      sx={{
                        background:
                          "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                        py: 1.8,
                        borderRadius: 3,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        mb: 3,
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #0056CC 0%, #4A0080 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 15px 35px rgba(0, 123, 255, 0.4)",
                        },
                        "&:disabled": {
                          background: "rgba(0, 123, 255, 0.3)",
                        },
                        transition: "all 0.3s ease",
                      }}
                    >
                      {isLoading ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <CircularProgress size={24} color="inherit" />
                          <Typography>Signing In...</Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 2 }}
                        >
                          <Typography>Sign In</Typography>
                          <ArrowRight size={20} />
                        </Box>
                      )}
                    </Button>
                  </motion.div>

                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      New to SkillForge?
                    </Typography>
                  </Divider>

                  <motion.div variants={itemVariants}>
                    <Link
                      href="/signup"
                      passHref
                      style={{ textDecoration: "none" }}
                    >
                      <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        sx={{
                          borderColor: "primary.main",
                          color: "primary.main",
                          py: 1.8,
                          borderRadius: 3,
                          fontSize: "1.1rem",
                          fontWeight: 600,
                          borderWidth: 2,
                          "&:hover": {
                            borderColor: "secondary.main",
                            color: "secondary.main",
                            backgroundColor: "rgba(106, 13, 173, 0.05)",
                            borderWidth: 2,
                            transform: "translateY(-1px)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Create New Account
                      </Button>
                    </Link>
                  </motion.div>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </motion.div>
      </Container>

      {/* Additional floating elements */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: "60%",
          right: "5%",
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "8px",
            background: "rgba(255, 215, 0, 0.2)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 215, 0, 0.3)",
          }}
        />
      </motion.div>

      {/* CSS for shape animations */}
      <style jsx global>{`
        .shape1 {
          animation: float1 8s ease-in-out infinite;
        }
        .shape2 {
          animation: float2 10s ease-in-out infinite;
        }
        .shape3 {
          animation: float3 12s ease-in-out infinite;
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-40px, -20px) rotate(180deg);
          }
        }

        @keyframes float3 {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(20px, -40px) rotate(90deg);
          }
          50% {
            transform: translate(-30px, -20px) rotate(180deg);
          }
          75% {
            transform: translate(-10px, 30px) rotate(270deg);
          }
        }
      `}</style>
    </Box>
  );
}
