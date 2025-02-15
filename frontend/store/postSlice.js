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
        },
        setChangeSaved:(state,action)=>{
            if (state.selectedpost) {
                state.selectedpost.saved = action.payload;
            }
        }
    }
})
export const { setAllpost ,setSelectedPost , setChangeSaved} = postSlice.actions;
export default postSlice.reducer;