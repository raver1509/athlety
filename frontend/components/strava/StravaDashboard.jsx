import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Button } from '@mui/material';
import axios from 'axios';
import { getCsrfToken } from '../../utils/getCsrfToken';

const StravaDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);

  const fetchUserData = async () => {
    const csrfToken = getCsrfToken();
    try {
      const response = await axios.get('http://localhost:8000/api/users/profile/', {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        setUser(response.data);
        setError(null); // Clear any previous error
      } else {
        setError('Failed to fetch user data');
      }
    } catch (err) {
      setError('Error fetching user data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleImportData = async () => {
    setImporting(true);
    const csrfToken = getCsrfToken();
    try {
      const response = await axios.post('http://localhost:8000/api/strava/import/', {}, {
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        alert('Data imported successfully!');
        // Refetch user data from the database
        fetchUserData();
      } else {
        alert('Failed to import data');
      }
    } catch (err) {
      alert('Error importing data');
    }
    setImporting(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <Typography variant="h6">Email: {user.email}</Typography>
      <Typography variant="body1">Total Rides: {user.total_rides}</Typography>
      <Typography variant="body1">Total Distance: {user.total_distance} km</Typography>
      <Typography variant="body1">Total Elevation Gain: {user.total_elevation_gain} m</Typography>
      <Typography variant="body1">Total Time: {user.total_time} min</Typography>
      <Typography variant="body1">Average Speed: {user.average_speed} m/s</Typography>

      <Typography variant="h6">Detailed Activity Data</Typography>
      {user.activities_details && user.activities_details.map((activity, index) => (
        <div key={index}>
          <Typography variant="body2">Activity {index + 1}</Typography>
          <Typography variant="body2">Name: {activity.name}</Typography>
          <Typography variant="body2">Type: {activity.type}</Typography>
          <Typography variant="body2">Sport Type: {activity.sport_type}</Typography>
          <Typography variant="body2">Distance: {activity.distance / 1000} km</Typography>
          <Typography variant="body2">Time: {activity.moving_time / 60} min</Typography>
          <Typography variant="body2">Elevation Gain: {activity.total_elevation_gain} m</Typography>
          <Typography variant="body2">Start Date: {activity.start_date}</Typography>
        </div>
      ))}

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleImportData} 
        disabled={importing}
      >
        {importing ? 'Importing...' : 'Import/Refresh Strava Data'}
      </Button>
    </div>
  );
};

export default StravaDashboard;
