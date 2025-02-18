
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        onlineUsers:[],
        messages:[],
        alluser:[]
    },
    reducers:{
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload
        },
        setMessages:(state,action)=>{
            state.messages = action.payload
        },
        setAllUsers:(state,action)=>{
            state.alluser = action.payload
        }
    }
})

export const {setOnlineUsers,setMessages ,setAllUsers} = chatSlice.actions;
export default chatSlice.reducer;
