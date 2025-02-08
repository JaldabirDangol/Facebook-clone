import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    message:{
        type:String,
        default:''
    },
    senderID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiverID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})

export const Message = mongoose.model("Message",messageSchema);