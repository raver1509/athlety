// components/friends/SendFriendRequest.jsx

import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';

const SendFriendRequest = () => {
  const [toUser, setToUser] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const csrfToken = getCsrfToken();

      // Wysyłanie zaproszenia
      const response = await fetch('http://localhost:8000/api/users/friends/request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ to_user: toUser }), // Wysyłamy ID użytkownika, do którego wysyłamy zaproszenie
      });

      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }

      setSuccessMessage('Friend request sent successfully!');
      setError(null); // Resetowanie błędu
    } catch (error) {
      console.error('Failed to send friend request:', error);
      setError('Failed to send friend request');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="User ID to send request"
          variant="outlined"
          value={toUser}
          onChange={(e) => setToUser(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          Send Friend Request
        </Button>
      </form>
    </div>
  );
};

export default SendFriendRequest;
