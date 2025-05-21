'use client';

import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
type Feature = {
  icon: string;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/b13c7aa8df0d4a4578ed55c84338d712df64bdf5?placeholderIfAbsent=true',
    title: 'Skill Exchange System',
    description: 'Learn for free by trading skills with others.',
  },
  {
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1045b19a06e7b491cf827f92292b67f2c9307d88?placeholderIfAbsent=true',
    title: 'Best Live Virtual Workshops',
    description: 'Gain practical knowledge through interactive sessions.',
  },
  {
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/5942b330e8bc0ee6d4844e2b21aa3cd507baa5bd?placeholderIfAbsent=true',
    title: 'Community Forums Coaching',
    description: 'Join discussions and collaborate with fellow learners.',
  },
  {
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/00258e499d1eb8f616c6485b18a5a4c3fbba0e8e?placeholderIfAbsent=true',
    title: 'Best One-on-One Mentorship Coaching',
    description: 'Connect with experienced peers for guidance.',
  },
];

export default function Features() {
  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll('.feature-card');
      cards.forEach((card) => {
        const position = card.getBoundingClientRect();
        if (position.top < window.innerHeight && position.bottom >= 0) {
          (card as HTMLElement).classList.add('fadeInAnimate');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // in case already in viewport
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>

      <Box
        id="features"
        sx={{
          backgroundColor: 'rgba(207, 250, 254, 0.4)', 
          py: { xs: 5, md: 5 },
        }}
      >
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
            sx={{mb:3}}
          >
            Check out educate features
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, justifyContent: 'space-evenly' }}>
            {features.map((feature, index) => (
              
                <FeatureCard {...feature} />
              
            ))}
          </Box>
      </Box>
    </>
  );
};

const FeatureCard: React.FC<Feature> = ({ icon, title, description }) => {
  return (
    <Card
      className="feature-card"
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        textAlign: 'center'
      }}
    >
      <Box
        component="img"
        src={icon}
        alt={title}
        sx={{
          maxwidth: 100,
          maxheight: 100,
          borderRadius: '45px',
          objectFit: 'contain',
          mb: 3,
        }}
      />
      <Typography variant="h6" fontWeight="bold" color="primary.dark" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        {description}
      </Typography>
      <Button
        variant="contained"
        sx={{
          px: 2,
          py: 1.5,
          borderRadius: 20,
          backgroundColor: 'cyan.500',
          color: 'white',
          textTransform: 'none',
          
        }}
        endIcon=
          {<ArrowForwardIcon/>}
        
      >
        View Details
      </Button>
    </Card>
  );
};

