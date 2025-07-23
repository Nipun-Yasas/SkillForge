import { type Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ForumIcon from '@mui/icons-material/Forum';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BookIcon from '@mui/icons-material/Book';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: ' Learning Hub',
  },
  {
    segment: 'dashboard',
    title: 'Home Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'profile',
    title: 'Profile Settings',
    icon: <AccountCircleIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: ' Connect & Learn',
  },
  {
    segment: 'findmentor',
    title: 'Discover Mentors',
    icon: <PersonSearchIcon />,
  },
  {
    segment: 'courses',
    title: 'Learning Courses',
    icon: <BookIcon />,
  },
  {
    segment: 'progress',
    title: 'My Progress',
    icon: <TrendingUpIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Community',
  },
  {
    segment: 'discussion',
    title: 'Forum Discussions',
    icon: <ForumIcon />,
  },
  {
    segment: 'questions',
    title: 'Help & Q&A',
    icon: <HelpOutlineIcon />,
  },
  {
    segment: 'chat',
    title: 'Direct Messages',
    icon: <ChatBubbleOutlineIcon />,
  },
];

export default NAVIGATION;