import { createSlice } from "@reduxjs/toolkit";

const postSlice =  createSlice({
    name:'post',
    initialState:{
        posts:[],
        selectedpost:null
    },
    reducers:{
        setAllpost:(state,action)=>{
            state.posts = action.payload
        },
        setSelectedPost:(state,action)=>{
            state.selectedpost = action.payload
        }
    }
})
export const { setAllpost ,setSelectedPost} = postSlice.actions;
export default postSlice.reducer;