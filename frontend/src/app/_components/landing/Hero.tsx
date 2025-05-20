import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Hero() {
  return (
    <Box 
      width='100%'
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        py: 8,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          backgroundColor: 'shapeColor.main',
          borderRadius: "50%",
          height: 400,
          width: 500,
          top: { xs: 400, md: 120 },
          left: { xs: "-30%", md: -87 },
          zIndex: 0,
          opacity: 0.5,
        }}
        aria-hidden="true"
      />
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          textAlign: { xs: "center", md: "left" },
          position: "relative",
          zIndex: 2,
          p: 2.5,
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          color="text.primary"
          sx={{ lineHeight: 1.2 }}
        >
          Unlock Your Potential with Peer-to-Peer Learning!
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          Join a community of university students exchanging skills through mentorship, live workshops, and hands-on experience.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Link href="/signUp" passHref>
            <Button variant="contained" size="large">
              Start Learning
            </Button>
          </Link>
        </Box>
      </Box>
      <Box
  sx={{
    width: { xs: "100%", md: "50%" },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
    mt: { xs: 4, md: 0 },
  }}
>
  <Box
    sx={{
      position: "absolute",
      backgroundColor: 'shapeColor.main',
      borderRadius: '50% 60% 10% 90% / 20% 30% 60% 80%',
      height: 300,
      width: 250,
      top: "60%",
      left: "40%",
      transform: "translate(-50%, -50%)",
      zIndex: 0,
      opacity: 0.4,
    }}
    aria-hidden="true"
  />

  <Box
    sx={{
      position: "absolute",
      width: 400,
      height: 500,
      backgroundColor: 'shapeColor.main',
      borderRadius: '70% 10% 80% 20% / 20% 10% 90% 100%',
      top: "45%",
      left: "70%",
      transform: "translate(-50%, -50%)",
      zIndex: 1,
    }}
  />

  <Image
    src="/person.svg"
    alt="Hero illustration"
    width={300}
    height={300}
    priority
    style={{
      position: "relative",
      zIndex: 2,
    }}
  />
</Box>

    </Box>
  );
}
