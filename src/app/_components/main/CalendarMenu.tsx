"use client";

import React, { useState, MouseEvent } from "react";
import {
  Box,
  Button,
  Divider,
  Menu,
  Stack,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventIcon from "@mui/icons-material/Event";
import Link from "next/link";

// Define the type for an event
interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
}

const CalendarMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const upcomingEvents: EventItem[] = [
    {
      id: 1,
      title: "Team Standup",
      date: "Today",
      time: "10:00 AM - 10:30 AM",
      location: "Meeting Room A",
    },
    {
      id: 2,
      title: "Project Review",
      date: "Today",
      time: "2:00 PM - 3:00 PM",
      location: "Conference Room",
    },
    {
      id: 3,
      title: "Client Meeting",
      date: "Tomorrow",
      time: "11:00 AM - 12:00 PM",
      location: "Virtual",
    },
  ];

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleOpenMenu}>
        <CalendarMonthIcon sx={{ color: "text.secondary" }} />
      </IconButton>

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
            width: 320,
            maxHeight: 480,
            borderRadius: 2,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Calendar
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ p: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1.5, color: "text.secondary" }}
          >
            Upcoming Events
          </Typography>

          {upcomingEvents.length > 0 ? (
            <Stack spacing={1.5}>
              {upcomingEvents.map((event) => (
                <Paper
                  key={event.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: "rgba(0, 0, 0, 0.02)",
                    border: "1px solid rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <EventIcon sx={{ color: "#e80a4d", mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {event.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        {event.date} • {event.time}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Box sx={{ py: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No upcoming events
              </Typography>
            </Box>
          )}
        </Box>

        <Divider />

        <Box
          sx={{
            p: 1.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            size="small"
            component={Link}
            href="/calendar"
            sx={{ color: "#e80a4d", textTransform: "none" }}
            onClick={handleCloseMenu}
          >
            View Calendar
          </Button>
          <Button
            size="small"
            component="a"
            href="https://calendar.google.com/calendar/u/0/r?tab=rc"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "text.secondary", textTransform: "none" }}
            onClick={handleCloseMenu}
          >
            Open Google Calendar
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default CalendarMenu;
