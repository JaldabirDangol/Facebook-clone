import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
    caption:{
        type:String,
        default:''
    },
    image:{
        type:String,
        default:''
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    comment:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    reaction:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Reaction'
        }]
    
})

export const Post = mongoose.model("Post",postSchema);