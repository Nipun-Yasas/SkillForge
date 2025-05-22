import { ThemeSwitcher } from '@toolpad/core';
import Box from '@mui/material/Box';
import NotificationMenu from './NotificationMenu';
import CalendarMenu from './CalendarMenu';

export default function CustomToolbarActions() {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ThemeSwitcher />
        <NotificationMenu/>
        <CalendarMenu/>
      </Box>
    );
  }
  