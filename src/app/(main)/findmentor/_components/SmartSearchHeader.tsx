"use client";

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Chip,
  Stack,
  Card,
  CardContent,
  Avatar,
  Rating,
  CircularProgress,
  Alert,
  Fade,
  IconButton
} from '@mui/material';
import {
  FilterAlt as FilterAltIcon,
  AccessTime as AccessTimeIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  AutoAwesome as AIIcon,
  Send as SendIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Mentor {
  id: string;
  name: string;
  skills: string[];
  bio: string;
  image: string;
  rating: number;
  students: number;
  experience: string;
  hourlyRate: string;
  availability: string;
}

interface AIRecommendationResponse {
  recommendations: Mentor[];
  query: string;
  aiGenerated: boolean;
  message: string;
  error?: string;
}

interface SmartSearchHeaderProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: string[]) => void;
  onMentorSelect?: (mentor: Mentor) => void;
}

export default function SmartSearchHeader({ 
  onSearch, 
  onFilterChange, 
  onMentorSelect 
}: SmartSearchHeaderProps) {
  const [isAIMode, setIsAIMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(null);
  const [availabilityAnchor, setAvailabilityAnchor] = useState<null | HTMLElement>(null);
  const [preferenceAnchor, setPreferenceAnchor] = useState<null | HTMLElement>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // AI Search states
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<Mentor[]>([]);
  const [aiMessage, setAiMessage] = useState("");
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const categories = ["Web Development", "Mobile Development", "Data Science", "Design", "Marketing", "Business"];
  const availabilities = ["Weekdays", "Weekends", "Evenings", "Mornings", "Flexible"];
  const preferences = ["Beginner Friendly", "Project Based", "Long Term", "Short Term"];

  // AI Search suggestions
  const aiSuggestions = [
    "I want to learn React.js for building modern web applications. I'm a beginner and prefer evening sessions.",
    "Looking for a Python mentor to help me with data science projects. I have basic programming knowledge.",
    "Need help with mobile app development using Flutter. I want project-based learning with flexible timing.",
    "Seeking a design mentor for UI/UX principles. I'm completely new to design and prefer weekend sessions.",
    "Want to learn digital marketing strategies for small businesses. Looking for experienced professionals.",
    "Need guidance on machine learning algorithms. I have Python experience but new to ML."
  ];

  const handleModeToggle = () => {
    setIsAIMode(!isAIMode);
    setSearchQuery("");
    setAiQuery("");
    setRecommendations([]);
    setError("");
    setAiMessage("");
    setShowSuggestions(false);
    setActiveFilters([]);
    setCategoryAnchor(null);
    setAvailabilityAnchor(null);
    setPreferenceAnchor(null);
  };

  const handleManualSearch = (value: string) => {
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

  const removeFilter = (filterToRemove: string) => {
    setActiveFilters(activeFilters.filter(f => f !== filterToRemove));
    onFilterChange?.(activeFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    onFilterChange?.([]);
  };

  const handleAISearch = async () => {
    if (!aiQuery.trim()) return;

    setIsSearching(true);
    setError("");
    setRecommendations([]);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: aiQuery }),
      });

      const data: AIRecommendationResponse = await response.json();

      if (response.ok) {
        setRecommendations(data.recommendations || []);
        setAiMessage(data.message || "AI recommendations generated!");
      } else {
        setError(data.error || "Failed to get AI recommendations");
      }
    } catch (error) {
      console.error('AI search error:', error);
      setError("An error occurred while getting AI recommendations");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      if (isAIMode) {
        handleAISearch();
      } else {
        handleManualSearch(searchQuery);
      }
    }
  };

  const ModeToggle = () => (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Paper
        sx={{
          p: 1,
          background: isAIMode 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: '20px',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.25)',
          }
        }}
        onClick={handleModeToggle}
        onMouseDown={(e) => {
          e.preventDefault(); // Prevent focus issues
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1 }}>
          <motion.div
            animate={{ rotate: isAIMode ? 360 : 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {isAIMode ? (
              <AIIcon sx={{ color: 'white', fontSize: 28 }} />
            ) : (
              <SearchIcon sx={{ color: 'white', fontSize: 28 }} />
            )}
          </motion.div>
          
          <Box sx={{ position: 'relative', width: 120, height: 24 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={isAIMode ? 'ai' : 'manual'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'absolute', width: '100%' }}
              >
                <Typography 
                  variant="body2" 
                  fontWeight="bold" 
                  sx={{ color: 'white', textAlign: 'center' }}
                >
                  {isAIMode ? 'AI Smart Search' : 'Manual Search'}
                </Typography>
              </motion.div>
            </AnimatePresence>
          </Box>

          <motion.div
            animate={{ 
              x: isAIMode ? 8 : -8,
              scale: isAIMode ? 1.2 : 1
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isAIMode && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <PsychologyIcon sx={{ fontSize: 12, color: '#667eea' }} />
                </motion.div>
              )}
            </Box>
          </motion.div>
        </Stack>
      </Paper>
    </motion.div>
  );

  const ManualSearchHeader = () => (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: '#2c3e50' }}>
          Find Your Perfect Mentor
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Search through our community of expert mentors and find the perfect match for your learning goals.
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for mentors by skill, subject, or expertise..."
          value={searchQuery}
          onChange={(e) => {
            e.preventDefault();
            handleManualSearch(e.target.value);
          }}
          onKeyDown={handleKeyPress}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              fontSize: '16px',
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
                <IconButton 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleManualSearch("");
                  }} 
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<FilterAltIcon />}
            endIcon={<ExpandMoreIcon />}
            onClick={(e) => setCategoryAnchor(e.currentTarget)}
            sx={{ borderRadius: '8px' }}
          >
            Category
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<AccessTimeIcon />}
            endIcon={<ExpandMoreIcon />}
            onClick={(e) => setAvailabilityAnchor(e.currentTarget)}
            sx={{ borderRadius: '8px' }}
          >
            Availability
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<PersonIcon />}
            endIcon={<ExpandMoreIcon />}
            onClick={(e) => setPreferenceAnchor(e.currentTarget)}
            sx={{ borderRadius: '8px' }}
          >
            Preferences
          </Button>

          {activeFilters.length > 0 && (
            <Button
              variant="text"
              startIcon={<ClearIcon />}
              onClick={clearAllFilters}
              color="error"
              sx={{ borderRadius: '8px' }}
            >
              Clear All
            </Button>
          )}
        </Stack>

        {activeFilters.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Active Filters:
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {activeFilters.map((filter) => (
                <Chip
                  key={filter}
                  label={filter.split(':')[1]}
                  onDelete={() => removeFilter(filter)}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ borderRadius: '8px' }}
                />
              ))}
            </Stack>
          </Box>
        )}

        {/* Filter Menus */}
        <Menu
          anchorEl={categoryAnchor}
          open={Boolean(categoryAnchor)}
          onClose={() => setCategoryAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: { borderRadius: '8px', mt: 1 }
          }}
        >
          {categories.map((category) => (
            <MenuItem 
              key={category} 
              onClick={() => {
                handleFilterSelect('category', category);
                setCategoryAnchor(null);
              }}
              sx={{ borderRadius: '4px', mx: 1, my: 0.5 }}
            >
              {category}
            </MenuItem>
          ))}
        </Menu>

        <Menu
          anchorEl={availabilityAnchor}
          open={Boolean(availabilityAnchor)}
          onClose={() => setAvailabilityAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: { borderRadius: '8px', mt: 1 }
          }}
        >
          {availabilities.map((availability) => (
            <MenuItem 
              key={availability} 
              onClick={() => {
                handleFilterSelect('availability', availability);
                setAvailabilityAnchor(null);
              }}
              sx={{ borderRadius: '4px', mx: 1, my: 0.5 }}
            >
              {availability}
            </MenuItem>
          ))}
        </Menu>

        <Menu
          anchorEl={preferenceAnchor}
          open={Boolean(preferenceAnchor)}
          onClose={() => setPreferenceAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: { borderRadius: '8px', mt: 1 }
          }}
        >
          {preferences.map((preference) => (
            <MenuItem 
              key={preference} 
              onClick={() => {
                handleFilterSelect('preference', preference);
                setPreferenceAnchor(null);
              }}
              sx={{ borderRadius: '4px', mx: 1, my: 0.5 }}
            >
              {preference}
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </motion.div>
  );

  const AISearchHeader = () => (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <AIIcon sx={{ fontSize: 40, color: '#667eea' }} />
          </motion.div>
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#2c3e50' }}>
              AI-Powered Mentor Discovery
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Describe what you want to learn and let our AI find the perfect mentors for you
            </Typography>
          </Box>
        </Stack>

        <Paper
          sx={{
            p: 3,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            border: '2px solid rgba(102, 126, 234, 0.1)',
            mb: 3
          }}
        >
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Example: I want to learn React.js for building modern web applications. I'm a beginner and prefer evening sessions with project-based learning..."
            value={aiQuery}
            onChange={(e) => {
              setAiQuery(e.target.value);
              // Only show suggestions if query is short and field is focused
              if (e.target.value.length < 10) {
                setShowSuggestions(true);
              } else {
                setShowSuggestions(false);
              }
            }}
            onKeyDown={handleKeyPress}
            onFocus={() => {
              if (aiQuery.length < 10) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              // Delay hiding to allow clicking suggestions
              setTimeout(() => setShowSuggestions(false), 300);
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                fontSize: '16px',
                border: 'none',
                backgroundColor: 'white',
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                  <PsychologyIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          {/* AI Search Suggestions */}
          {showSuggestions && aiQuery.length < 10 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  💡 Try these example queries:
                </Typography>
                <Stack spacing={1}>
                  {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(102, 126, 234, 0.05)',
                          border: '1px solid rgba(102, 126, 234, 0.1)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(102, 126, 234, 0.1)',
                            transform: 'translateX(4px)',
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevent blur
                          setAiQuery(suggestion);
                          setShowSuggestions(false);
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {suggestion}
                        </Typography>
                      </Paper>
                    </motion.div>
                  ))}
                </Stack>
              </Box>
            </motion.div>
          )}
          
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" color="text.secondary">
              💡 Be specific about your goals, experience level, and preferences
            </Typography>
            
            <Button
              variant="contained"
              startIcon={isSearching ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
              onClick={handleAISearch}
              disabled={!aiQuery.trim() || isSearching}
              sx={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                }
              }}
            >
              {isSearching ? 'Analyzing...' : 'Find Mentors'}
            </Button>
          </Stack>
        </Paper>

        {error && (
          <Fade in={Boolean(error)}>
            <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
              {error}
            </Alert>
          </Fade>
        )}

        {aiMessage && (
          <Fade in={Boolean(aiMessage)}>
            <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>
              {aiMessage}
            </Alert>
          </Fade>
        )}

        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              🎯 AI Recommended Mentors
            </Typography>
            <Stack spacing={2}>
              {recommendations.slice(0, 3).map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                      }
                    }}
                    onClick={() => {
                      onMentorSelect?.(mentor);
                      router.push(`/mentor/${mentor.id}`);
                    }}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={mentor.image} sx={{ width: 56, height: 56 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="bold">
                            {mentor.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {mentor.bio}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {mentor.skills.slice(0, 3).map((skill) => (
                              <Chip
                                key={skill}
                                label={skill}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Rating value={mentor.rating} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary">
                            {mentor.students} students
                          </Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            {mentor.hourlyRate}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        )}
      </Box>
    </motion.div>
  );

  return (
    <Paper 
      sx={{ 
        p: 4, 
        borderRadius: '20px',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 242, 247, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        mb: 4,
        position: 'relative',
        overflow: 'hidden'
      }}
      component="div"
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {/* Animated Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: isAIMode 
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%)',
          animation: 'float 6s ease-in-out infinite',
        }}
      />

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h5" fontWeight="bold" color="text.secondary">
            Mentor Discovery
          </Typography>
        </motion.div>
        
        <ModeToggle />
      </Stack>

      <AnimatePresence mode="wait">
        {isAIMode ? (
          <AISearchHeader key="ai-search" />
        ) : (
          <ManualSearchHeader key="manual-search" />
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </Paper>
  );
}
