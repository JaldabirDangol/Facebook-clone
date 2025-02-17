import express, { urlencoded } from 'express' 
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.route.js'
import messageRoutes from './routes/message.route.js'
import { server ,app } from './socket/socket.js'

dotenv.config({})
const PORT = process.env.PORT || 3767;
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOption = {
    origin: process.env.URL,
    credentials:true
}
app.use(cors(corsOption))

app.use('/api/v1/user/',userRoutes);
app.use('/api/v1/post',postRoutes);
app.use('/api/v1/message',messageRoutes);

app.get('/',(req,res)=>{
    res.send("hello i am working")
})


server.listen(PORT,()=>{
    connectDB();
    console.log(`app is listening on ${PORT}`)
})