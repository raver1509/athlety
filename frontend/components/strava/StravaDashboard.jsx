import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

const StravaDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const accessToken = localStorage.getItem('strava_access_token');
      if (accessToken) {
        try {
          const response = await axios.get('https://www.strava.com/api/v3/athlete', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setUser(response.data);
        } catch (err) {
          setError('Unable to fetch user data');
        }
      } else {
        setError('No access token found');
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstname}!</h1>
      <Typography variant="h6">Username: {user.username}</Typography>
      <Typography variant="body1">City: {user.city}</Typography>
      <Typography variant="body1">Country: {user.country}</Typography>
    </div>
  );
};

export default StravaDashboard;
