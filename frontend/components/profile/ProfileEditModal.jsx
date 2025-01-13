import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
  Button,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';

const ProfileEditModal = ({ open, onClose, initialData }) => {
  const [level, setLevel] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [preferredSports, setPreferredSports] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setLevel(initialData.level || '');
      setDateOfBirth(initialData.date_of_birth || '');
      setPreferredSports(initialData.preferred_sports || '');
      setLocation(initialData.location || '');
    }
  }, [initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const csrfToken = getCsrfToken();

    const payload = {
      ...(level && { level }),
      ...(dateOfBirth && { date_of_birth: dateOfBirth }),
      ...(preferredSports && { preferred_sports: preferredSports }),
      ...(location && { location }),
    };

    try {
      const response = await fetch('http://localhost:8000/api/users/profile/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onClose(); // Zamykanie modala po zapisaniu zmian
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred while updating the profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-profile-modal"
      aria-describedby="edit-profile-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: '400px',
        }}
      >
        <Typography id="edit-profile-modal" variant="h6" component="h2" sx={{ mb: 2 }}>
          Edit Profile
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Level</InputLabel>
            <Select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              name="level"
              label="Level"
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Date of Birth"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Preferred Sports</InputLabel>
            <Select
              value={preferredSports}
              onChange={(e) => setPreferredSports(e.target.value)}
              name="preferred_sports"
              label="Preferred Sports"
            >
              <MenuItem value="running">Running</MenuItem>
              <MenuItem value="cycling">Cycling</MenuItem>
              <MenuItem value="swimming">Swimming</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Location"
            variant="outlined"
            fullWidth
            margin="normal"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ProfileEditModal;
