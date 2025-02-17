import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUser:null,
        userFriend:[]
    },
    reducers:{
    setAuthUser:(state,action)=>{
            state.user= action.payload
    }
    ,
    setSelectedUser:(state,action)=>{
        state.selectedUser = action.payload;
    },
    setUserProfile:(state,action)=>{
        state.userProfile = action.payload;
    },
    setSuggestedUser:(state,action)=>{
        state.suggestedUsers=action.payload;
    },
    setUserFriend:(state,action)=>{
        state.userFriend = action.payload
    }
    }
})

export const {
    setAuthUser, 
    setSuggestedUser, 
    setUserProfile,
    setSelectedUser,
    setUserFriend
} = authSlice.actions;
export default authSlice.reducer;
