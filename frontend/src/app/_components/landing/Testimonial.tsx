"use client";

import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";

// Testimonial type
interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

// BackgroundShape props
interface BackgroundShapeProps {
  className?: string;
  color: string;
  opacity: number | string;
  width: number;
  height: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

const testimonialData: Testimonial[] = [
  {
    quote:
      "Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque dignissim enim. Amet consectetur adipiscing",
    author: "Kathy Sullivan",
    role: "CEO at Ordian IT",
  },
  {
    quote:
      "Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque dignissim enim. Amet consectetur adipiscing",
    author: "Elsie Stroud",
    role: "CEO at Edwards",
  },
  {
    quote:
      "Lorem ipsum dolor sit amet, elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Orci nulla pellentesque dignissim enim. Amet consectetur adipiscing",
    author: "Kathy Sullivan",
    role: "CEO at Ordian IT",
  },
];

const Testimonials: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      id="testimonials"
      py={12}
      px={3}
      bgcolor="white"
      position="relative"
      display="flex"
      justifyContent="center"
    >
      <Box maxWidth="1350px" width="100%">
        <TestimonialHeader />

        <Grid
          container
          spacing={4}
          justifyContent="center"
          mt={6}
          flexWrap={isMobile ? "wrap" : "nowrap"}
        >
          {testimonialData.map((testimonial, index) => (
            
              <TestimonialCard {...testimonial} />
            
          ))}
        </Grid>

        <BackgroundShape
          className="shape1"
          color="#00B4D8"
          opacity={0.16}
          width={240}
          height={234}
          cx={120}
          cy={117}
          rx={120}
          ry={117}
        />
        <BackgroundShape
          className="shape2"
          color="#0077B6"
          opacity={0.05}
          width={192}
          height={197}
          cx={96}
          cy={98.5}
          rx={96}
          ry={98.5}
        />
      </Box>
    </Box>
  );
};

export default Testimonials;


export const TestimonialHeader: React.FC = () => {
  return (
    <Box textAlign="center">
      <Box
        sx={{
          px: 2,
          py: 0.5,
          bgcolor: "white",
          color: "cyan.500",
          fontSize: "0.875rem",
          borderRadius: 1,
          textTransform: "uppercase",
          display: "inline-block",
        }}
      >
        Testimonial
      </Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        color="primary.dark"
        mt={4}
        maxWidth="578px"
        mx="auto"
      >
        Creating A Community Of Life Long Learners.
      </Typography>
    </Box>
  );
};



interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 4,
        width: 350,
        bgcolor: "blue.50",
        position: "relative",
      }}
    >
      <Box
        component="img"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b613640e22bf34bbbee18e0ecf20e976c22f9909"
        alt="Quote icon"
        sx={{
          width: 70,
          height: 46,
          position: "absolute",
          top: -29,
          left: -19,
        }}
      />
      <Typography variant="body1" color="text.secondary" mb={2}>
        “{quote}”
      </Typography>
      <Typography variant="h6" fontWeight="bold" color="primary.dark" mt={2}>
        {author}
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={1}>
        {role}
      </Typography>
    </Paper>
  );
};


interface BackgroundShapeProps {
  className?: string;
  color: string;
  opacity: number | string;
  width: number;
  height: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export const BackgroundShape: React.FC<BackgroundShapeProps> = ({
  className,
  color,
  opacity,
  width,
  height,
  cx,
  cy,
  rx,
  ry,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        position: "absolute",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={color}
        fillOpacity={+opacity}
      />
    </svg>
  );
};
