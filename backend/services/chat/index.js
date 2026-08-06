import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/chat.routes.js";
//import router from "./routes/auth.route.js";
dotenv.config();

const port =process.env.PORT
const app =express()
app.use(express.json())
app.use("/",router)
app.get("/",(req,res)=>{
    res.json({message:"Hello from Chat"})
})

app.listen(port,()=>{
    console.log(`Chat is Started ${port}`)
    connectDB()
})