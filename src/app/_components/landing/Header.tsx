"use client";

import Link from "next/link";
import { useState } from "react";

import { ThemeSwitcher } from "@toolpad/core";

import { useAuth } from "@/contexts/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { BookOpen, LogOut, Settings, User, Users } from "lucide-react";

const drawerWidth = 240;

export default function DrawerAppBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleUserMenuClose();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <BookOpen size={32} color="#007BFF" />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SkillForge
          </Typography>
        </Box>
        <ThemeSwitcher />
      </Box>
      <Divider />
      <Box sx={{ py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="body1" sx={{ color: "textblack.main" }}>
          <Link
            href="#about"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            About Us
          </Link>
        </Typography>
        <Typography variant="body1" sx={{ color: "textblack.main" }}>
          <Link
            href="#features"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Features
          </Link>
        </Typography>
        <Typography variant="body1" sx={{ color: "textblack.main" }}>
          <Link
            href="/findmentor"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Find Mentors
          </Link>
        </Typography>
        {user && (
          <Typography variant="body1" sx={{ color: "textblack.main" }}>
            <Link
              href="/dashboard"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Dashboard
            </Link>
          </Typography>
        )}
      </Box>

      {/* Mobile Auth Buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
        {user ? (
          <>
            <Typography variant="body2" sx={{ color: "textblack.main", mb: 1 }}>
              Welcome, {user.name}!
            </Typography>
            <Button
              onClick={handleLogout}
              variant="outlined"
              size="small"
              sx={{ color: "error.main", borderColor: "error.main" }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login" passHref style={{ textDecoration: "none" }}>
              <Button variant="outlined" size="small">
                Login
              </Button>
            </Link>
            <Link href="/signup" passHref style={{ textDecoration: "none" }}>
              <Button variant="contained" size="small">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        component="nav"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 123, 255, 0.1)",
        }}
        elevation={0}
      >
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

          {/* Logo and Brand */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <BookOpen size={32} color="#007BFF" />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  SkillForge
                </Typography>
              </Link>
            </motion.div>
          </Box>

          {/* Mobile Logo */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", sm: "none" },
              alignItems: "center",
              gap: 1,
            }}
          >
            <BookOpen size={28} color="#007BFF" />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SkillForge
            </Typography>
          </Box>

          {/* Navigation */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: { sm: 2, md: 3 },
              alignItems: "center",
            }}
          >
            <ThemeSwitcher />

            <Link href="#about" style={{ textDecoration: "none" }}>
              <Typography
                variant="body1"
                sx={{
                  color: "textblack.main",
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.3s ease",
                }}
              >
                About
              </Typography>
            </Link>

            <Link href="#features" style={{ textDecoration: "none" }}>
              <Typography
                variant="body1"
                sx={{
                  color: "textblack.main",
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.3s ease",
                }}
              >
                Features
              </Typography>
            </Link>

            <Link href="/findmentor" style={{ textDecoration: "none" }}>
              <Typography
                variant="body1"
                sx={{
                  color: "textblack.main",
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Users size={16} />
                Find Mentors
              </Typography>
            </Link>

            {/* Authentication Buttons */}
            {user ? (
              <>
                <IconButton onClick={handleUserMenuOpen} sx={{ p: 0, ml: 1 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background:
                        "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                      fontSize: "1rem",
                      fontWeight: 600,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleUserMenuClose}>
                    <Link
                      href="/dashboard"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <User size={16} />
                      Dashboard
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={handleUserMenuClose}>
                    <Link
                      href="/profile"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Settings size={16} />
                      Profile
                    </Link>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                    <LogOut size={16} />
                    <Box sx={{ ml: 1 }}>Logout</Box>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Link href="/login" passHref style={{ textDecoration: "none" }}>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: "primary.main",
                      color: "primary.main",
                      "&:hover": {
                        borderColor: "secondary.main",
                        color: "secondary.main",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Link>

                <Link
                  href="/signup"
                  passHref
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      background:
                        "linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #0056CC 0%, #4A0080 100%)",
                        transform: "translateY(-1px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
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
