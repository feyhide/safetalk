import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { HOST } from "../constant/constant.js";
import { appendMessage } from "../../redux/user/chatSlice.js";

const SocketContext = createContext(null);

export const useSocket = () => {
    const socket = useContext(SocketContext);
    return socket; // If socket is not initialized, this will return null
};

export const SocketProvider = ({ children }) => {
    const [isSocketReady, setSocketReady] = useState(false); // Track socket readiness
    const socket = useRef(null);
    const { currentUser } = useSelector(state => state.user);
    const { selectedChat } = useSelector(state => state.chat);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentUser) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: { userId: currentUser._id },
            });

            socket.current.on("connect", () => {
                console.log("Connected to socket server");
                setSocketReady(true); // Mark socket as ready
            });

            socket.current.on("connect_error", (error) => {
                console.error("Socket connection error:", error);
                setSocketReady(false); // Handle error by setting socket to false
            });

            socket.current.on("disconnect", () => {
                console.log("Disconnected from socket server");
                setSocketReady(false); // Mark as not ready
            });

            const handleReceivedMessage = (message) => {
                console.log(selectedChat,currentUser,message)
                if (selectedChat && (selectedChat._id === message.sender || selectedChat._id === message.recipient) && (currentUser._id === message.sender || currentUser._id === message.recipient)) {
                    console.log(message)
                    dispatch(appendMessage(message));
                }
            };

            socket.current.on("receivedMessage", handleReceivedMessage);

            return () => {
                if (socket.current) {
                    socket.current.disconnect();
                    console.log("Socket disconnected");
                }
            };
        }
    }, [currentUser, dispatch]);

    // Provide the socket only when it's initialized
    return (
        <SocketContext.Provider value={isSocketReady ? socket.current : null}>
            {children}
        </SocketContext.Provider>
    );
};
