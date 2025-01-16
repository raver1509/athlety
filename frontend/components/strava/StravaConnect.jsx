import React from 'react';
import { Button } from '@mui/material';

const STRAVA_AUTH_URL = 'http://localhost:8000/api/strava/auth';  // Backend endpoint for authentication

const StravaConnect = () => {
  const handleConnect = () => {
    // Redirect to the backend for Strava authentication
    window.location.href = STRAVA_AUTH_URL;
  };

  return (
    <div>
      <h1>Connect with Strava</h1>
      <Button variant="contained" color="primary" onClick={handleConnect}>
        Connect with Strava
      </Button>
    </div>
  );
};

export default StravaConnect;
