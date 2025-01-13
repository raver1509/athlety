import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Button } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';
import ProfileEditModal from './ProfileEditModal'; // Importujemy modal edycji profilu

const ProfileModal = ({ open, onClose }) => {
  const [userData, setUserData] = useState(null); // Przechowywanie danych użytkownika
  const [loading, setLoading] = useState(true); // Stan ładowania danych
  const [editOpen, setEditOpen] = useState(false); // Stan otwierania modalu edycji

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        setLoading(true);
        const csrfToken = getCsrfToken(); // Pobieramy CSRF token
        try {
          const response = await fetch('http://localhost:8000/api/users/profile/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken, // Dodajemy CSRF token do nagłówków
            },
            credentials: 'include',
          });

          if (response.ok) {
            const data = await response.json();
            setUserData(data); // Ustawiamy dane użytkownika
          } else {
            console.error('Failed to fetch profile data');
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [open, editOpen]);

  const handleEditOpen = () => {
    setEditOpen(true); // Otwieranie modalu edycji
  };

  const handleEditClose = () => {
    setEditOpen(false); // Zamknięcie modalu edycji
  };

  return (
    open && (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 9999,
        }}
      >
        <Paper
          sx={{
            padding: 3,
            backgroundColor: '#f9f9f9',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : userData ? (
            <Box sx={{ padding: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: '600', textAlign: 'center', marginBottom: 2 }}>
                {userData.username}
              </Typography>

              {/* Profilowe zdjęcie */}
              <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 3 }}>
                {userData.profile_picture ? (
                  <img
                    src={userData.profile_picture}
                    alt="Profile"
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      border: '4px solid #fff',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    }}
                  />
                ) : (
                  <Box sx={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#ddd' }} />
                )}
              </Box>

              {/* Sekcja z danymi użytkownika */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Username */}
                <Box sx={{ padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                  <Typography variant="h6" sx={{ fontWeight: '600' }}>Username:</Typography>
                  <Typography variant="body1">{userData.username}</Typography>
                </Box>

                {/* Email */}
                <Box sx={{ padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                  <Typography variant="h6" sx={{ fontWeight: '600' }}>Email:</Typography>
                  <Typography variant="body1">{userData.email}</Typography>
                </Box>

                {/* Level */}
                <Box sx={{ padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                  <Typography variant="h6" sx={{ fontWeight: '600' }}>Level:</Typography>
                  <Typography variant="body1">{userData.level || 'N/A'}</Typography>
                </Box>

                {/* Date of Birth */}
                <Box sx={{ padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                  <Typography variant="h6" sx={{ fontWeight: '600' }}>Date of Birth:</Typography>
                  <Typography variant="body1">{userData.date_of_birth || 'N/A'}</Typography>
                </Box>

                {/* Preffered Sports */}
                <Box sx={{ padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                  <Typography variant="h6" sx={{ fontWeight: '600' }}>Preffered Sports:</Typography>
                  <Typography variant="body1">{userData.preferred_sports || 'N/A'}</Typography>
                </Box>

                {/* Location */}
                <Box sx={{ padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
                  <Typography variant="h6" sx={{ fontWeight: '600' }}>Location:</Typography>
                  <Typography variant="body1">{userData.location || 'N/A'}</Typography>
                </Box>
              </Box>

              {/* Przycisk edycji */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={onClose} // Zamykanie modalu
                  sx={{ padding: '10px 20px', borderRadius: '8px', fontWeight: '600' }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditOpen} // Otwieranie modalu edycji
                  sx={{ padding: '10px 20px', borderRadius: '8px', fontWeight: '600' }}
                >
                  Edit Profile
                </Button>
              </Box>
            </Box>
          ) : (
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              Error loading profile data
            </Typography>
          )}
        </Paper>

        {/* Modal edycji */}
        {editOpen ? <ProfileEditModal open={editOpen} onClose={handleEditClose} initialData={userData}/> : <></>}
      </Box>
    )
  );
};

export default ProfileModal;
