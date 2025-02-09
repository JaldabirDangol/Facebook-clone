import { User } from "../model/user.model.js";
import { Post } from "../model/post.model.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from '../utils/datauri.js'
import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";
import { Reaction } from "../model/reaction.model.js";
dotenv.config();

export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(401).json({
        message: "something is missing ",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "user already exists",
        success: false,
      });
    }
    const bcryptPassword = await bcrypt.hash(password, 10); //hash

    await User.create({
      // create
      username: username,
      password: bcryptPassword,
      email: email,
    });

    res.status(201).json({
      //send user
      user: {
        username,
        email,
        password,
      },
      message: "Account created successfully !",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "something is missing ",
        success: false,
      });
    }
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "user doesnot exists",
        success: false,
      });
    }
    const bcryptPassword = await bcrypt.compare(password, user.password); //hash check
    if (!bcryptPassword) {
      return res.status(402).json({
        msessage: "password didnot match",
        success: false,
      });
    }
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    //populate post
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilepicture: user.profilepicture,
      bio: user.bio,
      freinds: user.freinds,
      posts: populatedPosts,
    };

    return res
      .cookie("logincookie", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        // message:`Welcome back ${user.username}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logout = async (req, res) => {
  try {
    return res.cookie("logincookie", "", { maxAge: 0 }).json({
      msessage: "Logged out succesfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const myId = req.id;
    const Me = await User.findById(myId);
    const userId = req.params.id;
    let user = await User.findById(userId);

    if (!userId) {
      return res.status(400).json({
        message: "User doesnot exists",
        success: false,
      });
    }

    if(Me.blockeduser.includes(userId)){
      return res.status(400).json({
        message:'User is blocked you cannot see Profile ...',
        success:false
      })
    }

   if(user.blockeduser.includes(myId)){
      return res.status(400).json({
    message:'User not found ',
    success:false
     })
    }
     await user.populate([
      {
        path: "posts",
        populate: [
          {
            path: "author",
            select: "username profilePicture"
          },
          {
            path: "comment",
            options: { sort: { createdAt: -1 } }, 
            populate: {
              path: "author",
              select: "username profilePicture"
            }
          },
          {
            path: "reaction",
            options: { sort: { createdAt: -1 } }, 
            populate: {
              path: "author",
              select: "username profilePicture"
            }
          },
        ]
      },
      {
        path: "saved",
        populate: [
          {
            path: "author",
            select: "username profilePicture"
          },
          {
            path: "comment",
            options: { sort: { createdAt: -1 } }, 
            populate: {
              path: "author",
              select: "username profilePicture"
            }
          },
          {
            path: "reaction",
            options: { sort: { createdAt: -1 } }, 
            populate: {
              path: "author",
              select: "username profilePicture"
            }
          },
        ]
      },
      {
        path: "friends",
        select: "username profilePicture"
      }
    ]);
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async(req,res)=>{
    try {
    const userId = req.id;
    const user = await User.findById(userId);
    const { bio, gender , oldPassword ,newPassword } = req.body;
  
    const profilePhoto = req.files?.profilePhoto?.[0]; 
    const coverPhoto = req.files?.coverPhoto?.[0]; 
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    if(bio) user.bio = bio;
    if(gender) user.gender = gender;
    if(profilePhoto) {
        const fileUri = getDataUri(profilePhoto)
        const cloud_response = await cloudinary.uploader.upload(fileUri)
        user.profilePicture = cloud_response.secure_url;
    }
    if(coverPhoto) {
        const fileUri = getDataUri(coverPhoto)
        const cloud_response = await cloudinary.uploader.upload(fileUri)
        user.coverPicture = cloud_response.secure_url;
    }
    
    if(oldPassword && newPassword){
      const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);
      if(!isPasswordMatch){
        return res.status(400).json({
          message:'!Password doesnot match !!',
          success:false
        })
      }
      else{
        user.password = newPassword
      }
    }

    await user.save();
    const updatedUser = await User.findById(user._id).select("-password");
    return res.status(200).json({
    message: "Profile updated successfully!",
    success: true,
    user: updatedUser
     });
    
    } catch (error) {
        console.log(error)
    }
}

export const suggestedUser = async(req,res)=>{
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    const friends = await User.find({_id:{$in:user.freinds}})
    const suggestedUsers = await User.find({ _id: { $nin: [...user.freinds, user._id ,...user.blockeduser] } })
    .select('username profilePicture')

   return res.status(200).json({
    message:'make some new freinds',
    success:true,
    users:suggestedUsers
   })
  } catch (error) {
    console.log(error)
  }
}

export const freindsOrunfreinds = async(req,res)=>{
  try {
    const userId = req.id;
    const targetUser = req.params.id;
    const user = await User.findById(userId);

    if(userId === targetUser ){
      return res.status(401).json({
        msessage:"you cannot freind or unfreind yourself",
        success:false
      })
    }
 
    const isFriends = await user.freinds.includes(targetUser);
    if(isFriends){
      await Promise.all([
        user.updateOne({_id:userId},{$pull:{freinds:targetUser}}),
        user.updateOne({_id:targetUser},{$pull:{freinds:userId}})
      ])

      return res.status(401).json({
        message:'user has been added to freindlist',
        success:true,
      })

    }else if( !isFriends ){
      await Promise.all([
        user.updateOne({_id:userId},{$push:{freinds:targetUser}}),
        user.updateOne({_id:targetUser},{$push:{freinds:userId}})
      ])

      return res.status(401).json({
        message:'user has been removed from freindlist',
        success:true,
      })
    }

  } catch (error) {
    console.log(error)
  }
}

export const deleteAccount = async(req,res)=>{
     try {
        const userId = req.id;
        const user = await User.findById(userId);

        if(user){
          await Promise.all([
            Post.deleteMany({author:userId}),
            Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }]})]),
            Conversation.deleteMany({participants:{$in:[userId]}}),
            Comment.deleteMany({author:userId}),
            Reaction.deleteMany({author:userId}),
            User.findByIdAndDelete(userId)
        }

        const stillExists = await User.findById(userId);
        if(stillExists){
          return res.status(401).json({
            message:'Account deletion failed !!',
            success:false
          })
        }

        return res.status(200).json({
          message:'Account deleted successfully!!',
          success:true
        })
     } catch (error) {
      console.log(error)
     }
}

export const blockUsers = async(req,res)=>{
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    const targetUser = req.params.id;
    
    if(!user || !targetUser){
      return res.status(400).json({
        msessage:'user is not found',
        success:false
      })
    }

    const isBlocked = user.blockeduser.includes(targetUser);
    if(isBlocked){
     await user.updateOne({ $pull:{blockeduser:targetUser} })
     await user.save()

      return res.status(200).json({
           message:'User unblocked ',
           success:true
      })}

     if(user.freinds.includes(targetUser)){
          await Promise.all([
            user.updateOne({ $addToSet:{blockeduser:targetUser }}),
            user.updateOne({$pull:{freinds:targetUser}}),
            user.save()
          ]) 
          return res.status(200).json({
            message:'User blocked  successfully',
            success:true
       })}

       await Promise.all([
        user.updateOne({ $addToSet:{blockeduser:targetUser }}),
        user.save()
      ]) 

      return res.status(200).json({
        message:'User blocker successfully!!!',
        success:true,
      })
      
  } catch (error) {
    console.log(error)
  }
}

