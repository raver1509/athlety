// components/messages/MessageInput.jsx

import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const MessageInput = ({ conversationId }) => {
  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/chat/api/messages/`,
          {
            conversation: conversationId,
            content: message,
          }
        );
        console.log('Message sent:', response.data);
        setMessage(''); // Czyścimy pole po wysłaniu
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
    <div>
      <TextField
        fullWidth
        value={message}
        onChange={handleMessageChange}
        label="Type a message"
        variant="outlined"
      />
      <Button onClick={handleSendMessage} variant="contained" color="primary">
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
