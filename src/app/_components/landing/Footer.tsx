"use client";

import { useRef, useEffect } from "react";

import Link from "next/link";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import useMediaQuery from "@mui/material/useMediaQuery";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const isMobile = useMediaQuery("md");

  const footerRef = useRef(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      const element = footerRef.current;

      gsap.set(element, { opacity: 0, y: 100 });

      ScrollTrigger.create({
        trigger: element,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play reverse play reverse",
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
        onEnterBack: () => {
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
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <Box
      ref={footerRef}
      id="contact"
      component="footer"
      sx={{
        px: { xs: 2, md: 5 },
        pt: { xs: 5, md: 5 },
        pb: { xs: 5, md: 5 },
        width: "100%",
        backgroundColor: "#0056CC",
      }}
    >
      <Grid container spacing={5} direction={isMobile ? "column" : "row"}>
        <Box>
          <Typography variant="h6">Contact</Typography>
          <Typography
            component="address"
            sx={{ mt: 4, fontStyle: "normal" }}
            variant="body1"
          >
            2972 Westheimer Rd. Santa Ana, Illinois 85486
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6">Company</Typography>
          <Box mt={3} display="flex" flexDirection="column" gap={2}>
            <Link href="#about">
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                }}
              >
                About
              </Typography>
            </Link>
            <Link href="#about">
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                }}
              >
                Teach on Byway
              </Typography>
            </Link>
            <Link href="#about">
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                }}
              >
                Blog
              </Typography>
            </Link>
          </Box>
        </Box>

        <Box>
          <Typography variant="h6">Support</Typography>
          <Box mt={3} display="flex" flexDirection="column" gap={2}>
            <Link href="#about">
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                }}
              >
                Help and Support
              </Typography>
            </Link>
            <Link href="#about">
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                }}
              >
                Terms
              </Typography>
            </Link>
            <Link href="#about">
              <Typography
                variant="body1"
                sx={{
                  color: "text.primary",
                }}
              >
                Privacy Policy
              </Typography>
            </Link>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}
