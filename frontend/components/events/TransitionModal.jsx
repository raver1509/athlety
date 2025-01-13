import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function TransitionModal({ open, onClose, eventData, userData, isLoading }) {
  const { name, description, event_date, event_time, event_type, level, max_participants } = eventData || {};
  // const { first_name, last_name } = userData || {};

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              {name && (
                <Typography id="transition-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  {name}
                </Typography>
              )}
              {description && (
                <Typography id="transition-modal-description" sx={{ mt: 2, color: 'gray' }}>
                  {description}
                </Typography>
              )}
              {event_date && (
                <Typography sx={{ mt: 2 }}>
                  <strong>Date:</strong> {new Date(event_date).toLocaleDateString()}
                </Typography>
              )}
              {event_time && (
                <Typography sx={{ mt: 2 }}>
                  <strong>Time:</strong> {event_time}
                </Typography>
              )}
              {event_type && (
                <Typography sx={{ mt: 2 }}>
                  <strong>Type:</strong> {event_type}
                </Typography>
              )}
              {level && (
                <Typography sx={{ mt: 2 }}>
                  <strong>Level:</strong> {level}
                </Typography>
              )}
              {max_participants && (
                <Typography sx={{ mt: 2 }}>
                  <strong>Max Participants:</strong> {max_participants}
                </Typography>
              )}
              {/* {first_name && last_name && (
                <Typography sx={{ mt: 2 }}>
                  <strong>Created by:</strong> {first_name} {last_name}
                </Typography>
              )} */}
            </>
          )}
        </Box>
      </Fade>
    </Modal>
  );
}
