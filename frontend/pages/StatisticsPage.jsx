// /src/pages/Home.js

import React, { useEffect, useState } from 'react';
import StravaConnect from '../components/strava/StravaConnect';
import StravaDashboard from '../components/strava/StravaDashboard';

const StatisticsPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Sprawdzamy, czy jest zapisany token
    const accessToken = localStorage.getItem('strava_access_token');
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated) {
    return <StravaDashboard />;
  }

  return (
    <div>
      <h1>Welcome to the Strava Dashboard</h1>
      <StravaConnect />
    </div>
  );
};

export default StatisticsPage;
