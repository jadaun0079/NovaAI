import express from "express"
import { crateConversation, getConversation, getMessage, saveMessage, updateConversation } from "../controllers/chat.controller.js"

 const router =express.Router()

router.get("/create-conversation",crateConversation)
router.get("/get-conversation",getConversation)
router.post("/update-conversation",updateConversation)
router.post("save-message",saveMessage)
router.post("get-message/:conversationId",getMessage)
export default router