import mongoose from "mongoose"
import dotenv from "dotenv";
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("DB CONNECTED ");
    } catch (error) {
        console.log(process.env.MONGODB_URI);
        console.error("DB ERROR:", error);
    
    }
};
export default connectDB;