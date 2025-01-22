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

const ProfileEditModal = ({ open, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [level, setLevel] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [preferredSports, setPreferredSports] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userDataLoading, setUserDataLoading] = useState(true);

  // Fetch the user profile data when the modal is opened
  useEffect(() => {
    if (open) {
      setUserDataLoading(true);
      setError('');

      // Fetch user data from the API
      fetch('http://localhost:8000/api/authentication/user/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          return response.json();
        })
        .then((data) => {
          setFirstName(data.first_name || '');
          setLastName(data.last_name || '');
          setLevel(data.level || '');
          setDateOfBirth(data.date_of_birth || '');
          setPreferredSports(data.preferred_sports || '');
          setLocation(data.location || '');
        })
        .catch((err) => {
          setError(err.message || 'An error occurred while fetching the user data');
          console.error(err);
        })
        .finally(() => {
          setUserDataLoading(false);
        });
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const csrfToken = getCsrfToken();

    const userUpdatePayload = {
      ...(firstName && { first_name: firstName }),
      ...(lastName && { last_name: lastName }),
    };

    const profileUpdatePayload = {
      ...(level && { level }),
      ...(dateOfBirth && { date_of_birth: dateOfBirth }),
      ...(preferredSports && { preferred_sports: preferredSports }),
      ...(location && { location }),
    };

    try {
      // First, update the first_name and last_name fields via /authentication/user/
      const userUpdateResponse = await fetch('http://localhost:8000/api/authentication/user/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(userUpdatePayload),
      });

      if (!userUpdateResponse.ok) {
        const userUpdateErrorData = await userUpdateResponse.json();
        setError(userUpdateErrorData.detail || 'Failed to update user information');
        return;
      }

      // Then, update the other profile fields via /api/users/profile/
      const profileUpdateResponse = await fetch('http://localhost:8000/api/users/profile/', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify(profileUpdatePayload),
      });

      if (profileUpdateResponse.ok) {
        onClose(); // Close modal after saving changes
      } else {
        const profileUpdateErrorData = await profileUpdateResponse.json();
        setError(profileUpdateErrorData.detail || 'Failed to update profile');
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

        {userDataLoading ? (
          <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
        ) : (
          <form onSubmit={handleSubmit}>
            {/* First and Last Name Fields */}
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            {/* Other fields */}
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
        )}
      </Box>
    </Modal>
  );
};

export default ProfileEditModal;
