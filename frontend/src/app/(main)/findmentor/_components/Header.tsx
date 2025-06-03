"use client";

import React from "react";
import { Box, Typography, TextField, Button, InputAdornment, Paper } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchBar from "../../../_components/main/SearchBar"; // Keep as is if it's a custom component

export default function Header() {
  return (
    <Paper
      elevation={6}
      sx={{
        width: 1200,
        height: 176,
        mb: 5,
        borderRadius: "19px",
        p: 3,
      }}
    >
      <Box display="flex" flexWrap="wrap" alignItems="center" gap={4}>
        <Typography
          sx={{
            fontSize: "2rem",
            fontWeight: "bold",
            background: "linear-gradient(to right, #03045e, #00b4d8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0px 4px 4px #00000021",
            pl: 2,
          }}
        >
          Find Your Perfect Mentor
        </Typography>
      </Box>

      <Box display="flex" gap={2} mt={4} ml={2}>
        <Box
          display="flex"
          alignItems="center"
          border="1px solid #ccc"
          borderRadius="8px"
          px={2}
          py={1}
          maxWidth={500}
          flexGrow={1}
        >
          <SearchBar />
          <TextField
            variant="standard"
            placeholder="Search for skills (e.g, 'Web Development')"
            InputProps={{
              disableUnderline: true,
              sx: { ml: 1, fontSize: "0.9rem", flex: 1 }
            }}
          />
        </Box>

        {[
          { label: "Category", icon: <FilterAltIcon fontSize="small" /> },
          { label: "Availability", icon: <AccessTimeIcon fontSize="small" /> },
          { label: "Preference", icon: <ExpandMoreIcon fontSize="small" /> },
        ].map((filter, i) => (
          <Button
            key={i}
            variant="outlined"
            size="small"
            sx={{
              textTransform: "none",
              display: "flex",
              gap: 1,
              
            }}
            startIcon={filter.icon}
          >
            {filter.label}
          </Button>
        ))}
      </Box>
    </Paper>
  );
}
