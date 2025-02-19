import {Server} from "socket.io"
import express from "express"
import http from "http"
import dotenv from 'dotenv'
dotenv.config({})

const app = express()

 const server = http.createServer(app)

 const io = new Server(server,{
    cors:{
        origin:process.env.URL,
        methods:['GET','POST']
    }
 })

 const userSocketMap = {} 
 export const getReceiverSocketId = (receiverId)=>userSocketMap[receiverId]

 io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id
        console.log(`user connecteds on connection: ${userId} , socketId = ${socket.id}`)
    }

    io.emit('getOnlineUsers',Object.keys(userSocketMap))

    socket.on('disconnect',()=>{
        if(userId){
        console.log(`connected user deleting: ${userId} , socketId = ${socket.id}`)
            delete userSocketMap[userId]
            console.log(userSocketMap)
        }
        io.emit('getOnlineUsers',Object.keys(userSocketMap))
    })
 })

 export {app,server,io}