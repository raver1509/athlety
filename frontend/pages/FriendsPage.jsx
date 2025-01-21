import React from 'react';
import { AppBar, Button, Container, Grid, Toolbar, Typography, Box } from '@mui/material';
import FriendList from '../components/friends/FriendList';
import IncomingFriendRequests from '../components/friends/IncomingFriendRequests';
import OutgoingFriendRequests from '../components/friends/OutgoingFriendRequests';
import SuggestedUsers from '../components/friends/SuggestedUsers';
import SearchUsers from '../components/friends/SearchUsers'; // Nowy komponent do wyszukiwania użytkowników
import { styled } from '@mui/system';
import Navbar from '../components/layout/Navbar';

// Styl przycisku
const StyledButton = styled(Button)({
  color: '#fff',
  border: '1px solid #fff',
  backgroundColor: 'transparent',
  borderRadius: '5px',
  padding: '6px 12px',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'none',
  '&:hover': {
    color: '#000',
    backgroundColor: '#fff',
    transform: 'scale(1.05)',
  },
});

// Kontener dla całej strony
const MainContainer = styled(Container)({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)', // 2 kolumny
  gridTemplateRows: 'repeat(2, 1fr)', // 2 wiersze
  gap: '15px', // Zmniejszenie odstępu między komponentami
  height: 'calc(100vh - 80px)', // Wysokość na całą stronę z uwzględnieniem paska nawigacji
  marginTop: '20px',
});

// Kontener dla poszczególnych komponentów
const ComponentContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start', // Dodanie tej linii, aby komponenty były rozmieszczone od góry
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  padding: '15px', // Zmniejszenie paddingu
  height: '100%', // Pełna wysokość dla każdego kwadratu
  textAlign: 'center',
  overflow: 'auto', // Umożliwia przewijanie, jeśli zawartość jest za duża
  maxHeight: '350px', // Ustalamy maksymalną wysokość komponentu
});
// Tytuł
const Title = styled(Typography)({
  fontSize: '20px', // Zmniejszenie rozmiaru czcionki
  fontWeight: 600,
  marginBottom: '10px', // Zmniejszenie odstępu
  color: '#333',
  textAlign: 'center',
});

const FriendsPage = () => {
  return (
    <>
      <Navbar />
      <div className='friends global'>
        <AppBar position="sticky" sx={{ backgroundColor: '#000', marginBottom: '20px' }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Friends Management
            </Typography>
            {/* Jeśli nie chcesz przycisków nawigacji, możesz je usunąć */}
          </Toolbar>
        </AppBar>

        <MainContainer>
          {/* Wyświetlanie komponentów w równych kwadratach */}
          <ComponentContainer>
            <FriendList />
          </ComponentContainer>
          <ComponentContainer>
            <IncomingFriendRequests />
            <OutgoingFriendRequests />
          </ComponentContainer>
          <ComponentContainer>
            <SuggestedUsers />
          </ComponentContainer>
          <ComponentContainer>
            <SearchUsers />
          </ComponentContainer> 
        </MainContainer>
      </div>
    </>
  );
};

export default FriendsPage;
