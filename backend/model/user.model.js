import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email: {
        type: String,
        required: true
      },
    password: {
        type: String,
        required: true
      },
    profilePicture:{
        type: String,
        default:''
    },
    coverPicture:{
        type: String,
        default:''
    },
    bio:{
        type:String,
        default:''
    },
    gender:{
        type:String,
        default:''
    } ,
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post',
    }],
    freinds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    saved:[{
       type:mongoose.Schema.Types.ObjectId,
       ref:'Post'
    }]
})

export const User = mongoose.model("User",userSchema);