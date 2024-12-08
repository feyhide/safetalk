import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    currentUser:null,
    url: "https://feelhome-server.onrender.com",
    address:null,
    error:null,
    loading:false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser:(state,action)=>{
            state.currentUser = action.payload;
        },
        reset:(state)=>{
            state.currentUser = null;
        }
    }
})

export const {reset,addUser} = userSlice.actions
export default userSlice.reducer