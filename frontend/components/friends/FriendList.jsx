import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';

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

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <List>
        {friends.length === 0 ? (
          <ListItem>No friends yet</ListItem>
        ) : (
          friends.map((friend) => (
            <ListItem key={friend.id}>
              <ListItemText primary={friend.username} />
              <Button variant="contained" color="secondary">
                Remove
              </Button>
            </ListItem>
          ))
        )}
      </List>
    </div>
  );
};

export default FriendList;
