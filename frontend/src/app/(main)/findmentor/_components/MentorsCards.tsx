"use client";

import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Avatar,
  Button,
} from "@mui/material";
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface Mentor {
  name: string;
  location: string;
  rating: string;
  skills: string[];
  image: string;
}

const mentors: Mentor[] = Array(6).fill({
  name: "Alex Jhons",
  location: "Moratuwa, Sri Lanka",
  rating: "4.5/5",
  skills: ["Web Development", "Java", "Python", "Node.Js", "Video Editing"],
  image: "/profile-pic.png",
});

const MentorsCards: React.FC = () => {
  return (
    <>
      <Grid container spacing={4}>
        {mentors.map((mentor, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden", position: "relative" }}>
              {/* Top Gradient Section */}
              <Box
                sx={{
                  background: "linear-gradient(to right, #4D9ECA, #34377F)",
                  px: 2,
                  pt: 2,
                  pb: 6,
                  color: "white",
                  position: "relative",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {mentor.name}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {mentor.location}
                </Typography>

                {/* Rating Badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "white",
                    color: "black",
                    px: 1,
                    py: 0.5,
                    fontSize: "0.75rem",
                    borderRadius: "999px",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: 1,
                  }}
                >
                  <StarBorderIcon sx={{ fontSize: 16, color: "#facc15", mr: 0.5 }} />
                  {mentor.rating}
                </Box>

                {/* Profile Image */}
                <Avatar
                  src={mentor.image}
                  alt={mentor.name}
                  sx={{
                    width: 64,
                    height: 64,
                    position: "absolute",
                    bottom: -32,
                    left: 16,
                    border: "4px solid white",
                    boxShadow: 2,
                  }}
                />
              </Box>

              {/* Card Content */}
              <Box sx={{ px: 2, pt: 6, pb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  CAN TEACH
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                  {mentor.skills.map((skill, i) => (
                    <Chip
                      key={`skill-top-${i}`}
                      label={skill}
                      size="small"
                      sx={{ backgroundColor: "#e3f2fd", color: "#1565c0", fontSize: "0.75rem" }}
                    />
                  ))}
                </Box>

                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  CAN TEACH
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                  {mentor.skills.map((skill, i) => (
                    <Chip
                      key={`skill-bottom-${i}`}
                      label={skill}
                      size="small"
                      sx={{ backgroundColor: "#e3f2fd", color: "#1565c0", fontSize: "0.75rem" }}
                    />
                  ))}
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    background: "linear-gradient(to right, #4D9ECA, #34377F)",
                    color: "white",
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    borderRadius: 2,
                    boxShadow: 2,
                    ":hover": {
                      opacity: 0.9,
                      background: "linear-gradient(to right, #4D9ECA, #34377F)",
                    },
                  }}
                >
                  Request mentorship
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Load More Button */}
      <Box display="flex" justifyContent="center" mt={5}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#4C98C6",
            color: "white",
            textTransform: "none",
            px: 4,
            py: 1.5,
            borderRadius: 2,
            ":hover": {
              backgroundColor: "#2563eb",
            },
          }}
        >
          Load More
        </Button>
      </Box>
    </>
  );
};

export default MentorsCards;
