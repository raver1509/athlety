// /src/services/chatService.js

const SOCKET_URL = 'ws://localhost:8000/ws/chat/'; // Adres WebSocket na backendzie

let socket = null;

export const connectWebSocket = (conversationId, onMessageReceived) => {
  if (socket) {
    socket.close();
  }
  
  socket = new WebSocket(`${SOCKET_URL}${conversationId}/`);

  socket.onopen = () => {
    console.log("WebSocket connected.");
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    onMessageReceived(message);
  };

  socket.onerror = (error) => {
    console.error("WebSocket error: ", error);
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected.");
  };
};

export const sendMessage = (message, conversationId) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ conversationId, message }));
  } else {
    console.error("WebSocket is not open.");
  }
};
