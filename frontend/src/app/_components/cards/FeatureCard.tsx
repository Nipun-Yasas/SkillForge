import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

type Feature = {
  icon: string;
  title: string;
  description: string;
};

const FeatureCard: React.FC<Feature> = ({ icon, title, description }) => {
  return (
    <Card
      className="feature-card"
      elevation={3}
      sx={{
        p: 2,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxHeight: 500,
        maxWidth: 300,
        textAlign: "center",
      }}
    >
      <Box
        component="img"
        src={icon}
        alt={title}
        sx={{
          maxwidth: 100,
          maxheight: 100,
          borderRadius: "45px",
          objectFit: "contain",
          mb: 3,
        }}
      />
      <Typography
        variant="h6"
        fontWeight="bold"
        color="primary.dark"
        gutterBottom
      >
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
          backgroundColor: "cyan.500",
          color: "white",
          textTransform: "none",
        }}
        endIcon={<ArrowForwardIcon />}
      >
        View Details
      </Button>
    </Card>
  );
};

export default FeatureCard;
