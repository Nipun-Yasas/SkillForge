import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { BookOpen, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <Box
      sx={{
        display: "flex",
        overflowX: "hidden",
        flexDirection: { xs: "column-reverse", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        py: { xs: 0, md: 2 },
        mt: { xs: -7, md: 0 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          backgroundColor: "shapeColor.main",
          borderRadius: "50%",
          height: 400,
          width: 500,
          top: { xs: 400, md: 120 },
          left: { xs: "-30%", md: -87 },
          zIndex: 0,
          opacity: 0.5,
        }}
        aria-hidden="true"
      />
      {/* Text content*/}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          textAlign: { xs: "center", md: "left" },
          position: "relative",
          zIndex: 2,
          p: 2.5,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
              mb: 2,
            }}
          >
            Master Skills.
            <br />
            Teach Others.
            <br />
            <Box component="span" sx={{ color: "#FF7A00" }}>
              Forge Your Future.
            </Box>
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mt: 3,
              mb: 4,
              fontWeight: 400,
              maxWidth: "500px",
            }}
          >
            Connect with peer mentors, exchange skills, and accelerate your
            learning journey through AI-powered matching and hands-on
            experience.
          </Typography>

          {/* Feature highlights */}
          <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Users size={20} color="#007BFF" />
              <Typography variant="body2" color="text.secondary">
                Smart Mentor Matching
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <BookOpen size={20} color="#6A0DAD" />
              <Typography variant="body2" color="text.secondary">
                Skill Exchange Platform
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Zap size={20} color="#FF7A00" />
              <Typography variant="body2" color="text.secondary">
                Learn by Teaching
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Link href="/signup" passHref>
              <Button
                variant="contained"
                size="large"
                sx={{
                  background:
                    "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #0056CC 0%, #4A0080 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0, 123, 255, 0.3)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Start Learning Today
              </Button>
            </Link>
            <Link href="/findmentor" passHref>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "#007BFF",
                  color: "#007BFF",
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1.1rem",
                  "&:hover": {
                    borderColor: "#6A0DAD",
                    color: "#6A0DAD",
                    backgroundColor: "rgba(106, 13, 173, 0.05)",
                  },
                }}
              >
                Find a Mentor
              </Button>
            </Link>
          </Box>
        </motion.div>
      </Box>
      {/* Image content */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          mt: { xs: 4, md: 0 },
        }}
      >
        {/* Animated background shapes */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            backgroundColor: "#6A0DAD",
            borderRadius: "50% 60% 10% 90% / 20% 30% 60% 80%",
            height: 300,
            width: 300,
            left: "20%",
            top: "60%",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            opacity: 0.1,
          }}
        />

        <motion.div
          animate={{
            rotate: -360,
            y: [0, -20, 0],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            backgroundColor: "#FF7A00",
            borderRadius: "70% 10% 80% 20% / 20% 10% 90% 100%",
            top: "30%",
            left: "70%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            opacity: 0.15,
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <Image
            src="/person.svg"
            alt="SkillForge - Peer-to-peer learning platform"
            width={400}
            height={400}
            priority
            style={{
              height: "auto",
              width: "100%",
              maxWidth: "450px",
              filter: "drop-shadow(0 10px 30px rgba(0, 123, 255, 0.2))",
            }}
          />
        </motion.div>
      </Box>
    </Box>
  );
}
