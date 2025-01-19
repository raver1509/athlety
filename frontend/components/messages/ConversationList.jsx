import React, { useState, useEffect } from "react";
import { getCsrfToken } from "../../utils/getCsrfToken";

const ConversationList = ({ onSelectConversation }) => {
    const [conversations, setConversations] = useState([]);
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConversationsAndFriends = async () => {
            try {
                const csrfToken = getCsrfToken();

                // Pobierz istniejące konwersacje
                const conversationsResponse = await fetch("http://localhost:8000/api/chat/conversations/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken,
                    },
                    credentials: "include",
                });

                if (!conversationsResponse.ok) {
                    throw new Error("Failed to fetch conversations");
                }

                const conversationsData = await conversationsResponse.json();
                setConversations(conversationsData);

                // Pobierz znajomych
                const friendsResponse = await fetch('http://localhost:8000/api/users/friends/', {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                  },
                  credentials: 'include',
                });

                if (!friendsResponse.ok) {
                    throw new Error("Failed to fetch friends");
                }

                const friendsData = await friendsResponse.json();
                setFriends(friendsData);
                console.log(friendsData);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch data. Please try again.");
            }
        };

        fetchConversationsAndFriends();
    }, []);

    const startConversation = async (friendId) => {
        try {
            const csrfToken = getCsrfToken();

            const response = await fetch("http://localhost:8000/api/chat/start-conversation/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                credentials: "include",
                body: JSON.stringify({ friend_id: friendId }),
            });

            if (!response.ok) {
                throw new Error("Failed to start a new conversation");
            }

            const data = await response.json();
            const newConversationId = data.conversation_id;
            onSelectConversation(newConversationId);
        } catch (err) {
            console.error(err);
            setError("Failed to start a new conversation. Please try again.");
        }
    };

    return (
        <div>
            <h2>Your Conversations</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {conversations.length > 0 ? (
                    conversations.map((conversation) => (
                        <li
                            key={conversation.id}
                            onClick={() => onSelectConversation(conversation.id)}
                        >
                            {conversation.participants.join(", ")}
                        </li>
                    ))
                ) : (
                    <p>No conversations found.</p>
                )}
            </ul>

            <h2>Start a Conversation</h2>
            <ul>
                {friends.length > 0 ? (
                    friends.map((friend) => (
                        <li key={friend.id}>
                            {friend.username}
                            <button onClick={() => startConversation(friend.id)}>
                                Start Chat
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No friends found. Add some friends to start a chat.</p>
                )}
            </ul>
        </div>
    );
};

export default ConversationList;
