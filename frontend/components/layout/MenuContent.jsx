import { useLocation, Link } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import EventIcon from '@mui/icons-material/Event';
import MessageIcon from '@mui/icons-material/Message';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, route: '/' },
  { text: 'Events', icon: <EventIcon />, route: '/events' },
  { text: 'Messages', icon: <MessageIcon />, route: '/messages' },
  { text: 'Statistics', icon: <AnalyticsIcon />, route: '/statistics' },
  { text: 'Friends', icon: <GroupAddIcon />, route: '/friends' },
];

export default function MenuContent() {
  const location = useLocation();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between', color: 'white' }}>
      <List dense>
        {mainListItems.map((item, index) => {
          const isActive = location.pathname === item.route;
          return (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <Link to={item.route} className="link">
                <ListItemButton
                  sx={{
                    color: 'white',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    borderRadius: isActive ? '12px' : '0',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    transition: 'background-color 0.3s, border-radius 0.3s',
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={500}
                        sx={{
                          color: 'white',
                        }}
                      >
                        {item.text}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
}
