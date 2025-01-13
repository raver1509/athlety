// /src/components/StravaConnect.js

import React from 'react';
import { Button } from '@mui/material';  // Możesz użyć Material UI do stylizacji

const STRAVA_AUTH_URL = 'http://localhost:8000/api/strava/auth';  // Backendowy endpoint

const StravaConnect = () => {

  const handleConnect = () => {
    // Przekierowanie do backendu w celu autoryzacji
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
