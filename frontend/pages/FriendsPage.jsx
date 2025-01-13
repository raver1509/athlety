// pages/ChatPage.jsx

import React, { useState } from 'react';
import { Button, Container, Grid } from '@mui/material';
import FriendList from '../components/friends/FriendList';
import IncomingFriendRequests from '../components/friends/IncomingFriendRequests';
import OutgoingFriendRequests from '../components/friends/OutgoingFriendRequests';
import SuggestedUsers from '../components/friends/SuggestedUsers';
import SearchUsers from '../components/friends/SearchUsers'; // Nowy komponent do wyszukiwania użytkowników

const FriendsPage = () => {
    const [selectedTab, setSelectedTab] = useState('friends');

    return (
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Button onClick={() => setSelectedTab('friends')}>Friends</Button>
            <Button onClick={() => setSelectedTab('requests')}>Requests</Button>
            <Button onClick={() => setSelectedTab('suggestions')}>Suggested</Button>
            <Button onClick={() => setSelectedTab('search')}>Search Users</Button> {/* Przycisk do przełączania na wyszukiwanie użytkowników */}
          </Grid>
          <Grid item xs={12} md={8}>
            {selectedTab === 'friends' && <FriendList />}
            {selectedTab === 'requests' && (
              <>
                <IncomingFriendRequests />
                <OutgoingFriendRequests />
              </>
            )}
            {selectedTab === 'suggestions' && <SuggestedUsers />}
            {selectedTab === 'search' && <SearchUsers />} {/* Nowa zakładka do wyszukiwania użytkowników */}
          </Grid>
        </Grid>
      </Container>
    );
};

export default FriendsPage;
