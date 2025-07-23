"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Chip,
  Rating,
  Stack,
  Card,
  CardContent,
  Divider,
  IconButton,
  Skeleton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  Message as MessageIcon,
  VideoCall as VideoCallIcon
} from '@mui/icons-material';

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

export default function MentorProfile() {
  const params = useParams();
  const router = useRouter();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await fetch('/data/mentors.json');
        const mentors = await response.json();
        const foundMentor = mentors.find((m: Mentor) => m.id === params.id);
        setMentor(foundMentor);
      } catch (error) {
        console.error('Error fetching mentor:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMentor();
    }
  }, [params.id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2, mb: 3 }} />
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 2 }}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (!mentor) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Mentor Not Found
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <IconButton
          onClick={() => router.back()}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { bgcolor: 'grey.100' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Hero Section */}
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
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' },
          textAlign: { xs: 'center', md: 'left' }
        }}>
          <Box sx={{ minWidth: 120 }}>
            <Avatar
              src={mentor.image}
              alt={mentor.name}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
                boxShadow: 3,
                mx: { xs: 'auto', md: 0 }
              }}
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              {mentor.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              <Rating value={mentor.rating} readOnly precision={0.1} />
              <Typography variant="h6">
                {mentor.rating} ({mentor.students} students)
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {mentor.bio}
            </Typography>
          </Box>
          
          <Box sx={{ minWidth: 200 }}>
            <Stack spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<MessageIcon />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
              >
                Send Message
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<VideoCallIcon />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Schedule Call
              </Button>
            </Stack>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Main Content */}
        <Box sx={{ flex: 2 }}>
          {/* Skills Section */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                🎯 Expertise &amp; Skills
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {mentor.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    color="primary"
                    variant="outlined"
                    sx={{
                      fontWeight: 'medium',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white'
                      }
                    }}
                  />
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                📖 About {mentor.name}
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, mb: 3 }}>
                {mentor.bio} With {mentor.experience} of hands-on experience, I&apos;ve helped {mentor.students} students 
                achieve their learning goals through personalized mentorship and practical project guidance.
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🏆 What You&apos;ll Learn
              </Typography>
              <Stack spacing={1}>
                {mentor.skills.map((skill) => (
                  <Box key={skill} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StarIcon color="primary" fontSize="small" />
                    <Typography variant="body2">
                      Advanced {skill} techniques and best practices
                    </Typography>
                  </Box>
                ))}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon color="primary" fontSize="small" />
                  <Typography variant="body2">
                    Real-world project experience and portfolio development
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon color="primary" fontSize="small" />
                  <Typography variant="body2">
                    Industry insights and career guidance
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Sidebar */}
        <Box sx={{ flex: 1 }}>
          {/* Quick Stats */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📊 Quick Stats
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SchoolIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Students Taught
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {mentor.students}+
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TimeIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Experience
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {mentor.experience}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <MoneyIcon color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Hourly Rate
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {mentor.hourlyRate}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card sx={{ mb: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📅 Availability
              </Typography>
              <Chip
                label={mentor.availability}
                color="success"
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                Available for 1-on-1 sessions and group workshops
              </Typography>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🤝 Start Learning
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ready to begin your learning journey? Get in touch to discuss your goals.
              </Typography>
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<MessageIcon />}
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(45deg, #007BFF 30%, #0056CC 90%)',
                  }}
                >
                  Contact Mentor
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  startIcon={<VideoCallIcon />}
                >
                  Book Free Consultation
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
