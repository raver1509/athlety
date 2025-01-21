import React, { useState } from 'react';
import { Button, TextField, List, ListItem, ListItemText, CircularProgress, Typography } from '@mui/material';
import { getCsrfToken } from '../../utils/getCsrfToken';
import { styled } from '@mui/system';

const StyledButton = styled(Button)({
  color: '#fff',
  backgroundColor: '#000',
  borderRadius: '5px',
  padding: '8px 16px',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: '#333',
  },
});

const StyledTextField = styled(TextField)({
  marginBottom: '20px',
  '& .MuiInputLabel-root': {
    fontSize: '16px',
    color: '#555',
  },
  '& .MuiInputBase-root': {
    fontSize: '16px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
  },
});

const SearchContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '30px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const Title = styled(Typography)({
  fontSize: '24px',
  fontWeight: 600,
  color: '#333',
  marginBottom: '20px',
  textAlign: 'center',
});

const ErrorMessage = styled('div')({
  color: 'red',
  textAlign: 'center',
  marginTop: '20px',
  fontSize: '16px',
});

const SearchUsers = () => {
  const [username, setUsername] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const csrfToken = getCsrfToken();
      const response = await fetch(`http://localhost:8000/api/users/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('User not found');
      }

      const data = await response.json();
      setSearchedUser(data);
    } catch (error) {
      console.error('Failed to search user:', error);
      setSearchedUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (!searchedUser) return;

    try {
      const csrfToken = getCsrfToken();
      console.log()
      const response = await fetch(`http://localhost:8000/api/users/friends/request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({ to_user: searchedUser.id }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }

      alert('Friend request sent!');
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  return (
    <SearchContainer>
      <Title variant="h4">Search for Users by Username</Title>
      <StyledTextField
        label="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        variant="outlined"
      />
      <StyledButton onClick={handleSearch} disabled={loading} fullWidth>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
      </StyledButton>

      {searchedUser && (
        <List>
          <ListItem sx={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
            <ListItemText
              primary={`Username: ${searchedUser.username}`}
              secondary={`User ID: ${searchedUser.id}`}
            />
            <StyledButton onClick={handleSendRequest} disabled={loading}>
              Send Request
            </StyledButton>
          </ListItem>
        </List>
      )}

      {!searchedUser && !loading && username && (
        <ErrorMessage>No user found with this username</ErrorMessage>
      )}
    </SearchContainer>
  );
};

export default SearchUsers;
  