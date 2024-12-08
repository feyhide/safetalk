import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../context/SocketContext.jsx';
import { reset } from '../../redux/user/chatSlice.js';

const ChatBox = () => {
    const { selectedChat, chatData } = useSelector(state => state.chat);
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.user);
    const [message, setMessage] = useState("");
    const socket = useSocket();

    // Check if the socket is initialized
    if (!socket) {
        return <div>Loading socket connection...</div>;
    }

    

    const handleSendMessage = () => {
        if (selectedChat) {
            socket.emit("sendMessage", {
                sender: currentUser._id,
                recipient: selectedChat._id,
                message: message
            });
            setMessage(""); // Clear the message input after sending
        }
    };

    return (
        <div className="w-screen h-screen bg-blue-500 flex flex-col">
            <p onClick={() => { dispatch(reset()), console.log(selectedChat) }}>back</p>

            <p>Chat name: {selectedChat?.username}</p>
            
            {/* Display the messages */}
            <div className="flex-1 overflow-auto p-4">
                {chatData.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`flex ${msg.sender === currentUser._id ? "justify-end" : "justify-start"} mb-4`}
                    >
                        <div 
                            className={`p-2 max-w-xs rounded-lg ${msg.sender === currentUser._id ? "bg-blue-600 text-white" : "bg-gray-300"}`}
                        >
                            <p>{msg.message}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Message input and send button */}
            <div className="flex p-4">
                <input
                    type="text"
                    placeholder="Type a message"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    className="p-2 rounded-l-md w-full"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white p-2 rounded-r-md"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
