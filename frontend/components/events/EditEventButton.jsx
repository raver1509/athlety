import React from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const EditEventButton = ({ eventId, onEditClick }) => {
  return (
    <IconButton
      color="primary"
      onClick={() => onEditClick(eventId)}
      aria-label="edit"
      sx={{
        position: 'absolute',
        top: 10,
        right: 45,
        backgroundColor: 'black',
        width: '30px',
        height: '30px',
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: '#7d7d7d',
        },
        padding: 0,
      }}
    >
      <EditIcon sx={{ color: 'white', fontSize: '20px' }} />
    </IconButton>
  );
};

export default EditEventButton;
