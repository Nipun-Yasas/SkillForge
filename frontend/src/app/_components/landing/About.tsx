"use client";
import { useEffect } from "react";

import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function About() {
  
  return (
    <Box
    overflow='hidden'
    id='about'
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
        <Box
          sx={{
            position: "absolute",
            backgroundColor: "shapeColor.main",
            borderRadius: "50% 60% 10% 90% / 20% 30% 60% 80%",
            height: 300,
            width: 250,
            top: { xs: "40%", md: "70%" },
            left: { xs: "30%", md: "30%" },
            transform: "translate(-50%, -50%)",
            zIndex: 0,
            opacity: 0.4,
          }}
          aria-hidden="true"
        />

        <Box
          sx={{
            position: "absolute",
            width: 400,
            height: 500,
            backgroundColor: "shapeColor.main",
            borderRadius: "70% 10% 80% 20% / 20% 10% 90% 100%",
            top: { xs: "60%", md: "50%" },
            left: { xs: "60%", md: "50%" },
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        />

        <Image
          src="/student.svg"
          alt="Hero illustration"
          width={300}
          height={300}
          priority
          style={{
            position: "relative",
            zIndex: 2,
          }}
        />
      </Box>

      <Box
  sx={{
    width: { xs: "100%", md: "50%" },
    position: "relative",
    textAlign: { xs: "center", md: "left" },
    p: 2.5,
    zIndex: 2,
  }}
>
  {/* Background Shape */}
  <Box
    sx={{
      position: "absolute",
      backgroundColor: "shapeColor.main",
      borderRadius: "50%",
      height: 300,
      width: 400,
      top: { xs: '30%', md: '10%' },
      left: { xs: "50%", md: "50%" },
      transform: "translate(-50%, 0)",
      zIndex: 0,
      opacity: 0.5,
    }}
    aria-hidden="true"
  />

  {/* Foreground Text Content */}
  <Box sx={{ position: "relative", zIndex: 1 }}>
    <Typography variant="body1" mt={4} sx={{ fontSize: "1.5rem" }}>
      About Us
    </Typography>
    <Typography
      variant="h4"
      fontWeight="bold"
      mt={4}
      sx={{ fontSize: { xs: "2rem", md: "2rem" } }}
    >
      Empowering Students Through Peer-to-Peer Learning
    </Typography>
    <Typography mt={3} fontSize="1.125rem" lineHeight={1.75}>
      At SkillForge, we believe that learning is most effective when it's shared.
      Our platform connects university students who want to learn new skills with
      peers who already master those skills...
    </Typography>
    <Button variant="contained" size="large" sx={{ mt: 2 }}>
      Join Now
    </Button>
  </Box>
</Box>

    </Box>
  );
}
