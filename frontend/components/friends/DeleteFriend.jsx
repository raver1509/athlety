import React, { useState } from 'react';
import { Button } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';

const DeleteFriend = ({ friendId }) => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleDeleteFriend = async () => {
    try {
      const csrfToken = getCsrfToken();

      // Usuwanie znajomego
      const response = await fetch(`http://localhost:8000/api/users/friends/${friendId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete friend');
      }

      setSuccessMessage('Friend removed successfully!');
      setError(null);
    } catch (error) {
      console.error('Failed to delete friend:', error);
      setError('Failed to delete friend');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDeleteFriend}
      >
        Remove Friend
      </Button>
    </div>
  );
};

export default DeleteFriend;
