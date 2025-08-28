"use client";

import Box from "@mui/material/Box";

import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        gap: 2,
        backgroundColor: "#f8f9fa",
        padding: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Quantum size="45" speed="1.75" color="#007BFF" />
    </Box>
  );
}
