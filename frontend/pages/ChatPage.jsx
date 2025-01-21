import React, { useState, useEffect, useRef } from 'react';
import { getCsrfToken } from '../utils/getCsrfToken';
import axios from 'axios';
import './ChatPage.css';
import Navbar from '../components/layout/Navbar';

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
    <>
    <Navbar />
    <div className="chat-container global">
      <div className="friend-list-panel">
        <h3>Your Friends</h3>
        <ul>
          {friends.map((friend) => (
            <li
              key={friend.id}
              className="friend-list-item"
              onClick={() => handleFriendClick(friend)}
            >
              {friend.username}
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-panel">
        {currentFriend ? (
          <>
            <h3 className="chat-header">Chat with {currentFriend.username}</h3>
            <div className="message-list">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message-item ${
                    message.senderUsername === user.username
                      ? "sender"
                      : "receiver"
                  }`}
                >
                  <strong>{message.senderUsername}</strong>
                  <p>{message.message}</p>
                </div>
              ))}
            </div>
            <div className="message-input-container">
              <textarea
                className="message-textarea"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
              />
              <button className="send-button" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <p>Select a friend to start chatting</p>
        )}
      </div>
    </div>
    </>
  );
};

export default ChatPage;
