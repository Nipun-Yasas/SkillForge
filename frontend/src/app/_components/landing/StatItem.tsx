import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import CountUp from 'react-countup';

interface StatItemProps {
  icon: string;
   number: number;
  text: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon, number, text }) =>(
  <Box
    textAlign="center"
    display="flex"
    flexDirection="column"
    alignItems="center"
  >
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
    <Typography
      variant="h5"
      fontWeight="bold"
      sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
    >
      <CountUp end={number} duration={2} separator="," />+
    </Typography>
    <Typography
      variant="body2"
      sx={{ fontSize: { xs: "0.75rem", md: "0.875rem" }, mt: 1 }}
    >
      {text}
    </Typography>
  </Box>
);

export default StatItem;