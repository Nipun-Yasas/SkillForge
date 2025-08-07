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
  Stack
} from "@mui/material";
import {
  FilterAlt as FilterAltIcon,
  AccessTime as AccessTimeIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Clear as ClearIcon
} from "@mui/icons-material";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: string[]) => void;
}

export default function Header({ onSearch, onFilterChange }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
  const [availabilityAnchor, setAvailabilityAnchor] = useState<null | HTMLElement>(null);
  const [preferenceAnchor, setPreferenceAnchor] = useState<null | HTMLElement>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const categories = ["Web Development", "Mobile Development", "Data Science", "Design", "Marketing", "Business"];
  const availabilities = ["Weekdays", "Weekends", "Evenings", "Mornings", "Flexible"];
  const preferences = ["Beginner Friendly", "Project Based", "Long Term", "Short Term"];

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleFilterSelect = (type: string, value: string) => {
    const filterKey = `${type}:${value}`;
    if (activeFilters.includes(filterKey)) {
      setActiveFilters(activeFilters.filter(f => f !== filterKey));
    } else {
      setActiveFilters([...activeFilters, filterKey]);
    }
    onFilterChange?.(activeFilters);
  };

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filter));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchQuery("");
  };

  return (
    <Paper
      elevation={6}
      sx={{
        mb: 5,
        borderRadius: 4,
        p: 4,
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Header Title */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(45deg, #007BFF 30%, #0056CC 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0px 4px 4px rgba(0,0,0,0.1)",
            mb: 1
          }}
        >
           Find Your Perfect Mentor
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Connect with expert mentors to accelerate your learning journey
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Box  sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: { xs: "column", lg: "row" },
        mb: 3
      }}>
        {/* Search Bar */}
        <TextField
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for skills (e.g., 'React', 'Python', 'UI/UX')"
          variant="outlined"
          sx={{
            maxWidth: 500,
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                }
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <Button
                  size="small"
                  onClick={() => handleSearch("")}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <ClearIcon fontSize="small" />
                </Button>
              </InputAdornment>
            )
          }}
        />

        {/* Filter Buttons */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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

          {/* Preference Filter */}
          <Button
            variant="outlined"
            onClick={(e) => setPreferenceAnchor(e.currentTarget)}
            startIcon={<ExpandMoreIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Preference
          </Button>
        </Box>
      </Box>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Active filters:
            </Typography>
            {activeFilters.map((filter) => (
              <Chip
                key={filter}
                label={filter.split(':')[1]}
                onDelete={() => removeFilter(filter)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
            <Button
              size="small"
              onClick={clearAllFilters}
              sx={{ textTransform: 'none' }}
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
      >
        {categories.map((category) => (
          <MenuItem
            key={category}
            onClick={() => handleFilterSelect('category', category)}
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
      >
        {availabilities.map((availability) => (
          <MenuItem
            key={availability}
            onClick={() => handleFilterSelect('availability', availability)}
            selected={activeFilters.includes(`availability:${availability}`)}
          >
            {availability}
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={preferenceAnchor}
        open={Boolean(preferenceAnchor)}
        onClose={() => setPreferenceAnchor(null)}
      >
        {preferences.map((preference) => (
          <MenuItem
            key={preference}
            onClick={() => handleFilterSelect('preference', preference)}
            selected={activeFilters.includes(`preference:${preference}`)}
          >
            {preference}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
}
