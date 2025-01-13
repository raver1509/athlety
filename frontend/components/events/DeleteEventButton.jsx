import React from 'react';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCsrfToken } from '../../utils/getCsrfToken';

const DeleteEventButton = ({ eventId, onEventDeleted }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const csrfToken = getCsrfToken();
      const response = await fetch(`http://localhost:8000/api/events/${eventId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      });

      if (response.ok) {
        alert('Event deleted successfully!');
        onEventDeleted(eventId);
      } else {
        const error = await response.json();
        alert('Failed to delete event: ' + error.detail);
      }
    }
  };

  return (
    <IconButton
      color="error"
      onClick={handleDelete}
      aria-label="delete"
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'red',
        width: '30px',
        height: '30px',
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: 'darkred',
        },
        padding: 0,
      }}
    >
      <DeleteIcon sx={{ color: 'white', fontSize: '20px' }} />
    </IconButton>
  );
};

export default DeleteEventButton;
