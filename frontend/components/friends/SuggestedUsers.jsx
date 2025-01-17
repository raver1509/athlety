import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';

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
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <List>
        {suggestedUsers.length === 0 ? (
          <ListItem>No suggested users</ListItem>
        ) : (
          suggestedUsers.map((user) => (
            <ListItem key={user.id}>
              <ListItemText primary={user.username} />
              <Button
                variant="contained"
                color="primary"
                onClick={() => sendFriendRequest(user.id)}
              >
                Send Request
              </Button>
            </ListItem>
          ))
        )}
      </List>
    </div>
  );
};

export default SuggestedUsers;
