import React, { useState, useEffect, useRef } from 'react';
import { getCsrfToken } from '../utils/getCsrfToken';
import axios from 'axios';

const ChatPage = () => {
  const [friends, setFriends] = useState([]);
  const [currentFriend, setCurrentFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [user, setUser] = useState(null);
  const socketRef = useRef(null); // Use useRef to persist WebSocket instance

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
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const csrfToken = getCsrfToken();
    fetch('/api/users/friends', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setFriends(data))
      .catch((error) => console.error('Error fetching friends:', error));
  }, []);

  useEffect(() => {
    if (currentFriend && typeof window !== 'undefined') {
      const websocketUrl = `ws://localhost:8000/ws/chat/${currentFriend.id}/`;
      socketRef.current = new WebSocket(websocketUrl); 

      socketRef.current.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);
        switch(data.type) {
            case 'messages':
                setMessages(data.messages);
                break;
            case 'message':
                setMessages((prevMessages) => [...prevMessages, data]);
                break;
        }
      });


      return () => {
        socketRef.current.close();
        socketRef.current = null; 
      };
    }
  }, [currentFriend]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          message: messageInput,
          senderUsername: user.username, // Ensure user data is available
        })
      );
      setMessageInput('');
    }
  };

  const handleFriendClick = (friend) => {
    setCurrentFriend(friend);
    setMessages([]);
  };

  return (
    <div className="chat-page">
      <div className="friends-list">
        <h3>Your Friends</h3>
        <ul>
          {friends.map((friend) => (
            <li key={friend.id} onClick={() => handleFriendClick(friend)}>
              {friend.username}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-area">
        {currentFriend ? (
          <>
            <h3>Chat with {currentFriend.username}</h3>
            <ul>
              {messages.map((message, index) => (
                <li key={index}>
                  <strong>{message.senderUsername}:</strong> {message.message}
                </li>
              ))}
            </ul>
            <div>
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message"
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a friend to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
