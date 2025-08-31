"use client";

import { useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import { useTheme, alpha } from "@mui/material/styles";

import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const theme = useTheme();
  const footerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const element = footerRef.current;
    gsap.set(element, { opacity: 0, y: 40 });

    const st = ScrollTrigger.create({
      trigger: element,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  const bgLeft = theme.palette.primary.main;
  const bgRight = theme.palette.primary.dark;
  const contrast = theme.palette.getContrastText(theme.palette.primary.main);

  return (
    <Box
      ref={footerRef}
      component="footer"
      role="contentinfo"
      sx={{
        mt: { xs: 2, md: 2 },
        color: contrast,
        background: `linear-gradient(135deg, ${bgLeft} 0%, ${bgRight} 100%)`,
        borderTop: `1px solid ${alpha("#fff", 0.12)}`,
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 2 } }}>
        <Grid container spacing={6} alignItems="flex-start">
          {/* Brand + Contact */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
              Byway
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
              Learn, mentor, and grow together.
            </Typography>

            <Typography variant="h6" sx={{ mb: 1 }}>
              Contact
            </Typography>
            <Box
              component="address"
              sx={{ fontStyle: "normal", opacity: 0.95 }}
            >
              <Typography variant="body2">2972 Westheimer Rd.</Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Santa Ana, Illinois 85486
              </Typography>
              <Link
                href="mailto:support@byway.com"
                color="inherit"
                underline="hover"
                variant="body2"
                sx={{ display: "inline-block", mr: 2 }}
              >
                support@byway.com
              </Link>
              <Link
                href="tel:+11234567890"
                color="inherit"
                underline="hover"
                variant="body2"
                sx={{ display: "inline-block" }}
              >
                +1 (123) 456-7890
              </Link>
            </Box>

            <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
              <IconButton
                aria-label="Twitter"
                component="a"
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: contrast, opacity: 0.9 }}
                size="small"
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="LinkedIn"
                component="a"
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: contrast, opacity: 0.9 }}
                size="small"
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="GitHub"
                component="a"
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: contrast, opacity: 0.9 }}
                size="small"
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Company */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Company
            </Typography>
            <Box component="nav" aria-label="Company">
              <Box
                component="ul"
                sx={{
                  m: 0,
                  p: 0,
                  listStyle: "none",
                  display: "grid",
                  gap: 1.5,
                }}
              >
                <Box component="li">
                  <Link
                    component={Link}
                    href="#about"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    About
                  </Link>
                </Box>
                <Box component="li">
                  <Link
                    component={Link}
                    href="#teach"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    Teach on Byway
                  </Link>
                </Box>
                <Box component="li">
                  <Link
                    component={Link}
                    href="#blog"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    Blog
                  </Link>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Support */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Support
            </Typography>
            <Box component="nav" aria-label="Support">
              <Box
                component="ul"
                sx={{
                  m: 0,
                  p: 0,
                  listStyle: "none",
                  display: "grid",
                  gap: 1.5,
                }}
              >
                <Box component="li">
                  <Link
                    component={Link}
                    href="#help"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    Help and Support
                  </Link>
                </Box>
                <Box component="li">
                  <Link
                    component={Link}
                    href="#terms"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    Terms
                  </Link>
                </Box>
                <Box component="li">
                  <Link
                    component={Link}
                    href="#privacy"
                    color="inherit"
                    underline="hover"
                    variant="body2"
                  >
                    Privacy Policy
                  </Link>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom bar */}
        <Box
          sx={{
            mt: { xs: 5, md: 7 },
            pt: 3,
            borderTop: `1px solid ${alpha("#fff", 0.15)}`,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            © {new Date().getFullYear()} Byway. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link
              component={Link}
              href="#privacy"
              color="inherit"
              underline="hover"
              variant="body2"
            >
              Privacy
            </Link>
            <Link
              component={Link}
              href="#terms"
              color="inherit"
              underline="hover"
              variant="body2"
            >
              Terms
            </Link>
            <Link
              component={Link}
              href="#contact"
              color="inherit"
              underline="hover"
              variant="body2"
            >
              Contact
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
