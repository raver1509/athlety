import React, { useState } from 'react';
import { Button } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';

const RespondFriendRequest = ({ requestId }) => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleResponse = async (action) => {
    try {
      const csrfToken = getCsrfToken();

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
        throw new Error('Failed to respond to friend request');
      }

      setSuccessMessage(`Friend request ${action}ed successfully!`);
      setError(null);
    } catch (error) {
      console.error('Failed to respond to friend request:', error);
      setError('Failed to respond to friend request');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleResponse('accept')}
      >
        Accept
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleResponse('reject')}
      >
        Reject
      </Button>
    </div>
  );
};

export default RespondFriendRequest;
