// components/friends/SuggestedUsers.jsx

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

        // Pobieranie sugestii użytkowników
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
        setSuggestedUsers(data); // Ustawienie danych sugestii
      } catch (error) {
        console.error('Failed to fetch suggested users:', error);
        setError('Failed to fetch suggested users');
      }
    };

    fetchSuggestedUsers();
  }, []);

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
                onClick={() => alert(`Sending friend request to ${user.username}`)} // Można dodać funkcję wysyłania zaproszenia
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
