import React, { useState } from 'react';
import { Button, TextField, Box, MenuItem, Select, InputLabel, FormControl, Grid } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';

const EventCreateForm = ({ onEventCreated }) => {
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    max_participants: '',
  });

  const [eventType, setEventType] = useState('');
  const [level, setLevel] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'event_type') {
      setEventType(value);
    } else if (name === 'level') {
      setLevel(value);
    } else {
      setEventData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const csrfToken = getCsrfToken();
    const response = await fetch('http://localhost:8000/api/events/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({
        ...eventData,
        event_type: eventType,
        level: level,
      }),
    });

    if (response.ok) {
      const createdEvent = await response.json();
      onEventCreated(createdEvent);
      window.location.reload();
    } else {
      const error = await response.json();
      alert('Failed to create event: ' + error.detail);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '400px', mx: 'auto', mt: 2, padding: '20px' }}>
      <TextField
        fullWidth
        label="Event Name"
        name="name"
        value={eventData.name}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={eventData.description}
        onChange={handleChange}
        margin="normal"
        multiline
        rows={4}
        required
      />
      <TextField
        fullWidth
        label="Event Date"
        name="event_date"
        value={eventData.event_date}
        onChange={handleChange}
        margin="normal"
        type="date"
        required
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        fullWidth
        label="Event Time"
        name="event_time"
        value={eventData.event_time}
        onChange={handleChange}
        margin="normal"
        type="time"
        required
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        fullWidth
        label="Location"
        name="location"
        value={eventData.location}
        onChange={handleChange}
        margin="normal"
        required
      />
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Event Type</InputLabel>
        <Select
          value={eventType}
          onChange={handleChange}
          name="event_type"
          label="Event Type"
        >
          <MenuItem value="cycling">Cycling</MenuItem>
          <MenuItem value="running">Running</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal" required>
        <InputLabel>Level</InputLabel>
        <Select
          value={level}
          onChange={handleChange}
          name="level"
          label="Level"
        >
          <MenuItem value="beginner">Beginner</MenuItem>
          <MenuItem value="intermediate">Intermediate</MenuItem>
          <MenuItem value="advanced">Advanced</MenuItem>
          <MenuItem value="any">Any</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Max Participants"
        name="max_participants"
        value={eventData.max_participants}
        onChange={handleChange}
        margin="normal"
        type="number"
        required
      />
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Create Event
      </Button>
    </Box>
  );
};

export default EventCreateForm;
