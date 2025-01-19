import React, { useState, useEffect } from "react"; 

const MessageList = ({ conversationId }) => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Fetch history
        fetch(`api/chat/api/conversations/${conversationId}/messages/`)
            .then((res) => res.json())
            .then((data) => setMessages(data));

        // Connect WebSocket
        const ws = new WebSocket(`ws://127.0.0.1:8000/api/chat/ws/chat/${conversationId}/`);
        setSocket(ws);

        ws.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            setMessages((prev) => [...prev, newMessage]);
        };

        return () => ws.close();
    }, [conversationId]);

    return (
        <div>
            <h3>Messages</h3>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>
                        <strong>{msg.sender}:</strong> {msg.message}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MessageList;
