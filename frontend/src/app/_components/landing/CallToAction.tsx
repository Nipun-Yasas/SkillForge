import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function Hero() {
  return (
    <Box
      width="100%"
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        py: 10,
        mt:2,
      }}
    >
      
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
              variant='h3'
              fontWeight="bold"
              color="primary.dark"
              sx={{ lineHeight: { xs: "58px", md: "59px" } }}
            >
              Start Learning Today with SkillForge!
            </Typography>

       <Typography
                variant="h6"
                component="strong"
                sx={{ display: "block", mb: 2 }}
              >
                Unlock new skills, connect with peers, and grow together!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                At SkillForge, learning is a two-way street. Whether you want to
                learn a new skill or share your expertise, our platform makes it
                easy, fun, and accessible.
              </Typography>

        <Box sx={{ mt: 4 }}>
          <Link href="/signUp" passHref>
            <Button variant="contained" size="large">
              Join Now
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
            width: 400,
            height: 500,
            backgroundColor: "shapeColor.main",
            borderRadius: "70% 10% 80% 20% / 20% 10% 90% 100%",
            top: "45%",
            left: "70%",
            transform: "translate(-50%, -50%)",
            zIndex: 1,
          }}
        />

        <Image
          src="/Footer.svg"
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
