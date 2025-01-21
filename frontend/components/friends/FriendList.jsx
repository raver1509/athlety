import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';
import { styled } from '@mui/system';
import './FriendList.css';

const StyledButton = styled(Button)({
  color: '#000',
  border: '1px solid #000',
  backgroundColor: 'transparent',
  borderRadius: '5px',
  padding: '6px 12px',
  fontSize: '14px',
  fontWeight: 500,
  textTransform: 'none',
  '&:hover': {
    color: '#fff',
    backgroundColor: '#000',
    transform: 'scale(1.05)',
  },
});

const FriendListContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  backgroundColor: '#f4f4f4',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  width: '100%', // Ustawiamy szerokość na 100% dla pełnej szerokości kontenera
  height: '100%', // Ustawiamy wysokość na 100% kontenera
  boxSizing: 'border-box',
  margin: 0, // Usuń margines, aby kontener wypełniał całą przestrzeń
  flexGrow: 1, // Pozwala rozciągnąć kontener na dostępną przestrzeń
});

const Title = styled(Typography)({
  fontSize: '24px',
  fontWeight: 600,
  marginBottom: '20px',
  color: '#333',
  textAlign: 'center',
});

const ErrorMessage = styled('div')({
  color: 'red',
  textAlign: 'center',
  marginBottom: '15px',
});

const NoFriendsItem = styled(ListItem)({
  justifyContent: 'center',
  color: '#555',
  fontStyle: 'italic',
});

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const csrfToken = getCsrfToken();

        const response = await fetch('http://localhost:8000/api/users/friends/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch friends');
        }

        const data = await response.json();
        setFriends(data);
      } catch (error) {
        console.error('Failed to fetch friends:', error);
        setError('Failed to fetch friends');
      }
    };

    fetchFriends();
  }, []);

  const handleRemoveFriend = async (friendId) => {
    try {
      const csrfToken = getCsrfToken();

      const response = await fetch(`http://localhost:8000/api/users/friends/remove/${friendId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to remove friend');
      }

      setFriends(friends.filter((friend) => friend.id !== friendId));
    } catch (error) {
      console.error('Failed to remove friend:', error);
      setError('Failed to remove friend');
    }
  };

  return (
    <FriendListContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Title variant="h4">Your Friends</Title>
      <List sx={{ width: '100%', flexGrow: 1, overflowY: 'auto' }}>
        {friends.length === 0 ? (
          <NoFriendsItem>
            <span>No friends yet</span>
          </NoFriendsItem>
        ) : (
          friends.map((friend) => (
            <ListItem key={friend.id} sx={{ borderBottom: '1px solid #eee' }}>
              <ListItemText primary={friend.username} />
              <StyledButton onClick={() => handleRemoveFriend(friend.id)}>
                Remove
              </StyledButton>
            </ListItem>
          ))
        )}
      </List>
    </FriendListContainer>
  );
};

export default FriendList;
