"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  InputAdornment,
  Menu,
  MenuItem,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import {
  FilterAlt as FilterAltIcon,
  AccessTime as AccessTimeIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import theme from "@/theme";
interface HeaderProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: string[]) => void;
}

export default function Header({ onSearch, onFilterChange }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(
    null
  );
  const [availabilityAnchor, setAvailabilityAnchor] =
    useState<null | HTMLElement>(null);
  // const [preferenceAnchor, setPreferenceAnchor] = useState<null | HTMLElement>(
  //   null
  // );
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Design",
    "Marketing",
    "Business",
  ];
  const availabilities = [
    "Weekdays",
    "Weekends",
    "Evenings",
    "Mornings",
    "Flexible",
  ];
  // const preferences = [
  //   "Beginner Friendly",
  //   "Project Based",
  //   "Long Term",
  //   "Short Term",
  // ];

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    onSearch?.(searchQuery.trim());
  };

  const handleFilterSelect = (type: string, value: string) => {
    const key = `${type}:${value}`;
    const next = activeFilters.includes(key)
      ? activeFilters.filter((f) => f !== key)
      : [...activeFilters, key];

    setActiveFilters(next);
    onFilterChange?.(next); // pass updated list
  };

  const removeFilter = (filter: string) => {
    const next = activeFilters.filter((f) => f !== filter);
    setActiveFilters(next);
    onFilterChange?.(next);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
    onFilterChange?.([]);
  };

  return (
    <Paper
      elevation={10}
          sx={{
            textAlign: "center",
            p: 4,
            mb: 4,
            position: "relative",
            zIndex: 1,
            backdropFilter: "blur(10px) saturate(1.08)",
            WebkitBackdropFilter: "blur(10px) saturate(1.08)",
            borderRadius: 3,
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 10px 40px rgba(0,0,0,0.45)"
                : "0 10px 40px rgba(0,0,0,0.12)",
            transition:
              "background-color 200ms ease, backdrop-filter 200ms ease",
            "&:hover": {
              boxShadow: "0 8px 25px rgba(0, 123, 255, 0.2)",
            },
          }}
    >
      {/* Header Title */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #007BFF 30%, #0056CC 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0px 4px 4px rgba(0,0,0,0.1)",
            mb: 1,
          }}
        >
          Find Your Perfect Mentor
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Connect with expert mentors to accelerate your learning journey
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: { xs: "column", lg: "row" },
          mb: 3,
        }}
      >
        {/* Search Bar */}
        <TextField
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search skills (e.g. React, Node, UI/UX)"
          size="small"
          fullWidth
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => handleSearch()}
                  edge="end"
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={() => handleSearch()}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Search
        </Button>
      </Box>
      <Box>
        {/* Filter Buttons */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {/* Category Filter */}
          <Button
            variant="outlined"
            onClick={(e) => setCategoryAnchor(e.currentTarget)}
            startIcon={<FilterAltIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Category
          </Button>

          {/* Availability Filter */}
          <Button
            variant="outlined"
            onClick={(e) => setAvailabilityAnchor(e.currentTarget)}
            startIcon={<AccessTimeIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Availability
          </Button>
        </Box>
      </Box>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            gap={1}
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              Active filters:
            </Typography>
            {activeFilters.map((filter) => (
              <Chip
                key={filter}
                label={filter.split(":")[1]}
                onDelete={() => removeFilter(filter)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
            <Button
              size="small"
              onClick={clearAllFilters}
              sx={{ textTransform: "none" }}
            >
              Clear All
            </Button>
          </Stack>
        </Box>
      )}

      {/* Filter Menus */}
      <Menu
        anchorEl={categoryAnchor}
        open={Boolean(categoryAnchor)}
        onClose={() => setCategoryAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {categories.map((category) => (
          <MenuItem
            key={category}
            onClick={() => {
              handleFilterSelect("category", category);
              setCategoryAnchor(null);
            }}
            selected={activeFilters.includes(`category:${category}`)}
          >
            {category}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={availabilityAnchor}
        open={Boolean(availabilityAnchor)}
        onClose={() => setAvailabilityAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        {availabilities.map((availability) => (
          <MenuItem
            key={availability}
            onClick={() => {
              handleFilterSelect("availability", availability);
              setAvailabilityAnchor(null);
            }}
            selected={activeFilters.includes(`availability:${availability}`)}
          >
            {availability}
          </MenuItem>
        ))}
      </Menu>

      {/* <Menu
        anchorEl={preferenceAnchor}
        open={Boolean(preferenceAnchor)}
        onClose={() => setPreferenceAnchor(null)}
      >
        {preferences.map((preference) => (
          <MenuItem
            key={preference}
            onClick={() => handleFilterSelect("preference", preference)}
            selected={activeFilters.includes(`preference:${preference}`)}
          >
            {preference}
          </MenuItem>
        ))}
      </Menu> */}
    </Paper>
  );
}
