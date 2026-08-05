import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";


export const crateConversation=async (req,res) => {
    try {
        const userId=req.headers["x-user-id"]
        console.log("userId",userId);
        const conversation=await Conversation.create({
            userId:userId
        })
        return res.status(200).json(conversation)
    } catch (error) {
       return res.status(500).json({message:`Create Conversation error ${error}`})
    }
}

export const getConversation=async (req,res) => {
    try {
        const userId=req.headers["x-user-id"]
        console.log("userId",userId);
        const conversation=await Conversation.find({
            userId:userId
        }).sort({updatedAt:-1})

        return res.status(200).json(conversation)
    } catch (error) {
       return res.status(500).json({message:`get Conversation error ${error}`})
    }
}
export const saveMessage=async (req,res) => {
    try {
        const {conversationId,role,content}=req.body
        const Message=await Message.create({
            
        })
    } catch (error) {
        
    }
}

