import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OptionsMenu from './OptionsMenu';
import MenuContent from './MenuContent';
import { useState, useEffect } from 'react';
import { getCsrfToken } from '../../utils/getCsrfToken';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    backgroundColor: 'rgba(0, 0, 0, 0.98)', // Czarne tło z przezroczystością
    color: '#ffffff',
    borderRadius: '0 12px 12px 0', // Zaokrąglone rogi
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Efekt cienia
    border: '1px solid rgba(255, 255, 255, 0.1)', // Delikatna obramówka
    padding: theme.spacing(2),
    boxSizing: 'border-box',
    overflow: 'hidden', // Usuń niepotrzebne przewijanie
  },
}));

const Navbar = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const csrfToken = getCsrfToken();
    fetch('http://localhost:8000/api/authentication/user/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
      })
      .catch((err) => {
        console.error('An error occurred while fetching the user data', err);
      });
  }, []);

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'block', md: 'block' },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          marginBottom: 2,
          fontWeight: 'bold',
          fontFamily: `'Montserrat', sans-serif`, // Nowoczesna czcionka
          color: 'rgba(255, 255, 255, 0.9)', // Subtelny odcień bieli
          textTransform: 'uppercase', // Duże litery
          letterSpacing: '2px', // Delikatne odstępy między literami
          userSelect: 'none', // Tekst nie może być zaznaczony
        }}
      >
        ATHLETY
      </Typography>
      <Divider
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // Delikatna linia
          marginBottom: 2,
        }}
      />
      <MenuContent />
      <Divider
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          marginTop: 2,
        }}
      />
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Avatar
          alt="Riley Carter"
          sx={{
            width: 42,
            height: 42,
            border: '2px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#9e9e9e',
            color: 'white',
          }}
        >
          <AccountCircleIcon sx={{ fontSize: '30px' }} />
        </Avatar>
         <Box sx={{ mr: 'auto' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              lineHeight: '20px',
              color: '#ffffff', 
            }}
          >
            {firstName} {lastName} 
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)', 
            }}
          >
            {email}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}

export default Navbar;