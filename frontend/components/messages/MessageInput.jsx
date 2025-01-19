import React, { useState } from "react"; 
const MessageInput = ({ socket }) => {
    const [message, setMessage] = useState("");

    const sendMessage = () => {
        if (message.trim()) {
            socket.send(JSON.stringify({ message }));
            setMessage("");
        }
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default MessageInput;
