// /src/components/MessageInput.js

import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { sendMessage } from '../../utils/chatService';

const MessageInput = ({ conversationId }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    sendMessage(message, conversationId);
    setMessage('');
  };

  return (
    <div>
      <TextField
        label="Write a message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
      />
      <Button onClick={handleSendMessage} variant="contained" color="primary">
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
