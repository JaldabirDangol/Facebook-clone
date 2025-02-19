
import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        onlineUsers:[],
        messages:[],
    },
    reducers:{
        setOnlineUsers:(state,action)=>{
            state.onlineUsers = action.payload
        },
        setMessages:(state,action)=>{
            state.messages = action.payload
        },
        setSelectedMessages: (state, action) => {
            state.selectedMessage = action.payload;
          },
        deleteMessage: (state, action) => {
              const messageIndex = state.messages.findIndex(
                  (msg) => msg._id === action.payload
              );
      
              if (messageIndex !== -1) {
                  state.messages[messageIndex].isDeleted = true; 
              }
          },
    }
})

export const {setOnlineUsers,setMessages ,deleteMessage ,setSelectedMessages} = chatSlice.actions;
export default chatSlice.reducer;
