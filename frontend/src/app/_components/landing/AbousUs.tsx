'use client';

import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
} from '@mui/material';

const AboutUs: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      const aboutSectionElements = document.querySelectorAll(
        '#about div, #cta div, #testimonials div, #features div, #Footer div, #stats div'
      );

      aboutSectionElements.forEach((element) => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight && position.bottom >= 0) {
          element.classList.add('fadeInAnimate');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .fadeInAnimate {
            animation: fadeIn 2s ease-out forwards;
          }
        `}
      </style>

      <Container
        id="about"
        sx={{
          mt: { xs: 10, md: 24 },
          maxWidth: '1298px',
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          gap={5}
          data-animate
        >
          {/* Image */}
          <Box width={{ xs: '100%', md: '50%' }}>
            <Box
              component="img"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/aee2d33204de82882d73ea6d114032f0cc80597d?placeholderIfAbsent=true"
              alt="About us illustration"
              sx={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                mt: { xs: 4, md: 0 },
              }}
            />
          </Box>

          {/* Text Content */}
          <Box width={{ xs: '100%', md: '50%' }} ml={{ md: 5 }}>
            <Box mt={{ xs: 4, md: 14 }}>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                textTransform="uppercase"
                color="cyan.500"
                fontSize="1.125rem"
                fontWeight={500}
              >
                <Box
                  component="img"
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/552537a730cd8d509b9bbf6fa1f0d4c3f97a8ada?placeholderIfAbsent=true"
                  alt="About icon"
                  sx={{ width: 14, height: 'auto' }}
                />
                <span>About Us</span>
              </Box>

              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary.dark"
                mt={4}
                sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, lineHeight: 1.25 }}
              >
                Empowering Students Through Peer-to-Peer Learning
              </Typography>

              <Typography
                mt={3}
                color="text.secondary"
                fontSize="1.125rem"
                lineHeight={1.75}
              >
                At SkillForge, we believe that learning is most effective when it's shared.
                Our platform connects university students who want to learn new skills with
                peers who already master those skills. Through mentorship, live workshops,
                and hands-on experience, we create a collaborative learning environment that
                makes education practical, engaging, and accessible.
              </Typography>

              <Button
                variant="contained"
                size="large"
                sx={{
                  mt: 4,
                  backgroundColor: 'skyblue',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'deepskyblue',
                  },
                }}
              >
                Join Now
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default AboutUs;
