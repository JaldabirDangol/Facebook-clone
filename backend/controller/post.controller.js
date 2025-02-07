import { Post } from "../model/post.model";
import { User } from "../model/user.model";
import sharp from "sharp";
import cloudinary from "../utils/cloudinary";
import { Reaction } from "../model/reaction.model";

const addNewPost = async (req, res) => {
  try {
    const userId = req.id;
    const caption = req.body;
    const photo = req.file;
    const user = await User.findById(userId);

    if(!caption && !photo){
        return res.status(404).json({
            message:'image and caption not found',
            success:false
        })
    }

    const optimizedBuffer = await sharp(photo)
      .resize(800)
      .jpeg({ quality: 80 })
      .toBuffer();
    const fileuri = `data:image/jpeg;base64,${optimizedBuffer.toString(
      "base64"
    )}`;
    let cloudResponse = await cloudinary.uploader.upload(fileuri);

    const post = await Post.create({
      caption,
      photo: cloudResponse.secure_url,
      author: userId,
    });

    if(post){
        user.posts.push(post._id)
        await post.populate({
            path:'author',
            select:'username profilePicture'
        })
        await user.save();
    }
   
    return res.status(200).json({
        message:'New post Created !!!',
        success:true,
        post
    })

  } catch (error) {
    console.log(error);
  }
};

export const getAllPost = async (req,res)=>{
    try {
        const post = await Post.find();

        if(post){
           await post.populate([{
                path:'author',
                select:'username profilePicture'
            },
            {
                path:'comment reaction',
                populate:{
                    path:'author',
                    select:'username profilePicture'
                }
            },
           
        ])
        }
        return res.status(200).json({
            message:'Watch feed',
            success:true,
            post
        })
    } catch (error) {
        console.log(error)
    }
}

export const postReaction = async (req, res) => {
        try {
            const userId = req.id;
            const postId = req.params.id;
            const { Rtype } = req.body;
    
            // Validate reaction type
            const validReactions = ["like", "love", "haha", "care", "sad", "angry"];
            if (!validReactions.includes(Rtype)) {
                return res.status(400).json({
                    message: "Invalid reaction type!",
                    success: false
                });
            }
    
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({
                    message: "Post not found!",
                    success: false
                });
            }
    
            // Check if user already reacted to the post
            const existingReaction = await Reaction.findOne({ author: userId, post: postId });
    
            if (existingReaction) {
                if (existingReaction.type === Rtype) {
                    // If the same reaction type exists, remove the reaction (toggle off)
                    await existingReaction.deleteOne();
                    await Post.updateOne(
                        { _id: postId },
                        { $pull: { reaction: existingReaction._id } }
                    );
    
                    return res.status(200).json({
                        message: "Reaction removed!",
                        success: true
                    });
                } else {
                    // Update existing reaction type
                    existingReaction.type = Rtype;
                    await existingReaction.save();
    
                    return res.status(200).json({
                        message: "Reaction updated!",
                        success: true
                    });
                }
            }
    
            // If no existing reaction, create a new one
            const reaction = new Reaction({
                type: Rtype,
                author: userId,
                post: postId
            });
    
            await reaction.save();
    
            // Add the reaction to the post
            await Post.updateOne(
                { _id: postId },
                { $addToSet: { reaction: reaction._id } }
            );
        
            reaction.populate({
                path:'author',
                select:'username profilePicture'
            })
            return res.status(201).json({
                message: "Reaction added!",
                success: true,
                reaction
            });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Internal server error",
                success: false
            });
        }
    };

export const addComment = async(req,res)=>{
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        const {text} = req.body;

        if(!text){
            return res.status(403).json({
                message:'no text in comment send some'
            })
        }
        const comment = await Comment.create({
               author:userId,
               text:text,
               post:postId
        })
        comment.populate({
            path:'author',
            select:'username profilePicture'
        })

     await post.comment.push(comment._id);
     await post.save();

      return res.status(200).json({
        message:'Comment is created successfully',
        success:true,
        comment
      })

    } catch (error) {
        console.log(error)
    }
}    

export const getCommentOfPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post:postId})
       .populate({
            path:'author',
            select:'username profilePicture'
        })

        if(comments.length === 0){
            return res.status(404).json({
            message:"no message found",
            success:false
            })
        }

        return res.status(200).json({
            message:'comments found',
            success:true,
            comments
        })
    } catch (error) {
        console.log(error)
    }
}

//.