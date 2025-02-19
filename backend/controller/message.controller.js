import { Conversation } from "../model/conversation.model.js";
import { Message } from "../model/message.model.js";
import { User } from "../model/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage: message } = req.body;


        if (senderId !== receiverId) {
            let conversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] }
            })
            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [senderId, receiverId]
                })
            }
            const newMessage = await Message.create({
                senderId,
                receiverId,
                message
            })
            if (newMessage) conversation.message.push(newMessage._id);
            await Promise.all([conversation.save(), newMessage.save()])

            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('newMessage', newMessage);
            }

            return res.status(201).json({
                success: true,
                newMessage
            })
        }
        else {
            let conversation = await Conversation.findOne({
                participants: [senderId]
            })

            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [senderId]
                })
            }
            const newMessage = await Message.create({
                senderId,
                receiverId,
                message
            })
            if (newMessage) conversation.message.push(newMessage._id);
            await Promise.all([conversation.save(), newMessage.save()])

            return res.status(201).json({
                success: true,
                newMessage
            })
        }
    } catch (error) {
        console.log(error);
    }
}
export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('message');
        if (!conversation) return res.status(200).json({ success: true, messages: [] });
        return res.status(200).json({ success: true, messages: conversation?.message });

    } catch (error) {
        console.log(error);
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const userId = req.id;
        const messageId = req.params.id;
        const receiver = await Message.findById(messageId)
        const receiverId = receiver.receiverId;
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
                success: false
            });
        }

        if (message.senderId.toString() !== userId) {
            return res.status(403).json({
                message: "You can only delete your own messages",
                success: false
            });
        }

        const deletedmessage = await Message.findById(messageId)
        deletedmessage.isDeleted = true,
            await deletedmessage.save()

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('deletemessage', deletedmessage);
        }

        return res.status(200).json({
            message: "Message deleted",
            success: true

        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
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
                    { senderId: userId, receiverId: targetUser },
                    { senderId: targetUser, receiverId: userId }
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

