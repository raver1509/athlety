import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';

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
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <List>
        {requests.length === 0 ? (
          <ListItem>No incoming friend requests</ListItem>
        ) : (
          requests.map((request) => (
            <ListItem key={request.id}>
              <ListItemText primary={`Request from ${request.from_user_username}`} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleRequest(request.id, 'accept')}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRequest(request.id, 'reject')}
              >
                Reject
              </Button>
            </ListItem>
          ))
        )}
      </List>
    </div>
  );
};

export default IncomingFriendRequests;
