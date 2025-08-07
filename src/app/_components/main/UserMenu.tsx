"use client";

import { useState, MouseEvent } from "react";
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleCloseMenu();
  };

  if (!user) {
    return null;
  }


  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Divider orientation="vertical" flexItem />

      <Box
        sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        onClick={handleOpenMenu}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar
            sx={{ 
              width: 44, 
              height: 44,
              background: 'linear-gradient(135deg, #007BFF 0%, #6A0DAD 100%)',
              fontSize: '1.2rem',
              fontWeight: 700,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Typography
            variant="body1"
            color="#737791"
            fontFamily="'Poppins-Medium', Helvetica"
            fontWeight={500}
          >
            {user.name.split(' ')[0]}
          </Typography>
          <KeyboardArrowDownIcon
            sx={{
              color: "text.secondary",
              fontSize: 11,
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.2s",
            }}
          />
        </Stack>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        onClick={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
            mt: 1.5,
            width: 200,
            borderRadius: 2,
            "& .MuiMenuItem-root": {
              px: 2,
              py: 1.5,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Link href="/profile" passHref legacyBehavior>
          <MenuItem component="a">
            <ListItemIcon>
              <PersonOutlineIcon fontSize="small" sx={{ color: "#737791" }} />
            </ListItemIcon>
            <Typography variant="body2" color="text.primary">
              My Profile
            </Typography>
          </MenuItem>
        </Link>

        <Link href="/settings" passHref legacyBehavior>
          <MenuItem component="a">
            <ListItemIcon>
              <SettingsIcon fontSize="small" sx={{ color: "#737791" }} />
            </ListItemIcon>
            <Typography variant="body2" color="text.primary">
              Settings
            </Typography>
          </MenuItem>
        </Link>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={handleLogout} sx={{ color: "#e80a4d" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: "#e80a4d" }} />
          </ListItemIcon>
          <Typography variant="body2">Log out</Typography>
        </MenuItem>
      </Menu>
    </Stack>
  );
};

export default UserMenu;
