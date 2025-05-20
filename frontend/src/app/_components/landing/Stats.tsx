'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
interface StatItemProps {
  icon: string;
  number: string;
  text: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, number, text }) => (
  <Box textAlign="center" display="flex" flexDirection="column" alignItems="center">
    <Box
      component="img"
      src={icon}
      alt="Stat icon"
      sx={{
        width: { xs: 48, md: 64 },
        height: { xs: 48, md: 64 },
        borderRadius: 2,
        mb: 2,
      }}
    />
    <Typography variant="h5" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
      {number}
    </Typography>
    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' }, mt: 1 }}>
      {text}
    </Typography>
  </Box>
);

export default function Stats() {
  return (
    <Box
      width='100%'
      id="stats"
      sx={{
        bgcolor:'featureColor.main',
        px: 2,
      }}
    >
      <Box
      width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        justifyItems='center'
        py={{ xs: 2, md: 3 }}
        px={{ xs: 2, md: 20 }}
      >
        <Box
          sx={{
            width: '100%',
            p: { xs: 2, md: 3 },
            borderRadius: '10%',
            backgroundImage: "url('/feature.svg')",
            backgroundRepeat: 'no-repeat',
            objectFit: 'cover',
            backgroundSize: 'cover',
          }}
        >
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center',justifyContent: 'space-evenly'}}>
           
              <StatItem
                icon="https://cdn.builder.io/api/v1/image/assets/TEMP/daec5606ee8aa45277cec586b290bb1cf3348ea3?placeholderIfAbsent=true"
                number="3K+"
                text="Successfully Trained"
              />
              <StatItem
                icon="https://cdn.builder.io/api/v1/image/assets/TEMP/ad455c70ebdfbb477a78022db30e563f3fed5e46?placeholderIfAbsent=true"
                number="15K+"
                text="Classes Completed"
              />
              <StatItem
                icon="https://cdn.builder.io/api/v1/image/assets/TEMP/afe3b919fa5b81676d6a6d8868d908025136d798?placeholderIfAbsent=true"
                number="97K+"
                text="Satisfaction Rate"
              />
              <StatItem
                icon="https://cdn.builder.io/api/v1/image/assets/TEMP/8709b69cce85b3d079e8c6c9bf0810adf3fb225b?placeholderIfAbsent=true"
                number="102K+"
                text="Students Community"
              />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
