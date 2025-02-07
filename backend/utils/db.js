import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
const uri = process.env.MONGOOSE_URI;
const connectDB = async()=>{
    try {
        await mongoose.connect(uri);
        console.log('mongo db connected')
    } catch (error) {
        console.log(error)
    }
}

export default connectDB;
