import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"user",
    initialState:{
        user:null,
        suggestedUser:[],
        selectedProfileUser:null,
        selectedUser:null,
    },
    reducers:{
        setAuthUser : (state,action)=>{
            state.user = action.payload;
        },
        getSuggestedUser1 : (state,action) =>{
            state.suggestedUser = action.payload;
        },
        setSelectedProfileUser : (state,action)=>{
            state.selectedProfileUser = action.payload;
        },
        setSelectedUser : (state,action)=>{
            state.selectedUser = action.payload
        }
    }
})

export const {setAuthUser,getSuggestedUser1,setSelectedProfileUser,setSelectedUser} = authSlice.actions;
export default authSlice.reducer;