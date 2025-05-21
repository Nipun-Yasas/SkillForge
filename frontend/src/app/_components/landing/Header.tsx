"use client";

import { useState } from "react";
import Link from "next/link";

import { ThemeSwitcher } from "@toolpad/core";

import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface Props {
  window?: () => Window;
}

const drawerWidth = 240;

export default function DrawerAppBar(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image
          src="/logo.svg"
          alt="Logo"
          width={150}
          height={150}
          className="mt-2"
        />
        <ThemeSwitcher />
      </Box>
      <Divider />
      <Typography variant="body1" sx={{ my: 2, color: "textblack.main" }}>
        About
      </Typography>
      <Typography variant="body1" sx={{ my: 2, color: "textblack.main" }}>
        Features
      </Typography>
      <Typography variant="body1" sx={{ my: 2, color: "textblack.main" }}>
        Contact
      </Typography>
      <Box sx={{ display: "flex", gap: 1, justifyContent: "space-around" }}>
        <Button variant="contained" disableElevation disableRipple>
          <Typography>Login</Typography>
        </Button>
        <Button variant="outlined">
          <Typography>Sign in</Typography>
        </Button>
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <AppBar component="nav" sx={{ bgcolor: "landHeader.main" }} elevation={1}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: "textblack.main" }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "block" },
              alignItems: "center",
              mx: 0,
              px: 0,
            }}
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              width={110}
              height={100}
              className="mt-2"
               
            />
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: { sm: 1, md: 2 },
              alignItems: "center",
            }}
          >
            <ThemeSwitcher />
            <Typography variant="body1" sx={{ my: 2, color: "textblack.main" }}>
              <Link href="#about">About Us</Link>
            </Typography>
            <Typography variant="body1" sx={{ my: 2, color: "textblack.main" }}>
              <Link href="#features">Features</Link>
            </Typography>
            <Typography variant="body1" sx={{ my: 2, color: "textblack.main" }}>
              <Link href="#contact">Contact</Link>
            </Typography>
            <Button variant="contained" disableElevation disableRipple>
              <Typography>
                <Link href="/login">Login</Link>
              </Typography>
            </Button>
            <Button variant="outlined">
              <Typography>
                <Link href="/signup">Sign Up</Link>
              </Typography>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </>
  );
}
