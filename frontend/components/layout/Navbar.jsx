import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import OptionsMenu from './OptionsMenu';
import MenuContent from './MenuContent';

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

export default function Navbar() {
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
          src="/static/images/avatar/7.jpg"
          sx={{
            width: 42,
            height: 42,
            border: '2px solid rgba(255, 255, 255, 0.3)', // Obramówka wokół avatara
          }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              lineHeight: '20px',
              color: '#ffffff', // Biały tekst
            }}
          >
            Riley Carter
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)', // Przygaszony biały tekst
            }}
          >
            riley@email.com
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
