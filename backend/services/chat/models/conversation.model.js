import mongoose from "mongoose";

const conversationSchema=new mongoose.Schema({
    tittle:{
        type:String,
        default:"New Chat"
    },
    userId:{
        type:String
    }
},{
    timestamps:true
})
const Conversation=mongoose.model("Converstion",conversationSchema)
export default Conversation;