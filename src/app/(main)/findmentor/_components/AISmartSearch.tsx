"use client";

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  Stack,
  Rating,
  CircularProgress,
  Alert,
  Fade,
  InputAdornment
} from '@mui/material';
import {
  AutoAwesome as AIIcon,
  Send as SendIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
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

export default function AISmartSearch() {
  const [prompt, setPrompt] = useState("");
  const [recommendations, setRecommendations] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [aiGenerated, setAiGenerated] = useState(false);
  const router = useRouter();

  const samplePrompts = [
    "I want to learn Figma and React basics",
    "Help me with Python and machine learning",
    "I need a mentor for mobile app development",
    "Teach me digital marketing and SEO",
    "I want to improve my graphic design skills"
  ];

  const handleSearch = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setRecommendations([]);
    setMessage("");

    console.log('🔍 Starting AI search with prompt:', prompt);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: prompt }),
      });

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`Failed to get recommendations: ${response.status}`);
      }

      const data: AIRecommendationResponse = await response.json();
      console.log('✅ API Response data:', data);
      
      setRecommendations(data.recommendations);
      setMessage(data.message);
      setAiGenerated(data.aiGenerated);

      // Success toast for debugging
      if (data.aiGenerated) {
        console.log('🤖 AI-powered recommendations received!');
      } else {
        console.log('🔧 Fallback recommendations received');
      }

    } catch (err) {
      console.error('❌ AI search error:', err);
      setMessage('Unable to get recommendations right now. Please try again later.');
      setAiGenerated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleViewProfile = (mentorId: string) => {
    router.push(`/mentor/${mentorId}`);
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* AI Search Header */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box color='textblack.main' sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <AIIcon sx={{ fontSize: 40 }} />
            <Typography variant="h3" fontWeight="bold" color='textblack.main'>
              AI Smart Search
            </Typography>
          </Box>
          <Typography color='textblack.main' variant="h6" sx={{ opacity: 0.9 }}>
            Describe what you want to learn, and our AI will find the perfect mentors for you!
          </Typography>
        </Box>

        {/* AI Prompt Input */}
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Example: 'I want to learn Figma and React basics to build modern web applications...'"
            variant="outlined"
            disabled={loading}
            sx={{
              color: "textblack.main",
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: 2
                  }
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AIIcon color="action" />
                </InputAdornment>
              )
            }}
          />
          
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleSearch}
            disabled={loading || !prompt.trim()}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{
              background:
                    "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                  borderRadius: 2,
                  fontSize: { xs: "0.8rem", md: "1rem", lg: "1.1rem" },
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #0056CC 0%, #4A0080 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(0, 123, 255, 0.3)",
                  },
                  transition: "all 0.3s ease",
            }}
          >
            {loading ? 'AI is finding perfect matches...' : 'Find My Perfect Mentors'}
          </Button>
        </Box>

        {/* Sample Prompts */}
        <Box color="textblack.main" sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
            💡 Try these examples:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" gap={1}>
            {samplePrompts.slice(0, 3).map((sample, index) => (
              <Chip
              
                key={index}
                label={sample}
                onClick={() => setPrompt(sample)}
                sx={{
                  color: "textblack.main",
                  cursor: 'pointer'
                }}
              />
            ))}
          </Stack>
        </Box>
      </Paper>

      {/* Results Section */}
      {message && (
        <Fade in={true}>
          <Box sx={{ mb: 3 }}>
            <Alert 
              severity={aiGenerated ? "success" : "info"} 
              sx={{ mb: 2, borderRadius: 2 }}
              icon={aiGenerated ? <AIIcon /> : undefined}
            >
              <Box>
                {message}
                {aiGenerated && (
                  <Typography variant="caption" display="block" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                    ✨ Powered by Gemini AI
                  </Typography>
                )}
                {!aiGenerated && (
                  <Typography variant="caption" display="block" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                    🔧 Smart keyword matching
                  </Typography>
                )}
              </Box>
            </Alert>
          </Box>
        </Fade>
      )}

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <Fade in={true}>
          <Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
              🎯 AI Recommended Mentors for You
            </Typography>
            
            <Stack spacing={2}>
              {recommendations.map((mentor, index) => (
                <Card
                  key={mentor.id}
                  sx={{
                    borderRadius: 3,
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    border: aiGenerated ? '2px solid' : '1px solid',
                    borderColor: aiGenerated ? 'primary.main' : 'divider',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(0, 123, 255, 0.15)',
                    }
                  }}
                  onClick={() => handleViewProfile(mentor.id)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                      {/* Ranking Badge */}
                      <Box
                        sx={{
                          backgroundColor: index === 0 ? 'gold' : index === 1 ? 'silver' : '#CD7F32',
                          color: 'white',
                          borderRadius: '50%',
                          width: 40,
                          height: 40,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}
                      >
                        #{index + 1}
                      </Box>

                      {/* Avatar */}
                      <Avatar
                        src={mentor.image}
                        alt={mentor.name}
                        sx={{
                          width: 80,
                          height: 80,
                          border: '3px solid',
                          borderColor: 'primary.main'
                        }}
                      >
                        <PersonIcon />
                      </Avatar>

                      {/* Mentor Info */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {mentor.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Rating value={mentor.rating} readOnly size="small" precision={0.1} />
                          <Typography variant="body2" color="text.secondary">
                            ({mentor.rating})
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {mentor.bio}
                        </Typography>

                        {/* Skills */}
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
                          {mentor.skills.slice(0, 4).map((skill) => (
                            <Chip
                              key={skill}
                              label={skill}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          ))}
                          {mentor.skills.length > 4 && (
                            <Chip
                              label={`+${mentor.skills.length - 4}`}
                              size="small"
                              color="secondary"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          )}
                        </Stack>

                        {/* Quick Stats */}
                        <Box sx={{ display: 'flex', gap: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <SchoolIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {mentor.students} students
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <MoneyIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {mentor.hourlyRate}/hr
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* View Profile Button */}
                      <Button
                        variant="contained"
                        sx={{
                          background: 'linear-gradient(45deg, #007BFF 30%, #0056CC 90%)',
                          minWidth: 120
                        }}
                      >
                        View Profile
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </Fade>
      )}
    </Box>
  );
}
