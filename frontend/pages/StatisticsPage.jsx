import React, { useEffect, useState } from 'react';
import StravaConnect from '../components/strava/StravaConnect';
import StravaDashboard from '../components/strava/StravaDashboard';
import axios from 'axios';
import { getCsrfToken } from '../utils/getCsrfToken';
import Navbar from '../components/layout/Navbar';

const StatisticsPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    const fetchAccessToken = async () => {
      const csrfToken = getCsrfToken();
      try {
        const response = await fetch('http://localhost:8000/api/strava/access_token/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data); 
          setAccessToken(data.access_token);
        } else {
          console.error('Failed to fetch Strava access token');
        }
      } catch (error) {
        console.error('Error fetching Strava access token:', error);
      }
    };

    fetchAccessToken();
  }, []);

  // Update isAuthenticated when accessToken changes
  useEffect(() => {
    if (accessToken) {
      setIsAuthenticated(true);
    }
  }, [accessToken]); // Only run this when accessToken changes

  if (isAuthenticated) {
    return <>
      <Navbar/>
      <div className='global'>
        <StravaDashboard />;
      </div>
    </>
  }

  return (
    <div>
      <h1>Welcome to the Strava Dashboard</h1>
      <StravaConnect />
    </div>
  );
};

export default StatisticsPage;
