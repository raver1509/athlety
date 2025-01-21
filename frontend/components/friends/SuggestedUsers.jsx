import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';
import { styled } from '@mui/system';
import './SuggestedUsers.css';

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

const SuggestedUsersContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
  backgroundColor: '#f4f4f4',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  width: '100%', // Rozciąganie na całą szerokość
  height: '100%', // Rozciąganie na całą wysokość
  boxSizing: 'border-box',
  margin: '0', // Usunięcie marginesów, aby kontener wypełniał dostępną przestrzeń
  flexGrow: 1, // Pozwala kontenerowi rozciągać się na całą dostępną przestrzeń
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

const NoSuggestedUsersItem = styled(ListItem)({
  justifyContent: 'center',
  color: '#555',
  fontStyle: 'italic',
});

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const csrfToken = getCsrfToken();
        const response = await fetch('http://localhost:8000/api/users/suggested-users/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch suggested users');
        }

        const data = await response.json();
        setSuggestedUsers(data);
      } catch (error) {
        console.error('Failed to fetch suggested users:', error);
        setError('Failed to fetch suggested users');
      }
    };

    fetchSuggestedUsers();
  }, []);

  const sendFriendRequest = async (toUserId) => {
    const csrfToken = getCsrfToken();
    try {
      const response = await fetch('http://localhost:8000/api/users/friends/request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ to_user: toUserId }),
      });

      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }

      alert('Friend request sent successfully!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    }
  };

  return (
    <SuggestedUsersContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Title variant="h4">Suggested Users</Title>
      <List>
        {suggestedUsers.length === 0 ? (
          <NoSuggestedUsersItem>
            <span>No suggested users</span>
          </NoSuggestedUsersItem>
        ) : (
          suggestedUsers.map((user) => (
            <ListItem key={user.id} sx={{ borderBottom: '1px solid #eee' }}>
              <ListItemText primary={user.username} />
              <StyledButton onClick={() => sendFriendRequest(user.id)}>
                Send Request
              </StyledButton>
            </ListItem>
          ))
        )}
      </List>
    </SuggestedUsersContainer>
  );
};

export default SuggestedUsers;
