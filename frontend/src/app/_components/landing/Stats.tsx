"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CountUp from "react-countup";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, BookOpen, Star, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const activeLearners = 2847;
const skillsExchanged = 1250;
const mentorMatches = 987;
const averageRating = 4.8;

interface StatItemProps {
  icon: React.ReactNode;
  number: number;
  text: string;
  suffix?: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, number, text, suffix = "+" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
  >
    <Box
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        p: 3,
        borderRadius: 3,
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 123, 255, 0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 30px rgba(0, 123, 255, 0.2)",
          background: "rgba(255, 255, 255, 0.95)"
        }
      }}
    >
      <Box
        sx={{
          p: 2,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ 
          fontSize: { xs: "2rem", md: "2.5rem" },
          background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1
        }}
      >
        <CountUp end={number} duration={2.5} separator="," />{suffix}
      </Typography>
      <Typography
        variant="body1"
        sx={{ 
          fontSize: { xs: "0.9rem", md: "1rem" },
          color: "text.secondary",
          fontWeight: 500
        }}
      >
        {text}
      </Typography>
    </Box>
  </motion.div>
);

export default function Stats() {
  const statsRef = useRef(null);

  useEffect(() => {
    if (!statsRef.current) return;

    const element = statsRef.current;

    const ctx = gsap.context(() => {
      const anim = gsap.fromTo(
        element,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
        }
      );

      ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse",
        animation: anim,
        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(element, {
            opacity: 0,
            y: -100,
            duration: 1,
            ease: "power3.out",
          });
        },
        onLeave: () => {
          gsap.to(element, {
            opacity: 0,
            y: 100,
            duration: 1,
            ease: "power3.out",
          });
        },
        onEnterBack: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          });
        },
      });
    }, statsRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={statsRef}
      width="100%"
      id="stats"
      sx={{
        background: "linear-gradient(135deg, #f8fbff 0%, #e3f2fd 100%)",
        px: { xs: 2, md: 4 },
        py: { xs: 6, md: 8 },
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
          borderRadius: "50%",
          opacity: 0.05,
          zIndex: 0
        }}
      />
      
      <Box
        sx={{
          position: "absolute",
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          background: "linear-gradient(135deg, #FF7A00 0%, #6A0DAD 100%)",
          borderRadius: "50%",
          opacity: 0.05,
          zIndex: 0
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "2.5rem", md: "3rem" },
              fontWeight: 700,
              background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2
            }}
          >
            Growing Together
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Join thousands of learners and mentors who are already transforming their skills through SkillForge
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { 
              xs: "1fr", 
              sm: "repeat(2, 1fr)", 
              md: "repeat(4, 1fr)" 
            },
            gap: 4,
            maxWidth: 1200,
            mx: "auto"
          }}
        >
          <StatItem
            icon={<Users size={32} color="white" />}
            number={activeLearners}
            text="Active Learners"
          />
          <StatItem
            icon={<BookOpen size={32} color="white" />}
            number={skillsExchanged}
            text="Skills Exchanged"
          />
          <StatItem
            icon={<MessageCircle size={32} color="white" />}
            number={mentorMatches}
            text="Successful Matches"
          />
          <StatItem
            icon={<Star size={32} color="white" />}
            number={averageRating}
            text="Average Rating"
            suffix="★"
          />
        </Box>
      </Box>
    </Box>
  );
}
