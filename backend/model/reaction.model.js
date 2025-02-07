import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ["like", "love", "haha", "care", "sad", "angry"], 
        required: true 
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }
});

export const Reaction = mongoose.model('Reaction',reactionSchema);