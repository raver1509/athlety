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
  margin: '0', // Usunięcie marginesów
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

const IncomingFriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        const csrfToken = getCsrfToken();

        const response = await fetch('http://localhost:8000/api/users/friends/requests/incoming/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch incoming friend requests');
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch incoming friend requests:', error);
        setError('Failed to fetch incoming friend requests');
      }
    };

    fetchIncomingRequests();
  }, []);

  const handleRequest = async (requestId, action) => {
    const csrfToken = getCsrfToken();
    try {
      const response = await fetch(`http://localhost:8000/api/users/friends/request/${requestId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} friend request`);
      }

      setRequests(requests.filter(request => request.id !== requestId));
      alert(`Friend request ${action}ed successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
      alert(`Failed to ${action} friend request`);
    }
  };

  return (
    <FriendRequestContainer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Title variant="h4">Incoming Friend Requests</Title>
      <List sx={{ width: '100%', flexGrow: 1, overflowY: 'auto' }}>
        {requests.length === 0 ? (
          <NoRequestsItem>
            <span>No incoming friend requests</span>
          </NoRequestsItem>
        ) : (
          requests.map((request) => (
            <ListItem key={request.id} sx={{ borderBottom: '1px solid #eee' }}>
              <ListItemText primary={`Request from ${request.from_user_username}`} />
              <div className="button-container">
                <StyledButton onClick={() => handleRequest(request.id, 'accept')}>
                  Accept
                </StyledButton>
                <StyledButton onClick={() => handleRequest(request.id, 'reject')}>
                  Reject
                </StyledButton>
              </div>
            </ListItem>
          ))
        )}
      </List>
    </FriendRequestContainer>
  );
};

export default IncomingFriendRequests;
