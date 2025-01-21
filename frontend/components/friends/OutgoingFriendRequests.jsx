import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button, Typography } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';
import { styled } from '@mui/system';
import './FriendRequests.css';

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

const FriendRequestContainer = styled('div')({
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

const NoRequestsItem = styled(ListItem)({
  justifyContent: 'center',
  color: '#555',
  fontStyle: 'italic',
});

const OutgoingFriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOutgoingRequests = async () => {
      try {
        const csrfToken = getCsrfToken();

        const response = await fetch('http://localhost:8000/api/users/friends/requests/outgoing/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch outgoing friend requests');
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch outgoing friend requests:', error);
        setError('Failed to fetch outgoing friend requests');
      }
    };

    fetchOutgoingRequests();
  }, []);

  const handleCancelRequest = async (toUserId) => {
    try {
      const csrfToken = getCsrfToken();

      const response = await fetch(`http://localhost:8000/api/users/friends/requests/cancel/${toUserId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel friend request');
      }

      setRequests(requests.filter(request => request.to_user !== toUserId));
    } catch (error) {
      console.error('Failed to cancel friend request:', error);
      setError('Failed to cancel friend request');
    }
  };

  return (
    <FriendRequestContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Title variant="h4">Outgoing Friend Requests</Title>
      <List sx={{ width: '100%', flexGrow: 1, overflowY: 'auto' }}>
        {requests.length === 0 ? (
          <NoRequestsItem>
            <span>No outgoing friend requests</span>
          </NoRequestsItem>
        ) : (
          requests.map((request) => (
            <ListItem key={request.id} sx={{ borderBottom: '1px solid #eee' }}>
              <ListItemText primary={`Request to ${request.to_user_username}`} />
              <StyledButton onClick={() => handleCancelRequest(request.to_user)}>
                Cancel
              </StyledButton>
            </ListItem>
          ))
        )}
      </List>
    </FriendRequestContainer>
  );
};

export default OutgoingFriendRequests;
