import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:'auth',
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUser:null,
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
    removeFriend: (state, action) => {
        const friendId = action.payload;

        if (state.user && state.user.friends) {
            state.user.friends = state.user.friends.filter(
                friend => friend.id !== friendId
            );
        }

        if (state.userProfile && state.userProfile.friends) {
            state.userProfile.friends = state.userProfile.friends.filter(
                friend => friend.id !== friendId
            );
        }
    },

    }
})

export const {
    removeFriend,
    setAuthUser, 
    setSuggestedUser, 
    setUserProfile,
    setSelectedUser,
} = authSlice.actions;
export default authSlice.reducer;
