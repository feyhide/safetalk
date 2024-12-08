import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    selectedChat:null,
}

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addChatuser:(state,action)=>{
            state.selectedChat = action.payload;
        },
        reset:(state)=>{
            state.selectedChat = null;
        }
    }
})

export const {reset,addChatuser} = chatSlice.actions
export default chatSlice.reducer