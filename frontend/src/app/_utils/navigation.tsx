import { type Navigation } from '@toolpad/core/AppProvider';
import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ForumIcon from '@mui/icons-material/Forum';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const NAVIGATION: Navigation  = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'findmentor',
    title: 'Find a Mentor',
    icon: <PersonSearchIcon />,
  },
  {
    segment: 'discussion',
    title: 'Discussion',
    icon: <ForumIcon />,
  },
  {
    segment: 'questions',
    title: 'Questions',
    icon: <HelpOutlineIcon />,
  },
  {
    segment: 'chat',
    title: 'Chat',
    icon: <ChatBubbleOutlineIcon />,
  },
  {
    segment: 'likesvotes',
    title: 'Likes and Votes',
    icon: <FavoriteBorderIcon />,
  },
  
];

export default NAVIGATION;