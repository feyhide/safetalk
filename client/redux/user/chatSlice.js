import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedChat: null,
    chatData: [], // Initialize chatData as an empty array of objects
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addChatuser: (state, action) => {
            state.selectedChat = action.payload;
        },
        addChatData: (state, action) => {
            state.chatData = action.payload;
        },
        appendMessage: (state, action) => {
            if (state.selectedChat) {
                // Ensure chatData is an array
                if (!Array.isArray(state.chatData)) {
                    state.chatData = []; // Reset chatData if it's not an array
                }

                const message = action.payload;
                
                // Check if the message format is valid
                if (message && typeof message === 'object' && message.sender && message.recipient && message.message) {
                    state.chatData.push(message); // Add the message object to the chatData array
                } else {
                    console.warn("Invalid message format", message); // Log if message format is invalid
                }
            }
        },
        reset: (state) => {
            state.selectedChat = null;
            state.chatData = [];
        }
    }
});

export const { reset, addChatuser, addChatData, appendMessage } = chatSlice.actions;
export default chatSlice.reducer;
