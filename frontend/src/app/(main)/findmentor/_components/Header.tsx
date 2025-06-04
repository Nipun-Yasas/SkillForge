"use client";

import React from "react";
import  Box  from "@mui/material/Box";
import  Typography  from "@mui/material/Typography";
import  Button  from "@mui/material/Button";
import  TextField  from "@mui/material/TextField";
import  Paper  from "@mui/material/Paper";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchBar from "../../../_components/main/SearchBar"; 

export default function Header() {
  return (
    <Paper
      elevation={6}
      sx={{
        mb: 5,
        borderRadius: "19px",
        p: 3,
      }}
    >
      <Box 
      sx={{
        display:"flex", 
        alignItems:"center" ,
        gap:'4'
      }}
      >
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

      <Box sx={{
        display: "flex",
        mt: 3,
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: { xs: "column", lg: "row" },
      }}>
        <Box
          display="flex"
          alignItems="center"
          border="1px solid #ccc"
          borderRadius="8px"
          justifyContent={"space-between"}
          px={2}
          py={1}
          maxWidth={500}
          flexGrow={1}
        >
          <SearchBar />
          <Typography>
            "Search for skills (e.g, 'Web Development')
          </Typography>
        </Box>

        <Box 
        sx={
          {
            display:'flex',
            gap: 1,
          }
        }
         >
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
      </Box>
    </Paper>
  );
}
