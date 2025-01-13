// components/friends/SearchUsers.jsx

import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';

const SearchUsers = () => {
  const [userId, setUserId] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const csrfToken = getCsrfToken();
      const response = await fetch(`http://localhost:8000/api/users/${userId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('User not found');
      }

      const data = await response.json();
      setSearchedUser(data);
      console.log(data)
    } catch (error) {
      console.error('Failed to search user:', error);
      setSearchedUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!searchedUser) return;

    try {
      const csrfToken = getCsrfToken();
      const response = await fetch(`http://localhost:8000/api/users/friends/request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ to_user: searchedUser.id }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }

      alert('Friend request sent!');
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  return (
    <div>
      <TextField
        label="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleSearch} variant="contained" color="primary" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Search'}
      </Button>

      {searchedUser && (
        <List>
          <ListItem>
            <ListItemText primary={searchedUser.id} />
            <Button
              onClick={handleSendRequest}
              variant="contained"
              color="secondary"
              disabled={loading}
            >
              Send Request
            </Button>
          </ListItem>
        </List>
      )}

      {!searchedUser && !loading && userId && (
        <div>No user found with this ID</div>
      )}
    </div>
  );
};

export default SearchUsers;
