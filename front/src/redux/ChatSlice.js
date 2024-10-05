import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        online: [],
        messages : [],
    },
    reducers: {
        setOnlineUser: (state, action) => {
            state.online = action.payload;
        },
        setMessages : (state,action) =>{
            state.messages = action.payload;
        }
    },
});

export const { setOnlineUser , setMessages} = chatSlice.actions;
export default chatSlice.reducer;