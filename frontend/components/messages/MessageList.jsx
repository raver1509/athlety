// /src/components/MessageList.js

import React, { useEffect, useState } from 'react';
import { List, ListItem, Typography } from '@mui/material';
import axios from 'axios';

const MessageList = ({ conversationId }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/chat/api/messages/?conversation=${conversationId}`);
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching messages', err);
      }
    };

    if (conversationId) {
      fetchMessages();
    }
  }, [conversationId]);

  return (
    <div>
      <Typography variant="h6">Messages</Typography>
      <List>
        {messages.map((message) => (
          <ListItem key={message.id}>
            <Typography variant="body1">{message.sender}: {message.content}</Typography>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default MessageList;
