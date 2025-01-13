import React, { useState, useEffect } from 'react';
import { Modal, TextField, Button, Box } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';

const EditEventModal = ({ open, handleClose, eventData, onEventUpdated }) => {
  const [editedEvent, setEditedEvent] = useState(eventData);

  useEffect(() => {
    if (eventData) {
      setEditedEvent(eventData);
    }
  }, [eventData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedEvent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const csrfToken = getCsrfToken();
    const response = await fetch(`http://localhost:8000/api/events/${editedEvent.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(editedEvent),
    });

    if (response.ok) {
      const updatedEvent = await response.json();
      onEventUpdated(updatedEvent); // Po aktualizacji, zaktualizuj stan w głównym komponencie
      handleClose(); // Zamknij modal
    } else {
      const error = await response.json();
      alert('Failed to update event: ' + error.detail);
    }
  };

  // Dodanie sprawdzenia czy eventData jest dostępne, aby uniknąć błędu
  if (!editedEvent) {
    return null; // Jeśli brak danych, nie renderujemy modalu
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <h2>Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Event Name"
            name="name"
            value={editedEvent.name || ''}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={editedEvent.description || ''}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Event Date"
            name="event_date"
            value={editedEvent.event_date || ''}
            onChange={handleChange}
            margin="normal"
            type="date"
          />
          <TextField
            fullWidth
            label="Event Time"
            name="event_time"
            value={editedEvent.event_time || ''}
            onChange={handleChange}
            margin="normal"
            type="time"
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={editedEvent.location || ''}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Event Type"
            name="event_type"
            value={editedEvent.event_type || ''}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Level"
            name="level"
            value={editedEvent.level || ''}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Max Participants"
            name="max_participants"
            value={editedEvent.max_participants || ''}
            onChange={handleChange}
            margin="normal"
            type="number"
          />
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Update Event
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: 24,
  width: '400px',
};

export default EditEventModal;
