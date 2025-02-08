import express, { urlencoded } from 'express' 
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import connectDB from './utils/db.js'
import userRoutes from './routes/user.routes.js'
import postRoutes from './routes/post.route.js'

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3767;
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// const corsOptions = {
//   origin: "http://localhost:5173",
//   credentials: true,
// };

app.use('/api/v1/user/',userRoutes);
app.use('/api/v1/post',postRoutes);

app.get('/',(req,res)=>{
    res.send("hello i am working")
})

app.listen(PORT,()=>{
    connectDB();
    console.log(`app is listening on ${PORT}`)
})