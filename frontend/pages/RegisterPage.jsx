import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, Paper } from '@mui/material';
import { useAuth } from '../auth/AuthProvider';

const RegisterPage = () => {
  const { registerAndLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registerAndLogin(email, username, password1, password2);
  };

  return (
    <Grid container component="main" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
          }}
        >
          <Typography component="h1" variant="h4">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password1"
              label="Password"
              type="password"
              id="password1"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password2"
              label="Confirm Password"
              type="password"
              id="password2"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Typography variant="body2" align="center">
              Already have an account?{' '}
              <Button variant="text" href="/login">
                Login here
              </Button>
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default RegisterPage;
