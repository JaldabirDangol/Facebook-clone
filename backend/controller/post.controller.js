import { Post } from "../model/post.model.js";
import { User } from "../model/user.model.js";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Reaction } from "../model/reaction.model.js";
import { Comment } from "../model/comment.model.js";
import { getReceiverSocketId ,io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const userId = req.id;
    const { caption, visibility } = req.body;
    const photo = req.file;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (!caption && !photo) {
      return res.status(404).json({
        message: "image and caption not found",
        success: false,
      });
    }

    const optimizedBuffer = await sharp(photo.buffer)
      .resize(800)
      .jpeg({ quality: 80 })
      .toBuffer();
    const fileuri = `data:image/jpeg;base64,${optimizedBuffer.toString(
      "base64"
    )}`;
    let cloudResponse = await cloudinary.uploader.upload(fileuri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: userId,
      visibility: visibility || "public",
    });

    if (post) {
      user.posts.push(post._id);
      await post.populate({
        path: "author",
        select: "username profilePicture",
      });
      await user.save();
    }

    return res.status(200).json({
      message: "New post Created !!!",
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId);
    const post = await Post.find({
      $or: [
        { visibility: "public" },
        {
          visibility: "freinds",
          author: { $in: user.freinds },
        },
        {
          author: userId,
        },
      ],
    })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "author",
          select: "username profilePicture",
        },
        {
          path: "comment",
          populate: {
            path: "author",
            select: "username profilePicture",
          },
        },
        {
          path: "reaction",
          populate: {
            path: "author",
            select: "username profilePicture",
          },
        },
        {
          path: "issharedpost",
          populate: {
            path: "author",
            select: "username profilePicture",
          },
        },
      ]);

    return res.status(200).json({
      message: "Watch feed",
      success: true,
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

export const postReaction = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const { Rtype } = req.body;

    const validReactions = ["like", "love", "haha", "wow", "sad", "angry"];
    if (!validReactions.includes(Rtype)) {
      return res.status(400).json({
        message: "Invalid reaction type!",
        success: false,
      });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found!",
        success: false,
      });
    }
    const existingReaction = await Reaction.findOne({
      author: userId,
      post: postId,
    });

    if (existingReaction) {
      if (existingReaction.reaction === Rtype) {
      
        await Post.updateOne(
            { _id: postId },
            { $pull: { reaction: existingReaction._id } }
          );
          const exId = existingReaction._id;
        await existingReaction.deleteOne();
       
        const postOwnerSocketId = post.author !== userId ? getReceiverSocketId(post.author) : null;
        if (postOwnerSocketId) io.to(postOwnerSocketId).emit("notification", {
            exId,
            postId,
            userId,
            removed:true
        });

        return res.status(200).json({
          message: "Reaction removed!",
          success: true,
        });
      } else {
        existingReaction.reaction = Rtype;
        existingReaction.populate({
          path: "author",
          select: "username profilePicture",
        });

        await existingReaction.save();

        const postOwnerId = post.author.toString();
        if (postOwnerId !== userId) {
          const postOwnerSocketId = getReceiverSocketId(postOwnerId);
          io.to(postOwnerSocketId).emit("notification", existingReaction);
        }
        return res.status(200).json({
          message: "Reaction updated!",
          success: true,
          reaction: existingReaction,
        });
      }
    }
    const reaction = new Reaction({
      reaction: Rtype,
      author: userId,
      post: postId,
    });

    await Post.updateOne(
      { _id: postId },
      { $addToSet: { reaction: reaction._id } }
    );

    await reaction.populate({
      path: "author",
      select: "username profilePicture",
    });
    await reaction.save();
    let postOwnerId = post.author.toString();
    if (postOwnerId !== userId) {
      const  postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notification", reaction);
    }
    return res.status(201).json({
      message: "Reaction added!",
      success: true,
      reaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const { text } = req.body;

    if (!text) {
      return res.status(403).json({
        message: "no text in comment send some",
      });
    }
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }
    const comment = await Comment.create({
      author: userId,
      text: text,
      post: postId,
    });
    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comment.push(comment._id);
    await post.save();

    const postOwnerSocketId = post.author !== userId ? getReceiverSocketId(post.author) : null
    io.to(postOwnerSocketId).emit('notification',comment)

    return res.status(200).json({
      message: "Comment is created successfully",
      success: true,
      comment,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCommentOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username profilePicture",
    });

    if (comments.length === 0) {
      return res.status(404).json({
        message: "no message found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "comments found",
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const user = await User.findById(userId);
    if (!post) {
      return res.status(401).json({
        message: "post does not exists",
        success: false,
      });
    }

    if (userId !== post.author.toString()) {
      return res.status(403).json({
        message: "you are not the author of post ",
        success: false,
      });
    }

    await Promise.all([
      Post.findByIdAndDelete(postId),
      Comment.deleteMany({ post: postId }),
      Reaction.deleteMany({ post: postId }),
    ]);

    user.posts = user.posts.filter((post) => post._id !== postId);
    await user.save();

    return res.status(201).json({
      message: "post has been deleted !!!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const savedPost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    // Find user and post
    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    let updatedUser;

    if (user.saved.includes(postId)) {
      await User.findByIdAndUpdate(userId, { $pull: { saved: postId } });

      updatedUser = await User.findById(userId).populate({
        path: "saved",
        populate: [
          { path: "author", select: "username profilePicture" },
          {
            path: "comment",
            populate: { path: "author", select: "username profilePicture" },
          },
          {
            path: "reaction",
            populate: { path: "author", select: "username profilePicture" },
          },
        ],
      });

      return res.status(200).json({
        message: "Post removed from saved",
        success: true,
        savedPost: updatedUser.saved,
      });
    } else {
      await User.findByIdAndUpdate(userId, { $addToSet: { saved: postId } });

      // Fetch updated user with populated saved posts
      updatedUser = await User.findById(userId).populate({
        path: "saved",
        populate: [
          { path: "author", select: "username profilePicture" },
          {
            path: "comment",
            populate: { path: "author", select: "username profilePicture" },
          },
          {
            path: "reaction",
            populate: { path: "author", select: "username profilePicture" },
          },
        ],
      });

      return res.status(200).json({
        message: "Post added to saved",
        success: true,
        savedPost: updatedUser.saved,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const sharePost = async (req, res) => {
  try {
    const userId = req.id;
    const postId = req.params.id;
    const { caption, visibility } = req.body;
    let user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        message: "post not found",
        success: true,
      });
    }

    const newShared = await Post.create({
      author: userId,
      issharedpost: postId,
      caption: caption || "",
      visibility: visibility,
    });

    const newpost = await Post.findById(newShared._id).populate([
      {
        path: "author",
        select: "username profilePicture",
      },
      {
        path: "issharedpost",
        populate: {
          path: "author",
          select: "username profilePicture caption image",
        },
      },
    ]);
    await user.updateOne({ $addToSet: { posts: newShared._id } });
    await user.save();

    const postOwnerSocketId = userId !== post.author ? getReceiverSocketId(post.author) : null
    io.to(postOwnerSocketId).emit('notification',newpost)

    return res.status(200).json({
      message: "Post shared successfully!!",
      success: true,
      sharedpost: newpost,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSavedPost = async(req,res)=>{
  try {
    const userId = req.id;
    const user = await User.findById(userId)
  
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    
    if(user.saved.length > 0){
      const userPost = await Post.find({_id:{$in:[...user.saved]}})
      .populate({
        path:"author",
        select:'username profilePicture'
      })

      return res.status(200).json({
        message:'saved post found ',
        success:true,
        userPost
      })
    }
  
    return res.status(404).json({
      message:'user donot have any saved post ',
      success:false
    })

  } catch (error) {
    console.log(error)
  }
}