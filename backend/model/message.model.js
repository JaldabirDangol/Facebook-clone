import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message:{
        type:String,
        default:''
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    isDeleted:{type:Boolean ,default:false},
},{timestamps:true})

export const Message = mongoose.model("Message",messageSchema);