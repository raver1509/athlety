import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';

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

      // Update the state to remove the canceled request
      setRequests(requests.filter(request => request.to_user !== toUserId));
    } catch (error) {
      console.error('Failed to cancel friend request:', error);
      setError('Failed to cancel friend request');
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <List>
        {requests.length === 0 ? (
          <ListItem>No outgoing friend requests</ListItem>
        ) : (
          requests.map((request) => (
            <ListItem key={request.id}>
              <ListItemText primary={`Request to ${request.to_user_username}`} />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleCancelRequest(request.to_user)}
              >
                Cancel
              </Button>
            </ListItem>
          ))
        )}
      </List>
    </div>
  );
};

export default OutgoingFriendRequests;
