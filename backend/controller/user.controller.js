import { User } from "../model/user.model.js";
import { Post } from "../model/post.model.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from '../utils/datauri.js'
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
    console.log('req reched in getprofile')
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        message: "User doesnot exists",
        success: false,
      });
    }
    let user = await User.findById(userId).populate([
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
    const { bio, gender } = req.body;
  
    const profilePhoto = req.files?.profilePhoto?.[0]; // Extract first file
    const coverPhoto = req.files?.coverPhoto?.[0]; // Extract first file
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    if(bio) {
        user.bio = bio;
    }
    if(gender) {
        user.gender = gender;
    }
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

     await user.save();
     return res.status(200).json({
      message:"profile updated successfully!",
      success:true,
      user
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
    const suggestedUsers = await User.find({ _id: { $nin: [...user.freinds, user._id] } })
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

