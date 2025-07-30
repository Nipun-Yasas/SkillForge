"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  Button, 
  Avatar, 
  Rating,
  Stack,
  Grid,
  Skeleton,
  Container
} from '@mui/material';
import { 
  Person as PersonIcon,
  School as SchoolIcon,
  AccessTime as TimeIcon,
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

export default function MentorsCards() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const router = useRouter();

  useEffect(() => {
    // Fetch mentor data
    const fetchMentors = async () => {
      try {
        const response = await fetch('/data/mentors.json');
        const data = await response.json();
        setMentors(data);
      } catch (error) {
        console.error('Error fetching mentors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const handleViewProfile = (mentorId: string) => {
    router.push(`/mentor/${mentorId}`);
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Skeleton variant="circular" width={60} height={60} />
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Skeleton variant="text" width="80%" height={28} />
                      <Skeleton variant="text" width="60%" height={20} />
                    </Box>
                  </Box>
                  <Skeleton variant="text" height={60} />
                  <Skeleton variant="rectangular" height={40} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  const visibleMentors = mentors.slice(0, visibleCount);

  return (
    <>
      <Grid container spacing={3}>
        {visibleMentors.map((mentor) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={mentor.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0, 123, 255, 0.15)',
                  '& .mentor-avatar': {
                    transform: 'scale(1.1)',
                  }
                },
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Mentor Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={mentor.image}
                    alt={mentor.name}
                    className="mentor-avatar"
                    sx={{ 
                      width: 60, 
                      height: 60,
                      transition: 'transform 0.3s ease-in-out',
                      border: '3px solid',
                      borderColor: 'primary.main',
                      bgcolor: 'primary.light'
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box sx={{ ml: 2, flex: 1 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {mentor.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={mentor.rating} readOnly size="small" precision={0.1} />
                      <Typography variant="body2" color="text.secondary">
                        ({mentor.rating})
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Bio */}
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2, lineHeight: 1.5 }}
                >
                  {mentor.bio}
                </Typography>

                {/* Skills */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                    Skills:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {mentor.skills.slice(0, 3).map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{
                          fontSize: '0.75rem',
                          height: 24,
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'white'
                          }
                        }}
                      />
                    ))}
                    {mentor.skills.length > 3 && (
                      <Chip
                        label={`+${mentor.skills.length - 3}`}
                        size="small"
                        variant="filled"
                        color="secondary"
                        sx={{ fontSize: '0.75rem', height: 24 }}
                      />
                    )}
                  </Stack>
                </Box>

                {/* Stats */}
                <Box sx={{ mb: 3 }}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {mentor.students} students
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {mentor.experience} experience
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MoneyIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {mentor.hourlyRate}/hour
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Availability Badge */}
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`Available: ${mentor.availability}`}
                    size="small"
                    color="success"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                </Box>

                {/* View Profile Button */}
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleViewProfile(mentor.id)}
                  sx={{
                    mt: 'auto',
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'medium',
                    background: 'linear-gradient(45deg, #007BFF 30%, #0056CC 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #0056CC 30%, #003D99 90%)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)'
                    }
                  }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Load More Button */}
      {visibleCount < mentors.length && (
        <Box display="flex" justifyContent="center" mt={5}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
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
            Load More Mentors
          </Button>
        </Box>
      )}
    </>
  );
}
