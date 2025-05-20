"use client";
import { useState } from "react";

import { ThemeSwitcher } from "@toolpad/core";

import Image from "next/image";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
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
        <Image src="/logo.svg" alt="Logo" width={150} height={150} />
        <ThemeSwitcher />
      </Box>
      <Divider />
      <List>
        <ListItem>
          <Typography variant="body1" sx={{ my: 2, color: "textblack.main" }}>
            MUI
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1" sx={{ my: 2, color: "textblack.main" }}>
            MUI
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1" sx={{ my: 2, color: "textblack.main" }}>
            MUI
          </Typography>
        </ListItem>
        <ListItem>
          <Button variant="contained">Login</Button>
        </ListItem>
        <ListItem>
          <Button>Sign in</Button>
        </ListItem>
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

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
            }}
          >
            <Image src="/logo.svg" alt="Logo" width={100} height={100} />
          </Box>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap:2,
              alignItems: "center",
            }}
          >
            <ThemeSwitcher />
            <Typography variant="body1" sx={{ my: 2, color: "textblack.main" }}>
              About
            </Typography>
            <Typography variant="body1" sx={{ my: 2, color: "textblack.main" }}>
              Features
            </Typography>
            <Typography variant="body1" sx={{ my: 2, color: "textblack.main" }}>
              Contact 
            </Typography>
            <Button variant="contained" disableElevation disableRipple>
              <Typography>Login</Typography>
            </Button>
            <Button variant="outlined">
              <Typography>Sign in</Typography>
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
