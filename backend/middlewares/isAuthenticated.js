import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const isAuthenticated = async (req,res,next) =>{
    try {
        const logincookie = req.cookies.logincookie;
        if(!logincookie){
            return res.status(401).json({
                message:'User not Authenticated',
                success:false
            })
        }
        const decode = await jwt.verify(logincookie,process.env.SECRET_KEY)
        if(!decode){
            return res.status(401).json({
                message:'Invalid',
                success:false
            })
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error)
    }
}

