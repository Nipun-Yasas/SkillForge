"use client";

import React, { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import NotificationsIcon from "@mui/icons-material/Notifications";
import ClearIcon from "@mui/icons-material/Clear";
import Link from "next/link";

const initialNotifications = [
  {
    id: 1,
    message: "John Smith requested approval for leave",
    time: "2 hours ago",
    read: false,
    link: "/leave/reviewLeaves",
  },
  {
    id: 2,
    message: "New timesheet submission from Sarah Johnson",
    time: "Yesterday",
    read: false,
    link: "/timesheet/reviewTimesheets",
  },
  {
    id: 3,
    message: "Monthly report is ready for review",
    time: "2 days ago",
    read: true,
    link: "/dashboard",
  },
  {
    id: 4,
    message: "Team meeting scheduled for tomorrow at 10 AM",
    time: "3 days ago",
    read: true,
    link: "/event",
  },
];

const NotificationMenu = () => {
  // State for notifications
  const [notifications, setNotifications] = useState(initialNotifications);
  
  // State for managing the dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Get count of unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Open notifications dropdown
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close notifications dropdown
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  // Clear all notifications
  const handleClearAll = () => {
    setNotifications([]);
  };

  // Remove a single notification
  const handleRemoveNotification = (id) => (event) => {
    event.preventDefault(); // Prevent default behavior
    event.stopPropagation(); // Prevent event from bubbling up to parent elements
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Navigate to notification destination and mark as read
  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
    handleCloseMenu();
  };

  // Generate menu content based on notifications state
  const getMenuContent = () => {
    if (notifications.length === 0) {
      return [
        <Box key="header" sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
        </Box>,
        <Divider key="divider-1" />,
        <Box key="empty" sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No notifications
          </Typography>
        </Box>
      ];
    }

    // Create an array of elements for the menu
    return [
      // Header
      <Box key="header" sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Notifications
        </Typography>
        {unreadCount > 0 && (
          <Typography variant="body2" color="error" sx={{ fontWeight: 500 }}>
            {unreadCount} new
          </Typography>
        )}
      </Box>,
      
      // Divider
      <Divider key="divider-1" />,
      
      // Notification List
      <List key="notification-list" sx={{ p: 0, maxHeight: 320, overflow: "auto" }}>
        {notifications.map((notification) => (
          <ListItem 
            key={notification.id}
            component={Link}
            href={notification.link}
            onClick={() => handleNotificationClick(notification.id)}
            sx={{ 
              px: 2, 
              py: 1.5,
              bgcolor: notification.read ? "transparent" : "rgba(232, 10, 77, 0.05)",
              borderLeft: notification.read ? "none" : "3px solid #e80a4d",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
              textDecoration: "none", 
              color: "inherit"
            }}
            secondaryAction={
              <IconButton 
                edge="end" 
                size="small" 
                onClick={handleRemoveNotification(notification.id)}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemText
              primary={notification.message}
              secondary={notification.time}
              primaryTypographyProps={{
                variant: "body2",
                fontWeight: notification.read ? 400 : 600,
                color: "text.primary",
              }}
              secondaryTypographyProps={{
                variant: "caption",
                color: "text.secondary",
              }}
            />
          </ListItem>
        ))}
      </List>,
      
      // Divider
      <Divider key="divider-2" />,
      
      // Footer with Buttons
      <Box key="footer" sx={{ p: 1.5, display: "flex", justifyContent: "space-between" }}>
        <Button 
          size="small" 
          onClick={handleMarkAllAsRead}
          disabled={unreadCount === 0}
          sx={{ 
            color: "#e80a4d",
            "&.Mui-disabled": {
              color: "rgba(0, 0, 0, 0.26)"
            }
          }}
        >
          Mark all as read
        </Button>
        <Button 
          size="small" 
          onClick={handleClearAll}
          sx={{ color: "text.secondary" }}
        >
          Clear all
        </Button>
      </Box>
    ];
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={handleOpenMenu}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon sx={{ color: "text.secondary" }} />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Notifications Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
            mt: 1.5,
            width: 360,
            maxHeight: 480,
            borderRadius: 2,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {getMenuContent()}
      </Menu>
    </>
  );
};

export default NotificationMenu;