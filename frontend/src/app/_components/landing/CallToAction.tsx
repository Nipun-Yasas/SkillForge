"use client";

import React from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const CallToAction: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      id="cta"
      sx={{
        px: { xs: 2, md: 5 },
        pt: { xs: 12, md: 16 },
        pb: 1,
        width: "100%",
        bgcolor: "#CAF0F8",
      }}
    >
      <Grid
        container
        spacing={5}
        direction={isMobile ? "column" : "row"}
        alignItems="center"
      >
        
          <Box>
            <Typography
              variant={isMobile ? "h4" : "h3"}
              fontWeight="bold"
              color="primary.dark"
              sx={{ lineHeight: { xs: "58px", md: "59px" } }}
            >
              Start Learning Today with SkillForge!
            </Typography>

            <Box mt={5} pl={1.5}>
              <Typography
                variant="h6"
                component="strong"
                sx={{ display: "block", mb: 2 }}
              >
                Unlock new skills, connect with peers, and grow together!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                At SkillForge, learning is a two-way street. Whether you want to
                learn a new skill or share your expertise, our platform makes it
                easy, fun, and accessible.
              </Typography>

              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/signUp"
                sx={{
                  mt: 5,
                  px: 6,
                  py: 2,
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
                }}
              >
                Join Now
              </Button>
            </Box>
          </Box>
        </Grid>

       
          <Box mt={isMobile ? 5 : 10}>
            <Box
              component="img"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/8b7a1f4bd68cf10835a9b73db713d144936d39e7?placeholderIfAbsent=true"
              alt="Call to action illustration"
              sx={{
                width: "100%",
                objectFit: "contain",
                aspectRatio: "0.83",
              }}
            />
          </Box>
    </Box>
  );
};

export default CallToAction;
