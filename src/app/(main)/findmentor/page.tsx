"use client";

import Header from "./_components/Header";
import MentorsCards from "./_components/MentorsCards";
import AISmartSearch from "./_components/AISmartSearch";
import { useState } from "react";
import { Box, Container, Divider, Typography } from "@mui/material";

export default function FindingMentor() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<string[]>([]);

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* AI Smart Search Section */}
      <AISmartSearch />
      
      {/* Divider */}
      <Box sx={{ my: 4 }}>
        <Divider sx={{ position: 'relative' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              px: 2, 
              backgroundColor: 'background.paper',
              color: 'text.secondary',
              fontWeight: 'medium'
            }}
          >
            Or Browse All Mentors
          </Typography>
        </Divider>
      </Box>

      {/* Traditional Search and Browse Section */}
      <Header
        onSearch={(q) => {
          setQuery(q);
        }}
        onFilterChange={(f) => setFilters(f)}
      />
      <MentorsCards query={query} filters={filters} />
    </Container>
  );
}
