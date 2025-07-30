"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Target, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const aboutRef = useRef(null);

  useEffect(() => {
    if (!aboutRef.current) return;

    const ctx = gsap.context(() => {
      const element = aboutRef.current;

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
        onLeave: () => {
          gsap.to(element, {
            opacity: 0,
            y: 100,
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
        onEnterBack: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          });
        },
      });
    }, aboutRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={aboutRef}
      id="about"
      overflow="hidden"
      width="100%"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        py: { xs: 5, md: 10 },
      }}
    >
      {/* Left Side: Illustration */}
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
            height: 250,
            width: 200,
            top: "60%",
            left: "30%",
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
            width: 300,
            height: 400,
            backgroundColor: "#FF7A00",
            borderRadius: "70% 10% 80% 20% / 20% 10% 90% 100%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
            opacity: 0.08,
          }}
        />

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <Image
            src="/Student.svg"
            alt="SkillForge - Students learning together"
            width={400}
            height={400}
            priority
            style={{
              height: "auto",
              width: "100%",
              maxWidth: "450px",
              filter: "drop-shadow(0 10px 30px rgba(106, 13, 173, 0.2))",
            }}
          />
        </motion.div>
      </Box>

      {/* Right Side: Text */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          position: "relative",
          textAlign: { xs: "center", md: "left" },
          p: 2.5,
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "shapeColor.main",
            borderRadius: "50%",
            height: 300,
            width: 400,
            top: { xs: "30%", md: "10%" },
            left: { xs: "50%", md: "50%" },
            transform: "translate(-50%, 0)",
            zIndex: 0,
            opacity: 0.5,
          }}
          aria-hidden="true"
        />
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: 2,
              }}
            >
              ABOUT SKILLFORGE
            </Typography>

            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "2.5rem", md: "3rem" },
                mt: 2,
                mb: 3,
                background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.2,
              }}
            >
              Empowering Learning Through Peer Connection
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                lineHeight: 1.6,
                mb: 4,
                fontWeight: 400,
              }}
            >
              SkillForge revolutionizes education by connecting learners with
              peer mentors through AI-powered matching. Whether you&apos;re
              mastering coding, learning design, or exploring new languages, our
              platform creates meaningful connections that accelerate growth.
            </Typography>

            {/* Key Features */}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 123, 255, 0.1)",
                  }}
                >
                  <Target size={24} color="#007BFF" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Smart Matching
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    AI-powered algorithm matches you with perfect mentors
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "50%",
                    backgroundColor: "rgba(106, 13, 173, 0.1)",
                  }}
                >
                  <Users size={24} color="#6A0DAD" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Peer-to-Peer Learning
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Learn from students who understand your journey
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 122, 0, 0.1)",
                  }}
                >
                  <Zap size={24} color="#FF7A00" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Skill Exchange
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Teach what you know, learn what you need
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Link href="/signup" passHref style={{ textDecoration: "none" }}>
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
                Start Your Journey
              </Button>
            </Link>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
