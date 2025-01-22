import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Button } from '@mui/material';
import axios from 'axios';
import { getCsrfToken } from '../../utils/getCsrfToken';

const StravaDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [importing, setImporting] = useState(false);

  // Fetch user data and statistics
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

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  // Import and refresh Strava data
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
  console.log(user)
  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Strava Dashboard - {user.username}
      </Typography>
      <Grid container spacing={4}>
        {/* Total Rides */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Rides
              </Typography>
              <Typography variant="h4" color="primary">
                {user.total_rides}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Distance */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Distance (km)
              </Typography>
              <Typography variant="h4" color="primary">
                {user.total_distance.toFixed(2)} km
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Elevation Gain */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Elevation Gain (m)
              </Typography>
              <Typography variant="h4" color="primary">
                {user.total_elevation_gain} m
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Time */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Total Time (minutes)
              </Typography>
              <Typography variant="h4" color="primary">
                {user.total_time} min
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Speed */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Average Speed (m/s)
              </Typography>
              <Typography variant="h4" color="primary">
                {user.average_speed?.toFixed(2)} m/s
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Import/Refresh Button */}
      <Box sx={{ marginTop: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleImportData}
          disabled={importing}
          fullWidth
        >
          {importing ? 'Importing...' : 'Import/Refresh Strava Data'}
        </Button>
      </Box>
      
      {/* Detailed Activity Data */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Detailed Activity Data
        </Typography>
        {user.activities_details && user.activities_details.map((activity, index) => (
          <Card key={index} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Activity {index + 1}: {activity.name}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Type:</strong> {activity.type}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Sport Type:</strong> {activity.sport_type}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Distance:</strong> {(activity.distance / 1000).toFixed(2)} km
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Time:</strong> {(activity.moving_time / 60).toFixed(2)} min
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Elevation Gain:</strong> {activity.total_elevation_gain} m
              </Typography>
              <Typography variant="body1" color="textSecondary">
                <strong>Start Date:</strong> {activity.start_date}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default StravaDashboard;
