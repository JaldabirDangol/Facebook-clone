import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";
import { User } from "../model/user.model.js";

export const sendMessage = async (req, res) => {
  try {
    const userId = req.id;
    const targetUser = req.params.id;
    const { text } = req.body;
    if (!targetUser) {
      return res.status(401).json({
        message: "User doesnot exists !!!",
        success: false,
      });
    }

    if(!text){
        return res.status(400).json({
            message:'message doesnot exists'
        })
    }
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, targetUser] },
    });

    const message = await Message.create({
      message: text,
      senderID: userId,
      receiverID: targetUser,
    });
    
    if (conversation) {
        await conversation.updateOne({
            _id:conversation._id
         },{$push:{message:message._id}});

        await conversation.save();
    }else{
       conversation = await conversation.create({
            participants:[userId,targetUser],
            message:message._id
        })
    }

    const updatedConversation = await Conversation.findById(conversation._id)
    .populate({
      path: "message",
      select: "message",
    });

    return res.status(200).json({
        message:'Message Sent Successfully !',
        success:true,
        conversation:updatedConversation
    })

  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async(req,res)=>{
   
    try {
        const userId = req.id;
        const targetUser = req.params.id;
        const conversation = await Conversation.findOne({
            participants:{$all:[userId,targetUser]}
        })

        if(!conversation){
            return res.status(404).json({
                message:'conversation doesnot exists between users',
                success:false
            })
        }

        await conversation.populate({
            path: "message",
            select: "message createdAt",
            options: { sort: { createdAt: -1 } }
        });
     
        return res.status(200).json({
            message:'conversation found between users!!',
            success:true,
            conversation
        })
    } catch (error) {
        console.log(error)
    }

}

export const deleteMessage = async(req,res)=>{
    try {
        const userId = req.id;
        const messageId = req.params.id;
        const message = await Message.findById(messageId);
       
        if (message.senderID.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized action", success: false });
        } 

            await Promise.all[
                Message.findByIdAndDelete(messageId),
                Conversation.updateOne({
                    $pull:{message:messageId}
                })
            ] 
            return res.status(200).json({
                message:'Message deleted',
                success:true
            })

    } catch (error) {
        console.log(error)
    }
}

export const deleteConversation = async(req,res)=>{
    try {
        const userId = req.id;
        const targetUser = req.params.id;
        let conversation = await Conversation.findOne({
            participants:{$all:[userId,targetUser]}
        })
        if(!conversation){
            return res.status(404).json({
                message:'conversation not found',
                success:false
            })
        }
        await Promise.all([
            Conversation.findByIdAndDelete(conversation._id.toString()),
            Message.deleteMany({
                $or: [
                    { senderID: userId, receiverID: targetUser },
                    { senderID: targetUser, receiverID: userId }
                ]
            })
            
        ])
        return res.status(200).json({
            message:'Conversation deleted successfully',
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
