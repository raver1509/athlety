import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import BasicCard from '../components/events/BasicCard';
import { Box, Typography, Grid, Card, CardContent, Divider } from '@mui/material';
import axios from 'axios';
import { getCsrfToken } from '../utils/getCsrfToken';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);

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
      } else {
        setError('Failed to fetch user data');
      }
    } catch (err) {
      setError('Error fetching user data');
    }
    setLoadingUserData(false);
  };

  const fetchEventData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/events/');
      setEventData(response.data);
    } catch (err) {
      setError(err.message || 'Error fetching event data');
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchEventData();
  }, []);

  if (loadingUserData || loadingEvents) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#f9f9f9',
          paddingLeft: 30
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, marginBottom: 4, textAlign: 'center' }}>
          Welcome to Athlety
        </Typography>
        <Grid container spacing={4} maxWidth="lg">
          {/* Upcoming Events */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                textAlign: 'center',
                marginBottom: 2,
              }}
            >
              Upcoming Events
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {eventData &&
                eventData.slice(0, 3).map((event) => (
                  <Grid item xs={12} sm={6} md={4} key={event.id}>
                    <BasicCard
                      src="https://assets.clevelandclinic.org/transform/7b87e4a3-49bf-4b3d-936c-9abbcc61dbf7/fasterRunner-656983165-770x533-1_jpg"
                      name={event.name}
                      date={event.event_date}
                      desc={event.description}
                    />
                  </Grid>
                ))}
            </Grid>
          </Grid>

          {/* Strava Activities and Achievements */}
          <Grid item xs={12}>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
              {/* Recent Strava Activities */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center', marginBottom: 2 }}>
                  Recent Strava Activity
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  {user.activities_details &&
                    user.activities_details.slice(0, 1).map((activity) => (
                      <Grid item xs={10} key={activity.id} sx={{paddingRight: 5}}>
                        <Card elevation={3} sx={{ padding: 2, width: '100%' }}>
                          <CardContent>
                            <Typography variant="h6">{activity.name}</Typography>
                            <Divider sx={{ marginBottom: 1 }} />
                            <Typography variant="body1">
                              <strong>Distance:</strong> {(activity.distance / 1000).toFixed(2)} km
                            </Typography>
                            <Typography variant="body1">
                              <strong>Time:</strong> {(activity.moving_time / 60).toFixed(2)} minutes
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </Grid>

              {/* Achievements */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ fontWeight: 600, textAlign: 'center', marginBottom: 2 }}>
                  Your Achievements
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  <Grid item xs={4}>
                    <Card
                      elevation={3}
                      sx={{
                        width: '150px',
                        height: '150px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                      }}
                    >
                      <CardContent>
                        <Typography variant="body1" color="textSecondary">
                          Total Rides
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {user.total_rides}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card
                      elevation={3}
                      sx={{
                        width: '150px',
                        height: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <CardContent>
                        <Typography variant="body1" color="textSecondary">
                          Total Distance
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {user.total_distance.toFixed(2)} km
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card
                      elevation={3}
                      sx={{
                        width: '150px',
                        height: '150px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <CardContent>
                        <Typography variant="body1" color="textSecondary">
                          Total Time
                        </Typography>
                        <Typography variant="h4" color="primary">
                          {user.total_time} min
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HomePage;
