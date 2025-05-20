"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {Link as MuiLink}  from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Footer(){
  const isMobile = useMediaQuery("md");

  return (
    <Box
      id="Footer"
      component="footer"
      sx={{
        px: { xs: 2, md: 5 },
        pt: { xs: 5, md: 5 },
        pb: { xs: 5, md: 5 },
        width: "100%",
        bgcolor: "footerColor.main",
      }}
    >
      <Grid container spacing={5} direction={isMobile ? "column" : "row"}>
        
          <Box>
            <Typography variant="h6">
              Contact
            </Typography>
            <Typography
              component="address"
              sx={{ mt: 4, fontStyle: "normal" }}
              variant="body1"
            >
              2972 Westheimer Rd. Santa Ana, Illinois 85486
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6">
              Company
            </Typography>
            <Box mt={3} display="flex" flexDirection="column" gap={2}>
              <MuiLink href="#about" color="white" underline="hover">
                About Us
              </MuiLink>
              <MuiLink href="#teach" color="white" underline="hover">
                Teach on Byway
              </MuiLink>
              <MuiLink href="#blog" color="white" underline="hover">
                Blog
              </MuiLink>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6">
              Support
            </Typography>
            <Box mt={3} display="flex" flexDirection="column" gap={2}>
              <MuiLink href="#help" color="white" underline="hover">
                Help and Support
              </MuiLink>
              <MuiLink href="#terms" color="white" underline="hover">
                Terms
              </MuiLink>
              <MuiLink href="#privacy" color="white" underline="hover">
                Privacy Policy
              </MuiLink>
            </Box>
          </Box>
        </Grid>
    </Box>
  );
};

